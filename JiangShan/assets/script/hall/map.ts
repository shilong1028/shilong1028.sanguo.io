import { CfgMgr, CityInfo } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";
import City from "./city";

//地图管理
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Hall/map")
@executionOrder(-100)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class Map extends cc.Component {

    @property(cc.Node)
    citysNode: cc.Node = null;   //城池节点

    @property(cc.Prefab)
    pfCity: cc.Prefab = null;

    @property(cc.SpriteAtlas)
    cityAtlas: cc.SpriteAtlas = null;  //纹理图集

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start () {
        this.initCitys();
    }

    initCitys(){
        let keys = Object.getOwnPropertyNames(CfgMgr.C_city_info);
        for (let k of keys) {
            let cityId = parseInt(k);
            let cityInfo = new CityInfo(cityId.toString());

            GameMgr.CityNearsMap[cityId] = cityInfo.cityCfg.near_citys;   //邻近城池Map

            let city = cc.instantiate(this.pfCity);
            city.setPosition(cc.v2(cityInfo.cityCfg.pos_x, cityInfo.cityCfg.pos_y));
            this.citysNode.addChild(city);

            city.getComponent(City).initCityConf(cityInfo, this.cityAtlas);
        }
    }

    // update (dt) {}
}
