/**
 * Created by kingser on 2016/9/6.
 */

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


/*
判断是否选择整bay 返回整bay
 */
function getBay(){

    Array.prototype.contains = function(item){
        return RegExp(item).test(this);
    };
    var narr = new Array();
    var akey = new Array();
    var cntrs = new Array();
    var row = 0;
    myDiagram.selection.each(function(part) {
        var cat = part.data.category
        if (cat == "yardShape"){
            var key = part.data.key;
            if (row == 0) row = myDiagram.findNodeForKey(part.data.group).data.row;
            akey.push(key);
                var grp = key.substring(2,4);
                if (!narr.contains(grp)) {
                    narr.push(grp);
                }
        }else if(cat == "cntr"){
            cntrs.push(part.data);
        }
    })
    var rarr = new Array();
    narr.forEach(function(i){
        var nrow = 0;
        akey.forEach(function(j){
            if (i== j.substring(2,4)){
                nrow ++;
            }
        })
        if(row == nrow){
            rarr.push(i);
        }
    })

var ret = {
    bayno : rarr,
    cntr:cntrs
}
    //console.log(rarr);
return ret;
}
//删除影子箱位
function deleteShadowCntr(e) {
    //var node = e.subject.first();
    e.subject.each(function(n) {
        var nod = myDiagram.findNodeForKey(n.data.key+"s");
        //console.log(n.data);
        myDiagram.remove(nod);
    });
};

//影子箱位的控制
function toLocation(data, node) {
    return new go.Point(data.x, data.y);
};
function fromLocation(loc, data) {
    data.x = loc.x;
    data.y = loc.y;
    var nod =  myDiagram.findNodeForKey(data.key+"s");
    nod.position=new go.Point(data.x,data.y-264);
};