
import Skill from "../common/skill";
import { SkillInfo } from "../manager/Enum";
import { ROOT_NODE } from "../common/rootNode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FightSkillCell extends cc.Component {

    //@property(cc.Node)
    selBg: cc.Node = null;

    SkillSc: Skill = null;

    cellData : SkillInfo = null;  
    cellIdx : number = -1;  

    targetSc: any = null;

    onLoad(){
        if(this.selBg){
            this.selBg.active = false;
        }
    }

    //加载需要初始化数据时调用
    initCell (index:number, cellData: SkillInfo, target: any) {
        this.cellIdx = index;  
        this.targetSc = target;
        this.cellData = cellData;

        if(this.SkillSc == null){
            let skillNode = cc.instantiate(ROOT_NODE.pfSkill);
            this.node.addChild(skillNode, 10);
            this.SkillSc = skillNode.getComponent(Skill);
        }
        this.SkillSc.initSkillByData(this.cellData);  //设置地块小球模型数据
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

        if(this.targetSc && this.targetSc.handleSelCell){
            this.targetSc.handleSelCell(this.cellIdx, this.cellData);
        }
    }

}
