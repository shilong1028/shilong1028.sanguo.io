import { LDMgr, LDKey } from "./StorageManager";
import { NotificationMy } from "./NoticeManager";
import { NoticeType, BallInfo, PlayerInfo, LevelInfo } from "./Enum";


//用户数据管理
const { ccclass, property } = cc._decorator;

export var MyUserData = {
    /**以下数据需要更新到服务器 */
    GoldCount: 0,   //用户金币

    totalLineTime: 0,   //总的在线时长（每100s更新记录一次）
    lastGoldTaxTime: 0,   //上一次收税金时间

    blockCount: 3,   //开启的合成地块数量
    ballList: [],   //未出战小球列表 
    
    fightCount: 3,  //解锁的可战斗数量
    fightList: [],   //出战小球列表

    curPlayerIdx: 0,  //当前使用的炮索引
    playerList: [],   //拥有的炮列表

    curLevelId: 0,  //当前通关的最大id
    levelList: [],   //通关列表
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

        this.updateBlockCount(3);  //开启的合成地块数量
        MyUserData.ballList = new Array();  //未出战小球列表 
        LDMgr.setItem(LDKey.KEY_BallList, JSON.stringify(MyUserData.ballList));

        this.updateFightCount(3);  //解锁的可战斗数量
        MyUserData.fightList = new Array();  //出战小球列表
        LDMgr.setItem(LDKey.KEY_FightList, JSON.stringify(MyUserData.fightList));

        this.updateCurPlayerIdx(0);  //当前使用的炮索引
        MyUserData.playerList = new Array(); //拥有的炮列表
        LDMgr.setItem(LDKey.KEY_PlayerList, JSON.stringify(MyUserData.playerList));

        this.updateCurLevelId(0);  //当前通关的最大id
        MyUserData.levelList = new Array(); //通关列表
        LDMgr.setItem(LDKey.KEY_LevelList, JSON.stringify(MyUserData.levelList));

        this.initUserData();
    }

    /**初始化用户信息 */
    initUserData(){
        MyUserData.GoldCount = LDMgr.getItemInt(LDKey.KEY_GoldCount);   //用户金币

        MyUserData.totalLineTime = LDMgr.getItemInt(LDKey.KEY_TotalLineTime);   //总的在线时长（每500s更新记录一次）
        MyUserData.lastGoldTaxTime = LDMgr.getItemInt(LDKey.KEY_LastGoldTaxTime);   //上一次收税金时间

        MyUserData.blockCount = LDMgr.getItemInt(LDKey.KEY_BlockCount, 3);  //开启的合成地块数量
        MyUserData.ballList = this.getBallListByLD();    //未出战小球列表 

        MyUserData.fightCount = LDMgr.getItemInt(LDKey.KEY_FightCount, 3);  //解锁的可战斗数量
        MyUserData.fightList = this.getFightListByLD();  //出战小球列表 

        MyUserData.playerList = this.getPlayerListByLD();  //拥有的炮列表
        MyUserData.levelList = this.getLevelListByLD();  //通关列表

        if(MyUserData.GoldCount == 0 && MyUserData.blockCount == 3 && MyUserData.ballList.length == 0 && MyUserData.fightList.length == 0){
            //新用户
            for(let i=0; i<3; ++i){
                let ballInfo = new BallInfo(1);
                this.addBallToBallList(ballInfo, false);
            }
            LDMgr.setItem(LDKey.KEY_BallList, JSON.stringify(MyUserData.ballList));

            this.updateUserGold(100);

            MyUserData.playerList.push(new PlayerInfo(1));    //拥有的炮列表
            LDMgr.setItem(LDKey.KEY_PlayerList, JSON.stringify(MyUserData.playerList));

            this.updateCurPlayerIdx(0);  //当前使用的炮索引
            this.updateCurLevelId(0);  //当前通关的最大id
        }

        cc.log("initUserData() 初始化用户信息 MyUserData = "+JSON.stringify(MyUserData));
    }

    /**更新地块开启数量 */
    updateBlockCount(openNum:number){
        MyUserData.blockCount = openNum;  //开启的合成地块数量
        LDMgr.setItem(LDKey.KEY_BlockCount, openNum);
    }

    /**更新地块开启数量 */
    updateFightCount(openNum:number){
        MyUserData.fightCount = openNum;  //解锁的可战斗数量
        LDMgr.setItem(LDKey.KEY_FightCount, openNum);
    }

    //当前通关的最大id
    updateCurLevelId(levelId: number){
        MyUserData.curLevelId = levelId; 
        LDMgr.setItem(LDKey.KEY_CurLevelId, levelId);
    }
    /**从本地存储中获取通关列表 */
    getLevelListByLD(){
        let LevelList = LDMgr.getJsonItem(LDKey.KEY_LevelList);  
        let tempList: LevelInfo[] = new Array();
        if(LevelList){
            for(let i=0; i<LevelList.length; ++i){
                let tempItem = new LevelInfo(LevelList[i].levelId, LevelList[i].starNum); 
                tempList.push(tempItem);
            }
        }
        return tempList;
    }
    /**保存拥有的炮列表 */
    saveLevelList(){
        let LevelList = new Array();
        for(let i=0; i<MyUserData.levelList.length; ++i){
            let tempItem = MyUserData.levelList[i].cloneNoCfg();
            LevelList.push(tempItem);
        }
        LDMgr.setItem(LDKey.KEY_LevelList, JSON.stringify(LevelList));
    }
    /**获取已经通关的关卡数据 */
    getLevelInfoFromList(levelId: number){
        if(levelId <= MyUserData.curLevelId){
            let levelInfo = MyUserData.levelList[levelId-1];
            return levelInfo.clone();
        }
        return null;
    }
    /**更新已经通关的关卡数据 */
    updateLevelInfoFromList(levelId: number, levelInfo: LevelInfo){
        if(levelId <= MyUserData.curLevelId){
            MyUserData.levelList[levelId-1] = levelInfo;
            this.saveLevelList();
        }
    }

    /**更新当前使用炮索引 */
    updateCurPlayerIdx(usedIdx:number){
        MyUserData.curPlayerIdx = usedIdx;  //更新当前使用炮索引
        LDMgr.setItem(LDKey.KEY_CurPlayerIdx, usedIdx);
    }
    /**获取当前使用炮信息 */
    getCurPlayerInfo(){
        let obj = MyUserData.playerList[MyUserData.curPlayerIdx];
        if(obj){
            return obj.clone();
        }
        return null;
    }

    /**从本地存储中获取拥有的炮列表 */
    getPlayerListByLD(){
        let PalyerList = LDMgr.getJsonItem(LDKey.KEY_PlayerList);  
        let tempList: PlayerInfo[] = new Array();
        if(PalyerList){
            for(let i=0; i<PalyerList.length; ++i){
                let tempItem = new PlayerInfo(PalyerList[i].playerId);
                tempItem.level = PalyerList[i].level;   
                tempItem.itemIds = PalyerList[i].itemIds;  
                tempList.push(tempItem);
            }
        }
        return tempList;
    }
    /**保存拥有的炮列表 */
    savePlayerList(){
        let PlayerList = new Array();
        for(let i=0; i<MyUserData.playerList.length; ++i){
            let tempItem = MyUserData.playerList[i].cloneNoCfg();
            PlayerList.push(tempItem);
        }
        LDMgr.setItem(LDKey.KEY_PlayerList, JSON.stringify(PlayerList));
    }
    /**添加新炮台到拥有的炮列表 */
    addPlayerToPlayerList(playerInfo: PlayerInfo){
        MyUserData.playerList.push(playerInfo);
        this.savePlayerList();
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
        LDMgr.setItem(LDKey.KEY_BallList, JSON.stringify(BallList));
    }
    /**保存出战小球列表 */
    saveFightList(){
        let BallList = new Array();
        for(let i=0; i<MyUserData.fightList.length; ++i){
            let tempItem = MyUserData.fightList[i].cloneNoCfg();
            BallList.push(tempItem);
        }
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
        MyUserData.fightList.unshift(ballInfo.clone());

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
        MyUserData.ballList.push(ballInfo.clone());

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

