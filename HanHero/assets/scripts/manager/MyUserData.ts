/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:14:18
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 14:39:54
 * @Description: 
 */
import { LDMgr, LDKey } from "./StorageManager";
import { GeneralInfo, ItemInfo, BuilderInfo, CfgMgr, BeautyInfo } from "./ConfigManager";
import { NoticeMgr, NoticeType } from "./NoticeManager";
import { GuideMgr } from "./GuideMgr";
import { TaskState } from "./Enum";
import AppFacade from '../puremvc/appFacade';
import PlayerCommand from '../puremvc/playerCommand';

//用户数据管理
const { ccclass, property } = cc._decorator;

export var MyUserData = {
    /**以下数据需要更新到服务器 */
    UserName: "",   //用户名
    UserUUid: "",    //用户唯一标识

    GoldCount: 0,   //用户金锭
    DiamondCount: 0,   //用户钻石
    FoodCount: 0,  //用户粮食

    totalLineTime: 0,   //总的在线时长（每100s更新记录一次）
    lastGoldTaxTime: 0,   //上一次收税金时间

    roleLv: 1,  //主角等级
    capitalLv: 0,   //主城等级，0则未开启

    TaskId: "1001",   //当前任务ID
    TaskState: 0,    //当前任务状态 0未完成，1完成未领取，2已领取

    myTownIdxs: [],   //郡守之前我方占据的县城索引，此时myCityIds只有一个且所属县并未全部占领，全部占领则晋升郡守myTownIdxs字段之后无用。
    myCityIds: [],   //己方占领的城池ID集合（晋封太守后获得一个城池，开启主城后可以有管辖城池集合）
    ruleCityIds: [],   //己方统治下未被占领或叛乱的城池ID集合

    BuilderList:[],   //建筑列表
    ItemList: [],   //背包物品列表
    GeneralList: [],   //武将列表
    BeautyList: [],   //美姬列表
    officalIds: [],   //当前官职（可身兼数职）

    guideStepStrs: "",   //新手引导步骤"1000-1100-1200-..."

};

@ccclass
class MyUserManager {

    /**清除所有用户数据 */
    clearUserData() {
        cc.log("清除所有用户数据")
        LDMgr.setItem(LDKey.KEY_NewUser, 0);  //是否新用户

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

        MyUserData.TaskId = "1001";   //当前任务ID
        MyUserData.TaskState = TaskState.Ready;   //任务状态 0未完成，1对话完成，2完成未领取，3已领取
        LDMgr.setItem(LDKey.KEY_StoryData, "1001-0");

        MyUserData.myTownIdxs = [];   //郡守之前我方占据的县城索引，此时myCityIds只有一个且所属县并未全部占领，全部占领则晋升郡守myTownIdxs字段之后无用。
        LDMgr.setItem(LDKey.KEY_MyTownIdxs, "");
        MyUserData.myCityIds = [];  //己方占领的城池ID集合（晋封太守后获得一个城池，开启主城后可以有管辖城池集合）
        LDMgr.setItem(LDKey.KEY_MyCityIds, "");
        MyUserData.ruleCityIds = [];   //己方统治下未被占领或叛乱的城池ID集合
        LDMgr.setItem(LDKey.KEY_RuleCityIds, "");

        MyUserData.BuilderList = [];   //建筑列表
        LDMgr.setItem(LDKey.KEY_BuilderList, JSON.stringify(MyUserData.BuilderList));

        MyUserData.ItemList = [];   //背包物品列表
        LDMgr.setItem(LDKey.KEY_ItemList, JSON.stringify(MyUserData.ItemList));

        MyUserData.GeneralList = [];  //武将列表
        LDMgr.setItem(LDKey.KEY_GeneralList, JSON.stringify(MyUserData.GeneralList));

        MyUserData.BeautyList = [];  //美姬列表
        LDMgr.setItem(LDKey.KEY_BeautyList, JSON.stringify(MyUserData.BeautyList));

        MyUserData.officalIds = [];  //当前官职（可身兼数职）
        LDMgr.setItem(LDKey.KEY_OfficalIds, "");

        MyUserData.guideStepStrs = "";   //新手引导步骤"1000-1100-1200-..."

        this.initNewUserData();
    }

    /**初始新用户赋值 */
    initNewUserData() {
        MyUserData.UserName = "";
        MyUserData.UserUUid = "";    //用户唯一标识
        this.checkUserUUid();

        let hero = new GeneralInfo("1101");
        this.addGeneralToList(hero, true)

        this.updateRoleLv(1);  //更新主角等级

        LDMgr.setItem(LDKey.KEY_NewUser, 1);  //是否新用户

        cc.log("初始新用户赋值 MyUserData = " + JSON.stringify(MyUserData));
    }


    checkUserUUid() {
        if (MyUserData.UserUUid && MyUserData.UserUUid.indexOf("豪杰") >= 0 && MyUserData.UserUUid.length > 10) {
        } else {
            MyUserData.UserUUid = "豪杰_" + Math.ceil(Math.random() * 99) + "_" + (new Date().getTime());
            LDMgr.setItem(LDKey.KEY_UserUUid, MyUserData.UserUUid);  
        }
    }

    setUserName(nickName:string) {
        MyUserData.UserName = nickName; 
        LDMgr.setItem(LDKey.KEY_UserName, MyUserData.UserName);  
    }

    /**初始化用户信息 */
    initUserData() {
        MyUserData.UserName = LDMgr.getItem(LDKey.KEY_UserName);    //用户名
        MyUserData.UserUUid = LDMgr.getItem(LDKey.KEY_UserUUid);   //用户唯一标识
        this.checkUserUUid();

        MyUserData.GoldCount = LDMgr.getItemInt(LDKey.KEY_GoldCount);   //用户金币
        MyUserData.DiamondCount = LDMgr.getItemInt(LDKey.KEY_DiamondCount);   //用户钻石(金锭）数
        MyUserData.FoodCount = LDMgr.getItemInt(LDKey.KEY_FoodCount);   //用户粮食数量

        MyUserData.totalLineTime = LDMgr.getItemInt(LDKey.KEY_TotalLineTime);   //总的在线时长（每500s更新记录一次）
        MyUserData.lastGoldTaxTime = LDMgr.getItemInt(LDKey.KEY_LastGoldTaxTime);   //上一次收税金时间

        MyUserData.roleLv = LDMgr.getItemInt(LDKey.KEY_RoleLv);   //主角等级
        MyUserData.capitalLv = LDMgr.getItemInt(LDKey.KEY_CapitalLv);   //主城等级，0则未开启

        let taskInfo = LDMgr.getItemKeyVal(LDKey.KEY_StoryData);  //当前任务ID
        if (taskInfo == null) {
            MyUserData.TaskId = "1001";   //当前任务ID
            MyUserData.TaskState = TaskState.Ready;   //任务状态 0未完成，1对话完成，2完成未领取，3已领取
            LDMgr.setItem(LDKey.KEY_StoryData, MyUserData.TaskId.toString() + "-" + MyUserData.TaskState);
        } else {
            MyUserData.TaskId = taskInfo.key;
            MyUserData.TaskState = taskInfo.val;
        }

        MyUserData.myTownIdxs = LDMgr.getItemIntAry(LDKey.KEY_MyTownIdxs);  //郡守之前我方占据的县城索引，此时myCityIds只有一个且所属县并未全部占领，全部占领则晋升郡守myTownIdxs字段之后无用。
        MyUserData.myCityIds = LDMgr.getItemIntAry(LDKey.KEY_MyCityIds);   //己方占领的城池ID集合（晋封太守后获得一个城池，开启主城后可以有管辖城池集合）
        MyUserData.ruleCityIds = LDMgr.getItemIntAry(LDKey.KEY_RuleCityIds);   //己方统治下未被占领或叛乱的城池ID集合

        MyUserData.BuilderList = this.getBuilderListByLD();   //建筑列表
        MyUserData.ItemList = this.getItemListByLD();  //背包物品列表
        MyUserData.GeneralList = this.getGeneralListByLD();  //武将列表
        MyUserData.BeautyList = this.getBeautyListByLD();  //美姬列表

        MyUserData.officalIds = LDMgr.getItemIntAry(LDKey.KEY_OfficalIds);  //当前官职（可身兼数职）

        MyUserData.guideStepStrs = LDMgr.getItem(LDKey.KEY_GuideSteps);   //新手引导步骤"1000-1100-1200-..."
        GuideMgr.setFinishGuideStep(MyUserData.guideStepStrs);   //设置完成的引导步骤（开始）字符串  "1000-1100-1200-..."

        if (LDMgr.getItemInt(LDKey.KEY_NewUser) == 0) {  //新用户 
            this.clearUserData();
        }

        console.log("initUserData() 初始化用户信息 MyUserData = " + JSON.stringify(MyUserData));
    }

    /**更新在线总时长 */
    updateLineTime(dt: number) {
        MyUserData.totalLineTime += dt;   //总的在线时长（每100s更新记录一次）

        let intTime = Math.floor(MyUserData.totalLineTime);
        if (intTime % 100 == 0) {
            LDMgr.setItem(LDKey.KEY_TotalLineTime, intTime);
        }
    }

    /**更新收税金时间 */
    updateGoldTaxTime() {
        let intTime = Math.floor(MyUserData.totalLineTime);

        MyUserData.lastGoldTaxTime = intTime;  //上一次收税金时间
        LDMgr.setItem(LDKey.KEY_TotalLineTime, intTime);   //总的在线时长
        LDMgr.setItem(LDKey.KEY_LastGoldTaxTime, MyUserData.lastGoldTaxTime);
    }

    /**更新主城等级 */
    updateCapitalLv(capitalLv: number) {
        MyUserData.capitalLv = capitalLv;
        if (MyUserData.capitalLv > 100) {
            MyUserData.capitalLv = 100;
        }
        LDMgr.setItem(LDKey.KEY_CapitalLv, MyUserData.capitalLv);   //主城等级，0则未开启
    }

    /**更新主角等级 */
    updateRoleLv(roleLv: number) {
        let oldRoleLv = 0;
        if (roleLv > 0) {
            oldRoleLv = MyUserData.roleLv;
            MyUserData.roleLv = roleLv;  //主角等级
            LDMgr.setItem(LDKey.KEY_RoleLv, roleLv);

        }
        NoticeMgr.emit(NoticeType.UpdateRoleLvOffical, oldRoleLv);  //更新主角等级或官职
    }

    /**将Int数组转化为分隔符字符串 */
    getIdsToStr(ids: number[], sp: string = "|") {
        let str = ""
        for (let i = 0; i < ids.length; ++i) {
            str += (ids[i].toString() + sp);
        }
        return str;
    }

    /**更新主角官职（可身兼数职） */
    updateOfficalIds(officalIds: number[]) {
        cc.log("updateOfficalIds(), officalIds = " + officalIds);
        MyUserData.officalIds = officalIds;
        LDMgr.setItem(LDKey.KEY_OfficalIds, this.getIdsToStr(MyUserData.officalIds));

        NoticeMgr.emit(NoticeType.UpdateRoleLvOffical, 0);  //更新主角等级或官职
    }

    /**根据城池ID判定是否为我方已占据的城池 */
    isMyCityById(cityId: number) {
        for (let i = 0; i < MyUserData.myCityIds.length; ++i) {
            if (cityId == MyUserData.myCityIds[i]) {
                return true;
            }
        }
        return false;
    }

    /**更新郡守之前我方占据县城列表 */
    updateMyTownIdxs(townIdx: number, bAdd: boolean = true, cityId?: number) {
        cc.log("updateMyTownIdxs(), townIdx = " + townIdx + "; bAdd = " + bAdd+ "; cityId = " + cityId);
        //郡守之前我方占据的县城索引，此时myCityIds只有一个且所属县并未全部占领，全部占领则晋升郡守myTownIdxs字段之后无用。
        if(MyUserData.myCityIds.length === 0 && cityId){
            MyUserData.myCityIds.push(cityId);
            LDMgr.setItem(LDKey.KEY_MyCityIds, this.getIdsToStr(MyUserData.myCityIds));
        }else if(cityId && MyUserData.myCityIds.length === 1 && cityId === MyUserData.myCityIds[0]){
        }else{
            return
        }
        let bChangeTowns:boolean = false;
        if (bAdd == true) {
            MyUserData.myTownIdxs.push(townIdx);
            bChangeTowns = true
        } else {
            for (let i = 0; i < MyUserData.myTownIdxs.length; ++i) {
                if (townIdx === MyUserData.myTownIdxs[i]) {
                    MyUserData.myTownIdxs.splice(i, 1);
                    bChangeTowns = true
                    break;
                }
            }
        }
        if(bChangeTowns){
            LDMgr.setItem(LDKey.KEY_MyTownIdxs, this.getIdsToStr(MyUserData.myTownIdxs));
        }
    }

    /**更新我方占领的城池列表 */
    updateMyCityIds(cityId: number, bAdd: boolean = true) {
        cc.log("updateMyCityIds(), cityId = " + cityId + "; bAdd = " + bAdd);
        if (bAdd == true) {
            MyUserData.myCityIds.push(cityId);
            LDMgr.setItem(LDKey.KEY_MyCityIds, this.getIdsToStr(MyUserData.myCityIds));

            let bChangeRuleCitys = false;
            for (let i = 0; i < MyUserData.ruleCityIds.length; ++i) {
                if (cityId === MyUserData.ruleCityIds[i]) {
                    MyUserData.ruleCityIds.splice(i, 1);
                    bChangeRuleCitys = true;
                }
            }
            if (bChangeRuleCitys == true) {
                LDMgr.setItem(LDKey.KEY_RuleCityIds, this.getIdsToStr(MyUserData.ruleCityIds));
            }
        } else {
            MyUserData.ruleCityIds.push(cityId);
            LDMgr.setItem(LDKey.KEY_RuleCityIds, this.getIdsToStr(MyUserData.ruleCityIds));

            for (let i = 0; i < MyUserData.myCityIds.length; ++i) {
                if (cityId === MyUserData.myCityIds[i]) {
                    MyUserData.myCityIds.splice(i, 1);
                    LDMgr.setItem(LDKey.KEY_MyCityIds, this.getIdsToStr(MyUserData.myCityIds));
                    break;
                }
            }
        }

        NoticeMgr.emit(NoticeType.CityFlagStory, 100);  //黄巾之乱，董卓之乱等叛乱的城池旗帜通知, 100我我方城池
    }

    /**修改建筑列表 */
    updateBuilderList(builder: BuilderInfo, bSave: boolean = true) {
        let bUpdateItem: boolean = false;
        for (let i = 0; i < MyUserData.BuilderList.length; ++i) {
            let info: BuilderInfo = MyUserData.BuilderList[i];
            if (info.name == builder.name) {
                MyUserData.BuilderList[i] = builder;
                bUpdateItem = true;
                break;
            }
        }

        if (bUpdateItem == false) {
            MyUserData.BuilderList.push(builder);
        }
        //NoticeMgr.emit(NoticeType.UpdateBagItem, MyUserData.ItemList[i]);  //更新单个背包物品

        if (bSave) {
            this.saveBuilderList();
        }
    }
    /**获取建筑数据 */
    getBuilderFromList(builder_name: string): BuilderInfo {
        for (let i = 0; i < MyUserData.BuilderList.length; ++i) {
            let info: BuilderInfo = MyUserData.BuilderList[i];
            if (info.name == builder_name) {
                return info;
            }
        }
        return new BuilderInfo(builder_name, 0);
    }
    /**保存建筑列表 */
    saveBuilderList() {
        let tempList = [];
        for (let i = 0; i < MyUserData.BuilderList.length; ++i) {
            let tempItem = MyUserData.BuilderList[i].cloneNoCfg();
            tempList.push(tempItem);
        }

        LDMgr.setItem(LDKey.KEY_BuilderList, JSON.stringify(tempList));
    }
    /**从本地存储中获取建筑列表 */
    getBuilderListByLD() {
        let builderList = LDMgr.getJsonObj(LDKey.KEY_BuilderList); 
        let tempList = [];
        if (builderList) {
            for (let i = 0; i < builderList.length; ++i) {
                let tempBuilder = new BuilderInfo(builderList[i].name, builderList[i].level);
                tempList.push(tempBuilder);
            }
        }
        return tempList;
    }

    /**新增我方治下但是未被占领的城池列表 */
    addRuleCitys(ids: number[]) {
        for (let i = 0; i < ids.length; ++i) {
            MyUserData.ruleCityIds.push(ids[i]);
        }
        //LDMgr.setItem(LDKey.KEY_RuleCityIds, this.getIdsToStr(MyUserData.ruleCityIds));
    }

    /**修改用户背包物品列表 */
    updateItemByCount(itemId: number, val: number) {
        for (let i = 0; i < MyUserData.ItemList.length; ++i) {
            let bagItem: ItemInfo = MyUserData.ItemList[i];
            if (bagItem.itemId == itemId) {
                MyUserData.ItemList[i].count += val;
                if (MyUserData.ItemList[i].count <= 0) {
                    MyUserData.ItemList[i].count = 0;
                }
                NoticeMgr.emit(NoticeType.UpdateBagItem, MyUserData.ItemList[i]);  //更新单个背包物品
                if (MyUserData.ItemList[i].count <= 0) {
                    MyUserData.ItemList.splice(i, 1);  //道具用完，从背包删除
                }
                this.saveItemList();
                return;
            }
        }

        if (val > 0) {   //增加的新道具
            let item = new ItemInfo(itemId, val);
            MyUserData.ItemList.push(item);
            NoticeMgr.emit(NoticeType.UpdateBagItem, item);  //更新单个背包物品
            this.saveItemList();
        }
    }

    /**修改用户背包物品列表 */
    updateItemList(item: ItemInfo, bSave: boolean = true) {
        let bUpdateItem: boolean = false;
        for (let i = 0; i < MyUserData.ItemList.length; ++i) {
            let bagItem: ItemInfo = MyUserData.ItemList[i];
            if (bagItem.itemId == item.itemId) {
                MyUserData.ItemList[i].count += item.count;
                NoticeMgr.emit(NoticeType.UpdateBagItem, MyUserData.ItemList[i]);  //更新单个背包物品
                bUpdateItem = true;
                break;
            }
        }

        if (bUpdateItem == false) {
            MyUserData.ItemList.push(item);
            NoticeMgr.emit(NoticeType.UpdateBagItem, item);  //更新单个背包物品
        }

        if (bSave) {
            this.saveItemList();
        }
    }
    /**获取背包中物品数据 */
    getItemFromList(itemId: number): ItemInfo {
        for (let i = 0; i < MyUserData.ItemList.length; ++i) {
            let bagItem: ItemInfo = MyUserData.ItemList[i];
            if (bagItem.itemId == itemId) {
                return bagItem;
            }
        }
        return new ItemInfo(itemId, 0);
    }
    /**保存背包物品列表 */
    saveItemList() {
        let tempList = [];
        for (let i = 0; i < MyUserData.ItemList.length; ++i) {
            let tempItem = MyUserData.ItemList[i].cloneNoCfg();
            tempList.push(tempItem);
        }

        LDMgr.setItem(LDKey.KEY_ItemList, JSON.stringify(tempList));
    }
    /**从本地存储中获取物品列表 */
    getItemListByLD() {
        let ItemList = LDMgr.getJsonObj(LDKey.KEY_ItemList);  //背包物品列表
        let tempList = [];
        if (ItemList) {
            for (let i = 0; i < ItemList.length; ++i) {
                let tempItem = new ItemInfo(ItemList[i].itemId, ItemList[i].count);
                tempList.push(tempItem);
            }
        }
        return tempList;
    }

    /**获取武将列表克隆 */
    getGeneralListClone() {
        let retArr: GeneralInfo[] = [];
        for (let i = 0; i < MyUserData.GeneralList.length; ++i) {
            let tempItem: GeneralInfo = MyUserData.GeneralList[i].clone();
            if (tempItem.state == 1) {  //0默认，1出战中，2驻守中
                tempItem.state = 0;
            }
            retArr.push(tempItem)
        }
        return retArr;
    }

    /** 根据经验更新等级 */
    updateGeneralLvByExp(generalId: string, exp: number) {
        let general: GeneralInfo = null;
        for (let i = 0; i < MyUserData.GeneralList.length; ++i) {
            let tempItem: GeneralInfo = MyUserData.GeneralList[i];
            if (tempItem.generalId == generalId) {
                general = tempItem;
                break;
            }
        }
        if (general) {
            if (general.generalLv >= 100) {   //已满级
                general.generalLv = 100;
                general.generalExp = 0;
            } else {
                general.generalExp += exp;
                let oldLv = general.generalLv;
                let maxExp = CfgMgr.getMaxGeneralExpByLv(general.generalLv);
                while (general.generalExp >= maxExp) {
                    general.generalLv++;
                    general.generalExp -= maxExp;
                    maxExp = CfgMgr.getMaxGeneralExpByLv(general.generalLv);
                }

                this.saveGeneralList();
                if (generalId == "1101" && general.generalLv > oldLv) {   //主角
                    this.updateRoleLv(general.generalLv);
                }
            }
            return general.clone();   //json拷贝对象
        } else {
            return null;
        }
    }

    /** 更新武将兵力 */
    updateGeneralSoliderCount(generalId: string, addNum: number, maxCount?: number) {
        let general: GeneralInfo = null;
        for (let i = 0; i < MyUserData.GeneralList.length; ++i) {
            let tempItem: GeneralInfo = MyUserData.GeneralList[i];
            if (tempItem.generalId == generalId) {
                general = tempItem;
                break;
            }
        }
        if (general) {
            let newCount = general.bingCount + addNum;
            if (maxCount && newCount > newCount) {
                general.bingCount = maxCount;
            } else {
                general.bingCount = newCount;
            }
            this.saveGeneralList();
            return general.clone();   //json拷贝对象
        } else {
            return null;
        }
    }

    /**修改用户武将列表 */
    updateGeneralList(jsonObj: GeneralInfo, bSave: boolean = true) {
        for (let i = 0; i < MyUserData.GeneralList.length; ++i) {
            let info: GeneralInfo = MyUserData.GeneralList[i];
            if (jsonObj.timeId == info.timeId) {
                MyUserData.GeneralList[i].updateGeneralInfoByCopyJson(jsonObj);
                //通过json对象值来重置武将数据,（因为为了防止数据无意篡改，有些引用使用json转换导致对象无法调用成员方法）
                NoticeMgr.emit(NoticeType.UpdateGeneral, jsonObj);  //更新单个武将
                if (bSave) {
                    this.saveGeneralList();
                }
                return;
            }
        }
    }
    /**添加武将到列表 */
    addGeneralToList(general: GeneralInfo, bSave: boolean = true) {
        let minTimeId = 0;
        let bConflictTimeId = false;
        for (let i = 0; i < MyUserData.GeneralList.length; ++i) {
            let info: GeneralInfo = MyUserData.GeneralList[i];
            if (general.timeId == info.timeId) {
                bConflictTimeId = true;
            }
            if (minTimeId == 0 || minTimeId > info.timeId) {
                minTimeId = info.timeId;
            }
        }
        if (bConflictTimeId == true) {
            general.timeId = minTimeId - 1;
        }

        MyUserData.GeneralList.push(general);

        if (bSave) {
            this.saveGeneralList();
        }
    }
    /**保存武将列表 */
    saveGeneralList() {
        let GeneralList = [];
        for (let i = 0; i < MyUserData.GeneralList.length; ++i) {
            let tempItem = MyUserData.GeneralList[i].cloneNoCfg();
            GeneralList.push(tempItem);
        }
        cc.log("GeneralList = " + JSON.stringify(GeneralList));
        LDMgr.setItem(LDKey.KEY_GeneralList, JSON.stringify(GeneralList));
    }
    /**从本地存储中获取武将列表 */
    getGeneralListByLD() {
        let GeneralList = LDMgr.getJsonObj(LDKey.KEY_GeneralList);  //武将列表
        let tempList: GeneralInfo[] = [];
        let curTime = new Date().getTime();
        if (GeneralList) {
            for (let i = 0; i < GeneralList.length; ++i) {
                let tempItem = new GeneralInfo(GeneralList[i].generalId, GeneralList[i]);
                tempItem.timeId = curTime - i;   //防止一起读取时多个武将timeId一致
                tempList.push(tempItem);
            }
        }

        return tempList;
    }

    /**修改用户美姬列表 */
    updateBeautyList(jsonObj: BeautyInfo, bSave: boolean = true) {
        let bFind: boolean = false
        for (let i = 0; i < MyUserData.BeautyList.length; ++i) {
            let info: BeautyInfo = MyUserData.BeautyList[i];
            if (jsonObj.nvId == info.nvId) {
                MyUserData.BeautyList[i] = jsonObj;
                bFind = true
                break;
            }
        }
        if(!bFind){
            MyUserData.BeautyList.push(jsonObj)
        }
        //NoticeMgr.emit(NoticeType.UpdateGeneral, jsonObj);  //更新单个武将
        if (bSave) {
            this.saveBeautyList();
        }
    }
    /**保存美姬列表 */
    saveBeautyList() {
        let BeautyList = [];
        for (let i = 0; i < MyUserData.BeautyList.length; ++i) {
            let tempItem = MyUserData.BeautyList[i].cloneNoCfg();
            BeautyList.push(tempItem);
        }
        cc.log("BeautyList = " + JSON.stringify(BeautyList));
        LDMgr.setItem(LDKey.KEY_BeautyList, JSON.stringify(BeautyList));
    }
    /**从本地存储中获取美姬列表 */
    getBeautyListByLD() {
        let BeautyList = LDMgr.getJsonObj(LDKey.KEY_BeautyList);  //美姬列表
        let tempList: BeautyInfo[] = [];
        if (BeautyList) {
            for (let i = 0; i < BeautyList.length; ++i) {
                let tempItem = new BeautyInfo(BeautyList[i].nvId);
                tempList.push(tempItem);
            }
        }

        return tempList;
    }

    /**更新主角经验 */
    updateRoleExp(exp: number) {
        this.updateGeneralLvByExp("1101", exp);   //主角
    }

    /**修改用户金币 */
    updateUserGold(val: number) {
        MyUserData.GoldCount += val;
        if (MyUserData.GoldCount <= 0) {
            MyUserData.GoldCount = 0;
        }
        LDMgr.setItem(LDKey.KEY_GoldCount, MyUserData.GoldCount);
        //一些小的公用节点，没有采用pureMVC监听，故使用NoticeMgr来监听消息
        NoticeMgr.emit(NoticeType.UpdateGold, null);
    }

    /**修改用户钻石(金锭) */
    updateUserDiamond(val: number) {
        MyUserData.DiamondCount += val;
        if (MyUserData.DiamondCount <= 0) {
            MyUserData.DiamondCount = 0;
        }
        LDMgr.setItem(LDKey.KEY_DiamondCount, MyUserData.DiamondCount);
        NoticeMgr.emit(NoticeType.UpdateDiamond, null);
    }

    /**修改用户粮食 */
    updateUserFood(val: number) {
        MyUserData.FoodCount += val;
        if (MyUserData.FoodCount <= 0) {
            MyUserData.FoodCount = 0;
        }
        LDMgr.setItem(LDKey.KEY_FoodCount, MyUserData.FoodCount);
        NoticeMgr.emit(NoticeType.UpdateFood, null);
    }

    /**修改用户任务  0未完成，1对话完成，2完成未领取，2已领取 */
    updateTaskState(taskId: string, state: TaskState) {
        cc.log("updateTaskState 更新任务状态 taskId = " + taskId + "; state = " + state + "; MyUserData.TaskState = " + MyUserData.TaskState)
        if (MyUserData.TaskId == taskId && MyUserData.TaskState == state) {
            return;
        }
        MyUserData.TaskId = taskId;
        MyUserData.TaskState = state;

        if (state == TaskState.Over) {   //2已领取，下一个任务
            let story_conf = CfgMgr.getTaskConf(MyUserData.TaskId);
            if (story_conf && story_conf.next_id) {
                MyUserData.TaskId = story_conf.next_id;
                MyUserData.TaskState = TaskState.Ready;   //任务状态 0未完成，1对话完成，2完成未领取，2已领取
            }
        }

        LDMgr.setItem(LDKey.KEY_StoryData, MyUserData.TaskId.toString() + "-" + MyUserData.TaskState);
        AppFacade.getInstance().sendNotification(PlayerCommand.E_ON_UpdateTaskState);  //任务状态更新
        //大厅会通过消息监听同步任务状态后，进行后续处理
    }

    /**更新新手引导数据 */
    updateGuideStepData(guideStr: string) {
        MyUserData.guideStepStrs = guideStr;   //新手引导步骤"1000-1100-1200-..."
        LDMgr.setItem(LDKey.KEY_GuideSteps, MyUserData.guideStepStrs);
    }


}
export var MyUserMgr = new MyUserManager();

