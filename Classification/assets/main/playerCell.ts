
import { PlayerInfo, NoticeType, TipsStrDef } from "../manager/Enum";
import { AudioMgr } from "../manager/AudioMgr";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { ROOT_NODE } from "../common/rootNode";
import BagLayer from "./bagLayer";
import { NotificationMy } from "../manager/NoticeManager";
import { GameMgr } from "../manager/GameManager";
import { SDKMgr } from "../manager/SDKManager";

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
    updateNode: cc.Node = null;  //升级
    @property(cc.Button)
    updateBtn: cc.Button = null;
    @property(cc.Node)
    usedNode: cc.Node = null;   //使用中

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Sprite)
    playerSpr: cc.Sprite = null;
    @property(cc.Label)
    atkLabel: cc.Label = null;
    @property(cc.Label)
    baojiLabel: cc.Label = null;
    @property(cc.Label)
    lvLabel: cc.Label = null;
    @property(cc.Label)
    lvDesc: cc.Label = null;
    @property(cc.Label)
    lvCost: cc.Label = null;
    @property(cc.Sprite)
    lvIcon: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    playerAtlas: cc.SpriteAtlas = null;
    @property([cc.SpriteFrame])
    iconArr: cc.SpriteFrame[] = [];

    playerInfo : PlayerInfo = null;  
    bagLayer: BagLayer = null;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        NotificationMy.on(NoticeType.UpdatePlayerList, this.UpdatePlayer, this);   //更新炮台

        this.maskNode.active = true;
        this.useBtnNode.active = false;
        this.usedNode.active = false;
        this.updateNode.active = false;
        this.nameLabel.string = "";
        this.atkLabel.string = "";
        this.baojiLabel.string = "";
        this.lvLabel.string = "";
        this.lvDesc.string = "";
        this.lvCost.string = "";
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
            this.initPlayerInfo(this.playerInfo);
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
            this.updateNode.active = false;
        }else{
            this.maskNode.active = false;
            this.updateNode.active = true;
            this.updateStateLabel();
        }
        
        let cfg = this.playerInfo.playerCfg;
        this.diamondLabel.string = ""+cfg.cost;
        this.nameLabel.string = cfg.name;
        this.playerSpr.spriteFrame = this.playerAtlas.getSpriteFrame("player_"+this.playerInfo.playerId);
        
        this.atkLabel.string = "攻击力："+cfg.attack+"+"+Math.floor(cfg.update_atk*(this.playerInfo.level-1));
        this.baojiLabel.string = "暴击率："+(cfg.baoji*100)+"%+"+Math.floor(cfg.baoji*20*(this.playerInfo.level-1))+"%";
        this.lvDesc.string = "每升一级增加攻击力+"+cfg.update_atk+"、增加暴击率+20%，花费：";

        if(this.playerInfo.level == GameMgr.PlayerMaxLv){
            this.lvLabel.string = "等级：Lv"+this.playerInfo.level+"(满级)";
            this.updateBtn.interactable = false;
        }else{
            this.lvLabel.string = "等级：Lv"+this.playerInfo.level;
        }
        
        if(cfg.update_vedio > 0){
            this.lvIcon.spriteFrame = this.iconArr[0];
            this.lvCost.string = "x"+cfg.update_vedio;
        }else if(cfg.update_diamond > 0){
            this.lvIcon.spriteFrame = this.iconArr[1];
            this.lvCost.string = "x"+cfg.update_diamond;
        }else{
            this.lvIcon.spriteFrame = this.iconArr[2];
            this.lvCost.string = "x"+cfg.update_gold;
        }
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
                ROOT_NODE.showTipsText("获得新萌宠");
            }else{
                GameMgr.showGoldAddDialog();  //获取金币提示框
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
                ROOT_NODE.showTipsText("更换出战萌宠");

                if(this.bagLayer){
                    this.bagLayer.usedPlayerPage.updateStateLabel();  //当前使用的炮台
                    this.bagLayer.usedPlayerPage = this;
                }
            }
        }
    }


    onUpdateBtn(){
        AudioMgr.playEffect("effect/ui_click");
        //换装炮台
        if(this.playerInfo && this.playerInfo.useState == 1){
            if(this.playerInfo.level >= GameMgr.PlayerMaxLv){   //最大等级
                ROOT_NODE.showTipsText("最大等级！");
            }else{
                if(this.playerInfo.playerCfg.update_vedio > 0){
                    SDKMgr.showVedioAd("UpLvVedioId", ()=>{
                        //失败
                    }, ()=>{
                        this.handleUpdate();  //成功
                    }); 
                }else if(this.playerInfo.playerCfg.update_diamond > 0){
                    if(MyUserData.DiamondCount >= this.playerInfo.playerCfg.update_diamond){
                        MyUserDataMgr.updateUserDiamond(-this.playerInfo.playerCfg.update_diamond);
                        this.handleUpdate();
                    }else{
                        GameMgr.showGoldAddDialog();  //获取金币提示框
                    }
                }else{
                    if(MyUserData.GoldCount >= this.playerInfo.playerCfg.update_gold){
                        MyUserDataMgr.updateUserGold(-this.playerInfo.playerCfg.update_gold);
                        this.handleUpdate();
                    }else{
                        GameMgr.showGoldAddDialog();  //获取金币提示框
                    }
                }


            }
        }
    }

    handleUpdate(){
        ROOT_NODE.showTipsText("宠物升级成功！");
        this.playerInfo.level ++;
        MyUserDataMgr.updatePlayerFromList(this.playerInfo);  //更新炮台到拥有的炮列表
        this.initPlayerInfo(this.playerInfo);

        if(this.bagLayer){
            this.bagLayer.usedPlayerPage.updateStateLabel();  //当前使用的炮台
            this.bagLayer.usedPlayerPage = this;
        }
    }

}
