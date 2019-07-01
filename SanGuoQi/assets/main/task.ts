import { MyUserData } from "../manager/MyUserData";
import { st_story_info, Cfg, st_city_info } from "../manager/ConfigManager";

//任务信息
const {ccclass, property} = cc._decorator;

@ccclass
export default class Task extends cc.Component {

    @property(cc.Label)
    taskDesc: cc.Label = null;   

    @property(cc.Label)
    taskTitle: cc.Label = null;   

    @property(cc.Label)
    taskDest: cc.Label = null;   

    @property(cc.Node)
    destNode: cc.Node = null;

    @property(cc.Node)
    rewardNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.clearStoryInfo();   //清除任务数据
    }

    start () {
        this.initMainStory();    //初始化主线任务
    }

    // update (dt) {}

    onDestBtn(){

    }

    onRewardBtn(){
        
    }

    /**初始化主线任务 */
    initMainStory(){
        if(MyUserData.TaskId > 0){
            let taskConf: st_story_info = Cfg.getTaskConf(MyUserData.TaskId);
            if(taskConf){
                this.taskTitle.string = taskConf.name;
                this.taskDesc.string = taskConf.desc;

                if(MyUserData.TaskState == 1){   //已完成未领取
                    this.rewardNode.active = true;
                }else{
                    this.destNode.active = true;
                    let cityInfo: st_city_info = Cfg.getCityConf(taskConf.targetCity);
                    if(cityInfo){
                        this.taskDest.string = cityInfo.name;
                    }
                }
            }
        }
    }

    /**清除任务数据 */
    clearStoryInfo(){
        this.rewardNode.active = false;
        this.destNode.active = false;
        this.taskTitle.string = "";
        this.taskDesc.string = "";
        this.taskDest.string = "";
    }
}
