import { NoticeMgr } from "../manager/NoticeManager";
import { ItemInfo } from "../manager/Enum";
import { MyUserData } from "../manager/MyUserData";
import { st_item_info } from "../manager/ConfigManager";
import { ROOT_NODE } from "../common/rootNode";
import Item from "../common/item";

//背包 背包最多包含9个不同的道具（3*3）
const {ccclass, property} = cc._decorator;

@ccclass
export default class BagLayer extends cc.Component {
    @property(cc.Node)
    grid: cc.Node = null;

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    numLabel: cc.Label = null;
    @property(cc.Label)
    descLabel: cc.Label = null;

    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.updateSelItemInfo(null);  //显示底部选中道具信息
        this.initBagGrid();
        ROOT_NODE.showLayerMoney(this.node, cc.v2(0, 380));    //一级界面上的金币钻石粮草公用控件
    }

    onDestroy(){
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start () {

    }

    // update (dt) {}

    initBagGrid(){
        this.grid.destroyAllChildren();
        let defaultSelItem = null;
        for(let i=0; i<MyUserData.ItemList.length && i<9; ++i){
            let bagItem: ItemInfo = MyUserData.ItemList[i].clone();

            let itemNode = cc.instantiate(ROOT_NODE.pfItem);
            this.grid.addChild(itemNode, 10);
            let item = itemNode.getComponent(Item);
            item.initItemData(bagItem, this.handleSelItem, this);
            if(defaultSelItem == null){
                defaultSelItem = item;
            }
        }
        if(defaultSelItem){
            defaultSelItem.showSelState(true);   //显示选中状态
            this.updateSelItemInfo(defaultSelItem.itemInfo);  //显示底部选中道具信息
        }
    }

    handleSelItem(item: Item){
        this.grid.children.forEach((node, index)=>{
            node.getComponent(Item).showSelState(false);   //显示选中状态
        })
        item.showSelState(true);   //显示选中状态
        this.updateSelItemInfo(item.itemInfo);  //显示底部选中道具信息
    }

    /**显示底部选中道具信息 */
    updateSelItemInfo(itemInfo: ItemInfo){
        this.iconSpr.spriteFrame = null;
        this.nameLabel.string = "";
        this.numLabel.string = "";
        this.descLabel.string = "";

        if(itemInfo){
            this.numLabel.string = "x"+itemInfo.count;
            let itemConf: st_item_info = itemInfo.itemCfg;
            if(itemConf){
                this.nameLabel.string = itemConf.name;
                this.iconSpr.spriteFrame = this.iconAtlas.getSpriteFrame(itemInfo.itemId.toString());
                this.descLabel.string = itemConf.desc;
            }
        }
    }

    onCloseBtn(){
        this.node.destroy();
    }

    /**
     * 游戏中，金锭与金币、粮草等资源之间兑换关系为：1人民币= 10金币=1000贯钱；1人民币=10石粮草= 1000斤粮草；100贯钱=100斤粮=1金币=1石粮草。
     * 金锭是特殊货币，主要由充值、活动、广告产出。金锭兑换金币时，1金锭=1000金币。但是如果是金币兑换金锭时为2000金币=1金锭。
        游戏中，每千名士兵每月（自然日24h）消耗300石粮300金币（30000斤粮草30000贯钱），即每人每月消耗30斤粮30贯钱。
        游戏中，每个游戏月（自然日24h）金币、粮草的税率分别为每万人100金币、每万人100石、即每人每月需要向官府缴纳1贯钱、1斤粮。

     */
}
