import { SkillInfo } from "../manager/Enum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Skill extends cc.Component {

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Sprite)
    qualitySpr: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:
    skillInfo: SkillInfo = null;

    onLoad () {
        this.iconSpr.spriteFrame = null;
        this.nameLabel.string = "";
    }

    start () {

    }

    // update (dt) {}

    initSkillByData(skillInfo: SkillInfo){
        this.skillInfo = skillInfo;
        this.iconSpr.spriteFrame = this.iconAtlas.getSpriteFrame("skill_"+this.skillInfo.skillId);
        this.nameLabel.string = skillInfo.skillCfg.name;
        this.qualitySpr.spriteFrame = this.iconAtlas.getSpriteFrame("colorBg_"+this.skillInfo.skillLv);
    }
}
