/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:14:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-05 16:24:41
 * @Description: 
 */
import { st_story_info, ItemInfo, GeneralInfo, BeautyInfo } from "./ConfigManager";
import { MyUserMgr, MyUserData } from "./MyUserData";
import { ComItemType, TaskState, TaskType } from "./Enum";
import { FunMgr } from "./FuncManager";
import { LoaderMgr } from './LoaderManager';

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


    /************************  以下为UI接口  ************** */

    // //切换到主场景
    // gotoMainScene() {
    //     this.goToSceneWithLoading("mainScene", true);
    // }

    // /**获取主场景 */
    // getMainScene(): MainScene {
    //     let mainScene: MainScene = null;
    //     let layer = cc.director.getScene().getChildByName("Canvas");
    //     if (layer != null) {
    //         mainScene = layer.getComponent(MainScene);
    //     }
    //     return mainScene;
    // }

    // /**获取主城场景 */
    // getCapitalScene(): CapitalScene {
    //     let capitalScene: CapitalScene = null;
    //     let layer = cc.director.getScene().getChildByName("Canvas");
    //     if (layer != null) {
    //         capitalScene = layer.getComponent(CapitalScene);
    //     }
    //     return capitalScene;
    // }



    // /**通过内存图集创建序列帧动画 */
    // createAtlasAniNode(atlas: cc.SpriteAtlas, sample: number = 18, wrapMode: cc.WrapMode = cc.WrapMode.Default, parent?: cc.Node, childName?: string) {
    //     if (atlas) {
    //         let effNode = new cc.Node;
    //         effNode.addComponent(cc.Sprite);
    //         if (childName) {
    //             effNode.name = childName;
    //         }

    //         let animation: cc.Animation = effNode.addComponent(cc.Animation);
    //         var clip = cc.AnimationClip.createWithSpriteFrames(atlas.getSpriteFrames(), sample);
    //         clip.name = atlas.name;
    //         clip.wrapMode = wrapMode;
    //         animation.addClip(clip);

    //         if (wrapMode == cc.WrapMode.Default) {
    //             animation.on("stop", function () {
    //                 effNode.removeFromParent(true);
    //             });
    //         }

    //         animation.play(atlas.name);

    //         if (parent) {
    //             parent.addChild(effNode)
    //         }
    //         return effNode;
    //     }
    //     return null;
    // }

    // /**通过加载图集资源创建序列帧动画 */
    // createAniByLoadRes(res: string, sample: number = 18, wrapMode: cc.WrapMode = cc.WrapMode.Default) {
    //     let effNode = new cc.Node;
    //     effNode.addComponent(cc.Sprite);
    //     let animation: cc.Animation = effNode.addComponent(cc.Animation);

    //        //cc.resources.load
    //     cc.loader.loadRes(res, cc.SpriteAtlas, function (err, SpriteAtlas) {
    //         if (err) {
    //             cc.log(err);
    //             return;
    //         }
    //         /* 添加SpriteFrame到frames数组 */
    //         var clip = cc.AnimationClip.createWithSpriteFrames(SpriteAtlas.getSpriteFrames(), sample);
    //         clip.name = res;
    //         clip.wrapMode = wrapMode;
    //         animation.addClip(clip);

    //         if (wrapMode == cc.WrapMode.Default) {
    //             animation.on("stop", function () {
    //                 effNode.removeFromParent(true);
    //             });
    //         }

    //         animation.play(res);

    //     }.bind(this));

    //     return effNode;
    // }


    // //********************  以下为应用接口函数  ********************* */

    // /**通过Str解析获取道具列表 */
    // getItemArrByStr(itemstr: string): Array<ItemInfo> {
    //     let rewardArr: ItemInfo[] = [];
    //     let rewards = FunMgr.getKeyValAry(itemstr, ";", "-");
    //     for (let i = 0; i < rewards.length; ++i) {
    //         let itemId = parseInt(rewards[i].key);
    //         let count = rewards[i].val;
    //         let item = new ItemInfo(itemId, count);
    //         rewardArr.push(item);
    //     }
    //     return rewardArr;
    // }



    // GetBannerWidth() {
    //     let designSize = cc.view.getDesignResolutionSize();
    //     let frameSize = cc.view.getFrameSize();
    //     let frameScale = frameSize.height / frameSize.width;
    //     let hScale = frameSize.height / (designSize.height / 2);
    //     let adWidth = 300;   //最小宽度   //414*144, 315*109.6 349*121.4  300*104.4 369*128.4    高为宽的0.348
    //     if (frameScale >= 1.8) {   //等宽放缩，背景高拉伸，顶底按钮位移
    //         adWidth = Math.min(Math.floor(315 * (1 + (hScale - 1) / 2)), frameSize.width);
    //     } else {
    //         if (hScale < 1.0) {   //小屏幕缩小
    //             adWidth = 300
    //         } else {
    //             if (frameSize.width > 315) {
    //                 adWidth = 315
    //             } else {
    //                 adWidth = frameSize.width;
    //             }
    //         }
    //     }
    //     adWidth = Math.max(adWidth, 300);
    //     return adWidth;
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

    /** 领取奖励*/
    receiveRewards(rewards: ItemInfo[], multi: number = 1) {
        cc.log("receiveRewards(), 领取奖励 rewards = " + JSON.stringify(rewards));
        if (rewards) {
            let bSaveList = false;
            for (let i = 0; i < rewards.length; ++i) {
                let itemInfo: ItemInfo = rewards[i];
                if (itemInfo.itemId == ComItemType.Gold) {   //金币
                    MyUserMgr.updateUserGold(itemInfo.count * multi);
                } else if (itemInfo.itemId == ComItemType.Diamond) {   //钻石
                    MyUserMgr.updateUserDiamond(itemInfo.count * multi);
                } else if (itemInfo.itemId == ComItemType.Food) {   //粮草
                    MyUserMgr.updateUserFood(itemInfo.count * multi);
                } else if (itemInfo.itemId == ComItemType.Exp0) {   //主角（武将）经验(直接添加到主角身上)
                    MyUserMgr.updateRoleExp(itemInfo.count * multi);
                } else {   //其他道具
                    bSaveList = true;
                    itemInfo.count *= multi;
                    MyUserMgr.updateItemList(itemInfo, false);
                }
            }
            if (bSaveList == true) {
                MyUserMgr.saveItemList();   //保存背包物品列表
            }
        }
    }

    /**任务第一阶段操作完毕处理 */
    handleStoryShowOver(storyConf: st_story_info) {
        cc.log("handleStoryShowOver(), 任务操作完毕 MyUserData.TaskState = " + MyUserData.TaskState + "; storyConf = " + JSON.stringify(storyConf));
        if (storyConf == null || storyConf == undefined || storyConf.type == 0) {
            return;
        }

        //任务状态 0未完成，1对话完成，2完成未领取，3已领取
        if (MyUserData.TaskState == TaskState.Ready) {   //任务对话（第一阶段）处理完毕
            cc.log("任务对话（第一阶段）处理完毕")
            GameMgr.saveCurTaskOfficesAndGenerals();  //存储根据当前任务剧情保存的新官职和新武将

            //任务类型 1 剧情 2战斗 3招募 4封官拜将 5主城建设 6招武将 7驻守 8技能 9攻城略地
            if (storyConf.type == TaskType.Story) {
                if(storyConf.id === 1001 || storyConf.id === 1002){   //创建昵称，选择县城
                    MyUserMgr.updateTaskState(MyUserData.TaskId, TaskState.Finish);
                }else{
                    MyUserMgr.updateTaskState(MyUserData.TaskId, TaskState.Reward);
                }
            } else {
                MyUserMgr.updateTaskState(MyUserData.TaskId, TaskState.Finish);
            }
        } else if (MyUserData.TaskState == TaskState.Finish) {   //任务操作（第二阶段）处理完毕
            cc.log("任务操作（第二阶段）处理完毕")
            MyUserMgr.updateTaskState(MyUserData.TaskId, TaskState.Reward);
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


    // //------------------  以下为游戏逻辑处理  -----------------------------

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
            if(this.curTask_NewGenerals.length > 1 || this.curTask_NewGenerals[0] > 1000){   //武将来投
                for (let i = 0; i < this.curTask_NewGenerals.length; ++i) {
                    let generalId = this.curTask_NewGenerals[i]
                    let info = new GeneralInfo(generalId);
                    if (i < this.curTask_NewGenerals.length - 1) {
                        MyUserMgr.addGeneralToList(info, false);   //添加武将到列表
                    } else {
                        MyUserMgr.addGeneralToList(info, true);   //添加武将到列表
                    }
                }
            }else{   //新纳美姬
                let beautyId = this.curTask_NewGenerals[0]
                let info = new BeautyInfo(beautyId);
                MyUserMgr.updateBeautyList(info, true);   //添加新纳美姬
            }
        }
        this.curTask_NewGenerals = null;   //当前任务剧情对话获取的新武将集合
    }
    /**添加当前剧情获得的新官职ID */
    addCurTaskNewOffices(officeIds: number[]) {
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


}
export var GameMgr = new GameManager();


