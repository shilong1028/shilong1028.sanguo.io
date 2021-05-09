import UI from '../util/ui';
import AppFacade from '../puremvc/appFacade';
import ExecuteInterval from '../util/ExecuteInterval';
import { SDKMgr } from '../manager/SDKManager';
import { CfgMgr } from '../manager/ConfigManager';
import { LoaderMgr } from '../manager/LoaderManager';

/*
 * @Autor: dongsl
 * @Date: 2021-03-19 11:54:17
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 18:14:47
 * @Description: 
 */

//初始场景，用于初始化加载数据
const { ccclass, property, menu, executionOrder, disallowMultiple } = cc._decorator;

@ccclass
@menu("Login/startScene")
@executionOrder(0)
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class StartScene extends cc.Component {

    tipText: cc.Label = null;
    updateStep: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.tipText = UI.find(this.node, "tipText").getComponent(cc.Label)
        this.tipText.string = "加载配置中."
    }

    start() {
        //cc.game.setFrameRate(60);
        //cc.game.config.showFPS = true;   //使用该语句可能导致后台切回后黑屏
        //cc.debug.setDisplayStats(true);  //微信工具会报.left找不到的错误提示

        //cc.macro.CLEANUP_IMAGE_CACHE = true;   //开启纹理自动释放, web调用后直接资源失效。

        /**
         * 相对于 Cocos 传统的 cc.Action，cc.Tween 在创建动画上要灵活非常多：
            支持以链式结构的方式创建一个动画序列。
            支持对任意对象的任意属性进行缓动，不再局限于节点上的属性，而 cc.Action 添加一个属性的支持时还需要添加一个新的 action 类型。
            支持与 cc.Action 混用。
            支持设置 Easing 或者 progress 函数。
            .start()后cc.tween才生效启动
         */

        cc.tween(this.node)
            .delay(0.5)
            .call(() => {
                cc.log("inits ...");
                AppFacade.getInstance().startUp();   //初始化MVC架构

                ExecuteInterval.init()    //时间间隔初始化

                SDKMgr.initSDK();   //初始化SDK平台数据

                CfgMgr.setOverCallback(true, this.handleLoadConfigOver, this);  //设置加载配置完毕回调
            })
            .start()
    }

    update(dt) {
        if (this.updateStep < 20) {
            this.updateStep++;
            this.tipText.string = "加载配置中."
        } else if (this.updateStep < 40) {
            this.updateStep++;
            this.tipText.string = "加载配置中.."
        } else if (this.updateStep < 60) {
            this.updateStep++;
            if (this.updateStep == 60) {
                this.updateStep = 0;
            }
            this.tipText.string = "加载配置中..."
        }
    }

    /**加载配置数据完毕 */
    handleLoadConfigOver() {
        cc.log("handleLoadConfigOver()");
        LoaderMgr.loadScene("loginScene");
    }
}
