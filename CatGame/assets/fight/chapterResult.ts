import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";
import { FightMgr } from "../manager/FightManager";
import { ChapterInfo } from "../manager/Enum";
import { MyUserDataMgr, MyUserData } from "../manager/MyUserData";
import { sdkWechat } from "../manager/SDK_Wechat";

//章节奖励
const {ccclass, property} = cc._decorator;

@ccclass
export default class ChapterResult extends cc.Component {

    @property(cc.Label)
    chapterLabel: cc.Label = null;

    @property(cc.Label)
    goldLabel: cc.Label = null;
    @property(cc.Label)
    diamondLabel: cc.Label = null;

    @property(cc.Button)
    vedioBtn: cc.Button = null;

    chapterInfo: ChapterInfo = null;
    diamondReward: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {
        let chapterId = FightMgr.level_info.levelCfg.chapterId;
        this.chapterInfo = new ChapterInfo(chapterId);

        this.chapterLabel.string = chapterId.toString();
        this.goldLabel.string ="+"+ this.chapterInfo.chapterCfg.gold;

        //首次通章奖励钻石
        if(chapterId == MyUserData.curChapterId){
            this.diamondReward = this.chapterInfo.chapterCfg.diamond;
            MyUserDataMgr.updateCurChapterId(chapterId+1);   //新的章节Id
        }else{
            this.diamondReward = Math.ceil(Math.random()/2*this.chapterInfo.chapterCfg.diamond);
        }
        this.diamondLabel.string = "+"+this.diamondReward;
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
                self.handleReward(2);
            }else{
                self.handleReward();
            }
        }, self);   //播放下载的视频广告 
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.handleReward();
    }

    handleReward(times: number=1){
        MyUserDataMgr.updateUserGold(this.chapterInfo.chapterCfg.gold * times);
        MyUserDataMgr.updateUserDiamond(this.diamondReward * times);

        this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
            GameMgr.gotoMainScene();
        })));
    }
}
