import { ItemInfo } from "../manager/Enum";
import { st_item_info } from "../manager/ConfigManager";

//道具
const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends cc.Component {

    @property(cc.Node)
    selImg: cc.Node = null;
    @property(cc.Button)
    selBtn: cc.Button = null;

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:

    selCallBack: any = null;   //响应点击选中回调
    selCallTarget: any = null;

    itemInfo: ItemInfo = null;   //道具数据

    onLoad () {
        this.selImg.active = false;
        this.selBtn.enabled = false;   //默认物品不可点击，待背包等回调传来时再启用点击

        this.iconSpr.spriteFrame = null;
        this.nameLabel.string = "";
        this.numLabel.string = "";
    }

    start () {

    }

    // update (dt) {}
    /**选中状态切换 */
    onClicked(){
        if(this.selCallBack && this.selCallTarget){
            if(this.selImg.active == false){
                this.selImg.active = true;
                this.selCallBack.call(this.selCallTarget, this);   //选中回调
            }
        }
    }

    /**显示选中状态 */
    showSelState(bShow:boolean = false){
        this.selImg.active = bShow;
    }

    /**初始化道具数据 */
    initItemData(info: ItemInfo, selCallBack:any=null, selCallTarget:any=null){
        //cc.log("initItemData(), info = "+JSON.stringify(info));
        this.selCallBack = selCallBack;   //响应点击选中回调
        this.selCallTarget = selCallTarget;
        this.itemInfo = info;   //道具数据
        
        if(info){
            this.numLabel.string = "x"+info.count;

            let itemConf: st_item_info = info.itemCfg;
            if(itemConf){
                this.nameLabel.string = itemConf.name;
                this.iconSpr.spriteFrame = this.iconAtlas.getSpriteFrame(info.itemId.toString());
            }
        }

        if(selCallBack && selCallTarget){
            this.selBtn.enabled = true;   //默认物品不可点击，待背包等回调传来时再启用点击
        }
    }
}
