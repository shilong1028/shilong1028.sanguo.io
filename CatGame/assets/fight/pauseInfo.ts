import { NotificationMy } from "../manager/NoticeManager";
import { NoticeType } from "../manager/Enum";
import { GameMgr } from "../manager/GameManager";
import { AudioMgr } from "../manager/AudioMgr";
import { FightMgr } from "../manager/FightManager";


//暂停界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseInfo extends cc.Component {

    @property(cc.Node)
    bgImg: cc.Node = null;
    @property(cc.Node)
    touchNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    start () {
        NotificationMy.emit(NoticeType.GamePause, null);   //游戏暂停，停止小球和砖块的动作，但动画特效不受影响
    }

    // update (dt) {}

    touchEnd(event: cc.Touch){
        let pos = GameMgr.adaptTouchPos(event.getLocation(), this.node.position);  //校正因适配而产生的触摸偏差
        let pos1 = this.bgImg.convertToNodeSpace(pos);
        let rect1 = cc.rect(0, 0, this.bgImg.width, this.bgImg.height);
        if(!rect1.contains(pos1)){
            this.onContinueBtn();
        }
    }

    /**继续游戏 */
    onContinueBtn(){
        AudioMgr.playEffect("effect/ui_click");
        NotificationMy.emit(NoticeType.GameResume, null);  //继续游戏
        this.node.removeFromParent(true);
    }

    /**重新开始 */
    onRenewBtn(){
        AudioMgr.playEffect("effect/ui_click");
        NotificationMy.emit(NoticeType.GameReStart, null);  //重新开始游戏
        FightMgr.loadLevel(FightMgr.level_id, true);
        this.node.removeFromParent(true);
    }

    /**退出战斗 */
    onExitBtn(){
        AudioMgr.playEffect("effect/ui_click");
        NotificationMy.emit(NoticeType.GameReStart, null);  //重新开始游戏

        this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
            GameMgr.gotoMainScene();
        })))
    }
}
