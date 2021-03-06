import { st_general_info, st_item_info, CfgMgr, st_city_info, st_skill_info, st_beautiful_info } from "./ConfigManager";
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

    clone(){
        let temp = new ItemInfo(this.itemId, this.count);
        return temp;
    }
}

//武将战斗临时数据类
export class TempFightInfo{
    bReadyFight: boolean = false;   //准备出战（临时数据不用保存）
    killCount: number = 0;   //杀敌（士兵）数量（战斗后会转换为经验）
    fightHp: number = 0;   //战斗时血量计算(战后复原)
    fightMp: number = 0;   //战斗时智力计算(战后复原)

    constructor(generalCfg: st_general_info){
        this.bReadyFight = false;
        this.killCount = 0;
        this.fightHp = generalCfg.hp;
        this.fightMp = generalCfg.mp;
    }
}

//武将信息
export class GeneralInfo{
    timeId: number = 0;   //武将的时间ID，玩家武将唯一编号
    generalId: number = 0;  

    generalLv: number = 1;   //武将等级
    generalExp: number = 0;   //武将经验
    bingCount: number = 0;   //部曲士兵数量

    tempFightInfo: TempFightInfo = null;  //武将战斗临时数据类

    skills: SkillInfo[] = new Array();
    generalCfg: st_general_info = null;   //卡牌配置信息

    constructor(generalId:number, info:any=null){   
        this.timeId = new Date().getTime();
        this.generalId = generalId;

        this.skills = new Array();
        if(info){  //只有从本地存储读取数据是会传递info
            this.generalLv = info.generalLv;
            this.generalExp = info.generalExp; 
            this.bingCount = info.bingCount;

            if(info.skills){
                for(let i=0; i<info.skills.length; ++i){
                    let tempSkill = new SkillInfo(info.skills[i].skillId, info.skills[i].skillLv);
                    this.skills.push(tempSkill);
                }
            }
        }else{
            this.generalLv = 1;
            this.generalExp = 0;  
            this.bingCount = 0;
        }
        this.tempFightInfo = null;

        this.generalCfg = CfgMgr.getGeneralConf(generalId);
    }

    cloneNoCfg(){
        let temp = new GeneralInfo(this.generalId);
        temp.generalLv = this.generalLv;
        temp.generalExp = this.generalExp; 
        temp.bingCount = this.bingCount;
        temp.skills = new Array();

        //不必写入本地存储的变量
        temp.timeId = 0;
        temp.generalCfg = null;
        for(let i=0; i<this.skills.length; ++i){
            let tempSkill = this.skills[i].cloneNoCfg();
            temp.skills.push(tempSkill);
        }

        return temp;
    }

    clone(){
        let temp = new GeneralInfo(this.generalId);
        temp.timeId = this.timeId;
        temp.generalLv = this.generalLv;
        temp.generalExp = this.generalExp; 
        temp.bingCount = this.bingCount;
        temp.tempFightInfo = this.tempFightInfo;
        temp.skills = this.skills;
        
        return temp;
    }

    //更新士兵数量
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

    //根据经验更新等级
    updateLvByExp(){
        if(this.generalLv >= 100){
            this.generalLv = 100;
            this.generalExp = 0;
        }else{
            let maxExp = GameMgr.getMaxGeneralExpByLv(this.generalLv);
            while(this.generalExp >= maxExp){
                this.generalLv ++;
                this.generalExp -= maxExp;
                maxExp = GameMgr.getMaxGeneralExpByLv(this.generalLv);
            }
        }
    }
}

//武将卡牌战斗信息
export class CardInfo{
    campId: number = 0;   //阵营，0默认，1蓝方，2红方
    shiqi: number = 100;   //士气值
    generalInfo: GeneralInfo = null;   //武将信息

    constructor(campId: number, generalInfo: GeneralInfo=null){
        this.campId = campId;
        this.shiqi = 100;
        this.generalInfo = generalInfo;
    }

    clone(){
        let temp = new CardInfo(this.campId, this.generalInfo);
        temp.shiqi = this.shiqi;

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

//技能信息
export class SkillInfo{
    skillId: number = 0;   
    skillLv: number = 1;   
    skillCfg: st_skill_info = null;   //配置信息

    constructor(skillId:number, skillLv:number=1){
        this.skillId = skillId;
        this.skillLv = skillLv;
        this.skillCfg = CfgMgr.getSkillConf(skillId);
    }

    cloneNoCfg(){
        let temp = new SkillInfo(this.skillId, this.skillLv);

        //不必写入本地存储的变量
        temp.skillCfg = null;

        return temp;
    }
}

//后宫信息
export class BeautifulInfo{
    nvId: number = 0;   
    nvCfg: st_beautiful_info = null;   //配置信息

    constructor(nvId:number){
        this.nvId = nvId;
        this.nvCfg = CfgMgr.getBeautifulConf(nvId);
    }

    cloneNoCfg(){
        let temp = new BeautifulInfo(this.nvId);

        //不必写入本地存储的变量
        temp.nvCfg = null;

        return temp;
    }
}

//敌方AI处理结果
export class EnemyAIResult{
    runAwayEnemy = null;    //敌方预逃走的单位
    runAwayWeight = 0;   //逃走权重
    hitEnemy = null;   //敌方出手的单位
    hitMy = null;    //我方预被击杀的单位
    hitWeight = 0;   //击杀权重

    constructor(runAwayEnemy, runAwayWeight, hitEnemy, hitMy, hitWeight){
        this.runAwayEnemy = runAwayEnemy;  
        this.runAwayWeight = runAwayWeight;   
        this.hitEnemy = hitEnemy;  
        this.hitMy = hitMy;  
        this.hitWeight = hitWeight;   
    }
}

//特殊故事节点
export const SpecialStory = {
    huangjinover: 4,  //黄巾之乱结束(黄巾叛军占据城池旗帜复原)
    dongzhuoOver: 13,  //董卓之乱结束(董卓叛军占据城池旗帜复原)
    taishouOpen: 10,  //东郡太守（占据东郡）
    zhoumuOpen: 11,  //兖州牧（占据山阳昌邑，治下兖州）
    mubingOpen: 2,  //开启募兵
    unitOpen: 3,   //开启部曲
    skillOpen: 9,   //开启技能
    capitalOpen: 12,  //开启主城
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
    EnemyRoundOptAI: "EnemyRoundOptAI",   //敌方自动AI

    CityFlagStory: "CityFlagStory",  //黄巾之乱，董卓之乱等叛乱的城池旗帜通知
}
