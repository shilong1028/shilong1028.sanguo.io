import { ROOT_NODE } from "../login/rootNode";
import { BlockBuildType, BlockRelation, BlockType, CardInfo, CardState, CardType, GameOverState, ShiqiEvent, SoliderType } from "../manager/Enum";
import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import { NoticeMgr, NoticeType } from "../manager/NoticeManager";
import Card from "./card";


//棋盘格子对象
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Fight/block")
@executionOrder(-10)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class Block extends cc.Component {

    @property(cc.Label)
    idLbl: cc.Label = null;
    @property(cc.Sprite)
    blockSpr: cc.Sprite = null;  //地块纹理
    @property(cc.Node)
    buildNode: cc.Node = null;  //建筑
    @property(cc.Node)
    headNode: cc.Node = null;
    @property(cc.Node)
    boundNode: cc.Node = null;   //攻击或路径范围
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
    @property(cc.SpriteAtlas)
    confusionAtlas: cc.SpriteAtlas = null;  //部曲混乱特效

    blockId: number = 0;   //地块ID
    blockRow: number = 0;   //地块行 Row 列 Column
    blockColumn: number = 0;   //地块行 Row 列 Column
    blockType: BlockType = BlockType.Mid;   //地块类型， 0中间地带，1我方范围，2敌方范围
    buildType: BlockBuildType = BlockBuildType.None;   //建筑类型  0无，1营寨，2箭楼, 3粮仓

    cardNode: cc.Node = null;
    cardInfo: CardInfo = null;   //注意，地块的cardInfo和卡牌的cardInfo是公用一块内存的。

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

        NoticeMgr.on(NoticeType.SelBlockMove, this.handleSelBlockMove, this);  //准备拖动砖块
        NoticeMgr.on(NoticeType.PerNextRound, this.handlePerNextRound, this);  //通知地块准备下一个回合
        NoticeMgr.on(NoticeType.UpdateShiqiNotice, this.handleUpdateShiqiNotice, this);  //士气改变通知

        this.idLbl.node.active = true;   //地块编号

        this.boundNode.active = false;  //攻击或路径范围
        // this.runBg.active = false;    //路径范围显示图片
        // this.atkBg.active = false;   //攻击范围显示图片
    }

    onDestroy(){
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start () {
    }

    // update (dt) {}

    /**随机卡牌数据 */
    initBlockData(blockId: number){
        this.blockId = blockId;   //地块ID
        this.idLbl.string = blockId.toString();
        this.blockRow = Math.floor(blockId/FightMgr.cardsCol);   //地块行(横向) Row  列（纵向） Column
        this.blockColumn = blockId%FightMgr.cardsCol;   //地块行 Row 列 Column
        this.blockType = BlockType.Mid;   //地块类型， 0中间地带，1我方范围，2敌方范围
        if(this.blockRow <= 1){
            this.blockType = BlockType.Enemy
        }else if(this.blockRow >= FightMgr.cardsRow-2){
            this.blockType = BlockType.Myself
        }

        this.buildNode.active = false;  //建筑
        this.buildType = BlockBuildType.None;   //建筑类型  0无，1营寨，2箭楼, 3粮仓
        if(blockId == 2 || blockId == 32){   //营寨
            this.buildType = BlockBuildType.Barracks
            this.buildNode.active = true;  //建筑
        }else if(blockId == 0 || blockId == 34){  //粮仓
            this.buildType = BlockBuildType.Granary
            this.buildNode.active = true;  //建筑
        }else if(blockId == 9 || blockId == 11){  //敌方箭楼
            this.buildType = BlockBuildType.Watchtower
            this.blockType = BlockType.Enemy
            this.buildNode.active = true;  //建筑
        }else if(blockId == 23 || blockId == 25){   //我方箭楼
            this.buildType = BlockBuildType.Watchtower
            this.blockType = BlockType.Myself
            this.buildNode.active = true;  //建筑
        }
        this.onRemoveCardNode();

        FightMgr.addBlockToBound(this, this.blockType);   //设置敌我中间砖块范围数组
    }
    /**重置砖块显示 */
    resetBlockShow(){
        this.buildNode.active = false;  //建筑
        if(this.buildType != BlockBuildType.None){
            this.buildNode.active = true;  //建筑
        }
        this.onRemoveCardNode();
    }

    /**显示地块上卡牌 */
    showBlockCard(info: CardInfo){
        cc.log("showBlockCard(), this.blockId = "+this.blockId+"; info = "+JSON.stringify(info));
        if(info){
            this.cardInfo = info;

            if(this.cardNode == null){
                let cardNode = cc.instantiate(FightMgr.getFightScene().pfCard);
                this.headNode.addChild(cardNode);
                this.cardNode = cardNode;
            }
            this.cardNode.getComponent(Card).initCardData(info);
        }
    }

    onTouchStart(event: cc.Event.EventTouch) {
        if(FightMgr.bMyRound == true && FightMgr.bStopTouch == false){  //是否停止触摸反应
            if(this.cardInfo && this.cardInfo.campId == FightMgr.myCampId){
                this.handleTouchSelCard();   //处理选中并拖动
            }
        }else if(FightMgr.bMyRound == false && FightMgr.EnemyAutoAi == false ){ //敌方自动AI关闭
            if(this.cardInfo && this.cardInfo.campId != FightMgr.myCampId){
                this.handleTouchSelCard();   //处理选中并拖动
            }
        }
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

    /**准备拖动砖块,显示周边移动和攻击范围 selBlock=null则取消显示范围*/
    handleSelBlockMove(selBlock: Block){
        this.boundNode.active = false;   //攻击或路径范围
        this.runBg.active = false;    //路径范围显示图片
        this.atkBg.active = false;   //攻击范围显示图片

        if(selBlock && selBlock.cardInfo && selBlock.blockId != this.blockId){
            let bAttack:boolean = false;
            let bReach:boolean = false;
            let relation_ai = FightMgr.checkBlocksRelation_AI(selBlock, this);  //检测两个砖块之间的AI战斗联系 block_src为检测源，block_tar为周边砖块
            if(relation_ai == BlockRelation.ReachAndAtk){  //3可移动可攻击
                bAttack = true;
                bReach = true;
            }else if(relation_ai == BlockRelation.Attack){  //2攻击范围内
                bAttack = true;
            }else if(relation_ai == BlockRelation.Reach){  //1可移动范围内
                bReach = true;
            }

            if(bAttack && this.cardInfo && this.cardInfo.campId != selBlock.cardInfo.campId){   //敌对阵营
                this.boundNode.active = true;   //攻击或路径范围
                this.atkBg.active = true;   //攻击范围显示图片
            }
            if(bReach){
                if(this.cardInfo == null){  //空砖块
                    this.boundNode.active = true;   //攻击或路径范围
                    this.runBg.active = true;    //路径范围显示图片
                }else if(this.cardInfo.campId == selBlock.cardInfo.campId){  //主将可以和我方临近部曲交换位置
                    let abs_Row = Math.abs(selBlock.blockRow - this.blockRow);
                    let abs_Col = Math.abs(selBlock.blockColumn - this.blockColumn);
                    if(abs_Row == 1 || abs_Col == 1){
                        this.boundNode.active = true;   //攻击或路径范围
                        this.runBg.active = true;    //路径范围显示图片
                    }
                }
            }
        }
    } 

    /**将一个地块上的卡牌移动到本空地块上，或复原砖块显示 */
    onCardMoveBlock(optBlock: Block){
        cc.log("onCardMoveBlock(), this.blockId = "+this.blockId+"; optBlock.blockId = "+optBlock.blockId);
        if(optBlock.blockId == this.blockId){  //复原砖块显示
            cc.log("复原砖块")
            this.cardNode.opacity = 255;   //自己的卡牌又移动回来或者没有位置放置复原了
            return;
        }

        if(this.cardInfo){   //本砖块有人
            cc.log("砖块有人，不能移动")
            optBlock.onCardMoveBlock(optBlock);   //复原砖块
            return;
        }else{  //空砖块
            this.showBlockCard(optBlock.cardInfo);  //设置地块上的卡牌模型
            optBlock.onRemoveCardNode();   //将本地块上的卡牌移走了

            if(this.buildNode.active){
                if(this.blockType == BlockType.Myself && this.cardInfo.campId != FightMgr.myCampId){   //地块类型， 0中间地带，1我方范围，2敌方范围
                    this.checkBlockBuildState();  //检测建筑(1营寨，2箭楼, 3粮仓)是否被攻占
                }else if(this.blockType == BlockType.Enemy && this.cardInfo.campId == FightMgr.myCampId){
                    this.checkBlockBuildState();  //检测建筑(1营寨，2箭楼, 3粮仓)是否被攻占
                }
            }

            FightMgr.nextRoundOpt();  //下回合处理
        }
    }

    /**主将可以和我方临近部曲交换位置 */
    onCardSwapBlock(optBlock: Block){
        cc.log("onCardSwapBlock(), this.blockId = "+this.blockId+"; optBlock.blockId = "+optBlock.blockId);
        if(optBlock.blockId == this.blockId){  //复原砖块显示
            cc.log("异常，自交换")
            this.cardNode.opacity = 255;   //自己的卡牌又移动回来或者没有位置放置复原了
            return;
        }

        if(this.cardInfo && this.cardInfo.campId == optBlock.cardInfo.campId){  //主将可以和己方临近部曲交换位置
            if(optBlock.cardInfo.type == CardType.Chief){  //类型，0普通，1主将，2前锋，3后卫
                let tempCardInfo = this.cardInfo.clone();
                this.showBlockCard(optBlock.cardInfo);  //设置地块上的卡牌模型
                optBlock.showBlockCard(tempCardInfo); 
                FightMgr.nextRoundOpt();  //下回合处理
            }else{
                cc.log("非主将不可交换")
                optBlock.onCardMoveBlock(optBlock);   //复原砖块
            }
        }else{
            cc.log("交换异常")
            optBlock.onCardMoveBlock(optBlock);   //复原砖块
        }
    }

    /**参数地块上的卡牌攻击本地块上卡牌，根据结果需要同步卡牌数据 */
    onCardAttackBlock(optBlock: Block){
        cc.log("onCardAttackBlock(), this.blockId = "+this.blockId+"; optBlock.blockId = "+optBlock.blockId);
        if(optBlock.blockId == this.blockId){
            cc.log("异常，自攻击")
            this.cardNode.opacity = 255;   //自己的卡牌又移动回来或者没有位置放置复原了
            return;
        }

        if(this.cardInfo && optBlock.cardInfo){
            if(this.cardInfo.campId == optBlock.cardInfo.campId){   //同阵营
                cc.log("异常，同阵营攻击")
            }else{    //战斗
                optBlock.handleUpdateShiqiByAtk();  //因攻击而改变士气 
                FightMgr.showFightDetailLayer(optBlock, this, (atkCardInfo:CardInfo, defCardInfo:CardInfo)=>{
                    cc.log("战斗结束")
                    optBlock.handleBlockCardFightResult(atkCardInfo);  //处理攻击方战斗后的卡牌数据
                    this.handleBlockCardFightResult(defCardInfo);  //处理防守方战斗后的卡牌数据
                    if(optBlock.cardInfo){  //攻击方还活着
                        if(this.cardInfo){  //防守方也活着
                            optBlock.onCardMoveBlock(optBlock);   //复原砖块
                        }else{  //防守方消亡了
                            optBlock.handleUpdateShiqiByKillOther(true);   //因击溃对方部曲而改变士气 
                            this.showBlockCard(optBlock.cardInfo);  //设置地块上的卡牌模型
                            //已经在handleBlockCardFightResult处理了消亡
                        }
                    }else{  //攻击方消亡了
                        if(this.cardInfo){  //防守方活着
                            this.handleUpdateShiqiByKillOther(false);   //因击溃对方部曲而改变士气 
                        }
                    }

                    FightMgr.nextRoundOpt();  //下回合处理
                });
            }
        }else{ 
            cc.log("异常，一方没有卡牌")
        }
    }

    /**处理战斗后的卡牌数据 */
    handleBlockCardFightResult(result_cardInfo: CardInfo){
        cc.log("handleBlockCardFightResult(), this.blockId = "+this.blockId+"; result_cardInfo = "+JSON.stringify(result_cardInfo));
        if(this.cardInfo && result_cardInfo){
            if(result_cardInfo && result_cardInfo.generalInfo){
                if(result_cardInfo.generalInfo.fightHp <= 0){  //阵亡(武将血量<0)
                    result_cardInfo.state = CardState.Dead
                }else if(result_cardInfo.generalInfo.bingCount < 100){  //逃逸(部曲士兵数量过少<100)
                    result_cardInfo.state = CardState.Flee
                }else if(result_cardInfo.shiqi < 10){  //混乱(部曲士气过低<10)
                    result_cardInfo.state = CardState.Confusion
                }
            }

            this.cardInfo = result_cardInfo;
            FightMgr.handleUpdateBlockCardInfo(this.cardInfo);   //更新同步卡牌数据（战斗士气变动）

            if(result_cardInfo.state == CardState.Confusion){
                ROOT_NODE.showTipsText("部曲士气过低，处于混乱状态，不听调令")
                GameMgr.createAtlasAniNode(this.confusionAtlas, 18, cc.WrapMode.Loop, this.effNode);
            }else if(result_cardInfo.state == CardState.Dead || result_cardInfo.state == CardState.Flee || result_cardInfo.state == CardState.Prisoner){  //阵亡，逃逸，被俘
                if(result_cardInfo.type == CardType.Chief){  //类型，0普通，1主将，2前锋，3后卫
                    if(result_cardInfo.campId == FightMgr.myCampId){  //阵营，0默认，1蓝方(我方），2红方
                        ROOT_NODE.showTipsText("我方主将阵亡")
                        NoticeMgr.emit(NoticeType.GameOverNotice, GameOverState.MyChiefDead);  //游戏结束通知
                    }else{
                        ROOT_NODE.showTipsText("敌方主将阵亡")
                        NoticeMgr.emit(NoticeType.GameOverNotice, GameOverState.EnemyChiefDead);
                    }
                }else{
                    this.checkBlockBuildState();  //检测建筑(1营寨，2箭楼, 3粮仓)是否被攻占
                } 
                this.onDeadRemoveCardNode();   //战斗消亡，需要同步卡牌数据
            }
        }
    }

    /**战斗消亡，需要同步卡牌数据 */
    onDeadRemoveCardNode(){
        cc.log("onDeadRemoveCardNode(), this.blockId = "+this.blockId);
        if(this.cardInfo){
            let deadCampId = this.cardInfo.campId;
            this.onRemoveCardNode();
            //FightMgr.checkGameOverByDead(deadCampId);  //因部曲（阵亡，逃逸，被俘） 检查是否游戏结束 
        }
    }

    /**将本地块上的卡牌移走了，只是移动不同步卡牌数据 */
    onRemoveCardNode(){
        if(this.cardNode){
            cc.log("onRemoveCardNode(), this.blockId = "+this.blockId);
            this.cardNode.destroy();
        }
        this.cardInfo = null;
    }

    /**检测建筑(1营寨，2箭楼, 3粮仓)是否被攻占 */
    checkBlockBuildState(){
        if(this.blockType == BlockType.Myself){   //地块类型， 0中间地带，1我方范围，2敌方范围
             if(this.buildType == BlockBuildType.Barracks){   //建筑类型  0无，1营寨，2箭楼, 3粮仓
                ROOT_NODE.showTipsText("我方本阵大营陷落")
                //this.buildNode.active = false;  //建筑
                NoticeMgr.emit(NoticeType.GameOverNotice, GameOverState.MyBarracksLose);  //游戏结束通知
            }else if(this.buildNode.active){
                if(this.buildType == BlockBuildType.Watchtower){  //箭楼
                    ROOT_NODE.showTipsText("我方箭楼陷落")
                    this.buildNode.active = false;  //建筑
                    NoticeMgr.emit(NoticeType.UpdateShiqiNotice, ShiqiEvent.MyWatchtowerLose);
                }else if(this.buildType == BlockBuildType.Granary){  //粮仓
                    ROOT_NODE.showTipsText("我方粮仓陷落")
                    this.buildNode.active = false;  //建筑
                    NoticeMgr.emit(NoticeType.UpdateShiqiNotice, ShiqiEvent.MyGranaryLose);
                }
            }
        }else if(this.blockType == BlockType.Enemy){
            if(this.buildType == BlockBuildType.Barracks){   //建筑类型  0无，1营寨，2箭楼, 3粮仓
                ROOT_NODE.showTipsText("敌方本阵大营陷落")
                //this.buildNode.active = false;  //建筑
                NoticeMgr.emit(NoticeType.GameOverNotice, GameOverState.EnemyBarracksLose);
            }else if(this.buildNode.active){
                if(this.buildType == BlockBuildType.Watchtower){  //箭楼
                    ROOT_NODE.showTipsText("敌方箭楼陷落")
                    this.buildNode.active = false;  //建筑
                    NoticeMgr.emit(NoticeType.UpdateShiqiNotice, ShiqiEvent.EnemyWatchtowerLose);
                }else if(this.buildType == BlockBuildType.Granary){  //粮仓
                    ROOT_NODE.showTipsText("敌方粮仓陷落")
                    this.buildNode.active = false;  //建筑
                    NoticeMgr.emit(NoticeType.UpdateShiqiNotice, ShiqiEvent.EnemyGranaryLose);
                }
            }
        }
    }

    /**是否驻守卡牌地块 */
    isGarrisonBlock(){
        if(this.cardInfo && this.buildNode.active){
            // if(this.buildType == BlockBuildType.Barracks){   //建筑类型  0无，1营寨，2箭楼, 3粮仓
            // }else if(this.buildType == BlockBuildType.Watchtower){  //箭楼
            // }else if(this.buildType == BlockBuildType.Granary){  //粮仓
            // }
            return this.buildType;
        } 
        return 0;
    }

    /**检测当前砖块对目标卡牌的建筑关系 1空砖块 3对方空建筑 4我方空建筑 */
    checkBuildRelationByCard(tarCard: CardInfo){
        if(this.cardInfo == null && this.buildNode.active){
            if(this.blockType == tarCard.campId){   //地块类型， 0中间地带，1我方范围，2敌方范围
                return 4;    //4己方空建筑
            }else{
                return 3;   //3对方空建筑
            }
        }
        return 1;  //1空砖块
    }

    /**士气改变通知 */
    handleUpdateShiqiNotice(state: ShiqiEvent){
        if(this.cardInfo == null){
            return;
        }
        if(state == ShiqiEvent.Round){  //1回合结束
            if(this.cardInfo.bingzhong != SoliderType.qiangbing){ //枪兵攻击+1士气，回合-0士气；
                this.changeCardShiqi(-1, false)
            }
        }else{
            //箭楼被攻陷，对方整体+5士气；粮仓被攻陷，己方整体-10士气
            if(state == ShiqiEvent.MyWatchtowerLose){  //2我方箭楼被攻陷
                if(this.cardInfo.campId != FightMgr.myCampId){
                    this.changeCardShiqi(5)
                }
            }else if(state == ShiqiEvent.MyGranaryLose){  //3我方粮仓被攻陷
                if(this.cardInfo.campId == FightMgr.myCampId){
                    this.changeCardShiqi(-10)
                }
            }else if(state == ShiqiEvent.EnemyWatchtowerLose){  //4敌方箭楼被攻陷
                if(this.cardInfo.campId == FightMgr.myCampId){
                    this.changeCardShiqi(5)
                }
            }else if(state == ShiqiEvent.EnemyGranaryLose){  //5敌方粮仓被攻陷
                if(this.cardInfo.campId != FightMgr.myCampId){
                    this.changeCardShiqi(-10)
                }
            }
        }
    }
    /**因攻击而改变士气 */
    handleUpdateShiqiByAtk(){
        if(this.cardInfo == null){
            return;
        }
        if(this.cardInfo.bingzhong == SoliderType.qibing){ //骑兵攻击+2士气，回合-1士气；
            this.changeCardShiqi(2, false)
        }else{
            this.changeCardShiqi(1, false)
        }
    }
    /**因击溃对方部曲而改变士气 */
    handleUpdateShiqiByKillOther(bAtk:boolean){
        if(this.cardInfo == null){
            return;
        }
        if(bAtk){
            this.changeCardShiqi(10, true)    //主动攻击摧毁对方部曲，+10士气
        }else{
            this.changeCardShiqi(5, true)    //被动防御，摧毁对方部曲，+5士气
        }
    }
    //士气变动
    changeCardShiqi(val: number, bShowAni:boolean = true){
        if(this.cardInfo){
            let oldShiqi = this.cardInfo.shiqi;
            this.cardInfo.shiqi += val;
            if(this.cardInfo.shiqi < 0){
                this.cardInfo.shiqi = 0;
            }
            if(this.cardNode){
                this.cardNode.getComponent(Card).updateCardShiqi();   //更新士气值
            }

            if(bShowAni){
                if(val > 0){
                    GameMgr.createAtlasAniNode(this.qiupAtlas, 18, cc.WrapMode.Default, this.effNode);
                }else if(val < 0){
                    GameMgr.createAtlasAniNode(this.qidownAtlas, 18, cc.WrapMode.Default, this.effNode);
                }
            }

            if(oldShiqi > 0 && this.cardInfo.shiqi < 10){  //混乱(部曲士气过低<10)
                this.cardInfo.state = CardState.Confusion
                ROOT_NODE.showTipsText("部曲士气过低，处于混乱状态，不听调令")
                let confusion_ani = this.effNode.getChildByName("confusion_ani");
                if(!confusion_ani){
                    GameMgr.createAtlasAniNode(this.confusionAtlas, 18, cc.WrapMode.Loop, this.effNode, "confusion_ani");
                }
            }else if(oldShiqi < 10 && this.cardInfo.shiqi >= 10){   //混乱恢复
                if(this.cardInfo.state == CardState.Confusion){
                    this.cardInfo.state = CardState.Normal
                    ROOT_NODE.showTipsText("部曲士气从混乱状态恢复")
                }
                //this.effNode.destroyAllChildren();   //清除混乱特效
                let confusion_ani = this.effNode.getChildByName("confusion_ani");
                if(confusion_ani){
                    confusion_ani.destroy();  //清除混乱特效
                }
            } 

            FightMgr.handleUpdateBlockCardInfo(this.cardInfo);   //更新同步卡牌数据（战斗士气变动）
        }
    }

    /** 通知地块准备下一个回合*/
    handlePerNextRound(){
        this.handelShiqiChangeBySurround();  //处理回合开始部曲被包围而引起的士气变化
    }

    /** 处理回合开始部曲被包围而引起的士气变化*/
    handelShiqiChangeBySurround(){
        //围三缺一，士气-2；置之死地，士气+2；前后或左右夹击，士气-1
        if(this.cardInfo && this.cardInfo.state != CardState.Confusion){  //非混乱部曲
            FightMgr.checkBlocksRelation_AutoAtkAI(this);  //检测指定砖块周边情况，并AutoAI处理。如包围士气变化，敌军下一步自动攻击预处理等
        }
    }

    /** 处理本砖块和目标砖块的移动，战斗等处理 */
    handleBlockOptWithBlock(tarBlock: Block){
        if(!tarBlock){
            cc.log("异常，没有目标砖块")
            return;
        }
        cc.log("this blockId = "+this.blockId + "tarBlock blockId = "+tarBlock.blockId);
        if(this.boundNode.active != true){  //攻击或路径范围
            cc.log("本地块不在目标的攻击或路径范围");
            tarBlock.onCardMoveBlock(tarBlock);   //目标砖块复原
        }else{
            if(this.atkBg.active == true){  //本地块在目标砖块的攻击范围
                this.onCardAttackBlock(tarBlock);   //参数地块上的卡牌攻击本地块上卡牌
            }else if(this.runBg.active == true){  //本地块在目标砖块的路径范围
                if(this.cardInfo){
                    this.onCardSwapBlock(tarBlock);   //主将可以和同阵营临近部曲交换位置
                }else{
                    this.onCardMoveBlock(tarBlock);   //将目标地块上的卡牌移动到本空地块上
                }
            }
        }
    }

    /** 处理砖块AutoAI结果 */
    handleBlockAutoAIResult(destBlock: Block){
        if(!destBlock){
            cc.log("处理砖块AutoAI结果 对方砖块 异常 ");
            return;
        }
        NoticeMgr.emit(NoticeType.SelBlockMove, this);  //准备拖动砖块,显示周边移动和攻击范围
        destBlock.handleBlockOptWithBlock(this);   //处理本砖块和目标砖块的移动，战斗等处理
        NoticeMgr.emit(NoticeType.SelBlockMove, null);  //取消显示周边移动和攻击范围
    }

}
