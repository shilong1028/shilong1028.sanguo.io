import { MyUserData } from "../manager/MyUserData";
import { SDKMgr } from "../manager/SDKManager";
import { AudioMgr } from "../manager/AudioMgr";
import { Md5 } from "../manager/Md5";

//广告次数界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class AdResultDialog extends cc.Component {

    @property(cc.Label)
    timeLabel: cc.Label = null;
    @property(cc.Label)
    timeEncode: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    countLabel: cc.Label = null;
    @property(cc.Label)
    adTimeLabel: cc.Label = null;

    @property(cc.Node)
    autobtnNode: cc.Node = null;
    @property(cc.Label)
    autoAdLabel: cc.Label = null;
    @property(cc.Label)
    countEncode: cc.Label = null;

    @property([cc.Label])
    adLabels: cc.Label[] = [];

    // LIFE-CYCLE CALLBACKS:


    onLoad () {
        let maskBg = this.node.getChildByName("maskBg");
        if(maskBg){
            maskBg.width = cc.winSize.width;
            maskBg.height = cc.winSize.height;
        }

        this.timeLabel.string = "";
        this.nameLabel.string = "";
        this.countLabel.string = "";

        for(let i=0; i<6; ++i){
            this.adLabels[i].string = "";
        }
    }

    start () {
        let dataStr = new Date().toDateString();
        if(SDKMgr.WeiChat){
            this.timeLabel.string = "WX日期："+dataStr;   //toUTCString
        }else if(SDKMgr.TT){
            this.timeLabel.string = "TT日期："+dataStr;   //toUTCString
        }else{
            this.timeLabel.string = "日期："+dataStr;   //toUTCString
        }
        this.timeEncode.string = Md5.MD5_NEW(dataStr);   //btoa加密
        this.nameLabel.string = "昵称："+MyUserData.UserName;

        this.updateAdDataLabel();
    }

    update(dt){
        if(SDKMgr.autoAdTime > 0){
            SDKMgr.autoAdTime -= dt;
            if(SDKMgr.autoAdTime <= 0.1){
                SDKMgr.autoAdTime = 0;
                this.adTimeLabel.string = "";
                SDKMgr.autoPlayAdVedio();
            }else{
                this.adTimeLabel.string = SDKMgr.autoAdTime.toFixed(3);
            }
        }
    }

    updateAdDataLabel(){
        if(SDKMgr.bAutoPlayVedio != true){
            if(SDKMgr.canPlayAdByCount() == false){
                this.autoAdLabel.string = "今日视频次数已达最大限度，请明日再来！";
                this.autobtnNode.active = false;
            }else{
                this.autoAdLabel.string = "";
                this.autobtnNode.active = true;
            }
        }else{
            this.autoAdLabel.string = "自动视频播放中...";
            this.autobtnNode.active = false;
        }

        this.countLabel.string = "总次数："+SDKMgr.adTotalCount;
        this.countEncode.string = Md5.MD5_NEW(SDKMgr.adTotalCount.toString());

        let adKeys = [
            "ChapterVedioId",
            "FuhuoVedioId",
            "KaijuVedioId",
            "UpLvVedioId",
            "ShopVedioId",
            "GoldVedioId",
            "SignVedioId"
        ]

        for(let i=0; i<adKeys.length; ++i){
            let adkey = adKeys[i];
            this.adLabels[i].string = adkey+"视频次数："+SDKMgr.adDayCounts[adkey];
        }
    }

    onAutoAdBtn(){
        AudioMgr.playEffect("effect/ui_click");

        if(SDKMgr.bAutoPlayVedio != true){
            this.autoAdLabel.string = "自动视频播放中...";
            this.autobtnNode.active = false;
            SDKMgr.autoPlayAdVedio();
        }else{
            SDKMgr.closeAutoPlayAdVedio();
        }
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        
        SDKMgr.closeAutoPlayAdVedio();
        this.node.removeFromParent(true);
    }

}
