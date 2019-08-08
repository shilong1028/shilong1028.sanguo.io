import { MyUserData, MyUserMgr } from "../manager/MyUserData";
import { CfgMgr, st_story_info } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";
import StoryLayer from "./storyLayer";
import { NoticeMgr } from "../manager/NoticeManager";
import { NoticeType, ItemInfo, SpecialStory } from "../manager/Enum";
import RewardLayer from "../common/rewardLayer";
import { ROOT_NODE } from "../common/rootNode";
import GeneralJoin from "../views/generalJoin";


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

    @property(cc.Prefab)
    pfGenJoin: cc.Prefab = null;   //武将来投

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
        //cc.log("onRewardBtn(), this.taskConf = "+JSON.stringify(this.taskConf));
        if(this.taskConf.generals && this.taskConf.generals.length > 0){    //武将来投
            let layer = GameMgr.showLayer(this.pfGenJoin);
            layer.getComponent(GeneralJoin).initGeneralIds(this.taskConf.generals);

            MyUserMgr.updateTaskState(MyUserData.TaskId, 2);   //修改用户任务 0未完成，1完成未领取，2已领取 
        }else{
            let layer = GameMgr.showRewardLayer(null, this.handleReceiveReward, this);
            let rewardArr = GameMgr.getItemArrByKeyVal(this.taskConf.rewards);   //通过配置keyVal数据砖块道具列表
            layer.getComponent(RewardLayer).showRewardList(rewardArr);
        }
    }

    //领取奖励回调
    handleReceiveReward(rewards: ItemInfo[]){
        if(this.taskConf){
            GameMgr.receiveRewards(rewards);   //领取奖励

            MyUserMgr.updateTaskState(MyUserData.TaskId, 2);   //修改用户任务 0未完成，1完成未领取，2已领取 
        }
    }

    /**初始化主线任务 */
    initMainStory(){
        GameMgr.curTaskConf = null;  //当前任务配置
        if(MyUserData.TaskId > 0){
            if(MyUserData.TaskId <= SpecialStory.huangjinover){   //黄巾之乱结束
                NoticeMgr.emit(NoticeType.CityFlagStory, 1);  //黄巾之乱，董卓之乱等叛乱的城池旗帜通知
            }else if(MyUserData.TaskId <= SpecialStory.dongzhuoOver){   //董卓之乱结束
                NoticeMgr.emit(NoticeType.CityFlagStory, 2);  //黄巾之乱，董卓之乱等叛乱的城池旗帜通知
            }
            if(MyUserData.TaskId == SpecialStory.capitalOpen){  //开启主城
                GameMgr.getMainScene().showHomeBtn(true);  //是否显示主城
            }

            this.taskConf = CfgMgr.getTaskConf(MyUserData.TaskId);
            if(this.taskConf){
                GameMgr.curTaskConf = this.taskConf;  //当前任务配置

                this.taskTitle.string = this.taskConf.name;
                this.taskDesc.string = this.taskConf.desc;

                GameMgr.getMainScene().showHandActions(0);   //引导任务详情或奖励

                if(MyUserData.TaskState == 1){   //已完成未领取
                    this.detailNode.active = false;
                    this.rewardNode.active = true;
                }else{
                    this.detailNode.active = true;
                    this.rewardNode.active = false;

                    ROOT_NODE.showTipsText("任务更新 "+this.taskConf.name);
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
