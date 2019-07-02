
import { MyUserMgr } from "../manager/MyUserData";
import { CfgMgr } from "../manager/ConfigManager";

//初始场景，用于初始化加载数据
const {ccclass, property} = cc._decorator;

@ccclass
export default class StartScene extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        MyUserMgr.initUserData();    //初始化用户信息

        CfgMgr.loadAllConfig();   //加载配置
    }

    // update (dt) {}


}
