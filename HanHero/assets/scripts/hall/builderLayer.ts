/*
 * @Author: your name
 * @Date: 2021-06-05 15:56:46
 * @LastEditTime: 2021-06-05 17:31:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \HanHero\assets\scripts\hall\builderLayer.ts
 */

import UI from '../util/ui';
import { LoaderMgr } from '../manager/LoaderManager';
import { BuilderInfo } from '../manager/ConfigManager';
import { GameMgr } from '../manager/GameManager';
import { MyUserMgr, MyUserData } from '../manager/MyUserData';
import { ROOT_NODE } from '../login/rootNode';
import { TaskState, TaskType } from '../manager/Enum';

//建筑概述
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Hall/builderLayer")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class BuilderLayer extends cc.Component {

    buildSpr: cc.Node = null;

    nameLabel: cc.Label = null;
    lvLabel: cc.Label = null;
    descLabel: cc.Label = null;

    costIcon: cc.Node = null;
    costLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    builderInfo: BuilderInfo = null

    onLoad () {
        this.buildSpr = UI.find(this.node, "buildSpr")
        this.nameLabel = UI.find(this.node, "nameLabel").getComponent(cc.Label)
        this.lvLabel = UI.find(this.node, "lvLabel").getComponent(cc.Label)
        this.descLabel = UI.find(this.node, "descLabel").getComponent(cc.Label)

        this.costIcon = UI.find(this.node, "costIcon")
        this.costLabel = UI.find(this.node, "costLabel").getComponent(cc.Label)

        this.nameLabel.string = "";
        this.lvLabel.string = "";
        this.descLabel.string = "";
        this.costLabel.string = "";

        let updateBtn = UI.find(this.node, "updateBtn")
        UI.on_btn_click(updateBtn, this.onUpdateBtn.bind(this)) 
        let detailBtn = UI.find(this.node, "detailBtn")
        UI.on_btn_click(detailBtn, this.onDetailBtn.bind(this)) 
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
        this.node.destroy();
    }

    initBuilderConf(builderInfo: BuilderInfo){
        if(!builderInfo){
            return;
        }
        this.builderInfo = builderInfo

        this.lvLabel.string = "Lv:"+this.builderInfo.level.toString();
        this.nameLabel.string = this.builderInfo.builderCfg.name
        this.costLabel.string = this.builderInfo.builderCfg.cost["val"]

        this.descLabel.string = this.builderInfo.builderCfg.desc

        LoaderMgr.setBundleSpriteFrameByImg("hall", "res/builder/"+this.builderInfo.builderCfg.id, this.buildSpr);
    }

    onUpdateBtn(){
        if(!this.builderInfo){
            return;
        }
        if(this.builderInfo.id_str === "government"){
            
        }else{
            if(this.builderInfo.level <= 0){
                ROOT_NODE.showTipsText("建筑暂未解锁，不可升级!");
                return;
            }
    
            if(this.builderInfo.level >= MyUserData.MainBuildLv){  //根建筑等级
                ROOT_NODE.showTipsText("建筑升级受限，请先升级官府等级!");
                return;
            }
        }

        let cost = this.builderInfo.builderCfg.cost["val"]
        if(GameMgr.checkGoldEnoughOrTips(cost)){   //判定金币是否充足 
            this.builderInfo.level += 1;
            MyUserMgr.updateUserGold(-cost);
            MyUserMgr.updateBuilderList(this.builderInfo);   //修改建筑列表
            this.lvLabel.string = "Lv:"+this.builderInfo.level.toString();

            if(MyUserData.TaskState === TaskState.Finish && GameMgr.curTaskConf.type === TaskType.Capital){   //对话完成
                GameMgr.handleStoryShowOver(GameMgr.curTaskConf);   //任务操作(第二阶段）完毕处理
                this.closeLayer();
            }
        }
    }

    onDetailBtn(){
        if(!this.builderInfo){
            return;
        }

        let builderName = this.builderInfo.builderCfg.id
        switch (builderName) {
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
