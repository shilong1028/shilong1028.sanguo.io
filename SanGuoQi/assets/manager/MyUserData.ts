import { LDMgr, LDKey } from "./StorageManager";
import { NoticeMgr } from "./NoticeManager";
import { NoticeType, ItemInfo, GeneralInfo } from "./Enum";


//用户数据管理
const { ccclass, property } = cc._decorator;

export var MyUserData = {
    /**以下数据需要更新到服务器 */
    GoldCount: 0,   //用户金币
    DiamondCount: 0,   //用户钻石(金锭）数
    FoodCount: 0,  //用户粮食数量

    totalLineTime: 0,   //总的在线时长（每100s更新记录一次）
    lastGoldTaxTime: 0,   //上一次收税金时间

    roleLv: 1,  //主角等级
    capitalLv: 0,   //主城等级，0则未开启

    TaskId: 1,   //当前任务ID
    TaskState: 0,    //当前任务状态 0未完成，1完成未领取，2已领取

    myCityIds: [],   //己方占领的城池ID集合（晋封太守后获得一个城池，开启主城后可以有管辖城池集合）
    ruleCityIds: [],   //己方统治下未被占领或叛乱的城池ID集合

    ItemList: [],   //背包物品列表
    GeneralList:[],   //武将列表
    
};

@ccclass
class MyUserManager {

    /**清除所有用户数据 */
    clearUserData(){
        MyUserData.GoldCount = 0;   //用户金币
        LDMgr.setItem(LDKey.KEY_GoldCount, 0);
        MyUserData.DiamondCount = 0;   //用户钻石(金锭）数
        LDMgr.setItem(LDKey.KEY_DiamondCount, 0);
        MyUserData.FoodCount = 0;   //用户粮食数量
        LDMgr.setItem(LDKey.KEY_FoodCount, 0);

        MyUserData.totalLineTime = 0;  //总的在线时长（每100s更新记录一次）
        LDMgr.setItem(LDKey.KEY_TotalLineTime, 0);
        MyUserData.lastGoldTaxTime = 0;   //上一次收税金时间
        LDMgr.setItem(LDKey.KEY_LastGoldTaxTime, 0);

        MyUserData.roleLv = 1;  //主角等级
        LDMgr.setItem(LDKey.KEY_RoleLv, 1);
        MyUserData.capitalLv = 0;   //主城等级，0则未开启
        LDMgr.setItem(LDKey.KEY_CapitalLv, 0);

        MyUserData.TaskId = 1;   //当前任务ID
        MyUserData.TaskState = 0;    //当前任务状态 0未完成，1完成未领取，2已领取
        LDMgr.setItem(LDKey.KEY_StoryData, "1-0");

        MyUserData.myCityIds = new Array();  //己方占领的城池ID集合（晋封太守后获得一个城池，开启主城后可以有管辖城池集合）
        LDMgr.setItem(LDKey.KEY_MyCityIds, "");
        MyUserData.ruleCityIds = new Array();   //己方统治下未被占领或叛乱的城池ID集合
        LDMgr.setItem(LDKey.KEY_RuleCityIds, "");

        MyUserData.ItemList = new Array();   //背包物品列表
        LDMgr.setItem(LDKey.KEY_ItemList, JSON.stringify(MyUserData.ItemList));

        MyUserData.GeneralList = new Array();  //武将列表
        LDMgr.setItem(LDKey.KEY_GeneralList, JSON.stringify(MyUserData.GeneralList));

        this.initNewUserData();
    }

    /**初始新用户赋值 */
    initNewUserData(){
        let caocao = new GeneralInfo(3001);
        this.addGeneralToList(caocao, true)

        this.updateRoleLv(1);  //更新主角等级

        LDMgr.setItem(LDKey.KEY_NewUser, 1);  //是否新用户
    }

    /**初始化用户信息 */
    initUserData(){
        MyUserData.GoldCount = LDMgr.getItemInt(LDKey.KEY_GoldCount);   //用户金币
        MyUserData.DiamondCount = LDMgr.getItemInt(LDKey.KEY_DiamondCount);   //用户钻石(金锭）数
        MyUserData.FoodCount = LDMgr.getItemInt(LDKey.KEY_FoodCount);   //用户粮食数量

        MyUserData.totalLineTime = LDMgr.getItemInt(LDKey.KEY_TotalLineTime);   //总的在线时长（每500s更新记录一次）
        MyUserData.lastGoldTaxTime = LDMgr.getItemInt(LDKey.KEY_LastGoldTaxTime);   //上一次收税金时间

        MyUserData.roleLv = LDMgr.getItemInt(LDKey.KEY_RoleLv);   //主角等级
        MyUserData.capitalLv = LDMgr.getItemInt(LDKey.KEY_CapitalLv);   //主城等级，0则未开启

        let taskInfo = LDMgr.getItemKeyVal(LDKey.KEY_StoryData);  //当前任务ID
        if(taskInfo == null){
            MyUserData.TaskId = 1;   //当前任务ID
            MyUserData.TaskState = 0;    //当前任务状态 0未完成，1完成未领取，2已领取
        }else{
            MyUserData.TaskId = parseInt(taskInfo.key);
            MyUserData.TaskState = taskInfo.val;
        }

        MyUserData.myCityIds = LDMgr.getItemIntAry(LDKey.KEY_MyCityIds);   //己方占领的城池ID集合（晋封太守后获得一个城池，开启主城后可以有管辖城池集合）
        MyUserData.ruleCityIds = LDMgr.getItemIntAry(LDKey.KEY_RuleCityIds);   //己方统治下未被占领或叛乱的城池ID集合

        MyUserData.ItemList = this.getItemListByLD();  //背包物品列表
        MyUserData.GeneralList = this.getGeneralListByLD();  //武将列表

        if(LDMgr.getItemInt(LDKey.KEY_NewUser) == 0){  //新用户 
            this.clearUserData();
        }

        //cc.log("initUserData() 初始化用户信息 MyUserData = "+JSON.stringify(MyUserData));
    }

    //更新在线总时长
    updateLineTime(dt:number){
        MyUserData.totalLineTime += dt;   //总的在线时长（每100s更新记录一次）

        let intTime = Math.floor(MyUserData.totalLineTime);
        if(intTime%100 == 0){
            LDMgr.setItem(LDKey.KEY_TotalLineTime, intTime);
        }
    }

    //更新收税金时间
    updateGoldTaxTime(){
        let intTime = Math.floor(MyUserData.totalLineTime);

        MyUserData.lastGoldTaxTime = intTime;  //上一次收税金时间
        LDMgr.setItem(LDKey.KEY_TotalLineTime, intTime);   //总的在线时长
        LDMgr.setItem(LDKey.KEY_LastGoldTaxTime, MyUserData.lastGoldTaxTime);
    }

    //更新主城等级
    updateCapitalLv(capitalLv: number){
        MyUserData.capitalLv = capitalLv;
        if(MyUserData.capitalLv > 100){
            MyUserData.capitalLv = 100;
        }
        LDMgr.setItem(LDKey.KEY_CapitalLv, MyUserData.capitalLv);   //主城等级，0则未开启
    }

    //更新主角等级
    updateRoleLv(roleLv: number){
        let oldRoleLv = 0;
        if(roleLv > 0){
            oldRoleLv = MyUserData.roleLv;
            MyUserData.roleLv = roleLv;  //主角等级
            LDMgr.setItem(LDKey.KEY_RoleLv, roleLv);
            
        }
        NoticeMgr.emit(NoticeType.UpdateRoleLvOffical, oldRoleLv);  //更新主角等级或官职
    }

    //根据城池ID判定是否为我方已占据的城池
    isMyCityById(cityId: number){
        for(let i=0; i<MyUserData.myCityIds.length; ++i){
            if(cityId == MyUserData.myCityIds[i]){
                return true;
            }
        }
        return false;
    }

    //更新我方占领的城池列表
    updateMyCityIds(cityId: number, bAdd: boolean= true){
        cc.log("updateMyCityIds(), cityId = "+cityId+"; bAdd = "+bAdd);
        if(bAdd == true){
            MyUserData.myCityIds.push(cityId);
            LDMgr.setItem(LDKey.KEY_MyCityIds, this.getIdsToStr(MyUserData.myCityIds));

            let bChangeRuleCitys = false;
            for(let i=0; i<MyUserData.ruleCityIds.length; ++i){
                if(cityId == MyUserData.ruleCityIds[i]){
                    MyUserData.ruleCityIds.splice(i, 1);
                    bChangeRuleCitys = true;
                }
            }
            if(bChangeRuleCitys == true){
                LDMgr.setItem(LDKey.KEY_RuleCityIds, this.getIdsToStr(MyUserData.ruleCityIds));
            }
        }else{
            MyUserData.ruleCityIds.push(cityId);
            LDMgr.setItem(LDKey.KEY_RuleCityIds, this.getIdsToStr(MyUserData.ruleCityIds));

            for(let i=0; i<MyUserData.myCityIds.length; ++i){
                if(cityId == MyUserData.myCityIds[i]){
                    MyUserData.myCityIds.splice(i, 1);
                    LDMgr.setItem(LDKey.KEY_MyCityIds, this.getIdsToStr(MyUserData.myCityIds));
                    break;
                }
            }
        }

        NoticeMgr.emit(NoticeType.CityFlagStory, 100);  //黄巾之乱，董卓之乱等叛乱的城池旗帜通知, 100我我方城池
    }

    //新增我方治下但是未被占领的城池列表
    addRuleCitys(ids: number[]){
        for(let i=0; i<ids.length; ++i){
            MyUserData.ruleCityIds.push(ids[i]);
        }
        //LDMgr.setItem(LDKey.KEY_RuleCityIds, this.getIdsToStr(MyUserData.ruleCityIds));
    }

    getIdsToStr(ids: number[], sp: string = "|"){
        let str = ""
        for(let i=0; i<ids.length; ++i){
            str += (ids[i].toString()+sp);
        }
        return str;
    }

    /**修改用户背包物品列表 */
    updateItemByCount(itemId: number, val: number){
        for(let i=0; i<MyUserData.ItemList.length; ++i){
            let bagItem: ItemInfo = MyUserData.ItemList[i];
            if(bagItem.itemId == itemId){
                MyUserData.ItemList[i].count += val;
                if(MyUserData.ItemList[i].count <= 0){
                    MyUserData.ItemList[i].count = 0;
                }
                NoticeMgr.emit(NoticeType.UpdateBagItem, MyUserData.ItemList[i]);  //更新单个背包物品
                if(MyUserData.ItemList[i].count <= 0){
                    MyUserData.ItemList.splice(i, 1);  //道具用完，从背包删除
                }
                this.saveItemList();
                return;
            }
        }

        if(val > 0){   //增加的新道具
            let item = new ItemInfo(itemId, val);
            MyUserData.ItemList.push(item);
            NoticeMgr.emit(NoticeType.UpdateBagItem, item);  //更新单个背包物品
            this.saveItemList();
        }
    }
    
    /**修改用户背包物品列表 */
    updateItemList(item: ItemInfo, bSave: boolean = true){
        let bUpdateItem: boolean = false;
        for(let i=0; i<MyUserData.ItemList.length; ++i){
            let bagItem: ItemInfo = MyUserData.ItemList[i];
            if(bagItem.itemId == item.itemId){
                MyUserData.ItemList[i].count += item.count;
                NoticeMgr.emit(NoticeType.UpdateBagItem, MyUserData.ItemList[i]);  //更新单个背包物品
                bUpdateItem = true;
                break;
            }
        }

        if(bUpdateItem == false){
            MyUserData.ItemList.push(item);
            NoticeMgr.emit(NoticeType.UpdateBagItem, item);  //更新单个背包物品
        }

        if(bSave){
            this.saveItemList();
        }
    }
    //获取背包中物品数据
    getItemFromList(itemId: number):ItemInfo{
        for(let i=0; i<MyUserData.ItemList.length; ++i){
            let bagItem: ItemInfo = MyUserData.ItemList[i];
            if(bagItem.itemId == itemId){
                return bagItem;
            }
        }
        return new ItemInfo(itemId, 0);
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
    /**从本地存储中获取物品列表 */
    getItemListByLD(){
        let ItemList = LDMgr.getJsonItem(LDKey.KEY_ItemList);  //背包物品列表
        let tempList = new Array();
        if(ItemList){
            for(let i=0; i<ItemList.length; ++i){
                let tempItem = new ItemInfo(ItemList[i].itemId, ItemList[i].count);
                tempList.push(tempItem);
            }
        }
        return tempList;
    }

    //获取武将列表克隆
    getGeneralListClone(){
        let tempArr = new Array();
        for(let i=0; i<MyUserData.GeneralList.length; ++i){
            let info: GeneralInfo = MyUserData.GeneralList[i].clone();
            tempArr.push(info);
        }
        return tempArr;
    }

    /**修改用户武将列表 */
    updateGeneralList(general: GeneralInfo, bSave:boolean=true){
        for(let i=0; i<MyUserData.GeneralList.length; ++i){
            let info: GeneralInfo = MyUserData.GeneralList[i];
            if(general.timeId == info.timeId){
                MyUserData.GeneralList[i] = general;
                MyUserData.GeneralList[i].tempFightInfo = null;
                NoticeMgr.emit(NoticeType.UpdateGeneral, general);  //更新单个武将
                if(bSave){
                    this.saveGeneralList();
                }
                return;
            }
        }
    }
    /**添加武将到列表 */
    addGeneralToList(general: GeneralInfo, bSave: boolean = true){
        let minTimeId = 0;
        let bConflictTimeId = false;
        for(let i=0; i<MyUserData.GeneralList.length; ++i){
            let info: GeneralInfo = MyUserData.GeneralList[i];
            if(general.timeId == info.timeId){
                bConflictTimeId = true;
            }
            if(minTimeId == 0 || minTimeId > info.timeId){
                minTimeId = info.timeId;
            }
        }
        if(bConflictTimeId == true){
            general.timeId = minTimeId -1;
        }

        MyUserData.GeneralList.push(general);

        if(bSave){
            this.saveGeneralList();
        }
    }
    /**保存武将列表 */
    saveGeneralList(){
        let GeneralList = new Array();
        for(let i=0; i<MyUserData.GeneralList.length; ++i){
            let tempItem = MyUserData.GeneralList[i].cloneNoCfg();
            GeneralList.push(tempItem);
        }
        //cc.log("GeneralList = "+JSON.stringify(GeneralList));
        LDMgr.setItem(LDKey.KEY_GeneralList, JSON.stringify(GeneralList));
    }
    /**从本地存储中获取武将列表 */
    getGeneralListByLD(){
        let GeneralList = LDMgr.getJsonItem(LDKey.KEY_GeneralList);  //武将列表
        let tempList: GeneralInfo[] = new Array();
        let curTime = new Date().getTime();
        if(GeneralList){
            for(let i=0; i<GeneralList.length; ++i){
                let tempItem = new GeneralInfo(GeneralList[i].generalId, GeneralList[i]);
                tempItem.timeId = curTime - i;   //防止一起读取时多个武将timeId一致
                tempList.push(tempItem);
            }
        }

        return tempList;
    }

    //更新主角经验
    updateRoleExp(exp:number){
        for(let i=0; i<MyUserData.GeneralList.length; ++i){
            let tempItem: GeneralInfo = MyUserData.GeneralList[i];
            if(tempItem.generalId == 3001){   //曹操
                tempItem.generalExp += exp;
                let oldLv = tempItem.generalLv;
                tempItem.updateLvByExp();
                MyUserData.GeneralList[i] = tempItem;
                this.saveGeneralList();

                if(tempItem.generalLv > oldLv){
                    this.updateRoleLv(tempItem.generalLv);
                }
                return;
            }
        }
    }

    /**修改用户金币 */
    updateUserGold(val:number){
        MyUserData.GoldCount += val;
        LDMgr.setItem(LDKey.KEY_GoldCount, MyUserData.GoldCount);
        NoticeMgr.emit(NoticeType.UpdateGold, null);
    }

    /**修改用户钻石(金锭) */
    updateUserDiamond(val:number){
        MyUserData.DiamondCount += val;
        LDMgr.setItem(LDKey.KEY_DiamondCount, MyUserData.DiamondCount);
        NoticeMgr.emit(NoticeType.UpdateDiamond, null);
    }

    /**修改用户粮食 */
    updateUserFood(val:number){
        MyUserData.FoodCount += val;
        LDMgr.setItem(LDKey.KEY_FoodCount, MyUserData.FoodCount);
        NoticeMgr.emit(NoticeType.UpdateFood, null);
    }

    /**修改用户任务 0未完成，1完成未领取，2已领取 */
    updateTaskState(taskId: number, state: number){
        if(MyUserData.TaskId == taskId && MyUserData.TaskState == state){
            return;
        }
        MyUserData.TaskId = taskId;
        MyUserData.TaskState = state;

        if(state == 2){   //2已领取，下一个任务
            MyUserData.TaskId ++;
            MyUserData.TaskState = 0;
        }

        LDMgr.setItem(LDKey.KEY_StoryData, MyUserData.TaskId.toString()+"-"+MyUserData.TaskState);
        NoticeMgr.emit(NoticeType.UpdateTaskState, null);   //任务状态更新
    }


}
export var MyUserMgr = new MyUserManager();

