
import { CfgMgr } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";
import { SDKMgr } from "../manager/SDKManager";

//初始场景，用于初始化加载数据
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Login/startScene")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

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
        //cc.game.setFrameRate(60);
        //cc.game.config.showFPS = true;   //使用该语句可能导致后台切回后黑屏
        //cc.debug.setDisplayStats(true);  //微信工具会报.left找不到的错误提示

        //cc.macro.CLEANUP_IMAGE_CACHE = true;   //开启纹理自动释放, web调用后直接资源失效。
        
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
        GameMgr.goToSceneWithLoading("loginScene", false); 
    }


}
