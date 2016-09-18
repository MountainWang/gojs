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
    
    
    
    
    
//    diagram.groupTemplate =
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





    	var head = "M0,10 L0,190 L140,190 L140,10 Z";
        var window = "M10,20 L10,90 L40,90 L40,20 Z M10,180, L10,110 L40,110 L40,180 Z M50,10 L50,190 M0,100 L50,100";
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
    
    var myNodeData = {
        fill: "blue",
        key: "test",
        geoString:head+window+wheel_L1+wheel_L2+wheel_L3+wheel_L4+wheel_R1+wheel_R2+wheel_R3+wheel_R4+body+connect+cent
    };
    diagram.model.addNodeData(myNodeData);


    
    
}