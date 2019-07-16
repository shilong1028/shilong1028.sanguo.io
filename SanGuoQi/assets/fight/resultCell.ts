
import viewCell from "../tableView/viewCell";


//用于tableView的itemCell
const {ccclass, property} = cc._decorator;

@ccclass
export default class ResultCell extends viewCell {

    //@property(cc.Node)
    selBg: cc.Node = null;

    @property(cc.Label)
    bingCount: cc.Label = null;

    @property(cc.Label)
    killCount: cc.Label = null;

    @property(cc.Label)
    lvLabel:cc.Label = null;

    @property(cc.Label)
    expLabel:cc.Label = null;

    @property(cc.Node)
    headNode: cc.Node = null;

    cellData : any = null;  
    cellIdx : number = -1;  


    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        if (index >= data.array.length) {   //{ array: list, target: x.js }
            //不显示
            this.cellData = null;  
            this.node.active = false;
            return;
        }
        this.onSelected(this._selectState);

        //if(reload){
            this.cellIdx = index;  
            this.cellData = data.array[this.cellIdx];
            this.node.active = true;
        //}

    }

    onSelected(bSel:boolean){
        if(this.selBg && this.selBg.active != bSel){
            if(bSel == true){
                this.selBg.active = true;
            }else{
                this.selBg.active = false;
            }
        }
    }

    //被点击时相应的方法
    clicked () {      
        this.onSelected(true);
    }

}
