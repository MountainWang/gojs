/**
 * Created by Mountain on 2016/9/7.
 */
function test(){
    var $ = go.GraphObject.make;

    var diagram =
        $(go.Diagram, 'myDiagramDiv', {
            //这里放画布的属性
            initialContentAlignment: go.Spot.Center // 内容居中
            //            "undoManager.isEnabled": true // 开启撤销重做（Ctrl+Z，Ctrl+y）
        });

    // diagram.nodeTemplate = //节点模板
    //     $(go.Node, "Auto", //节点内元素排列方法
    //         $(go.Shape, "Rectangle", { //第一个元素，一个图形，类别是矩形
    //             fill: "white" //填充颜色 白色
    //         }), $(go.TextBlock, //第二个元素，字块
    //             new go.Binding("text", "key")) //数据绑定
    //     );

    //var W_geometry = go.Geometry.parse("F M0,30 L12,30 L12,33 L17,38 L23,38 L28,33 L28,30 L62,30 L62,33 L67,38 L73,38 L78,33 L78,30 L100,30 L100,10 L90,0 L70,0 L70,20 L0,20 Z", false);

    diagram.nodeTemplate =
        $(go.Node,"Auto",
            $(go.Shape,{
                name:"SHAPE",
                geometryString:"F1 M0 0 L20 0 20 20 0 20 z",
                fill:"rgb(130,130,256)"
                },
                new go.Binding("fill","color"),
                new go.Binding("key","key"),
                new go.Binding("geometryString","geoString")
                )
        );
    var myNodeData = {
        fill: blue,
        key: "test",
        geoString:"F M0,30 L12,30 L12,33 L17,38 L23,38 L28,33 L28,30 L62,30 L62,33 L67,38 L73,38 L78,33 L78,30 L100,30 L100,10 L90,0 L70,0 L70,20 L0,20 Z"
    };
    diagram.model.addNodeData(myNodeData);
    //
    // diagram.nodeTemplate =
    //     $(go.Node, "Auto",
    //         $(go.Shape,{geometry:W_geometry,strokeWidte:2},{fill:"white"}),
    //         $(go.TextBlock,
    //         new go.Binding("test","key"))
    //     );
    // var testNodeData = {
    //     key: "test"
    //
    // };
    // diagram.model.addNodeData(testNodeData);

    // diagram.add(
    //     $(go.Part,"Horizontal",
    //         $(go.Shape,{name:"CAR",geometryString:"F M0,30 L12,30 L12,33 L17,38 L23,38 L28,33 L28,30 L62,30 L62,33 L67,38 L73,38 L78,33 L78,30 L100,30 L100,10 L90,0 L70,0 L70,20 L0,20 Z",fill: "rgb(130, 130, 256)"})
    // ))

}