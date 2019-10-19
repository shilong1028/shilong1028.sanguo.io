
import { AudioMgr } from "../manager/AudioMgr";
import { NoticeType, BallInfo, ItemInfo } from "../manager/Enum";
import { GameMgr } from "../manager/GameManager";
import Stuff from "./Stuff";
import Item from "../common/item";
import BagGridBlock from "./bagGridBlock";
import { NotificationMy } from "../manager/NoticeManager";
import { MyUserDataMgr } from "../manager/MyUserData";


const {ccclass, property} = cc._decorator;

@ccclass
export default class BagGrid extends cc.Component {

    @property(cc.Node)
    delNode: cc.Node = null;   //删除节点
    @property(cc.Node)
    gridNode: cc.Node = null;

    @property(cc.Prefab)
    pfGridBlock: cc.Prefab = null;
    @property(cc.Prefab)
    pfItem: cc.Prefab = null;
    @property(cc.Prefab)
    pfStuff: cc.Prefab = null;

    @property(cc.SpriteAtlas)
    stuffUpAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:

    curGirdType: number = -1;   //0装备小球，1饰品道具，2技能

    nSelectModel: cc.Node = null;   //拖动选择的地块模型
    selectBlock: BagGridBlock = null;   //拖动的地块数据

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
    }

    // update (dt) {}

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
            NotificationMy.emit(NoticeType.BlockGridSel, null);    //全部背包中武器或道具被选中
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
    
                let node = cc.instantiate(this.pfGridBlock);
                this.gridNode.addChild(node);
                let block = node.getComponent(BagGridBlock);
                block.initBlockByBall(i, ballInfo, this);
            }
        }else if(this.curGirdType == 1){   //1饰品道具
            let itemList = MyUserDataMgr.getItemListClone();
            for(let i=0; i<GameMgr.BagGridCount; ++i){
                let itemInfo: ItemInfo = null;
                if(i < itemList.length){
                    itemInfo = itemList[i];
                }
    
                let node = cc.instantiate(this.pfGridBlock);
                this.gridNode.addChild(node);
                let block = node.getComponent(BagGridBlock);
                block.initBlockByItem(i, itemInfo, this);
            }
        }
    }

    /**设置选中的将要移动的地块 */
    setSelectBlock(block: BagGridBlock){
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
            let pos = this.gridNode.convertToNodeSpaceAR(touchPos);   //网格
            let rect = cc.rect(-this.gridNode.width/2, -this.gridNode.height/2, this.gridNode.width, this.gridNode.height);
            if(rect.contains(pos)){ 
                let dropBlock: cc.Node = this.getBlockSlotIndex(touchPos);   //根据位置找到对应的地块
                if(dropBlock == null){   //未找到合适的地块
                    this.selectBlock.onRecoverSelf();   //复原本地块模型
                }else{
                    dropBlock.getComponent(BagGridBlock).onModelDropBlock(this.selectBlock);   //将一个地块上的小球放置到选中的地块上
                }
            }else{
                let pos3 = this.delNode.convertToNodeSpaceAR(touchPos);   //回收站
                let rect3 = cc.rect(-this.delNode.width/2, -this.delNode.height/2, this.delNode.width, this.delNode.height);
                if(rect3.contains(pos3)){ 
                    this.nSelectModel.setPosition(-3000, -3000);

                    if(this.curGirdType == 0){   //0装备小球，1饰品道具，2技能
                        let sellGold = this.selectBlock.handleSellBall();  
                        GameMgr.showDelGainAni(sellGold);   //显示售卖士兵收益 
                    }else if(this.curGirdType == 1){   //1饰品道具
                        let sellGold = this.selectBlock.handleSellItem();  
                        GameMgr.showDelGainAni(sellGold);   //显示售卖收益 
                    }
                }else{
                    this.selectBlock.onRecoverSelf();   //复原本地块模型
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

    onCloseBtn(){
        NotificationMy.emit(NoticeType.UpdateBagGrid, null);    //更新背包显示

        AudioMgr.playEffect("effect/ui_click");
        this.node.removeFromParent(true);
    }

}
