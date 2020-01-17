import viewCell from "../tableView/viewCell";
import { AudioMgr } from "../manager/AudioMgr";
import { SkillInfo } from "../manager/Enum";
import Skill from "../common/skill";
import { ROOT_NODE } from "../common/rootNode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillCell extends viewCell {

    @property(cc.Sprite)
    cellBg: cc.Sprite = null;
    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Label)
    descLabel: cc.Label = null;

    data : any = null;
    cellData : SkillInfo = null;  
    cellIdx : number = -1;  

    SkillSc: Skill = null;
  
    // LIFE-CYCLE CALLBACKS:

    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        if (index >= data.array.length) {
            //不显示
            this.cellData = null;  
            this.node.active = false;
            return;
        }

        //if(reload){
            this.data = data;   //{ array: list, target: x.js }
            this.cellIdx = index; 
            this.cellData = this.data.array[this.cellIdx];
            this.node.active = true;
        //}

        this.onSelected(this._selectState);

        if(this.SkillSc == null){
            let skillNode = cc.instantiate(ROOT_NODE.pfSkill);
            this.skillNode.addChild(skillNode);
            this.SkillSc = skillNode.getComponent(Skill);
        }
        this.SkillSc.initSkillByData(this.cellData);  //设置地块小球模型数据

        this.descLabel.string = this.cellData.skillCfg.desc;
    }

    onSelected(bSel){
        if(bSel){

        }else{

        }
    }

    //被点击时相应的方法
    clicked () {      
        this.onSelected(true);
    }
}
