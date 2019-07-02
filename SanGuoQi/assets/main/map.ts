
import City from "./city";
import { CfgMgr, st_city_info } from "../manager/ConfigManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Map extends cc.Component {

    @property(cc.Node)
    citysNode: cc.Node = null;   //城池节点

    @property(cc.Prefab)
    pfCity: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let keys = Object.getOwnPropertyNames(CfgMgr.C_city_info);
        for (let k of keys) {
            let cityInfo: st_city_info = CfgMgr.C_city_info[k];
            let city = cc.instantiate(this.pfCity);
            city.position = cc.v2(cityInfo.pos_x, cityInfo.pos_y);
            this.citysNode.addChild(city);
            city.getComponent(City).initCityConf(cityInfo);
        }
    }

    // update (dt) {}
}
