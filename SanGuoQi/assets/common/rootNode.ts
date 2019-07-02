
//游戏常驻节点
const {ccclass, property} = cc._decorator;

@ccclass
export default class RootNode extends cc.Component {

    @property(cc.Prefab)
    pfReward: cc.Prefab = null;   //获取奖励通用提示框

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        (cc.game as any).addPersistRootNode(this.node);
        //在creator的引擎里面只有根节点才能够被成功的设置为常驻节点，这一点貌似官方文档是没用提到的
        ROOT_NODE = this;
    }

    start () {

    }

    // update (dt) {}
}

export var ROOT_NODE : RootNode;
