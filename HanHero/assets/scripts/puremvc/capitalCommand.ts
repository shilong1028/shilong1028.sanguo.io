import CapitalProxy from './CapitalProxy';
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 13:43:33
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-17 15:54:03
 * @Description: 
 */

//大厅消息注册及处理

export default class CapitalCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    //----------------  以下为自定义消息名称  -----------------------
    public static E_ON_REGISTER_CAPITAL = "on_RegisterCapital";    //通知开始注册大厅的一些代理
    public static E_ON_UN_REGISTER_CAPITAL = "on_UnRegisterCapital";  //通知开始注销大厅的一些代理
    public static E_ON_RemoveBundleLayer = "E_ON_RemoveBundleLayer";  //通知移除一些特定Bundle界面资源

    public static E_ON_BuilderHand = "E_ON_BuilderHand";  //通知显示或隐藏建筑手指
    public static E_ON_TeaseBeauty = "E_ON_TeaseBeauty";  //通知挑逗美姬
    public static E_ON_GeneralRecruit = "E_ON_GeneralRecruit";  //通知部曲招募
    public static E_ON_ShowHallMidTab = "E_ON_ShowHallMidTab";  //通知显示大厅底部中间页签

    //----------------  以下为继承的核心方法  -----------------------

    public constructor() {
        super();
    }

    /**
     * 消息处理
     * @param notification 
     */
    public execute(notification: puremvc.INotification): void {
        var notifier: any = notification.getBody();
        cc.log("CapitalCommand execute " + notification.getName())
        switch (notification.getName()) {
            case CapitalCommand.E_ON_REGISTER_CAPITAL:
                this.initCapticalRegister();
                break;
            case CapitalCommand.E_ON_UN_REGISTER_CAPITAL:
                this.unregesterCaptical();
                break;
            default:
        }
    }

    //----------------  以下为自定义方法  -----------------------
    /**
     * 注册大厅相关的代理
     */
    private initCapticalRegister(): void {
        cc.log("initCapticalRegister 注册大厅相关的代理")
        if (!this.facade.hasProxy(CapitalProxy.NAME)) {
            this.facade.registerProxy(new CapitalProxy());
        }

        // if (!this.facade.hasCommand(CommonCommand.E_ON_CHANGE_SCENE_STATE)) {
        //     this.facade.registerCommand(CommonCommand.E_ON_CHANGE_SCENE_STATE, CommonCommand)
        // }
    }
    private unregesterCaptical() {
        cc.log("unregesterCaptical 注销大厅相关的代理")
        this.facade.removeProxy(CapitalProxy.NAME)
        // this.facade.removeCommand(LoginProxy.E_RECONNECT_SUCC)
    }

}
