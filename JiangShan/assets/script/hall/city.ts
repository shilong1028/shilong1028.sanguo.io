import { CityInfo, st_city_info } from "../manager/ConfigManager";
import { NoticeMgr, NoticeType } from "../manager/NoticeManager";
import { AudioMgr } from "../manager/AudioMgr";

//城池节点
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Hall/city")
@executionOrder(-101)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class City extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Sprite)
    citySpr: cc.Sprite = null;
    @property(cc.Sprite)
    flagSpr: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    cityAtlas: cc.SpriteAtlas = null;
    cityInfo: CityInfo = null;
    cityConf: st_city_info = null;  //城池配置表
    flagType: number = -1;   //城池旗帜 0默认黄旗朝廷 1红旗对敌或部落（可以征伐）2蓝旗己方已占领 3绿旗管辖内叛乱的城池

    onLoad () {
        NoticeMgr.on(NoticeType.CityFlagStory, this.handleCityFlagStory, this);    //黄巾之乱，董卓之乱等叛乱的城池旗帜通知

        // this.nameLabel.string = "";
        // this.citySpr.spriteFrame = null;
    }

    onDestroy(){
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start () {

    }

    // update (dt) {}

    onCityBtn(){
        AudioMgr.playBtnClickEffect();
        // let layer = GameMgr.showLayer(this.pfCityLayer);
        // layer.getComponent(CityLayer).initCityByConf(this.cityInfo, this.flagType);
    }

    initCityConf(cityInfo: CityInfo, cityAtlas: cc.SpriteAtlas){
        this.cityInfo = cityInfo;
        this.cityAtlas = cityAtlas;
        this.cityConf = cityInfo.cityCfg;
        if(this.cityConf){
            this.nameLabel.string = this.cityConf.name;

            this.changeCityFlag(0);
        }
    }

    changeCityFlag(flagType: number){
        if(this.flagType == flagType){
            return;
        }
        this.flagType = flagType; //城池旗帜 0默认黄旗朝廷 1红旗对敌或部落（可以征伐）2蓝旗己方已占领 3绿旗管辖内叛乱的城池

        let cityFrameName = "city_yellow_normal";

        if(this.cityConf.type == 1){   //大城市
            if(flagType == 0){   //默认黄旗，为朝廷旗帜
                cityFrameName = "city_yellow_big";
            }else if(flagType == 1){  //红旗 为敌对势力或夷族部落旗帜
                cityFrameName = "city_red_big";
            }else if(flagType == 2){   //蓝旗 我方已经占领的城池旗帜
                cityFrameName = "city_blue_big";
            }else if(flagType == 3){   //绿旗 我方管辖内但叛乱的城池
                cityFrameName = "city_blue_big"; 
            }
        }else if(this.cityConf.type == 2 || this.cityConf.type == 3){   //郡城  //小郡城
            if(flagType == 0){   //默认黄旗，为朝廷旗帜
                cityFrameName = "city_yellow_normal";
            }else if(flagType == 1){  //红旗 为敌对势力或夷族部落旗帜
                cityFrameName = "city_red_normal";
            }else if(flagType == 2){   //蓝旗 我方已经占领的城池旗帜
                cityFrameName = "city_blue_normal";
            }else if(flagType == 3){   //绿旗 我方管辖内但叛乱的城池
                cityFrameName = "city_blue_normal"; 
            }
        }else if(this.cityConf.type == 4){   //关隘渡口
            cityFrameName = "city_guanai";
        }else if(this.cityConf.type == 5){   //部落
            cityFrameName = "city_yizu";
        }
        this.citySpr.spriteFrame = this.cityAtlas.getSpriteFrame(cityFrameName);

        if(flagType == 0){   //默认黄旗，为朝廷旗帜
            this.flagSpr.spriteFrame = this.cityAtlas.getSpriteFrame("cityflag_yellow"); 
        }else if(flagType == 1){  //红旗 为敌对势力或夷族部落旗帜
            this.flagSpr.spriteFrame = this.cityAtlas.getSpriteFrame("cityflag_red"); 
        }else if(flagType == 2){   //蓝旗 我方已经占领的城池旗帜
            this.flagSpr.spriteFrame = this.cityAtlas.getSpriteFrame("cityflag_blue"); 
        }else if(flagType == 3){   //绿旗 我方管辖内但叛乱的城池
            this.flagSpr.spriteFrame = this.cityAtlas.getSpriteFrame("cityflag_green"); 
        }
    }

    //黄巾之乱，董卓之乱等叛乱的城池旗帜通知
    handleCityFlagStory(flagStoryType: number){
        // if(flagStoryType == 1){  //黄巾之乱
        //     let cityIds = new Array(209, 210, 211, 306, 316, 413, 707);
        //     for(let i=0; i<cityIds.length; ++i){
        //         if(this.cityInfo.cityId == cityIds[i]){
        //             this.changeCityFlag(1);
        //             return;
        //         }
        //     }
        //     if(this.flagType != 0){
        //         this.changeCityFlag(0);
        //     }
        // }else if(flagStoryType == 2){  //董卓之乱
        //     let cityIds = new Array(402, 404, 405, 406, 407, 504, 506, 507, 509, 9009, 9012, 9013, 9014, 9015, 9016, 9018, 9019);
        //     for(let i=0; i<cityIds.length; ++i){
        //         if(this.cityInfo.cityId == cityIds[i]){
        //             this.changeCityFlag(1);
        //             return;
        //         }
        //     }
        //     if(this.flagType == 1 && this.cityConf.type != 5){
        //         this.changeCityFlag(0);
        //     }
        // }else if(flagStoryType == 100){   //我方占领或治下城池
        //     for(let i=0; i<MyUserData.myCityIds.length; ++i){
        //         if(this.cityInfo.cityId == MyUserData.myCityIds[i]){
        //             this.changeCityFlag(2);
        //             return;
        //         }
        //     }
        //     for(let i=0; i<MyUserData.ruleCityIds.length; ++i){
        //         if(this.cityInfo.cityId == MyUserData.ruleCityIds[i]){
        //             this.changeCityFlag(3);
        //             return;
        //         }
        //     }
        // }
    }
}
