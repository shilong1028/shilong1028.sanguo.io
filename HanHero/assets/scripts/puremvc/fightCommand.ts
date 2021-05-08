
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 13:43:33
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-19 15:11:44
 * @Description: 
 */

//战斗消息注册及处理

export default class FightCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    //----------------  以下为自定义消息名称  -----------------------
    public static E_ON_REGISTER_FIGHT = "on_RegisterFight";    //通知开始注册战斗的一些代理
    public static E_ON_UN_EGISTER_FIGHT = "on_UnRegisterFight";  //通知开始注销战斗的一些代理



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
        cc.log("FightCommand execute " + notification.getName())
        switch (notification.getName()) {
            case FightCommand.E_ON_REGISTER_FIGHT:
                this.initFightRegister();
                break;
            case FightCommand.E_ON_UN_EGISTER_FIGHT:
                this.unregesterFight();
                break;
            default:
        }
    }

    //----------------  以下为自定义方法  -----------------------

    /**
     * 注册战斗相关的代理
     */
    private initFightRegister(): void {
        cc.log("registerFightProxy 注册战斗相关的代理")
    }
    private unregesterFight() {
        cc.log("unregesterFight 注销战斗相关的代理")
    }
}
