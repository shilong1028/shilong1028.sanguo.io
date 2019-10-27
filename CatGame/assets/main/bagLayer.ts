
import { AudioMgr } from "../manager/AudioMgr";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { NotificationMy } from "../manager/NoticeManager";
import PlayerCell from "./playerCell";
import { GameMgr } from "../manager/GameManager";
import Item from "../common/item";
import BagGrid from "./bagGrid";
import { ROOT_NODE } from "../common/rootNode";
import Skill from "../common/skill";
import { PlayerInfo, BallInfo, SkillInfo, NoticeType } from "../manager/Enum";
import Stuff from "../common/Stuff";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BagLayer extends cc.Component {

    @property(cc.PageView)
    pageView: cc.PageView = null;
    @property(cc.Node)
    equipNode: cc.Node = null;
    @property(cc.Node)
    itemNode: cc.Node = null;
    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Label)
    playerLabel: cc.Label = null; 

    @property(cc.Node)
    leftArrowNode: cc.Node = null;
    @property(cc.Node)
    rightArrowNode: cc.Node = null;
    @property(cc.Node)
    equipAdd: cc.Node = null;
    @property(cc.Node)
    itemAdd: cc.Node = null;

    @property(cc.Prefab)
    pfPlayer: cc.Prefab = null;
    @property(cc.Prefab)
    pfGridBag: cc.Prefab = null;
    @property(cc.Prefab)
    pfSKillLayer: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    curPageIdx: number = -1;  
    curshowPlayerInfo: PlayerInfo = null;   //当前展示的炮台信息
    usedPlayerPage: PlayerCell = null;    //当前使用的炮台

    onLoad () {
        NotificationMy.on(NoticeType.UpdatePlayerList, this.UpdatePlayer, this);   //更新炮台

        this.playerLabel.string = "";
        this.equipAdd.active = false;
        this.itemAdd.active = false;
    }

    onDestroy(){
        NotificationMy.offAll(this);
        this.node.targetOff(this);
    }

    start () {
        this.initPageView();
    }

    // update (dt) {}

    initPageView(){
        for(let i=0; i<MyUserData.playerList.length; ++i){
            let page = cc.instantiate(this.pfPlayer);
            this.pageView.addPage(page);
            page.getComponent(PlayerCell).initPlayerInfo(MyUserData.playerList[i].clone(), this);

            if(MyUserData.playerList[i].playerId == MyUserData.curPlayerId){
                this.curPageIdx = i;
                this.usedPlayerPage = page.getComponent(PlayerCell);   //当前使用的炮台
            }
        }
        this.showCurPlayerInfo();  //显示当前炮台的装备道具等信息
        this.pageView.scrollToPage(this.curPageIdx, 0.01);
    }
    // 监听事件
    onPageEvent (sender, eventType) {
        // 翻页事件
        if (eventType !== cc.PageView.EventType.PAGE_TURNING) {
            return;
        }
        this.curPageIdx = sender.getCurrentPageIndex();   //当前章节索引
        this.showCurPlayerInfo(); 
    } 
    onLeftBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.curPageIdx --;  //当前章节索引
        this.showCurPlayerInfo(); 
        this.pageView.scrollToPage(this.curPageIdx, 0.1);
    }
    onRightBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.curPageIdx ++;   //当前章节ID
        this.showCurPlayerInfo(); 
        this.pageView.scrollToPage(this.curPageIdx, 0.1);
    }
    handleMovePage(){
        if(this.curPageIdx <= 0){
            this.curPageIdx = 0;
            this.leftArrowNode.active = false;
        }else if(this.curPageIdx >= GameMgr.PlayerCount-1){
            this.curPageIdx = GameMgr.PlayerCount-1;
            this.rightArrowNode.active = false;
        }else{
            this.leftArrowNode.active = true;
            this.rightArrowNode.active = true;
        }
    }

    //更新炮台
    UpdatePlayer(playerInfo: PlayerInfo){
        if(playerInfo && this.curshowPlayerInfo && playerInfo.playerId == this.curshowPlayerInfo.playerId){
            this.curshowPlayerInfo = playerInfo;
            this.playerLabel.string = this.curshowPlayerInfo.playerCfg.desc;
            this.showPlayerEquip(this.curshowPlayerInfo.ballId);
            this.showPlayerItem(this.curshowPlayerInfo.itemId);
            this.showPlayerSkill(this.curshowPlayerInfo.playerCfg.skillId);
        }
    }

    //显示当前炮台的装备道具等信息
    showCurPlayerInfo(){
        this.handleMovePage();
        this.playerLabel.string = "";

        this.curshowPlayerInfo = MyUserDataMgr.getPlayerInfoByIdx(this.curPageIdx);
        if(this.curshowPlayerInfo){
            this.playerLabel.string = this.curshowPlayerInfo.playerCfg.desc;
            this.showPlayerEquip(this.curshowPlayerInfo.ballId);
            this.showPlayerItem(this.curshowPlayerInfo.itemId);
            this.showPlayerSkill(this.curshowPlayerInfo.playerCfg.skillId);
        }
    }
    //装备炮弹
    showPlayerEquip(ballId: number){
        let stuffNode = this.equipNode.getChildByName("stuffChildNode");
        if(ballId > 0){
            if(stuffNode == null){
                stuffNode = cc.instantiate(ROOT_NODE.pfStuff);
                stuffNode.name = "stuffChildNode";
                this.equipNode.addChild(stuffNode);
            }
            stuffNode.getComponent(Stuff).setStuffData(new BallInfo(ballId));  //设置地块小球模型数据
            stuffNode.active = true;
            this.equipAdd.active = false;
        }else{
            if(stuffNode){
                stuffNode.active = false;
            }
            this.equipAdd.active = true;
        }
    }
    //饰品道具
    showPlayerItem(itemId: number){
        let itemModel = this.itemNode.getChildByName("itemChildModel");
        if(itemId > 0){
            if(itemModel == null){
                itemModel = cc.instantiate(ROOT_NODE.pfItem);
                itemModel.name = "itemChildModel";
                this.itemNode.addChild(itemModel);
            }
            itemModel.getComponent(Item).initItemById(itemId);  //设置地块道具模型数据
            itemModel.active = true;
            this.itemAdd.active = false;
        }else{
            if(itemModel){
                itemModel.active = false;
            }
            this.itemAdd.active = true;
        }
    }
    //显示技能
    showPlayerSkill(skillId: number){
        let skillModel = this.skillNode.getChildByName("skillChildModel");
        if(skillId > 0){
            if(skillModel == null){
                skillModel = cc.instantiate(ROOT_NODE.pfSkill)
                skillModel.name = "skillChildModel";
                this.skillNode.addChild(skillModel);
            }
            skillModel.getComponent(Skill).initSkillByData(new SkillInfo(skillId));
            skillModel.active = true;
        }else{
            if(skillModel){
                skillModel.active = false;
            }
        }
    }

    onEquipBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.openBagGridByType(0);
    }

    onItemBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.openBagGridByType(1);
    }

    //打开背包界面 //0装备小球，1饰品道具，2技能
    openBagGridByType(gridType: number){
        let layer = GameMgr.showLayer(this.pfGridBag);
        layer.getComponent(BagGrid).initGirdInfo(gridType, this.curshowPlayerInfo.clone());  //0装备小球，1饰品道具，2技能
    }

    onSkillBtn(){
        AudioMgr.playEffect("effect/ui_click");

        GameMgr.showLayer(this.pfSKillLayer);
    }

}
