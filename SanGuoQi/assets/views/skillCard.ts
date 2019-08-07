import { SkillInfo, GeneralInfo } from "../manager/Enum";
import SkillLayer from "./skillLayer";
import { MyUserMgr } from "../manager/MyUserData";
import { ROOT_NODE } from "../common/rootNode";
import { GameMgr } from "../manager/GameManager";


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
    generalInfo: GeneralInfo = null;
    targetSc: SkillLayer = null;

    onLoad () {
        this.clearUI();
    }

    clearUI(){
        this.nameLabel.string = "";
        this.iconSpr.spriteFrame = null;
        this.addBtn.active = false;
        this.delBtn.active = false;
    }

    start () {

    }

    // update (dt) {}

    initGeneralSkill(skillInfo: SkillInfo, targetSc: SkillLayer, generalInfo: GeneralInfo){
        this.skillInfo = skillInfo;
        this.targetSc = targetSc;
        this.generalInfo = generalInfo;

        this.clearUI();

        if(skillInfo){
            this.delBtn.active = true;

            this.iconSpr.spriteFrame = this.targetSc.skillAtlas.getSpriteFrame(skillInfo.skillId.toString());
            this.nameLabel.string = skillInfo.skillCfg.name;
        }else{
            this.addBtn.active = true;

        }
    }

    //添加或删除武将技能
    handleChangeGeneralSkill(skillInfo: SkillInfo, bAdd:boolean){
        if(this.generalInfo){
            if(bAdd == true && this.generalInfo.skills.length < 3){   //添加
                MyUserMgr.updateUserDiamond(-skillInfo.skillCfg.cost);  //修改用户背包物品列表
                this.generalInfo.skills.push(skillInfo);
            }else if(bAdd == false){    //删除
                for(let i=0; i<this.generalInfo.skills.length; ++i){
                    if(skillInfo.skillId == this.generalInfo.skills[i].skillId){
                        this.generalInfo.skills.splice(i, 1);
                        break;
                    }
                }
            }
            MyUserMgr.saveGeneralList();
        }
    }

    onAddBtn(){
        let skillInfo = this.targetSc.selSkillInfo;
        if(skillInfo && skillInfo.skillCfg){
            ROOT_NODE.showTipsDialog("是否花费"+skillInfo.skillCfg.cost+"金锭来学习技能"+skillInfo.skillCfg.name, ()=>{
                this.handleChangeGeneralSkill(skillInfo, true);
                this.initGeneralSkill(skillInfo, this.targetSc, this.generalInfo);

                if(GameMgr.curTaskConf.type == 6){   //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗 6学习技能 7攻城掠地
                    GameMgr.handleStoryShowOver(GameMgr.curTaskConf);  //任务宣读(第一阶段）完毕处理
                }
            });
        }
    }

    onDelBtn(){
        if(this.skillInfo && this.skillInfo.skillCfg){
            ROOT_NODE.showTipsDialog("是否删除技能"+this.skillInfo.skillCfg.name, ()=>{
                this.handleChangeGeneralSkill(this.skillInfo, false);
                this.initGeneralSkill(null, this.targetSc, this.generalInfo);
            });
        }
    }
}
