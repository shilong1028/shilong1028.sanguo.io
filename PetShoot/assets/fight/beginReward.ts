
import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";
import { SkillInfo, TipsStrDef } from "../manager/Enum";
import { FightMgr } from "../manager/FightManager";
import { SDKMgr } from "../manager/SDKManager";
import { ROOT_NODE } from "../common/rootNode";
import List from "../manager/List";
import FightSkillCell from "./fightSkillCell";

//开局奖励
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    vedioBtn: cc.Button = null;
    @property(cc.Button)
    shareBtn: cc.Button = null;

    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(List)
    listView: List = null;

    skillList:SkillInfo[] = [];
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.descLabel.string = "";
        if(SDKMgr.bShowVedioBtn){   //显示视频或分享按钮)
            this.vedioBtn.interactable = true; 
            this.vedioBtn.node.active = true;
            this.shareBtn.node.active = false; 
        }else{
            this.shareBtn.interactable = true; 
            this.shareBtn.node.active = true;
            this.vedioBtn.node.active = false; 
        }
    }

    start () {
        this.skillList = [];
        for(let i=1; i<= GameMgr.SkillCount; ++i){
            this.skillList.push(new SkillInfo(i));
        }
        this.listView.numItems = this.skillList.length;
        this.listView.selectedId = 0;

        FightMgr.getFightScene().bShowBeginReward = false;   //该章节战斗不在显示开局奖励
    }

    //列表渲染器
    onListRender(item: cc.Node, idx: number) {
        if(item){
            let info = this.skillList[idx];
            item.getComponent(FightSkillCell).initCell(idx, info, this);
        }
    }

    //当列表项被选择...
    onListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!item)
            return;
        item.getComponent(FightSkillCell).onSelected(true);
    }  

    handleSelCell(cellIdx: number, skillInfo: SkillInfo){
        this.descLabel.string = skillInfo.skillCfg.desc;
    }

    // update (dt) {}


    /**看视频 */
    onVedioBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.vedioBtn.interactable = false; 

        SDKMgr.showVedioAd("KaijuVedioId", ()=>{
            this.vedioBtn.interactable = true; 
            //this.handleReward();   //失败
        }, ()=>{
            this.handleReward(true);    //成功
        });  
    }

    onShareBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.shareBtn.interactable = false; 

        SDKMgr.shareGame(TipsStrDef.KEY_Share, (succ:boolean)=>{
            this.shareBtn.interactable = true; 
            this.handleReward(true);    //成功
        }, this);
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.handleReward();
    }

    handleReward(bVedio: boolean=false){
        let skillId = Math.floor(Math.random()*GameMgr.SkillCount*0.99)+1;
        FightMgr.getFightScene().addFightSkillById(skillId);
        FightMgr.getFightScene().handleStartFight();

        if(bVedio == true){
            let skillInfo = new SkillInfo(skillId);
            ROOT_NODE.showTipsText("获得开局技能："+skillInfo.skillCfg.name);
            GameMgr.showRewardsDialog(0, 0, null, null, null, [skillInfo]);
        }

        this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
            this.node.destroy();
        }.bind(this))));
    }
}
