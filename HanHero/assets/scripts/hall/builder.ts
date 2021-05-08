/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:44:18
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 14:54:00
 * @Description: 
 */
import { ROOT_NODE } from "../login/rootNode";
import { BuilderInfo } from "../manager/ConfigManager";
import { MyUserMgr } from "../manager/MyUserData";
import UI from '../util/ui';

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
    }

    start() {
        let randomTime = Math.random()*2.0;
        cc.tween(this.tip)
            .delay(randomTime)
            .repeatForever(cc.sequence(cc.fadeIn(1.0), cc.delayTime(0.5), cc.fadeOut(0.5)))
            .start()
    }

    // update (dt) {}

    initBuilder(builder_name: string) {
        this.builderName = builder_name
        this.builderInfo = MyUserMgr.getBuilderFromList(builder_name);
        if(this.builderInfo.level > 0){
            this.lock.active = false;
        }else{
            this.lock.active = false;
        }
        this.lvLabel.string = this.builderInfo.level.toString();
        //this.nameLabel.string = this.builderInfo.
    }

    onClickBuild() {
        switch (this.builderName) {


            
            case "residence": //内宅
                break;
            case "government":   //官府
                break;
            case "warehouse":    //武库
                break;
            case "posthouse":     //驿馆
                break;
            case "castle":   //城防
                break;
            case "barracks_dao":  //刀盾营
                break;
            case "barracks_qiang":  //枪戟营
                break;
            case "barracks_gong": //弓弩营
                break;
            case "stable":    //马厩
                break;
            case "workshop":    //工坊
                break;
            case "prison":     //牢房
                break;
            case "farmland":    //农田
                break;
            case "shops":    //商铺
                break;
            case "tavern":    //酒肆
                break;
            case "wharf":     //码头
                break;
            case "community":    //居民区
                break;
            case "academy":    //校场
                break;
            default:
        }
    }
}
