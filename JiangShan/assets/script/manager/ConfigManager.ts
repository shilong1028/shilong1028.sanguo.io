import { FunMgr, TempFightInfo } from "./Enum";


/*** 类型定义 */
type double = number;       //64位
type int = number;          //32位
type short = number;        //16位
type char = number;         //8位
type float = number;

//***************************  以下为配置表数据结构定义 ****************************** */
//城池信息
export class CityInfo{
    cityId: string = "0";   
    campId: string = "0";    //势力阵营
    cityCfg: st_city_info = null;   //配置信息

    constructor(cityId:string){
        this.cityId = cityId;
        this.campId = "0";
        this.cityCfg = CfgMgr.getCityConf(cityId);
    }
    cloneNoCfg(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        //不必写入本地存储的变量
        temp.cityCfg = null;
        return temp;
    }
}
//城池配置数据
export class st_city_info {
    id_str;
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
    
    transType(){
        this.type = parseInt(this.type);
        this.pos_x = parseInt(this.pos_x);
        this.pos_y = parseInt(this.pos_y);
        this.population = parseInt(this.population);
        this.campId = parseInt(this.campId);
        this.generals = FunMgr.getIntAry(this.generals, ";");
        this.near_citys = FunMgr.getIntAry(this.near_citys, ";");
        this.counties = FunMgr.getStringAry(this.counties, ";");
    }
    constructor(){
    }
    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
}

//武将信息
export class GeneralInfo{
    timeId: number = 0;   //武将的时间ID，玩家武将唯一编号
    generalId: string = "0";  
    officialId: string = "101";  //官职ID
    generalLv: number = 1;   //武将等级
    generalExp: number = 0;   //武将经验
    bingCount: number = 0;   //部曲士兵数量
    tempFightInfo: TempFightInfo = null;  //武将战斗临时数据类
    skills: SkillInfo[] = [];
    generalCfg: st_general_info = null;   //卡牌配置信息

    constructor(generalId:string, info:any=null){   
        this.timeId = new Date().getTime();
        this.generalId = generalId;
        this.skills = [];
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
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        //不必写入本地存储的变量
        temp.timeId = 0;
        temp.generalCfg = null;
        temp.skills = [];
        for(let i=0; i<this.skills.length; ++i){
            let tempSkill = this.skills[i].cloneNoCfg();
            temp.skills.push(tempSkill);
        }
        return temp;
    }
    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
    // //更新士兵数量
    // updateBingCount(num: number){
    //     this.bingCount += num;
    //     if(this.bingCount < 0){
    //         this.bingCount = 0;
    //     }
    // }
    // //根据经验更新等级
    // updateLvByExp(){
    //     if(this.generalLv >= 100){
    //         this.generalLv = 100;
    //         this.generalExp = 0;
    //     }else{
    //         let maxExp = CfgMgr.getMaxGeneralExpByLv(this.generalLv);
    //         while(this.generalExp >= maxExp){
    //             this.generalLv ++;
    //             this.generalExp -= maxExp;
    //             maxExp = CfgMgr.getMaxGeneralExpByLv(this.generalLv);
    //         }
    //     }
    // }
}
//武将配置数据
export class st_general_info {
    id_str;
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
    
    transType(){
        this.bingzhong = parseInt(this.bingzhong);
        this.hp = parseInt(this.hp);
        this.mp = parseInt(this.mp);
        this.atk = parseInt(this.atk);
        this.def = parseInt(this.def);
        this.recruit = parseInt(this.recruit);
        this.skillNum = parseInt(this.skillNum);
    }
    constructor(){
    }
    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
}

//招兵配置数据
export class st_recruit_info{
    id_str;
    name;
    gold;   //百兵招募花费金币
    food;   //百兵行军每月消耗粮草
    desc;   //对话内容
    
    transType(){
        this.gold = parseInt(this.gold);
        this.food = parseInt(this.food);
    }

    constructor(){
    }
    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
}

//官职配置数据
export class st_official_info{
    id_str;
    name;  //官职名称
    level;  //官职品级
    count;   //领兵最大数量
    subs;  //下属官职
    desc;   //对话内容
    
    transType(){
        this.level = parseInt(this.level);
        this.count = parseInt(this.count);
        this.subs = FunMgr.getIntAry(this.subs, ";");
    }
    constructor(){
    }
    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
}
//割据势力配置数据
export class st_camp_info {
    id_str;
    name;   //势力名称
    flag;   //旗帜名称
    friends;   //盟友阵营
    generals;  //所属武将1101-1105
    citys;  //所属城池ID集合
    
    transType(){
        this.citys = FunMgr.getIntAry(this.citys, ";");
        this.generals = FunMgr.getIntRegionAry(this.generals, "-");
    }
    constructor(){
    }
    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
}

//章节配置数据
export class st_chapter_info{
    id_str;
    name;  //名称
    rewards;  //章节奖励
    stories;   //章节剧情  1001-1027
    desc;   
  
    transType(){
        this.rewards = FunMgr.getIntAry(this.rewards, ";");
        this.stories = FunMgr.getIntRegionAry(this.stories, "-");
    }
    constructor(){
    }
    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
}
//剧情配置数据
export class st_story_info{
    id_str;
    next_id;  //下一剧情，空则+1
    chapterId;
    type;   //剧情类型 任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗  6学习技能
    targetCity;   //目标城池
    name;   //名称
    battleId;   //战斗ID 
    rewards;   //奖励 id-val;id-val
    talks;   //对话 104;105
    desc;   //剧情简介
    
    transType(){
        this.type = parseInt(this.type);
        this.targetCity = parseInt(this.targetCity);
        this.battleId = parseInt(this.battleId);
        this.rewards = FunMgr.getKeyValAry(this.rewards, ";");   //[{"key":ss[0], "val":parseInt(ss[1])}]
        this.talks = FunMgr.getIntAry(this.talks, ";");
    }
    constructor(){
    }
    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
}
//对话配置数据
export class st_talk_info{
    id_str;
    city;   //目标城池
    type;   //对话类型 type 故事类型，0默认（摇旗）1起义暴乱（火） 2 战斗（双刀） 3募兵 4封官 5主城 6招将
    head;   //对话头像，<100为head_talk中头像，>100为head头像
    generals;  //武将头像
    official;   //官职头衔
    skip;   //是否可以跳过
    date;   //对话时间年月
    desc;   //对话内容
    
    transType(){
        this.city = parseInt(this.city);
        this.type = parseInt(this.type);
        this.head = parseInt(this.head);
        this.generals = FunMgr.getIntAry(this.generals, ";");
        this.official = FunMgr.getIntAry(this.official, ";");
        this.skip = parseInt(this.skip);
    }
    constructor(){
    }
    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
}

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
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        //不必写入本地存储的变量
        temp.itemCfg = null;
        return temp;
    }

    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
}
//道具配置数据
export class st_item_info{
    id_str;
    name;     //战斗名称
    type;     //道具类型
    cost;     //售卖价格
    get_way;   //获取途径
    desc;     //介绍
    
    transType(){
        this.type = parseInt(this.type);
        this.get_way = parseInt(this.get_way);
        this.cost = parseInt(this.cost);
    }

    constructor(){
    }
    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
}



//战斗配置数据
export class st_battle_info{
    id_str;
    name;     //战斗名称
    generals;   //友军
    soldiers;  //士兵集合
    enemys;   //敌方部曲（武将ID-等级） 1004-1;6001-3
    
    transType(){
        this.generals = FunMgr.getKeyValAry(this.generals, ";");   //ret.push({"key":ss[0], "val":parseInt(ss[1])});
        this.soldiers = FunMgr.getKeyValAry(this.soldiers, ";"); 
        this.enemys = FunMgr.getKeyValAry(this.enemys, ";"); 
    }

    constructor(){
    }
    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
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
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        //不必写入本地存储的变量
        temp.skillCfg = null;
        return temp;
    }
}
//对话配置数据
export class st_skill_info{
    name;  //技能名称
    cost;  //技能消耗的钻石（金锭）
    mp;  //技能消耗的智力值
    hp;  //技能增加的生命值 0无作用 正值对己方作用 负值对敌方作用
    atk;  //技能增加的攻击力 0无作用 正值对己方作用 负值对敌方作用
    def;  //技能增加的防御力 0无作用 正值对己方作用 负值对敌方作用
    shiqi;  //技能增加的士气值 0无作用 正值对己方作用 负值对敌方作用
    desc;
    
    transType(){
        this.cost = parseInt(this.cost);
        this.mp = parseInt(this.mp);
        this.hp = parseInt(this.hp);
        this.atk = parseInt(this.atk);
        this.def = parseInt(this.def);
        this.shiqi = parseInt(this.shiqi);
    }

    constructor(){
    }
    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
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
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        //不必写入本地存储的变量
        temp.nvCfg = null;
        return temp;
    }
}

//后宫配置数据
export class st_beautiful_info{
    name;
    desc;
    
    transType(){
    }

    constructor(){
    }
    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
}

//建筑配置数据
export class st_build_info{
    name;
    cost;
    desc;
    
    transType(){
        this.cost = parseInt(this.cost);
    }

    constructor(){
    }
    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
}

//引导配置信息
export class st_guide_info{
    info;   //引导提示
    key;   //是否关键步骤
    end;    //是否大步骤引导结束
    offsetY;   //提示相对引导框的上下位置偏移
    desc;    //引导描述

    transType(){
        this.key = parseInt(this.key);
        this.end = parseInt(this.end);
        this.offsetY = parseInt(this.offsetY);
    }

    constructor(){
    }

    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);  // st_guide_info();
        return temp;
    }
}


//*********************  以下为接口类定义 *********************************** */
const { ccclass } = cc._decorator;
@ccclass
class CfgManager_class {

    index = 0;

    overCallBack: any = null;   //加载完毕后回调
    overTarget: any = null;   //加载完毕回调注册者

    //城池配置表
    C_city_info : Map<number, st_city_info> = new Map<number, st_city_info>();
    SC_city_info = st_city_info;
    //武将配置表
    C_general_info : Map<number, st_general_info> = new Map<number, st_general_info>();
    SC_general_info = st_general_info;
    //招兵配置表
    C_recruit_info : Map<number, st_recruit_info> = new Map<number, st_recruit_info>();
    SC_recruit_info = st_recruit_info;
    //官职配置表
    C_official_info : Map<number, st_official_info> = new Map<number, st_official_info>();
    SC_official_info = st_official_info;
    //势力配置表
    C_camp_info : Map<number, st_camp_info> = new Map<number, st_camp_info>();
    SC_camp_info = st_camp_info;
    //章节配置表
    C_chapter_info : Map<number, st_chapter_info> = new Map<number, st_chapter_info>();
    SC_chapter_info = st_chapter_info;
    //剧情配置表
    C_story_info : Map<number, st_story_info> = new Map<number, st_story_info>();
    SC_story_info = st_story_info;
    //对话配置表
    C_talk_info : Map<number, st_talk_info> = new Map<number, st_talk_info>();
    SC_talk_info = st_talk_info;
    //物品配置表
    C_item_info : Map<number, st_item_info> = new Map<number, st_item_info>();
    SC_item_info = st_item_info;


    //战斗配置表
    C_battle_info : Map<number, st_battle_info> = new Map<number, st_battle_info>();
    SC_battle_info = st_battle_info;





    //技能配置表
    C_skill_info : Map<number, st_skill_info> = new Map<number, st_skill_info>();
    SC_skill_info = st_skill_info;

    //后宫配置表
    C_beautiful_info : Map<number, st_beautiful_info> = new Map<number, st_beautiful_info>();
    SC_beautiful_info = st_beautiful_info;

    //建筑配置表
    C_build_info : Map<number, st_build_info> = new Map<number, st_build_info>();
    SC_build_info  = st_build_info;

    // //引导配置表
    // C_guide_info : Map<number, st_guide_info> = new Map<number, st_guide_info>();
    // SC_guide_info = st_guide_info;

    //********************** 以下是一些配置接口 ***************** */
    /**获取城池配置数据 */
    getCityConf(cityId: string): st_city_info{
        let obj = this.C_city_info[cityId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }
    /**获取官职配置数据 */
    getOfficalConf(officeId: string): st_official_info{
        let obj = this.C_official_info[officeId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }
    getAllOfficalConf(){
        return this.C_official_info;
    }
    /**获取武将配置数据 */
    getGeneralConf(generalId: string): st_general_info{
        let obj = this.C_general_info[generalId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }
    /**获取招募配置数据 */
    getRecruitConf(soldierId: string): st_recruit_info{
        let obj = this.C_recruit_info[soldierId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }
    /**获取势力阵营配置数据 */
    getCampConf(campId: string): st_camp_info{
        let obj = this.C_camp_info[campId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }
    /**获取任务配置数据 */
    getTaskConf(taskId: string): st_story_info{
        let obj = this.C_story_info[taskId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }
    /**获取话本配置数据 */
    getTalkConf(talkId: string): st_talk_info{
        let obj = this.C_talk_info[talkId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }




    /**获取引导配置数据 */
    getGuideConf(guideId: number): st_guide_info{
        // let obj = this.C_guide_info[guideId];
        // if(obj){
        //     return obj.clone();
        // }else{
        //     return null;
        // }
        return null;
    }
    
    /**获取道具配置数据 */
    getItemConf(itemId: number): st_item_info{
        let obj = this.C_item_info[itemId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取战场数据 */
    getBattleConf(battleId: number): st_battle_info{
        let obj = this.C_battle_info[battleId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取技能数据 */
    getSkillConf(skillId: number): st_skill_info{
        let obj = this.C_skill_info[skillId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取后宫数据 */
    getBeautifulConf(nvId: number): st_beautiful_info{
        let obj = this.C_beautiful_info[nvId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取建筑数据 */
    getBuildConf(buildId: number): st_build_info{
        let obj = this.C_build_info[buildId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    //*************************************  以下为读取配置接口 *********************************** */

    /*** 加载所有配置 */
    loadAllConfig(){
        this.loadConfigList(this);
    }

    /**加载本地配置列表 */
    loadConfigList(data){
        let keys = Object.getOwnPropertyNames(data);
        data.index = 0;
        for (let k of keys) {
            if (k[0] == "C") {
                data.index++;
                let path = "config/" + k.substr(2);
                this.getConfigInfo(k, path, data);
            }
        }
    }

    //获取Config配置
    getConfigInfo(name: string, path: string, data:any) {
        cc.loader.loadRes(path, (err, resource) => {
            if (err) {
                cc.log(`配置文件${path}不存在, ${err.message}`);
                // return null;
            }
            let str: string = resource.text;   //cc.loader.getRes(resource.nativeUrl);
            this.setConfigInfoByResource(str, name, data);  //通过远程加载或本地加载获取数据后，设置配置表数据
        })
    }

    //通过远程加载或本地加载获取数据后，设置配置表数据
    setConfigInfoByResource(str:string, name: string, data:any){
        let self = data;
        if (str) {
            let sc = data["S" + name];
            
            if (typeof str != "string") {
                cc.error("load config " + name + " error!");
            } else {

                let sList;
                if (str.indexOf("\r\n") < 0) {
                    sList = str.split("\n");
                } else {
                    sList = str.split("\r\n");
                }
                let retObj = {};

                let subObj = retObj;

                for (let line of sList) {
                    if (line != null && line.length > 0) {
                        if (line[0] == "#") {
                            continue;
                        }

                        if (line[0] == "[") {
                            if(sc != null){
                                subObj = new sc;
                            }else{
                                subObj = {};
                            }

                            let objName = line.substr(1, line.length - 2);
                            retObj[objName] = subObj;
                            continue;
                        }

                        let sk = line.split("=");
                        if (sk.length > 1) {
                            let k = sk[0].trim();  //用于删除字符串的头尾空格
                            let v = sk[1].trim();
                            subObj[k] = v;
                        }
                    }
                }

                if(subObj["transType"] != null){
                    // subObj["transType"]();
                    for(let o in retObj){
                        retObj[o]["transType"]();
                    }

                }

                self[name] = retObj;
                cc.log("load config " + name + " finsih! length:" + str.length);
            }
        }

        self.index--;
        if (self.index <= 0) {
            cc.log("load all config finsih!");

            if(this.overCallBack && this.overTarget){
                this.overCallBack.call(this.overTarget, null);
            }
            this.overCallBack = null;
            this.overTarget = null;
        }
    }

    //设置加载配置完毕回调
    setOverCallback(callback: any, target: any){
        this.overCallBack = callback;
        this.overTarget = target;
    }

    //根据武将等级获得升级经验
    getMaxGeneralExpByLv(lv: number){
        if(lv <= 100){
            return lv*100;
        }
    }


}

export var CfgMgr = new CfgManager_class();



