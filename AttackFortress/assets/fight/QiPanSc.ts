import { IntersectRay, NoticeType, BallInfo, BallState, BrickInfo } from "../manager/Enum";
import { NotificationMy } from "../manager/NoticeManager";
import Brick from "./Brick";
import { FightMgr } from "../manager/FightManager";
import Cat from "./Cat";
import Ball from "./Ball";
import { MyUserDataMgr } from "../manager/MyUserData";
import { AudioMgr } from "../manager/AudioMgr";
import Dot from "./Dot";
import { GameMgr } from "../manager/GameManager";

//棋盘
const {ccclass, property} = cc._decorator;

@ccclass
export default class QiPanSc extends cc.Component {

    @property(cc.Node)
    nIndicator: cc.Node = null;   //射线（指示线）节点
    @property(cc.Node)
    nFixIndicator: cc.Node = null;   //第一关固定指示线
    @property(cc.Node)
    nBricks: cc.Node = null;   //砖块父节点
    @property(cc.Node)
    nBalls: cc.Node = null;   //可发射子弹父节点
    @property(cc.Node)
    nCat: cc.Node = null;  //投手角色节点
    @property(cc.Node)
    nEffect: cc.Node = null;   //特效节点

    @property(cc.Prefab)
    pfBrick: cc.Prefab = null;   //砖块预制体
    @property(cc.Prefab)
    pfBall: cc.Prefab = null;   //小球预制体
    @property(cc.Prefab)
    pfharmHp: cc.Prefab = null;   //飘血预制体
    @property(cc.Prefab)
    pfDot: cc.Prefab = null;   //指示点预制体

    @property(cc.SpriteAtlas)
    fightAtlas: cc.SpriteAtlas = null;   

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

    brickPool: cc.NodePool =  null;   //砖块缓存池
    dotPool: cc.NodePool = null;   //指示点缓存池

    drawGraphics: cc.Graphics = null;   //测试，画出相交线

    dotInterval: number = 30;   //射线点间距

    DeadDelayActionTag: 1100;   //砖块死亡延迟动作Tag
    GameOverDelayActionTag: 2100;   //游戏结束延迟显示

    BricksLineDelayActionTag: 5000;   //砖块下移完毕新回合开始延迟
    BricksRoundDelayActionTag: 6000;   //回合结束砖块下移前回合事件处理动作
    BricksMoveDelayActionTag: 7000;   //砖块下移延迟动作
    
    bCreateNextRound: boolean = false;  //是否在检查完回合事件后进行新行砖块创建并下移
    bMultiLineMove: boolean = false;   //多行下移（初始或无敌块）
    bMultiLineStagnation: boolean = false;  //是否多行下移后下一回合停滞
    bBricksDownOver: boolean = false;    //砖块加载完或下落完毕
    bBallsDropOver: boolean = false;   //小球是否全部落地
    firstEmissionEnd: IntersectRay = null;   //第一段射线的末点

    curRow: number = 0;   //当前最后出现的砖块行数
    noEnemyTime: number = -100;  //小球发射后，当前视图内没有敌人后2.0秒弧度加速回落

    nextTotal: number = 1;  //下一回合需要下降的总行数（默认为1，当视图中无敌人砖块时，下降三行）
    bStagnation: boolean = false;   //停滞砖块死亡后，若屏幕内有敌方阵营，本回合结束后所有怪物（无论是敌方阵营或友方阵营）不下移；屏幕外的也不下移。

    roundDownBrickCount: number = 0;   //当前回合下移的砖块总量
    bPreMoveDownOver: boolean = false;  //预下移处理是否完毕

    topPosType = new Array(0, 0, 0);
    roundBrickDeadCount: number = 0;   //回合砖块死亡数量

    launchCount: number = 0;   //本次战斗发射次数
    unLuanchBallCount: number = 0;   //未发射的小球数量

    bShowFixGuideDot: boolean = false;   //是否显示第一关固定指示线
    fixGuideStep:number = 0;  //第一关固定指示线（移动步数）

    levelInitLineNum: number = 0;  //初始显示的行数

    // LIFE-CYCLE CALLBACKS:
    /**清除棋盘数据 */
    clearQiPanData(){
        this.offIndicator();  //关闭指示线
        this.node.stopAllActions();
        this.nBricks.stopAllActions();

        this.nEffect.removeAllChildren(true);
        this.nFixIndicator.removeAllChildren(true); 
        
        this.bCreateNextRound = false;  //是否在检查完回合事件后进行新行砖块创建并下移
        this.bMultiLineMove = false;   //多行下移（初始或无敌块）
        this.bMultiLineStagnation = false;  //是否多行下移后下一回合停滞
        this.bBricksDownOver = false;    //砖块加载完或下落完毕
        this.bBallsDropOver = false;   //小球是否全部落地
        this.firstEmissionEnd = null;    //第一段射线的末点

        this.curRow = 0;   //当前最后出现的砖块行数
        this.noEnemyTime = -100;  //小球发射后，当前视图内没有敌人后2.0秒弧度加速回落 

        this.nextTotal = 1;  //下一回合需要下降的总行数（默认为1，当视图中无敌人砖块时，下降三行）
        this.bStagnation = false;   //停滞砖块死亡后，若屏幕内有敌方阵营，本回合结束后所有怪物（无论是敌方阵营或友方阵营）不下移；屏幕外的也不下移。

        this.roundDownBrickCount = 0;   //当前回合下移的砖块总量
        this.bPreMoveDownOver = false;  //预下移处理是否完毕

        this.topPosType = new Array(0, 0, 0);
        this.roundBrickDeadCount = 0;   //回合砖块死亡数量

        this.launchCount = 0;   //本次战斗发射次数
        this.unLuanchBallCount = 0;   //未发射的小球数量
        this.bShowFixGuideDot = false;   //是否显示第一关固定指示线
        this.fixGuideStep = 0;  //第一关固定指示线（移动步数）

        this.levelInitLineNum = 0;  //初始显示的行数
    }

    onLoad () {
        NotificationMy.on(NoticeType.BrickDeadEvent, this.handleBrickDeadEvent, this);    //反弹砖块消失（死亡）
        NotificationMy.on(NoticeType.GemaRevive, this.handleGemaRevive, this);    //复活，将最下三层砖块消除
        NotificationMy.on(NoticeType.GameReStart, this.handleGameReStart, this);   //重新开始游戏
    }

    //重新开始游戏
    handleGameReStart(){
        this.clearQiPanData();
    }

    onDestroy(){
        this.node.stopAllActions();
        NotificationMy.offAll(this);

        this.brickPool.clear();
        this.dotPool.clear();
    }

    start () {
        this.brickPool =  new cc.NodePool(Brick);   //砖块缓存池
        //只有在new cc.NodePool(Dot)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
        this.dotPool = new cc.NodePool();  //指示点缓存池
        //只有在new cc.NodePool(Dot)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
    }

    update (dt) {
        if(this.fixGuideStep > 0){  //第一关固定指示线（移动步数）
            this.fixGuideStep --;
            this.handleFixGuideStepUpdate();
        } 

        if(this.noEnemyTime > 0){   //-100为默认值小球发射后，当前视图内没有敌人后N秒弧度加速回落
            this.noEnemyTime -= dt;
            if(this.noEnemyTime <= 0.00000001){
                this.setNoEnemyTime(false);   //设置是否开启视图内没有敌人后N秒弧度加速回落
                
                FightMgr.getFightScene().setBallSpeedUpDropState(true);
                //小球加速抛物落下, 加速回收抛物线回到第一个小球落地点，若此时无小球落地，则回收点为当前回合发射起点。
                let launchPos = cc.v2(FightMgr.emissionPointX, FightMgr.getBallPosY());
                NotificationMy.emit(NoticeType.BallSpeedUpDrop, launchPos);   //小球抛物加速下落
            }
        }
    }

    /**从缓存池中获取或创建砖块 */
    createBrickFromPool(): cc.Node{
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

    /**从缓存池中获取或创建指示点 */
    createDotFromPool(dotPf: cc.Prefab): cc.Node{
        if (this.dotPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            return this.dotPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            return cc.instantiate(dotPf);
        }
    }

    /**将指示点回收到缓存池 */
    removeDotToPool(dot: cc.Node){
        this.dotPool.put(dot); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }

    /** 第一个球落地后，设置角色位置*/
    setPlayerPos(){
        this.nCat.getComponent(Cat).setPositionWithMove(FightMgr.emissionPointX, FightMgr.getCatPosY());
    }

    /**获取大猫尺寸 */
    getCatWidth(){
        return this.nCat.width;
    }

    /**取消触摸状态 */
    handleCancleTouch(){
        //取消小球瞄准
        this.nBalls.children.forEach((node, index)=>{
            node.getComponent(Ball).handleBallAimState(false);
        })

        this.nCat.rotation = 0;
        this.nCat.getComponent(Cat).showCatLaunchAnimation(false);  //停止猫发射动画

        this.offIndicator();  //关闭指示线
    }

    /**处理触摸 */
    handleTouchPos(pos: cc.Vec2){
        if(this.canTouchIndicator() == true){  //砖块加载完或下落完毕
            this.firstEmissionEnd = null;
            this.showIndicator(pos);  //显示指示线

            //this.nCat.rotation = -20;

            //小球瞄准
            this.nBalls.children.forEach((node, index)=>{
                node.getComponent(Ball).handleBallAimState(true);
            })
        }
    }

    /**是否可以响应触摸显示指示线 */
    canTouchIndicator(){
        if(this.bBricksDownOver == true && this.bBallsDropOver == true && this.bMultiLineMove == false){  //砖块加载完或下落完毕, 小球下落完毕，且非多行下移
            return true;
        }else{
            //cc.log("触摸无效， this.bBricksDownOver = "+this.bBricksDownOver+"; this.bBallsDropOver = "+this.bBallsDropOver+"; this.bMultiLineMove = "+this.bMultiLineMove);
            return false;
        }
    }

    /**游戏复活，将最下三层砖块消除 */
    handleGemaRevive(){
        FightMgr.bGameOver = false; 
        FightMgr.win = false;

        this.bBricksDownOver = true;  //砖块下落完毕
        this.bBallsDropOver = true;   //小球是否全部落地
        this.bMultiLineMove = false;   //多行下移
        this.bMultiLineStagnation = false;  //是否多行下移后下一回合停滞
        this.bCreateNextRound = false; //是否在检查完回合事件后进行新行砖块创建并下移

        this.handleBricksLineRoundOver();  //砖块下落后回合事件处理完毕
    }

    /**处理游戏结束，有时候需要延迟 */
    hanldeGameOver(win: boolean){
        if(FightMgr.bGameOver == false){  //该局游戏是否结束
            FightMgr.bGameOver = true;   
            FightMgr.win = win;

            //回合结束 仍有小球在飞，让其加速曲线下落
            this.setNoEnemyTime(true);   //设置是否开启视图内没有敌人后N秒弧度加速回落
            this.node.stopActionByTag(this.GameOverDelayActionTag);   //不知道为什么延迟总是比设定时间少1.5秒左右，故设置了2.0
            if(win == false){   //复活
                FightMgr.getFightScene().gameOver(false);
            }else{
                //cc.log("gameOver DelayTime");
                let gameoverDelay = cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
                    FightMgr.getFightScene().gameOver(true);
                }.bind(this)));
                gameoverDelay.setTag(this.GameOverDelayActionTag);   //游戏结束延迟显示
                this.node.runAction(gameoverDelay);
            }
        }
    }
  
    /**初始化棋盘对象 */
    initQiPanObjs(){
        cc.log("initQiPanObjs(), 初始化棋盘对象")
        this.levelInitLineNum = FightMgr.level_info.levelCfg.init_lines;  //初始显示的行数

        this.setPlayerPos();   //设置角色位置
        this.initBricks();    //初始展示关卡砖块行数
        this.initBalls();   //初始化小球
    }

    /********************************** 以下部分为小球处理  **************************************** */
    /**初始化小球 */
    initBalls(){
        this.nBalls.removeAllChildren(true);
        let fightBallList = MyUserDataMgr.getFightListClone();
        for(let i=0; i<fightBallList.length; ++i){
            let ball: Ball = this.addBallToList(i, fightBallList[i]);   //添加小球到攻击列表中
            let destVec3 = FightMgr.getBallNodeDefaultPos();
            ball.node.setPosition(cc.v2(destVec3.x, destVec3.y));
            ball.changeBallWithState(BallState.normal);   //根据球的状态来改变外形图片
        }
        this.bBallsDropOver = true;   //小球是否全部落地
    }

    /**添加小球到攻击列表中 */
    addBallToList(idx: number, ballInfo: BallInfo){
        let BallNode: cc.Node = cc.instantiate(this.pfBall);   //创建小球 
        this.nBalls.addChild(BallNode);
        let ball = BallNode.getComponent(Ball);
        ball.setBallId(idx, ballInfo);
        return ball;
    }

    //第一关引导指示线移动
    handleFixGuideStepUpdate(){
        if(this.fixGuideStep <= 0){
            this.fixGuideStep = 0;
            this.offIndicator();
        }else{
            let launchPos = cc.v2(FightMgr.emissionPointX, FightMgr.getBallPosY());
            let fixPos = cc.v2(350, 0);   //第一关的引导固定射线点
            let aimPos = cc.v2(fixPos.x - this.node.width/2, this.node.height/2 - fixPos.y);
            
            let dir1 = aimPos.sub(launchPos).normalize();
            let dir = this.firstEmissionEnd.point.sub(launchPos);
            let dir2 = dir.normalize();
            let rad = dir1.signAngle(dir2);
            if( rad < 0){
                dir.rotateSelf(0.1);
            }else{
                dir.rotateSelf(-0.1);
            }

            let endPos = launchPos.add(dir);
            this.showIndicator(endPos);
        }
    }

    /**发射小球 */
    launchBalls(){
        let launchPos = cc.v2(FightMgr.emissionPointX, FightMgr.getBallPosY());

        if(FightMgr.level_id == 1 && this.launchCount == 0){   //第一关前两个回合强制引导线  //本次战斗发射次数 
            let fixPos = cc.v2(350, 0);   //第一关的引导固定射线点
            let aimPos = cc.v2(fixPos.x - this.node.width/2, this.node.height/2 - fixPos.y);
            
            let dir1 = aimPos.sub(launchPos).normalize();
            let dir2 = this.firstEmissionEnd.point.sub(launchPos).normalize();
            let rad = dir1.signAngle(dir2);

            if(!(Math.abs(rad) <= 0.06)){
                this.fixGuideStep = Math.ceil((Math.abs(rad) - 0.06)/0.1);  //第一关固定指示线（移动步数）
                return;
            }
        }

        this.nFixIndicator.removeAllChildren(true);   //第一关固定指示线使用
        this.nCat.getComponent(Cat).showCatLaunchAnimation(true);  //停止猫发射动画

        this.launchCount ++;   //本次战斗发射次数
        
        FightMgr.bFirstHitGround = false;
        FightMgr.ballDropedCount = 0;   //小球发射后，已经落地的数量

        this.roundBrickDeadCount = 0;   //回合砖块死亡数量

        this.bBallsDropOver = false;   //小球是否全部落地
        this.bBricksDownOver = false;  //砖块下落完毕

        this.bCreateNextRound = true;  //是否在检查完回合事件后进行新行砖块创建并下移

        //小球移动到发射点后，在逐次发射
        this.nBalls.children.forEach((node, index)=>{
            node.getComponent(Ball).launch(launchPos, this.firstEmissionEnd.clone());
        })
    }

    /**处理所有小球都下落完毕，之后小球排序，检查回合结束 */
    handleBallsDropOver(){
        //cc.log("handleBallsDropOver(), 小球都下落完毕")
        this.bBallsDropOver = true;   //小球是否全部落地
        this.setNoEnemyTime(false);   //设置是否开启视图内没有敌人后N秒弧度加速回落

        //小球排序
        this.nBalls.children.forEach((node, index)=>{
            node.getComponent(Ball).handleBallSort(0.5);
        })

        this.checkGameOverOrNextRound();   //检测是否游戏结束或下一回合
    }

    /**************以上为小球处理--------------------------------- */

    /********************************* 以下部分为指示线  ******************************* */
    /**关闭指示线 */
    offIndicator(){
        FightMgr.offRay();
        this.nIndicator.removeAllChildren(true); 
    }

    /**显示指示线 */
    showIndicator(fingerPos: cc.Vec2, bFixGuide:boolean=false){
        if(fingerPos){
            this.offIndicator();  //关闭指示线

            let launchPos = cc.v2(FightMgr.emissionPointX, FightMgr.getBallPosY());
            let dir: cc.Vec2 = fingerPos.sub(launchPos);
            let angle = -FightMgr.getAngle(cc.v2(dir.x, dir.y));
    
            // 限制低角度
            if(angle < 5 && angle>=-90){
                angle = 5;
            }
            if(angle > 175 || angle <-90){
                angle = 175;
            }
            
            let newDir = FightMgr.getVector(angle);

            this.bShowFixGuideDot = bFixGuide;   //是否显示第一关固定指示线

            //射出射线（多条折线）
            if(this.drawGraphics){
                this.drawGraphics.clear();
            }
            //射出射线（多条折线），并返回第一条折线的末点坐标
            this.firstEmissionEnd = FightMgr.castMultiRay(launchPos, newDir, FightMgr.defaultRayCount);   //默认的绘制指示线的射线段数
        }
    }

    /**划线 bFixGuide 是否为固定显示的引导射线*/
    showDot(startPos:cc.Vec2, endPos:cc.Vec2){
        if(FightMgr.rayCount <= 0){  //需要绘制的射线段数
            return;
        }
        //this.drawLine(startPos, endPos);
        
        let dir:cc.Vec2 = endPos.sub(startPos);
        let num = Math.ceil(dir.mag()/this.dotInterval);
        dir.normalizeSelf();
        let addDir:cc.Vec2 = dir.mul(this.dotInterval);

        let lastDotPos: cc.Vec2 = startPos;
        for(let i=1; i<=num; i++){
            let dot = this.createDotFromPool(this.pfDot);   //从缓存池中获取或创建小球
            let dotSc = dot.getComponent(Dot);
            dotSc.setDotRay(startPos, endPos, dir);   //设置点所在的射线起始点和终点

            if(i == num){
                dotSc.changeDotToArrow(true);  //变点位箭头图片
                dot.rotation = FightMgr.getAngle(dir);   //从(1,0)到dir的角度，顺时针为正，逆时针为负
                dot.setPosition(endPos);
            }else{
                dotSc.changeDotToArrow(false);  //变点位箭头图片
                lastDotPos = lastDotPos.add(addDir);    //interval*i
                dot.setPosition(lastDotPos);
            }

            if(FightMgr.level_id == 1 && this.launchCount < 2 && this.bShowFixGuideDot == true){   //第一关前两个回合强制引导线  //本次战斗发射次数   //是否显示第一关固定指示线
                this.nFixIndicator.addChild(dot);  //第一关固定指示线使用
            }else{
                this.nIndicator.addChild(dot);
            }
        }
    }

    /**测试，画出相交线 */
    drawLine(start: cc.Vec2, end: cc.Vec2){
        if(this.drawGraphics == null){
            let drawNode = new cc.Node();
            this.nIndicator.addChild(drawNode, 1000);
            this.drawGraphics = drawNode.addComponent(cc.Graphics);
        }
        this.drawGraphics.lineWidth = 2;
        this.drawGraphics.fillColor.fromHEX('#ff0000');
        
        //this.drawGraphics.clear();
        this.drawGraphics.moveTo(start.x, start.y);
        this.drawGraphics.lineTo(end.x, end.y);
        this.drawGraphics.close();

        this.drawGraphics.stroke();
        this.drawGraphics.fill();
    }

    /*****************以上为指示线 -------------------------- */

    /**********************    以下代码为砖块处理部分  ***************************************** */

    /**初始展示关卡砖块行数 FightMgr中setBricks加载完关卡信息后，调用*/
    initBricks(){
        this.nBricks.destroyAllChildren();  //遍历孩子加载到缓存池的方法会造成砖块没有完全消失的怪状

        this.bCreateNextRound = false;  //是否在检查完回合事件后进行新行砖块创建并下移
        this.bMultiLineMove = true;   //多行下移（初始或无敌块）
        this.bMultiLineStagnation = false;  //是否多行下移后下一回合停滞
        this.curRow = 0;
        for(let i=0; i<this.levelInitLineNum; ++i){ //初始显示的行数
            this.createNewRoundLineBricks(true);   //创建新的一行砖块
        }
    }

    /**根据行属性（是否随机）产生一行砖块 */
    createBrickNodesOneLine(bFightInit:boolean = false){
        let bricksCfg = FightMgr.bricksCfg;  //初始关卡信息Map<number, Array<BrickCfg> number：某行 Array<BrickCfg>某行对应的砖块 ,下标从(0,0)开始，左下角第一个为(0,0)
        let objs = bricksCfg[this.curRow-1];
        if(objs == null || objs == undefined){
            //cc.warn("objs == null || objs == undefined, bricksCfg = "+JSON.stringify(bricksCfg));
        }else{
            FightMgr.getFightScene().updateRoundProgress();   //更新关卡回合显示

            if(this.curRow > FightMgr.level_info.levelCfg.total_lines){
                console.log("新行已经超出了配置最大行数限制，故不再显示");
                return;
            }

            //cc.log("objs = "+JSON.stringify(objs));
            for(let j=0; j<objs.length; j++){
                let brickNode: cc.Node = this.createBrickFromPool();   //从缓存池中获取或创建砖块
                this.nBricks.addChild(brickNode, -this.curRow);
 
                if(bFightInit == true){   //初始下移的砖块直接显示，不再有下移过程
                    brickNode.y = this.node.height/2 - FightMgr.tileHeight*(this.levelInitLineNum - this.curRow + 1.5);  //棋盘边界矩形（中心点+宽高）
                }
                brickNode.getComponent(Brick).setMoveLineBricks();   //设置移动砖块的行砖块集合
            }
        }
    }

    /**创建新的一行砖块*/
    createNewRoundLineBricks(bFightInit:boolean = false){
        if(FightMgr.bGameOver == true){
            cc.log("createNewRoundLineBricks(), 游戏已经结束， FightMgr.bGameOver = "+FightMgr.bGameOver+"win = "+FightMgr.win);
            return;
        }
        
        this.curRow ++;
        this.bCreateNextRound = false;  //是否在检查完回合事件后进行新行砖块创建并下移
        this.bBricksDownOver = false;  //砖块加载完或下落完毕
        this.nextTotal --;  //下一回合需要下降的总行数（默认为1，当视图中无敌人砖块时，下降三行）
        if(this.bMultiLineMove == true){  //是否战斗初始化层最后一层
            if(this.curRow == this.levelInitLineNum){
                this.bMultiLineMove = false;   //多行下移（初始或无敌块）
            }else if(this.curRow > this.levelInitLineNum && this.nextTotal == 0){
                this.bMultiLineMove = false;   //多行下移（初始或无敌块）
            }
        }
        if(this.nextTotal <= 0){
            this.nextTotal = 1;
        }

        this.createBrickNodesOneLine(bFightInit);   //根据行属性（是否随机）产生一行砖块

        if(bFightInit == true){  //初始下移的砖块直接显示，不再有下移过程
            this.handleBricksPreMoveDown(false);   //砖块准备下移
        }else{
            this.handleBricksPreMoveDown(true);   //砖块准备下移
        }
    }

    //是否初始的多行下移
    isInitMultiLine(){
        if(this.curRow < this.levelInitLineNum){
            return true;
        }else{
            return false;
        }
    }

    /**砖块准备下移, 停滞状态不下移 */
    handleBricksPreMoveDown(bMove:boolean){
        //cc.log("handleBricksPreMoveDown() 发送砖块准备下移消息, ballsLen = "+this.nBricks.children.length+"; this.roundDelayTime = "+this.roundDelayTime+"; bMove = "+bMove);
        this.roundDownBrickCount = 0;   //当前回合下移的砖块总量
        this.bBricksDownOver = false;    //砖块加载完或下落完毕

        if(this.nBricks.children.length == 0){
            this.handleBricksLineRoundOver();   //砖块下落后回合事件处理完毕
        }else{
            //注意，如果下移操作中某些砖块会死亡，则不能使用forEach（会少遍历一些砖块）而用异步消息
            this.bPreMoveDownOver = false;  //预下移处理是否完毕
            NotificationMy.emit(NoticeType.BrickPreMoveDown, bMove);    //砖块准备下移
        }
    }

    /**检测屏幕内是否有敌人，无则加速回落 */
    checkHasEnemyCurView(){
        let hasEnemy: boolean = false;   //当前视图是否还有敌人
        for(let i=0; i<this.nBricks.children.length; ++i){
            let node = this.nBricks.children[i];
            let brick = node.getComponent(Brick);
            if(brick && brick.isBrickDead() == false){
                hasEnemy = true;
                break;
            }
        }
        return hasEnemy;
    }

    /**设置是否开启视图内没有敌人后N秒弧度加速回落 */
    setNoEnemyTime(bOpenTime: boolean = false){
        if(bOpenTime == true && this.noEnemyTime == -100){
            this.noEnemyTime = 0.5;
        }else if(bOpenTime == false){
            this.noEnemyTime = -100;  //小球发射后，当前视图内没有敌人后2.0秒弧度加速回落
        }
    }

    /**砖块消失检查是否还有敌方砖块 */
    handleBrickDeadAndCheckEnemy(bBrickDead: boolean = true){
        //检测屏幕内是否有敌人，无则待小球发射后2.0s加速抛物线回落
        //cc.log("handleBrickDeadAndCheckEnemy(), this.nBricks.children.length = "+this.nBricks.children.length);
        if(this.nBricks.children.length == 0 || this.checkHasEnemyCurView() == false){   //当前视图内没有敌人了
            this.nextTotal = 0;
            for(let i=1; i<=5; ++i){
                let bricksCfg = FightMgr.bricksCfg;  //初始关卡信息Map<number, Array<BrickCfg> number：某行 Array<BrickCfg>某行对应的砖块 ,下标从(0,0)开始，左下角第一个为(0,0)
                let objs = bricksCfg[this.curRow+i-1];
                //cc.log("objs = "+JSON.stringify(objs));
                if(objs){
                    this.nextTotal = i;  //下一回合需要下降的总行数（默认为1，当视图中无敌人砖块时，下降三行）
                }
                if(this.nextTotal > 0 && i >= 3){
                    break;
                }
            }
            cc.log("没有敌人, this.nextTotal = "+this.nextTotal+"; this.bBallsDropOver = "+this.bBallsDropOver);
            if(this.nextTotal == 0){   //没有敌人且没有后续砖块，游戏结束
                if(this.bBallsDropOver == true){
                    this.hanldeGameOver(true);
                }else{
                    this.setNoEnemyTime(true);   //设置是否开启视图内没有敌人后N秒弧度加速回落
                }
            }else{
                if(this.nextTotal > 1){
                    this.bMultiLineMove = true;   //多行下移（初始或无敌块）
                }
                if(this.bBallsDropOver == false){
                    this.setNoEnemyTime(true);   //设置是否开启视图内没有敌人后N秒弧度加速回落
                }else{
                    if(this.nBricks.children.length == 0 && bBrickDead == true){
                        this.handleBricksLineRoundOver();   //砖块下落后回合事件处理完毕
                    }
                }
            }
        }else{
            this.setNoEnemyTime(false);   //设置是否开启视图内没有敌人后N秒弧度加速回落
        }
    }

    /**处理砖块消失 */
    handleBrickDeadEvent(deadBrick: Brick){
        if(deadBrick){
            this.roundBrickDeadCount ++;   //回合砖块死亡数量
            FightMgr.getFightScene().checkRoundBrickDeadCount(this.roundBrickDeadCount);
            FightMgr.resetRoundPathArrByBrickDead(deadBrick.brickId);   //砖块死亡，将回合复用路径集合中相关的数据删除

            this.node.stopActionByTag(this.DeadDelayActionTag);   //砖块死亡延迟动作Tag
            if(this.bBallsDropOver == true){   //小球已经全部落地，则不再延迟处理
                this.handleBrickDeadAndCheckEnemy(true);
            }else{
                let brickDeadDelay = cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
                    this.handleBrickDeadAndCheckEnemy(true);
                }.bind(this)))
                brickDeadDelay.setTag(this.DeadDelayActionTag);
                this.node.runAction(brickDeadDelay);
            }
        }
    }

    /**先左1右2随机，后上3下4随机 */
    getRandomAdjacent(){
        let list: number[] = new Array();
        let randomFun = function(num1, num2){
            if(Math.random() < 0.5){
                list.push(num1);
                list.push(num2);
            }else{
                list.push(num2);
                list.push(num1);
            }
        }
        
        if(Math.random() < 0.5){
            randomFun(1,2);
            randomFun(3,4);
        }else{
            randomFun(3,4);
            randomFun(1,2);
        }

        return list;
    }

    /**获取邻近的随机砖块 先左1右2随机，后上3下4随机 */
    getAdjacentRandomBrick(pos: cc.Vec2): any[]{
        let listNum = this.getRandomAdjacent();
        let brickList: any[] = new Array(4);
        for(let j=0; j<listNum.length; ++j){
            brickList[j] = listNum[j];
        }
        for(let i=0; i<this.nBricks.children.length; ++i){
            let node = this.nBricks.children[i];
            let len = node.position.sub(pos).mag();
            if(len > 10 && len <= 150 && node.y < (this.node.height/2 - FightMgr.tileHeight)){
                let offsetX = Math.abs(node.x - pos.x);
                let offsetY = Math.abs(node.y - pos.y);
                for(let j=0; j<listNum.length; ++j){
                    if(listNum[j] == 1){  //左1
                        if(node.x < pos.x && offsetY < 10){
                            brickList[j] = node;
                            break;
                        }
                    }else if(listNum[j] == 2){  //右2
                        if(node.x > pos.x && offsetY < 10){
                            brickList[j] = node;
                            break;
                        }
                    }else if(listNum[j] == 3){  //上3
                        if(node.y > pos.y && offsetX < 10){
                            brickList[j] = node;
                            break;
                        }
                    }else if(listNum[j] == 4){  //下4
                        if(node.y < pos.y && offsetX < 10){
                            brickList[j] = node;
                            break;
                        }
                    }
                }
            }
        }
        return brickList;
    }

    /**通过砖块动态复制创建一个砖块 复活（随机复活，自身复活)， 分裂，复制
     * @param pos 触发事件的砖块位置
     * @param bottomLine 砖块当前距离底部的行数（倒数第一行为死亡行）
     * @param hp 新砖块的最大血量和血量
     * @param monsterIds 新怪物ID集合
     * @param cloneType 类型，复活（随机复活1，自身复活2)， 分裂3，复制4 (不包含5传染和6平等)，5复活指定ID砖块
    */
    addBrickCloneBrick(pos: cc.Vec2, bottomLine: number, hp: number, cloneType:number, monsterIds:number[]){
        //cc.log("addBrickCloneBrick(), 复活（随机复活1，自身复活2)， 分裂3，复制4, cloneType = "+cloneType);
        if(pos == null){
            cc.log("warning, addBrickCloneBrick(), brick is null");
            return;
        }
        if(bottomLine <= 1){
            cc.log("在死亡层之上一层(倒数第二行）不能触发事件");
            return;
        }
        hp = Math.floor(hp);
        if(hp < 1){
            hp = 1;
        }
        pos.y = FightMgr.adjustBrickPosFromMove(pos.y, FightMgr.tileHeight);   //校正砖块Y坐标，防止因下移而产生的最终位置偏移
        let offsetY = pos.y - FightMgr.gameBottomPosY;   //砖块距棋盘底部的距离
        if(offsetY > FightMgr.tileHeight){  //在最下一行（死亡行）时，死亡后直接消失，不再随机复活或复制。
            let brickList: any[] = this.getAdjacentRandomBrick(pos);   //获取邻近的随机砖块 先左1右2随机，后上3下4随机
            for(let j=0; j<brickList.length; ++j){
                if(typeof(brickList[j]) == "number"){   //先左1右2随机，后上3下4随机
                    let revivePos = pos.clone();
                    if(brickList[j] == 1){  //左1
                        revivePos.x -= FightMgr.tileWidth;
                    }else if(brickList[j] == 2){  //右2
                        revivePos.x += FightMgr.tileWidth;
                    }else{
                        if(bottomLine == 2){
                            if(cloneType == 3){   //分裂怪在倒数第三行时，死亡后不在下面生成新怪物
                                if(brickList[j] == 3){  //上3
                                    revivePos.y += FightMgr.tileHeight;
                                }else if(brickList[j] == 4){  //下4
                                    revivePos = null;
                                }
                            }else{   //在倒数第三行，复制、随机复活、自己复活只在左右上产生新怪
                                revivePos = null;
                            }
                        }else{
                            if(brickList[j] == 3){  //上3
                                revivePos.y += FightMgr.tileHeight;
                            }else if(brickList[j] == 4){  //下4
                                revivePos.y -= FightMgr.tileHeight;
                            }
                        }
                    } 
                    //cc.log("添加新砖块， pos = "+pos+"; revivePos = "+revivePos);
                    if(revivePos){
                        if(Math.abs(revivePos.x) > this.node.width/2){   //超出屏幕，倒数第二行的砖块不会复制或复活          
                        }else if(Math.abs(revivePos.y) > (this.node.height/2 - FightMgr.tileHeight)){
                        }else{
                            let monsterType = monsterIds[0];
                            if(cloneType == 1){   //复活（随机复活1，自身复活2)， 分裂3，复制4
                                let idx = Math.floor(Math.random()*monsterIds.length*0.99);
                                monsterType = monsterIds[idx];
                                pos = null;
                            }else if(cloneType == 2){  //复活（随机复活1，自身复活2)， 分裂3，复制4
                                pos = null;
                            }else if(cloneType == 3){
                                let idx = brickList[j]-1;
                                monsterType = monsterIds[idx];
                            }else if(cloneType == 4){
                            }else if(cloneType == 5){
                                monsterType = monsterIds[0];
                            }
                            //cc.log("monsterType = "+monsterType+"; monsterIds = "+JSON.stringify(monsterIds));
                            let brickInfo = new BrickInfo(monsterType);
                            if(cloneType != 5){
                                brickInfo.curHp = hp;
                                brickInfo.maxHp = hp;
                            }

                            if(this.checkHasBrickByPos(revivePos, pos) == false){   //检测指定坐标位置是否已经有砖块了
                                let brickNode: cc.Node = this.createBrickFromPool();   //从缓存池中获取或创建砖块
                                brickNode.opacity = 0;  //注意不要用active，因为重置为true后一些脚本属性会消失
                                brickNode.setPosition(revivePos);
                                this.nBricks.addChild(brickNode);

                                brickNode.getComponent(Brick).initBricvkAndMoveToPos(brickInfo, cloneType, pos);   //砖块初始化并移动到指定位置
    
                                FightMgr.clearRoundPathArr();   //清除复用数据
                                
                                if(cloneType != 3){   //非分裂怪
                                    return true;
                                }else{
                                    //分裂砖块死亡后，立即在上下左右相邻的4个空格，各生成20%最大HP的小怪 
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    /**检测指定坐标位置是否已经有砖块了 */
    checkHasBrickByPos(pos: cc.Vec2, srcPos: cc.Vec2=null){
        for(let i=0; i<this.nBricks.children.length; ++i){
            let node: cc.Node = this.nBricks.children[i];
            if(Math.abs(pos.y - node.y) < 50){
                let len = Math.abs(pos.x - node.x);  //node.position.sub(pos).mag();
                if(len < 50){ 
                    return true;
                }else if(len <= 100 && node.group == "MoveBrick" && srcPos){   //判定移动怪
                    if((pos.x - srcPos.x)*(node.x - srcPos.x) >= 0){   //同侧
                        return true;
                    }
                }
            }
        } 
        return false;
    }

    /**检查坐标是否在砖块内 */
    checkHasEnemyByPos(pos: cc.Vec2, brickId=null): Brick{
        let limitLen = 48 + FightMgr.ballRadiusConf;
        for(let i=0; i<this.nBricks.children.length; ++i){
            let node: cc.Node = this.nBricks.children[i];
            if(Math.abs(pos.y - node.y) < limitLen && Math.abs(pos.x - node.x) < limitLen){
                let brick = node.getComponent(Brick);
                if(brickId != brick.brickId){
                    return brick;
                }
            }
        } 
        return null;
    }

    /**返回指定坐标行的砖块集合 */
    getLineBricksByPos(pos: cc.Vec2, bincludeSelf=false){
        let nodeArr: cc.Node[] = new Array();
        for(let i=0; i<this.nBricks.children.length; ++i){
            let node: cc.Node = this.nBricks.children[i];
            if(Math.abs(pos.y - node.y) < 10){
                if(bincludeSelf == false && Math.abs(pos.x - node.x) < 20){
                }else{
                    nodeArr.push(node);
                }
            }
        } 
        return nodeArr;
    }

    /*******************  以上部分为砖块处理部分  --------------- */

    /******************************************** 以下部分为回合处理 ******************************************** */
    /**检测回合结束 */
    checkGameOverOrNextRound(){
        if(this.bBallsDropOver == true){   //砖块下落完毕，小球下落完毕
            this.handleBricksLineRoundOver();   //砖块下落后回合事件处理完毕
        }
    }

    /** 砖块下落后回合事件处理完毕*/
    handleBricksLineRoundOver(){
        //cc.log("handleBricksLineRoundOver(), 砖块下落后回合事件处理完毕 bGameOver = "+FightMgr.bGameOver+"; this.bMultiLineMove = "+this.bMultiLineMove+");
        this.nBricks.stopActionByTag(this.BricksLineDelayActionTag);  //砖块下移完毕新回合开始延迟
        if(FightMgr.bGameOver == false){  //该局游戏是否结束
            if(this.bMultiLineMove == true){   //多行下移过程中
                if(this.bStagnation == true){
                    this.bMultiLineStagnation = true;  //是否多行下移后下一回合停滞
                }
                this.createNewRoundLineBricks();  
            }else{
                if(this.bCreateNextRound == false){  //是否在检查完回合事件后进行新行砖块创建并下移
                    //多行下移的最后一行不再创建新层
                    cc.log("不再创建新层")
                    if(FightMgr.level_id == 1 && this.launchCount < 2){   //第一关前两个回合强制引导线  //本次战斗发射次数
                        let fixPos = cc.v2(350, 0);   //第一关的引导固定射线点
                        let aimPos = cc.v2(fixPos.x - this.node.width/2, this.node.height/2 - fixPos.y);
                        if(aimPos){
                            this.showIndicator(aimPos, true);  //显示指示线
                        } 
                    }else{
                        this.bBricksDownOver = true;    //砖块加载完或下落完毕
                    }
                }else{
                    if(this.nBricks.children.length == 0 || this.checkHasEnemyCurView() == false){   //当前视图内没有敌人了
                        this.handleBrickDeadAndCheckEnemy(false);   //砖块消失检查是否还有敌方砖块
                        this.createNewRoundLineBricks();
                    }else{
                        if(this.bStagnation == true){  //停滞砖块死亡后，若屏幕内有敌方阵营，本回合结束后所有怪物（无论是敌方阵营或友方阵营）不下移；屏幕外的也不下移。
                            this.bStagnation = false;
                            this.bCreateNextRound = false;  //是否在检查完回合事件后进行新行砖块创建并下移
                            this.handleBricksPreMoveDown(false);   //砖块预下移

                            FightMgr.getFightScene().showStagnationImg(true);   //显示停滞冰冻图片
                        }else{
                            this.createNewRoundLineBricks();
                        }
                    }
                }
            }
        }
    }  

    /**处理砖块回合预下移操作 */
    handleBrickPreMoveDown(bMove:boolean){
        if(this.bPreMoveDownOver == true){  //预下移处理是否完毕
            return;
        }; 
        this.roundDownBrickCount ++;   //当前回合下移的砖块总量
        let count = this.nBricks.children.length;
        //cc.log("handleBrickPreMoveDown(), this.roundDownBrickCount = "+this.roundDownBrickCount+"; count = "+count);
        if(this.roundDownBrickCount >= count){
            this.roundDownBrickCount = 0;   //当前回合下移的砖块总量
            this.bPreMoveDownOver = true;  //预下移处理是否完毕

            //this.node.stopActionByTag(this.BricksMoveDelayActionTag);   //砖块下移延迟动作
            let moveDelay = cc.sequence(cc.delayTime(0.5), cc.callFunc(function(){
                AudioMgr.playEffect("effect/down");
                NotificationMy.emit(NoticeType.BrickMoveDownAction, {"bMultiLineMove":this.bMultiLineMove, "bMove":bMove});    //砖块下移通知
            }.bind(this)));
            //moveDelay.setTag(this.BricksMoveDelayActionTag);
            this.node.runAction(moveDelay);
        }
    }

    /**处理砖块回合下落完毕(未检查事件) */
    handleBrickMoveDown(){
        this.roundDownBrickCount ++;   //当前回合下移的砖块总量
        let count = this.nBricks.children.length;
        if(this.roundDownBrickCount >= count){
            this.roundDownBrickCount = 0;   //当前回合下移的砖块总量
            this.bricksMoveOverAndCheckAttr();   //砖块下落完毕并检查属性
        }
    }

    /**处理砖块回合下落完毕(检查事件) */
    handleBrickMoveDownAndCheckAttr(){
        this.roundDownBrickCount ++;   //当前回合下移的砖块总量
        let count = this.nBricks.children.length;
        //cc.log("handleBrickMoveDownAndCheckAttr()，处理砖块回合下落完毕(检查事件) num = "+this.roundDownBrickCount+"; count = "+count+"; this.bBallsDropOver = "+this.bBallsDropOver);
        if(this.roundDownBrickCount >= count){
            if(this.bBallsDropOver == true){   //砖块下落完毕，小球下落完毕
                this.handleBricksLineRoundOver();   //砖块下落后回合事件处理完毕
            }
        }
    }

    /**砖块下落完毕并检查属性 */
    bricksMoveOverAndCheckAttr(){
        //cc.log("bricksMoveOverAndCheckAttr(), 砖块下落完毕并检查属性 this.roundDelayTime = "+this.roundDelayTime);
        //回合下移前，砖块事件的优先级是砖块对齐、砖块传染、砖块吞噬、砖块复制
        this.nBricks.stopActionByTag(this.BricksRoundDelayActionTag);  //回合结束砖块下移前回合事件处理动作

        let roundAction = cc.sequence(cc.delayTime(0.5), cc.callFunc(function(){
            NotificationMy.emit(NoticeType.BrickInvincible, null);    //砖块无敌/盾牌
        }.bind(this)))

        roundAction.setTag(this.BricksRoundDelayActionTag);
        this.nBricks.runAction(roundAction);
    }

    /**************** 以上为回合处理 ---------------------- */

    /*******************************以下为特效处理************************************* */
    /**显示飘血动画 */
    showHpAction(harm: number, pos: cc.Vec2, bWhite=false){
        let harmNode = cc.instantiate(this.pfharmHp);
        if(bWhite == true){
            harmNode.color = cc.color(255, 255, 255);
        }else{
            harmNode.color = cc.color(253, 255, 45);
        }
        let harmLabel = harmNode.getComponent(cc.Label);
        harmLabel.string = harm.toString();
        harmNode.setPosition(pos);
        harmNode.scale = 0.25;
        this.nEffect.addChild(harmNode, 100);

        let a = Math.random()*60 - 30;
        let dir = cc.v2(0, 1).rotateSelf(cc.misc.degreesToRadians(a));
        let y = Math.random()*5 + 15;
        let x = dir.x * Math.abs(y/dir.y);

        harmNode.runAction(cc.sequence(cc.spawn(cc.moveBy(0.1, cc.v2(x, y)), cc.scaleTo(0.05, 1.0)), cc.moveBy(0.05, cc.v2(0, 20)), cc.moveBy(0.025, cc.v2(0, -10)),
            cc.spawn(cc.moveBy(0.1, cc.v2(0, 50)), cc.fadeTo(0.1, 0)), cc.removeSelf(true)));
    }

    /**砖块死亡特效 */
    showBrickDeadAni(pos: cc.Vec2){
        let effNode = new cc.Node;
        let effectSpr = effNode.addComponent(cc.Sprite);
        effNode.scale = 2.0;
        effNode.setPosition(pos);
        this.nEffect.addChild(effNode, 80);

        GameMgr.showAltasAnimationONE(effNode, this.deadAtlas, "dead_effect", 18, cc.WrapMode.Default);
    }

    /**砖块受击特效 */
    showBrickHitAni(pos: cc.Vec2){
        let effNode = new cc.Node;
        let effectSpr = effNode.addComponent(cc.Sprite);
        effNode.scale = 2.0;
        effNode.setPosition(pos);
        this.nEffect.addChild(effNode, 110);

        GameMgr.showAltasAnimationONE(effNode, this.bumpAtlas, "bump_effect", 18, cc.WrapMode.Default);
    }

    /**砖块吸附特效 */
    showBrickAdsorbEffect(pos: cc.Vec2){
        let effNode = new cc.Node;
        let effectSpr = effNode.addComponent(cc.Sprite);
        effNode.scale = 2.0;
        effNode.setPosition(pos);
        this.nEffect.addChild(effNode, 100);

        effectSpr.srcBlendFactor = cc.macro.BlendFactor.SRC_ALPHA;
        effectSpr.dstBlendFactor = cc.macro.BlendFactor.ONE;

        GameMgr.showAltasAnimationONE(effNode, this.shuyeAtlas, "shuye_effect", 18, cc.WrapMode.Default);
    }

    /**通过图集创建序列帧动画 */
    createEffectAniNode(atlas: cc.SpriteAtlas, bBlend: boolean=false, sample:number= 18, warpMode: cc.WrapMode=cc.WrapMode.Default){
        if(atlas){
            let effNode = new cc.Node;
            let effectSpr = effNode.addComponent(cc.Sprite);
            if(bBlend == true){
                effectSpr.srcBlendFactor = cc.macro.BlendFactor.SRC_ALPHA;
                effectSpr.dstBlendFactor = cc.macro.BlendFactor.ONE;
            }
            effNode.scale = 2.0;
            GameMgr.showAltasAnimationONE(effNode, atlas, "effectAni", sample, warpMode);
            return effNode;
        }
        return null;
    }

    /************  以上为特效处理 ------------------ */
}
