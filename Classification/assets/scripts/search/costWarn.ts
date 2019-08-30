import { GameMgr } from "../manager/GameManager";


//积分支出界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class CostWarn extends cc.Component {

    @property(cc.Node)
    bgImg: cc.Node = null;

    @property(cc.Node)
    touchNode: cc.Node = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    @property(cc.Node)
    tipsNode: cc.Node = null;

    @property(cc.Button)
    okBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    callback: any = null;
    costNum: number = 0;

    onLoad () {
        //this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);

        this.descLabel.string = "";
        this.tipsNode.active = false;
    }

    start () {

    }

    // update (dt) {}

    touchEnd(event: cc.Touch){
        let pos1 = this.bgImg.convertToNodeSpace(event.getLocation());
        let rect1 = cc.rect(0, 0, this.bgImg.width, this.bgImg.height);
        if(!rect1.contains(pos1)){
            this.onCloseBtn();
        }
    }

    onCloseBtn(){
        this.node.removeFromParent(true);
    }

    onOkBtn(){
        if(GameMgr.GoldCount < this.costNum){
            this.tipsNode.active = true;
        }else{
            if(this.callback){
                GameMgr.updateUserGold(-this.costNum, true);
                this.callback();
            }
        }

        this.node.removeFromParent(true);
    }

    //costType查询分类，0查询 1，2小游戏
    initCostData(costType: number, callback: any){
        this.costNum = 0;
        let costStr = "";
        if(costType == 0){
            this.costNum = 50;
            costStr = "是否要花费"+this.costNum+"积分用于查询垃圾种类?";
        }else if(costType == 1){
            this.costNum = 10;
            costStr = "是否要花费"+this.costNum+"积分用于开始垃圾分类游戏?";
        }else if(costType == 2){
            this.costNum = 10;
            costStr = "是否要花费"+this.costNum+"积分用于开始垃圾识别游戏?";
        }
        this.descLabel.string = costStr;
        this.callback = callback;

        if(GameMgr.GoldCount < this.costNum){
            this.tipsNode.active = true;
            this.okBtn.interactable = false;
        }
    }

}
