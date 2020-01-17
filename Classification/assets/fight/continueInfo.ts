import { LevelInfo, NoticeType, TipsStrDef } from "../manager/Enum";
import { NotificationMy } from "../manager/NoticeManager";
import { FightMgr } from "../manager/FightManager";
import { AudioMgr } from "../manager/AudioMgr";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { ROOT_NODE } from "../common/rootNode";
import { SDKMgr } from "../manager/SDKManager";


//复活界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class FightRenew extends cc.Component {

    @property(cc.Button)
    vedioBtn: cc.Button = null;
    @property(cc.Label)
    diamondLable: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    levelInfo: LevelInfo = null;   //关卡信息
    proTime: number = 5;  //倒计时时间
    goldCost: number = 100;   //钻石复活

    bVideoPlaying: boolean = false;   //视频播放中

    onLoad () {
    }

    start () {
        this.goldCost = FightMgr.level_info.levelCfg.chapterId * 10;
        this.diamondLable.string = this.goldCost.toString();
    }

    /**钻石复活 */
    onGoldBtn(){
        AudioMgr.playEffect("effect/ui_click");
        if(MyUserData.DiamondCount >= this.goldCost){
            MyUserDataMgr.updateUserDiamond(-this.goldCost);
            this.handleNormal(true);  //复活或显示结算
        }else{
            ROOT_NODE.showTipsText(TipsStrDef.KEY_DiamondTip);
        }
    }

    /**看视频复活 */
    onVedioBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.vedioBtn.interactable = false; 
        this.bVideoPlaying = true;   //视频播放中

        SDKMgr.showVedioAd("FuhuoVedioId", ()=>{
            this.vedioBtn.interactable = true; 
            this.bVideoPlaying = false;   //视频播放中
            //this.handleNormal(false);   //失败
        }, ()=>{
            this.handleNormal(true);  //成功
        }); 
    }

    /**跳过 */
    onSkipBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.handleNormal(false);  //复活或显示结算
    }

    //复活或显示结算
    handleNormal(bReNew:boolean){
        if(bReNew == true){
            ROOT_NODE.showTipsText("复活生效，最下三层砖块已消除！");
            NotificationMy.emit(NoticeType.GemaRevive, null);   //复活，将最下三层砖块消除   
            this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
                this.node.destroy();
            }.bind(this))));
        }else{
            FightMgr.getFightScene().showFightOverInfo();   //结算界面
            this.node.destroy();
        }
    }
}
