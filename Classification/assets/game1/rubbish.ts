
import { st_rubbish_info, CfgMgr } from "../manager/ConfigManager";

//垃圾
const {ccclass, property} = cc._decorator;

@ccclass
export default class Rubbish extends cc.Component {

    @property(cc.Sprite)
    bgSpr: cc.Sprite = null;

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:
    gameScene: any = null;
    rubbishConf: st_rubbish_info = null;

    bTouchMoveEnabled: boolean = false;  //是否可以触摸移动

    //只有在new cc.NodePool(Dot)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
    //使用 Pool.put() 回收节点后，会调用unuse 方法
    unuse() {
        this.node.targetOff(this);
    }
    //使用 Pool.get() 获取节点后，就会调用reuse 方法
    reuse() {
        this.clearRubbishData();
    }

    onDestroy(){
        this.node.targetOff(this);
    }

    //垃圾数据重置
    clearRubbishData(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.bTouchMoveEnabled = false;  //是否可以触摸移动

        this.gameScene = null;
        this.rubbishConf = null;

        this.bgSpr.spriteFrame = null;
        this.iconSpr.spriteFrame = null;
        this.node.stopAllActions();
    }

    onLoad () {
        this.clearRubbishData();
    }

    start () {

    }

    /**移除自身 */
    handleRemoveMySelf(){
        this.gameScene.removeRubbishToPool(this.node);   //回收到缓存池
    }

    /** 是否正确回收垃圾
     * @param bCollect 是否操作（回收）正确
     * @param bSendGame 是否作为计入失败操作的次数
    */
    handleReclaimRubbish(bCollect:boolean, bInFailed:boolean){
        this.node.stopAllActions();
        if(bCollect == true){
            this.gameScene.handleRubbishSuccClick(this.rubbishConf.type);   //正确点击回收的垃圾
        }else{
            if(bInFailed == true){  //只有点击错误才会发送游戏统计
                this.gameScene.handleRubbishEnd(this.rubbishConf.type);  //垃圾落地(回收失败)
            }
        }
        this.handleRemoveMySelf();
    }

    // update (dt) {}

    //初始化垃圾数据
    initRubbish(id: number, target: any, bTouchMoveEnabled:boolean){
        //cc.log("initRubbish(), id = "+id+"; bTouchMoveEnabled = "+bTouchMoveEnabled);
        this.bTouchMoveEnabled = bTouchMoveEnabled;  //是否可以触摸移动
        this.gameScene = target;
        this.rubbishConf = CfgMgr.C_rubbish_info[id];
        if(this.rubbishConf){
            this.bgSpr.spriteFrame = this.gameScene.targetFrames[this.rubbishConf.type-1];
            this.iconSpr.spriteFrame = this.iconAtlas.getSpriteFrame(id.toString());
            if(this.iconSpr.spriteFrame == null){
                cc.log("this.iconSpr.spriteFrame == null id = "+id);
            }
        }

        this.resetMoveToEnd();   //垃圾移动到底部
    }

    //垃圾移动到底部
    resetMoveToEnd(){
        this.node.stopAllActions();

        if(this.node.y <= -this.gameScene.qipanNode.height/2){
            this.handleReclaimRubbish(false, this.bTouchMoveEnabled);   //是否正确回收垃圾
        }else{
            let destPosX = (Math.random()-0.5)*(this.gameScene.qipanNode.width/2 - 50);
            let destPos = cc.v2(destPosX, -this.gameScene.qipanNode.height/2);
            let moveTime = this.node.position.sub(destPos).mag()/this.gameScene.rubbishSpeed;
            moveTime = moveTime -  Math.random()*moveTime/5;
    
            this.node.runAction(cc.sequence(cc.moveTo(moveTime, destPos), cc.callFunc(function(){   //.easing(cc.easeBezierAction(0.5, 0.5, 1.0, 1.0))
                this.handleReclaimRubbish(false, this.bTouchMoveEnabled);   //是否正确回收垃圾
            }.bind(this))));
        }
    }


    //*********************   触摸事件处理  ************ */
    onTouchStart(event: cc.Event.EventTouch) {
        if(this.bTouchMoveEnabled == true){  //是否可以触摸移动
            this.node.stopAllActions();
            this.gameScene.setSelectRubbish(this);   //拖动更新选中的模型的位置
        }else{
            this.onClick();
        }
    }

    onClick(){
        if(this.bTouchMoveEnabled == false && this.rubbishConf && this.gameScene){
            if(this.rubbishConf.type == this.gameScene.fightRubbishType){
                this.handleReclaimRubbish(true, true);   //是否正确回收垃圾
            }else{
                this.handleReclaimRubbish(false, true);   //是否正确回收垃圾
            }
        }
    }

    //根据触摸更新垃圾位置
    udpatePosByTouch(pos: cc.Vec2){
        this.node.stopAllActions();
        this.node.position = pos;
    }
}
