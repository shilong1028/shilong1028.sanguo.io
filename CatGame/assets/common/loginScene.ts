
import { GameMgr } from "../manager/GameManager";
import { ROOT_NODE } from "./rootNode";
import { MyUserDataMgr } from "../manager/MyUserData";
import { LDMgr, LDKey } from "../manager/StorageManager";
import { SDKMgr } from "../manager/SDKManager";
import { sdkWechat } from "../manager/SDK_Wechat";
import { AudioMgr } from "../manager/AudioMgr";

//初始场景，用于初始化加载数据
const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScene extends cc.Component {
    @property(cc.Node)
    btnNode: cc.Node = null;
    @property(cc.Node)
    beginNode: cc.Node = null;
    @property(cc.Label)
    descLabel: cc.Label = null;

    descStr: string = "      《联萌大作战》是一款停不下来的手绘风弹射消除类的休闲游戏。玩家可以选择不同的萌宠，携带不同的武器和饰品，来参加战斗。战斗中，可以拖动发射方向，弹射小球砸向敌方砖块。打击砖块美妙的钢琴音效，加上爽爆的小球弹射，会让你对这款游戏爱不释手。";
    curDescStrIdx: number = 0;
    bUpdateStr: boolean = false;

    touchIconCount = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        GameMgr.adaptBgByScene();   //场景背景图适配
        this.beginNode.active = false;
        this.descLabel.string = "";
    }

    start () {
        if(LDMgr.getItemInt(LDKey.KEY_NewUser) == 0){  //新用户 
            MyUserDataMgr.clearUserData();
        }else{
            MyUserDataMgr.initUserData();    //初始化用户信息
        }
        this.bUpdateStr = true;
        this.beginNode.active = true;

        SDKMgr.createrBannerAd();   //创建Banner
    }

    update (dt) {
        if(this.bUpdateStr == true){
            this.curDescStrIdx ++;
            if(this.curDescStrIdx >= this.descStr.length){
                this.descLabel.string = this.descStr;
                this.bUpdateStr = false;
            }else{
                let str = this.descStr.substr(0, this.curDescStrIdx);  
                //substr(start,length)表示从start位置开始，截取length长度的字符串。
                //substring(start,end)表示从start到end之间的字符串，包括start位置的字符但是不包括end位置的字符。
                this.descLabel.string = str;
            }
        }
    }

    onIconBtn(){
        // this.touchIconCount ++;
        // if(this.touchIconCount == 10){
        //     if(this.btnNode.active == true){   //已经开启重启界面，这次开启视频商城
        //         SDKMgr.bOpenVedioShop = true;
        //     }else{
        //         this.btnNode.active = true;
        //         this.beginNode.active = false;
        //     }
        //     this.touchIconCount = 0;
        // }
    }

    onLoginGame(){
        AudioMgr.playEffect("effect/ui_click");
        this.btnNode.active = false;
        GameMgr.gotoMainScene();   //进入主场景
    }

    onResetGame(){
        AudioMgr.playEffect("effect/ui_click");
        GameMgr.showTipsDialog("是否清除所有游戏重新开始？", ()=>{
            this.btnNode.active = false;
            MyUserDataMgr.clearUserData();   //清除所有用户数据
            GameMgr.gotoMainScene();   //进入主场景
        });
    }
}
