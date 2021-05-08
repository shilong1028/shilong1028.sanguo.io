
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 17:09:33
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 18:06:24
 * @Description: 
 */

import UI from '../util/ui';
import CapitalScene from './capitalScene';
import CapitalProxy from '../puremvc/CapitalProxy';
import { FunMgr } from '../manager/FuncManager';
import CommonCommand from '../puremvc/commonCommand';
import { SceneState } from '../puremvc/commonProxy';
import Builder from './builder';
import { BuilderNameArr } from '../manager/Enum';

//大厅建筑界面相关中介

export default class CapitalBuilderMediator extends puremvc.Mediator implements puremvc.IMediator {

    public static NAME: string = "CapitalBuilderMediator";

    touchBeginPos: cc.Vec2 = null;  //触摸起点
    MapLimitPos: cc.Vec2 = cc.v2(1000, 667);  //地图位置限制(尺寸大小的一半)
    capital_bg: cc.Node = null   //城池底图

    public get capitalProxy(): CapitalProxy {
        return <CapitalProxy><any>(this.facade.retrieveProxy(CapitalProxy.NAME));
    }

    public get capitalLayer(): CapitalScene {
        return <CapitalScene><any>(this.viewComponent);
    }

    public constructor(viewComponent: any) {
        super(CapitalBuilderMediator.NAME, viewComponent);
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
            // LoginProxy.E_LOGIN_RESULT
        ];
    }

    /**
     * 处理界面相关的消息
     * @param notification 
     */
    public handleNotification(notification: puremvc.INotification): void {
        var notifier: any = notification.getBody();
        cc.log("LoginLayerMediator handleNotification:" + notification.getName())
        switch (notification.getName()) {
            case CommonCommand.E_ON_CHANGE_SCENE_STATE:
                if(notifier === SceneState.Capical_InitOver){
                    this.initBtnClickListener()
                }
                break;
            default:
        }
    }

    /**
     * 界面预处理
     */
    private initView() {
        cc.log("CapitalMenuMediator initView")
        this.MapLimitPos = cc.v2((this.capitalLayer.mapNode.width-cc.winSize.width)/2, 
            (this.capitalLayer.mapNode.height-cc.winSize.height)/2);  //地图位置限制(尺寸大小的一半)

        this.capital_bg = UI.find(this.capitalLayer.mapNode, "capital_bg")   //城池底图

        let builds = UI.find(this.capitalLayer.mapNode, "builds")
        //主城各种建筑初始化
        for(let i=0; i<BuilderNameArr.length; i++){
            let builder_name = BuilderNameArr[i]
            let builder = UI.find(builds, builder_name) 
            if(builder){
                let tsComp = builder.getComponent(Builder)
                if(!tsComp){
                    tsComp = builder.addComponent(Builder)
                }
                tsComp.initBuilder(builder_name)
            }else{
                cc.log("cannot find "+builder_name)
            }

        } 
    }

    /**
     * 初始化按钮等点击事件监听
     */
    private initBtnClickListener() {
        cc.log("initBtnClickListener 初始化按钮等点击事件监听")
        this.capital_bg.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this), this, true);
        this.capital_bg.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this), this);
        this.capital_bg.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this), this);
        this.capital_bg.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd.bind(this), this);
    }

    touchStart(event: cc.Touch) {
        this.touchBeginPos = event.getLocation();
    }

    touchEnd(event: cc.Touch) {
        this.touchBeginPos = null;
    }

    /**
     * 移动城池底图
     * @param event 
     */
    touchMove(event: cc.Touch) {
        if (this.touchBeginPos) {
            let pos = event.getLocation();
            let offset = pos.sub(this.touchBeginPos);
            this.touchBeginPos = pos;

            this.capitalLayer.mapNode.stopAllActions();

            let mapPos = this.preCheckMapDestPos(offset);   //预处理地图将要移动的目标坐标，放置移动过大地图出现黑边
            this.capitalLayer.mapNode.setPosition(mapPos);
        }
    }

    /**
     * 预处理地图将要移动的目标坐标，防止移动过大地图出现黑边
     * @param offset 
     * @returns 
     */
    preCheckMapDestPos(offset: cc.Vec2) {
        let destPos = this.capitalLayer.mapNode.position.add(FunMgr.v2Tov3(offset));
        if (destPos.x > this.MapLimitPos.x) {
            destPos.x = this.MapLimitPos.x;
        } else if (destPos.x < -this.MapLimitPos.x) {
            destPos.x = -this.MapLimitPos.x;
        }
        if (destPos.y > this.MapLimitPos.y) {
            destPos.y = this.MapLimitPos.y;
        } else if (destPos.y < -this.MapLimitPos.y) {
            destPos.y = -this.MapLimitPos.y;
        }
        return destPos;
    }


}
