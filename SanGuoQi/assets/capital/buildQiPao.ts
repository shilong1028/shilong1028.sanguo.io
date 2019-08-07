
import { MyUserData, MyUserMgr } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class BuildQiPao extends cc.Component {

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Node)
    bgNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.bgNode.scale = 1.0;
        this.bgNode.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(2.0, 0.8), cc.scaleTo(2.0, 1.0))));
    }

    // update (dt) {}

    onBtn(){
        let capitalScene = GameMgr.getCapitalScene();
        if(capitalScene){
            if(MyUserData.capitalLv == 0){
                MyUserMgr.updateCapitalLv(1);
                capitalScene.lvLabel.string = "Lv1";

                if(GameMgr.curTaskConf.type == 2){   //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗 6学习技能 7攻城掠地
                    GameMgr.handleStoryShowOver(GameMgr.curTaskConf);  //任务宣读(第一阶段）完毕处理
                }
            }
            GameMgr.showLayer(capitalScene.pfBuildHelp);
        }
    }
}
