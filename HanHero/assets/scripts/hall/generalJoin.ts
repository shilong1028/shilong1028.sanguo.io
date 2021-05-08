import GeneralCell from "../comnode/general";
import { GeneralInfo } from "../manager/ConfigManager";
import { MyUserMgr } from "../manager/MyUserData";
import UI from '../util/ui';
import List from "../control/List";
import ListItem from "../control/ListItem";

//武将来投
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Hall/generalJoin")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class GeneralJoin extends cc.Component {

    list_view: List = null;
    infoLabel: cc.Label = null;
    descLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    generalArr: GeneralInfo[] = [];

    receiveCallback: any = null;    //领取回调

    onLoad () {
        this.infoLabel = UI.find(this.node, "infoLabel").getComponent(cc.Label)
        this.descLabel = UI.find(this.node, "descLabel").getComponent(cc.Label)
        this.descLabel.string = "";

        let list_node = UI.find(this.node, "listNode");
        let list_project = UI.find(list_node, "general")
        let ts_item = list_project.getComponent(GeneralCell)
        if (!ts_item)
        {
            ts_item = list_project.addComponent(GeneralCell)
        }

        let list_item = list_project.getComponent(ListItem)
        if (!list_item)
        {
            list_item = list_project.addComponent(ListItem)
        }

        this.list_view = list_node.getComponent(List)
        if (!this.list_view)
        {
            this.list_view = list_node.addComponent(List)
            this.list_view.tmpNode = list_project;

            this.list_view.setRenderCallBack(this.onListRender.bind(this));
            this.list_view.setSelectedCallBack(this.onListSelected.bind(this))
            //this.list_view.selectedId = 0;
            //this.list_view.numItems = 0;
        }
    }

    onDestroy(){
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {
    }

    // update (dt) {}

    onCloseBtn(){
        this.closeLayer();
    }

    closeLayer(){
        if(this.receiveCallback){
            this.receiveCallback();
        }
        this.receiveCallback = null;

        this.node.destroy();
    }

    /**初始化武将列表 */
    initGeneralByIds(idArr: number[], bSave:boolean=false,  callback?: any){
        cc.log("initGeneralIds(), idArr = "+JSON.stringify(idArr));
        this.receiveCallback = callback;

        let nameStr = ""
        for(let i=0; i<idArr.length; ++i){
            let info = new GeneralInfo(idArr[i].toString());
            this.generalArr.push(info);

            nameStr += info.generalCfg.name;
            if(i < idArr.length-1){
                nameStr +="、";
                if(bSave){
                    MyUserMgr.addGeneralToList(info, false);   //添加武将到列表
                }
            }else{
                if(bSave){
                    MyUserMgr.addGeneralToList(info, true);   //添加武将到列表
                }
            }
        }
        nameStr +="来投";
        this.infoLabel.string = nameStr;

        this.list_view.numItems = this.generalArr.length;
        this.list_view.selectedId = 0;
        this.updateSelItemInfoByIdx(0)
    }

    //列表渲染器
    onListRender(item: cc.Node, idx: number) {
        if (!item)
            return;
        let tsComp = item.getComponent(GeneralCell)
        if(!tsComp){
            tsComp = item.addComponent(GeneralCell)
        }
        tsComp.initGeneralData(this.generalArr[idx]);
    }

    //当列表项被选择...
    onListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!item)
            return;
        this.updateSelItemInfoByIdx(selectedId);  //显示底部选中道具信息
    }  

    /**显示底部选中道具信息 */
    updateSelItemInfoByIdx(cellIdx:number){
        let info = this.generalArr[cellIdx];
        if(info && info.generalCfg){
            this.descLabel.string = info.generalCfg.desc;
        }else{
            this.descLabel.string = "";
        }
    }
    
}
