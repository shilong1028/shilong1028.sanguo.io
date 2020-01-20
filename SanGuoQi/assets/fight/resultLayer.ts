import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import TableView from "../tableView/tableView";
import { MyUserMgr } from "../manager/MyUserData";
import { ItemInfo } from "../manager/Enum";
import { SDKMgr } from "../manager/SDKManager";

//战斗结算
const {ccclass, property} = cc._decorator;

@ccclass
export default class ResultLayer extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Button)
    vedioBtn: cc.Button = null;

    @property(cc.SpriteFrame)
    winFrames: cc.SpriteFrame = null;

    @property(TableView)
    fightTableView: TableView = null;

    @property(TableView)
    rewardTableView: TableView = null;

    // LIFE-CYCLE CALLBACKS:
    totalKillCount: number = 0;   //杀敌总数
    balancedExp: number = 0;   //均衡经验值（总杀敌数的一半用于每个武将均衡经验增加，武将杀敌的另一半用于自己经验增加）
    rewardItems: ItemInfo[] = null;

    onLoad () {
        this.vedioBtn.node.active = false;
    }

    start () {
        if(FightMgr.FightWin == true){  //战斗胜利或失败
            this.vedioBtn.node.active = true;
            this.icon.spriteFrame = this.winFrames;

            if(FightMgr.fightCityInfo){   //攻占城池
                MyUserMgr.updateMyCityIds(FightMgr.fightCityInfo.cityId, true);   
            }

            this.initRewardList();
        }

        let fightGeneralList = FightMgr.battleGeneralArr;
        //cc.log("fightGeneralList = "+JSON.stringify(fightGeneralList));
        this.totalKillCount = 0;
        for(let i=0; i<fightGeneralList.length; ++i){
            this.totalKillCount += fightGeneralList[i].tempFightInfo.killCount;
        }
        this.balancedExp = Math.ceil(this.totalKillCount/10/fightGeneralList.length);   //均衡经验值（总杀敌数的一半用于每个武将均衡经验增加，武将杀敌的另一半用于自己经验增加）

        for(let i=0; i<fightGeneralList.length; ++i){
            let general = fightGeneralList[i].clone();
            let exp = Math.floor(general.tempFightInfo.killCount/10);
            exp += this.balancedExp;   //均衡经验值（总杀敌数的一半用于每个武将均衡经验增加，武将杀敌的另一半用于自己经验增加）
            general.generalExp += exp;
            general.updateLvByExp();
            general.tempFightInfo = null;
            MyUserMgr.updateGeneralList(general, false);
        }
        MyUserMgr.saveGeneralList();

        this.fightTableView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
        this.fightTableView.initTableView(fightGeneralList.length, { array: fightGeneralList, target: this });
    }

    // update (dt) {}

    /**展示奖励列表 */
    initRewardList(){  
        //cc.log("showRewardList(), rewards = "+JSON.stringify(rewards));
        let items = new Array();
        items.push({"key":6001, "val":500});   //金币
        items.push({"key":6003, "val":500});   //粮草
        /**
         * 游戏中，每千名士兵每月（自然日24h）消耗300石粮300金币（30000斤粮草30000贯钱），即每人每月消耗30斤粮30贯钱。
            游戏中，每个游戏月（自然日24h）金币、粮草的税率分别为每万人100金币、每万人100石、即每人每月需要向官府缴纳1贯钱、1斤粮。
         */
        if(FightMgr.fightCityInfo){   //攻城
            let tempVal = Math.floor(FightMgr.fightCityInfo.cityCfg.population/5000)+1;
            items[0].val = tempVal*50;
            items[1].val = tempVal*20;
        }

        let rewards: ItemInfo[] = GameMgr.getItemArrByKeyVal(items);   //通过配置keyVal数据砖块道具列表
        this.rewardItems = rewards;
        this.rewardTableView.initTableView(rewards.length, { array: rewards, target: this }); 

        GameMgr.receiveRewards(rewards);   //领取奖励
    }

    onBackBtn(){
        if(GameMgr.curTaskConf.type == 5){   //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗 6学习技能 7攻城掠地
            GameMgr.handleStoryShowOver(GameMgr.curTaskConf);  //任务宣读(第一阶段）完毕处理
        }
        GameMgr.gotoMainScene();   //进入主场景
    }

    /**视频免费按钮 */
    onVedioBtn(){
        this.vedioBtn.interactable = false;

        SDKMgr.showVedioAd("GuanKaVedioId", ()=>{
            this.vedioBtn.interactable = true;   //失败
        }, ()=>{
            GameMgr.receiveRewards(this.rewardItems);   //领取奖励  //成功
            this.onBackBtn();
        }); 
    }
}
