import Game1Scene from "./game1Scene";
import { st_rubbish_info, CfgMgr } from "../manager/ConfigManager";

//垃圾
const {ccclass, property} = cc._decorator;

@ccclass
export default class Rubbish extends cc.Component {

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:
    game1Scene: Game1Scene = null;
    rubbishConf: st_rubbish_info = null;

    //只有在new cc.NodePool(Dot)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
    //使用 Pool.put() 回收节点后，会调用unuse 方法
    unuse() {

    }
    //使用 Pool.get() 获取节点后，就会调用reuse 方法
    reuse() {

    }

    initRubbishData(){
        this.game1Scene = null;
        this.rubbishConf = null;

        this.iconSpr.spriteFrame = null;
        this.node.stopAllActions();
    }

    onLoad () {
        this.initRubbishData();
    }

    start () {

    }

    /**移除自身 */
    handleRemoveMySelf(){
        this.game1Scene.removeRubbishToPool(this.node);   //回收到缓存池
    }

    // update (dt) {}

    onClick(){
        if(this.rubbishConf && this.game1Scene){
            if(this.rubbishConf.type == this.game1Scene.fightRubbishType){
                this.node.stopAllActions();
                this.game1Scene.handleRubbishSuccClick(this.rubbishConf.type);   //正确点击回收的垃圾
                this.handleRemoveMySelf();
            }else{
                cc.log("分类错误！");
            }
        }
    }

    initRubbish(id: number, target: Game1Scene){
        this.game1Scene = target;
        this.rubbishConf = CfgMgr.C_rubbish_info[id];
        if(this.rubbishConf){
            this.iconSpr.spriteFrame = this.game1Scene.targetFrames[this.rubbishConf.type-1];
        }

        this.node.stopAllActions();

        let destPosX = (Math.random()-0.5)*(this.game1Scene.qipanNode.width/2 - 50);
        let destPos = cc.v2(destPosX, -this.game1Scene.qipanNode.height/2);
        let moveTime = this.node.position.sub(destPos).mag()/this.game1Scene.rubbishSpeed;

        this.node.runAction(cc.sequence(cc.moveTo(moveTime, destPos), cc.callFunc(function(){   //.easing(cc.easeBezierAction(0.5, 0.5, 1.0, 1.0))
            this.game1Scene.handleRubbishEnd(this.rubbishConf.type);  //垃圾落地
            this.handleRemoveMySelf();
        }.bind(this))));
    }
}
