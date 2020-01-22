
import { GameMgr } from "../manager/GameManager";
import { SDKMgr } from "../manager/SDKManager";
import { ROOT_NODE } from "../common/rootNode";
import { MyUserData, MyUserMgr } from "../manager/MyUserData";

//转盘
const {ccclass, property} = cc._decorator;

@ccclass
export default class TurnTable extends cc.Component {

    @property(cc.Node)
    panNode: cc.Node = null;  //转盘节点

    bRotateing: boolean = false;  //是否在旋转

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start () {

    }

    // update (dt) {}

    /**钻石转盘按钮 */
    onNormalBtn(){
        if(this.bRotateing == true){
            return;
        }

        if(MyUserData.DiamondCount >= 50){
            MyUserMgr.updateUserDiamond(-50);
            this.rotatePan();
        }else{
            GameMgr.showGoldAddDialog();  //获取金币提示框
        }
    }

    /**视频免费按钮 */
    onVedioBtn(){
        if(this.bRotateing == true){
            return;
        }
        SDKMgr.showVedioAd("PanVedioId", ()=>{
            //失败
        }, ()=>{
            this.rotatePan();  //成功
        }); 
    }

    onCloseBtn(){
        this.node.destroy();
    }

    /**旋转转盘 */
    rotatePan(){
        if(this.bRotateing == true){
            return;
        }
        this.bRotateing = true;

        let selIdx = Math.floor(Math.random()*5.99);
        let angle = 360-(30 + selIdx*60);

        let handleReward = function(){
            if(selIdx == 0 || selIdx == 2 || selIdx == 4){   //1000金币
                let gold = 1000 *(selIdx+1);
                ROOT_NODE.showTipsText("获得金币："+gold);
                MyUserMgr.updateUserGold(gold);
            }else if(selIdx == 1 || selIdx == 3 || selIdx == 5){   //钻石
                let diamond = 20*selIdx;
                ROOT_NODE.showTipsText("获得金锭："+diamond);
                MyUserMgr.updateUserDiamond(diamond);
            }
        }

        let rotateAction = cc.sequence(cc.rotateBy(0.6, 360*3), cc.rotateTo(angle/1800, angle), cc.callFunc(function(){
            handleReward();
        }.bind(this)), cc.delayTime(0.1), cc.callFunc(function(){
            this.bRotateing = false;
        }.bind(this)));
        rotateAction.setTag(1111);
        this.panNode.stopActionByTag(1111);
        this.panNode.runAction(rotateAction);
    }

}
