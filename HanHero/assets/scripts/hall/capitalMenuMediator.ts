
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 17:09:33
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-17 16:12:36
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
import StoryLayer from './storyLayer';
import ComTop from '../comnode/comTop';
import CapitalCommand from '../puremvc/capitalCommand';
import GeneralLayer from './generalLayer';


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
    dateTime: cc.Label = null   //年月
    lvLabel: cc.Label = null   //主角等级

    radioButton: cc.Toggle[] = [];     //福利, 武将, 天下/主城, 城池, 政务

    public get capitalProxy(): CapitalProxy {
        return <CapitalProxy><any>(this.facade.retrieveProxy(CapitalProxy.NAME));
    }

    public get capitalScene(): CapitalScene {
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
            CapitalCommand.E_ON_RemoveBundleLayer,
            PlayerCommand.E_ON_UpdateTaskState,
            CapitalCommand.E_ON_GeneralRecruit,
            CapitalCommand.E_ON_ShowHallMidTab
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
                if (notifier === SceneState.Capical_InitOver) {
                    this.initBtnClickListener()
                    this.initMenuUI()   //初始化数据UI显示
                }
                break;
            case CapitalCommand.E_ON_RemoveBundleLayer:   //通知移除一些特定Bundle界面资源
                LoaderMgr.removeBundleAllRes(notifier);
                break;
            case PlayerCommand.E_ON_UpdateTaskState:   //任务状态更新
                this.updateTaskInfo();   //初始化或更新任务
                break;
            case CapitalCommand.E_ON_GeneralRecruit:   //通知部曲招募
                this.showGeneralUnitLayer();  //打开武将部曲界面
                break;
            case CapitalCommand.E_ON_ShowHallMidTab:  //通知显示大厅底部中间页签
                if (this.radioButton && this.radioButton.length > 0) {
                    this.radioButton[2].check();   //选中指定标签 //福利, 武将, 天下/主城, 城池, 政务
                }
                break;
            default:
        }
    }

    /**
     * 界面预处理
     */
    private initView() {
        //cc.log("CapitalMenuMediator initView")
        this.headNode = UI.find(this.capitalScene.menuNode, "headNode")   //玩家信息
        this.head = UI.find(this.headNode, "head") //头像
        this.taskNode = UI.find(this.capitalScene.menuNode, "taskNode")  //任务栏
        this.taskReward = UI.find(this.taskNode, "taskReward")   //任务奖励领取
        this.taskTitleLabel = UI.find(this.taskNode, "taskTitle").getComponent(cc.Label) //任务章节
        this.taskNameLabel = UI.find(this.taskNode, "taskName").getComponent(cc.Label)  //任务名称
        this.taskDescLabel = UI.find(this.taskNode, "taskDesc").getComponent(cc.Label)  //任务描述

        this.comTop = UI.find(this.capitalScene.menuNode, "comTop")   //通用金币粮草栏
        let tsComp = this.comTop.getComponent(ComTop)
        if (!tsComp) {
            tsComp = this.comTop.addComponent(ComTop)
        }
        this.lineTimeLabel = UI.find(this.headNode, "lineTime").getComponent(cc.Label)  //在线时长
        this.dateTime = UI.find(this.headNode, "dateTime").getComponent(cc.Label)   //年月
        this.lvLabel = UI.find(this.headNode, "lv").getComponent(cc.Label)  //主角等级

        let tabNode = UI.find(this.capitalScene.menuNode, "bottom").getComponent(cc.ToggleContainer)
        this.radioButton = tabNode.toggleItems;   //福利, 武将, 天下/主城, 城池, 政务
    }

    /**
    * 初始化数据UI显示
    */
    private initMenuUI() {
        this.updateRoleLvLabel();  //更新主角等级

        this.updateTaskInfo();   //初始化或更新任务

        this.showLineTime();   //显示在线时长
        this.viewComponent.unschedule(this.showLineTime.bind(this));
        this.viewComponent.schedule(this.showLineTime.bind(this), 1);

        //默认显示中间的“天下/主城”
        this.radioButton[2].check();   //选中指定标签 //福利, 武将, 天下/主城, 城池, 政务
    }

    /**
    * 初始化按钮等点击事件监听
    */
    private initBtnClickListener() {
        //cc.log("CapitalMenuMediator initBtnClickListener 初始化按钮等点击事件监听")
        let shareBtn = UI.find(this.capitalScene.menuNode, "shareBtn")   //分享
        UI.on_click(shareBtn, this.onMenuBtnClick.bind(this, "share"))

        UI.on_click(this.head, this.onMenuBtnClick.bind(this, "head"))  //头像
        UI.on_click(this.taskNode, this.onMenuBtnClick.bind(this, "task"))  //任务栏

        let bottom = UI.find(this.capitalScene.menuNode, "bottom")
        let welfareBtn = UI.find(bottom, "welfareBtn")   //福利
        let generalBtn = UI.find(bottom, "generalBtn")   //武将
        let mapBtn = UI.find(bottom, "mapBtn")    //天下/主城
        let cityBtn = UI.find(bottom, "cityBtn")    //城池
        let eventBtn = UI.find(bottom, "eventBtn")   //政务

        UI.on_click(welfareBtn, this.onMenuBtnClick.bind(this, "welfare"))  //福利
        UI.on_click(generalBtn, this.onMenuBtnClick.bind(this, "general"))   //武将
        UI.on_click(mapBtn, this.onMenuBtnClick.bind(this, "map"))   //天下/主城
        UI.on_click(cityBtn, this.onMenuBtnClick.bind(this, "city"))  //城池
        UI.on_click(eventBtn, this.onMenuBtnClick.bind(this, "event"))  //政务
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
                //this.handleTaskOptAfterTalk();   //根据任务的具体类型，在对话完毕后，处理具体操作
                this.showStoryLayer();
                break;
            case "share":    //分享
                break;
            case "welfare":    //福利
                break;
            case "general":    //武将
                this.showGeneralUnitLayer();  //打开武将部曲界面
                break;
            case "map":   //天下/主城
                //LoaderMgr.loadScene("mapScene");  //进入地图场景
                LoaderMgr.transitionScene("mapScene", "crop-circle");
                break;
            case "city":    //城池
                break;
            case "event":     //政务
                break;
            default:
        }
    }

    /**
     * 打开武将部曲界面
     * @param tabIdx =0招募 1升级 2技能
     */
    private showGeneralUnitLayer(tabIdx: number = 0, generalId?: number) {
        LoaderMgr.showBundleLayer('hall', 'ui/generalLayer', null, (layer) => {
            let tsComp = layer.getComponent(GeneralLayer)
            if (!tsComp) {
                tsComp = layer.addComponent(GeneralLayer)
            }
            tsComp.showGeneralInfoByTab(tabIdx, generalId);
        });
    }


    /**
    * 初始化或更新任务
    */
    private updateTaskInfo() {
        GameMgr.setGameCurTask(null);  //当前任务配置
        this.taskReward.active = false; //任务奖励领取
        let taskConf = CfgMgr.getTaskConf(MyUserData.TaskId);
        //cc.log("updateTaskInfo 初始化或更新任务 MyUserData.TaskState = " + MyUserData.TaskState + "; taskConf = " + JSON.stringify(taskConf))
        if (taskConf) {
            GameMgr.setGameCurTask(taskConf);  //当前任务配置

            this.taskTitleLabel.string = `第${taskConf.chapterId}章`  //任务章节
            let level = `第${taskConf.id % 100}节 `
            this.taskNameLabel.string = level + taskConf.name;  //任务名称
            this.taskDescLabel.string = taskConf.desc;  //任务描述

            this.handleTaskOptAfterTalk();  //根据任务的具体类型，在对话完毕后，处理具体操作
        }

        if (MyUserData.TaskId > 1002) {   //1002选择县城, 1003就任县令
            this.capitalScene.walkBg.active = false;  //新手县令赴任背景
        } else {
            this.capitalScene.walkBg.active = true;  //新手县令赴任背景
        }
    }

    /**
    * 打开任务奖励领取界面
    */
    private openTaskRewardsLayer(storyConf: st_story_info) {
        //cc.log("openTaskRewardsLayer(), 任务奖励 storyConf = "+JSON.stringify(storyConf));
        if (storyConf == null || storyConf == undefined) {
            return;
        }

        let rewards: Array<ItemInfo> = CfgMgr.getItemArrByKeyVal(storyConf.rewards);
        if (rewards.length > 0) {
            LoaderMgr.showRewardLayer(rewards, "剧情任务奖励", () => {
                if (storyConf.type > 0) {
                    MyUserMgr.updateTaskState(storyConf.id, TaskState.Over);
                }
            });
        } else {
            cc.log("没有任务奖励")
            if (storyConf.type > 0) {
                //任务状态 0未完成，1对话完成，2完成未领取，3已领取
                MyUserMgr.updateTaskState(storyConf.id, TaskState.Over);
            }
        }
    }

    private showStoryLayer() {
        let storyConf: st_story_info = GameMgr.curTaskConf;
        LoaderMgr.showBundleLayer('hall', 'ui/storyLayer', null, (layer) => {
            let tsComp = layer.getComponent(StoryLayer)
            if (!tsComp) {
                tsComp = layer.addComponent(StoryLayer)
            }
            tsComp.initStoryConf(storyConf);
        });
    }

    /**
    * 根据任务的具体类型，在对话完毕后，处理具体操作
    */
    private handleTaskOptAfterTalk() {
        let storyConf: st_story_info = GameMgr.curTaskConf;
        //cc.log("handleTaskOptAfterTalk 对话完毕后的任务操作 storyConf = " + JSON.stringify(storyConf));
        //任务状态 0未完成，1对话完成，2完成未领取，3已领取
        if (MyUserData.TaskState === TaskState.Reward) {   //已完成未领取
            this.taskReward.active = true;
            //ROOT_NODE.showTipsText(`任务${taskConf.name}奖励可领取`);
            this.openTaskRewardsLayer(GameMgr.curTaskConf);
        } else if (MyUserData.TaskState === TaskState.Ready) {   //任务初始情况，自动弹开对话
            this.showStoryLayer();  //任务宣读(第一阶段）完毕 会在 GameMgr.handleStoryNextOpt 中处理后续操作
        } else if (MyUserData.TaskState === TaskState.Finish) {   //对话完成
            GameMgr.handleStoryTalkNext(storyConf);   //处理剧情对话展示后的操作
        }
    }

    //更新主角等级
    private updateRoleLvLabel(oldRoleLv: number = 0) {
        this.lvLabel.string = MyUserData.roleLv.toString();
        if (MyUserData.roleLv > 1) {
            if (oldRoleLv > 0) {   //主角等级提升
                ROOT_NODE.showTipsText("主角等级提升!");
            } else {   //升官
                ROOT_NODE.showTipsText("主角官职提升!");
            }
        }
    }

    //显示在线时长
    private showLineTime() {
        if (this.lineTimeLabel) {
            let sec = Math.floor(MyUserData.totalLineTime % 60);   //总的在线时长  秒数而非时间戳
            let tempTime = Math.floor(MyUserData.totalLineTime / 60);
            let min = Math.floor(tempTime % 60);
            tempTime = Math.floor(tempTime / 60);
            let hour = Math.floor(tempTime % 60);
            tempTime = Math.floor(tempTime / 24);
            let day = Math.floor(tempTime % 24);
            if (day > 0) {
                this.lineTimeLabel.string = day + ":" + hour + ":" + min + ":" + sec;
            } else {
                if (hour > 0) {
                    this.lineTimeLabel.string = hour + ":" + min + ":" + sec;
                } else {
                    this.lineTimeLabel.string = min + ":" + sec;
                }
            }
        }
        if (this.dateTime) {
            this.dateTime.string = MyUserMgr.getGameDateStr();
        }
    }
}
