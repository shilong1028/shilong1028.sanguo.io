import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import TableView from "../tableView/tableView";

//战斗结算
const {ccclass, property} = cc._decorator;

@ccclass
export default class ResultLayer extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    winFrames: cc.SpriteFrame = null;

    @property(TableView)
    tableView: TableView = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    start () {
        if(FightMgr.FightWin == true){  //战斗胜利或失败
            this.icon.spriteFrame = this.winFrames;
        }

        let fightGeneralList = FightMgr.getFightScene().myDeadCards;
        //注意，以下三个列表数据是同步的，即三个都正确记录了战斗之后的剩余兵力及杀敌数
        //cc.log("fightGeneralList = "+JSON.stringify(fightGeneralList));
        // cc.log("list = "+JSON.stringify(FightMgr.battleGeneralArr));
        // cc.log("allList = "+JSON.stringify(MyUserData.GeneralList));

        this.tableView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
        this.tableView.initTableView(fightGeneralList.length, { array: fightGeneralList, target: this });
    }

    // update (dt) {}

    onBackBtn(){
        if(GameMgr.curTaskConf.type == 5){   //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗
            GameMgr.handleStoryShowOver(GameMgr.curTaskConf);  //任务宣读(第一阶段）完毕处理
        }

        let fightGeneralList = FightMgr.getFightScene().myDeadCards;
        for(let i=0; i<fightGeneralList.length; ++i){
            fightGeneralList[i].generalInfo.killCount = 0;
        }

        cc.director.loadScene("mainScene");
    }
}
