import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";
import { FightMgr } from "../manager/FightManager";
import { ChapterInfo } from "../manager/Enum";
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

    chapterInfo: ChapterInfo = null;
    diamondReward: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
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
            this.handleReward();   //失败
        }, ()=>{
            this.handleReward(2);    //成功
        });  
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.handleReward();
    }

    handleReward(times: number=1){
        let gold = this.chapterInfo.chapterCfg.gold * times;
        MyUserDataMgr.updateUserGold(gold);
        let diamond = this.diamondReward * times;
        MyUserDataMgr.updateUserDiamond(diamond);

        ROOT_NODE.showTipsText("获得金币："+gold);
        ROOT_NODE.showTipsText("获得钻石："+diamond);

        if(times > 1){
            GameMgr.showRewardsDialog(0, 0, ()=>{
                GameMgr.gotoMainScene();
            });
        }else{
            this.node.runAction(cc.sequence(cc.delayTime(0.1* times), cc.callFunc(function(){
                GameMgr.gotoMainScene();
            })));
        }
    }
}
