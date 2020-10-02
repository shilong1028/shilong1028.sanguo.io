
import { MyUserMgr } from "../manager/MyUserData";
import TipsText from "./tipsText";
import TipsDialog from "./tipsDialog";
import { GeneralInfo, ItemInfo } from "../manager/ConfigManager";
import Item from "../comui/item";
import GeneralCell from "../comui/general";

//游戏常驻节点
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Login/rootNode")
@executionOrder(-100)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class RootNode extends cc.Component {

    @property(cc.Prefab)
    pfItem: cc.Prefab = null;   //背包道具通用显示
    @property(cc.Prefab)
    pfGeneral: cc.Prefab =  null;   //武将卡牌
    @property(cc.Prefab)
    pfComTop: cc.Prefab = null;   //一级界面上的金币钻石粮草公用控件

    @property(cc.Prefab)
    pfReward: cc.Prefab = null;   //获取奖励通用提示框
    @property(cc.Prefab)
    pfTipsText: cc.Prefab = null;   //提示文本
    @property(cc.Prefab)
    pfTipsDialog: cc.Prefab = null;  //提示框
    @property(cc.Prefab)
    pfLoading: cc.Prefab = null;  //加载进度层
    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;   //引导层

    @property(cc.Prefab)
    pfGoldAdd: cc.Prefab = null;  //获取金币提示框

    @property(cc.SpriteAtlas)
    cicleAtlas: cc.SpriteAtlas = null;   //转圈序列帧
    @property(cc.SpriteAtlas)
    commonAtlas: cc.SpriteAtlas = null;   //通用图集
    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;   //道具图集
    @property(cc.SpriteAtlas)
    officeAtlas: cc.SpriteAtlas = null;  //官职图集

    // LIFE-CYCLE CALLBACKS:

    itemsPool: cc.NodePool =  null;   //道具缓存池
    generalPool: cc.NodePool =  null;   //武将卡牌缓存池

    tipsPool: cc.NodePool =  null;   //缓存池
    tipsArr: any[] = [];   //提示文本数组
    tipsStep: number = 0;   //提示步骤

    onLoad () {
        if(!cc.game.isPersistRootNode(this.node)){
            cc.game.addPersistRootNode(this.node);
            //该组件所在节点标记为「常驻节点」，使它在场景切换时不被自动销毁，常驻内存。注意，是内存，而不是添加到新场景。
            //如此组件可以在场景之间持续作用，可以用来储存玩家信息，或下一个场景初始化时需要的各种数据。
        }
        //在creator的引擎里面只有根节点才能够被成功的设置为常驻节点，这一点貌似官方文档是没用提到的
        ROOT_NODE = this;
    }

    start () {
        this.tipsPool =  new cc.NodePool(TipsText);   //提示缓存池
        for(let i=0; i<3; i++){
            let tip = cc.instantiate(this.pfTipsText);
            this.tipsPool.put(tip);
        }
        //只有在new cc.NodePool(Dot)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
        this.itemsPool =  new cc.NodePool(Item);   //道具缓存池
        for(let i=0; i<3; i++){
            let item = cc.instantiate(this.pfItem);
            this.itemsPool.put(item);
        }

        this.generalPool =  new cc.NodePool(GeneralCell);   //武将卡牌缓存池
        for(let i=0; i<3; i++){
            let general = cc.instantiate(this.pfGeneral);
            this.generalPool.put(general);
        }
    }

    onDestroy(){
        if(this.tipsPool){
            this.tipsPool.clear();
        }
        if(this.itemsPool){
            this.itemsPool.clear();
        }
        if(this.generalPool){
            this.generalPool.clear();
        }
    }

    update (dt) {
        MyUserMgr.updateLineTime(dt);  //总的在线时长（每500s更新记录一次）

        if(this.tipsStep > 0){
            this.tipsStep --;
            if(this.tipsStep <= 0){
                this.tipsStep = 0;
                this.createTipsText();  //创建并提示文本
            }
        }
    }

    //一级界面上的金币钻石粮草公用控件
    showComTopNode(parent: cc.Node, pos: cc.Vec2, zIndex:number=10){
        let topMoney = cc.instantiate(this.pfComTop);
        topMoney.setPosition(pos);
        parent.addChild(topMoney, zIndex);
    }

    /**从缓存池中获取或创建 */
    createTipsFromPool(): cc.Node{
        if (this.tipsPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            return this.tipsPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            return cc.instantiate(this.pfTipsText);
        }
    }

    /**回收到缓存池 */
    removeTipsToPool(tip: cc.Node){
        this.tipsPool.put(tip); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }

    /**显示提示文本 */
    showTipsText(tipStr: string, tipColor: cc.Color = cc.Color.WHITE, tipPos: cc.Vec2 = cc.v2(cc.winSize.width/2, cc.winSize.height/2+100)){
        this.tipsArr.push({str: tipStr, color: tipColor, pos: tipPos});

        if(this.tipsArr.length == 1 && this.tipsStep == 0){
            this.createTipsText();  //创建并提示文本
        }
    }
    //创建并提示文本
    createTipsText(){
        if(this.tipsArr.length <= 0){
            this.tipsStep = 0;
            return;
        }else{
            this.tipsStep = 20;

            let tipInfo = this.tipsArr.shift();

            let tips = this.createTipsFromPool();  //cc.instantiate(this.pfTipsText);
            tips.y = tipInfo["pos"].y;
            tips.x = tipInfo["pos"].x;
            cc.director.getScene().addChild(tips, 10000);
            tips.getComponent(TipsText).initTipsText(tipInfo["str"], tipInfo["color"]);
        }
    }

    //通用提示框
    showTipsDialog(tipStr: string, okCallback: any=null, cancelCall: any=null){
        let tips = cc.instantiate(this.pfTipsDialog);
        tips.y = cc.winSize.height/2;
        tips.x = cc.winSize.width/2;
        cc.director.getScene().addChild(tips);
        tips.getComponent(TipsDialog).setTipStr(tipStr, okCallback, cancelCall);
    }

    // ShowAdResultDialog(){
    //     let dialog = this.node.getChildByName("adResultPrefab");
    //     if(dialog){
    //         return;
    //     }
    //     dialog = cc.instantiate(this.adResultPrefab);
    //     dialog.name = "adResultPrefab"
    //     dialog.y = cc.winSize.height/2;
    //     dialog.x = cc.winSize.width/2;

    //     let bg = dialog.getChildByName("bg");
    //     if(bg){
    //         bg.width = cc.winSize.width;
    //         bg.height = cc.winSize.height;
    //     }

    //     cc.director.getScene().addChild(dialog);
    // }
    updateAdResultDialog(){
        let dialog = cc.director.getScene().getChildByName("adResultPrefab");
        if(dialog){
            //dialog.getComponent(AdResultDialog).updateAdDataLabel();
        }
    }

    //创建道具
    createrItem(info: ItemInfo, bShowTip:boolean=false, selCallBack:any=null){
        let item: cc.Node = null;
        if (this.itemsPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            item = this.itemsPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            item = cc.instantiate(this.pfItem);
        }
        cc.log("创建道具 this.itemsPool.size() = "+this.itemsPool.size())
        item.getComponent(Item).initItemData(info, bShowTip, selCallBack);
        return item;
    }
    removeItem(item: cc.Node){
        this.itemsPool.put(item); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }

    //创建武将头像节点
    createrGeneral(info: GeneralInfo, bClick:boolean=false, bShowTip:boolean=false, selCallBack:any=null){
        let general: cc.Node = null;
        if (this.generalPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            general = this.generalPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            general = cc.instantiate(this.pfGeneral);
        }
        cc.log("创建武将头像节点 this.generalPool.size() = "+this.generalPool.size())
        general.getComponent(GeneralCell).setCellClickEnable(bClick);
        general.getComponent(GeneralCell).initGeneralData(info, bShowTip, selCallBack);
        return general;
    }
    removeGeneral(general: cc.Node){
        this.generalPool.put(general); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }
}

export var ROOT_NODE : RootNode;
