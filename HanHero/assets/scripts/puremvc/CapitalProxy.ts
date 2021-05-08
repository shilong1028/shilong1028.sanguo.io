/*
 * @Autor: dongsl
 * @Date: 2021-03-19 13:56:02
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-19 16:47:55
 * @Description: 
 */

//大厅消息处理的代理

export default class CapitalProxy extends puremvc.Proxy implements puremvc.IProxy {
    public static NAME = "CapitalProxy"

    public constructor() {
        super(CapitalProxy.NAME);
    }
    onRegister() {
        cc.log("register CapitalProxy")
        this.init()
    }
    public onRemove() {
        cc.log("remove CapitalProxy")
    }

    init() {

    }

}
