import viewCell from "../tableView/viewCell";
import Item from "./item";
import { ItemInfo } from "../manager/Enum";
import { ROOT_NODE } from "./rootNode";

//用于tableView的itemCell
const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemCell extends viewCell {

    //@property(cc.Node)
    selBg: cc.Node = null;

    itemSc: Item = null;

    cellData : ItemInfo = null;  
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

        if(this.itemSc == null){
            let itemNode = cc.instantiate(ROOT_NODE.pfItem);
            this.node.addChild(itemNode, 10);
            this.itemSc = itemNode.getComponent(Item);
        }
        this.itemSc.initItemData(this.cellData, false);

    }

    onSelected(bSel){
        if(this.selBg){
            if(bSel){
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
