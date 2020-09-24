import { GeneralInfo } from "../manager/ConfigManager";
import { CardInfo } from "../manager/Enum";


//卡牌节点
const {ccclass, property} = cc._decorator;

@ccclass
export default class Card extends cc.Component {

    @property(cc.Node)
    generalNode: cc.Node = null;

    @property(cc.Sprite)
    campSpr: cc.Sprite = null;   //蓝方（我方）敌方（红方）
    @property([cc.SpriteFrame])
    campFrames: cc.SpriteFrame[] = [];

    @property(cc.Label)
    bingNumLabel: cc.Label = null;  //兵力
    @property(cc.Label)
    shiqiLabel: cc.Label = null;   //士气

    @property(cc.ProgressBar)
    hpProgressBar: cc.ProgressBar =  null;   //血量条（最大值1000）
    @property(cc.ProgressBar)
    mpProgressBar: cc.ProgressBar =  null;   //智力条（最大值100）
    @property(cc.ProgressBar)
    atkProgressBar: cc.ProgressBar =  null;   //攻击条（最大值100）
    @property(cc.ProgressBar)
    defProgressBar: cc.ProgressBar =  null;   //防御条（最大值100）

    cardInfo: CardInfo = null;    //卡牌信息

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.campSpr.node.active = false;

        this.hpProgressBar.progress = 0;
        this.mpProgressBar.progress = 0;
        this.atkProgressBar.progress = 0;
        this.defProgressBar.progress = 0;

        this.bingNumLabel.string = "兵";
        this.shiqiLabel.string = "士气";  
    }

    onDestroy(){
    }

    start () {
    }

    // update (dt) {}

    //显示士气值
    showCardShiqiLabel(){
        if(this.cardInfo){
            this.shiqiLabel.string = "士气"+this.cardInfo.shiqi.toString(); 
        }
    }

    /**设置卡牌数据(战斗) */
    setCardData(info: CardInfo){
        this.cardInfo = info;
        //cc.log("setCardData(), info = "+JSON.stringify(info));
        if(this.cardInfo.campId == 1){  //阵营，0默认，1蓝方(我方)，2红方
            this.campSpr.spriteFrame = this.campFrames[0];
        }else if(this.cardInfo.campId == 2){
            this.campSpr.spriteFrame = this.campFrames[1];
        }

        this.bingNumLabel.string = "兵"+this.cardInfo.generalInfo.bingCount.toString();
        this.showCardShiqiLabel();  //显示士气值

        let cardCfg = this.cardInfo.generalInfo.generalCfg;
        if(cardCfg){
            this.atkProgressBar.progress = cardCfg.atk/100;
            this.defProgressBar.progress = cardCfg.def/100;

            if(this.cardInfo.generalInfo){  //战斗中
                this.hpProgressBar.progress = this.cardInfo.generalInfo.fightHp/1000;
                this.mpProgressBar.progress = this.cardInfo.generalInfo.fightMp/100;
            }else{
                this.hpProgressBar.progress = cardCfg.hp/1000;
                this.mpProgressBar.progress = cardCfg.mp/100;
            }
        }
    }

    /**显示武将头像信息 */
    showGeneralCard(info: GeneralInfo){
        cc.log("showGeneralCard(), info = "+JSON.stringify(info));

        this.hpProgressBar.progress = info.generalCfg.hp/1000;
        this.mpProgressBar.progress = info.generalCfg.mp/100;
        this.atkProgressBar.progress = info.generalCfg.atk/100;
        this.defProgressBar.progress = info.generalCfg.def/100;

        if(info.bingCount > 0){
            this.bingNumLabel.string = "兵"+info.bingCount.toString();
        }else{
            this.bingNumLabel.string = "兵???";
        }
    }


}
