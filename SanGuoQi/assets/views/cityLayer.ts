import { st_city_info, CfgMgr } from "../manager/ConfigManager";
import { CityInfo } from "../manager/Enum";

//城池介绍
const {ccclass, property} = cc._decorator;

@ccclass
export default class CityLayer extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    typeLabel: cc.Label = null;
    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(cc.Label)
    peopleLabel: cc.Label = null;
    @property(cc.Label)
    countyLabel: cc.Label = null;
    @property(cc.Label)
    nearLabel: cc.Label = null;
    @property(cc.Label)
    campLabel: cc.Label = null;

    @property(cc.Button)
    buyBtn: cc.Button = null;
    @property(cc.Button)
    fightBtn: cc.Button = null;

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;
    @property([cc.SpriteFrame])
    iconFrames: cc.SpriteFrame[] = new Array(5);

    // LIFE-CYCLE CALLBACKS:

    cityInfo: CityInfo = null;
    cityConf: st_city_info = null;  //城池配置表
    typeStr: string[] = new Array("大都市", "郡城", "小郡", "关隘渡口", "夷族部落");  //1大城市>15，2郡城，3小郡城<5，4关隘渡口，5部落，6县城

    onLoad () {
        this.nameLabel.string = "";
        this.typeLabel.string = "类型：";
        this.descLabel.string = "";
        this.peopleLabel.string = "人口（户）：";
        this.countyLabel.string = "下属县：";
        this.nearLabel.string = "邻近城池：";
        this.campLabel.string = "势力阵营：";

        this.buyBtn.interactable = false;
        this.fightBtn.interactable = false;

        this.iconSpr.spriteFrame = null;
    }

    start () {

    }

    // update (dt) {}

    initCityByConf(cityInfo: CityInfo){
        this.cityInfo = cityInfo;
        this.cityConf = cityInfo.cityCfg;
        if(this.cityConf){
            this.nameLabel.string = this.cityConf.name;
            this.typeLabel.string = "类型："+this.typeStr[this.cityConf.type-1];
            this.iconSpr.spriteFrame = this.iconFrames[this.cityConf.type-1];

            this.descLabel.string = this.cityConf.desc;
            this.peopleLabel.string = "人口（户）："+this.cityConf.population;
            let str = "";
            for(let i=0; i<this.cityConf.counties.length; ++i){
                str += this.cityConf.counties[i];
                if(i == this.cityConf.counties.length-1){
                    str +="等";
                }else{
                    str +="、"
                }
            }
            this.countyLabel.string = "下属县："+str;
            str = "";
            for(let i=0; i<this.cityConf.near_citys.length; ++i){
                let cityId = this.cityConf.near_citys[i];
                let cityCfg = CfgMgr.getCityConf(cityId);
                str += cityCfg.name;
                if(i == this.cityConf.near_citys.length-1){
                }else{
                    str +="、"
                }
            }
            this.nearLabel.string = "邻近城池："+str;
            this.campLabel.string = "势力阵营："+"汉朝廷";
        }
    }

    onCloseBtn(){
        this.node.removeFromParent(true);
    }

    onBuyBtn(){
        this.node.removeFromParent(true);
    }

    onFightBtn(){
        this.node.removeFromParent(true);
    }
}
