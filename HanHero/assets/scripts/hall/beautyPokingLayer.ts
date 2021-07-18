
import { BeautyInfo, st_beautiful_info, CfgMgr } from '../manager/ConfigManager';
import UI from '../util/ui';
import { ROOT_NODE } from "../login/rootNode";
import { MyUserMgr, MyUserData } from "../manager/MyUserData";
import ComMaskBg from "../comui/comMaskBg";
import ListItem from '../control/ListItem';
import List from '../control/List';
import { LoaderMgr } from '../manager/LoaderManager';
import { TaskState, TaskType } from '../manager/Enum';
import { GameMgr } from '../manager/GameManager';


//挑逗美姬，点戳生金
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Hall/beautyPokingLayer")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class BeautyPokingLayer extends cc.Component {

    beautyPage: List = null;
    leftBtn: cc.Node = null;
    rightBtn: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    cur_beauty_idx: number = 0;
    bPokingOpt: boolean = false;   //是否点戳操作过

    onLoad() {
        let backBtn = UI.find(this.node, "backBtn")
        UI.on_btn_click(backBtn, this.onBackBtnClick.bind(this))

        LoaderMgr.showComTopNode(this.node, cc.v2(0, backBtn.y));  //一级界面上的金币钻石粮草公用控件

        this.leftBtn = UI.find(this.node, "leftBtn")
        UI.on_btn_click(this.leftBtn, this.onLeftBtnClick.bind(this))
        this.rightBtn = UI.find(this.node, "rightBtn")
        UI.on_btn_click(this.rightBtn, this.onRightBtnClick.bind(this))
        this.leftBtn.active = false;
        this.rightBtn.active = false;

        let beautyPage = UI.find(this.node, "beautyPage");
        let list_project = UI.find(beautyPage, "beautyCell")
        let list_item = list_project.getComponent(ListItem)
        if (!list_item) {
            list_item = list_project.addComponent(ListItem)
        }

        this.beautyPage = beautyPage.getComponent(List)
        if (!this.beautyPage) {
            this.beautyPage = beautyPage.addComponent(List)
            this.beautyPage.slideMode = 3   //PAGE = 3,//页面模式，将强制关闭滚动惯性
            this.beautyPage.tmpNode = list_project;

            this.beautyPage.setRenderCallBack(this.onListRender.bind(this));
            this.beautyPage.setPageRenderCallBack(this.onPageRender.bind(this));
            //this.beautyPage.numItems = 0;
        }
    }

    onDestroy() {
        //取消调度所有已调度的回调函数
        this.unscheduleAllCallbacks();
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);

        if (this.bPokingOpt && MyUserData.TaskState === TaskState.Finish && GameMgr.curTaskConf.type === TaskType.Beauty) {   //对话完成  //后宅美姬  
            GameMgr.handleStoryNextOpt(GameMgr.curTaskConf, TaskState.Reward);   //任务操作完毕处理准备领取奖励
        }
    }

    start() {
        let maskBg_tsComp = this.node.parent.getComponent(ComMaskBg)
        if (maskBg_tsComp) {
            maskBg_tsComp.showCloseTipNode(false)   //设置是否显示关闭节点
        }
        this.unschedule(this.showScheduleTime.bind(this));
        this.schedule(this.showScheduleTime.bind(this), 1);
    }

    // update (dt) {}

    /**
    * 设置默认打开的美姬信息
    */
    initBeautyInfo(nvId: number | string) {
        cc.log("initBeautyInfo nvId = " + nvId)
        let beauty_idx: number = 0;
        let total_len = MyUserData.BeautyList.length;
        for (let i = 0; i < total_len; ++i) {
            let info: BeautyInfo = MyUserData.BeautyList[i];
            if (nvId === info.nvId) {
                beauty_idx = i;
                break;
            }
        }
        this.cur_beauty_idx = beauty_idx

        this.beautyPage.numItems = total_len;
        this.beautyPage.skipPage(this.cur_beauty_idx, 0.01)
    }

    //列表渲染器
    onListRender(item: cc.Node, idx: number) {
        if (!item)
            return;
        let beauty_info: BeautyInfo = MyUserData.BeautyList[idx];
        if (!beauty_info) {
            return;
        }
        //cc.log("onListRender idx = " + idx + "; beauty_info = " + JSON.stringify(beauty_info))

        let beauty_conf: st_beautiful_info = beauty_info.nvCfg;

        let cellBg = UI.find(item, "cellBg")
        let cellBg_bgname = cellBg["bgname"]
        if (idx % 2 === 0) {
            if (cellBg_bgname !== "beauty_bg_1") {
                LoaderMgr.setBundleSpriteFrameByImg("hall", "res/bg/beauty_bg_1", cellBg);
                cellBg.attr({ "bgname": "beauty_bg_1" })
            }
        } else {
            if (cellBg_bgname !== "beauty_bg_2") {
                LoaderMgr.setBundleSpriteFrameByImg("hall", "res/bg/beauty_bg_2", cellBg);
                cellBg.attr({ "bgname": "beauty_bg_2" })
            }
        }

        let head = UI.find(item, "head")
        let head_beautyid = head["beautyid"]
        if (head_beautyid !== beauty_conf.id) {
            LoaderMgr.setBundleSpriteFrameByImg("hall", "res/beauty/" + beauty_conf.id, head);
            head.attr({ "beautyid": beauty_conf.id })
            UI.on_btn_click(head, this.onHeadClick.bind(this, idx))
        }

        let lblName = UI.find(item, "lblName").getComponent(cc.Label)
        lblName.string = beauty_conf.name

        let lblLv = UI.find(item, "lblLv").getComponent(cc.Label)
        lblLv.string = "Lv " + beauty_info.level

        let fallNum = UI.find(item, "fallNum").getComponent(cc.Label)   //单次点击掉落金币数  （每升一级掉落增加10%）
        fallNum.string = Math.floor(beauty_conf.fall * (1 + (beauty_info.level - 1) * 0.1)).toString()

        this.showPokingExpBar(item, beauty_info);  //显示点戳次数和经验条

        let resumeBar = UI.find(item, "resumeBar").getComponent(cc.ProgressBar)
        if (beauty_info.pokingCount <= 0) {
            resumeBar.node.active = false;
        } else {
            resumeBar.node.active = true;
            this.showResumeTime(item, idx);
        }
    }

    //显示点戳次数和经验条
    showPokingExpBar(item: cc.Node, beauty_info: BeautyInfo) {
        if(!item || !beauty_info){
            return ;
        }
        let beauty_conf: st_beautiful_info = beauty_info.nvCfg;
        let pokingBar = UI.find(item, "pokingBar").getComponent(cc.ProgressBar)
        let pokingNumLabel = UI.find(pokingBar.node, "numLabel").getComponent(cc.Label)   //最大点击次数（耐受度）
        let pokingNum = (beauty_conf.poking - beauty_info.pokingCount)   //美姬已经被戳的次数（需要靠时间来恢复）
        pokingNum = pokingNum < 0 ? 0 : pokingNum;
        let pokingProgress = pokingNum / beauty_conf.poking;
        pokingProgress = pokingProgress > 1.0 ? 1.0 : pokingProgress;
        pokingNumLabel.string = pokingNum + "/" + beauty_conf.poking
        pokingBar.progress = pokingProgress;

        let expBar = UI.find(item, "expBar").getComponent(cc.ProgressBar)
        let expNumLabel = UI.find(expBar.node, "numLabel").getComponent(cc.Label)   //当前被戳经验，被戳一次积累一点经验。
        let expProgress = beauty_info.exp / beauty_conf.upExp;
        expProgress = expProgress > 1.0 ? 1.0 : expProgress;
        expNumLabel.string = beauty_info.exp + "/" + beauty_conf.upExp     //升级经验
        expBar.progress = expProgress;
    }

    showScheduleTime() {
        let item = this.beautyPage.getItemByListId(this.cur_beauty_idx);
        if (!item) {
            return;
        }
        this.showResumeTime(item, this.cur_beauty_idx);
    }

    showResumeTime(item: cc.Node, idx: number) {
        if (!item) {
            return;
        }
        let resumeBar = UI.find(item, "resumeBar").getComponent(cc.ProgressBar)
        if (resumeBar.node.active != true) {
            return;
        }
        let beauty_info: BeautyInfo = MyUserData.BeautyList[idx];
        if (!beauty_info) {
            return;
        }
        //cc.log("showResumeTime idx = " + idx + "; beauty_info = " + JSON.stringify(beauty_info))

        let new_info = MyUserMgr.updateBeautyPokingCount(beauty_info, true)   //根据在线时间更新美姬点击次数
        if (new_info) {
            beauty_info = new_info;
            this.beautyPage.updateItem(idx);
        } else {
            let resumeNumLabel = UI.find(resumeBar.node, "numLabel").getComponent(cc.Label)

            let beauty_conf: st_beautiful_info = beauty_info.nvCfg;
            let pokingTime = beauty_info.pokingTime   //美姬最后一次被戳的时间（相当于在线时长秒数）（每次打开内宅美姬界面，重新计算恢复的耐受度）
            let curTimeStame = MyUserData.totalLineTime  //总的在线时长  秒数而非时间戳
            let offsetTime = Math.floor(curTimeStame - pokingTime);

            let resumeNum = (beauty_conf.resume - offsetTime)   //单次点击恢复时间
            resumeNum = resumeNum < 0 ? 0 : resumeNum;
            let resumeProgress = resumeNum / beauty_conf.resume;
            resumeProgress = resumeProgress > 1.0 ? 1.0 : resumeProgress;
            resumeNumLabel.string = resumeNum + "s/" + beauty_conf.resume + "s"
            resumeBar.progress = resumeProgress;
        }
    }

    //ListPage渲染
    onPageRender(pageNum: number) {
        cc.log("onPageRender pageNum = " + pageNum + "; this.cur_beauty_idx = " + this.cur_beauty_idx)
        this.cur_beauty_idx = pageNum

        this.leftBtn.active = false;
        this.rightBtn.active = false;

        if (this.cur_beauty_idx > 0) {
            this.leftBtn.active = true;
        }

        let total_len = MyUserData.BeautyList.length;
        if (this.cur_beauty_idx < total_len - 1) {
            this.rightBtn.active = true;
        }
    }

    //点戳美姬
    onHeadClick(idx: number) {
        let beauty_info: BeautyInfo = MyUserData.BeautyList[idx];
        //cc.log("onHeadClick idx = " + idx + "; beauty_info = " + JSON.stringify(beauty_info))
        if (!beauty_info) {
            return;
        }
        let beauty_conf: st_beautiful_info = beauty_info.nvCfg;

        if (beauty_info.pokingCount >= beauty_conf.poking) {
            ROOT_NODE.showTipsText("主公手指太累该休息了，妾身耐受度已用完!");
            return;
        }

        if (beauty_info.pokingCount > 0 || beauty_info.pokingTime > 0) {  //美姬最后一次被戳的时间（相当于在线时长秒数）（每次打开内宅美姬界面，重新计算恢复的耐受度）
        } else {   //初次点戳
            beauty_info.pokingTime = MyUserData.totalLineTime  //总的在线时长 秒数而非时间戳
        }
        beauty_info.pokingCount++;
        beauty_info.exp++;
        MyUserMgr.updateBeautyList(beauty_info);
        this.bPokingOpt = true;   //是否点戳操作过

        let fallGold = Math.floor(beauty_conf.fall * CfgMgr.getBeautyFallPieceByLv(beauty_info.level))   //单次点击掉落金币数  （每升一级掉落增加10%）
        ROOT_NODE.showTipsText("掉落金币 " + (fallGold / 1000).toFixed(2) + "屯");
        MyUserMgr.updatePieceGold(fallGold);   //修改临时散碎金币 比如点戳美姬掉落，待积攒够1000则自动转存为金锭并更新。

        if (beauty_info.pokingCount > 0 || beauty_info.pokingTime > 0) {
            let item = this.beautyPage.getItemByListId(this.cur_beauty_idx);
            if (!item) {
                return;
            }
            this.showPokingExpBar(item, beauty_info);  //显示点戳次数和经验条
        } else {   //初次点戳
            this.beautyPage.updateItem(this.cur_beauty_idx);
        }
    }

    //向左翻页
    onLeftBtnClick() {
        this.cur_beauty_idx--;
        this.beautyPage.prePage();
    }

    //向右翻页
    onRightBtnClick() {
        this.cur_beauty_idx++;
        this.beautyPage.nextPage();
    }

    onBackBtnClick() {
        this.closeLayer()
    }

    /**
     * 关闭界面，如果有MaskBg父节点，则MaskBg在监听到本节点销毁并active=false时，会自动destoryMask。
     */
    closeLayer() {
        this.node.destroy();
    }

}
