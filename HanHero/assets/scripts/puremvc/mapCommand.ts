
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 13:43:33
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-19 15:17:45
 * @Description: 
 */

//地图消息注册及处理

export default class MapCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    //----------------  以下为自定义消息名称  -----------------------
    public static E_ON_REGISTER_MAP = "on_RegisterMap";    //通知开始注册地图的一些代理
    public static E_ON_UN_REGISTER_MAP = "on_UnRegisterMap";    //通知开始注销地图的一些代理

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
        cc.log("MapCommand execute " + notification.getName())
        switch (notification.getName()) {
            case MapCommand.E_ON_REGISTER_MAP:
                this.initMapRegister();
                break;
            case MapCommand.E_ON_UN_REGISTER_MAP:
                this.unregesterMap();
                break;
            default:
        }
    }

    //----------------  以下为自定义方法  -----------------------

    /**
     * 注册地图相关的代理
     */
    private initMapRegister(): void {
        cc.log("initMapRegister 注册地图相关的代理")
    }
    private unregesterMap() {
        cc.log("unregesterMap 注销地图相关的代理")
    }

}
