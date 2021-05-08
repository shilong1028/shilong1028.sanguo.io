import LoginProxy from './LoginProxy';

/*
 * @Autor: dongsl
 * @Date: 2021-03-19 13:43:33
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-19 16:49:09
 * @Description: 
 */

//登陆消息注册及处理

export default class LoginCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    //----------------  以下为自定义消息名称  -----------------------
    public static E_ON_REGISTER_LOGIN = "on_RegisterLogin";    //通知开始注册登陆的一些代理
    public static E_ON_UN_REGISTER_LOGIN = "on_UnRegisterLogin";    //通知开始注销登陆的一些代理

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
        cc.log("LoginCommand execute " + notification.getName())
        switch (notification.getName()) {
            case LoginCommand.E_ON_REGISTER_LOGIN:
                this.initLoginRegister();
                break;
            case LoginCommand.E_ON_UN_REGISTER_LOGIN:
                this.unregesterLogin();
                break;
            default:
        }
    }

    //----------------  以下为自定义方法  -----------------------

    /**
     * 注册登陆相关的代理
     */
    private initLoginRegister(): void {
        cc.log("initLoginRegister 注册登陆相关的代理")
        if (!this.facade.hasProxy(LoginProxy.NAME)) {
            this.facade.registerProxy(new LoginProxy());
        }
    }
    private unregesterLogin() {
        cc.log("unregesterLogin 注销登陆相关的代理")
        this.facade.removeProxy(LoginProxy.NAME)
        // this.facade.removeCommand(LoginProxy.E_RECONNECT_SUCC)
    }


}
