/**
 * Created by kingser on 2016/9/6.
 * 存放用到的各种模板
 */
// sets the qualities of the tooltip
var tooltiptemplate =
    $AJ(go.Adornment, go.Panel.Auto,
        $AJ(go.Shape, "RoundedRectangle", {
            fill: "whitesmoke",
            stroke: "gray"
        }),
        $AJ(go.TextBlock, {
                margin: 3,
                editable: true
            },
            // converts data about the part into a string
            new go.Binding("text", "", function (data) {
                if (data.item != undefined) return data.item;
                return "(unnamed item)";
            }))
    );

//堆场分组
var groupTp =
    $AJ(go.Group, "Auto",
        new go.Binding("layerName"),
        new go.Binding("zOrder"), new go.Binding("angle").makeTwoWay()
    );
// Define the generic furniture and structure Nodes.
// The Shape gets it Geometry from a geometry path string in the bound data.
//堆场标题--不能跟分组放一块，位置不好控制
var nodeTpYardTitle =
    $AJ(go.Node, "Spot", {
            locationSpot: go.Spot.BottomLeft,
            selectable: false
        },
        new go.Binding("angle").makeTwoWay(),
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $AJ(go.TextBlock, {
                font: "bold 20px sans-serif",
                stroke: "green"
            },
            new go.Binding("text"))
    );
//堆场货位

var nodeTpYardShape =
    $AJ(go.Node, "Spot", {
            locationSpot: go.Spot.Center,
            movable: false,
            deletable: false
//            ,click: function (e, node) {
//                alert(node.data.key);
//                node.data.fill = "blue";
//
//
//                //myDiagram.startTransaction('toggle ');
//                //var layer = myDiagram.findLayer("yard");
//                //console.log(layer);
//                //layer.visible = false;
//                //myDiagram.commitTransaction('toggle ');
//                //var nox = myDiagram.findNodeForKey('01');
//                //rotate(nox,45);
//                //var no1 = myDiagram.findNodeForKey('010101');
//                //rotate(no1,45);
//            }
        },
        new go.Binding("zOrder"),
        new go.Binding("angle").makeTwoWay(),
        //new go.Binding("name", "xxx"),
        // remember the location of this Node
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // can be resided according to the user's desires
        $AJ(go.Shape, {
                figure: "Rectangle",
                fill: "white",
                width: 20,
                height: 10
                ,click:function(e, node){
                    alert(node.fill);
                    node.fill="blue";
                    currentcell = node.key;
                }
            },
            new go.Binding("fill", "color")
           )
    );

//堆场文字
var nodeTpYardText =
    $AJ(go.Node, "Spot", {
            locationSpot: go.Spot.Center,
            selectable: false
        },
        //new go.Binding("name", "xxx"),
        new go.Binding("angle").makeTwoWay(),
        // remember the location of this Node
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // can be resided according to the user's desires
        $AJ(go.TextBlock, {
                //background: "lightgreen",
                font: "10px sans-serif",
                stroke: "black"
            },
            new go.Binding("text"))
    );

var nodeTpCntr =
    $AJ(go.Node, "Auto", {
            locationSpot: go.Spot.Center,
            toolTip: tooltiptemplate,
            click: function (e, node) {
                //myDiagram.startTransaction('toggle ');
                //var layer = myDiagram.findLayer("yard");
                //console.log(layer);
                //layer.visible = false;
                //myDiagram.commitTransaction('toggle ');
                alert("fuck" + node.data.key);
                node.fill = "blue";
                //var nox = myDiagram.findNodeForKey('01');
                //rotate(nox,45);
                //var no1 = myDiagram.findNodeForKey('010101');
                //rotate(no1,45);
            }
        },
        new go.Binding("layerName"),
        new go.Binding("item"),
        new go.Binding("zOrder"),
        new go.Binding("angle"),
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $AJ(go.Shape, "Rectangle", {
                fill: "red", // the default fill, if there is no data-binding,
                height: 10
            },
            new go.Binding("figure", "fig"),
            // this determines the actual shape of the Shape
            new go.Binding("geometryString", "geo"),
            new go.Binding("fill", "color"),
            new go.Binding("width"))

    );

function mouseEnter(e, obj) {
    obj.isHighlighted = true;
}

function mouseLeave(e, obj) {
    obj.isHighlighted = false;
}

myPaletteTp =
    $AJ(go.Node, "Vertical", {
            // mouseEnter: mouseEnter,
            // mouseLeave: mouseLeave,
            toolTip: tooltiptemplate
        },
        $AJ(go.Shape, {
                name: "SHAPE",
                fill: "rgb(130, 130, 256)"
            },
            new go.Binding("figure", "fig"),
            // this determines the actual shape of the Shape
            new go.Binding("geometryString", "geo"),
            // allows the color to be determined by the node data
            new go.Binding("fill", "color"),
            new go.Binding("click", "onclick")
        ), $AJ(go.TextBlock, // the label
            {
                margin: 4,
                font: "bold 18px sans-serif",
                background: 'white'
            },
            new go.Binding("visible", "isHighlighted").ofObject(),
            new go.Binding("text", "key"))
    );
//右键菜单
var contextTp =
    $AJ(go.Adornment, "Vertical",
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rename", {
                margin: 3
            }), {
                click: function (e, obj) {
                    rename(obj);
                }
            }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Cut", {
                margin: 3
            }), {
                click: function (e, obj) {
                    myDiagram.commandHandler.cutSelection();
                }
            }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Copy", {
                margin: 3
            }), {
                click: function (e, obj) {
                    myDiagram.commandHandler.copySelection();
                }
            }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate +45", {
                margin: 3
            }), {
                click: function (e, obj) {
                    myDiagram.commandHandler.rotate(45);
                }
            }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate -45", {
                margin: 3
            }), {
                click: function (e, obj) {
                    myDiagram.commandHandler.rotate(-45);
                }
            }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate +90", {
                margin: 3
            }), {
                click: function (e, obj) {
                    myDiagram.commandHandler.rotate(90);
                }
            }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate -90", {
                margin: 3
            }), {
                click: function (e, obj) {
                    myDiagram.commandHandler.rotate(-90);
                }
            }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate 180", {
                margin: 3
            }), {
                click: function (e, obj) {
                    myDiagram.commandHandler.rotate(180);
                }
            })
    );