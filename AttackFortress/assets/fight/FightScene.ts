import { NotificationMy } from "../manager/NoticeManager";
import { NoticeType } from "../manager/Enum";
import { AudioMgr } from "../manager/AudioMgr";
import { FightMgr } from "../manager/FightManager";
import QiPanSc from "./QiPanSc";
import { GameMgr } from "../manager/GameManager";
import { MyUserDataMgr } from "../manager/MyUserData";
import WenZi from "../effectAni/Wenzi";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FightScene extends cc.Component {

    @property(cc.Node)
    topNode: cc.Node = null;    //顶部栏
    @property(cc.Node)
    qipanNode: cc.Node = null;   //棋盘节点
    @property(cc.Node)
    stagnationImg: cc.Node = null;   //停滞冰冻图片
    @property(cc.Node)
    bottomNode: cc.Node = null;   //底部栏
    @property(cc.Node)
    tempBottomNode: cc.Node = null;  //底部拖动取消提示

    @property(cc.Label)
    labProgress: cc.Label = null;   //回合进度标签
    @property(cc.ProgressBar)
    pbRoundBar:cc.ProgressBar = null;   //回合进度条

    @property(cc.Label)
    levelLabel: cc.Label = null;  //第几关
    @property(cc.Sprite)
    SpeedSpr: cc.Sprite = null;  //加速
    @property([cc.SpriteFrame])
    speedFrames: cc.SpriteFrame[] = new Array(3);

    @property(cc.Prefab)
    pfFightWin: cc.Prefab = null;
    @property(cc.Prefab)
    pfFightFail: cc.Prefab = null;
    @property(cc.Prefab)
    pfPauseInfo: cc.Prefab = null;  //暂停设置界面
    @property(cc.Prefab)
    pfContinue: cc.Prefab = null;   //复活界面
    @property(cc.Prefab)
    pfWenziAni: cc.Prefab = null;   //帅特效预制体

    GameHideShowDelayActionTag: 2222;   //后台切回延迟动作Tag
    
    bBallSpeedDropState: boolean = false;   //小球是否已经处于抛物下落加速
    bTouched: boolean = false;  //用户当前是否触屏
    fingerPos: cc.Vec2 = null;   //手指触摸位置，用于移动砖块等处的指示线绘制

    curRoundProgress: number = 0;   //当前关卡回合进度
    totalRoundCount: number = 0;

    // LIFE-CYCLE CALLBACKS:

    /**初始化一些关键的战斗场景数据 */
    clearSceneData(bInit:boolean = false){
        this.bBallSpeedDropState = false;   //小球是否已经处于抛物下落加速
        this.bTouched = false;   //用户当前是否触屏
        this.fingerPos = null;   //手指触摸位置，用于移动砖块等处的指示线绘制

        this.curRoundProgress = 0;   //当前关卡回合进度
        this.totalRoundCount = 0;

        this.levelLabel.string = "";  //第几关
        this.tempBottomNode.opacity = 0;  //底部拖动取消提示
        this.stagnationImg.opacity = 0;   //停滞冰冻图片
        
        if(bInit == false){
            NotificationMy.emit(NoticeType.GameReStart, null);  //重新开始游戏
        }
    }

    onLoad () {
        if(cc.winSize.height <= 1334){
            this.topNode.y = cc.winSize.height/2;
        }else{
            this.topNode.y = cc.winSize.height/2 - 70;
        }

        AudioMgr.playEffect("effect/enterfight");

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);

        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);

        this.clearSceneData(true);

        FightMgr.qipanSc = this.qipanNode.getComponent(QiPanSc);   //棋盘

        FightMgr.loadLevel(FightMgr.level_id, false);      // 根据选择的关卡传值     

        // if(SDKMgr.isSDK == true && SDKMgr.WeiChat){
        //     sdkWechat.createBannerWithWidth("adunit-7c748fc257f96483");
        // }
    }

    start () {
    }

    onDestroy(){
        FightMgr.qipanSc = null;   //棋盘

        this.node.targetOff(this);
        NotificationMy.offAll(this);

        FightMgr.clearFightMgrData();
    }

    /**后台切回前台 */
    onShow() {
        cc.log("************* onShow() 后台切回前台 ***********************")
        this.node.stopActionByTag(this.GameHideShowDelayActionTag);   //后台切回延迟动作Tag
        let delayAction = cc.sequence(cc.delayTime(0.05), cc.callFunc(function(){
            cc.game.resume();
        }.bind(this)));
        delayAction.setTag(this.GameHideShowDelayActionTag);
        this.node.runAction(delayAction);
    }

    /**游戏切入后台 */
    onHide() {
        cc.log("_____________  onHide()游戏切入后台  _____________________")
        this.node.stopAllActions();
        cc.game.pause();
    }

    update (dt) {
    }

    /**返回按钮 */
    onBackBtn(){
        AudioMgr.playEffect("effect/ui_click");

        if(FightMgr.bGameOver == false){ 
            GameMgr.showLayer(this.pfPauseInfo);   //暂停界面
        }
    }

    /**处理加载关卡陪住完毕 
     *  (第一次进入战斗或者以后从结算界面继续战斗，都是由FightMgr.loadLevel触发战斗的，故需要在handleSetBricksFinish以后清空并初始化战斗场景数据)
    */
    handleSetBricksFinish(roundLineCount: number){
        this.levelLabel.string = FightMgr.level_id.toString();  //第几关

        this.showSpeedUpBtn();   //关闭小球加速按钮

        this.curRoundProgress = 0;   //当前关卡回合进度
        this.totalRoundCount = Math.min(roundLineCount, FightMgr.level_info.levelCfg.total_lines);
        this.showRoundProgerss();  //显示关卡回合进度

        FightMgr.bReNewLevel = false;   //是否重新开始游戏

        FightMgr.qipanSc.initQiPanObjs();   //初始化棋盘对象

        //this.checkGuideStep();   //检索引导步骤
    }

    /**显示关卡回合进度 */
    showRoundProgerss(){
        this.labProgress.string = this.curRoundProgress + "/" + this.totalRoundCount;  //当前关卡回合进度
        let progress = this.curRoundProgress / this.totalRoundCount;
        if(progress < 0){
            progress = 0;
        }else if(progress > 1){
            progress = 1;
        }
        this.pbRoundBar.progress = progress;
    }

    /**更新关卡回合显示 */
    updateRoundProgress(){
        this.curRoundProgress ++;   //当前关卡回合进度
        this.showRoundProgerss();
    }

    touchStart(event: cc.Touch){
        FightMgr.qipanSc.fixGuideStep = 0;

        this.cancelTouch();  //取消触摸
        if(this.handleTouchPos(event.getLocation()) == true){
            this.tempBottomNode.opacity = 255;  //底部拖动取消提示
        }
    }

    touchMove(event: cc.Touch){
        this.handleTouchPos(event.getLocation());
    }

    touchEnd(event: cc.Touch){
        if(this.bTouched == true && this.fingerPos){   //检测所有小球是否落地复位，且砖块加载下落完毕
            this.cancelTouch();   //取消触摸
            FightMgr.qipanSc.launchBalls();
        }
    }

    /**处理触摸 */
    handleTouchPos(touchPos: cc.Vec2){
        if(FightMgr.qipanSc.canTouchIndicator() == false){   //关卡引导
            return false;
        }

        if(FightMgr.bGameOver == false){
            let localPos = GameMgr.adaptTouchPos(touchPos, this.node.position);  //校正因适配而产生的触摸偏差
            let pos = this.qipanNode.convertToNodeSpaceAR(localPos);
            //if(FightMgr.bordersContainsPoint(FightMgr.getGameBorders(0), pos)){  //触点在棋盘范围内
            if(pos.y >= FightMgr.getBallPosY() && pos.y <= this.qipanNode.height/2){  //触点在棋盘范围内
                // if(this.fingerPos && this.fingerPos.sub(pos).mag()<10){   //降低触摸移动的灵敏度
                //     return false;
                // }

                this.tempBottomNode.opacity = 255;  //底部拖动取消提示
                
                this.bTouched = true;
                this.fingerPos = pos;  //手指触摸位置，用于移动砖块等处的指示线绘制

                FightMgr.qipanSc.handleTouchPos(pos);
                return true;
            }else{
                this.cancelTouch();   //取消触摸状态
                return false;
            }
        }else{
            //cc.log("触摸无效 FightMgr.bGameOver = "+FightMgr.bGameOver+"; FightMgr.bFightBeginEffect = "+FightMgr.bFightBeginEffect);
            return false;
        }
    }

    /**取消触摸 */
    cancelTouch(){
        this.bTouched = false;
        this.fingerPos = null;

        if(FightMgr.qipanSc.canTouchIndicator() == true){
            FightMgr.qipanSc.handleCancleTouch();   //取消触摸状态
        }

        this.tempBottomNode.opacity = 0;  //底部拖动取消提示
    }

    /**移动砖块导致的重绘指示线 */
    reShowIndicator(){
        FightMgr.qipanSc.showIndicator(this.fingerPos);
    }

    /**小球加速按钮出现 */
    showSpeedUpBtn(){
        this.SpeedSpr.spriteFrame = this.speedFrames[0];
    }

    /**点击加速 */
    onSpeedUpBtn() {   
        //(event: TouchEvent, customEventData: any)
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        //cc.log("onSpeedUpBtn(), customEventData = "+JSON.stringify(customEventData));
        AudioMgr.playEffect("effect/ui_click");

        this.showSpeedUpBtn();
        
        if(this.bBallSpeedDropState == false){
            NotificationMy.emit(NoticeType.BallSpeedUp, null);  //小球加速
        }
    }

    /**小球加速抛物落下*/
    setBallSpeedUpDropState(bDrop: boolean){
        this.bBallSpeedDropState = bDrop;   //小球是否已经处于加速状态了（按钮加速和抛物下落加速）
    }

    /**处理所有小球都下落完毕，之后小球排序，检查回合结束 */
    handleBallsDropOver(){
        FightMgr.qipanSc.handleBallsDropOver();

        this.showStagnationImg(false);   //停滞冰冻图片
    }

    /**游戏结束 */
    gameOver(win:boolean){
        //console.log("gameOver(), gameOver = "+FightMgr.bGameOver+"; win = "+win+"; FightMgr.bUserReset = "+FightMgr.bUserReset);
        if(FightMgr.bGameOver == true){  //该局游戏是否结束
            if(win == true || FightMgr.bUserReset == true){ //本次是否使用了复活（每关限一次，重新开始不重置）
                this.showFightOverInfo();  //结算界面
            }else{
                FightMgr.bUserReset = true;
                GameMgr.showLayer(this.pfContinue);   //复活界面
            }
        }
    }

    /**显示战斗结算界面 */
    showFightOverInfo(){
        let atkScore = FightMgr.atkScore;
        FightMgr.atkScore = 0;
        if(FightMgr.win == true){
            GameMgr.showLayer(this.pfFightWin);  //首次通关奖励或失败
        }else{
            atkScore = 0;
            GameMgr.showLayer(this.pfFightFail);  //首次通关奖励或失败
        }
        MyUserDataMgr.saveLevelInfo(FightMgr.level_id, atkScore, FightMgr.win);
    }

    //显示停滞冰冻图片
    showStagnationImg(bShow:boolean){
        this.stagnationImg.stopAllActions();
        if(bShow == true){
            //this.stagnationImg.opacity = 0;   //停滞冰冻图片
            this.stagnationImg.runAction(cc.fadeIn(1.0));
            AudioMgr.playEffect("effect/bingdong");
        }else{
            this.stagnationImg.runAction(cc.fadeOut(1.0));
        }
    }

    /**显示回合砖块死亡特效（帅，太棒等） */
    checkRoundBrickDeadCount(count: number){
        if(count > 0){
            let countArr = new Array(3, 5, 10);
            for(let i=countArr.length-1; i>=0; i--){
                if(countArr[i] == count && i< 3){
                    let oldEff = this.node.getChildByName("RoundBrickDeadEffAni");
                    if(oldEff){
                        oldEff.removeFromParent(true);
                    }
                    let effNode = cc.instantiate(this.pfWenziAni);   //帅特效预制体
                    effNode.scale = 0.5;
                    effNode.getComponent(WenZi).showEffectAniByIdx(i);
                    effNode.y = 200;
                    if(i == 0){
                        effNode.x = 30;
                    }else{
                        effNode.x = 0;
                    }
                    effNode.name = "RoundBrickDeadEffAni";
                    this.node.addChild(effNode, 100);
                    return;
                }
            }
        }
    }
}
