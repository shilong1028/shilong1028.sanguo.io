import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import { AudioMgr } from "../manager/AudioMgr";
import { MyUserDataMgr, MyUserData } from "../manager/MyUserData";
import Skill from "../common/skill";
import { CfgMgr } from "../manager/ConfigManager";
import { SkillInfo, ChapterInfo } from "../manager/Enum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FightResult extends cc.Component {

    @property(cc.Sprite)
    titleSpr: cc.Sprite = null;
    @property(cc.SpriteFrame)
    failFrame: cc.SpriteFrame = null;
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
    chapterNode: cc.Node = null;  //章节奖励总结的
    @property(cc.Node)
    goldNode: cc.Node = null;
    @property(cc.Label)
    goldLabel: cc.Label = null;
    @property(cc.Node)
    diamondNode: cc.Node = null;
    @property(cc.Label)
    diamondLabel: cc.Label = null;

    @property(cc.Node)
    okBtnNode: cc.Node = null;
    @property(cc.Node)
    skillNode: cc.Node = null;   //技能总节点
    @property([cc.Node])
    skillNodes: cc.Node[] = new Array(3);

    @property(cc.Prefab)
    pfSkill: cc.Prefab = null;  //技能图标

    rewardGold: number = 0;   //奖励金币
    bNextLevel: boolean = true;   //下一关

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.levelLabel.string = "";
    }

    start () {
        this.levelLabel.string = FightMgr.level_id.toString();  //第几关

        this.rewardGold = 0;   //奖励金币
        if(FightMgr.win == true){
            if(FightMgr.stars < 1){
                FightMgr.stars = 1;
            }

            let levelCfg = FightMgr.level_info.levelCfg;
            this.rewardGold = Math.ceil(levelCfg.gold * 0.5 * FightMgr.stars); //1星为75%，3星为150%

            let nextLevelCfg = CfgMgr.getLevelConf(FightMgr.level_id + 1);
            if(nextLevelCfg && nextLevelCfg.chapterId > levelCfg.chapterId){   //章节最后一关
                this.bNextLevel = false;
                this.skillNode.active = false;
                this.chapterNode.active = true;
                this.okBtnNode.active = true;

                let curChapterInfo = new ChapterInfo(levelCfg.chapterId);
                this.goldLabel.string ="+"+ curChapterInfo.chapterCfg.gold;
                MyUserDataMgr.updateUserGold(curChapterInfo.chapterCfg.gold);
                this.goldNode.x = 0;

                //首次通章奖励钻石
                if(levelCfg.chapterId == MyUserData.curChapterId){
                    this.goldNode.x = -120;
                    this.diamondNode.active = true;
                    this.diamondLabel.string = "+"+curChapterInfo.chapterCfg.diamond;

                    MyUserDataMgr.updateUserDiamond(curChapterInfo.chapterCfg.diamond);
                    MyUserDataMgr.updateCurChapterId(nextLevelCfg.chapterId);   //新的章节Id
                }
            }else{
                //添加技能
                for(let i=0; i<levelCfg.skillIds.length; ++i){
                    let skill = cc.instantiate(this.pfSkill);
                    this.skillNodes[i].addChild(skill);

                    let skillInfo = new SkillInfo(levelCfg.skillIds[i]);
                    skill.getComponent(Skill).initSkillByData(skillInfo);
                }
            }
        }else{
            this.titleSpr.spriteFrame = this.failFrame;
            FightMgr.stars = 0;
            this.skillNode.active = false;
            this.okBtnNode.active = true;
            this.okBtnNode.y = -180;
        }
        this.rewardLabel.string = "+"+GameMgr.num2e(this.rewardGold);
        MyUserDataMgr.updateUserGold(this.rewardGold);

        MyUserDataMgr.saveLevelFightInfo(FightMgr.level_id, FightMgr.win, FightMgr.stars);

        for(let i=0; i<3; ++i){
            if(i < FightMgr.stars){
                this.starSprs[i].spriteFrame = this.lightFrame;
            }else{
                this.starSprs[i].spriteFrame = this.grayFrame;
            }
        }
    }

    // update (dt) {}

    onSkillBtn(sender, parStr){
        AudioMgr.playEffect("effect/ui_click");
        let idx = parseInt(parStr);
        let skillId = FightMgr.level_info.levelCfg.skillIds[idx];
        if(skillId > 0){
            if(this.bNextLevel == true){
                FightMgr.getFightScene().addFightSkillById(skillId);
                
                this.node.removeFromParent(true);
                FightMgr.loadLevel(FightMgr.level_id+1, false);      //下一关
            }else{
                GameMgr.gotoMainScene();
            }
        }
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        GameMgr.gotoMainScene();
    }
}
