
import City from "./city";
import { CfgMgr} from "../manager/ConfigManager";
import { CityInfo, NoticeType } from "../manager/Enum";
import { GameMgr } from "../manager/GameManager";
import { NoticeMgr } from "../manager/NoticeManager";

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
            let cityId = parseInt(k);
            let cityInfo = new CityInfo(cityId);

            GameMgr.CityNearsMap[cityId] = cityInfo.cityCfg.near_citys;   //邻近城池Map

            let city = cc.instantiate(this.pfCity);
            city.position = cc.v2(cityInfo.cityCfg.pos_x, cityInfo.cityCfg.pos_y);
            this.citysNode.addChild(city);

            city.getComponent(City).initCityConf(cityInfo);
        }

        NoticeMgr.emit(NoticeType.CityFlagStory, 100);  //黄巾之乱，董卓之乱等叛乱的城池旗帜通知, 100我我方城池
    }

    // update (dt) {}
}
