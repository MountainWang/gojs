/**
 * Created by kingser on 2016/8/30.
 * 放置所有的数据对象
 */
   function createObj(){}
//堆场加载
   createObj.prototype.yard = function(ops){
       var yardDataArray = [];
       yardDataArray.push( { key: ops.name,  isGroup: true,layerName:"yard",zOrder:1,category:"yardGroup",row:ops.row,bay:ops.bay,tile:ops.tile});
       yardDataArray.push( { text: ops.text, layerName:"yard",zOrder:1,category:"yardTitle",loc:"0 -10",group:ops.name});

       for (var row= 1;row<=ops.row;row++){
           var txr = {};
           txr.text=PrefixInteger(row,2);
           if (ops.rowSeq=='D') txr.text=PrefixInteger(ops.row-row,2);
           txr.loc = -20 + " " + (10*row+2);
           txr.category = "yardText";
           txr.group = ops.name;
           yardDataArray.push(txr);

           for (var bay= 0;bay<ops.bay;bay++){
               var xy = {};
               var bayno = PrefixInteger(2*bay+1,2);
               if (ops.baySeq=='R') bayno = PrefixInteger( 2*(ops.bay -bay-1)+1,2);
               xy.key = ops.name+bayno+ txr.text;
               xy.loc = bay*20 + " " + 10*row;
               xy.category = "yardShape";
               xy.group = ops.name;
               xy.zOrder = 1;
               yardDataArray.push(xy);
               if (row==1){
                   var txr = {};
                   txr.text=bayno;
                   txr.loc = 20*bay + " " + 0;
                   txr.category = "yardText";
                   txr.group = ops.name;
                   yardDataArray.push(txr);
               }
           }
       }
       myDiagram.model.addNodeDataCollection(yardDataArray);
   }
//堆场箱加载
createObj.prototype.cntr = function(ops){
    var cntr={};
    cntr.key = ops.key;
    //var keylen = ops.key.length;
    //-----
    var bayno = eval(ops.key.substring(2,4));
    var loc;
   //d--double  四十尺箱
    if (chkjo(bayno)=='d'){
        var last = myDiagram.findNodeForKey(ops.key.substring(0,2)+PrefixInteger(bayno + 1,2)+ops.key.substring(4,6));
        var front = myDiagram.findNodeForKey(ops.key.substring(0,2)+PrefixInteger(bayno - 1,2)+ops.key.substring(4,6));
        var lx  = (go.Point.parse(front.data.loc).x + go.Point.parse(last.data.loc).x) / 2;
        var ly  = (go.Point.parse(front.data.loc).y + go.Point.parse(last.data.loc).y) / 2;
        loc = go.Point.stringify(new go.Point(lx,ly));
    }else
        loc = myDiagram.findNodeForKey(ops.key).data.loc;

    //-----
    cntr.loc = loc;
    cntr.category = "cntr";
    cntr.item = ops.key;
    cntr.layer = "cntr";
    cntr.zOrder = ops.key.substring(4,6);
    cntr.angle = myDiagram.findNodeForKey(ops.key.substring(0,2)).data.angle;
    cntr.width = ops.width;
    myDiagram.model.addNodeData(cntr);
}

//贝位
createObj.prototype.bay = function(ops){
    var bayDataArray = [];
    //{"key":1, "text":"01", "isGroup":true, "category":"bayTpGp"},---贝
    var bay = {key:ops.bayno,text:ops.bayno,isGroup:true,category:"bayTpGp"};
    bayDataArray.push(bay);
    // {"key":3, "text":"1", "isGroup":true, "category":"rowTpGp", "group":1},---排
    for (var i=0;i<=ops.row;i++){
        var br = {};
        br.key = bay.key+i;
        br.text = i;
        if (i==0)  br.text = "";
        br.isGroup = true;
        br.category = "rowTpGp";
        br.group = bay.key;
        bayDataArray.push(br);
        //{category:"bayrowTp", "group":3, "key":-7},---层
        for (var j=ops.tile;j>0;j--){
            var brt = {};
            brt.key = bay.key+i+j;
            brt.group = br.key;
            brt.category = "bayrowTp";
            brt.tile = j;
            if (i==0) brt.category = "tileTextTp"

            bayDataArray.push(brt);
        }
    }
    myDiagram.model.addNodeDataCollection(bayDataArray);

}
    //myDiagram.addDiagramListener("ChangedSelection",
    //    function(e) {
    //        var sel = myDiagram.selection.toArray();
    //        for (var i = 0; i < sel.length; i++) {
    //            var part = sel[i];
    //            // don't have any members of Groups be selected or selectable
    //            console.log(part);
    //        }
    //    }
    //);

