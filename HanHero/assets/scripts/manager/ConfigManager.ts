/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:14:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-05 17:16:42
 * @Description: 
 */

import { FunMgr } from "./FuncManager";

//***************************  以下为配置表数据结构定义 ****************************** */
//城池信息
export class CityInfo {
    cityId: number = 0;
    campId: number = 0;    //势力阵营
    cityCfg: st_city_info = null;   //配置信息

    constructor(cityId: number) {
        this.cityId = cityId;
        this.campId = 0;
        this.cityCfg = CfgMgr.getCityConf(cityId);
    }
    cloneNoCfg() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        //不必写入本地存储的变量
        temp.cityCfg = null;
        return temp;
    }
}
//城池配置数据
export class st_city_info {
    id;
    name;   //名称
    type;  //类型 1大城市>15，2郡城，3小郡城<5，4关隘渡口，5部落，6县城
    pos_x;   //坐标
    pos_y;
    population;  //人口（户）
    campId;   //割据后城池所属势力
    generals;   //驻守武将
    near_citys;  //相邻城池ID 102;5003;9001
    counties;   //所属县名称 昌黎;阳乐;令支
    desc;   //城池介绍

    constructor(obj:any) {
        this.id = obj.id;
        this.name = obj.name;
        this.type = obj.type;
        this.pos_x = obj.pos_x;
        this.pos_y = obj.pos_y;
        this.population = obj.population;
        this.campId = obj.campId;
        this.generals = FunMgr.getIntAry(obj.generals, ";");
        this.near_citys = FunMgr.getIntAry(obj.near_citys, ";");
        this.counties = FunMgr.getStringAry(obj.counties, ";");
        this.desc = obj.desc;
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}

//州配置数据
export class st_zhou_info {
    id;
    name;   //名称
    capital;  //州治ID
    citys;  //所属郡城关隘ID 1001;1002;1003;1004;1005;9001
    desc;   //城池介绍

    constructor(obj:any) {
        this.id = obj.id;
        this.name = obj.name;
        this.capital = obj.capital;
        this.citys = FunMgr.getIntAry(obj.citys, ";");
        this.desc = obj.desc;
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}

//武将信息
export class GeneralInfo {
    timeId: number = 0;   //武将的时间ID，玩家武将唯一编号
    generalId: number = 0;
    officialId: number = 101;  //官职ID
    generalLv: number = 1;   //武将等级
    generalExp: number = 0;   //武将经验
    bingCount: number = 0;   //部曲士兵数量
    state: number = 0;   //0默认，1出战中，2驻守中
    skills: SkillInfo[] = [];
    generalCfg: st_general_info = null;   //卡牌配置信息

    //武将随等级变化的属性(Lv*随机范围*基础值)
    fightHp: number = 0;    //血量，最大为1000
    fightMp: number = 0;     //智力，最大100
    fightAtk: number = 0;   //攻击，最大100
    fightDef: number = 0;    //防御，最大100

    constructor(generalId: number, info: any = null) {
        this.timeId = new Date().getTime();
        this.generalId = generalId;
        this.skills = [];
        this.generalCfg = CfgMgr.getGeneralConf(generalId);
        //cc.log("generalId = "+generalId+"; this.generalCfg = "+JSON.stringify(this.generalCfg))

        if (info) {  //只有从本地存储读取数据是会传递info
            this.officialId = info.officialId;  //官职ID
            this.generalLv = info.generalLv;
            this.generalExp = info.generalExp;
            this.bingCount = info.bingCount;
            this.state = 0;   //0默认，1出战中，2驻守中
            //武将随等级变化的属性(Lv*随机范围*基础值)
            this.fightHp = info.fightHp;    //血量，最大为1000
            this.fightMp = info.fightMp;     //智力，最大100
            this.fightAtk = info.fightAtk;   //攻击，最大100
            this.fightDef = info.fightDef;    //防御，最大100

            if (info.skills) {
                for (let i = 0; i < info.skills.length; ++i) {
                    let tempSkill = new SkillInfo(info.skills[i].skillId, info.skills[i].skillLv);
                    this.skills.push(tempSkill);
                }
            }
        } else {
            this.officialId = 101;  //官职ID
            this.generalLv = 1;
            this.generalExp = 0;
            this.bingCount = 0;
            this.state = 0;   //0默认，1出战中，2驻守中
            //武将随等级变化的属性(Lv*随机范围*基础值)
            this.fightHp = this.generalCfg.hp;    //血量，最大为1000
            this.fightMp = this.generalCfg.mp;     //智力，最大100
            this.fightAtk = this.generalCfg.atk;   //攻击，最大100
            this.fightDef = this.generalCfg.def;    //防御，最大100
        }
    }
    //武将随等级变化的属性(Lv*随机范围*基础值)
    updateGeneralLv(lv: number) {
        this.generalLv = lv;
        let scale = lv * 0.1 * (Math.random() * 0.5 + 0.8) + 1.0;   //一般10级加一倍
        //武将随等级变化的属性(Lv*随机范围*基础值)
        this.fightHp = Math.floor(this.generalCfg.hp * scale);    //血量，最大为1000
        this.fightMp = Math.floor(this.generalCfg.mp * scale);     //智力，最大100
        this.fightAtk = Math.floor(this.generalCfg.atk * scale);   //攻击，最大100
        this.fightDef = Math.floor(this.generalCfg.def * scale);    //防御，最大100
    }
    //通过json对象值来重置武将数据,（因为为了防止数据无意篡改，有些引用使用json转换导致对象无法调用成员方法）
    updateGeneralInfoByCopyJson(jsonObj: GeneralInfo, bCopyTempFight: boolean = false) {
        this.officialId = jsonObj.officialId;  //官职ID
        this.generalLv = jsonObj.generalLv;   //武将等级
        this.generalExp = jsonObj.generalExp;   //武将经验
        this.bingCount = jsonObj.bingCount;   //部曲士兵数量
        //武将随等级变化的属性(Lv*随机范围*基础值)
        this.fightHp = jsonObj.fightHp;    //血量，最大为1000
        this.fightMp = jsonObj.fightMp;     //智力，最大100
        this.fightAtk = jsonObj.fightAtk;   //攻击，最大100
        this.fightDef = jsonObj.fightDef;    //防御，最大100
        this.skills = jsonObj.skills;
    }
    cloneNoCfg() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        //不必写入本地存储的变量
        temp.timeId = 0;
        temp.generalCfg = null;
        temp.skills = [];
        for (let i = 0; i < this.skills.length; ++i) {
            let tempSkill = this.skills[i].cloneNoCfg();
            temp.skills.push(tempSkill);
        }
        return temp;
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}
//武将配置数据
export class st_general_info {
    id;
    name;   //武将名称
    bingzhong;   //兵种 401骑兵402刀兵403枪兵404弓兵
    hp;   //血量，最大为1000
    mp;    //智力，最大100
    atk;  //攻击，最大100
    def;   //防御，最大100
    recruit;   //招降概率
    campId;  //所属阵营
    skillNum;   //技能总数
    desc;

    constructor(obj:any) {
        this.id = obj.id;
        this.name = obj.name;
        this.bingzhong = obj.bingzhong;
        this.hp = obj.hp;
        this.mp = obj.mp;
        this.atk = obj.atk;
        this.def = obj.def;
        this.recruit = obj.recruit;
        this.campId = obj.campId;
        this.skillNum = obj.skillNum;
        this.desc = obj.desc;
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}

//后宫信息
export class BeautyInfo {
    nvId: number = 0;
    nvCfg: st_beautiful_info = null;   //配置信息

    constructor(nvId: number) {
        this.nvId = nvId;
        this.nvCfg = CfgMgr.getBeautifulConf(nvId);
    }

    cloneNoCfg() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        //不必写入本地存储的变量
        temp.nvCfg = null;
        return temp;
    }
}

//后宫配置数据
export class st_beautiful_info {
    id
    name;
    desc;

    constructor(obj:any) {
        this.id = obj.id;
        this.name = obj.name;
        this.desc = obj.desc;
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}

//招兵配置数据
export class st_recruit_info {
    id;
    name;
    gold;   //百兵招募花费金币
    food;   //百兵行军每月消耗粮草
    desc;   //对话内容

    constructor(obj:any) {
        this.id = obj.id;
        this.name = obj.name;
        this.gold = obj.gold;
        this.food = obj.food;
        this.desc = obj.desc;
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}

//官职配置数据
export class st_official_info {
    id;
    name;  //官职名称
    level;  //官职品级
    count;   //领兵最大数量
    subs;  //下属官职
    desc;   //对话内容

    constructor(obj:any) {
        this.id = obj.id;
        this.name = obj.name;
        this.level = obj.level;
        this.count = obj.count;
        this.subs = FunMgr.getIntAry(obj.subs, ";");
        this.desc = obj.desc;
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}
//割据势力配置数据
export class st_camp_info {
    id;
    name;   //势力名称
    flag;   //旗帜名称
    friends;   //盟友阵营
    generals;  //所属武将1101-1105
    citys;  //所属城池ID集合

    constructor(obj:any) {
        this.id = obj.id;
        this.name = obj.name;
        this.flag = obj.flag;
        this.friends = FunMgr.getIntAry(obj.friends, ";");
        this.citys = FunMgr.getIntAry(obj.citys, ";");
        this.generals = FunMgr.getIntRegionAry(obj.generals, "-");
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}

//章节配置数据
export class st_chapter_info {
    id;
    name;  //名称
    rewards;  //章节奖励
    stories;   //章节剧情  1001-1027
    desc;

    constructor(obj:any) {
        this.id = obj.id;
        this.name = obj.name;
        this.rewards = FunMgr.getIntAry(obj.rewards, ";");
        this.stories = FunMgr.getIntRegionAry(obj.stories, "-");
        this.desc = obj.desc;
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}
//剧情配置数据
export class st_story_info {
    id;
    next_id;  //下一剧情，空则+1
    chapterId;
    type;   //剧情类型 任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗  6学习技能
    targetCity;   //目标城池
    name;   //名称
    battleId;   //战斗ID 
    rewards;   //奖励 id-val;id-val
    talks;   //对话 104;105
    desc;   //剧情简介

    constructor(obj:any) {
        this.id = obj.id;
        this.next_id = obj.next_id;
        this.chapterId = obj.chapterId;
        this.type = obj.type;
        this.targetCity = obj.targetCity;
        this.name = obj.name;
        this.battleId = obj.battleId;
        this.rewards = FunMgr.getKeyValAry(obj.rewards, ";");   //[{"key":ss[0], "val":parseInt(ss[1])}]
        this.talks = FunMgr.getIntAry(obj.talks, ";");
        this.desc = obj.desc;
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}
//对话配置数据
export class st_talk_info {
    id;
    city;   //目标城池
    type;   //对话类型 type 故事类型，0默认（摇旗）1起义暴乱（火） 2 战斗（双刀） 3募兵 4封官 5主城 6招将
    head;   //对话头像，<100为head_talk中头像，>100为head头像
    generals;  //武将头像
    official;   //官职头衔
    skip;   //是否可以跳过
    date;   //对话时间年月
    desc;   //对话内容

    constructor(obj:any) {
        this.id = obj.id;
        this.city = obj.city;
        this.type = obj.type;
        this.head = obj.head;
        this.skip = obj.skip;
        this.date = obj.date;
        this.generals = FunMgr.getIntAry(obj.generals, ";");
        this.official = FunMgr.getIntAry(obj.official, ";");
        this.desc = obj.desc;
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}

//建筑信息
export class BuilderInfo {
    id_str: string = "";
    level: number = 0;
    builderCfg: st_build_info = null;   //配置信息

    constructor(id_str: string, level: number) {
        this.id_str = id_str;
        this.level = level;
        this.builderCfg = CfgMgr.getBuildConf(id_str);
    }

    cloneNoCfg() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        //不必写入本地存储的变量
        temp.itemCfg = null;
        return temp;
    }

    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}
//建筑配置数据
export class st_build_info {
    id
    name;
    cost;
    desc;

    constructor(obj:any) {
        this.id = obj.id;
        this.name = obj.name;
        this.cost = FunMgr.getKeyValAry(obj.cost)[0];
        this.desc = obj.desc;
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}

//道具背包信息
export class ItemInfo {
    itemId: number = 0;
    count: number = 0;
    itemCfg: st_item_info = null;   //配置信息

    constructor(itemId: number, count: number) {
        this.itemId = itemId;
        this.count = count;
        this.itemCfg = CfgMgr.getItemConf(itemId);
    }

    cloneNoCfg() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        //不必写入本地存储的变量
        temp.itemCfg = null;
        return temp;
    }

    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}
//道具配置数据
export class st_item_info {
    id;
    name;     //战斗名称
    type;     //道具类型
    cost;     //售卖价格
    get_way;   //获取途径
    desc;     //介绍

    constructor(obj:any) {
        this.id = obj.id;
        this.name = obj.name;
        this.type = obj.type;
        this.cost = obj.cost;
        this.get_way = obj.get_way;
        this.desc = obj.desc;
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}



//战斗配置数据
export class st_battle_info {
    id;
    name;     //战斗名称
    generals;   //友军
    soldiers;  //士兵集合（士兵类型-兵力）
    enemys;   //敌方部曲（武将ID-等级） 1004-1;6001-3

    constructor(obj:any) {
        this.id = obj.id;
        this.name = obj.name;
        this.generals = FunMgr.getKeyValAry(obj.generals, ";");   //ret.push({"key":ss[0], "val":parseInt(ss[1])});
        this.soldiers = FunMgr.getKeyValAry(obj.soldiers, ";");
        this.enemys = FunMgr.getKeyValAry(obj.enemys, ";");
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}





//技能信息
export class SkillInfo {
    skillId: number = 0;
    skillLv: number = 1;
    skillCfg: st_skill_info = null;   //配置信息

    constructor(skillId: number, skillLv: number = 1) {
        this.skillId = skillId;
        this.skillLv = skillLv;
        this.skillCfg = CfgMgr.getSkillConf(skillId);
    }

    cloneNoCfg() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        //不必写入本地存储的变量
        temp.skillCfg = null;
        return temp;
    }
}
//对话配置数据
export class st_skill_info {
    name;  //技能名称
    cost;  //技能消耗的钻石（金锭）
    mp;  //技能消耗的智力值
    hp;  //技能增加的生命值 0无作用 正值对己方作用 负值对敌方作用
    atk;  //技能增加的攻击力 0无作用 正值对己方作用 负值对敌方作用
    def;  //技能增加的防御力 0无作用 正值对己方作用 负值对敌方作用
    shiqi;  //技能增加的士气值 0无作用 正值对己方作用 负值对敌方作用
    desc;

    constructor(obj:any) {
        this.name = obj.name;
        this.cost = obj.cost;
        this.mp = obj.mp;
        this.hp = obj.hp;
        this.atk = obj.atk;
        this.def = obj.def;
        this.shiqi = obj.shiqi;
        this.desc = obj.desc;
    }
    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }
}

//引导配置信息
export class st_guide_info {
    info;   //引导提示
    key;   //是否关键步骤
    end;    //是否大步骤引导结束
    offsetY;   //提示相对引导框的上下位置偏移
    desc;    //引导描述

    constructor(obj:any) {
        this.info = obj.info;
        this.key = obj.key;
        this.end = obj.end;
        this.offsetY = obj.offsetY;
        this.desc = obj.desc;
    }

    clone() {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);  // st_guide_info();
        return temp;
    }
}


//*********************  以下为接口类定义 *********************************** */
const { ccclass } = cc._decorator;
@ccclass
class CfgManager_class {

    overCallBack: any = null;   //加载完毕后回调
    overTarget: any = null;   //加载完毕回调注册者

    hanConf: any = null;   

    //设置加载配置完毕回调
    setOverCallback(bLoadAllConf:boolean, callback: any, target: any) {
        this.overCallBack = callback;
        this.overTarget = target;
        if(bLoadAllConf){
            this.loadHanConf();
        }
    }

    //加载配置
    loadHanConf(){
        cc.resources.load("confs/hanConf", cc.JsonAsset, (err, file:any) => {
            if (err) {
                cc.log(`配置文件不存在, ${err.message}`);
                // return null;
            }
            this.hanConf = file.json;

            cc.log("load all config finsih!");

            if (this.overCallBack && this.overTarget) {
                this.overCallBack.call(this.overTarget, null);
            }
            this.overCallBack = null;
            this.overTarget = null;
        })
    }


    //********************** 以下是一些配置接口 ***************** */
    /**获取城池配置数据 */
    getCityConf(cityId: number | string): st_city_info {
        let obj = this.hanConf.city_info[cityId];
        if (obj) {
            return new st_city_info(obj);
        } else {
            return null;
        }
    }
    /**获取州配置数据 */
    getZhouConf(zhouId: number | string): st_zhou_info {
        let obj = this.hanConf.zhou_info[zhouId];
        if (obj) {
            return new st_zhou_info(obj);
        } else {
            return null;
        }
    }
    /**获取官职配置数据 */
    getOfficalConf(officeId: number | string): st_official_info {
        let obj = this.hanConf.official_info[officeId];
        if (obj) {
            return new st_official_info(obj);
        } else {
            return null;
        }
    }
    getAllOfficalConf() {
        return this.hanConf.official_info;
    }
    /**获取武将配置数据 */
    getGeneralConf(generalId: number | string): st_general_info {
        let obj = this.hanConf.general_info[generalId];
        if (obj) {
            return new st_general_info(obj);
        } else {
            return null;
        }
    }
    /**获取招募配置数据 */
    getRecruitConf(soldierId: number | string): st_recruit_info {
        let obj = this.hanConf.recruit_info[soldierId];
        if (obj) {
            return new st_recruit_info(obj);
        } else {
            return null;
        }
    }
    /**获取势力阵营配置数据 */
    getCampConf(campId: number | string): st_camp_info {
        let obj = this.hanConf.camp_info[campId];
        if (obj) {
            return new st_camp_info(obj);
        } else {
            return null;
        }
    }
    /**获取任务配置数据 */
    getTaskConf(taskId: number | string): st_story_info {
        let obj = this.hanConf.story_info[taskId];
        if (obj) {
            return new st_story_info(obj);
        } else {
            return null;
        }
    }
    /**获取话本配置数据 */
    getTalkConf(talkId: number | string): st_talk_info {
        let obj = this.hanConf.talk_info[talkId];
        if (obj) {
            return new st_talk_info(obj);
        } else {
            return null;
        }
    }
    /**获取后宫数据 */
    getBeautifulConf(nvId: number | string): st_beautiful_info {
        let obj = this.hanConf.beautiful_info[nvId];
        if (obj) {
            return new st_beautiful_info(obj);
        } else {
            return null;
        }
    }

    /**获取建筑数据 */
    getBuildConf(buildname: string): st_build_info {
        let obj = this.hanConf.build_info[buildname];
        if (obj) {
            return new st_build_info(obj);
        } else {
            return null;
        }
    }



    /**获取引导配置数据 */
    getGuideConf(guideId: number | string): st_guide_info {
        // let obj = this.hanConf.guide_info[guideId];
        // if(obj){
        //     return new st_guide_info(obj);
        // }else{
        //     return null;
        // }
        return null;
    }

    /**获取道具配置数据 */
    getItemConf(itemId: number | string): st_item_info {
        let obj = this.hanConf.item_info[itemId];
        if (obj) {
            return new st_item_info(obj);
        } else {
            return null;
        }
    }

    /**获取战场数据 */
    getBattleConf(battleId: number | string): st_battle_info {
        let obj = this.hanConf.battle_info[battleId];
        if (obj) {
            return new st_battle_info(obj);
        } else {
            return null;
        }
    }

    /**获取技能数据 */
    getSkillConf(skillId: number | string): st_skill_info {
        let obj = this.hanConf.skill_info[skillId];
        if (obj) {
            return new st_skill_info(obj);
        } else {
            return null;
        }
    }

    //根据武将等级获得升级经验
    getMaxGeneralExpByLv(lv: number) {
        if (lv <= 100) {
            return lv * 100;
        }
    }


}

export var CfgMgr = new CfgManager_class();



