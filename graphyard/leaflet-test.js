  function init() {
    /*
      Leaflet init
    */
    var defaultZoom = 6;
    var mapOrigin = [48.876569, 2.359017];
    myLeafletMap = L.map("map", { }).setView(mapOrigin, defaultZoom);
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw", {
      maxZoom: 20,
      id: "mapbox.streets"
    }).addTo(myLeafletMap);

    myLeafletMap.on("move", function(e) {
      myUpdatingGoJS = true;
      myDiagram.updateAllTargetBindings("latlong"); // Without virtualization this can be slow if there are many nodes
      myDiagram.redraw(); // At the expense of performance, this will make sure GoJS positions are updated immediately
      myUpdatingGoJS = false;
    });

    var myUpdatingGoJS = false;  // prevent modifying data.latlong properties upon Leaflet "move" events

    /*
      GoJS init
    */
    var $ = go.GraphObject.make;
    myDiagram = $(go.Diagram, "myDiagramDiv",
                  {
                    "animationManager.isEnabled": false,
                    scrollMode: go.Diagram.InfiniteScroll,
                    allowZoom: false,
                    allowHorizontalScroll: false,
                    allowVerticalScroll: false,
                    hasHorizontalScrollbar: false,
                    hasVerticalScrollbar: false,
                    initialPosition: new go.Point(0, 0),
                    padding: 0,
                    "toolManager.hoverDelay": 100  // how quickly tooltips are shown
                  });

    var toolTipTemplate =
      $(go.Adornment, "Auto",
        $(go.Shape, { fill: "#FFFFCC" }),
        $(go.TextBlock, { margin: 4 },
          new go.Binding("text", "", function(d) {
            return d.key + "\nlocation: [" + d.latlong.join(", ") + "]"
          }))
      );

    // the node template describes how each Node should be constructed
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        {
          toolTip: toolTipTemplate,
          locationSpot: go.Spot.Center
        },
        $(go.Shape, "Circle",
          {
            fill: "rgba(0, 255, 0, .4)",
            stroke: "#082D47",
            width: 7,
            height: 7,
            strokeWidth: 1
          }),
        // A two-way data binding with an Array of latitude,longitude numbers.
        // Unfortunately the Leaflet conversion functions are not inverses of each other,
        // so we have to explicitly avoid updating the source data Array
        // when myUpdatingGoJS is true; otherwise there would be accumulating errors.
        new go.Binding("location", "latlong", function(data) {
          var point = myLeafletMap.latLngToContainerPoint(data);
          return new go.Point(point.x, point.y);
        }).makeTwoWay(function(pt, data) {
          if (myUpdatingGoJS) {
            return data.latlong; // no-op
          } else {
            var ll = (myLeafletMap.containerPointToLatLng([pt.x, pt.y]));
            return [ll.lat, ll.lng];
          }
        })
      );

    myDiagram.linkTemplate =
      $(go.Link,
        {
          layerName: "Background",
          curve: go.Link.Bezier,
          curviness: 2
        },
        $(go.Shape, { strokeWidth: 3, stroke: "rgba(100,100,255,.7)" })
      );

    // Don't do normal GoJS panning.
    // Instead, this tool will pass the events along to Leaflet
    // as long as the mouseDown does not start on a GoJS node.
    function LeafletTool() {
      go.Tool.call(this);
      this.name = "Leaflet";
    }
    go.Diagram.inherit(LeafletTool, go.Tool);

    LeafletTool.prototype.canStart = function() {
      // Only start if we are not over any GoJS object
      if (myDiagram.findObjectAt(
            myDiagram.lastInput.documentPoint,
            function(x) { return x.part; },
            function(x) { return x.canSelect(); })) return false;
      return true;
    };

    LeafletTool.prototype.doMouseDown = function() {
      if (!this.isActive) {
        this.doActivate();
      }
      myDiagram.lastInput.bubbles = true;
    };

    LeafletTool.prototype.doMouseMove = function() {
      myDiagram.lastInput.bubbles = true;
    };

    LeafletTool.prototype.doMouseUp = function() {
      if (this.isActive) {
        this.standardMouseSelect();
        this.standardMouseClick();
      }
      myDiagram.lastInput.bubbles = true;
      this.stopTool();
    };
    // end LeafletTool

    // install the LeafletTool so that it can pass all non-GoJS-related events on to Leaflet
    myDiagram.toolManager.mouseDownTools.insertAt(0, new LeafletTool());


    // create the model data that will be represented by Nodes and Links
    myDiagram.model = new go.GraphLinksModel(
    [
      // France
      { key: "Paris", latlong: [48.876569, 2.359017] },
      { key: "Brest", latlong: [48.387778, -4.479921] },
      { key: "Rennes", latlong: [48.103375, -1.672809] },
      { key: "Le Mans", latlong: [47.995562, 0.192413] },
      { key: "Nantes", latlong: [47.217579, -1.541839] },
      { key: "Tours", latlong: [47.388502, 0.694500] },
      { key: "Le Havre", latlong: [49.492755, 0.125278] },
      { key: "Rouen", latlong: [49.449031, 1.094128] },
      { key: "Lille", latlong: [50.636379, 3.070620] },

      // Belgium
      { key: "Brussels", latlong: [50.836271, 4.333963] },
      { key: "Antwerp", latlong: [51.217495, 4.421204] },
      { key: "Liege", latlong: [50.624168, 5.566008] },

      // UK
      { key: "London", latlong: [51.531132, -0.125132] },
      { key: "Bristol", latlong: [51.449541, -2.581118] },
      { key: "Birmingham", latlong: [52.477405, -1.898494] },
      { key: "Liverpool", latlong: [53.408396, -2.978809] },
      { key: "Manchester", latlong: [53.476346, -2.229651] },
      { key: "Leeds", latlong: [53.795480, -1.548345] },
      { key: "Glasgow", latlong: [55.863287, -4.250989] },
    ],
    [
      { from: "Brest", to: "Rennes" },
      { from: "Rennes", to: "Le Mans" },
      { from: "Nantes", to: "Le Mans" },
      { from: "Le Mans", to: "Paris" },
      { from: "Tours", to: "Paris" },
      { from: "Le Havre", to: "Rouen" },
      { from: "Rouen", to: "Paris" },
      { from: "Lille", to: "Paris" },
      { from: "London", to: "Lille" },

      { from: "Lille", to: "Brussels" },
      { from: "Brussels", to: "Antwerp" },
      { from: "Brussels", to: "Liege" },

      { from: "Bristol", to: "London" },
      { from: "Birmingham", to: "London" },
      { from: "Leeds", to: "London" },
      { from: "Liverpool", to: "Birmingham" },
      { from: "Manchester", to: "Liverpool" },
      { from: "Manchester", to: "Leeds" },
      { from: "Glasgow", to: "Manchester" },
      { from: "Glasgow", to: "Leeds" },
    ]);
  } // end init