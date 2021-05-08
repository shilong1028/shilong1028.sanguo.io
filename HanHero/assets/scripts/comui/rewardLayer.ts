/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:21:41
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 14:45:36
 * @Description: 
 */

import UI from '../util/ui';
import List from "../control/List";
import ListItem from "../control/ListItem";
import { ROOT_NODE } from "../login/rootNode";
import { ItemInfo } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";
import { SDKMgr } from "../manager/SDKManager";
import Item from "../comnode/item";
import ComMaskBg from './comMaskBg';


//领取奖励通用提示框
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("ComUI/rewardLayer")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class RewardLayer extends cc.Component {

    list_view: List = null;
    titleLabel: cc.Label = null;
    infoNode: cc.Node = null;
    iconSpr: cc.Sprite = null;
    nameLabel: cc.Label = null;
    numLabel: cc.Label = null;
    descLabel: cc.Label = null;
    vedioBtn: cc.Node = null;
    okBtn: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    receiveCallback: any = null;    //领取回调

    rewardArr: ItemInfo[] = [];   //奖励

    onLoad() {
        this.titleLabel = UI.find(this.node, "titleLabel").getComponent(cc.Label)
        this.infoNode = UI.find(this.node, "infoNode")
        this.infoNode.active = false;
        this.iconSpr = UI.find(this.infoNode, "icon").getComponent(cc.Sprite)
        this.nameLabel = UI.find(this.infoNode, "itemName").getComponent(cc.Label)
        this.numLabel = UI.find(this.infoNode, "itemNum").getComponent(cc.Label)
        this.descLabel = UI.find(this.node, "itemDesc").getComponent(cc.Label)
        this.descLabel.string = "";
        this.vedioBtn = UI.find(this.node, "vedioBtn")
        this.okBtn = UI.find(this.node, "okBtn")
        UI.on_btn_click(this.okBtn, this.onOkBtn.bind(this)) 
        UI.on_btn_click(this.vedioBtn, this.onVedioBtn.bind(this)) 
        this.vedioBtn.active = SDKMgr.bOpenAdBtn;

        let rewardlist = UI.find(this.node, "rewardList");
        let list_project = UI.find(rewardlist, "item")
        let ts_item = list_project.getComponent(Item)
        if (!ts_item)
        {
            ts_item = list_project.addComponent(Item)
        }

        let list_item = list_project.getComponent(ListItem)
        if (!list_item)
        {
            list_item = list_project.addComponent(ListItem)
            list_item.selectedMode = 1;    //TOGGLE
            let selImg = UI.find(list_project, "selImg")
            list_item.selectedFlag = selImg
        }

        this.list_view = rewardlist.getComponent(List)
        if (!this.list_view)
        {
            this.list_view = rewardlist.addComponent(List)
            this.list_view.tmpNode = list_project;
            this.list_view.selectedMode = 1;  //单选

            this.list_view.setRenderCallBack(this.onListRender.bind(this));
            this.list_view.setSelectedCallBack(this.onListSelected.bind(this))
            //this.list_view.selectedId = 0;
            //this.list_view.numItems = 0;
        }
    }

    start() {
        let maskBg_tsComp = this.node.parent.getComponent(ComMaskBg)
        if(maskBg_tsComp){
            maskBg_tsComp.showCloseCallback(()=>{
                this.closeLayer();
            })   //设置关闭时，子节点（功能节点）的关闭逻辑处理
        }
    }

    // update (dt) {}

    /**展示奖励列表 */
    showRewardList(rewards: ItemInfo[], title?: string, callback?: any) {
        this.rewardArr = rewards;
        this.receiveCallback = callback;
        if (title) {
            this.titleLabel.string = title;
        } else {
            this.titleLabel.string = "获取奖励";
        }

        this.infoNode.active = true;
        this.list_view.numItems = this.rewardArr.length;
        this.list_view.selectedId = 0;
    }

    //列表渲染器
    onListRender(item: cc.Node, idx: number) {
        if (!item)
            return;
        let tsComp = item.getComponent(Item)
        if(!tsComp){
            tsComp = item.addComponent(Item)
        }
        tsComp.initItemData(this.rewardArr[idx]);
    }

    //当列表项被选择...
    onListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!item)
            return;
        //cc.log('当前选择的是：' + selectedId + '，上一次选择的是：' + lastSelectedId);
        this.updateSelItemInfoByIdx(selectedId);  //显示底部选中道具信息
    }

    /**显示底部选中道具信息 */
    updateSelItemInfoByIdx(cellIdx: number) {
        let item = this.rewardArr[cellIdx];
        if (item && item.itemCfg) {
            //cc.log("item.itemCfg = "+JSON.stringify(item.itemCfg))
            this.numLabel.string = "数量：" + item.count;
            this.nameLabel.string = item.itemCfg.name;
            //this.iconSpr.spriteFrame = ROOT_NODE.iconAtlas.getSpriteFrame(item.itemId.toString());
            this.descLabel.string = item.itemCfg.desc;
        } else {
            this.iconSpr.spriteFrame = null;
            this.nameLabel.string = "";
            this.numLabel.string = "";
            this.descLabel.string = "";
        }
    }

    onOkBtn() {
        let str = "";
        for (let i = 0; i < this.rewardArr.length; ++i) {
            let item = this.rewardArr[i];
            let itemStr = "获得" + item.itemCfg.name + " x " + item.count + "  ";
            str += itemStr;
        }
        ROOT_NODE.showTipsText(str);
        GameMgr.receiveRewards(this.rewardArr, 2);   //领取奖励
        this.closeLayer();
    }


    /**视频免费按钮 */
    onVedioBtn() {
        SDKMgr.showVedioAd(() => {
            //失败
            this.vedioBtn.active = false;
            ROOT_NODE.showTipsText("抱歉，视频获取异常")
        }, () => {
            let str = "";
            for (let i = 0; i < this.rewardArr.length; ++i) {
                let item = this.rewardArr[i];
                let itemStr = "获得" + item.itemCfg.name + " x " + item.count * 2 + "  ";
                str += itemStr;
            }
            ROOT_NODE.showTipsText(str);
            GameMgr.receiveRewards(this.rewardArr, 2);   //领取奖励
            this.closeLayer();
        });
    }

    closeLayer() {
        if (this.receiveCallback) {
            this.receiveCallback();
        }
        this.receiveCallback = null;

        this.node.destroy();
    }
}
