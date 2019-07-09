import { CfgMgr } from "./manager/ConfigManager";

//初始场景，用于加载配置
const {ccclass, property} = cc._decorator;

@ccclass
export default class StartScene extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        CfgMgr.setOverCallback(this.handleLoadConfigOver, this);  //设置加载配置完毕回调
        CfgMgr.loadAllConfig();   //加载配置
    }

    // update (dt) {}

    /**加载配置数据完毕 */
    handleLoadConfigOver(){
        //cc.log("handleLoadConfigOver()");
        cc.director.loadScene("searchScene");
    }
}
