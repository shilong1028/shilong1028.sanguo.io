import Card from "./card";
import Block from "./block";
import { FightMgr } from "../manager/FightManager";
import { CardInfo } from "../manager/Enum";

//战斗场景
const {ccclass, property} = cc._decorator;

@ccclass
export default class FightScene extends cc.Component {

    @property(cc.Node)
    qipanNode: cc.Node = null;   //棋盘节点

    @property(cc.Node)
    gridNode: cc.Node = null;   //棋盘网格节点

    @property(cc.Label)
    myCampLabel: cc.Label = null;

    @property(cc.Label)
    roundDesc: cc.Label = null;

    @property(cc.Toggle)
    autoToggle: cc.Toggle = null;

    @property(cc.Prefab)
    pfBlock: cc.Prefab = null;   //棋盘格对象

    @property(cc.Prefab)
    pfCard: cc.Prefab = null;   //卡牌对象

    @property(cc.Prefab)
    pfFightShow: cc.Prefab = null;  //战斗或合成展示层

    @property(cc.Prefab)
    pfHelp: cc.Prefab = null;

    @property(cc.Prefab)
    pfResult: cc.Prefab = null;

    selectBlock: Block = null;    //选中的将要移动的卡牌地块
    selCardNode: cc.Node = null;   //选中的卡牌对象（新创建）

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.ontTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.ontTouchEnd, this);
    }

    start () {
        this.onHelpBtn();
        this.createDefaultCards();
    }

    // update (dt) {}

    onHelpBtn(){
        FightMgr.showLayer(this.pfHelp);
    }

    onResetBtn(){
        this.createDefaultCards();
    }

    showCampDesc(){
        if(FightMgr.myCampId == 0){   //阵营，0默认，1蓝方，2红方
            this.myCampLabel.string = "我方阵营："
            this.myCampLabel.node.color = cc.color(255, 255, 255);
        }else if(FightMgr.myCampId == 1){
            this.myCampLabel.string = "我方阵营：蓝方"
            this.myCampLabel.node.color = cc.color(0, 0, 255);
        }else if(FightMgr.myCampId == 2){
            this.myCampLabel.string = "我方阵营：红方"
            this.myCampLabel.node.color = cc.color(255, 0, 0);
        }
    }

    showRoundDesc(){
        if(FightMgr.myCampId == 0){   //阵营，0默认，1蓝方，2红方
            this.roundDesc.string = "我方回合"
            this.roundDesc.node.color = cc.color(255, 255, 255);
        }else if(FightMgr.myCampId == 1){
            if(FightMgr.bMyRound){
                this.roundDesc.string = "我方回合"
                this.roundDesc.node.color = cc.color(0, 0, 255);
            }else{
                this.roundDesc.string = "敌方回合"
                this.roundDesc.node.color = cc.color(255, 0, 0);
            }
        }else if(FightMgr.myCampId == 2){
            if(FightMgr.bMyRound){
                this.roundDesc.string = "我方回合"
                this.roundDesc.node.color = cc.color(255, 0, 0);
            }else{
                this.roundDesc.string = "敌方回合"
                this.roundDesc.node.color = cc.color(0, 0, 255);
            }
        }
    }

    /**卡牌初始化 */
    createDefaultCards(){
        FightMgr.clearFightData();

        this.showCampDesc();
        this.showRoundDesc();

        this.autoToggle.isChecked = FightMgr.EnemyAutoAi;  //敌方自动AI

        this.gridNode.removeAllChildren(true);
        FightMgr.getAllRandomGenerals();

        let totalCardCount = FightMgr.cardsCol*FightMgr.cardsRow;
        for(let i=0; i<totalCardCount;++i){
            let block = cc.instantiate(this.pfBlock);
            this.gridNode.addChild(block);
            block.getComponent(Block).randCardData(i);
        }
    }

    /**设置选中的将要移动的卡牌地块 */
    setSelectCard(block: Block){
        this.selectBlock = block;  
    }

    onAutoToggle(){
        FightMgr.EnemyAutoAi = !FightMgr.EnemyAutoAi;
        this.autoToggle.isChecked = FightMgr.EnemyAutoAi;  //敌方自动AI
    }

    onTouchStart(event: cc.Event.EventTouch) {  
        if(FightMgr.bStopTouch == false && this.selectBlock){ //是否停止触摸反应
            this.updateSelectCard(event.getLocation());   //拖动更新选中的小球模型的位置
        }
    }

    onTouchMove(event: cc.Event.EventTouch) {
        if(FightMgr.bStopTouch == false && this.selCardNode && this.selectBlock){
            this.updateSelectCard(event.getLocation());   //拖动更新选中的卡牌模型的位置
        }
    }

    ontTouchEnd(event: cc.Event.EventTouch) {
        if(FightMgr.bStopTouch == false && this.selCardNode && this.selectBlock){
            this.placeSelectCard(event.getLocation());   //放置选中的卡牌模型
        }
    }

    /**拖动更新选中的卡牌的位置 */
    updateSelectCard(touchPos: cc.Vec2){
        if(this.selectBlock == null){
            return;
        }
        if(this.selCardNode == null){   //选中的卡牌对象（新创建）
            this.selCardNode = cc.instantiate(this.pfCard);
            this.selCardNode.setPosition(-3000, -3000);
            this.node.addChild(this.selCardNode, 100);
        }
        let card = this.selCardNode.getComponent(Card);
        card.setCardData(this.selectBlock.cardInfo);   //设置地块卡牌模型数据 

        let pos = this.node.convertToNodeSpaceAR(touchPos);
        pos.y += this.gridNode.y;
        this.selCardNode.setPosition(pos);
    }

    /**放置选中的卡牌模型 */
    placeSelectCard(touchPos : cc.Vec2){
        if(this.selCardNode == null || this.selectBlock == null){
            return;
        }
        this.selCardNode.setPosition(-3000, -3000);
        touchPos.y += this.gridNode.y;

        let dropBlock: Block = this.getBlockSlotIndex(touchPos);   //根据位置找到对应的地块
        if(dropBlock == null){   //未找到合适的地块
            this.selectBlock.onCardDropBlock(this.selectBlock);   //将一个地块上的卡牌放置到本地块上
        }else{
            dropBlock.onCardDropBlock(this.selectBlock);   //将一个地块上的卡牌放置到选中的地块上
        }
        this.selectBlock = null;   //拖动的地块数据
    }

    /**根据位置找到对应的地块 */
    getBlockSlotIndex(touchPos: cc.Vec2): Block{
        let pos = this.gridNode.convertToNodeSpaceAR(touchPos);
        let blocks = this.gridNode.children;
        for(let i=0; i< blocks.length; i++){
            let len = blocks[i].getPosition().sub(pos).mag();
            if(len <= 100){
                let block = blocks[i].getComponent(Block);
                if(block && block.isLock == false){
                    let offX = Math.abs(this.selectBlock.node.x - blocks[i].x);
                    let offY = Math.abs(this.selectBlock.node.y - blocks[i].y);
                    if(offX < 20 || offY < 20){   //同行或同列
                        let blockLen = blocks[i].getPosition().sub(this.selectBlock.node.position).mag();
                        if(block.cardInfo){   //攻击或合并
                            if(this.selectBlock.cardInfo.cardCfg.bingzhong == 403){   //弓兵攻击两格
                                if(blockLen <= 400){
                                    return block;
                                }
                            }else{
                                if(blockLen <= 200){
                                    return block;
                                }
                            }
                        }else{   //只能移动相邻格子
                            if(blockLen <= 200){
                                return block;
                            }
                        }
                    }
                }
                return null;
            }
        }
        return null;
    }

    /**检查是否游戏结束 */
    checkGameOver(){
        let myCampCount = 0;
        let enemyCampCount = 0;
        
        let blocks = this.gridNode.children;
        for(let i=0; i< blocks.length; i++){
            let block = blocks[i].getComponent(Block);
            if(block){
                if(block.isLock == true){
                    return false;
                }else{
                    if(block.cardInfo){
                        if(block.cardInfo.campId == FightMgr.myCampId){
                            myCampCount ++;
                        }else{
                            enemyCampCount ++;
                        }
                    }
                }
            }
        }
        cc.log("checkGameOver(), myCampCount = "+myCampCount+"; enemyCampCount = "+enemyCampCount);

        if(myCampCount == 0){   //失败
            FightMgr.FightWin = false;  //战斗胜利或失败
            FightMgr.showLayer(this.pfResult);
            return true;
        }else if(enemyCampCount == 0){   //胜利
            FightMgr.FightWin = true;  //战斗胜利或失败
            FightMgr.showLayer(this.pfResult);
            return true;
        }
        return false;
    }

    /**或者相邻地块数据 */
    getNearBlock(srcBlock: Block){
        let pos = srcBlock.node.position;
        let nearArr = new Array();
        let blocks = this.gridNode.children;
        for(let i=0; i< blocks.length; i++){
            let len = blocks[i].getPosition().sub(pos).mag();
            if(len <= 200 && len > 50){
                let block = blocks[i].getComponent(Block);
                if(block && block.isLock == false){
                    nearArr.push(block);
                }
            }
        }
        return nearArr;
    }

    /**敌方回合处理 */
    handleEnemyRoundOpt(){
        if(FightMgr.EnemyAutoAi == false){   //敌方自动AI
            return;
        }
        this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function(){
            let blocks = this.gridNode.children;
            let bRunAway = true;   //逃走
            for(let i=0; i< blocks.length; i++){
                let block = blocks[i].getComponent(Block);
                if(block && block.isLock == false){
                    let enmyCardInfo: CardInfo = block.cardInfo;
                    if(enmyCardInfo && enmyCardInfo.campId != FightMgr.myCampId){
                        let nearArr = this.getNearBlock(block);
                        if(nearArr && nearArr.length > 0){
                            //战斗
                            for(let j=0; j< nearArr.length; j++){
                                let nearBlock = nearArr[j];
                                if(nearBlock && nearBlock.cardInfo){
                                    let nearCardInfo: CardInfo = nearBlock.cardInfo;
                                    if(nearCardInfo && nearCardInfo.campId == FightMgr.myCampId){
                                        let enemyNum = enmyCardInfo.cardCfg.atk + enmyCardInfo.cardCfg.def + enmyCardInfo.cardCfg.mp + enmyCardInfo.cardCfg.hp;
                                        let nearNum = nearCardInfo.cardCfg.atk + nearCardInfo.cardCfg.def + nearCardInfo.cardCfg.mp + nearCardInfo.cardCfg.hp;
                                        if(enemyNum > nearNum){
                                            if(Math.random() < 0.8){
                                                cc.log("敌方选择战斗");
                                                nearBlock.onCardDropBlock(block);
                                                return;
                                            }
                                        }else{
                                            //逃走
                                            bRunAway = true;
                                        }
                                    }
                                }
                            }

                            //合并
                            if(Math.random() < 0.5){
                                for(let j=0; j< nearArr.length; j++){
                                    let nearBlock = nearArr[j];
                                    if(nearBlock && nearBlock.cardInfo){
                                        let nearCardInfo: CardInfo = nearBlock.cardInfo;
                                        if(nearCardInfo && nearCardInfo.campId != FightMgr.myCampId){
                                            cc.log("敌方选择合成");
                                            nearBlock.onCardDropBlock(block);
                                            return;
                                        }
                                    }
                                }
                            }

                            //逃走
                            if(bRunAway){
                                for(let j=0; j< nearArr.length; j++){
                                    let nearBlock = nearArr[j];
                                    if(nearBlock && nearBlock.cardInfo == null){
                                        cc.log("敌方选择逃走");
                                        nearBlock.onCardDropBlock(block);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            for(let i=0; i< blocks.length; i++){
                let block = blocks[i].getComponent(Block);
                if(block && block.isLock == true){
                    cc.log("敌方选择翻牌");
                    block.handleOpenBlockCard();
                    return;
                }
            }

            //什么都没有处理，重新处理
            this.handleEnemyRoundOpt();  //敌方回合处理 
        }.bind(this))));
    }
}
