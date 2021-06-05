import { st_story_info, st_talk_info, CfgMgr, ItemInfo } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";
import { ROOT_NODE } from "../login/rootNode";
import FuncUtil from "../util/FuncUtil";
import { LoaderMgr } from '../manager/LoaderManager';
import GeneralJoin from './generalJoin';
import OfficalLayer from './officalLayer';
import UI from '../util/ui';
import BeautyJoin from "./beautyJoin";
import ComMaskBg from "../comui/comMaskBg";
import { MyUserData } from '../manager/MyUserData';
import { TaskState } from '../manager/Enum';

//剧情阐述
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Hall/storyLayer")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class StoryLayer extends cc.Component {

    leftHead: cc.Node = null;
    rightHead: cc.Node = null;
    rewardNode: cc.Node = null;
    rewardLayout: cc.Node = null;
    taskTitleLabel: cc.Label = null;  //任务章节
    taskNameLabel: cc.Label = null;  //任务名称
    talkLabel: cc.Label = null;
    skipNode: cc.Node = null;
    skipLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    taskConf: st_story_info = null;   //剧情配置
    curTalkIdx: number = -1;  //当前话本索引
    curTalkConf: st_talk_info = null;   //当前话本配置数据
    curTalkStrIdx: number = 0;   //当前话本内容显示索引
    bUpdateStr: boolean = false;   //是否更新显示话本内容

    onLoad () {
        this.leftHead = UI.find(this.node, "leftHead")
        this.rightHead = UI.find(this.node, "rightHead")
        this.rewardNode = UI.find(this.node, "rewardNode")
        this.rewardLayout = UI.find(this.node, "rewardLayout")

        this.taskTitleLabel = UI.find(this.node, "taskTitle").getComponent(cc.Label)
        this.taskNameLabel = UI.find(this.node, "taskName").getComponent(cc.Label)
        this.talkLabel = UI.find(this.node, "talkLabel").getComponent(cc.Label)
        this.skipNode = UI.find(this.node, "skipBtn")
        this.skipLabel = UI.find(this.node, "skipLabel").getComponent(cc.Label)
        UI.on_btn_click(this.skipNode, this.onSkipBtn.bind(this)) 

        this.talkLabel.string = "";
        this.leftHead.getComponent(cc.Sprite).spriteFrame = null;
        this.rightHead.getComponent(cc.Sprite).spriteFrame = null;
        this.rewardNode.active = false;
        this.skipNode.active = false;
    }

    onDestroy(){
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    removeRewardItems(){
        if(this.rewardLayout.childrenCount > 0){
            for(let i=this.rewardLayout.childrenCount-1; i>=0; i--){
                let item = this.rewardLayout.children[i];
                if(item){
                    ROOT_NODE.removeItem(item);   //注意removeItem 会将item removeFromParent
                }
            }
        }
    }

    start () {
        let maskBg_tsComp = this.node.parent.getComponent(ComMaskBg)
        if(maskBg_tsComp){
            maskBg_tsComp.showCloseTipNode(false)   //设置是否显示关闭节点
        }
    }

    /**初始化主线任务 */
    initStoryConf(taskConf: st_story_info){
        if(taskConf){
            cc.log("initStoryConf taskConf = "+JSON.stringify(taskConf))
            this.taskConf = taskConf;
            this.curTalkIdx = -1;
            this.taskTitleLabel.string = `第${taskConf.chapterId}章`  //任务章节
            let level = `第${taskConf.id % 100}节 `
            this.taskNameLabel.string = level + taskConf.name;  //任务名称
            
            this.setTalkStr();   //设置话本内容

            let rewards: Array<ItemInfo> = FuncUtil.getItemArrByKeyVal(this.taskConf.rewards);
            if(rewards.length > 0){
                this.rewardNode.active = true;
                for(let i=0; i<rewards.length; ++i){
                    let item = ROOT_NODE.createrItem(rewards[i], true);
                    this.rewardLayout.addChild(item);
                }
            }
        }
    }

    /**设置话本内容 */
    setTalkStr(){
        cc.log("setTalkStr 设置话本内容")
        if(this.taskConf){
            this.bUpdateStr = false;
            this.curTalkIdx ++;
            this.curTalkConf = null;
            this.curTalkStrIdx = 0;
            this.rewardNode.active = false;
            this.removeRewardItems();

            if(this.curTalkIdx < this.taskConf.talks.length){
                if(this.curTalkIdx >= this.taskConf.talks.length-1){
                    this.skipLabel.string = "结   束";
                }else{
                    this.skipLabel.string = "继   续";
                }

                let talkId = this.taskConf.talks[this.curTalkIdx];
                this.curTalkConf = CfgMgr.getTalkConf(talkId);
                //cc.log("this.curTalkConf = "+JSON.stringify(this.curTalkConf));
                this.bUpdateStr = true;
     
                // this.leftHead.getComponent(cc.Sprite).spriteFrame = null;
                // this.rightHead.getComponent(cc.Sprite).spriteFrame = null;
                let headNode = null
                if(this.curTalkIdx % 2 === 0){   //左侧头像
                    headNode = this.leftHead
                }else{
                    headNode = this.rightHead
                }
                if(this.curTalkConf.head > 100){  //对话头像，<100为head_talk中头像，>100为head头像
                    LoaderMgr.setSpriteFrameByImg("head/"+this.curTalkConf.head, headNode);
                }else{
                    LoaderMgr.setBundleSpriteFrameByImg("hall", "res/head_talk/"+this.curTalkConf.head, headNode);
                }

                // if(this.curTalkConf.city > 0){   //话本目标城池
                //     let cityConf: st_city_info = CfgMgr.getCityConf(this.curTalkConf.city);
                //     if(cityConf){
                //         NoticeMgr.emit(NoticeType.MapMoveByCity, cc.v2(cityConf.pos_x, cityConf.pos_y), this.curTalkConf.type);   //话本目标通知（地图移动）
                //     }
                // }
            }
        }
    }

    update (dt) {
        if(this.bUpdateStr == true && this.curTalkConf){
            this.curTalkStrIdx ++;
            if(this.curTalkStrIdx >= this.curTalkConf.desc.length){
                this.talkLabel.string = this.curTalkConf.desc;
                this.bUpdateStr = false;
                this.skipNode.active = true;   //继续或结束
            }else{
                let str = this.curTalkConf.desc.substr(0, this.curTalkStrIdx);  
                //substr(start,length)表示从start位置开始，截取length长度的字符串。
                //substring(start,end)表示从start到end之间的字符串，包括start位置的字符但是不包括end位置的字符。
                this.talkLabel.string = str;
            }

            if(this.curTalkConf.skip > 0 && this.curTalkStrIdx >= 10){
                this.skipNode.active = true;
            }
        }
    }

    onSkipBtn(){
        if(this.isShowNewOffical()){ //新官职
            return;
        }else if(this.isShowNewGeneral()){  //武将来投
            return;
        }
        this.handleNextTalk();
    }

    /**显示新官职界面 */
    isShowNewOffical(){
        if(this.curTalkConf.official.length > 0 && MyUserData.TaskState === TaskState.Ready){ //新官职  //任务初始情况
            let official = this.curTalkConf.official
            LoaderMgr.showBundleLayer('ui_officalLayer', 'officalLayer', null, (layer)=>{
                let tsComp = layer.getComponent(OfficalLayer)
                if(!tsComp){
                    tsComp = layer.addComponent(OfficalLayer)
                }
                tsComp.initOfficalByIds(official, false, ()=>{
                    this.handleOfficalNext();
                });
            });
            return true;
        }
        return false;
    }
    /**处理官职展示后续操作 */
    handleOfficalNext(){
        cc.log("新官职展示结束，后续处理")
        GameMgr.addCurTaskNewOffices(this.curTalkConf.official);
        if(this.isShowNewGeneral()){  //武将来投
        }else{
            this.handleNextTalk();
        }
    }
    /**展示武将来投界面 */
    isShowNewGeneral(){
        if(this.curTalkConf.generals.length > 0 && MyUserData.TaskState === TaskState.Ready){ //新武将  //任务初始情况
            if(this.curTalkConf.generals.length > 1 || this.curTalkConf.generals[0] > 1000){   //武将来投
                let generals = this.curTalkConf.generals
                LoaderMgr.showBundleLayer('ui_generalJoin', 'generalJoin', null, (layer)=>{
                    let tsComp = layer.getComponent(GeneralJoin)
                    if(!tsComp){
                        tsComp = layer.addComponent(GeneralJoin)
                    }
                    tsComp.initGeneralByIds(generals, false, ()=>{
                        this.handleGeneralNext();
                    });
                });
            }else{    //新纳美姬
                let beautyId = this.curTalkConf.generals[0]
                LoaderMgr.showBundleLayer('hall', 'ui/beautyJoin', null, (layer)=>{
                    let tsComp = layer.getComponent(BeautyJoin)
                    if(!tsComp){
                        tsComp = layer.addComponent(BeautyJoin)
                    }
                    tsComp.initBeautyById(beautyId, ()=>{
                        this.handleGeneralNext();
                    });
                });
            }
            return true;
        }
        return false;
    }
    /**处理武将来投或新纳美姬后续操作 */
    handleGeneralNext(){
        cc.log("武将来投或新纳美姬展示结束，后续处理")
        GameMgr.addCurTaskNewGenerals(this.curTalkConf.generals);
        this.handleNextTalk();
    }

    handleNextTalk(){
        cc.log("下一段剧情对话")
        this.skipNode.active = false;
        if(this.curTalkConf && this.curTalkIdx < this.taskConf.talks.length-1){   //跳过
            this.setTalkStr();   //设置话本内容
        }else{  //结束
            GameMgr.handleStoryNextOpt(this.taskConf, TaskState.Finish);   //任务宣读(第一阶段）完毕处理
            this.node.destroy();
        }
    }

}
