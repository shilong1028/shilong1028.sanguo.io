import { ItemInfo, st_item_info } from "../manager/ConfigManager";
import RootNode, { ROOT_NODE } from "../login/rootNode";
import { AudioMgr } from "../manager/AudioMgr";


//道具
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("ComUI/item")
@executionOrder(-1)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

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
    bShowTip: boolean = false;   //点击Cell是否弹出描述提示
    itemInfo: ItemInfo = null;   //道具数据

    
    //只有在new cc.NodePool(XX)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
    //使用 Pool.put() 回收节点后，会调用unuse 方法
    unuse() {
        //cc.log("item unuse ")
        this.initView();
    }
    //使用 Pool.get() 获取节点后，就会调用reuse 方法
    reuse() {
        //cc.log("item reuse ")
        this.initView();
    }

    onLoad () {
        //cc.log("item onLoad ")
    }

    initView(){
        this.selImg.active = false;  //默认点击不会显示选中框，只有设定回调函数才会点击显示选中框

        this.iconSpr.spriteFrame = null;
        this.nameLabel.string = "";
        this.numLabel.string = ""; 
    }

    start () {

    }

    // update (dt) {}
    /**选中状态切换 */
    onClicked(){
        AudioMgr.playBtnClickEffect();
        //默认物品点击弹出道具详情，如有设定回调，则点击响应回调函数
        if(this.selCallBack){
            if(this.selImg.active == false){    //防止多次点击多次回调
                this.showSelState(true)
                this.selCallBack(this);   //选中回调
            }
        }else if(this.bShowTip){
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
     * 调用顺序为 reuse  ->  initItemData  ->  onLoad
    */
    initItemData(info: ItemInfo, bShowTip:boolean=false, selCallBack:any=null){
        //cc.log("initItemData(), info = "+JSON.stringify(info));
        this.bShowTip = bShowTip;
        this.selCallBack = selCallBack;   //响应点击选中回调
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
