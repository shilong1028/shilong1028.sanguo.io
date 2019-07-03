import { ItemInfo } from "../manager/Enum";
import TableView from "../tableView/tableView";

//领取奖励通用提示框
const {ccclass, property} = cc._decorator;

@ccclass
export default class RewardLayer extends cc.Component {

    @property(TableView)
    tableView: TableView = null;

    // LIFE-CYCLE CALLBACKS:

    receiveCallback: any = null;    //领取回调
    receiveTarget: any = null;

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onOkBtn(){
        if(this.receiveCallback && this.receiveTarget){
            this.receiveCallback.call(this.receiveTarget, null);
        }
        this.receiveCallback = null;
        this.receiveTarget = null;

        this.node.removeFromParent(true);
    }

    //领取物品后回调
    setRewardCallback(callback: any, target: any){
        this.receiveCallback = callback;
        this.receiveTarget = target;
    }

    /**展示奖励列表 */
    showRewardList(rewards: ItemInfo[]){  
        //cc.log("showRewardList(), rewards = "+JSON.stringify(rewards));
        this.tableView.initTableView(rewards.length, { array: rewards, target: this }); 
    }
}
