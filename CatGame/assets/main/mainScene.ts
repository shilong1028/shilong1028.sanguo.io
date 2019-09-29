import { NotificationMy } from "../manager/NoticeManager";
import { NoticeType, ChapterInfo, PlayerInfo } from "../manager/Enum";
import { SDKMgr } from "../manager/SDKManager";
import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";
import ChapterPage from "./chapterPage";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { ROOT_NODE } from "../common/rootNode";
import { FightMgr } from "../manager/FightManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {

    @property(cc.Node)
    bottomNode: cc.Node = null;
    @property(cc.Node)
    topNode: cc.Node = null;
    @property(cc.Node)
    midNode: cc.Node = null;
    @property(cc.Node)
    bagNode: cc.Node = null;
    @property(cc.Node)
    shopNode: cc.Node = null;

    @property(cc.Node)
    shareBtn: cc.Node = null;  //分享
    @property(cc.Label)
    labGold: cc.Label = null;   //玩家金币数
    @property(cc.Label)
    labDiamond: cc.Label = null;    //玩家钻石数
    @property(cc.Label)
    chapterLabel: cc.Label = null;    //第几章
    @property(cc.Label)
    chapterDesc: cc.Label = null;  //通关奖励

    @property(cc.PageView)
    chapterPageView: cc.PageView = null;
    @property(cc.Node)
    leftArrowNode: cc.Node = null;
    @property(cc.Node)
    rightArrowNode: cc.Node = null;

    @property(cc.Sprite)
    musicSpr: cc.Sprite = null;   //背景音乐控制按钮图标
    @property(cc.SpriteFrame)
    musicCloseFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    musicOpenFrame: cc.SpriteFrame = null;

    @property(cc.Sprite)
    bagBtnSpr: cc.Sprite = null;
    @property(cc.Sprite)
    mapBtnSpr: cc.Sprite = null;
    @property(cc.Sprite)
    shopBtnSpr: cc.Sprite = null;
    @property(cc.SpriteFrame)
    whiteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    yellowFrame: cc.SpriteFrame = null;

    @property(cc.Prefab)
    pfPage: cc.Prefab = null;    //章节页签
    @property(cc.Prefab)
    pfStuff: cc.Prefab = null;

    bLoadRoleDataFinish: boolean = false;   //是否已经加载完毕用户数据
    curChapterIdx: number = -1;   //当前章节索引
    curMidUIType: number = -1;   //显示中间UI，0地图关卡、1背包炮台、2商店

    onLoad(){
        this.bLoadRoleDataFinish = false;  //是否已经加载完毕用户数据
        
        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);

        NotificationMy.on(NoticeType.UpdateGold, this.UpdateGold, this);  //金币更新
        NotificationMy.on(NoticeType.UpdateDiamond, this.UpdateDiamond, this);   //更新钻石显示

        this.shareBtn.active = false;  //分享
        if(SDKMgr.WeiChat){
            this.shareBtn.active = true;  //分享
            //sdkWechat.createBannerWithWidth("adunit-7c748fc257f96483");
        }
    }

    onDestroy(){
        NotificationMy.offAll(this);
        this.node.targetOff(this);
    }

    /**后台切回前台 */
    onShow() {
        cc.log("************* onShow() 后台切回前台 ***********************")
        //NotificationMy.emit(NoticeType.GameResume, null);  //继续游戏
        cc.game.resume();
    }

    /**游戏切入后台 */
    onHide() {
        cc.log("_____________  onHide()游戏切入后台  _____________________")
        //NotificationMy.emit(NoticeType.GAME_ON_HIDE, null);
        //NotificationMy.emit(NoticeType.GamePause, null);   //游戏暂停，停止小球和砖块的动作，但动画特效不受影响
        cc.game.pause();
    }

    start(){  
        this.bLoadRoleDataFinish = true;  //是否已经加载完毕用户数据

        this.showMusicSpr();

        this.UpdateGold();  
        this.UpdateDiamond();  

        this.showMidUI(0);   //显示中间信息，0地图关卡、1背包炮台、2商店
    }

    // update (dt) {
    // }

    /**更新金币数量 */
    UpdateGold(){
        let valStr = GameMgr.num2e(MyUserData.GoldCount);
        this.labGold.string = valStr;  //金币数量

        this.labGold.node.stopAllActions();
        this.labGold.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.3), cc.scaleTo(0.1, 1.0)));
    }

    //更新钻石显示
    UpdateDiamond(){
        let valStr = GameMgr.num2e(MyUserData.DiamondCount);
        this.labDiamond.string = valStr;  

        this.labDiamond.node.stopAllActions();
        this.labDiamond.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.3), cc.scaleTo(0.1, 1.0)));
    } 

    //显示底部按钮选中状态
    showBtnSprFrame(bSel: boolean){
        let sprFrame = this.whiteFrame;
        if(bSel == true){
            sprFrame = this.yellowFrame;
        }

        if(this.curMidUIType == 0){  //显示中间UI，0地图关卡、1背包炮台、2商店
            this.mapBtnSpr.spriteFrame = sprFrame;
        }else if(this.curMidUIType == 1){
            this.bagBtnSpr.spriteFrame = sprFrame;
        }else if(this.curMidUIType == 2){
            this.shopBtnSpr.spriteFrame = sprFrame;
        }
    }

    /**显示中间信息，0地图关卡、1背包炮台、2商店 */
    showMidUI(uiType: number){
        if(this.curMidUIType == uiType){
            return;
        }
        this.showBtnSprFrame(false);
        this.curMidUIType = uiType;   //显示中间UI，0地图关卡、1背包炮台、2商店
        this.showBtnSprFrame(true);

        let movePosX = 0;
        if(uiType == 0){
            movePosX = 0;
            if(this.curChapterIdx  == -1){  //当前章节索引
                this.initPageView();
            }  
        }else if(uiType == 1){   //1背包炮台
            movePosX = 750;
        }else if(uiType == 2){   //2商店
            movePosX = -750;
        }

        this.midNode.stopAllActions();
        let moveTime = Math.abs(movePosX - this.midNode.x)/1500;
        this.midNode.runAction(cc.moveTo(moveTime, cc.v2(movePosX, this.midNode.y)));
    }

    /**出战按钮 */
    onFightBtn(){
        AudioMgr.playEffect("effect/ui_click");

        let curPlayerInfo: PlayerInfo = MyUserDataMgr.getCurPlayerInfo();
        if(curPlayerInfo){  
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
        this.chapterDesc.string = "通关奖励"+chapterInfo.chapterCfg.diamond+"钻石"; 
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

    onShareBtn(){
        AudioMgr.playEffect("effect/ui_click");

        SDKMgr.shareGame("分享快乐", (succ:boolean)=>{
            console.log("loginScene 分享 succ = "+succ);
            if(succ == true){
            }
        }, this);
    }

    onShopBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.showMidUI(2);   //显示中间信息，0地图关卡、1背包炮台、2商店
    }
    onMapBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.showMidUI(0);   //显示中间信息，0地图关卡、1背包炮台、2商店
    }
    onBagBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.showMidUI(1);   //显示中间信息，0地图关卡、1背包炮台、2商店
    }

    /**音乐开关 */
    onMusicBtn(){
        AudioMgr.playEffect("effect/ui_click");

        let keyVal = AudioMgr.getMusicOnOffState();   //获取音效总开关状态
        keyVal = 1- keyVal;
        AudioMgr.setMusicOnOffState(keyVal);
        this.showMusicSpr();
    }

    showMusicSpr(){
        let keyVal = AudioMgr.getMusicOnOffState();   //获取音效总开关状态
        if(keyVal == 0){     //现在为开启状态，按钮显示开启图标
            this.musicSpr.spriteFrame = this.musicOpenFrame;
        }else{ 
            this.musicSpr.spriteFrame = this.musicCloseFrame;
        }
    }

}

