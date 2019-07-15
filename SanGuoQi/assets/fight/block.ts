
import { CardInfo } from "../manager/Enum";
import { FightMgr } from "../manager/FightManager";
import Card from "./card";
import FightShow from "./fightShow";

//棋盘格子对象
const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component {

    @property(cc.Sprite)
    blockSpr: cc.Sprite = null;
    @property(cc.SpriteFrame)
    openFrame: cc.SpriteFrame = null;  //开启后的背景

    @property([cc.SpriteFrame])
    sprFrames: cc.SpriteFrame[] = new Array(2);

    blockId: number = 0;   //地块ID
    isLock: boolean = true;   //是否锁定的地块

    cardNode: cc.Node = null;
    cardInfo: CardInfo = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onDestroy(){
        this.node.targetOff(this);
    }

    start () {

    }

    // update (dt) {}

    /**随机卡牌数据 */
    randCardData(idx: number){
        this.blockId = idx;
        let cardInfo = FightMgr.getGeneralDataFromRandomArr();  //从随机数组中获取武将数据
        if(cardInfo.campId == 0 && cardInfo.generalInfo == null){
            this.cardInfo = null;   //空卡
            this.isLock = false;
            this.showBlockCard(this.cardInfo);
        }else{
            this.cardInfo = cardInfo;
            this.isLock = true;
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
    
            if(FightMgr.bMyRound == true){
                FightMgr.handleEnemyRoundOpt();   //敌方回合处理
            }else{
                FightMgr.handleMyRoundOpt();   //我方回合处理
            }
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

    /**初始化地块数据 */
    initBlockData(id: number, info: CardInfo){
        this.blockId = id;
        this.cardInfo = info;
    }

    /**显示地块上卡牌 */
    showBlockCard(info: CardInfo){
        cc.log("showBlockCard(), this.blockId = "+this.blockId+"; this.isLock = "+this.isLock+"; info = "+JSON.stringify(info));
        if(this.isLock == false){   //地块未锁定
            if(info){
                this.cardInfo = info;
                this.blockSpr.spriteFrame = this.sprFrames[1];
    
                if(this.cardNode == null){
                    let cardNode = cc.instantiate(FightMgr.getFightScene().pfCard);
                    this.node.addChild(cardNode);
                    this.cardNode = cardNode;
                }
                this.cardNode.opacity = 255; 
                this.cardNode.getComponent(Card).setCardData(info);
            }

            this.blockSpr.spriteFrame = this.openFrame;
        }
    }

    /**显示战斗或合成 */
    showFightShow(nType: number, srcBlock: Block, destBlock: Block){
        let layer = FightMgr.showLayer(FightMgr.getFightScene().pfFightShow);
        layer.getComponent(FightShow).initFightShowData(nType, srcBlock, destBlock);
    }

    /**将一个地块上的卡牌放置到本地块上 */
    onCardDropBlock(dropBlock: Block){
        cc.log("onCardDropBlock(), this.blockId = "+this.blockId+"; dropBlock.blockId = "+dropBlock.blockId);
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
                this.showFightShow(1, dropBlock, this);
            }else{    //战斗
                this.showFightShow(2, dropBlock, this);
            }
        }else{  //移动
            this.showBlockCard(dropCardInfo);  //设置地块上的卡牌模型
            dropBlock.onRemoveCardNode();   //将本地块上的卡牌移走了
            FightMgr.nextRoundOpt();  //下回合处理
        }
    }

    /**将本地块上的卡牌移走了 */
    onRemoveCardNode(){
        cc.log("onRemoveCardNode(), this.blockId = "+this.blockId);
        if( this.isLock == false && this.cardNode){
            this.cardNode.removeFromParent(true);
            this.cardInfo = null;
            this.cardNode = null;
        }
    }

}
