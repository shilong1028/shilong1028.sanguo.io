
//背包 背包最多包含30个不同的道具（6*5）
const {ccclass, property} = cc._decorator;

@ccclass
export default class BagLayer extends cc.Component {

    @property(cc.Node)
    grid: cc.Node = null;

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    pfItem: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.grid.removeAllChildren();
        this.iconSpr.spriteFrame = null;
        this.nameLabel.string = "";
        this.numLabel.string = "";
        this.descLabel.string = "";
    }

    start () {

    }

    // update (dt) {}

    onCloseBtn(){
        this.node.removeFromParent(true);
    }
}
