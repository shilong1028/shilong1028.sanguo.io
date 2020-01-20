
import { SDKMgr } from "../manager/SDKManager";
import { GameMgr } from "../manager/GameManager";
import { ROOT_NODE } from "./rootNode";
import { MyUserMgr } from "../manager/MyUserData";

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
        this.vedioBtn.interactable = false; 

        SDKMgr.showVedioAd("GoldVedioId", ()=>{
            this.vedioBtn.interactable = true; 
        }, ()=>{
            this.handleVedioSucc();    //成功
        });  
    }

    /**跳过 */
    onSkipBtn(){
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
        MyUserMgr.updateUserGold(gold);
        let diamond = Math.floor((Math.random()*0.5 + 0.5)*20);
        MyUserMgr.updateUserDiamond(diamond);

        ROOT_NODE.showTipsText("获得金币："+gold);
        ROOT_NODE.showTipsText("获得金锭："+diamond);
        
        this.node.destroy();
    }
}
