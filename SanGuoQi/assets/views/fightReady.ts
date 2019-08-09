
import TableView from "../tableView/tableView";
import { MyUserData, MyUserMgr } from "../manager/MyUserData";
import { GeneralInfo, CityInfo, TempFightInfo } from "../manager/Enum";
import { CfgMgr, st_camp_info } from "../manager/ConfigManager";
import { ROOT_NODE } from "../common/rootNode";
import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import GeneralCell from "../common/generalCell";

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
    @property(cc.Label)
    numLabel: cc.Label = null;  //出战数量
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
    selCellSc: GeneralCell = null;  //选中的武将cell

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
                enemy.tempFightInfo = new TempFightInfo(enemy.generalCfg);  //武将战斗临时数据类
                enemy.generalLv = battleConf.generals[i].val;
                enemy.bingCount = GameMgr.getMaxBingCountByLv(enemy.generalLv);
                for(let j=0; j<enemy.generalCfg.skillNum; ++j){
                    let randSkill = FightMgr.getRandomSkill();
                    enemy.skills.push(randSkill);
                }
                this.enmeyArr.push(enemy);
            }

            this.enemyTabelView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
            this.enemyTabelView.initTableView(this.enmeyArr.length, { array: this.enmeyArr, target: this, bShowSel: false}); 

            this.initGeneralList();
        }
    }

    //攻占城池入口
    initCityFight(cityInfo: CityInfo, cityCampCfg: st_camp_info){
        //cc.log("initCityFight(), cityCampCfg = "+JSON.stringify(cityCampCfg));
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
                enemy.tempFightInfo = new TempFightInfo(enemy.generalCfg);  //武将战斗临时数据类
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

        this.enemyTabelView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
        this.enemyTabelView.initTableView(this.enmeyArr.length, { array: this.enmeyArr, target: this, bShowSel: false}); 
    }

    //刷新武将列表
    initGeneralList(){
        this.generalArr = MyUserMgr.getGeneralListClone();  //获取武将列表克隆
        for(let i=0; i<this.generalArr.length; ++i){
            let general = this.generalArr[i];
            general.tempFightInfo = new TempFightInfo(general.generalCfg);  //武将战斗临时数据类

            if(general.generalLv > this.maxGeneralLv){
                this.maxGeneralLv = general.generalLv;
            }
            if(general.generalLv < this.minGeneralLv){
                this.minGeneralLv = general.generalLv;
            }
        }

        this.myTabelView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
        this.myTabelView.initTableView(this.generalArr.length, { array: this.generalArr, target: this, bShowSel: true}); 
    }

    /**点击武将 */
    handleGeneralCellClick(clickIdx: number, cellSc: GeneralCell){
        if(this.selCellIdx == clickIdx){
            return;
        }
        this.selCellIdx = clickIdx;   //选中的Cell索引
        this.selCellSc = cellSc;  //选中的武将cell

        this.showZhenOptUI();  //上下阵操作
    }

    clearOptShowInfo(){
        this.descLabel.string = "";
        this.zhenLabel.string = "";
        this.numLabel.string = "出战数量：0";  
        this.zhenBtnSpr.spriteFrame = this.zhenBtnFrames[0];
    }

    //上下阵操作
    showZhenOptUI(){
        this.clearOptShowInfo();

        let selGeneralInfo: GeneralInfo = this.generalArr[this.selCellIdx];
        this.descLabel.string = selGeneralInfo.generalCfg.desc;

        if(this.selCellSc && this.selCellSc.handelUpdateGeneral){
            this.selCellSc.handelUpdateGeneral(selGeneralInfo);
        }

        if(selGeneralInfo.tempFightInfo.bReadyFight == true){  //当前出战操作后下阵   //武将战斗临时数据类
            this.zhenLabel.string = "下阵";
            this.zhenBtnSpr.spriteFrame = this.zhenBtnFrames[1];
        }else{
            this.zhenLabel.string = "出战";
            this.zhenBtnSpr.spriteFrame = this.zhenBtnFrames[0];
        }

        if(this.fightArr.length == 0){
            this.fightBtn.interactable = false;
            this.numLabel.string = "出战数量：0"; 
        }else{
            this.fightBtn.interactable = true;
            this.numLabel.string = "出战数量："+this.fightArr.length;  
        }
    }

    onZhenBtn(){
        let selGeneralInfo: GeneralInfo = this.generalArr[this.selCellIdx];
        if(selGeneralInfo == null){
            return;
        }
        if(selGeneralInfo.tempFightInfo.bReadyFight == true){  //当前出战操作后下阵 //武将战斗临时数据类
            for(let i=0; i<this.fightArr.length; ++i){
                if(selGeneralInfo.timeId == this.fightArr[i].timeId){
                    this.fightArr.splice(i, 1);
                    break;
                }
            }
            selGeneralInfo.tempFightInfo.bReadyFight = false;
            this.showZhenOptUI();  //当前出战操作后下阵
        }else{   //当前未出战
            if(selGeneralInfo.bingCount <= 200){
                ROOT_NODE.showTipsDialog("武将领兵太少，不能出战！是否跳转部曲界面？", ()=>{
                    GameMgr.showLayer(this.pfUnit);
                    this.node.removeFromParent(true);
                });
            }else if(this.fightArr.length >= 5){
                ROOT_NODE.showTipsText("出战名额（五个）已满!");
            }else{
                selGeneralInfo.tempFightInfo.bReadyFight = true;
                this.fightArr.push(selGeneralInfo);

                this.showZhenOptUI();  //当前出战操作后下阵
            }
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
        cc.log("MyUserData.GeneralList = "+JSON.stringify(MyUserData.GeneralList));
        FightMgr.clearAndInitFightData(this.enmeyArr, this.fightArr, this.fightCityInfo);   //清除并初始化战斗数据，需要传递敌方武将数组和我方出战武将数组
    }
}
