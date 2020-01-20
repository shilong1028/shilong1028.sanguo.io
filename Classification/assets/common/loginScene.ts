
import { GameMgr } from "../manager/GameManager";
import { MyUserDataMgr } from "../manager/MyUserData";
import { LDMgr, LDKey } from "../manager/StorageManager";
import { SDKMgr } from "../manager/SDKManager";
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

    descStr: string = "     《垃圾查询游戏》是一款提供垃圾分类查询功能，以及包含多个垃圾分类或识别小游戏的休闲手机游戏。简单易上手的游戏操作，无论何时何地，拿出手机点击屏幕便可查询手中垃圾需要丢弃到那个垃圾桶中，不用再被怎么丢垃圾而苦恼。";
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
        GameMgr.gotoSearchScene();   //进入主场景
    }

    onResetGame(){
        AudioMgr.playEffect("effect/ui_click");
        GameMgr.showTipsDialog("是否清除所有游戏重新开始？", ()=>{
            this.btnNode.active = false;
            MyUserDataMgr.clearUserData();   //清除所有用户数据
            GameMgr.gotoSearchScene();   //进入主场景
        });
    }
}
