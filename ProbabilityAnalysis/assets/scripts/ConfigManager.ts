

const { ccclass } = cc._decorator;

//***************************  以下为配置表数据结构定义 ****************************** */

export enum AnalysisType{
    daletou = 0,
    shuangseqiu = 1,
}

export class shuangseqiu_info{
    constructor(){
    }
}
export class daletou_info{
    constructor(){
    }
}
export class recommend_ball_info{
    public ballId: number = 0;
    public ballCount: number = 0;  //累计总次数
    public ballPeriodNum: number = 0;  //短期累计次数
	public probability: string = "";  //累计概率%
    public chanceShort: string = "";  //短期概率%
    public chanceAdjust: string = "";   //概率矫正%
	public recommendChance: number = 0;  //推荐概率%

    constructor(ball:ball_info){
        this.ballId = ball.ballId;
        this.ballCount = ball.ballCount;  //累计总次数
        this.ballPeriodNum = ball.ballPeriodNum;  //短期累计次数
		this.probability = ball.probability.toFixed(5);  //累计概率%
        this.chanceShort = ball.chanceShort.toFixed(5);  //短期概率%
        this.chanceAdjust = ball.chanceAdjust.toFixed(5);   //概率矫正%
		this.recommendChance = ball.recommendChance.toFixed(5);   //推荐概率%
    }
}

export class ball_info{
    public ballId: number = 0;
    public ballCount: number = 0;  //累计总次数
    public ballPeriodNum: number = 0;  //短期累计次数
    public chanceLong: number = 0;  //长期概率%
    public chancePeriod: number = 0;  //前期概率%
    public chanceShort: number = 0;  //短期概率%
    public chanceAdjust: number = 0;   //概率矫正%
	public probability: number = 0;  //累计概率%
	public recommendChance: number = 0;  //推荐概率%

    //以下列统计用到
    public spacesArr: number[] = [];  //间隔再现数组
    public leftIdArr: number[] = [];   //同期左侧球（可以存在多个相同值）
    public rightIdArr: number[] = [];    //同期右侧球（可以存在多个相同值）
    public nextIdArr1: number[] = [];   //后继1期数组（可以存在多个相同值）
    public nextIdArr2: number[] = [];   //后继2期数组（可以存在多个相同值）
    public nextIdArr3: number[] = [];   //后继3期数组（可以存在多个相同值）

    constructor(ballId:number){
        this.ballId = ballId;
    }

    //根据总数据和短期数据进行数据矫正
    public adjustAnalysis(allCount:number, offsetCount:number, valNum:number){
        this.chanceLong = this.ballCount/allCount;  //长期概率%
        this.chancePeriod = this.ballPeriodNum/(allCount-offsetCount);  //前期概率%
		this.chanceShort = (this.ballCount - this.ballPeriodNum)/offsetCount;   //短期内的概率
    }
	
    //外围总计矫正
    public adjustAnalysisByTotal(averageVal:number){
		if(this.chanceShort < 0.001 || this.chanceLong < 0.001){   //近期很少出现
			this.probability = 0;  
		}else{
			let chanceMax = Math.max(this.chanceLong, this.chanceShort);
			let tempTimes = this.chanceShort/this.chanceLong;
			if(this.ballCount > averageVal*1.5){   //高概率区间，对应峰值周边部分
				if(tempTimes >= 0.8 && tempTimes <1.1){  //合理正常范围内，后续继续保持改概率
					this.probability = this.chanceShort*1.1;
				}else if(tempTimes >=1.1 && tempTimes <=1.5){  //合理正常范围内，后续继续保持改概率
					this.probability = this.chanceShort*0.95;
				}else if(tempTimes > 1.5){  //虽然在高概率区间内，但是短期概率过高，后续可能会降低
					this.probability = this.chanceShort*(1.0-tempTimes/15);
				}else if(tempTimes < 0.8){  //虽然在高概率区间内，但是短期概率过低，后续可能会稍微增加
					this.probability = this.chanceShort*(1.0+0.1/tempTimes);
				}
			}else if(this.ballCount > averageVal*0.8){  //半腰区间，一般对待
				if(tempTimes >= 0.8 && tempTimes <=1.3){  //合理正常范围内，后续继续保持改概率
					this.probability = this.chanceShort;
				}else if(tempTimes > 1.3){  //短期概率过高，后续可能会降低
					this.probability = this.chanceShort*(1.0-tempTimes/10);
				}else if(tempTimes < 0.8){  //短期概率过低，后续可能会稍微增加
					this.probability = this.chanceShort*(1.0+0.1/tempTimes);
				}
			}else{   //平谷区间，出现概率较少
				this.probability = (this.chanceShort + this.chanceLong)/2;
			}
		}
		this.recommendChance = this.probability;  //推荐概率%
    }
	
    //有效区间内进行校正
    public adjustAnalysisByBoundary(boundaryAverage:number, analysisType:AnalysisType){
		if(this.chanceShort < 0.001 || this.chanceLong < 0.001){   //近期很少出现
			this.probability = 0;
		}else{
			let chanceMax = Math.max(this.chanceLong, this.chanceShort);
			let tempTimes = this.chanceShort/this.chanceLong;
			if(this.ballCount > boundaryAverage*1.5){   //高概率区间，对应峰值周边部分
				if(tempTimes >= 0.8 && tempTimes <1.1){  //合理正常范围内，后续继续保持改概率
					this.probability = this.chanceShort*1.1;
				}else if(tempTimes >=1.1 && tempTimes <=1.5){  //合理正常范围内，后续继续保持改概率
					this.probability = this.chanceShort*0.95;
				}else if(tempTimes > 1.5){  //虽然在高概率区间内，但是短期概率过高，后续可能会降低
					this.probability = this.chanceShort*(1.0-tempTimes/15);
				}else if(tempTimes < 0.8){  //虽然在高概率区间内，但是短期概率过低，后续可能会稍微增加
					this.probability = this.chanceShort*(1.0+0.1/tempTimes);
				}
			}else if(this.ballCount > boundaryAverage*0.8){  //半腰区间，一般对待
				if(tempTimes >= 0.8 && tempTimes <=1.3){  //合理正常范围内，后续继续保持改概率
					this.probability = this.chanceShort;
				}else if(tempTimes > 1.3){  //短期概率过高，后续可能会降低
					this.probability = this.chanceShort*(1.0-tempTimes/10);
				}else if(tempTimes < 0.8){  //短期概率过低，后续可能会稍微增加
					this.probability = this.chanceShort*(1.0+0.1/tempTimes);
				}
			}else{   //平谷区间，出现概率较少
				this.probability = (this.chanceShort + this.chanceLong)/2;
			}
		}
		this.chanceAdjust = 0;   //先设定一个假的矫正概率，使得每个小球出现的概率达到一定高度（比如0.5），然后根据最后10-20期的数据来修正这个矫正概率chanceAdjust
		
		if(analysisType == AnalysisType.shuangseqiu){
		}
    }
	
    //由后继而校正的概率
    public adjustAnalysisByLast(last_chance:number, lottery:number, adjustCount:number){
		if(lottery < 0){  //最后的推测，不用参与修正
			this.chanceAdjust += last_chance*0.1;
			this.recommendChance = this.probability + this.chanceAdjust;  //推荐概率%
		}else if(lottery > 0){   //添加后继因素，并修正概率
			if(lottery == this.ballId){   //压中
				let adjust_chance = 0.5 - (this.probability + last_chance*0.1)
				this.chanceAdjust = (this.chanceAdjust*(adjustCount-1) + adjust_chance)/adjustCount  //概率矫正%
			}else{    //未压中
				this.chanceAdjust = (this.chanceAdjust*(adjustCount-1)*0.95)/adjustCount  //概率矫正%
			}
		}
    }

    //短期累计次数
    public addPeriodNum(){ 
        this.ballPeriodNum ++;  
    }
    //设置累计总次数及同期左右两侧值
    public setLeftRightIds(leftVal:number=-1, rightVal:number=-1){ 
        this.ballCount ++;  //累计总次数
        if(leftVal >= 0){
            this.leftIdArr.push(leftVal);  //0为边界指示
        }
        if(rightVal >= 0){
            this.rightIdArr.push(rightVal);  //0为边界指示
        }
    }
    //设置后续三期的后继值
    public setNextIds(nextVal1:number=-1, nextVal2:number=-1, nextVal3:number=-1){ 
        if(nextVal1 > 0){
            this.nextIdArr1.push(nextVal1); 
        }
        if(nextVal2 > 0){
            this.nextIdArr2.push(nextVal2); 
        }
        if(nextVal3 > 0){
            this.nextIdArr3.push(nextVal3); 
        }
    }
}
export class cow_info{
    public cowId: number = 0;
    public boundary: cc.Vec2 = cc.Vec2.ZERO;   //取值范围
    public recommends: recommend_ball_info[] = [];   //推荐球集合（概率由高到低）
    public ballArr: ball_info[] = [];   //具体球的分布数据

    constructor(cowId: number, valNum:number){
        this.cowId = cowId;
        this.ballArr = [];   //具体球的分布数据
        for(let i=0; i<valNum; i++){
            let ballInfo = new ball_info(i+1)
            this.ballArr.push(ballInfo)
        }
    }

    //根据总数据和短期数据进行数据矫正
    public adjustCowAnalysis(allCount:number, offsetCount:number, valNum:number, analysisType:AnalysisType){
		let boundaryTotalCount: number = 0;
		let boundaryPeriodNum: number = 0;
        for(let idx=0; idx<valNum; idx++){
            this.ballArr[idx].adjustAnalysis(allCount, offsetCount, valNum);   //根据总数据和短期数据进行数据矫正
			if(this.ballArr[idx].chanceLong >= 0.01){
				if(this.boundary.x == 0){
					this.boundary.x = idx+1;
				}
				this.boundary.y = idx+1;   //有效区间
				boundaryTotalCount += this.ballArr[idx].ballCount;
				boundaryPeriodNum += this.ballArr[idx].ballPeriodNum;
			}
        } 
		let boundaryLimit = this.boundary.y - this.boundary.x + 1;
	    for(let idx=this.boundary.x-1; idx<this.boundary.y; idx++){
			this.ballArr[idx].adjustAnalysisByBoundary(boundaryTotalCount/boundaryLimit, analysisType);
        } 
		//cc.log("this.cowId = "+this.cowId + "; this = "+JSON.stringify(this))
    }
	
    //根据后继中奖进行数据矫正
    public adjustCowAnalysisByLast(valNum:number, lottery:number, adjustCount:number, last1:number, last2:number, last3:number){
        let nextIdArr1 = this.ballArr[last1-1].nextIdArr1;
        let nextIdArr2 = this.ballArr[last2-1].nextIdArr2;
        let nextIdArr3 = this.ballArr[last3-1].nextIdArr3;
		let boundaryLimit = this.boundary.y - this.boundary.x + 1;
		let last_chance: number[] = []; 
        for(let i=0; i<valNum; i++){
			let ballId = (i+1);
            let chance = 0;  //后继球概率
            if(nextIdArr1.length > 0){
                let num1 = 0;
                for(let j=0; j<nextIdArr1.length; j++){
                    if(nextIdArr1[j] == ballId){
                        num1 ++;
                    }
                }
                chance = (num1/valNum)*0.4
            }
            if(nextIdArr2.length > 0){
                let num2 = 0;
                for(let j=0; j<nextIdArr2.length; j++){
                    if(nextIdArr2[j] == ballId){
                        num2 ++;
                    }
                }
                chance += (num2/valNum)*0.3
            }
            if(nextIdArr3.length > 0){
                let num3 = 0;
                for(let j=0; j<nextIdArr3.length; j++){
                    if(nextIdArr3[j] == ballId)){
                        num3 ++;
                    }
                }
                chance += (num3/valNum)*0.3
            }
			last_chance[i] = chance;
			
			//添加后继因素，并修正概率
			this.ballArr[i].adjustAnalysisByLast(chance, lottery, adjustCount); 
        }
    }

    public getRecommendBalls(ballNum:number, last1:number, last2:number, last3:number): recommend_ball_info[]{
		this.adjustCowAnalysisByLast(ballNum, -1, -1, last1, last2, last3);
		
        let recommendBalls:ball_info[] = []
        for(let i=0; i<ballNum; i++){  
            recommendBalls.push(this.ballArr[i])
        }
        recommendBalls.sort((a:ball_info, b:ball_info)=>{
            return b.recommendChance - a.recommendChance;   //推荐概率%
        })
        this.recommends = []
        for(let i=0; i<10; i++){
			if(recommendBalls[i].recommendChance >= 0.01){
				this.recommends.push(new recommend_ball_info(recommendBalls[i]))
			}
        }
        return this.recommends;
    }
}

export class config_ball_info{
    first;
    second;
    third;
    fourth;
    fifth;
    sixth;
    seventh;
    count

    transType(){
        this.first = parseInt(this.first);
        this.second = parseInt(this.second);
        this.third = parseInt(this.third);
        this.fourth = parseInt(this.fourth);
        this.fifth = parseInt(this.fifth);
        this.sixth = parseInt(this.sixth);
        this.seventh = parseInt(this.seventh);
        this.count = parseInt(this.count);
    }

    constructor(){
    }
}




//*********************  以下为接口类定义 *********************************** */

@ccclass
class CfgManager_class {

    index = 0;

    overCallBack: any = null;   //加载完毕后回调
    overTarget: any = null;   //加载完毕回调注册者

    C_shuangseqiu_info : Map<number, config_ball_info> = new Map<number, config_ball_info>();
    SC_shuangseqiu_info = config_ball_info;

    C_daletou_info : Map<number, config_ball_info> = new Map<number, config_ball_info>();
    SC_daletou_info = config_ball_info;


    //*************************************  以下为读取配置接口 *********************************** */

    /*** 加载所有配置 */
    loadAllConfig(){
        this.loadConfigList(this);
    }

    /**加载本地配置列表 */
    loadConfigList(data){
        let keys = Object.getOwnPropertyNames(data);
        data.index = 0;
        //cc.log("loadConfigList keys = "+JSON.stringify(keys))
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
                //cc.log("load config " + name + " finsih! length:" + str.length+"; retObj = "+JSON.stringify(retObj));
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



