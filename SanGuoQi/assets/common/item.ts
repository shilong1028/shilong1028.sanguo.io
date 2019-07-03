
//道具
const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends cc.Component {

    @property(cc.Node)
    selImg: cc.Node = null;

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onClicked(){

    }
}
