import GeneralCell from "../comui/general";
import List from "../control/List";
import Radar from "../control/Radar";
import { ROOT_NODE } from "../login/rootNode";
import { AudioMgr } from "../manager/AudioMgr";
import { CfgMgr, GeneralInfo, st_battle_info, st_story_info } from "../manager/ConfigManager";
import { CardInfo, CardTypeArr, CardTypeNameArr } from "../manager/Enum";
import { GameMgr } from "../manager/GameManager";
import { MyUserData, MyUserMgr } from "../manager/MyUserData";


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
    nameLabel: cc.Label = null;   //武将名称
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

    @property(cc.Node)
    fightBtn: cc.Node = null;  //出征按钮
    @property(cc.Label)
    soliderCountLbl: cc.Label = null;  //总兵力
    @property(cc.Label)
    costFoodLbl: cc.Label = null;  //消耗粮草
    @property([cc.Node])
    zhenNode: cc.Node[] = [];   //主将，2前锋，后卫 3侧卫

    @property([cc.Label])
    attrLabels: cc.Label[] = [];   //等级、血量、智力、攻击、防御

    // LIFE-CYCLE CALLBACKS:
    generalArr: GeneralInfo[] = [];
    selGeneralIdx: number = -1;  //当前武将索引
    selZhenIdx: number = -1;   //选择的出战位索引

    enemyCardArr: CardInfo[] = [];   //敌方卡牌集合
    myCardArr:CardInfo[] = [];  //我方出战卡牌集合

    recruitMaxCount: number = 500;   //部曲最大兵力
    recruitCurCount: number = 0;    //当前部曲兵力
    recruitCostPrice: number = 0;   //百兵售价

    fightReadySoliderCount:number = 0;  //出兵数量

    onLoad () {
        this.enemyList.numItems = 0;
        this.myList.numItems = 0;

        this.selGeneralIdx = -1;
        this.selZhenIdx = -1;   //选择的出战位索引
        this.infoNode.active = false;
        this.fightBtn.active = true;  //出征按钮

        this.fightReadySoliderCount = 0;  //出兵数量
        this.soliderCountLbl.string = "出征兵力:0";
        this.costFoodLbl.string = "消耗粮草:0"; 
        this.costFoodLbl.node.color = cc.color(255, 255, 255)
        this.enemyCardArr = [];   //敌方卡牌集合
        this.myCardArr = [];  //我方出战卡牌集合
        this.generalArr = [];

        this.initZhenNode();
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
        cc.log("读取故事剧情战斗 battleConf = "+JSON.stringify(battleConf))
        if(battleConf){
            this.titleLabel.string = battleConf.name;
            this.enemyCardArr = [];
            //敌方部曲（武将ID-等级） 1004-1;6001-3
            for(let i=0; i<battleConf.enemys.length; i++){
                let enmeyObj = battleConf.enemys[i];
                let generalId = enmeyObj["key"];
                let generalLv = enmeyObj["val"];
                let generalInfo = new GeneralInfo(generalId);
                generalInfo.generalLv = generalLv;
                generalInfo.bingCount = generalLv * 100 + 500;   //部曲士兵数量
                generalInfo.state = 1;  //0默认，1出战中，2驻守中

                let cardInfo = new CardInfo(2, generalInfo);
                cardInfo.type = CardTypeArr[this.enemyCardArr.length];   //类型，0普通，1主将，2前锋，3后卫
                this.enemyCardArr.push(cardInfo);
            } 
            //士兵集合（士兵类型-兵力）
            for(let i=0; i<battleConf.soldiers.length; i++){
                let soldierObj = battleConf.soldiers[i];  //{"key":"403","val":1000}
                let bingzhongId = soldierObj["key"];
                let bingCount = soldierObj["val"];
                let generalInfo = new GeneralInfo(bingzhongId);
                generalInfo.bingCount = bingCount;   //部曲士兵数量
                generalInfo.state = 1;  //0默认，1出战中，2驻守中

                let cardInfo = new CardInfo(2, generalInfo);
                cardInfo.type = CardTypeArr[this.enemyCardArr.length];   //类型，0普通，1主将，2前锋，3后卫
                this.enemyCardArr.push(cardInfo);
            } 

            cc.log("敌方部曲 this.enemyCardArr = "+JSON.stringify(this.enemyCardArr))
            this.enemyList.numItems = this.enemyCardArr.length;
        }

        this.myCardArr = [];  //我方出战卡牌集合
        this.initGeneralList();
    }

    /** 初始化我方武将列表 */
    initGeneralList() {
        this.generalArr = MyUserMgr.getGeneralListClone();  //获取武将列表克隆
        cc.log("初始化我方武将列表 this.generalArr = "+JSON.stringify(this.generalArr))
        if(!this.generalArr || this.generalArr.length == 0){
            return;
        }
        this.myList.numItems = this.generalArr.length;
        this.myList.selectedId = null;
    }
    /**更新武将列表出战状态 */
    updateGeneralFightState(info: GeneralInfo){
        for(let i=0; i<this.generalArr.length; i++){
            if(this.generalArr[i].timeId == info.timeId){
                this.generalArr[i].state = info.state;  //0默认，1出战中，2驻守中
                break;
            }
        }
    }

    //列表渲染器
    onEnemyListRender(item: cc.Node, idx: number) {
        if(!item) return;
        let info = this.enemyCardArr[idx];
        item.getComponent(GeneralCell).initGeneralData(info.generalInfo);
    }
    //列表渲染器
    onListRender(item: cc.Node, idx: number) {
        if(!item) return;
        let info = this.generalArr[idx];
        item.getComponent(GeneralCell).initGeneralData(info);
    }

    //当列表项被选择...
    onListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!item) return;
        this.updateSelItemInfoByIdx(selectedId);  //显示底部选中道具信息
    }  

    /**显示选中武将出征信息 */
    updateSelItemInfoByIdx(cellIdx:number){
        this.selGeneralIdx = cellIdx;
        this.infoNode.active = false;   //打开时先关闭再打开
        this.infoNode.active = true;
        this.showGeneralAttrRadar();  //显示武将属性雷达图
        this.showRecruitInfo();  //显示招募信息
    }

    /**显示武将属性雷达图 */
    showGeneralAttrRadar(){
        if(this.radar && this.selGeneralIdx >= 0){
            let preArr = [1, 1, 1, 1, 1]
            let attrVal = [0, 0, 0, 0, 0]
            let nameArr = ["等级 ", "血量 ", "智力 ", "攻击 ", "防御 "]
            let info:GeneralInfo = this.generalArr[this.selGeneralIdx];
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
    showRecruitInfo(){
        if(this.selGeneralIdx < 0){
            return;
        }

        if(this.selZhenIdx >= 0){
            this.zhenPos.string = "出战位置："+CardTypeNameArr[this.selZhenIdx];   //出战位置
        }else{
            this.zhenPos.string = "出战位置：未选择"; 
        }
        this.nameLabel.string = "武将信息";   //武将名称

        let info:GeneralInfo = this.generalArr[this.selGeneralIdx];
        cc.log("showRecruitInfo 初始招募信息 info = "+JSON.stringify(info))
        if(info && info.generalCfg){
            this.nameLabel.string = info.generalCfg.name + "信息";   //武将名称
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
                this.recruitBar.progress = 1.0;
                this.recruitCostNum.string = "花费：0";  //招募花费
                this.recruitCostNum.node.color = cc.color(255, 255, 255)
            }else{
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

    /**点击阵节点 */
    onZhenBtn(sender: any, customData: string){
        AudioMgr.playBtnClickEffect();
        let zhenIdx = parseInt(customData)-1;
        cc.log(" 阵 zhenIdx = "+zhenIdx+"; this.selZhenIdx = "+this.selZhenIdx)
        if(this.selZhenIdx == zhenIdx){
            return;
        }

        let oldZhenNode = this.zhenNode[this.selZhenIdx];
        if(oldZhenNode){
            let selNode = oldZhenNode.getChildByName("selNode");
            if(selNode){
                selNode.active = false;
            }
            let changeImg = oldZhenNode.getChildByName("changeImg");
            if(changeImg){
                changeImg.active = false;
            }
            let generalNode = oldZhenNode.getChildByName("generalNode");
            let generalChild = null;
            if(generalNode){
                generalChild = generalNode.getChildByName("generalChild");
            }
            let addImg = oldZhenNode.getChildByName("addImg");
            if(addImg){
                if(generalChild){
                    addImg.active = false;
                }else{
                    addImg.active = true;
                }
            }
        }

        this.selZhenIdx = zhenIdx;   //出战位置

        let selZhenNode = this.zhenNode[this.selZhenIdx];
        if(selZhenNode){
            let selNode = selZhenNode.getChildByName("selNode");
            if(selNode){
                selNode.active = true;
            }
            let generalNode = selZhenNode.getChildByName("generalNode");
            let generalChild = null;
            if(generalNode){
                generalChild = generalNode.getChildByName("generalChild");
            }
            let changeImg = selZhenNode.getChildByName("changeImg");
            if(changeImg){
                if(generalChild){
                    changeImg.active = true;
                }else{
                    changeImg.active = false;
                }
            }
            let addImg = selZhenNode.getChildByName("addImg");
            if(addImg){
                if(generalChild){
                    addImg.active = false;
                }else{
                    addImg.active = true;
                }
            }
        }
    }

    /**初始化阵位信息 */
    initZhenNode(){
        this.removeZhenGeneral();   //回收武将头像到缓存池 默认全部回收
        for(let i=0; i<7; i++){
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

        //默认选中主将阵位
        this.selZhenIdx = 0;   //选择的出战位索引
        let selZhenNode = this.zhenNode[this.selZhenIdx];
        let selNode = selZhenNode.getChildByName("selNode");
        if(selNode){
            selNode.active = true;
        }
    }

    /**回收武将头像到缓存池 默认全部回收*/
    removeZhenGeneral(idx:number=-1){
        cc.log("removeZhenGeneral 回收武将头像到缓存池 idx = "+idx)
        if(idx == -1){   //全部
            for(let i=0; i<7; i++){
                let zhenNode = this.zhenNode[i];
                cc.log("i = "+i+"; zhenNode = "+zhenNode)
                if(zhenNode){
                    let generalNode = zhenNode.getChildByName("generalNode");
                    if(generalNode){
                        let generalChild = generalNode.getChildByName("generalChild");
                        if(generalChild){
                            ROOT_NODE.removeGeneral(generalChild);
                        }
                    }
                }
            }
        }else{
            let zhenNode = this.zhenNode[idx];
            if(zhenNode){
                let generalNode = zhenNode.getChildByName("generalNode");
                if(generalNode){
                    let generalChild = generalNode.getChildByName("generalChild");
                    if(generalChild){
                        ROOT_NODE.removeGeneral(generalChild);
                    }
                }
                let changeImg = zhenNode.getChildByName("changeImg");
                if(changeImg){
                    changeImg.active = false;
                }
                let addImg = zhenNode.getChildByName("addImg");
                if(addImg){
                    addImg.active = true;
                }
            }
        }
    }

    /**添加武将头像到阵位 */
    addZhenGeneral(idx:number, generalInfo:GeneralInfo){
        if(idx >= 0 && generalInfo){
            let generalNode = this.zhenNode[idx].getChildByName("generalNode");
            if(generalNode){
                let generalChild = generalNode.getChildByName("generalChild");
                if(generalChild){
                    generalChild.getComponent(GeneralCell).setCellClickEnable(false);
                    generalChild.getComponent(GeneralCell).initGeneralData(generalInfo);
                }else{
                    let generalChild = ROOT_NODE.createrGeneral(generalInfo);
                    generalChild.name = "generalChild";
                    generalNode.addChild(generalChild);
                }
            }
            let changeImg = this.zhenNode[idx].getChildByName("changeImg");
            if(changeImg){
                changeImg.active = true;
            }
            let addImg = this.zhenNode[idx].getChildByName("addImg");
            if(addImg){
                addImg.active = false;
            }
        }
    }

    /**点击出战 */
    onFightReadyBtn(){
        AudioMgr.playBtnClickEffect();
        if(this.selZhenIdx < 0){   //选择的出战位索引
            ROOT_NODE.showTipsText("请先选择出战阵位，再选择武将出战")
            this.infoNode.active = false;
            return;
        }

        let generalNode = this.zhenNode[this.selZhenIdx].getChildByName("generalNode");
        if(!generalNode){
            cc.log("出战阵位异常，无法添加")
            return;
        }

        let info:GeneralInfo = this.generalArr[this.selGeneralIdx];
        if(!info){
            cc.log("武将数据异常")
            return;
        }
        if(info.state == 0){ //0默认，1出战中，2驻守中
            let minBing = info.generalLv > 3 ? 1000 : 500
            if(info.bingCount < minBing){
                ROOT_NODE.showTipsText("部曲兵力小于"+minBing+", 无法出战，请先补充兵力")
            }else{
                if(info.generalId == "1101" && this.selZhenIdx != 0){
                    ROOT_NODE.showTipsText("刘亭出战时必须担任主将")
                    this.infoNode.active = false;
                    return;
                }
                let generalChild = generalNode.getChildByName("generalChild");
                if(generalChild){
                    ROOT_NODE.showTipsDialog("出战阵位已有武将部曲出战，确定要替换？", ()=>{
                        this.switchMyFightCards(info, this.selZhenIdx);   //替换已出站卡牌
                        this.infoNode.active = false;
                    });
                }else{
                    this.addMyFightCards(info, this.zhenNode[this.selZhenIdx]);   //添加我方出战卡牌
                    this.infoNode.active = false;
                }
            }
        }else if(info.state == 1){
            let oldZhenIdx = -1;
            for(let i=0; i<7; i++){
                let generalNode = this.zhenNode[i].getChildByName("generalNode");
                if(generalNode){
                    let generalChild = generalNode.getChildByName("generalChild");
                    if(generalChild){
                        let oldCellSpript = generalChild.getComponent(GeneralCell);
                        if(oldCellSpript && oldCellSpript.generalInfo){
                            if(oldCellSpript.generalInfo.timeId == info.timeId){
                                oldZhenIdx = i;
                                break;
                            }
                        }
                    }
                }
            }
            if(oldZhenIdx >= 0 && oldZhenIdx != this.selZhenIdx){
                let generalChild = generalNode.getChildByName("generalChild");
                if(generalChild){
                    ROOT_NODE.showTipsText("武将部曲已经在本阵位出战中, 且指定阵位也有武将部曲出战")
                }else{
                    ROOT_NODE.showTipsDialog("武将部曲已经处于出战状态，确定要变换阵位？", ()=>{
                        this.switchMyFightCardZhenIdx(info, oldZhenIdx, this.selZhenIdx);   //变换武将出战位
                        this.infoNode.active = false;
                    });
                }

            }else{
                ROOT_NODE.showTipsText("武将部曲已经在本阵位出战中")
            }
        }else if(info.state == 2){
            ROOT_NODE.showTipsText("武将部曲驻守中，不可出战")
        }
    }

    /**添加或删除我方出战卡牌 */
    addMyFightCards(generalInfo: GeneralInfo, zhenNode:cc.Node){
        cc.log("addMyFightCards generalInfo =" + JSON.stringify(generalInfo))
        if(!generalInfo || !zhenNode|| generalInfo.state > 0){   //选择的出战位索引
            return;
        }

        generalInfo.state = 1;  //0默认，1出战中，2驻守中
        this.updateGeneralFightState(generalInfo);  //更新武将列表出战状态

        let cardInfo = new CardInfo(1, generalInfo);
        cardInfo.type = CardTypeArr[this.selZhenIdx];  //类型，0普通，1主将，2前锋，3后卫
        this.myCardArr.push(cardInfo);     
        this.fightReadySoliderCount += generalInfo.bingCount;  //出兵数量
        cc.log("addMyFightCards this.myCardArr =" + JSON.stringify(this.myCardArr))

        this.myList.updateAll();   //更新我方武将列表显示
        this.soliderCountLbl.string = "出征兵力:"+this.fightReadySoliderCount;
        let cost = Math.ceil(this.fightReadySoliderCount*0.1)
        this.costFoodLbl.string = "消耗粮草:"+cost; 
        if(GameMgr.checkFoodEnoughOrTips(cost)){
            this.costFoodLbl.node.color = cc.color(255, 255, 255)
        }else{
            this.costFoodLbl.node.color = cc.color(255, 0, 0)
        }

        this.addZhenGeneral(this.selZhenIdx, generalInfo);   //添加武将头像到阵位
    }

    /**点击取消出战 */
    onDelFightReadyBtn(){
        AudioMgr.playBtnClickEffect();
        if(this.selZhenIdx < 0){   //选择的出战位索引
            ROOT_NODE.showTipsText("请先选择出战阵位，再删除武将出战")
            return;
        }
        let generalNode = this.zhenNode[this.selZhenIdx].getChildByName("generalNode");
        if(generalNode){
            let generalChild = generalNode.getChildByName("generalChild");
            if(!generalChild){
                ROOT_NODE.showTipsText("出战阵位上无出战武将")
                return;
            }
        }else{
            cc.log("出战阵位异常，无法删除出战武将")
            return;
        }

        let info:GeneralInfo = this.generalArr[this.selGeneralIdx];
        if(info && info.state == 1){ //0默认，1出战中，2驻守中
            this.delMyFightCards(info, this.selZhenIdx);   //添加或删除我方出战卡牌
        }else{
            ROOT_NODE.showTipsText("非出战部曲")
        }
    }

    /**删除我方出战卡牌 */
    delMyFightCards(generalInfo: GeneralInfo, zhenIdx:number){
        cc.log("addMyFightCards generalInfo =" + JSON.stringify(generalInfo))
        if(!generalInfo || zhenIdx < 0 || generalInfo.state != 1){   //选择的出战位索引
            return;
        }

        for(let i=0; i<this.myCardArr.length; i++){
            let cardInfo = this.myCardArr[i]
            if(cardInfo.generalInfo.timeId == generalInfo.timeId){
                generalInfo.state = 0;  //0默认，1出战中，2驻守中
                this.updateGeneralFightState(generalInfo);  //更新武将列表出战状态
                this.fightReadySoliderCount -= generalInfo.bingCount;  //出兵数量
                this.myCardArr.splice(i, 1);
                break;
            }
        }
        cc.log("delMyFightCards this.myCardArr =" + JSON.stringify(this.myCardArr))

        this.myList.updateAll();   //更新我方武将列表显示
        this.soliderCountLbl.string = "出征兵力:"+this.fightReadySoliderCount;
        let cost = Math.ceil(this.fightReadySoliderCount*0.1)
        this.costFoodLbl.string = "消耗粮草:"+cost; 
        if(GameMgr.checkFoodEnoughOrTips(cost)){
            this.costFoodLbl.node.color = cc.color(255, 255, 255)
        }else{
            this.costFoodLbl.node.color = cc.color(255, 0, 0)
        }

        this.removeZhenGeneral(zhenIdx);   //回收武将头像到缓存池 默认全部回收
    }

    /**替换我方已出战卡牌 */
    switchMyFightCards(newInfo: GeneralInfo, zhenIdx:number){
        cc.log("switchMyFightCards newInfo =" + JSON.stringify(newInfo))
        if(!newInfo || zhenIdx < 0){   //选择的出战位索引
            return;
        }

        let generalNode = this.zhenNode[zhenIdx].getChildByName("generalNode");
        if(generalNode){
            let generalChild = generalNode.getChildByName("generalChild");
            if(generalChild){
                //先移除旧的武将卡牌数据
                let oldCellSpript = generalChild.getComponent(GeneralCell);
                if(oldCellSpript && oldCellSpript.generalInfo){
                    let oldInfo = oldCellSpript.generalInfo;
                    for(let i=0; i<this.myCardArr.length; i++){
                        let cardInfo = this.myCardArr[i]
                        if(cardInfo.generalInfo.timeId == oldInfo.timeId){
                            oldInfo.state = 0;  //0默认，1出战中，2驻守中
                            this.updateGeneralFightState(oldInfo);  //更新武将列表出战状态
                            this.fightReadySoliderCount -= oldInfo.bingCount;  //出兵数量
                            this.myCardArr.splice(i, 1);
                            break;
                        }
                    }
                    cc.log("switchMyFightCards 先移除旧的武将卡牌 this.myCardArr =" + JSON.stringify(this.myCardArr))
                }else{
                    cc.log("获取阵位旧的武将信息异常")
                }
            }
            this.addMyFightCards(newInfo, this.zhenNode[zhenIdx]);   //添加我方出战卡牌
        }
    }

    /**变换武将出战位 */
    switchMyFightCardZhenIdx(info: GeneralInfo, oldZhenIdx:number, zhenIdx:number){
        cc.log("switchMyFightCardZhenIdx 变换武将出战位 oldZhenIdx = "+oldZhenIdx+"; zhenIdx = "+zhenIdx)
        let generalNode = this.zhenNode[zhenIdx].getChildByName("generalNode");
        if(!generalNode){
            return;
        }
        let generalChild = generalNode.getChildByName("generalChild");
        if(generalChild){
            ROOT_NODE.showTipsText("武将部曲已经在本阵位出战中, 且指定阵位也有武将部曲出战")
        }

        if(info && oldZhenIdx != zhenIdx && zhenIdx >= 0){
            this.removeZhenGeneral(oldZhenIdx);   //回收武将头像到缓存池 默认全部回收

            // info.state = 1;  //0默认，1出战中，2驻守中
            // this.updateGeneralFightState(info);  //更新武将列表出战状态

            for(let i=0; i<this.myCardArr.length; i++){
                let cardInfo = this.myCardArr[i]
                if(cardInfo.generalInfo.timeId == info.timeId){
                    this.myCardArr[i].type = CardTypeArr[zhenIdx];  //类型，0普通，1主将，2前锋，3后卫
                    break;
                }
            }

            this.myList.updateAll();   //更新我方武将列表显示
            this.addZhenGeneral(zhenIdx, info);   //添加武将头像到阵位
        }
    }

    /**点击出征 */
    onFightBtn(){
        AudioMgr.playBtnClickEffect();

        let generalNode = this.zhenNode[0].getChildByName("generalNode");
        if(generalNode){
            let generalChild = generalNode.getChildByName("generalChild");
            if(!generalChild){
                ROOT_NODE.showTipsText("未选定主将，无法出征")
                return;
            }
        }

        let maxCount = Math.min(MyUserData.GeneralList.length, 7);
        if(this.myCardArr.length < maxCount){
            ROOT_NODE.showTipsDialog("出战名额未满，还可继续添加出战武将，确定要开始战斗？", ()=>{
                this.handleFight();
            });
        }else{
            let generalNode = this.zhenNode[3].getChildByName("generalNode");
            if(generalNode){
                let generalChild = generalNode.getChildByName("generalChild");
                if(!generalChild){
                    ROOT_NODE.showTipsDialog("未选定后卫武将保护辎重粮草，战斗中粮仓可能会被敌军攻陷，降低我军士气，确定要开始战斗？", ()=>{
                        this.handleFight();
                    });
                    return;
                }
            }

            let generalNode1 = this.zhenNode[1].getChildByName("generalNode");
            let generalNode2 = this.zhenNode[2].getChildByName("generalNode");
            if(generalNode1 && generalNode2){
                let generalChild1 = generalNode1.getChildByName("generalChild");
                let generalChild2 = generalNode2.getChildByName("generalChild");
                if(!generalChild1 && !generalChild2){
                    ROOT_NODE.showTipsDialog("两个前锋阵位均未设置武将，确定要开始战斗？", ()=>{
                        this.handleFight();
                    });
                    return;
                }
            }

            this.handleFight();
        }
    }
    handleFight(){
        this.fightBtn.active = false;  //出征按钮
        cc.log("出战， this.enemyCardArr = "+JSON.stringify(this.enemyCardArr));
        cc.log("this.myCardArr = "+JSON.stringify(this.myCardArr));
        this.removeZhenGeneral();  //回收武将头像到缓存池 默认全部回收  //不知为什么在onDestory循环会报错

        //FightMgr.clearAndInitFightData(this.enmeyArr, this.fightArr, this.fightCityInfo);   //清除并初始化战斗数据，需要传递敌方武将数组和我方出战武将数组
    }

    onCloseBtn(){
        AudioMgr.playBtnClickEffect();
        this.removeZhenGeneral();  //回收武将头像到缓存池 默认全部回收   //不知为什么在onDestory循环会报错
        this.node.destroy();
    }

    onAddFoodBtn(){
        AudioMgr.playBtnClickEffect();
        GameMgr.showGoldAddDialog();
    }

    /**取消查看信息界面 */
    onCancelBtn(){
        AudioMgr.playBtnClickEffect();
        this.infoNode.active = false;
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
