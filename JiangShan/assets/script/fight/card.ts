
import GeneralCell from "../comui/general";
import { ROOT_NODE } from "../login/rootNode";
import { CardInfo, FunMgr } from "../manager/Enum";

//卡牌节点
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Fight/card")
@executionOrder(-1)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class Card extends cc.Component {

    @property(cc.Node)
    generalNode: cc.Node = null;

    @property(cc.Sprite)
    campSpr: cc.Sprite = null;   //蓝方（我方）敌方（红方）
    @property([cc.SpriteFrame])
    campFrames: cc.SpriteFrame[] = [];

    @property(cc.ProgressBar)
    hpProgressBar: cc.ProgressBar =  null;   //血量条（最大值1000）
    @property(cc.ProgressBar)
    bingProgressBar: cc.ProgressBar =  null;   //兵力(最大为3000)
    @property(cc.ProgressBar)
    qiProgressBar: cc.ProgressBar =  null;   //智力条（最大值100）
    @property(cc.ProgressBar)
    mpProgressBar: cc.ProgressBar =  null;   //智力条（最大值100）
    @property(cc.ProgressBar)
    atkProgressBar: cc.ProgressBar =  null;   //攻击条（最大值100）
    @property(cc.ProgressBar)
    defProgressBar: cc.ProgressBar =  null;   //防御条（最大值100）

    @property(cc.Label)
    hpLabel: cc.Label = null;
    @property(cc.Label)
    bingLabel: cc.Label = null;
    @property(cc.Label)
    qiLabel: cc.Label = null;
    @property(cc.Label)
    mpLabel: cc.Label = null;
    @property(cc.Label)
    atkLabel: cc.Label = null;
    @property(cc.Label)
    defLabel: cc.Label = null;

    cardInfo: CardInfo = null;    //卡牌信息

    // LIFE-CYCLE CALLBACKS:

    //只有在new cc.NodePool(XX)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
    //使用 Pool.put() 回收节点后，会调用unuse 方法
    unuse() {
        cc.log("card onLoad ")
    }
    //使用 Pool.get() 获取节点后，就会调用reuse 方法
    reuse() {
        cc.log("card onLoad ")
    }

    onLoad () {
        cc.log("card onLoad ")
        //如果是缓存池的节点，则调用顺序为 reuse -> initItemData-> onLoad，故如果在OnLoad.initView则会刷掉initItemData的数据
    }

    initView () {
        this.campSpr.node.active = false;

        this.hpProgressBar.progress = 0;
        this.bingProgressBar.progress = 0;
        this.qiProgressBar.progress = 0;
        this.mpProgressBar.progress = 0;
        this.atkProgressBar.progress = 0;
        this.defProgressBar.progress = 0;
    }

    onDestroy(){
    }

    start () {
    }

    // update (dt) {}

    /** 更新士气值 */
    updateCardShiqi(){
        if(this.cardInfo){
            this.qiLabel.string = "气"+this.cardInfo.shiqi;
            let progess = this.cardInfo.shiqi/100;
            this.qiProgressBar.progress = FunMgr.num2progess(progess);
        }
    }
    /** 更新士兵数量 */
    updateCardBingCount(){
        if(this.cardInfo){
            this.bingLabel.string = "兵"+this.cardInfo.generalInfo.bingCount;
            let progess = this.cardInfo.generalInfo.bingCount/3000;
            this.bingProgressBar.progress = FunMgr.num2progess(progess);
        }
    }
    /** 更新血量 */
    updateCardHp(){
        if(this.cardInfo){
            this.hpLabel.string = "血"+this.cardInfo.generalInfo.fightHp;
            let progess = this.cardInfo.generalInfo.fightHp/1000;
            this.hpProgressBar.progress = FunMgr.num2progess(progess);
        }
    }
    /** 更新智力 */
    updateCardMp(){
        if(this.cardInfo){
            this.mpLabel.string = "智"+this.cardInfo.generalInfo.fightMp;
            let progess = this.cardInfo.generalInfo.fightMp/100;
            this.mpProgressBar.progress = FunMgr.num2progess(progess);
        }
    }

    /**设置卡牌数据(战斗) */
    initCardData(info: CardInfo){
        this.cardInfo = info;
        this.initView();
        //如果是缓存池的节点，则调用顺序为 reuse -> initItemData-> onLoad，故如果在OnLoad.initView则会刷掉initItemData的数据

        cc.log("initCardData(), info = "+JSON.stringify(info));
        if(this.cardInfo.campId == 1){  //阵营，0默认，1蓝方(我方)，2红方
            this.campSpr.spriteFrame = this.campFrames[0];
        }else if(this.cardInfo.campId == 2){
            this.campSpr.spriteFrame = this.campFrames[1];
        }

        let progess = this.cardInfo.generalInfo.bingCount/3000;
        this.bingProgressBar.progress = FunMgr.num2progess(progess);
        this.updateCardShiqi();  //更新士气值
        this.updateCardBingCount();  //更新士兵数量
        this.updateCardHp();  //更新血量
        this.updateCardMp();  //更新智力

        let cardCfg = this.cardInfo.generalInfo.generalCfg;
        if(cardCfg){
            this.atkLabel.string = "攻"+cardCfg.atk
            this.defLabel.string = "防"+cardCfg.def
            this.atkProgressBar.progress = cardCfg.atk/100;
            this.defProgressBar.progress = cardCfg.def/100;
        }

        let generalChild = this.generalNode.getChildByName("generalChild");
        if(!generalChild){
            generalChild = cc.instantiate(ROOT_NODE.pfGeneral);
            generalChild.name = "generalChild";
            this.generalNode.addChild(generalChild);
        }
        generalChild.getComponent(GeneralCell).setCellClickEnable(false);
        generalChild.getComponent(GeneralCell).initGeneralData(this.cardInfo.generalInfo);
    }

}
