import { MyUserData, MyUserMgr } from "../manager/MyUserData";
import { CfgMgr, st_story_info } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";
import StoryLayer from "./storyLayer";
import { NoticeMgr } from "../manager/NoticeManager";
import { NoticeType } from "../manager/Enum";


//任务信息
const {ccclass, property} = cc._decorator;

@ccclass
export default class Task extends cc.Component {

    @property(cc.Label)
    taskDesc: cc.Label = null;   

    @property(cc.Label)
    taskTitle: cc.Label = null;   

    @property(cc.Node)
    detailNode: cc.Node = null;

    @property(cc.Node)
    rewardNode: cc.Node = null;

    @property(cc.Prefab)
    pfStoryLayer: cc.Prefab = null; 

    // LIFE-CYCLE CALLBACKS:
    taskConf: st_story_info = null;   //剧情配置

    onLoad () {
        NoticeMgr.on(NoticeType.UpdateTaskState, this.initMainStory, this);  //任务状态更新

        this.clearStoryInfo();   //清除任务数据
    }

    onDestroy(){
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start () {
        this.initMainStory();    //初始化主线任务
    }

    // update (dt) {}

    onDetailBtn(){
        let layer = GameMgr.showLayer(this.pfStoryLayer);
        layer.getComponent(StoryLayer).initStoryConf(this.taskConf);
    }

    onRewardBtn(){
        GameMgr.showRewardLayer(null, this.handleReceiveReward, this);
    }

    //领取奖励回调
    handleReceiveReward(){
        if(this.taskConf){
            MyUserMgr.updateTaskState(MyUserData.TaskId, 2);   //修改用户任务 0未完成，1完成未领取，2已领取 
        }
    }

    /**初始化主线任务 */
    initMainStory(){
        if(MyUserData.TaskId > 0){
            this.taskConf = CfgMgr.getTaskConf(MyUserData.TaskId);
            if(this.taskConf){
                this.taskTitle.string = this.taskConf.name;
                this.taskDesc.string = this.taskConf.desc;

                if(MyUserData.TaskState == 1){   //已完成未领取
                    this.detailNode.active = false;
                    this.rewardNode.active = true;
                }else{
                    this.detailNode.active = true;
                    this.rewardNode.active = false;
                }
            }
        }
    }

    /**清除任务数据 */
    clearStoryInfo(){
        this.rewardNode.active = false;
        this.detailNode.active = false;
        this.taskTitle.string = "";
        this.taskDesc.string = "";
    }
}
