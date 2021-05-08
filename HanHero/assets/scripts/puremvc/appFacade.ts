import CommonCommand from './commonCommand';
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 12:03:05
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-19 15:23:33
 * @Description: 
 */

//项目代码采用pureMVC 模式，数据、通信、界面分开处理。可以将puremvc.js直接放入assest目录，设置成插件，或者以模块require形式都可以。

export default class AppFacade extends puremvc.Facade implements puremvc.IFacade {

    private constructor() {
        super();
    }

    public static getInstance(): AppFacade {
        if (this.instance == null) this.instance = new AppFacade();
        return <AppFacade><any>(this.instance);
    }

    public initializeController(): void {
        super.initializeController();

        // -------------  以下是一些通用消息处理注册，非通用消息处理在各模块Command中适时注册及注销  --------------------

        this.registerCommand(CommonCommand.E_ON_REGISTER_COMMON, CommonCommand);   //通知开始注册通用的一些代理
    }

    //----------------  以下为自定义方法  -----------------------

    /**
     * 启动PureMVC，在应用程序中调用此方法，并传递应用程序本身的引用
    */
    public startUp(): void {
        this.sendNotification(CommonCommand.E_ON_REGISTER_COMMON);
    }


}
