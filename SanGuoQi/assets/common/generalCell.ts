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
    bEnemy: boolean = false;   //是否敌军


    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        if (index >= data.array.length) {   //{ array: list, target: x.js , bEnemy: false}
            //不显示
            this.cellData = null;  
            this.node.active = false;
            return;
        }

        this.selBg.active = false;

        this.onSelected(this._selectState);

        //if(reload){
            this.targetSc = data.target;
            this.bEnemy = data.bEnemy;  //是否敌军
            
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
                if(this.targetSc){
                    if(this.bEnemy == false && this.targetSc.handleGeneralCellClick){
                        this.targetSc.handleGeneralCellClick(this.cellIdx);   //点击选中回调
                    }else if(this.bEnemy == true && this.targetSc.handleEnemyCellClick){
                        this.targetSc.handleEnemyCellClick(this.cellIdx);   //点击选中回调
                    }
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
