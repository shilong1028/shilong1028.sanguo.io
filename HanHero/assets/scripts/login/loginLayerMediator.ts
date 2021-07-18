
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 17:09:33
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-17 15:12:27
 * @Description: 
 */

import LoginProxy from '../puremvc/LoginProxy';
import LoginScene from './loginScene';
import UI from '../util/ui';
import { LDMgr, LDKey } from '../manager/StorageManager';
import { MyUserMgr } from '../manager/MyUserData';
import { LoaderMgr } from '../manager/LoaderManager';

//登陆界面展示相关中介

export default class LoginLayerMediator extends puremvc.Mediator implements puremvc.IMediator {

    public static NAME: string = "LoginLayerMediator";

    public get loginProxy(): LoginProxy {
        return <LoginProxy><any>(this.facade.retrieveProxy(LoginProxy.NAME));
    }

    public get loginLayer(): LoginScene {
        return <LoginScene><any>(this.viewComponent);
    }

    public constructor(viewComponent: any) {
        super(LoginLayerMediator.NAME, viewComponent);
    }

    /**
     * 界面中介创建成功后的回调处理
     */
    public onRegister(): void {
        this.initView()
    }

    /**
     * 界面中介移除时的回调处理
     */
    public onRemove(): void {
    }

    /**
     * 注册界面相关的消息监听
     * @returns 
     */
    public listNotificationInterests(): Array<any> {
        return [
            // LoginProxy.E_CONNECT_SOCKET_SUCC,
            // LoginProxy.E_LOGIN_RESULT
        ];
    }

    /**
     * 处理界面相关的消息
     * @param notification 
     */
    public handleNotification(notification: puremvc.INotification): void {
        var notifier: any = notification.getBody();
        cc.log("LoginLayerMediator handleNotification:" + notification.getName())
        switch (notification.getName()) {
            // case LoginProxy.E_CONNECT_SOCKET_SUCC:
            //     break;
            default:
        }
    }

    /**
     * 界面预处理
     */
    private initView() {
        UI.on_click(this.loginLayer.loginBtn, this.onLoginBtnClick.bind(this))
        UI.on_click(this.loginLayer.resetBtn, this.onResetBtnClick.bind(this))

        if (LDMgr.getItemInt(LDKey.KEY_NewUser) == 0) {  //新用户 
            MyUserMgr.clearUserData();
        } else {
            MyUserMgr.initUserData();    //初始化用户信息
        }

        LoaderMgr.preloadScene("capitalScene");  //预加载主场景

        /**
         * 相对于 Cocos 传统的 cc.Action，cc.Tween 在创建动画上要灵活非常多：
            支持以链式结构的方式创建一个动画序列。
            支持对任意对象的任意属性进行缓动，不再局限于节点上的属性，而 cc.Action 添加一个属性的支持时还需要添加一个新的 action 类型。
            支持与 cc.Action 混用。
            支持设置 Easing 或者 progress 函数。
            .start()后cc.tween才生效启动
        */

        cc.tween(this.loginLayer)
            .delay(0.5)
            .call(() => {
                this.loginLayer.loginBtn.active = true;
                this.loginLayer.resetBtn.active = true;
            })
            .start()
    }

    public onLoginBtnClick() {
        this.loginLayer.resetBtn.active = false;
        //LoaderMgr.loadScene("capitalScene");  //进入主场景

        LoaderMgr.transitionScene("capitalScene", "doorway-horizontal");
    }

    public onResetBtnClick() {
        this.loginLayer.resetBtn.active = false;
        MyUserMgr.clearUserData();   //清除所有用户数据
        //LoaderMgr.loadScene("capitalScene");  //进入主场景

        LoaderMgr.transitionScene("capitalScene", "grid-flip");

        //LoaderMgr.transitionScene("capitalScene", "window-slice");   //过渡场景  百叶窗（比价流畅）
        //LoaderMgr.transitionScene("capitalScene", "grid-flip");   //过渡场景  方格翻转（比价流畅）
        //LoaderMgr.transitionScene("capitalScene", "crop-circle");   //过渡场景  向内放缩（比价流畅）
        //LoaderMgr.transitionScene("capitalScene", "simple-zoom");   //过渡场景  向外扩大（比价流畅）
        //LoaderMgr.transitionScene("capitalScene", "doom-screen");   //过渡场景  方块坠落（比价流畅）
        //LoaderMgr.transitionScene("capitalScene", "water-drop");   //过渡场景  水滴映像
        //LoaderMgr.transitionScene("capitalScene", "doorway-horizontal");   //过渡场景  开门
        //LoaderMgr.transitionScene("capitalScene", "cube");   //过渡场景  立方体旋转
        //LoaderMgr.transitionScene("capitalScene", "swap");   //过渡场景  两页交替
        //LoaderMgr.transitionScene("capitalScene", "ripple-glass-rb");   //过渡场景  波纹擦除
        //LoaderMgr.transitionScene("capitalScene", "hexo");   //过渡场景  六边模糊
        //LoaderMgr.transitionScene("capitalScene", "pixelize");   //过渡场景  马赛克模糊
        //LoaderMgr.transitionScene("capitalScene", "swirl");   //过渡场景  风车旋转
        //LoaderMgr.transitionScene("capitalScene", "cross-zoom");   //过渡场景  眩晕模糊

    }
}
