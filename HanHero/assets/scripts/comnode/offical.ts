/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:21:41
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 14:45:30
 * @Description: 
 */

import UI from '../util/ui';
import { ROOT_NODE } from "../login/rootNode";
import { st_official_info } from "../manager/ConfigManager";


//官职头像
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("ComUI/offical")
@executionOrder(-1)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class OfficalCell extends cc.Component {

    selImg: cc.Node = null;
    cellBg: cc.Node = null;
    stateImg: cc.Node = null;
    iconSpr: cc.Sprite = null;
    nameLabel: cc.Label = null;
    lvLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    officalConf: st_official_info = null;
    bShowTip: boolean = false;   //点击Cell是否弹出描述提示
    selCallBack: any = null;   //响应点击选中回调

    onLoad() {
        this.initView();
    }

    initView() {

        this.cellBg = UI.find(this.node, "cellBg")
        this.selImg = UI.find(this.node, "selBg")
        this.selImg.active = false;  //默认点击不会显示选中框，只有设定回调函数才会点击显示选中框
        this.iconSpr = UI.find(this.node, "icon").getComponent(cc.Sprite)  
        this.stateImg = UI.find(this.node, "stateImg")
        this.stateImg.active = false;
        this.nameLabel = UI.find(this.node, "lblName").getComponent(cc.Label)
        this.lvLabel = UI.find(this.node, "lblLv").getComponent(cc.Label)

        UI.on_click(this.selImg, this.onClicked.bind(this))

        this.iconSpr.spriteFrame = null;
        this.nameLabel.string = "";
        this.lvLabel.string = "";
    }

    start() {

    }

    /**初始化官职头像 */
    initOfficalData(conf: st_official_info, idArr: number[], bShowTip: boolean = false, selCallBack: any = null) {
        //cc.log("initItemData(), info = "+JSON.stringify(info));
        this.bShowTip = bShowTip;   //点击Cell是否弹出描述提示
        this.selCallBack = selCallBack;   //响应点击选中回调
        this.officalConf = conf;   //武将数据

        let lvStr = ["君王", "一品", "二品", "三品", "四品", "五品", "六品", "七品", "八品", "九品"]

        if (conf) {
            this.nameLabel.string = conf.name;
            this.lvLabel.string = lvStr[conf.level];
            this.iconSpr.spriteFrame = ROOT_NODE.officeAtlas.getSpriteFrame(conf.id.toString());
        }

        this.stateImg.active = false;
        for (let i = 0; i < idArr.length; i++) {
            if (conf.id  === idArr[i]) {
                this.stateImg.active = true;   //当前装备使用中的官职
                break;
            }
        }
    }

    /**显示选中状态 */
    showSelState(bShow: boolean = false) {
        this.selImg.active = bShow;
    }

    /**选中状态切换 */
    onClicked() {
        //默认物品点击弹出道具详情，如有设定回调，则点击响应回调函数
        if (this.selCallBack) {
            if (this.selImg.active == false) {  //防止多次点击多次回调
                this.showSelState(true)
                this.selCallBack(this);   //选中回调
            }
        } else if (this.bShowTip) {
            if (this.officalConf) {
                ROOT_NODE.showTipsText(this.officalConf.desc);
            }
        }
    }

}
