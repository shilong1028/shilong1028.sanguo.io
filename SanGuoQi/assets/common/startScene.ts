
import { MyUserMgr } from "../manager/MyUserData";
import { CfgMgr } from "../manager/ConfigManager";

//初始场景，用于初始化加载数据
const {ccclass, property} = cc._decorator;

@ccclass
export default class StartScene extends cc.Component {
    @property(cc.Node)
    btnNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.btnNode.active = false;
    }

    start () {
        CfgMgr.setOverCallback(this.handleLoadConfigOver, this);  //设置加载配置完毕回调

        CfgMgr.loadAllConfig();   //加载配置
    }

    // update (dt) {}

    onLoginGame(){
        this.btnNode.active = false;
        cc.director.loadScene("mainScene");
    }

    onResetGame(){
        this.btnNode.active = false;
        MyUserMgr.clearUserData();   //清除所有用户数据
        cc.director.loadScene("mainScene");
    }

    /**加载配置数据完毕 */
    handleLoadConfigOver(){
        //cc.log("handleLoadConfigOver()");
        MyUserMgr.initUserData();    //初始化用户信息

        this.btnNode.active = true;
    }


}
