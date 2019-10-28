import { AudioMgr } from "../manager/AudioMgr";
import { SDKMgr } from "../manager/SDKManager";
import { TipsStrDef } from "../manager/Enum";
import { MyUserDataMgr } from "../manager/MyUserData";

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
    }

    start () {
    }

    update (dt) {
    }

    /**看视频复活 */
    onVedioBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.vedioBtn.interactable = false; 
        this.shareBtn.interactable = false; 

        SDKMgr.showVedioAd(()=>{
            this.handleNormal(0);   //失败
        }, ()=>{
            this.handleNormal(2);    //成功
        });  
    }

    onShareBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.shareBtn.interactable = false; 

        let self = this;
        SDKMgr.shareGame(TipsStrDef.KEY_Share, (succ:boolean)=>{
            console.log("reset 分享 succ = "+succ);
            if(succ == true){
                self.handleNormal(1); 
            }else{
                self.handleNormal(0);
            }
        },self);
    }

    /**跳过 */
    onSkipBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.handleNormal(0);  //复活或显示结算
    }

    //复活或显示结算
    handleNormal(goldType: number){
        /**
         * 游戏中 1钻石 = 100金币
         * 一次分享最多可以获得5个钻石和200金币
         * 一次视频最多可以获得20个钻石和500金币
         */
        if(goldType == 1){   //分享成功
            MyUserDataMgr.updateUserGold(Math.floor((Math.random()*0.5 + 0.5)*200));
            MyUserDataMgr.updateUserDiamond(Math.floor((Math.random()*0.5 + 0.5)*5));
        }else if(goldType == 2){   //视频成功
            MyUserDataMgr.updateUserGold(Math.floor((Math.random()*0.5 + 0.5)*500));
            MyUserDataMgr.updateUserDiamond(Math.floor((Math.random()*0.5 + 0.5)*20));
        }
        this.node.removeFromParent(true);
    }
}
