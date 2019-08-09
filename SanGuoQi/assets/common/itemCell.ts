import viewCell from "../tableView/viewCell";
import Item from "./item";
import { ItemInfo } from "../manager/Enum";
import { ROOT_NODE } from "./rootNode";

//用于tableView的itemCell
const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemCell extends viewCell {

    @property(cc.Node)
    selBg: cc.Node = null;

    itemSc: Item = null;

    cellData : ItemInfo = null;  
    cellIdx : number = -1;  

    targetSc: any = null;


    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        if (index >= data.array.length) {   //{ array: list, target: x.js }
            //不显示
            this.cellData = null;  
            this.node.active = false;
            this.targetSc = null;
            return;
        }
        this.selBg.active = false;
        
        //if(reload){
            this.cellIdx = index;  
            this.targetSc = data.target;
            this.cellData = data.array[this.cellIdx];
            this.node.active = true;
        //}
        this.onSelected(this._selectState);

        if(this.itemSc == null){
            let itemNode = cc.instantiate(ROOT_NODE.pfItem);
            this.node.addChild(itemNode, -1);
            this.itemSc = itemNode.getComponent(Item);
        }
        this.itemSc.initItemData(this.cellData);

    }

    onSelected(bSel){
        if(this.selBg && this.selBg.active != bSel){
            if(bSel){
                this.selBg.active = true;
                if(this.targetSc && this.targetSc.handleSelCell){
                    this.targetSc.handleSelCell(this.cellIdx);
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
