/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:44:18
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 14:45:06
 * @Description: 
 */
import { st_guide_info, CfgMgr } from "../manager/ConfigManager";
import { GuideMgr } from "../manager/GuideMgr";
import { NoticeType, NoticeMgr } from "../manager/NoticeManager";
import UI from '../util/ui';
import ComMaskBg from './comMaskBg';


//新手引导遮罩层
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Login/guideLayer")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class GuideLayer extends cc.Component {

    tipsLabel: cc.Label = null; //文本框
    tipsNode: cc.Node = null;
    touchNode: cc.Node = null;
    mask: cc.Mask = null;   //遮罩
    maskSprNode: cc.Node = null;
    handNode: cc.Node = null;   //手

    maskSprDef: cc.SpriteFrame = null;  //默认遮罩样式 

    // LIFE-CYCLE CALLBACKS:

    maskCallback: any = null;   //点击遮罩回调
    touchBeginPos: cc.Vec2 = null;  //开始触摸坐标
    touchMoveLen: number = 0;  //
    bGuideMove: boolean = false;

    guideInfo: st_guide_info = null;

    onLoad() {
        this.tipsNode = UI.find(this.node, "tipsNode")
        this.touchNode = UI.find(this.node, "touchNode")
        this.tipsLabel = UI.find(this.node, "tipsLabel").getComponent(cc.Label)

        this.mask = UI.find(this.node, "maskNode").getComponent(cc.Mask)
        this.maskSprDef = this.mask.spriteFrame;  //默认遮罩样式 
        this.maskSprNode = UI.find(this.node, "maskSpr")
        this.handNode = UI.find(this.node, "handSpr")

        this.touchNode.width = cc.winSize.width;
        this.touchNode.height = cc.winSize.height;

        this.mask.node.active = false;
        this.handNode.active = false;
        this.tipsNode.active = false;
        this.tipsLabel.string = "";
    }

    start () {
        let maskBg_tsComp = this.node.parent.getComponent(ComMaskBg)
        if(maskBg_tsComp){
            maskBg_tsComp.showCloseTipNode(false)   //设置是否显示关闭节点
        }
    }

    onDestroy() {
    }

    onEnable() {
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.ontTouchEnd, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.ontTouchEnd, this);
    }
    onDisable() {
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
    initGuideData(worldPos: cc.Vec2, maskSpr: cc.SpriteFrame = null, callback = null, nodeSize = cc.size(100, 100), offsetPos = cc.Vec2.ZERO) {
        let guideInfo: st_guide_info = CfgMgr.getGuideConf(GuideMgr.curGuideStep);
        //console.log("guideInfo = "+JSON.stringify(guideInfo))
        this.guideInfo = guideInfo;
        if (guideInfo) {
            this.maskCallback = callback;   //点击遮罩回调

            if (maskSpr == null) {
                this.mask.spriteFrame = this.maskSprDef;
            } else {
                this.mask.spriteFrame = maskSpr;
            } 5

            this.maskSprNode.width = cc.winSize.width + 10;
            this.maskSprNode.height = cc.winSize.height + 10;

            this.mask.node.setContentSize(nodeSize)

            let pos = this.node.convertToNodeSpaceAR(worldPos)
            pos.x += offsetPos.x;
            pos.y += offsetPos.y;
            if (maskSpr == null) {
                pos = this.adaptPos(pos);
            }

            this.mask.node.setPosition(cc.v2(pos.x, pos.y));
            this.mask.node.active = true;
            this.maskSprNode.x = - pos.x;
            this.maskSprNode.y = - pos.y;

            this.handNode.setPosition(cc.v2(pos.x + 50, pos.y - 50));
            this.handNode.active = true;
            this.handNode.stopAllActions();
            this.handNode.scale = 1.2;
            this.handNode.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1.0), cc.scaleTo(0.3, 1.2))));

            if (guideInfo.info && guideInfo.info != "") {   //显示引导提示
                this.tipsLabel.string = guideInfo.info;
                this.tipsNode.height = this.tipsLabel.node.height + 40;
                this.tipsNode.width = this.tipsLabel.node.width + 50;

                this.tipsNode.setPosition(cc.v2(0, pos.y + guideInfo.offsetY));
                this.tipsNode.active = true;
            }
        }
    }

    adaptPos(pos: cc.Vec2) {
        //适配
        pos.x += (this.node.x - cc.winSize.width / 2);
        pos.y += (this.node.y - cc.winSize.height / 2);
        return pos;
    }

    onClickMask() {
        if (this.maskCallback) {
            this.maskCallback();
        }
        this.node.destroy();
    }

    setMoveGuideData(beginPos, endPos) {
        this.bGuideMove = true;

        this.handNode.stopAllActions();
        this.handNode.scale = 1.5;
        let handPos = cc.v2(this.handNode.x + beginPos.x, this.handNode.y + beginPos.y);
        let destPos = cc.v2(this.handNode.x + endPos.x, this.handNode.y + endPos.y);
        this.handNode.position = cc.v3(handPos.x, handPos.y);

        this.handNode.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1.0), cc.moveTo(1.0, destPos), cc.hide(),
            cc.spawn(cc.moveTo(0.001, handPos), cc.scaleTo(0.001, 1.5)), cc.show())));
    }

    onTouchStart(event: cc.Event.EventTouch) {
        this.touchBeginPos = null;  //开始触摸坐标
        this.touchMoveLen = 0;
        if (this.maskCallback && this.mask.node.active == true) {
            let touchPos = event.getLocation();
            let pos = this.touchNode.convertToNodeSpaceAR(touchPos);
            pos = this.adaptPos(pos);
            let rect = cc.rect(this.mask.node.x - this.mask.node.width / 2, this.mask.node.y - this.mask.node.height / 2, this.mask.node.width, this.mask.node.height);
            if (rect.contains(pos)) {
                this.touchBeginPos = touchPos;  //开始触摸坐标
                if (this.bGuideMove == true) {
                    NoticeMgr.emit(NoticeType.Guide_TouchMove, touchPos);   //新手引导触摸移动
                } else {
                    this.onClickMask();
                }
            }
        }
    }

    onTouchMove(event: cc.Event.EventTouch) {
        if (this.touchBeginPos && this.bGuideMove == true) {
            let movePos = event.getLocation();
            let len = movePos.sub(this.touchBeginPos).mag();
            if (len >= 10) {
                NoticeMgr.emit(NoticeType.Guide_TouchMove, movePos);   //新手引导触摸移动
            }
        }
    }

    ontTouchEnd(event: cc.Event.EventTouch) {
        if (this.touchBeginPos && this.bGuideMove == true) {
            let endPos = event.getLocation();
            let len = endPos.sub(this.touchBeginPos).mag();
            if (len >= 20) {
                NoticeMgr.emit(NoticeType.Guide_TouchMove, endPos);   //新手引导触摸移动
                this.onClickMask();
            }
        }
    }

}
