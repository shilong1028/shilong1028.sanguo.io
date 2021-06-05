/*
 * @Autor: dongsl
 * @Date: 2020-10-22 17:46:14
 * @LastEditors: dongsl
 * @LastEditTime: 2021-06-04 13:56:43
 * @Description: 刮刮乐
 */
/******************************************
 * 刮刮乐 节点结构为
 * scratchCardBg  一张普通的刮刮乐背景，有如下子节点
 * - resultLabel  一个结果通知文本Label
 * - maskNode     一个遮罩节点，有mask组件，大小为size(0,0)，mask.type = RECT, mask.inverted=true
 * -- content     maskNode子节点，一个刮刮乐上层图层精灵纹理，用于遮盖结果，其可以包含一个子节点promptLabel"刮开有奖"
 * 
 * 其实遮罩就是一个盖板，盖住了就看不到它的子节点了，但是如果我在遮罩中间掏个洞，那我就可以透过这个洞看到里面的东西。
 * 正向遮罩就是我看不到后面的东西，反向遮罩就是我可以看到后面的东西。
 * 如果我们把遮罩的长宽都设置为0，那等于这个遮罩什么用都没有，因为它的面积是0，所以它的子节点就能够完全暴露在画面上，所以我们能够看到涂层图片。
 * 
 * 然后我们把刮的操作理解为更改这个遮罩的形状，本来它的面积是0，但是当用户刮的时候，我就给它赋予一个长宽，比如我把它的长宽变成10，那这个遮罩就从一个点（长宽为0）
 * 变成了一个长宽为10的正方形。而我们设置了这个遮罩类型为反向遮罩，所以我们就能透过这个正方形看到刮刮卡底层的内容了。这就解析了为什么我们需要勾选反向遮罩。
 * 
 * 
 ******************************************/
const { ccclass, property, menu, executionOrder, disallowMultiple, executeInEditMode } = cc._decorator;

@ccclass
@disallowMultiple()
@menu('自定义组件/ScratchCardNodeCtrl')
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@executionOrder(-1)
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点
@executeInEditMode

export default class ScratchCardNodeCtrl extends cc.Component
{
    // //一个结果通知文本Label
    // @property({
    //     type: cc.Label,
    //     tooltip: CC_DEV && '结果通知文本Label',
    // })
    // rsultLabel: cc.Label = null;

    //一个遮罩节点mask组件
    @property({
        type: cc.Mask,
        tooltip: CC_DEV && '遮罩节点mask组件',
    })
    mask: cc.Mask = null;

    //划痕半径
    @property({
        type: cc.Integer,
        range: [10, 60, 1],
        tooltip: CC_DEV && '划痕半径',
        slide: true,
    })
    mask_radio: number = 30;

    // //一个提示文本Label"刮开有奖"
    // @property({
    //     type: cc.Label,
    //     tooltip: CC_DEV && '提示文本刮开有奖',
    // })
    // promptLabel: cc.Label = null;

    onLoad()
    {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }

    onEnable()
    {
    }

    onDestroy()
    {
		this._resetMask()   //不clear()的话内存会越画越多
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }

    _onTouchBegin(touch: cc.Touch)
    {
        var point = touch.getLocation();
        point = this.node.convertToNodeSpaceAR(point);
        this._addCircle(point);
    }
    _onTouchMoved(touch: cc.Touch)
    {
        var point = touch.getLocation();
        point = this.node.convertToNodeSpaceAR(point);
        this._addCircle(point);
    }

    _onTouchEnd(touch: cc.Touch)
    {
        var point = touch.getLocation();
        point = this.node.convertToNodeSpaceAR(point);
        this._addCircle(point);

        // this.node.runAction(cc.sequence(cc.delayTime(1.0), cc.callFunc(() =>
        // {
        //     this._resetMask()
        // })))
    }
    _onTouchCancel(touch: cc.Touch)
    {
    }

    _addCircle(point)
    {
        //var stencil = this.mask._clippingStencil;
        /**
         * _clippingStencil是Mask组件内部实现遮罩的东西，用于给cc.ClippingNode（cocos2dx的遮罩节点）作stencil。
         * 如果Mask组件是RECT或ELLIPSE模式，那_clippingStencil就是一个cc.DrawNode（也是cocos2dx的东西，理解为cc.Graphics），
         * 通过画一个矩形或者椭圆来生成遮罩模板stencil（所以楼主的功能要实现必须设置Mask的Type属性为RECT或ELLIPSE）。
         * cc.ClippingNode和cc.DrawNode是cocos2dx的东西，不在Creator的官方API中，最好通过Mask组件使用，但是直接操作它可以获得更大的自由度。
         */
        // var color = cc.color(255, 255, 255, 0);
        // stencil.drawPoly(this.mask._calculateCircle(point, cc.p(50, 50), 64), color, 0, color);
        // if (!CC_JSB)
        // {
        //     cc.renderer.childrenOrderDirty = true;
        // }

        //2.0.5上使用的话需要修改下_addCircle:function函数
        let mask: any = this.mask;  //this.node.getComponent(cc.Mask)
        var stencil = mask._graphics;
        stencil.circle(point.x, point.y, this.mask_radio);
        stencil.fillColor = cc.Color.WHITE;
        stencil.fill();
    }

    //重置涂层
    _resetMask()
    {
        let mask: any = this.mask;  //this.node.getComponent(cc.Mask)
        var stencil = mask._graphics;
        stencil.clear()
    }
}
