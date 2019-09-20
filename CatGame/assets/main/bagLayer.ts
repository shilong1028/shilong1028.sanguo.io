
import { AudioMgr } from "../manager/AudioMgr";
import { NoticeType, TipsStrDef, BallInfo, PlayerInfo } from "../manager/Enum";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { NotificationMy } from "../manager/NoticeManager";
import PlayerCell from "./playerCell";
import Block from "./Block";
import { GameMgr } from "../manager/GameManager";
import Stuff from "./Stuff";
import { ROOT_NODE } from "../common/rootNode";


const {ccclass, property} = cc._decorator;

@ccclass
export default class BagLayer extends cc.Component {

    @property(cc.PageView)
    pageView: cc.PageView = null;
    @property(cc.Node)
    equipNode: cc.Node = null;
    @property(cc.Node)
    itemNode: cc.Node = null;
    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Node)
    gridNode: cc.Node = null;
    @property(cc.Label)
    gridLabel: cc.Label = null; 
    @property(cc.Node)
    delNode: cc.Node = null;   //删除节点

    @property(cc.Prefab)
    pfPlayer: cc.Prefab = null;
    @property(cc.Prefab)
    pfBlock: cc.Prefab = null;
    @property(cc.Prefab)
    pfStuff: cc.Prefab = null;
    @property(cc.Prefab)
    pfBallShop: cc.Prefab = null;

    @property(cc.SpriteAtlas)
    stuffUpAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:

    curGirdType: number = -1;   //0装备小球，1饰品道具，2技能

    curPageIdx: number = -1;  
    usedPlayerPage: PlayerCell = null;    //当前使用的炮台

    nSelectModel: cc.Node = null;   //拖动选择的地块模型
    selectBlock: Block = null;   //拖动的地块数据

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.ontTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.ontTouchEnd, this);

        NotificationMy.on(NoticeType.BuyAddBall, this.addBallToOneBlock, this);   //购买小球

        this.delNode.active= false;  //回收站
    }

    onDestroy(){
        NotificationMy.offAll(this);
        this.node.targetOff(this);
    }

    start () {
        this.initPageView();
        this.initGirdInfo(0);
    }

    // update (dt) {}

    initPageView(){
        for(let i=0; i<MyUserData.playerList.length; ++i){
            let page = cc.instantiate(this.pfPlayer);
            this.pageView.addPage(page);
            page.getComponent(PlayerCell).initPlayerInfo(MyUserData.playerList[i].clone(), this);

            if(MyUserData.playerList[i].playerId == MyUserData.curPlayerId){
                this.showCurPlayerInfo(i);  //显示当前炮台的装备道具等信息
                this.usedPlayerPage = page.getComponent(PlayerCell);   //当前使用的炮台
            }
        }
        this.pageView.scrollToPage(this.curPageIdx, 0.01);
    }

    // 监听事件
    onPageEvent (sender, eventType) {
        // 翻页事件
        if (eventType !== cc.PageView.EventType.PAGE_TURNING) {
            return;
        }
        this.showCurPlayerInfo(sender.getCurrentPageIndex());  //显示当前炮台的装备道具等信息
    } 

    //显示当前炮台的装备道具等信息
    showCurPlayerInfo(pageIdx: number){
        if(this.curPageIdx == pageIdx){
            return;
        }
        this.curPageIdx = pageIdx;

        let curPageInfo: PlayerInfo = MyUserDataMgr.getPlayerInfoByIdx(this.curPageIdx);
        if(curPageInfo){
            this.showPlayerEquip(curPageInfo.ballId);
            this.showPlayerItem(curPageInfo.itemId);
            this.showPlayerSkill(curPageInfo.skillId);
        }
    }
    //装备炮弹
    showPlayerEquip(ballId: number){
        this.equipNode.removeAllChildren(true);

        if(ballId > 0){
            let stuffNode = cc.instantiate(this.pfStuff);
            this.equipNode.addChild(stuffNode);
            stuffNode.getComponent(Stuff).setStuffData(new BallInfo(ballId));  //设置地块小球模型数据
        }
    }

    //饰品道具
    showPlayerItem(itemId: number){
        this.itemNode.removeAllChildren(true);
    }

    //炮台技能
    showPlayerSkill(skillId: number){
        this.skillNode.removeAllChildren(true);
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.node.removeFromParent(true);
    }

    onEquipBtn(){
        AudioMgr.playEffect("effect/ui_click");
    }

    onItemBtn(){
        AudioMgr.playEffect("effect/ui_click");
    }

    onSkillBtn(){
        AudioMgr.playEffect("effect/ui_click");
    }

    onTouchStart(event: cc.Event.EventTouch) {  
        if(this.selectBlock){
            if(this.curGirdType == 0){
                this.delNode.active= true;  //回收站
            }
            this.updateSelectBlock(event.getLocation());   //拖动更新选中的地块模型的位置
        }
    }

    onTouchMove(event: cc.Event.EventTouch) {
        if(this.nSelectModel && this.selectBlock){ 
            this.updateSelectBlock(event.getLocation());   //拖动更新选中的地块模型的位置
        }
    }

    ontTouchEnd(event: cc.Event.EventTouch) {
        if(this.nSelectModel && this.selectBlock){  
            this.placeSelectBlock(event.getLocation());   //放置选中的地块模型
            NotificationMy.emit(NoticeType.BlockBallSel, null);   //地块上小球被选择，相同等级的小球地块要显示光圈
        }
    }

    initGirdInfo(gridType: number){
        if(this.curGirdType == gridType){
            return;
        }
        this.curGirdType = gridType;   //0装备小球，1饰品道具，2技能

        this.gridNode.removeAllChildren();

        if(this.curGirdType == 0){   //0装备小球
            let ballList = MyUserDataMgr.getBallListClone();

            for(let i=0; i<8; ++i){
                let ballInfo: BallInfo = null;
                if(i < ballList.length){
                    ballInfo = ballList[i];
                }
    
                let node = cc.instantiate(this.pfBlock);
                this.gridNode.addChild(node);
                let block = node.getComponent(Block);
                block.initBlockByBall(i, ballInfo, this);
            }
        }else if(this.curGirdType == 1){   //1饰品道具

        }else if(this.curGirdType == 2){   //2技能

        }
    }

    /**设置选中的将要移动的地块 */
    setSelectBlock(block: Block){
        this.selectBlock = block;   //拖动的地块数据
    }

    /**拖动更新选中的地块模型的位置 */
    updateSelectBlock(touchPos: cc.Vec2){
        if(this.selectBlock){
            touchPos = GameMgr.adaptTouchPos(touchPos, this.node.position);  //校正因适配而产生的触摸偏差
            if(this.curGirdType == 0){   //0装备小球，1饰品道具，2技能
                if(this.nSelectModel == null){
                    this.nSelectModel = cc.instantiate(this.pfStuff);
                    this.nSelectModel.setPosition(-3000, -3000);
                    this.node.addChild(this.nSelectModel, 100);
                }
                let stuff = this.nSelectModel.getComponent(Stuff);
                stuff.setStuffData(this.selectBlock.ballInfo);   //设置地块小球模型数据 
            }

            let pos = this.node.convertToNodeSpaceAR(touchPos);
            this.nSelectModel.setPosition(pos);
        }
    }

    /**放置选中的地块模型 */
    placeSelectBlock(touchPos : cc.Vec2){
        if(this.selectBlock && this.selectBlock){
            touchPos = GameMgr.adaptTouchPos(touchPos, this.node.position);  //校正因适配而产生的触摸偏差

            if(this.curGirdType == 0){   //0装备小球，1饰品道具，2技能
                let pos = this.gridNode.convertToNodeSpace(touchPos);   //网格
                let rect = cc.rect(0, 0, this.gridNode.width, this.gridNode.height);
                if(rect.contains(pos)){ 
                    let dropBlock: cc.Node = this.getBlockSlotIndex(touchPos);   //根据位置找到对应的地块
                    if(dropBlock == null){   //未找到合适的地块
                        this.selectBlock.onRecoverSelf();   //复原本地块模型
                    }else{
                        dropBlock.getComponent(Block).onModelDropBlock(this.selectBlock);   //将一个地块上的小球放置到选中的地块上
                    }
                }else{
                    let pos2 = this.equipNode.convertToNodeSpace(touchPos);   //装备
                    let rect2 = cc.rect(0, 0, this.equipNode.width, this.equipNode.height);
                    if(rect2.contains(pos2)){    //装备新小球
                        let curPageInfo: PlayerInfo = MyUserDataMgr.getPlayerInfoByIdx(this.curPageIdx);
                        if(curPageInfo && curPageInfo.useState == 1){   //已经拥有的炮台
                            let equipBallInfo = null;
                            if(curPageInfo.ballId > 0){
                                equipBallInfo = new BallInfo(curPageInfo.ballId);
                            }
                            curPageInfo.ballId = this.selectBlock.ballInfo.cannonId;

                            this.showPlayerEquip(curPageInfo.ballId);
                            NotificationMy.emit(NoticeType.UpdatePlayer, curPageInfo);   //更新炮台

                            MyUserDataMgr.updatePlayerFromList(curPageInfo);   //更新炮台到拥有的炮列表
                            MyUserDataMgr.equipBallFromBallList(this.selectBlock.ballInfo.clone(), equipBallInfo);

                            if(equipBallInfo){
                                this.selectBlock.setBallStuff(equipBallInfo.clone());  //设置地块上的小球模型
                            }else{
                                this.selectBlock.onRemoveModel();   //将本地块上的模型移走了
                            }  
                        }else{
                            this.selectBlock.onRecoverSelf();   //复原本地块模型
                        }
                    }else{
                        let pos3 = this.delNode.convertToNodeSpace(touchPos);   //回收站
                        let rect3 = cc.rect(0, 0, this.delNode.width, this.delNode.height);
                        if(rect3.contains(pos3)){ 
                            if(MyUserData.ballList.length == 1){   //最后一个小球不可删除
                                ROOT_NODE.showTipsText(TipsStrDef.KEY_FireTip);
                                this.selectBlock.onRecoverSelf();   //复原本地块模型
                            }else{
                                let sellGold = this.selectBlock.onSellBall();  
                                this.showDelBallGainAni(sellGold);   //显示售卖士兵收益 
                            }
                            this.nSelectModel.setPosition(-3000, -3000);
                        }else{
                            this.selectBlock.onRecoverSelf();   //复原本地块模型
                        }
                    }
                }
            }else if(this.curGirdType == 1){   //1饰品道具

            }else if(this.curGirdType == 2){   //2技能

            }

            this.selectBlock = null;   //拖动的地块数据
            this.nSelectModel.setPosition(-3000, -3000);
            this.delNode.active= false;  //小球解雇和升级节点
        }
    }

    /**根据位置找到对应的地块 */
    getBlockSlotIndex(touchPos: cc.Vec2): cc.Node{
        let pos = this.gridNode.convertToNodeSpaceAR(touchPos);
        let blocks = this.gridNode.children;
        for(let i=0; i< blocks.length; i++){
            let len = blocks[i].getPosition().sub(pos).mag();
            if(len <= 100){
                if(blocks[i].getComponent(Block).isLock == false){
                    return blocks[i];
                }
                break;
            }
        }
        return null;
    }

    /**添加一个小球到地块 */
    addBallToOneBlock(ballInfo: BallInfo){
        if(ballInfo && this.curGirdType == 0){
            let blocks = this.gridNode.children;
            for(let i=0; i<blocks.length; i++){
                let block: Block = blocks[i].getComponent(Block);
                if(block.isLock == false && block.ballInfo == null){
                    MyUserDataMgr.updateUserGold(-ballInfo.cannonCfg.cost);
                    MyUserDataMgr.addBallToBallList(ballInfo.clone(), true);

                    block.initBlockByBallInfo(ballInfo);
                    //this.showBuyBallAni(block, ballInfo);   //显示招募小球的动画特效
                    break;
                }
            }
        }
    }

    /**显示售卖士兵收益 */
    showDelBallGainAni(sellGold: number){
        if(sellGold >= 0){
            MyUserDataMgr.updateUserGold(sellGold);   //修改用户金币 
            AudioMgr.playEffect("effect/gold_gain");
            ROOT_NODE.showTipsText("获得金币 "+sellGold);

            // let pos = this.bottomNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
            // this.showIconEffectAni(cc.v2(pos.x, pos.y + 60), 0);

            // let gainNode = cc.instantiate(this.pfGainGold);
            // gainNode.setPosition(cc.v2(0, 60));
            // this.bottomNode.addChild(gainNode, 100);
            // gainNode.getComponent(GainGoldNode).showGainGlodVal(sellGold); 
        }
    }
}
