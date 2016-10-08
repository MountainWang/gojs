/**
 * Created by kingser on 2016/8/31.
 */
// hides remove HTML Element
// hides open HTML Element
var bayArr = ["01","03","05","07","09","11","13","15","17"];
function init() {
    myDiagram =
        $AJ(go.Diagram, "myDiagramDiv",
            {
                layout:  // Diagram has simple horizontal layout
                $AJ(go.GridLayout,
                    { wrappingColumn: Math.ceil(bayArr.length/2),wrappingWidth: Infinity, alignment: go.GridLayout.Position, cellSize: new go.Size(1, 1)}),
                initialContentAlignment: go.Spot.TopLeft,
                "undoManager.isEnabled": true,

                draggingTool: new GuidedDraggingTool(),  // defined in GuidedDraggingTool.js
                //
                //"draggingTool.isGridSnapEnabled": true,
                //"resizingTool.isGridSnapEnabled": true,
                //"draggingTool.horizontalGuidelineColor": "blue",
                //"draggingTool.verticalGuidelineColor": "blue",
                //"draggingTool.centerGuidelineColor": "green",
                //"draggingTool.guidelineWidth": 1,
                "SelectionDeleted": deleteShadowCntr
            });
    //

    myDiagram.groupTemplateMap.add("bayTpGp",bayTpGp);  // end Group and call to add to template Map

    myDiagram.groupTemplateMap.add("rowTpGp",rowTpGp);
    myDiagram.nodeTemplateMap.add("cntrStyleTp",cntrStyleTp);
    myDiagram.nodeTemplateMap.add("bayrowTp",bayrowTp);
    myDiagram.nodeTemplateMap.add("cntrTp20",cntrTp20);
    myDiagram.nodeTemplateMap.add("shadowTp",shadowTp);
    myDiagram.nodeTemplateMap.add("cntrTp40",cntrTp40);
    myDiagram.nodeTemplateMap.add("tileTextTp",tileTextTp);

    var createBay = new createObj();
    var para = bayArr;
    var grsize =  Math.ceil(para.length/2);
    var grPara = 2;
    for (var i= 0;i<grPara;i++){
        var lef = i%2;
        var m = 0;
        if (lef == 0) m = i+1;
        for (var j= 0;j<grsize;j++){
            var k = (i+j)*2+m;
            if (para.length<k) break;
            var ops = {bayno:para[k-1],row:8,tile:5};
            createBay.bay(ops);
        }
    }



    //myDiagram.modelMap.add(new go.TreeModel(nodeDataArray));
//    var tlayout =$AJ(go.TreeLayout);
//    myDiagram.layout = tlayout;
//    myDiagram.nodeTemplateMap.add("nd",
//        $AJ(go.Node, "Auto",
//            new go.Binding("location", "loc", go.Point.parse),
//            $AJ(go.Shape, "Rectangle", { fill: "slateblue" ,width:40,height:40}),
//            $AJ(go.TextBlock,
//                new go.Binding("text", "key"))
//        )
//);
//    myDiagram.linkTemplate =
//        $AJ(go.Link);
//
//    var nodeDataArray = [
//        { key: "Alpha", loc: "0 600" ,category:"nd" },
//        { key: "Beta", loc: "0 15", category:"nd" }
//    ];
////    myDiagram.model=new go.TreeModel(nodeDataArray);
//    myDiagram.model.addNodeDataCollection(nodeDataArray);
}




