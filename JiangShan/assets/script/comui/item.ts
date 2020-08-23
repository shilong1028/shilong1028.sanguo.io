import { ItemInfo, st_item_info } from "../manager/ConfigManager";
import RootNode, { ROOT_NODE } from "../login/rootNode";


//道具
const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends cc.Component {

    @property(cc.Node)
    selImg: cc.Node = null;
    @property(cc.Button)
    iconBtn: cc.Button = null;
    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    numLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    selCallBack: any = null;   //响应点击选中回调
    selCallTarget: any = null;

    itemInfo: ItemInfo = null;   //道具数据

    
    //只有在new cc.NodePool(XX)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
    //使用 Pool.put() 回收节点后，会调用unuse 方法
    unuse() {
    }
    //使用 Pool.get() 获取节点后，就会调用reuse 方法
    reuse() {
    }

    onLoad () {
        this.selImg.active = false;
        this.iconBtn.enabled = false;   //默认物品不可点击，待背包等回调传来时再启用点击

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
                this.iconSpr.spriteFrame = ROOT_NODE.iconAtlas.getSpriteFrame(info.itemId.toString());
            }
        }

        if(selCallBack && selCallTarget){
            this.iconBtn.enabled = true;   //默认物品不可点击，待背包等回调传来时再启用点击
        }
    }
}
