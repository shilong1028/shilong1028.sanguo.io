import Card from "./card";
import Block from "./block";
import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import { CardInfo, NoticeType, SoliderType } from "../manager/Enum";
import { NoticeMgr } from "../manager/NoticeManager";

//战斗场景
const {ccclass, property} = cc._decorator;

@ccclass
export default class FightScene extends cc.Component {

    @property(cc.Node)
    qipanNode: cc.Node = null;   //棋盘节点
    @property(cc.Node)
    gridNode: cc.Node = null;   //棋盘网格节点
    @property(cc.Label)
    roundDesc: cc.Label = null;
    @property(cc.Toggle)
    autoToggle: cc.Toggle = null;
    @property(cc.Node)
    toggleNode: cc.Node = null;

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

    myOpenBlocks: Block[] = new Array();   //我方已经开启的卡牌集合
    enemyOpenBlocks: Block[] = new Array();   //敌方已经开启的卡牌集合
    lockBlocks: Block[] = new Array();   //未开启的地块集合

    myDeadCards: CardInfo[] = new Array();   //已经战死的卡牌数据，用于战斗结算显示（战斗后的士兵及杀敌数）

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.ontTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.ontTouchEnd, this);
    }

    onDestroy(){
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start () {
        this.createDefaultCards();
    }

    // update (dt) {}

    onHelpBtn(){
        GameMgr.showLayer(this.pfHelp);
    }

    onResetBtn(){
        this.createDefaultCards();
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
        
        if(FightMgr.fightRoundCount > 0){  //战斗回合数)
            this.handelShiqiChangeByRound();   //处理回合开始士气变化
        }
    }

    /**卡牌初始化 */
    createDefaultCards(){
        this.showRoundDesc();

        this.gridNode.removeAllChildren(true);
        //FightMgr.getAllRandomGenerals();   //获取全部随机武将数据

        let totalCardCount = FightMgr.cardsCol*FightMgr.cardsRow;
        for(let i=0; i<totalCardCount;++i){
            let block = cc.instantiate(this.pfBlock);
            this.gridNode.addChild(block);
            block.getComponent(Block).randCardData(i);   //随机产生卡牌
        }
    }

    /**设置选中的将要移动的卡牌地块 */
    setSelectCard(block: Block){
        this.selectBlock = block;  
        NoticeMgr.emit(NoticeType.SelBlockMove, block);  //准备拖动砖块

        if(this.toggleNode.active == true){
            this.toggleNode.active = false;   //敌方AI选择节点
        }
    }

    onAutoToggle(){
        FightMgr.EnemyAutoAi = !FightMgr.EnemyAutoAi;
        //this.autoToggle.isChecked = FightMgr.EnemyAutoAi;  //敌方自动AI，注意控件会自己处理这个isCheck勾选显示，不用代码调用，否则会递归溢出
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
        NoticeMgr.emit(NoticeType.SelBlockMove, null);  //准备拖动砖块

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
        let blockNodes = this.gridNode.children;
        for(let i=0; i< blockNodes.length; i++){
            let len = blockNodes[i].position.sub(pos).mag();
            if(len <= 100){
                let block = blockNodes[i].getComponent(Block);
                if(block && block.isLock == false){
                    let offX = Math.abs(this.selectBlock.node.x - blockNodes[i].x);
                    let offY = Math.abs(this.selectBlock.node.y - blockNodes[i].y);
                    if(offX < 20 || offY < 20){   //同行或同列
                        let blockLen = blockNodes[i].position.sub(this.selectBlock.node.position).mag();
                        if(block.cardInfo){   //攻击或合并
                            if(this.selectBlock.cardInfo.generalInfo.generalCfg.bingzhong == SoliderType.gongbing){   //弓兵攻击两格
                                if(blockLen <= 400){
                                    return block;
                                }
                            }else{
                                if(blockLen <= 200){
                                    return block;
                                }
                            }
                        }else{  //移动
                            if(this.selectBlock.cardInfo.generalInfo.generalCfg.bingzhong == SoliderType.qibing){   //骑兵移动两格
                                if(blockLen <= 400){
                                    return block;
                                }
                            }else{
                                if(blockLen <= 200){   //只能移动相邻格子
                                    return block;
                                }
                            }
                        }
                    }
                }
                return null;
            }
        }
        return null;
    }

    /**检查是否游戏结束 
     * bCheckOver =true 做游戏检测， bCheckOver = false 返回敌方（包括未开启）卡牌数量
    */
    checkGameOver(bCheckOver:boolean){
        let myCampCount = 0;
        let enemyCampCount = 0;
        
        let blocks = this.gridNode.children;
        for(let i=0; i< blocks.length; i++){
            let block = blocks[i].getComponent(Block);
            if(block){
                if(block.isLock == true){
                    if(bCheckOver == true){
                        return false;
                    }else{
                        return 100;
                    }
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
        //cc.log("checkGameOver(), myCampCount = "+myCampCount+"; enemyCampCount = "+enemyCampCount);

        if(bCheckOver == true){
            if(myCampCount == 0){   //失败
                FightMgr.FightWin = false;  //战斗胜利或失败
                for(let i=0; i<this.myOpenBlocks.length; ++i){
                    this.addMyDeadCard(this.myOpenBlocks[i].cardInfo)
                }
                FightMgr.showLayer(this.pfResult);
                return true;
            }else if(enemyCampCount == 0){   //胜利
                FightMgr.FightWin = true;  //战斗胜利或失败
                for(let i=0; i<this.myOpenBlocks.length; ++i){
                    this.addMyDeadCard(this.myOpenBlocks[i].cardInfo)
                }
                FightMgr.showLayer(this.pfResult);
                return true;
            }
            return false;
        }else{
            return enemyCampCount;
        }
    }

    /**设置地块开启或锁定 */
    setLockBlock(bLock:boolean, block: Block){
        if(bLock == true){
            this.lockBlocks.push(block);   //未开启的地块集合
        }else{
            for(let i=0; i<this.lockBlocks.length; ++i){
                if(this.lockBlocks[i].blockId == block.blockId){
                    this.lockBlocks.splice(i, 1);
                    break;
                }
            }
            
            if(block.cardInfo.campId == FightMgr.myCampId){
                this.setMyOpenBlock(true, block);  //设置我方已经开启的卡牌
            }else{
                this.setEnemyOpenBlock(true, block);   //设置敌方已经开启的卡牌
            }
        }
    }

    /**设置我方已经开启的卡牌 */
    setMyOpenBlock(bAdd:boolean, block: Block){
        if(bAdd == true){
            this.myOpenBlocks.push(block);  //我方已经开启的卡牌集合
        }else{
            for(let i=0; i<this.myOpenBlocks.length; ++i){
                if(this.myOpenBlocks[i].blockId == block.blockId){
                    this.myOpenBlocks.splice(i, 1);
                    return;
                }
            }
        }
    }

    /**添加我方武将战死数据 */
    addMyDeadCard(info: CardInfo){
        this.myDeadCards.push(info);  //已经战死的卡牌数据，用于战斗结算显示（战斗后的士兵及杀敌数）
    }

    /**设置敌方已经开启的卡牌 */
    setEnemyOpenBlock(bAdd:boolean, block: Block){
        if(bAdd == true){
            this.enemyOpenBlocks.push(block);  //敌方已经开启的卡牌集合
        }else{
            for(let i=0; i<this.enemyOpenBlocks.length; ++i){
                if(this.enemyOpenBlocks[i].blockId == block.blockId){
                    this.enemyOpenBlocks.splice(i, 1);
                    return;
                }
            }
        }
    }

    //处理回合开始士气变化
    handelShiqiChangeByRound(){
        let checkBlocks = null;
        if(FightMgr.bMyRound){
            checkBlocks = this.enemyOpenBlocks;
        }else{
            checkBlocks = this.myOpenBlocks;
        }

        for(let i=0; i<checkBlocks.length; ++i){
            let block = checkBlocks[i];
            let nearArr = this.getNearEnemyBlock(block);   //获得相邻敌对地块数据
            if(nearArr.length > 2){
                block.handleShiqiChange(-nearArr.length);
            }else if(nearArr.length == 2){
                if(Math.abs(nearArr[0].node.x - nearArr[1].node.x) < 10 || Math.abs(nearArr[0].node.y - nearArr[1].node.y) < 10){   //被前后夹击
                    block.handleShiqiChange(-2);
                }
            }
        }
    }
    
    //当敌对方武将死亡时的士气变动
    handelShiqiChangeByDead(bMyCampDead:boolean, winBlock: Block){
        let checkBlocks = null;
        if(bMyCampDead == true){   //我方阵营死亡
            checkBlocks = this.enemyOpenBlocks;
        }else{
            checkBlocks = this.myOpenBlocks;
        }

        for(let i=0; i<checkBlocks.length; ++i){
            let block = checkBlocks[i];
            if(block.blockId == winBlock.blockId){  //击杀获胜的一方
                block.handleShiqiChange(3);
            }else{
                block.handleShiqiChange(1);
            }
        }
    }

    /**敌方回合处理 */
    handleEnemyRoundOpt(){
        cc.log("handleEnemyRoundOpt(), 敌方自动AI FightMgr.EnemyAutoAi = "+FightMgr.EnemyAutoAi);
        if(FightMgr.EnemyAutoAi == false){   //敌方自动AI
            return;
        }
        this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function(){
            //1、预判所有敌方单位是否收到我方严重威胁，并找出受威胁最严重的一个敌方单位；
            // 同时，找出敌方可击杀我方的敌方单位。判定逃跑或击杀权重从而选择操作。
            let runAwayEnemy = null;    //敌方预逃走的单位
            let runAwayWeight = 0;   //逃走权重
            let hitEnemy = null;   //敌方预击杀的单位
            let hitMy = null;    //我方预被击杀的单位
            let hitWeight = 0;   //击杀权重
            cc.log("1、预判所有敌方单位是否收到我方严重威胁，并找出受威胁最严重的一个敌方单位；同时，找出敌方可击杀我方的敌方单位。判定逃跑或击杀权重从而选择操作。");
            cc.log("敌方开启的卡牌数量 "+this.enemyOpenBlocks.length+"; 我方开启的卡牌数量 "+this.myOpenBlocks.length);
            for(let i=0; i<this.enemyOpenBlocks.length; ++i){
                let enemyBlock = this.enemyOpenBlocks[i];

                for(let j=0; j<this.myOpenBlocks.length; ++j){
                    let myBlock = this.myOpenBlocks[j];

                    let offX = Math.abs(enemyBlock.node.x - myBlock.node.x);
                    let offY = Math.abs(enemyBlock.node.y - myBlock.node.y);
                    if(offX < 20 || offY < 20){   //同行或同列
                        let blockLen = enemyBlock.node.position.sub(myBlock.node.position).mag();
                        let enemyCardCfg = enemyBlock.cardInfo.generalInfo.generalCfg;
                        if(blockLen <= 200 || (enemyCardCfg.bingzhong == SoliderType.gongbing && blockLen <= 400)){   //弓兵攻击两格
                            let enemyNum = enemyCardCfg.atk + enemyCardCfg.def + enemyCardCfg.hp;

                            let myCardCfg = myBlock.cardInfo.generalInfo.generalCfg;
                            let myNum = myCardCfg.atk + myCardCfg.def + myCardCfg.hp;
        
                            let hartScale = enemyNum/myNum;
                            if(hartScale >= 2.0){  //取胜概率极高
                                if(hartScale > hitWeight){
                                    hitWeight = hartScale;
                                    hitEnemy = enemyBlock;
                                    hitMy = myBlock;
                                }
                                runAwayWeight = 0;
                            }else if(hartScale > 1.0){   //可能会取胜
                                if(hartScale > hitWeight){
                                    hitWeight = hartScale;
                                    hitEnemy = enemyBlock;
                                    hitMy = myBlock;
                                    if(enemyCardCfg.bingzhong == SoliderType.gongbing && blockLen > 200){  //弓兵远距离权重增加
                                        hitWeight += 0.5;
                                    }
                                }
                            }
                            else{   //可能战斗失败
                                if(hartScale > 0.5){  //可能战斗失败
                                    if(runAwayWeight < 0.5){
                                        runAwayWeight = 0.5;
                                        runAwayEnemy = enemyBlock;
                                    }
                                }else if(hartScale > 0){
                                    if(runAwayWeight < 0.3){
                                        runAwayWeight = 0.3;
                                        runAwayEnemy = enemyBlock;
                                    }
                                }
                                else{  //要死了赶快逃
                                    runAwayWeight = 1.0;
                                    runAwayEnemy = enemyBlock;
                                }
        
                                if(hitWeight == 0){  //为最后被迫战斗赋值
                                    hitEnemy = enemyBlock;
                                    hitMy = myBlock;
                                }
                            }
                        }
                    }
                }
            }

            if(runAwayWeight == 1.0){   //有单位要死
                if(hitWeight >= 2.0){  //必杀有希望
                    cc.log("敌方选择战斗，必杀有希望");
                    hitMy.onCardDropBlock(hitEnemy);
                    return;
                }else{
                    let nearArr = this.getNearEmptyBlock(runAwayEnemy);   //获得相邻空地块数据
                    if(nearArr.length > 0){
                        cc.log("敌方选择逃走，敌方要死");
                        let randIdx = Math.floor(Math.random()*nearArr.length*0.99);
                        nearArr[randIdx].onCardDropBlock(runAwayEnemy);
                        return;
                    }else{  //无路可逃
                        if(hitWeight > 1.3){  //可以搏一搏
                            cc.log("敌方必死单位无路可逃，敌方有单位可以搏一搏");
                            hitMy.onCardDropBlock(hitEnemy);
                            return;
                        }
                    }
                }
            }else{  //没有必死的敌方单位
                if(hitWeight >= 1.5){  //必杀有希望
                    cc.log("敌方选择战斗，攻击可能赢");
                    hitMy.onCardDropBlock(hitEnemy);
                    return;
                }if(hitWeight >= 1.0 && Math.random() > (1.9 - hitWeight)){  //搏一搏
                    cc.log("敌方选择战斗，搏一搏, 可能赢");
                    hitMy.onCardDropBlock(hitEnemy);
                    return;
                }else{
                    if(runAwayWeight >= 0.5){   //有敌方卡牌可能会死
                        if(Math.random() >= 0.5){
                            let nearArr = this.getNearEmptyBlock(runAwayEnemy);   //获得相邻空地块数据
                            if(nearArr.length > 0){
                                cc.log("敌方选择逃走，可能会死随机逃跑");
                                let randIdx = Math.floor(Math.random()*nearArr.length*0.99);
                                nearArr[randIdx].onCardDropBlock(runAwayEnemy);
                                return;
                            }else{  //无路可逃
                                if(hitWeight >= 0.5){   //敌方开启卡牌数量比我方多
                                    if(this.enemyOpenBlocks.length >= this.myOpenBlocks.length+2){
                                        cc.log("敌方选择战斗，敌方开启卡牌多");
                                        hitMy.onCardDropBlock(hitEnemy);
                                        return;
                                    }else if(Math.random() > 0.8){
                                        cc.log("敌方随机选择战斗");
                                        hitMy.onCardDropBlock(hitEnemy);
                                        return;
                                    }
                                }
                            }
                        }
                    }else{
                        if(hitWeight >= 0.5){   //敌方开启卡牌数量比我方多
                            if(this.enemyOpenBlocks.length >= this.myOpenBlocks.length+2){
                                cc.log("敌方选择战斗，敌方开启卡牌多");
                                hitMy.onCardDropBlock(hitEnemy);
                                return;
                            }else if(Math.random() > 0.8){
                                cc.log("敌方随机选择战斗");
                                hitMy.onCardDropBlock(hitEnemy);
                                return;
                            }
                        }
                    }
                }
            }

            // //2、敌方未战斗未逃走，随机武将合成（合成可以增加血量）
            // let heWeight = 0;  //合成权重
            // let heEnemy = null;   //预合成的敌方
            // let heNear = null;  //预合成的另一方
            // for(let i=0; i<this.enemyOpenBlocks.length; ++i){
            //     let enemyBlock = this.enemyOpenBlocks[i];
            //     if(enemyBlock.cardInfo.generalInfo.generalId >= 1000){   //武将
            //         if(enemyBlock.cardInfo.generalInfo.bingCount <= 500 || enemyBlock.cardInfo.generalInfo.hp <= 500){   //当武将兵力不足或血量不足时才合成
            //             let nearArr = this.getNearBlock(enemyBlock);   //获得相邻地块数据
            //             for(let j=0; j<nearArr.length; ++j){
            //                 let nearBlock = nearArr[j];
            //                 if(nearBlock && nearBlock.cardInfo){
            //                     if(nearBlock.cardInfo && nearBlock.cardInfo.campId != FightMgr.myCampId){
            //                         if(enemyBlock.cardInfo.generalInfo.hp <= 300){  //血量不足，需要合成
            //                             if(nearBlock.cardInfo.generalInfo.hp >= 300){   //对方血量充足
            //                                 let tempWeight = 1.0 + (nearBlock.cardInfo.generalInfo.hp - 300)/1000;
            //                                 if(heWeight < tempWeight){
            //                                     heWeight = tempWeight;
            //                                     heEnemy = enemyBlock;
            //                                     heNear = nearBlock;
            //                                 }
            //                             }else{
            //                                 if(heWeight < 0.5){
            //                                     heWeight = 0.5;
            //                                     heEnemy = enemyBlock;
            //                                     heNear = nearBlock;
            //                                 }
            //                             }
            //                         }else if(enemyBlock.cardInfo.generalInfo.hp <= 700){
            //                             if(heWeight < 0.3){
            //                                 heWeight = 0.3;
            //                                 heEnemy = enemyBlock;
            //                                 heNear = nearBlock;
            //                             }
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }

            // if(heWeight >= 1.0){
            //     cc.log("敌方选择合成, 血量不足");
            //     heNear.onCardDropBlock(heEnemy);
            //     return;
            // }else if(heWeight >= 0.3){
            //     if(Math.random() >= 1.0-heWeight){
            //         cc.log("敌方选择合成, 血量一般");
            //         heNear.onCardDropBlock(heEnemy);
            //         return;
            //     }
            // }else{  //不需要合成

            // }

            // //3、敌方单位未选择战斗，也未选择逃跑，未合成。随机翻牌
            // if(this.lockBlocks.length > 0){
            //     if(this.enemyOpenBlocks.length >= this.myOpenBlocks.length){   //敌方卡牌多
            //         if(Math.random() >= 0.5){
            //             cc.log("敌方选择随机翻牌");
            //             let randIdx = Math.floor(Math.random()*this.lockBlocks.length*0.99);
            //             this.lockBlocks[randIdx].handleOpenBlockCard();
            //             return;
            //         }
            //     }else{
            //         cc.log("敌方选择翻牌");
            //         let randIdx = Math.floor(Math.random()*this.lockBlocks.length*0.99);
            //         this.lockBlocks[randIdx].handleOpenBlockCard();
            //         return;
            //     }
            // }

            //4、敌方未战斗未逃走未翻牌未合成，移动一格
            let randIdx = Math.floor(Math.random()*this.enemyOpenBlocks.length*0.99);
            let enemyBlock = this.enemyOpenBlocks[randIdx];

            let nearArr = this.getNearEmptyBlock(enemyBlock);   //获得相邻空地块数据
            if(nearArr.length > 0){
                cc.log("敌方选择移动一格");
                let randIdx = Math.floor(Math.random()*nearArr.length*0.99);
                nearArr[randIdx].onCardDropBlock(enemyBlock);
                return;
            }else{  //无路可逃
                for(let i=0; i<this.enemyOpenBlocks.length; ++i){
                    let enemyBlock = this.enemyOpenBlocks[i];
                    let nearArr = this.getNearEmptyBlock(enemyBlock);   //获得相邻空地块数据
                    if(nearArr.length > 0){
                        cc.log("敌方选择移动一格");
                        let randIdx = Math.floor(Math.random()*nearArr.length*0.99);
                        nearArr[randIdx].onCardDropBlock(enemyBlock);
                        return;
                    }else{  //无路可逃
                    }
                }
            }

            //5、敌方未进行任何操作，也无路可逃，强迫战斗
            if(hitEnemy && hitMy){
                cc.log("强迫战斗");
                hitMy.onCardDropBlock(hitEnemy);
                return;
            }else{
                for(let i=0; i<this.enemyOpenBlocks.length; ++i){
                    let enemyBlock = this.enemyOpenBlocks[i];
                    let nearArr = this.getNearEnemyBlock(enemyBlock);   //获得相邻敌对地块数据
                    if(nearArr.length > 0){
                        cc.log("强迫操作");
                        let randIdx = Math.floor(Math.random()*nearArr.length*0.99);
                        nearArr[randIdx].onCardDropBlock(enemyBlock);
                        return;
                    }else{  //无路可逃
                    }
                }
            }

            //6 异常
            cc.warn("敌方AI异常 没有任何操作!");

        }.bind(this))));
    }

    /**获得相邻空地块数据 */
    getNearEmptyBlock(srcBlock: Block){
        let nearArr = new Array();
        if(srcBlock && srcBlock.cardInfo){
            let pos = srcBlock.node.position;
            let blockNodes = this.gridNode.children;
            for(let i=0; i< blockNodes.length; i++){
                let len = blockNodes[i].position.sub(pos).mag();
                if(len <= 200 && len > 50){
                    let block = blockNodes[i].getComponent(Block);
                    if(block && block.isLock == false && block.cardInfo == null){
                        nearArr.push(block);
                    }
                }
            }
        }
        return nearArr;
    }

    //获取相邻的敌方砖块
    getNearEnemyBlock(srcBlock: Block){
        let nearArr = new Array();
        if(srcBlock && srcBlock.cardInfo){
            let pos = srcBlock.node.position;
            let blockNodes = this.gridNode.children;
            for(let i=0; i< blockNodes.length; i++){
                let len = blockNodes[i].position.sub(pos).mag();
                if(len <= 200 && len > 50){
                    let block = blockNodes[i].getComponent(Block);
                    if(block && block.isLock == false && block.cardInfo && block.cardInfo.campId != srcBlock.cardInfo.campId){
                        nearArr.push(block);
                    }
                }
            }
        }
        return nearArr;
    }

    /**获得相邻地块数据 */
    getNearBlock(srcBlock: Block){
        let nearArr = new Array();
        if(srcBlock && srcBlock.cardInfo){
            let pos = srcBlock.node.position;
            let blocknodes = this.gridNode.children;
            for(let i=0; i< blocknodes.length; i++){
                let len = blocknodes[i].position.sub(pos).mag();
                if(len <= 200 && len > 50){
                    let block = blocknodes[i].getComponent(Block);
                    if(block && block.isLock == false){
                        nearArr.push(block);
                    }
                }
            }
        }
        return nearArr;
    }

}
