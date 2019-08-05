import { ROOT_NODE } from "../common/rootNode";
import RewardLayer from "../common/rewardLayer";
import { ItemInfo } from "./Enum";
import { MyUserMgr, MyUserData } from "./MyUserData";
import { st_story_info } from "./ConfigManager";
import MainScene from "../main/mainScene";


//游戏菜单管理器
const {ccclass, property} = cc._decorator;

@ccclass
class GameManager {

    curTaskConf: st_story_info = null;   //当前任务配置

    CityNearsMap : Map<number, number[]> = new Map<number, number[]>();  //邻近城池Map

    //获取城池路径
    getNearCitysLine(srcCityId: number, destCityId: number){
        cc.log("getNearCitysLine(), srcCityId = "+srcCityId+"; destCityId = "+destCityId);

        let retArr = new Array();
        let srcIdsArr = new Array();
        srcIdsArr.push([srcCityId]);

        for(let t=0; t<10; t++){
            let tempSrcIds = new Array();
            for(let s=0; s<srcIdsArr.length; ++s){
                let tempSrcArr = srcIdsArr[s];
                let lastSrcId = tempSrcArr[tempSrcArr.length-1];

                if(lastSrcId == destCityId){  //源路径衔接上了目标路径
                    retArr.push(tempSrcArr);
                }else{
                    let srcNears = this.CityNearsMap[lastSrcId];
                    for(let i=0; i<srcNears.length; ++i){
                        let tempArr = new Array();
                        for(let j=0; j<tempSrcArr.length; ++j){
                            tempArr.push(tempSrcArr[j]);
                        }
                        tempArr.push(srcNears[i]);

                        tempSrcIds.push(tempArr);  //新的源路径
                    }
                }
            }

            srcIdsArr = tempSrcIds;   //新的源路径
            if(srcIdsArr.length == 0 || retArr.length >= 2){   //已经规划了两条路线了
                break;
            }
        }

        if(retArr.length == 0){
            return null;   //两城相距太远
        }else{
            return retArr;
        }
    }


    /************************  以下为UI接口  ************** */

    /**获取主场景 */
    getMainScene(): MainScene {
        let mainScene: MainScene = null;
        let layer = cc.director.getScene().getChildByName("Canvas");
        if (layer != null) {
            mainScene = layer.getComponent(MainScene);
        }
        return mainScene;
    }

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
            layer.position = cc.v2(cc.winSize.width/2, cc.winSize.height/2);
        }
        parent.addChild(layer);
        return layer;
    }

    /**显示通用奖励提示框 */
    showRewardLayer(rewardList:any, callback: any=null, target: any=null){
        let layer = this.showLayer(ROOT_NODE.pfReward);
        let rewardSc = layer.getComponent(RewardLayer);
        if(rewardSc){
            rewardSc.setRewardCallback(callback, target);
        }
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




    //********************  以下为应用接口函数  ********************* */
    
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
        cc.log("receiveRewards(), rewards = "+JSON.stringify(rewards));
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

    /**任务第一阶段操作完毕处理 */
    handleStoryShowOver(storyConf: st_story_info){
        cc.log("handleStoryShowOver(), storyConf = "+JSON.stringify(storyConf));
        if(storyConf == null || storyConf == undefined){
            return;
        }
        if(storyConf.type > 0){   //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗
            MyUserMgr.updateTaskState(MyUserData.TaskId, 1);  //修改用户任务 0未完成，1完成未领取，2已领取 
        }

        if(MyUserData.TaskId == 9){   //东郡太守
            MyUserMgr.updateMyCityIds(316, true);  
        }else if(MyUserData.TaskId == 10){   //兖州牧
            let ruleCitys = new Array(312, 313, 314, 9006, 9008);
            MyUserMgr.addRuleCitys(ruleCitys);
            MyUserMgr.updateMyCityIds(315, true); 
        }
    }

}
export var GameMgr = new GameManager();


