
import { PlayerInfo, NoticeType, TipsStrDef } from "../manager/Enum";
import { AudioMgr } from "../manager/AudioMgr";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { ROOT_NODE } from "../common/rootNode";
import BagLayer from "./bagLayer";
import { NotificationMy } from "../manager/NoticeManager";
import { GameMgr } from "../manager/GameManager";
import { SDKMgr } from "../manager/SDKManager";
import { LDKey, LDMgr } from "../manager/StorageManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerCell extends cc.Component {
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    getTimeLabel: cc.Label = null;    //领养时间
    @property(cc.Sprite)
    playerSpr: cc.Sprite = null;
    @property(cc.Label)
    atkLabel: cc.Label = null;
    @property(cc.Label)
    baojiLabel: cc.Label = null;
    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Node)
    maskNode: cc.Node = null;
    @property(cc.Label)
    openDesc: cc.Label = null;    //解锁描述
    @property(cc.Button)
    openVedioBtn: cc.Button = null;
    @property(cc.Button)
    openShareBtn: cc.Button = null;

    @property(cc.Node)
    useBtnNode: cc.Node = null;   //出战
    @property(cc.Node)
    usedNode: cc.Node = null;   //使用中

    @property(cc.Node)
    updateNode: cc.Node = null;  //升级
    @property(cc.Button)
    updateBtn: cc.Button = null;
    @property(cc.Label)
    lvDesc: cc.Label = null;
    @property(cc.Label)
    lvCost: cc.Label = null;
    @property(cc.Sprite)
    lvIcon: cc.Sprite = null;

    @property(cc.Node)
    updateTab: cc.Node = null;
    @property(cc.Node)
    feedTab: cc.Node = null;

    @property(cc.Node)
    feedNode: cc.Node = null;   //投喂
    @property(cc.Button)
    feedBtn: cc.Button = null;
    @property(cc.Button)
    feedVedioBtn: cc.Button = null;   //视频补喂
    @property(cc.Label)
    feedCost: cc.Label = null;
    @property([cc.Toggle])
    toggleArr: cc.Toggle[] = [];


    @property(cc.SpriteAtlas)
    playerAtlas: cc.SpriteAtlas = null;
    @property([cc.SpriteFrame])
    iconArr: cc.SpriteFrame[] = [];

    playerInfo : PlayerInfo = null;  
    bagLayer: BagLayer = null;
    feedIdx: number = 0;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        NotificationMy.on(NoticeType.UpdatePlayerList, this.UpdatePlayer, this);   //更新炮台

        this.getTimeLabel.string = "领养时间"
        this.nameLabel.string = "";
        this.atkLabel.string = "攻击力";
        this.baojiLabel.string = "暴击率";
        this.lvLabel.string = "等级";

        this.maskNode.active = true;
        this.openDesc.string = ""
        this.openVedioBtn.node.active = true;
        this.openShareBtn.node.active = false; 

        this.useBtnNode.active = false;
        this.usedNode.active = false;

        this.updateNode.active = false;
        this.lvDesc.string = "";
        this.lvCost.string = "";

        this.updateTab.active = false;
        this.feedTab.active = false;

        this.feedNode.active = false;
        this.feedBtn.node.active = false;
        this.feedVedioBtn.node.active = false;  //视频补喂
        this.feedCost.string = "x1000"
        for(let i=0; i<3; i++){
            this.toggleArr[i].isChecked = false;
        } 
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

        let cfg = this.playerInfo.playerCfg;
        this.nameLabel.string = cfg.name;
        this.playerSpr.spriteFrame = this.playerAtlas.getSpriteFrame("player_"+this.playerInfo.playerId);
        
        this.atkLabel.string = "攻击力："+cfg.attack+"+"+Math.floor(cfg.update_atk*(this.playerInfo.level-1));
        this.baojiLabel.string = "暴击率："+(cfg.baoji*100)+"%+"+Math.floor(cfg.baoji*20*(this.playerInfo.level-1))+"%";
        this.lvLabel.string = "等级：Lv"+this.playerInfo.level;

        this.getTimeLabel.string = "领养时间"

        if(this.playerInfo.useState == 0){   //未获得
            this.maskNode.active = true;
            this.useBtnNode.active = false;
            this.usedNode.active = false;
            this.updateTab.active = false;
            this.feedTab.active = false;
            this.updateNode.active = false;
            this.feedNode.active = false;

            if(SDKMgr.bShowVedioBtn){   //显示视频或分享按钮)
                this.openVedioBtn.interactable = true; 
                this.openVedioBtn.node.active = true;
                this.openShareBtn.node.active = false; 
            }else{
                this.openShareBtn.interactable = true; 
                this.openShareBtn.node.active = true;
                this.openVedioBtn.node.active = false; 
            }

            if(MyUserData.myPlayerCount == 1){  //拥有宠物
                this.openDesc.string = `解锁第二只萌宠需看十次视频。当前观看次数：${MyUserData.playerOpenVedioCOunt}/10`
            }else if(MyUserData.myPlayerCount == 0){
                this.openDesc.string = "解锁萌宠需看一次视频或分享一次游戏"
            }else{
                this.openDesc.string = "已经拥有两只萌宠"
                this.openVedioBtn.node.active = false;
                this.openShareBtn.node.active = false; 
            }
        }else{  //已获得
            this.maskNode.active = false;
            this.updateStateLabel();   //出战或使用中

            if(this.playerInfo.level > GameMgr.FeedLv){   //3级以上需要投喂
                this.updateTab.active = true;
                this.feedTab.active = true;
                this.updateFeedInfo();   //投喂信息
            }else{
                this.updateTab.active = false;
                this.feedTab.active = false;
                this.updateLevelInfo();   //升级信息
            }

        }
    }

    /**打开升级页签 */
    onUpdateTab(){
        AudioMgr.playEffect("effect/ui_click");
        this.updateLevelInfo();   //升级信息
    }
    /**打开投喂页签 */
    onFeedTab(){
        AudioMgr.playEffect("effect/ui_click");
        this.updateFeedInfo();   //投喂信息
    }

    /**出战或使用中 */
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
    /**出战 */
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

    /**升级信息 */
    updateLevelInfo(){
        this.updateNode.active = true;
        this.feedNode.active = false;

        let cfg = this.playerInfo.playerCfg;
        this.lvDesc.string = "每升一级增加攻击力+"+cfg.update_atk+"、增加暴击率+20%，花费：";

        if(this.playerInfo.level == GameMgr.PlayerMaxLv){
            this.lvLabel.string = "等级：Lv"+this.playerInfo.level+"(满级)";
            this.updateBtn.interactable = false;
        }else{
            this.lvLabel.string = "等级：Lv"+this.playerInfo.level;

            if(this.playerInfo.level <= 5){   //金币升级
                this.lvIcon.spriteFrame = this.iconArr[2];
                this.lvCost.string = "x"+cfg.update_gold;
            }else if(this.playerInfo.level <= 10){   //钻石升级
                this.lvIcon.spriteFrame = this.iconArr[1];
                this.lvCost.string = "x"+cfg.update_diamond;
            }else{    //视频升级
                this.lvIcon.spriteFrame = this.iconArr[0];
                this.lvCost.string = "x"+cfg.update_vedio;
            }
        }
    }
    /**点击升级 */
    onUpdateBtn(){
        AudioMgr.playEffect("effect/ui_click");
        //换装炮台
        if(this.playerInfo && this.playerInfo.useState == 1){
            if(this.playerInfo.level >= GameMgr.PlayerMaxLv){   //最大等级
                ROOT_NODE.showTipsText("最大等级！");
            }else{
                if(this.playerInfo.level <= 5){   //金币升级
                    if(MyUserData.GoldCount >= this.playerInfo.playerCfg.update_gold){
                        MyUserDataMgr.updateUserGold(-this.playerInfo.playerCfg.update_gold);
                        this.handleUpdate();
                    }else{
                        GameMgr.showGoldAddDialog();  //获取金币提示框
                    }
                }else if(this.playerInfo.level <= 10){   //钻石升级
                    if(MyUserData.DiamondCount >= this.playerInfo.playerCfg.update_diamond){
                        MyUserDataMgr.updateUserDiamond(-this.playerInfo.playerCfg.update_diamond);
                        this.handleUpdate();
                    }else{
                        GameMgr.showGoldAddDialog();  //获取金币提示框
                    }
                }else{    //视频升级
                    SDKMgr.showVedioAd("UpLvVedioId", ()=>{
                        //失败
                    }, ()=>{
                        this.handleUpdate();  //成功
                    }); 
                }
            }
        }
    }
    /**升级成功 */
    handleUpdate(){
        ROOT_NODE.showTipsText("宠物升级成功！");
        this.playerInfo.level ++;
        if(this.playerInfo.level == GameMgr.FeedLv){  
            this.playerInfo.feedTime = new Date().getTime();
        }
        MyUserDataMgr.updatePlayerFromList(this.playerInfo);  //更新炮台到拥有的炮列表
        this.initPlayerInfo(this.playerInfo);

        if(this.bagLayer){
            this.bagLayer.usedPlayerPage.updateStateLabel();  //当前使用的炮台
            this.bagLayer.usedPlayerPage = this;
        }
    }

    /**投喂信息 */
    updateFeedInfo(){
        this.feedNode.active = true;
        this.updateNode.active = false;

        let bFeedVedio:boolean=false
        this.feedIdx = -1;
        for(let i=0; i<3; i++){
            if(this.playerInfo.feedVals[i] > 0){
                this.toggleArr[i].isChecked = true
            }else{
                this.toggleArr[i].isChecked = false;
                this.feedIdx = i;

                if(this.playerInfo.useState == 1 && this.playerInfo.level > GameMgr.FeedLv){   //3级以上需要投喂
                    if(GameMgr.isSameDayWithCurTime(this.playerInfo.feedTime) == false){  //同一天
                        bFeedVedio = true;
                    }
                }
                break;
            }
        } 
        
        if(bFeedVedio){
            this.feedBtn.node.active = false;
            this.feedVedioBtn.node.active = true;  //视频补喂
            this.feedVedioBtn.interactable = true;
        }else{
            this.feedBtn.node.active = true;
            this.feedBtn.interactable = true;
            this.feedVedioBtn.node.active = false;  //视频补喂
            if(this.feedIdx < 0){
                this.feedBtn.interactable = false;
            }
        }
        if(this.playerInfo.level <= 5){  
            this.feedCost.string = "x1000"
        }else if(this.playerInfo.level <= 10){   
            this.feedCost.string = "x2000"
        }else{    
            this.feedCost.string = "x3000"
        }
    }
    /**补喂 */
    onFeedBtn(){
        AudioMgr.playEffect("effect/ui_click");
        let goldCost = 1000;
        if(this.playerInfo.level <= 5){  
            goldCost = 1000;
        }else if(this.playerInfo.level <= 10){   
            goldCost = 2000;
        }else{    
            goldCost = 3000;
        }
        if(MyUserData.GoldCount >= goldCost){
            this.feedBtn.interactable = false; 
            MyUserDataMgr.updatePlayerFeedInfo(this.playerInfo, this.feedIdx, goldCost, false); 
            this.initPlayerInfo(this.playerInfo);
        }else{
            GameMgr.showGoldAddDialog();  //获取金币提示框
        }
    }
    /**看视频补喂 */
    onFeedVedioBtn(){
        AudioMgr.playEffect("effect/ui_click");
        let goldCost = 1000;
        if(this.playerInfo.level <= 5){  
            goldCost = 1000;
        }else if(this.playerInfo.level <= 10){   
            goldCost = 2000;
        }else{    
            goldCost = 3000;
        }
        if(MyUserData.GoldCount >= goldCost*2){
            this.feedVedioBtn.interactable = false; 

            SDKMgr.showVedioAd("GoldVedioId", ()=>{
                this.feedVedioBtn.interactable = true; 
            }, ()=>{
                MyUserDataMgr.updatePlayerFeedInfo(this.playerInfo, this.feedIdx, goldCost, true);
                if(MyUserDataMgr.checkPlayerFeedState() != true){
                    this.initPlayerInfo(this.playerInfo);
                }   //重新检测是否有宠物需要补喂
            });  
        }else{
            GameMgr.showGoldAddDialog();  //获取金币提示框
        }
    }

    /**看视频 */
    onVedioBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.openVedioBtn.interactable = false; 

        SDKMgr.showVedioAd("GoldVedioId", ()=>{
            this.openVedioBtn.interactable = true; 
        }, ()=>{
            if(MyUserData.playerOpenVedioCOunt == 9){
                this.handleGetNewPet();    //成功
            }else{
                MyUserDataMgr.updatePlayerOpenVedioCOunt();   //观看视频解锁第二只宠物的已看视频次数
                this.openDesc.string = `解锁第二只萌宠需看十次视频。当前观看次数：${MyUserData.playerOpenVedioCOunt}/10`
                this.openVedioBtn.interactable = true; 
            }
        });  
    }

    onShareBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.openShareBtn.interactable = false; 

        SDKMgr.shareGame(TipsStrDef.KEY_Share, (succ:boolean)=>{
            this.openShareBtn.interactable = true; 
            this.handleGetNewPet();    //成功
        }, this);
    }

    handleGetNewPet(){
        //购买炮台
        if(this.playerInfo){
            this.playerInfo.useState = 1;
            MyUserDataMgr.updatePlayerFromList(this.playerInfo);   //添加新炮台到拥有的炮列表
            this.initPlayerInfo(this.playerInfo);
            ROOT_NODE.showTipsText("获得新萌宠");
        }
    }

}
