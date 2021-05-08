
import { st_story_info } from "../manager/ConfigManager";
import UI from '../util/ui';
import { ROOT_NODE } from "../login/rootNode";
import { MyUserMgr } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";
import ComMaskBg from '../comui/comMaskBg';


//选择首任县城
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Hall/selCityLayer")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class SelCityLayer extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    taskConf: st_story_info = null
    selCityIdStr: string = ""  //选择县城所属郡ID字符串
    selCityIdx: number = 0    //选择县城在郡属列表中的索引位置

    onLoad () {
        let okBtn = UI.find(this.node, "okBtn")
        UI.on_click(okBtn, this.onOkBtnClick.bind(this)) 
        let reSelBtn = UI.find(this.node, "reSelBtn")
        UI.on_click(reSelBtn, this.onReSelBtnClick.bind(this)) 

        // let list_task = ui.find(this.ui_node, "view_task");
        // this.list_project = ui.find(list_task, "task_model")

        // let list_item = this.list_project.getComponent(ListItem)
        // if (!list_item)
        // {
        //     list_item = this.list_project.addComponent(ListItem)
        // }

        // this.list_view = list_task.getComponent(List)
        // if (!this.list_view)
        // {
        //     this.list_view = list_task.addComponent(List)
        //     this.list_view.tmpNode = this.list_project;

        //     this.list_view.setRenderCallBack(this.onListRender.bind(this));
        //     //this.list_view.numItems = 0;
        // }

    }

    onDestroy(){
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {
        let maskBg_tsComp = this.node.parent.getComponent(ComMaskBg)
        if(maskBg_tsComp){
            maskBg_tsComp.showCloseTipNode(false)   //设置是否显示关闭节点
        }
        this.onReSelBtnClick(false)
    }

    // update (dt) {}

     /**
     * 设置任务数据，此时为首任县城选择。如果没有任务数据，则仅仅为县城选择
     */
    private setStoryConf(taskConf: st_story_info){
        this.taskConf = taskConf;
    }


    private onOkBtnClick(){
        if(this.selCityIdStr.length > 0){
            MyUserMgr.updateMyTownIdxs(this.selCityIdx, true, parseInt(this.selCityIdStr));
            if(this.taskConf && this.taskConf.id_str === "1002"){   //选择县城
                GameMgr.handleStoryShowOver(this.taskConf);   
            }
            this.closeLayer()
        }else{
            ROOT_NODE.showTipsText("请选择县城!");
        }
    }

     /**
     * 重新选择
     */
    private onReSelBtnClick(bReSel:boolean = true){
        this.selCityIdStr = ""  //选择县城所属郡ID字符串
        this.selCityIdx = 0    //选择县城在郡属列表中的索引位置





    }


    //List列表渲染器
    private onListRender(item: cc.Node, idx: number)
    {
        if (!item)
        {
            return;
        }
    }

    /**
     * 关闭界面，如果有MaskBg父节点，则MaskBg在监听到本节点销毁并active=false时，会自动destoryMask。
     */
    private closeLayer() {
        this.node.destroy();
    }

}
