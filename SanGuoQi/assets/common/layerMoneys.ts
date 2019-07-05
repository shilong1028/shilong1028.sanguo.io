import { NoticeMgr } from "../manager/NoticeManager";
import { MyUserData } from "../manager/MyUserData";
import { NoticeType } from "../manager/Enum";

//一级界面上的金币钻石粮草公用控件
const {ccclass, property} = cc._decorator;

@ccclass
export default class LayerMoney extends cc.Component {

    @property(cc.Label)
    goldLabel: cc.Label = null;    //金币数量
    
    @property(cc.Label)
    foodLabel: cc.Label = null;   //粮草数量

    @property(cc.Label)
    diamondLabel: cc.Label = null;   //钻石（金锭）数量

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        NoticeMgr.on(NoticeType.UpdateGold, this.UpdateGoldCount, this); 
        NoticeMgr.on(NoticeType.UpdateDiamond, this.UpdateDiamondCount, this); 
        NoticeMgr.on(NoticeType.UpdateFood, this.UpdateFoodCount, this); 

        this.UpdateGoldCount();
        this.UpdateFoodCount();
        this.UpdateDiamondCount();
    }

    onDestroy(){
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start () {

    }

    // update (dt) {}

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
