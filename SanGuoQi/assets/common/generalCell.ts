import viewCell from "../tableView/viewCell";
import Card from "../fight/card";
import { ROOT_NODE } from "./rootNode";
import { GeneralInfo } from "../manager/Enum";

//用于tableView的GeneralCell
const {ccclass, property} = cc._decorator;

@ccclass
export default class GeneralCell extends viewCell {

    @property(cc.Node)
    selBg: cc.Node = null;

    cardSc: Card = null;

    cellData : GeneralInfo = null;  
    cellIdx : number = -1;  
    targetSc: any = null;


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
            this.targetSc = data.target;
            this.cellIdx = index;  
            this.cellData = data.array[this.cellIdx];
            this.node.active = true;
        //}

        if(this.cardSc == null){
            let itemNode = cc.instantiate(ROOT_NODE.pfCard);
            this.node.addChild(itemNode, 10);
            this.cardSc = itemNode.getComponent(Card);
        }
        this.cardSc.showGeneralCard(this.cellData);

    }

    onSelected(bSel){
        if(this.selBg){
            if(bSel){
                this.selBg.active = true;

                if(this.targetSc && this.targetSc.handleGeneralCellClick){
                    this.targetSc.handleGeneralCellClick(this.cellIdx);   //点击选中回调
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
