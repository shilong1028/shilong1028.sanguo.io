import { NotificationMy } from "../manager/NoticeManager";
import { NoticeType } from "../manager/Enum";
import { FightMgr } from "../manager/FightManager";
import Ball from "./Ball";
import { MyUserDataMgr } from "../manager/MyUserData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Cat extends cc.Component {

    @property(cc.Sprite)
    catSpr: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    playerAtlas: cc.SpriteAtlas = null;

    bLaunchAni: boolean = false;  //是否在播放猫发射动画

    moveActionTag: number = 610;
    jumpActionTag: number = 710;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        NotificationMy.on(NoticeType.GamePause, this.handleGamePause, this);   //游戏暂停，停止小球和砖块的动作，但动画特效不受影响
        NotificationMy.on(NoticeType.GameResume, this.handleGameResume, this);   //继续游戏
        NotificationMy.on(NoticeType.GameReStart, this.handleGameReStart, this);   //重新开始游戏
    }

    onDestroy(){
        NotificationMy.offAll(this);
    }

    /**游戏暂停，停止小球和砖块的动作，但动画特效不受影响 */
    handleGamePause(){
        this.node.pauseAllActions();
    }
    /**继续游戏 */
    handleGameResume(){
        this.node.resumeAllActions();
    }
    //重新开始游戏
    handleGameReStart(){
        this.node.stopAllActions();
    }

    start () {
        this.showCat();
    }

    /**显示炮台信息 */
    showCat(){
        this.catSpr.spriteFrame = null;
        let playerInfo = MyUserDataMgr.getCurPlayerInfo();
        if(playerInfo){
            this.catSpr.spriteFrame = this.playerAtlas.getSpriteFrame("player_"+playerInfo.playerId);
        }
    }

    update (dt) {
        if(this.bLaunchAni){
            //小球移动到发射点后，在逐次发射
            let nBalls = FightMgr.qipanSc.nBalls;
            let bAllFly = true;
            if(nBalls){
                nBalls.children.forEach((node,index)=>{
                    let ball = node.getComponent(Ball);
                    if(ball && ball.isBallFlying() == false){
                        bAllFly = false;
                    }
                })
            }
            if(bAllFly == true){
                this.showCatLaunchAnimation(false);
            }
        }
    }

    /**
     * 设置喵的位置(喵仅仅水平移动)
     * @param x :目标x坐标
     */
    setPositionWithMove(x:number, y:number=null){
        if(y == null){
            y = this.node.y;
        }
        this.showCatLaunchAnimation(false);

        this.node.stopActionByTag(this.moveActionTag);
        let moveAction = cc.moveTo(0.5, cc.v2(x, y));
        moveAction.setTag(this.moveActionTag);
        this.node.runAction(moveAction);
    }

    /**猫发射动画 */
    showCatLaunchAnimation(bShow: boolean = false){
        // this.node.stopActionByTag(this.jumpActionTag);
        // this.node.y = FightMgr.getCatPosY();
        // this.bLaunchAni = bShow;
        // if(bShow == true){
        //     let defaultAction = cc.repeatForever(cc.sequence(cc.moveBy(0.05, cc.v2(0, 10)), cc.moveBy(0.05, cc.v2(0, -10))));
        //     defaultAction.setTag(this.jumpActionTag);
        //     this.node.runAction(defaultAction);
        // }
    }
}
