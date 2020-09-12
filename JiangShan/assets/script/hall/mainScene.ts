import { NoticeMgr, NoticeType } from "../manager/NoticeManager";
import { FunMgr, TaskType } from "../manager/Enum";
import { MyUserData } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";
import { st_story_info, ItemInfo, CfgMgr } from "../manager/ConfigManager";
import { SDKMgr } from "../manager/SDKManager";
import { ROOT_NODE } from "../login/rootNode";
import { AudioMgr } from "../manager/AudioMgr";
import StoryLayer from "./storyLayer";


//大厅场景
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Hall/mainScene")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class MainScene extends cc.Component {

    @property(cc.Label)
    goldLabel: cc.Label = null;   //金币
    @property(cc.Label)
    foodLabel: cc.Label = null;   //粮草
    @property(cc.Label)
    lvLabel: cc.Label = null;   //主角等级
    @property(cc.Label)
    lineTimeLabel: cc.Label = null;   //在线时长
    @property(cc.Sprite)
    headSpr: cc.Sprite = null;   //主角头像

    @property(cc.Node)
    mapNode: cc.Node = null;   //地图总节点

    @property(cc.Node)
    homeBtnNode: cc.Node = null;  //主城按钮
    @property(cc.Node)
    bagBtnNode: cc.Node = null;  //背包按钮
    @property(cc.Node)
    recruitBtnNode: cc.Node = null;  //募兵按钮
    @property(cc.Node)
    welfareBtnNode: cc.Node = null;  //福利按钮
    @property(cc.Node)
    cityBtnNode: cc.Node = null;  //城池按钮

    @property(cc.Node)
    taskNode: cc.Node = null;  //任务节点
    @property(cc.Node)
    taskReward: cc.Node = null;  //任务奖励
    @property(cc.Label)
    taskTitleLabel: cc.Label = null;  //任务章节
    @property(cc.Label)
    taskNameLabel: cc.Label = null;  //任务名称
    @property(cc.Label)
    taskDescLabel: cc.Label = null;  //任务描述
    @property(cc.Prefab)
    pfStory: cc.Prefab = null;  //剧情故事界面

    @property(cc.Prefab)
    pfTask: cc.Prefab = null;  //任务界面
    @property(cc.Prefab)
    pfBag: cc.Prefab = null;   //背包界面
    @property(cc.Prefab)
    pfRecruit: cc.Prefab = null;  //招募界面

    // LIFE-CYCLE CALLBACKS:

    MapLimitPos: cc.Vec2 = cc.v2(3056, 2664);  //地图位置限制 3056*2664，放大2倍
    touchBeginPos: cc.Vec2 = null;  //触摸起点

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);

        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);

        NoticeMgr.on(NoticeType.UpdateGold, this.UpdateGoldCount, this); 
        NoticeMgr.on(NoticeType.UpdateFood, this.UpdateFoodCount, this); 
        NoticeMgr.on(NoticeType.UpdateRoleLvOffical, this.updateRoleLvLabel, this);  //更新主角等级
        
        NoticeMgr.on(NoticeType.MapMoveByCity, this.handleMapMoveByCityPos, this);   //话本目标通知（地图移动）

        this.mapNode.setPosition(cc.v2(0, -600));   //初始显示洛阳 
        this.MapLimitPos = cc.v2(this.MapLimitPos.x - cc.winSize.width/2, this.MapLimitPos.y - cc.winSize.height/2);

        this.UpdateGoldCount();
        this.UpdateFoodCount();
        this.updateRoleLvLabel();  //更新主角等级

        this.initTaskInfo();   //初始化任务
        this.showLineTime();   //显示在线时长
    }

    start () {
        this.showLineTime();   //显示在线时长
        this.schedule(this.showLineTime, 1);
        //this.schedule(this.showLineTime, 1, 0, 1);   //func, interval, repeat, delay
    }

    update (dt) {
    }

    onDestroy(){
        this.unschedule(this.showLineTime);
        //this.unscheduleAllCallbacks();
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    //显示在线时长
    showLineTime(){ 
        let sec = Math.floor(MyUserData.totalLineTime%60);
        let tempTime = Math.floor(MyUserData.totalLineTime/60);
        let min = Math.floor(tempTime%60);
        tempTime = Math.floor(tempTime/60);
        let hour = Math.floor(tempTime%60);
        tempTime = Math.floor(tempTime/24);
        let day = Math.floor(tempTime%24);
        if(day > 0){
            this.lineTimeLabel.string = day + ":" + hour + ":" + min + ":" + sec;
        }else{
            if(hour > 0){
                this.lineTimeLabel.string = hour + ":" + min + ":" + sec;
            }else{
                this.lineTimeLabel.string = min + ":" + sec;
            }
        }
    }

    //更新主角等级
    updateRoleLvLabel(oldRoleLv: number=0){
        this.lvLabel.string = MyUserData.roleLv.toString();
        if(oldRoleLv > 0){   //主角等级提升
            ROOT_NODE.showTipsText("主角等级提升!");
        }
    }

    UpdateGoldCount(){
        this.goldLabel.string = MyUserData.GoldCount.toString();
    }

    UpdateFoodCount(){
        this.foodLabel.string = MyUserData.FoodCount.toString();
    }

    /**预处理地图将要移动的目标坐标，防止移动过大地图出现黑边 */
    preCheckMapDestPos(offset: cc.Vec2){
        let destPos = this.mapNode.position.add(FunMgr.v2Tov3(offset));
        if(destPos.x > this.MapLimitPos.x){
            destPos.x = this.MapLimitPos.x;
        }else if(destPos.x < -this.MapLimitPos.x){
            destPos.x = -this.MapLimitPos.x;
        }
        if(destPos.y > this.MapLimitPos.y){
            destPos.y = this.MapLimitPos.y;
        }else if(destPos.y < -this.MapLimitPos.y){
            destPos.y = -this.MapLimitPos.y;
        }
        return destPos;
    }

    //初始化任务
    initTaskInfo(){
        GameMgr.curTaskConf = null;  //当前任务配置
        this.taskReward.active = false; //任务奖励
        let taskConf = CfgMgr.getTaskConf(MyUserData.TaskId);
        console.log("initTaskInfo 初始化任务 taskConf = "+JSON.stringify(taskConf))
        if(taskConf){
            GameMgr.curTaskConf = taskConf;  //当前任务配置

            this.taskTitleLabel.string = `第${taskConf.chapterId}章`  //任务章节
            this.taskNameLabel.string = taskConf.name;  //任务名称
            this.taskDescLabel.string = taskConf.desc;  //任务描述

            if(MyUserData.TaskState == 1){   //已完成未领取
                this.taskReward.active = true;
                ROOT_NODE.showTipsText(`任务${taskConf.name}奖励可领取`);
            }

            if(taskConf.type == TaskType.Story){   //剧情故事自动展开
                this.onTaskBtn();
            }
        }
    }
    
    //*******************  以下为各种事件处理方法  ************ */
    
    /** 将地图移动到指定目标点
     *  @param talkType 故事类型
    */
    handleMapMoveByCityPos(cityPos: cc.Vec2, talkType:TaskType=0){
        this.mapNode.stopAllActions();

        let midPos = this.mapNode.position.neg();    //当前视图中心在地图上的坐标
        let offset = midPos.sub(FunMgr.v2Tov3(cityPos));
        let destPos = this.preCheckMapDestPos(FunMgr.v3Tov2(offset));   //预处理地图将要移动的目标坐标，放置移动过大地图出现黑边

        let moveTime = destPos.sub(midPos).mag()/800;
        this.mapNode.runAction(cc.sequence(cc.moveTo(moveTime, FunMgr.v3Tov2(destPos)), cc.callFunc(function(){
            // let aniNode = GameMgr.createAtlasAniNode(this.cicleAtlas, 12, cc.WrapMode.Default);
            // if(aniNode){
            //     aniNode.setPosition(cityPos);
            //     this.mapNode.addChild(aniNode, 100);
            // }
        }.bind(this))));
    }


    /************************  以下为各种按钮事件 ***************/

    /**后台切回前台 */
    onShow() {
        cc.log("************* onShow() 后台切回前台 ***********************")
    }

    /**游戏切入后台 */
    onHide() {
        cc.log("_____________  onHide()游戏切入后台  _____________________")
        //NotificationMy.emit(NoticeType.GAME_ON_HIDE, null);
    }

    touchStart(event: cc.Touch){
        this.touchBeginPos = event.getLocation();
    }

    touchMove(event: cc.Touch){
        if(this.touchBeginPos){
            let pos = event.getLocation();
            let offset = pos.sub(this.touchBeginPos);
            this.touchBeginPos = pos;

            this.mapNode.stopAllActions();
            
            let mapPos = this.preCheckMapDestPos(offset);   //预处理地图将要移动的目标坐标，放置移动过大地图出现黑边
            this.mapNode.setPosition(mapPos);
        }
    }

    touchEnd(event: cc.Touch){
        this.touchBeginPos = null;
    }

    /**任务战斗准备 */
    openFightByTask(taskConf: st_story_info){
        if(taskConf.type == 5 && taskConf.battleId > 0){  //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗 6学习技能 7攻城掠地
            // let layer = GameMgr.showLayer(this.pfFightReady);
            // layer.getComponent(FightReady).initBattleInfo(taskConf.battleId);
        }
    }

    onShareBtn(){
        AudioMgr.playBtnClickEffect();
        SDKMgr.shareGame("快来和我一起征战天下，弹指江山吧！", (succ:boolean)=>{
            console.log("分享 succ = "+succ);
            if(succ == true){
                let items = new Array();
                items.push({"key":6001, "val":1000});   //金币
                items.push({"key":6003, "val":500});   //粮草
                let rewards: ItemInfo[] = GameMgr.getItemArrByKeyVal(items);   //通过配置keyVal数据砖块道具列表
                GameMgr.receiveRewards(rewards);   //领取奖励
            }
        }, this);
    }

    onHeadBtn(){
        AudioMgr.playBtnClickEffect();
    }

    onCapitalBtn(){
        AudioMgr.playBtnClickEffect();
        //GameMgr.goToSceneWithLoading("capitalScene");  //点击主城
    }
    onBagBtn(){
        AudioMgr.playBtnClickEffect();
        //GameMgr.showLayer(this.pfBag);  //背包（武库）界面
    } 
    onRecruitBtn(){
        AudioMgr.playBtnClickEffect();
        //GameMgr.showLayer(this.pfRecruit);   //招募界面
    }

    onWelfareBtn(){
        AudioMgr.playBtnClickEffect();
    }

    onCityBtn(){
        AudioMgr.playBtnClickEffect();
    }

    onTaskBtn(){
        AudioMgr.playBtnClickEffect();

        if(MyUserData.TaskState == 0){   //未完成
            let layer = GameMgr.showLayer(this.pfStory);
            layer.getComponent(StoryLayer).initStoryConf(GameMgr.curTaskConf);
        }else if(MyUserData.TaskState == 1){   //已完成未领取
            GameMgr.openTaskRewardsLayer(GameMgr.curTaskConf);
        }
    } 

    onAddGoldBtn(){
        AudioMgr.playBtnClickEffect();
        GameMgr.showGoldAddDialog();  //获取金币提示框
    }

    onAdBoxBtn(){
        AudioMgr.playBtnClickEffect();
        GameMgr.boxTouchCount ++;
        if(GameMgr.boxTouchCount == 10 && SDKMgr.bAutoPlayVedio == false){
            GameMgr.boxTouchCount = 0;
            
            ROOT_NODE.ShowAdResultDialog();
        }
    }
}
