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

    TaskId: 1,   //当前任务ID
    TaskState: 0,    //当前任务状态 0未完成，1完成未领取，2已领取

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

        MyUserData.TaskId = 1;   //当前任务ID
        MyUserData.TaskState = 0;    //当前任务状态 0未完成，1完成未领取，2已领取
        LDMgr.setItem(LDKey.KEY_StoryData, "1-0");

        MyUserData.ItemList = new Array();   //背包物品列表
        LDMgr.setItem(LDKey.KEY_ItemList, JSON.stringify(MyUserData.ItemList));

        MyUserData.GeneralList = new Array();  //武将列表
        LDMgr.setItem(LDKey.KEY_GeneralList, JSON.stringify(MyUserData.GeneralList));

        this.initUserData();
    }

    /**初始化用户信息 */
    initUserData(){
        MyUserData.GoldCount = LDMgr.getItemInt(LDKey.KEY_GoldCount);   //用户金币
        MyUserData.DiamondCount = LDMgr.getItemInt(LDKey.KEY_DiamondCount);   //用户钻石(金锭）数
        MyUserData.FoodCount = LDMgr.getItemInt(LDKey.KEY_FoodCount);   //用户粮食数量

        let taskInfo = LDMgr.getItemKeyVal(LDKey.KEY_StoryData);  //当前任务ID
        if(taskInfo == null){
            this.updateTaskState(1, 0);   //修改用户任务ID
        }else{
            MyUserData.TaskId = parseInt(taskInfo.key);
            MyUserData.TaskState = taskInfo.val;
        }

        MyUserData.ItemList = this.getItemListByLD();  //背包物品列表
        MyUserData.GeneralList = this.getGeneralListByLD();  //武将列表

        cc.log("initUserData() 初始化用户信息 MyUserData = "+JSON.stringify(MyUserData));
    }

    /**修改用户背包物品列表 */
    updateItemByCount(itemId: number, val: number, bSave: boolean = true){
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
                if(bSave){
                    this.saveItemList();
                }
                return;
            }
        }

        if(val > 0){   //增加的新道具
            let item = new ItemInfo(itemId, val);
            MyUserData.ItemList.push(item);
            NoticeMgr.emit(NoticeType.UpdateBagItem, item);  //更新单个背包物品

            if(bSave){
                this.saveItemList();
            }
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

    /**修改用户武将列表 */
    updateGeneralList(general: GeneralInfo, bSave: boolean = true){
        let bUpdateList: boolean = false;
        for(let i=0; i<MyUserData.GeneralList.length; ++i){
            let info: GeneralInfo = MyUserData.GeneralList[i];
            if(general.timeId == info.timeId){
                MyUserData.GeneralList[i] = general;
                bUpdateList = true;
                NoticeMgr.emit(NoticeType.UpdateGeneral, general);  //更新单个武将
                break;
            }
        }

        if(bUpdateList == false){
            MyUserData.GeneralList.push(general);
            NoticeMgr.emit(NoticeType.UpdateGeneral, general);  //更新单个武将
        }

        if(bSave){
            this.saveGeneralList();
        }
    }
    /**添加武将到列表 */
    addGeneralToList(general: GeneralInfo, bSave: boolean = true){
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

        LDMgr.setItem(LDKey.KEY_GeneralList, JSON.stringify(GeneralList));
    }
    /**从本地存储中获取武将列表 */
    getGeneralListByLD(){
        let GeneralList = LDMgr.getJsonItem(LDKey.KEY_GeneralList);  //武将列表
        let tempList = new Array();
        if(GeneralList){
            for(let i=0; i<GeneralList.length; ++i){
                let tempItem = new GeneralInfo(GeneralList[i].generalId);
                tempList.push(tempItem);
            }
        }
        if(tempList.length == 0){   //初始加入曹操，lv=3
            let caocao = new GeneralInfo(3001);
            caocao.generalLv = 3;
            tempList.push(caocao);
        }
        return tempList;
    }

    /**修改用户金币 */
    updateUserGold(val:number, bSave: boolean = true){
        MyUserData.GoldCount += val;
        if(bSave){
            LDMgr.setItem(LDKey.KEY_GoldCount, MyUserData.GoldCount);
        }
        NoticeMgr.emit(NoticeType.UpdateGold, null);
    }

    /**修改用户钻石(金锭) */
    updateUserDiamond(val:number, bSave: boolean = true){
        MyUserData.DiamondCount += val;
        if(bSave){
            LDMgr.setItem(LDKey.KEY_DiamondCount, MyUserData.DiamondCount);
        }
        NoticeMgr.emit(NoticeType.UpdateDiamond, null);
    }

    /**修改用户粮食 */
    updateUserFood(val:number, bSave: boolean = true){
        MyUserData.FoodCount += val;
        if(bSave){
            LDMgr.setItem(LDKey.KEY_FoodCount, MyUserData.FoodCount);
        }
        NoticeMgr.emit(NoticeType.UpdateFood, null);
    }

    /**修改用户任务 0未完成，1完成未领取，2已领取 */
    updateTaskState(taskId: number, state: number, bSave: boolean = true){
        if(MyUserData.TaskId == taskId && MyUserData.TaskState == state){
            return;
        }
        MyUserData.TaskId = taskId;
        MyUserData.TaskState = state;

        if(state == 2){   //2已领取，下一个任务
            MyUserData.TaskId ++;
            MyUserData.TaskState = 0;
            bSave = true;
        }

        if(bSave){
            LDMgr.setItem(LDKey.KEY_StoryData, MyUserData.TaskId.toString()+"-"+MyUserData.TaskState);
        }

        NoticeMgr.emit(NoticeType.UpdateTaskState, null);   //任务状态更新
    }


}
export var MyUserMgr = new MyUserManager();

