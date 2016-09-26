/**
 * Created by kingser on 2016/9/6.
 * 存放用到的各种模板
 */
// sets the qualities of the tooltip
var tooltiptemplate =
    $AJ(go.Adornment, go.Panel.Auto,
        $AJ(go.Shape, "RoundedRectangle",
            { fill: "whitesmoke", stroke: "gray" }),
        $AJ(go.TextBlock,
            { margin: 3, editable: true },
            // converts data about the part into a string
            new go.Binding("text", "", function(data) {
                if (data.item != undefined) return data.item;
                return "(unnamed item)";
            }))
    );

//堆场分组
    var groupTp=
    $AJ(go.Group, "Auto",
        new go.Binding("layerName"),
        new go.Binding("zOrder"),new go.Binding("angle").makeTwoWay()
    );
// Define the generic furniture and structure Nodes.
// The Shape gets it Geometry from a geometry path string in the bound data.
//堆场标题--不能跟分组放一块，位置不好控制
var nodeTpYardTitle=
    $AJ(go.Node, "Spot",
        {
            locationSpot: go.Spot.BottomLeft,
            selectable:false
        },
        new go.Binding("angle").makeTwoWay(),
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $AJ(go.TextBlock,
            {
                font: "bold 20px sans-serif",
                stroke:"green"
            },
            new go.Binding("text"))
    );
//堆场货位
   var nodeTpYardShape=
    $AJ(go.Node, "Spot",
        {
            locationSpot: go.Spot.Center,
            movable:false,
            deletable:false,
            mouseDrop: function(e, node) {

                var target = myDiagram.selection.first();
                target.location = node.location;
                if (target.category == "cntr"&&target.data.width==40)
                {
                    var locx = node.location.x - 10;
                    target.location = new go.Point(locx,node.location.y);
                }
            }
        },
        new go.Binding("zOrder"),new go.Binding("angle").makeTwoWay(),
        //new go.Binding("name", "xxx"),
        // remember the location of this Node
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // can be resided according to the user's desires
        $AJ(go.Shape,
            {
                figure: "Rectangle",
                fill: "white",
                width:20,
                height:10
            }
        )
    );
//堆场文字
var nodeTpYardText=
    $AJ(go.Node, "Spot",
        {
            locationSpot: go.Spot.Center,
            selectable:false
        },
        //new go.Binding("name", "xxx"),
        new go.Binding("angle").makeTwoWay(),
        // remember the location of this Node
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // can be resided according to the user's desires
        $AJ(go.TextBlock,
            {
                //background: "lightgreen",
                font: "10px sans-serif",
                stroke:"black"
            },
            new go.Binding("text"))
    );

var nodeTpCntr =  $AJ(go.Node, "Auto",
    {locationSpot: go.Spot.Center,
        toolTip: tooltiptemplate,
        click: function(e, node) {
            //myDiagram.startTransaction('toggle ');
            //var layer = myDiagram.findLayer("yard");
            //console.log(layer);
            //layer.visible = false;
            //myDiagram.commitTransaction('toggle ');
            alert("fuck"+node.data.key);
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
    $AJ(go.Shape, "Rectangle",
        {
            fill: "red", // the default fill, if there is no data-binding,
            height:10
        },
        new go.Binding("figure", "fig"),
        // this determines the actual shape of the Shape
        new go.Binding("geometryString", "geo"),
        new go.Binding("fill", "color"),
    new go.Binding("width"))

);


myPaletteTp =
    $AJ(go.Node, "Spot",{
        toolTip: tooltiptemplate},
        $AJ(go.Shape,
            {
                name: "SHAPE",
                fill: "rgb(130, 130, 256)"
            },

            new go.Binding("figure", "fig"),
            // this determines the actual shape of the Shape
            new go.Binding("geometryString", "geo"),
            // allows the color to be determined by the node data
            new go.Binding("fill", "color")
        )
    );
//右键菜单
    var contextTp =
    $AJ(go.Adornment, "Vertical",
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rename", { margin: 3 }),
            { click: function(e, obj) { rename(obj); } }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Cut", { margin: 3 }),
            { click: function(e, obj) { myDiagram.commandHandler.cutSelection(); } }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Copy", { margin: 3 }),
            { click: function(e, obj) { myDiagram.commandHandler.copySelection(); } }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate +45", { margin: 3 }),
            { click: function(e, obj) { myDiagram.commandHandler.rotate(45); } }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate -45", { margin: 3 }),
            { click: function(e, obj) { myDiagram.commandHandler.rotate(-45); } }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate +90", { margin: 3 }),
            { click: function(e, obj) { myDiagram.commandHandler.rotate(90); } }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate -90", { margin: 3 }),
            { click: function(e, obj) { myDiagram.commandHandler.rotate(-90); } }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate 180", { margin: 3 }),
            { click: function(e, obj) { myDiagram.commandHandler.rotate(180); } })
    );
//贝位图
var bayTpGp = $AJ(go.Group, "Auto",
    {
        layout:
            $AJ(go.GridLayout,
                { wrappingWidth: Infinity, alignment: go.GridLayout.Position,
                    cellSize: new go.Size(1, 1), spacing: new go.Size(1, 1) }),
        movable:false,
        deletable:false
    },
    $AJ(go.Panel, "Vertical",  // title above Placeholder
        $AJ(go.Panel, "Horizontal",  // button next to TextBlock
            $AJ(go.TextBlock,
                {
                    alignment: go.Spot.Center,
                    margin: 5,
                    stroke: "#404040"
                },
                new go.Binding("text"))
        ),  // end Horizontal Panel
        $AJ(go.Placeholder)
    )  // end Vertical Panel
)

//排
var rowTpGp = $AJ(go.Group, "Auto",
    {
        layout:
            $AJ(go.GridLayout,
                { wrappingColumn: 1, alignment: go.GridLayout.Position,
                    cellSize: new go.Size(1, 1), spacing: new go.Size(0, 0) }),
        movable:false,
        deletable:false
    },
    $AJ(go.Shape, "Rectangle",
        { fill: null, stroke: "gray", strokeWidth: 1 }),
    $AJ(go.Panel, "Vertical",  // title above Placeholder
        $AJ(go.Panel, "Horizontal",  // button next to TextBlock
            $AJ(go.TextBlock,
                {
                    alignment: go.Spot.Center,
                    margin: 5,
                    stroke: "#404040"
                },
                new go.Binding("text"))
        ),  // end Horizontal Panel
        $AJ(go.Placeholder)
    )
)
//层-箱位40
var cntrTp20 = $AJ(go.Node, "Auto",
    {movable:false,alignment: go.Spot.Center
    },
    new go.Binding("movable"),
    new go.Binding("location").makeTwoWay(),
    $AJ(go.Shape, "Rectangle",
        { fill: "#ACE600", stroke: null,width:40,height:40 },
        new go.Binding("fill", "color")),
    $AJ(go.TextBlock,
        // TextBlock.text is bound to Node.data.key
        new go.Binding("text", "order"))
)
//层-箱位40
var cntrTp40 = $AJ(go.Node, "Auto",
    {movable:false,alignment: go.Spot.Center
    },

    new go.Binding("movable"),
    new go.Binding("location","location" ,toLocation).makeTwoWay(fromLocation),
    $AJ(go.Shape, "Rectangle",
        { fill: "#ACE600", stroke: null,width:40,height:40 },
        new go.Binding("fill", "color")),
    $AJ(go.TextBlock,
        // TextBlock.text is bound to Node.data.key
        new go.Binding("text", "order"))
)

//影子箱位

var shadowTp =  $AJ(go.Node, "Auto",{movable:false,selectable:false},
        new go.Binding("location","loc"),
        $AJ(go.Shape, "XLine", { fill: "slateblue" ,width:40,height:40})
    )

//层-箱位
var bayrowTp = $AJ(go.Node, "Auto",
    {movable:false,
        deletable:false,alignment: go.Spot.Center,
        contextClick: function(e, node) {//40尺箱 并创建影子箱位
            myDiagram.layout.isOngoing = false;
            var loc = node.location;
            var cntr = {color:"lightgray",key:node.data.key+"ct",category:"cntrTp40",movable:true,location:loc,order:"40"};
            myDiagram.model.addNodeData(cntr);
            var nodeDataArray = [
                { key: cntr.key+"s", loc: new go.Point(loc.x,loc.y-264) ,category:"shadowTp" }
            ];
            myDiagram.model.addNodeDataCollection(nodeDataArray);
        },
        click: function(e, node) {
            myDiagram.layout.isOngoing = false;
            var loc = node.location;
            //var cntr = {color:"red",key:node.data.key+"ct",category:"cntrTp20",movable:true,location:loc,order:"20"};
            //myDiagram.model.addNodeData(cntr);
            var t = { key: 211, text: "20", ribbon: "DANGER" ,category:"cntrStyleTp",location:loc};
            myDiagram.model.addNodeData(t);
        },
        mouseDrop: function(e, node) {

                var target = myDiagram.selection.first();
            if (target.data.category == "bayrowTp") return;
                target.location = node.data.location;
            //console.log(node.data);
        }},

    new go.Binding("movable"),
    new go.Binding("location").makeTwoWay(),
    $AJ(go.Shape, "Rectangle",
        { fill: "#ACE600", stroke: null,width:40,height:40 },
        new go.Binding("fill", "color")),
    $AJ(go.TextBlock,
        // TextBlock.text is bound to Node.data.key
        new go.Binding("text", "order"))
)

cntrStyleTp =
    $AJ(go.Node, "Spot",
        {  locationObjectName: "BODY" },
        { selectionObjectName: "BODY" },
        new go.Binding("location"),
        $AJ(go.Panel, "Auto",
            { name: "BODY", width: 40, height: 40 },
            { portId: "" },
            $AJ(go.Shape,
                { fill: "lightgray", stroke: null, strokeWidth: 0 }),
            $AJ(go.TextBlock,
                new go.Binding("text"))
        ),
        $AJ(go.Panel, "Spot",
            new go.Binding("opacity", "ribbon", function(t) { return t ? 1 : 0; }),
            { opacity: 0,
                alignment: new go.Spot(1, 0, 4, -4),
                alignmentFocus: go.Spot.TopRight },
            $AJ(go.Shape,  // the ribbon itself
                { geometryString: "F1 M0 0 L15 0 35 20 35 35z",
                    fill: "red", stroke: null, strokeWidth: 0 }),
            $AJ(go.TextBlock,
                new go.Binding("text", "ribbon"),
                {alignment: new go.Spot(1, 0, -15, 15),
                    angle: 45,
                    stroke: "white", font: "bold 5px sans-serif", textAlign: "center" })
        )
    );

//层-箱位
var tileTextTp = $AJ(go.Node, "Auto",
    {movable:false,
        deletable:false,alignment: go.Spot.Center},
    new go.Binding("movable"),
    new go.Binding("location").makeTwoWay(),
    $AJ(go.Shape, "Rectangle",
        { fill: "white", stroke: null,width:20,height:40 }),
    $AJ(go.TextBlock,
        {  stroke: "black", font: "9px sans-serif", textAlign: "center" },
        // TextBlock.text is bound to Node.data.key
        new go.Binding("text", "tile"))
)