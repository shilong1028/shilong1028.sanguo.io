import { NoticeMgr } from "../manager/NoticeManager";
import { NoticeType } from "../manager/Enum";
import { MyUserData } from "../manager/MyUserData";

//背包 背包最多包含30个不同的道具（6*5）
const {ccclass, property} = cc._decorator;

@ccclass
export default class BagLayer extends cc.Component {
    @property(cc.Label)
    goldLabel: cc.Label = null;
    @property(cc.Label)
    diamondLabel: cc.Label = null;
    @property(cc.Label)
    foodLabel: cc.Label = null;

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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        NoticeMgr.on(NoticeType.UpdateGold, this.UpdateGoldCount, this); 
        NoticeMgr.on(NoticeType.UpdateDiamond, this.UpdateDiamondCount, this); 
        NoticeMgr.on(NoticeType.UpdateFood, this.UpdateFoodCount, this); 

        this.grid.removeAllChildren();
        this.iconSpr.spriteFrame = null;
        this.nameLabel.string = "";
        this.numLabel.string = "";
        this.descLabel.string = "";
    }

    onDestroy(){
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start () {

    }

    // update (dt) {}

    initBagGrid(){

    }

    onCloseBtn(){
        this.node.removeFromParent(true);
    }

    UpdateGoldCount(){
        this.goldLabel.string = MyUserData.GoldCount.toString();
    }

    UpdateDiamondCount(){
        this.diamondLabel.string = MyUserData.DiamondCount.toString();
    }

    UpdateFoodCount(){
        this.foodLabel.string = MyUserData.FoodCount.toString();
    }
}
