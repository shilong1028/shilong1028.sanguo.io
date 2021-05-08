
import UI from '../util/ui';

//通用提示界面
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Login/tipsDialog")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class TipsDialog extends cc.Component {

    okBtn: cc.Node = null;
    cancelBtn: cc.Node = null;
    descLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    callback: any = null;
    cancelCall: any = null;
    costNum: number = 0;

    onLoad () {
        this.okBtn = UI.find(this.node, "okBtn")
        this.cancelBtn = UI.find(this.node, "cancelBtn")
        this.descLabel = UI.find(this.node, "descLabel").getComponent(cc.Label)
        this.descLabel.string = "";

        //this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        UI.on_btn_click(this.okBtn, this.onOkBtn.bind(this)) 
        UI.on_btn_click(this.cancelBtn, this.onCancelBtn.bind(this)) 
    }

    start () {
    }

    // update (dt) {}

    touchEnd(event: cc.Touch){
        // let pos1 = this.bgImg.convertToNodeSpace(event.getLocation());
        // let rect1 = cc.rect(0, 0, this.bgImg.width, this.bgImg.height);
        // if(!rect1.contains(pos1)){
        //     this.onCloseBtn();
        // }
    }

    /**
     * 关闭界面，如果有MaskBg父节点，则MaskBg在监听到本节点销毁并active=false时，会自动destoryMask。
     */
    private closeLayer() {
        this.node.destroy();
    }


    onCancelBtn(){
        if(this.cancelCall){
            this.cancelCall();
        }
        this.closeLayer();
    }

    onOkBtn(){
        if(this.callback){
            this.callback();
        }
        this.closeLayer();
    }

    setTipStr(str: string, okCallback: any, cancelCallback?: any){
        this.callback = okCallback;
        this.cancelCall = cancelCallback;
        this.descLabel.string = str;
    }
}
