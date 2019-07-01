

//游戏菜单管理器
const {ccclass, property} = cc._decorator;

@ccclass
class GameManager {

    /**加载配置数据完毕 */
    handleLoadConfigOver(){
        //cc.log("handleLoadConfigOver()");
        cc.director.loadScene("mainScene");
    }

}
export var GameMgr = new GameManager();


