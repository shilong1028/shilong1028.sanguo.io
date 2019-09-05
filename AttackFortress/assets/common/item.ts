import { ItemInfo } from "../manager/Enum";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends cc.Component {

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:
    itemInfo: ItemInfo = null;

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    initItemById(itemId: number){
        this.initItemByData(new ItemInfo(itemId));
    }

    initItemByData(itemInfo: ItemInfo){
        this.itemInfo = itemInfo;
        this.iconSpr.spriteFrame = this.iconAtlas.getSpriteFrame("monster_"+itemInfo.itemId);
        this.nameLabel.string = itemInfo.itemCfg.name;
    }
}
