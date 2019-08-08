import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import TableView from "../tableView/tableView";
import { MyUserMgr } from "../manager/MyUserData";
import { ItemInfo } from "../manager/Enum";

//战斗结算
const {ccclass, property} = cc._decorator;

@ccclass
export default class ResultLayer extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    winFrames: cc.SpriteFrame = null;

    @property(TableView)
    fightTableView: TableView = null;

    @property(TableView)
    rewardTableView: TableView = null;

    // LIFE-CYCLE CALLBACKS:
    totalKillCount: number = 0;   //杀敌总数
    balancedExp: number = 0;   //均衡经验值（总杀敌数的一半用于每个武将均衡经验增加，武将杀敌的另一半用于自己经验增加）

    onLoad () {}

    start () {
        if(FightMgr.FightWin == true){  //战斗胜利或失败
            this.icon.spriteFrame = this.winFrames;

            if(FightMgr.fightCityInfo){   //攻占城池
                MyUserMgr.updateMyCityIds(FightMgr.fightCityInfo.cityId, true);   
            }

            this.initRewardList();
        }

        let fightGeneralList = FightMgr.getFightScene().myDeadCards;
        //注意，以下三个列表数据是同步的，即三个都正确记录了战斗之后的剩余兵力及杀敌数
        //cc.log("fightGeneralList = "+JSON.stringify(fightGeneralList));
        // cc.log("list = "+JSON.stringify(FightMgr.battleGeneralArr));
        // cc.log("allList = "+JSON.stringify(MyUserData.GeneralList));
        this.totalKillCount = 0;
        for(let i=0; i<fightGeneralList.length; ++i){
            this.totalKillCount += fightGeneralList[i].generalInfo.killCount;
        }
        this.balancedExp = Math.ceil(this.totalKillCount/10/fightGeneralList.length);   //均衡经验值（总杀敌数的一半用于每个武将均衡经验增加，武将杀敌的另一半用于自己经验增加）

        this.fightTableView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
        this.fightTableView.initTableView(fightGeneralList.length, { array: fightGeneralList, target: this });
    }

    // update (dt) {}

    /**展示奖励列表 */
    initRewardList(){  
        //cc.log("showRewardList(), rewards = "+JSON.stringify(rewards));
        let items = new Array();
        items.push({"key":6001, "val":1000});

        let rewards: ItemInfo[] = GameMgr.getItemArrByKeyVal(items);   //通过配置keyVal数据砖块道具列表
        this.rewardTableView.initTableView(rewards.length, { array: rewards, target: this }); 

        GameMgr.receiveRewards(rewards);   //领取奖励
    }

    onBackBtn(){
        if(GameMgr.curTaskConf.type == 5){   //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗 6学习技能 7攻城掠地
            GameMgr.handleStoryShowOver(GameMgr.curTaskConf);  //任务宣读(第一阶段）完毕处理
        }

        let fightGeneralList = FightMgr.getFightScene().myDeadCards;
        for(let i=0; i<fightGeneralList.length; ++i){
            let exp = Math.floor(fightGeneralList[i].generalInfo.killCount/10);
            exp += this.balancedExp;   //均衡经验值（总杀敌数的一半用于每个武将均衡经验增加，武将杀敌的另一半用于自己经验增加）
            fightGeneralList[i].generalInfo.generalExp += exp;
            fightGeneralList[i].generalInfo.updateLvByExp();

            fightGeneralList[i].generalInfo.killCount = 0;
        }
        MyUserMgr.saveGeneralList();

        cc.director.loadScene("mainScene");
    }
}
