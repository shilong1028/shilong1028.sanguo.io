import { AudioMgr } from "../manager/AudioMgr";
import { SDKMgr } from "../manager/SDKManager";
import { MyUserDataMgr } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";
import { ROOT_NODE } from "./rootNode";

//获得界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class GoldAdd extends cc.Component {

    @property(cc.Button)
    vedioBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
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
            this.handleVedioSucc();    //成功
        });  
    }

    /**跳过 */
    onSkipBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.node.destroy();
    }

    //复活或显示结算
    handleVedioSucc(){
        /**
         * 游戏中 1钻石 = 100金币
         * 一次分享最多可以获得5个钻石和200金币
         * 一次视频最多可以获得20个钻石和500金币
         */
        let gold = Math.floor((Math.random()*0.5 + 0.5)*500);
        MyUserDataMgr.updateUserGold(gold);
        let diamond = Math.floor((Math.random()*0.5 + 0.5)*20);
        MyUserDataMgr.updateUserDiamond(diamond);

        ROOT_NODE.showTipsText("获得金币："+gold);
        ROOT_NODE.showTipsText("获得钻石："+diamond);

        GameMgr.showRewardsDialog(gold, diamond);
        this.node.destroy();
    }
}
