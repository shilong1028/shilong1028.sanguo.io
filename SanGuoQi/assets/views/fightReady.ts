
import TableView from "../tableView/tableView";
import { MyUserData } from "../manager/MyUserData";
import { GeneralInfo, CityInfo } from "../manager/Enum";
import { CfgMgr, st_camp_info } from "../manager/ConfigManager";
import { ROOT_NODE } from "../common/rootNode";
import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";

//武将出战
const {ccclass, property} = cc._decorator;

@ccclass
export default class FightReady extends cc.Component {

    @property(TableView)
    enemyTabelView: TableView = null;
    @property(TableView)
    myTabelView: TableView = null;

    @property(cc.Label)
    titleLabel: cc.Label = null;  //标题
    @property(cc.Label)
    descLabel: cc.Label = null;   //武将描述
    @property(cc.Label)
    zhenLabel: cc.Label = null;  //出战/下阵
    @property(cc.Button)
    fightBtn: cc.Button = null;
    @property(cc.Sprite)
    zhenBtnSpr: cc.Sprite = null;   //上下阵纹理
    @property([cc.SpriteFrame])
    zhenBtnFrames: cc.SpriteFrame[] = new Array(2);

    @property(cc.Prefab)
    pfUnit: cc.Prefab = null;  //武将部曲界面

    // LIFE-CYCLE CALLBACKS:
    selCellIdx: number = -1;   //选中的Cell索引

    fightArr: GeneralInfo[] = new Array();
    generalArr: GeneralInfo[] = new Array();
    enmeyArr: GeneralInfo[] = new Array();

    maxGeneralLv: number = 1;
    minGeneralLv: number = 100;
    fightCityInfo: CityInfo = null;

    onLoad () {
        this.titleLabel.string = "备战";
        this.fightBtn.interactable = false;

        this.clearOptShowInfo();
    }

    onDestroy(){
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {
    }

    // update (dt) {}

    onCloseBtn(){
        this.removeFightState();  //移除出战位标识
        this.node.removeFromParent(true);
    }

    //故事剧情战斗入口
    initBattleInfo(battleId: number){
        let battleConf = CfgMgr.getBattleConf(battleId);
        //cc.log("initBattleInfo(), battleConf = "+JSON.stringify(battleConf));
        if(battleConf){
            this.titleLabel.string = battleConf.name;
            //敌将
            for(let i=0; i<battleConf.generals.length; ++i){
                let enemy = new GeneralInfo(battleConf.generals[i].key);   //ret.push({"key":ss[0], "val":parseInt(ss[1])});
                enemy.generalLv = battleConf.generals[i].val;
                enemy.bingCount = GameMgr.getMaxBingCountByLv(enemy.generalLv);
                for(let j=0; j<enemy.generalCfg.skillNum; ++j){
                    let randSkill = FightMgr.getRandomSkill();
                    enemy.skills.push(randSkill);
                }
                this.enmeyArr.push(enemy);
            }

            this.enemyTabelView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
            this.enemyTabelView.initTableView(this.enmeyArr.length, { array: this.enmeyArr, target: this, bEnemy: true}); 

            this.initGeneralList();
        }
    }

    //点中敌将
    handleEnemyCellClick(clickIdx: number){
        let enemyInfo: GeneralInfo = this.enmeyArr[clickIdx];
        this.descLabel.string = "敌将 " + enemyInfo.generalCfg.desc;
    }

    //攻占城池入口
    initCityFight(cityInfo: CityInfo, cityCampCfg: st_camp_info){
        cc.log("initCityFight(), cityCampCfg = "+JSON.stringify(cityCampCfg));
        this.fightCityInfo = cityInfo;
        this.initGeneralList();

        let campGeneralIds = cityCampCfg.generals;
        let count = Math.min(5, campGeneralIds.length);
        let offset = campGeneralIds.length - count;
        if(offset > 0){
            count += Math.floor(Math.random()*(offset - 0.1));
        }
        if(count > 6){
            count = 6;
        }

        if(this.maxGeneralLv < this.minGeneralLv){
            this.minGeneralLv = this.maxGeneralLv;
        }
        let offsetLv = (this.maxGeneralLv - this.minGeneralLv)*1.0;

        this.enmeyArr = new Array();
        let selIdxs = new Array();
        while(count > 0){
            let randIdx = Math.floor(Math.random()*(campGeneralIds.length - 0.1));
            let bCreateCard = true;
            for(let i=0; i<selIdxs.length; ++i){
                if(randIdx == selIdxs[i]){
                    bCreateCard = false;
                    break;
                }
            }
            if(bCreateCard == true){
                count --;
                selIdxs.push(randIdx);
                let randGeneralId = campGeneralIds[randIdx];
                let enemy = new GeneralInfo(randGeneralId);   //ret.push({"key":ss[0], "val":parseInt(ss[1])});
                enemy.generalLv = this.maxGeneralLv - Math.floor(Math.random()*offsetLv) - 1;
                if(enemy.generalLv < 1){
                    enemy.generalLv = 1;
                }
                enemy.bingCount = GameMgr.getMaxBingCountByLv(enemy.generalLv);
                for(let j=0; j<enemy.generalCfg.skillNum/2; ++j){
                    let randSkill = FightMgr.getRandomSkill();
                    enemy.skills.push(randSkill);
                }
                this.enmeyArr.push(enemy);
            }
        }

        this.enemyTabelView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
        this.enemyTabelView.initTableView(this.enmeyArr.length, { array: this.enmeyArr, target: this, bEnemy: true}); 
    }

    //刷新武将列表
    initGeneralList(){
        this.generalArr = MyUserData.GeneralList;
        for(let i=0; i<this.generalArr.length; ++i){
            this.generalArr[i].bReadyFight = false;
            if(this.generalArr[i].generalLv > this.maxGeneralLv){
                this.maxGeneralLv = this.generalArr[i].generalLv;
            }
            if(this.generalArr[i].generalLv < this.minGeneralLv){
                this.minGeneralLv = this.generalArr[i].generalLv;
            }
        }

        this.myTabelView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
        this.myTabelView.initTableView(this.generalArr.length, { array: this.generalArr, target: this, bEnemy: false}); 
        this.handleGeneralCellClick(0);   //点击武将
    }

    /**点击武将 */
    handleGeneralCellClick(clickIdx: number, bUpdate:boolean=false){
        if(bUpdate == false && this.selCellIdx == clickIdx){
            return;
        }
        this.selCellIdx = clickIdx;   //选中的Cell索引
        this.clearOptShowInfo();

        let selGeneralInfo: GeneralInfo = this.generalArr[this.selCellIdx];
        this.descLabel.string = selGeneralInfo.generalCfg.desc;

        if(selGeneralInfo.bReadyFight == true){  //当前出战操作后下阵
            this.zhenLabel.string = "下阵";
            this.zhenBtnSpr.spriteFrame = this.zhenBtnFrames[1];
        }else{
            this.zhenLabel.string = "出战";
            this.zhenBtnSpr.spriteFrame = this.zhenBtnFrames[0];
        }
    }

    clearOptShowInfo(){
        this.descLabel.string = "";
        this.zhenLabel.string = "";
        this.zhenBtnSpr.spriteFrame = this.zhenBtnFrames[0];
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
            if(selGeneralInfo.bingCount <= 200){
                ROOT_NODE.showTipsDialog("武将领兵太少，不能出战！是否跳转部曲界面？", ()=>{
                    GameMgr.showLayer(this.pfUnit);
                    this.removeFightState();  //移除出战位标识
                    this.node.removeFromParent(true);
                });
                return;
            }else if(this.fightArr.length >= 5){
                ROOT_NODE.showTipsText("出战名额（五个）已满!");
            }else{
                this.generalArr[this.selCellIdx].bReadyFight = true;
                this.generalArr[this.selCellIdx].killCount = 0;
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
        let maxCount = Math.min(MyUserData.GeneralList.length, 5);
        if(this.fightArr.length < maxCount){
            ROOT_NODE.showTipsDialog("出战名额未满，还可继续添加出战武将，确定要开始战斗？", ()=>{
                this.handleFight();
            });
        }else{
            this.handleFight();
        }
    }

    handleFight(){
        this.fightBtn.interactable = false;
        cc.log("出战， this.enmeyArr = "+JSON.stringify(this.enmeyArr)+"; generalArr = "+JSON.stringify(this.fightArr));
        this.removeFightState();  //移除出战位标识
        FightMgr.clearAndInitFightData(this.enmeyArr, this.fightArr, this.fightCityInfo);   //清除并初始化战斗数据，需要传递敌方武将数组和我方出战武将数组
    }

    //移除出战位标识
    removeFightState(){
        for(let i=0; i<this.fightArr.length; ++i){
            this.fightArr[i].bReadyFight = false;
        }
    }

}
