import { LevelInfo, NoticeType, TipsStrDef } from "../manager/Enum";
import { NotificationMy } from "../manager/NoticeManager";
import { SDKMgr } from "../manager/SDKManager";
import { sdkWechat } from "../manager/SDK_Wechat";
import { FightMgr } from "../manager/FightManager";
import { AudioMgr } from "../manager/AudioMgr";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { ROOT_NODE } from "../common/rootNode";


//复活界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class FightRenew extends cc.Component {

    @property(cc.Button)
    vedioBtn: cc.Button = null;
    @property(cc.Node)
    videoIcon: cc.Node = null;
    @property(cc.Node)
    shareIcon: cc.Node = null;
    
    @property(cc.Label)
    progressLabel: cc.Label = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    goldNum: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    levelInfo: LevelInfo = null;   //关卡信息
    proTime: number = 5;  //倒计时时间

    bVideoPlaying: boolean = false;   //视频播放中
    bVideoPlaySucc: boolean = false;   //视频是否播放完毕

    onLoad () {
        this.progressLabel.string = "5s";
        this.progressBar.progress = 100;

        if(false){ 
            this.videoIcon.active = true;
            this.shareIcon.active = false;
        }else{
            this.videoIcon.active = false;
            this.shareIcon.active = true;
        }
    }

    start () {
        this.goldNum.string = FightMgr.level_info.levelCfg.cost;
    }

    update (dt) {
        if(this.proTime > 0){
            this.proTime -= dt;
            if(this.proTime < 0){
                this.proTime = 0;
                //console.log("倒计时结束, this.bVideoPlaying = "+this.bVideoPlaying+"; this.bVideoPlaySucc = "+this.bVideoPlaySucc);
                if(this.bVideoPlaying == false){
                    this.handleNormal(this.bVideoPlaySucc);  //复活或显示结算
                }
                return;
            }
            this.progressLabel.string = ""+Math.ceil(this.proTime)+"s";
            this.progressBar.progress = this.proTime/5.0;
        }
    }

    /**金币复活 */
    onGoldBtn(){
        AudioMgr.playEffect("effect/ui_click");
        if(MyUserData.GoldCount >= FightMgr.level_info.levelCfg.cost){
            MyUserDataMgr.updateUserGold(-FightMgr.level_info.levelCfg.cost);
            this.handleNormal(true);  //复活或显示结算
        }else{
            ROOT_NODE.showTipsText("金币不足！");
        }
    }

    /**看视频复活 */
    onVedioBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.vedioBtn.interactable = false; 
        this.bVideoPlaying = true;   //视频播放中

        let self = this;
        if(this.shareIcon.active == true){
            SDKMgr.shareGame(TipsStrDef.KEY_Share, (succ:boolean)=>{
                console.log("reset 分享 succ = "+succ);
                self.bVideoPlaying = false;   //视频播放中
                if(succ == true){
                    self.bVideoPlaySucc = true;   //视频是否播放完毕
                    if(self.proTime <= 0){
                        self.handleNormal(true);  //复活或显示结算
                    }
                }else{
                    if(self.proTime <= 0){
                        self.handleNormal(false);
                    }
                }
            },self);
        }else{
            sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", false, ()=>{
                console.log("reset 激励视频广告显示失败");
            }, (succ:boolean)=>{
                console.log("reset 激励视频广告正常播放结束， succ = "+succ+"; self.proTime = "+self.proTime);

                self.bVideoPlaying = false;   //视频播放中
                if(succ == true){
                    self.bVideoPlaySucc = true;   //视频是否播放完毕
                    if(self.proTime <= 0){
                        sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", true, null, null, self);   //预下载下一条视频广告
                        self.handleNormal(true);  //复活或显示结算
                    }else{
                        sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", true, null, null, self);   //预下载下一条视频广告
                    }
                }else{
                    sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", true, null, null, self);   //预下载下一条视频广告
                    if(self.proTime <= 0){
                        self.handleNormal(false);
                    }
                }
            }, self);   //播放下载的视频广告
        }
    }

    /**跳过 */
    onSkipBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.handleNormal(false);  //复活或显示结算
    }

    //复活或显示结算
    handleNormal(bReNew:boolean){
        if(bReNew == true){
            NotificationMy.emit(NoticeType.GemaRevive, null);   //复活，将最下三层砖块消除   
        }else{
            FightMgr.getFightScene().showFightOverInfo();   //结算界面
        }
        this.node.removeFromParent(true);
    }
}
