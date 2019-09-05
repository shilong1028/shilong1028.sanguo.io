

const { ccclass } = cc._decorator;

/*** 类型定义 */
type double = number;       //64位
type int = number;          //32位
type short = number;        //16位
type char = number;         //8位
type float = number;

//***************************  以下为配置表数据结构定义 ****************************** */

//炮弹配置数据
export class st_cannon_info{
    name;     //名称
    attack;    //攻击力
    baoji;     //暴击率（/100)
    cost;   //购买花费
    sell;    //销售价格

    transType(){
        this.attack = parseInt(this.attack);
        this.baoji = parseInt(this.baoji)/100;
        this.cost = parseInt(this.cost);
        this.sell = parseInt(this.sell);
    }

    constructor(){
    }

    clone(){
        let temp = new st_cannon_info();
        temp.name = this.name;
        temp.attack = this.attack;
        temp.baoji = this.baoji;
        temp.cost = this.cost;
        temp.sell = this.sell;
        return temp;
    }
}

//炮弹配置数据
export class st_player_info{
    name;     //名称
    cost;   //购买花费
    cannon;   //炮弹范围 5;15
    attack_up;    //攻击力提升幅度（/100)
    baoji_up;     //暴击率提升幅度（/100)
    itemCount;    //道具孔位
    desc;    

    transType(){
        this.cost = parseInt(this.cost);
        this.cannon = CfgMgr.getIntAry(this.cannon, ";");
        this.attack_up = parseInt(this.attack_up)/100;
        this.baoji_up = parseInt(this.baoji_up)/100;
        this.itemCount = parseInt(this.itemCount);
    }

    constructor(){
    }

    clone(){
        let temp = new st_player_info();
        temp.name = this.name;
        temp.cost = this.cost;
        temp.cannon = this.cannon;
        temp.attack_up = this.attack_up;
        temp.baoji_up = this.baoji_up;
        temp.itemCount = this.itemCount;
        temp.desc = this.desc;
        return temp;
    }
}

//砖块配置数据
export class st_monster_info{
    name;     //名称
    hp;   //默认血量
    event;   //事件 0无 1-间隔回合无敌 2-回合第一次盾牌 3-重生。当砖块死亡时，原地复活一个y移动砖块（Id=7)
    ai;    //行为 0无 1：左右往复移动 2：间隔吸附 3.坠落两行
    desc;    

    transType(){
        this.hp = parseInt(this.hp);
        this.event = parseInt(this.event);
        this.ai = parseInt(this.ai);
    }

    constructor(){
    }

    clone(){
        let temp = new st_monster_info();
        temp.name = this.name;
        temp.hp = this.hp;
        temp.event = this.event;
        temp.ai = this.ai;
        temp.desc = this.desc;
        return temp;
    }
}

//关卡配置数据
export class st_level_info{
    gold;     //通关奖励（2星），1星为75%，3星为150%
    cost;   //关卡消耗
    enemy_count;   //炮弹数量
    enemy_ids;    //炮弹id集合 1|1
    total_lines;     //总行数
    init_lines;    //初始显示行数
    name;  //关卡名称
    resId;   //关卡图标资源id
    itemids;    //通关道具奖励 101;102
    probability;   //通关道具掉落概率（1星）2星*2 3星*3
    
    transType(){
        this.gold = parseInt(this.gold);
        this.cost = parseInt(this.cost);
        this.enemy_count = parseInt(this.enemy_count);
        this.enemy_ids = CfgMgr.getIntAry(this.enemy_ids, "|");
        this.total_lines = parseInt(this.total_lines);
        this.init_lines = parseInt(this.init_lines);
        this.resId = parseInt(this.resId);
        this.itemids = CfgMgr.getIntAry(this.itemids, ";");
        this.probability = parseInt(this.probability)/100;
    }

    constructor(){
    }

    clone(){
        let temp = new st_level_info();
        temp.gold = this.gold;
        temp.cost = this.cost;
        temp.enemy_count = this.enemy_count;
        temp.enemy_ids = this.enemy_ids;
        temp.total_lines = this.total_lines;
        temp.init_lines = this.init_lines;
        temp.name = this.name;
        temp.resId = this.resId;
        temp.itemids = this.itemids;
        temp.probability = this.probability;
        return temp;
    }
}


//*********************  以下为接口类定义 *********************************** */

@ccclass
class CfgManager_class {

    index = 0;

    overCallBack: any = null;   //加载完毕后回调
    overTarget: any = null;   //加载完毕回调注册者

    //炮弹配置表
    C_cannon_info : Map<number, st_cannon_info> = new Map<number, st_cannon_info>();
    SC_cannon_info = st_cannon_info;

    //炮配置表
    C_player_info : Map<number, st_player_info> = new Map<number, st_player_info>();
    SC_player_info = st_player_info;

    //关卡配置表
    C_level_info : Map<number, st_level_info> = new Map<number, st_level_info>();
    SC_level_info = st_level_info;

    //砖块配置表
    C_monster_info : Map<number, st_monster_info> = new Map<number, st_monster_info>();
    SC_monster_info = st_monster_info;


    //********************** 以下是一些配置接口 ***************** */
    
    /**获取炮弹配置数据 */
    getCannonConf(cannonId: number): st_cannon_info{
        let obj = this.C_cannon_info[cannonId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取炮配置数据 */
    getPlayerConf(playerId: number): st_player_info{
        let obj = this.C_player_info[playerId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取关卡配置数据 */
    getLevelConf(levelId: number): st_level_info{
        let obj = this.C_level_info[levelId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取砖块配置数据 */
    getMonsterConf(monsterId: number): st_monster_info{
        let obj = this.C_monster_info[monsterId];
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
                            let k = sk[0].trim();
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


    //************  以下是一些常用解析方法 ************ */

    /**解析字符串，获取整形数组 */
	getIntAry(str: string, sp: string = "|"): Array<number> {
		let ret: Array<number> = [];
		let sL = str.toString().split(sp);
		for (let p of sL) {
			if (p.length > 0) {
				ret.push(parseInt(p));
			}
		}
		return ret;
    }

    /**解析复杂的字符串，获取整形数组 */
	getKeyValAry(str: string, sp: string = "|", sp2: string = "-"): Array<any> {
		let ret: Array<any> = [];
        let sL = str.toString().split(sp);
		for (let p of sL) {
			if (p.length > 0) {
                let ss = p.toString().split(sp2);
                if(ss[0] && ss[1]){
                    ret.push({"key":ss[0], "val":parseInt(ss[1])});
                }
			}
        }
		return ret;
    }
    
	/**解析字符串，获取字符串数组 */
	getStringAry(str: string, sp: string = "|"): Array<string> {
		let ret: Array<string> = [];
		let sL = str.toString().split(sp);
		for (let p of sL) {
			if (p.length > 0) {
				ret.push(p);
			}
		}
		return ret;
    }
}

export var CfgMgr = new CfgManager_class();



