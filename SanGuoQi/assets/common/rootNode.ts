
//游戏常驻节点
const {ccclass, property} = cc._decorator;

@ccclass
export default class RootNode extends cc.Component {

    @property(cc.Prefab)
    pfItem: cc.Prefab = null;   //背包道具通用显示

    @property(cc.Prefab)
    pfMoney: cc.Prefab = null;   //一级界面上的金币钻石粮草公用控件

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

    //一级界面上的金币钻石粮草公用控件
    showLayerMoney(parent: cc.Node, pos: cc.Vec2, zIndex:number=10){
        let topMoney = cc.instantiate(this.pfMoney);
        topMoney.position = pos;
        parent.addChild(topMoney, zIndex);
    }
}

export var ROOT_NODE : RootNode;
