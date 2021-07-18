
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 16:05:51
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-17 16:19:17
 * @Description: 
 */

import AppFacade from '../puremvc/appFacade';
import CommonCommand from '../puremvc/commonCommand';
import { SceneState } from '../puremvc/commonProxy';
import UI from '../util/ui';
import CapitalMenuMediator from './capitalMenuMediator';
import CapitalBuilderMediator from './capitalBuilderMediator';

//登录场景
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Hall/CapitalScene")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class CapitalScene extends cc.Component {

    mapNode: cc.Node = null   //建筑总节点
    menuNode: cc.Node = null    //按钮总节点
    walkBg: cc.Node = null;   //新手县令赴任背景

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        AppFacade.getInstance().sendNotification(CommonCommand.E_ON_CHANGE_SCENE_STATE, SceneState.Captical_Ready);
        this.mapNode = UI.find(this.node, "map")    //建筑总节点
        this.menuNode = UI.find(this.node, "menu")   //按钮总节点
        this.walkBg = UI.find(this.node, "walkBg")   //新手县令赴任背景
    }

    start() {
        AppFacade.getInstance().sendNotification(CommonCommand.E_ON_CHANGE_SCENE_STATE, SceneState.Captical_Finish);

        AppFacade.getInstance().registerMediator(new CapitalMenuMediator(this));
        AppFacade.getInstance().registerMediator(new CapitalBuilderMediator(this));

        cc.tween(this.node)
            .delay(0.1)
            .call(() => {
                AppFacade.getInstance().sendNotification(CommonCommand.E_ON_CHANGE_SCENE_STATE, SceneState.Capical_InitOver);
            })
            .start()
    }

    public onDestroy() {
        //取消调度所有已调度的回调函数
        this.unscheduleAllCallbacks();
        this.node.targetOff(this);

        AppFacade.getInstance().removeMediator(CapitalMenuMediator.NAME);
        AppFacade.getInstance().removeMediator(CapitalBuilderMediator.NAME);
    }

    // update (dt) {}

}
