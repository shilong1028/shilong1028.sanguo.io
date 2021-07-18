
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 17:09:33
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-17 16:12:11
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
import CapitalCommand from '../puremvc/capitalCommand';

//大厅建筑界面相关中介

export default class CapitalBuilderMediator extends puremvc.Mediator implements puremvc.IMediator {

    public static NAME: string = "CapitalBuilderMediator";

    touchBeginPos: cc.Vec2 = null;  //触摸起点
    MapLimitPos: cc.Vec2 = cc.v2(1000, 667);  //地图位置限制(尺寸大小的一半)
    capital_bg: cc.Node = null   //城池底图
    handNode: cc.Node = null;   //指引建筑的手指
    buildsNode: cc.Node = null;   //建筑总父节点

    public get capitalProxy(): CapitalProxy {
        return <CapitalProxy><any>(this.facade.retrieveProxy(CapitalProxy.NAME));
    }

    public get capitalScene(): CapitalScene {
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
            CapitalCommand.E_ON_BuilderHand,
            CapitalCommand.E_ON_TeaseBeauty
        ];
    }

    /**
     * 处理界面相关的消息
     * @param notification 
     */
    public handleNotification(notification: puremvc.INotification): void {
        var notifier: any = notification.getBody();
        cc.log("CapitalBuilderMediator handleNotification:" + notification.getName())
        switch (notification.getName()) {
            case CommonCommand.E_ON_CHANGE_SCENE_STATE:
                if (notifier === SceneState.Capical_InitOver) {
                    this.initBtnClickListener()
                }
                break;
            case CapitalCommand.E_ON_BuilderHand:   //通知显示或隐藏建筑手指
                this.showGuideBuilderHand(notifier);
                break;
            case CapitalCommand.E_ON_TeaseBeauty:   //通知挑逗美姬
                this.showGuideBuilderHand("residence");
                break;
            default:
        }
    }

    /**
     * 界面预处理
     */
    private initView() {
        //cc.log("CapitalMenuMediator initView")
        this.MapLimitPos = cc.v2((this.capitalScene.mapNode.width - cc.winSize.width) / 2,
            (this.capitalScene.mapNode.height - cc.winSize.height) / 2);  //地图位置限制(尺寸大小的一半)

        this.capital_bg = UI.find(this.capitalScene.mapNode, "capital_bg")   //城池底图
        this.handNode = UI.find(this.capitalScene.mapNode, "handSpr")   //指引建筑的手指
        this.handNode.active = false;
        this.buildsNode = UI.find(this.capitalScene.mapNode, "builds")  //建筑总父节点

        //主城各种建筑初始化
        for (let i = 0; i < BuilderNameArr.length; i++) {
            let builder_name = BuilderNameArr[i]
            let builder = UI.find(this.buildsNode, builder_name)
            if (builder) {
                let tsComp = builder.getComponent(Builder)
                if (!tsComp) {
                    tsComp = builder.addComponent(Builder)
                }
                tsComp.initBuilder(builder_name)
            } else {
                cc.log("cannot find " + builder_name)
            }

        }
    }

    /**
     * 初始化按钮等点击事件监听
     */
    private initBtnClickListener() {
        //cc.log("initBtnClickListener 初始化按钮等点击事件监听")
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

            this.capitalScene.mapNode.stopAllActions();

            let mapPos = this.preCheckMapDestPos(offset);   //预处理地图将要移动的目标坐标，放置移动过大地图出现黑边
            this.capitalScene.mapNode.setPosition(mapPos);
        }
    }

    /**
     * 预处理地图将要移动的目标坐标，防止移动过大地图出现黑边
     * @param offset 
     * @returns 
     */
    preCheckMapDestPos(offset: cc.Vec2) {
        let destPos = this.capitalScene.mapNode.position.add(FunMgr.v2Tov3(offset));
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

    /** 将地图移动到指定目标点
    */
    handleMapMoveByCityPos(builderPos: cc.Vec2, callback?: Function) {
        this.capitalScene.mapNode.stopAllActions();

        let midPos = this.capitalScene.mapNode.position.neg();    //当前视图中心在地图上的坐标
        let offset = midPos.sub(FunMgr.v2Tov3(builderPos));
        let destPos = this.preCheckMapDestPos(FunMgr.v3Tov2(offset));   //预处理地图将要移动的目标坐标，放置移动过大地图出现黑边
        let moveTime = destPos.sub(midPos).mag() / 1000;
        this.capitalScene.mapNode.runAction(cc.sequence(cc.moveTo(moveTime, FunMgr.v3Tov2(destPos)), cc.callFunc(function () {
            if (callback) {
                callback()
            }
        }.bind(this))));
    }

    /**
    * 显示建筑升级的引导手指
    */
    private showGuideBuilderHand(builder_name: string) {
        if (!this.buildsNode) {
            return;
        }
        if (!builder_name || builder_name.length === 0) {
            this.handNode.active = false;
            return;
        }
        let builder = UI.find(this.buildsNode, builder_name)
        if (builder) {
            this.handNode.setPosition(builder.getPosition())
            this.handNode.active = true;
            this.handNode.stopAllActions();
            this.handNode.scale = 1.2;
            this.handNode.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1.0), cc.scaleTo(0.3, 1.2))));

            this.handleMapMoveByCityPos(builder.getPosition());   //将地图移动到指定目标点
        }
    }
}
