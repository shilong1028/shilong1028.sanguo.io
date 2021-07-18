/*
 * @Author: your name
 * @Date: 2021-06-05 15:56:46
 * @LastEditTime: 2021-07-16 18:22:51
 * @LastEditors: dongsl
 * @Description: In User Settings Edit
 * @FilePath: \HanHero\assets\scripts\hall\builderLayer.ts
 */

import UI from '../util/ui';
import { LoaderMgr } from '../manager/LoaderManager';
import { BuilderInfo } from '../manager/ConfigManager';
import { GameMgr } from '../manager/GameManager';
import { MyUserMgr, MyUserData } from '../manager/MyUserData';
import { ROOT_NODE } from '../login/rootNode';
import { TaskState, TaskType, BuilderQualityArr, WeaponType } from '../manager/Enum';
import GuilderGovernment from './builders/builderGovernment';
import BuilderResidence from './builders/builderResidence';
import BuilderCastle from './builders/builderCastle';
import BuilderCommunity from './builders/builderCommunity';
import BuilderBarrack from './builders/builderBarrack';


//建筑概述
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Hall/builderLayer")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class BuilderLayer extends cc.Component {

    infoTab: cc.Node = null;
    updateTab: cc.Node = null;
    infoNode: cc.Node = null;
    updateNode: cc.Node = null;
    infoTab_sel: cc.Node = null;
    updateTab_sel: cc.Node = null;

    buildSpr: cc.Node = null;

    titleLabel: cc.Label = null;
    lvLabel: cc.Label = null;      //品质+等级
    descLabel: cc.Label = null;

    costIcon: cc.Node = null;
    costLabel: cc.Label = null;

    updateBtn: cc.Node = null;
    gradeBtn: cc.Node = null;
    detailBtn: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    builderInfo: BuilderInfo = null

    onLoad() {
        this.titleLabel = UI.find(this.node, "titleLabel").getComponent(cc.Label)
        this.buildSpr = UI.find(this.node, "buildSpr")
        this.lvLabel = UI.find(this.node, "lvLabel").getComponent(cc.Label)
        this.descLabel = UI.find(this.node, "descLabel").getComponent(cc.Label)

        this.costIcon = UI.find(this.node, "costIcon")
        this.costLabel = UI.find(this.node, "costLabel").getComponent(cc.Label)

        this.lvLabel.string = "";
        this.descLabel.string = "";
        this.costLabel.string = "";

        this.updateBtn = UI.find(this.node, "updateBtn")   //升级
        UI.on_btn_click(this.updateBtn, this.onUpdateBtn.bind(this))
        this.gradeBtn = UI.find(this.node, "gradeBtn")   //升阶
        UI.on_btn_click(this.gradeBtn, this.onGradeBtn.bind(this))
        this.detailBtn = UI.find(this.node, "detailBtn")   //详情
        UI.on_btn_click(this.detailBtn, this.onDetailBtn.bind(this))

        this.infoTab = UI.find(this.node, "infoTab")   //信息页签
        this.infoTab_sel = UI.find(this.infoTab, "selImg")
        this.updateTab = UI.find(this.node, "updateTab")   //升级页签
        this.updateTab_sel = UI.find(this.updateTab, "selImg")

        this.infoNode = UI.find(this.node, "infoNode")
        this.updateNode = UI.find(this.node, "updateNode")
        UI.on_btn_click(this.infoTab, this.onTabBtn.bind(this, 1))
        UI.on_btn_click(this.updateTab, this.onTabBtn.bind(this, 0))
    }

    onDestroy() {
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start() {
    }

    // update (dt) {}

    onCloseBtn() {
        this.closeLayer();
    }

    closeLayer() {
        this.node.destroy();
    }

    //初始化建筑信息
    initBuilderConf(builderInfo: BuilderInfo) {
        if (!builderInfo) {
            return;
        }
        this.builderInfo = builderInfo

        this.titleLabel.string = this.builderInfo.builderCfg.name
        this.lvLabel.string = BuilderQualityArr[this.builderInfo.quality] + " Lv:" + this.builderInfo.level;
        this.costLabel.string = this.builderInfo.builderCfg.cost["val"]

        this.descLabel.string = this.builderInfo.builderCfg.desc

        LoaderMgr.setBundleSpriteFrameByImg("hall", "res/builder/" + this.builderInfo.id_str, this.buildSpr);

        if (this.builderInfo.level > 20 || this.builderInfo.level % 5 > 0) {
            this.gradeBtn.active = false;
            this.updateBtn.active = true;
        } else {
            this.gradeBtn.active = true;
            this.updateBtn.active = false;
        }

        switch (this.builderInfo.id_str) {
            case "warehouse":  //武库
            case "prison":   //监狱
            case "tavern":   //酒肆
            case "wharf":   //码头
            case "academy":  //校场
                this.detailBtn.active = true;
                this.infoTab.active = false;
                break;
            default:
                this.detailBtn.active = false;
                this.infoTab.active = true;
        }

        if (MyUserData.TaskState === TaskState.Finish && GameMgr.curTaskConf.type === TaskType.Beauty) {   //对话完成  //后宅美姬
            this.onTabBtn(1)   //信息页签
        } else {
            this.onTabBtn(0)   //默认升级页签
        }
    }

    //页签
    onTabBtn(idx: number) {
        cc.log("onTabBtn idx = " + idx)
        if (idx === 0) {   //升级页签
            this.infoNode.active = false;
            this.updateNode.active = true;
            this.infoTab_sel.active = false;
            this.updateTab_sel.active = true;
        } else if (idx === 1) {   //信息页签
            this.infoNode.active = true;
            this.updateNode.active = false;
            this.infoTab_sel.active = true;
            this.updateTab_sel.active = false;

            if (this.infoNode.childrenCount === 0) {
                let builderName = this.builderInfo.id_str

                if (builderName === "stable" || builderName.indexOf("barracks_") >= 0) {  //军营
                    LoaderMgr.showBundleLayer('hall', 'ui/builders/builder_barrack', this.infoNode, (child) => {
                        child.addComponent(BuilderBarrack).initBarrack(this.builderInfo);
                        // case "barracks_dao":  //刀盾营是生产刀盾兵武器的地方，乡勇|轻装|重装|精锐|羽林步兵分别消耗1|2|3|4|5件刀盾。刀盾兵拥有前盾牌，护甲适中、防御适中、攻击适中、行动适中，可以克制枪兵，但受到弓兵克制。
                        // case "barracks_qiang": //枪戟营是生产枪戟兵武器的地方，乡勇|轻装|重装|精锐|羽林步兵分别消耗1|2|3|4|5件枪戟。枪戟兵拥有长枪或戟矛，护甲厚、防御高、攻击适中、行动缓慢，可以克制骑兵，但受到刀兵克制。
                        // case "barracks_gong": //弓弩营是生产弓弩兵武器的地方，乡勇|轻装|重装|精锐|羽林步兵分别消耗1|2|3|4|5件弓弩。弓弩兵拥有弓箭或弩机，护甲薄、防御低、攻击适高、行动快捷，可以克制刀兵，但受到骑兵克制。
                        // case "stable":  //马厩是培育战马的地方，乡勇|轻装|重装|精锐|羽林骑兵分别消耗1|2|3|4|5匹战马。骑兵拥有马匹和一件马刀或短矛，护甲薄、防御低、攻击适中、冲击力强、行动灵敏，可以克制弓兵，但受到枪兵克制。
                    });
                } else {
                    LoaderMgr.showBundleLayer('hall', 'ui/builders/builder_' + builderName, this.infoNode, (child) => {
                        switch (builderName) {
                            case "government":   //官府是主城的核心建筑，是其他建筑升阶的总开关，只有官府升阶之后，其他建筑方可升阶到最新品阶。
                                //官府等级还影响玩家每年的税赋钱粮收入，等级越高收入越高。官府的品阶依次为县衙（县令）->郡衙（郡守）->将府（将军）->州府（州牧）->王宫（王侯皇帝）
                                child.addComponent(GuilderGovernment).initGovernment(this.builderInfo);
                                break;
                            case "residence": //宅院为玩家的内宅，美姬妻妾都可在内宅中展现、操控娱乐。玩家称王之后，宅院升阶为铜雀台。宅院等级越高，可收集的美姬数量越多，可解锁的操控玩法越多。
                                child.addComponent(BuilderResidence).initBeautys(this.builderInfo, this.closeLayer.bind(this));
                                break;
                            case "warehouse": //武库是玩家存贮刀盾、枪戟、弓弩、护甲等装备的地方，也是展示玩家宝物道具的背包。武库等级越高，可存贮的装备数量越多。当装备数量达到最大存贮容量后，数量不再继续增加。
                                break;
                            case "posthouse": //驿站体现了游戏的道路通行能力，有助于提高玩家的行军速度，减少行军消耗。游戏中，千名士兵消耗1仓粮草可行军百里，驿站等级越高行军越远。同时，驿站也有助于同塞外异族的沟通和商业贸易，降低异族入侵的发生概率。
                                break;
                            case "castle":   //城防用于提升城池的防护能力，包含城墙、瓮城、箭楼等。城防等级提高可以提升守城驻守武将在城池防御战中的攻击力和防御力。
                                child.addComponent(BuilderCastle).initCastle(this.builderInfo);
                                break;
                            case "workshop":  //工坊是生产高级士兵护甲的地方，乡勇以上品阶的士兵必须同时装备护甲和相应武器。轻装(皮甲)|重装(石甲)|精锐(铁甲)|羽林(铜甲)分别消耗1|2|3|4件护甲。
                                break;
                            case "prison":  //监狱用于关押战斗中俘虏的敌方武将，通过抽打、利诱、释放、斩杀等方式招揽敌将。监狱等级越高，可用的牢房数量越多，可关押的敌将越多。
                                break;
                            case "farmland": //农田是玩家除税赋外另一个获取粮草的地方，农田等级越高，单位时间内获取的粮草越多。军队的维持需要每年消耗一定量的粮草，军队出征也需要消耗大量粮草，以保证战斗胜利。
                                break;
                            case "shops": //商铺是玩家除税赋外另一个获取金锭（金币）的地方，商铺等级越高，单位时间内获取的金币越多。
                                //商铺也出售士兵装备（护甲、枪戟、刀盾、弓弩、战马），武将装备（头盔、铠甲、武器、坐骑），道具（虎符、兵符、兵书等），其他（免战牌、丝帛、贡酒、奇珍异宝等）。
                                break;
                            case "tavern": //酒肆是在野武将经常出没的场所，酒馆等级越高，在野武将出现几率越高，知名武将出现的几率也越高。
                                break;
                            case "wharf": //码头是游戏的小游戏扩展点，可以进入一个捕鱼小游戏，通过捕鱼来赚取金币或道具。
                                break;
                            case "community": //民社是提高城池居民数量、改善居民生活条件的设施。游戏默认征兵最大限度为人口的10%，提升民社等级，可以增加最大征兵比率。
                                child.addComponent(BuilderCommunity).initCommunity(this.builderInfo);
                                break;
                            case "academy": //校场是除了战场，另一个提升武将经验等级的地方。游戏中，校场中伤兵复原率默认为50%，校场等级越高，伤兵复原率越高。
                                break;
                            case "market":  //集市是系统回收平台，玩家可以直接出售给集市（系统）一些无用的装备、道具、宝物、贡酒、丝帛等，以换取一定的金币，并减少武库使用容量。
                                break;
                            default:
                        }
                    });
                }
            }
        }
    }

    /**兵营护甲建筑初次升级，修改武器生产时间 */
    handleBarrackWeaonTime() {
        if (this.builderInfo.level > 0) {
            return;
        }
        let builderName: string = this.builderInfo.id_str;
        if (builderName === "stable" || builderName.indexOf("barracks_") >= 0) {  //军营
            let weaponItemId: number = 0;
            switch (builderName) {
                case "barracks_dao":
                    weaponItemId = WeaponType.dao
                    break;
                case "barracks_qiang":
                    weaponItemId = WeaponType.qiang
                    break;
                case "barracks_gong":
                    weaponItemId = WeaponType.gong
                    break;
                case "stable":
                    weaponItemId = WeaponType.horse
                    break;
                default:
            }
            MyUserMgr.updateWeaponItemTime(weaponItemId);
        }
    }

    //升级
    onUpdateBtn() {
        if (!this.builderInfo) {
            return;
        }
        if (this.builderInfo.id_str !== "government") {
            if (this.builderInfo.level + 1 > MyUserData.MainBuildLv) {
                ROOT_NODE.showTipsText("建筑升级受限，请先升级官府建筑!");
                return;
            }
        }

        let cost = this.builderInfo.builderCfg.cost["val"]
        if (GameMgr.checkGoldEnoughOrTips(cost)) {   //判定金币是否充足 
            if (this.builderInfo.level === 0) {
                this.handleBarrackWeaonTime();  //初次升级  兵营护甲建筑初次升级，修改武器生产时间 
            }
            this.builderInfo.updateBuildLv();  //升阶不升级  或  //升级不升阶
            MyUserMgr.updateUserGold(-cost);
            MyUserMgr.updateBuilderList(this.builderInfo);   //修改建筑列表
            this.lvLabel.string = BuilderQualityArr[this.builderInfo.quality] + " Lv:" + this.builderInfo.level;   //品质+Lv

            if (MyUserData.TaskState === TaskState.Finish && GameMgr.curTaskConf.type === TaskType.Capital) {   //对话完成
                if (GameMgr.curTaskConf.builder === this.builderInfo.id_str) {
                    GameMgr.handleStoryNextOpt(GameMgr.curTaskConf, TaskState.Reward);   //任务操作完毕处理准备领取奖励
                    this.closeLayer();
                }
            }
        }
    }

    //升阶
    onGradeBtn() {
        this.onUpdateBtn();
    }

    //详情
    onDetailBtn() {
        if (!this.builderInfo) {
            return;
        }
        let builderName = this.builderInfo.id_str
        switch (builderName) {
            case "warehouse":    //武库
                break;
            case "prison":     //牢房
                break;
            case "tavern":    //酒肆
                break;
            case "wharf":     //码头
                break;
            case "academy":    //校场
                break;
            default:
        }
    }
}
