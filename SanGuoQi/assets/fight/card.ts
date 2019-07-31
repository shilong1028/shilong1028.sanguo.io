
import { CardInfo, GeneralInfo } from "../manager/Enum";

//卡牌节点
const {ccclass, property} = cc._decorator;

@ccclass
export default class Card extends cc.Component {

    @property(cc.Sprite)
    cardSpr: cc.Sprite = null;
    @property(cc.Sprite)
    campSpr: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    cardAtlas: cc.SpriteAtlas = null;
    @property([cc.SpriteFrame])
    campFrames: cc.SpriteFrame[] = new Array(3);

    @property(cc.ProgressBar)
    hpProgressBar: cc.ProgressBar =  null;   //血量条（最大值1000）
    @property(cc.ProgressBar)
    mpProgressBar: cc.ProgressBar =  null;   //智力条（最大值100）
    @property(cc.ProgressBar)
    atkProgressBar: cc.ProgressBar =  null;   //攻击条（最大值100）
    @property(cc.ProgressBar)
    defProgressBar: cc.ProgressBar =  null;   //防御条（最大值100）

    @property(cc.Label)
    nameLable: cc.Label = null;
    @property(cc.Label)
    lvLabel: cc.Label = null;   //武将等级
    @property(cc.Label)
    bingNumLabel: cc.Label = null;  //兵力
    @property(cc.Label)
    shiqiLabel: cc.Label = null;   //士气

    @property(cc.Sprite)
    bingSpr: cc.Sprite = null;   //兵种 401骑兵402刀兵403枪兵404弓兵
    @property([cc.SpriteFrame])
    bingSprFrames: cc.SpriteFrame[] = new Array(4);

    cardInfo: CardInfo = null;    //卡牌信息

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.cardSpr.node.opacity = 0;
        this.campSpr.node.opacity = 0;
        this.bingSpr.node.opacity = 0;

        this.hpProgressBar.progress = 0;
        this.mpProgressBar.progress = 0;
        this.atkProgressBar.progress = 0;
        this.defProgressBar.progress = 0;

        this.nameLable.string = "";
        this.lvLabel.string = "Lv1";
        this.bingNumLabel.string = "兵";
        this.shiqiLabel.string = "士气100";  
    }

    onDestroy(){

    }

    start () {

    }

    // update (dt) {}

    //士气变动
    handleShiqiChange(val: number){
        if(this.cardInfo){
            // this.cardInfo.shiqi += val;
            // if(this.cardInfo.shiqi < 0){
            //     this.cardInfo.shiqi = 0;
            // }
            this.shiqiLabel.string = "士气"+this.cardInfo.shiqi.toString(); 
        }
    }

    /**设置卡牌数据 */
    setCardData(info: CardInfo){
        this.cardInfo = info;
        //cc.log("setCardData(), info = "+JSON.stringify(info));
        if(this.cardInfo.campId == 1){  //阵营，0默认，1蓝方，2红方
            this.nameLable.node.color = cc.color(0, 0, 255);
            this.campSpr.spriteFrame = this.campFrames[1];
            this.campSpr.node.opacity = 255;
        }else if(this.cardInfo.campId == 2){
            this.nameLable.node.color = cc.color(255, 0, 0);
            this.campSpr.spriteFrame = this.campFrames[2];
            this.campSpr.node.opacity = 255;
        }else{
            this.nameLable.node.color = cc.color(255, 255, 255);
        }

        this.lvLabel.string = "Lv"+this.cardInfo.generalInfo.generalLv;
        this.bingNumLabel.string = "兵"+this.cardInfo.generalInfo.bingCount.toString();

        let cardCfg = this.cardInfo.generalInfo.generalCfg;
        if(cardCfg){
            let generalId = this.cardInfo.generalInfo.generalId;
            this.cardSpr.spriteFrame = this.cardAtlas.getSpriteFrame(generalId.toString());
            this.cardSpr.node.opacity = 255;
    
            this.nameLable.string = cardCfg.name;
            let nType = cardCfg.bingzhong - 400;
            this.bingSpr.spriteFrame = this.bingSprFrames[nType-1];
            this.bingSpr.node.opacity = 255;
    
            this.hpProgressBar.progress = cardCfg.hp/1000;
            this.mpProgressBar.progress = cardCfg.mp/100;
            this.atkProgressBar.progress = cardCfg.atk/100;
            this.defProgressBar.progress = cardCfg.def/100;
        }
    }

    /**显示武将头像信息 */
    showGeneralCard(info: GeneralInfo){
        //cc.log("showGeneralCard(), info = "+JSON.stringify(info));
        this.nameLable.node.color = cc.color(255, 0, 255);
        this.nameLable.string = info.generalCfg.name;

        this.cardSpr.spriteFrame = this.cardAtlas.getSpriteFrame(info.generalId.toString());
        this.cardSpr.node.opacity = 255;

        let nType = info.generalCfg.bingzhong - 400;
        this.bingSpr.spriteFrame = this.bingSprFrames[nType-1];
        this.bingSpr.node.opacity = 255;

        this.hpProgressBar.progress = info.generalCfg.hp/1000;
        this.mpProgressBar.progress = info.generalCfg.mp/100;
        this.atkProgressBar.progress = info.generalCfg.atk/100;
        this.defProgressBar.progress = info.generalCfg.def/100;

        this.lvLabel.string = "Lv"+info.generalLv;
        this.bingNumLabel.string = "兵"+info.bingCount.toString();
    }


}
