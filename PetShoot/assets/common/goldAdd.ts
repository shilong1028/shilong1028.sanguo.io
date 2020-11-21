import { AudioMgr } from "../manager/AudioMgr";
import { SDKMgr } from "../manager/SDKManager";
import { MyUserDataMgr } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";
import { ROOT_NODE } from "./rootNode";
import { TipsStrDef } from "../manager/Enum";

//获得界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class GoldAdd extends cc.Component {

    @property(cc.Button)
    vedioBtn: cc.Button = null;
    @property(cc.Button)
    shareBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(SDKMgr.bShowVedioBtn){   //显示视频或分享按钮)
            this.vedioBtn.interactable = true; 
            this.vedioBtn.node.active = true;
            this.shareBtn.node.active = false; 
        }else{
            this.shareBtn.interactable = true; 
            this.shareBtn.node.active = true;
            this.vedioBtn.node.active = false; 
        }
    }

    start () {
    }

    update (dt) {
    }

    /**看视频 */
    onVedioBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.vedioBtn.interactable = false; 

        SDKMgr.showVedioAd("GoldVedioId", ()=>{
            this.vedioBtn.interactable = true; 
        }, ()=>{
            this.handleVedioSucc(500, 20);    //成功
        });  
    }

    onShareBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.shareBtn.interactable = false; 

        SDKMgr.shareGame(TipsStrDef.KEY_Share, (succ:boolean)=>{

            this.shareBtn.interactable = true; 
            this.handleVedioSucc(200, 5);    //成功
        }, this);
    }

    /**跳过 */
    onSkipBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.node.destroy();
    }

    //复活或显示结算
    handleVedioSucc(gold:number, diamond:number){
        /**
         * 游戏中 1钻石 = 100金币
         * 一次分享最多可以获得5个钻石和200金币
         * 一次视频最多可以获得20个钻石和500金币
         */
        gold = Math.floor((Math.random()*0.5 + 0.5)*gold);
        MyUserDataMgr.updateUserGold(gold);
        diamond = Math.floor((Math.random()*0.5 + 0.5)*diamond);
        MyUserDataMgr.updateUserDiamond(diamond);

        ROOT_NODE.showTipsText("获得金币："+gold);
        ROOT_NODE.showTipsText("获得钻石："+diamond);

        GameMgr.showRewardsDialog(gold, diamond);
        this.node.destroy();
    }
}
