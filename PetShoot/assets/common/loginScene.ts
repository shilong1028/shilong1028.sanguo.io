
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

    descStr: string = "你有一只小猫咪，天天带它去打鸡。\n鸡飞狗跳获金币，购得猫粮养身体。\n一顿不吃饿得慌，三天不吃要重启。\n养完猫咪换小狗，朋友圈里抢第一。";
    curDescStrIdx: number = 0;
    bUpdateStr: boolean = false;

    touchIconCount = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
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

        if(SDKMgr.isSDK){
            this.beginNode.active = true;
            this.btnNode.active = false;   //测试重置按钮
            SDKMgr.createrBannerAd();   //创建Banner
        }else{
            this.btnNode.active = true;   //测试重置按钮
        }
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
        this.btnNode.active = false;   //测试重置按钮
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
