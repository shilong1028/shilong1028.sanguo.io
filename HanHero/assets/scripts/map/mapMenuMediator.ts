
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 17:09:33
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-17 17:26:11
 * @Description: 
 */

import UI from '../util/ui';
import CommonCommand from '../puremvc/commonCommand';
import { SceneState } from '../puremvc/commonProxy';
import { LoaderMgr } from '../manager/LoaderManager';
import { MyUserData, MyUserMgr } from "../manager/MyUserData";
import { ROOT_NODE } from "../login/rootNode";
import ComTop from '../comnode/comTop';
import MapProxy from '../puremvc/MapProxy';
import MapScene from './mapScene';


//地图按钮界面相关中介

export default class MapMenuMediator extends puremvc.Mediator implements puremvc.IMediator {

    public static NAME: string = "MapMenuMediator";

    headNode: cc.Node = null   //玩家信息
    head: cc.Node = null  //头像
    lineTimeLabel: cc.Label = null   //在线时长
    dateTime: cc.Label = null   //年月
    lvLabel: cc.Label = null   //主角等级
    comTop: cc.Node = null //通用金币粮草栏

    public get mapProxy(): MapProxy {
        return <MapProxy><any>(this.facade.retrieveProxy(MapProxy.NAME));
    }

    public get mapScene(): MapScene {
        return <MapScene><any>(this.viewComponent);
    }

    public constructor(viewComponent: any) {
        super(MapMenuMediator.NAME, viewComponent);
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
            CommonCommand.E_ON_CHANGE_SCENE_STATE
        ];
    }

    /**
     * 处理界面相关的消息
     * @param notification 
     */
    public handleNotification(notification: puremvc.INotification): void {
        var notifier: any = notification.getBody();
        //cc.log("MapMenuMediator handleNotification:" + notification.getName())
        switch (notification.getName()) {
            case CommonCommand.E_ON_CHANGE_SCENE_STATE:
                if (notifier === SceneState.Map_InitOver) {
                    this.initBtnClickListener()
                    this.initMenuUI()   //初始化数据UI显示
                }
                break;
            default:
        }
    }

    /**
     * 界面预处理
     */
    private initView() {
        //cc.log("MapMenuMediator initView")
        this.headNode = UI.find(this.mapScene.menuNode, "headNode")   //玩家信息
        this.head = UI.find(this.headNode, "head") //头像
        this.lineTimeLabel = UI.find(this.headNode, "lineTime").getComponent(cc.Label)  //在线时长
        this.dateTime = UI.find(this.headNode, "dateTime").getComponent(cc.Label)   //年月
        this.lvLabel = UI.find(this.headNode, "lv").getComponent(cc.Label)  //主角等级

        this.comTop = UI.find(this.mapScene.menuNode, "comTop")   //通用金币粮草栏
        let tsComp = this.comTop.getComponent(ComTop)
        if (!tsComp) {
            tsComp = this.comTop.addComponent(ComTop)
        }
    }

    /**
    * 初始化数据UI显示
    */
    private initMenuUI() {
        this.updateRoleLvLabel();  //更新主角等级
        this.showLineTime();   //显示在线时长
        this.viewComponent.unschedule(this.showLineTime.bind(this));
        this.viewComponent.schedule(this.showLineTime.bind(this), 1);
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

    /**
    * 初始化按钮等点击事件监听
    */
    private initBtnClickListener() {
        cc.log("MapMenuMediator initBtnClickListener 初始化按钮等点击事件监听")
        let shareBtn = UI.find(this.mapScene.menuNode, "shareBtn")   //分享
        UI.on_btn_click(shareBtn, this.onMenuBtnClick.bind(this, "share"))

        let backBtn = UI.find(this.mapScene.menuNode, "backBtn")   //返回主城大厅
        UI.on_btn_click(backBtn, this.onMenuBtnClick.bind(this, "back"))

        UI.on_click(this.head, this.onMenuBtnClick.bind(this, "head"))  //头像
    }

    /**
    * 点击事件处理
    */
    public onMenuBtnClick(btntype: string) {
        cc.log("onMenuBtnClick btntype = " + btntype)
        switch (btntype) {
            case "head":  //头像
                break;
            case "share":    //分享
                break;
            case "back":   //返回主城大厅
                //LoaderMgr.loadScene("capitalScene");  //进入主场景
                LoaderMgr.transitionScene("capitalScene", "grid-flip");
                break;
            default:
        }
    }


}
