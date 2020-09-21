import GeneralCell from "../comui/general";
import List from "../control/List";
import Radar from "../control/Radar";
import { ROOT_NODE } from "../login/rootNode";
import { AudioMgr } from "../manager/AudioMgr";
import { CfgMgr, GeneralInfo } from "../manager/ConfigManager";
import { TaskType } from "../manager/Enum";
import { GameMgr } from "../manager/GameManager";
import { MyUserMgr } from "../manager/MyUserData";
import { NoticeMgr, NoticeType } from "../manager/NoticeManager";


//武将部曲
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Hall/GeneralLayer")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点
export default class GeneralLayer extends cc.Component {
    @property(List)
    list: List = null;
    @property(Radar)
    radar: Radar = null;

    @property(cc.Label)
    descLabel: cc.Label = null;   //武将描述
    @property(cc.Label)
    bingzhongLbl: cc.Label = null;   //兵种
    @property(cc.Sprite)
    bingzhongSpr: cc.Sprite = null;   
    @property(cc.Label)
    officalLbl: cc.Label = null;   //官职
    @property(cc.Sprite)
    officalSpr: cc.Sprite = null;  

    @property(cc.Node)
    recruitNode: cc.Node = null;
    @property(cc.ProgressBar)
    recruitBar: cc.ProgressBar = null;
    @property(cc.Label)
    recruitCountLbl: cc.Label = null;  //兵力
    @property(cc.Label)
    recruitCostLbl: cc.Label = null;  //兵种单价
    @property(cc.Label)
    recruitCostNum: cc.Label = null;  //招募花费
    @property(cc.Label)
    recruitaddCount: cc.Label = null;  //招募数量
    @property(cc.Button)
    recruitBtn: cc.Button = null;   //招募按钮

    @property([cc.Label])
    attrLabels: cc.Label[] = [];   //等级、血量、智力、攻击、防御
    @property([cc.Toggle])
    radioButton: cc.Toggle[] = []; 

    // LIFE-CYCLE CALLBACKS:
    generalArr: GeneralInfo[] = [];
    selGeneralIdx: number = -1;  //当前武将索引
    selTabIdx:number = -1;   //底部页签索引  tabIdx =0招募 1升级 2技能

    recruitMaxCount: number = 500;   //部曲最大兵力
    recruitCurCount: number = 0;    //当前部曲兵力
    recruitAddCount: number = 0;    //当前招募的数量
    recruitCostPrice: number = 0;   //百兵售价


    onLoad () {
        this.list.numItems = 0;
        this.selGeneralIdx = -1;
        this.descLabel.string = "";
        this.recruitNode.active = false;
    }

    onDestroy(){
        NoticeMgr.emit(NoticeType.ShowMainMap); //显示大厅场景的全局地图
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {
    }

    /** 打开武将界面 tabIdx =0招募 1升级 2技能, generalId指定武将 */
    showGeneralInfoByTab(tabIdx: number=0, generalId?: string) {
        this.generalArr = MyUserMgr.getGeneralListClone();  //获取武将列表克隆
        if(!this.generalArr || this.generalArr.length == 0){
            return;
        }
        this.list.numItems = this.generalArr.length;
        let listSelIdx = 0;
        if(generalId){
            for(let i=0; i<this.generalArr.length; i++){
                if(generalId == this.generalArr[i].generalId){
                    listSelIdx = i;
                    break;
                }
            }
        }
        this.list.selectedId = listSelIdx;
        this.updateSelItemInfoByIdx(listSelIdx)

        this.selTabIdx = tabIdx;
        this.radioButton[tabIdx].check();   //选中指定标签 tabIdx =0招募 1升级 2技能
        this.handleDownTabSel();  //根据底部页签显示相关内容
    }

    // update (dt) {}

    //列表渲染器
    onListRender(item: cc.Node, idx: number) {
        let info = this.generalArr[idx];
        item.getComponent(GeneralCell).initGeneralData(info);
    }

    //当列表项被选择...
    onListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!item)
            return;
        this.updateSelItemInfoByIdx(selectedId);  //显示底部选中道具信息
    }  

    /**显示底部选中道具信息 */
    updateSelItemInfoByIdx(cellIdx:number){
        this.selGeneralIdx = cellIdx;
        let info = this.generalArr[cellIdx];
        if(info && info.generalCfg){
            this.descLabel.string = info.generalCfg.desc;
        }else{
            this.descLabel.string = "";
        }
        this.showGeneralAttrRadar();  //显示武将属性雷达图
        this.handleDownTabSel();  //根据底部页签显示相关内容
    }

    /**底部页签点击 */
    onRadioButtonClicked(toggle) {
        AudioMgr.playBtnClickEffect();
        let index = this.radioButton.indexOf(toggle);
        if(toggle.isChecked) {
            this.selTabIdx = index;  
            this.handleDownTabSel();  //根据底部页签显示相关内容
        }
    }

    /**根据底部页签显示相关内容 */
    handleDownTabSel(){
        switch(this.selTabIdx) {   //选中指定标签 tabIdx =0招募 1升级 2技能
            case 0:
                this.showRecruitInfo();
                break;
            case 1:
                this.showUpdateInfo();
                break;
            case 2:
                this.showSkillInfo();
                break;
            default:
                break;
        }
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
            this.recruitNode.active = true;
            this.recruitMaxCount = 500;   //部曲最大兵力
            this.recruitCurCount = info.bingCount;    //当前部曲兵力
            this.recruitAddCount = 0;    //当前招募的数量
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
            }else{
                this.recruitBtn.interactable = true;
                this.recruitBar.progress = info.bingCount/this.recruitMaxCount;
            }

            this.recruitCostLbl.string = `单价：${this.recruitCostPrice}金/百人`;  //兵种单价
            this.recruitCostNum.string = "花费：0";  //招募花费
            this.recruitCostNum.node.color = cc.color(255, 255, 255)
            this.recruitaddCount.string = "+0";  //招募数量
        }
    }

    /**初始升级信息 */
    showUpdateInfo(cellIdx:number=-1){
        if(cellIdx < 0){
            cellIdx = this.selGeneralIdx;
        }
        this.recruitNode.active = false;
    }

    /**显示技能信息 */
    showSkillInfo(cellIdx:number=-1){
        if(cellIdx < 0){
            cellIdx = this.selGeneralIdx;
        }
        this.recruitNode.active = false;
    }

    onCloseBtn(){
        AudioMgr.playBtnClickEffect();
        this.node.destroy();
    }

    /**减少招募100人 */
    onRecruitCutBtn(){
        AudioMgr.playBtnClickEffect();
        this.updateRecruitNum(-100);
    }
    /**增加招募100人 */
    onRecruitAddBtn(){
        AudioMgr.playBtnClickEffect();
        this.updateRecruitNum(100);
    }
    /**一键招募满编 */
    onRecruitAllBtn(){
        AudioMgr.playBtnClickEffect();
        this.updateRecruitNum(this.recruitMaxCount);
    }
    /**更新招募数量 */
    updateRecruitNum(count:number){
        this.recruitAddCount += count;    //当前招募的数量
        if(this.recruitAddCount < 0){
            this.recruitAddCount = 0;
        }else{
            let maxAdd = this.recruitMaxCount - this.recruitCurCount;   //部曲最大兵力 - //当前部曲兵力
            if(this.recruitAddCount > maxAdd){
                this.recruitAddCount = maxAdd
            }
        } 
        let cost = this.recruitCostPrice*Math.ceil(this.recruitAddCount/100);
        this.recruitCostNum.string = "花费："+ cost;  //招募花费
        if(GameMgr.checkGoldEnoughOrTips(cost)){
            this.recruitCostNum.node.color = cc.color(255, 255, 255)
        }else{
            this.recruitCostNum.node.color = cc.color(255, 0, 0)
        }
        this.recruitaddCount.string = "+" + this.recruitAddCount;  //招募数量
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
        let cost = this.recruitCostPrice*Math.ceil(this.recruitAddCount/100);
        if(GameMgr.checkGoldEnoughOrTips(cost, true)){
            MyUserMgr.updateUserGold(-cost);   //修改用户金币数量
            let retInfo = MyUserMgr.updateGeneralSoliderCount(selGeneralInfo.generalId, this.recruitAddCount, this.recruitMaxCount);   //更新武将兵力
            if(retInfo){
                this.generalArr[this.selGeneralIdx] = retInfo;
            }
            this.showRecruitInfo();

            if(GameMgr.curTaskConf.type == TaskType.Recruit){ 
                GameMgr.handleStoryShowOver(GameMgr.curTaskConf);  //任务操作(第二阶段）处理完毕
            }
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
