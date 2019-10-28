import { ROOT_NODE } from "../common/rootNode";
import MainScene from "../main/mainScene";
import LoadingLayer from "../common/LoadingLayer";
import TipsDialog from "../common/tipsDialog";
import { MyUserDataMgr } from "./MyUserData";
import { AudioMgr } from "./AudioMgr";
import { TipsStrDef } from "./Enum";


//游戏菜单管理器
const {ccclass, property} = cc._decorator;

@ccclass
class GameManager {
    BagGridCount: number = 20;  //背包空间
    PlayerCount: number = 3;   //炮台萌猫数量
    PlayerMaxLv: number = 5;  //炮台最大等级
    ChapterCount: number = 7;  //章节数量
    QualityCount: number = 5;  //品质最大等级
    ShopCount: number = 4;   //商品种类
    SkillCount: number = 9;   //技能数量

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

    /**场景背景图适配 */
    adaptBgByScene(topNode: cc.Node=null, bottomNode: cc.Node=null){
        //设计分辨率
        let designSize = cc.view.getDesignResolutionSize();  //cc.size(750, 1334); 
        //逻辑分辨率  和window.screen.width window.screen.height 一致
        let frameSize = cc.view.getFrameSize();
        //为当前的游戏窗口的大小
        //cc.Director.getWinSize is deprecated. Please use cc.winSize instead
        //但是不知道为什么cc.winSize输出为(0.00, 0.00)，而单独使用cc.winSize.width或cc.winSize.height则输出正确
        //返回视图窗口可见区域尺寸
        //let visibleSize = cc.view.getVisibleSize(); //为按照设计分辨率等比放缩后的尺寸，肯能为小数比如1333.4

        let frameScale = frameSize.height/frameSize.width; 
        if(frameScale > 1.77 && frameScale < 1.8){   //等比拉伸，背景填充   和设计分辨率750*1334宽高比差不多
            let scaleW = frameSize.width/designSize.width;
            let scaleH = frameSize.height/designSize.height;
            //console.log("等比拉伸，背景填充")
            if(scaleH < scaleW){
                //cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_HEIGHT);
                cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.FIXED_HEIGHT); 
            }else{
                //cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_WIDTH);
                cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.FIXED_WIDTH); 
            }
        }else if(frameScale <= 1.77){   //等高放缩，背景宽拉伸，左右侧按钮位移
            //console.log("等高放缩，背景宽拉伸，左右侧按钮位移")
            //cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_HEIGHT);   //表示固定高度
            cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.FIXED_HEIGHT); 
        }else if(frameScale >= 1.8){   //等宽放缩，背景高拉伸，顶底按钮位移
            //console.log("等宽放缩，背景高拉伸，顶底按钮位移")
            //cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_WIDTH);
            cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.FIXED_WIDTH);   //表示固定宽度
        }

        let layer = cc.director.getScene().getChildByName("Canvas");
        if(layer){
            let bg = layer.getChildByName("bg");
            if(bg){
                bg.width = cc.winSize.width;
                bg.height = cc.winSize.height;
            }
        }

        if(topNode){
            if(frameScale < 1.8){
                topNode.y = cc.winSize.height/2;
            }else{
                topNode.y = cc.winSize.height/2 - 70;   //窄屏手机，可能有刘海
            }
        }

        if(bottomNode){
            let adWidth = this.GetBannerWidth();
            let BannerHeight = Math.ceil(adWidth*0.35)*2;
            bottomNode.y = BannerHeight - cc.winSize.height/2;
        }   
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

    /**显示子层 */
    showLayer(prefab: cc.Prefab, parent: cc.Node = null){
        let layer = cc.instantiate(prefab);
        layer.width = cc.winSize.width;
        layer.height = cc.winSize.height;

        let bg = layer.getChildByName("bg");   //加载层
        if(bg){
            bg.width = cc.winSize.width;
            bg.height = cc.winSize.height;
        }

        let maskBg = layer.getChildByName("maskBg");
        if(maskBg){
            maskBg.width = cc.winSize.width;
            maskBg.height = cc.winSize.height;
        }

        if(parent == null){
            parent = cc.director.getScene();
        }
        let canvas = cc.director.getScene().getChildByName("Canvas");
        if(canvas){
            layer.position = cc.v2(canvas.width/2, canvas.height/2);
        }else{
            layer.position = cc.v2(cc.winSize.width/2, cc.winSize.height/2);
        }
        parent.addChild(layer);

        return layer;
    }

    //通用提示框
    showTipsDialog(tipStr: string, okCallback: any=null){
        let tips = this.showLayer(ROOT_NODE.pfTipsDialog);
        tips.getComponent(TipsDialog).setTipStr(tipStr, okCallback);
    }

    //获取金币提示框
    showGoldAddDialog(){
        this.showLayer(ROOT_NODE.pfGoldAdd);
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

    /**判定给定时间和现在是否同一天 */
    isSameDayWithCurTime(lastTime: number){
        //console.log("isSameDayWithTime(), lastTime = "+lastTime);
        if(lastTime < 10000){
            return false;
        }
        let curDate = new Date();
        let curDay = curDate.getDay();
        let curMonth = curDate.getMonth();
 
        let lastDate = new Date();
        lastDate.setTime(lastTime);
        let lastDay = lastDate.getDay();
        let lastMonth = lastDate.getMonth();

        if(curMonth == lastMonth && curDay == lastDay){
            return true;
        }else{
            return false;
        }
    }

    //********************  以下为应用接口函数  ********************* */
    
    /**显示售卖收益 */
    showDelGainAni(sellGold: number){
        if(sellGold >= 0){
            MyUserDataMgr.updateUserGold(sellGold);   //修改用户金币 
            AudioMgr.playEffect("effect/gold_gain");
            ROOT_NODE.showTipsText(TipsStrDef.KEY_GetGoldTip + sellGold);

            // let pos = this.bottomNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
            // this.showIconEffectAni(cc.v2(pos.x, pos.y + 60), 0);

            // let gainNode = cc.instantiate(this.pfGainGold);
            // gainNode.setPosition(cc.v2(0, 60));
            // this.bottomNode.addChild(gainNode, 100);
            // gainNode.getComponent(GainGoldNode).showGainGlodVal(sellGold); 
        }
    }





}
export var GameMgr = new GameManager();


