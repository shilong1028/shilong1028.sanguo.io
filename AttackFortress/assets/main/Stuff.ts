import { BallInfo } from "../manager/Enum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Stuff extends cc.Component {

    @property(cc.Sprite)
    ballSpr: cc.Sprite = null;
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(cc.Node)
    levelNode: cc.Node = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.SpriteAtlas)
    cannonAtlas: cc.SpriteAtlas = null;

    ballInfo: BallInfo = null;  //小球模型数据

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.levelLabel.string = "";
        this.nameLabel.string = "";
        this.ballSpr.spriteFrame = null;
    }

    start () {
    }

    // update (dt) {}

    /**设置地块小球模型数据 */
    setStuffData(ballInfo: BallInfo, bActive:boolean = true){
        this.ballInfo = ballInfo;
        this.levelLabel.string = (ballInfo.cannonId%10).toString();

        if(bActive == true){
            this.ballSpr.spriteFrame = this.cannonAtlas.getSpriteFrame("dog"+(ballInfo.cannonId-1)+"_normal");
        }
    }

    /**设置地块小球模型数据 */
    setStuffAndName(ballInfo: BallInfo, bShowName:boolean=false, bShowStuff:boolean=true){
        this.setStuffData(ballInfo, bShowStuff);
        if(bShowName == true){
            this.showStuffName();
        }
    }

    /**显示小球名称 */
    showStuffName(){
        if(this.ballInfo && this.ballInfo.cannonCfg){
            this.nameLabel.string = this.ballInfo.cannonCfg.name;
        }
    }

    /**显示等级节点 */
    showLevelNode(bShow: boolean){
        this.levelNode.active = bShow;
    }
}
