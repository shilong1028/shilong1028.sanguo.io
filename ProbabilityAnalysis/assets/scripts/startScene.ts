import { CfgMgr } from './ConfigManager';
/*
 * @Autor: dongsl
 * @Date: 2020-10-31 11:12:37
 * @LastEditors: dongsl
 * @LastEditTime: 2020-10-31 11:38:32
 * @Description: 
 */

//初始场景，用于初始化加载数据
const {ccclass, property} = cc._decorator;

@ccclass
export default class StartScene extends cc.Component {

    onLoad () {
    }

    start () {
        CfgMgr.setOverCallback(this.handleLoadConfigOver, this);  //设置加载配置完毕回调
        CfgMgr.loadAllConfig();   //加载配置
    }

    /**加载配置数据完毕 */
    handleLoadConfigOver(){
        cc.director.loadScene("main");
    }


}
