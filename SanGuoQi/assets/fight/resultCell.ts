
import viewCell from "../tableView/viewCell";
import { CardInfo } from "../manager/Enum";
import Card from "./card";
import { ROOT_NODE } from "../common/rootNode";


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

    cellData : CardInfo = null;  
    cellIdx : number = -1;  

    cardSc: Card = null;

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

        if(this.cardSc == null){
            let itemNode = cc.instantiate(ROOT_NODE.pfCard);
            this.headNode.addChild(itemNode, 10);
            this.cardSc = itemNode.getComponent(Card);
        }
        this.cardSc.showGeneralCard(this.cellData.generalInfo);

        this.bingCount.string = "兵力剩余：" + this.cellData.generalInfo.bingCount.toString();
        this.killCount.string = "杀敌：" + this.cellData.generalInfo.killCount.toString();
        this.lvLabel.string = "等级：Lv" + this.cellData.generalInfo.generalLv.toString();
        let exp = Math.floor(this.cellData.generalInfo.killCount/10);
        this.expLabel.string = "增加经验：" + exp.toString();
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
