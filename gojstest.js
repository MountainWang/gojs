/**
 * Created by Mountain on 2016/9/7.
 */
var selected;

function test() {



    var defaultZoom = 15;
    var mapOrigin = [37.559774, 121.393801];
    myLeafletMap = L.map("map", {}).setView(mapOrigin, defaultZoom);
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw", {
        maxZoom: 20,
        id: "mapbox.streets"
    }).addTo(myLeafletMap);
    myLeafletMap.on("move", function (e) {
        myUpdatingGoJS = true;
        myDiagram.updateAllTargetBindings("latlong"); // Without virtualization this can be slow if there are many nodes
        myDiagram.redraw(); // At the expense of performance, this will make sure GoJS positions are updated immediately
        myUpdatingGoJS = false;
    });

    var myUpdatingGoJS = false; // prevent modifying data.latlong properties upon Leaflet "move" events

    $ = go.GraphObject.make;
    myDiagram =
        $(go.Diagram, "myDiagramDiv", {
            "animationManager.isEnabled": false,
            scrollMode: go.Diagram.InfiniteScroll,
            allowZoom: false,
            allowHorizontalScroll: false,
            allowVerticalScroll: false,
            hasHorizontalScrollbar: false,
            hasVerticalScrollbar: false,
            initialPosition: new go.Point(0, 0),
            padding: 0,
            "toolManager.hoverDelay": 100 // how quickly tooltips are shown
                // "grid.visible": true,
                // allowDrop: true, // accept drops from palette
                // allowLink: false, // no user-drawn links
                // commandHandler: new DrawCommandHandler(), // defined in DrawCommandHandler.js
                // // default to having arrow keys move selected nodes
                // "commandHandler.arrowKeyBehavior": "move",
                // "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, // mouse wheel zooms instead of scrolls
                // // allow Ctrl-G to call groupSelection()
                // "commandHandler.archetypeGroupData": {
                //     text: "Group",
                //     isGroup: true
                // },
                //
                // rotatingTool: new RotateMultipleTool(), // defined in RotateMultipleTool.js
                //
                // resizingTool: new ResizeMultipleTool(), // defined in ResizeMultipleTool.js
                //
                // draggingTool: new GuidedDraggingTool(), // defined in GuidedDraggingTool.js
                // "draggingTool.horizontalGuidelineColor": "blue",
                // "draggingTool.verticalGuidelineColor": "blue",
                // "draggingTool.centerGuidelineColor": "green",
                // "draggingTool.guidelineWidth": 1,
                //
                // "draggingTool.isGridSnapEnabled": true,
                // "resizingTool.isGridSnapEnabled": true,
                // notice whenever the selection may have changed
                //            "ChangedSelection": enableAll, // defined below, to enable/disable commands
                //
                //            // notice when the Paste command may need to be reenabled
                //            "ClipboardChanged": enableAll,
                //
                //            // notice when an object has been dropped from the palette
                //            "ExternalObjectsDropped": function (e) {
                //                var nodex;
                //                e.subject.each(function (node) {
                //                    console.log(node.data.key);
                //                    if (node.data.key == 'car')
                //                        nodex = node;
                //                });
                //                if (nodex) {
                //                    myDiagram.remove(nodex);
                //                    //var cod = '69';
                //                    //var cco = myDiagram.findNodeForKey('016903');
                //                    //var coo1 = myDiagram.findNodeForKey('017103');
                //                    //var ll  = (go.Point.parse(cco.data.loc).x + go.Point.parse(coo1.data.loc).x) / 2;
                //                    //var ly  = (go.Point.parse(cco.data.loc).y + go.Point.parse(coo1.data.loc).y) / 2;
                //                    //var loc = go.Point.stringify(new go.Point(ll,ly))
                //                    var ops1 = {
                //                        key: "016803",
                //                        color: "red",
                //                        width: 40
                //                    };
                //                    var a = new createObj();
                //                    a.cntr(ops1);
                //
                //                    //alert(go.Point.parse("121 20").x);
                //                    //myDiagram.remove(cco);
                //                    //cco.data.loc="100 200";
                //                    // myDiagram.model.setDataProperty(cco.data, "color", "red");
                //                    //console.log(cco);
                //                }
                //            }

        });

    // myDiagram.nodeTemplate = //节点模板
    //     $(go.Node, "Auto", //节点内元素排列方法
    //         $(go.Shape, "Rectangle", { //第一个元素，一个图形，类别是矩形
    //             fill: "white" //填充颜色 白色
    //         }), $(go.TextBlock, //第二个元素，字块
    //             new go.Binding("text", "key")) //数据绑定
    //     );

    //var W_geometry = go.Geometry.parse("F M0,30 L12,30 L12,33 L17,38 L23,38 L28,33 L28,30 L62,30 L62,33 L67,38 L73,38 L78,33 L78,30 L100,30 L100,10 L90,0 L70,0 L70,20 L0,20 Z", false);




    function LeafletTool() {
        go.Tool.call(this);
        this.name = "Leaflet";
    }
    go.Diagram.inherit(LeafletTool, go.Tool);

    LeafletTool.prototype.canStart = function () {
        // Only start if we are not over any GoJS object
        if (myDiagram.findObjectAt(
                myDiagram.lastInput.documentPoint,
                function (x) {
                    return x.part;
                },
                function (x) {
                    return x.canSelect();
                })) return false;
        return true;
    };

    LeafletTool.prototype.doMouseDown = function () {
        if (!this.isActive) {
            this.doActivate();
        }
        myDiagram.lastInput.bubbles = true;
    };

    LeafletTool.prototype.doMouseWheel = function() {
        console.log('tada');
    };
    
    LeafletTool.prototype.doMouseMove = function () {
        myDiagram.lastInput.bubbles = true;
    };

    LeafletTool.prototype.doMouseUp = function () {
        if (this.isActive) {
            this.standardMouseSelect();
            this.standardMouseClick();
        }
        myDiagram.lastInput.bubbles = true;
        this.stopTool();
    };
    myDiagram.toolManager.mouseDownTools.insertAt(0, new LeafletTool());


    myDiagram.nodeTemplate =
        $(go.Node, "Auto",{
            locationSpot: go.Spot.Center
            },
            $(go.Shape, "Circle",{
                    name: "SHAPE",
                    geometryString: "F1 M0 0 L20 0 20 20 0 20 z",
                    fill: "rgb(130,130,130)",
                    click: function (e, node) {
                        var yanse = document.getElementById("yanse").value;
                        // alert("这是一个动态添加的alert方法");
                        //                        alert(node.fill);
                        //                        alert(node.key);
                        console.log(yanse);
                        node.fill = yanse;
                        selected = node.key;
                    }

                },
                new go.Binding("fill", "color"),
                new go.Binding("key", "key"),
                new go.Binding("geometryString", "geoString"),
                new go.Binding("click", "onclick"),
                new go.Binding("visible","visible")

            ),
            new go.Binding("location", "latlong", function (data) {
                var point = myLeafletMap.latLngToContainerPoint(data);
                return new go.Point(point.x, point.y);
            }).makeTwoWay(function (pt, data) {
                if (myUpdatingGoJS) {
                    return data.latlong; // no-op
                } else {
                    var ll = (myLeafletMap.containerPointToLatLng([pt.x, pt.y]));
                    return [ll.lat, ll.lng];
                }
            })
        );





    //    myDiagram.groupTemplate =
    //        $(go.Node,
    //            "Spot", {
    //                localtionSpot: go.Spot.TopLeft,
    //                movable: false,
    //                deletable: false
    //            },
    //            new go.Binding("zOrder"),
    //            new go.Binding("angle").makeTwoWay(),
    //            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    //            $(go.Shape,{
    //                figure:"Rectangle",
    //                fill:"white",
    //                width:20,
    //                height:10
    //                }
    //
    //            )
    //        );






}

function add1() {
    var head = "M0,10 L0,190 L140,190 L140,10 Z";
    var windows = "M10,20 L10,90 L40,90 L40,20 Z M10,180, L10,110 L40,110 L40,180 Z M50,10 L50,190 M0,100 L50,100";
    var wheel_L1 = "M10,190 L10,200 L60,200 L60,190 Z";
    var wheel_L2 = "M90,190 L90,200 L140,200 L140,190 Z";
    var wheel_L3 = "M400,0 L400,10 L450,10 L450,0 Z";
    var wheel_L4 = "M480,0 L480,10 L530,10 L530,0 Z";
    var wheel_R1 = "M10,0 L10,10 L60,10 L60,0 Z";
    var wheel_R2 = "M90,0 L90,10 L140,10 L140,0 Z";
    var wheel_R3 = "M400,190 L400,200 L450,200 L450,190 Z";
    var wheel_R4 = "M480,190 L480,200 L530,200 L530,190 Z";
    var body = "M170,10 L170,190 L570,190 L570,10 Z";
    var connect = "M 140,95 L170,95 L170,85 L140,85 Z M140,105 L140,115 L170,115 L170,105 Z";
    var cent = "M200,15 L200,185 L540,185 L540,15 Z";
    var total = "F M0,1 L0,19 L14,19 L14,1 Z M1,2 L1,9 L4,9 L4,2 Z M1,18, L1,11 L4,11 L4,18 Z M5,1 L5,19 M0,10 L5,10 M1,19 L1,20 L6,20 L6,19 Z M9,19 L9,20 L14,20 L14,19 Z M40,0 L40,1 L45,1 L45,0 Z M48,0 L48,1 L53,1 L53,0 Z M1,0 L1,1 L6,1 L6,0 Z M9,0 L9,1 L14,1 L14,0 Z M40,19 L40,20 L45,20 L45,19 Z M48,19 L48,20 L53,20 L53,19 Z M17,1 L17,19 L57,19 L57,1 Z M 14,9 L17,9 L17,8 L14,8 Z M14,10 L14,11 L17,11 L17,10 Z M20,2 L20,18 L54,18 L54,2 Z";
    var myNodeData = {
        color: "blue",
        key: "test",
        latlong: [37.559774, 121.393801],
        geoString: total,
        onclick: function (e, node) {
            var yanse = document.getElementById("yanse").value;
            // alert("这是一个动态添加的alert方法");
            //                        alert(node.fill);
            //                        alert(node.key);
            console.log(yanse);
            node.fill = yanse;
            selected = node.key;
        }
    };
    myDiagram.model.addNodeData(myNodeData);
}

function add2() {
    var myNodeData = {
        color: "lightblue",
        key: "test2",
        latlong: [37.559774, 121.393802],
        geoString: "F M625.827281 480.487676l-38.002634 0 0-33.282408c0-21.349389-7.911195-41.422389-22.276576-56.522295C551.170649 375.571025 532.085042 367.262465 511.759172 367.262465s-39.423518 8.308561-53.788899 23.408467-22.276576 35.172907-22.276576 56.522295l0 33.282408-38.002634 0c-3.516087 0-6.357855 2.998307-6.357855 6.682973l0 186.497084c0 3.696707 2.841769 6.682973 6.357855 6.682973l228.124177 0c3.504045 0 6.345814-2.986265 6.345814-6.682973L632.161054 487.170649C632.173095 483.473942 629.331326 480.487676 625.827281 480.487676L625.827281 480.487676 625.827281 480.487676zM448.409407 447.205268c0-17.785136 6.586642-34.51063 18.555786-47.081844 11.969144-12.571214 27.875823-19.495014 44.793979-19.495014s32.836877 6.923801 44.806021 19.495014c11.945061 12.571214 18.543744 29.296707 18.543744 47.081844l0 33.282408L448.409407 480.487676 448.409407 447.205268 448.409407 447.205268 448.409407 447.205268 448.409407 447.205268zM619.457385 666.98476 404.06096 666.98476 404.06096 493.853622l215.408467 0L619.469426 666.98476 619.457385 666.98476 619.457385 666.98476zM530.760489 567.101411c0 5.888241-2.468485 11.138288-6.333772 14.798871l0 18.495579c0 7.357291-5.671496 13.31778-12.667545 13.31778s-12.667545-5.960489-12.667545-13.31778l0-18.495579c-3.865287-3.660583-6.333772-8.898589-6.333772-14.798871 0-11.041957 8.513264-19.988711 19.013358-19.988711S530.760489 556.059454 530.760489 567.101411L530.760489 567.101411 530.760489 567.101411zM530.760489 567.101411",
        onclick: function (e, node) {
            var yanse = document.getElementById("yanse").value;
            // alert("这是一个动态添加的alert方法");
            //                        alert(node.fill);
            //                        alert(node.key);
            console.log(yanse);
            node.fill = yanse;
            selected = node.key;
        }
    };
    myDiagram.model.addNodeData(myNodeData);

}

function change() {
    var node = myDiagram.model.findNodeDataForKey(selected);
    console.log(node);
    myDiagram.model.setDataProperty(node, 'color', "red");
}

function hide() {
    var node = myDiagram.model.findNodeDataForKey(selected);
    //console.log(node);
    myDiagram.model.setDataProperty(node, 'visible', "false");
}
function show() {
    var node = myDiagram.model.findNodeDataForKey(selected);
    //console.log(node);
    myDiagram.model.setDataProperty(node, 'visible', "true");
}
function showinfo() {
    var node = myDiagram.model.findNodeDataForKey(selected);
    console.log(node);
    //node.Visible = false;
}

function zoom(){
    var zoomlevel=myLeafletMap.getZoom();
    alert(zoomlevel);
}

function checkbay(){
    var gos = document.getElementById("myDiagramDiv");
    if( gos.style.display=='none') {
        gos.style.display = 'block';

        //map.setView(new L.LatLng(22.68656, 113.65671),18);
    }
    else
        gos.style.display = 'none';
}