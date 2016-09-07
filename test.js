//            var myDate = new Date();
//            var div1 = document.getElementById(div1);
//            var div2 = document.getElementById(div2);
function test(){
    var $ = go.GraphObject.make;
    var diagram =
        $(go.Diagram, 'myDiagramDiv', {

        });

    diagram.nodeTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "Ellipse", {
                fill: "white"
            }),
            $(go.TextBlock,
                new go.Binding("text", "key"))
        );

    diagram.groupTemplate =
        $(go.Group, "Vertical",
            $(go.Panel, "Auto",
                $(go.Shape, "RoundedRectangle", // surrounds the Placeholder
                    {
                        parameter1: 14,
                        fill: "rgba(128,128,128,0.33)"
                    }),
                $(go.Placeholder, // represents the area of all member parts,
                    {
                        padding: 5
                    }) // with some extra padding around them
            ),
            $(go.TextBlock, // group title
                {
                    alignment: go.Spot.Right,
                    font: "Bold 12pt Sans-Serif"
                },
                new go.Binding("text", "key"))
        );

    var nodeDataArray = [{
        key: "Alpha"
    }, {
        key: "Beta",
        group: "Omega"
    }, {
        key: "Gamma",
        group: "Omega"
    }, {
        key: "Omega",
        isGroup: true
    }, {
        key: "Delta"
    },{
        key:"hahaha"
    }];
    var nodeDataArrayC = [{
        key: "eeqewr"
    }, {
        key: "qewr",
        group: "Omega"
    }, {
        key: "rqwer",
        group: "Omega"
    }, {
        key: "qwer",
        isGroup: true
    }, {
        key: "re"
    }];
    var linkDataArray = [
        {
            from:'eeqewr',
            to:'qewr'
        },
        {
            from: "Alpha",
            to: "Beta"
        }, // from outside the Group to inside it
        {
            from: "Beta",
            to: "Gamma"
        }, // this link is a member of the Group
        {
            from: "Omega",
            to: "Delta"
        } // from the Group to a Node
    ];

    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    diagram.model.addNodeDataCollection(nodeDataArrayC);
    // var testArray=[
    //     {
    //         key:i
    //     }
    // ];
    // for(var i = 0;i<500;i++){
    //    testArray=[
    //         {
    //             key:i
    //         }];
    //         diagram.model.addNodeDataCollection(testArray);
    // }

}