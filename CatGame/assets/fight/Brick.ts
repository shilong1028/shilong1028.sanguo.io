import { NotificationMy } from "../manager/NoticeManager";
import { FightMgr } from "../manager/FightManager";
import { BrickInfo, NoticeType } from "../manager/Enum";
import Ball from "./Ball";
import Dot from "./Dot";
import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Brick extends cc.Component {
    
    @property(cc.Node)
    brickNode: cc.Node = null;  //砖块显示总节点, 用于抖动，放缩，复制移动等动作目标
    @property(cc.Sprite)
    brickSpr: cc.Sprite = null;   //砖块样式纹理， 用于延迟动作目标 
    @property(cc.Sprite)
    qualitySpr: cc.Sprite = null;
    @property(cc.Label)
    labPH: cc.Label = null;
    @property(cc.ProgressBar)
    hpBar: cc.ProgressBar = null;
    @property(cc.Node)
    hpNode: cc.Node = null;

    @property(cc.SpriteFrame)
    shieldFrame: cc.SpriteFrame = null;  //盾牌

    @property(cc.Sprite)
    brickBgSpr: cc.Sprite = null;  
    @property([cc.SpriteFrame])
    bgFrames: cc.SpriteFrame[] = new Array(2);  //砖块背景图片

    @property(cc.PolygonCollider)
    collider: cc.PolygonCollider = null;
    @property(cc.SpriteAtlas)
    bricksAtlas: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    qualityAtlas: cc.SpriteAtlas = null;

    moveDownActionTag = 1111;   //下移动作Tag
    moveBrickActionTag = 2222;   //移动砖块的水平移动
    brickSprScaleActionTag = 4444;   //砖块纹理放缩动作
    brickSprBottomActionTag = 6666;   //砖块到达底部预警抖动

    brickId: number = -1;   //每个砖块分配一个唯一ID
    brick_info: BrickInfo = null;   //砖块信息

    bAdsorb: boolean = false;   //是否吸附小球
    moveToPosX: number = null;   //移动砖块的目标X轴位置
    bInvincible: boolean = false;  //是否无敌状态（盾牌怪抵挡每回合第一次攻击）
    bRoundHited: boolean = false;   //该回合内是否被碰撞过

    colliderRayData = null;   //与移动砖块碰撞的射线
    effectNodeArr: cc.Node[] = [];   //事件特效节点

    moveLineBricks: cc.Node[] = [];   //移动砖块所在行的其他砖块集合
    moveCollisionBall: cc.Node[] = [];   //移动砖块和小球碰撞的临时集合

    // LIFE-CYCLE CALLBACKS:

    clearBrickData(){
        this.node.group = "Brick";

        this.brickId = -1;   //每个砖块分配一个唯一ID
        this.brick_info = null;

        this.bAdsorb = false;   //是否吸附小球
        this.moveToPosX = null;   //移动砖块的目标X轴位置
        this.bInvincible = false;  //是否无敌状态（盾牌怪抵挡每回合第一次攻击）
        this.bRoundHited = false;   //该回合内是否被碰撞过
    
        this.collider.enabled = false;
        this.collider.points = null;
        this.colliderRayData = null;   //与移动砖块碰撞的射线

        this.effectNodeArr = [];   //事件特效节点

        this.moveLineBricks = [];   //移动砖块所在行的其他砖块集合
        this.moveCollisionBall = [];   //移动砖块和小球碰撞的临时集合

        this.labPH.string = "";
        this.hpBar.progress = 0;
        this.hpNode.active = false;

        this.brickSpr.node.color = cc.color(255, 255, 255);
        this.clearBrickActions();   //清除砖块或纹理的所有动画
    }

    initBrickData(){
        NotificationMy.on(NoticeType.GemaRevive, this.handleGemaRevive, this);    //复活，将最下三层砖块消除
        NotificationMy.on(NoticeType.GamePause, this.handleGamePause, this);   //游戏暂停，停止小球和砖块的动作，但动画特效不受影响
        NotificationMy.on(NoticeType.GameResume, this.handleGameResume, this);   //继续游戏
        NotificationMy.on(NoticeType.GameReStart, this.handleGameReStart, this);   //重新开始游戏

        NotificationMy.on(NoticeType.BrickLineCreateOver, this.handleBrickLineCreateOver, this);  //砖块行创建完毕
        NotificationMy.on(NoticeType.BrickMoveDownAction, this.handleBrickMoveDownAction, this);    //砖块下移通知
        NotificationMy.on(NoticeType.BrickDownMultiLine, this.handleDownMulitLine, this);  //砖块多行下移

        NotificationMy.on(NoticeType.BrickInvincible, this.handleBrickInvincible, this);    //砖块无敌/盾牌
        NotificationMy.on(NoticeType.BrickDeadEvent, this.handleBrickDeadEvent, this);    //反弹砖块消失（死亡）
        NotificationMy.on(NoticeType.BrickAddEvent, this.handleBrickAddEvent, this);    //添加新砖块，用于移动砖块检测
        
        NotificationMy.on(NoticeType.BallHitBrick, this.handleBallHitBrick, this);  //小球攻击砖块
        NotificationMy.on(NoticeType.BrickDiffuseHit, this.hanldeBrickDiffuseHit, this);  //砖块受击散播
        NotificationMy.on(NoticeType.BrickBombDead, this.hanldeBrickBombDead, this);   //爆炸砖块死亡

        this.brickSpr.node.zIndex = 1;
        this.hpNode.zIndex = 2;

        this.clearBrickData();
    }

    /**清除砖块或纹理的所有动画 */
    clearBrickActions(){
        this.node.stopAllActions();   //用于渐变出现，下移等动作
        this.node.scale = 1.0;
        this.node.opacity = 255;  //砖块重生时设置了opaciy = 0;

        if(this.brickNode){
            this.brickNode.stopAllActions();   //用于抖动，放缩，复制移动等动作目标
            this.brickNode.scale = 1.0;
            this.brickNode.position = cc.v2(0, 0);
            this.brickNode.angle = 0;

            let effNode = this.brickSpr.node.getChildByName("BrickSprEffectChild");
            if(effNode){
                effNode.removeFromParent(true);
            }
        }
    }

    clearData(){
        this.collider.enabled = false;
        this.collider.points = null;
        
        NotificationMy.offAll(this);
    }

    /**移除砖块自身 */
    handleRemoveMySelf(bForceRemove: boolean){
        let ballChild = this.brickNode.getChildByName("BrickBallChild");
        if(ballChild){
            ballChild.removeFromParent(true);
        }

        let sprChild = this.brickSpr.node.getChildByName("BrickSprEffectChild");
        if(sprChild){
            sprChild.removeFromParent(true);
        }

        FightMgr.updateBrickDeadNum();   //更新砖块死亡数据
        if(bForceRemove == false && this.brick_info){
            NotificationMy.emit(NoticeType.BrickDeadEvent, this); 
        }
        this.clearBrickActions();   //清除砖块或纹理的所有动画
        FightMgr.getFightScene().removeBrickToPool(this.node);   //将砖块回收到缓存池
    }

    //只有在new cc.NodePool(Dot)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
    //使用 Pool.put() 回收节点后，会调用unuse 方法
    unuse() {
        this.clearData();
    }
    //使用 Pool.get() 获取节点后，就会调用reuse 方法
    reuse() {
        this.initBrickData();
    }

    onLoad () {
        this.initBrickData();
    }  
    
    onDestroy(){
        this.clearData();
    }

    start () {
        
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
        this.handleRemoveMySelf(true);   //移除砖块自身 
    }

    /**初始化砖块数据 */
    initBrickInfo(brickInfo: BrickInfo, reborn: boolean=false){
        //cc.log("brick.initBrickInfo(), brickInfo = "+JSON.stringify(brickInfo))
        this.collider.points = null;
        this.collider.enabled = false;
        this.moveLineBricks = [];   //移动砖块所在行的其他砖块集合
        this.moveCollisionBall = [];   //移动砖块和小球碰撞的临时集合

        this.node.setContentSize(cc.size(98, 98));

        this.brickId = FightMgr.getNewBrickId();   //每个砖块分配一个唯一ID

        this.brick_info = brickInfo;
        this.brickSpr.spriteFrame = this.bricksAtlas.getSpriteFrame("monster_"+this.brick_info.monsterId);   //砖块类型，关卡json配置中的数据 this.brick_info.monsterCfg.res
        this.qualitySpr.spriteFrame = null;  //this.qualityAtlas.getSpriteFrame("colorBg_"+this.brick_info.monsterCfg.quality);

        this.setBrickHpLabel();
        this.setBrickInvincibleSpr();   //根据无敌状态设置砖块纹理

        if(reborn == false){
            let gameBorderRect = FightMgr.gameBordersRect;   //棋盘边界矩形（中心点+宽高）
            this.node.setPosition(-gameBorderRect.width/2 + (this.brick_info.column+0.5)*FightMgr.tileWidth,  gameBorderRect.height/2 - FightMgr.tileHeight/2);
            //console.log(" brickId = "+this.brickId+"; posX = "+this.node.x+"; opt = "+this.node.opacity+"; sprOpt = "+this.brickNode.opacity+"; active = "+this.node.active+"; sprActive = "+this.brickNode.active);
        }

        this.initBrickSpecialInfo();   //初始化特殊砖块的一些属性，比如移动等
    }

    //砖块行创建完毕
    handleBrickLineCreateOver(){
        if(this.isMoveBrick() == true){
            this.setMoveLineBricks();  
            this.moveBrickAction(false);   //移动砖块的水平移动
        }
    }

    /**砖块初始化并移动到指定位置 
     * @param brickInfo 新砖块
     * @param srcPos  移动时砖块图片的位置偏移，=null则不移动
     * @param cloneType 类型，复活（随机复活1，自身复活2)， 分裂3，复制4， 5平等或6传染
    */
    initBricvkAndMoveToPos(brickInfo: BrickInfo, cloneType:number, srcPos: cc.Vec2){
        //console.log("initBricvkAndMoveToPos  cloneType = "+cloneType+"; srcPos = "+srcPos+"; brickInfo = "+JSON.stringify(brickInfo))
        if(this.isMoveBrick() == true){   //移动怪变成其他砖块后，移动碰撞属性暂时不消失（即变成不能移动的MoveBrick)
            this.moveToPosX = null;
            this.node.stopActionByTag(this.moveBrickActionTag);  //移动砖块的水平移动
            let posX = FightMgr.adjustBrickPosFromMove(this.node.x, FightMgr.tileWidth);
            this.node.x = posX;
        }

        this.bInvincible = false;   //每回合，受到的第一次伤害不减HP

        this.initBrickInfo(brickInfo, true);
        
        if(this.brickId <= 0){
            this.brickId = FightMgr.getNewBrickId();   //每个砖块分配一个唯一ID
        }

        if(this.isMoveBrick() == true){
            this.setMoveLineBricks();  
            this.moveBrickAction(false);   //移动砖块的水平移动
            FightMgr.qipanSc.handleBrickMoveDownAndCheckAttr();   //处理砖块回合下落完毕(检查事件)
        }else{
            if(srcPos){ //移动时砖块图片的位置偏移，=null则不移动
                let offPos = srcPos.sub(this.node.position);
                this.brickNode.position = offPos;
                this.brickNode.runAction(cc.sequence(cc.moveTo(0.3, cc.v2(0,0)), cc.callFunc(function(){
                    FightMgr.qipanSc.handleBrickMoveDownAndCheckAttr();   //处理砖块回合下落完毕(检查事件)
                }.bind(this))));
            }
        }
        this.node.opacity = 255;  //砖块重生时设置了opaciy = 0;

        NotificationMy.emit(NoticeType.BrickAddEvent, this);    //添加新砖块，用于移动砖块检测
    }

    //添加新砖块，移动砖块处理
    handleBrickAddEvent(newBrick: Brick){
        if(this.isBrickDead() == false &&this.isMoveBrick() == true){
            if(Math.abs(this.node.y - newBrick.node.y) < 10){
                if(this.brickId != newBrick.brickId){
                    this.node.stopActionByTag(this.moveBrickActionTag);  //移动砖块的水平移动
                    this.setMoveLineBricks(); 
                    this.moveBrickAction(false);   //移动砖块的水平移动
                }
            }
        }
    }

    /**设置砖块血量显示 */
    setBrickHpLabel(){
        if(this.brick_info){
            this.hpNode.active = true;
            this.labPH.string = this.brick_info.curHp.toString();
            this.hpBar.progress = this.brick_info.curHp/this.brick_info.maxHp;
        }else{
            this.labPH.string = "";
            this.hpBar.progress = 0;
            this.hpNode.active = false;
        }
    }

    /**根据无敌状态设置砖块纹理 */
    setBrickInvincibleSpr(){
        if(this.brick_info == null){
            return;
        }
        let brickEventType = this.brick_info.monsterCfg.event;  //事件 0无 1-间隔回合无敌 2-回合第一次盾牌 3-重生。当砖块死亡时，原地复活一个y移动砖块（Id=7)
        if(this.bInvincible == true){  //是否无敌状态
            if(brickEventType == 2){ 
                let effNode = this.brickSpr.node.getChildByName("BrickSprEffectChild");
                if(effNode == null){
                    effNode = new cc.Node();
                    effNode.name = "BrickSprEffectChild";
                    let effSpr = effNode.addComponent(cc.Sprite)
                    effSpr.spriteFrame = this.shieldFrame;
                    this.brickSpr.node.addChild(effNode, 50);
                }
                effNode.stopAllActions();
                effNode.opacity = 255;
            }else if(brickEventType == 1){
                let effNode = this.brickSpr.node.getChildByName("BrickSprEffectChild");
                if(effNode == null){
                    effNode = GameMgr.createAtlasAniNode(FightMgr.getFightScene().brickWudiAtlas, 12, cc.WrapMode.Loop);
                    effNode.scale = 2.0;
                    effNode.name = "BrickSprEffectChild";
                    this.brickSpr.node.addChild(effNode, 50);
                }
                effNode.opacity = 255;
            }
        }else{
            if(brickEventType == 2){
                let effNode = this.brickSpr.node.getChildByName("BrickSprEffectChild");
                if(effNode){
                    effNode.runAction(cc.sequence(cc.fadeTo(0.00001, 0), cc.fadeTo(0.03, 255), cc.fadeTo(0.03, 0)));
                }
            }else if(brickEventType == 1){
                let effNode = this.brickSpr.node.getChildByName("BrickSprEffectChild");
                if(effNode){
                    effNode.opacity = 0;
                }
            }else{
                let effNode = this.brickSpr.node.getChildByName("BrickSprEffectChild");
                if(effNode){
                    effNode.removeFromParent(true);
                }
            }
        }
    }

    /**初始化特殊砖块的一些属性，比如移动等 */
    initBrickSpecialInfo(){
        if(this.brick_info){
            let monster_ai = this.brick_info.monsterCfg.ai;   //行为 0无 1：左右往复移动 2：间隔吸附 3.坠落两行
            if(monster_ai == 1){   //1：左右往复移动
                //this.brickBgSpr.spriteFrame = this.bgFrames[1];

                this.node.group = "MoveBrick";
                let gameBorderRect = FightMgr.gameBordersRect;   //棋盘边界矩形（中心点+宽高）
                this.moveToPosX = gameBorderRect.width/2 - this.node.width/2;   //移动砖块的水平移动

                let sprSize = cc.size(98, 98);    //this.brickSpr.node.getContentSize();
                let colliderPoints = [];
                colliderPoints.push(cc.v2(-sprSize.width/2, -sprSize.height/2));
                colliderPoints.push(cc.v2(-sprSize.width/2, sprSize.height/2));
                colliderPoints.push(cc.v2(sprSize.width/2, sprSize.height/2));
                colliderPoints.push(cc.v2(sprSize.width/2, -sprSize.height/2));
                this.collider.points = colliderPoints;
                this.collider.enabled = true;

            }else if(monster_ai == 2){   //4 吸附 每回合，间隔吸附士兵，即吸附、不吸附、吸附...循环
                this.bAdsorb = true;   //是否吸附小球
            }else if(monster_ai == 3){  // 3 急速 每次下移2行；若下行有砖块，下移一行
            }
        }
    }

    //砖块急速下移多上，移动砖块处理
    handleDownMulitLine(targetBrick: Brick){
        if(this.isBrickDead() == false &&this.isMoveBrick() == true){
            if(Math.abs(this.node.y - targetBrick.node.y) < 10){   //急速砖块下落到移动砖块行
                if(this.brickId != targetBrick.brickId){
                    this.node.stopActionByTag(this.moveBrickActionTag);  //移动砖块的水平移动
                    this.setMoveLineBricks(); 
                    this.moveBrickAction(false);   //移动砖块的水平移动
                }
            }else{
                for(let i=0; i<this.moveLineBricks.length; ++i){   //检测急速砖块原来行是否有移动砖块
                    let otherBrick = this.moveLineBricks[i].getComponent(Brick);
                    if(otherBrick.brickId == targetBrick.brickId){ 
                        this.moveLineBricks.splice(i, 1);
                        return;
                    }
                }
            }
        }
    }

    /**检测移动砖块碰撞的小球是否已经处理过碰撞了 */
    checkHasHandleCollisionBall(ballId: number){
        for(let i=0; i<this.moveCollisionBall.length; ++i){   //移动砖块和小球碰撞的临时集合
            let ball = this.moveCollisionBall[i].getComponent(Ball);
            if(ballId == ball.ballId){
                return true;
            }
        }
        return false;
    }

    //移动砖块碰撞处理（与砖块碰撞，与小球碰撞，与指示线碰撞）
    onCollisionEnter(other, self){
        if(this.isBrickDead() == false && this.isMoveBrick() == true){  //是否放置好准备移动或改变（移等动砖块），放置初始化或下移时update调用
            let otherGroup = other.node.group;
            if(otherGroup == "Ball"){  //与小球相撞
                let ball = other.node.getComponent(Ball);
                if(ball && ball.isBallFlying() == true && this.checkHasHandleCollisionBall(ball.ballId) == false){  //检测移动砖块碰撞的小球是否已经处理过碰撞了
                    this.moveCollisionBall.push(other.node);   //移动砖块和小球碰撞的临时集合
                    ball.handleMoveBrickColliderBall(this);   //处理移动砖块与小球的碰撞
                }
            }else if(otherGroup == "Dot"){   //与指示线
                let dot = other.node.getComponent(Dot);
                this.colliderRayData = null;
                if(dot && dot.rayStartPos){
                    this.colliderRayData = {startPos: dot.rayStartPos.clone(), endPos: dot.rayEndPos.clone(), dir: dot.rayDir.clone()};   //与移动砖块碰撞的射线
                }
                this.reShowIndicator();     //移动砖块导致的重绘指示线
            } 
        }
    }

    /**移动砖块导致的重绘指示线 */
    reShowIndicator(){
        if(this.colliderRayData){
            let data = FightMgr.checkIntersectionOneBrick(this.colliderRayData.startPos, this.colliderRayData.endPos, this);  //获取射线和单个砖块的碰撞及反射
            if(data == null){
                this.colliderRayData = null;
            }
            FightMgr.getFightScene().reShowIndicator(); 
        }
    }

    update (dt) {
        if(this.isBrickDead() == false && this.isMoveBrick() == true){
            if(this.colliderRayData){   //与移动砖块碰撞的射线  {startPos: dot.rayStartPos, endPos: dot.rayEndPos, dir: dot.rayDir}
                this.reShowIndicator();
            }

            for(let i=0; i<this.moveCollisionBall.length; ++i){   //移动砖块和小球碰撞的临时集合
                let ballNode = this.moveCollisionBall[i];
                let len = this.node.position.sub(ballNode.position).mag();
                if(len >= 100){   //此值不太准确，可能会导致小球快速反射后，又经过此移动砖块从而穿过移动砖块
                    this.moveCollisionBall.splice(i, 1);
                    i--;
                }
            }

            //移动砖块所在行的其他砖块集合
            for(let i=0; i<this.moveLineBricks.length; ++i){
                let otherNode = this.moveLineBricks[i];
                if((this.moveToPosX - this.node.x)*(otherNode.x - this.node.x) > 0){   //砖块在移动砖块运动的前方
                    let len = this.node.position.sub(otherNode.position).mag();
                    if(len < 100){
                        this.moveBrickAction(true);
                        return;
                    }
                }
            }  
        }
    }

    /**设置移动砖块的行砖块集合 */
    setMoveLineBricks(){
        if(this.isMoveBrick() == true){  
            this.moveLineBricks = FightMgr.qipanSc.getLineBricksByPos(this.node.position);   //移动砖块所在行的其他砖块集合
        }
    }

    /**移动砖块的水平移动 */
    moveBrickAction(bBackMove: boolean){
        if(this.isMoveBrick() == true){  
            this.node.stopActionByTag(this.moveBrickActionTag);  //移动砖块的水平移动
            if(bBackMove == true){  //是否反向移动
                this.moveToPosX = -this.moveToPosX ;   //移动砖块的目标X轴位置
            }
            let posX = this.moveToPosX - this.node.x;
            let len = Math.abs(posX);
            let moveBrick = cc.sequence(cc.moveBy(len/100, cc.v2(posX, 0)), cc.callFunc(function(){
                this.moveBrickAction(true);   //移动砖块的水平移动
            }.bind(this)));
            moveBrick.setTag(this.moveBrickActionTag);
            this.node.runAction(moveBrick);
        }
    }

    /**是否移动砖块 */
    isMoveBrick(){
        if(this.moveToPosX  && this.node.group == "MoveBrick" && this.brick_info && this.brick_info.monsterCfg.ai == 1){    //移动怪变成其他砖块后，移动碰撞属性暂时不消失（即变成不能移动的MoveBrick)
            return true;
        }else{
            return false;
        }
    }

    /**处理砖块消失 */
    handleBrickDeadEvent(deadBrick: Brick){
        if(deadBrick && deadBrick.brick_info && this.moveLineBricks){
            //移动砖块所在行的其他砖块集合
            for(let i=0; i<this.moveLineBricks.length; ++i){
                let otherBrick = this.moveLineBricks[i].getComponent(Brick);
                if(otherBrick.brickId == deadBrick.brickId){ 
                    this.moveLineBricks.splice(i, 1);
                    return;
                }
            }
        }
    }

    /**砖块是否已经死亡，Hp<=0 */
    isBrickDead(){
        if(this.brick_info){
            return this.brick_info.curHp <= 0.00000001;
        }
        return true;
    }

    /**复活，将最下三层砖块消除 */
    handleGemaRevive(){
        if(this.isBrickDead() == false){ 
            let offsetY = this.node.y - FightMgr.gameBottomPosY;   //砖块距棋盘底部的距离
            if(offsetY < FightMgr.tileHeight*3){  
                this.hitDamage(this.brick_info.curHp, null, false);
            }
        }
    } 

    /**处理小球攻击砖块异步消息 */
    handleBallHitBrick(data: any){  //{"brickId":brickId, "attack":this.getBallAttack(), "ball":this}
        if(data && this.isBrickDead() == false && data.brickId == this.brickId){
            this.hit(data.attack, data.ball);
        }
    }

    /**球撞击砖块 */
    hit(harm: number, ball: Ball){
        if(this.isBrickDead() == false && ball){
            AudioMgr.playYinfu();    //砖块碰撞音效

            let hitPos = this.node.position.clone();  //(反弹的砖块特效在受击点，穿过的砖块特效播放在中心点)
            if(true){
                let dir = this.node.position.sub(ball.node.position).normalizeSelf();
                hitPos = cc.v2(ball.node.x + dir.x*FightMgr.ballRadiusConf, ball.node.y + dir.y*FightMgr.ballRadiusConf);  //在碰撞点显示特效
            }
            FightMgr.qipanSc.showBrickHitAni(hitPos);  //砖块受击特效

            if(Math.random() > 0.5){
                this.handleBrickScaleAction();  //砖块放缩
            }else{
                this.handleBrickShakeAction();  //砖块抖动
            }

            this.bRoundHited = true;   //该回合内是否被碰撞过

            if(this.bInvincible == true){   //盾牌无敌状态
                harm = 0;
                if(this.brick_info.monsterCfg.event == 2){ //事件 0无 1-间隔回合无敌 2-回合第一次盾牌 3-重生 
                    this.bInvincible = false;   //每回合，受到的第一次伤害不减HP
                    this.setBrickInvincibleSpr();   //根据无敌状态设置砖块纹理
                } 
            }  
            this.hitDamage(harm, ball, true);   //处理砖块收到伤害, 注意，伤害一定要放在bump_event之后，因为受击后砖块可能死亡

            if(ball.multiHitProbability > 0 && Math.random() <= ball.multiHitProbability){    //小球有连体覆盖打击效果
                //ROOT_NODE.showTipsText("触发连击技能，覆盖打击目标多个砖块。");
                let curPos = this.node.position.clone();
                NotificationMy.emit(NoticeType.BrickDiffuseHit, new cc.Vec3(curPos.x, curPos.y, 1000000+harm));   //砖块受击散播
            }
            
            if(this.brick_info.monsterCfg.ai == 2){  //行为 0无 1：左右往复移动 2：间隔吸附 3.坠落两行
                if(this.bAdsorb == true){
                    this.bAdsorb = false;   //是否吸附小球
                    ball.handleAdsorbed(this.node.position.clone(), this.brickId);
                    this.handleAdsorbEffect();
                }else{
                    this.bAdsorb = true;   //是否吸附小球
                    this.brickNode.angle = 0;
                }
            }
        }
    }

    /**砖块抖动 */
    handleBrickShakeAction(){
        this.brickNode.stopActionByTag(this.brickSprScaleActionTag);  //砖块纹理放缩动作
        this.brickNode.scale = 1.0;
        let action = cc.repeat(cc.sequence(cc.scaleTo(0.025, 0.9), cc.scaleTo(0.05, 1.1), cc.scaleTo(0.025, 1.0)),3);
        action.setTag(this.brickSprScaleActionTag);
        this.brickNode.runAction(action);
    }

    /**砖块放缩 */
    handleBrickScaleAction(){
        this.brickNode.stopActionByTag(this.brickSprScaleActionTag);  //砖块纹理放缩动作
        this.brickNode.scale = 1.0;
        let action = cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 1.0));
        action.setTag(this.brickSprScaleActionTag);
        this.brickNode.runAction(action);
    }

    /**处理吸附特效 */
    handleAdsorbEffect(){
        FightMgr.qipanSc.showBrickAdsorbEffect(this.node.position.clone()); 

        this.brickNode.runAction(cc.sequence(cc.rotateTo(0.1, -10), cc.rotateTo(0.1, 10), cc.rotateTo(0.08, -5), cc.rotateTo(0.05, 5), cc.rotateTo(0.05, 0)));
    }

    /**处理砖块收到伤害
     * @param harm 伤害值
     * @param ball 撞击的小球
     * @param bDeadEvent 是否相应死亡事件
    */
    hitDamage(harm:number, ball: Ball, bDeadEvent:boolean){
        if(this.isBrickDead() == false){
            FightMgr.qipanSc.showHpAction(harm, cc.v2(this.node.x, this.node.y + this.node.height/2)); //显示受击飘血效果

            harm = Math.floor(harm);
            if(harm > 0){
                this.brick_info.curHp -= harm;
                if(this.isBrickDead() == true){
                    this.brick_info.curHp = 0;
                    harm = parseInt(this.labPH.string);
                    this.showDeadEffect(bDeadEvent);   //死亡特效 

                    if(ball && ball.baoZhaProbability > 0 && Math.random() <= ball.baoZhaProbability){    //爆炸打击效果
                        //ROOT_NODE.showTipsText("触发爆炸技能，将四周敌人全部炸死。");
                        let curPos = this.node.position.clone();
                        NotificationMy.emit(NoticeType.BrickBombDead, new cc.Vec3(curPos.x, curPos.y, 0));   //爆炸
                    }
                }
                this.setBrickHpLabel();
            }
        }
    }

    /**处理爆炸砖块死亡事件 */
    hanldeBrickBombDead(bombPos: cc.Vec3){
        if(this.isBrickDead() == false && this.brick_info){
            let offsetX = Math.abs(this.node.x - bombPos.x);
            let offsetY = Math.abs(this.node.y - bombPos.y);
            let bBomb:boolean = false;
            if(bombPos.z == -1){  //3-爆炸行。死亡后爆炸，消灭相邻两行行4个敌方。
                if(offsetX < 10 && offsetY > 50 && offsetY <= 250){
                    bBomb = true;
                }
            }else if(bombPos.z == 1){  //4-爆炸列。死亡后爆炸，消灭相邻两列4个敌方。
                if(offsetY < 10 && offsetX > 50 && offsetX <= 250){
                    bBomb = true;
                }
            }else if(bombPos.z == 0){  //1-爆炸一圈。死亡之后爆炸，使周围一圈8个砖块中所有敌方阵营死亡  
                let len = this.node.position.sub(cc.v2(bombPos.x, bombPos.y)).mag();
                if(len > 10 && len <= 150){
                    bBomb = true;
                }
            }
            if(bBomb == true){
                let img = FightMgr.qipanSc.createBoomEffectImg(cc.v2(bombPos.x, bombPos.y), 0)
                if(img){
                    img.scale = 0.8;
                    img.opacity = 255;
                    img.runAction(cc.sequence(cc.spawn(cc.moveTo(0.1, this.node.position), cc.sequence(cc.scaleTo(0.05, 1.5), cc.scaleTo(0.05, 0.8))), cc.callFunc(function(){
                        this.hitDamage(parseInt(this.labPH.string), null, true);
                        img.removeFromParent(true);
                    }.bind(this))));
                }
            }
        }
    }

    /**砖块受击连击散播 */
    hanldeBrickDiffuseHit(hitPos: cc.Vec3){
        if(this.isBrickDead() == false  && this.brick_info){
            let offsetX = Math.abs(this.node.x - hitPos.x);
            let offsetY = Math.abs(this.node.y - hitPos.y);
            let harm = Math.abs(hitPos.z);
            let bHarmed = false;
            if(harm >= 1000000){  //连体覆盖打击 每次受到攻击，对一圈敌方阵营造成同等伤害
                harm -= 1000000;
                let len = this.node.position.sub(cc.v2(hitPos.x, hitPos.y)).mag();
                if(len > 10 && len <= 150){
                    bHarmed = true;
                }
            }else{
                if(hitPos.z < 0){  //每次碰撞，均会对该行所有敌方阵营进行攻击
                    if(offsetX > 10 && offsetY < 50){
                        bHarmed = true;
                    }
                }else if(hitPos.z > 0){  //每次碰撞，均会对该列所有敌方阵营进行攻击
                    if(offsetY > 10 && offsetX < 50){
                        bHarmed = true;
                    }
                }
            }

            if(bHarmed == true){
                let img = FightMgr.qipanSc.createBoomEffectImg(cc.v2(hitPos.x, hitPos.y), 1)
                if(img){
                    img.scale = 0.8;
                    img.opacity = 255;
                    img.runAction(cc.sequence(cc.spawn(cc.moveTo(0.1, this.node.position), cc.sequence(cc.scaleTo(0.05, 1.5), cc.scaleTo(0.05, 0.8))), cc.callFunc(function(){
                        this.hitDamage(harm, null, true);
                        img.removeFromParent(true);
                    }.bind(this))));
                }
            }
        }
    }

    /**死亡特效 
     * bReviveHit 是否复活导致的死亡或者吞噬死亡，复活消除有些效果不需要处理
    */
    showDeadEffect(bDeadEvent:boolean){
        if(this.brick_info){
            this.brick_info.curHp = 0;

            if(bDeadEvent == true){
                //AudioMgr.playEffect("effect/dead");   //砖块死亡音效
                FightMgr.qipanSc.showBrickDeadAni(this.node.position); //砖块死亡特效
    
                if(this.brick_info.monsterCfg.event == 3){ //事件 0无 1-间隔回合无敌 2-回合第一次盾牌 3-重生。当砖块死亡时，原地复活一个y移动砖块（Id=7)
                    FightMgr.qipanSc.addBrickCloneBrick(this.node.position, this.checkBrickReachBottom(), 0, 5, [7]);
                } 
            }

            if(this.brick_info.monsterCfg.ai == 2){  //行为 0无 1：左右往复移动 2：间隔吸附 3.坠落两行
                this.handleBrickAdsorbEvent();
            }
        }

        this.handleRemoveMySelf(false);   //移除砖块自身 
    }

    /**砖块吸附小球 */
    handleBrickAdsorbEvent(){
        if(this.isBrickDead() == true && this.brick_info && this.brick_info.monsterCfg.ai == 2){  //行为 0无 1：左右往复移动 2：间隔吸附 3.坠落两行
            NotificationMy.emit(NoticeType.BallAdsorbEvent, this.brickId);   //砖块吸附小球
        }
    }

    /**回合结束，下移操作 */
    handleBrickMoveDownAction(data:any){  //{"bMultiLineMove":this.bMultiLineMove, "bMove":bMove}  bMultiLineMove true为多行下移过程中
        if(this.isBrickDead() == true){ 
            return;
        }
        this.bRoundHited = false;   //该回合内是否被碰撞过
        this.clearBrickActions();   //清除砖块或纹理的所有动画
        if(this.isMoveBrick() == true){
            this.moveBrickAction(false);   //移动砖块的水平移动
        }

        if(data.bMove == false){   //停滞
            FightMgr.qipanSc.handleBrickMoveDownOver();   
        }else{
            let dropLineNum = this.getBrickDownLine(data.bMultiLineMove);
            let curPos = this.node.position.clone();
            let posY = FightMgr.adjustBrickPosFromMove(curPos.y, FightMgr.tileHeight);   //校正砖块坐标，防止因下移而产生的最终位置偏移
            let target = cc.v2(curPos.x, posY - dropLineNum*FightMgr.tileHeight); 
            let downMove = cc.sequence(cc.moveTo(0.15, target), cc.callFunc(function(){
                if(dropLineNum > 1){   //多行下移，注意改变移动怪的碰撞砖块集合
                    NotificationMy.emit(NoticeType.BrickDownMultiLine, this);  //砖块多行下移
                }
                
                this.checkBrickReachBottom();   //检查是否有砖块触底
                if(data.bMultiLineMove == true){
                    FightMgr.qipanSc.handleBrickMoveDownAndCheckAttr();   //处理砖块回合下落完毕(检查事件)  
                }else{
                    FightMgr.qipanSc.handleBrickMoveDownOver();   //处理砖块回合下落完毕(未检查事件)
                }
            }.bind(this)));
            downMove.setTag(this.moveDownActionTag);
            this.node.runAction(downMove);
        }
    }

    /**处理砖块无敌/盾牌 */
    handleBrickInvincible(){
        if(this.isBrickDead() == false){
            let brickEventType = this.brick_info.monsterCfg.event;  //事件 0无 1-间隔回合无敌 2-回合第一次盾牌 3-重生。当砖块死亡时，原地复活一个y移动砖块（Id=7)
            if(brickEventType == 1){
                if(this.checkBrickReachBottom() <= 1){  //预检测，距离底部行还有一行
                    this.bInvincible = false;   //无敌怪在最下一行恒为不无敌状态
                }else{
                    this.bInvincible = !this.bInvincible; 
                }
            }else if(brickEventType == 2){
                this.bInvincible = true;   //每回合，受到的第一次伤害不减HP
            }else{
                this.bInvincible = false;
            }
            this.setBrickInvincibleSpr();   //根据无敌状态设置砖块纹理
            
            FightMgr.qipanSc.handleBrickMoveDownAndCheckAttr();   //处理砖块回合下落完毕(检查事件) 
        }
    }

    /**获取砖块下移行数，急速怪下移两行 */
    getBrickDownLine(bMultiLineMove: boolean){
        if(bMultiLineMove == true){   //多行下移过程中
            return 1;
        }
        if(this.brick_info.monsterCfg.ai == 3){  //行为 0无 1：左右往复移动 2：间隔吸附 3.坠落两行
            if(this.checkBrickReachBottom() == 1){  //预检测，距离底部行还有一行
                return 1;
            }else{
                let posY = FightMgr.adjustBrickPosFromMove(this.node.y, FightMgr.tileHeight);
                let downPos = cc.v2(this.node.x, posY - FightMgr.tileHeight);
                if(FightMgr.qipanSc.checkHasBrickByPos(downPos) == true){  //急速怪下方有砖块
                    return 1;
                }
            }
            return 2;
        }
        return 1;
    }

    /**检查是否有砖块触底 */
    checkBrickReachBottom(bPrecheck: boolean = false){
        let offsetY = this.node.y - FightMgr.gameBottomPosY;   //砖块距棋盘底部的距离
        if(offsetY <= FightMgr.tileHeight){  //触底结束
            FightMgr.qipanSc.hanldeGameOver(false);  //该局游戏是否结束
            return 0;
        }else if(offsetY <= FightMgr.tileHeight*2){  //距离底部行还有一行(倒数第二行)
            this.brickNode.stopActionByTag(this.brickSprBottomActionTag);   //砖块到达底部预警抖动
            if(bPrecheck == false){
                this.brickNode.y = 0;
                let action = cc.repeatForever(cc.sequence(cc.moveBy(0.2, cc.v2(0, -5)), cc.moveBy(0.2, cc.v2(0, 5))));
                action.setTag(this.brickSprBottomActionTag);
                this.brickNode.runAction(action);
            }

            this.brickSpr.node.color = cc.color(255, 170, 170);
            return 1;
        }else if(offsetY <= FightMgr.tileHeight*3){  //距离底部行还有二行(倒数第三行)
            if(this.brick_info.monsterCfg.ai == 3){  //行为 0无 1：左右往复移动 2：间隔吸附 3.坠落两行
                this.brickSpr.node.color = cc.color(255, 170, 170);

                this.brickNode.stopActionByTag(this.brickSprBottomActionTag);   //砖块到达底部预警抖动
                if(bPrecheck == false){
                    this.brickNode.y = 0;
                    let action = cc.repeatForever(cc.sequence(cc.moveBy(0.2, cc.v2(0, -5)), cc.moveBy(0.2, cc.v2(0, 5))));
                    action.setTag(this.brickSprBottomActionTag);
                    this.brickNode.runAction(action);
                }
            }
            
            return 2;
        }else{
            return 100;
        }
    }
    
}
