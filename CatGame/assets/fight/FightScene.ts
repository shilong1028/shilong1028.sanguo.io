import { NotificationMy } from "../manager/NoticeManager";
import { NoticeType, SkillInfo, BallInfo, ChapterInfo } from "../manager/Enum";
import { AudioMgr } from "../manager/AudioMgr";
import { FightMgr } from "../manager/FightManager";
import QiPanSc from "./QiPanSc";
import { GameMgr } from "../manager/GameManager";
import WenZi from "../effectAni/Wenzi";
import Brick from "./Brick";
import { GuideMgr, GuideStepEnum } from "../manager/GuideMgr";
import { SDKMgr } from "../manager/SDKManager";
import { sdkTT } from "../manager/SDK_TT";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FightScene extends cc.Component {

    @property(cc.Node)
    backNode: cc.Node = null;
    @property(cc.Node)
    topNode: cc.Node = null;    //顶部栏
    @property(cc.Label)
    labProgress: cc.Label = null;   //回合进度标签
    @property(cc.ProgressBar)
    pbRoundBar:cc.ProgressBar = null;   //回合进度条
    @property(cc.Label)
    levelLabel: cc.Label = null;  //第几关

    @property(cc.Label)
    chapterLabel: cc.Label = null;  //第几章
    @property(cc.Label)
    levelsText: cc.Label = null;   

    @property(cc.Sprite)
    recordSpr: cc.Sprite = null;   //录屏控制按钮图标
    @property(cc.SpriteFrame)
    recordStartFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    recordEndFrame: cc.SpriteFrame = null;

    @property(cc.Node)
    stagnationImg: cc.Node = null;   //停滞冰冻图片
    @property(cc.Node)
    qipanNode: cc.Node = null;   //棋盘节点

    @property(cc.Node)
    speedNode: cc.Node = null;   //加速节点
    @property(cc.Sprite)
    SpeedSpr: cc.Sprite = null;  //加速
    @property([cc.SpriteFrame])
    speedFrames: cc.SpriteFrame[] = new Array(3);

    @property(cc.Prefab)
    pfFightResult: cc.Prefab = null;
    @property(cc.Prefab)
    pfPauseInfo: cc.Prefab = null;  //暂停设置界面
    @property(cc.Prefab)
    pfContinue: cc.Prefab = null;   //复活界面
    @property(cc.Prefab)
    pfWenziAni: cc.Prefab = null;   //帅特效预制体

    @property(cc.Prefab)
    pfBrick: cc.Prefab = null;   //砖块预制体
    @property(cc.Prefab)
    pfBall: cc.Prefab = null;   //小球预制体
    @property(cc.Prefab)
    pfharmHp: cc.Prefab = null;   //飘血预制体
    @property(cc.Prefab)
    pfDot: cc.Prefab = null;   //指示点预制体  
    @property(cc.Prefab)
    pfBeginReward: cc.Prefab = null;  //开局奖励

    @property([cc.SpriteFrame])
    boomFrames: cc.SpriteFrame[] = new Array(2);  //炸弹图片

    @property(cc.SpriteAtlas)
    deadAtlas: cc.SpriteAtlas = null;   //砖块死亡烟雾特效
    @property(cc.SpriteAtlas)
    bumpAtlas: cc.SpriteAtlas = null;   //砖块受击特效
    @property(cc.SpriteAtlas)
    shuyeAtlas: cc.SpriteAtlas = null;   //吸附特效
    @property(cc.SpriteAtlas)
    brickWudiAtlas: cc.SpriteAtlas = null;  //砖块无敌特效
    @property(cc.SpriteAtlas)
    ballChongnengAtlas: cc.SpriteAtlas = null;  //小球充能特效
    @property(cc.SpriteAtlas)
    ballFantanAtlas: cc.SpriteAtlas = null;  //小球反弹特效
    @property(cc.SpriteAtlas)
    baojiAtlas: cc.SpriteAtlas = null;  //小球狂暴特效

    brickPool: cc.NodePool =  null;   //砖块缓存池

    GameHideShowDelayActionTag: 2222;   //后台切回延迟动作Tag
    GameWinwDelayActionTag: 1001;   //砖块全部死亡
    
    bBallSpeedDropState: boolean = false;   //小球是否已经处于抛物下落加速
    bTouched: boolean = false;  //用户当前是否触屏
    fingerPos: cc.Vec2 = null;   //手指触摸位置，用于移动砖块等处的指示线绘制

    stagnationRow: number = -1;  //显示冰冻的回合

    skillList: SkillInfo[] = [];   //章节技能列表，每一关累计，章节内有效
    bShowBeginReward: boolean = true;   //章节第一关第一次显示开局奖励

    // LIFE-CYCLE CALLBACKS:

    /**初始化一些关键的战斗场景数据 */
    clearSceneData(bInit:boolean = false){
        this.bBallSpeedDropState = false;   //小球是否已经处于抛物下落加速
        this.bTouched = false;   //用户当前是否触屏
        this.fingerPos = null;   //手指触摸位置，用于移动砖块等处的指示线绘制

        this.levelLabel.string = "";  //第几关
        this.stagnationImg.opacity = 0;   //停滞冰冻图片    
        this.stagnationRow = -1;  //显示冰冻的回合

        if(bInit == false){
            NotificationMy.emit(NoticeType.GameReStart, null);  //重新开始游戏
        }
    }

    exitFightScene(){
        console.log("fightScene exitFightScene")
        this.preDestory();
        this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
            GameMgr.gotoMainScene();   //进入主场景
        })))
    }

    //从战场退出到大厅，有时候回报Cannot read property '_activeInHierarchy' of null;at setTimeout callback function
    preDestory(){
        console.log("fightScene preDestory")
        FightMgr.clearFightMgrData();
        FightMgr.qipanSc.clearQiPanData();
        FightMgr.qipanSc.preDestory();
        FightMgr.qipanSc = null;   //棋盘
        this.qipanNode.removeFromParent(true);
        this.brickPool.clear();

        this.node.targetOff(this);
        NotificationMy.offAll(this);
    }

    onDestroy(){
        console.log("fightScene destory")
    }

    onLoad () {
        GameMgr.adaptBgByScene(this.topNode);   //场景背景图适配

        this.stagnationImg.opacity = 0;   //停滞冰冻图片
        this.chapterLabel.string = ""  //第几章
        this.levelsText.string = "";  
        this.speedNode.active = false;

        //AudioMgr.playEffect("effect/enterfight");

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);

        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);

        this.skillList = [];   //章节技能列表，每一关累计，章节内有效
        
        this.showRecordSpr();
    }

    start () {
        GameMgr.bToMainPetPage = false;   //主界面是否跳转至宠物界面

        this.brickPool = new cc.NodePool(Brick);   //砖块缓存池
        //只有在new cc.NodePool(Dot)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法

        FightMgr.qipanSc = this.qipanNode.getComponent(QiPanSc);   //棋盘

        FightMgr.loadLevel(FightMgr.level_id, false);      // 根据选择的关卡传值    

        let chapterId = FightMgr.level_info.levelCfg.chapterId;
        let chapterInfo = new ChapterInfo(chapterId);
        this.chapterLabel.string = chapterId.toString();  //第几章
        this.levelsText.string = "("+chapterInfo.chapterCfg.levels[0]+"-"+chapterInfo.chapterCfg.levels[1]+"关)";  

        if(FightMgr.level_id == 1){
            if(GuideMgr.checkGuide_NewPlayer(GuideStepEnum.Fight_Guide_Step2, this.guideFightMove, this) == false){  //左右拖动手指，改变发射轨迹。
                if(this.bShowBeginReward == true && SDKMgr.bAutoPlayVedio != true){   //章节开局奖励
                    GameMgr.showLayer(this.pfBeginReward);
                }
            }
        }else{
            if(this.bShowBeginReward == true && SDKMgr.bAutoPlayVedio != true){   //章节开局奖励
                GameMgr.showLayer(this.pfBeginReward);
            }else{
                this.handleStartFight();
            }
        }
    }

    handleStartFight(){
        if(FightMgr.level_id > 1){
            if(GuideMgr.checkGuide_NewPlayer(GuideStepEnum.FightSet_Guide_Step, this.guideFightSet, this) == false){  //点击信息按钮，查看技能或退出游戏。
            }
        }
    }
    guideFightSet(step: GuideStepEnum){
        GuideMgr.showGuideLayer(this.backNode, ()=>{
            GuideMgr.endGuide_NewPlayer(step);
            this.onBackBtn();
        });
    }
    guideFightMove(step: GuideStepEnum){
        FightMgr.qipanSc.showIndicatorTeach();   //射线教程
        GuideMgr.showGuideLayer(null, ()=>{
            GuideMgr.endGuide_NewPlayer(step);
        }, cc.size(500, 100), cc.v2(0, -200));
    }

    //显示章节战斗技能
    initFightSkillList(){
        if(this.skillList.length == 0){   //初次进入战斗场景
            FightMgr.fightAddCount = 0;    //章节加球技能增加值（每一章节内有效）
            let curSkillId = FightMgr.usedPlayerInfo.playerCfg.skillId;
            if(curSkillId > 0){
                let skillInfo = new SkillInfo(curSkillId);
                this.skillList.push(skillInfo);
            }
        }

        if(this.checkRandomFightSkillById(7) == true){   //一定概率增加指视线段数量
            FightMgr.defaultRayCount ++;   //默认的绘制指示线的射线段数
            //ROOT_NODE.showTipsText("触发指示技能，增加一段指示线。");
        }

        if(this.checkRandomFightSkillById(8) == true){   //一定概率增加可发射的武器数量
            FightMgr.fightAddCount++;    //章节加球技能增加值（每一章节内有效）
            //ROOT_NODE.showTipsText("触发加球技能，增加一个武器数量。");
        }
    }

    /**从缓存池中获取或创建砖块 */
    createBrickFromPool(): cc.Node{
        if(this.brickPool == null){
            this.brickPool = new cc.NodePool(Brick);   //砖块缓存池
        }
        if (this.brickPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            return this.brickPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            return cc.instantiate(this.pfBrick);
        }
    }

    /**将砖块回收到缓存池 */
    removeBrickToPool(brick: cc.Node){
        this.brickPool.put(brick); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }

    /**后台切回前台 */
    onShow() {
        //cc.log("************* onShow() 后台切回前台 ***********************")
        if(this.node){
            this.node.stopActionByTag(this.GameHideShowDelayActionTag);   //后台切回延迟动作Tag
            let delayAction = cc.sequence(cc.delayTime(0.05), cc.callFunc(function(){
                cc.game.resume();
            }.bind(this)));
            delayAction.setTag(this.GameHideShowDelayActionTag);
            this.node.runAction(delayAction);
        }else{
            cc.game.resume();
        }
    }

    /**游戏切入后台 */
    onHide() {
        //cc.log("_____________  onHide()游戏切入后台  _____________________")
        //this.node.stopAllActions();   //偶尔报TypeError: Cannot read property 'stopAllActions' of null
        cc.game.pause();
    }

    /**返回按钮 */
    onBackBtn(){
        AudioMgr.playEffect("effect/ui_click");

        if(FightMgr.bGameOver == false){ 
            GameMgr.showLayer(this.pfPauseInfo);   //暂停界面
        }
    }

    /**检查指定的战斗技能是否触发 */
    checkRandomFightSkillById(skillId: number){
        let skillInfo = this.getFightSkillById(skillId);  //一定概率增加指视线段数量
        if(skillInfo){   //指示
            let probability = skillInfo.skillCfg.probability * skillInfo.skillLv;
            if(FightMgr.usedPlayerInfo.ballId > 0){
                let weapon = new BallInfo(FightMgr.usedPlayerInfo.ballId);
                if(weapon){
                    probability += weapon.cannonCfg.probability;
                }
            }
            if(Math.random() <= probability){ 
                return true;
            }
        }
        return false;
    }

    /**获取指定的战斗技能 */
    getFightSkillById(skillId: number){
        for(let i=0; i<this.skillList.length; ++i){
            if(this.skillList[i].skillId == skillId){
                return this.skillList[i].clone();
            }
        }
        return null;
    }

    /**添加新的技能到战斗列表中 */
    addFightSkillById(skillId: number){
        if(skillId > 0){
            for(let i=0; i<this.skillList.length; ++i){
                if(this.skillList[i].skillId == skillId){
                    this.skillList[i].skillLv ++;
                    return;
                }
            }
            this.skillList.push(new SkillInfo(skillId));
        }
    }

    /**处理加载关卡陪住完毕 
     *  (第一次进入战斗或者以后从结算界面继续战斗，都是由FightMgr.loadLevel触发战斗的，故需要在handleSetBricksFinish以后清空并初始化战斗场景数据)
    */
    handleSetBricksFinish(){
        this.levelLabel.string = FightMgr.level_id.toString();  //第几关

        this.showBrickProgerss();  //显示关卡砖块进度

        FightMgr.bReNewLevel = false;   //是否重新开始游戏
        FightMgr.qipanSc.initQiPanObjs(this);   //初始化棋盘对象

        this.handleStartFight();
    }

    /**显示关卡砖块进度 */
    showBrickProgerss(){
        let tempNum = FightMgr.brickBreakAim - FightMgr.brickBreakNum;
        if(tempNum < 0){
            tempNum = 0;
        }
        this.labProgress.string = tempNum + "/" + FightMgr.brickBreakAim; 
        let progress = tempNum / FightMgr.brickBreakAim;
        if(progress < 0){
            progress = 0;

            let delayAction = cc.sequence(cc.delayTime(0.2), cc.callFunc(function(){
                this.qipanSc.hanldeGameOver(true);
            }.bind(this)));
            delayAction.setTag(this.GameWinwDelayActionTag);
            this.stopGameWinwDelayAction();
            this.node.runAction(delayAction);
        }else if(progress > 1){
            progress = 1;
        }
        this.pbRoundBar.progress = progress;
    }

    stopGameWinwDelayAction(){
        this.node.stopActionByTag(this.GameWinwDelayActionTag);
    }

    touchStart(event: cc.Touch){
        FightMgr.qipanSc.fixGuideStep = 0;

        this.cancelTouch();  //取消触摸
    }

    touchMove(event: cc.Touch){
        let touchPos = GameMgr.adaptTouchPosByNode(this.node, event.getLocation());
        this.handleTouchPos(touchPos);
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
            let pos = this.qipanNode.convertToNodeSpaceAR(touchPos);
            //if(FightMgr.bordersContainsPoint(FightMgr.getGameBorders(0), pos)){  //触点在棋盘范围内
            if(pos.y >= FightMgr.getBallPosY() && pos.y <= this.qipanNode.height/2){  //触点在棋盘范围内
                if(this.fingerPos && this.fingerPos.sub(pos).mag()<10){   //降低触摸移动的灵敏度
                    return false;
                }       
                this.bTouched = true;
                this.fingerPos = pos;  //手指触摸位置，用于移动砖块等处的指示线绘制

                FightMgr.qipanSc.handleTouchPos(pos);
                return true;
            }else{
                this.cancelTouch();   //取消触摸状态
                return false;
            }
        }else{
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
    }

    /**移动砖块导致的重绘指示线 */
    reShowIndicator(){
        FightMgr.qipanSc.showIndicator(this.fingerPos);
    }

    /**小球加速按钮出现 */
    showSpeedUpBtn(){
        FightMgr.speedUpRatio ++;  //战斗加速倍数，0-2分别表示1-3倍加速
        if(FightMgr.speedUpRatio > 3){
            FightMgr.speedUpRatio = 1;
        }

        this.SpeedSpr.spriteFrame = this.speedFrames[FightMgr.speedUpRatio - 1];
    }

    /**点击加速 */
    onSpeedUpBtn() {   
        //(event: TouchEvent, customEventData: any)
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
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

        if(this.stagnationRow != FightMgr.qipanSc.curRow){  //显示冰冻的回合
            this.showStagnationImg(false);   //停滞冰冻图片
        } 
    }

    /**游戏结束 */
    gameOver(win:boolean){
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
        GameMgr.showLayer(this.pfFightResult);  //首次通关奖励或失败 
    }

    //显示停滞冰冻图片
    showStagnationImg(bShow:boolean, showRow: number=-1){
        this.stagnationImg.stopAllActions();
        if(bShow == true){
            this.stagnationRow = showRow;  //显示冰冻的回合
            //this.stagnationImg.opacity = 0;   //停滞冰冻图片
            this.stagnationImg.runAction(cc.fadeIn(1.0));
            //AudioMgr.playEffect("effect/bingdong");
        }else{
            this.stagnationRow = -1;  //显示冰冻的回合
            this.stagnationImg.runAction(cc.fadeOut(1.0));
        }
    }

    /**显示回合砖块死亡特效（帅，真棒，厉害） */
    checkRoundBrickDeadCount(count: number){
        if(count > 0){
            let countArr = new Array(Math.ceil(FightMgr.starTargetNum/3), Math.ceil(FightMgr.starTargetNum/2), FightMgr.starTargetNum);
            for(let i=2; i>=0; i--){
                if(countArr[i] == count){
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

                    if(i == 2){   //厉害
                        FightMgr.stars = 3;   //战斗星级
                    }else if(i == 1){
                        if(FightMgr.stars <2 ){
                            FightMgr.stars = 2; 
                        }
                    }
                    return;
                }
            }
        }
    }

    onRecordBtn(){
        AudioMgr.playEffect("effect/ui_click");
        if(sdkTT.is_recording_video == true){     //录屏中
            sdkTT.stopGameRecord();
        }else{ 
            sdkTT.createGameRecordManager();
        }
    }

    showRecordSpr(){
        if(SDKMgr.isSDK == true && SDKMgr.TT){
            if(sdkTT.is_recording_video == true){     //录屏中
                this.recordSpr.spriteFrame = this.recordEndFrame;
            }else{ 
                this.recordSpr.spriteFrame = this.recordStartFrame;
            }
        }else{
            this.recordSpr.node.active = false;
        }
    }
}
