
/*
 * @Autor: dongsl
 * @Date: 2021-03-19 17:09:33
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-17 17:26:19
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
import { MyUserData, MyUserMgr } from "../manager/MyUserData";

//地图界面相关中介

export default class MapMediator extends puremvc.Mediator implements puremvc.IMediator {

    public static NAME: string = "MapMediator";

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
        let notifier: any = notification.getBody();
        //cc.log("MapMediator handleNotification:" + notification.getName())
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

        let mapName: string = "cityMap"   //某郡各县小地图
        if (MyUserData.myTownIdxs.length > 5) {   //五个县城及郡治均已占领
            mapName = "worldMap"   //已有郡城，则全国大地图
        }
        LoaderMgr.bundle_load("map", "res/data/" + mapName, cc.JsonAsset, (error: Error, res: cc.JsonAsset) => {
            if (!res.json) {
                cc.log("res.json is null, mapName = " + mapName);
                return
            }
            let mapData: MapData = res.json;
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
        //cc.log("MapMediator initMap 初始化地图 mapData = " + JSON.stringify(mapData))
        this._mapData = mapData;

        MapRoadUtils.instance.updateMapInfo(mapData.mapWidth, mapData.mapHeight, mapData.nodeWidth, mapData.nodeHeight, mapData.type);

        this.mapLayer.init(mapData.mapWidth, mapData.mapHeight, 256, 256, bgTex);

        let len: number = mapData.roadDataArr.length;
        let len2: number = mapData.roadDataArr[0].length;

        let value: number = 0;
        let dx: number = 0;
        let dy: number = 0;

        for (let i: number = 0; i < len; i++) {
            for (let j: number = 0; j < len2; j++) {
                value = mapData.roadDataArr[i][j];
                dx = j;
                dy = i;
                let node: RoadNode = MapRoadUtils.instance.getNodeByDerect(dx, dy);
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
        let pos = this.mapScene.camera.node.position.add(FunMgr.v2Tov3(event.getLocation()));
        this.movePlayer(pos.x, pos.y);

    }

    /**
     *移到玩家 
     * @param targetX 移动到的目标点x
     * @param targetY 移到到的目标点y
     * 
     */
    public movePlayer(targetX: number, targetY: number) {
        let startPoint: Point = MapRoadUtils.instance.getWorldPointByPixel(this.player.node.x, this.player.node.y);
        let targetPoint: Point = MapRoadUtils.instance.getWorldPointByPixel(targetX, targetY);

        let startNode: RoadNode = this._roadDic[startPoint.x + "_" + startPoint.y];
        let targetNode: RoadNode = this._roadDic[targetPoint.x + "_" + targetPoint.y];

        let roadNodeArr: RoadNode[] = this._roadSeeker.seekPath(startNode, targetNode); //点击到障碍点不会行走
        //let roadNodeArr:RoadNode[] = this._roadSeeker.seekPath2(startNode,targetNode);  //点击到障碍点会行走到离障碍点最近的可走路点
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
        let cameraPos = this.preCheckCameraPos(cc.v3(px, py, 0));  //预处理摄像机将要移动的目标坐标，防止移动过大地图出现黑边
        this.mapScene.camera.node.position = cameraPos;
        this.mapScene.menuNode.position = cameraPos;   //菜单按钮跟随摄像机移动
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
        let cameraPos = this.preCheckCameraPos(this.player.node.position);  //预处理摄像机将要移动的目标坐标，防止移动过大地图出现黑边
        //摄像机平滑跟随
        //this.mapScene.camera.node.position.lerp(cameraPos, dt * 2.0, cameraPos);
        this.mapScene.camera.node.position = cameraPos;
        this.mapScene.menuNode.position = cameraPos;   //菜单按钮跟随摄像机移动
    }

    public getMapNodeByPixel(px: number, py: number): RoadNode {
        let point: Point = MapRoadUtils.instance.getWorldPointByPixel(px, py);
        let node: RoadNode = this._roadDic[point.x + "_" + point.y];
        return node;
    }



}
