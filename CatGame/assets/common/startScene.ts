
import { CfgMgr } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";
import { SDKMgr } from "../manager/SDKManager";

//初始场景，用于初始化加载数据
const {ccclass, property} = cc._decorator;

@ccclass
export default class StartScene extends cc.Component {

    @property(cc.Label)
    tipText: cc.Label = null;

    @property(cc.SpriteAtlas)
    cicleAtlas: cc.SpriteAtlas = null;   //转圈序列帧

    // LIFE-CYCLE CALLBACKS:

    updateStep: number = 0;

    onLoad () {
        this.tipText.string = "加载配置中."
    }

    start () {

        //降低程序的发热和内存使用
        // if (CC_WECHATGAME) {
        //     // if (cc.sys.os == cc.sys.OS_ANDROID) {
        //     // }else if (cc.sys.os == cc.sys.OS_IOS) {
        //     // }
        //     cc.view.enableAntiAlias(false);
        //     cc.game.once(cc.game.EVENT_ENGINE_INITED, ()=>{
        //         let oldTex = cc.Texture2D.prototype.handleLoadedTexture;
        //         let optimizedLoadTex = function (premultiplied) {
        //             oldTex.call(this, premultiplied);
        //             this._image.src = "";
        //         }
        //         cc.Texture2D.prototype.handleLoadedTexture = optimizedLoadTex;
        //     });
        // }else{
        //     //  抗锯齿
        //     if (cc.view.getFrameSize().width < cc.view.getDesignResolutionSize().width) {
        //         cc.view.enableAntiAlias(true);  //微信模式一定不要开抗锯齿， VIVO下一定要开
        //     }
        // }

        //cc.game.setFrameRate(60);
        //cc.game.config.showFPS = true;   //使用该语句可能导致后台切回后黑屏
        //cc.debug.setDisplayStats(true);  //微信工具会报.left找不到的错误提示
        
        SDKMgr.initSDK();   //初始化SDK平台数据

        CfgMgr.setOverCallback(this.handleLoadConfigOver, this);  //设置加载配置完毕回调

        CfgMgr.loadAllConfig();   //加载配置

        let aniNode = GameMgr.createAtlasAniNode(this.cicleAtlas, 6, cc.WrapMode.Loop);
        this.node.addChild(aniNode, 100);
    }

    update (dt) {
        if(this.updateStep < 20){
            this.updateStep ++;
            this.tipText.string = "加载配置中."
        }else if(this.updateStep < 40){
            this.updateStep ++;
            this.tipText.string = "加载配置中.."
        }else if(this.updateStep < 60){
            this.updateStep ++;
            if(this.updateStep == 60){
                this.updateStep = 0;
            }
            this.tipText.string = "加载配置中..."
        }
    }

    /**加载配置数据完毕 */
    handleLoadConfigOver(){
        //cc.log("handleLoadConfigOver()");
        cc.director.loadScene("loginScene"); 
    }


}
