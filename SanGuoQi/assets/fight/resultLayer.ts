import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ResultLayer extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    winFrames: cc.SpriteFrame = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    start () {
        if(FightMgr.FightWin == true){  //战斗胜利或失败
            this.icon.spriteFrame = this.winFrames;
        }
    }

    // update (dt) {}

    onBackBtn(){
        if(GameMgr.curTaskConf.type == 5){   //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗
            //GameMgr.handleStoryShowOver(GameMgr.curTaskConf);  //任务宣读(第一阶段）完毕处理
        }

        cc.director.loadScene("mainScene");
    }
}
