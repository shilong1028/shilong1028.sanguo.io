
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
    @property(cc.Label)
    descLabel: cc.Label = null;

    descStr: string = "      联萌大作战是一款休闲弹射类小游戏。游戏背景为小猫的伙伴小鸡仔被老鹰叼走了，小猫为了救回小鸡仔，开始联络伙伴小狗、小鸽子等组建救援小队。\
    救援小队从主人房间出发，经历别墅、城市、郊野、丛林、火山、沙漠、雪山等困境，最后到达老鹰老巢，战斗并救回小鸡仔。";
    curDescStrIdx: number = 0;
    bUpdateStr: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        GameMgr.adaptBgByScene();   //场景背景图适配
        this.btnNode.active = false;
        this.descLabel.string = "";
    }

    start () {
        if(LDMgr.getItemInt(LDKey.KEY_NewUser) == 0){  //新用户 
            MyUserDataMgr.clearUserData();
        }else{
            MyUserDataMgr.initUserData();    //初始化用户信息
        }
        this.btnNode.active = true;
        this.bUpdateStr = true;

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
