import viewCell from "../tableView/viewCell";
import { BallInfo, NoticeType } from "../manager/Enum";
import Stuff from "./Stuff";
import { GameMgr } from "../manager/GameManager";
import { AudioMgr } from "../manager/AudioMgr";
import BallShopLayer from "./ballShopLayer";
import { MyUserData } from "../manager/MyUserData";
import { ROOT_NODE } from "../common/rootNode";
import { NotificationMy } from "../manager/NoticeManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BallShopCell extends viewCell {

    @property(cc.Button)
    goldBtn: cc.Button = null;
    @property(cc.Label)
    goldLabel: cc.Label = null;

    @property(cc.Label)
    atkLabel: cc.Label = null;
    @property(cc.Label)
    baojiLabel: cc.Label = null;
    @property(cc.Label)
    sellLabel: cc.Label = null;

    @property(cc.Node)
    stuffNode: cc.Node = null;

    nStuff: Stuff = null;

    data : any = null;
    cellData : BallInfo = null;  
    cellIdx : number = -1;  

    targetSc: BallShopLayer = null;

    
    // LIFE-CYCLE CALLBACKS:

    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        if (index >= data.array.length) {
            //不显示
            this.cellData = null;  
            this.node.active = false;
            return;
        }

        //if(reload){
            this.data = data;   //{ array: list, target: x.js }
            this.targetSc = this.data.target;
            this.cellIdx = index; 
            this.cellData = this.data.array[this.cellIdx];
            this.node.active = true;
        //}

        this.onSelected(this._selectState);

        if(this.nStuff == null){
            let stuff = cc.instantiate(this.targetSc.pfStuff);
            this.stuffNode.addChild(stuff);
            this.nStuff = stuff.getComponent(Stuff);
        }
        this.nStuff.setStuffAndName(this.cellData);

        this.goldLabel.string = ""+this.cellData.cannonCfg.cost;
        this.atkLabel.string = "攻击力："+this.cellData.cannonCfg.attack;
        this.baojiLabel.string = "暴击率："+this.cellData.cannonCfg.baoji;
        this.sellLabel.string = "回收价："+this.cellData.cannonCfg.sell;
    }

    onSelected(bSel){
        if(bSel){

        }else{

        }
    }

    //被点击时相应的方法
    clicked () {      
        this.onSelected(true);
    }

    onGoldBtn(){
        AudioMgr.playEffect("effect/ui_buy");
        let ballInfo = this.cellData;
        if(ballInfo){
            if(MyUserData.GoldCount >= ballInfo.cannonCfg.cost){
                if(MyUserData.ballList.length >= MyUserData.blockCount){
                    ROOT_NODE.showTipsText("合成网格中可用地块已满，无法购买！请解雇无用的对象后重新购买。");
                }else{
                    NotificationMy.emit(NoticeType.BuyAddBall, ballInfo);   //购买小球
                }
            }else{
                ROOT_NODE.showGoldAddDialog();  //获取金币提示框
            }
        }
    }
}
