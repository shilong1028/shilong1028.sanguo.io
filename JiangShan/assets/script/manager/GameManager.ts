import { st_story_info, ItemInfo } from "./ConfigManager";
import { MyUserMgr, MyUserData } from "./MyUserData";
import { FunMgr } from "./Enum";
import { ROOT_NODE } from "../login/rootNode";
import LoadingLayer from "../login/loadingLayer";
import TipsDialog from "../login/tipsDialog";
import MainScene from "../hall/mainScene";


//游戏管理器
const {ccclass, property} = cc._decorator;

@ccclass
class GameManager {

    boxTouchCount : number = 0;

    curTaskConf: st_story_info = null;   //当前任务配置

    CityNearsMap : Map<number, number[]> = new Map<number, number[]>();  //邻近城池Map


    /************************  以下为UI接口  ************** */

    goToSceneWithLoading(sceneName:string, bShowLoading: boolean = true){
        cc.log("goToSceneWithLoading(), sceneName = "+sceneName);
        if(bShowLoading){
            let layer = this.showLayer(ROOT_NODE.pfLoading);
            layer.zIndex = cc.macro.MAX_ZINDEX - 10;
            layer.opacity = 255;
            var loading = layer.getComponent(LoadingLayer);
            loading.goToScene(sceneName);
    
            cc.director.preloadScene(sceneName, (count, total, item)=>{
                loading.onProgress(count, total, item);
            }, 
            (err)=>{   //加载完成的回调
                loading.loadFinish(err);
            });
        }else{
            cc.director.loadScene(sceneName);
        }
    }

    //切换到主场景
    gotoMainScene(){	
        this.goToSceneWithLoading("mainScene", true);
    } 

    /**获取主场景 */
    getMainScene(): MainScene {
        let mainScene: MainScene = null;
        let layer = cc.director.getScene().getChildByName("Canvas");
        if (layer != null) {
            mainScene = layer.getComponent(MainScene);
        }
        return mainScene;
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

    /**显示子层 */
    showLayer(prefab: cc.Prefab, parent: cc.Node = null){
        let layer = cc.instantiate(prefab);
        layer.width = cc.winSize.width;
        layer.height = cc.winSize.height;
        
        let bg = layer.getChildByName("bg");
        if(bg){
            bg.width = cc.winSize.width;
            bg.height = cc.winSize.height;
        }

        if(parent == null){
            parent = cc.director.getScene();
            layer.setPosition(cc.v2(cc.winSize.width/2, cc.winSize.height/2));
        }
        parent.addChild(layer);
        return layer;
    }

    /**显示通用奖励提示框 */
    showRewardLayer(rewardList:any, callback: any=null, target: any=null){
        let layer = this.showLayer(ROOT_NODE.pfReward);
        // let rewardSc = layer.getComponent(RewardLayer);
        // if(rewardSc){
        //     rewardSc.setRewardCallback(callback, target);
        // }
        return layer;
    }

    /**通过内存图集创建序列帧动画 */
    createAtlasAniNode(atlas: cc.SpriteAtlas, sample: number = 18, wrapMode: cc.WrapMode=cc.WrapMode.Default){
        if(atlas){
            let effNode = new cc.Node;
            effNode.addComponent(cc.Sprite);

            let animation: cc.Animation = effNode.addComponent(cc.Animation);
            var clip = cc.AnimationClip.createWithSpriteFrames(atlas.getSpriteFrames(), sample);
            clip.name = atlas.name;
            clip.wrapMode = wrapMode;
            animation.addClip(clip);

            if (wrapMode == cc.WrapMode.Default) {
                animation.on("stop", function () {
                    effNode.removeFromParent(true);
                });
            }

            animation.play(atlas.name);

            return effNode;
        }
        return null;
    }

    /**通过加载图集资源创建序列帧动画 */
	createAniByLoadRes(res:string, sample: number = 18, wrapMode: cc.WrapMode=cc.WrapMode.Default) {
        let effNode = new cc.Node;
        effNode.addComponent(cc.Sprite);
        let animation: cc.Animation = effNode.addComponent(cc.Animation);

		cc.loader.loadRes(res, cc.SpriteAtlas, function (err, SpriteAtlas) {
			if (err) {
				cc.log(err);
				return;
			}
			/* 添加SpriteFrame到frames数组 */
			var clip = cc.AnimationClip.createWithSpriteFrames(SpriteAtlas.getSpriteFrames(), sample);
			clip.name = res;
			clip.wrapMode = wrapMode;
            animation.addClip(clip);
            
            if (wrapMode == cc.WrapMode.Default) {
                animation.on("stop", function () {
                    effNode.removeFromParent(true);
                });
            }

            animation.play(res);

        }.bind(this));
        
        return effNode;
    }

    //加载单张图标初始化精灵纹理
    setSpriteFrameByImg(path:string, sprnode:cc.Node, callback:Function=null){
        cc.loader.loadRes(path, cc.SpriteFrame, function (err, asset) {
            sprnode.getComponent(cc.Sprite).spriteFrame = asset;
            if(callback){
                callback(sprnode);
            }
        });
    }

    //********************  以下为应用接口函数  ********************* */
        
    /**通过Str解析获取道具列表 */
    getItemArrByStr(itemstr: string): Array<ItemInfo>{
        let rewardArr: ItemInfo[] = new Array();
        let rewards = FunMgr.getKeyValAry(itemstr, ";", "-"); 
        for(let i=0; i<rewards.length; ++i){
            let itemId = parseInt(rewards[i].key);
            let count = rewards[i].val;
            let item = new ItemInfo(itemId, count);
            rewardArr.push(item);
        }
        return rewardArr;
    }

    /**通过配置keyVal数据砖块道具列表 */
    getItemArrByKeyVal(rewards: any[]): Array<ItemInfo>{
        //cc.log("getItemArrByKeyVal(), rewards = "+JSON.stringify(rewards));
        let rewardArr: ItemInfo[] = new Array();
        for(let i=0; i<rewards.length; ++i){
            let itemId = parseInt(rewards[i].key);
            let count = rewards[i].val;
            let item = new ItemInfo(itemId, count);
            rewardArr.push(item);
        }
        return rewardArr;
    }

    /** 领取奖励*/
    receiveRewards(rewards: ItemInfo[]){
        //cc.log("receiveRewards(), rewards = "+JSON.stringify(rewards));
        if(rewards){
            let bSaveList = false;
            for(let i=0; i<rewards.length; ++i){
                let itemInfo: ItemInfo = rewards[i];
                if(itemInfo.itemId == 6001){   //金币
                    MyUserMgr.updateUserGold(itemInfo.count);
                }else if(itemInfo.itemId == 6002){   //钻石
                    MyUserMgr.updateUserDiamond(itemInfo.count);
                }else if(itemInfo.itemId == 6003){   //粮草
                    MyUserMgr.updateUserFood(itemInfo.count);
                }else if(itemInfo.itemId == 6101){   //主角（武将）经验
                    MyUserMgr.updateRoleExp(itemInfo.count);
                }else{   //其他道具
                    bSaveList = true;
                    MyUserMgr.updateItemList(itemInfo, false);
                }
            }
            if(bSaveList == true){
                MyUserMgr.saveItemList();   //保存背包物品列表
            }
        }
    }

    //打开任务奖励领取界面
    openTaskRewardsLayer(storyConf: st_story_info){
        cc.log("openTaskRewardsLayer(), 任务奖励 storyConf = "+JSON.stringify(storyConf));
        if(storyConf == null || storyConf == undefined){
            return;
        }

        
    }

    /**任务第一阶段操作完毕处理 */
    handleStoryShowOver(storyConf: st_story_info){
        cc.log("handleStoryShowOver(), 任务操作完毕 storyConf = "+JSON.stringify(storyConf));
        if(storyConf == null || storyConf == undefined){
            return;
        }
        if(storyConf.type > 0){   //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗 6学习技能 7攻城掠地
            MyUserMgr.updateTaskState(MyUserData.TaskId, 1);  //修改用户任务 0未完成，1完成未领取，2已领取 
            this.openTaskRewardsLayer(storyConf);  //打开任务领奖界面
        }

        // if(MyUserData.TaskId == SpecialStory.taishouOpen){   //东郡太守
        //     MyUserMgr.updateMyCityIds(316, true);  
        // }else if(MyUserData.TaskId == SpecialStory.zhoumuOpen){   //兖州牧
        //     let ruleCitys = new Array();
        //     ruleCitys = [312, 313, 314, 315, 9006, 9008]
        //     MyUserMgr.addRuleCitys(ruleCitys);
        //     MyUserMgr.updateMyCityIds(315, true); 
        // }
    }

    GetBannerWidth(){
        let designSize = cc.view.getDesignResolutionSize();
        let frameSize = cc.view.getFrameSize();
        let frameScale = frameSize.height/frameSize.width; 
        let hScale = frameSize.height/(designSize.height/2);
        let adWidth = 300;   //最小宽度   //414*144, 315*109.6 349*121.4  300*104.4 369*128.4    高为宽的0.348
        if(frameScale >= 1.8){   //等宽放缩，背景高拉伸，顶底按钮位移
            adWidth = Math.min(Math.floor(315 * (1+(hScale-1)/2)), frameSize.width);
        }else{
            if(hScale < 1.0){   //小屏幕缩小
                adWidth = 300
            }else{
                if(frameSize.width > 315){  
                    adWidth = 315
                }else{
                    adWidth = frameSize.width;
                }
            }
        }
        adWidth = Math.max(adWidth, 300);
        return adWidth;
    }


    //获取金币提示框
    showGoldAddDialog(){
        this.showLayer(ROOT_NODE.pfGoldAdd);
    }

    //通用提示框
    showTipsDialog(tipStr: string, okCallback: any=null){
        let tips = this.showLayer(ROOT_NODE.pfTipsDialog);
        tips.getComponent(TipsDialog).setTipStr(tipStr, okCallback);
    }


    //获取城池路径（最多途径10城规划出2条最短路径）
    getNearCitysLine(srcCityId: number, destCityId: number){
        cc.log("getNearCitysLine(), srcCityId = "+srcCityId+"; destCityId = "+destCityId);

        let retpathArr = new Array();   //多条路径的集合
        let srcIdsArr = new Array();
        srcIdsArr.push([srcCityId]);  //源头深度探索路径

        for(let t=0; t<10; t++){
            let tempSrcIds = new Array();
            for(let s=0; s<srcIdsArr.length; ++s){
                let tempSrcArr = srcIdsArr[s];   //某一条源头深度探索路径
                let lastSrcId = tempSrcArr[tempSrcArr.length-1];

                if(lastSrcId == destCityId){  //源路径衔接上了目标路径
                    retpathArr.push(tempSrcArr);  //多条路径的集合
                }else{
                    let srcNears = this.CityNearsMap[lastSrcId];  //某一条源头深度探索最后一个城池的邻近城池，注意剔除已经在路径中的城池。
                    for(let i=0; i<srcNears.length; ++i){
                        let bInPath = false;
                        for(let j=0; j<tempSrcArr.length; ++j){   //判定新的邻近城池是否已经在路径中了
                            if(srcNears[i] == tempSrcArr[j]){
                                bInPath = true;
                                break;
                            }
                        }
                        if(bInPath == false){
                            let tempArr = new Array();
                            for(let j=0; j<tempSrcArr.length; ++j){   //继续遍历某一条源头深度探索路径，从而增加深度城池
                                tempArr.push(tempSrcArr[j]);
                            }
                            tempArr.push(srcNears[i]);
    
                            tempSrcIds.push(tempArr);  //新的源路径
                        }
                    }
                }
            }

            srcIdsArr = tempSrcIds;   //新的源路径
            if(srcIdsArr.length == 0 || retpathArr.length >= 2){   //已经规划了N条路线了
                break;
            }
        }

        if(retpathArr.length == 0){
            return null;   //两城相距太远
        }else{
            return retpathArr;
        }
    }

}
export var GameMgr = new GameManager();


