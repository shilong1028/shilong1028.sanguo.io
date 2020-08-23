

//常量或类定义

import { GeneralInfo, st_general_info } from "./ConfigManager";

//游戏平台
export const ChannelDef = {
    Default: "Default", 
    Wechat: "Wechat", 
    TouTiao: "TouTiao"
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
    huangjinover: 1022,  //黄巾之乱结束(黄巾叛军占据城池旗帜复原)
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
export enum TaskType{
    Story = 1,   //剧情
    Fight = 2,   //战斗
    Recruit = 3,   //招募士兵
    Offical = 4,   //封官拜将
    Capital = 5,   //主城建设
    General = 6,   //招募武将
    Garrison = 7,   //驻守
}





//-------------------------------  以下为数据类结构体定义  ------------------------------------



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

//武将卡牌战斗信息
export class CardInfo{
    flagId: number = 0;   //阵营，0默认，1蓝方，2红方
    shiqi: number = 100;   //士气值
    generalInfo: GeneralInfo = null;   //武将信息

    constructor(flagId: number, generalInfo: GeneralInfo=null){
        this.flagId = flagId;
        this.shiqi = 100;
        this.generalInfo = generalInfo;
    }

    clone(){
        let temp = new CardInfo(this.flagId, this.generalInfo);
        temp.shiqi = this.shiqi;

        return temp;
    }
}









