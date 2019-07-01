import { Cfg, st_city_info } from "../manager/ConfigManager";
import City from "./city";

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
        let keys = Object.getOwnPropertyNames(Cfg.C_city_info);
        for (let k of keys) {
            let cityInfo: st_city_info = Cfg.C_city_info[k];
            let city = cc.instantiate(this.pfCity);
            city.position = cc.v2(cityInfo.pos_x, cityInfo.pos_y);
            this.citysNode.addChild(city);
            city.getComponent(City).initCityConf(cityInfo);
        }
    }

    // update (dt) {}
}
