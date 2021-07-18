/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:21:41
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-16 11:27:43
 * @Description: 
 */

import UI from '../util/ui';
import { GameMgr } from "../manager/GameManager";
import { LoaderMgr } from '../manager/LoaderManager';
import { MyUserData } from "../manager/MyUserData";
import { NoticeMgr, NoticeType } from "../manager/NoticeManager";


//一级界面上的金币钻石粮草公用控件
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("ComUI/comTop")
@executionOrder(-1)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class ComTop extends cc.Component {

    goldLabel: cc.Label = null;   //金币
    foodLabel: cc.Label = null;   //粮草

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.goldLabel = UI.find(this.node, "goldNum").getComponent(cc.Label)   //金币
        this.foodLabel = UI.find(this.node, "foodNum").getComponent(cc.Label)   //粮草

        let addGoldBtn = UI.find(this.node, "goldAdd")
        let addFoodBtn = UI.find(this.node, "foodAdd")

        let goldIcon = UI.find(this.node, "goldIcon")
        let foodIcon = UI.find(this.node, "foodIcon")
        UI.on_btn_click(goldIcon, this.onAddGoldBtn.bind(this))
        UI.on_btn_click(foodIcon, this.onAddGoldBtn.bind(this))

        //一些小的公用节点，没有采用pureMVC监听，故使用NoticeMgr来监听消息
        NoticeMgr.on(NoticeType.UpdateGold, this.UpdateGoldCount, this);
        NoticeMgr.on(NoticeType.UpdateFood, this.UpdateFoodCount, this);
    }

    onDestroy() {
        //this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start() {
        this.UpdateGoldCount();
        this.UpdateFoodCount();
    }

    UpdateGoldCount() {
        this.goldLabel.string = MyUserData.GoldCount.toString();
    }

    UpdateFoodCount() {
        this.foodLabel.string = MyUserData.FoodCount.toString();
    }

    onAddGoldBtn() {
        LoaderMgr.showGoldAddDialog();  //获取金币提示框
    }
}
