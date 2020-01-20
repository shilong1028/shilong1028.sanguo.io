
import viewCell from "../tableView/viewCell";
import SkillLayer from "./skillLayer";
import { GeneralInfo } from "../manager/Enum";
import Card from "../fight/card";
import { ROOT_NODE } from "../common/rootNode";
import SkillCard from "./skillCard";

//用于tableView的itemCell
const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillLearnCell extends viewCell {

    @property(cc.Node)
    selBg: cc.Node = null;

    @property(cc.Node)
    headNode: cc.Node = null;

    @property(cc.Node)
    skillsNode: cc.Node = null;

    @property(cc.Prefab)
    pfSkillCard: cc.Prefab = null;

    cellData : GeneralInfo = null;  
    cellIdx : number = -1;  
    targetSc: SkillLayer = null;

    cardSc: Card = null;

    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        if (index >= data.array.length) {   //{ array: list, target: x.js }
            //不显示
            this.cellData = null;  
            this.targetSc = null;
            this.node.active = false;
            return;
        }
        this.targetSc = data.target;
        this.onSelected(this._selectState);

        this.skillsNode.destroyAllChildren();

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

        let maxSkillNum = this.cellData.generalCfg.skillNum;
        for(let i=0; i<maxSkillNum; ++i){
            let skillInfo = this.cellData.skills[i];
            let skillcard = cc.instantiate(this.pfSkillCard);
            this.skillsNode.addChild(skillcard);
            skillcard.getComponent(SkillCard).initGeneralSkill(skillInfo, this.targetSc, this.cellData);
        }
    }

    onSelected(bSel:boolean){
        if(this.selBg && this.selBg.active != bSel){
            if(bSel == true){
                this.selBg.active = true;
                if(this.targetSc){
                    this.targetSc.handleSelGeneralCell(this.cellIdx);
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
