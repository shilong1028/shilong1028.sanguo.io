import { LDMgr, LDKey } from "./StorageManager";
import { NotificationMy } from "./NoticeManager";
import { NoticeType, BallInfo } from "./Enum";


//用户数据管理
const { ccclass, property } = cc._decorator;

export var MyUserData = {
    /**以下数据需要更新到服务器 */
    GoldCount: 0,   //用户金币

    totalLineTime: 0,   //总的在线时长（每100s更新记录一次）
    lastGoldTaxTime: 0,   //上一次收税金时间

    blockCount: 3,   //开启的合成地块数量
    ballList: [],   //未出战小球列表 
    
    
    fightList: [],   //出战小球列表
};

@ccclass
class MyUserManager {
    lastBallTime: number = 0;   //最后一个添加未出战小球的时间（如果新小球的timeId《=lastTime，则timeId++);

    /**清除所有用户数据 */
    clearUserData(){
        MyUserData.GoldCount = 0;   //用户金币
        LDMgr.setItem(LDKey.KEY_GoldCount, 0);

        MyUserData.totalLineTime = 0;  //总的在线时长（每100s更新记录一次）
        LDMgr.setItem(LDKey.KEY_TotalLineTime, 0);
        MyUserData.lastGoldTaxTime = 0;   //上一次收税金时间
        LDMgr.setItem(LDKey.KEY_LastGoldTaxTime, 0);

        MyUserData.blockCount = 3;  //开启的合成地块数量
        LDMgr.setItem(LDKey.KEY_BlockCount, 0);

        MyUserData.ballList = new Array();  //未出战小球列表 
        LDMgr.setItem(LDKey.KEY_BallList, JSON.stringify(MyUserData.ballList));

        MyUserData.fightList = new Array();  //出战小球列表
        LDMgr.setItem(LDKey.KEY_FightList, JSON.stringify(MyUserData.fightList));

        this.initUserData();
    }

    /**初始化用户信息 */
    initUserData(){
        MyUserData.GoldCount = LDMgr.getItemInt(LDKey.KEY_GoldCount);   //用户金币

        MyUserData.totalLineTime = LDMgr.getItemInt(LDKey.KEY_TotalLineTime);   //总的在线时长（每500s更新记录一次）
        MyUserData.lastGoldTaxTime = LDMgr.getItemInt(LDKey.KEY_LastGoldTaxTime);   //上一次收税金时间

        MyUserData.blockCount = LDMgr.getItemInt(LDKey.KEY_BlockCount, 3);  //开启的合成地块数量

        MyUserData.ballList = this.getBallListByLD();    //未出战小球列表 
        MyUserData.fightList = this.getFightListByLD();  //出战小球列表 

        if(MyUserData.GoldCount == 0 && MyUserData.blockCount == 3 && MyUserData.ballList.length == 0 && MyUserData.fightList.length == 0){
            //新用户
            for(let i=0; i<3; ++i){
                let ballInfo = new BallInfo(1);
                this.addBallToBallList(ballInfo, false);
            }
        }

        cc.log("initUserData() 初始化用户信息 MyUserData = "+JSON.stringify(MyUserData));
    }

    /**从本地存储中获取未出战小球列表 */
    getBallListByLD(){
        let BallList = LDMgr.getJsonItem(LDKey.KEY_BallList);  
        let tempList: BallInfo[] = new Array();
        let curTime = new Date().getTime();
        this.lastBallTime = curTime;   //最后一个添加未出战小球的时间（如果新小球的timeId《=lastTime，则timeId++);
        if(BallList){
            for(let i=0; i<BallList.length; ++i){
                let tempItem = new BallInfo(BallList[i].cannonId);
                tempItem.timeId = curTime - i;   //防止一起读取时多个武将timeId一致
                tempList.push(tempItem);
            }
        }
        return tempList;
    }
    /**从本地存储中获取出战小球列表 */
    getFightListByLD(){
        let BallList = LDMgr.getJsonItem(LDKey.KEY_FightList);  
        let tempList: BallInfo[] = new Array();
        let curTime = new Date().getTime()-100;   //防止和未出战小球时间重合
        if(BallList){
            for(let i=0; i<BallList.length; ++i){
                let tempItem = new BallInfo(BallList[i].cannonId);
                tempItem.timeId = curTime - i;   //防止一起读取时多个武将timeId一致
                tempList.push(tempItem);
            }
        }
        return tempList;
    }
    /**保存未出战小球列表 */
    saveBallList(){
        let BallList = new Array();
        for(let i=0; i<MyUserData.ballList.length; ++i){
            let tempItem = MyUserData.ballList[i].cloneNoCfg();
            BallList.push(tempItem);
        }
        //cc.log("BallList = "+JSON.stringify(BallList));
        LDMgr.setItem(LDKey.KEY_BallList, JSON.stringify(BallList));
    }
    /**保存出战小球列表 */
    saveFightList(){
        let BallList = new Array();
        for(let i=0; i<MyUserData.fightList.length; ++i){
            let tempItem = MyUserData.fightList[i].cloneNoCfg();
            BallList.push(tempItem);
        }
        //cc.log("BallList = "+JSON.stringify(BallList));
        LDMgr.setItem(LDKey.KEY_FightList, JSON.stringify(BallList));
    }
    /**添加小球到未出战列表 */
    addBallToBallList(ballInfo: BallInfo, bSave: boolean = true){
        if(ballInfo.timeId <= this.lastBallTime){
            ballInfo.timeId += 1;
        }
        this.lastBallTime = ballInfo.timeId;   //最后一个添加未出战小球的时间（如果新小球的timeId《=lastTime，则timeId++);

        MyUserData.ballList.push(ballInfo);

        if(bSave){
            this.saveBallList();
        }
    }
    /**更新未出战小球 */
    updateBallInBallList(ballInfo: BallInfo){
        for(let i=0; i<MyUserData.ballList.length; ++i){
            if(ballInfo.timeId == MyUserData.ballList[i].timeId){
                MyUserData.ballList[i] = ballInfo;
                this.saveBallList();
                break;
            }
        }
    }
    /**销售未出战小球 */
    sellBallFromBallList(ballInfo: BallInfo){
        this.updateUserGold(ballInfo.cannonCfg.sell);    //销售获得

        for(let i=0; i<MyUserData.ballList.length; ++i){
            if(ballInfo.timeId == MyUserData.ballList[i].timeId){
                MyUserData.ballList.splice(i, 1);
                this.saveBallList();
                break;
            }
        }
    }
    /**添加小球到出战列表 */
    addBallToFightList(ballInfo: BallInfo){
        MyUserData.fightList.push(ballInfo);

        for(let i=0; i<MyUserData.ballList.length; ++i){
            if(ballInfo.timeId == MyUserData.ballList[i].timeId){
                MyUserData.ballList.splice(i, 1);
                this.saveBallList();
                break;
            }
        }
        this.saveFightList();
    }
    /**移除出战小球 */
    removeBallFromFightList(ballInfo: BallInfo){
        MyUserData.ballList.push(ballInfo);

        for(let i=0; i<MyUserData.fightList.length; ++i){
            if(ballInfo.timeId == MyUserData.fightList[i].timeId){
                MyUserData.fightList.splice(i, 1);
                this.saveFightList();
                break;
            }
        }
        this.saveBallList();
    }
    //获取未出战列表克隆
    getBallListClone(){
        let tempArr = new Array();
        for(let i=0; i<MyUserData.ballList.length; ++i){
            let info: BallInfo = MyUserData.ballList[i].clone();
            tempArr.push(info);
        }
        return tempArr;
    }
    //获取出战列表克隆
    getFightListClone(){
        let tempArr = new Array();
        for(let i=0; i<MyUserData.fightList.length; ++i){
            let info: BallInfo = MyUserData.fightList[i].clone();
            tempArr.push(info);
        }
        return tempArr;
    }


    //更新在线总时长
    updateLineTime(dt:number){
        MyUserData.totalLineTime += dt;   //总的在线时长（每100s更新记录一次）

        let intTime = Math.floor(MyUserData.totalLineTime);
        if(intTime%100 == 0){
            LDMgr.setItem(LDKey.KEY_TotalLineTime, intTime);
        }
    }

    getIdsToStr(ids: number[], sp: string = "|"){
        let str = ""
        for(let i=0; i<ids.length; ++i){
            str += (ids[i].toString()+sp);
        }
        return str;
    }

    /**修改用户金币 */
    updateUserGold(val:number){
        MyUserData.GoldCount += val;
        LDMgr.setItem(LDKey.KEY_GoldCount, MyUserData.GoldCount);
        NotificationMy.emit(NoticeType.UpdateGold, null);
    }






}
export var MyUserDataMgr = new MyUserManager();

