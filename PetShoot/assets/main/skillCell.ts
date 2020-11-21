
import { SkillInfo } from "../manager/Enum";
import Skill from "../common/skill";
import { ROOT_NODE } from "../common/rootNode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillCell extends cc.Component {

    @property(cc.Sprite)
    cellBg: cc.Sprite = null;
    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Label)
    descLabel: cc.Label = null;

    @property([cc.SpriteFrame])
    bgFrames: cc.SpriteFrame[] = new Array(2);

    data : any = null;
    cellData : SkillInfo = null;  
    cellIdx : number = -1;  

    SkillSc: Skill = null;
  
    // LIFE-CYCLE CALLBACKS:

    //加载需要初始化数据时调用
    initCell (index, cellData: SkillInfo, target: any) {
        this.cellIdx = index;  
        this.cellData = cellData;

        if(this.cellIdx%2 == 0){
            this.cellBg.spriteFrame = this.bgFrames[0];
        }else{
            this.cellBg.spriteFrame = this.bgFrames[1];
        }

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
