import { ROOT_NODE } from "../common/rootNode";
import RewardLayer from "../common/rewardLayer";
import { ItemInfo } from "./Enum";


//游戏菜单管理器
const {ccclass, property} = cc._decorator;

@ccclass
class GameManager {

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

}
export var GameMgr = new GameManager();


