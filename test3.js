function test() {
    var $ = go.GraphObject.make;
    var diagram =
        $(go.Diagram, 'myDiagramDiv', {
            //这里放画布的属性
           initialContentAlignment: go.Spot.Center // 内容居中
            //            "undoManager.isEnabled": true // 开启撤销重做（Ctrl+Z，Ctrl+y）
        });

    diagram.nodeTemplate = //节点模板
        $(go.Node, "Auto", //节点内元素排列方法
            $(go.Shape, "Rectangle", { //第一个元素，一个图形，类别是矩形
                fill: "white" //填充颜色 白色
            }), $(go.TextBlock, //第二个元素，字块
                new go.Binding("text", "key")) //数据绑定
        );

    diagram.groupTemplate = //组模板
        $(go.Group, "Vertical",
            $(go.Panel, "Auto",
                $(go.Shape, "Rectangle", // surrounds the Placeholder
                    {
                        parameter1: 14,
                        fill: "rgba(128, 128, 128, 0.33)"
                    }),
                $(go.Placeholder, // represents the area of all member parts,
                    {
                        padding: 10
                    }) // with some extra padding around them
            ),
            $(go.TextBlock, // group title
                {
                    alignment: go.Spot.Left,
                    font: "Bold 12pt Sans-Serif"
                },
                new go.Binding("text", "key"))
        );
    diagram.model.addNodeDataCollection([{
        key: "A",
        isGroup: true
    }, {
        key: "B",
        isGroup: true
    }]);

    for (var i = 0; i < 10; i++) {
        if (i % 2 == 0) {
            testNodeData = {
                key: i,
                group: "A"
            };
        } else {
            testNodeData = {
                key: i,
                group: "B"
            };
        }

        testLinkData = {
            from: i,
            to: i + 2
        };

        diagram.model.addNodeData(testNodeData);
        diagram.model.addLinkData(testLinkData);
    }
}
