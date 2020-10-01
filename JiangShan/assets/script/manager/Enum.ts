

//常量或类定义

import { GeneralInfo } from "./ConfigManager";

//公用方法管理器
const {ccclass, property} = cc._decorator;

@ccclass
class FunManager {
    //----------------------------------  公用方法接口  -------------------------------------------
    /**对象深拷贝 */
    ObjClone(obj){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
    
    //配置中有效的string字段是否有效
    checkConfStrVal(str){
        if(!str || str == "" || str == "0"){
            return false;
        }else{
            return true;
        }
    }

    /**二维坐标转三维 */
    v2Tov3(pos: cc.Vec2){
        return cc.v3(pos.x, pos.y, 0);
    }

    /**三维坐标转二维 */
    v3Tov2(pos: cc.Vec3){
        return cc.v2(pos.x, pos.y);
    }

    /**数值转进度0.0-1.0 */
    num2progess(num: number){
        if(num < 0){
            return 0;
        }else if(num > 1.0){
            return 1.0;
        }
        return num;
    }

    /**数字科学显示 KMBT... 
     * @param num 要转换的数字
     * @param fixNum 小数点有效位数
    */
    num2e(num: number, fixNum: number = 4) {
        if (num <= 1000000) {
            return num.toString();
        } else {
            //将数值用parseFloat(num).Fixed(8)保留固定位数，但有个缺点，就是如果数值小于8位的，则会多出余数0，如:0.00000010
            //E是指数的意思，比如7.823E5=782300 这里E5表示10的5次方
            var p = Math.floor(Math.log(num) / Math.LN10);   //p是10的几次方
            var n = num * Math.pow(10, -p);   //n为最终显示的小数

            let factor = Math.pow(10, fixNum);
            if (p < 6) {
                return num.toString(); 
            } else if (p < 9) {
                n = n * Math.pow(10, (p - 6));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "万";
             } else if (p < 12) {
                n = n * Math.pow(10, (p - 9));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "十万";
            } else if (p < 15) {
                n = n * Math.pow(10, (p - 12));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "百万";
            } else if (p < 18) {
                n = n * Math.pow(10, (p - 15));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "千万";
            } else{
                n = n * Math.pow(10, (p - 18));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "亿";
            }
        }
    }
    num2e2(num: number, fixNum: number = 2) {
        if (num <= 1000) {
            return num.toString();
        } else {
            //将数值用parseFloat(num).Fixed(8)保留固定位数，但有个缺点，就是如果数值小于8位的，则会多出余数0，如:0.00000010
            //E是指数的意思，比如7.823E5=782300 这里E5表示10的5次方
            var p = Math.floor(Math.log(num) / Math.LN10);   //p是10的几次方
            var n = num * Math.pow(10, -p);   //n为最终显示的小数

            let factor = Math.pow(10, fixNum);
            if (p < 3) {
                return num.toString();
            } else if (p < 6) {
                n = n * Math.pow(10, (p - 3));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "K";
            } else if (p < 9) {
                n = n * Math.pow(10, (p - 6));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "M";
            } else if (p < 12) {
                n = n * Math.pow(10, (p - 9));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "B";
            } else if (p < 15) {
                n = n * Math.pow(10, (p - 12));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "T";
            } else {
                let pp = p - 15;
                //var alphabet= String.fromCharCode(64 + parseInt(填写数字);  A-65， Z-90, a-97, z-122
                for (let i = 0; i < 26; ++i) {
                    let firstChar = String.fromCharCode(97 + i);
                    if (pp >= 26 * 3) {   //78
                        pp -= 26 * 3;
                    } else {
                        let ppp = pp / 3;
                        let last_j = 0;
                        for (let j = 0; j < 26; ++j) {
                            if (ppp >= j) {
                                last_j = j;
                            } else {
                                let secondChar = String.fromCharCode(97 + last_j);
                                n = n * Math.pow(10, (pp % 3));
                                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                                return nStr + firstChar + secondChar;
                            }
                        }
                    }

                }
            }
        }
    }

    /**判定给定时间和现在是否同一天 */
    isSameDayWithCurTime(lastTime: number){
        if(lastTime < 10000){
            return false;
        }
        let curDate = new Date();
        let curDay = curDate.getDay();
        let curMonth = curDate.getMonth();
 
        let lastDate = new Date();
        lastDate.setTime(lastTime);
        let lastDay = lastDate.getDay();
        let lastMonth = lastDate.getMonth();

        //console.log("lastTime = "+lastTime+"; lastDay = "+lastDay+"; lastMonth = "+lastMonth+"; curDay = "+curDay+"; curMonth = "+curMonth)

        if(curMonth == lastMonth && curDay == lastDay){
            return true;
        }else{
            return false;
        }
    }

    /**解析字符串，获取整形区间数组 */
	getIntRegionAry(str: string, sp: string = "-"): Array<number> {
        let ret: Array<number> = [];
        if(str == "" || str == "0"){
            return ret;
        }
        let sL = str.toString().split(sp);
        if(sL[0]){
            let beginId = parseInt(sL[0]);
            ret.push(beginId);
            if(sL[1]){
                let endId = parseInt(sL[1]);
                for(let id=beginId+1; id<=endId; id++){
                    ret.push(id);
                }
            }
        }
		return ret;
    }

    /**解析字符串，获取整形数组 */
	getIntAry(str: string, sp: string = ";"): Array<number> {
        let ret: Array<number> = [];
        if(str == "" || str == "0"){
            return ret;
        }
		let sL = str.toString().split(sp);
		for (let p of sL) {
			if (p.length > 0) {
				ret.push(parseInt(p));
			}
		}
		return ret;
    }

    /**解析复杂的字符串，获取整形数组 */
	getKeyValAry(str: string, sp: string = ";", sp2: string = "-"): Array<any> {
        let ret: Array<any> = [];
        if(str == "" || str == "0"){
            return ret;
        }
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
	getStringAry(str: string, sp: string = ";"): Array<string> {
        let ret: Array<string> = [];
        if(str == "" || str == "0"){
            return ret;
        }
		let sL = str.toString().split(sp);
		for (let p of sL) {
			if (p.length > 0) {
				ret.push(p);
			}
		}
		return ret;
    }


}
export var FunMgr = new FunManager();


//----------------------------- 一些枚举定义  ----------------------------------
//游戏平台
export enum ChannelDef {
    Default= "Default", 
    Wechat= "Wechat", 
    TouTiao= "TouTiao",
}

/** 通用道具类型 */
export enum ComItemType{
    Gold = 101,    //金锭（金币）
    Diamond = 102,   
    Food = 201,    //粮草
    Drug = 202,    //药草
    Exp0 = 300,   //直接添加到主角身上的经验
    Exp1 = 301,   //经验丹
    Exp2 = 302,   //经验丹
    Exp3 = 303,   //经验丹
}

/**士兵类型 */
export enum SoliderType {
    qibing= 401,    //骑兵装备战马和马刀，高移动力，防御力一般，攻击力一般。克制刀兵，但被枪兵克制。
    //骑兵四方向前进两格，四方向攻击一格；攻击+2士气，回合-1士气；
    daobing= 402,   //刀兵装备大盾和钢刀，移动力一般，防御力高，攻击力一般。克制枪兵，但被骑兵克制。
    //刀兵九方向前进一格，九方向攻击一格；攻击+1士气，回合-1士气；
    qiangbing= 403, //枪兵装备厚甲和长枪，移动力一般，防御力一般，攻击力高。克制骑兵，但被刀兵克制。
    //枪兵四方向前进一格，四方向攻击一格；攻击+1士气，回合-0士气；
    gongbing= 404   //弓兵装备长弓或连弩，可以远程攻击，但移动力一般，防御力弱，攻击力弱。
    //弓兵九方向前进一格，九方向攻击一格，四方向攻击两格；攻击+1士气，回合-1士气，受击-1士气；
}

/** 任务剧情类型 */
export enum TaskType{  
    Story = 1,   //剧情
    Fight = 2,   //战斗
    Recruit = 3,   //招募士兵
    Offical = 4,   //封官拜将
    Capital = 5,   //主城建设
    General = 6,   //招募武将
    Garrison = 7,   //驻守
    Skill = 8,   //技能
    War = 9,  //攻城略地
}
/** 任务剧情状态 */
export enum TaskState{
    Ready = 0,   //准备开始
    Finish = 1,   //引导完成
    Reward = 2,   //任务完成，可领奖
    Over = 3,   //奖励领取完毕
}





//-------------------------------  以下为战斗相关数据类结构体定义  ------------------------------------

/** 战斗地块类型 */
export enum BlockType{   
    Mid = 0,   //0中间地带
    Myself = 1,   //1我方范围
    Enemy = 2,   //2敌方范围
}

/** 战斗建筑类型 */
export enum BlockBuildType{ 
    None = 0,   //0无
    Barracks = 1,   //1营寨
    Watchtower = 2,   //2箭楼
    Granary = 3,   //3粮仓
}

/** 砖块之间的AI战斗联系 */
export enum BlockRelation{ 
    None = 0,   //0无（距离远）
    Reach = 1,   //1可移动范围内
    Attack = 2,   //2攻击范围内
    ReachAndAtk = 3,  //3可移动可攻击
    Obstruct = 4,  //4中间有阻碍
}

/** 出战武将卡牌类型 */
export enum CardType{  
    Normal = 0,   //0普通
    Chief = 1,   //1主将
    Forward = 2,   //2前锋
    Guard = 3,     //3后卫
}
export const CardTypeArr = [CardType.Chief, CardType.Forward, CardType.Forward, CardType.Guard,
    CardType.Normal, CardType.Normal, CardType.Normal, CardType.Normal, CardType.Normal, CardType.Normal];
export const CardTypeNameArr = ["主将", "左前锋", "右前锋", "后卫", "侧卫", "侧卫", "侧卫", "侧卫", "侧卫", "侧卫"];

/** 出战武将卡牌状态 */
export enum CardState{  //状态，0作战，1阵亡，2混乱，3逃逸，4被俘
    Normal = 0,   //0作战
    Dead = 1,   //1阵亡(武将血量<0)
    Confusion = 2,   //2混乱(部曲士气过低<10)
    Flee = 3,   //3逃逸(部曲士兵数量过少<100)
    Prisoner = 4,   //4被俘
}

/** 游戏结束状态 */
export enum GameOverState{ 
    None = 0,   //0未结束
    MyChiefDead = 1,   //1我方主将阵亡 逃逸 被俘
    MyBarracksLose = 2,   //2我方本阵大营丢失
    MyRetreat = 3,   //3我方总撤退()
    MyRoundOver = 4,  //4我方回合用完
    MyUnitLose = 5,  //5我方部曲全部失效（混乱或消亡）

    EnemyChiefDead = 11,   //11敌方主将阵亡 逃逸 被俘
    EnemyBarracksLose = 12,   //12敌方本阵大营丢失
    EnemyRetreat = 13,   //13敌方总撤退
    EnemyRoundOver = 14,  //14敌方回合用完
    EnemyUnitLose = 15,  //15敌方部曲全部失效（混乱或消亡）
}


/** 士气改变事件 */
export enum ShiqiEvent{ 
    Node = 0,  //0默认
    Round = 1,   //1回合结束
    MyWatchtowerLose = 2,   //2我方箭楼被攻陷
    MyGranaryLose = 3,   //3我方粮仓被攻陷
    EnemyWatchtowerLose = 4,   //4敌方箭楼被攻陷
    EnemyGranaryLose = 5,   //5敌方粮仓被攻陷
}

//武将卡牌战斗信息
export class CardInfo{
    cardIdStr: string = ""  //卡牌编号，用于定位 campId_generalId_bingzhong
    campId: number = 0;   //阵营，0默认，1蓝方(我方），2红方
    type: CardType = CardType.Normal;   //类型，0普通，1主将，2前锋，3后卫
    state: CardState = CardState.Normal;   //状态，0作战，1阵亡，2混乱，3逃逸，4被俘
    killCount: number = 0;   //杀敌（士兵）数量（战斗后会转换为经验）
    shiqi: number = 100;   //士气值
    bingzhong: number = 0;     //作战兵种 401骑兵402刀兵403枪兵404弓兵
    generalInfo: GeneralInfo = null;   //武将信息

    constructor(campId: number, generalInfo: GeneralInfo=null){
        this.campId = campId;
        this.type = CardType.Normal;
        this.state = CardState.Normal;
        this.killCount = 0;
        this.shiqi = 100;
        this.generalInfo = generalInfo;
        if(generalInfo && generalInfo.generalCfg){
            this.bingzhong = generalInfo.generalCfg.bingzhong
        }
        this.cardIdStr = `${this.campId}_${this.generalInfo.generalId}_${this.bingzhong}`
    }

    clone(){
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr); 
        return temp;
    }
}

//特殊故事节点
export const SpecialStory = {
    huangjinover: 1022,  //黄巾之乱结束(黄巾叛军占据城池旗帜复原)
    dongzhuoOver: 13,  //董卓之乱结束(董卓叛军占据城池旗帜复原)
    taishouOpen: 10,  //东郡太守（占据东郡）
    zhoumuOpen: 11,  //兖州牧（占据山阳昌邑，治下兖州）
    mubingOpen: 2,  //开启募兵
    unitOpen: 3,   //开启部曲
    skillOpen: 9,   //开启技能
    capitalOpen: 12,  //开启主城
}






