import { st_build_info, BuilderInfo, CfgMgr, WeaponItem } from '../../manager/ConfigManager';
import UI from '../../util/ui';
import { WeaponType } from '../../manager/Enum';
import { MyUserMgr, MyUserData } from '../../manager/MyUserData';
/*
 * @Autor: dongsl
 * @Date: 2021-07-16 14:31:16
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-17 10:33:35
 * @Description:  现阶段按照在线时间来生成基础武器，乡勇|轻装|重装|精锐|羽林分别消耗1|2|3|4|5件刀盾|枪戟|弓弩|马匹。后期可以按照指令消耗时间和金币来生成指定类型的武器。
 */


//军营建筑信息详情
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Hall/builders/builderBarrack")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class BuilderBarrack extends cc.Component {

    weaponLabel: cc.Label = null;  //生产率
    weaponCount: cc.Label = null;  //可用量
    weaponNum: cc.Label = null;    //生产中

    // LIFE-CYCLE CALLBACKS:
    builderInfo: BuilderInfo = null;
    weaponName: string = ""
    weaponItemId: WeaponType = null   //武器道具ID
    weaponOutput: number = 0;   //武器1s产出率

    onLoad() {
        this.weaponLabel = UI.find(this.node, "weaponLabel").getComponent(cc.Label)
        this.weaponCount = UI.find(this.node, "weaponCount").getComponent(cc.Label)
        this.weaponNum = UI.find(this.node, "weaponNum").getComponent(cc.Label)
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

    initBarrack(builderInfo: BuilderInfo) {
        this.builderInfo = builderInfo

        let builderName = this.builderInfo.id_str
        switch (builderName) {
            case "barracks_dao":
                this.weaponName = "刀盾";
                this.weaponItemId = WeaponType.dao
                break;
            case "barracks_qiang":
                this.weaponName = "枪戟";
                this.weaponItemId = WeaponType.qiang
                break;
            case "barracks_gong":
                this.weaponName = "弓弩";
                this.weaponItemId = WeaponType.gong
                break;
            case "stable":
                this.weaponName = "战马";
                this.weaponItemId = WeaponType.horse
                break;
            default:
        }

        let beauty_conf: st_build_info = this.builderInfo.builderCfg;

        let output = Math.floor(CfgMgr.getBuildOutputByLv(builderName, this.builderInfo.level, false))
        this.weaponOutput = output / beauty_conf.interval;   //武器1s产出率
        this.weaponLabel.string = `${this.weaponName}生产率: ${output}件/${beauty_conf.interval}在线秒`

        let item_count = MyUserMgr.getUserItemCount(this.weaponItemId) * 100;
        this.weaponCount.string = `${this.weaponName}可用量: ${item_count}件`

        let weaponItem: WeaponItem = MyUserMgr.getWeaponItemById(this.weaponItemId);
        if (weaponItem) {
            this.weaponNum.string = `${this.weaponName}生产中: ${weaponItem.num}件`
        } else {
            this.weaponNum.string = `${this.weaponName}生产中: ${0}件`
        }

        this.unschedule(this.showScheduleTime.bind(this));
        if (this.builderInfo.level > 0) {
            this.showScheduleTime();
            this.schedule(this.showScheduleTime.bind(this), 1);
        }
    }

    showScheduleTime() {
        if (!this.builderInfo) {
            return;
        }
        let weaponItem: WeaponItem = MyUserMgr.getWeaponItemById(this.weaponItemId);
        if (weaponItem) {
            let old_num = weaponItem.num;
            let offsetTime = Math.floor(MyUserData.totalLineTime - weaponItem.saveTime);  //上次整存时间  （相当于在线时长秒数）
            let offset_num = Math.floor(this.weaponOutput * offsetTime) - old_num   //武器1s产出率
            if (offset_num > 0) {
                let new_weapon = MyUserMgr.updateWeaponItemByNum(this.weaponItemId, offset_num);
                if (new_weapon) {
                    let item_count = MyUserMgr.getUserItemCount(this.weaponItemId) * 100;
                    this.weaponCount.string = `${this.weaponName}可用量: ${item_count}件`
                }
            }
            this.weaponNum.string = `${this.weaponName}生产中: ${old_num + offset_num}件`
        }
    }

}
