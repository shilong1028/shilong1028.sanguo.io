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
    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:
    itemInfo: ItemInfo = null;

    onLoad () {
        this.iconSpr.spriteFrame = null;
        this.nameLabel.string = "";
        this.numLabel.string = "";
    }

    start () {

    }

    // update (dt) {}

    initItemById(itemId: number){
        this.initItemByData(new ItemInfo(itemId), false);
    }

    initItemByData(itemInfo: ItemInfo, bshowNum: boolean){
        this.itemInfo = itemInfo;
        this.iconSpr.spriteFrame = this.iconAtlas.getSpriteFrame("item_"+itemInfo.itemId);
        this.colorSpr.spriteFrame = this.iconAtlas.getSpriteFrame("colorBg"+itemInfo.itemCfg.quality);
        this.nameLabel.string = itemInfo.itemCfg.name;
        if(bshowNum){
            this.numLabel.string = itemInfo.itemNum.toString();
        }else{
            this.numLabel.string = "";
        }
    }
}
