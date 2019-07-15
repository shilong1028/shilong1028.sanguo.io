import { ROOT_NODE } from "../common/rootNode";
import RewardLayer from "../common/rewardLayer";
import { ItemInfo } from "./Enum";
import { MyUserMgr, MyUserData } from "./MyUserData";
import { st_story_info } from "./ConfigManager";


//游戏菜单管理器
const {ccclass, property} = cc._decorator;

@ccclass
class GameManager {

    curTaskConf: st_story_info = null;   //当前任务配置

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

    /**任务宣读(第一阶段）完毕处理 */
    handleStoryShowOver(storyConf: st_story_info){
        cc.log("handleStoryShowOver(), storyConf = "+JSON.stringify(storyConf));
        if(storyConf == null || storyConf == undefined){
            return;
        }
        if(storyConf.type == 1){   //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗
            MyUserMgr.updateTaskState(MyUserData.TaskId, 1);  //修改用户任务 0未完成，1完成未领取，2已领取 
        }else if(storyConf.type == 3){
            MyUserMgr.updateTaskState(MyUserData.TaskId, 1); 
        }else if(storyConf.type == 4){
            MyUserMgr.updateTaskState(MyUserData.TaskId, 1); 
        }
    }

}
export var GameMgr = new GameManager();


