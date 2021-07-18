
import { CfgMgr, st_story_info } from "../manager/ConfigManager";
import UI from '../util/ui';
import { ROOT_NODE } from "../login/rootNode";
import { MyUserMgr } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";
import ComMaskBg from '../comui/comMaskBg';
import { TaskState } from "../manager/Enum";
import AppFacade from '../puremvc/appFacade';
import CapitalCommand from '../puremvc/capitalCommand';


//选择首任县城
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Hall/selCityLayer")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class SelCityLayer extends cc.Component {

    okBtn: cc.Node = null;
    reSelBtn: cc.Node = null;
    zhous: cc.Node = null;
    cityLabel: cc.Label = null;
    descLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    taskConf: st_story_info = null
    selZhouId: number = 0
    selCityId: number = 0  //选择县城所属郡ID
    selTownIdx: number = 0    //选择县城在郡属列表中的索引位置

    onLoad() {
        this.okBtn = UI.find(this.node, "okBtn")
        UI.on_click(this.okBtn, this.onOkBtnClick.bind(this))
        this.reSelBtn = UI.find(this.node, "reSelBtn")
        UI.on_click(this.reSelBtn, this.onReSelBtnClick.bind(this))

        this.okBtn.active = false;
        this.reSelBtn.active = false;

        this.zhous = UI.find(this.node, "zhous")
        for (let i = 0; i < this.zhous.childrenCount; i++) {
            this.zhous.children[i].active = false
        }

        this.cityLabel = UI.find(this.node, "cityLabel").getComponent(cc.Label)
        this.descLabel = UI.find(this.node, "descLabel").getComponent(cc.Label)
        this.cityLabel.string = ""
        this.descLabel.string = ""
    }

    onDestroy() {
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
        AppFacade.getInstance().sendNotification(CapitalCommand.E_ON_RemoveBundleLayer, 'ui_selCityLayer');   //通知移除一些特定Bundle界面资源
    }

    start() {
        let maskBg_tsComp = this.node.parent.getComponent(ComMaskBg)
        if (maskBg_tsComp) {
            maskBg_tsComp.showCloseTipNode(false)   //设置是否显示关闭节点
        }
        this.onReSelBtnClick(false)
    }

    // update (dt) {}

    /**
    * 设置任务数据，此时为首任县城选择。如果没有任务数据，则仅仅为县城选择
    */
    private setStoryConf(taskConf: st_story_info) {
        this.taskConf = taskConf;
        this.handleSelCity();  //开始随机选择县城
    }

    /**
    * 开始随机选择县城
    */
    private handleSelCity() {
        cc.log("handleSelCity 开始随机选择县城")
        this.selZhouId = 0
        this.selCityId = 0  //选择县城所属郡ID
        this.selTownIdx = 0    //选择县城在郡属列表中的索引位置

        this.okBtn.active = false;
        this.reSelBtn.active = false;
        this.cityLabel.string = ""
        this.descLabel.string = ""
        for (let i = 0; i < this.zhous.childrenCount; i++) {
            this.zhous.children[i].active = false
        }

        let randomIdx_zhou = Math.floor(Math.random() * (this.zhous.childrenCount - 0.001)) + this.zhous.childrenCount
        let randomIdx_city = Math.floor(Math.random() * 9.99)
        let randomIdx_town = 4   //Math.floor(Math.random()*3.99)+1   //一个郡有五个县城，第一个为郡治   //游戏中占领县城顺序为我县,北东西南，其中南邻县为郡治所在县，最后是郡治

        let selZhouCitys: number[] = []
        let selZhouConf: any = null
        let last_zhou = null
        let idx = 0
        cc.tween(this.zhous)
            .delay(0.5)
            .repeat(randomIdx_zhou, cc.sequence(cc.delayTime(0.1), cc.callFunc(() => {
                idx = idx >= this.zhous.childrenCount ? idx - this.zhous.childrenCount : idx
                this.zhous.children[idx].active = true
                if (last_zhou) {
                    last_zhou.active = false;
                }
                last_zhou = this.zhous.children[idx]
                idx++;
                selZhouConf = CfgMgr.getZhouConf(last_zhou.name)
                this.cityLabel.string = selZhouConf.name
                this.descLabel.string = selZhouConf.desc
                //cc.log("zhou idx "+idx +"; selZhouConf.name = "+selZhouConf.name)
            })))
            .call(() => {
                this.selZhouId = last_zhou.name
                let citys = selZhouConf.citys
                for (let i = 0; i < citys.length; i++) {
                    if (citys[i] < 7000) {
                        selZhouCitys.push(citys[i])
                    }
                }
                idx = 0
                //cc.log("sel zhou = "+last_zhou.name+"; selZhouCitys = "+selZhouCitys);
            })
            .delay(0.5)
            .repeat(randomIdx_city, cc.sequence(cc.delayTime(0.1), cc.callFunc(() => {
                idx = idx >= selZhouCitys.length ? idx - selZhouCitys.length : idx
                idx = idx === 0 ? 1 : idx   //第一个郡为州治，因此跳过
                let cityConf = CfgMgr.getCityConf(selZhouCitys[idx])
                this.cityLabel.string = selZhouConf.name + "." + cityConf.name
                this.descLabel.string = cityConf.desc
                idx++;
                //cc.log("city idx "+idx +"; cityConf.name = "+cityConf.name)
            })))
            .call(() => {
                idx = idx >= selZhouCitys.length ? idx - selZhouCitys.length : idx
                idx = idx === 0 ? 1 : idx   //第一个郡为州治，因此跳过
                this.selCityId = selZhouCitys[idx]  //选择县城所属郡ID
                this.selTownIdx = randomIdx_town    //选择县城在郡属列表中的索引位置
                this.cityLabel.string = this.cityLabel.string + "." + CfgMgr.getCityConf(selZhouCitys[idx]).counties[randomIdx_town]
            })
            .delay(0.2)
            .call(() => {
                this.okBtn.active = true;
                this.reSelBtn.active = true;
            })
            .start()
    }

    private onOkBtnClick() {
        if (this.selCityId > 0) {
            MyUserMgr.updateMyTownIdxs(this.selTownIdx, true, this.selCityId);
            if (this.taskConf && this.taskConf.id === 1002) {   //选择县城
                GameMgr.handleStoryNextOpt(this.taskConf, TaskState.Reward);
            }
            this.closeLayer()
        } else {
            ROOT_NODE.showTipsText("请选择县城!");
        }
    }

    /**
    * 重新选择
    */
    private onReSelBtnClick(bReSel: boolean = true) {
        this.handleSelCity();  //开始随机选择县城
    }

    /**
     * 关闭界面，如果有MaskBg父节点，则MaskBg在监听到本节点销毁并active=false时，会自动destoryMask。
     */
    private closeLayer() {
        this.node.destroy();
    }

}
