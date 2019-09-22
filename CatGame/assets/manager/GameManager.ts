import { ROOT_NODE } from "../common/rootNode";
import MainScene from "../main/mainScene";
import LoadingLayer from "../common/LoadingLayer";


//游戏菜单管理器
const {ccclass, property} = cc._decorator;

@ccclass
class GameManager {
    /**
     * 游戏中，目前有萌猫6种（炮台），毛球20种（炮弹），敌人20种，关卡100关（10章），主角等级20级（每过5关升一级）
     */

    playerCount: number = 6;   //炮台萌猫数量
    ballMaxLv: number = 20;  //炮弹配置中的最大等级
    blockOpenLevel: number[] = new Array(0,0,0,1,5, 10,20,30,45,60, 75,90);


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
            (err, asset)=>{   //加载完成的回调
                loading.loadFinish(err,asset);
            });
        }else{
            cc.director.loadScene(sceneName);
        }
    }

    //切换到主场景
    gotoMainScene(){	
        this.goToSceneWithLoading("mainScene", true);
    } 
    //切换到章节场景
    gotoChapterScene(){
        this.goToSceneWithLoading("chapterScene");
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


    /**数字科学显示 KMBT... 
     * @param num 要转换的数字
     * @param fixNum 小数点有效位数
    */
    num2e(num: number, fixNum: number = 4) {
        if (num <= 1000000) {
            return num.toString();
        } else {
            //将数值用parseFloat(num).Fixed(8)保留固定位数，但有个缺点，就是如果数值小于8位的，则会多出余数0，如:0.00000010
            //E是指数的意思，比如7.823E5=782300 这里E5表示10的5次方
            var p = Math.floor(Math.log(num) / Math.LN10);   //p是10的几次方
            var n = num * Math.pow(10, -p);   //n为最终显示的小数
            //return n + 'e' + p;
            //cc.log("num = "+num +"; p = "+p+"; n = "+n);

            let factor = Math.pow(10, fixNum);
            if (p < 6) {
                return num.toString(); 
            } else if (p < 9) {
                n = n * Math.pow(10, (p - 6));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "万";
             } else if (p < 12) {
                n = n * Math.pow(10, (p - 9));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "十万";
            } else if (p < 15) {
                n = n * Math.pow(10, (p - 12));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "百万";
            } else if (p < 18) {
                n = n * Math.pow(10, (p - 15));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "千万";
            } else{
                n = n * Math.pow(10, (p - 18));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "亿";
            }
        }
    }
    num2e2(num: number, fixNum: number = 2) {
        if (num <= 1000) {
            return num.toString();
        } else {
            //将数值用parseFloat(num).Fixed(8)保留固定位数，但有个缺点，就是如果数值小于8位的，则会多出余数0，如:0.00000010
            //E是指数的意思，比如7.823E5=782300 这里E5表示10的5次方
            var p = Math.floor(Math.log(num) / Math.LN10);   //p是10的几次方
            var n = num * Math.pow(10, -p);   //n为最终显示的小数
            //return n + 'e' + p;
            //cc.log("num = "+num +"; p = "+p+"; n = "+n);

            let factor = Math.pow(10, fixNum);
            if (p < 3) {
                return num.toString();
            } else if (p < 6) {
                n = n * Math.pow(10, (p - 3));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "K";
            } else if (p < 9) {
                n = n * Math.pow(10, (p - 6));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "M";
            } else if (p < 12) {
                n = n * Math.pow(10, (p - 9));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "B";
            } else if (p < 15) {
                n = n * Math.pow(10, (p - 12));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "T";
            } else {
                let pp = p - 15;
                //var alphabet= String.fromCharCode(64 + parseInt(填写数字);  A-65， Z-90, a-97, z-122
                for (let i = 0; i < 26; ++i) {
                    let firstChar = String.fromCharCode(97 + i);
                    if (pp >= 26 * 3) {   //78
                        pp -= 26 * 3;
                    } else {
                        let ppp = pp / 3;
                        let last_j = 0;
                        for (let j = 0; j < 26; ++j) {
                            if (ppp >= j) {
                                last_j = j;
                            } else {
                                let secondChar = String.fromCharCode(97 + last_j);
                                n = n * Math.pow(10, (pp % 3));
                                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                                //cc.log("nStr = "+nStr +"; firstChar = "+firstChar+"; secondChar = "+secondChar);
                                return nStr + firstChar + secondChar;
                            }
                        }
                    }

                }
            }
        }
    }

    /**校正因适配而产生的触摸偏差 */
    adaptTouchPos(touchPos: cc.Vec2, nodePos: cc.Vec2){
        let localPos = touchPos;
        // if(UIHelper.scenePolicy == cc.ResolutionPolicy.FIXED_WIDTH){
        //     localPos = cc.v2(nodePos.x - cc.winSize.width/2 + touchPos.x, nodePos.y - cc.winSize.height/2 + touchPos.y);
        // }
        return localPos;
    }



    //********************  以下为应用接口函数  ********************* */
    






}
export var GameMgr = new GameManager();


