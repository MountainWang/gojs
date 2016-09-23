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

    myDiagram =
        $AJ(go.Diagram, "myDiagramDiv", {
            "grid.visible": true,
            allowDrop: true, // accept drops from palette
            allowLink: false, // no user-drawn links
            commandHandler: new DrawCommandHandler(), // defined in DrawCommandHandler.js
            // default to having arrow keys move selected nodes
            "commandHandler.arrowKeyBehavior": "move",
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, // mouse wheel zooms instead of scrolls
            // allow Ctrl-G to call groupSelection()
            "commandHandler.archetypeGroupData": {
                text: "Group",
                isGroup: true
            },

            rotatingTool: new RotateMultipleTool(), // defined in RotateMultipleTool.js

            resizingTool: new ResizeMultipleTool(), // defined in ResizeMultipleTool.js

            draggingTool: new GuidedDraggingTool(), // defined in GuidedDraggingTool.js
            "draggingTool.horizontalGuidelineColor": "blue",
            "draggingTool.verticalGuidelineColor": "blue",
            "draggingTool.centerGuidelineColor": "green",
            "draggingTool.guidelineWidth": 1,

            "draggingTool.isGridSnapEnabled": true,
            "resizingTool.isGridSnapEnabled": true,
            // notice whenever the selection may have changed
            "ChangedSelection": enableAll, // defined below, to enable/disable commands

            // notice when the Paste command may need to be reenabled
            "ClipboardChanged": enableAll,

            // notice when an object has been dropped from the palette
            "ExternalObjectsDropped": function (e) {
                var nodex;
                e.subject.each(function (node) {
                    console.log(node.data.key);
                    if (node.data.key == 'car')
                        nodex = node;
                });
                if (nodex) {
                    myDiagram.remove(nodex);
                    //var cod = '69';
                    //var cco = myDiagram.findNodeForKey('016903');
                    //var coo1 = myDiagram.findNodeForKey('017103');
                    //var ll  = (go.Point.parse(cco.data.loc).x + go.Point.parse(coo1.data.loc).x) / 2;
                    //var ly  = (go.Point.parse(cco.data.loc).y + go.Point.parse(coo1.data.loc).y) / 2;
                    //var loc = go.Point.stringify(new go.Point(ll,ly))
                    var ops1 = {
                        key: "016803",
                        color: "red",
                        width: 40
                    };
                    var a = new createObj();
                    a.cntr(ops1);

                    //alert(go.Point.parse("121 20").x);
                    //myDiagram.remove(cco);
                    //cco.data.loc="100 200";
                    // myDiagram.model.setDataProperty(cco.data, "color", "red");
                    //console.log(cco);
                }
            }

        });



    // change the title to indicate that the diagram has been modified
    myDiagram.addDiagramListener("Modified", function (e) {
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
    myDiagram.nodeTemplate = myPaletteTp;
    myDiagram.groupTemplateMap.add("yardGroup", groupTp);
    myDiagram.nodeTemplateMap.add('yardTitle', nodeTpYardTitle);
    myDiagram.nodeTemplateMap.add('yardShape', nodeTpYardShape);
    myDiagram.nodeTemplateMap.add('yardText', nodeTpYardText);
    myDiagram.nodeTemplateMap.add('cntr', nodeTpCntr);
    myDiagram.nodeTemplate.contextMenu = contextTp;


    // default structures and furniture
    myPalette =
        $AJ(go.Palette, "myPaletteDiv", {
            nodeTemplate: myDiagram.nodeTemplate, // shared with the main Diagram
            "contextMenuTool.isEnabled": false, // but disable context menus
            allowZoom: false,
            //allowDragOut:false,
            layout: $AJ(go.GridLayout, {
                cellSize: new go.Size(1, 1),
                spacing: new go.Size(5, 5)
            }),
            // initialize the Palette with a few furniture and structure nodes
            model: $AJ(go.GraphLinksModel, {
                    nodeDataArray: [
                            {
                                key: "yardtp",
                                //geo: "F1 M0 0 L5,0 5,40 0,40 0,0z x M5,0 a40,40 0 0,1 40,40 ",
                                fig: "InternalStorage",
                                color: "lightgreen"
                            },
                            {
                                key: "car",
                                geo: "F1 M0 0 L30 0 30 30 0 30 z",
                                color: "red"
                            },
                        
                            {
                                key: "FieldBridge2",
                                geo: "F M13,0 L48,0 L48,140 L13,140 Z M0,13 L60,13 L60,25 L0,25 Z M0,115 L60,115 L60,128 L0,128 Z",
                                color: "lightblue"
                            }

                        ] // end nodeDataArray
                }) // end model
        }); // end Palette
    var car={
        key: "Car",
        geo: "F M0,1 L0,19 L14,19 L14,1 Z M1,2 L1,9 L4,9 L4,2 Z M1,18, L1,11 L4,11 L4,18 Z M5,1 L5,19 M0,10 L5,10 M1,19 L1,20 L6,20 L6,19 Z M9,19 L9,20 L14,20 L14,19 Z M40,0 L40,1 L45,1 L45,0 Z M48,0 L48,1 L53,1 L53,0 Z M1,0 L1,1 L6,1 L6,0 Z M9,0 L9,1 L14,1 L14,0 Z M40,19 L40,20 L45,20 L45,19 Z M48,19 L48,20 L53,20 L53,19 Z M17,1 L17,19 L57,19 L57,1 Z M 14,9 L17,9 L17,8 L14,8 Z M14,10 L14,11 L17,11 L17,10 Z M20,2 L20,18 L54,18 L54,2 Z",
        color: "green"
    };
   // myPalette.model.addNodeData(car);
    var a = new createObj();
    a.car(car);
    

    // the Overview


    myOverview =
        $AJ(go.Overview, "myOverviewDiv", {
            observed: myDiagram,
            maxScale: 0.5
        });

    // change color of viewport border in Overview
    myOverview.box.elt(0).stroke = "dodgerblue";


    // start off with an empty document
    myDiagram.isModified = false;
    newDocument();
    var ops = {
        name: "01",
        text: "yard01",
        row: 8,
        bay: 40,
        tile: 5,
        rowSeq: "A",
        baySeq: "L"
    };
    var ops2 = {
        name: "02",
        text: "yard02",
        row: 8,
        bay: 40,
        tile: 5,
        rowSeq: "A",
        baySeq: "L"
    };

    var a = new createObj();
    a.yard(ops);
    //a.yard(ops2);


} // end init

function add1(w) {


    var myNodeData = {
        fill: "red",
        key: "test",
        geo: "F M0,1 L0,19 L14,19 L14,1 Z M1,2 L1,9 L4,9 L4,2 Z M1,18, L1,11 L4,11 L4,18 Z M5,1 L5,19 M0,10 L5,10 M1,19 L1,20 L6,20 L6,19 Z M9,19 L9,20 L14,20 L14,19 Z M40,0 L40,1 L45,1 L45,0 Z M48,0 L48,1 L53,1 L53,0 Z M1,0 L1,1 L6,1 L6,0 Z M9,0 L9,1 L14,1 L14,0 Z M40,19 L40,20 L45,20 L45,19 Z M48,19 L48,20 L53,20 L53,19 Z M17,1 L17,19 L57,19 L57,1 Z M 14,9 L17,9 L17,8 L14,8 Z M14,10 L14,11 L17,11 L17,10 Z M20,2 L20,18 L54,18 L54,2 Z"
        ,onclick: function () {alert("这是一个动态添加的alert方法");}
    };

    switch (w){
        case 1:
            myDiagram.model.addNodeData(myNodeData);
            break;
        case 2:
            var a = new createObj();
            a.car(myNodeData);
            break;
    }
}
function add2(w) {
    var myNodeData = {
        fill: "blue",
        key: "test",
        geo: "F M13,0 L48,0 L48,140 L13,140 Z M0,13 L60,13 L60,25 L0,25 Z M0,115 L60,115 L60,128 L0,128 Z"
        ,onclick: function () {alert("这是一个动态添加的alert方法");}
    };
    switch (w){
        case 1:

            myDiagram.model.addNodeData(myNodeData);
            break;
        case 2:
            var a = new createObj();
            a.car(myNodeData);
            break;
    }
}
function change(){
    var cell = myDiagram.findNodeForKey(currentcell);
    cell.fill="red";
}