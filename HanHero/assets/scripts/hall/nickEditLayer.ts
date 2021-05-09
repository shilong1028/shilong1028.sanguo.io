
import { st_story_info } from "../manager/ConfigManager";
import UI from '../util/ui';
import { ROOT_NODE } from "../login/rootNode";
import { MyUserMgr } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";
import ComMaskBg from "../comui/comMaskBg";


//修改昵称
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Hall/nickEditLayer")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class NickEditLayer extends cc.Component {

    nameEditBox: cc.EditBox = null
    // LIFE-CYCLE CALLBACKS:
    taskConf: st_story_info = null

    onLoad () {
        this.nameEditBox = UI.find(this.node, "nickEditBox").getComponent(cc.EditBox);

        // this.nameEditBox.node.on('editing-did-began', this.editBoxDidBeginEditing.bind(this));
        // this.nameEditBox.node.on('editing-did-ended', this.editBoxDidEndEditing.bind(this));
        // this.nameEditBox.node.on('text-changed', this.editBoxDidChanged.bind(this));

        let okBtn = UI.find(this.node, "okBtn")
        UI.on_click(okBtn, this.onOkBtnClick.bind(this)) 
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
    }

    // update (dt) {}

     /**
     * 设置任务数据，此时为任务改名。如果没有任务数据，则仅仅为改名功能
     */
    setStoryConf(taskConf: st_story_info){
        this.taskConf = taskConf;
    }

    editBoxDidBeginEditing(sender) {
        cc.log(sender.node.name + "editBoxDidBeginEditing");
    }

    editBoxDidChanged(sender) {
        cc.log(sender.node.name + "editBoxDidChanged: " + this.nameEditBox.string);
    }

    editBoxDidEndEditing(sender) {
        cc.log(sender.node.name + "editBoxDidEndEditing: " + this.nameEditBox.string);
    }


    onOkBtnClick(){
        if(this.nameEditBox.string.length > 0){
            MyUserMgr.setUserName(this.nameEditBox.string);
            if(this.taskConf && this.taskConf.id === 1001){   //创建昵称
                GameMgr.handleStoryShowOver(this.taskConf);   
            }
            this.closeLayer()
        }else{
            ROOT_NODE.showTipsText("请输入正确的名号!");
        }
    }

    /**
     * 关闭界面，如果有MaskBg父节点，则MaskBg在监听到本节点销毁并active=false时，会自动destoryMask。
     */
    closeLayer() {
        this.node.destroy();
    }

}
