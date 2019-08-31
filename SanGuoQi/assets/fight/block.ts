
import { CardInfo, NoticeType, SoliderType, EnemyAIResult } from "../manager/Enum";
import { FightMgr } from "../manager/FightManager";
import Card from "./card";
import FightShow from "./fightShow";
import { NoticeMgr } from "../manager/NoticeManager";

//棋盘格子对象
const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component {

    @property(cc.Sprite)
    blockSpr: cc.Sprite = null;
    @property([cc.SpriteFrame])
    openFrames: cc.SpriteFrame[] = new Array(3);  //开启后的背景, 0默认，1箭楼，2城池

    @property(cc.Node)
    headNode: cc.Node = null;
    @property(cc.Node)
    runBg: cc.Node = null;   //路径范围显示图片
    @property(cc.Node)
    atkBg: cc.Node = null;   //攻击范围显示图片
    @property(cc.Node)
    effNode: cc.Node = null;  //特效总节点

    @property(cc.SpriteAtlas)
    qiupAtlas: cc.SpriteAtlas = null;  //士气增加的特效
    @property(cc.SpriteAtlas)
    qidownAtlas: cc.SpriteAtlas = null;  //士气降低的特效

    blockId: number = 0;   //地块ID
    isLock: boolean = true;   //是否锁定的地块

    cardNode: cc.Node = null;
    cardInfo: CardInfo = null;   //注意，地块的cardInfo和卡牌的cardInfo是公用一块内存的。

    ArrowOrTown: number = 0;   //箭楼或城池 0无，1箭楼，2城池

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        NoticeMgr.on(NoticeType.SelBlockMove, this.handleSelBlockMove, this);  //准备拖动砖块
        NoticeMgr.on(NoticeType.PerNextRound, this.handlePerNextRound, this);  //下一个回合准备
        NoticeMgr.on(NoticeType.EnemyRoundOptAI, this.handleEnemyRoundOptAI, this);  //敌方自动AI

        this.runBg.active = false;    //路径范围显示图片
        this.atkBg.active = false;   //攻击范围显示图片
    }

    onDestroy(){
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start () {

    }

    // update (dt) {}
    //下一个回合准备
    handlePerNextRound(){
        this.effNode.removeAllChildren();
        if(FightMgr.fightRoundCount > 0){
            this.handleShiqiChange(-1, false);  //每回合降低士气
        }
    }

    //士气变动
    handleShiqiChange(val: number, bShowAni:boolean = true){
        if(this.isLock == false && this.cardInfo && this.cardNode){
            this.cardInfo.shiqi += val;
            if(this.cardInfo.shiqi < 0){
                this.cardInfo.shiqi = 0;
            }
            this.cardNode.getComponent(Card).showCardShiqiLabel();   //显示士气值

            if(bShowAni){
                let effNode = null;
                if(val > 0){
                    effNode = FightMgr.showFramesAniAndRemove(this.effNode, cc.v2(0, 0), this.qiupAtlas, false);
                }else if(val < 0){
                    effNode = FightMgr.showFramesAniAndRemove(this.effNode, cc.v2(0, 0), this.qidownAtlas, false);
                }
                if(effNode){
                    effNode.runAction(cc.sequence(cc.delayTime(0.5), cc.removeSelf(true)));
                }
            }

            if(this.cardInfo.shiqi <= 0){  //士气过低，逃离战场
                cc.log("士气过低，逃离战场  this.cardInfo = "+JSON.stringify(this.cardInfo));
                if(this.cardInfo.campId == FightMgr.myCampId){
                    FightMgr.getFightScene().setMyOpenBlock(false, this);   //设置我方已经开启的卡牌
                }else{
                    FightMgr.getFightScene().setEnemyOpenBlock(false, this);   //设置敌方已经开启的卡牌
                }

                this.onRemoveCardNode();   //将本地块上的卡牌移走了
                FightMgr.getFightScene().checkGameOver(true);  //检查是否游戏结束 
            }
        }
    }

     //准备拖动砖块
    handleSelBlockMove(selBlock: Block){
        if(this.isLock == true){   //未解锁
            return;
        }
        this.runBg.active = false;    //路径范围显示图片
        this.atkBg.active = false;   //攻击范围显示图片

        if(selBlock && selBlock.blockId != this.blockId){
            let offX = Math.abs(this.node.x - selBlock.node.x);
            let offY = Math.abs(this.node.y - selBlock.node.y);
            if(offX < 20 || offY < 20){   //同行或同列
                let blockLen = this.node.position.sub(selBlock.node.position).mag();
                if(blockLen <= 400){
                    if(this.cardInfo){
                        if(selBlock.isLock == false && this.cardInfo.campId != selBlock.cardInfo.campId){   //敌对阵营
                            this.showRunAndAtkBg(selBlock, blockLen);
                        }
                    }else{   //空砖块
                        this.showRunAndAtkBg(selBlock, blockLen);
                    }
                }
            }
        }
    } 

    //显示路径或攻击底图
    showRunAndAtkBg(selBlock: Block, blockLen: number){
        if(selBlock.cardInfo.generalInfo.generalCfg.bingzhong == SoliderType.gongbing){   //弓兵攻击两格
            this.atkBg.active = true;
        }else{
            if(blockLen <= 200){
                this.atkBg.active = true;
            }
        }

        if(selBlock.cardInfo.generalInfo.generalCfg.bingzhong == SoliderType.qibing){   //骑兵移动两格
            this.runBg.active = true;
        }else{
            if(blockLen <= 200){
                this.runBg.active = true;
            }
        }
    }

    /**随机卡牌数据 */
    initBlockData(idx: number){
        this.blockId = idx;
        if(idx == 8 || idx == 11){
            if(idx == 8){
                this.ArrowOrTown = 1;  //箭楼或城池 0无，1箭楼，2城池
            }else if(idx == 11){
                this.ArrowOrTown = 2; 
            }
            this.cardInfo = null;   //空卡
            this.isLock = false;
            this.showBlockCard(this.cardInfo);
            return;
        }else{
            this.ArrowOrTown = 0;  //箭楼或城池 0无，1箭楼，2城池
        }

        //let cardInfo = FightMgr.getGeneralDataFromRandomArr(this.blockId);  //从随机数组中获取武将数据
        let cardInfo = FightMgr.getGeneralDataByBlockIdx(this.blockId);  //卡牌均开启并制定位置
        if(cardInfo.campId == 0 && cardInfo.generalInfo == null){
            this.cardInfo = null;   //空卡
            this.isLock = false;
            this.showBlockCard(this.cardInfo);
        }else{
            this.cardInfo = cardInfo;
            //this.isLock = true;   //demo中所有地块均开启
            this.isLock = false;

            FightMgr.getFightScene().setLockBlock(this.isLock, this);   //设置地块开启或锁定
            this.showBlockCard(this.cardInfo);
        }
    }

    /**显示地块上卡牌 */
    showBlockCard(info: CardInfo){
        //cc.log("showBlockCard(), this.blockId = "+this.blockId+"; this.isLock = "+this.isLock+"; info = "+JSON.stringify(info));
        if(this.isLock == false){   //地块未锁定
            if(info){
                this.cardInfo = info;
    
                if(this.cardNode == null){
                    let cardNode = cc.instantiate(FightMgr.getFightScene().pfCard);
                    this.headNode.addChild(cardNode);
                    this.cardNode = cardNode;
                }
                this.cardNode.opacity = 255; 
                this.cardNode.getComponent(Card).setCardData(info);
            }

            this.blockSpr.spriteFrame = this.openFrames[this.ArrowOrTown];  //箭楼或城池 0无，1箭楼，2城池
        }
    }

    onTouchStart(event: cc.Event.EventTouch) {
        if(FightMgr.bMyRound == true && FightMgr.bStopTouch == false){  //是否停止触摸反应
            if(this.isLock == true){
                this.handleOpenBlockCard();  //翻牌
            }else{
                if(this.cardInfo && this.cardInfo.campId == FightMgr.myCampId){
                    this.handleTouchSelCard();   //处理选中并拖动
                }
            }
        }else if(FightMgr.bMyRound == false && FightMgr.EnemyAutoAi == false ){ //敌方自动AI关闭
            if(this.isLock == true){
                this.handleOpenBlockCard();  //翻牌
            }else{
                if(this.cardInfo && this.cardInfo.campId != FightMgr.myCampId){
                    this.handleTouchSelCard();   //处理选中并拖动
                }
            }
        }
    }

    /**翻牌 */
    handleOpenBlockCard(){
        FightMgr.bStopTouch = true;
        this.blockSpr.node.runAction(cc.sequence(cc.repeat(cc.sequence(cc.scaleTo(0.1, -1, 1), cc.scaleTo(0.1, 1, 1)), 3), cc.callFunc(function(){
            this.isLock = false;
            this.showBlockCard(this.cardInfo);

            FightMgr.getFightScene().setLockBlock(false, this);   //设置地块开启或锁定
            FightMgr.nextRoundOpt();
        }.bind(this))));
    }

    /**处理选中并拖动 */
    handleTouchSelCard(bSel: boolean = true){
        if(this.cardNode){
            if(bSel){
                this.cardNode.opacity = 120;  
                FightMgr.getFightScene().setSelectCard(this);   //拖动更新选中的卡牌模型的位置
            }else{
                this.cardNode.opacity = 255;
            }
        }
    }

    /**显示战斗或合成 */
    showFightShow(nType: number, srcBlock: Block){
        let layer = FightMgr.showLayer(FightMgr.getFightScene().pfFightShow);
        layer.y += 100;
        layer.getComponent(FightShow).initFightShowData(nType, srcBlock, this);
    }

    /**将一个地块上的卡牌放置到本地块上 */
    onCardDropBlock(dropBlock: Block){
        //cc.log("onCardDropBlock(), this.blockId = "+this.blockId+"; dropBlock.blockId = "+dropBlock.blockId);
        if(this.isLock == true){
            dropBlock.onCardDropBlock(dropBlock);   //将一个地块上的卡牌放置到本地块上
            return;
        }

        if(dropBlock.blockId == this.blockId){
            this.cardNode.opacity = 255;   //自己的卡牌又移动回来或者没有位置放置复原了
            return;
        }

        let dropCardInfo: CardInfo = dropBlock.cardInfo;

        if(this.cardInfo && dropCardInfo){
            if(this.cardInfo.campId == dropCardInfo.campId){   //同阵营合成
                //this.showFightShow(1, dropBlock);
                //demo不开启合成
                dropBlock.onCardDropBlock(dropBlock);   //将一个地块上的卡牌放置到本地块上
            }else{    //战斗
                this.showFightShow(2, dropBlock);
            }
        }else{  //移动
            this.showBlockCard(dropCardInfo);  //设置地块上的卡牌模型

            if(dropCardInfo.campId == FightMgr.myCampId){
                FightMgr.getFightScene().setMyOpenBlock(false, dropBlock); 
                FightMgr.getFightScene().setMyOpenBlock(true, this);  //设置我方已经开启的卡牌
            }else{
                FightMgr.getFightScene().setEnemyOpenBlock(false, dropBlock); 
                FightMgr.getFightScene().setEnemyOpenBlock(true, this);   //设置敌方已经开启的卡牌
            }

            dropBlock.onRemoveCardNode();   //将本地块上的卡牌移走了
            FightMgr.nextRoundOpt();  //下回合处理
        }
    }

    /**将本地块上的卡牌移走了 */
    onRemoveCardNode(){
        //cc.log("onRemoveCardNode(), this.blockId = "+this.blockId);
        if( this.isLock == false && this.cardNode){
            this.cardNode.removeFromParent(true);
            this.cardInfo = null;
            this.cardNode = null;
        }
    }

    /**敌方回合AI处理 */
    handleEnemyRoundOptAI(){
        cc.log("handleEnemyRoundOptAI(), 敌方自动AI FightMgr.EnemyAutoAi = "+FightMgr.EnemyAutoAi);
        if(this.isLock == true || this.cardInfo == null || this.cardNode == null || FightMgr.EnemyAutoAi == false || this.cardInfo.campId == FightMgr.myCampId){   //敌方自动AI
            return;
        }

        //1、预判所有敌方单位是否收到我方严重威胁，并找出受威胁最严重的一个敌方单位；
        // 同时，找出敌方可击杀我方的敌方单位。判定逃跑或击杀权重从而选择操作。
        let runAwayEnemy = null;    //敌方预逃走的单位
        let runAwayWeight = 0;   //逃走权重
        let hitEnemy = null;   //敌方出手的单位
        let hitMy = null;    //我方预被击杀的单位
        let hitWeight = 0;   //击杀权重

        cc.log("预判所有敌方单位是否收到我方严重威胁，并找出受威胁最严重的一个敌方单位；同时，找出敌方可击杀我方的敌方单位。判定逃跑或击杀权重从而选择操作。");
        let myOpenBlocks = FightMgr.getFightScene().myOpenBlocks;

        for(let j=0; j<myOpenBlocks.length; ++j){
            let myBlock = myOpenBlocks[j];

            let offX = Math.abs(this.node.x - myBlock.node.x);
            let offY = Math.abs(this.node.y - myBlock.node.y);
            if(offX < 20 || offY < 20){   //同行或同列
                let blockLen = this.node.position.sub(myBlock.node.position).mag();
                let enemyCardCfg = this.cardInfo.generalInfo.generalCfg;
                if(blockLen <= 200 || (enemyCardCfg.bingzhong == SoliderType.gongbing && blockLen <= 400)){   //弓兵攻击两格
                    let enemyNum = enemyCardCfg.atk + enemyCardCfg.def + enemyCardCfg.hp;

                    let myCardCfg = myBlock.cardInfo.generalInfo.generalCfg;
                    let myNum = myCardCfg.atk + myCardCfg.def + myCardCfg.hp;

                    let hartScale = enemyNum/myNum;
                    if(enemyCardCfg.bingzhong == SoliderType.gongbing && blockLen > 200){  //弓兵远距离权重增加
                        hitWeight += 0.3;
                    }

                    if(hartScale >= 0.8){   //可能会取胜
                        if(hartScale > hitWeight){
                            hitWeight = hartScale;
                            hitEnemy = this;
                            hitMy = myBlock;
                        }
                    }
                    else{   //可能战斗失败
                        let runScale = myNum/enemyNum - 0.3;
                        if(runScale >= 1.0){  //可能战斗失败
                            if(runScale > runAwayWeight){
                                runAwayWeight = runScale;
                                runAwayEnemy = this;
                            }
                        }
                    }
                }
            }
        }

        let AiResult: EnemyAIResult = new EnemyAIResult(runAwayEnemy, runAwayWeight, hitEnemy, hitMy, hitWeight);
        FightMgr.handelEnemyAIResult(AiResult);
    }


}
