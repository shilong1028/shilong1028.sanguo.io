import { BallInfo, BallState, IntersectRay, NoticeType, IntersectData, ItemInfo, LaunchSkillState } from "../manager/Enum";
import { NotificationMy } from "../manager/NoticeManager";
import Brick from "./Brick";
import { FightMgr } from "../manager/FightManager";
import { AudioMgr } from "../manager/AudioMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends cc.Component {
    @property(cc.Sprite)
    ballSpr: cc.Sprite = null;
    @property(cc.Node)
    effectNode: cc.Node = null;
    @property(cc.SpriteAtlas)
    cannonAtlas: cc.SpriteAtlas = null;
    @property(cc.MotionStreak)
    BallStreak: cc.MotionStreak = null;    //拖尾

    MoveSpeed_Const: number = 1500;   //球移动的速率
    moveReady_Const: number = 550;   //小球平移速率（发射移动，和复位移动）

    MoveFlyActionTag: number = 1001;   //球移动飞翔动作Tag
    MoveLaunchActionTag: number = 1002;   //移到到发射点动作TAG
    MoveReadyActionTag: number = 1003;   //小球由当前点移动到待位状态（多用于落地后的重新排列）
    DropBezierActionTag: number = 1004;   //曲线下落
    DropRotateActionTag: number = 1006;   //小球垂直下落旋转
    PathDelayActionTag: number = 1007;   //路径规划中延迟

    ballInfo: BallInfo = null;   //小球属性数据
    ballId: number = -1;   //小球唯一索引
    ballSortIdx: number = 0;   //小球排序索引（用于发送时间计算）
    lastBallState: BallState = BallState.init;   //上一个动画状态
    
    ballFlyDir: cc.Vec2 = null;   //发射方向
    launchPos: cc.Vec2 = null;   //发射点
    launchEndData: IntersectRay = null;   //折线末点
    hitBrickIdArr: number[] = [];   //小球碰撞的砖块ID集合，避免异步砖块死亡死，再次寻路

    /**可以发射 */
    bReady: boolean = false;  //发射准备
    bDropState: boolean = false;    //曲线下落状态（飞行中下落，地面的不再弹射）
    bFixedFlyDir: boolean = false;   //穿透砖块触碰后，小球在本回合内与其他砖块碰撞不再改变方向
    roundAttack: number = 0;   //小球在每回合增加的攻击力（当前回合有效）
    roundBaoji: number = 0;   //小球在每回合增加的暴击率（当前回合有效）

    bGroundBounce: boolean = false;  //是否触底不结束而重新弹起
    adsorBrickId: number = -1;   //小球被吸附的砖块ID
    multiHitProbability: number = 0;  //连体技能概率
    ballSplitProbability: number = 0;  //分裂技能概率
    baoZhaProbability: number = 0;  //爆炸技能概率

    // LIFE-CYCLE CALLBACKS:

    /**清除所有小球的数据 */
    clearBallData(){
        this.ballId = -1;   //小球唯一索引
        this.ballSortIdx = 0;   //小球排序索引（用于发送时间计算）
        this.ballInfo = null;   //小球属性数据
    }

    /**清除球的状态信息，初始化或发射前会调用 */
    initBallStateData(){
        if(this.BallStreak){
            this.BallStreak.enabled = false;   //拖尾
        }

        this.node.opacity = 0;

        this.node.stopAllActions();
        this.node.scale = 1.0;
        this.node.angle = 0;

        this.ballFlyDir = null;   //发射方向
        this.launchPos = null;   //发射点
        this.launchEndData = null;   //折线末点  
        this.hitBrickIdArr = [];   //小球碰撞的砖块ID集合，避免异步砖块死亡死，再次寻路

        this.bDropState = false;    //曲线下落状态（飞行中下落，地面的不再弹射）
        this.bFixedFlyDir = false;   //穿透砖块触碰后，小球在本回合内与其他砖块碰撞不再改变方向
        this.roundAttack = 0;   //小球在每回合增加的攻击力（当前回合有效）
        this.roundBaoji = 0;   //小球在每回合增加的暴击率（当前回合有效）

        this.bGroundBounce = false;  //是否触底不结束而重新弹起
        this.adsorBrickId = -1;   //小球被吸附的砖块ID
        this.multiHitProbability = 0;  //连体技能概率
        this.ballSplitProbability = 0;  //分裂技能概率
        this.baoZhaProbability = 0;  //爆炸技能概率
    }

    onLoad(){
        NotificationMy.on(NoticeType.BrickDeadEvent, this.handleBrickDeadEvent, this);    //砖块消失（死亡）
        NotificationMy.on(NoticeType.BallAdsorbEvent, this.handleBallAdsorbEvent, this);   //砖块吸附小球

        NotificationMy.on(NoticeType.GamePause, this.handleGamePause, this);   //游戏暂停，停止小球和砖块的动作，但动画特效不受影响
        NotificationMy.on(NoticeType.GameResume, this.handleGameResume, this);   //继续游戏
        NotificationMy.on(NoticeType.GameReStart, this.handleGameReStart, this);   //重新开始游戏
        NotificationMy.on(NoticeType.GemaRevive, this.handleGemaRevive, this);    //复活，将最下三层砖块消除

        NotificationMy.on(NoticeType.BallSpeedUp, this.handleBallSpeedUp, this);  //小球加速
        NotificationMy.on(NoticeType.BallSpeedUpDrop, this.handleBallSpeedUpDrop, this);   //小球抛物加速下落

        this.node.opacity = 0;
        this.ballSpr.spriteFrame = null;

        this.clearBallData();

        this.initBallStateData();  //清除球的状态信息，初始化或发射前会调用

        this.changeBallWithState(BallState.init);  //根据球的状态来改变外形图片
    }

    onDestroy(){
        this.clearBallData();
        NotificationMy.offAll(this);
    }

    /**游戏暂停，停止小球和砖块的动作，但动画特效不受影响 */
    handleGamePause(){
        this.node.pauseAllActions();
    }
    /**继续游戏 */
    handleGameResume(){
        this.node.resumeAllActions();
    }
    //重新开始游戏
    handleGameReStart(){
        this.node.scale = 1.0;
        this.node.angle = 0;
        this.node.stopAllActions();
        this.node.destroy();
    }

    /**复活，将最下三层砖块消除 */
    handleGemaRevive(){
        this.initBallStateData();  //清除球的状态信息，初始化或发射前会调用
    }

    start () {

    }

    changeBallSkin(){
        if(this.ballId > 1000){   //分裂产生的小球
            this.ballSpr.spriteFrame = FightMgr.getFightScene().boomFrames[0];
        }else if(this.ballInfo){
            this.ballSpr.spriteFrame = this.cannonAtlas.getSpriteFrame("cannon_"+this.ballInfo.cannonCfg.quality);
        }
    }

    update (dt) {
        if(this.launchEndData && this.launchEndData.itemNodes){  //射线经过的道具节点集合
            for(let i=0; i<this.launchEndData.itemNodes.length; ++i){
                let itemNode = this.launchEndData.itemNodes[i];
                let len = this.node.position.sub(itemNode.position).mag();
                if(len <= 60){
                    let itemBrick = itemNode.getComponent(Brick);
                    if(itemBrick){
                        this.handleItemBrickColliderBall(itemBrick);   //处理道具与小球的碰撞 
                    }
                    this.launchEndData.itemNodes.splice(i, 1); 
                    break;
                }
            }
        }
    }

    /**处理砖块消失 */
    handleBrickDeadEvent(deadBrick:Brick){
        if(this.launchEndData && deadBrick){
            for(let i=0; i< this.hitBrickIdArr.length; ++i){   //小球碰撞的砖块ID集合，避免异步砖块死亡死，再次寻路
                if(deadBrick.brickId == this.hitBrickIdArr[i]){
                    break;
                }
            }

            for(let i=0; i<this.launchEndData.nodeIds.length; ++i){  //普通砖块
                let brickId = this.launchEndData.nodeIds[i];
                if(deadBrick.brickId == brickId){  //末点处的砖块消失了
                    this.launchEndData.nodeIds.splice(i, 1);   //直接将砖块从路径中剔除，不再重新规划，避免性能消耗
                    i--;
                    break;
                }
            }
        }
    }

    /**设置小球ID和小球属性数据 */
    setBallId(id: number, ballInfo: BallInfo){
        this.initBallStateData();  //清除球的状态信息，初始化或发射前会调用
        
        this.ballId = id;
        this.ballSortIdx = id;
        this.ballInfo = ballInfo;

        this.changeBallSkin();

        this.changeBallWithState(BallState.init);  //根据球的状态来改变外形图片
    }

    /**根据球的状态来改变外形图片 
     * //(初始--等待排序）--待机--瞄准--移动--发射--飞行--碰撞--下落回收---排序--下一回合待机
    */
    changeBallWithState(state: BallState){
        if(this.lastBallState == state && state != BallState.collider){
            return ;
        }
        this.lastBallState = state;   //上一个动画状态

        if(state == BallState.init){   //初始状态
            this.node.opacity = 0;
        }else{
            this.node.opacity = 255;
        } 
    }

    /**小球瞄准发射状态动画改变 */
    handleBallAimState(bAim: boolean = true){
        if(bAim == true){
            this.changeBallWithState(BallState.aim);  //根据球的状态来改变外形图片
        }else{
            this.changeBallWithState(BallState.normal);  //根据球的状态来改变外形图片
        }
    }

    /**增加回合攻击力(充能) */
    addRoundAttack(){
        this.roundAttack = 0;
        let skillInfo = FightMgr.getFightScene().getFightSkillById(2);  //强化
        if(skillInfo){
            let upVal = skillInfo.skillCfg.attack_up * skillInfo.skillLv;
            this.roundAttack = Math.ceil(this.getBallAttack(false) * upVal);   //小球在每回合增加的攻击力（当前回合有效）
            
            let effAni = this.effectNode.getChildByName("chongneng_effect_1");
            if(effAni == null){
                effAni = FightMgr.qipanSc.createEffectLoopAniNode(FightMgr.getFightScene().ballChongnengAtlas);
                if(effAni){
                    effAni.name = "chongneng_effect_1";
                    this.effectNode.addChild(effAni, 100);
                }
            }
        }
    }

    /**狂暴特性 */
    addRoundBaoji(){
        this.roundBaoji = 0;
        let skillInfo = FightMgr.getFightScene().getFightSkillById(9);  //狂暴
        if(skillInfo){
            this.roundBaoji = skillInfo.skillCfg.baoji_up * skillInfo.skillLv;  //小球在每回合增加的暴击率（当前回合有效）

            let effAni = this.effectNode.getChildByName("baoji_effect");
            if(effAni == null){
                effAni = FightMgr.qipanSc.createEffectLoopAniNode(FightMgr.getFightScene().baojiAtlas);
                if(effAni){
                    effAni.name = "baoji_effect";
                    this.effectNode.addChild(effAni, 100);
                }
            }
        }
    }

    /**反弹特性 */
    openGroundBounce(){
        this.bGroundBounce = true;
        let effAni = this.effectNode.getChildByName("fantan_effect_1");
        if(effAni == null){
            effAni = FightMgr.qipanSc.createEffectLoopAniNode(FightMgr.getFightScene().ballFantanAtlas);
            if(effAni){
                effAni.name = "fantan_effect_1";
                this.effectNode.addChild(effAni, 100);
            }
        }
    }

    //发射弹珠
    launch(pos: cc.Vec2, endData: IntersectRay, skillsState: LaunchSkillState){
        this.changeBallWithState(BallState.moveLaunch);

        if(skillsState.qianghuaPro > 0){  //2强化 一定概率提升攻击力
            if(Math.random() <= skillsState.qianghuaPro){ 
                //ROOT_NODE.showTipsText("触发强化技能，攻击力提升。");
                this.addRoundAttack();   //增加回合攻击力(充能) 
            }
        }
        if(skillsState.fenLiePro > 0){  //3分裂 一定概率使得炮弹分裂为三个子弹
            this.ballSplitProbability = skillsState.fenLiePro;  //分裂技能概率
        }
        if(skillsState.fanTanPro > 0){  //4反弹 一定概率使得炮弹落地后重新反弹
            if(Math.random() <= skillsState.fanTanPro){ 
                //ROOT_NODE.showTipsText("触发反弹技能，落地后会重新弹起。");
                this.openGroundBounce();   //反弹特性
            }
        }
        if(skillsState.lianTiPro > 0){  //5连体 一定概率使得炮弹覆盖打击多个砖块
            this.multiHitProbability = skillsState.lianTiPro;  //连体技能概率
        }
        if(skillsState.baoZhaPro > 0){  //6爆炸 一定概率在击毁敌人后将其四周敌人也全部炸死
            this.baoZhaProbability = skillsState.baoZhaPro;  //爆炸技能概率
        }
        if(skillsState.kuangBaoPro > 0){  //9狂暴 一定概率提升暴击率
            if(Math.random() <= skillsState.kuangBaoPro){ 
                //ROOT_NODE.showTipsText("触发狂暴技能，暴击率提升。");
                this.addRoundBaoji();   
            }
        }

        this.launchPos = pos.clone();
        this.launchEndData = endData;   //折线末点 

        if(this.launchEndData && this.launchEndData.point){
            let newDir = this.launchEndData.point.sub(pos).normalizeSelf();   //发射方向
            this.resetBallFlyDir(newDir);  //重新设定飞行方向
        }

        this.moveAndReadyFly();   //小球移动并准备发射
    }

    //分裂产生的小球飞行
    handleBallSplitLaunch(ball: Ball){
        this.launchEndData = ball.launchEndData;
        this.ballFlyDir = ball.ballFlyDir;
        this.changeBallWithState(BallState.fly);
        this.RandomRotateDir();
    }

    /**分裂的小球的偏转飞行方向 */
    RandomRotateDir(){
        let randRad = 0; 
        if(Math.random() <= 0.5){ 
            randRad = 0.5 + Math.random() * 0.5;
        }else{   
            randRad = 0.3 + Math.random() * 0.7;
        }
        if(Math.random() > 0.5){
            randRad = -randRad;
        }

        let newDir = this.ballFlyDir.rotate(randRad);
        this.resetBallFlyDir(newDir);  //重新设定飞行方向
        this.resetLaunchEndData([], 2);  //重新设定弹射方向和目标点 //0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知, 5地面反弹， 6移动反弹
    }

    /**小球移动并准备发射 */
    moveAndReadyFly(){
        if(this.launchEndData && this.launchEndData.point){
            if(this.isBallFlying() == true){  //发射飞行中(重新规划后)
                this.ballFlying();   //执行小球飞行动作
            }else{
                this.node.stopActionByTag(this.MoveLaunchActionTag);
                let moveTime = (this.ballSortIdx+1)*0.07;
                let launchAction = cc.sequence(cc.moveTo(moveTime, this.launchPos), cc.callFunc(function(){
                    if(this.bDropState == true){    //曲线下落状态（飞行中下落，地面上的不再弹射）
                        this.changeBallWithState(BallState.readySort);
                        this.handleFirstDropBall(this.node.x);   //小球还未发射出去
                    }else{
                        //AudioMgr.playEffect("effect/launch");  //小球弹射音效

                        if(this.ballSplitProbability > 0 && Math.random() <= this.ballSplitProbability){   //分裂技能概率
                            //ROOT_NODE.showTipsText("触发分裂技能，武器分裂为三份。");
                            FightMgr.qipanSc.handleBallSplit(this);
                        }
                        
                        this.changeBallWithState(BallState.fly);
                        this.ballFlying();   //执行小球飞行动作
                    }
                }.bind(this)))
                launchAction.setTag(this.MoveLaunchActionTag);
                this.node.runAction(launchAction);
            }
        }else{
            console.warn("moveAndReadyFly(), 小球移动并准备发射 this.launchEndData is null; this.ballId = "+this.ballId);
        }
    }

    /**小球是否在飞行（碰撞）过程中 */
    isBallFlying(){
        if(this.bDropState == false && (this.lastBallState == BallState.fly || this.lastBallState == BallState.collider)){
            return true;
        }else{
            return false;
        }
    }

    /**执行小球飞行动作 */
    ballFlying(){
        this.node.stopActionByTag(this.MoveFlyActionTag);   //停止飞行动作
        if(this.isBallFlying() == false){
            //console.log("在非飞行状态执行飞行，this.ballId = "+this.ballId+"; this.lastBallState = "+this.lastBallState);
            return;
        }
        if(this.launchEndData && this.launchEndData.point){
            let endPos: cc.Vec2 = this.launchEndData.point;
            let len = endPos.sub(this.node.position).mag();

            let speedUpRatio = FightMgr.speedUpRatio;  //战斗加速倍数，0-2分别表示1-3倍加速
            let moveTime = len/(this.MoveSpeed_Const * speedUpRatio);
            let moveSeq = cc.sequence(cc.moveTo(moveTime, endPos), cc.callFunc(function(){
                this.checkAndResetPath(endPos);   //移动到末点后重新规划路径
            }.bind(this)));
            moveSeq.setTag(this.MoveFlyActionTag);
            this.node.runAction(moveSeq);
    
            this.setBallRotation();  //设置小球角度
            if(this.BallStreak){
                this.BallStreak.enabled = true;   //拖尾
            }
        }else{
            //console.log("warning, ballFlying(), 执行小球飞行动作 this.launchEndData is null; this.ballId = "+this.ballId);
        }
    }

    /**设置小球角度 */
    setBallRotation(){
        if(this.ballFlyDir){  
            if(Math.abs(this.ballFlyDir.x) <= 0.0001 && (1-Math.abs(this.ballFlyDir.y)) <= 0.0001){
                this.node.angle = 0;
            }else{
                let rad = cc.v2(this.ballFlyDir.x, this.ballFlyDir.y).signAngle(cc.v2(0,1));
                let angle = cc.misc.radiansToDegrees(rad);
                this.node.angle = -angle;   //cc.Node.rotation` is deprecated since v2.1.0, please set `-angle` instead. (`this.node.rotation = x` -> `this.node.angle = -x`)
            }
        }else{
            this.node.angle = 0;
        }
        let effAni = this.effectNode.getChildByName("chongneng_effect_1");
        if(effAni){
            effAni.angle = this.node.angle;
        }
    }

    /**小球撞击动作 */
    handleBallColliderAction(){
        this.changeBallWithState(BallState.collider);
    }

    /**获取小球攻击力，等级攻击力+额外攻击力+暴击 */
    getBallAttack(bAddRoundAtk:boolean=true){
        if(FightMgr.usedPlayerInfo){
            let playerCfg = FightMgr.usedPlayerInfo.playerCfg;
            let attack = playerCfg.attack;
            attack += playerCfg.update_atk*(FightMgr.usedPlayerInfo.level-1);
            let baoji = playerCfg.baoji;
            baoji += 0.2*(FightMgr.usedPlayerInfo.level-1);

            if(this.ballInfo){
                let attack_up = this.ballInfo.cannonCfg.attack_up;
                let baoji_up = this.ballInfo.cannonCfg.baoji_up;
    
                attack = attack * (1.0 + attack_up);
                baoji = baoji + baoji_up;
            }

            if(bAddRoundAtk == true){
                attack += this.roundAttack;   //小球在每回合增加的攻击力（当前回合有效）
                baoji += this.roundBaoji;   //小球在每回合增加的暴击率（当前回合有效）
            }
            attack = Math.floor(attack);

            if(Math.random() <= baoji){
                attack *= 2;
            }
            return attack;
        }
        return 0;
    }

    /**处理道具砖块与小球的碰撞 */
    handleItemBrickColliderBall(itemBrick: Brick){
        if(this.bDropState == true){  //曲线下落状态（飞行中下落，地面的不再弹射）
            this.showDropBezierAni();   //曲线下落动画
        }else if(itemBrick){ 
            itemBrick.hit(this.getBallAttack(), this);
        }
    }

    /**处理移动砖块与小球的碰撞 */
    handleMoveBrickColliderBall(moveBrick: Brick){
        if(moveBrick && moveBrick.isBrickDead() == false){
            if(this.bDropState == true){  //曲线下落状态（飞行中下落，地面的不再弹射）
                this.node.stopActionByTag(this.MoveFlyActionTag);   //停止飞行动作
                this.showDropBezierAni();   //曲线下落动画
            }else if(this.launchEndData && this.launchEndData.point){  
                if(this.bFixedFlyDir == false){  //穿透砖块触碰后，小球在本回合内与其他砖块碰撞不再改变方向
                    this.node.stopActionByTag(this.MoveFlyActionTag);   //停止飞行动作

                    let startPos: cc.Vec2 = this.checkIsBrickContainBall(moveBrick.node, this.node.position.clone(), this.ballFlyDir);  //检测砖块（扩展边界）是否包含了小球 ,并返回校正坐标
                    let endPos: cc.Vec2 = startPos.add(this.ballFlyDir.mul(200));
                    //获取移动砖块的碰撞反射
                    let data: IntersectData = FightMgr.checkIntersectionOneBrick(startPos, endPos, moveBrick);  //获取射线和单个砖块的碰撞及反射
                    if(data){
                        this.resetBallFlyDir(data.newDir);  //重新设定飞行方向    
                        this.resetLaunchEndData([moveBrick.brickId], 6);  //重新设定弹射方向和目标点 //0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知, 5地面反弹， 6移动反弹
                    }else{
                        this.moveAndReadyFly();   //小球移动并准备发射
                    }
                }

                this.handleBallColliderAction();   //小球撞击动作
                moveBrick.hit(this.getBallAttack(), this);
            }
        }
    }

    /**检测砖块（扩展边界）是否包含了小球， 并返回校正的坐标
     * @param brickNode 砖块节点
     * @param ballPos 小球位置或路径末点位置
     * @param dir 飞行方向
    */
    checkIsBrickContainBall(brickNode: cc.Node, ballPos: cc.Vec2, dir: cc.Vec2){
        if(brickNode && ballPos){
            let rect: cc.Rect = brickNode.getBoundingBox();
            rect.y -= FightMgr.ballRadiusConf;
            rect.height += 2*FightMgr.ballRadiusConf;
            rect.width += 2*FightMgr.ballRadiusConf;
            rect.x -= FightMgr.ballRadiusConf;
            if(rect.contains(ballPos)){  
                let offLen = ballPos.sub(cc.v2(rect.x, rect.y)).mag();
                ballPos.x -= dir.x * offLen;   //按照Y轴反向延伸
                ballPos.y -= dir.y * offLen;
            }
        }

        return ballPos;
    }

    /**移动到末点后重新规划路径 */
    checkAndResetPath(pos: cc.Vec2){
        if(this.launchEndData && this.launchEndData.point){
            let tempEndData: IntersectRay = this.launchEndData.clone();
            this.launchEndData = null;   //重置射线数据，防止update或异步消息再次处理

            let tempHitIds: number[] = [];  //撞击砖块ID临时集合
        
            for(let i=0; i<tempEndData.nodeIds.length; ++i){  //普通砖块
                let brickId = tempEndData.nodeIds[i];
                let bHasHit = false;
                for(let j=0; j< this.hitBrickIdArr.length; ++j){   //小球碰撞的砖块ID集合，避免异步砖块死亡死，再次寻路
                    if(brickId == this.hitBrickIdArr[i]){
                        bHasHit = true;
                        break;
                    }
                }
                if(bHasHit == false){
                    tempHitIds.push(brickId);
                    this.hitBrickIdArr.push(brickId);  
                }
            }

            if(tempEndData.newDir == null){  //触底
                AudioMgr.playYinfu();    //小球碰撞音效
                this.preHandleGroundBall(tempEndData);  //处理落地的球
                return;
            }

            let bHit: boolean = this.hitBrickIdArr.length == 0 ? false : true;
            let hitType = 1;  //0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知
            if(bHit == true){
                if(this.bFixedFlyDir == true){
                    hitType = 3;
                }else{
                    hitType = 0;
                    this.resetBallFlyDir(tempEndData.newDir);  //重新设定飞行方向
                }
            }

            for(let i=0; i<tempEndData.borderIdxs.length; ++i){   //撞墙
                if(tempEndData.borderIdxs[i] == 3){   //触底
                    this.preHandleGroundBall(tempEndData);  //处理落地的球
                    return;
                }
                bHit = true;

                let hitPos = cc.v2(this.node.x + this.ballFlyDir.x *FightMgr.ballRadiusConf, this.node.y + this.ballFlyDir.y *FightMgr.ballRadiusConf);  //在碰撞点显示特效
                FightMgr.qipanSc.showBrickHitAni(hitPos);  //砖块受击特效  bump_effect_1

                hitType = 0;   //撞墙碰撞
                this.resetBallFlyDir(tempEndData.newDir);  //重新设定飞行方向

                AudioMgr.playYinfu();    //小球碰撞音效
            }

            if(bHit == true){
                this.handleBallColliderAction();   //小球撞击动作
            }else{
                //如果没有砖块碰撞，则按照原有方向重新规划路径
            }
            this.resetLaunchEndData(this.hitBrickIdArr, hitType);  //tempEndData.nodeIds重新设定弹射方向和目标点 //0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知, 5地面反弹， 6移动反弹
        
            for(let k=0; k<tempHitIds.length; ++k){
                NotificationMy.emit(NoticeType.BallHitBrick, {"brickId":tempHitIds[k], "attack":this.getBallAttack(), "ball":this});  //小球攻击砖块
            }
        }else{
            cc.warn("warning, checkAndResetPath(), 移动到末点后重新规划路径 this.launchEndData is null! this.ballId = "+this.ballId);
        }
    }

    /** 触底预处理，触底反弹状态则再次弹起*/
    preHandleGroundBall(endData: IntersectRay){
        if(endData){
            if(this.bGroundBounce == true && FightMgr.qipanSc.checkHasEnemyCurView() == true){   //触底反弹  //当前视图内还有敌方砖块，再次弹起
                this.bGroundBounce = false;
                this.handleBallColliderAction();   //小球撞击动作

                let effectAni = this.effectNode.getChildByName("fantan_effect_1");
                if(effectAni){
                    effectAni.destroy();
                }

                let goundX = cc.winSize.width/2 - FightMgr.ballRadiusConf;
                let newDir = FightMgr.getReflectDir(endData.srcPos, endData.point, cc.v2(-goundX, endData.point.y), cc.v2(goundX, endData.point.y));   //获取发射线与镜面线段的反射后新方向
                if(newDir){
                    this.resetBallFlyDir(newDir);  //重新设定飞行方向
                    this.resetLaunchEndData([], 5);  //重新设定弹射方向和目标点 //0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知, 5地面反弹， 6移动反弹
                }
            }else{
                this.handleFirstDropBall(endData.point.x);  //处理落地的球
            }
        }
    }

    /**重新设定飞行方向 */
    resetBallFlyDir(flyDir: cc.Vec2){
        let rayDir = FightMgr.normalDir(flyDir);
        if(rayDir == null){
            if(this.launchEndData && this.launchEndData.newDir){
                rayDir = this.launchEndData.newDir;
            }else{
                rayDir = this.ballFlyDir.neg();
            }
            let reRayDir = this.checkInnerBrickNewDir(rayDir).dir;
            cc.log("resetBallFlyDir(), 小球射线方向不合格，this.ballId = "+this.ballId+"; this.ballFlyDir = "+this.ballFlyDir+"; flyDir = "+flyDir+"; reRayDir = "+reRayDir);
            this.ballFlyDir = reRayDir;
        }else{
            this.ballFlyDir = rayDir;
        }
    }

    /**检测小球是否在砖块内部，并返回新方向 */
    checkInnerBrickNewDir(dir: cc.Vec2, nId=null){
        let ballPos = this.node.position.clone();
        let pos = ballPos.add(dir.mul(5));
        let enemyBrick = FightMgr.qipanSc.checkHasEnemyByPos(pos);
        let brickId = -1;
        if(enemyBrick){
            let newDir = FightMgr.checkInnerBrickInterect(pos, dir, enemyBrick);
            if(newDir){
                dir = newDir;
            }else{
                dir = dir.neg();
                if(nId){
                    cc.log("第二次规避 小球在砖块内部, 但是没有找到抛出的新方向, 小球让按照原来方向前进");
                    dir = this.ballFlyDir;
                }
            }
            this.node.position = ballPos;
            brickId = enemyBrick.brickId;
        }
        return {"dir":dir, "brickId":brickId};
    }

    /**重新设定弹射方向和目标点 
     * @param hitType  0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知, 5地面反弹， 6移动反弹
    */
    resetLaunchEndData(brickIds: number[], hitType: number){
        if(brickIds == null || brickIds == undefined){
            brickIds = [];
        }
        this.node.stopActionByTag(this.MoveFlyActionTag);   //停止飞行动作
        if(this.bDropState == true){  //曲线下落状态（飞行中下落，地面的不再弹射）
            this.showDropBezierAni();   //曲线下落动画
        }else{
            if(this.adsorBrickId > 0){  //小球被吸附的砖块ID
                return;
            }

            if(hitType != 2 && this.bFixedFlyDir == true){  //穿透砖块触碰后，小球在本回合内与其他砖块碰撞不再改变方向(注意，偏转优先级>穿透)
                hitType = 3;  //0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知, 5地面反弹， 6移动反弹, 7强制校正
            }

            if(this.bFixedFlyDir == false){   //穿透时，不清空碰撞砖块列表，待穿透撞墙后清空
                this.hitBrickIdArr = [];   //小球碰撞的砖块ID集合，避免异步砖块死亡死，再次寻路
            }

            let startPos: cc.Vec2 = FightMgr.adaptPosByGameBorders(this.node.position.clone(), this.ballFlyDir);   //根据游戏边界来微调点坐标，从而使得点在边界矩形内
            this.node.position = startPos;

            this.launchEndData = FightMgr.resetCastRay(startPos, this.ballFlyDir, brickIds, hitType, ()=>{
                this.delayHandleRayPath(brickIds, hitType);
            });  //上一次反射的砖块，避免该砖块产生连续两次反射的现象。

            if(this.launchEndData && this.launchEndData.point){
                if(this.launchEndData.point.x == startPos.x && startPos.y == this.launchEndData.point.y){
                    this.launchEndData.point.x += 1;  
                    this.launchEndData.point.y += 1;   
                }

                let tempDir = this.launchEndData.point.sub(startPos);   //发射方向, 注意，startPos在线路规划时会经过处理而可能变化，因此使用小球坐标来计算新方向
                if(hitType == 3){
                    for(let i=0; i<this.launchEndData.borderIdxs.length; ++i){
                        if(this.launchEndData.borderIdxs[i] >= 0){  //与游戏边界相交的边界索引集合
                            this.hitBrickIdArr = [];    //穿透时，不清空碰撞砖块列表，待穿透撞墙后清空
                            break;
                        }
                    }
                }
                this.resetBallFlyDir(tempDir);  //重新设定飞行方向
                this.moveAndReadyFly();   //小球移动并准备发射
                
            }else{
                if(this.resetBallFlyDir(this.ballFlyDir) == null){   //重新设定飞行方向
                    let nextPos = this.node.position.clone();
                    if(FightMgr.qipanSc.checkHasBrickByPos(cc.v2(nextPos.x, nextPos.y - 20)) == false){
                        this.ballFlyDir = cc.v2(0, -1);   //向下走
                    }else if(FightMgr.qipanSc.checkHasBrickByPos(cc.v2(nextPos.x + 20, nextPos.y)) == false){
                        this.ballFlyDir = cc.v2(1, 0);   //向右走
                    }else if(FightMgr.qipanSc.checkHasBrickByPos(cc.v2(nextPos.x - 20, nextPos.y)) == false){
                        this.ballFlyDir = cc.v2(-1, 0);   //向左走
                    }else{
                        this.ballFlyDir = cc.v2(0, 1);   //向上走
                    }
                }  
                this.delayHandleRayPath(brickIds, hitType);
            }
        }
    }

    /**延迟后重新请求规划 */
    delayHandleRayPath(brickIds: number[], hitType: number){
        this.node.stopActionByTag(this.PathDelayActionTag);  //路径规划中延迟
        let pathDelay = cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
            this.resetLaunchEndData(brickIds, hitType);
        }.bind(this)));
        pathDelay.setTag(this.PathDelayActionTag);
        this.node.runAction(pathDelay);
    }

    /**小球垂直下落 */
    showDropVerticalAni(bAddBall:boolean=false){ 
        this.changeBallWithState(BallState.verticalDrop); 
        this.bDropState = true;  //下落过程不与砖块碰撞

        if(this.BallStreak){
            this.BallStreak.enabled = false;   //拖尾
        }
        this.node.scale = 1.0;
        this.node.angle = 0;

        this.node.stopActionByTag(this.DropRotateActionTag);   //小球垂直下落旋转
        let rotateAction = cc.repeatForever(cc.rotateBy(1.0, 360));
        rotateAction.setTag(this.DropRotateActionTag);
        this.node.runAction(rotateAction);

        let destY = FightMgr.getBallPosY();   //小球的Y轴坐标
        let len = Math.abs(this.node.y - destY);
        let moveAction = cc.sequence(cc.moveTo(len/450, cc.v2(this.node.x, destY)), cc.callFunc(function(){
            this.node.stopActionByTag(this.DropRotateActionTag);   //小球垂直下落旋转
            this.node.angle = 0;
            this.handleFirstDropBall(this.node.x, false, bAddBall);  //处理落地的球
        }.bind(this)));
        this.node.runAction(moveAction);
    }

    /**曲线下落动画 */
    showDropBezierAni(){
        this.node.stopActionByTag(this.MoveFlyActionTag);   //球移动飞翔动作Tag

        if(this.adsorBrickId > 0){  //小球被吸附的砖块ID
            return;
        }  

        let pos: cc.Vec2 = cc.v2(FightMgr.emissionPointX, FightMgr.getBallPosY());
        let gameBorderRect = FightMgr.gameBordersRect;   //棋盘边界矩形（中心点+宽高）
        this.changeBallWithState(BallState.bezierDrop);

        if(pos){
            let nodePos = this.node.position;
            let controlPos = cc.v2(pos.x, nodePos.y);
            if(controlPos.y < pos.y + 150){
                controlPos.y = pos.y + 150;
            }else if(controlPos.y > gameBorderRect.height/2){
                controlPos.y = gameBorderRect.height/2;
            }
            if(controlPos.x < -gameBorderRect.width/2){
                controlPos.x = -gameBorderRect.width/2;
            }else if(controlPos.x > gameBorderRect.width/2){
                controlPos.x = gameBorderRect.width/2;
            }
            let len = nodePos.sub(pos).mag();
            let bezierArr = [];
            bezierArr[0] = nodePos;
            bezierArr[1] = controlPos;
            bezierArr[2] = pos;
            let bezierTo = cc.bezierTo(len/(this.MoveSpeed_Const*3.0), bezierArr);   //抛物下落3倍
   
            this.node.stopActionByTag(this.DropBezierActionTag);
            let dropAction = cc.sequence(bezierTo, cc.callFunc(function(){
                this.handleFirstDropBall(pos.x);  //处理落地的球
            }.bind(this)));
            dropAction.setTag(this.DropBezierActionTag);
            this.node.runAction(dropAction);
        }
    }

    /**小球加速抛物落下, 加速回收抛物线回到第一个小球落地点，若此时无小球落地，则回收点为当前回合发射起点。*/
    handleBallSpeedUpDrop(pos: cc.Vec2){
        if(this.lastBallState > BallState.readySort){
            this.bDropState = true;   //曲线下落状态（飞行中下落，地面的不再弹射）
        }
    }

    /**处理落地的球 */
    handleFirstDropBall(posX: number, bResetCat: boolean= true, bAddBall:boolean=false){
        if(this.ballId > 1000){  //分裂产生的小球
            this.node.destroy();
        }else{
            this.setBallOpacity(255);
            this.initBallStateData();  //清除球的状态信息，初始化或发射前会调用
            this.changeBallWithState(BallState.readySort);   //等待重新排序状态
            FightMgr.hanldeBallDropOver(posX, bResetCat);   //处理小球重新落地，检查回合是否结束
            if(bAddBall == true){
                //FightMgr.getFightScene().showAddBallEffect(posX);   //添加小球落地特效
            }
            if(this.effectNode){
                this.effectNode.destroyAllChildren();
            }
        }
    }

    /**小球排序 */
    handleBallSort(moveTime: number){
        if(this.adsorBrickId > 0){  //小球被吸附的砖块ID
            return;
        }  
        let destVec3 = FightMgr.getBallNodeDefaultPos();
        this.ballSortIdx = destVec3.z;  //小球排序索引（用于发送时间计算）
        let destPos = cc.v2(destVec3.x, destVec3.y);

        // let len = this.node.position.sub(destPos).mag();
        // moveTime = len/this.moveReady_Const;

        this.node.stopActionByTag(this.MoveReadyActionTag);
        let moveAction = cc.sequence(cc.moveTo(moveTime, destPos), cc.callFunc(function(){
            this.changeBallWithState(BallState.normal);
        }.bind(this)));
        moveAction.setTag(this.MoveReadyActionTag);
        this.node.runAction(moveAction);
    }

    /**处理小球倍吸附 */
    handleAdsorbed(brickPos: cc.Vec2, brickId: number){
        this.adsorBrickId = brickId;  //小球被吸附的砖块ID
        this.node.stopAllActions();
        this.node.position = brickPos;
        this.node.scale = 1.0;

        this.setBallOpacity(130);   //吸附小球的透明度变成0

        FightMgr.roundBallCount -- ;   //有吸附小球
        if(FightMgr.roundBallCount <= FightMgr.ballDropedCount){  //回合内增加的小球
            FightMgr.hanldeBallDropOver(this.node.x, true);
        }
    }

    /**砖块释放吸附小球 
     * brickId=0则释放所有被吸附的小球，brickId>0则释放指定砖块吸附的所有小球
    */
    handleBallAdsorbEvent(brickId: number){
        if(this.adsorBrickId > 0 && (brickId == -1 || brickId == this.adsorBrickId)){
            this.setBallOpacity(255);   //吸附小球的透明度变成0

            this.showDropVerticalAni(false);    //小球垂直下落
        }
    }

    /**设置特殊状态小球的透明度 */
    setBallOpacity(opacity: number){
        this.effectNode.opacity = opacity;
        if(this.BallStreak){
            this.BallStreak.node.opacity = opacity;  //拖尾
        }
    }


    ////////////////////////////////////////

    /**球加速 */
    handleBallSpeedUp(){
        if(this.adsorBrickId > 0 || this.bDropState == true){  //小球被吸附的砖块ID   //曲线下落状态（飞行中下落，地面的不再弹射）
            return;
        }  
        if(this.lastBallState > BallState.readySort){ 
            if(this.launchEndData && this.launchEndData.point){
                if(this.isBallFlying() == true){  //发射飞行中
                    this.ballFlying();   //执行小球飞行动作
                }
            }
        }
    }

    /**偏移砖块触碰，小球的运动方向在当前基础上，概率在某个弧度区间偏转。 */
    randomRotateDir(brick: Brick){
        if(brick && brick.isBrickDead() == false && this.isBallFlying() == true){
            this.node.stopActionByTag(this.MoveFlyActionTag);   //球移动飞翔动作Tag
        
            let randN = Math.random();
            let randRad = 0; 
            if(randN <= 0.3){   //[-0.78,0.78]
                randRad = Math.random() * 0.78;
            }else{   //+-(0.78,1.57]  
                randRad = 0.78 + Math.random() * 0.79;
            }
            if(Math.random() <= 0.5){
                randRad = -randRad;
            }

            let newDir = this.ballFlyDir.rotate(randRad);

            let retData = this.checkInnerBrickNewDir(newDir);   //检测小球是否在砖块内部，并返回新方向
            let ids = [];
            // if(retData.brickId >= 0){
            //     retData = this.checkInnerBrickNewDir(retData.dir, retData.brickId);

            //     if(brick.brick_info.moster_camp == 0 && retData.brickId >= 0){
            //         ids.push(retData.brickId);
            //     }
            // }

            this.resetBallFlyDir(retData.dir);  //重新设定飞行方向
            this.resetLaunchEndData(ids, 2);  //重新设定弹射方向和目标点 //0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知, 5地面反弹， 6移动反弹
        }
    }

    /**穿透道具触碰后，小球在本回合内与其他砖块碰撞不再改变方向 */
    fixedFlyDir(){
        if(this.isBallFlying() == true){
            this.bFixedFlyDir = true;   //穿透砖块触碰后，小球在本回合内与其他砖块碰撞不再改变方向

            this.setBallOpacity(130);   //穿透小球的透明度变成130

            //经过穿透道具时，不需要停下来重新规划，只需要设定小球穿透状态即可
            // this.node.stopActionByTag(this.MoveFlyActionTag);
            // this.resetLaunchEndData([], 3);  //重新设定弹射方向和目标点 //0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知, 5地面反弹， 6移动反弹
        }
    }

}
