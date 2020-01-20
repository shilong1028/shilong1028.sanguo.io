import { ItemInfo } from "../manager/Enum";
import TableView from "../tableView/tableView";
import { ROOT_NODE } from "./rootNode";
import { SDKMgr } from "../manager/SDKManager";
import { GameMgr } from "../manager/GameManager";

//领取奖励通用提示框
const {ccclass, property} = cc._decorator;

@ccclass
export default class RewardLayer extends cc.Component {

    @property(TableView)
    tableView: TableView = null;

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

    receiveCallback: any = null;    //领取回调
    receiveTarget: any = null;

    rewardArr: ItemInfo[] = new Array();   //奖励
    selCellIdx: number = -1;   //选中的Cell索引

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onOkBtn(){
        let str = "";
        for(let i=0; i<this.rewardArr.length; ++i){
            let item = this.rewardArr[i];
            let itemStr = "获得"+item.itemCfg.name + " x " + item.count + "  ";
            str += itemStr;
        }
        ROOT_NODE.showTipsText(str);

        if(this.receiveCallback && this.receiveTarget){
            this.receiveCallback.call(this.receiveTarget, this.rewardArr);
        }
        this.receiveCallback = null;
        this.receiveTarget = null;

        this.node.destroy();
    }


    /**视频免费按钮 */
    onVedioBtn(){
        SDKMgr.showVedioAd("JiangLiVedioId", ()=>{
              //失败
        }, ()=>{
            let str = "";
            for(let i=0; i<this.rewardArr.length; ++i){
                let item = this.rewardArr[i];
                let itemStr = "获得"+item.itemCfg.name + " x " + item.count + "  ";
                str += itemStr;
            }
            ROOT_NODE.showTipsText(str);

            GameMgr.receiveRewards(this.rewardArr);   //领取奖励
            this.onOkBtn();
        }); 
    }

    //领取物品后回调
    setRewardCallback(callback: any, target: any){
        this.receiveCallback = callback;
        this.receiveTarget = target;
    }

    /**展示奖励列表 */
    showRewardList(rewards: ItemInfo[]){  
        //cc.log("showRewardList(), rewards = "+JSON.stringify(rewards));
        this.rewardArr = rewards;
        this.tableView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
        this.tableView.initTableView(rewards.length, { array: rewards, target: this }); 
    }

    handleSelCell(cellIdx: number){
        if(this.selCellIdx == cellIdx){
            return;
        }
        this.selCellIdx = cellIdx;   //选中的Cell索引

        this.updateSelItemInfo(cellIdx);  //显示底部选中道具信息
    }

    /**显示底部选中道具信息 */
    updateSelItemInfo(cellIdx:number){
        this.iconSpr.spriteFrame = null;
        this.nameLabel.string = "";
        this.numLabel.string = "";
        this.descLabel.string = "";

        let item = this.rewardArr[cellIdx];
        if(item && item.itemCfg){
            this.numLabel.string = "数量："+item.count;
            this.nameLabel.string = item.itemCfg.name;
            this.iconSpr.spriteFrame = this.iconAtlas.getSpriteFrame(item.itemId.toString());
            this.descLabel.string = item.itemCfg.desc;
        }
    }
}
