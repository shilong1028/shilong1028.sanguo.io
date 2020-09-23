import { ROOT_NODE } from "../login/rootNode";
import { BlockBuildType, BlockRelation, BlockType, CardInfo, CardState, CardType, EnemyAIResult, GameOverState, ShiqiEvent, SoliderType } from "../manager/Enum";
import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import { NoticeMgr, NoticeType } from "../manager/NoticeManager";
import Card from "./card";


//棋盘格子对象
const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component {

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

    blockId: number = 0;   //地块ID
    blockRow: number = 0;   //地块行 Row 列 Column
    blockColumn: number = 0;   //地块行 Row 列 Column
    blockType: BlockType = BlockType.Mid;   //地块类型， 0中间地带，1我方范围，2敌方范围
    buildType: BlockBuildType = BlockBuildType.None;   //建筑类型  0无，1营寨，2箭楼, 3粮仓

    cardNode: cc.Node = null;
    cardInfo: CardInfo = null;   //注意，地块的cardInfo和卡牌的cardInfo是公用一块内存的。
    /**
     * CardInfo
     *  flagId: number = 0;   //阵营，0默认，1蓝方(我方），2红方（敌方）
        shiqi: number = 100;   //士气值
        generalInfo: GeneralInfo = null;   //武将信息
        [
            timeId: number = 0;   //武将的时间ID，玩家武将唯一编号
            generalId: string = "0";  
            officialId: string = "101";  //官职ID
            generalLv: number = 1;   //武将等级
            generalExp: number = 0;   //武将经验
            bingCount: number = 0;   //部曲士兵数量
            tempFightInfo: TempFightInfo = null;  //武将战斗临时数据类
            skills: SkillInfo[] = [];
            generalCfg: st_general_info = null;   //卡牌配置信息
        ]
     */

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

        NoticeMgr.on(NoticeType.SelBlockMove, this.handleSelBlockMove, this);  //准备拖动砖块
        NoticeMgr.on(NoticeType.PerNextRound, this.handlePerNextRound, this);  //通知地块准备下一个回合
        NoticeMgr.on(NoticeType.EnemyRoundOptAI, this.handleEnemyRoundOptAI, this);  //敌方自动AI
        NoticeMgr.on(NoticeType.UpdateShiqiNotice, this.handleUpdateShiqiNotice, this);  //士气改变通知

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
        if(blockId == 2 || blockId == 32){
            this.buildType = BlockBuildType.Barracks
            this.buildNode.active = true;  //建筑
        }else if(blockId == 0 || blockId == 34){
            this.buildType = BlockBuildType.Granary
            this.buildNode.active = true;  //建筑
        }else if(blockId == 10 || blockId == 13){  //敌方箭楼
            this.buildType = BlockBuildType.Watchtower
            this.blockType = BlockType.Enemy
            this.buildNode.active = true;  //建筑
        }else if(blockId == 21 || blockId == 24){   //我方箭楼
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
            this.cardNode.active = true; 
            this.cardNode.getComponent(Card).setCardData(info);
        }
    }

    /**将本地块上的卡牌移走了 */
    onRemoveCardNode(){
        cc.log("onRemoveCardNode(), this.blockId = "+this.blockId);
        if(this.cardNode){
            this.cardNode.removeFromParent(true);
            this.cardInfo = null;
            this.cardNode = null;
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

    /**参数地块上的卡牌攻击本地块上卡牌 */
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
                FightMgr.showFightDetailLayer(optBlock, this, (atkCardInfo:CardInfo, defCardInfo:CardInfo, bWin:boolean)=>{
                    cc.log("战斗结束")
                    optBlock.handleDeadCardNode(atkCardInfo);  //处理阵亡，逃逸，被俘
                    this.handleDeadCardNode(defCardInfo);  //处理阵亡，逃逸，被俘
                    if(bWin){
                        if(optBlock.cardInfo){  //还活着
                            if(this.cardInfo){
                                optBlock.onCardMoveBlock(optBlock);   //复原砖块
                            }else{  //本砖块没有部曲了
                                optBlock.handleUpdateShiqiByKillOther(true);   //因击溃对方部曲而改变士气 
                                this.showBlockCard(optBlock.cardInfo);  //设置地块上的卡牌模型
                                optBlock.onRemoveCardNode();   //将本地块上的卡牌移走了
                            }
                        }
                    }else{
                        if(optBlock.cardInfo){  //还活着
                            optBlock.onCardMoveBlock(optBlock);   //复原砖块
                        }else{
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

    /**处理阵亡，逃逸，被俘 */
    handleDeadCardNode(cardInfo: CardInfo){
        cc.log("handleDeadCardNode(), this.blockId = "+this.blockId);
        if(this.cardInfo && cardInfo){
            if(cardInfo.state == CardState.Dead || cardInfo.state == CardState.Flee || cardInfo.state == CardState.Prisoner){  //阵亡，逃逸，被俘
                this.cardInfo = cardInfo;

                if(cardInfo.type == CardType.Chief){  //类型，0普通，1主将，2前锋，3后卫
                    if(cardInfo.campId == FightMgr.myCampId){  //阵营，0默认，1蓝方(我方），2红方
                        ROOT_NODE.showTipsText("我方主将阵亡")
                        NoticeMgr.emit(NoticeType.GameOverNotice, GameOverState.MyChiefDead);  //游戏结束通知
                    }else{
                        ROOT_NODE.showTipsText("敌方主将阵亡")
                        NoticeMgr.emit(NoticeType.GameOverNotice, GameOverState.EnemyChiefDead);
                    }
                }else{
                    this.checkBlockBuildState();  //检测建筑(1营寨，2箭楼, 3粮仓)是否被攻占
                } 
                this.onRemoveCardNode();   //将本地块上的卡牌移走了
                FightMgr.checkGameOverByDead();  //因部曲（阵亡，逃逸，被俘） 检查是否游戏结束 
            }
        }
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

    /** 通知地块准备下一个回合*/
    handlePerNextRound(){
        this.effNode.destroyAllChildren();
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
        if(this.cardInfo && this.cardNode){
            this.cardInfo.shiqi += val;
            if(this.cardInfo.shiqi < 0){
                this.cardInfo.shiqi = 0;
            }
            this.cardNode.getComponent(Card).showCardShiqiLabel();   //显示士气值

            if(bShowAni){
                if(val > 0){
                    GameMgr.createAtlasAniNode(this.qiupAtlas, 18, cc.WrapMode.Default, this.effNode);
                }else if(val < 0){
                    GameMgr.createAtlasAniNode(this.qidownAtlas, 18, cc.WrapMode.Default, this.effNode);
                }
            }

            if(this.cardInfo.shiqi <= 10){  //士气过低，逃离战场
                ROOT_NODE.showTipsText("士气过低，逃离战场!");
                this.cardInfo.state = CardState.Flee;

                this.onRemoveCardNode();   //将本地块上的卡牌移走了
                FightMgr.checkGameOverByDead();  //因部曲（阵亡，逃逸，被俘） 检查是否游戏结束 
            }
        }
    }







    /**敌方回合AI处理 */
    handleEnemyRoundOptAI(){
        cc.log("handleEnemyRoundOptAI(), 敌方自动AI FightMgr.EnemyAutoAi = "+FightMgr.EnemyAutoAi);
        if(this.cardInfo == null || this.cardNode == null || FightMgr.EnemyAutoAi == false || this.cardInfo.campId == FightMgr.myCampId){   //敌方自动AI
            return;
        }

        //1、预判所有敌方单位是否收到我方严重威胁，并找出受威胁最严重的一个敌方单位；
        // 同时，找出敌方可击杀我方的敌方单位。判定逃跑或击杀权重从而选择操作。
        let runAwayEnemy = null;    //敌方预逃走的单位
        let runAwayWeight = 0;   //逃走权重
        let hitEnemy = null;   //敌方出手的单位
        let hitMy = null;    //我方预被击杀的单位
        let hitWeight = 0;   //击杀权重

        //cc.log("预判所有敌方单位是否收到我方严重威胁，并找出受威胁最严重的一个敌方单位；同时，找出敌方可击杀我方的敌方单位。判定逃跑或击杀权重从而选择操作。");
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
