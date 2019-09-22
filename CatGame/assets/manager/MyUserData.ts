import { LDMgr, LDKey } from "./StorageManager";
import { NotificationMy } from "./NoticeManager";
import { NoticeType, BallInfo, PlayerInfo, LevelInfo, ItemInfo } from "./Enum";
import { GameMgr } from "./GameManager";


//用户数据管理
const { ccclass, property } = cc._decorator;

export var MyUserData = {
    /**以下数据需要更新到服务器 */
    GoldCount: 0,   //用户金币

    totalLineTime: 0,   //总的在线时长（每100s更新记录一次）
    lastGoldTaxTime: 0,   //上一次收税金时间

    blockCount: 3,   //开启的合成地块数量
    ballList: [],   //未出战小球列表 
    
    curPlayerId: 1,  //当前使用的炮Id
    playerList: [],   //拥有的炮列表

    curLevelId: 0,  //当前通关的最大id
    levelList: [],   //通关列表

    ItemList: [],   //背包物品列表
};

@ccclass
class MyUserManager {
    lastBallTime: number = 0;   //最后一个添加未出战小球的时间（如果新小球的timeId《=lastTime，则timeId++);

    /**清除所有用户数据 */
    clearUserData(){
        LDMgr.setItem(LDKey.KEY_NewUser, 0);  //是否新用户

        MyUserData.GoldCount = 0;   //用户金币
        LDMgr.setItem(LDKey.KEY_GoldCount, 0);

        MyUserData.totalLineTime = 0;  //总的在线时长（每100s更新记录一次）
        LDMgr.setItem(LDKey.KEY_TotalLineTime, 0);
        MyUserData.lastGoldTaxTime = 0;   //上一次收税金时间
        LDMgr.setItem(LDKey.KEY_LastGoldTaxTime, 0);

        this.updateBlockCount(3);  //开启的合成地块数量
        MyUserData.ballList = new Array();  //未出战小球列表 
        LDMgr.setItem(LDKey.KEY_BallList, JSON.stringify(MyUserData.ballList));

        this.updateCurPlayerById(0);  //当前使用的炮
        MyUserData.playerList = new Array(); //拥有的炮列表
        LDMgr.setItem(LDKey.KEY_PlayerList, JSON.stringify(MyUserData.playerList));

        this.updateCurLevelId(0);  //当前通关的最大id
        MyUserData.levelList = new Array(); //通关列表
        LDMgr.setItem(LDKey.KEY_LevelList, JSON.stringify(MyUserData.levelList));

        MyUserData.ItemList = new Array();   //背包物品列表
        LDMgr.setItem(LDKey.KEY_ItemList, JSON.stringify(MyUserData.ItemList));

        this.initUserData();
    }

    /**初始化用户信息 */
    initUserData(){
        MyUserData.GoldCount = LDMgr.getItemInt(LDKey.KEY_GoldCount);   //用户金币

        MyUserData.totalLineTime = LDMgr.getItemInt(LDKey.KEY_TotalLineTime);   //总的在线时长（每500s更新记录一次）
        MyUserData.lastGoldTaxTime = LDMgr.getItemInt(LDKey.KEY_LastGoldTaxTime);   //上一次收税金时间

        MyUserData.blockCount = LDMgr.getItemInt(LDKey.KEY_BlockCount, 3);  //开启的合成地块数量
        MyUserData.ballList = this.getBallListByLD();    //未出战小球列表 

        MyUserData.curPlayerId = LDMgr.getItemInt(LDKey.KEY_CurPlayerId, 0);  //当前使用的炮索引
        MyUserData.playerList = this.getPlayerListByLD();  //拥有的炮列表

        MyUserData.curLevelId = LDMgr.getItemInt(LDKey.KEY_CurLevelId, 0);  //当前通关的最大id
        MyUserData.levelList = this.getLevelListByLD();  //通关列表

        MyUserData.ItemList = this.getItemListByLD();  //背包物品列表

        if(LDMgr.getItemInt(LDKey.KEY_NewUser) == 0){  //新用户
            for(let i=0; i<3; ++i){
                let ballInfo = new BallInfo(1);
                ballInfo.timeId = this.lastBallTime - i;   //防止一起读取时多个武将timeId一致
                this.addBallToBallList(ballInfo, false);

                this.updateItemByCount(i+1, 10);   //测试道具
            }
            LDMgr.setItem(LDKey.KEY_BallList, JSON.stringify(MyUserData.ballList));

            this.updateUserGold(100);

            let playerInfo = new PlayerInfo(1);
            playerInfo.useState = 1;  //使用状态，0未拥有，1已拥有
            this.updateCurPlayerById(1);  
            this.updatePlayerFromList(playerInfo);   //拥有的炮列表

            this.updateCurLevelId(0);  //当前通关的最大id

            LDMgr.setItem(LDKey.KEY_NewUser, 1);  //是否新用户
        }

        cc.log("initUserData() 初始化用户信息 MyUserData = "+JSON.stringify(MyUserData));
    }

    /**更新地块开启数量 */
    updateBlockCount(openNum:number){
        MyUserData.blockCount = openNum;  //开启的合成地块数量
        LDMgr.setItem(LDKey.KEY_BlockCount, openNum);
    }

    //获取背包中物品数据
    getItemFromList(itemId: number):ItemInfo{
        for(let i=0; i<MyUserData.ItemList.length; ++i){
            if(MyUserData.ItemList[i].itemId == itemId){
                return MyUserData.ItemList[i].clone();
            }
        }
        return new ItemInfo(itemId, 0);
    }
    //获取背包列表克隆
    getItemListClone(){
        let tempArr = new Array();
        for(let i=0; i<MyUserData.ItemList.length; ++i){
            let info: ItemInfo = MyUserData.ItemList[i].clone();
            tempArr.push(info);
        }
        return tempArr;
    }
    /**修改用户背包物品列表 */
    updateItemByCount(itemId: number, val: number){
        for(let i=0; i<MyUserData.ItemList.length; ++i){
            let bagItem: ItemInfo = MyUserData.ItemList[i];
            if(bagItem.itemId == itemId){
                MyUserData.ItemList[i].itemNum += val;
                if(MyUserData.ItemList[i].itemNum <= 0){
                    MyUserData.ItemList[i].itemNum = 0;
                }
                if(MyUserData.ItemList[i].itemNum <= 0){
                    MyUserData.ItemList.splice(i, 1);  //道具用完，从背包删除
                }
                this.saveItemList();
                return;
            }
        }

        if(val > 0){   //增加的新道具
            let item = new ItemInfo(itemId, val);
            MyUserData.ItemList.push(item);
            this.saveItemList();
        }
    }
    /**从本地存储中获取物品列表 */
    getItemListByLD(){
        let ItemList = LDMgr.getJsonItem(LDKey.KEY_ItemList);  //背包物品列表
        let tempList = new Array();
        if(ItemList){
            for(let i=0; i<ItemList.length; ++i){
                let tempItem = new ItemInfo(ItemList[i].itemId, ItemList[i].itemNum);
                tempList.push(tempItem);
            }
        }
        return tempList;
    }
    /**保存背包物品列表 */
    saveItemList(){
        let tempList = new Array();
        for(let i=0; i<MyUserData.ItemList.length; ++i){
            let tempItem = MyUserData.ItemList[i].cloneNoCfg();
            tempList.push(tempItem);
        }

        LDMgr.setItem(LDKey.KEY_ItemList, JSON.stringify(tempList));
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
    /**更新通关的关卡数据 */
    saveLevelFightInfo(levelId: number, win: boolean, stars: number){
        if(win == false){
            return;
        }else{
            if(MyUserData.curLevelId+1 > levelId){
                //cc.log("跳关不保存");
                return;
            }else{
                let info = new LevelInfo(levelId, stars);
                if(MyUserData.curLevelId+1 == levelId){
                    this.updateCurLevelId(levelId);

                    MyUserData.levelList.push(info);
                    this.saveLevelList();
                }else{  //已通关关卡重打
                    MyUserData.levelList[levelId-1] = info;
                    this.saveLevelList();
                }
            }
        }
    }

    /**更新当前使用炮ID */
    updateCurPlayerById(playerId: number){
        MyUserData.curPlayerId = playerId;
        LDMgr.setItem(LDKey.KEY_CurPlayerId, playerId);  //更新当前使用炮
    }
    /**获取当前使用炮信息 */
    getCurPlayerInfo(){
        for(let i=0; i<MyUserData.playerList.length; ++i){
            if(MyUserData.playerList[i].playerId == MyUserData.curPlayerId){
                return MyUserData.playerList[i].clone();
            }
        }
        return null;
    }
    /**获取指定索引的炮信息 */
    getPlayerInfoByIdx(idx: number){
        let playerInfo = MyUserData.playerList[idx];
        if(playerInfo){
            return playerInfo.clone();
        }else{
            return null;
        }
    }
    /**从本地存储中获取拥有的炮列表 */
    getPlayerListByLD(){
        let PalyerList = LDMgr.getJsonItem(LDKey.KEY_PlayerList);  
        let tempList: PlayerInfo[] = new Array();
        if(PalyerList){
            for(let k=1; k<= GameMgr.playerCount; ++k){
                let playerInfo = new PlayerInfo(k);
                for(let i=0; i<PalyerList.length; ++i){
                    if(k == PalyerList[i].playerId){
                        playerInfo.level = PalyerList[i].level;   
                        playerInfo.useState = 1;  //PalyerList[i].useState;
                        playerInfo.ballId = PalyerList[i].ballId;   
                        playerInfo.itemId = PalyerList[i].itemId;
                        playerInfo.skillId = PalyerList[i].skillId;  
                        break;
                    }
                }
                tempList.push(playerInfo);
            }
        }
        return tempList;
    }
    /**保存拥有的炮列表 */
    savePlayerList(){
        let PlayerList = new Array();
        for(let i=0; i<MyUserData.playerList.length; ++i){
            if(MyUserData.playerList[i].useState == 1){
                let tempItem = MyUserData.playerList[i].cloneNoCfg();
                PlayerList.push(tempItem);
            }
        }
        LDMgr.setItem(LDKey.KEY_PlayerList, JSON.stringify(PlayerList));
    }
    /**更新炮台到拥有的炮列表 */
    updatePlayerFromList(playerInfo: PlayerInfo){
        for(let i=0; i<MyUserData.playerList.length; ++i){
            if(MyUserData.playerList[i].playerId == playerInfo.playerId){
                MyUserData.playerList[i] = playerInfo;
                break;
            }
        }
        if(playerInfo.useState == 1){
            this.savePlayerList();
        }
    }
    
    /**从本地存储中获取未出战小球列表 */
    getBallListByLD(){
        let BallList = LDMgr.getJsonItem(LDKey.KEY_BallList);  
        let tempList: BallInfo[] = new Array();
        this.lastBallTime = new Date().getTime()-1;   //最后一个添加未出战小球的时间（如果新小球的timeId《=lastTime，则timeId++);
        if(BallList){
            for(let i=0; i<BallList.length; ++i){
                let tempItem = new BallInfo(BallList[i].cannonId);
                tempItem.timeId = this.lastBallTime - i;   //防止一起读取时多个武将timeId一致
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
    /**添加小球到未出战列表 */
    addBallToBallList(ballInfo: BallInfo, bSave: boolean = true){
        if(bSave == true){
            if(ballInfo.timeId <= this.lastBallTime){   //重复timeId的小球
                ballInfo.timeId = this.lastBallTime + 1;
            }
            this.lastBallTime = ballInfo.timeId;   //最后一个添加未出战小球的时间（如果新小球的timeId《=lastTime，则timeId++);
        }

        MyUserData.ballList.push(ballInfo);

        if(bSave){
            this.saveBallList();
        }
    }
    /**添加小球到炮台道具 */
    equipBallFromBallList(ballInfo: BallInfo, equipBall: BallInfo=null){
        for(let i=0; i<MyUserData.ballList.length; ++i){
            let curTimeId = MyUserData.ballList[i].timeId;
            if(ballInfo.timeId == curTimeId){
                MyUserData.ballList.splice(i, 1);
                break;
            }
        }
        if(equipBall){
            MyUserData.ballList.push(equipBall);
        }
        this.saveBallList();
    }
    /**更新未出战小球 */
    updateBallInBallList(ballInfo: BallInfo, delBallInfo: BallInfo=null){
        let optCount = 1;
        if(delBallInfo != null){
            optCount = 2;
        }
        let delIdx = -1;
        for(let i=0; i<MyUserData.ballList.length; ++i){
            let curTimeId = MyUserData.ballList[i].timeId;
            if(ballInfo.timeId == curTimeId){
                MyUserData.ballList[i] = ballInfo;    //更新的小球
                optCount --;
            }else if(delBallInfo && delBallInfo.timeId == curTimeId){
                delIdx = i;  //删除的小球索引
                optCount --;   
            }
            if(optCount <= 0){
                break;
            }
        }
        if(delIdx >= 0){
            MyUserData.ballList.splice(delIdx, 1);
        }
        this.saveBallList();
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
    //获取未出战列表克隆
    getBallListClone(){
        let tempArr = new Array();
        for(let i=0; i<MyUserData.ballList.length; ++i){
            let info: BallInfo = MyUserData.ballList[i].clone();
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

