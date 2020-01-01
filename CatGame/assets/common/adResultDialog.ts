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

    @property(cc.Label)
    autoAdLabel: cc.Label = null;
    @property(cc.Label)
    countEncode: cc.Label = null;

    @property([cc.Label])
    adLabels: cc.Label[] = [];

    // LIFE-CYCLE CALLBACKS:


    onLoad () {
        this.timeLabel.string = "";
        this.nameLabel.string = "";
        this.countLabel.string = "";

        for(let i=0; i<6; ++i){
            this.adLabels[i].string = "";
        }
    }

    start () {
        let dataStr = new Date().toDateString();
        this.timeLabel.string = "日期："+dataStr;   //toUTCString
        this.timeEncode.string = Md5.str_md5(dataStr);   //btoa加密
        this.nameLabel.string = "昵称："+MyUserData.UserName;

        this.updateAdDataLabel();
    }

    update(dt){
        if(SDKMgr.autoAdTime > 0){
            SDKMgr.autoAdTime -= dt;
            if(SDKMgr.autoAdTime <= 0){
                SDKMgr.autoAdTime = 0;
                this.adTimeLabel.string = "";
            }else{
                this.adTimeLabel.string = SDKMgr.autoAdTime.toFixed(3);
            }
        }
    }

    updateAdDataLabel(){
        if(SDKMgr.bAutoPlayVedio != true){
            this.autoAdLabel.string = "自动播放视频";
        }else{
            this.autoAdLabel.string = "关闭自动视频";
        }

        this.countLabel.string = "总次数："+SDKMgr.adTotalCount;
        this.countEncode.string = Md5.str_md5(SDKMgr.adTotalCount.toString());

        let adKeys = [
            "ChapterVedioId",
            "FuhuoVedioId",
            "KaijuVedioId",
            "UpLvVedioId",
            "ShopVedioId",
            "GoldVedioId"
        ]

        for(let i=0; i<6; ++i){
            let adkey = adKeys[i];
            this.adLabels[i].string = adkey+"视频次数："+SDKMgr.adDayCounts[adkey];
        }
    }

    onAutoAdBtn(){
        AudioMgr.playEffect("effect/ui_click");

        if(SDKMgr.bAutoPlayVedio != true){
            this.autoAdLabel.string = "关闭自动视频";
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
