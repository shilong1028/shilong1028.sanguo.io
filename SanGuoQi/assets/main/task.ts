import { MyUserData, MyUserMgr } from "../manager/MyUserData";
import { CfgMgr, st_story_info } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";
import StoryLayer from "./storyLayer";
import { NoticeMgr } from "../manager/NoticeManager";
import { NoticeType, ItemInfo } from "../manager/Enum";
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
            if(MyUserData.TaskId < 5){   //黄巾之乱
                NoticeMgr.emit(NoticeType.CityFlagStory, 1);  //黄巾之乱，董卓之乱等叛乱的城池旗帜通知
            }else if(MyUserData.TaskId <=10){   //董卓之乱
                NoticeMgr.emit(NoticeType.CityFlagStory, 2);  //黄巾之乱，董卓之乱等叛乱的城池旗帜通知
            }

            this.taskConf = CfgMgr.getTaskConf(MyUserData.TaskId);
            if(this.taskConf){
                GameMgr.curTaskConf = this.taskConf;  //当前任务配置

                this.taskTitle.string = this.taskConf.name;
                this.taskDesc.string = this.taskConf.desc;

                if(MyUserData.TaskState == 1){   //已完成未领取
                    this.detailNode.active = false;
                    this.rewardNode.active = true;

                    GameMgr.getMainScene().showHandActions(cc.v2(320, -640));   //隐藏
                }else{
                    this.detailNode.active = true;
                    this.rewardNode.active = false;

                    ROOT_NODE.showTipsText("任务更新 "+this.taskConf.name);

                    if(this.taskConf.type == 2){   //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗 6学习技能
                        GameMgr.getMainScene().showHandActions(cc.v2(350, 530));   //引导主城   640+posY
                    }else if(this.taskConf.type == 3){
                        GameMgr.getMainScene().showHandActions(cc.v2(350, 420));   //引导招募
                    }else if(this.taskConf.type == 4){
                        GameMgr.getMainScene().showHandActions(cc.v2(350, 310));   //引导部曲
                    }else if(this.taskConf.type == 6){
                        GameMgr.getMainScene().showHandActions(cc.v2(-350, 310));   //引导技能
                    }
                    else{
                        GameMgr.getMainScene().showHandActions(cc.v2(320, -640));   //隐藏
                    }
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
