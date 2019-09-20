
import { PlayerInfo, NoticeType } from "../manager/Enum";
import { AudioMgr } from "../manager/AudioMgr";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { ROOT_NODE } from "../common/rootNode";
import BagLayer from "./bagLayer";
import { NotificationMy } from "../manager/NoticeManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerCell extends cc.Component {

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
    descLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Sprite)
    playerSpr: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    playerAtlas: cc.SpriteAtlas = null;

    playerInfo : PlayerInfo = null;  
    bagLayer: BagLayer = null;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        NotificationMy.on(NoticeType.UpdatePlayer, this.UpdatePlayer, this);   //更新炮台

        this.goldBtnNode.active = true;
        this.useBtnNode.active = false;
        this.stateLabel.string = "";
        this.atkLabel.string = "攻击：";
        this.baojiLabel.string = "暴击：";
        this.descLabel.string = "";
        this.nameLabel.string = "";
    }

    start () {

    }

    onDestroy(){
        NotificationMy.offAll(this);
        //this.node.targetOff(this);
    }

    // update (dt) {}

    //更新炮台
    UpdatePlayer(playerInfo: PlayerInfo){
        if(playerInfo && this.playerInfo && playerInfo.playerId == this.playerInfo.playerId){
            this.playerInfo = playerInfo;   //只更新了装备、道具、技能等
        }
    }

    initPlayerInfo (playerInfo: PlayerInfo, bagLayer: BagLayer = null) {
        if(playerInfo == null){
            return;
        }
        this.playerInfo = playerInfo;
        if(bagLayer != null){
            this.bagLayer = bagLayer;
        }

        if(this.playerInfo.useState == 0){
            this.goldBtnNode.active = true;
            this.useBtnNode.active = false;
            this.stateLabel.string = "";
        }else{
            this.goldBtnNode.active = false;
            this.updateStateLabel();
        }
        
        let cfg = this.playerInfo.playerCfg;
        this.goldLabel.string = ""+cfg.cost;
        this.atkLabel.string = "攻击+"+cfg.attack_up*100+"%";
        this.baojiLabel.string = "暴击+"+cfg.baoji_up*100+"%";
        this.descLabel.string = cfg.desc;
        this.nameLabel.string = cfg.name;
        this.playerSpr.spriteFrame = this.playerAtlas.getSpriteFrame("player_"+this.playerInfo.playerId);
    }

    updateStateLabel(){
        if(this.playerInfo){
            if(this.playerInfo.playerId == MyUserData.curPlayerId){
                this.useBtnNode.active = false;
                this.stateLabel.string = "使用中";
            }else{
                this.useBtnNode.active = true;
                this.stateLabel.string = "已拥有";
            }
        }
    }

    onGoldBtn(){
        AudioMgr.playEffect("effect/ui_buy");
        //购买炮台
        if(this.playerInfo){
            if(MyUserData.GoldCount >= this.playerInfo.playerCfg.cost){
                MyUserDataMgr.updateUserGold(-this.playerInfo.playerCfg.cost);
                this.playerInfo.useState = 1;
                MyUserDataMgr.updatePlayerFromList(this.playerInfo);   //添加新炮台到拥有的炮列表
                this.initPlayerInfo(this.playerInfo);
            }else{
                ROOT_NODE.showGoldAddDialog();  //获取金币提示框
            }
        }
    }

    onChangeBtn(){
        AudioMgr.playEffect("effect/ui_click");
        //换装炮台
        if(this.playerInfo && this.playerInfo.useState == 1){
            MyUserDataMgr.updateCurPlayerById(this.playerInfo.playerId);
            this.initPlayerInfo(this.playerInfo);

            if(this.bagLayer){
                this.bagLayer.usedPlayerPage.updateStateLabel();  //当前使用的炮台
                this.bagLayer.usedPlayerPage = this;
            }
        }
    }

}
