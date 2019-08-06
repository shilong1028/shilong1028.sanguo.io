import { st_general_info, st_item_info, CfgMgr, st_city_info } from "./ConfigManager";
import { GameMgr } from "./GameManager";


//常量或类定义

//道具背包信息
export class ItemInfo{
    itemId: number = 0;   
    count: number = 0;   
    itemCfg: st_item_info = null;   //配置信息

    constructor(itemId:number, count: number){
        this.itemId = itemId;
        this.count = count;
        this.itemCfg = CfgMgr.getItemConf(itemId);
    }

    cloneNoCfg(){
        let temp = new ItemInfo(this.itemId, this.count);

        //不必写入本地存储的变量
        temp.itemCfg = null;

        return temp;
    }
}

//武将信息
export class GeneralInfo{
    timeId: number = 0;   //武将的时间ID，玩家武将唯一编号
    generalId: number = 0;  
    generalCfg: st_general_info = null;   //卡牌配置信息

    bReadyFight: boolean = false;   //准备出战（临时数据不用保存）

    //注意以下数据需要重新重新赋值
    generalLv: number = 1;   //武将等级
    bingCount: number = 0;   //部曲士兵数量

    killCount: number = 0;   //杀敌（士兵）数量

    constructor(generalId:number, info:any=null){
        this.timeId = new Date().getTime();
        if(info){
            this.generalLv = info.generalLv;
            this.bingCount = info.bingCount;
        }else{
            this.generalLv = 1;
            this.bingCount = 0;
        }
        this.bReadyFight = false;
        this.killCount = 0;
        this.generalId = generalId;
        this.generalCfg = CfgMgr.getGeneralConf(generalId);
    }

    cloneNoCfg(){
        let temp = new GeneralInfo(this.generalId);
        temp.generalLv = this.generalLv;
        temp.bingCount = this.bingCount;

        //不必写入本地存储的变量
        temp.timeId = 0;
        temp.generalCfg = null;

        return temp;
    }

    clone(){
        let temp = new GeneralInfo(this.generalId);
        temp.timeId = this.timeId;
        temp.generalLv = this.generalLv;
        temp.bingCount = this.bingCount;
        temp.bReadyFight = this.bReadyFight;
        temp.killCount = this.killCount;

        return temp;
    }

    updateBingCount(num: number){
        this.bingCount += num;
        if(this.bingCount < 0){
            this.bingCount = 0;
        }else{
            let maxCount = GameMgr.getMaxBingCountByLv(this.generalLv);
            if(this.bingCount > maxCount){
                this.bingCount = maxCount;
            }
        }
    }
}

//武将卡牌战斗信息
export class CardInfo{
    campId: number = 0;   //阵营，0默认，1蓝方，2红方
    shiqi: number = 100;   //士气值
    maxHp: number = 0;   //最大血量
    maxMp: number = 0;   //最大智力
    generalInfo: GeneralInfo = null;   //武将信息

    constructor(campId: number, generalInfo: GeneralInfo=null){
        this.campId = campId;
        this.shiqi = 100;
        this.generalInfo = generalInfo;
        if(generalInfo){
            this.maxHp = this.generalInfo.generalCfg.hp;
            this.maxMp = this.generalInfo.generalCfg.mp;
        }else{
            this.maxHp = 0;
            this.maxMp = 0;
        }
    }

    clone(){
        let temp = new CardInfo(this.campId, this.generalInfo);
        temp.shiqi = this.shiqi;
        temp.maxMp = this.maxMp;
        temp.maxHp = this.maxHp;

        return temp;
    }
}

//城池信息
export class CityInfo{
    cityId: number = 0;   
    campId: number = 0;    //势力阵营
    cityCfg: st_city_info = null;   //配置信息

    constructor(cityId:number){
        this.cityId = cityId;
        this.campId = 0;
        this.cityCfg = CfgMgr.getCityConf(cityId);
    }

    cloneNoCfg(){
        let temp = new CityInfo(this.cityId);
        temp.campId = this.campId;
        //不必写入本地存储的变量
        temp.cityCfg = null;

        return temp;
    }
}

/**士兵类型 */
export const SoliderType = {
    qibing: 401,    //骑兵装备战马和马刀，高移动力，防御力一般，攻击力一般。克制刀兵，但被枪兵克制。
    daobing: 402,   //刀兵装备大盾和钢刀，移动力一般，防御力高，攻击力一般。克制枪兵，但被骑兵克制。
    qiangbing: 403, //枪兵装备厚甲和长枪，移动力一般，防御力一般，攻击力高。克制骑兵，但被刀兵克制。
    gongbing: 404   //弓兵装备长弓或连弩，可以远程攻击，但移动力一般，防御力弱，攻击力弱。
}

/**异步消息通知类型 */
export const NoticeType = {
    GAME_ON_HIDE: "GAME_ON_HIDE", //游戏切入后台

    UpdateGold: "UpdateGold",   //更新金币显示
    UpdateDiamond: "UpdateDiamond",   //更新钻石（金锭）显示
    UpdateFood: "UpdateFood",   //更新粮食显示
    UpdateRoleLvOffical: "UpdateRoleLvOffical",   //更新主角等级或官职

    UpdateBagItem: "UpdateBagItem",  //更新单个背包物品
    UpdateGeneral: "UpdateGeneral",  //更新单个武将

    MapMoveByCity: "MapMoveByCity",   //话本目标通知（地图移动）
    UpdateTaskState: "UpdateTaskState",   //任务状态更新

    SelBlockMove: "SelBlockMove",   //准备拖动砖块

    PerNextRound: "PerNextRound",   //下一个回合准备

    CityFlagStory: "CityFlagStory",  //黄巾之乱，董卓之乱等叛乱的城池旗帜通知
}
