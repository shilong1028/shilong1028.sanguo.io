import { ItemInfo } from "../manager/Enum";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends cc.Component {

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;
    @property(cc.Sprite)
    colorSpr: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:
    itemInfo: ItemInfo = null;

    onLoad () {
        this.iconSpr.spriteFrame = null;
        this.nameLabel.string = "";
    }

    start () {

    }

    // update (dt) {}

    initItemById(itemId: number){
        this.initItemByData(new ItemInfo(itemId));
    }

    initItemByData(itemInfo: ItemInfo){
        this.itemInfo = itemInfo;
        this.iconSpr.spriteFrame = this.iconAtlas.getSpriteFrame("item_"+itemInfo.itemCfg.res);
        this.colorSpr.spriteFrame = this.iconAtlas.getSpriteFrame("colorBg_"+itemInfo.itemCfg.quality);
        this.nameLabel.string = itemInfo.itemCfg.name;
    }
}
