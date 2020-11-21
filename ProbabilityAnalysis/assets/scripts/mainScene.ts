import { CfgMgr, AnalysisType, cow_info, ball_info, config_ball_info, recommend_ball_info } from './ConfigManager';

/*
 * @Autor: dongsl
 * @Date: 2020-10-31 11:12:37
 * @LastEditors: dongsl
 * @LastEditTime: 2020-10-31 18:05:10
 * @Description: 
 */

//主场景，用于分析数据
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {
    public cowNum: number = 7;   //列个数
    public blueIdx: number = 5;   //蓝球开始的列索引
    public blueNum: number = 12;  //蓝球范围
    public redNum: number = 35;  //红球区间

    public analysisType: number = -1;
    public allDataCount: number = 0;   //总数据数量
    public offsetCount: number = 50;  //矫正数量

    public cowAnalysis: cow_info[] = []   //列分布数据
    public totalRedArr: ball_info[] = [];   //总的红球分布数据
    public totalBlueArr: ball_info[] = [];   //总的蓝球分布数据
    public recommendReds: recommend_ball_info[] = [];   //推荐红球
    public recommendBlues: recommend_ball_info[] = [];  //推荐蓝球
    public recommendCows: any[] = [];  //推荐列

    onLoad () {
    }

    start () {
    }


    handleShuangseqiuAnalysis(){
        this.analysisType = AnalysisType.shuangseqiu;
        this.blueIdx = 6;   //篮球开始的列索引
        this.blueNum = 16;  //蓝球范围
        this.redNum = 33;  //红球区间
        this.ProbabilityAnalysis(CfgMgr.C_shuangseqiu_info);

    }
    handleDaletouAnalysis(){
        this.analysisType = AnalysisType.daletou;
        this.blueIdx = 5;   //篮球开始的列索引
        this.blueNum = 12;  //蓝球范围
        this.redNum = 35;  //红球区间
        this.ProbabilityAnalysis(CfgMgr.C_daletou_info);
    }

    ProbabilityAnalysis(C_Config:any){
        //cc.log("ProbabilityAnalysis this.analysisType = "+this.analysisType+"; C_Config = "+JSON.stringify(C_Config))
        if(this.analysisType < 0 || !C_Config){
            return;
        }
        let keys = Object.getOwnPropertyNames(C_Config);
		keys.reverse();  //k=0为最早期的数据，故需要取反
		//cc.log("ProbabilityAnalysis keys = "+JSON.stringify(keys))
        this.allDataCount = Math.min(keys.length, 50);  //总数据数量

        let temp = this.allDataCount*0.2; 
        if(temp >= 50){
            this.offsetCount = 50;
        }else{
            this.offsetCount = Math.floor(temp);  //矫正数量
        }

        this.totalRedArr = [];   //总的红球分布数据
        for(let i=0; i<this.redNum; i++){  
            let ballInfo = new ball_info(i+1)
            this.totalRedArr.push(ballInfo)
        }
        this.totalBlueArr = [];   //总的蓝球分布数据
        for(let i=0; i<this.blueNum; i++){  
            let ballInfo = new ball_info(i+1)
            this.totalBlueArr.push(ballInfo)
        }
        this.cowAnalysis = []   //列分布数据
        for(let i=0; i<this.cowNum; i++){
			if(cow >= this.blueIdx){  //篮球
				let cowInfo = new cow_info(i+1, this.blueNum)
				this.cowAnalysis.push(cowInfo)
			}else{
				let cowInfo = new cow_info(i+1, this.redNum)
				this.cowAnalysis.push(cowInfo)
			}
        }

        //统计各列同期左右和后继三期数据
        cc.log("统计各列同期左右和后继三期数据")
        let lastConf1:number[] = null;  //上一期数据
        let lastConf2:number[] = null;  //上二期数据
        let lastConf3:number[] = null;  //上三期数据
        for(let k=0; k<this.allDataCount; k++){   //从最近开始遍历
            let key = keys[k];  
            let conf:config_ball_info = C_Config[key];
            if(conf){
                let valArr: number[] = [
                    conf.first, conf.second, conf.third, conf.fourth, conf.fifth, conf.sixth, conf.seventh
                ];
                for(let cow=0; cow<this.cowNum; cow++){
                    let ballVal = valArr[cow];
                    let leftVal = 0;  //同期左侧球（可以存在多个相同值）
                    let rightVal = 0;  //同期右侧球（可以存在多个相同值）
                    if(cow>0){
                        leftVal = valArr[cow-1];
                    }
                    if(cow < this.cowNum-1){
                        rightVal = valArr[cow+1];
                    }
                    if(cow >= this.blueIdx){  //篮球
                        if(this.totalBlueArr[ballVal-1]){   //总的蓝球分布数据
                            this.totalBlueArr[ballVal-1].setLeftRightIds(leftVal, rightVal);  //设置累计总次数及同期左右两侧值
                        }
                    }else{
                        if(this.totalRedArr[ballVal-1]){    //总的红球分布数据
                            this.totalRedArr[ballVal-1].setLeftRightIds(leftVal, rightVal);  //设置累计总次数及同期左右两侧值
                        }
                    }
                    if(this.cowAnalysis[cow]){   //列分布数据
                        if(this.cowAnalysis[cow].ballArr[ballVal-1]){  
                            this.cowAnalysis[cow].ballArr[ballVal-1].setLeftRightIds(leftVal, rightVal);  //设置累计总次数及同期左右两侧值
                        }
                    }

                    if(k >= this.offsetCount){   //已经在修整偏移范围之外的期数
                        if(cow >= this.blueIdx){  //篮球
                            if(this.totalBlueArr[ballVal-1]){   //总的蓝球分布数据
                                this.totalBlueArr[ballVal-1].addPeriodNum();   //短期累计次数
                            }
                        }else{
                            if(this.totalRedArr[ballVal-1]){   //总的红球分布数据
                                this.totalRedArr[ballVal-1].addPeriodNum();   //短期累计次数
                            }
                        }
                        if(this.cowAnalysis[cow]){   //列分布数据
                            if(this.cowAnalysis[cow].ballArr[ballVal-1]){  
                                this.cowAnalysis[cow].ballArr[ballVal-1].addPeriodNum();  //短期累计次数
                            }
                        }
                    }
                }   
                //设置后继数据
                if(lastConf1 == null){
                    lastConf1 = valArr;
                    continue;
                }
                if(lastConf2 == null){
                    for(let cow=0; cow<this.cowNum; cow++){
                        let ballVal = valArr[cow];
                        let lastVal1 = lastConf1[cow];
                        if(this.cowAnalysis[cow]){   //列分布数据
                            if(this.cowAnalysis[cow].ballArr[ballVal-1]){  
                                this.cowAnalysis[cow].ballArr[ballVal-1].setNextIds(lastVal1);  //设置后续三期的后继值
                            }
                        }
                        
                    }
                    lastConf2 = lastConf1;
                    lastConf1 = valArr;
                    continue;
                }
                let lastVal3 = -1; 
                for(let cow=0; cow<this.cowNum; cow++){
                    let ballVal = valArr[cow];
                    let lastVal1 = lastConf1[cow];
                    let lastVal2 = lastConf2[cow];
                    if(lastConf3){
                        lastVal3 = lastConf3[cow];
                    } 
                    if(this.cowAnalysis[cow]){   //列分布数据
                        if(this.cowAnalysis[cow].ballArr[ballVal-1]){  
                            this.cowAnalysis[cow].ballArr[ballVal-1].setNextIds(lastVal1, lastVal2, lastVal3);  //设置后续三期的后继值
                        }
                    }
                }
                lastConf3 = lastConf2;
                lastConf2 = lastConf1;
                lastConf1 = valArr;
            }
        }

        cc.log("根据长期和短期进行概率修正")
		for(let idx=0; idx<this.redNum; idx++){
            if(this.totalBlueArr[idx]){   //总的蓝球分布数据
                this.totalBlueArr[idx].adjustAnalysis(this.allDataCount, this.offsetCount, this.blueNum);   //根据总数据和短期数据进行数据矫正
				if(this.analysisType == AnalysisType.daletou){
					this.totalBlueArr[idx].adjustAnalysisByTotal(2/this.blueNum*this.allDataCount);
				}else{
					this.totalBlueArr[idx].adjustAnalysisByTotal(1/this.blueNum*this.allDataCount);
				}
            }
            if(this.totalRedArr[idx]){   //总的红球分布数据
                this.totalRedArr[idx].adjustAnalysis(this.allDataCount, this.offsetCount, this.redNum);   //根据总数据和短期数据进行数据矫正
				if(this.analysisType == AnalysisType.daletou){
					this.totalRedArr[idx].adjustAnalysisByTotal(5/this.redNum*this.allDataCount);
				}else{
					this.totalRedArr[idx].adjustAnalysisByTotal(6/this.redNum*this.allDataCount);
				}
            }
        } 
		
		for(let cow=0; cow<this.cowNum; cow++){
            if(this.cowAnalysis[cow]){   //列分布数据
                if(cow >= this.blueIdx){  //篮球
                    this.cowAnalysis[cow].adjustCowAnalysis(this.allDataCount, this.offsetCount, this.blueNum, this.analysisType);   //根据总数据和短期数据进行数据矫正
                }else{
                    this.cowAnalysis[cow].adjustCowAnalysis(this.allDataCount, this.offsetCount, this.redNum, this.analysisType);   //根据总数据和短期数据进行数据矫正
                }
            }
        } 

		cc.log("根据最近10期后继进行概率修正")
		let adjustCount = 0;   //修正次数
		for(let idx=this.offsetCount; idx>0; idx--){
			lastConf1 = null;  //上一期数据
			lastConf2 = null;  //上二期数据
			lastConf3 = null;  //上三期数据
			for(let k=0; k<3; k++){   //从最近开始遍历
				let key = keys[idx+k]   
				let conf:config_ball_info = C_Config[key];
				if(conf){
					let valArr: number[] = [
						conf.first, conf.second, conf.third, conf.fourth, conf.fifth, conf.sixth, conf.seventh
					];
					if(k==0){
						lastConf1 = valArr;
					}else if(k == 1){
						lastConf2 = valArr;
					}else if(k == 2){
						lastConf3 = valArr;
					}
				}
			}
			//cc.log("lastConf1 = "+JSON.stringify(lastConf1))
			//cc.log("lastConf2 = "+JSON.stringify(lastConf2))
			//cc.log("lastConf3 = "+JSON.stringify(lastConf3))
			let lotteryConf: number[]= null;
			let lottery_key = keys[idx-1]  
			let conf:config_ball_info = C_Config[lottery_key];
			if(conf){
				lotteryConf = [
					conf.first, conf.second, conf.third, conf.fourth, conf.fifth, conf.sixth, conf.seventh
				];
			}
			//cc.log("lotteryConf = "+JSON.stringify(lotteryConf))
			adjustCount++;
			for(let cow=0; cow<this.cowNum; cow++){
				if(this.cowAnalysis[cow]){   //列分布数据
					if(cow >= this.blueIdx){  //篮球
						this.cowAnalysis[cow].adjustCowAnalysisByLast(this.blueNum, lotteryConf[cow], adjustCount, lastConf1[cow], lastConf2[cow], lastConf3[cow]);   //根据总数据和短期数据进行数据矫正
					}else{
						this.cowAnalysis[cow].adjustCowAnalysisByLast(this.redNum, lotteryConf[cow], adjustCount, lastConf1[cow], lastConf2[cow], lastConf3[cow]);   //根据总数据和短期数据进行数据矫正
					}
				}
			} 
		}
		lastConf1 = null;  //上一期数据
		lastConf2 = null;  //上二期数据
		lastConf3 = null;  //上三期数据
		for(let k=0; k<3; k++){   //从最近开始遍历
			let key = keys[k]  
			let conf:config_ball_info = C_Config[key];
			if(conf){
				let valArr: number[] = [
					conf.first, conf.second, conf.third, conf.fourth, conf.fifth, conf.sixth, conf.seventh
				];
				if(k==0){
					lastConf1 = valArr;
				}else if(k == 1){
					lastConf2 = valArr;
				}else if(k == 2){
					lastConf3 = valArr;
				}
			}
		}
        
        cc.log("推荐")
		this.recommendReds = [];   //推荐红球
        let recommendReds:ball_info[] = []
        for(let i=0; i<this.redNum; i++){  
            recommendReds.push(this.totalRedArr[i])
        }
        recommendReds.sort((a:ball_info, b:ball_info)=>{
            return b.recommendChance - a.recommendChance;
        })
        for(let i=0; i<15; i++){
            this.recommendReds.push(new recommend_ball_info(recommendReds[i]));
        }
        
        this.recommendBlues = [];  //推荐蓝球
        let recommendBlues:ball_info[] = []
        for(let i=0; i<this.blueNum; i++){  
            recommendBlues.push(this.totalBlueArr[i])
        }
        recommendBlues.sort((a:ball_info, b:ball_info)=>{
            return b.recommendChance - a.recommendChance;
        })
        for(let i=0; i<8; i++){
            this.recommendBlues.push(new recommend_ball_info(recommendBlues[i]));
        }
		
        this.recommendCows = [];  //推荐列
        for(let cow=0; cow<this.cowNum; cow++){
            let recommendBalls:recommend_ball_info[] = []
            if(this.cowAnalysis[cow]){ 
                if(cow >= this.blueIdx){  //篮球
                    recommendBalls = this.cowAnalysis[cow].getRecommendBalls(this.blueNum, lastConf1[cow], lastConf2[cow], lastConf3[cow]);
                }else{
                    recommendBalls = this.cowAnalysis[cow].getRecommendBalls(this.redNum, lastConf1[cow], lastConf2[cow], lastConf3[cow]);
                }
            }
            this.recommendCows.push(recommendBalls)
			cc.log("推荐的列 cow = "+(cow+1)+"; boundary = "+this.cowAnalysis[cow].boundary)
			cc.log("recommendBalls = "+JSON.stringify(recommendBalls))
        }
        cc.log("推荐的红球 this.recommendReds = "+JSON.stringify(this.recommendReds))
        cc.log("推荐的篮球 this.recommendBlues = "+JSON.stringify(this.recommendBlues))


    }


}
