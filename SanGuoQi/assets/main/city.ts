import { st_city_info } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";
import { CityInfo, NoticeType } from "../manager/Enum";
import CityLayer from "../views/cityLayer";
import { NoticeMgr } from "../manager/NoticeManager";
import { MyUserData } from "../manager/MyUserData";


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
    flagType: number = 0;   //城池旗帜 0默认黄旗朝廷 1红旗对敌或部落（可以征伐）2蓝旗己方已占领 3绿旗管辖内叛乱的城池

    onLoad () {
        NoticeMgr.on(NoticeType.CityFlagStory, this.handleCityFlagStory, this);    //黄巾之乱，董卓之乱等叛乱的城池旗帜通知

        this.nameLabel.string = "";
        this.citySpr.spriteFrame = null;
    }

    onDestroy(){
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start () {

    }

    // update (dt) {}

    onCityBtn(){
        let layer = GameMgr.showLayer(this.pfCityLayer);
        layer.getComponent(CityLayer).initCityByConf(this.cityInfo, this.flagType);
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
                this.changeCityFlag(1);
            }
        }
    }

    changeCityFlag(flagType: number){
        if(this.flagType == flagType){
            return;
        }
        this.flagType = flagType;
        if(flagType == 0){   //默认黄旗，为朝廷旗帜
            this.flagSpr.spriteFrame = this.cityAtlas.getSpriteFrame("menu_flag_yellow"); 
        }else if(flagType == 1){  //红旗 为敌对势力或夷族部落旗帜
            this.flagSpr.spriteFrame = this.cityAtlas.getSpriteFrame("menu_flag_red"); 
        }else if(flagType == 2){   //蓝旗 我方已经占领的城池旗帜
            this.flagSpr.spriteFrame = this.cityAtlas.getSpriteFrame("menu_flag_blue"); 
        }else if(flagType == 3){   //绿旗 我方管辖内但叛乱的城池
            this.flagSpr.spriteFrame = this.cityAtlas.getSpriteFrame("menu_flag_green"); 
        }
    }

    //黄巾之乱，董卓之乱等叛乱的城池旗帜通知
    handleCityFlagStory(flagStoryType: number){
        if(flagStoryType == 1){  //黄巾之乱
            let cityIds = new Array(209, 210, 211, 306, 316, 413, 707);
            for(let i=0; i<cityIds.length; ++i){
                if(this.cityInfo.cityId == cityIds[i]){
                    this.changeCityFlag(1);
                    return;
                }
            }
            if(this.flagType != 0){
                this.changeCityFlag(0);
            }
        }else if(flagStoryType == 2){  //董卓之乱
            let cityIds = new Array(402, 403, 404, 405, 406, 407, 504, 506, 507, 509, 9009, 9010, 9012, 9013, 9014, 9015, 9016, 9018, 9019);
            for(let i=0; i<cityIds.length; ++i){
                if(this.cityInfo.cityId == cityIds[i]){
                    this.changeCityFlag(1);
                    return;
                }
            }
            if(this.flagType == 1 && this.cityConf.type != 5){
                this.changeCityFlag(0);
            }
        }else if(flagStoryType == 100){   //我方占领或治下城池
            for(let i=0; i<MyUserData.myCityIds.length; ++i){
                if(this.cityInfo.cityId == MyUserData.myCityIds[i]){
                    this.changeCityFlag(2);
                    return;
                }
            }
            for(let i=0; i<MyUserData.ruleCityIds.length; ++i){
                if(this.cityInfo.cityId == MyUserData.ruleCityIds[i]){
                    this.changeCityFlag(3);
                    return;
                }
            }
        }
    }
}
