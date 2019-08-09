
import viewCell from "../tableView/viewCell";
import Card from "./card";
import { ROOT_NODE } from "../common/rootNode";
import { GameMgr } from "../manager/GameManager";
import { GeneralInfo } from "../manager/Enum";


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
    @property(cc.Node)
    lvUpNode: cc.Node = null;

    cellData : GeneralInfo = null;  
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
        this.cardSc.showGeneralCard(this.cellData);

        this.lvUpNode.active = false;
        this.bingCount.string = "兵力剩余：" + this.cellData.bingCount.toString();
        this.killCount.string = "杀敌：" + this.cellData.tempFightInfo.killCount.toString();

        let generalLv = this.cellData.generalLv;
        let exp = Math.floor(this.cellData.tempFightInfo.killCount/10);
        exp += data.target.balancedExp;   //均衡经验值（总杀敌数的一半用于每个武将均衡经验增加，武将杀敌的另一半用于自己经验增加）
        this.expLabel.string = "增加经验：" + exp.toString();

        if(generalLv < 100){
            let maxExp = GameMgr.getMaxGeneralExpByLv(generalLv);
            let generalExp = this.cellData.generalExp + exp;
            let oldLv = generalLv;
            while(generalExp >= maxExp){
                generalLv ++;
                generalExp -= maxExp;
                maxExp = GameMgr.getMaxGeneralExpByLv(generalLv);
            }
            if(generalLv > oldLv){
                this.lvUpNode.active = true;
            }
        }
        this.lvLabel.string = "等级：Lv" + generalLv.toString();
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
