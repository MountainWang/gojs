/**
 * Created by kingser on 2016/8/31.
 */
// hides remove HTML Element
// hides open HTML Element
function init() {
    
 
    
    if (!checkLocalStorage()) {
        var currentFile = document.getElementById("currentFile");
        currentFile.textContent = "Sorry! No web storage support. \n If you're using Internet Explorer, you must load the page from a server for local storage to work.";
    }
    var openDocument = document.getElementById("openDocument");
    openDocument.style.visibility = "hidden";
    var removeDocument = document.getElementById("removeDocument");

    removeDocument.style.visibility = "hidden";

    /*
      Leaflet init
    */
    var defaultZoom = 15;
    var mapOrigin = [37.559487, 121.393241];
    myLeafletMap = L.map("map", { }).setView(mapOrigin, defaultZoom);
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibW91bnRhaW53YW5nIiwiYSI6ImNpdGpveHJnOTAwMzUyb3BkZDY2N2lpcm0ifQ.GL-YPNAzV28SvAeo7T9C6A", {
      maxZoom: 18,
      id: "mapbox.streets"
    }).addTo(myLeafletMap);

    myLeafletMap.on("move", function(e) {
      myUpdatingGoJS = true;
      myDiagram.updateAllTargetBindings("loc"); // Without virtualization this can be slow if there are many nodes
      myDiagram.redraw(); // At the expense of performance, this will make sure GoJS positions are updated immediately
      myUpdatingGoJS = false;
    });

    var myUpdatingGoJS = false;  // prevent modifying data.latlong properties upon Leaflet "move" events
    
    /*
      GoJS init
    */    
    myDiagram =
        $AJ(go.Diagram, "myDiagramDiv",
            {
                "animationManager.isEnabled": false,
                // scrollMode: go.Diagram.InfiniteScroll,
                allowZoom: false,
                allowHorizontalScroll: false,
                allowVerticalScroll: false,
                hasHorizontalScrollbar: false,
                hasVerticalScrollbar: false,
                initialPosition: new go.Point(0, 0),
                padding: 0,
                "toolManager.hoverDelay": 100,  // how quickly tooltips are shown
                "grid.visible": true,
                allowDrop: true,  // accept drops from palette
                allowLink: false,  // no user-drawn links
                commandHandler: new DrawCommandHandler(),  // defined in DrawCommandHandler.js
                // default to having arrow keys move selected nodes
                "commandHandler.arrowKeyBehavior": "move",
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom , // mouse wheel zooms instead of scrolls
                // allow Ctrl-G to call groupSelection()
                "commandHandler.archetypeGroupData": { text: "Group", isGroup: true },

                rotatingTool: new RotateMultipleTool(),  // defined in RotateMultipleTool.js

                resizingTool: new ResizeMultipleTool(),  // defined in ResizeMultipleTool.js
                "ChangedSelection": enableAll,  // defined below, to enable/disable commands

                // notice when the Paste command may need to be reenabled
                "ClipboardChanged": enableAll,

                // notice when an object has been dropped from the palette
                "ExternalObjectsDropped": function(e) {
                    var nodex;
                    e.subject.each(function (node) {
                        console.log(node.data.key);
                        if (node.data.key == 'car')
                            nodex = node;
                    });
                    if (nodex) {
                        myDiagram.remove(nodex);
                        var ops1 = {key:"016803",color:"red",width:40};
                        var a = new createObj();
                        a.cntr(ops1);
                    }
                }

            });

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

    // change the title to indicate that the diagram has been modified
    myDiagram.addDiagramListener("Modified", function(e) {
        var currentFile = document.getElementById("currentFile");
        var idx = currentFile.textContent.indexOf("*");
        if (myDiagram.isModified) {
            if (idx < 0) currentFile.textContent = currentFile.textContent + "*";
        } else {
            if (idx >= 0) currentFile.textContent = currentFile.textContent.substr(0, idx);
        }
    });
//the Layers

    myDiagram.addLayer(yardlay);
    myDiagram.addLayer(cntrlay);
 // the Template
    myDiagram.nodeTemplate= myPaletteTp;
    myDiagram.groupTemplateMap.add("yardGroup",groupTp);
    myDiagram.nodeTemplateMap.add('yardTitle',nodeTpYardTitle);
    myDiagram.nodeTemplateMap.add('yardShape',nodeTpYardShape);
    myDiagram.nodeTemplateMap.add('yardText',nodeTpYardText);
    myDiagram.nodeTemplateMap.add('cntr',nodeTpCntr);
    myDiagram.nodeTemplate.contextMenu =contextTp;


    // default structures and furniture
    myPalette =
        $AJ(go.Palette, "myPaletteDiv",
            {
                nodeTemplate:myDiagram.nodeTemplate,  // shared with the main Diagram
                "contextMenuTool.isEnabled": false,  // but disable context menus
                allowZoom: false,
                //allowDragOut:false,
                layout: $AJ(go.GridLayout, { cellSize: new go.Size(1, 1), spacing: new go.Size(5, 5) }),
                // initialize the Palette with a few furniture and structure nodes
                model: $AJ(go.GraphLinksModel,
                    {
                        nodeDataArray: [
                            {
                                key: "yardtp",
                                //geo: "F1 M0 0 L5,0 5,40 0,40 0,0z x M5,0 a40,40 0 0,1 40,40 ",
                                fig:"InternalStorage",
                                color: "lightgreen"
                            },
                            {
                                key: "car",
                                geo: "F1 M0 0 L30 0 30 30 0 30 z",
                                color: "red"
                            }
                        ]  // end nodeDataArray
                    })  // end model
            });  // end Palette


    // the Overview


    myOverview =
        $AJ(go.Overview, "myOverviewDiv",
            { observed: myDiagram, maxScale: 0.5 });

    // change color of viewport border in Overview
    myOverview.box.elt(0).stroke = "dodgerblue";


    // start off with an empty document
    myDiagram.isModified = false;
    newDocument();
    var ops = {name:"01",text:"yard01",row:8,bay:40,tile:5,rowSeq:"A",baySeq:"L"};

    var a = new createObj();
    a.yard(ops);

    myDiagram.addDiagramListener("ChangedSelection",
        function(e) {
              var newdata = getBay();
              if (newdata.bayno.length > 0)
                  window.open('bay.html?bayno=' + newdata.bayno);
        }
    );

} // end init



