import viewCell from "../tableView/viewCell";
import Skill from "../common/skill";
import { SkillInfo } from "../manager/Enum";
import { FightMgr } from "../manager/FightManager";

//用于tableView的itemCell
const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillCell extends viewCell {

    //@property(cc.Node)
    selBg: cc.Node = null;

    SkillSc: Skill = null;

    cellData : SkillInfo = null;  
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
        if(this.selBg){
            this.selBg.active = false;
        }
        
        //if(reload){
            this.cellIdx = index;  
            this.targetSc = data.target;
            this.cellData = data.array[this.cellIdx];
            this.node.active = true;
        //}
        this.onSelected(this._selectState);

        if(this.SkillSc == null){
            let skillNode = cc.instantiate(FightMgr.getFightScene().pfSkill);
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
    }

}
