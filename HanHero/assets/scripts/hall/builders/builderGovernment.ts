import List from '../../control/List';
import ListItem from '../../control/ListItem';
import UI from '../../util/ui';
import { BuilderInfo, st_city_info, CfgMgr } from '../../manager/ConfigManager';
import { MyUserData, MyUserMgr } from '../../manager/MyUserData';
import { LoaderMgr } from '../../manager/LoaderManager';
import { BuilderQualityArr } from '../../manager/Enum';
import { ROOT_NODE } from '../../login/rootNode';
import { FunMgr } from '../../manager/FuncManager';
/*
 * @Autor: dongsl
 * @Date: 2021-06-26 14:27:47
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-16 14:45:19
 * @Description: 
 */


//官府建筑信息详情
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Hall/builders/builderGovernment")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class GuilderGovernment extends cc.Component {

    list_view: List = null;
    populationLabel: cc.Label = null;
    timeLabel: cc.Label = null;
    goldLabel: cc.Label = null;
    foodLabel: cc.Label = null;
    qualityLabel: cc.Label = null;
    getBtn: cc.Node = null

    // LIFE-CYCLE CALLBACKS:

    builderInfo: BuilderInfo = null
    time_end: number = 0
    population: number = 0;
    tax_gold: number = 0;
    tax_food: number = 0;

    onLoad() {
        this.populationLabel = UI.find(this.node, "population").getComponent(cc.Label)   //人口
        this.timeLabel = UI.find(this.node, "timeLabel").getComponent(cc.Label)  //征收倒计时：
        this.goldLabel = UI.find(this.node, "goldLabel").getComponent(cc.Label)   //税金
        this.foodLabel = UI.find(this.node, "foodLabel").getComponent(cc.Label)   //税粮
        this.qualityLabel = UI.find(this.node, "qualityLabel").getComponent(cc.Label)   //品阶：茅草建筑（1）
        this.qualityLabel.node.active = false;
        this.getBtn = UI.find(this.node, "getBtn")   //征收
        UI.on_click(this.getBtn, this.onGetBtnClick.bind(this))

        let list_node = UI.find(this.node, "listNode");
        let list_project = UI.find(list_node, "cityCell")
        let list_item = list_project.getComponent(ListItem)
        if (!list_item) {
            list_item = list_project.addComponent(ListItem)
        }

        this.list_view = list_node.getComponent(List)
        if (!this.list_view) {
            this.list_view = list_node.addComponent(List)
            this.list_view.tmpNode = list_project;

            this.list_view.setRenderCallBack(this.onListRender.bind(this));
            //this.list_view.numItems = 0;
        }
    }

    onDestroy() {
        //取消调度所有已调度的回调函数
        this.unscheduleAllCallbacks();
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

        let cityImg = UI.find(item, "cityImg").getComponent(cc.Sprite)
        let cityName = UI.find(item, "cityName").getComponent(cc.Label)

        if (MyUserData.myTownIdxs.length > 5) {   //五个县城及郡治均已占领
            let city_conf: st_city_info = MyUserData.myCityList[idx].cityCfg
            if (city_conf) {
                cityName.string = city_conf.name
            }
            LoaderMgr.setBundleSpriteFrameByAtlas("hall", "res/atlas/main", "main_city", cityImg);
        } else {
            let city_conf: st_city_info = MyUserData.myCityList[0].cityCfg
            let townIdx = MyUserData.myTownIdxs[idx];
            if (city_conf) {
                cityName.string = city_conf.counties[townIdx]
            }
            LoaderMgr.setBundleSpriteFrameByAtlas("hall", "res/atlas/main", "main_town", cityImg);
        }
    }

    //初始化官府信息
    initGovernment(builderInfo: BuilderInfo) {
        if (!builderInfo) {
            return;
        }
        this.builderInfo = builderInfo
        this.qualityLabel.string = BuilderQualityArr[this.builderInfo.quality]   //品阶：茅草建筑（1）

        let population: number = 0;
        if (MyUserData.myTownIdxs.length > 5) {   //五个县城及郡治均已占领
            let cityNum = MyUserData.myCityList.length
            for (let i = 0; i < cityNum; ++i) {
                let city_conf: st_city_info = MyUserData.myCityList[i].cityCfg
                population += city_conf.population;
            }
            this.list_view.numItems = cityNum;
        } else {
            let townNum = MyUserData.myTownIdxs.length;
            this.list_view.numItems = townNum;
            population = 10000 * Math.min(5, townNum);
        }
        this.population = population
        this.populationLabel.string = "人口: " + population + "户"
        this.tax_gold = 0;
        this.tax_food = 0;

        this.initTimeEndData();  //初始化征收倒计时
        this.unschedule(this.showScheduleTime.bind(this));
        this.schedule(this.showScheduleTime.bind(this), 1);
    }

    //征收
    onGetBtnClick() {
        if (this.tax_gold <= 0 && this.tax_food <= 0) {
            ROOT_NODE.showTipsText("税收时间未到，暂未有可用税赋!");
        } else {
            ROOT_NODE.showTipsText("征收税粮 " + this.tax_food + "屯");
            ROOT_NODE.showTipsText("征收税金 " + this.tax_gold + "锭");
            MyUserMgr.updateGoldTaxTime(this.tax_gold, this.tax_food);
            this.initTimeEndData();  //初始化征收倒计时
        }
    }

    showScheduleTime() {
        this.time_end -= 1.0;
        if (this.time_end < 0) {
            this.initTimeEndData();  //初始化征收倒计时
        }
        this.timeLabel.string = "征收倒计时：" + FunMgr.format_time(this.time_end, "%02d:%02d:%02d:%02d", 3, "hour")
    }

    //初始化征收倒计时
    initTimeEndData() {
        let time_offset = Math.floor(MyUserData.totalLineTime - MyUserData.lastGoldTaxTime); //总的在线时长  秒数而非时间戳
        let time_count = Math.floor(time_offset / 12000)   //可以征收的税赋回合
        this.time_end = 12000 - (time_offset % 12000)   //下次征收倒计时
        cc.log("initTimeEndData 初始化征收倒计时 time_offset = " + time_offset + "; time_count = " + time_count + "; this.time_end = " + this.time_end)
        this.timeLabel.string = "征收倒计时：" + FunMgr.format_time(this.time_end, "%02d:%02d:%02d:%02d", 3, "hour")

        let output = CfgMgr.getBuildOutputByLv("government", this.builderInfo.level)
        cc.log("output = " + output + "; this.population = " + this.population)

        let year_gold: number = Math.floor((output * 12000 * (this.population / 10000)) / 1000)   //1金锭 = 1000 金币
        let year_food: number = Math.floor((output * 12000 * (this.population / 10000)) / 1000)   // 1屯粮 = 1000 石粮  100斤粮=1石粮=1金币
        //10000百姓1s缴纳税粮1石税金1金币，一年（12000s)缴纳12屯粮12锭金
        this.tax_gold = Math.floor(year_gold * time_count);
        this.tax_food = Math.floor(year_food * time_count);

        this.goldLabel.string = this.tax_gold + "+" + year_gold   //税金
        this.foodLabel.string = this.tax_food + "+" + year_food   //税粮
    }

}
