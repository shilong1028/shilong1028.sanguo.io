
import { PlayerInfo, NoticeType, TipsStrDef } from "../manager/Enum";
import { AudioMgr } from "../manager/AudioMgr";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { ROOT_NODE } from "../common/rootNode";
import BagLayer from "./bagLayer";
import { NotificationMy } from "../manager/NoticeManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerCell extends cc.Component {

    @property(cc.Node)
    maskNode: cc.Node = null;
    @property(cc.Label)
    diamondLabel: cc.Label = null;   //钻石
    @property(cc.Node)
    useBtnNode: cc.Node = null;   //换装
    @property(cc.Node)
    usedNode: cc.Node = null;   //使用中

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
        NotificationMy.on(NoticeType.UpdatePlayerList, this.UpdatePlayer, this);   //更新炮台

        this.maskNode.active = true;
        this.useBtnNode.active = false;
        this.usedNode.active = false;
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
            this.maskNode.active = true;
            this.useBtnNode.active = false;
            this.usedNode.active = false;
        }else{
            this.maskNode.active = false;
            this.updateStateLabel();
        }
        
        let cfg = this.playerInfo.playerCfg;
        this.diamondLabel.string = ""+cfg.cost;
        this.nameLabel.string = cfg.name;
        this.playerSpr.spriteFrame = this.playerAtlas.getSpriteFrame("player_"+this.playerInfo.playerId);
    }

    updateStateLabel(){
        if(this.playerInfo){
            if(this.playerInfo.playerId == MyUserData.curPlayerId){
                this.useBtnNode.active = false;
                this.usedNode.active = true;
            }else{
                this.useBtnNode.active = true;
                this.usedNode.active = false;
            }
        }
    }

    onGoldBtn(){
        AudioMgr.playEffect("effect/ui_buy");
        //购买炮台
        if(this.playerInfo){
            if(MyUserData.DiamondCount >= this.playerInfo.playerCfg.cost){
                MyUserDataMgr.updateUserDiamond(-this.playerInfo.playerCfg.cost);
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
            if(this.playerInfo.ballId == 0){
                ROOT_NODE.showTipsText(TipsStrDef.KEY_WeaponTip2);
            }else{
                MyUserDataMgr.updateCurPlayerById(this.playerInfo.playerId);
                this.initPlayerInfo(this.playerInfo);
    
                if(this.bagLayer){
                    this.bagLayer.usedPlayerPage.updateStateLabel();  //当前使用的炮台
                    this.bagLayer.usedPlayerPage = this;
                }
            }
        }
    }

}
