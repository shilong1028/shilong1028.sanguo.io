import viewCell from "../tableView/viewCell";
import { PlayerInfo } from "../manager/Enum";
import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerCell extends viewCell {

    @property(cc.Node)
    goldBtnNode: cc.Node = null;
    @property(cc.Label)
    goldLabel: cc.Label = null;
    @property(cc.Node)
    useBtnNode: cc.Node = null;

    @property(cc.Label)
    stateLabel: cc.Label = null;
    @property(cc.Label)
    atkLabel: cc.Label = null;
    @property(cc.Label)
    baojiLabel: cc.Label = null;
    @property(cc.Label)
    itemLabel: cc.Label = null;
    @property(cc.Label)
    cannonLabel: cc.Label = null;
    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Sprite)
    playerSpr: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    playerAtlas: cc.SpriteAtlas = null;

    data : any = null;
    cellData : PlayerInfo = null;  
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

        if(this.cellData.useState == 0){
            this.goldBtnNode.active = true;
            this.useBtnNode.active = false;
            this.stateLabel.string = "";
        }else{
            this.goldBtnNode.active = false;
            if(this.cellData.useState == 2){
                this.useBtnNode.active = false;
                this.stateLabel.string = "使用中";
            }else{
                this.useBtnNode.active = true;
                this.stateLabel.string = "已拥有";
            }
        }
        
        let cfg = this.cellData.playerCfg;
        this.goldLabel.string = ""+cfg.cost;
        this.atkLabel.string = "提升攻击："+cfg.attack_up*100+"%";
        this.baojiLabel.string = "提升暴击："+cfg.baoji_up*100+"%";
        this.itemLabel.string = "道具孔位："+cfg.itemCount+"个";
        this.cannonLabel.string = "适用炮弹："+cfg.cannon[0]+"-"+cfg.cannon[1]+"级";
        this.descLabel.string = cfg.desc;
        this.nameLabel.string = cfg.name;
        this.playerSpr.spriteFrame = this.playerAtlas.getSpriteFrame("player_"+this.cellData.playerId);
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
        GameMgr.getMainScene().handleBuyPlayer(this.cellData);   //购买炮台
    }

    onChangeBtn(){
        AudioMgr.playEffect("effect/ui_click");
        GameMgr.getMainScene().handleChangePlayer(this.cellIdx);   //换装炮台
    }
}
