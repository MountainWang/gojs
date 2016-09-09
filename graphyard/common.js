/**
 * Created by kingser on 2016/9/6.
 */

function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}
// Change the angle of the parts connected with the given node
function rotate(node, angle) {
    var tool = myDiagram.toolManager.draggingTool;  // should be a SnappingTool
    myDiagram.startTransaction("rotate " + angle.toString());
    var sel = new go.Set(go.Node);
    sel.add(node);
    var coll = tool.computeEffectiveCollection(sel).toKeySet();
    var bounds = myDiagram.computePartsBounds(coll);
    var center = bounds.center;
    coll.each(function(n) {
        n.angle += angle;
        n.location = n.location.copy().subtract(center).rotate(angle).add(center);
    });
    myDiagram.commitTransaction("rotate " + angle.toString());
}

function chkjo(num){
    //return num?num%2?"奇数":"偶数":"0"
    return num?num%2?"s":"d":"0"
}