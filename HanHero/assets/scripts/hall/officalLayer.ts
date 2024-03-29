import OfficalCell from "../comnode/offical";
import { CfgMgr, st_official_info } from "../manager/ConfigManager";
import { MyUserData, MyUserMgr } from "../manager/MyUserData";
import UI from '../util/ui';
import List from "../control/List";
import ListItem from "../control/ListItem";
import ComMaskBg from "../comui/comMaskBg";
import AppFacade from '../puremvc/appFacade';
import CapitalCommand from '../puremvc/capitalCommand';

//官职详情
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Hall/officalLayer")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class OfficalLayer extends cc.Component {

    list_view: List = null;

    descLabel: cc.Label = null;
    titleLabel: cc.Label = null;
    infoLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    officalArr: st_official_info[] = [];
    showOfficalIds: number[] = [];   //当前显示的官职ID集合

    receiveCallback: any = null;    //领取回调

    onLoad() {
        this.titleLabel = UI.find(this.node, "titleLabel").getComponent(cc.Label)
        this.infoLabel = UI.find(this.node, "infoLabel").getComponent(cc.Label)
        this.descLabel = UI.find(this.node, "descLabel").getComponent(cc.Label)
        this.descLabel.string = "";

        let list_node = UI.find(this.node, "listNode");
        let list_project = UI.find(list_node, "offical")
        let ts_item = list_project.getComponent(OfficalCell)
        if (!ts_item) {
            ts_item = list_project.addComponent(OfficalCell)
        }

        let list_item = list_project.getComponent(ListItem)
        if (!list_item) {
            list_item = list_project.addComponent(ListItem)
            list_item.selectedMode = 1;    //TOGGLE
            let selImg = UI.find(list_project, "selBg")
            list_item.selectedFlag = selImg
        }

        this.list_view = list_node.getComponent(List)
        if (!this.list_view) {
            this.list_view = list_node.addComponent(List)
            this.list_view.tmpNode = list_project;
            this.list_view.selectedMode = 1;  //单选

            this.list_view.setRenderCallBack(this.onListRender.bind(this));
            this.list_view.setSelectedCallBack(this.onListSelected.bind(this))
            //this.list_view.selectedId = 0;
            //this.list_view.numItems = 0;
        }
    }

    onDestroy() {
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
        AppFacade.getInstance().sendNotification(CapitalCommand.E_ON_RemoveBundleLayer, 'ui_officalLayer');   //通知移除一些特定Bundle界面资源
    }

    start() {
        let maskBg_tsComp = this.node.parent.getComponent(ComMaskBg)
        if (maskBg_tsComp) {
            maskBg_tsComp.showCloseCallback(() => {
                this.closeLayer();
            })   //设置关闭时，子节点（功能节点）的关闭逻辑处理
        }
    }

    // update (dt) {}

    onCloseBtn() {
        this.closeLayer();
    }

    closeLayer() {
        if (this.receiveCallback) {
            this.receiveCallback();
        }
        this.receiveCallback = null;

        this.node.destroy();
    }

    /**初始化官职列表 */
    initOfficalByIds(idArr: number[], bSave: boolean = false, callback?: any) {
        //cc.log("initOfficalByIds(), idArr = "+JSON.stringify(idArr));
        this.receiveCallback = callback;
        this.showOfficalIds = idArr   //当前显示的官职ID集合
        if (idArr.length > 0) {
            this.titleLabel.string = "加官进爵"
            if (bSave) {
                MyUserMgr.updateOfficalIds(idArr);  //更新主角官职（可身兼数职）
            }
        } else {
            this.titleLabel.string = "官职详情"
            idArr = MyUserData.officalIds
        }

        let nameStr = "当前官职为"
        for (let i = 0; i < idArr.length; ++i) {
            let conf = CfgMgr.getOfficalConf(idArr[i]);
            nameStr += conf.name;
            if (i < idArr.length - 1) {
                nameStr += "、";
            }
        }
        this.infoLabel.string = nameStr;

        let showIdx = 0;
        this.officalArr = CfgMgr.getAllOfficalConf();
        this.officalArr.sort((a, b) => {
            return b.level - a.level;
        })

        for (let k = 0; k < this.officalArr.length; k++) {
            let conf = this.officalArr[k];
            for (let i = 0; i < idArr.length; i++) {
                if (conf.id === idArr[i]) {
                    showIdx = k
                }
            }
        };

        this.list_view.numItems = this.officalArr.length;
        this.list_view.selectedId = showIdx;

        this.list_view.scrollTo(showIdx);
        let showConf = this.officalArr[showIdx];
        if (showConf) {
            this.descLabel.string = showConf.desc;
        } else {
            this.descLabel.string = "";
        }
    }

    //列表渲染器
    onListRender(item: cc.Node, idx: number) {
        if (!item)
            return;
        let tsComp = item.getComponent(OfficalCell)
        if (!tsComp) {
            tsComp = item.addComponent(OfficalCell)
        }
        tsComp.initOfficalData(this.officalArr[idx], this.showOfficalIds);
    }

    //当列表项被选择...
    onListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!item)
            return;
        this.updateSelItemInfoByIdx(selectedId);  //显示底部选中道具信息
    }

    /**显示底部选中道具信息 */
    updateSelItemInfoByIdx(cellIdx: number) {
        let showConf = this.officalArr[cellIdx];
        if (showConf) {
            this.descLabel.string = showConf.desc;
        } else {
            this.descLabel.string = "";
        }
    }

}
