import { NoticeMgr, NoticeType } from "../manager/NoticeManager";
import { ComItemType, FunMgr, TaskState, TaskType } from "../manager/Enum";
import { MyUserData, MyUserMgr } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";
import { ItemInfo, CfgMgr, st_story_info } from "../manager/ConfigManager";
import { SDKMgr } from "../manager/SDKManager";
import { AudioMgr } from "../manager/AudioMgr";
import StoryLayer from "./storyLayer";
import { ROOT_NODE } from "../login/rootNode";
import OfficalLayer from "./officalLayer";
import GeneralJoin from "./generalJoin";
import RewardLayer from "../comui/rewardLayer";
import GeneralLayer from "./generalLayer";


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
    lvLabel: cc.Label = null;   //主角等级
    @property(cc.Label)
    lineTimeLabel: cc.Label = null;   //在线时长
    @property(cc.Sprite)
    headSpr: cc.Sprite = null;   //主角头像

    @property(cc.Node)
    mapNode: cc.Node = null;   //地图总节点
    @property(cc.Node)
    captialNode: cc.Node = null;  //主城节点

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

    @property(cc.Label)
    mainBtnLbl: cc.Label = null;   //主城或全舆
    @property([cc.Toggle])
    radioButton: cc.Toggle[] = [];    //福利，武将，主城/全舆, 仓库，城池

    @property(cc.Prefab)
    pfStoryLayer: cc.Prefab = null;  //剧情故事界面
    @property(cc.Prefab)
    pfOfficalLayer: cc.Prefab = null;   //官职详情界面
    @property(cc.Prefab)
    pfGeneralJoin: cc.Prefab = null;  //武将来投界面
    @property(cc.Prefab)
    pfGeneralLayer: cc.Prefab = null;  //武将界面

    @property(cc.Prefab)
    pfBag: cc.Prefab = null;   //背包界面

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

        this.initNotice();

        this.mapNode.setPosition(cc.v2(0, -600));   //初始显示洛阳 
        this.MapLimitPos = cc.v2(this.MapLimitPos.x - cc.winSize.width/2, this.MapLimitPos.y - cc.winSize.height/2);
        
        this.updateRoleLvLabel();  //更新主角等级

        this.initTaskInfo();   //初始化任务
        this.showLineTime();   //显示在线时长

        this.radioButton[2].check();   //福利，武将，主城/全舆, 仓库，城池
    }

    initNotice(){
        NoticeMgr.on(NoticeType.ShowMainMap, ()=>{  //显示大厅场景的全局地图
            this.radioButton[2].check();   //福利，武将，主城/全舆, 仓库，城池
        }, this); 
        NoticeMgr.on(NoticeType.UpdateRoleLvOffical, this.updateRoleLvLabel, this);  //更新主角等级
        NoticeMgr.on(NoticeType.UpdateTaskState, this.updateTaskInfo, this);  //更新任务
        
        NoticeMgr.on(NoticeType.MapMoveByCity, this.handleMapMoveByCityPos, this);   //话本目标通知（地图移动）
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
        if(MyUserData.roleLv > 1){
            if(oldRoleLv > 0){   //主角等级提升
                ROOT_NODE.showTipsText("主角等级提升!");

            }else{   //升官
                ROOT_NODE.showTipsText("主角官职提升!");
            }
        }
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

    /** 初始化任务 */
    initTaskInfo(){
        GameMgr.setGameCurTask(null);  //当前任务配置
        this.taskReward.active = false; //任务奖励
        let taskConf = CfgMgr.getTaskConf(MyUserData.TaskId);
        cc.log("initTaskInfo 初始化任务 MyUserData.TaskState = "+MyUserData.TaskState+"; taskConf = "+JSON.stringify(taskConf))
        if(taskConf){
            GameMgr.setGameCurTask(taskConf);  //当前任务配置

            this.taskTitleLabel.string = `第${taskConf.chapterId}章`  //任务章节
            let level = `第${parseInt(taskConf.id_str)%100}节 `
            this.taskNameLabel.string = level + taskConf.name;  //任务名称
            this.taskDescLabel.string = taskConf.desc;  //任务描述

            //任务状态 0未完成，1对话完成，2完成未领取，2已领取
            if(MyUserData.TaskState == TaskState.Reward){   //已完成未领取
                this.taskReward.active = true;
                //ROOT_NODE.showTipsText(`任务${taskConf.name}奖励可领取`);
                this.openTaskRewardsLayer(GameMgr.curTaskConf);
            }else if(MyUserData.TaskState == TaskState.Ready){
                this.onTaskBtn();
            }else if(taskConf.type == TaskType.Story){   //剧情故事自动展开
                this.onTaskBtn();
            }
        }
    }

    /**更新任务 */
    updateTaskInfo(){
        this.initTaskInfo();
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
        let moveTime = destPos.sub(midPos).mag()/1000;
        this.mapNode.runAction(cc.sequence(cc.moveTo(moveTime, FunMgr.v3Tov2(destPos)), cc.callFunc(function(){
            let aniNode = GameMgr.createAtlasAniNode(ROOT_NODE.cicleAtlas, 12, cc.WrapMode.Default);
            if(aniNode){
                aniNode.setPosition(cityPos);
                this.mapNode.addChild(aniNode, 100);
            }
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

    /**分享 */
    onShareBtn(){
        AudioMgr.playBtnClickEffect();
        SDKMgr.shareGame("快来和我一起征战天下，弹指江山吧！", (succ:boolean)=>{
            console.log("分享 succ = "+succ);
            if(succ == true){
                let items = [];
                items.push({"key":ComItemType.Gold, "val":1000});   //金币
                items.push({"key":ComItemType.Food, "val":500});   //粮草
                let rewards: ItemInfo[] = GameMgr.getItemArrByKeyVal(items);   //通过配置keyVal数据砖块道具列表
                GameMgr.receiveRewards(rewards);   //领取奖励
            }
        }, this);
    }

    /**底部页签点击 */
    onRadioButtonClicked(toggle) {
        AudioMgr.playBtnClickEffect();
        let index = this.radioButton.indexOf(toggle);
        if(toggle.isChecked) {
            switch(index) {   // //福利，武将，主城/全舆, 仓库，城池
                case 0:
                    break;
                case 1:
                    this.openGeneralLayer(1);
                    break;
                case 2:
                    if(this.captialNode && this.captialNode.active){   //主城
                        this.mainBtnLbl.string = "主城"
                    }else{
                        this.mainBtnLbl.string = "全舆"
                    }
                    break;
                case 3:
                    break;
                case 4:
                    break;
                default:
                    break;
            }
        }
    }

    /**玩家头像 */
    onHeadBtn(){
        AudioMgr.playBtnClickEffect();
    }

    /**任务 */
    onTaskBtn(){
        AudioMgr.playBtnClickEffect();
        //任务状态 0未完成，1对话完成，2完成未领取，2已领取
        if(MyUserData.TaskState == TaskState.Ready){   //未完成
            let layer = GameMgr.showLayer(this.pfStoryLayer);
            layer.getComponent(StoryLayer).initStoryConf(GameMgr.curTaskConf);
        }else if(MyUserData.TaskState == TaskState.Finish){   //对话完成
            if(GameMgr.curTaskConf.type == TaskType.Story){  
                GameMgr.handleStoryShowOver(GameMgr.curTaskConf, true);
            }else{
                GameMgr.handleStoryShowOver(GameMgr.curTaskConf, false);
            }
        }else if(MyUserData.TaskState == TaskState.Reward){   //已完成未领取
            this.openTaskRewardsLayer(GameMgr.curTaskConf);
        }
    } 

    onAdBoxBtn(){
        AudioMgr.playBtnClickEffect();
        GameMgr.boxTouchCount ++;
        if(GameMgr.boxTouchCount == 10 && SDKMgr.bAutoPlayVedio == false){
            GameMgr.boxTouchCount = 0;
            
            //ROOT_NODE.ShowAdResultDialog();
        }
    }



    //---------------  打开一些通用功能界面  --------------------

    /**显示官职详情界面 */
    showOfficalLayer(officalIds: number[], bSave:boolean=false, callback?:Function){
        if(officalIds.length > 0){
            let layer = GameMgr.showLayer(this.pfOfficalLayer);
            layer.getComponent(OfficalLayer).initOfficalByIds(officalIds, bSave, callback);
        }else{   
            cc.log("没有新官职")
            if(callback){ 
                callback();
            }
        }
    }

    /**显示武将来投界面 */
    showGeneralJoinLayer(generalIds: number[], bSave:boolean=false, callback?:Function){
        if(generalIds.length > 0){
            let layer = GameMgr.showLayer(this.pfGeneralJoin);
            layer.getComponent(GeneralJoin).initGeneralByIds(generalIds, bSave, callback);
        }else{   
            cc.log("没有新武将")
            if(callback){ 
                callback();
            }
        }
    }

    /** 打开任务奖励领取界面 */
    openTaskRewardsLayer(storyConf: st_story_info){
        //cc.log("openTaskRewardsLayer(), 任务奖励 storyConf = "+JSON.stringify(storyConf));
        if(storyConf == null || storyConf == undefined){
            return;
        }

        let rewards: Array<ItemInfo> = GameMgr.getItemArrByKeyVal(storyConf.rewards);
        if(rewards.length > 0){
            let layer = GameMgr.showLayer(ROOT_NODE.pfReward);
            layer.getComponent(RewardLayer).showRewardList(rewards, "剧情任务奖励", ()=>{
                if(storyConf.type > 0){ 
                    MyUserMgr.updateTaskState(MyUserData.TaskId, TaskState.Over); 
                }
            });
        }else{   
            cc.log("没有任务奖励")
            if(storyConf.type > 0){ 
                //任务状态 0未完成，1对话完成，2完成未领取，2已领取
                MyUserMgr.updateTaskState(MyUserData.TaskId, TaskState.Over); 
            }
        }
    }

    /** 打开武将界面 tabIdx =0招募 1升级 2技能, generalId指定武将 */
    openGeneralLayer(tabIdx: number=0, generalId?: string){
        cc.log("openGeneralLayer 打开武将界面 tabIdx = "+tabIdx+"; generalId = "+generalId)
        let mainScene = GameMgr.getMainScene();
        if(mainScene){
            let layer = GameMgr.showLayer(mainScene.pfGeneralLayer);
            layer.getComponent(GeneralLayer).showGeneralInfoByTab(tabIdx, generalId);
        }
    }


    /**任务战斗准备 */
    openFightByTask(taskConf: st_story_info){
        if(taskConf && taskConf.battleId > 0){  
            // let layer = GameMgr.showLayer(mainScene.pfFightReady);  //战斗选将准备界面
            // layer.getComponent(FightReady).initBattleInfo(taskConf.battleId);
        }
    }


}
