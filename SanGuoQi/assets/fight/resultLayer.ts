import { FightMgr } from "../manager/FightManager";


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

    onReStartBtn(){
        FightMgr.getFightScene().onResetBtn();
        this.node.removeFromParent(true);
    }
}
