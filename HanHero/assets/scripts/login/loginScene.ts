
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 16:05:51
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 16:22:25
 * @Description: 
 */

import AppFacade from '../puremvc/appFacade';
import CommonCommand from '../puremvc/commonCommand';
import { SceneState } from '../puremvc/commonProxy';
import LoginLayerMediator from './loginLayerMediator';
import UI from '../util/ui';

//登陆场景
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Login/loginScene")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class LoginScene extends cc.Component {

    loginBtn: cc.Node = null;
    resetBtn: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        AppFacade.getInstance().sendNotification(CommonCommand.E_ON_CHANGE_SCENE_STATE, SceneState.Login_Ready);
        this.loginBtn = UI.find(this.node, "loginBtn")
        this.resetBtn = UI.find(this.node, "resetBtn")
        this.loginBtn.active = false;
        this.resetBtn.active = false;
    }

    start() {
        cc.log("LoginScene start")
        AppFacade.getInstance().sendNotification(CommonCommand.E_ON_CHANGE_SCENE_STATE, SceneState.Login_Finish);

        AppFacade.getInstance().registerMediator(new LoginLayerMediator(this));

        AppFacade.getInstance().sendNotification(CommonCommand.E_ON_CHANGE_SCENE_STATE, SceneState.Login_InitOver);
    }

    public onDestroy() {
        AppFacade.getInstance().removeMediator(LoginLayerMediator.NAME);
    }

    // update (dt) {}

}
