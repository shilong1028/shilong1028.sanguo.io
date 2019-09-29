import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import { AudioMgr } from "../manager/AudioMgr";
import { MyUserDataMgr, MyUserData } from "../manager/MyUserData";
import { SDKMgr } from "../manager/SDKManager";
import { TipsStrDef, ChapterInfo, SkillInfo } from "../manager/Enum";
import { sdkWechat } from "../manager/SDK_Wechat";
import Item from "../common/item";
import Skill from "../common/skill";
import { CfgMgr } from "../manager/ConfigManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FightResult extends cc.Component {

    @property(cc.Label)
    titleLabel: cc.Label = null;
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(cc.Label)
    rewardLabel: cc.Label = null;   //奖励数量

    @property([cc.Sprite])
    starSprs: cc.Sprite[] = new Array(3);
    @property(cc.SpriteFrame)
    grayFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    lightFrame: cc.SpriteFrame = null;

    @property(cc.Node)
    itemLayout: cc.Node = null;  //道具掉落
    @property(cc.Prefab)
    pfItem: cc.Prefab = null;  //道具
    @property(cc.Prefab)
    pfSkill: cc.Prefab = null;  //技能图标

    rewardGold: number = 0;   //奖励金币

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.levelLabel.string = "";
        this.titleLabel.string = "";
    }

    start () {
        this.levelLabel.string = FightMgr.level_id.toString();  //第几关

        let stars = 0;
        this.rewardGold = 0;   //奖励金币
        if(FightMgr.win == true){
            this.titleLabel.string = "战斗胜利";
            stars = Math.ceil(0.01 + Math.random()*2.98);

            let nextLevelCfg = CfgMgr.getLevelConf(FightMgr.level_id + 1);
            if(nextLevelCfg && nextLevelCfg.chapterId > MyUserData.curChapterId){
                MyUserDataMgr.updateCurChapterId(nextLevelCfg.chapterId);   //新的章节Id
            }

            let levelCfg = FightMgr.level_info.levelCfg;
            this.rewardGold = Math.ceil(levelCfg.gold * 0.5 * stars); //1星为75%，3星为150%
             //添加技能
            for(let i=0; i<levelCfg.skillIds.length; ++i){
                let skill = cc.instantiate(this.pfSkill);
                this.itemLayout.addChild(skill);

                let skillInfo = new SkillInfo(levelCfg.skillIds[i]);
                skill.getComponent(Skill).initSkillByData(skillInfo);
            }
        }else{
            this.titleLabel.string = "战斗失败";
        }
        this.rewardLabel.string = "+"+GameMgr.num2e(this.rewardGold);
        MyUserDataMgr.saveLevelFightInfo(FightMgr.level_id, FightMgr.win, stars);

        for(let i=0; i<3; ++i){
            if(i < stars){
                this.starSprs[i].spriteFrame = this.lightFrame;
            }else{
                this.starSprs[i].spriteFrame = this.grayFrame;
            }
        }
    }

    // update (dt) {}

    onBackBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.handleNormal(false);
    }

    //复活或显示结算
    handleNormal(bNext:boolean=true){
        MyUserDataMgr.updateUserGold(this.rewardGold);
        if(bNext == true){
            this.node.removeFromParent(true);
            FightMgr.loadLevel(FightMgr.level_id+1, false);      //下一关
        }else{
            GameMgr.gotoMainScene();
        }
    }
}
