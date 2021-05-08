/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:47:03
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 14:52:39
 * @Description: 炫彩文字
 */

class ColorData {
    pluss: boolean;
    num: number;
    min: number;
    max: number;
    constructor(pluss: boolean, num: number, min: number = 0, max: number = 255) {
        this.pluss = pluss;
        this.num = num;
        this.min = min;
        this.max = max;
    }
}

const { ccclass, property, disallowMultiple } = cc._decorator;
@ccclass
@disallowMultiple()
export default class ColorAssemberComponent extends cc.Component {
    private originColor: cc.Color = cc.Color.WHITE;
    private bRichColor: boolean = false;   //是否炫彩
    private colorDatas: ColorData[] = []; //初始数据
    private bHadOutline: boolean = false;   //是否原本就要labelOutline组件
    private bResetRich: boolean = false;   //控件是否被setNormalColor后被重置为炫彩，用于添加labelOutline组件

    onLoad() {
        this.colorDatas = [new ColorData(true, 255, 170, 230), new ColorData(true, 220, 30, 100),
        new ColorData(true, 168, 170, 254), new ColorData(true, 50, 20, 100),
        new ColorData(true, 181, 170, 254), new ColorData(true, 64, 10, 100),
        new ColorData(true, 168, 170, 230), new ColorData(true, 255, 30, 100)
        ]
    }
    onDestroy() {
        this.setNormalColor();
    }

    start() {
        this.originColor = this.node.color;
        this.bHadOutline = false;   //是否为了炫彩特效添加指定的labelOutline组件
        let outlineComp = this.node.getComponent(cc.LabelOutline);
        if (outlineComp) {
            this.bHadOutline = true;
        }
        if (this.bRichColor) {
            if (!outlineComp) {
                outlineComp = this.node.addComponent(cc.LabelOutline);
                outlineComp.color = new cc.Color(34, 42, 53, 192);
                outlineComp.width = 2;
            }
            this.node.color = cc.Color.WHITE;
            outlineComp.enabled = true;
        }
    }

    onEnable() {
        // if(this.bRichColor){
        //     cc.director.on(cc.Director.EVENT_AFTER_DRAW, this.onEventAfterDraw, this);
        // }
    }

    onDisable() {
        //cc.director.off(cc.Director.EVENT_AFTER_DRAW, this.onEventAfterDraw, this);
    }

    update() {
        //update比监听cc.Director.EVENT_AFTER_DRAW效率更好
        if (this.bRichColor) {
            this.onEventAfterDraw();
        }
    }

    public setRichColor(colorDatas?: ColorData[]) {
        this.bRichColor = true;   //是否炫彩
        if (colorDatas) this.colorDatas = colorDatas;
        if (this.bResetRich) {   //控件是否被setNormalColor后被重置为炫彩
            let outlineComp = this.node.getComponent(cc.LabelOutline);
            if (!outlineComp) {
                outlineComp = this.node.addComponent(cc.LabelOutline);
                outlineComp.color = new cc.Color(34, 42, 53, 192);
                outlineComp.width = 2;
            }
            this.node.color = cc.Color.WHITE;
            outlineComp.enabled = true;
        }
        // cc.director.off(cc.Director.EVENT_AFTER_DRAW, this.onEventAfterDraw, this);
        // cc.director.on(cc.Director.EVENT_AFTER_DRAW, this.onEventAfterDraw, this);
    }

    //清除炫彩昵称 originColor原本字体颜色，默认取炫彩组件添加时获取的颜色
    public setNormalColor(originColor?: cc.Color) {
        if (this.bRichColor) {   //之前为炫彩
            this.node['_renderFlag'] |= cc['RenderFlow'].FLAG_COLOR;  //告诉引擎重新渲染这个颜色
        }
        this.bRichColor = false;   //是否炫彩
        this.bResetRich = true;   //控件是否被setNormalColor后被重置为炫彩，用于添加labelOutline组件
        //cc.director.off(cc.Director.EVENT_AFTER_DRAW, this.onEventAfterDraw, this);
        if (originColor) {
            this.originColor = originColor;
        }

        if (!cc.isValid(this.node)) return;

        if (originColor) {
            this.node.color = originColor;
        } else {
            this.node.color = this.originColor;
        }
        let outlineComp = this.node.getComponent(cc.LabelOutline);
        if (outlineComp && this.bHadOutline != true) {  //是否为了炫彩特效添加指定的labelOutline组件
            this.node.removeComponent(cc.LabelOutline);
        }
    }

    private onEventAfterDraw() {
        if (!cc.isValid(this.node)) {
            this.setNormalColor();
        }
        if (this.node.active != true) {
            return;
        }
        this.colorDatas[0] = this.getColor(this.colorDatas[0]);
        this.colorDatas[1] = this.getColor(this.colorDatas[1]);
        this.colorDatas[2] = this.getColor(this.colorDatas[2]);
        this.colorDatas[3] = this.getColor(this.colorDatas[3]);
        this.colorDatas[4] = this.getColor(this.colorDatas[4]);
        this.colorDatas[5] = this.getColor(this.colorDatas[5]);
        this.colorDatas[6] = this.getColor(this.colorDatas[6]);
        this.colorDatas[7] = this.getColor(this.colorDatas[7]);
        let colorArr = [new cc.Color(252, this.colorDatas[0].num, this.colorDatas[1].num),
        new cc.Color(255, this.colorDatas[2].num, this.colorDatas[3].num),
        new cc.Color(242, this.colorDatas[4].num, this.colorDatas[5].num)];
        this.setColorAssemble(this.node, colorArr);
    }

    //设置彩色渐变 Sprite 或者 Label  注意：此方法必须在引擎渲染之后修改才有效
    private setColorAssemble(curNode: cc.Node, colorArr?: cc.Color[]) {
        if (!cc.isValid(curNode)) {
            console.log("setColorAssemble this.node.active is no Valid")
            return;
        }
        // if(!curNode._components || curNode._components.length == 0){
        //     LogUtil.log("curNode._components is null")
        //     return;
        // }
        let colors = [new cc.Color(255, 163, 0), new cc.Color(255, 255, 173), new cc.Color(255, 255, 255), new cc.Color(255, 112, 0)]; //顶点颜色
        if (colorArr) colors = colorArr;
        const cmp = curNode.getComponent(cc.RenderComponent);
        if (!cmp) return;
        const _assembler = cmp['_assembler'];
        if (!(_assembler instanceof cc['Assembler2D'])) return;
        const uintVerts = _assembler._renderData.uintVDatas[0];
        if (!uintVerts) return;
        const color = curNode.color;
        const floatsPerVert = _assembler.floatsPerVert;
        const colorOffset = _assembler.colorOffset;
        let count = 0;
        for (let i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) {
            uintVerts[i] = (colors[count++] || color)['_val'];
        }
    }

    private getColor(colorData: ColorData): ColorData {
        colorData.num = (colorData.pluss ? colorData.num + 1 : colorData.num - 1);
        if (colorData.num > colorData.max) {
            colorData.pluss = false;
            colorData.num = colorData.max;
        }
        if (colorData.num < colorData.min) {
            colorData.pluss = true;
            colorData.num = colorData.min;
        }
        return colorData;
    }
}
