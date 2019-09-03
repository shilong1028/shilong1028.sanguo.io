
import { GameMgr } from "../manager/GameManager";
import { ROOT_NODE } from "./rootNode";
import { MyUserDataMgr } from "../manager/MyUserData";

//初始场景，用于初始化加载数据
const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScene extends cc.Component {
    @property(cc.Node)
    btnNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.btnNode.active = false;
    }

    start () {
        MyUserDataMgr.initUserData();    //初始化用户信息
        this.btnNode.active = true;
    }

    // update (dt) {}

    onLoginGame(){
        this.btnNode.active = false;
        GameMgr.gotoMainScene();   //进入主场景
    }

    onResetGame(){
        ROOT_NODE.showTipsDialog("是否清除所有游戏重新开始？", ()=>{
            this.btnNode.active = false;
            MyUserDataMgr.clearUserData();   //清除所有用户数据
            GameMgr.gotoMainScene();   //进入主场景
        });
    }
}
