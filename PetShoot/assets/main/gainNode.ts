import { GameMgr } from "../manager/GameManager";

//增益金币提示
const {ccclass, property} = cc._decorator;

@ccclass
export default class GainGoldNode extends cc.Component {

    @property(cc.Label)
    gainLabel: cc.Label = null;   //小球增益文本

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gainLabel.string = "";
        this.node.scale = 0.01;
    }

    start () {

    }

    // update (dt) {}

    /**显示增益金币 */
    showGainGlodVal(gain: number){
        this.gainLabel.string = "";
        this.node.stopAllActions();
        this.node.scale = 0.01;

        let valStr = GameMgr.num2e(gain);
        this.gainLabel.string = "+"+valStr;

        this.node.runAction(cc.sequence(cc.spawn(cc.moveBy(0.1, cc.v2(0, 20)), cc.scaleTo(0.05, 1.0)), 
            cc.moveBy(0.1, cc.v2(0, 40)), cc.delayTime(0.5), cc.fadeTo(0.2, 0), cc.callFunc(function(){
                this.node.destroy();
            }.bind(this))));
    }
}
