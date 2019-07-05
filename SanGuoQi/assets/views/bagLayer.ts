import { NoticeMgr } from "../manager/NoticeManager";
import { ItemInfo } from "../manager/Enum";
import { MyUserData } from "../manager/MyUserData";
import { st_item_info } from "../manager/ConfigManager";
import { ROOT_NODE } from "../common/rootNode";
import Item from "../common/item";

//背包 背包最多包含30个不同的道具（6*5）
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
        ROOT_NODE.showLayerMoney(this.node, cc.v2(0, 334));    //一级界面上的金币钻石粮草公用控件
    }

    onDestroy(){
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start () {

    }

    // update (dt) {}

    initBagGrid(){
        this.grid.removeAllChildren();
        let defaultSelItem = null;
        for(let i=0; i<MyUserData.ItemList.length; ++i){
            let bagItem: ItemInfo = MyUserData.ItemList[i];

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
        this.node.removeFromParent(true);
    }
}
