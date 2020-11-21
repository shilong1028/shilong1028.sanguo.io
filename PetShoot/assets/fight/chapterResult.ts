import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";
import { FightMgr } from "../manager/FightManager";
import { ChapterInfo, TipsStrDef } from "../manager/Enum";
import { MyUserDataMgr, MyUserData } from "../manager/MyUserData";
import { SDKMgr } from "../manager/SDKManager";
import { ROOT_NODE } from "../common/rootNode";

//章节奖励
const {ccclass, property} = cc._decorator;

@ccclass
export default class ChapterResult extends cc.Component {

    @property(cc.Label)
    chapterLabel: cc.Label = null;

    @property(cc.Label)
    goldLabel: cc.Label = null;
    @property(cc.Label)
    diamondLabel: cc.Label = null;

    @property(cc.Button)
    vedioBtn: cc.Button = null;
    @property(cc.Button)
    shareBtn: cc.Button = null;

    chapterInfo: ChapterInfo = null;
    diamondReward: number = 0;

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
        let chapterId = FightMgr.level_info.levelCfg.chapterId;
        this.chapterInfo = new ChapterInfo(chapterId);

        this.chapterLabel.string = chapterId.toString();
        this.goldLabel.string ="+"+ this.chapterInfo.chapterCfg.gold;

        //首次通章奖励钻石
        if(chapterId == MyUserData.curChapterId){
            this.diamondReward = this.chapterInfo.chapterCfg.diamond;
            MyUserDataMgr.updateCurChapterId(chapterId+1);   //新的章节Id
        }else{
            this.diamondReward = Math.ceil(Math.random()/2*this.chapterInfo.chapterCfg.diamond);
        }
        this.diamondLabel.string = "+"+this.diamondReward;
    }

    // update (dt) {}

    /**看视频复活 */
    onVedioBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.vedioBtn.interactable = false; 

        SDKMgr.showVedioAd("ChapterVedioId", ()=>{
            this.vedioBtn.interactable = true;
            //this.handleReward();   //失败
        }, ()=>{
            this.handleReward(2);    //成功
        });  
    }
    onShareBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.shareBtn.interactable = false; 

        SDKMgr.shareGame(TipsStrDef.KEY_Share, (succ:boolean)=>{
            this.shareBtn.interactable = true; 
            this.handleReward(1.5);    //成功
        }, this);
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.handleReward();
    }

    handleReward(times: number=1){
        let gold = Math.floor(this.chapterInfo.chapterCfg.gold * times);
        MyUserDataMgr.updateUserGold(gold);
        let diamond = Math.floor(this.diamondReward * times);
        MyUserDataMgr.updateUserDiamond(diamond);

        ROOT_NODE.showTipsText("获得金币："+gold);
        ROOT_NODE.showTipsText("获得钻石："+diamond);

        if(times > 1){
            GameMgr.showRewardsDialog(gold, diamond, ()=>{
                FightMgr.getFightScene().exitFightScene();
            });
        }else{
            this.node.runAction(cc.sequence(cc.delayTime(0.1* times), cc.callFunc(function(){
                FightMgr.getFightScene().exitFightScene();
            })));
        }
    }
}
