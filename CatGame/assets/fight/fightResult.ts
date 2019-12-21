import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import { AudioMgr } from "../manager/AudioMgr";
import { MyUserDataMgr } from "../manager/MyUserData";
import Skill from "../common/skill";
import { CfgMgr } from "../manager/ConfigManager";
import { SkillInfo } from "../manager/Enum";
import { ROOT_NODE } from "../common/rootNode";
import { GuideMgr, GuideStepEnum } from "../manager/GuideMgr";

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
    @property(cc.Node)
    failTips: cc.Node = null;   //失败提示

    @property([cc.Sprite])
    starSprs: cc.Sprite[] = new Array(3);
    @property(cc.SpriteFrame)
    grayFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    lightFrame: cc.SpriteFrame = null;

    @property(cc.Node)
    okBtnNode: cc.Node = null;
    @property(cc.Node)
    skillNode: cc.Node = null;   //技能总节点
    @property([cc.Node])
    skillNodes: cc.Node[] = new Array(3);

    @property(cc.Prefab)
    pfChapterResult: cc.Prefab = null;

    rewardGold: number = 0;   //奖励金币
    bNextLevel: boolean = true;   //下一关

    skillIdArr: number[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.levelLabel.string = "";
        this.failTips.active = false;
        this.okBtnNode.active = false;
    }

    onDestroy(){
        console.log("fightresult destory")
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
            ROOT_NODE.showTipsText("获得金币："+this.rewardGold);

            let nextLevelCfg = CfgMgr.getLevelConf(FightMgr.level_id + 1);
            if(nextLevelCfg && nextLevelCfg.chapterId > levelCfg.chapterId){   //章节最后一关
                this.bNextLevel = false;
                this.skillNode.active = false;
                this.okBtnNode.active = true;
            }else{
                //添加技能
                while(this.skillIdArr.length < 3){
                    let skillId = Math.ceil(Math.random()*GameMgr.SkillCount);
                    if(skillId == 0){
                        skillId = 1;
                    }
                    let bInsert = true;
                    for(let i=0; i<this.skillIdArr.length; ++i){
                        if(this.skillIdArr[i] == skillId){
                            bInsert = false;
                        }
                    }
                    if(bInsert == true){
                        this.skillIdArr.push(skillId);
                    }
                }

                for(let i=0; i<this.skillIdArr.length; ++i){
                    let skill = cc.instantiate(ROOT_NODE.pfSkill);
                    this.skillNodes[i].addChild(skill);

                    let skillInfo = new SkillInfo(this.skillIdArr[i]);
                    skill.getComponent(Skill).initSkillByData(skillInfo);
                }

                if(GuideMgr.checkGuide_NewPlayer(GuideStepEnum.Fight_Guide_Step3, this.guideFightSkill, this) == false){  //选择新战斗技能，并继续下一关。
                }
            }
        }else{
            this.titleSpr.spriteFrame = this.failFrame;
            FightMgr.stars = 0;
            this.skillNode.active = false;
            this.failTips.active = true;
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

    guideFightSkill(step: GuideStepEnum){
        GuideMgr.showGuideLayer(this.skillNodes[1], ()=>{
            GuideMgr.endGuide_NewPlayer(step);
            this.handleSelSkill(1);
        });
    }

    // update (dt) {}

    onSkillBtn(sender, parStr){
        AudioMgr.playEffect("effect/ui_click");
        let idx = parseInt(parStr);
        this.handleSelSkill(idx);
    }

    handleSelSkill(idx: number){
        let skillId = this.skillIdArr[idx];
        if(skillId > 0){
            if(this.bNextLevel == true){
                FightMgr.getFightScene().addFightSkillById(skillId);
                
                this.node.removeFromParent(true);
                FightMgr.loadLevel(FightMgr.level_id+1, false);      //下一关
            }else{
                FightMgr.getFightScene().exitFightScene();
            }
        }
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        
        if(FightMgr.win == true && this.bNextLevel == false){
            GameMgr.showLayer(this.pfChapterResult);
            this.node.removeFromParent(true);
        }else{
            FightMgr.getFightScene().exitFightScene();
        }
    }
}
