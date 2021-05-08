/*
 * @Autor: dongsl
 * @Date: 2021-03-19 13:56:02
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-19 16:46:57
 * @Description: 
 */

//地图数据消息处理的代理

export default class MapProxy extends puremvc.Proxy implements puremvc.IProxy {
    public static NAME = "MapProxy"

    public constructor() {
        super(MapProxy.NAME);
    }
    onRegister() {
        cc.log("register MapProxy")
        this.init()
    }
    public onRemove() {
        cc.log("remove MapProxy")
    }

    init() {

    }




}
