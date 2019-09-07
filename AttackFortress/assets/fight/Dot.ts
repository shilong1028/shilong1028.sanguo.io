const {ccclass, property} = cc._decorator;

@ccclass
export default class Dot extends cc.Component {

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;

    @property(cc.CircleCollider)
    collider: cc.CircleCollider = null;

    @property(cc.SpriteFrame)
    dotFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    arrowFrame: cc.SpriteFrame = null;

    //点所在的射线起始点和终点
    rayStartPos: cc.Vec2 = null;
    rayEndPos: cc.Vec2 = null;
    //射线方向
    rayDir: cc.Vec2 = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    onDestroy(){
        this.collider.enabled = false;
    }

    start () {

    }

    // update (dt) {}

    /**设置点所在的射线起始点和终点 */
    setDotRay(startPos: cc.Vec2, endPos: cc.Vec2, dir: cc.Vec2){
        this.rayStartPos = startPos;
        this.rayEndPos = endPos;
        this.rayDir = dir;
        this.collider.enabled = true;
        this.collider.radius = 15;
    }

    /**变点位箭头图片 */
    changeDotToArrow(bArrow: boolean = true){
        if(bArrow == true){
            this.iconSpr.spriteFrame = this.arrowFrame;
            this.collider.radius = 20;   //便于移动砖块和射线的碰撞检测
        }else{
            this.iconSpr.spriteFrame = this.dotFrame;
            this.collider.radius = 15;
        }
    }
}
