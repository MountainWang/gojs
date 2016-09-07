function test() {

    var $ = go.GraphObject.make;
    var diagram =
        $(go.Diagram, 'myDiagramDiv', {
            initialContentAlignment: go.Spot.Center
            // ,"animationManager.duration": 1000
        });

    diagram.nodeTemplate =
        $(go.Node, "Vertical",
            $(go.Shape, "Rectangle", {
                fill: "white"
            })
            ,$(go.TextBlock,
                new go.Binding("text", "key"),
                new go.Binding("key", "key")
            )
        );


    for (var i = 0; i < 50000; i++) {

    testArray = {
        key: i
    };
    diagram.model.addNodeData(testArray);
}
    var outPut = document.getElementsByTagName("li");
    for(var j = 0;j<50;j++){
        outPut[j].innerHTML=diagram.findNodeForKey(Math.floor(Math.random()*50000));

    }
}
function search() {
    var outPut = document.getElementsByTagName("li");
    for(var i = 0;i<50;i++){
        outPut[i].innerHTML=diagram.findNodeForKey(Math.floor(Math.random()*50000));
    }

}



