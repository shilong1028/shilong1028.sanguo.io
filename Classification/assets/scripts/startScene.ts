import { CfgMgr } from "./manager/ConfigManager";
import { SDKMgr } from "./manager/SDKManager";

//初始场景，用于加载配置
const {ccclass, property} = cc._decorator;

@ccclass
export default class StartScene extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        SDKMgr.initSDK();   //初始化SDK平台数据

        CfgMgr.setOverCallback(this.handleLoadConfigOver, this);  //设置加载配置完毕回调
        CfgMgr.loadAllConfig();   //加载配置
    }

    // update (dt) {}

    /**加载配置数据完毕 */
    handleLoadConfigOver(){
        //cc.log("handleLoadConfigOver()");
        SDKMgr.loginWithSDK(this.handleSDKLoginSucc, this)
    }

    handleSDKLoginSucc(){
        cc.director.loadScene("searchScene");
    }
}
