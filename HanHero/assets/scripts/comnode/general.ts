/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:21:41
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 14:44:53
 * @Description: 
 */

import UI from '../util/ui';
import { ROOT_NODE } from "../login/rootNode";
import { CfgMgr, GeneralInfo, st_general_info } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";
import { LoaderMgr } from '../manager/LoaderManager';

//武将头像
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("ComUI/general")
@executionOrder(-1)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class GeneralCell extends cc.Component {

    selImg: cc.Node = null;
    cellBg: cc.Node = null;
    headSpr: cc.Sprite = null;
    officeSpr: cc.Sprite = null;   //官职
    typeSpr: cc.Sprite = null;   //兵种
    stateSpr: cc.Sprite = null;   //0默认，1出战中，2驻守中
    nameLabel: cc.Label = null;
    lvLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    generalInfo: GeneralInfo = null;
    bShowTip: boolean = false;   //点击Cell是否弹出描述提示
    selCallBack: any = null;   //响应点击选中回调

    //只有在new cc.NodePool(XX)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
    //使用 Pool.put() 回收节点后，会调用unuse 方法
    unuse() {
        cc.log("general onLoad ")
    }
    //使用 Pool.get() 获取节点后，就会调用reuse 方法
    reuse() {
        cc.log("general onLoad ")
    }

    onLoad() {
        cc.log("general onLoad ")
        //如果是缓存池的节点，则调用顺序为 reuse -> initItemData-> onLoad，故如果在OnLoad.initView则会刷掉initGeneralData的数据
    }

    initView() {
        this.selImg = UI.find(this.node, "selBg")
        this.selImg.active = false;  //默认点击不会显示选中框，只有设定回调函数才会点击显示选中框
        this.cellBg = UI.find(this.node, "cellBg")
        this.headSpr = UI.find(this.node, "head").getComponent(cc.Sprite) 
        this.officeSpr = UI.find(this.node, "officeImg").getComponent(cc.Sprite)    //官职
        this.typeSpr = UI.find(this.node, "typeImg").getComponent(cc.Sprite)    //兵种
        this.stateSpr = UI.find(this.node, "stateImg").getComponent(cc.Sprite)   //0默认，1出战中，2驻守中
        this.nameLabel = UI.find(this.node, "lblName").getComponent(cc.Label)
        this.lvLabel = UI.find(this.node, "lblLv").getComponent(cc.Label)

        UI.on_click(this.cellBg, this.onClicked.bind(this)) 
        UI.on_click(this.officeSpr.node, this.onOfficeClick.bind(this)) 
        UI.on_click(this.typeSpr.node, this.onTypeClick.bind(this)) 

        this.headSpr.spriteFrame = null;
        this.officeSpr.spriteFrame = null;
        this.typeSpr.spriteFrame = null;
        this.stateSpr.spriteFrame = null;
        this.nameLabel.string = "";
        this.lvLabel.string = "";
    }

    start() {

    }

    setCellClickEnable(bEnable: boolean) {
        //默认ListCell是开启的，当通过缓存池添加时，需要设定是否可点击
        this.node.getComponent(cc.Button).enabled = bEnable
    }

    /**隐藏背景图，及屏蔽点击事件 */
    setBgImgVisible(show: boolean, bClick: boolean = false) {
        //默认ListCell是开启的，当通过缓存池添加时，需要设定是否可点击
        this.node.getComponent(cc.Button).enabled = bClick
        if (this.cellBg) {
            this.cellBg.active = show;
        }
    }

    /**初始化武将头像 */
    //如果是缓存池的节点，则调用顺序为 reuse -> initItemData-> onLoad，故如果在OnLoad.initView则会刷掉initItemData的数据
    initGeneralData(info: GeneralInfo, bShowTip: boolean = false, selCallBack: any = null) {
        //cc.log("initGeneralData(), info = "+JSON.stringify(info));
        this.bShowTip = bShowTip;   //点击Cell是否弹出描述提示
        this.selCallBack = selCallBack;   //响应点击选中回调
        this.generalInfo = info;   //武将数据

        this.initView();

        if (info) {
            this.lvLabel.string = "Lv " + info.generalLv;
            this.officeSpr.spriteFrame = ROOT_NODE.officeAtlas.getSpriteFrame(info.officialId.toString());
            if (info.state == 1) {  //0默认，1出战中，2驻守中
                this.stateSpr.spriteFrame = ROOT_NODE.commonAtlas.getSpriteFrame("common_fighting");
            } else if (info.state == 2) {
                this.stateSpr.spriteFrame = ROOT_NODE.commonAtlas.getSpriteFrame("common_garrison");
            } else {
                this.stateSpr.spriteFrame = null;
            }

            let generalConf: st_general_info = info.generalCfg;
            if (generalConf) {
                this.nameLabel.string = generalConf.name;
                this.typeSpr.spriteFrame = ROOT_NODE.commonAtlas.getSpriteFrame("common_" + generalConf.bingzhong);
                LoaderMgr.setSpriteFrameByImg("head/" + generalConf.id_str, this.headSpr.node);
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
            if (this.selImg.active == false) {   //防止多次点击多次回调
                this.showSelState(true)
                this.selCallBack(this);   //选中回调
            }
        } else if (this.bShowTip) {
            if (this.generalInfo && this.generalInfo.generalCfg) {
                ROOT_NODE.showTipsText(this.generalInfo.generalCfg.desc);
            }
        }
    }

    /**点击官职 */
    onOfficeClick() {
        if (this.generalInfo && this.generalInfo.officialId) {
            let officeConf = CfgMgr.getOfficalConf(this.generalInfo.officialId);
            if (officeConf) {
                ROOT_NODE.showTipsText(officeConf.desc);
            }
        }
    }
    /**点击兵种 */
    onTypeClick() {
        if (this.generalInfo && this.generalInfo.generalCfg) {
            let soliderConf = CfgMgr.getGeneralConf(this.generalInfo.generalCfg.bingzhong);
            if (soliderConf) {
                ROOT_NODE.showTipsText(soliderConf.desc);
            }
        }
    }


}
