
//主城
const {ccclass, property} = cc._decorator;

@ccclass
export default class CapitalScene extends cc.Component {

    @property(cc.Node)
    mapNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    touchBeginPos: cc.Vec2 = null;  //触摸起点
    MapLimitPos: cc.Vec2 = cc.v2(3390/2, 1920/2);

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.MapLimitPos = cc.v2(this.MapLimitPos.x - cc.winSize.width/2, this.MapLimitPos.y - cc.winSize.height/2);
    }

    start () {

    }

    // update (dt) {}

    touchStart(event: cc.Touch){
        this.touchBeginPos = event.getLocation();
    }

    touchMove(event: cc.Touch){
        if(this.touchBeginPos){
            let pos = event.getLocation();
            let offset = pos.sub(this.touchBeginPos);
            this.touchBeginPos = pos;
            
            let mapPos = this.mapNode.position.add(offset);
            if(mapPos.x > this.MapLimitPos.x){
                mapPos.x = this.MapLimitPos.x;
            }else if(mapPos.x < -this.MapLimitPos.x){
                mapPos.x = -this.MapLimitPos.x;
            }
            if(mapPos.y > this.MapLimitPos.y){
                mapPos.y = this.MapLimitPos.y;
            }else if(mapPos.y < -this.MapLimitPos.y){
                mapPos.y = -this.MapLimitPos.y;
            }
            this.mapNode.position = mapPos;
        }
    }

    touchEnd(event: cc.Touch){
        this.touchBeginPos = null;
    }

    onMapBtn(){
        cc.director.loadScene("mainScene");
    }
}
