import { GameMgr } from "../manager/GameManager";
import ChapterPage from "./chapterPage";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { AudioMgr } from "../manager/AudioMgr";
import { PlayerInfo, TipsStrDef, ChapterInfo } from "../manager/Enum";
import { ROOT_NODE } from "../common/rootNode";
import { FightMgr } from "../manager/FightManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ChapterLayer extends cc.Component {

    @property(cc.PageView)
    chapterPageView: cc.PageView = null;
    @property(cc.Node)
    leftArrowNode: cc.Node = null;
    @property(cc.Node)
    rightArrowNode: cc.Node = null;
    @property(cc.Label)
    chapterLabel: cc.Label = null;
    @property(cc.Label)
    rewardLabel: cc.Label = null;

    @property(cc.Prefab)
    pfPage: cc.Prefab = null;    //章节页签

    // LIFE-CYCLE CALLBACKS:

    curChapterIdx: number = -1;   //当前章节索引

    onLoad () {
        this.chapterLabel.string = "";
        this.rewardLabel.string = "";
    }

    start () {
        if(this.curChapterIdx  == -1){  //当前章节索引
            this.initPageView();
        }  
    }

    // update (dt) {}

    //显示章节
    initPageView(){
        for(let i=0; i<GameMgr.ChapterCount; ++i){
            let page = cc.instantiate(this.pfPage);
            this.chapterPageView.addPage(page);
            page.getComponent(ChapterPage).initChapterPage(i);
        }

        this.curChapterIdx = MyUserData.curChapterId-1;   //当前章节索引
        this.showChapterUI();  //显示当前章节信息
        this.chapterPageView.scrollToPage(this.curChapterIdx, 0.1);
    }

    // 监听事件
    onPageEvent (sender, eventType) {
        // 翻页事件
        if (eventType !== cc.PageView.EventType.PAGE_TURNING) {
            return;
        }
        //console.log("当前所在的页面索引:" + sender.getCurrentPageIndex());
        this.curChapterIdx = sender.getCurrentPageIndex();   //当前章节索引
        this.showChapterUI();  //显示当前章节信息
    }

    onLeftPageBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.curChapterIdx --;  //当前章节索引
        this.showChapterUI();  //显示当前章节信息
        this.chapterPageView.scrollToPage(this.curChapterIdx, 0.1);
    }

    onRightPageBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.curChapterIdx ++;   //当前章节ID
        this.showChapterUI();  //显示当前章节信息
        this.chapterPageView.scrollToPage(this.curChapterIdx, 0.1);
    }

    //显示当前章节信息
    showChapterUI(){
        this.handleMovePage();
        let chapterInfo = new ChapterInfo(this.curChapterIdx + 1);
        this.chapterLabel.string = chapterInfo.chapterId.toString();
        this.rewardLabel.string = "通章奖励"+chapterInfo.chapterCfg.diamond+"钻石";
    }

    handleMovePage(){
        if(this.curChapterIdx <= 0){
            this.curChapterIdx = 0;
            this.leftArrowNode.active = false;
        }else if(this.curChapterIdx >= GameMgr.ChapterCount-1){
            this.curChapterIdx = GameMgr.ChapterCount-1;
            this.rightArrowNode.active = false;
        }else{
            this.leftArrowNode.active = true;
            this.rightArrowNode.active = true;
        }
    }

    /**出战按钮 */
    onFightBtn(){
        AudioMgr.playEffect("effect/ui_click");

        let curPlayerInfo: PlayerInfo = MyUserDataMgr.getCurPlayerInfo();
        if(curPlayerInfo){  
            if(curPlayerInfo.ballId == 0){
                ROOT_NODE.showTipsText(TipsStrDef.KEY_WeaponTip2);
                GameMgr.getMainScene().showMidUI(1);   //显示中间信息，0地图关卡、1背包炮台、2商店
            }else{
                let chapterInfo = null;
                if(this.curChapterIdx+1 < MyUserData.curChapterId){
                    chapterInfo = new ChapterInfo(this.curChapterIdx+1);   //选中的章节
                }else{
                    chapterInfo = new ChapterInfo(MyUserData.curChapterId);    //当前的章节
                }
        
                if(chapterInfo){
                    FightMgr.level_id = chapterInfo.chapterCfg.levels[0];
                    GameMgr.goToSceneWithLoading("FightScene");
                }else{
                    ROOT_NODE.showTipsText("章节信息有误！");
                }
            }
        }
    }
}
