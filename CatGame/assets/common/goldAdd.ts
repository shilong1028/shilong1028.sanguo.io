import { AudioMgr } from "../manager/AudioMgr";
import { SDKMgr } from "../manager/SDKManager";
import { TipsStrDef } from "../manager/Enum";
import { sdkWechat } from "../manager/SDK_Wechat";
import { MyUserDataMgr } from "../manager/MyUserData";

//获得界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class GoldAdd extends cc.Component {

    @property(cc.Button)
    vedioBtn: cc.Button = null;
    @property(cc.Node)
    videoIcon: cc.Node = null;
    @property(cc.Node)
    shareIcon: cc.Node = null;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(false){ 
            this.videoIcon.active = true;
            this.shareIcon.active = false;
        }else{
            this.videoIcon.active = false;
            this.shareIcon.active = true;
        }
    }

    start () {
    }

    update (dt) {
    }

    /**看视频复活 */
    onVedioBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.vedioBtn.interactable = false; 

        let self = this;
        if(this.shareIcon.active == true){
            SDKMgr.shareGame(TipsStrDef.KEY_Share, (succ:boolean)=>{
                console.log("reset 分享 succ = "+succ);
                if(succ == true){
                    self.handleNormal(100);  //复活或显示结算
                }else{
                    self.handleNormal(0);
                }
            },self);
        }else{
            sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", false, ()=>{
                console.log("reset 激励视频广告显示失败");
            }, (succ:boolean)=>{
                console.log("reset 激励视频广告正常播放结束， succ = "+succ);
                if(succ == true){
                    sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", true, null, null, self);   //预下载下一条视频广告
                    self.handleNormal(200);  //复活或显示结算
                }else{
                    sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", true, null, null, self);   //预下载下一条视频广告
                    self.handleNormal(0);
                }
            }, self);   //播放下载的视频广告
        }
    }

    /**跳过 */
    onSkipBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.handleNormal(0);  //复活或显示结算
    }

    //复活或显示结算
    handleNormal(gold: number){
        if(gold > 0){
            MyUserDataMgr.updateUserGold(gold);
        }
        this.node.removeFromParent(true);
    }
}
