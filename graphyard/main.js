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
                                key: "FieldBridge",
                                geo: "F M25,0 L95,0 L95,280 L25,280 Z M0,25 L120,25 L120,50 L0,50 Z M0,230 L120,230 L120,255 L0,255 Z",
                                color: "lightblue"
                            },
                            {
                                key: "FieldBridge2",
                                geo: "F M13,0 L48,0 L48,140 L13,140 Z M0,13 L60,13 L60,25 L0,25 Z M0,115 L60,115 L60,128 L0,128 Z",
                                color: "lightblue"
                            },
                            {
                                key: "Car",
                                geo: "F M0,30 L100,30 L100,10 L90,0 L70,0 L70,20 L0,20 Z M12,30 L12,33 L17,38 L23,38 L28,33 L28,30 Z M62,30 L62,33 L67,38 L73,38 L78,33 L78,30 Z",
                                color: "green"
                            }
                        ] // end nodeDataArray
                }) // end model
        }); // end Palette

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

    var a = new createObj();
    a.yard(ops);


} // end init