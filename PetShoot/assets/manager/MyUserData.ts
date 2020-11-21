import { LDMgr, LDKey } from "./StorageManager";
import { NotificationMy } from "./NoticeManager";
import { NoticeType, BallInfo, PlayerInfo, LevelInfo, ItemInfo, TipsStrDef } from "./Enum";
import { GameMgr } from "./GameManager";
import { ROOT_NODE } from "../common/rootNode";
import { GuideMgr } from "./GuideMgr";


//用户数据管理
const { ccclass, property } = cc._decorator;

export var MyUserData = {
    /**以下数据需要更新到服务器 */
    UserName: "",   //用户名

    GoldCount: 0,   //用户金币
    DiamondCount: 0,  //用户钻石

    lastSignIdx: 0,   //上一次签到索引 1-7
    lastSignTime: 0,   //上一次签到时间

    ballList: [],   //未出战小球列表 
    
    curPlayerId: 1,  //当前使用的炮Id
    playerList: [],   //拥有的炮列表

    curChapterId: 1, //当前章节Id
    curLevelId: 0,  //当前通关的最大id
    levelList: [],   //通关列表

    ItemList: [],   //背包物品列表

    guideStepStrs: "",   //新手引导步骤"1000-1100-1200-..."
};

@ccclass
class MyUserManager {
    lastBallTime: number = 0;   //最后一个添加未出战小球的时间（如果新小球的timeId《=lastTime，则timeId++);
    lastItemTime: number = 0;

    /**清除所有用户数据 */
    clearUserData(){
        LDMgr.setItem(LDKey.KEY_NewUser, 0);  //是否新用户

        MyUserData.GoldCount = 0;   //用户金币
        LDMgr.setItem(LDKey.KEY_GoldCount, 0);

        MyUserData.DiamondCount = 0;   //用户钻石
        LDMgr.setItem(LDKey.KEY_DiamondCount, 0);

        MyUserData.lastSignIdx = 0;   //上一次签到索引 1-7
        MyUserData.lastSignTime = 0;   //上一次签到时间
        LDMgr.setItem(LDKey.KEY_SignTime, "0-0");

        MyUserData.ballList = [];  //未出战小球列表 
        LDMgr.setItem(LDKey.KEY_BallList, JSON.stringify(MyUserData.ballList));

        this.updateCurPlayerById(0);  //当前使用的炮
        MyUserData.playerList = []; //拥有的炮列表
        LDMgr.setItem(LDKey.KEY_PlayerList, JSON.stringify(MyUserData.playerList));
        MyUserData.playerList = this.getPlayerListByLD();  //拥有的炮列表(并初始化未拥有的炮台)

        this.updateCurChapterId(1); //当前章节Id
        this.updateCurLevelId(0);  //当前通关的最大id
        MyUserData.levelList = []; //通关列表
        //LDMgr.setItem(LDKey.KEY_LevelList, JSON.stringify(MyUserData.levelList));

        MyUserData.ItemList = [];   //背包物品列表
        LDMgr.setItem(LDKey.KEY_ItemList, JSON.stringify(MyUserData.ItemList));

        MyUserData.guideStepStrs = "";   //新手引导步骤"1000-1100-1200-..."
        GuideMgr.clearFinishGuideStep();

        this.initNewUserData();  //新玩家初始化
    }

    //新玩家初始化
    initNewUserData(){
        MyUserData.UserName = "";
        this.checkUserName();
        
        let playerInfo = new PlayerInfo(1);
        playerInfo.useState = 1;  //使用状态，0未拥有，1已拥有
        playerInfo.ballId = 1;  //默认炮台拥有1级小球
        this.updateCurPlayerById(1);  
        this.updatePlayerFromList(playerInfo);   //拥有的炮列表

        this.updateCurLevelId(0);  //当前通关的最大id

        this.updateUserGold(500);
        this.updateUserDiamond(50);

        LDMgr.setItem(LDKey.KEY_NewUser, 1);  //是否新用户

        //cc.log("initNewUserData() 初始化用户信息 MyUserData = "+JSON.stringify(MyUserData));
    }


    checkUserName(){
        console.log("MyUserData.UserName = "+MyUserData.UserName);
        if(MyUserData.UserName && MyUserData.UserName.indexOf("萌宠") >= 0 && MyUserData.UserName.length > 10){
        }else{
            MyUserData.UserName = "萌宠_"+Math.ceil(Math.random()*99)+"_"+(new Date().getTime());
            LDMgr.setItem(LDKey.KEY_UserName, MyUserData.UserName);
        }
    }

    /**初始化用户信息 */
    initUserData(){
        MyUserData.UserName = LDMgr.getItem(LDKey.KEY_UserName);    //用户名
        this.checkUserName();

        MyUserData.GoldCount = LDMgr.getItemInt(LDKey.KEY_GoldCount);   //用户金币
        MyUserData.DiamondCount = LDMgr.getItemInt(LDKey.KEY_DiamondCount);  //用户钻石

        let signData = LDMgr.getItemKeyVal(LDKey.KEY_SignTime);  //当前签到索引和上一次签到时间
        if(signData == null){
            MyUserData.lastSignIdx = 0;   //上一次签到索引 1-7
            MyUserData.lastSignTime = 0;   //上一次签到时间
        }else{
            MyUserData.lastSignIdx = parseInt(signData.key);
            MyUserData.lastSignTime = parseInt(signData.val);
        }

        MyUserData.ballList = this.getBallListByLD();    //未出战小球列表 

        MyUserData.curPlayerId = LDMgr.getItemInt(LDKey.KEY_CurPlayerId, 0);  //当前使用的炮索引
        MyUserData.playerList = this.getPlayerListByLD();  //拥有的炮列表(并初始化未拥有的炮台)

        MyUserData.curChapterId = LDMgr.getItemInt(LDKey.KEY_CurChapterId, 1);  //当前章节id
        MyUserData.curLevelId = LDMgr.getItemInt(LDKey.KEY_CurLevelId, 0);  //当前通关的最大id
        MyUserData.levelList = this.getLevelListByLD();  //通关列表

        MyUserData.ItemList = this.getItemListByLD();  //背包物品列表

        MyUserData.guideStepStrs = LDMgr.getItem(LDKey.KEY_GuideSteps);   //新手引导步骤"1000-1100-1200-..."
        GuideMgr.setFinishGuideStep(MyUserData.guideStepStrs);   //设置完成的引导步骤（开始）字符串  "1000-1100-1200-..."

        if(LDMgr.getItemInt(LDKey.KEY_NewUser) == 0){  //新用户 
            this.clearUserData();  //新玩家初始化
        }
        //cc.log("initUserData() 初始化用户信息 MyUserData = "+JSON.stringify(MyUserData));
    }

    /**更新新手引导数据 */
    updateGuideStepData(guideStr: string){
        MyUserData.guideStepStrs = guideStr;   //新手引导步骤"1000-1100-1200-..."
        LDMgr.setItem(LDKey.KEY_GuideSteps, MyUserData.guideStepStrs);
    }

    //更新签到数据
    updateUserSign(signIdx: number, signTime: number){
        if(MyUserData.lastSignIdx == signIdx && MyUserData.lastSignTime == signTime){
            return;
        }
        MyUserData.lastSignIdx = signIdx;   //上一次签到索引 1-7
        MyUserData.lastSignTime = signTime;

        LDMgr.setItem(LDKey.KEY_SignTime, MyUserData.lastSignIdx.toString()+"-"+MyUserData.lastSignTime);
    }

    //当前章节id
    updateCurChapterId(chapterId: number){
        MyUserData.curChapterId = chapterId; 
        LDMgr.setItem(LDKey.KEY_CurChapterId, chapterId);
    }
    //当前通关的最大id
    updateCurLevelId(levelId: number){
        MyUserData.curLevelId = levelId; 
        LDMgr.setItem(LDKey.KEY_CurLevelId, levelId);
    }
    /**从本地存储中获取通关列表 */
    getLevelListByLD(){
        let LevelList = LDMgr.getJsonItem(LDKey.KEY_LevelList);  
        let tempList: LevelInfo[] = [];
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
        let LevelList = [];
        for(let i=0; i<MyUserData.levelList.length; ++i){
            let levelInfo: LevelInfo = MyUserData.levelList[i];
            if(levelInfo){
                let tempItem = levelInfo.cloneNoCfg();
                LevelList.push(tempItem);
            }else{
                cc.log("warn levelInfo = null, i = "+i+"; MyUserData.levelList = "+JSON.stringify(MyUserData.levelList))
            }
        }
        //LDMgr.setItem(LDKey.KEY_LevelList, JSON.stringify(LevelList));
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
            if(MyUserData.curLevelId+1 > levelId){   //跳关不保存
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
    /**从本地存储中获取拥有的炮列表(并初始化未拥有的炮台) */
    getPlayerListByLD(){
        let PalyerList = LDMgr.getJsonItem(LDKey.KEY_PlayerList);  
        let tempList: PlayerInfo[] = [];
        if(PalyerList){
            for(let k=1; k<= GameMgr.PlayerCount; ++k){
                let playerInfo = new PlayerInfo(k);
                for(let i=0; i<PalyerList.length; ++i){
                    if(k == PalyerList[i].playerId){
                        playerInfo.level = PalyerList[i].level;   
                        playerInfo.useState = 1;  //PalyerList[i].useState;
                        playerInfo.ballId = PalyerList[i].ballId;   
                        playerInfo.itemId = PalyerList[i].itemId;
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
        let PlayerList = [];
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
        NotificationMy.emit(NoticeType.UpdatePlayerList, playerInfo);   //更新炮台

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

    //获取背包列表克隆
    getItemListClone(){
        let tempArr = [];
        for(let i=0; i<MyUserData.ItemList.length; ++i){
            let info: ItemInfo = MyUserData.ItemList[i].clone();
            tempArr.push(info);
        }
        return tempArr;
    }
    /**更新道具小球 */
    updateItemInItemList(itemInfo: ItemInfo, delItemInfo: ItemInfo=null){
        let optCount = 1;
        if(delItemInfo != null){
            optCount = 2;
        }
        let delIdx = -1;
        for(let i=0; i<MyUserData.ItemList.length; ++i){
            let curTimeId = MyUserData.ItemList[i].timeId;
            if(itemInfo.timeId == curTimeId){
                MyUserData.ItemList[i] = itemInfo;    //更新的小球
                optCount --;
            }else if(delItemInfo && delItemInfo.timeId == curTimeId){
                delIdx = i;  //删除的小球索引
                optCount --;   
            }
            if(optCount <= 0){
                break;
            }
        }
        if(delIdx >= 0){
            MyUserData.ItemList.splice(delIdx, 1);
        }
        this.saveItemList();
    }
    /**销售未出战小球 */
    sellItemFromItemList(itemInfo: ItemInfo){
        for(let i=0; i<MyUserData.ItemList.length; ++i){
            if(itemInfo.timeId == MyUserData.ItemList[i].timeId){
                MyUserData.ItemList.splice(i, 1);
                this.saveItemList();
                break;
            }
        }
    }
    /**装备道具到炮台 */
    equipItemToPlayer(itemInfo: ItemInfo, equipItem: ItemInfo=null){
        for(let i=0; i<MyUserData.ItemList.length; ++i){
            let curTimeId = MyUserData.ItemList[i].timeId;
            if(itemInfo.timeId == curTimeId){
                MyUserData.ItemList.splice(i, 1);
                break;
            }
        }
        if(equipItem){
            MyUserData.ItemList.push(equipItem);
        }
        this.saveItemList();
    }
    /**添加道具到列表 */
    addItemToItemList(itemInfo: ItemInfo, bSave: boolean = true){
        if(MyUserData.ItemList.length >= GameMgr.BagGridCount){
            ROOT_NODE.showTipsText(TipsStrDef.KEY_BagMaxTip)
            return;
        }

        if(bSave == true){
            if(itemInfo.timeId <= this.lastItemTime){   //重复timeId
                itemInfo.timeId = this.lastItemTime + 1;
            }
            this.lastBallTime = itemInfo.timeId;   //最后一个添加未出战小球的时间（如果新小球的timeId《=lastTime，则timeId++);
        }

        MyUserData.ItemList.push(itemInfo);
        
        if(bSave){
            this.saveItemList();
        }
    }
    /**从本地存储中获取物品列表 */
    getItemListByLD(){
        let ItemList = LDMgr.getJsonItem(LDKey.KEY_ItemList);  //背包物品列表
        let tempList = [];
        this.lastItemTime = new Date().getTime()-1;   //最后一个添加未出战道具的时间（如果新道具的timeId《=lastTime，则timeId++);
        if(ItemList){
            for(let i=0; i<ItemList.length; ++i){
                let tempItem = new ItemInfo(ItemList[i].itemId);
                tempItem.timeId = this.lastItemTime - i;   //防止一起读取时多个道具timeId一致
                tempList.push(tempItem);
            }
        }
        return tempList;
    }
    sortItemList(){
        MyUserData.ItemList.sort(function(a:ItemInfo, b:ItemInfo){ 
            if(a.itemCfg.quality == b.itemCfg.quality){
                return b.itemId- a.itemId
            }else{
                return b.itemCfg.quality - a.itemCfg.quality
            }
        });
        this.saveItemList();
    }
    /**保存背包物品列表 */
    saveItemList(){
        let tempList = [];
        for(let i=0; i<MyUserData.ItemList.length; ++i){
            let tempItem = MyUserData.ItemList[i].cloneNoCfg();
            tempList.push(tempItem);
        }

        LDMgr.setItem(LDKey.KEY_ItemList, JSON.stringify(tempList));
    }
    
    /**从本地存储中获取未出战小球列表 */
    getBallListByLD(){
        let BallList = LDMgr.getJsonItem(LDKey.KEY_BallList);  
        let tempList: BallInfo[] = [];
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
    sortBallList(){
        MyUserData.ballList.sort(function(a:BallInfo, b:BallInfo){ 
            if(a.cannonCfg.quality == b.cannonCfg.quality){
                return  b.cannonId - a.cannonId
            }else{
                return  b.cannonCfg.quality - a.cannonCfg.quality
            }
        });
        this.saveBallList();
    }
    /**保存未出战小球列表 */
    saveBallList(){
        let BallList = [];
        for(let i=0; i<MyUserData.ballList.length; ++i){
            let tempItem = MyUserData.ballList[i].cloneNoCfg();
            BallList.push(tempItem);
        }
        LDMgr.setItem(LDKey.KEY_BallList, JSON.stringify(BallList));
    }
    /**添加小球到未出战列表 */
    addBallToBallList(ballInfo: BallInfo, bSave: boolean = true){
        if(MyUserData.ballList.length >= GameMgr.BagGridCount){
            ROOT_NODE.showTipsText(TipsStrDef.KEY_BagMaxTip)
            return;
        }

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
    equipBallToPlayer(ballInfo: BallInfo, equipBall: BallInfo=null){
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
        let tempArr = [];
        for(let i=0; i<MyUserData.ballList.length; ++i){
            let info: BallInfo = MyUserData.ballList[i].clone();
            tempArr.push(info);
        }
        return tempArr;
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
        if(MyUserData.GoldCount < 0 ){
            MyUserData.GoldCount = 0;
        }
        LDMgr.setItem(LDKey.KEY_GoldCount, MyUserData.GoldCount);
        NotificationMy.emit(NoticeType.UpdateGold, null);
    }

    /**修改用户钻石 */
    updateUserDiamond(val:number){
        MyUserData.DiamondCount += val;
        if(MyUserData.DiamondCount < 0 ){
            MyUserData.DiamondCount = 0;
        }
        LDMgr.setItem(LDKey.KEY_DiamondCount, MyUserData.DiamondCount);
        NotificationMy.emit(NoticeType.UpdateDiamond, null);
    }

}
export var MyUserDataMgr = new MyUserManager();

