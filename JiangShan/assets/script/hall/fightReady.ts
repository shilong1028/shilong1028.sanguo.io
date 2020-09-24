import GeneralCell from "../comui/general";
import List from "../control/List";
import Radar from "../control/Radar";
import { ROOT_NODE } from "../login/rootNode";
import { AudioMgr } from "../manager/AudioMgr";
import { CfgMgr, GeneralInfo, st_battle_info, st_story_info } from "../manager/ConfigManager";
import { CardInfo, CardTypeArr } from "../manager/Enum";
import { GameMgr } from "../manager/GameManager";
import { MyUserMgr } from "../manager/MyUserData";


//武将出征
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Hall/FightReady")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点
export default class FightReady extends cc.Component {
    @property(List)
    enemyList: List = null;
    @property(List)
    myList: List = null;
    @property(Radar)
    radar: Radar = null;

    @property(cc.Label)
    titleLabel: cc.Label = null; 

    @property(cc.Node)
    infoNode: cc.Node = null;   //武将出战信息选择
    @property(cc.Label)
    zhenPos: cc.Label = null;   //出战位置
    @property(cc.Label)
    bingzhongLbl: cc.Label = null;   //兵种
    @property(cc.Sprite)
    bingzhongSpr: cc.Sprite = null;   
    @property(cc.Label)
    officalLbl: cc.Label = null;   //官职
    @property(cc.Sprite)
    officalSpr: cc.Sprite = null;  

    @property(cc.ProgressBar)
    recruitBar: cc.ProgressBar = null;
    @property(cc.Label)
    recruitCountLbl: cc.Label = null;  //兵力
    @property(cc.Label)
    recruitCostNum: cc.Label = null;  //招募花费
    @property(cc.Button)
    recruitBtn: cc.Button = null;   //招募按钮

    @property([cc.Label])
    attrLabels: cc.Label[] = [];   //等级、血量、智力、攻击、防御

    @property(cc.Label)
    soliderCountLbl: cc.Label = null;  //总兵力
    @property(cc.Label)
    costFoodLbl: cc.Label = null;  //消耗粮草
    @property([cc.Node])
    zhenNode: cc.Node[] = [];   //主将，2前锋，后卫 3侧卫

    // LIFE-CYCLE CALLBACKS:
    generalArr: GeneralInfo[] = [];
    selGeneralIdx: number = -1;  //当前武将索引
    selZhenIdx: number = -1;   //选择的出战位索引

    enemyCardArr: CardInfo[] = [];   //敌方卡牌集合
    myCardArr:CardInfo[] = [];  //我方出战卡牌集合

    recruitMaxCount: number = 500;   //部曲最大兵力
    recruitCurCount: number = 0;    //当前部曲兵力
    recruitCostPrice: number = 0;   //百兵售价

    onLoad () {
        this.enemyList.numItems = 0;
        this.myList.numItems = 0;

        this.selGeneralIdx = -1;
        this.selZhenIdx = -1;   //选择的出战位索引
        this.infoNode.active = false;

        this.soliderCountLbl.string = "出征兵力:0";
        this.costFoodLbl.string = "消耗粮草:0"; 
        this.enemyCardArr = [];   //敌方卡牌集合
        this.myCardArr = [];  //我方出战卡牌集合
        this.generalArr = [];

        this.initZhenNode();
    }

    initZhenNode(){
        for(let i=0; i<7; i++){
            let generalNode = this.zhenNode[i].getChildByName("generalNode");
            if(generalNode){
                generalNode.destroyAllChildren();
            }
            let selNode = this.zhenNode[i].getChildByName("selNode");
            if(selNode){
                selNode.active = false;
            }
            let changeImg = this.zhenNode[i].getChildByName("changeImg");
            if(changeImg){
                changeImg.active = false;
            }
            let addImg = this.zhenNode[i].getChildByName("addImg");
            if(addImg){
                addImg.active = true;
            }
        }
    }

    onDestroy(){
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {
    }

    // update (dt) {}

    /**读取故事剧情战斗 */
    initBattleInfoByStory(taskConf: st_story_info){
        let battleConf:st_battle_info = CfgMgr.getBattleConf(taskConf.battleId);
        if(battleConf){
            this.titleLabel.string = battleConf.name;
            this.enemyCardArr = [];
            //敌方部曲（武将ID-等级） 1004-1;6001-3
            for(let i=0; i<battleConf.enemys.length; i++){
                let generalId = battleConf.enemys["key"];
                let generalLv = battleConf.enemys["val"];
                let generalInfo = new GeneralInfo(generalId);
                generalInfo.generalLv = generalLv;
                generalInfo.bingCount = generalLv * 100 + 500;   //部曲士兵数量

                let cardInfo = new CardInfo(2, generalInfo);
                cardInfo.type = CardTypeArr[this.enemyCardArr.length];   //类型，0普通，1主将，2前锋，3后卫
                this.enemyCardArr.push(cardInfo);
            } 
            //士兵集合（士兵类型-兵力）
            for(let i=0; i<battleConf.soldiers.length; i++){
                let bingzhongId = battleConf.soldiers["key"];
                let bingCount = battleConf.soldiers["val"];
                let generalInfo = new GeneralInfo(bingzhongId);
                generalInfo.bingCount = bingCount;   //部曲士兵数量

                let cardInfo = new CardInfo(2, generalInfo);
                cardInfo.type = CardTypeArr[this.enemyCardArr.length];   //类型，0普通，1主将，2前锋，3后卫
                this.enemyCardArr.push(cardInfo);
            } 

            this.enemyList.numItems = this.enemyCardArr.length;

            this.myCardArr = [];  //我方出战卡牌集合
            this.initGeneralList();
        }
    }

    /**添加或删除我方出战卡牌 */
    updateMyFightCards(generalInfo: GeneralInfo, bAdd:boolean){
        if(!generalInfo || this.selZhenIdx < 0){   //选择的出战位索引
            return;
        }
        if(bAdd){
            generalInfo.state = 1;  //0默认，1出战中，2驻守中
            let cardInfo = new CardInfo(1, generalInfo);
            cardInfo.type = CardTypeArr[this.selZhenIdx];  //类型，0普通，1主将，2前锋，3后卫
            this.myCardArr.push(cardInfo);     
        }else{
            for(let i=0; i<this.myCardArr.length; i++){
                let cardInfo = this.myCardArr[i]
                if(cardInfo.generalInfo.timeId == generalInfo.timeId){
                    generalInfo.state = 0;  //0默认，1出战中，2驻守中
                    this.myCardArr.splice(i, 1);
                    break;
                }
            }
        }
    }

    /** 初始化我方武将列表 */
    initGeneralList(tabIdx: number=0, generalId?: string) {
        this.generalArr = MyUserMgr.getGeneralListClone();  //获取武将列表克隆
        if(!this.generalArr || this.generalArr.length == 0){
            return;
        }
        this.myList.numItems = this.generalArr.length;
        this.myList.selectedId = 0;
    }

    //列表渲染器
    onEnemyListRender(item: cc.Node, idx: number) {
        let info = this.enemyCardArr[idx];
        item.getComponent(GeneralCell).initGeneralData(info.generalInfo);
    }
    //列表渲染器
    onListRender(item: cc.Node, idx: number) {
        let info = this.generalArr[idx];
        item.getComponent(GeneralCell).initGeneralData(info);
    }

    //当列表项被选择...
    onListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!item)
            return;
        if(this.selZhenIdx >= 0){  //选择的出战位索引
            this.updateSelItemInfoByIdx(selectedId);  //显示底部选中道具信息
        }  
    }  

    /**显示选中武将出征信息 */
    updateSelItemInfoByIdx(cellIdx:number){
        this.selGeneralIdx = cellIdx;
        this.infoNode.active = true;
        this.showGeneralAttrRadar();  //显示武将属性雷达图
        this.showRecruitInfo();  //显示招募信息
    }

    /**显示武将属性雷达图 */
    showGeneralAttrRadar(cellIdx:number=-1){
        if(this.radar){
            if(cellIdx < 0){
                cellIdx = this.selGeneralIdx;
            }
            let preArr = [1, 1, 1, 1, 1]
            let attrVal = [0, 0, 0, 0, 0]
            let nameArr = ["等级 ", "血量 ", "智力 ", "攻击 ", "防御 "]
            let info:GeneralInfo = this.generalArr[cellIdx];
            if(info && info.generalCfg){
                attrVal = [ info.generalLv, info.generalCfg.hp, 
                    info.generalCfg.mp, info.generalCfg.atk, info.generalCfg.def
                ];//等级、血量、智力、攻击、防御
                preArr = attrVal;   //每种属性，最高值为100
                preArr[1] = attrVal[1]/10;   //血量最大1000

                if(info.officialId){
                    let officeConf = CfgMgr.getOfficalConf(info.officialId);
                    if(officeConf){
                        this.officalLbl.string = officeConf.name;   //官职
                    }
                }
                this.officalSpr.spriteFrame = ROOT_NODE.officeAtlas.getSpriteFrame(info.officialId.toString());
                this.bingzhongSpr.spriteFrame = ROOT_NODE.commonAtlas.getSpriteFrame("common_"+info.generalCfg.bingzhong);
                this.recruitCostPrice = 0;   //百兵售价
                let recruitConf = CfgMgr.getRecruitConf(info.generalCfg.bingzhong);
                if(recruitConf){
                    this.bingzhongLbl.string = recruitConf.name;   //兵种
                    this.recruitCostPrice = recruitConf.gold;   //百兵售价
                }
            }else{
                this.bingzhongLbl.string = "";   //兵种
                this.bingzhongSpr.spriteFrame = null;  
                this.officalLbl.string = "在野";   //官职
                this.officalSpr.spriteFrame = null; 
            }

            this.radar.changeSidePercent(preArr);
            for(let i=0; i<5; i++){
                this.attrLabels[i].string = nameArr[i] + attrVal[i]
            }
        }
    }

    /** 初始招募信息 */
    showRecruitInfo(cellIdx:number=-1){
        if(cellIdx < 0){
            cellIdx = this.selGeneralIdx;
        }
        let info:GeneralInfo = this.generalArr[cellIdx];
        if(info && info.generalCfg){
            this.recruitMaxCount = 500;   //部曲最大兵力
            this.recruitCurCount = info.bingCount;    //当前部曲兵力
            if(info.officialId){
                let officeConf = CfgMgr.getOfficalConf(info.officialId);
                if(officeConf){
                    this.recruitMaxCount = officeConf.count;   //部曲最大兵力
                }
            }
            this.recruitCountLbl.string = `兵力：${this.recruitCurCount}/${this.recruitMaxCount}`;
            if(info.bingCount >= this.recruitMaxCount){   //部曲满员
                this.recruitBtn.interactable = false;
                this.recruitBar.progress = 1.0;
                this.recruitCostNum.string = "花费：0";  //招募花费
            }else{
                this.recruitBtn.interactable = true;
                this.recruitBar.progress = info.bingCount/this.recruitMaxCount;
                let cost = this.recruitCostPrice*Math.ceil((this.recruitMaxCount-info.bingCount)/100);
                this.recruitCostNum.string = "花费："+cost;  //招募花费
                if(GameMgr.checkGoldEnoughOrTips(cost)){
                    this.recruitCostNum.node.color = cc.color(255, 255, 255)
                }else{
                    this.recruitCostNum.node.color = cc.color(255, 0, 0)
                }
            }
        }
    }

    /**招募 */
    onRecruitBtn(){
        AudioMgr.playBtnClickEffect();
        if(this.selGeneralIdx < 0){
            return;
        }
        let selGeneralInfo:GeneralInfo = this.generalArr[this.selGeneralIdx];
        if(!selGeneralInfo){
            return;
        }

        if(this.recruitCurCount >= this.recruitMaxCount){   //部曲满员
            ROOT_NODE.showTipsText("部曲满员")
        }else{
            let recruitCount = this.recruitMaxCount-this.recruitCurCount;
            let cost = this.recruitCostPrice*Math.ceil(recruitCount/100);
            if(GameMgr.checkGoldEnoughOrTips(cost, true)){
                MyUserMgr.updateUserGold(-cost);   //修改用户金币数量
                let retInfo = MyUserMgr.updateGeneralSoliderCount(selGeneralInfo.generalId, recruitCount, this.recruitMaxCount);   //更新武将兵力
                if(retInfo){
                    this.generalArr[this.selGeneralIdx] = retInfo;
                }
                this.showRecruitInfo();   //显示招募信息
            }
        }
    }

    onCloseBtn(){
        AudioMgr.playBtnClickEffect();
        this.node.destroy();
    }

    /**取消查看信息界面 */
    onCancelBtn(){
        AudioMgr.playBtnClickEffect();
        this.infoNode.active = true;
    }

    /**点击出战 */
    onFightReadyBtn(){
        AudioMgr.playBtnClickEffect();
        let info:GeneralInfo = this.generalArr[this.selGeneralIdx];
        if(info && info.state == 0){ //0默认，1出战中，2驻守中
            this.updateMyFightCards(info, true);   //添加或删除我方出战卡牌
        }else{
            ROOT_NODE.showTipsText("部曲已出战或驻守中")
        }
    }

    /**点击官职 */
    onOfficeClick(){
        AudioMgr.playBtnClickEffect();
        let info:GeneralInfo = this.generalArr[this.selGeneralIdx];
        if(info && info.officialId){
            let officeConf = CfgMgr.getOfficalConf(info.officialId);
            if(officeConf){
                ROOT_NODE.showTipsText(officeConf.desc);
            }
        }
    }
    /**点击兵种 */
    onTypeClick(){
        AudioMgr.playBtnClickEffect();
        let info:GeneralInfo = this.generalArr[this.selGeneralIdx];
        if(info && info.generalCfg){
            let soliderConf = CfgMgr.getGeneralConf(info.generalCfg.bingzhong);
            if(soliderConf){
                ROOT_NODE.showTipsText(soliderConf.desc);
            }
        }
    }

}
