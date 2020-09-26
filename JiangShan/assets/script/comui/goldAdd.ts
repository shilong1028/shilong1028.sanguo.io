import { ROOT_NODE } from "../login/rootNode";
import { AudioMgr } from "../manager/AudioMgr";
import { ItemInfo } from "../manager/ConfigManager";
import { ComItemType } from "../manager/Enum";
import { GameMgr } from "../manager/GameManager";
import { SDKMgr } from "../manager/SDKManager";


//获得金币界面
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("ComUI/goldAdd")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点
export default class GoldAdd extends cc.Component {

    @property(cc.Node)
    vedioBtn: cc.Node = null;
    @property(cc.Label)
    descLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.vedioBtn.active = SDKMgr.bOpenAdBtn;
        this.descLabel.string = "分享游戏随机获得至多100金锭100石粮草！\n\n观看视频随机获得至多500金锭100石粮草！"
    }

    start () {
    }

    update (dt) {
    }

    /**看视频 */
    onVedioBtn(){
        AudioMgr.playBtnClickEffect();
        SDKMgr.showVedioAd(()=>{  
            //失败
            this.vedioBtn.active = false;
            ROOT_NODE.showTipsText("抱歉，视频获取异常")
        }, ()=>{
            this.handleShareOrVedioSucc(true);
        }); 
    }

    /**跳过 */
    onCloseBtn(){
        AudioMgr.playBtnClickEffect();
        this.node.destroy();
    }

    onShareBtn(){
        AudioMgr.playBtnClickEffect();
        SDKMgr.shareGame("快来和我一起征战天下，弹指江山吧！", (succ:boolean)=>{
            console.log("分享 succ = "+succ);
            if(succ == true){
                this.handleShareOrVedioSucc(false);
            }
        }, this);
    }

    handleShareOrVedioSucc(bVedio:boolean){
        /**
         * 一次分享最多可以获得100个金锭和100石粮草
         * 一次视频最多可以获得500个金锭和500石粮草
         */
        let maxCount = 100;
        if(bVedio){
            maxCount = 500;
        }
        let gold = Math.floor((Math.random()*0.5 + 0.5)*maxCount);
        let food = Math.floor((Math.random()*0.5 + 0.5)*maxCount);

        let items = [];
        items.push({"key":ComItemType.Gold, "val":gold});   //金币
        items.push({"key":ComItemType.Food, "val":food});   //粮草
        let rewards: ItemInfo[] = GameMgr.getItemArrByKeyVal(items);   //通过配置keyVal数据砖块道具列表
        GameMgr.receiveRewards(rewards);   //领取奖励
        
        this.node.destroy();
    }

    /**
     * 游戏中，金锭（金币）、粮草等资源之间兑换关系为： 1人民币= 1金锭 = 10石粮草 = 100贯钱 = 1000斤粮
     * 1人民币= 1金锭=100贯钱；1人民币=10石粮草= 1000斤粮草。
     * 游戏中，每千名士兵每月消耗300石粮30金锭（30000斤粮草3000贯钱），即每人每月消耗30斤粮3贯钱。
     * 游戏中，金锭、粮草的税率分别为每万人10金锭每月、每万人100石每月, 即每人每月需要向官府缴纳0.1贯钱、10斤粮。
     * 游戏中，每万人中可最多征兵一千人，即十抽一。募兵时按照每百人10金估计，具体按照item表千人兵售价计算。
     * 游戏中，出征战斗时按每月每百士兵消耗10石粮草计算。
     */
}
