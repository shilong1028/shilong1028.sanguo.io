const {ccclass, property} = cc._decorator;

@ccclass
export default class Dot extends cc.Component {

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;
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
    }

    start () {

    }

    // update (dt) {}

    /**设置点所在的射线起始点和终点 */
    setDotRay(startPos: cc.Vec2, endPos: cc.Vec2, dir: cc.Vec2){
        this.rayStartPos = startPos;
        this.rayEndPos = endPos;
        this.rayDir = dir;
    }

    /**变点位箭头图片 */
    changeDotToArrow(bArrow: boolean = true){
        if(bArrow == true){
            this.iconSpr.spriteFrame = this.arrowFrame;
        }else{
            this.iconSpr.spriteFrame = this.dotFrame;
        }
    }
}
