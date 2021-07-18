
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 16:05:51
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-17 16:19:08
 * @Description: 
 */

import AppFacade from '../puremvc/appFacade';
import CommonCommand from '../puremvc/commonCommand';
import { SceneState } from '../puremvc/commonProxy';
import UI from '../util/ui';
import MapMediator from './mapMediator';
import MapMenuMediator from './mapMenuMediator';

//地图寻路场景
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Map/MapScene")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class MapScene extends cc.Component {

    camera: cc.Camera = null;
    mapNode: cc.Node = null   //地图总节点
    menuNode: cc.Node = null    //按钮总节点

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        AppFacade.getInstance().sendNotification(CommonCommand.E_ON_CHANGE_SCENE_STATE, SceneState.Map_Ready);
        this.camera = UI.find(this.node, "Main Camera").getComponent(cc.Camera)
        this.mapNode = UI.find(this.node, "map")    //城池总节点
        this.menuNode = UI.find(this.node, "menu")   //按钮总节点
    }

    start() {
        AppFacade.getInstance().sendNotification(CommonCommand.E_ON_CHANGE_SCENE_STATE, SceneState.Map_Finish);

        AppFacade.getInstance().registerMediator(new MapMediator(this));
        AppFacade.getInstance().registerMediator(new MapMenuMediator(this));

        cc.tween(this.node)
            .delay(0.1)
            .call(() => {
                AppFacade.getInstance().sendNotification(CommonCommand.E_ON_CHANGE_SCENE_STATE, SceneState.Map_InitOver);
            })
            .start()
    }

    public onDestroy() {
        //取消调度所有已调度的回调函数
        this.unscheduleAllCallbacks();
        this.node.targetOff(this);

        AppFacade.getInstance().removeMediator(MapMediator.NAME);
        AppFacade.getInstance().removeMediator(MapMenuMediator.NAME);
    }

    // update (dt) {}

}
