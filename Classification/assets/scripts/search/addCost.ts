import { GameMgr } from "../manager/GameManager";
import { SDKMgr } from "../manager/SDKManager";
import { sdkWechat } from "../manager/SDK_Wechat";


//积分获取界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class AddCost extends cc.Component {

    @property(cc.Node)
    bgImg: cc.Node = null;

    @property(cc.Node)
    touchNode: cc.Node = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    shareCost: number = 50;
    videoCost: number = 100;

    onLoad () {
        //this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);

        this.descLabel.string = "";
    }

    start () {
        this.descLabel.string = "分享可以获取"+this.shareCost+"积分，观看视频可以获取"+this.videoCost+"积分!";
    }

    // update (dt) {}

    touchEnd(event: cc.Touch){
        let pos1 = this.bgImg.convertToNodeSpace(event.getLocation());
        let rect1 = cc.rect(0, 0, this.bgImg.width, this.bgImg.height);
        if(!rect1.contains(pos1)){
            this.onCloseBtn();
        }
    }

    onCloseBtn(){
        this.node.removeFromParent(true);
    }

    onShareBtn(){
        SDKMgr.shareGame("分享！", (succ:boolean)=>{
            console.log("turntable 分享 succ = "+succ);
            if(succ == true){
                GameMgr.updateUserGold(this.shareCost);
            }
        }, this);

        this.node.removeFromParent(true);
    }

    onVedioBtn(){
        let self = this;
        sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", false, ()=>{
            console.log("turntable 激励视频广告显示失败");
        }, (succ:boolean)=>{
            console.log("turntable 激励视频广告正常播放结束 succ = "+succ);
            if(succ == true){
                GameMgr.updateUserGold(this.videoCost);
            }

            sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", true, ()=>{
                console.log("turntable 激励视频广告播放失败");
            }, null, self);   //预下载下一条视频广告
        }, self);   //播放下载的视频广告
        
        this.node.removeFromParent(true);
    }
}
