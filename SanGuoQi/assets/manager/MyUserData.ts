import { LDMgr, LDKey } from "./StorageManager";


//用户数据管理
const { ccclass, property } = cc._decorator;

export var MyUserData = {
    /**以下数据需要更新到服务器 */
    GoldCount: 0,   //用户金币
    DiamondCount: 0,   //用户钻石(金锭）数
    FoodCount: 0,  //用户粮食数量
    TaskId: 1,   //当前任务ID
    TaskState: 0,    //当前任务状态 0未完成，1完成未领取，2已领取
    
};

@ccclass
class MyUserManager {

    /**初始化用户信息 */
    initUserData(){
        let taskInfo = LDMgr.getItemKeyVal(LDKey.KEY_StoryData);  //当前任务ID
        if(taskInfo == null){
            this.updateTaskState(1, 0);   //修改用户任务ID
        }else{
            MyUserData.TaskId = parseInt(taskInfo.key);
            MyUserData.TaskState = taskInfo.val;
        }
    }

    /**修改用户金币 */
    updateUserGold(val:number, bSave: boolean = true){
        MyUserData.GoldCount += val;
        if(bSave){
        }
    }

    /**修改用户钻石 */
    updateUserDiamond(val:number, bSave: boolean = true){
        MyUserData.DiamondCount += val;
        if(bSave){
        }
    }

    /**修改用户任务 */
    updateTaskState(taskId: number, state: number, bSave: boolean = true){
        MyUserData.TaskId = taskId;
        MyUserData.TaskState = state;
        if(bSave){
            LDMgr.setItem(LDKey.KEY_StoryData, taskId.toString()+"-"+state);
        }
    }


}
export var MyUserMgr = new MyUserManager();

