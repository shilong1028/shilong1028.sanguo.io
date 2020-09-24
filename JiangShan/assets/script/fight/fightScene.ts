import { ROOT_NODE } from "../login/rootNode";
import { AudioMgr } from "../manager/AudioMgr";
import { GameOverState, SoliderType } from "../manager/Enum";
import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import { MyUserData } from "../manager/MyUserData";
import { NoticeMgr, NoticeType } from "../manager/NoticeManager";
import { SDKMgr } from "../manager/SDKManager";
import Block from "./block";
import Card from "./card";


//战斗场景
const {ccclass, property} = cc._decorator;

@ccclass
export default class FightScene extends cc.Component {

    @property(cc.Node)
    qipanNode: cc.Node = null;   //棋盘节点
    @property(cc.Node)
    gridNode: cc.Node = null;   //棋盘网格节点

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
        SDKMgr.removeBannerAd();  
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start () {
        if(MyUserData.roleLv <= 3){   //主角小于三级开启战斗帮助说明
            this.onHelpBtn();
        }
        SDKMgr.createrBannerAd();   //创建Banner
        FightMgr.initGeneralToBlock();  //初始化双方武将初始布局
    }

    // update (dt) {}

    onHelpBtn(){
        AudioMgr.playBtnClickEffect();
        GameMgr.showLayer(this.pfHelp);
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
            this.selCardNode = cc.instantiate(this.pfCard);
            //this.selCardNode.setPosition(-3000, -3000);
            this.node.addChild(this.selCardNode, 100);
        }
        this.selCardNode.active = true;
        let card = this.selCardNode.getComponent(Card);
        card.setCardData(this.selectBlock.cardInfo);   //设置地块卡牌模型数据 

        let pos = this.node.convertToNodeSpaceAR(touchPos);
        //pos.y += this.gridNode.y;
        this.selCardNode.setPosition(pos);
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
