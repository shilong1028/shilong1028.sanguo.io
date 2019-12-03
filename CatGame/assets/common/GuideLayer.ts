import { st_guide_info, CfgMgr } from "../manager/ConfigManager";
import { GuideMgr } from "../manager/GuideMgr";

//新手引导遮罩层
const {ccclass, property} = cc._decorator;

@ccclass
export default class GuideLayer extends cc.Component {

    @property(cc.Label)
    tipsLabel: cc.Label = null; //文本框
    @property(cc.Node)
    tipsNode: cc.Node = null;

    @property(cc.Node)
    touchNode: cc.Node = null;

    @property(cc.Mask)
    mask: cc.Mask = null;   //遮罩
    @property(cc.Node)
    maskSprNode: cc.Node = null;

    @property(cc.Node)
    handNode: cc.Node = null;   //手

    @property(cc.SpriteFrame)
    maskSprDef: cc.SpriteFrame = null;  //默认遮罩样式 

    maskCallback: any = null;   //点击遮罩回调

    guideInfo: st_guide_info = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

        this.mask.node.active = false;
        this.handNode.active = false;
        this.tipsNode.active = false;
        this.tipsLabel.string = "";
    }

    onDestroy(){
        this.touchNode.targetOff(this);
    }

    /**初始化引导层数据 
     * @param worldPos  引导框的世界坐标
     * @param maskSpr 引导框的纹理
     * @param callback 点击引导的回调
     * @param nodeSize 引导框大小
     * @param arrowTarPos 箭头指引的目标位置
     * @param offsetPos 手动偏移
    */
    initGuideData(worldPos: cc.Vec2, maskSpr: cc.SpriteFrame=null, callback = null, nodeSize = cc.size(100, 100), offsetPos=cc.Vec2.ZERO){
        let guideInfo: st_guide_info = CfgMgr.getGuideConf(GuideMgr.curGuideStep);
        //console.log("guideInfo = "+JSON.stringify(guideInfo))
        this.guideInfo = guideInfo;
        if(guideInfo){
            this.maskCallback = callback;   //点击遮罩回调

            if(maskSpr == null){
                this.mask.spriteFrame = this.maskSprDef;
            }else{
                this.mask.spriteFrame = maskSpr;
            }

            this.maskSprNode.width = cc.winSize.width+10;
            this.maskSprNode.height = cc.winSize.height+10;

            this.mask.node.setContentSize(nodeSize)

            let pos = this.node.convertToNodeSpaceAR(worldPos)
            pos.x += offsetPos.x;
            pos.y += offsetPos.y;

            this.mask.node.position = pos;
            this.mask.node.active = true;
            this.maskSprNode.x = - pos.x;
            this.maskSprNode.y = - pos.y;

            this.handNode.position = cc.v2(pos.x + 50, pos.y - 50);
            this.handNode.active = true;
            this.handNode.stopAllActions();
            this.handNode.scale = 1.2;
            this.handNode.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1.0), cc.scaleTo(0.3, 1.2))));

            if(guideInfo.info && guideInfo.info != ""){   //显示引导提示
                this.tipsLabel.string = guideInfo.info;
                this.tipsNode.height = this.tipsLabel.node.height + 40;
                this.tipsNode.width = this.tipsLabel.node.width + 50;

                this.tipsNode.position = cc.v2(0, pos.y + guideInfo.offsetY);
                this.tipsNode.active = true;
            }
        }
    }

    onTouchStart(event: cc.Event.EventTouch) {
        if(this.maskCallback && this.mask.node.active == true){
            let pos = this.node.convertToNodeSpaceAR(event.getLocation());
            let rect = cc.rect(this.mask.node.x-this.mask.node.width/2, this.mask.node.y-this.mask.node.height/2, this.mask.node.width, this.mask.node.height);
            if(rect.contains(pos)){
                this.onClickMask();
            }
        }
    }

    onClickMask(){
        if(this.maskCallback){
            this.maskCallback();
        }
        this.node.removeFromParent(true);
    }

}
