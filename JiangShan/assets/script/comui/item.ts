import { ItemInfo, st_item_info } from "../manager/ConfigManager";
import RootNode, { ROOT_NODE } from "../login/rootNode";


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

    // LIFE-CYCLE CALLBACKS:

    selCallBack: any = null;   //响应点击选中回调
    selCallTarget: any = null;

    itemInfo: ItemInfo = null;   //道具数据

    
    //只有在new cc.NodePool(XX)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
    //使用 Pool.put() 回收节点后，会调用unuse 方法
    unuse() {
        cc.log("item unuse ")
        this.initView();
    }
    //使用 Pool.get() 获取节点后，就会调用reuse 方法
    reuse() {
        cc.log("item reuse ")
        this.initView();
    }

    onLoad () {
        cc.log("item onLoad ")
    }

    initView(){
        this.selImg.active = false;  //默认物品点击不会显示选中框，只有设定回调函数才会点击显示选中框

        this.iconSpr.spriteFrame = null;
        this.nameLabel.string = "";
        this.numLabel.string = ""; 
    }

    start () {

    }

    // update (dt) {}
    /**选中状态切换 */
    onClicked(){
        //默认物品点击弹出道具详情，如有设定回调，则点击响应回调函数
        if(this.selCallBack && this.selCallTarget){
            if(this.selImg.active == false){
                this.showSelState(true)
                this.selCallBack.call(this.selCallTarget, this);   //选中回调
            }
        }else{
            if(this.itemInfo && this.itemInfo.itemCfg){
                ROOT_NODE.showTipsText(this.itemInfo.itemCfg.desc);
            }
        }
    }

    /**显示选中状态 */
    showSelState(bShow:boolean = false){
        this.selImg.active = bShow;
    }

    /**初始化道具数据 
     * 注意，item是通过rootNode缓存池获取后调用initItemData，后添加到响应父节点（即调动onLoad之类的）
    */
    initItemData(info: ItemInfo, selCallBack:any=null, selCallTarget:any=null){
        cc.log("initItemData(), info = "+JSON.stringify(info));
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
    }
}
