
const { ccclass, property, menu, executionOrder, disallowMultiple, executeInEditMode } = cc._decorator;


@ccclass
@menu("自定义组件/Radar")
@executionOrder(-1)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点
@executeInEditMode

export default class Radar extends cc.Component {

    @property(cc.Graphics)
    graphics: cc.Graphics = null;

    @property
    private _side_max_length: number = 100;
    public get side_max_length() {
        return this._side_max_length;
    }
    @property({ type: cc.Integer, min: 1, tooltip: '雷达图的边最大长度', serializable: true })
    public set side_max_length(value) {
        this._side_max_length = value;
        this.drawRadar();
    }

    @property
    private _dot: boolean = true;
    public get dot() {
        return this._dot;
    }
    @property({ type: cc.Boolean, tooltip: '是否绘制顶点', serializable: true })
    public set dot(value) {
        this._dot = value;
        this.drawRadar();
    }

    @property
    private _dotColor: cc.Color = cc.color(0,0,0);
    public get dotColor() {
        return this._dotColor;
    }
    @property({ type: cc.Color, tooltip: '顶点颜色', serializable: true, visible() { return this._dot == true; } })
    public set dotColor(value) {
        this._dotColor = value;
        this.drawRadar();
    }

    @property
    private _stroke: boolean = true;
    public get stroke() {
        return this._stroke;
    }
    @property({ type: cc.Boolean, tooltip: '是否描边', serializable: true })
    public set stroke(value) {
        this._stroke = value;
        this.drawRadar();
    }

    @property
    private _fill: boolean = true;
    public get fill() {
        return this._fill;
    }
    @property({ type: cc.Boolean, tooltip: '是否填充', serializable: true })
    public set fill(value) {
        this._fill = value;
        this.drawRadar();
    }

    @property
    private _side_count: number = 5;
    public get side_count() {
        return this._side_count;
    }
    @property({ type: cc.Integer, min: 3, step: 1, tooltip: '雷达图的边的数量', serializable: true })
    public set side_count(value) {
        this._side_count = value;
        this.drawRadar();
    }

    @property
    private _side_percent: number[] = [100, 100, 100, 100, 100];
    public get side_percent() {
        return this._side_percent;
    }
    @property({ type: [cc.Integer], min: 0, step: 1, tooltip: '每个边的百分比', serializable: true })
    public set side_percent(value) {
        this._side_percent = value;
        this.drawRadar();
    }

    @property
    private _fillColor: cc.Color = cc.color(0,0,0);
    public get fillColor() {
        return this._fillColor;
    }
    @property({ type: cc.Color, tooltip: '填充颜色', serializable: true, visible() { return false; } })
    public set fillColor(value) {
        this._fillColor = value;
        this.drawRadar();
    }

    onLoad() {
        if (!this.graphics) {
            this.graphics = this.addComponent(cc.Graphics);
        }
        this._fillColor = this.graphics.fillColor;
        this.drawRadar();
    }

    drawRadar() {
        this.graphics.clear();
        this.graphics.fillColor = this._fillColor;
        // 每个夹角
        const radians_per = Math.PI * 2 / this.side_count;
        let dotArrs = [];
        for (let side_i = 0; side_i < this.side_count; side_i++) {
            const percent = (this.side_percent[side_i] || 0) / 100;
            // 每个边的长度
            const side_length = this.side_max_length * percent;
            // 初始边放在y轴，多90度
            const radians = side_i * radians_per + Math.PI / 2;
            // 坐标计算 x = r * cos   y = r * sin
            const posX = side_length * Math.cos(radians);
            const posY = side_length * Math.sin(radians);
            dotArrs.push(cc.v2(posX, posY));
            if (side_i === 0) {
                this.graphics.moveTo(posX, posY);
            } else {
                this.graphics.lineTo(posX, posY);
            }
        }
        this.graphics.close();
        if (this.stroke)
            this.graphics.stroke();
        if (this.fill)
            this.graphics.fill();
        if (this.dot){
            let dot_Color = this._dotColor;
            this.graphics.fillColor = dot_Color;
            for (let side_i = 0; side_i < this.side_count; side_i++) {
                const posX = dotArrs[side_i].x;
                const posY = dotArrs[side_i].y;
                this.graphics.circle(posX, posY, 3);
            }
            this.graphics.fill();
            this.graphics.fillColor = this._fillColor;
        }
    }

    changeSidePercent(side_pers:number[], side_max_length:number=100){
        if(side_pers &&　side_pers.length == this._side_count){
            this._side_max_length = side_max_length;
            this._side_percent = side_pers;
            this.drawRadar();
        }
    }
}