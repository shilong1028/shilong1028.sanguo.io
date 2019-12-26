import { MyUserData } from "../manager/MyUserData";
import { SDKMgr } from "../manager/SDKManager";

//广告次数界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class AdResultDialog extends cc.Component {


    @property(cc.Label)
    timeLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    countLabel: cc.Label = null;

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
        this.timeLabel.string = "日期："+new Date().toDateString();   //toUTCString
        this.nameLabel.string = "昵称："+MyUserData.UserName;
        this.countLabel.string = "今日有效视频次数："+SDKMgr.adTotalCount;

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

    // update (dt) {}

    onCloseBtn(){
        this.node.removeFromParent(true);
    }

}
