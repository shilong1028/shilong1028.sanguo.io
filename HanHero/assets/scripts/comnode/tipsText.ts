/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:44:18
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 14:54:00
 * @Description: 
 */
import { ROOT_NODE } from "../login/rootNode";
import UI from '../util/ui';

//提示文本
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Login/tipsText")
@executionOrder(-1)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class TipsText extends cc.Component {

    tipsLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    //只有在new cc.NodePool(Dot)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
    //使用 Pool.put() 回收节点后，会调用unuse 方法
    unuse() {
    }
    //使用 Pool.get() 获取节点后，就会调用reuse 方法
    reuse() {
    }

    onLoad() {
        //如果是缓存池的节点，则调用顺序为 reuse -> initItemData-> onLoad，故如果在OnLoad.initView则会刷掉initTipsText的数据
    }

    initView() {
        this.tipsLabel = UI.find(this.node, "tips").getComponent(cc.Label)
        this.tipsLabel.string = "";
        this.node.opacity = 0;   //初始透明
    }

    start() {
    }

    // update (dt) {}

    /**移除自身 */
    handleRemoveMySelf() {
        ROOT_NODE.removeTipsToPool(this.node);   //将砖块回收到缓存池
    }

    /**显示提示内容文本 */
    initTipsText(tips: string, tipColor: cc.Color = cc.Color.WHITE) {
        this.initView();
        this.node.stopAllActions();
        this.tipsLabel.node.color = tipColor;
        this.tipsLabel.string = tips;
        this.node.opacity = 255;   //初始透明
        this.node.runAction(cc.sequence(cc.moveBy(0.5, cc.v2(0, 200)), cc.delayTime(1.0), cc.spawn(cc.fadeOut(0.5), cc.moveBy(0.3, cc.v2(0, 200))), cc.callFunc(function () {
            this.handleRemoveMySelf();
        }.bind(this))));
    }
}
