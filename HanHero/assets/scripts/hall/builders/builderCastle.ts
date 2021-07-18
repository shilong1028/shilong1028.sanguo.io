import { BuilderInfo, CfgMgr } from '../../manager/ConfigManager';
import UI from '../../util/ui';
/*
 * @Autor: dongsl
 * @Date: 2021-07-16 14:31:16
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-16 14:43:56
 * @Description: 
 */


//城防建筑信息详情
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Hall/builders/builderCastle")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class BuilderCastle extends cc.Component {

    attrLabel: cc.Label = null;  //属性增加

    // LIFE-CYCLE CALLBACKS:
    builderInfo: BuilderInfo = null;

    onLoad() {
        this.attrLabel = UI.find(this.node, "attrLabel").getComponent(cc.Label)
    }

    onDestroy() {
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start() {
    }

    // update (dt) {}

    initCastle(builderInfo: BuilderInfo) {
        this.builderInfo = builderInfo
        this.attrLabel.string = Math.floor(CfgMgr.getBuildOutputByLv("castle", this.builderInfo.level)) + "%";
    }

}
