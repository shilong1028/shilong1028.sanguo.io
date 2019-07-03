import { ItemInfo } from "../manager/Enum";
import { st_item_info } from "../manager/ConfigManager";

//道具
const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends cc.Component {

    @property(cc.Node)
    selImg: cc.Node = null;

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:

    bCanSelEvent: boolean = false;   //是否可以响应点击选中
    itemInfo: ItemInfo = null;   //道具数据

    onLoad () {
        this.selImg.active = false;
        this.iconSpr.spriteFrame = null;
        this.nameLabel.string = "";
        this.numLabel.string = "";
    }

    start () {

    }

    // update (dt) {}

    onClicked(){
        if(this.bCanSelEvent == true){
            if(this.selImg.active == true){
                this.selImg.active = false;
            }else{
                this.selImg.active = true;
            }
        }
    }

    initItemData(info: ItemInfo, bCanSel:boolean=false){
        //cc.log("initItemData(), info = "+JSON.stringify(info));
        this.bCanSelEvent = bCanSel;
        if(info){
            this.numLabel.string = "x"+info.count;

            let itemConf: st_item_info = info.itemCfg;
            if(itemConf){
                this.nameLabel.string = itemConf.name;
                this.iconSpr.spriteFrame = this.iconAtlas.getSpriteFrame(info.itemId.toString());
            }
        }
    }
}
