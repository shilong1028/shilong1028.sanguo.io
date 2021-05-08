/*
 * @Autor: dongsl
 * @Date: 2021-03-19 13:56:02
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-19 16:48:22
 * @Description: 
 */

//登陆消息处理的代理

export default class LoginProxy extends puremvc.Proxy implements puremvc.IProxy {
    public static NAME = "LoginProxy"

    public constructor() {
        super(LoginProxy.NAME);
    }
    onRegister() {
        cc.log("register LoginProxy")
        this.init()
    }
    public onRemove() {
        cc.log("remove LoginProxy")
    }

    init() {

    }


}
