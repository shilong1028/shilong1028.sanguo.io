/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:44:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-05 16:41:22
 * @Description: 
 */
import { ROOT_NODE } from "../login/rootNode";
import { BuilderInfo } from "../manager/ConfigManager";
import { MyUserData, MyUserMgr } from "../manager/MyUserData";
import UI from '../util/ui';
import { LoaderMgr } from '../manager/LoaderManager';
import BuilderLayer from './builderLayer';
import { NoticeMgr, NoticeType } from '../manager/NoticeManager';

//主城建筑显示脚本
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Hall/builder")
@executionOrder(-1)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class Builder extends cc.Component {

    tipsLabel: cc.Label = null
    nameLabel: cc.Label = null
    lvLabel: cc.Label = null
    tip: cc.Node = null
    lock: cc.Node = null
    board: cc.Node = null

    // LIFE-CYCLE CALLBACKS:
    builderName: string = ""
    builderInfo: BuilderInfo = null

    onLoad() {
        this.tip = UI.find(this.node, "tip")
        this.tip.opacity = 0;

        this.tipsLabel = UI.find(this.node, "tipLabel").getComponent(cc.Label)  
        this.nameLabel = UI.find(this.node, "nameLabel").getComponent(cc.Label)  
        this.lvLabel = UI.find(this.node, "lvLabel").getComponent(cc.Label) 

        this.lock = UI.find(this.node, "lock")
        this.lock.active = false;
        this.board = this.node
        UI.on_click(this.board, this.onClickBuild.bind(this)) 

        NoticeMgr.on(NoticeType.UpdateBuilder, this.HandleUpdateBuilder, this);
    }

    onDestroy(){
        //this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start() {
        let randomTime = Math.random()*20.0;
        cc.tween(this.tip)
            .repeatForever(cc.sequence(cc.fadeIn(randomTime), cc.delayTime(0.5), cc.fadeOut(0.5)))
            .start()
    }

    // update (dt) {}

    initBuilder(builder_name: string) {
        this.builderName = builder_name
        this.builderInfo = MyUserMgr.getBuilderFromList(builder_name);
        this.showBuilderInfo()
    }

    showBuilderInfo(){
        if(!this.builderInfo){
            return;
        }
        if(MyUserData.MainBuildLv > 0){  //根建筑等级
            this.lock.active = false;
        }else if(this.builderInfo.id_str !== "government")
        {
            this.lock.active = true;
        }
        this.lvLabel.string = "Lv:"+this.builderInfo.level.toString();
        //this.nameLabel.string = this.builderInfo.builderCfg.name
    }

    onClickBuild() {
        LoaderMgr.showBundleLayer('hall', 'ui/builderLayer', null, (layer)=>{
            let tsComp = layer.getComponent(BuilderLayer)
            if(!tsComp){
                tsComp = layer.addComponent(BuilderLayer)
            }
            tsComp.initBuilderConf(this.builderInfo);
        }); 
    }

    HandleUpdateBuilder(builder: BuilderInfo){
        if (this.builderInfo && this.builderInfo.id_str == builder.id_str) {
            this.builderInfo = builder;
            this.showBuilderInfo();
        }else if(builder.id_str === "government" && MyUserData.MainBuildLv === 1){
            //this.showBuilderInfo();
            this.lock.active = false;
        }
    }
}
