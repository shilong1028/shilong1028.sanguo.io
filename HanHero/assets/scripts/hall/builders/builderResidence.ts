import List from '../../control/List';
import ListItem from '../../control/ListItem';
import { st_beautiful_info, BuilderInfo, BeautyInfo, CfgMgr } from '../../manager/ConfigManager';
import UI from '../../util/ui';
import { MyUserMgr } from '../../manager/MyUserData';
import { LoaderMgr } from '../../manager/LoaderManager';
import BeautyPokingLayer from '../beautyPokingLayer';
import { ROOT_NODE } from '../../login/rootNode';
/*
 * @Autor: dongsl
 * @Date: 2021-07-14 16:36:00
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-17 11:15:41
 * @Description: 
 */



//内宅建筑信息详情
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Hall/builders/builderResidence")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class BuilderResidence extends cc.Component {

    list_view: List = null;

    // LIFE-CYCLE CALLBACKS:
    all_beauty_confs: st_beautiful_info[] = null
    builderInfo: BuilderInfo = null;
    builderLayerCloseFun: Function = null;   //关闭建筑信息界面的回调

    onLoad() {
        let list_node = UI.find(this.node, "listNode");
        let list_project = UI.find(list_node, "beautyCell")
        let list_item = list_project.getComponent(ListItem)
        if (!list_item) {
            list_item = list_project.addComponent(ListItem)

            list_item.selectedMode = 1;    //TOGGLE
            let selImg = UI.find(list_project, "selImg")
            list_item.selectedFlag = selImg
        }

        this.list_view = list_node.getComponent(List)
        if (!this.list_view) {
            this.list_view = list_node.addComponent(List)
            this.list_view.tmpNode = list_project;
            this.list_view.selectedMode = 1;  //单选

            this.list_view.setRenderCallBack(this.onListRender.bind(this));
            this.list_view.setSelectedCallBack(this.onListSelected.bind(this))
            //this.list_view.numItems = 0;
        }
    }

    onDestroy() {
        //取消调度所有已调度的回调函数
        //this.unscheduleAllCallbacks();
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start() {
    }

    // update (dt) {}

    //列表渲染器
    onListRender(item: cc.Node, idx: number) {
        if (!item)
            return;

        let beauty_conf: st_beautiful_info = this.all_beauty_confs[idx];
        let beauty_info: BeautyInfo = MyUserMgr.getBeautyInfoById(beauty_conf.id);
        let beauty_level: number = 1;
        if (beauty_info) {
            beauty_level = beauty_info.level;
        }

        let head = UI.find(item, "head")
        LoaderMgr.setBundleSpriteFrameByImg("hall", "res/beauty/" + beauty_conf.id, head);

        let lblName = UI.find(item, "lblName").getComponent(cc.Label)
        lblName.string = beauty_conf.name

        let pokingNum = UI.find(item, "pokingNum").getComponent(cc.Label)   //最大点击次数（耐受度）
        pokingNum.string = beauty_conf.poking

        let fallNum = UI.find(item, "fallNum").getComponent(cc.Label)   //单次点击掉落金币数  （每升一级掉落增加10%）
        fallNum.string = Math.floor(beauty_conf.fall * CfgMgr.getBeautyFallPieceByLv(beauty_level)).toString()

        let teaseBtn = UI.find(item, "teaseBtn")
        UI.on_btn_click(teaseBtn, this.onTeaseBtn.bind(this, beauty_conf.id))

        let lblLv = UI.find(item, "lblLv").getComponent(cc.Label)
        if (beauty_info) {
            lblLv.string = "Lv " + beauty_level
            //UI.set_gray(head, false);
            teaseBtn.active = true;
        } else {
            lblLv.string = "未获得"
            //UI.set_gray(head, true);
            teaseBtn.active = false;
        }
    }

    //当列表项被选择...
    onListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!item)
            return;
        //cc.log('当前选择的是：' + selectedId + '，上一次选择的是：' + lastSelectedId);
    }

    //挑逗美姬
    onTeaseBtn(nvId: number | string) {
        if (this.builderInfo && this.builderInfo.level > 0) {
            LoaderMgr.showBundleLayer('hall', 'ui/beautyPokingLayer', null, (layer) => {
                let tsComp = layer.getComponent(BeautyPokingLayer)
                if (!tsComp) {
                    tsComp = layer.addComponent(BeautyPokingLayer)
                }
                tsComp.initBeautyInfo(nvId);

                if (this.builderLayerCloseFun) {   //关闭建筑信息界面的回调
                    this.builderLayerCloseFun();
                }
            });
        } else {
            ROOT_NODE.showTipsText("请先开启内宅建筑，才可进入挑逗美姬哟!");
        }

    }

    initBeautys(builderInfo: BuilderInfo, builderLayerCloseFun: Function) {
        this.builderInfo = builderInfo
        this.builderLayerCloseFun = builderLayerCloseFun;  //关闭建筑信息界面的回调

        this.all_beauty_confs = CfgMgr.getAllBeautifulConf();
        this.list_view.numItems = this.all_beauty_confs.length;
    }



}
