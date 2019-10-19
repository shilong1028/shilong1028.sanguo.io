
import { AudioMgr } from "../manager/AudioMgr";
import { NoticeType, TipsStrDef, BallInfo, PlayerInfo, ItemInfo } from "../manager/Enum";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { NotificationMy } from "../manager/NoticeManager";
import PlayerCell from "./playerCell";
import Block from "./Block";
import { GameMgr } from "../manager/GameManager";
import Stuff from "./Stuff";
import Item from "../common/item";
import PlayerHelp from "./playerHelp";
import BagGrid from "./bagGrid";
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
    gridNode: cc.Node = null;
    @property(cc.Label)
    gridLabel: cc.Label = null; 

    @property(cc.Node)
    leftArrowNode: cc.Node = null;
    @property(cc.Node)
    rightArrowNode: cc.Node = null;

    @property(cc.Prefab)
    pfPlayer: cc.Prefab = null;
    @property(cc.Prefab)
    pfBlock: cc.Prefab = null;
    @property(cc.Prefab)
    pfItem: cc.Prefab = null;
    @property(cc.Prefab)
    pfStuff: cc.Prefab = null;
    @property(cc.Prefab)
    pfHelp: cc.Prefab = null;
    @property(cc.Prefab)
    pfGridBag: cc.Prefab = null;

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

        NotificationMy.on(NoticeType.UpdateBagGrid, this.handleUpdateBagGrid, this);    //更新背包显示

        this.gridLabel.string = "";
    }

    onDestroy(){
        NotificationMy.offAll(this);
        this.node.targetOff(this);
    }

    start () {
        this.initPageView();

        this.gridLabel.string = TipsStrDef.KEY_WeaponTip3;
        this.initGirdInfo(0);  //0装备小球，1饰品道具，2技能
    }

    // update (dt) {}

    initPageView(){
        for(let i=0; i<MyUserData.playerList.length; ++i){
            let page = cc.instantiate(this.pfPlayer);
            this.pageView.addPage(page);
            page.getComponent(PlayerCell).initPlayerInfo(MyUserData.playerList[i].clone(), this);

            if(MyUserData.playerList[i].playerId == MyUserData.curPlayerId){
                this.curPageIdx = i;
                this.usedPlayerPage = page.getComponent(PlayerCell);   //当前使用的炮台
            }
        }
        this.showCurPlayerInfo();  //显示当前炮台的装备道具等信息
        this.pageView.scrollToPage(this.curPageIdx, 0.01);
    }
    // 监听事件
    onPageEvent (sender, eventType) {
        // 翻页事件
        if (eventType !== cc.PageView.EventType.PAGE_TURNING) {
            return;
        }
        this.curPageIdx = sender.getCurrentPageIndex();   //当前章节索引
        this.showCurPlayerInfo(); 
    } 
    onLeftBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.curPageIdx --;  //当前章节索引
        this.showCurPlayerInfo(); 
        this.pageView.scrollToPage(this.curPageIdx, 0.1);
    }
    onRightBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.curPageIdx ++;   //当前章节ID
        this.showCurPlayerInfo(); 
        this.pageView.scrollToPage(this.curPageIdx, 0.1);
    }
    handleMovePage(){
        if(this.curPageIdx <= 0){
            this.curPageIdx = 0;
            this.leftArrowNode.active = false;
        }else if(this.curPageIdx >= GameMgr.PlayerCount-1){
            this.curPageIdx = GameMgr.PlayerCount-1;
            this.rightArrowNode.active = false;
        }else{
            this.leftArrowNode.active = true;
            this.rightArrowNode.active = true;
        }
    }

    //显示当前炮台的装备道具等信息
    showCurPlayerInfo(){
        this.handleMovePage();

        let curPlayerInfo: PlayerInfo = MyUserDataMgr.getPlayerInfoByIdx(this.curPageIdx);
        if(curPlayerInfo){
            this.showPlayerEquip(curPlayerInfo.ballId);
            this.showPlayerItem(curPlayerInfo.itemId);
        }
    }
    //装备炮弹
    showPlayerEquip(ballId: number){
        this.equipNode.removeAllChildren(true);
        if(ballId > 0){
            let stuffNode = cc.instantiate(this.pfStuff);
            stuffNode.name = "stuffNode";
            this.equipNode.addChild(stuffNode);
            stuffNode.getComponent(Stuff).setStuffData(new BallInfo(ballId));  //设置地块小球模型数据
        }
    }

    //饰品道具
    showPlayerItem(itemId: number){
        this.itemNode.removeAllChildren(true);
        if(itemId > 0){
            let itemModel = cc.instantiate(this.pfItem);
            itemModel.name = "itemModel";
            this.itemNode.addChild(itemModel);
            itemModel.getComponent(Item).initItemById(itemId);  //设置地块道具模型数据
        }
    }

    onHelpBtn(){
        AudioMgr.playEffect("effect/ui_click");
        let curPlayerInfo: PlayerInfo = MyUserDataMgr.getPlayerInfoByIdx(this.curPageIdx);
        if(curPlayerInfo){
            let layer = GameMgr.showLayer(this.pfHelp);
            layer.getComponent(PlayerHelp).initPlayerInfo(curPlayerInfo);
        }
    }

    onEquipBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.gridLabel.string = TipsStrDef.KEY_WeaponTip3;
        this.initGirdInfo(0);  //0装备小球，1饰品道具，2技能
    }

    onItemBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.gridLabel.string = TipsStrDef.KEY_ItemTip;
        this.initGirdInfo(1);  //0装备小球，1饰品道具，2技能
    }

    onTouchStart(event: cc.Event.EventTouch) {  
        if(this.selectBlock){
            this.updateSelectBlock(event.getLocation());   //拖动更新选中的地块模型的位置
        }
    }

    onMoreBtn(){
        AudioMgr.playEffect("effect/ui_click");
        let layer = GameMgr.showLayer(this.pfGridBag);
        layer.getComponent(BagGrid).initGirdInfo(this.curGirdType);  //0装备小球，1饰品道具，2技能
    }

    onTouchMove(event: cc.Event.EventTouch) {
        if(this.nSelectModel && this.selectBlock){ 
            this.updateSelectBlock(event.getLocation());   //拖动更新选中的地块模型的位置
        }
    }

    ontTouchEnd(event: cc.Event.EventTouch) {
        if(this.nSelectModel && this.selectBlock){  
            this.placeSelectBlock(event.getLocation());   //放置选中的地块模型
            if(this.curGirdType == 0){
                NotificationMy.emit(NoticeType.BlockBallSel, null);   //地块上小球被选择，相同等级的小球地块要显示光圈
            }else if(this.curGirdType == 1){
                NotificationMy.emit(NoticeType.BlockItemSel, null);   //地块上道具被选择，相同等级的道具地块要显示光圈
            }
        }
    }

    initGirdInfo(gridType: number){
        if(this.curGirdType == gridType){
            return;
        }
        this.curGirdType = gridType;   //0装备小球，1饰品道具，2技能

        this.gridNode.removeAllChildren();
        if(this.nSelectModel){
            this.nSelectModel.removeFromParent(true);
        }
        this.nSelectModel = null;

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
            let itemList = MyUserDataMgr.getItemListClone();
            for(let i=0; i<8; ++i){
                let itemInfo: ItemInfo = null;
                if(i < itemList.length){
                    itemInfo = itemList[i];
                }
    
                let node = cc.instantiate(this.pfBlock);
                this.gridNode.addChild(node);
                let block = node.getComponent(Block);
                block.initBlockByItem(i, itemInfo, this);
            }
        }
    }

    handleUpdateBagGrid(){
        if(this.curGirdType == 0){   //0装备小球
            this.UpdateBallList();
        }else if(this.curGirdType == 1){   //1饰品道具
            this.UpdateItemList();
        }
    }

    //更新道具
    UpdateItemList(){
        if(this.curGirdType == 1){  
            this.curGirdType = -1;   //0装备小球，1饰品道具，2技能
            this.initGirdInfo(1);
        }
    }
    UpdateBallList(){
        if(this.curGirdType == 0){  
            this.curGirdType = -1;   //0装备小球，1饰品道具，2技能
            this.initGirdInfo(0);
        }
    }

    /**设置选中的将要移动的地块 */
    setSelectBlock(block: Block){
        this.selectBlock = block;   //拖动的地块数据
    }

    /**拖动更新选中的地块模型的位置 */
    updateSelectBlock(touchPos: cc.Vec2){
        if(this.selectBlock){
            if(this.curGirdType == 0){   //0装备小球
                if(this.nSelectModel == null){
                    this.nSelectModel = cc.instantiate(this.pfStuff);
                    this.nSelectModel.setPosition(-3000, -3000);
                    this.node.addChild(this.nSelectModel, 100);
                }
                let stuff = this.nSelectModel.getComponent(Stuff);
                stuff.setStuffData(this.selectBlock.ballInfo);   //设置地块小球模型数据 
            }else if(this.curGirdType == 1){   //1饰品道具
                if(this.nSelectModel == null){
                    this.nSelectModel = cc.instantiate(this.pfItem);
                    this.nSelectModel.setPosition(-3000, -3000);
                    this.node.addChild(this.nSelectModel, 100);
                }
                let item = this.nSelectModel.getComponent(Item);
                item.initItemByData(this.selectBlock.itemInfo);   //设置地块道具模型数据 
            }

            let pos = this.node.convertToNodeSpaceAR(touchPos);
            this.nSelectModel.setPosition(pos);
        }
    }

    /**放置选中的地块模型 */
    placeSelectBlock(touchPos : cc.Vec2){
        if(this.selectBlock && this.selectBlock){
            if(this.curGirdType == 0){   //0装备小球，1饰品道具，2技能
                let pos = this.gridNode.convertToNodeSpaceAR(touchPos);   //网格
                let rect = cc.rect(-this.gridNode.width/2, -this.gridNode.height/2, this.gridNode.width, this.gridNode.height);
                if(rect.contains(pos)){ 
                    let dropBlock: cc.Node = this.getBlockSlotIndex(touchPos);   //根据位置找到对应的地块
                    if(dropBlock == null){   //未找到合适的地块
                        this.selectBlock.onRecoverSelf();   //复原本地块模型
                    }else{
                        dropBlock.getComponent(Block).onModelDropBlock(this.selectBlock);   //将一个地块上的小球放置到选中的地块上
                    }
                }else{
                    let pos2 = this.equipNode.convertToNodeSpaceAR(touchPos);   //装备
                    let rect2 = cc.rect(-this.equipNode.width/2, -this.equipNode.height/2, this.equipNode.width, this.equipNode.height);
                    if(rect2.contains(pos2)){    //装备新小球
                        let curPageInfo: PlayerInfo = MyUserDataMgr.getPlayerInfoByIdx(this.curPageIdx);
                        if(curPageInfo && curPageInfo.useState == 1){   //已经拥有的炮台
                            let equipBallInfo = null;
                            if(curPageInfo.ballId > 0){
                                equipBallInfo = new BallInfo(curPageInfo.ballId);
                            }
                            curPageInfo.ballId = this.selectBlock.ballInfo.cannonId;

                            this.showPlayerEquip(curPageInfo.ballId);
                            NotificationMy.emit(NoticeType.UpdatePlayerList, curPageInfo);   //更新炮台

                            MyUserDataMgr.updatePlayerFromList(curPageInfo);   //更新炮台到拥有的炮列表
                            MyUserDataMgr.equipBallToPlayer(this.selectBlock.ballInfo.clone(), equipBallInfo);

                            if(equipBallInfo){
                                this.selectBlock.setBallStuff(equipBallInfo.clone());  //设置地块上的小球模型
                            }else{
                                this.selectBlock.onRemoveModel();   //将本地块上的模型移走了
                            }
                        }else{
                            ROOT_NODE.showTipsText(TipsStrDef.KEY_PlayerTip);
                            this.selectBlock.onRecoverSelf();   //复原本地块模型
                        }
                    }else{
                        this.selectBlock.onRecoverSelf();   //复原本地块模型
                    }
                }
            }else if(this.curGirdType == 1){   //1饰品道具
                let pos = this.gridNode.convertToNodeSpaceAR(touchPos);   //网格
                let rect = cc.rect(-this.gridNode.width/2, -this.gridNode.height/2, this.gridNode.width, this.gridNode.height);
                if(rect.contains(pos)){ 
                    let dropBlock: cc.Node = this.getBlockSlotIndex(touchPos);   //根据位置找到对应的地块
                    if(dropBlock == null){   //未找到合适的地块
                        this.selectBlock.onRecoverSelf();   //复原本地块模型
                    }else{
                        dropBlock.getComponent(Block).onModelDropBlock(this.selectBlock);   //将一个地块上的小球放置到选中的地块上
                    }
                }else{
                    let pos2 = this.itemNode.convertToNodeSpaceAR(touchPos);   //道具
                    let rect2 = cc.rect(-this.itemNode.width/2, -this.itemNode.height/2, this.itemNode.width, this.itemNode.height);
                    if(rect2.contains(pos2)){    //新饰品道具
                        let curPageInfo: PlayerInfo = MyUserDataMgr.getPlayerInfoByIdx(this.curPageIdx);
                        if(curPageInfo && curPageInfo.useState == 1){   //已经拥有的炮台
                            let equipItemInfo = null;
                            if(curPageInfo.itemId > 0){
                                equipItemInfo = new ItemInfo(curPageInfo.itemId);
                            }
                            curPageInfo.itemId = this.selectBlock.itemInfo.itemId;

                            this.showPlayerItem(curPageInfo.itemId);
                            NotificationMy.emit(NoticeType.UpdatePlayerList, curPageInfo);   //更新炮台

                            MyUserDataMgr.updatePlayerFromList(curPageInfo);   //更新炮台到拥有的炮列表
                            MyUserDataMgr.equipItemToPlayer(this.selectBlock.itemInfo.clone(), equipItemInfo);

                            if(equipItemInfo){
                                this.selectBlock.setItemModel(equipItemInfo.clone());  //设置地块上的道具模型
                            }else{
                                this.selectBlock.onRemoveModel();   //将本地块上的模型移走了
                            }
                        }else{
                            ROOT_NODE.showTipsText(TipsStrDef.KEY_PlayerTip);
                            this.selectBlock.onRecoverSelf();   //复原本地块模型
                        }
                    }else{
                        this.selectBlock.onRecoverSelf();   //复原本地块模型
                    }
                }
            }

            this.selectBlock = null;   //拖动的地块数据
            this.nSelectModel.setPosition(-3000, -3000);
        }
    }

    /**根据位置找到对应的地块 */
    getBlockSlotIndex(touchPos: cc.Vec2): cc.Node{
        let pos = this.gridNode.convertToNodeSpaceAR(touchPos);
        let blocks = this.gridNode.children;
        for(let i=0; i< blocks.length; i++){
            let len = blocks[i].getPosition().sub(pos).mag();
            if(len <= 100){
                return blocks[i];
            }
        }
        return null;
    }
}
