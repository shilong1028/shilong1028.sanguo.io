/*
 * @Autor: dongsl
 * @Date: 2021-03-22 13:31:51
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-23 11:12:08
 * @Description: 玩家模型
 */
import MovieClip from "./MovieClip";
import RoadNode from "../road/RoadNode";
import MapMediator from '../mapMediator';
import { LoaderMgr } from '../../manager/LoaderManager';

const { ccclass, property } = cc._decorator;

export enum CharactorState {
    stand = 0,
    run = 1,
    sitdown = 2,
    sitdown_run = 3,
}

@ccclass
export default class Charactor extends cc.Component {

    private _movieClip: MovieClip = null;

    public get movieClip(): MovieClip {
        if (!this._movieClip) {
            this._movieClip = this.getComponentInChildren(MovieClip);
        }
        return this._movieClip;
    }


    private _direction: number = 0;

    public get direction(): number {
        return this._direction;
    }

    public set direction(value: number) {
        this._direction = value;

        if (value > 4) {
            this.movieClip.rowIndex = 4 - value % 4;
            this.movieClip.node.scaleX = -1;
        } else {
            this.movieClip.rowIndex = value;
            this.movieClip.node.scaleX = 1;
        }
    }

    private _state: CharactorState = 0;

    public get state(): CharactorState {
        return this._state;
    }

    public set state(value: CharactorState) {
        this._state = value;

        switch (this._state) {
            case CharactorState.stand:
                this.movieClip.begin = 0;
                this.movieClip.end = 6;
                break;

            case CharactorState.run:
                this.movieClip.begin = 6;
                this.movieClip.end = 12;
                break;

            case CharactorState.sitdown:
                this.movieClip.begin = 12;
                this.movieClip.end = 18;
                break;

            case CharactorState.sitdown_run:
                this.movieClip.begin = 18;
                this.movieClip.end = 24;
                break;

        }

    }

    private _alpha: number = 1;
    public get alpha(): number {
        return this._alpha;
    }
    public set alpha(value: number) {
        this._alpha = value;
        this.node.opacity = Math.floor(255 * (value / 1))
    }

    public sceneMap: MapMediator = null;
    public isFollowPlayer: boolean = true;

    /**
     *玩家当前所站在的地图节点 
     */
    private _currentNode: RoadNode;

    //public isScrollScene:boolean = false;

    public moving: boolean = false;

    public moveSpeed: number = 200;

    private _moveAngle: number = 0;

    private _roadNodeArr: RoadNode[] = [];
    private _nodeIndex: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        //this.movieClip.stop();
        this.direction = 0;
        this.state = 3;

        this.node.anchorY = 0.25;
    }

    /**
    * 初始化玩家形象
    */
    initPlayerModel(sceneMap: MapMediator, playerId: string) {
        cc.log("initPlayerModel playerId = " + playerId)
        this.sceneMap = sceneMap;
        let skin = this.node.getChildByName("skin")
        this._movieClip = skin.getComponent(MovieClip)
        if (!this._movieClip) {
            this._movieClip = skin.addComponent(MovieClip)
        }
        LoaderMgr.bundle_load("map", "res/sample/" + playerId, cc.Texture2D, (error: Error, tex: cc.Texture2D) => {   //cc.SpriteFrame
            this._movieClip.setSkinTexture(tex)
        });
    }

    update(dt) {
        if (this.moving) {
            var nextNode: RoadNode = this._roadNodeArr[this._nodeIndex];
            var dx: number = nextNode.px - this.node.x;
            var dy: number = nextNode.py - this.node.y;

            var speed: number = this.moveSpeed * dt;

            if (dx * dx + dy * dy > speed * speed) {
                if (this._moveAngle == 0) {
                    this._moveAngle = Math.atan2(dy, dx);

                    var dire: number = Math.round((-this._moveAngle + Math.PI) / (Math.PI / 4));
                    this.direction = dire > 5 ? dire - 6 : dire + 2;
                }

                var xspeed: number = Math.cos(this._moveAngle) * speed;
                var yspeed: number = Math.sin(this._moveAngle) * speed;

                this.node.x += xspeed;
                this.node.y += yspeed;

            } else {
                this._moveAngle = 0;

                if (this._nodeIndex == this._roadNodeArr.length - 1) {
                    this.node.x = nextNode.px;
                    this.node.y = nextNode.py

                    this.stop();
                } else {
                    this.walk();
                }
            }
        }

        this.setPlayerStateByNode();
    }

    //Camera的跟随移动最好在lateUpdate里面处理
    lateUpdate(dt) {
        if (this.moving && this.sceneMap) {
            this.sceneMap.followPlayer(dt);
        }
    }

    public setPlayerStateByNode(): void {
        var node: RoadNode = this.sceneMap.getMapNodeByPixel(this.node.x, this.node.y);

        if (node == this._currentNode) {
            return;
        }

        this._currentNode = node

        if (this._currentNode) {
            switch (this._currentNode.value) {
                case 2://如果是透明节点时
                    if (this.alpha != 0.4) {
                        this.alpha = 0.4;
                    }
                    break;
                case 3://如果是透明节点时
                    //trace("走到该节点传送");
                    //this.alpha < 1 && (this.alpha = 1);
                    this.alpha > 0 && (this.alpha = 0);
                    break;
                default:
                    this.alpha < 1 && (this.alpha = 1);

            }

        }

    }

    /**
     * 根据路节点路径行走
     * @param roadNodeArr 
     */
    public walkByRoad(roadNodeArr: RoadNode[]) {
        this._roadNodeArr = roadNodeArr;
        this._nodeIndex = 0;
        this._moveAngle = 0;

        this.walk();
        this.move();
    }

    private walk() {
        cc.log("charactor walk")
        if (this._nodeIndex < this._roadNodeArr.length - 1) {
            this._nodeIndex++;
        } else {

        }
    }

    public move() {
        cc.log("charactor move")
        this.moving = true;
        this.state = CharactorState.run;
    }

    public stop() {
        cc.log("charactor stop")
        this.moving = false;
        this.state = CharactorState.stand;
    }
}
