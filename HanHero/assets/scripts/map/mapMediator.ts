
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 17:09:33
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-23 11:39:53
 * @Description: 
 */

import UI from '../util/ui';
import MapProxy from '../puremvc/MapProxy';
import MapScene from './mapScene';
import CommonCommand from '../puremvc/commonCommand';
import { SceneState } from '../puremvc/commonProxy';
import { LoaderMgr } from '../manager/LoaderManager';
import { FunMgr } from "../manager/FuncManager";
import { MapType } from "./base/MapType";
import MapData from "./base/MapData";
import MapLayer from "./layer/MapLayer";
import EntityLayer from "./layer/EntityLayer";
import Charactor from "./charactor/Charactor";
import RoadNode from "./road/RoadNode";
import IRoadSeeker from "./road/IRoadSeeker";
import MapRoadUtils from "./road/MapRoadUtils";
import AstarHoneycombRoadSeeker from "./road/AstarHoneycombRoadSeeker";
import AStarRoadSeeker from "./road/AStarRoadSeeker";
import Point from "./road/Point";

//大厅按钮界面相关中介

export default class MapMediator extends puremvc.Mediator implements puremvc.IMediator {

    public static NAME: string = "MapMediator";

    headNode: cc.Node = null   //玩家信息
    head: cc.Node = null  //头像
    taskNode: cc.Node = null   //任务栏
    comTop: cc.Node = null //通用金币粮草栏
    welfareBtn: cc.Node = null   //福利
    generalBtn: cc.Node = null   //武将
    mapBtn: cc.Node = null    //世界
    cityBtn: cc.Node = null    //城池
    eventBtn: cc.Node = null   //政务

    private _roadDic: { [key: string]: RoadNode } = {};
    private _roadSeeker: IRoadSeeker;
    private _mapData: MapData = null;

    public mapLayer: MapLayer = null;
    public entityLayer: EntityLayer = null;
    private player: Charactor = null;

    public get mapProxy(): MapProxy {
        return <MapProxy><any>(this.facade.retrieveProxy(MapProxy.NAME));
    }

    public get mapScene(): MapScene {
        return <MapScene><any>(this.viewComponent);
    }

    public constructor(viewComponent: any) {
        super(MapMediator.NAME, viewComponent);
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
        cc.log("MapMediator handleNotification:" + notification.getName())
        switch (notification.getName()) {
            case CommonCommand.E_ON_CHANGE_SCENE_STATE:
                if (notifier === SceneState.Map_InitOver) {
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
        cc.log("MapMediator initView")

        let mapLayerNode = UI.find(this.mapScene.mapNode, "mapLayer")
        this.mapLayer = mapLayerNode.getComponent(MapLayer)
        if (!this.mapLayer) {
            this.mapLayer = mapLayerNode.addComponent(MapLayer)
        }

        let entityLayer = UI.find(this.mapScene.mapNode, "entityLayer")
        let playerNode = UI.find(this.mapScene.mapNode, "player")
        this.player = playerNode.getComponent(Charactor)
        if (!this.player) {
            this.player = playerNode.addComponent(Charactor)
        }
        this.player.initPlayerModel(this, "10001");   //初始化玩家形象

        var mapName: string = "mapData"
        LoaderMgr.bundle_load("map", "res/data/" + mapName, cc.JsonAsset, (error: Error, res: cc.JsonAsset) => {
            if (!res.json) {
                cc.log("res.json is null, mapName = " + mapName);
                return
            }
            var mapData: MapData = res.json;
            LoaderMgr.bundle_load("map", "res/bg/" + mapData.bgName, cc.Texture2D, (error: Error, tex: cc.Texture2D) => {   //cc.SpriteFrame
                this.initMap(res.json, tex)
            });
        });
    }

    /**
     * 初始化按钮等点击事件监听
     */
    private initBtnClickListener() {
        cc.log("MapMediator initBtnClickListener 初始化按钮等点击事件监听")
        this.mapScene.mapNode.on(cc.Node.EventType.TOUCH_START, this.onMapMouseDown.bind(this), this);
    }

    /**
     * 初始化地图
     */
    private initMap(mapData: MapData, bgTex: cc.Texture2D) {
        cc.log("MapMediator initMap 初始化地图")
        this._mapData = mapData;

        MapRoadUtils.instance.updateMapInfo(mapData.mapWidth, mapData.mapHeight, mapData.nodeWidth, mapData.nodeHeight, mapData.type);

        this.mapLayer.init(mapData.mapWidth, mapData.mapHeight, 256, 256, bgTex);

        var len: number = mapData.roadDataArr.length;
        var len2: number = mapData.roadDataArr[0].length;

        var value: number = 0;
        var dx: number = 0;
        var dy: number = 0;

        for (var i: number = 0; i < len; i++) {
            for (var j: number = 0; j < len2; j++) {
                value = mapData.roadDataArr[i][j];
                dx = j;
                dy = i;
                var node: RoadNode = MapRoadUtils.instance.getNodeByDerect(dx, dy);
                node.value = value;
                this._roadDic[node.cx + "_" + node.cy] = node;
            }
        }

        if (mapData.type == MapType.honeycomb) {
            this._roadSeeker = new AstarHoneycombRoadSeeker(this._roadDic)
        } else {
            this._roadSeeker = new AStarRoadSeeker(this._roadDic);
        }

        this.mapScene.mapNode.width = this.mapLayer.width;
        this.mapScene.mapNode.height = this.mapLayer.height;
        this.mapScene.mapNode.x = -cc.winSize.width / 2;
        this.mapScene.mapNode.y = -cc.winSize.height / 2;

        this.player.node.x = cc.winSize.width - 100;
        this.player.node.y = cc.winSize.height / 2;

        this.setViewToPlayer();
    }

    /**
     * 将视野对准玩家
     */
    public setViewToPlayer(): void {
        this.setViewToPoint(this.player.node.x, this.player.node.y);
    }

    /**
     * 点击地图，移动玩家
    */
    public onMapMouseDown(event: cc.Event.EventTouch): void {
        //var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        var pos = this.mapScene.camera.node.position.add(FunMgr.v2Tov3(event.getLocation()));
        cc.log("onMapMouseDown pos = " + pos)
        this.movePlayer(pos.x, pos.y);

    }

    /**
     *移到玩家 
     * @param targetX 移动到的目标点x
     * @param targetY 移到到的目标点y
     * 
     */
    public movePlayer(targetX: number, targetY: number) {
        var startPoint: Point = MapRoadUtils.instance.getWorldPointByPixel(this.player.node.x, this.player.node.y);
        var targetPoint: Point = MapRoadUtils.instance.getWorldPointByPixel(targetX, targetY);

        var startNode: RoadNode = this._roadDic[startPoint.x + "_" + startPoint.y];
        var targetNode: RoadNode = this._roadDic[targetPoint.x + "_" + targetPoint.y];

        var roadNodeArr: RoadNode[] = this._roadSeeker.seekPath(startNode, targetNode); //点击到障碍点不会行走
        //var roadNodeArr:RoadNode[] = this._roadSeeker.seekPath2(startNode,targetNode);  //点击到障碍点会行走到离障碍点最近的可走路点
        if (roadNodeArr.length > 0) {
            this.player.walkByRoad(roadNodeArr);
        }
    }

    /**
     *把视野定位到给定位置 
    * @param px
    * @param py
    * 
    */
    public setViewToPoint(px: number, py: number): void {
        cc.log("setViewToPoint px = " + px + "; py = " + py)
        let cameraPos = this.preCheckCameraPos(cc.v3(px, py, 0));  //预处理摄像机将要移动的目标坐标，防止移动过大地图出现黑边
        this.mapScene.camera.node.position = cameraPos;
    }

    /**
     * 预处理摄像机将要移动的目标坐标，防止移动过大地图出现黑边
     */
    preCheckCameraPos(playerPos: cc.Vec3): cc.Vec3 {
        let LimitPosX = this._mapData.mapWidth - cc.winSize.width
        let LimitPosY = this._mapData.mapHeight - cc.winSize.height
        let cameraPos = cc.v3(playerPos.x - cc.winSize.width / 2, playerPos.y - cc.winSize.height / 2, 0)
        if (cameraPos.x > LimitPosX) {
            cameraPos.x = LimitPosX
        } else if (cameraPos.x < 0) {
            cameraPos.x = 0
        }
        if (cameraPos.y > LimitPosY) {
            cameraPos.y = LimitPosY;
        } else if (cameraPos.y < 0) {
            cameraPos.y = 0;
        }
        return cameraPos
    }

    /**
     * 视图跟随玩家
     * @param dt 
     */
    public followPlayer(dt: number) {
        cc.log("followPlayer ")
        let cameraPos = this.preCheckCameraPos(this.player.node.position);  //预处理摄像机将要移动的目标坐标，防止移动过大地图出现黑边
        //摄像机平滑跟随
        //this.mapScene.camera.node.position.lerp(cameraPos, dt * 2.0, cameraPos);
        this.mapScene.camera.node.position = cameraPos;
    }

    public getMapNodeByPixel(px: number, py: number): RoadNode {
        var point: Point = MapRoadUtils.instance.getWorldPointByPixel(px, py);

        var node: RoadNode = this._roadDic[point.x + "_" + point.y];

        return node;
    }



}
