import TableView from "../tableView/tableView";
import { AudioMgr } from "../manager/AudioMgr";
import { sdkWechat } from "../manager/SDK_Wechat";
import { GameMgr } from "../manager/GameManager";
import { SkillInfo } from "../manager/Enum";
import { FightMgr } from "../manager/FightManager";

//开局奖励
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    vedioBtn: cc.Button = null;

    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(TableView)
    tableView: TableView = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.descLabel.string = "";
    }

    start () {
        let skillList = new Array();
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


    /**看视频复活 */
    onVedioBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.vedioBtn.interactable = false; 
        let self = this;
        sdkWechat.preLoadAndPlayVideoAd(false, ()=>{
            //console.log("reset 激励视频广告显示失败");
            self.handleReward();
        }, (succ:boolean)=>{
            //console.log("reset 激励视频广告正常播放结束， succ = "+succ+"; self.proTime = "+self.proTime);
            sdkWechat.preLoadAndPlayVideoAd(true, null, null, self);   //预下载下一条视频广告
            if(succ == true){
                self.handleReward(true);
            }else{
                self.handleReward();
            }
        }, self);   //播放下载的视频广告 
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.handleReward();
    }

    handleReward(bVedio: boolean=false){
        let skillId = Math.floor(Math.random()*GameMgr.SkillCount*0.99)+1;
        FightMgr.getFightScene().addFightSkillById(skillId);

        this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
            this.node.removeFromParent(true);
        }.bind(this))));
    }
}
