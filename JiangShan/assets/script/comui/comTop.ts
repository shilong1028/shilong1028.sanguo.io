import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";
import { MyUserData } from "../manager/MyUserData";
import { NoticeMgr, NoticeType } from "../manager/NoticeManager";


//一级界面上的金币钻石粮草公用控件
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("ComUI/comTop")
@executionOrder(-1)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class ComTop extends cc.Component {

    @property(cc.Label)
    goldLabel: cc.Label = null;   //金币
    @property(cc.Label)
    foodLabel: cc.Label = null;   //粮草

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.UpdateGoldCount();
        this.UpdateFoodCount();
        NoticeMgr.on(NoticeType.UpdateGold, this.UpdateGoldCount, this); 
        NoticeMgr.on(NoticeType.UpdateFood, this.UpdateFoodCount, this); 
    }

    onDestroy(){
        //this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start () {

    }

    UpdateGoldCount(){
        this.goldLabel.string = MyUserData.GoldCount.toString();
    }

    UpdateFoodCount(){
        this.foodLabel.string = MyUserData.FoodCount.toString();
    }

    onAddGoldBtn(){
        AudioMgr.playBtnClickEffect();
        GameMgr.showGoldAddDialog();  //获取金币提示框
    }
}
