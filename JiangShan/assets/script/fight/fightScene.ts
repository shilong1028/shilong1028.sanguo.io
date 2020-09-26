import GeneralCell from "../comui/general";
import List from "../control/List";
import { ROOT_NODE } from "../login/rootNode";
import { AudioMgr } from "../manager/AudioMgr";
import { CardInfo, GameOverState } from "../manager/Enum";
import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import { MyUserData } from "../manager/MyUserData";
import { NoticeMgr, NoticeType } from "../manager/NoticeManager";
import { SDKMgr } from "../manager/SDKManager";
import Block from "./block";
import Card from "./card";


//战斗场景
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Fight/fightScene")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class FightScene extends cc.Component {

    @property(cc.Node)
    qipanNode: cc.Node = null;   //棋盘节点
    @property(cc.Node)
    gridNode: cc.Node = null;   //棋盘网格节点

    @property(List)
    enemyList: List = null;
    @property(List)
    myList: List = null;

    @property(cc.Label)
    myDesc: cc.Label = null;  //敌方回合/我方回合
    @property(cc.Label)
    enemyDesc: cc.Label = null;  
    @property(cc.Label)
    mySoliderLbl: cc.Label = null;  //敌方兵力/我方兵力
    @property(cc.Label)
    enemySoliderLbl: cc.Label = null;  

    @property(cc.Prefab)
    pfBlock: cc.Prefab = null;   //棋盘格对象
    @property(cc.Prefab)
    pfCard: cc.Prefab = null;   //卡牌对象
    @property(cc.Prefab)
    pfFightShow: cc.Prefab = null;  //战斗或合成展示层
    @property(cc.Prefab)
    pfHelp: cc.Prefab = null;    //战斗帮助
    @property(cc.Prefab)
    pfResult: cc.Prefab = null;   //战斗结果

    selectBlock: Block = null;    //选中的将要移动的卡牌地块
    selCardNode: cc.Node = null;   //选中的卡牌对象（新创建）

    cardPool: cc.NodePool =  null;   //卡牌缓存池

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.ontTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.ontTouchEnd, this);

        NoticeMgr.on(NoticeType.GameOverNotice, this.handleGameOverNotice, this);  //游戏结束通知

        this.cardPool =  new cc.NodePool(Card);   //武将卡牌缓存池
        for(let i=0; i<15; i++){
            let general = cc.instantiate(this.pfCard);
            this.cardPool.put(general);
        }

        this.createDefaultCards();  //初始化棋盘
    }

    onDestroy(){
        if(this.cardPool){
            this.cardPool.clear();
        }

        SDKMgr.removeBannerAd();  
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    /**缓存池创建卡牌节点 */
    createrCard(info: CardInfo){
        let card: cc.Node = null;
        if (this.cardPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            card = this.cardPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            card = cc.instantiate(this.pfCard);
        }
        card.getComponent(Card).initCardData(info);
        return card;
    }
    /**缓存池回收卡牌节点 */
    removeCard(card: cc.Node){
        this.cardPool.put(card); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }

    start () {
        if(MyUserData.roleLv <= 3){   //主角小于三级开启战斗帮助说明
            this.onHelpBtn();
        }
        SDKMgr.createrBannerAd();   //创建Banner
        FightMgr.initGeneralToBlock();  //初始化双方武将初始布局

        this.enemyList.numItems = FightMgr.battleEnemyArr.length;
        this.myList.numItems = FightMgr.battleGeneralArr.length;

        this.updateMySoliderTotalCount();   //更新我方士兵总数
        this.updateEnemySoliderTotalCount();  //更新敌方士兵总数
    }
    // update (dt) {}

    /** 更新我方士兵总数*/
    updateMySoliderTotalCount(){
        let total = 0;
        for(let i=0; i<FightMgr.battleGeneralArr.length; i++){
            let generalInfo = FightMgr.battleGeneralArr[i].generalInfo;
            total += generalInfo.bingCount;
        }
        this.mySoliderLbl.string = "我方总兵力:"+total; 
    }
    /** 更新敌方士兵总数*/
    updateEnemySoliderTotalCount(){
        let total = 0;
        for(let i=0; i<FightMgr.battleEnemyArr.length; i++){
            let generalInfo = FightMgr.battleEnemyArr[i].generalInfo;
            total += generalInfo.bingCount;
        }
        this.enemySoliderLbl.string = "敌方总兵力:"+total; 
    }

    //列表渲染器
    onEnemyListRender(item: cc.Node, idx: number) {
        if(!item) return;
        let info = FightMgr.battleEnemyArr[idx];
        item.getComponent(GeneralCell).initGeneralData(info.generalInfo);
    }
    //列表渲染器
    onListRender(item: cc.Node, idx: number) {
        if(!item) return;
        let info = FightMgr.battleGeneralArr[idx];
        item.getComponent(GeneralCell).initGeneralData(info.generalInfo);
    }

    onHelpBtn(){
        AudioMgr.playBtnClickEffect();
        //GameMgr.showLayer(this.pfHelp);
    }

    onBackBtn(){
        AudioMgr.playBtnClickEffect();
        ROOT_NODE.showTipsDialog("战斗还未结束，确定要强制撤军？", ()=>{
            GameMgr.gotoMainScene();   //进入主场景
        });
    }

    onResetBtn(){
        AudioMgr.playBtnClickEffect();
        this.createDefaultCards(false);  //初始化棋盘
        FightMgr.clearFightMgrData(true);  //清除或重置战斗数据
        FightMgr.initGeneralToBlock();  //初始化双方武将初始布局
    }

    /**卡牌初始化或场景重置 */
    createDefaultCards(bInit:boolean = true){
        for(let i=0; i<this.gridNode.childrenCount;++i){
            let blockNode = this.gridNode.children[i];
            if(blockNode){
                if(bInit){   //初始化
                    blockNode.getComponent(Block).initBlockData(i);
                }else{   //重置
                    blockNode.getComponent(Block).resetBlockShow();
                }
            }
        }

        this.myDesc.node.active = false;  //敌方回合/我方回合
        this.enemyDesc.node.active = false; 

        this.selectBlock = null;  //选中的将要移动的卡牌地块
        if(this.selCardNode){
            //this.selCardNode.setPosition(-3000, -3000);
            this.selCardNode.active = false;
        }
    }

    /**通过指定的索引返回砖块*/
    getBlockById(blockId:number){
        for(let i=0; i<this.gridNode.childrenCount;++i){
            let blockNode = this.gridNode.children[i];
            if(blockNode){
                let block = blockNode.getComponent(Block)
                if(block && block.blockId == blockId){
                    return block;
                }
            }
        }
        return null;
    }

    /** 我方回合处理 */
    showMyRoundDesc(){
        this.myDesc.node.active = false;  //敌方回合/我方回合
        this.enemyDesc.node.active = false; 

        if(FightMgr.bMyRound == true){
            this.myDesc.node.active = true;  //"我方回合"
        }
    }

    /** 敌方回合处理 */
    showEnemyRoundDesc(){
        this.myDesc.node.active = false;   //敌方回合/我方回合
        this.enemyDesc.node.active = false; 

        if(FightMgr.bMyRound != true){
            this.enemyDesc.node.active = true;  //"敌方回合"
        }
    }

    /**设置选中的将要移动的卡牌地块 */
    setSelectCard(block: Block){
        this.selectBlock = block;  
        NoticeMgr.emit(NoticeType.SelBlockMove, block);  //准备拖动砖块,显示周边移动和攻击范围
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
            this.selCardNode = this.createrCard(this.selectBlock.cardInfo);
            //this.selCardNode.setPosition(-3000, -3000);
            this.node.addChild(this.selCardNode, 100);
        }else{
            let card = this.selCardNode.getComponent(Card);
            card.initCardData(this.selectBlock.cardInfo);   //设置地块卡牌模型数据 
        }
        let pos = this.node.convertToNodeSpaceAR(touchPos);
        //pos.y += this.gridNode.y;
        this.selCardNode.setPosition(pos);
        this.selCardNode.active = true;
    }

    /**放置选中的卡牌模型 */
    placeSelectCard(touchPos : cc.Vec2){
        if(this.selCardNode == null || this.selectBlock == null){
            return;
        }

        //this.selCardNode.setPosition(-3000, -3000);
        this.selCardNode.active = false;
        //touchPos.y += this.gridNode.y;

        let dropBlock: Block = this.getBlockSlotIndex(touchPos);   //根据位置找到对应的地块
        if(dropBlock == null){   //未找到合适的地块
            cc.log("未找到合适的地块");
            this.selectBlock.onCardMoveBlock(this.selectBlock);   //将一个地块上的卡牌移动到本空地块上，或复原砖块显示
        }else{
            dropBlock.handleBlockOptWithBlock(this.selectBlock);   //处理本砖块和目标砖块的移动，战斗等处理
        }
        this.selectBlock = null;   //拖动的地块数据
        NoticeMgr.emit(NoticeType.SelBlockMove, null);  //取消显示周边移动和攻击范围
    }

    /**根据位置找到对应的地块 */
    getBlockSlotIndex(touchPos: cc.Vec2): Block{
        let pos = this.gridNode.parent.convertToNodeSpaceAR(touchPos);
        cc.log("getBlockSlotIndex touchPos = "+touchPos+"; pos = "+pos);
        pos.x += this.gridNode.width/2;
        pos.y += this.gridNode.height/2;
        cc.log("change pos = "+pos);
        let pos_Row = Math.floor(pos.y/this.gridNode.children[0].height);
        let pos_Col = Math.floor(pos.x/this.gridNode.children[0].width);
        return this.getBlockById(pos_Row*FightMgr.cardsCol + pos_Col);  //通过指定的索引返回砖块
    }

    /** 游戏结束通知 */
    handleGameOverNotice(overState: GameOverState){
        FightMgr.handleGameOverNotice(overState);
        GameMgr.showLayer(this.pfResult);
    }

    /**更新同步卡牌显示（战斗士气变动）*/
    handleUpdateBlockCardInfo(campId:number, idx: number){
        if(campId == FightMgr.myCampId){   //我方部曲卡牌
            let cardInfo = FightMgr.battleGeneralArr[idx];
        }else{  //敌方部曲卡牌
            let cardInfo = FightMgr.battleEnemyArr[idx];
        }
    }

}
