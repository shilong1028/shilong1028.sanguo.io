import { MyUserData, MyUserMgr } from "../manager/MyUserData";
import { ItemInfo } from "../manager/Enum";
import { GameMgr } from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BuildReward extends cc.Component {

    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.Node)
    bgNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    rewardNum: number = 0;  //税收数量
    updateStep: number = 0;  //更新步长

    onLoad () {
        this.numLabel.string = "0";
    }

    start () {
        this.bgNode.scale = 1.0;
        this.bgNode.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(2.5, 0.9), cc.scaleTo(2.5, 1.0))));
    }

    update (dt) {
        this.updateStep --;
        if(this.updateStep <= 0){
            this.updateStep = 20;
            this.updateRewardLabel();
        }
    }

    updateRewardLabel(){
        if(MyUserData.capitalLv > 0){
            let offTime = Math.floor(MyUserData.totalLineTime - MyUserData.lastGoldTaxTime);
            if(offTime > 0){
                this.rewardNum = offTime;  //一秒一个金币
                this.numLabel.string = this.rewardNum.toString();
            }
        }
    }

    onBtn(sender:any, customData:any){
        //cc.log("onBtn(), customData = "+customData);
        if(this.rewardNum > 0){
            this.updateStep = 1000;

            let itemId = parseInt(customData);
            if(itemId == 6001){   //税金（金币）
                MyUserMgr.updateGoldTaxTime();  //更新收税金时间

                let items = new Array();
                items.push({"key":6001, "val":this.rewardNum});   //金币
                let rewards: ItemInfo[] = GameMgr.getItemArrByKeyVal(items);   //通过配置keyVal数据砖块道具列表
                GameMgr.receiveRewards(rewards);   //领取奖励

                this.rewardNum = 0;
            }else if(itemId == 6003){  //税粮（粮草）
    
            }
            this.numLabel.string = "0";
        }
    }
}
