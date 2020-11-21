import TableView from "../tableView/tableView";
import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";
import { SkillInfo, TipsStrDef } from "../manager/Enum";
import { FightMgr } from "../manager/FightManager";
import { SDKMgr } from "../manager/SDKManager";
import { ROOT_NODE } from "../common/rootNode";

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
    @property(TableView)
    tableView: TableView = null;

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
        let skillList = [];
        for(let i=1; i<= GameMgr.SkillCount; ++i){
            skillList.push(new SkillInfo(i));
        }
        this.tableView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
        this.tableView.initTableView(skillList.length, { array: skillList, target: this}); 

        FightMgr.getFightScene().bShowBeginReward = false;   //该章节战斗不在显示开局奖励
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
