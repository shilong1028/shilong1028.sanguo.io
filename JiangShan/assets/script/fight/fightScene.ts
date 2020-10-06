import GeneralCell from "../comui/general";
import List from "../control/List";
import { ROOT_NODE } from "../login/rootNode";
import { AudioMgr } from "../manager/AudioMgr";
import { GameOverState } from "../manager/Enum";
import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import { MyUserData } from "../manager/MyUserData";
import { NoticeMgr, NoticeType } from "../manager/NoticeManager";
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
    titleLbl: cc.Label = null; 
    @property(cc.Label)
    roundLbl: cc.Label = null; 
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
    selectTouchOffset: cc.Vec2 = cc.Vec2.ZERO;  //选中砖块首次触摸相对砖块锚点偏移
    selCardNode: cc.Node = null;   //选中的卡牌对象（新创建）

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.ontTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.ontTouchEnd, this);

        NoticeMgr.on(NoticeType.GameOverNotice, this.handleGameOverNotice, this);  //游戏结束通知

        this.createDefaultCards();  //初始化棋盘
    }

    onDestroy(){
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start () {
        if(MyUserData.roleLv <= 3){   //主角小于三级开启战斗帮助说明
            this.onHelpBtn();
        }
        FightMgr.initGeneralToBlock();  //初始化双方武将初始布局

        this.enemyList.numItems = FightMgr.battleEnemyArr.length;
        this.myList.numItems = FightMgr.battleGeneralArr.length;

        this.updateMySoliderTotalCount();   //更新我方士兵总数
        this.updateEnemySoliderTotalCount();  //更新敌方士兵总数

        if(FightMgr.fightCityInfo){
            this.titleLbl.string = FightMgr.fightCityInfo.cityCfg.name +"之战"
        }else{
            let storyConf = GameMgr.curTaskConf;
            this.titleLbl.string = storyConf.name;
        }
        this.showMyRoundDesc();
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

        this.removeSelCardNode();   //移除选中时显示的仅供移动的卡牌节点
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
        this.roundLbl.string = `第${FightMgr.fightRoundCount}/${FightMgr.MaxFightRouncCount}回合`; 
        if(FightMgr.bMyRound == true){
            this.myDesc.node.active = true;  //"我方回合"
        }
    }

    /** 敌方回合处理 */
    showEnemyRoundDesc(){
        this.myDesc.node.active = false;   //敌方回合/我方回合
        this.enemyDesc.node.active = false; 
        this.roundLbl.string = `第${FightMgr.fightRoundCount}/${FightMgr.MaxFightRouncCount}回合`; 
        if(FightMgr.bMyRound != true){
            this.enemyDesc.node.active = true;  //"敌方回合"
        }
    }

    /**设置选中的将要移动的卡牌地块*/
    setSelectCard(block: Block){
        this.selectBlock = block;  
        NoticeMgr.emit(NoticeType.SelBlockMove, block);  //准备拖动砖块,显示周边移动和攻击范围
    }

    onTouchStart(event: cc.Event.EventTouch) {  
        if(FightMgr.bStopTouch == false && this.selectBlock){ //是否停止触摸反应
            this.updateSelectCard(event.getLocation(), true);   //拖动更新选中的小球模型的位置
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

    /** 处理砖块AutoAI结果的选择显示及攻击移动动作 */
    handleBlockAutoAIResultSelOpt(aiBlock: Block, destBlock: Block){
        if(!aiBlock || !destBlock){
            cc.log("处理砖块AutoAI结果的选择显示及攻击移动动作 砖块 异常 ");
            return;
        }
        cc.log("handleBlockAutoAIResultSelOpt 处理砖块AutoAI结果的选择显示及攻击移动动作 aiBlock.blockId = "+aiBlock.blockId+"; destBlock.blockId = "+destBlock.blockId);
        this.setSelectCard(aiBlock);

        let touchPos = aiBlock.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this.selectTouchOffset = cc.Vec2.ZERO;  //选中砖块首次触摸相对砖块锚点偏移
        this.updateSelectCard(touchPos, false);

        let offsetPos = cc.v2(destBlock.node.x - aiBlock.node.x, destBlock.node.y - aiBlock.node.y)
        cc.log("touchPos = "+touchPos+"; offsetPos = "+offsetPos)
        this.selCardNode.runAction(cc.sequence(cc.delayTime(1.0), cc.moveBy(1.1, offsetPos).easing(cc.easeBackInOut()), 
            cc.callFunc(()=>{
                cc.log("处理砖块AutoAI结果的选择显示及攻击移动动作 攻击")
                destBlock.handleBlockOptWithBlock(aiBlock);   //处理本砖块和目标砖块的移动，战斗等处理
                NoticeMgr.emit(NoticeType.SelBlockMove, null);  //取消显示周边移动和攻击范围
                this.removeSelCardNode();   //移除选中时显示的仅供移动的卡牌节点
            })))
    }

    /**移除选中时显示的仅供移动的卡牌节点 */
    removeSelCardNode(){
        this.selectBlock = null;  //选中的将要移动的卡牌地块
        this.selectTouchOffset = cc.Vec2.ZERO;  //选中砖块首次触摸相对砖块锚点偏移
        if(this.selCardNode){
            //this.selCardNode.setPosition(-3000, -3000);
            this.selCardNode.active = false;
        }
    }

    /**拖动更新选中的卡牌的位置 bStart 是否touchStart触摸 */
    updateSelectCard(touchPos: cc.Vec2, bStart:boolean = false){
        if(this.selectBlock == null){
            return;
        }
        if(this.selCardNode == null){   //选中的卡牌对象（新创建）
            this.selCardNode = cc.instantiate(this.pfCard);
            this.selCardNode.getComponent(Card).initCardData(this.selectBlock.getBlockCardInfo());
            //this.selCardNode.setPosition(-3000, -3000);
            this.node.addChild(this.selCardNode, 100);
        }else{
            let card = this.selCardNode.getComponent(Card);
            card.initCardData(this.selectBlock.getBlockCardInfo());   //设置地块卡牌模型数据 
        }
        if(bStart){   //touchStart触摸
            let blockTouchPos = this.selectBlock.node.convertToNodeSpaceAR(touchPos);   //触摸点在砖块内的坐标
            this.selectTouchOffset = blockTouchPos;  //选中砖块首次触摸相对砖块锚点偏移
            // this.selCardNode.anchorX = (this.selectBlock.node.width/2 + blockTouchPos.x)/this.selectBlock.node.width;
            // this.selCardNode.anchorY = (this.selectBlock.node.height/2 + blockTouchPos.y)/this.selectBlock.node.height;
            // cc.log("blockTouchPos = "+blockTouchPos+"; anchor = "+this.selCardNode.getAnchorPoint())
        }
        this.selCardNode.stopAllActions();
        let pos = this.node.convertToNodeSpaceAR(touchPos).sub(this.selectTouchOffset);
        //cc.log("touchPos = "+touchPos+"; pos = "+pos+"; this.selectTouchOffset = "+this.selectTouchOffset)
        this.selCardNode.setPosition(pos);
        this.selCardNode.active = true;
    }

    /**放置选中的卡牌模型 */
    placeSelectCard(touchPos : cc.Vec2){
        if(this.selCardNode == null || this.selectBlock == null){
            return;
        }
        let dropBlock: Block = this.getBlockSlotIndex(touchPos);   //根据位置找到对应的地块
        if(dropBlock == null){   //未找到合适的地块
            cc.log("未找到合适的地块");
            this.selectBlock.onCardMoveBlock(this.selectBlock);   //将一个地块上的卡牌移动到本空地块上，或复原砖块显示
        }else{
            dropBlock.handleBlockOptWithBlock(this.selectBlock);   //处理本砖块和目标砖块的移动，战斗等处理
        }
        NoticeMgr.emit(NoticeType.SelBlockMove, null);  //取消显示周边移动和攻击范围
        this.removeSelCardNode();   //移除选中时显示的仅供移动的卡牌节点
    }

    /**根据位置找到对应的地块 */
    getBlockSlotIndex(touchPos: cc.Vec2): Block{
        let pos = this.gridNode.convertToNodeSpaceAR(touchPos);
        let offPos = cc.v2(pos.x + this.gridNode.width/2, pos.y + this.gridNode.height/2)
        //cc.log("getBlockSlotIndex touchPos = "+touchPos+"; pos = "+pos+ "; offPos = "+offPos);
        let pos_Row = (FightMgr.cardsRow - 1) - Math.floor(offPos.y/this.gridNode.children[0].height);
        let pos_Col = Math.floor(offPos.x/this.gridNode.children[0].width);
        return this.getBlockById(pos_Row*FightMgr.cardsCol + pos_Col);  //通过指定的索引返回砖块
    }

    /** 游戏结束通知 */
    handleGameOverNotice(overState: GameOverState){
        FightMgr.handleGameOverNotice(overState);
        //GameMgr.showLayer(this.pfResult);
    }

    /**更新同步卡牌显示（战斗士气变动）*/
    handleUpdateBlockCardInfo(campId:number, idx: number){
        if(campId == FightMgr.myCampId){   //我方部曲卡牌
            let cardInfo = FightMgr.battleGeneralArr[idx];
        }else{  //敌方部曲卡牌
            let cardInfo = FightMgr.battleEnemyArr[idx];
        }
    }

    // onRecordBtn(){
    //     AudioMgr.playEffect("effect/ui_click");
    //     if(sdkTT.is_recording_video == true){     //录屏中
    //         sdkTT.stopGameRecord();
    //     }else{ 
    //         sdkTT.createGameRecordManager();
    //     }
    // }
    //头条录屏
    // showRecordSpr(){
    //     if(SDKMgr.isSDK == true && SDKMgr.TT){
    //         if(sdkTT.is_recording_video == true){     //录屏中
    //             this.recordSpr.spriteFrame = this.recordEndFrame;
    //         }else{ 
    //             this.recordSpr.spriteFrame = this.recordStartFrame;
    //         }
    //     }else{
    //         this.recordSpr.node.active = false;
    //     }
    // }

}
