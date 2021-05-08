
import PlayerProxy from './PlayerProxy';
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 13:43:33
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-19 15:12:09
 * @Description: 
 */

//玩家数据消息注册及处理

export default class PlayerCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    //----------------  以下为自定义消息名称  -----------------------
    public static E_ON_REGISTER_PLAYER = "on_RegisterPlayer";    //通知开始注册玩家数据相关的代理
    public static E_ON_UN_REGISTER_PLAYER = "on_UnRegisterPlayer";  //通知开始注销玩家数据相关的代理

    public static E_ON_UpdateTaskState = "on_UpdateTaskState";   //任务状态更新

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
        cc.log("PlayerCommand execute " + notification.getName())
        switch (notification.getName()) {
            case PlayerCommand.E_ON_REGISTER_PLAYER:
                this.initPlayerRegister();
                break;
            case PlayerCommand.E_ON_UN_REGISTER_PLAYER:
                this.unregesterPlayer();
                break;
            case PlayerCommand.E_ON_UpdateTaskState:   //任务状态更新
                break;
            default:
        }
    }

    //----------------  以下为自定义方法  -----------------------
    /**
     * 注册玩家数据相关的代理
     */
    private initPlayerRegister(): void {
        cc.log("initCapticalRegister 注册玩家数据相关的代理")
        if (!this.facade.hasProxy(PlayerProxy.NAME)) {
            this.facade.registerProxy(new PlayerProxy());
        }

        // if (!this.facade.hasCommand(CommonCommand.E_ON_CHANGE_SCENE_STATE)) {
        //     this.facade.registerCommand(CommonCommand.E_ON_CHANGE_SCENE_STATE, CommonCommand)
        // }
    }
    private unregesterPlayer() {
        cc.log("unregesterCaptical 注销玩家数据相关的代理")
    }

}
