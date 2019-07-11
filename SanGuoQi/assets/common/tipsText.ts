import { ROOT_NODE } from "./rootNode";

//提示文本
const {ccclass, property} = cc._decorator;

@ccclass
export default class TipsText extends cc.Component {

    @property(cc.Label)
    tipsLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    //只有在new cc.NodePool(Dot)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
    //使用 Pool.put() 回收节点后，会调用unuse 方法
    unuse() {
    }
    //使用 Pool.get() 获取节点后，就会调用reuse 方法
    reuse() {
        this.tipsLabel.string = "";
        this.node.opacity = 0;   //初始透明
    }

    onLoad () {
        this.tipsLabel.string = "";
        this.node.opacity = 0;   //初始透明
    }

    start () {

    }

    // update (dt) {}

    /**移除自身 */
    handleRemoveMySelf(){
        ROOT_NODE.removeTipsToPool(this.node);   //将砖块回收到缓存池
    }

    initTipsText(tips: string, bRichText: boolean=false){
        this.node.stopAllActions();
        if(bRichText == false){
            this.tipsLabel.string = tips;
        }else{   //富文本
            this.tipsLabel.string = "";
            let richText = this.tipsLabel.addComponent(cc.RichText);
            richText.fontSize = 37;
            richText.string = tips;
        }
        this.node.opacity = 255;   //初始透明
        this.node.runAction(cc.sequence(cc.moveBy(0.2, cc.v2(0, 150)), cc.delayTime(1.0), cc.fadeOut(0.5), cc.callFunc(function(){
            this.handleRemoveMySelf();
        }.bind(this))));
    }
}
