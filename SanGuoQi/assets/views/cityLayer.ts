import { st_city_info, CfgMgr, st_camp_info } from "../manager/ConfigManager";
import { CityInfo, GeneralInfo } from "../manager/Enum";
import { GameMgr } from "../manager/GameManager";
import { MyUserMgr, MyUserData } from "../manager/MyUserData";
import { ROOT_NODE } from "../common/rootNode";
import FightReady from "./fightReady";
import TableView from "../tableView/tableView";

//城池介绍
const {ccclass, property} = cc._decorator;

@ccclass
export default class CityLayer extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;    //城池名称
    @property(cc.Label)
    typeLabel: cc.Label = null;   //城池类型
    @property(cc.Label)
    descLabel: cc.Label = null;   //城池描述
    @property(cc.Label)
    peopleLabel: cc.Label = null;  //城池人口
    @property(cc.Label)
    nearLabel: cc.Label = null;   //邻近城池
    @property(cc.Label)
    campLabel: cc.Label = null;   //城池阵营

    @property(cc.Label)
    pathLabel: cc.Label = null;   //路径规划(不显示)
    @property(TableView)
    tableView: TableView = null;   //驻守武将

    @property(cc.Button)
    buyBtn: cc.Button = null;
    @property(cc.Button)
    fightBtn: cc.Button = null;

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;
    @property([cc.SpriteFrame])
    iconFrames: cc.SpriteFrame[] = new Array(5);

    @property(cc.Prefab)
    pfFightReady: cc.Prefab = null;   //备战页面

    // LIFE-CYCLE CALLBACKS:

    cityInfo: CityInfo = null;
    cityConf: st_city_info = null;  //城池配置表
    typeStr: string[] = new Array("大都市", "郡城", "小郡", "关隘渡口", "夷族部落");  //1大城市>15，2郡城，3小郡城<5，4关隘渡口，5部落，6县城
    campCfg: st_camp_info = null;  //所属阵营配置

    onLoad () {
        this.nameLabel.string = "";
        this.typeLabel.string = "类型：";
        this.descLabel.string = "";
        this.peopleLabel.string = "人口（户）：";
        this.nearLabel.string = "邻近城池：";
        this.campLabel.string = "势力阵营：";

        //this.buyBtn.interactable = false;
        this.fightBtn.interactable = false;

        this.iconSpr.spriteFrame = null;
    }

    start () {

    }

    // update (dt) {}

    initCityByConf(cityInfo: CityInfo, flagType:number){
        this.cityInfo = cityInfo;
        this.cityConf = cityInfo.cityCfg;
        if(this.cityConf){
            this.nameLabel.string = this.cityConf.name;
            this.typeLabel.string = "类型："+this.typeStr[this.cityConf.type-1];
            this.iconSpr.spriteFrame = this.iconFrames[this.cityConf.type-1];

            this.descLabel.string = this.cityConf.desc;
            this.peopleLabel.string = "人口（户）："+this.cityConf.population;
            let str = "";
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

            this.campCfg = CfgMgr.getCampConf(cityInfo.cityCfg.campId);

            if(flagType == 3){  //城池旗帜 0默认黄旗朝廷 1红旗对敌或部落（可以征伐）2蓝旗己方已占领 3绿旗管辖内叛乱的城池
                this.campLabel.string = "势力阵营：我军未占领的属城";
                this.fightBtn.interactable = true;
            }else if(flagType == 2){
                this.campLabel.string = "势力阵营：我军已占领";
                this.fightBtn.interactable = false;
            }else if(flagType == 1){
                this.campLabel.string = "势力阵营："+this.campCfg.name+"（敌对可攻击）";
            }else{
                this.campLabel.string = "势力阵营："+this.campCfg.name+"（中立不可攻击）";
                this.fightBtn.interactable = false;
            }

            if(MyUserData.capitalLv > 0){
                this.fightBtn.interactable = true;
            }else{
                this.fightBtn.interactable = false;
            }

            this.initCityGeneralList();  //驻守武将列表
        }
    }

    //驻守武将列表
    initCityGeneralList(){
        let generalArr = new Array();
        let cityGeneralIds = this.cityInfo.cityCfg.generals;
        for(let i=0; i<cityGeneralIds.length; ++i){
            let enemy = new GeneralInfo(cityGeneralIds[i]);  
            enemy.generalLv = 0;   //0会显示Lv?，具体攻城时赋值
            generalArr.push(enemy);
        }
        for(let i=0; i<4; i++){
            let enemy = new GeneralInfo(401+i);  
            enemy.generalLv = 0;   //0会显示Lv?，具体攻城时赋值
            generalArr.push(enemy);
        }

        this.tableView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
        this.tableView.initTableView(generalArr.length, { array: generalArr, target: this, bShowSel: false}); 
    }

    //从首府到此城池的路径
    handleCityPath(){
        let nearPathArr = GameMgr.getNearCitysLine(315, this.cityInfo.cityId);   //山阳郡昌邑到此的路径（最多途径10城规划出2条最短路径）
        cc.log("nearPathArr = "+JSON.stringify(nearPathArr));
        let str = "山阳郡昌邑到此城距离太遥远！"
        let reachPath = null;   //可达路径索引（最近的一条）
        if(nearPathArr){
            str = "";
            for(let k=0; k<nearPathArr.length; ++k){
                let bReach: boolean = true;   //是否可达
                str += "\n路径"+(k+1)+"：";
                let cityIds = nearPathArr[k];
                for(let i=0; i<cityIds.length; ++i){
                    let cityId = cityIds[i];
                    let cityCfg = CfgMgr.getCityConf(cityId);
                    str += cityCfg.name;
                    if(i == cityIds.length-1){
                    }else{
                        str +="、"
                        if(MyUserMgr.isMyCityById(cityId) == false){   //途径我方未占领的城池，此路径不通。
                            bReach = false;
                        }
                    }
                }
                if(bReach == true && reachPath == null){
                    reachPath = cityIds;
                }else if(bReach == false){
                    str += "（此路不通）！"
                }
            }
        }

        this.pathLabel.string = "路径规划："+str;
        return reachPath;
    }

    onCloseBtn(){
        this.node.destroy();
    }

    onBuyBtn(){
        //this.node.destroy();
        this.handleCityPath();
    }

    onFightBtn(){
        let reachPath = this.handleCityPath();
        if(reachPath == null){
            ROOT_NODE.showTipsText("此城池与我方城池不相邻，请先攻克其他城池!");
        }else{
            let layer = GameMgr.showLayer(this.pfFightReady);
            layer.getComponent(FightReady).initCityFight(this.cityInfo, this.campCfg);

            this.node.destroy();
        }
    }
}
