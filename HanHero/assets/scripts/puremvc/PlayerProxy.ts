/*
 * @Autor: dongsl
 * @Date: 2021-03-19 13:56:02
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-19 16:46:57
 * @Description: 
 */

//玩家数据消息处理的代理

export default class PlayerProxy extends puremvc.Proxy implements puremvc.IProxy {
    public static NAME = "PlayerProxy"

    public constructor() {
        super(PlayerProxy.NAME);
    }
    onRegister() {
        cc.log("register PlayerProxy")
        this.init()
    }
    public onRemove() {
        cc.log("remove PlayerProxy")
    }

    init() {

    }




}
