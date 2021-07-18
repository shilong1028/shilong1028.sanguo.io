/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:14:18
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-17 10:48:18
 * @Description: 游戏逻辑相关的接口或处理方法
 */
import { st_story_info, ItemInfo, GeneralInfo, BeautyInfo } from "./ConfigManager";
import { MyUserMgr, MyUserData } from "./MyUserData";
import { ComItemType, TaskState, TaskType } from "./Enum";
import { LoaderMgr } from './LoaderManager';
import NickEditLayer from "../hall/nickEditLayer";
import SelCityLayer from "../hall/selCityLayer";
import AppFacade from '../puremvc/appFacade';
import CapitalCommand from '../puremvc/capitalCommand';

//游戏管理器
const { ccclass, property } = cc._decorator;

@ccclass
class GameManager {

    boxTouchCount: number = 0;

    curTaskConf: st_story_info = null;   //当前任务配置
    curTask_NewOffices: number[] = null;   //当前任务剧情对话获取的新官职集合
    curTask_NewGenerals: number[] = null;   //当前任务剧情对话获取的新武将集合

    CityNearsMap: Map<number, number[]> = new Map<number, number[]>();  //邻近城池Map


    /**判定金币是否充足 */
    checkGoldEnoughOrTips(cost: number, bTips: boolean = true) {
        if (MyUserData.GoldCount >= cost && cost >= 0) {
            return true;
        } else {
            if (bTips) {
                LoaderMgr.showGoldAddDialog();
            }
            return false;
        }
    }

    /**判定粮草是否充足 */
    checkFoodEnoughOrTips(cost: number, bTips: boolean = true) {
        if (MyUserData.FoodCount >= cost && cost >= 0) {
            return true;
        } else {
            if (bTips) {
                LoaderMgr.showGoldAddDialog();
            }
            return false;
        }
    }

    /** 领取奖励*/
    receiveRewards(rewards: ItemInfo[], multi: number = 1) {
        cc.log("receiveRewards(), 领取奖励 multi = " + multi + "; rewards = " + JSON.stringify(rewards));
        if (rewards) {
            let bSaveList = false;
            for (let i = 0; i < rewards.length; ++i) {
                let itemInfo: ItemInfo = rewards[i];
                if (itemInfo.itemId === ComItemType.Gold) {   //金币
                    MyUserMgr.updateUserGold(itemInfo.count * multi);
                } else if (itemInfo.itemId === ComItemType.Diamond) {   //钻石
                    MyUserMgr.updateUserDiamond(itemInfo.count * multi);
                } else if (itemInfo.itemId === ComItemType.Food) {   //粮草
                    MyUserMgr.updateUserFood(itemInfo.count * multi);
                } else if (itemInfo.itemId === ComItemType.Exp0) {   //主角（武将）经验(直接添加到主角身上)
                    MyUserMgr.updateRoleExp(itemInfo.count * multi);
                } else {   //其他道具
                    bSaveList = true;
                    itemInfo.count *= multi;
                    MyUserMgr.updateItemList(itemInfo, false);
                }
            }
            if (bSaveList === true) {
                MyUserMgr.saveItemList();   //保存背包物品列表
            }
        }
    }

    /**任务某阶段操作完毕处理 */
    handleStoryNextOpt(storyConf: st_story_info, nextState: TaskState) {
        cc.log("handleStoryNextOpt(), 任务操作完毕 MyUserData.TaskState = " + MyUserData.TaskState + "; storyConf = " + JSON.stringify(storyConf));
        if (storyConf == null || storyConf == undefined || storyConf.type == 0) {
            return;
        }

        switch (nextState) {
            case TaskState.Finish:
                //任务状态 0未完成，1对话完成，2完成未领取，3已领取
                if (MyUserData.TaskState == TaskState.Ready) {   //任务对话（第一阶段）处理完毕
                    cc.log("任务对话（第一阶段）处理完毕")
                    GameMgr.saveCurTaskOfficesAndGenerals();  //存储根据当前任务剧情保存的新官职和新武将

                    //任务类型 1 剧情 2战斗 3招募 4封官拜将 5主城建设 6招武将 7驻守 8技能 9攻城略地
                    if (storyConf.type == TaskType.Story) {
                        if (storyConf.id === 1001 || storyConf.id === 1002) {   //创建昵称，选择县城
                            MyUserMgr.updateTaskState(MyUserData.TaskId, TaskState.Finish);
                        } else {
                            MyUserMgr.updateTaskState(MyUserData.TaskId, TaskState.Reward);
                        }
                    } else {
                        MyUserMgr.updateTaskState(MyUserData.TaskId, TaskState.Finish);
                    }
                } else if (MyUserData.TaskState == TaskState.Finish) {
                    this.handleStoryTalkNext(storyConf);   //处理剧情对话展示后的操作
                }
                break;
            case TaskState.Reward:
                //任务状态 0未完成，1对话完成，2完成未领取，3已领取
                if (MyUserData.TaskState == TaskState.Finish) {
                    MyUserMgr.updateTaskState(MyUserData.TaskId, TaskState.Reward);
                }
                break;
            default:
                cc.log("handleStoryNextOpt 状态异常 nextState = " + nextState + "; MyUserData.TaskState = " + MyUserData.TaskState)
        }
        //大厅会通过消息监听同步任务状态后，进行后续处理

        // if(MyUserData.TaskId == SpecialStory.taishouOpen){   //东郡太守
        //     MyUserMgr.updateMyCityIds(316, true);  
        // }else if(MyUserData.TaskId == SpecialStory.zhoumuOpen){   //兖州牧
        //     let ruleCitys = [];
        //     ruleCitys = [312, 313, 314, 315, 9006, 9008]
        //     MyUserMgr.addRuleCitys(ruleCitys);
        //     MyUserMgr.updateMyCityIds(315, true); 
        // }
    }

    /**处理剧情对话展示后的操作 */
    handleStoryTalkNext(storyConf: st_story_info) {
        if (MyUserData.TaskState === TaskState.Finish) {   //对话完成
            //任务类型 1 剧情 2战斗 3招募 4封官拜将 5主城建设 6招武将 7驻守 8技能 9攻城略地
            cc.log("handleStoryTalkNext 任务对话完成，后续操作 storyConf.type = " + storyConf.type)
            switch (storyConf.type) {
                case TaskType.Story:  //剧情
                    if (storyConf.id === 1001) {   //创建昵称
                        LoaderMgr.showBundleLayer('ui_nickEditLayer', 'nickEditLayer', null, (layer) => {
                            let tsComp = layer.getComponent(NickEditLayer)
                            if (!tsComp) {
                                tsComp = layer.addComponent(NickEditLayer)
                            }
                            tsComp.setStoryConf(storyConf);
                        });
                    } if (storyConf.id === 1002) {   //选择县城
                        LoaderMgr.showBundleLayer('ui_selCityLayer', 'selCityLayer', null, (layer) => {
                            let tsComp = layer.getComponent(SelCityLayer)
                            if (!tsComp) {
                                tsComp = layer.addComponent(SelCityLayer)
                            }
                            tsComp.setStoryConf(storyConf);
                        });
                    }
                    break;
                case TaskType.Fight:  //战斗
                    //this.openFightByTask(storyConf);   //战斗选将准备界面
                    break;
                case TaskType.Recruit:  // 招募
                    AppFacade.getInstance().sendNotification(CapitalCommand.E_ON_GeneralRecruit);  //通知部曲招募
                    break;
                case TaskType.Offical:  //封官拜将
                    break;
                case TaskType.Capital:  //主城建设
                    AppFacade.getInstance().sendNotification(CapitalCommand.E_ON_BuilderHand, storyConf.builder);  //通知显示或隐藏建筑手指
                    break;
                case TaskType.General:   //招武将
                    break;
                case TaskType.Garrison:  //驻守
                    break;
                case TaskType.Skill:  //技能
                    break;
                case TaskType.Beauty:  //后宅美姬
                    AppFacade.getInstance().sendNotification(CapitalCommand.E_ON_TeaseBeauty);   //通知挑逗美姬
                    break;
            }
        }
    }

    /**设置游戏当前的剧情任务 */
    setGameCurTask(taskConf: st_story_info) {
        this.curTaskConf = taskConf;   //当前任务配置
        this.curTask_NewOffices = null;   //当前任务剧情对话获取的新官职集合
        this.curTask_NewGenerals = null;   //当前任务剧情对话获取的新武将或美姬集合
    }
    /**重置当前任务的官职和武将奖励 */
    resetCurTaskOfficesAndGenerals() {
        this.curTask_NewOffices = null;   //当前任务剧情对话获取的新官职集合
        this.curTask_NewGenerals = null;   //当前任务剧情对话获取的新武将或美姬集合
    }
    /**存储根据当前任务剧情保存的新官职和新武将或美姬 */
    saveCurTaskOfficesAndGenerals() {
        cc.log("存储根据当前任务剧情保存的新官职和新武将")
        if (this.curTask_NewOffices && this.curTask_NewOffices.length > 0) {
            MyUserMgr.updateOfficalIds(this.curTask_NewOffices);  //更新主角官职（可身兼数职）
        }
        this.curTask_NewOffices = null;   //当前任务剧情对话获取的新官职集合

        if (this.curTask_NewGenerals) {  //武将来投或新纳美姬
            if (this.curTask_NewGenerals.length > 1 || this.curTask_NewGenerals[0] > 1000) {   //武将来投
                for (let i = 0; i < this.curTask_NewGenerals.length; ++i) {
                    let generalId = this.curTask_NewGenerals[i]
                    let info = new GeneralInfo(generalId);
                    if (i < this.curTask_NewGenerals.length - 1) {
                        MyUserMgr.addGeneralToList(info, false);   //添加武将到列表
                    } else {
                        MyUserMgr.addGeneralToList(info, true);   //添加武将到列表
                    }
                }
            } else {   //新纳美姬
                let beautyId = this.curTask_NewGenerals[0]
                let info = new BeautyInfo(beautyId);
                MyUserMgr.updateBeautyList(info, true);   //添加新纳美姬
            }
        }
        this.curTask_NewGenerals = null;   //当前任务剧情对话获取的新武将集合
    }
    /**添加当前剧情获得的新官职ID */
    addCurTaskNewOffices(officeIds: number[]) {
        cc.log("addCurTaskNewOffices officeIds = " + JSON.stringify(officeIds))
        if (!this.curTask_NewOffices) {
            this.curTask_NewOffices = officeIds;
        } else {
            for (let i = 0; i < officeIds.length; i++) {
                let newId = officeIds[i];
                let bHad = false;
                for (let j = 0; j < this.curTask_NewOffices.length; j++) {
                    if (this.curTask_NewOffices[j] == newId) {
                        bHad = true;
                        break;
                    }
                }
                if (bHad != true) {
                    this.curTask_NewOffices.push(newId);
                }
            }
        }
    }
    /**添加当前剧情获得的新武将ID */
    addCurTaskNewGenerals(generalIds: number[]) {
        if (!this.curTask_NewGenerals) {
            this.curTask_NewGenerals = generalIds;
        } else {
            for (let i = 0; i < generalIds.length; i++) {
                let newId = generalIds[i];
                let bHad = false;
                for (let j = 0; j < this.curTask_NewGenerals.length; j++) {
                    if (this.curTask_NewGenerals[j] == newId) {
                        bHad = true;
                        break;
                    }
                }
                if (bHad != true) {
                    this.curTask_NewGenerals.push(newId);
                }
            }
        }
    }


    // /**获取主城场景 */
    // getCapitalScene(): CapitalScene {
    //     let capitalScene: CapitalScene = null;
    //     let layer = cc.director.getScene().getChildByName("Canvas");
    //     if (layer != null) {
    //         capitalScene = layer.getComponent(CapitalScene);
    //     }
    //     return capitalScene;
    // }

    // //获取城池路径（最多途径10城规划出2条最短路径）
    // getNearCitysLine(srcCityId: number, destCityId: number) {
    //     cc.log("getNearCitysLine(), srcCityId = " + srcCityId + "; destCityId = " + destCityId);

    //     let retpathArr = [];   //多条路径的集合
    //     let srcIdsArr = [];
    //     srcIdsArr.push([srcCityId]);  //源头深度探索路径

    //     for (let t = 0; t < 10; t++) {
    //         let tempSrcIds = [];
    //         for (let s = 0; s < srcIdsArr.length; ++s) {
    //             let tempSrcArr = srcIdsArr[s];   //某一条源头深度探索路径
    //             let lastSrcId = tempSrcArr[tempSrcArr.length - 1];

    //             if (lastSrcId == destCityId) {  //源路径衔接上了目标路径
    //                 retpathArr.push(tempSrcArr);  //多条路径的集合
    //             } else {
    //                 let srcNears = this.CityNearsMap[lastSrcId];  //某一条源头深度探索最后一个城池的邻近城池，注意剔除已经在路径中的城池。
    //                 for (let i = 0; i < srcNears.length; ++i) {
    //                     let bInPath = false;
    //                     for (let j = 0; j < tempSrcArr.length; ++j) {   //判定新的邻近城池是否已经在路径中了
    //                         if (srcNears[i] == tempSrcArr[j]) {
    //                             bInPath = true;
    //                             break;
    //                         }
    //                     }
    //                     if (bInPath == false) {
    //                         let tempArr = [];
    //                         for (let j = 0; j < tempSrcArr.length; ++j) {   //继续遍历某一条源头深度探索路径，从而增加深度城池
    //                             tempArr.push(tempSrcArr[j]);
    //                         }
    //                         tempArr.push(srcNears[i]);

    //                         tempSrcIds.push(tempArr);  //新的源路径
    //                     }
    //                 }
    //             }
    //         }

    //         srcIdsArr = tempSrcIds;   //新的源路径
    //         if (srcIdsArr.length == 0 || retpathArr.length >= 2) {   //已经规划了N条路线了
    //             break;
    //         }
    //     }

    //     if (retpathArr.length == 0) {
    //         return null;   //两城相距太远
    //     } else {
    //         return retpathArr;
    //     }
    // }




}
export var GameMgr = new GameManager();


