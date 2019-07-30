import { st_city_info } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";
import { CityInfo } from "../manager/Enum";
import CityLayer from "../views/cityLayer";


const {ccclass, property} = cc._decorator;

@ccclass
export default class City extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Sprite)
    citySpr: cc.Sprite = null;

    @property(cc.Sprite)
    flagSpr: cc.Sprite = null;

    @property(cc.Prefab)
    pfCityLayer: cc.Prefab = null;

    @property(cc.SpriteAtlas)
    cityAtlas: cc.SpriteAtlas = null;  //纹理图集

    // LIFE-CYCLE CALLBACKS:

    cityInfo: CityInfo = null;
    cityConf: st_city_info = null;  //城池配置表

    onLoad () {
        this.nameLabel.string = "";
        this.citySpr.spriteFrame = null;
        this.flagSpr.spriteFrame = null;
    }

    start () {

    }

    // update (dt) {}

    onCityBtn(){
        let layer = GameMgr.showLayer(this.pfCityLayer);
        layer.getComponent(CityLayer).initCityByConf(this.cityInfo);
    }

    initCityConf(cityInfo: CityInfo){
        this.cityInfo = cityInfo;
        this.cityConf = cityInfo.cityCfg;
        if(this.cityConf){
            this.nameLabel.string = this.cityConf.name;
            this.citySpr.spriteFrame = this.cityAtlas.getSpriteFrame("menu_city"+this.cityConf.type);

            if(this.cityConf.type == 1){   //郡城
                this.node.scale = 0.7;
            }else if(this.cityConf.type == 2){   //郡城
                this.node.scale = 0.7;
            }else if(this.cityConf.type == 3){   //小郡城
                this.node.scale = 0.6;
            }else if(this.cityConf.type == 4){   //关隘渡口
                this.node.scale = 0.6;
            }else if(this.cityConf.type == 5){   //部落
                this.node.scale = 0.6;
            }
        }
    }
}
