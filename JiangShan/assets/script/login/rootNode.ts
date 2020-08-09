
import { MyUserMgr } from "../manager/MyUserData";
import TipsText from "./tipsText";
import TipsDialog from "./tipsDialog";

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
    pfCard: cc.Prefab =  null;   //武将卡牌
    @property(cc.Prefab)
    pfMoney: cc.Prefab = null;   //一级界面上的金币钻石粮草公用控件

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
    adResultPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    pfGoldAdd: cc.Prefab = null;  //获取金币提示框

    // LIFE-CYCLE CALLBACKS:

    tipsPool: cc.NodePool =  null;   //缓存池
    tipsArr: string[] = new Array();   //提示文本数组
    tipsStep: number = 0;   //提示步骤

    onLoad () {
        (cc.game as any).addPersistRootNode(this.node);
        //在creator的引擎里面只有根节点才能够被成功的设置为常驻节点，这一点貌似官方文档是没用提到的
        ROOT_NODE = this;
    }

    start () {
        //this.tipsPool =  new cc.NodePool(TipsText);   //砖块缓存池
        //只有在new cc.NodePool(Dot)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
    }

    onDestroy(){
        // if(this.tipsPool){
        //     this.tipsPool.clear();
        // }
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
    showLayerMoney(parent: cc.Node, pos: cc.Vec2, zIndex:number=10){
        let topMoney = cc.instantiate(this.pfMoney);
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
    removeTipsToPool(brick: cc.Node){
        this.tipsPool.put(brick); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }

    /**显示提示文本 */
    showTipsText(tipStr: string){
        this.tipsArr.push(tipStr);

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

            let tipStr = this.tipsArr.shift();

            let tips = cc.instantiate(this.pfTipsText);
            tips.y = 700;
            tips.x = cc.winSize.width/2;
            cc.director.getScene().addChild(tips);
            tips.getComponent(TipsText).initTipsText(tipStr);
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

    ShowAdResultDialog(){
        let dialog = this.node.getChildByName("adResultPrefab");
        if(dialog){
            return;
        }
        dialog = cc.instantiate(this.adResultPrefab);
        dialog.name = "adResultPrefab"
        dialog.y = cc.winSize.height/2;
        dialog.x = cc.winSize.width/2;

        let bg = dialog.getChildByName("bg");
        if(bg){
            bg.width = cc.winSize.width;
            bg.height = cc.winSize.height;
        }

        cc.director.getScene().addChild(dialog);
    }
    updateAdResultDialog(){
        let dialog = cc.director.getScene().getChildByName("adResultPrefab");
        if(dialog){
            //dialog.getComponent(AdResultDialog).updateAdDataLabel();
        }
    }
}

export var ROOT_NODE : RootNode;
