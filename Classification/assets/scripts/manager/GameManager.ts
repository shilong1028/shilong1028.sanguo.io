import { LDMgr, LDKey } from "./StorageManager";
import { NoticeMgr, NoticeType } from "./NoticeManager";

//游戏菜单管理器
const {ccclass, property} = cc._decorator;

export const TipsClassStr = [
"有害垃圾：是指废电池、废灯管、废药品、废油漆及其容器等对人体健康或自然环境造成直接或潜在危害的废弃物。",
"可回收物：是指废纸张、废塑料、废玻璃制品、废金属、废织物等适宜回收循环利用和资源化利用的废弃物。",
"湿垃圾：日常生活产生的易腐的生物质废弃物（比如食材厨余、蔬菜花卉、瓜皮果核、中药渣等），注意应将包装物（如塑料袋）去除。",
"干垃圾：除有害垃圾、湿垃圾、可回收物以外的成分复杂难以分辨类别的其他生活废弃物。"
];


@ccclass
class GameManager {
    GoldCount: number = null;   //用户金币积分数

    /**修改用户金币 */
    updateUserGold(val:number, bSave: boolean = true){
        this.GoldCount += val;
        if(bSave){
            LDMgr.setItem(LDKey.KEY_GoldCount, this.GoldCount);
        }
        NoticeMgr.emit(NoticeType.UpdateGold, null);
    }
    getUserGold(){
        if(this.GoldCount == null){
            let goldStr = cc.sys.localStorage.getItem(LDKey.KEY_GoldCount);
            if(goldStr == "" || isNaN(goldStr) == true || goldStr == null || goldStr == undefined){   //第一次进入游戏
                this.GoldCount = 0;
                this.updateUserGold(200, true);
            }else{
                this.GoldCount = parseInt(goldStr);
            }
        }
        return this.GoldCount;
    }


    //************************* 以下为一些UI通用接口 ************************* */

    /**显示子层 */
    showLayer(prefab: cc.Prefab, parent: cc.Node = null){
        let layer = cc.instantiate(prefab);
        layer.width = cc.winSize.width;
        layer.height = cc.winSize.height;
        
        // let bg = layer.getChildByName("bg");
        // if(bg){
        //     bg.width = cc.winSize.width;
        //     bg.height = cc.winSize.height;
        // }

        if(parent == null){
            parent = cc.director.getScene();
            layer.position = cc.v2(cc.winSize.width/2, cc.winSize.height/2);
        }
        parent.addChild(layer);
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

}
export var GameMgr = new GameManager();


