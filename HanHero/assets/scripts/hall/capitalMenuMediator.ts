
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 17:09:33
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 17:58:07
 * @Description: 
 */

import UI from '../util/ui';
import CapitalProxy from '../puremvc/CapitalProxy';
import CapitalScene from './capitalScene';
import CommonCommand from '../puremvc/commonCommand';
import PlayerCommand from '../puremvc/playerCommand';
import { SceneState } from '../puremvc/commonProxy';
import { LoaderMgr } from '../manager/LoaderManager';
import { MyUserData, MyUserMgr } from "../manager/MyUserData";
import { ROOT_NODE } from "../login/rootNode";
import { st_story_info, ItemInfo, CfgMgr } from '../manager/ConfigManager';
import { TaskState, TaskType } from "../manager/Enum";
import { GameMgr } from "../manager/GameManager";
import FuncUtil from "../util/FuncUtil";
import StoryLayer from './storyLayer';
import NickEditLayer from './nickEditLayer';
import SelCityLayer from './selCityLayer';


//大厅按钮界面相关中介

export default class CapitalMenuMediator extends puremvc.Mediator implements puremvc.IMediator {

    public static NAME: string = "CapitalMenuMediator";

    headNode: cc.Node = null   //玩家信息
    head: cc.Node = null  //头像
    taskNode: cc.Node = null   //任务栏
    taskReward: cc.Node = null  //任务奖励领取
    taskTitleLabel: cc.Label = null;  //任务章节
    taskNameLabel: cc.Label = null;  //任务名称
    taskDescLabel: cc.Label = null;  //任务描述

    comTop: cc.Node = null //通用金币粮草栏
    lineTimeLabel: cc.Label = null   //在线时长
    lvLabel: cc.Label = null   //主角等级

    welfareBtn: cc.Node = null   //福利
    generalBtn: cc.Node = null   //武将
    mapBtn: cc.Node = null    //世界
    cityBtn: cc.Node = null    //城池
    eventBtn: cc.Node = null   //政务

    public get capitalProxy(): CapitalProxy {
        return <CapitalProxy><any>(this.facade.retrieveProxy(CapitalProxy.NAME));
    }

    public get capitalLayer(): CapitalScene {
        return <CapitalScene><any>(this.viewComponent);
    }

    public constructor(viewComponent: any) {
        super(CapitalMenuMediator.NAME, viewComponent);
    }

    /**
     * 界面中介创建成功后的回调处理
     */
    public onRegister(): void {
        this.initView()
    }

    /**
     * 界面中介移除时的回调处理
     */
    public onRemove(): void {
    }

    /**
     * 注册界面相关的消息监听
     * @returns 
     */
    public listNotificationInterests(): Array<any> {
        return [
            CommonCommand.E_ON_CHANGE_SCENE_STATE,
            PlayerCommand.E_ON_UpdateTaskState
        ];
    }

    /**
     * 处理界面相关的消息
     * @param notification 
     */
    public handleNotification(notification: puremvc.INotification): void {
        var notifier: any = notification.getBody();
        cc.log("CapitalMenuMediator handleNotification:" + notification.getName())
        switch (notification.getName()) {
            case CommonCommand.E_ON_CHANGE_SCENE_STATE:
                if(notifier === SceneState.Capical_InitOver){
                    this.initBtnClickListener()
                    this.initMenuUI()   //初始化数据UI显示
                }
                break;
            case PlayerCommand.E_ON_UpdateTaskState:   //任务状态更新
                this.updateTaskInfo();   //初始化或更新任务
                break;
            default:
        }
    }

    /**
     * 界面预处理
     */
    private initView() {
        cc.log("CapitalMenuMediator initView")
        this.headNode = UI.find(this.capitalLayer.menuNode, "headNode")   //玩家信息
        this.head = UI.find(this.headNode, "head") //头像
        this.taskNode = UI.find(this.capitalLayer.menuNode, "taskNode")  //任务栏
        this.taskReward = UI.find(this.taskNode, "taskReward")   //任务奖励领取
        this.taskTitleLabel = UI.find(this.taskNode, "taskTitle").getComponent(cc.Label) //任务章节
        this.taskNameLabel = UI.find(this.taskNode, "taskName").getComponent(cc.Label)  //任务名称
        this.taskDescLabel = UI.find(this.taskNode, "taskDesc").getComponent(cc.Label)  //任务描述

        this.comTop = UI.find(this.capitalLayer.menuNode, "comTop")   //通用金币粮草栏
        this.lineTimeLabel = UI.find(this.headNode, "lineTime").getComponent(cc.Label)  //在线时长
        this.lvLabel = UI.find(this.headNode, "lv").getComponent(cc.Label)  //主角等级

        this.welfareBtn = UI.find(this.capitalLayer.menuNode, "welfareBtn")   //福利
        this.generalBtn = UI.find(this.capitalLayer.menuNode, "generalBtn")   //武将
        this.mapBtn = UI.find(this.capitalLayer.menuNode, "mapBtn")    //世界
        this.cityBtn = UI.find(this.capitalLayer.menuNode, "cityBtn")    //城池
        this.eventBtn = UI.find(this.capitalLayer.menuNode, "eventBtn")   //政务

    }

     /**
     * 初始化按钮等点击事件监听
     */
    private initBtnClickListener() {
        cc.log("CapitalMenuMediator initBtnClickListener 初始化按钮等点击事件监听")
        let shareBtn = UI.find(this.capitalLayer.menuNode, "shareBtn")   //分享
        UI.on_click(shareBtn, this.onMenuBtnClick.bind(this, "share"))
        let goldIcon = UI.find(this.comTop, "goldIcon")    //金币增加
        UI.on_click(goldIcon, this.onMenuBtnClick.bind(this, "gold"))
        let foodIcon = UI.find(this.comTop, "foodIcon")   //粮草增加
        UI.on_click(foodIcon, this.onMenuBtnClick.bind(this, "food"))

        UI.on_click(this.head, this.onMenuBtnClick.bind(this, "head"))  //头像
        UI.on_click(this.taskNode, this.onMenuBtnClick.bind(this, "task"))  //任务栏

        UI.on_click(this.welfareBtn, this.onMenuBtnClick.bind(this, "welfare"))  //福利
        UI.on_click(this.generalBtn, this.onMenuBtnClick.bind(this, "general"))   //武将
        UI.on_click(this.mapBtn, this.onMenuBtnClick.bind(this, "map"))   //世界
        UI.on_click(this.cityBtn, this.onMenuBtnClick.bind(this, "city"))  //城池
        UI.on_click(this.eventBtn, this.onMenuBtnClick.bind(this, "event"))  //政务
    }

     /**
     * 点击事件处理
     */
    public onMenuBtnClick(btntype: string) {
        cc.log("onMenuBtnClick btntype = " + btntype)
        switch (btntype) {
            case "head":  //头像
                break;
            case "task":   //任务栏
                this.handleTaskOptAfterTalk();   //根据任务的具体类型，在对话完毕后，处理具体操作
                break;
            case "share":    //分享
                break;
            case "gold":    //金币增加
                break;
            case "food":  //粮草增加
                break;
            case "welfare":    //福利
                break;
            case "general":    //武将
                break;
            case "map":    //世界
                LoaderMgr.loadScene("mapScene");  //进入地图场景
                break;
            case "city":    //城池
                break;
            case "event":     //政务
                break;
            default:
        }
    }

     /**
     * 初始化数据UI显示
     */
    private initMenuUI(){
        this.updateRoleLvLabel();  //更新主角等级

        this.updateTaskInfo();   //初始化或更新任务

        this.showLineTime();   //显示在线时长
        this.viewComponent.schedule(this.showLineTime, 1);
    }


     /**
     * 初始化或更新任务
     */
    private updateTaskInfo(){
        GameMgr.setGameCurTask(null);  //当前任务配置
        this.taskReward.active = false; //任务奖励领取
        let taskConf = CfgMgr.getTaskConf(MyUserData.TaskId);
        cc.log("updateTaskInfo 初始化或更新任务 MyUserData.TaskState = "+MyUserData.TaskState+"; taskConf = "+JSON.stringify(taskConf))
        if(taskConf){
            GameMgr.setGameCurTask(taskConf);  //当前任务配置

            this.taskTitleLabel.string = `第${taskConf.chapterId}章`  //任务章节
            let level = `第${taskConf.id % 100}节 `
            this.taskNameLabel.string = level + taskConf.name;  //任务名称
            this.taskDescLabel.string = taskConf.desc;  //任务描述

            this.handleTaskOptAfterTalk();  //根据任务的具体类型，在对话完毕后，处理具体操作
        }
    }

     /**
     * 打开任务奖励领取界面
     */  
    private openTaskRewardsLayer(storyConf: st_story_info){
        //cc.log("openTaskRewardsLayer(), 任务奖励 storyConf = "+JSON.stringify(storyConf));
        if(storyConf == null || storyConf == undefined){
            return;
        }

        let rewards: Array<ItemInfo> = FuncUtil.getItemArrByKeyVal(storyConf.rewards);
        if(rewards.length > 0){
            LoaderMgr.showRewardLayer(rewards, "剧情任务奖励", ()=>{
                if(storyConf.type > 0){ 
                    MyUserMgr.updateTaskState(storyConf.id, TaskState.Over); 
                }
            });
        }else{   
            cc.log("没有任务奖励")
            if(storyConf.type > 0){ 
                //任务状态 0未完成，1对话完成，2完成未领取，3已领取
                MyUserMgr.updateTaskState(storyConf.id, TaskState.Over); 
            }
        }
    }

     /**
     * 根据任务的具体类型，在对话完毕后，处理具体操作
     */
    private handleTaskOptAfterTalk(){
        let storyConf: st_story_info = GameMgr.curTaskConf;
        cc.log("handleTaskOptAfterTalk 对话完毕后的任务操作 storyConf = "+JSON.stringify(storyConf));
        //任务状态 0未完成，1对话完成，2完成未领取，3已领取
        if(MyUserData.TaskState == TaskState.Reward){   //已完成未领取
            this.taskReward.active = true;
            //ROOT_NODE.showTipsText(`任务${taskConf.name}奖励可领取`);
            this.openTaskRewardsLayer(GameMgr.curTaskConf);
        }else if(MyUserData.TaskState == TaskState.Ready){   //任务初始情况，自动弹开对话
            LoaderMgr.showBundleLayer('hall', 'ui/storyLayer', null, (layer)=>{
                let tsComp = layer.getComponent(StoryLayer)
                if(!tsComp){
                    tsComp = layer.addComponent(StoryLayer)
                }
                tsComp.initStoryConf(storyConf);
            });   //任务宣读(第一阶段）完毕 会在 GameMgr.handleStoryShowOver 中处理后续操作
        }else if(MyUserData.TaskState == TaskState.Finish){   //对话完成
            //任务类型 1 剧情 2战斗 3招募 4封官拜将 5主城建设 6招武将 7驻守 8技能 9攻城略地
            cc.log("任务对话完成，后续操作 storyConf.type = "+storyConf.type)
            switch(storyConf.type){ 
                case TaskType.Story:  //剧情
                    if(storyConf.id === 1001){   //创建昵称
                        LoaderMgr.showBundleLayer('ui_nickEditLayer', 'nickEditLayer', null, (layer)=>{
                            let tsComp = layer.getComponent(NickEditLayer)
                            if(!tsComp){
                                tsComp = layer.addComponent(NickEditLayer)
                            }
                            tsComp.setStoryConf(storyConf);
                        }); 
                    }if(storyConf.id === 1002){   //选择县城
                        LoaderMgr.showBundleLayer('ui_selCityLayer', 'selCityLayer', null, (layer)=>{
                            let tsComp = layer.getComponent(SelCityLayer)
                            if(!tsComp){
                                tsComp = layer.addComponent(SelCityLayer)
                            }
                            tsComp.setStoryConf(storyConf);
                        }); 
                    }
                    break;
                case TaskType.Fight:  //战斗
                    //this.openFightByTask(storyConf);   //战斗选将准备界面
                    break;
                case TaskType.Recruit:  // 招募
                    //this.openGeneralLayer(0);   //武将招募
                    break;
                case TaskType.Offical:  //封官拜将
                    break;
                case TaskType.Capital:  //主城建设
                    break;
                case TaskType.General:   //招武将
                    break;
                case TaskType.Garrison:  //驻守
                    break;
                case TaskType.Skill:  //技能
                    break;
                case TaskType.Belle:  //后宅美姬
                    break;
            }
        }
    }

    //更新主角等级
    private updateRoleLvLabel(oldRoleLv: number=0){
        this.lvLabel.string = MyUserData.roleLv.toString();
        if(MyUserData.roleLv > 1){
            if(oldRoleLv > 0){   //主角等级提升
                ROOT_NODE.showTipsText("主角等级提升!");
            }else{   //升官
                ROOT_NODE.showTipsText("主角官职提升!");
            }
        }
    }

    //显示在线时长
    private showLineTime(){ 
        if(this.lineTimeLabel){
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
    }
}
