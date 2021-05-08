/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:47:03
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 14:50:21
 * @Description: 
 */

/******************************************
 * 气泡Label脚本，自适应宽和高
 * 先将Label设定为overflow 设置为 NONE，
 * 然后根据设定的maxWidth来控制Label的overflow方式
 * 如果width > maxWidth，则改overflow为 RESIZE_HEIGHT
 
 ******************************************/
const { ccclass, property, disallowMultiple, menu, executionOrder, requireComponent } = cc._decorator;

@ccclass
@disallowMultiple()
@menu('自定义组件/BubbleLabel')
@requireComponent(cc.Label)
@executionOrder(-1001)
export default class BubbleLabel extends cc.Component {
    private _maxWidth: number = 100;
    @property({ type: cc.Integer, tooltip: CC_DEV && '最大宽度', })
    set maxWidth(val: number) {
        this._maxWidth = val;
        if (this._maxWidth <= 0) {
            this._maxWidth = 1;
        }
    }
    get maxWidth() {
        return this._maxWidth;
    }

    private _inited: boolean = false;
    private _label: cc.Label;
    get label() {
        return this._label;
    }

    onLoad() {
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
        this._init();
    }

    onEnable() {
        this._init();
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
    }

    //初始化各种..
    _init() {
        if (this._inited)
            return;
        //console.log("BubbleLabel _init this._maxWidth = "+this._maxWidth)
        this._label = this.node.getComponent(cc.Label);
        this._label.overflow = cc.Label.Overflow.NONE;

        this._inited = true;
    }

    _onSizeChange() {
        if (this._inited != true)
            return;
        //console.log("BubbleLabel _onSizeChange this.node.width = "+this.node.width+"; this._maxWidth = "+this._maxWidth+"; this._label.overflow = "+this._label.overflow)
        if (this.node.width >= this._maxWidth) { //maxWidth气泡最大宽度
            if (this._label.overflow != cc.Label.Overflow.RESIZE_HEIGHT) {
                this._label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
                this.node.width = this._maxWidth;
            }
        } else {
            if (this._label.overflow != cc.Label.Overflow.NONE) {
                this._label.overflow = cc.Label.Overflow.NONE;
            }
        }
    }


}
