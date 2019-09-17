import viewCell from "../tableView/viewCell";
import { ItemInfo } from "../manager/Enum";
import Item from "../common/item";
import playerItemLayer from "./playerItemLayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerItemCell extends viewCell {

    @property(cc.Node)
    selBg: cc.Node = null;

    data : any = null;
    cellData : ItemInfo = null;  
    cellIdx : number = -1;  

    itemSc: Item = null;
    targetSc: playerItemLayer = null;
    
    // LIFE-CYCLE CALLBACKS:

    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        if (index >= data.array.length) {
            //不显示
            this.cellData = null;  
            this.node.active = false;
            return;
        }
        this.selBg.active = false;
        
        //if(reload){
            this.data = data;   //{ array: list, target: x.js }
            this.cellIdx = index; 
            this.cellData = this.data.array[this.cellIdx];
            this.targetSc = this.data.target;
            this.node.active = true;
        //}

        this.onSelected(this._selectState);

        if(this.itemSc == null){
            let itemNode = cc.instantiate(this.targetSc.pfItem);
            this.node.addChild(itemNode, 10);
            this.itemSc = itemNode.getComponent(Item);
        }
        this.itemSc.initItemByData(this.cellData, true); 
    }

    onSelected(bSel){
        if(this.selBg && this.selBg.active != bSel){
            if(bSel){
                this.selBg.active = true;
                if(this.targetSc && this.targetSc.handleSelCell){
                    this.targetSc.handleSelCell(this.cellIdx, this.cellData);
                }
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
