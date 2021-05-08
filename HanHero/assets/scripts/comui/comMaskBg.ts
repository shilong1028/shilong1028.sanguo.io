
import { AudioMgr } from '../manager/AudioMgr';
import UI from '../util/ui';
/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:21:41
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 14:45:36
 * @Description: 
 */

//领取奖励通用提示框
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("ComUI/comMaskBg")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class ComMaskBg extends cc.Component {

    closeTipNode: cc.Node = null;   //点击空白关闭
    bShowCloseTip: boolean = true

    // LIFE-CYCLE CALLBACKS:
    closeCallback: any = null;    //关闭时，子节点（功能节点）的关闭逻辑处理

    onLoad() {
        cc.log("ComMaskBg.onLoad")
        let bg = UI.find(this.node, "bg") 
        bg.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch)=>{
            this.closeLayer();
        });

        this.closeTipNode = UI.find(this.node, "closeTip") 
        //UI.on_click(this.closeTipNode, this.closeLayer.bind(this))
        this.closeTipNode.active = false;
    }

    start() {
        this.node.runAction(cc.sequence(cc.delayTime(1.0), cc.callFunc(()=>{
            this.closeTipNode.active = this.bShowCloseTip;
        })));
    }

     /**
     * 设置是否显示关闭节点
     */
    showCloseTipNode(bShow:boolean=true) {
        this.bShowCloseTip = bShow
        this.closeTipNode.active = false;
    }

     /**
     * 设置关闭时，子节点（功能节点）的关闭逻辑处理
     */
    showCloseCallback(callback:Function) {
        this.closeCallback = callback
    }

    // update (dt) {}

    closeLayer(bForceClose:boolean = false) {
        cc.log("ComMaskBg.closeLayer bForceClose = " + bForceClose)
        if(bForceClose == true){   //强制移除遮罩，一般是子节点销毁后，'active-in-hierarchy-changed' 事件的推送通知
            this.node.destroy(); 
            return;
        }
        if(this.closeTipNode.active){
            AudioMgr.playBtnClickEffect();
            if(this.closeCallback){
                this.closeCallback()
            }else{
                this.node.destroy(); 
            }
        }
    }
}
