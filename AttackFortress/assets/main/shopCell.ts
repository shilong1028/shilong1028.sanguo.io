import viewCell from "../tableView/viewCell";
import { BallInfo } from "../manager/Enum";
import Stuff from "./Stuff";
import { GameMgr } from "../manager/GameManager";
import { AudioMgr } from "../manager/AudioMgr";
import { MyUserData } from "../manager/MyUserData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopCell extends viewCell {

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
    
    // LIFE-CYCLE CALLBACKS:

    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        if (index >= data.array.length) {
            //不显示
            this.cellData = null;  
            this.node.active = false;
            return;
        }

        this.onSelected(this._selectState);

        //if(reload){
            this.data = data;   //{ array: list, target: x.js }
            this.cellIdx = index; 
            this.cellData = this.data.array[this.cellIdx];
            this.node.active = true;
        //}

        this.goldBtn.interactable = false;
        this.goldLabel.string = "";
        this.atkLabel.string = "攻击力：";
        this.baojiLabel.string = "暴击率：";
        this.sellLabel.string = "回收价："

        if(this.nStuff == null){
            let stuff = cc.instantiate(GameMgr.getMainScene().pfStuff);
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
        AudioMgr.playEffect("effect/hecheng/ui_buy");
        GameMgr.getMainScene().handleBuyStuff(this.cellData);   //购买小球
    }
}
