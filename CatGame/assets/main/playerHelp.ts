import { AudioMgr } from "../manager/AudioMgr";
import { PlayerInfo, SkillInfo } from "../manager/Enum";
import Skill from "../common/skill";


const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerHelp extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(cc.Label)
    atkLabel: cc.Label = null;
    @property(cc.Label)
    baojiLabel: cc.Label = null;
    @property(cc.Label)
    skillLabel: cc.Label = null;
    @property(cc.Node)
    skillNode: cc.Node = null;

    @property(cc.Prefab)
    pfSkill: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.nameLabel.string = "";
        this.descLabel.string = "";
        this.atkLabel.string = "";
        this.baojiLabel.string = "";
        this.skillLabel.string = "";

    }

    start () {

    }

    // update (dt) {}

    initPlayerInfo(playerInfo: PlayerInfo){
        this.nameLabel.string = playerInfo.playerCfg.name;
        this.descLabel.string = playerInfo.playerCfg.desc;
        this.atkLabel.string = "攻击：+"+playerInfo.playerCfg.attack_up*100 + "%";
        this.baojiLabel.string = "暴击：+"+playerInfo.playerCfg.baoji_up*100 + "%";

        let skillId = playerInfo.playerCfg.skillId;
        if(skillId > 0){
            let skillInfo = new SkillInfo(skillId);
            this.skillLabel.string = skillInfo.skillCfg.desc;
            
            let nodeSkill = cc.instantiate(this.pfSkill)
            this.skillNode.addChild(nodeSkill);
            nodeSkill.getComponent(Skill).initSkillByData(skillInfo);
        }
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.node.removeFromParent(true);
    }
}
