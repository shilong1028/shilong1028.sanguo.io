import { st_general_info, st_item_info, CfgMgr } from "./ConfigManager";


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
    generalLv: number = 1;   //武将等级
    bingCount: number = 0;   //部曲士兵数量
    
    generalId: number = 0;  
    generalCfg: st_general_info = null;   //卡牌配置信息

    constructor(generalId:number){
        this.timeId = new Date().getTime();
        this.generalLv = 1;
        this.bingCount = 0;
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

    updateBingCount(num: number){
        this.bingCount += num;
        if(this.bingCount < 0){
            this.bingCount = 0;
        }else if(this.bingCount > this.generalLv*1000){
            this.bingCount = this.generalLv*1000;
        }
    }
}

//武将卡牌战斗信息
export class CardInfo{
    campId: number = 0;   //阵营，0默认，1蓝方，2红方
    maxHp: number = 0;   //最大血量
    maxMp: number = 0;   //最大智力
    cardCfg: st_general_info = null;   //卡牌配置信息

    constructor(){
    }

    clone(){
        let temp = new CardInfo();
        temp.campId = this.campId;
        temp.cardCfg = this.cardCfg;
        temp.maxMp = this.maxMp;
        temp.maxHp = this.maxHp;

        return temp;
    }
}



/**异步消息通知类型 */
export const NoticeType = {
    GAME_ON_HIDE: "GAME_ON_HIDE", //游戏切入后台

    UpdateGold: "UpdateGold",   //更新金币显示
    UpdateDiamond: "UpdateDiamond",   //更新钻石（金锭）显示
    UpdateFood: "UpdateFood",   //更新粮食显示

    UpdateBagItem: "UpdateBagItem",  //更新单个背包物品
    UpdateGeneral: "UpdateGeneral",  //更新单个武将

    MapMoveByCity: "MapMoveByCity",   //话本目标通知（地图移动）
    UpdateTaskState: "UpdateTaskState",   //任务状态更新


}
