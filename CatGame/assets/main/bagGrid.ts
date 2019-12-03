import Block from "./Block";
import { NotificationMy } from "../manager/NoticeManager";
import { AudioMgr } from "../manager/AudioMgr";
import { NoticeType, BallInfo, ItemInfo, PlayerInfo, TipsStrDef } from "../manager/Enum";
import { MyUserDataMgr, MyUserData } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";
import { ROOT_NODE } from "../common/rootNode";
import Stuff from "../common/Stuff";
import Item from "../common/item";
import { GuideMgr, GuideStepEnum } from "../manager/GuideMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BagGrid extends cc.Component {

    @property(cc.Node)
    equipNode: cc.Node = null;   //武器装配节点
    @property(cc.Node)
    itemNode: cc.Node = null;
    @property(cc.Node)
    gridNode: cc.Node = null;
    @property(cc.Node)
    delNode: cc.Node = null;   //删除节点

    @property(cc.Sprite)
    equipBtnSpr: cc.Sprite = null;
    @property(cc.Sprite)
    itemBtnSpr: cc.Sprite = null;
    @property(cc.SpriteFrame)
    btnSprArr: cc.SpriteFrame[] = new Array(2);

    @property(cc.Prefab)
    pfBlock: cc.Prefab = null;

    @property(cc.SpriteAtlas)
    stuffUpAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:

    curGirdType: number = -1;   //0装备小球，1饰品道具，2技能
    nSelectModel: cc.Node = null;   //拖动选择的地块模型
    selectBlock: Block = null;   //拖动的地块数据

    showPlayerInfo: PlayerInfo = null;

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.ontTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.ontTouchEnd, this);

        this.delNode.active= false;  //回收站
    }

    onDestroy(){
        //NotificationMy.offAll(this);
        this.node.targetOff(this);
    }

    start () {
        if(GuideMgr.checkGuide_NewPlayer(GuideStepEnum.Player_Guide_Step3, this.guideSort, this) == false){ 
        }
    }
    //点击排序，让饰品按照品质高低排序。相同品质道具可以拖动升级至高品质。
    guideSort(step: GuideStepEnum){
        GuideMgr.showGuideLayer(null, ()=>{
            GuideMgr.endGuide_NewPlayer(step);
            this.onSortBtn();
        }, cc.size(140, 140), cc.v2(200, 380));
    }

    // update (dt) {}

    onEquipBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.initGirdInfo(0);  //0装备小球，1饰品道具，2技能   
    }

    onItemBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.initGirdInfo(1);  //0装备小球，1饰品道具，2技能
    }

    //排序
    onSortBtn(){
        AudioMgr.playEffect("effect/ui_click");

        if(MyUserData.GoldCount >= 100){
            MyUserDataMgr.updateUserGold(-100);
            
            if(this.curGirdType == 0){
                MyUserDataMgr.sortBallList();
    
                this.curGirdType = -1;
                this.initGirdInfo(0);  //0装备小球，1饰品道具，2技能
            }else if(this.curGirdType == 1){
                MyUserDataMgr.sortItemList();
    
                this.curGirdType = -1;
                this.initGirdInfo(1);  //0装备小球，1饰品道具，2技能
            }
        }else{
            GameMgr.showGoldAddDialog();  //获取金币提示框
        }
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.node.removeFromParent(true);
    }

    onTouchStart(event: cc.Event.EventTouch) {  
        if(this.selectBlock){
            this.delNode.active= true;  //回收站
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
            if(this.curGirdType == 0){
                NotificationMy.emit(NoticeType.BlockBallSel, null);   //地块上小球被选择，相同等级的小球地块要显示光圈
            }else if(this.curGirdType == 1){
                NotificationMy.emit(NoticeType.BlockItemSel, null);   //地块上道具被选择，相同等级的道具地块要显示光圈
            }
        }
    }

    initGirdInfo(gridType: number, showPlayerInfo: PlayerInfo=null){
        if(this.curGirdType == gridType){
            return;
        }
        this.curGirdType = gridType;   //0装备小球，1饰品道具，2技能
        if(showPlayerInfo){
            this.showPlayerInfo = showPlayerInfo;
        }

        this.gridNode.removeAllChildren();
        if(this.nSelectModel){
            this.nSelectModel.removeFromParent(true);
        }
        this.nSelectModel = null;

        if(this.curGirdType == 0){   //0装备小球
            this.equipBtnSpr.spriteFrame = this.btnSprArr[0];
            this.itemBtnSpr.spriteFrame = this.btnSprArr[1];

            let ballList = MyUserDataMgr.getBallListClone();
            for(let i=0; i<GameMgr.BagGridCount; ++i){
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
            this.equipBtnSpr.spriteFrame = this.btnSprArr[1];
            this.itemBtnSpr.spriteFrame = this.btnSprArr[0];

            let itemList = MyUserDataMgr.getItemListClone();
            for(let i=0; i<GameMgr.BagGridCount; ++i){
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

    /**设置选中的将要移动的地块 */
    setSelectBlock(block: Block){
        this.selectBlock = block;   //拖动的地块数据
    }

    /**拖动更新选中的地块模型的位置 */
    updateSelectBlock(touchPos: cc.Vec2){
        if(this.selectBlock){
            if(this.curGirdType == 0){   //0装备小球
                if(this.nSelectModel == null){
                    this.nSelectModel = cc.instantiate(ROOT_NODE.pfStuff);
                    this.nSelectModel.setPosition(-3000, -3000);
                    this.node.addChild(this.nSelectModel, 100);
                }
                let stuff = this.nSelectModel.getComponent(Stuff);
                stuff.setStuffData(this.selectBlock.ballInfo);   //设置地块小球模型数据 
            }else if(this.curGirdType == 1){   //1饰品道具
                if(this.nSelectModel == null){
                    this.nSelectModel = cc.instantiate(ROOT_NODE.pfItem);
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
                        if(this.showPlayerInfo && this.showPlayerInfo.useState == 1){   //已经拥有的炮台
                            let equipBallInfo = null;
                            if(this.showPlayerInfo.ballId > 0){
                                equipBallInfo = new BallInfo(this.showPlayerInfo.ballId);
                            }
                            this.showPlayerInfo.ballId = this.selectBlock.ballInfo.cannonId;

                            NotificationMy.emit(NoticeType.UpdatePlayerList, this.showPlayerInfo);   //更新炮台

                            MyUserDataMgr.updatePlayerFromList(this.showPlayerInfo);   //更新炮台到拥有的炮列表
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
                        let pos3 = this.delNode.convertToNodeSpaceAR(touchPos);   //回收站
                        let rect3 = cc.rect(-this.delNode.width/2, -this.delNode.height/2, this.delNode.width, this.delNode.height);
                        if(rect3.contains(pos3)){ 
                            let sellGold = this.selectBlock.handleSellBall();  
                            GameMgr.showDelGainAni(sellGold);   //显示售卖士兵收益 
                            this.nSelectModel.setPosition(-3000, -3000);
                        }else{
                            this.selectBlock.onRecoverSelf();   //复原本地块模型
                        }
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
                        if(this.showPlayerInfo && this.showPlayerInfo.useState == 1){   //已经拥有的炮台
                            let equipItemInfo = null;
                            if(this.showPlayerInfo.itemId > 0){
                                equipItemInfo = new ItemInfo(this.showPlayerInfo.itemId);
                            }
                            this.showPlayerInfo.itemId = this.selectBlock.itemInfo.itemId;

                            NotificationMy.emit(NoticeType.UpdatePlayerList, this.showPlayerInfo);   //更新炮台

                            MyUserDataMgr.updatePlayerFromList(this.showPlayerInfo);   //更新炮台到拥有的炮列表
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
                        let pos3 = this.delNode.convertToNodeSpaceAR(touchPos);   //回收站
                        let rect3 = cc.rect(-this.delNode.width/2, -this.delNode.height/2, this.delNode.width, this.delNode.height);
                        if(rect3.contains(pos3)){ 
                            let sellGold = this.selectBlock.handleSellItem();  
                            GameMgr.showDelGainAni(sellGold);   //显示售卖收益 
                            this.nSelectModel.setPosition(-3000, -3000);
                        }else{
                            this.selectBlock.onRecoverSelf();   //复原本地块模型
                        }
                    }
                }
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
                return blocks[i];
            }
        }
        return null;
    }

}
