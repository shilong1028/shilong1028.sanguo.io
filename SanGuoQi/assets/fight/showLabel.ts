
const {ccclass, property} = cc._decorator;

@ccclass
export default class ShowLabel extends cc.Component {

    @property(cc.Label)
    showLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    showTips(str: string, col: cc.Color, pos: cc.Vec2){
        this.node.color = col;
        this.showLabel.string = str;
        this.node.position = pos;

        this.node.runAction(cc.sequence(cc.moveBy(0.5, cc.v2(0, 200)), cc.delayTime(0.5), cc.removeSelf(true)));
    }
}
