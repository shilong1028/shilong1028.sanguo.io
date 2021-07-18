/*
 * @Autor: dongsl
 * @Date: 2021-07-17 11:31:13
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-17 14:51:34
 * @Description: 
 */

import UI from '../util/ui';
import ListItem from '../control/ListItem';
import List from "../control/List";
import Radar from "../control/Radar";
import { ROOT_NODE } from "../login/rootNode";
import { CfgMgr, GeneralInfo } from "../manager/ConfigManager";
import { TaskType, TaskState } from '../manager/Enum';
import { GameMgr } from "../manager/GameManager";
import { MyUserMgr } from "../manager/MyUserData";
import { NoticeMgr, NoticeType } from "../manager/NoticeManager";
import GeneralCell from '../comnode/general';
import { LoaderMgr } from '../manager/LoaderManager';
import AppFacade from '../puremvc/appFacade';
import CapitalCommand from '../puremvc/capitalCommand';



//武将部曲
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Hall/generalLayer")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class GeneralLayer extends cc.Component {

    list: List = null;
    radar: Radar = null;

    descLabel: cc.Label = null;   //武将描述
    bingzhongLbl: cc.Label = null;   //兵种
    bingzhongSpr: cc.Sprite = null;
    officalLbl: cc.Label = null;   //官职
    officalSpr: cc.Sprite = null;

    recruitNode: cc.Node = null;
    recruitBar: cc.ProgressBar = null;
    recruitCountLbl: cc.Label = null;  //兵力
    recruitCostLbl: cc.Label = null;  //兵种单价
    recruitCostNum: cc.Label = null;  //招募花费
    recruitaddCount: cc.Label = null;  //招募数量
    recruitBtn: cc.Button = null;   //招募按钮

    attrLabels: cc.Label[] = [];   //等级、血量、智力、攻击、防御
    radioButton: cc.Toggle[] = [];

    // LIFE-CYCLE CALLBACKS:
    generalArr: GeneralInfo[] = [];
    selGeneralIdx: number = -1;  //当前武将索引
    selTabIdx: number = -1;   //底部页签索引  tabIdx =0招募 1升级 2技能

    recruitMaxCount: number = 500;   //部曲最大兵力
    recruitCurCount: number = 0;    //当前部曲兵力
    recruitAddCount: number = 0;    //当前招募的数量
    recruitCostPrice: number = 0;   //百兵售价

    totalRecruitCount: number = 0;   //有效的招募数量


    onLoad() {
        let list_node = UI.find(this.node, "listNode");
        let list_project = UI.find(list_node, "general")
        let ts_item = list_project.getComponent(GeneralCell)
        if (!ts_item) {
            ts_item = list_project.addComponent(GeneralCell)
        }

        let list_item = list_project.getComponent(ListItem)
        if (!list_item) {
            list_item = list_project.addComponent(ListItem)

            list_item.selectedMode = 1;    //TOGGLE
            let selImg = UI.find(list_project, "selBg")
            list_item.selectedFlag = selImg
        }

        this.list = list_node.getComponent(List)
        if (!this.list) {
            this.list = list_node.addComponent(List)
            this.list.tmpNode = list_project;
            this.list.selectedMode = 1;  //单选

            this.list.setRenderCallBack(this.onListRender.bind(this));
            this.list.setSelectedCallBack(this.onListSelected.bind(this))
            //this.list.numItems = 0;
        }

        let radarNode = UI.find(this.node, "radarNode")
        this.attrLabels = [];   //等级、血量、智力、攻击、防御
        for (let i = 1; i <= 5; i++) {
            let label = UI.find(radarNode, "label" + i).getComponent(cc.Label)
            this.attrLabels.push(label);
        }

        let radar_node = UI.find(radarNode, "radar")
        this.radar = radar_node.getComponent(Radar)
        if (!this.radar) {
            this.radar = radar_node.addComponent(Radar)

            this.radar.side_max_length = 123;   //雷达图的边最大长度
            this.radar.dotColor = cc.color(255, 0, 0)
            this.radar.side_percent = [1, 10, 10, 10, 10]   //每个边的百分比

            let graphics = radar_node.getComponent(cc.Graphics)
            if (graphics) {
                graphics.strokeColor = cc.color(255, 0, 0);
                graphics.fillColor = cc.color(253, 69, 23, 100)
            }
        }

        this.descLabel = UI.find(this.node, "descLabel").getComponent(cc.Label)   //武将描述
        this.descLabel.string = "";
        this.bingzhongLbl = UI.find(this.node, "bingzhongText").getComponent(cc.Label)  //兵种
        this.bingzhongSpr = UI.find(this.node, "typeImg").getComponent(cc.Sprite)
        UI.on_btn_click(this.bingzhongSpr.node, this.onTypeClick.bind(this))
        this.officalLbl = UI.find(this.node, "officalText").getComponent(cc.Label)  //官职
        this.officalSpr = UI.find(this.node, "officalImg").getComponent(cc.Sprite)
        UI.on_btn_click(this.officalSpr.node, this.onOfficeClick.bind(this))

        this.recruitNode = UI.find(this.node, "recruitNode")
        this.recruitBar = UI.find(this.recruitNode, "progressBar").getComponent(cc.ProgressBar)
        this.recruitCountLbl = UI.find(this.recruitNode, "countLabel").getComponent(cc.Label) //兵力
        this.recruitCostLbl = UI.find(this.recruitNode, "bingzhongCost").getComponent(cc.Label) //兵种单价
        this.recruitCostNum = UI.find(this.recruitNode, "costLabel").getComponent(cc.Label)//招募花费
        this.recruitaddCount = UI.find(this.recruitNode, "addCount").getComponent(cc.Label) //招募数量
        this.recruitBtn = UI.find(this.recruitNode, "recruitBtn").getComponent(cc.Button)   //招募按钮
        UI.on_btn_click(this.recruitBtn.node, this.onRecruitBtn.bind(this))
        let allBtn = UI.find(this.recruitNode, "allBtn")
        UI.on_btn_click(allBtn, this.onRecruitAllBtn.bind(this))
        let addBtn = UI.find(this.recruitNode, "addBtn")
        UI.on_btn_click(addBtn, this.onRecruitAddBtn.bind(this))
        let cutBtn = UI.find(this.recruitNode, "cutBtn")
        UI.on_btn_click(cutBtn, this.onRecruitCutBtn.bind(this))
        this.recruitNode.active = false;

        let tabNode = UI.find(this.node, "tabNode").getComponent(cc.ToggleContainer)
        this.radioButton = tabNode.toggleItems;

        let recruitTab = UI.find(tabNode.node, "recruitTab")
        UI.on_btn_click(recruitTab, this.onToggleTab.bind(this, 0))
        let updateTab = UI.find(tabNode.node, "updateTab")
        UI.on_btn_click(updateTab, this.onToggleTab.bind(this, 1))
        let skillTab = UI.find(tabNode.node, "skillTab")
        UI.on_btn_click(skillTab, this.onToggleTab.bind(this, 2))
    }

    onDestroy() {
        if (this.totalRecruitCount > 0) {  //有效的招募数量
            if (GameMgr.curTaskConf && GameMgr.curTaskConf.type === TaskType.Recruit) {
                GameMgr.handleStoryNextOpt(GameMgr.curTaskConf, TaskState.Reward);  //任务操作完毕处理准备领取奖励
            }
        }

        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);

        AppFacade.getInstance().sendNotification(CapitalCommand.E_ON_ShowHallMidTab);  //通知显示大厅底部中间页签
    }

    start() {
    }

    /** 打开武将界面 tabIdx =0招募 1升级 2技能, generalId指定武将 */
    showGeneralInfoByTab(tabIdx: number = 0, generalId?: number) {
        this.generalArr = MyUserMgr.getGeneralListClone();  //获取武将列表克隆
        //cc.log("this.generalArr = " + JSON.stringify(this.generalArr))
        if (!this.generalArr || this.generalArr.length == 0) {
            return;
        }
        this.list.numItems = this.generalArr.length;
        let listSelIdx = 0;
        if (generalId) {
            for (let i = 0; i < this.generalArr.length; i++) {
                if (generalId === this.generalArr[i].generalId) {
                    listSelIdx = i;
                    break;
                }
            }
        } else if (this.selGeneralIdx > 0) {
            listSelIdx = this.selGeneralIdx
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
        this.updateSelItemInfoByIdx(selectedId);
    }

    /**显示选中的武将信息 */
    updateSelItemInfoByIdx(cellIdx: number) {
        this.selGeneralIdx = cellIdx;
        let info = this.generalArr[cellIdx];
        if (info && info.generalCfg) {
            this.descLabel.string = info.generalCfg.desc;
        } else {
            this.descLabel.string = "";
        }
        this.showGeneralAttrRadar();  //显示武将属性雷达图
        this.handleDownTabSel();  //根据底部页签显示相关内容
    }

    /**点击页签（招募，升级，技能） */
    onToggleTab(tabIdx: number) {
        cc.log("onToggleTab 点击页签（招募，升级，技能）tabIdx = " + tabIdx)
        this.selTabIdx = tabIdx;
        this.handleDownTabSel();  //根据底部页签显示相关内容
    }

    /**底部页签点击（招募，升级，技能） */
    onRadioButtonClicked(toggle) {
        // let index = this.radioButton.indexOf(toggle);
        // if (toggle.isChecked) {
        //     this.selTabIdx = index;
        //     this.handleDownTabSel();  //根据底部页签显示相关内容
        // }
    }

    /**根据底部页签显示相关内容 */
    handleDownTabSel() {
        switch (this.selTabIdx) {   //选中指定标签 tabIdx =0招募 1升级 2技能
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
    showGeneralAttrRadar(cellIdx: number = -1) {
        if (this.radar) {
            if (cellIdx < 0) {
                cellIdx = this.selGeneralIdx;
            }
            let preArr = [1, 1, 1, 1, 1]
            let attrVal = [0, 0, 0, 0, 0]
            let nameArr = ["等级 ", "血量 ", "智力 ", "攻击 ", "防御 "]
            let info: GeneralInfo = this.generalArr[cellIdx];
            if (info && info.generalCfg) {
                attrVal = [info.generalLv, info.generalCfg.hp,
                info.generalCfg.mp, info.generalCfg.atk, info.generalCfg.def
                ];//等级、血量、智力、攻击、防御
                preArr = attrVal;   //每种属性，最高值为100
                preArr[1] = attrVal[1] / 10;   //血量最大1000

                if (info.officialId) {
                    let officeConf = CfgMgr.getOfficalConf(info.officialId);
                    if (officeConf) {
                        this.officalLbl.string = officeConf.name;   //官职
                    }
                }
                LoaderMgr.setOfficalAtlasSpriteFrame(this.officalSpr, info.officialId.toString())
                LoaderMgr.setCommonAtlasSpriteFrame(this.bingzhongSpr, "common_" + info.generalCfg.bingzhong)
                this.recruitCostPrice = 0;   //百兵售价
                let recruitConf = CfgMgr.getRecruitConf(info.generalCfg.bingzhong);
                if (recruitConf) {
                    this.bingzhongLbl.string = recruitConf.name;   //兵种
                    this.recruitCostPrice = recruitConf.gold;   //百兵售价
                }
            } else {
                this.bingzhongLbl.string = "";   //兵种
                this.bingzhongSpr.spriteFrame = null;
                this.officalLbl.string = "在野";   //官职
                this.officalSpr.spriteFrame = null;
            }

            this.radar.changeSidePercent(preArr);
            for (let i = 0; i < 5; i++) {
                this.attrLabels[i].string = nameArr[i] + attrVal[i]
            }
        }
    }

    /** 初始招募信息 */
    showRecruitInfo(cellIdx: number = -1) {
        if (cellIdx < 0) {
            cellIdx = this.selGeneralIdx;
        }
        let info: GeneralInfo = this.generalArr[cellIdx];
        if (info && info.generalCfg) {
            this.recruitNode.active = true;
            this.recruitMaxCount = 500;   //部曲最大兵力
            this.recruitCurCount = info.bingCount;    //当前部曲兵力
            this.recruitAddCount = 0;    //当前招募的数量
            if (info.officialId) {
                let officeConf = CfgMgr.getOfficalConf(info.officialId);
                if (officeConf) {
                    this.recruitMaxCount = officeConf.count;   //部曲最大兵力
                }
            }
            this.recruitCountLbl.string = `兵力：${this.recruitCurCount}/${this.recruitMaxCount}`;
            if (info.bingCount >= this.recruitMaxCount) {   //部曲满员
                this.recruitBtn.interactable = false;
                this.recruitBar.progress = 1.0;
            } else {
                this.recruitBtn.interactable = true;
                this.recruitBar.progress = info.bingCount / this.recruitMaxCount;
            }

            this.recruitCostLbl.string = `单价：${this.recruitCostPrice}金/百人`;  //兵种单价
            this.recruitCostNum.string = "花费：0";  //招募花费
            this.recruitCostNum.node.color = cc.color(255, 255, 255)
            this.recruitaddCount.string = "+0";  //招募数量
        }
    }

    /**初始升级信息 */
    showUpdateInfo(cellIdx: number = -1) {
        if (cellIdx < 0) {
            cellIdx = this.selGeneralIdx;
        }
        this.recruitNode.active = false;
    }

    /**显示技能信息 */
    showSkillInfo(cellIdx: number = -1) {
        if (cellIdx < 0) {
            cellIdx = this.selGeneralIdx;
        }
        this.recruitNode.active = false;
    }

    onCloseBtn() {
        this.node.destroy();
    }

    /**减少招募100人 */
    onRecruitCutBtn() {
        this.updateRecruitNum(-100);
    }
    /**增加招募100人 */
    onRecruitAddBtn() {
        this.updateRecruitNum(100);
    }
    /**一键招募满编 */
    onRecruitAllBtn() {
        this.updateRecruitNum(this.recruitMaxCount);
    }
    /**更新招募数量 */
    updateRecruitNum(count: number) {
        this.recruitAddCount += count;    //当前招募的数量
        if (this.recruitAddCount < 0) {
            this.recruitAddCount = 0;
        } else {
            let maxAdd = this.recruitMaxCount - this.recruitCurCount;   //部曲最大兵力 - //当前部曲兵力
            if (this.recruitAddCount > maxAdd) {
                this.recruitAddCount = maxAdd
            }
        }
        let cost = this.recruitCostPrice * Math.ceil(this.recruitAddCount / 100);
        this.recruitCostNum.string = "花费：" + cost;  //招募花费
        if (GameMgr.checkGoldEnoughOrTips(cost)) {
            this.recruitCostNum.node.color = cc.color(255, 255, 255)
        } else {
            this.recruitCostNum.node.color = cc.color(255, 0, 0)
        }
        this.recruitaddCount.string = "+" + this.recruitAddCount;  //招募数量
    }
    /**招募 */
    onRecruitBtn() {
        if (this.selGeneralIdx < 0) {
            return;
        }
        let selGeneralInfo: GeneralInfo = this.generalArr[this.selGeneralIdx];
        if (!selGeneralInfo) {
            return;
        }
        let cost = this.recruitCostPrice * Math.ceil(this.recruitAddCount / 100);
        if (GameMgr.checkGoldEnoughOrTips(cost, true)) {
            MyUserMgr.updateUserGold(-cost);   //修改用户金币数量
            let retInfo = MyUserMgr.updateGeneralSoliderCount(selGeneralInfo.generalId, this.recruitAddCount, this.recruitMaxCount);   //更新武将兵力
            if (retInfo) {
                this.generalArr[this.selGeneralIdx] = retInfo;
            }
            this.totalRecruitCount += this.recruitAddCount;   //有效的招募数量
            this.showRecruitInfo();
        }
    }

    /**点击官职 */
    onOfficeClick() {
        let info: GeneralInfo = this.generalArr[this.selGeneralIdx];
        if (info && info.officialId) {
            let officeConf = CfgMgr.getOfficalConf(info.officialId);
            if (officeConf) {
                ROOT_NODE.showTipsText(officeConf.desc);
            }
        }
    }
    /**点击兵种 */
    onTypeClick() {
        let info: GeneralInfo = this.generalArr[this.selGeneralIdx];
        if (info && info.generalCfg) {
            let soliderConf = CfgMgr.getGeneralConf(info.generalCfg.bingzhong);
            if (soliderConf) {
                ROOT_NODE.showTipsText(soliderConf.desc);
            }
        }
    }

}
