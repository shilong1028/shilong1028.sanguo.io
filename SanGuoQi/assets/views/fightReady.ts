
import TableView from "../tableView/tableView";
import { MyUserData } from "../manager/MyUserData";
import { GeneralInfo } from "../manager/Enum";
import { CfgMgr } from "../manager/ConfigManager";
import { ROOT_NODE } from "../common/rootNode";
import { FightMgr } from "../manager/FightManager";

//武将出战
const {ccclass, property} = cc._decorator;

@ccclass
export default class FightReady extends cc.Component {

    @property(TableView)
    enemyTabelView: TableView = null;

    @property(TableView)
    myTabelView: TableView = null;

    @property(cc.Label)
    descLabel: cc.Label = null;   //武将描述

    @property(cc.Label)
    zhenLabel: cc.Label = null;  //出战/下阵

    @property(cc.Button)
    fightBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:
    selCellIdx: number = -1;   //选中的Cell索引

    fightArr: GeneralInfo[] = new Array();
    generalArr: GeneralInfo[] = new Array();
    enmeyArr: GeneralInfo[] = new Array();

    onLoad () {
        this.clearShowInfo();

        this.fightBtn.interactable = false;
    }

    onDestroy(){
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {
    }

    // update (dt) {}

    onCloseBtn(){
        this.node.removeFromParent(true);
    }

    clearShowInfo(){
        this.descLabel.string = "";
        this.zhenLabel.string = "";
    }

    initBattleInfo(battleId: number){
        let battleConf = CfgMgr.getBattleConf(battleId);
        //cc.log("initBattleInfo(), battleConf = "+JSON.stringify(battleConf));
        if(battleConf){
            //敌将
            for(let i=0; i<battleConf.generals.length; ++i){
                let enemy = new GeneralInfo(battleConf.generals[i].key);   //ret.push({"key":ss[0], "val":parseInt(ss[1])});
                enemy.generalLv = battleConf.generals[i].val;
                enemy.bingCount = enemy.generalLv * 1000;
                this.enmeyArr.push(enemy);
            }

            //敌兵
            for(let i=0; i<battleConf.soliders.length; ++i){
                let enemy = new GeneralInfo(battleConf.soliders[i].key);   //ret.push({"key":ss[0], "val":parseInt(ss[1])});
                enemy.generalLv = 1;
                enemy.bingCount = enemy.generalLv * 1000;
                for(let j=0; j<battleConf.soliders[i].val; j++){
                    this.enmeyArr.push(enemy);
                }
            }

            this.enemyTabelView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
            this.enemyTabelView.initTableView(this.enmeyArr.length, { array: this.enmeyArr, target: this, bClick: false}); 

            this.initGeneralList();
        }
    }

    //刷新武将列表
    initGeneralList(){
        this.generalArr = MyUserData.GeneralList;

        this.myTabelView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
        this.myTabelView.initTableView(this.generalArr.length, { array: this.generalArr, target: this, bClick: true}); 
        this.handleGeneralCellClick(0);   //点击武将
    }

    /**点击武将 */
    handleGeneralCellClick(clickIdx: number, bUpdate:boolean=false){
        if(bUpdate == false && this.selCellIdx == clickIdx){
            return;
        }
        this.selCellIdx = clickIdx;   //选中的Cell索引
        this.clearShowInfo();

        let selGeneralInfo: GeneralInfo = this.generalArr[this.selCellIdx];
        this.descLabel.string = selGeneralInfo.generalCfg.desc;

        if(selGeneralInfo.bReadyFight == true){  //当前出战操作后下阵
            this.zhenLabel.string = "下阵";
        }else{
            this.zhenLabel.string = "出战";
        }

    }

    onZhenBtn(){
        let selGeneralInfo: GeneralInfo = this.generalArr[this.selCellIdx];
        if(selGeneralInfo.bReadyFight == true){  //当前出战操作后下阵
            this.generalArr[this.selCellIdx].bReadyFight = false;
            for(let i=0; i<this.fightArr.length; ++i){
                if(this.generalArr[this.selCellIdx].timeId == this.fightArr[i].timeId){
                    this.fightArr.splice(i, 1);
                    break;
                }
            }
        }else{   //当前未出战
            if(selGeneralInfo.bingCount <= 0){
                ROOT_NODE.showTipsText("武将未领兵，不能出战!");
                return;
            }else{
                this.generalArr[this.selCellIdx].bReadyFight = true;
                this.fightArr.push(this.generalArr[this.selCellIdx]);
            }
        }
        this.handleGeneralCellClick(this.selCellIdx, true);
        if(this.fightArr.length == 0){
            this.fightBtn.interactable = false;
        }else{
            this.fightBtn.interactable = true;
        }
    }

    onFightBtn(){
        this.fightBtn.interactable = false;

        cc.log("出战， this.enmeyArr = "+JSON.stringify(this.enmeyArr)+"; generalArr = "+JSON.stringify(this.fightArr));

        FightMgr.clearAndInitFightData(this.enmeyArr, this.fightArr);   //清除并初始化战斗数据，需要传递敌方武将数组和我方出战武将数组
    }

}
