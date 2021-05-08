import CommonProxy, { SceneType } from './commonProxy';
import { SceneState } from './commonProxy';
import CapitalCommand from './capitalCommand';
import FightCommand from './fightCommand';
import LoginCommand from './loginCommand';
import MapCommand from './mapCommand';
import PlayerCommand from './playerCommand';

/*
 * @Autor: dongsl
 * @Date: 2021-03-19 13:43:33
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-19 16:53:23
 * @Description: 
 */

//通用消息注册及处理

export default class CommonCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    //----------------  以下为自定义消息名称  -----------------------
    public static E_ON_REGISTER_COMMON = "on_RegisterCommon";    //通知开始注册通用的一些代理
    public static E_ON_CHANGE_SCENE_STATE = "on_ChangeSceneState";  //通知改变了场景状态

    public get commonProxy(): CommonProxy {
        return <CommonProxy><any>(this.facade.retrieveProxy(CommonProxy.NAME));
    }




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
        cc.log("CommonCommand execute " + notification.getName())
        switch (notification.getName()) {
            case CommonCommand.E_ON_REGISTER_COMMON:   //通知开始注册通用的一些代理
                this.initCommonRegister();
                this.registerGameEvent();
                break;
            case CommonCommand.E_ON_CHANGE_SCENE_STATE:  //通知改变了场景状态
                let old_scene_type = this.commonProxy.getCurSceneType();
                this.commonProxy.setSceneState(notifier);
                if (old_scene_type != this.commonProxy.getCurSceneType()) {
                    switch (old_scene_type) {
                        case SceneType.Login: //登陆场景
                            this.facade.sendNotification(LoginCommand.E_ON_UN_REGISTER_LOGIN);
                            break;
                        case SceneType.Captical:  //大厅场景
                            this.facade.sendNotification(CapitalCommand.E_ON_UN_REGISTER_CAPITAL);
                            break;
                        case SceneType.Map:   //地图场景
                            this.facade.sendNotification(MapCommand.E_ON_UN_REGISTER_MAP);
                            break;
                        case SceneType.Fight:   //战斗场景
                            this.facade.sendNotification(FightCommand.E_ON_UN_EGISTER_FIGHT);
                            break;
                        default:
                    }
                }
                switch (notifier) {
                    case SceneState.Login_Ready: //登陆场景
                        this.facade.sendNotification(LoginCommand.E_ON_REGISTER_LOGIN);
                        break;
                    case SceneState.Captical_Ready:  //大厅场景
                        this.facade.sendNotification(CapitalCommand.E_ON_REGISTER_CAPITAL);
                        break;
                    case SceneState.Map_Ready:   //地图场景
                        this.facade.sendNotification(MapCommand.E_ON_REGISTER_MAP);
                        break;
                    case SceneState.Fight_Ready:   //战斗场景
                        this.facade.sendNotification(FightCommand.E_ON_REGISTER_FIGHT);
                        break;
                    default:
                }
                break;
            default:
        }
    }

    //----------------  以下为自定义方法  -----------------------

    /**
     * 注册通用相关的代理
     */
    private initCommonRegister(): void {
        cc.log("initCommonRegister 注册通用相关的代理")
        if (!this.facade.hasProxy(CommonProxy.NAME)) {
            this.facade.registerProxy(new CommonProxy());
        }
        this.facade.sendNotification(PlayerCommand.E_ON_REGISTER_PLAYER);   //通知开始注册玩家数据相关的代理

        if (!this.facade.hasCommand(CommonCommand.E_ON_CHANGE_SCENE_STATE)) {
            this.facade.registerCommand(CommonCommand.E_ON_CHANGE_SCENE_STATE, CommonCommand)
        }

        if (!this.facade.hasCommand(LoginCommand.E_ON_REGISTER_LOGIN)) {
            this.facade.registerCommand(LoginCommand.E_ON_REGISTER_LOGIN, LoginCommand)
        }
        if (!this.facade.hasCommand(LoginCommand.E_ON_UN_REGISTER_LOGIN)) {
            this.facade.registerCommand(LoginCommand.E_ON_UN_REGISTER_LOGIN, LoginCommand)
        }

        if (!this.facade.hasCommand(CapitalCommand.E_ON_REGISTER_CAPITAL)) {
            this.facade.registerCommand(CapitalCommand.E_ON_REGISTER_CAPITAL, CapitalCommand)
        }
        if (!this.facade.hasCommand(CapitalCommand.E_ON_UN_REGISTER_CAPITAL)) {
            this.facade.registerCommand(CapitalCommand.E_ON_UN_REGISTER_CAPITAL, CapitalCommand)
        }

        if (!this.facade.hasCommand(MapCommand.E_ON_REGISTER_MAP)) {
            this.facade.registerCommand(MapCommand.E_ON_REGISTER_MAP, MapCommand)
        }
        if (!this.facade.hasCommand(MapCommand.E_ON_UN_REGISTER_MAP)) {
            this.facade.registerCommand(MapCommand.E_ON_UN_REGISTER_MAP, MapCommand)
        }

        if (!this.facade.hasCommand(FightCommand.E_ON_REGISTER_FIGHT)) {
            this.facade.registerCommand(FightCommand.E_ON_REGISTER_FIGHT, FightCommand)
        }
        if (!this.facade.hasCommand(FightCommand.E_ON_UN_EGISTER_FIGHT)) {
            this.facade.registerCommand(FightCommand.E_ON_UN_EGISTER_FIGHT, FightCommand)
        }

    }

    /**
     * 一些游戏通用事件处理
     */
    private registerGameEvent() {
        cc.game.on(cc.game.EVENT_HIDE, () => {
            cc.log("游戏进入后台");
        }, this);

        cc.game.on(cc.game.EVENT_SHOW, () => {
            cc.log("游戏进入前台");
        }, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event) => {
            switch (event.keyCode) {
                case cc.macro.KEY.back:
                    // PopupManager.showConfirmAndCancel("确定退出游戏吗？",
                    // (()=>{
                    //     NativeInterface.exitGame()
                    // }).bind(this)) 
                    break;
                default:
            }
        });
    }
}
