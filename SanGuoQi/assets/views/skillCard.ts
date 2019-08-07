import { SkillInfo } from "../manager/Enum";
import SkillLayer from "./skillLayer";
import { MyUserMgr } from "../manager/MyUserData";


//技能展示卡
const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillCard extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;

    @property(cc.Node)
    addBtn: cc.Node = null;
    @property(cc.Node)
    delBtn: cc.Node = null;

    @property(cc.SpriteAtlas)
    skillAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:
    skillInfo: SkillInfo = null;
    targetSc: SkillLayer = null;

    onLoad () {
        this.nameLabel.string = "";
        this.iconSpr.spriteFrame = null;
        this.addBtn.active = false;
        this.delBtn.active = false;
    }

    start () {

    }

    // update (dt) {}

    initGeneralSkill(skillInfo: SkillInfo, targetSc: SkillLayer){
        this.skillInfo = skillInfo;
        this.targetSc = targetSc;
        this.addBtn.active = false;
        this.delBtn.active = false;

        if(skillInfo){
            //this.delBtn.active = true;

            this.iconSpr.spriteFrame = this.targetSc.skillAtlas.getSpriteFrame(skillInfo.skillId.toString());
            this.nameLabel.string = skillInfo.skillCfg.name;
        }else{
            this.addBtn.active = true;

        }
    }

    onAddBtn(){
        let skillInfo = this.targetSc.selSkillInfo;
        if(skillInfo && skillInfo.skillCfg){
            MyUserMgr.updateUserDiamond(-skillInfo.skillCfg.cost, true);  //修改用户背包物品列表

            this.initGeneralSkill(skillInfo, this.targetSc);

            this.targetSc.handleChangeGeneralSkill(skillInfo, true);
        }
    }

    onDelBtn(){

    }
}
