import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";
import { SDKMgr } from "../manager/SDKManager";
import { ROOT_NODE } from "../common/rootNode";
import { CfgMgr } from "../manager/ConfigManager";
import { ItemInfo, BallInfo } from "../manager/Enum";

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
        AudioMgr.playEffect("effect/ui_click");
        if(this.bRotateing == true){
            return;
        }

        if(MyUserData.DiamondCount >= 50){
            MyUserDataMgr.updateUserDiamond(-50);
            this.rotatePan();
        }else{
            GameMgr.showGoldAddDialog();  //获取金币提示框
        }
    }

    /**视频免费按钮 */
    onVedioBtn(){
        AudioMgr.playEffect("effect/ui_click");
        if(this.bRotateing == true){
            return;
        }
        SDKMgr.showVedioAd("ShopVedioId", ()=>{
            //失败
        }, ()=>{
            this.rotatePan();  //成功
        }); 
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
            if(selIdx == 1){   //1000金币
                let gold = 1000;
                ROOT_NODE.showTipsText("获得金币："+gold);
                MyUserDataMgr.updateUserGold(gold);
            }else if(selIdx == 2){   //钻石
                let diamond = 20;
                ROOT_NODE.showTipsText("获得钻石："+diamond);
                MyUserDataMgr.updateUserDiamond(diamond);
            }else if(selIdx == 3 || selIdx == 5){   //饰品道具
                let itemId = 1;
                if(selIdx == 3){
                    itemId = Math.floor(Math.random()*4.99)+1;
                }else if(selIdx == 5){
                    itemId = Math.floor(Math.random()*4.99)+11;
                }
                let itemCfg = CfgMgr.getItemConf(itemId);
                if(itemCfg){
                    ROOT_NODE.showTipsText("获得："+itemCfg.name);
                    let itemInfo = new ItemInfo(itemId);
                    MyUserDataMgr.addItemToItemList(itemInfo.clone(), true);  //修改用户背包物品列表
                }
            }else if(selIdx == 0 || selIdx == 4){   //武器
                let weaponId = 1;
                if(selIdx == 0){
                    weaponId = Math.floor(Math.random()*4.99)+1;
                }else if(selIdx == 4){
                    weaponId = Math.floor(Math.random()*4.99)+11;
                }
                let weaponCfg = CfgMgr.getCannonConf(weaponId);
                if(weaponCfg){
                    ROOT_NODE.showTipsText("获得："+weaponCfg.name);
                    let ballInfo = new BallInfo(weaponId);
                    MyUserDataMgr.addBallToBallList(ballInfo.clone(), true);  //添加小球到未出战列表
                }
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
