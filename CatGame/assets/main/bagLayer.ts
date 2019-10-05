
import { AudioMgr } from "../manager/AudioMgr";
import { NoticeType, TipsStrDef, BallInfo, PlayerInfo, ItemInfo, SkillInfo } from "../manager/Enum";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { NotificationMy } from "../manager/NoticeManager";
import PlayerCell from "./playerCell";
import Block from "./Block";
import { GameMgr } from "../manager/GameManager";
import Stuff from "./Stuff";
import { ROOT_NODE } from "../common/rootNode";
import Item from "../common/item";
import Skill from "../common/skill";


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
    @property(cc.Label)
    skillDesc: cc.Label = null;
    @property(cc.Node)
    gridNode: cc.Node = null;
    @property(cc.Label)
    gridLabel: cc.Label = null; 
    @property(cc.Node)
    delNode: cc.Node = null;   //删除节点

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
    pfSkill: cc.Prefab = null;

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
        NotificationMy.on(NoticeType.UpdateItemList, this.UpdateItemList, this);   //更新道具

        this.delNode.active= false;  //回收站
        this.gridLabel.string = "";
    }

    onDestroy(){
        NotificationMy.offAll(this);
        this.node.targetOff(this);
    }

    start () {
        this.initPageView();

        this.gridLabel.string = "请选择武器装备或合成！";
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
            this.showPlayerSkill(curPlayerInfo.playerCfg.skillId);
        }
    }
    //装备炮弹
    showPlayerEquip(ballId: number){
        this.equipNode.removeAllChildren(true);
        if(ballId > 0){
            let stuffNode = cc.instantiate(GameMgr.getMainScene().pfStuff);
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

    //炮台技能
    showPlayerSkill(skillId: number){
        this.skillNode.removeAllChildren(true);
        if(skillId > 0){
            let skillModel = cc.instantiate(this.pfSkill);
            skillModel.name = "skillModel";
            this.skillNode.addChild(skillModel);

            let skillInfo = new SkillInfo(skillId);
            skillModel.getComponent(Skill).initSkillByData(skillInfo);  //设置地块技能模型数据

            this.skillDesc.string = skillInfo.skillCfg.desc;   //技能描述
        }
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.node.removeFromParent(true);
    }

    onEquipBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.gridLabel.string = "请选择武器装备或合成！";
        this.initGirdInfo(0);  //0装备小球，1饰品道具，2技能
    }

    onItemBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.gridLabel.string = "请选择饰品装备或合成！";
        this.initGirdInfo(1);  //0装备小球，1饰品道具，2技能
    }

    onSkillBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.gridLabel.string = "默认技能说明：";
        this.initGirdInfo(2);  //0装备小球，1饰品道具，2技能
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
        if(this.nSelectModel){
            this.nSelectModel.removeFromParent(true);
        }
        this.nSelectModel = null;

        if(this.curGirdType == 0){   //0装备小球
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
        }else if(this.curGirdType == 2){   //2技能
            this.gridLabel.string = "默认技能说明：";
            let skillModel = this.skillNode.getChildByName("skillModel");
            if(skillModel){
                let skillInfo = skillModel.getComponent(Skill).skillInfo;   //地块技能模型数据
                if(skillInfo){
                    this.gridLabel.string = skillInfo.skillCfg.name + ": "+skillInfo.skillCfg.desc;
                }
            }
        }
    }

    //更新道具
    UpdateItemList(){
        if(this.curGirdType == 1){  
            this.curGirdType = -1;   //0装备小球，1饰品道具，2技能
            this.initGirdInfo(1);
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
            if(this.curGirdType == 0){   //0装备小球
                if(this.nSelectModel == null){
                    this.nSelectModel = cc.instantiate(GameMgr.getMainScene().pfStuff);
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
                item.initItemByData(this.selectBlock.itemInfo, false);   //设置地块道具模型数据 
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
                            // if(this.selectBlock.ballInfo.cannonId < curPageInfo.playerCfg.weapons[0] || this.selectBlock.ballInfo.cannonId > curPageInfo.playerCfg.weapons[1]){
                            //     ROOT_NODE.showTipsText(TipsStrDef.KEY_WeaponTip);
                            //     this.selectBlock.onRecoverSelf();   //复原本地块模型
                            // }else{
                                let equipBallInfo = null;
                                if(curPageInfo.ballId > 0){
                                    equipBallInfo = new BallInfo(curPageInfo.ballId);
                                }
                                curPageInfo.ballId = this.selectBlock.ballInfo.cannonId;
    
                                this.showPlayerEquip(curPageInfo.ballId);
                                NotificationMy.emit(NoticeType.UpdatePlayerList, curPageInfo);   //更新炮台
    
                                MyUserDataMgr.updatePlayerFromList(curPageInfo);   //更新炮台到拥有的炮列表
                                MyUserDataMgr.equipBallFromBallList(this.selectBlock.ballInfo.clone(), equipBallInfo);
    
                                if(equipBallInfo){
                                    this.selectBlock.setBallStuff(equipBallInfo.clone());  //设置地块上的小球模型
                                }else{
                                    this.selectBlock.onRemoveModel();   //将本地块上的模型移走了
                                }
                            }
                        // }else{
                        //     this.selectBlock.onRecoverSelf();   //复原本地块模型
                        // }
                    }else{
                        let pos3 = this.delNode.convertToNodeSpace(touchPos);   //回收站
                        let rect3 = cc.rect(0, 0, this.delNode.width, this.delNode.height);
                        if(rect3.contains(pos3)){ 
                            let sellGold = this.selectBlock.handleSellBall();  
                            this.showDelBallGainAni(sellGold);   //显示售卖士兵收益 
                            this.nSelectModel.setPosition(-3000, -3000);
                        }else{
                            this.selectBlock.onRecoverSelf();   //复原本地块模型
                        }
                    }
                }
            }else if(this.curGirdType == 1){   //1饰品道具
                let pos2 = this.itemNode.convertToNodeSpace(touchPos);   //道具
                let rect2 = cc.rect(0, 0, this.itemNode.width, this.itemNode.height);
                if(rect2.contains(pos2)){    //新饰品道具
                    let curPageInfo: PlayerInfo = MyUserDataMgr.getPlayerInfoByIdx(this.curPageIdx);
                    if(curPageInfo && curPageInfo.useState == 1){   //已经拥有的炮台
                        curPageInfo.itemId = this.selectBlock.itemInfo.itemId;

                        this.showPlayerItem(curPageInfo.itemId);
                        NotificationMy.emit(NoticeType.UpdatePlayerList, curPageInfo);   //更新炮台

                        MyUserDataMgr.updatePlayerFromList(curPageInfo);   //更新炮台到拥有的炮列表
                        //炮台道具的消耗为每场战斗消耗一个（为零则清除炮台道具设定），故在此处切换道具时不做任何处理
                    }
                    this.selectBlock.onRecoverSelf();   //复原本地块模型
                }else{
                    let pos3 = this.delNode.convertToNodeSpace(touchPos);   //回收站
                    let rect3 = cc.rect(0, 0, this.delNode.width, this.delNode.height);
                    if(rect3.contains(pos3)){ 
                        let sellGold = this.selectBlock.handleSellItem();  
                        this.showDelBallGainAni(sellGold);   //显示售卖收益 
                        this.nSelectModel.setPosition(-3000, -3000);
                    }else{
                        this.selectBlock.onRecoverSelf();   //复原本地块模型
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

    /**添加一个小球到地块 */
    addBallToOneBlock(ballInfo: BallInfo){
        if(ballInfo && this.curGirdType == 0){
            let blocks = this.gridNode.children;
            for(let i=0; i<blocks.length; i++){
                let block: Block = blocks[i].getComponent(Block);
                if(block.ballInfo == null){
                    MyUserDataMgr.addBallToBallList(ballInfo.clone(), true);

                    block.setBallStuff(ballInfo);
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
            ROOT_NODE.showTipsText(TipsStrDef.KEY_GetGoldTip + sellGold);

            // let pos = this.bottomNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
            // this.showIconEffectAni(cc.v2(pos.x, pos.y + 60), 0);

            // let gainNode = cc.instantiate(this.pfGainGold);
            // gainNode.setPosition(cc.v2(0, 60));
            // this.bottomNode.addChild(gainNode, 100);
            // gainNode.getComponent(GainGoldNode).showGainGlodVal(sellGold); 
        }
    }
}
