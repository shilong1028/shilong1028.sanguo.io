import Block from "./block";
import { FightMgr } from "../manager/FightManager";
import Card from "./card";
import { CardInfo } from "../manager/Enum";
import ShowLabel from "./showLabel";

//战斗或合成展示层
const {ccclass, property} = cc._decorator;

@ccclass
export default class FightShow extends cc.Component {

    @property(cc.Label)
    leftName: cc.Label = null;
    @property(cc.Label)
    rightName: cc.Label = null;

    @property(cc.Label)
    leftHp: cc.Label = null;
    @property(cc.Label)
    rightHp: cc.Label = null;

    @property(cc.Label)
    leftMp: cc.Label = null;
    @property(cc.Label)
    rightMp: cc.Label = null;

    @property(cc.Label)
    leftAtk: cc.Label = null;
    @property(cc.Label)
    rightAtk: cc.Label = null;

    @property(cc.Label)
    leftDef: cc.Label = null;
    @property(cc.Label)
    rightDef: cc.Label = null;

    @property(cc.Node)
    leftHead: cc.Node = null;
    @property(cc.Node)
    rightHead: cc.Node = null;

    @property(cc.Sprite)
    fightIcon: cc.Sprite = null;
    @property(cc.Label)
    typeLabel: cc.Label = null;

    @property(cc.SpriteFrame)
    hechengIcon: cc.SpriteFrame = null;

    @property(cc.SpriteAtlas)
    attackAtlas: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    hechengAtlas: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    pfCard: cc.Prefab = null;

    @property(cc.Prefab)
    pfTips: cc.Prefab = null;  //提示文本

    nShowType: number = 0;   //1合成2战斗
    srcBlock: Block = null;  // 主动方
    destBlock: Block = null;   //被动方(被攻击者或被合成吸收者)
    leftCardInfo: CardInfo = null;
    rightCardInfo: CardInfo = null;

    tipsArr: any[] = new Array();
    tipTimes: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        FightMgr.bStopTouch = true;   //是否停止触摸反应
    }

    start () {

    }

    update (dt) {
        if(this.tipTimes > 0){
            this.tipTimes -= dt;
        }
        if(this.tipsArr.length > 0){
            if(this.tipTimes <= 0){
                this.tipTimes = 0.5;

                let tips = this.tipsArr.shift();
                this.createTips(tips);
            }
        }
    }

    createTips(tips: any){
        let tipNode = cc.instantiate(this.pfTips);
        tipNode.getComponent(ShowLabel).showTips(tips.str, tips.col, cc.v2(0, 120));
        this.node.addChild(tipNode, 100);
    }

    showTipsLable(str: string, col: cc.Color = cc.Color.WHITE){
        cc.log("showTipsLable(), str = "+str);
        this.tipsArr.push({"str":str, "col":col});
    }

    /**显示战斗或合成 
     * @param nType 1合成2战斗
     * @param srcBlock 主动方
     * @param destBlock 被动方(被攻击者或被合成吸收者)
    */
    initFightShowData(nType: number, srcBlock: Block, destBlock: Block){
        this.nShowType = nType;
        this.srcBlock = srcBlock;
        this.destBlock = destBlock;
        this.leftCardInfo = srcBlock.cardInfo.clone();
        this.rightCardInfo = destBlock.cardInfo.clone();
        cc.log("initFightShowData(), this.leftCardInfo = "+JSON.stringify(this.leftCardInfo));
        cc.log("initFightShowData(), this.rightCardInfo = "+JSON.stringify(this.rightCardInfo));

        if(this.nShowType == 1){   //合成
            this.fightIcon.spriteFrame = this.hechengIcon;
            this.typeLabel.string = "合成";
            this.showTipsLable("合成", cc.Color.YELLOW);
        }else if(this.nShowType == 2){   //战斗
            this.typeLabel.string = "战斗";
            this.showTipsLable("战斗", cc.Color.RED);
        }
        
        this.showLeftUI();
        this.showRightUI();

        this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
            this.showEffectAni();
        }.bind(this))));
    }

    showLeftUI(){
        let cardNode_left = this.leftHead.getChildByName("cardNode_left");
        if(cardNode_left == null){
            cardNode_left = cc.instantiate(FightMgr.getFightScene().pfCard);
            cardNode_left.name = "cardNode_left";
            this.leftHead.addChild(cardNode_left);
        }
        cardNode_left.getComponent(Card).setCardData(this.leftCardInfo);

        let cardCfg = this.leftCardInfo.generalInfo.generalCfg;
        this.leftName.string = cardCfg.name;
        this.leftHp.string = "血量：" + cardCfg.hp;
        this.leftMp.string = "智力：" + cardCfg.mp;
        this.leftAtk.string = "攻击：" + cardCfg.atk;
        this.leftDef.string = "防御：" + cardCfg.def;
    }

    showRightUI(){
        let cardNode_right = this.rightHead.getChildByName("cardNode_right");
        if(cardNode_right == null){
            cardNode_right = cc.instantiate(FightMgr.getFightScene().pfCard);
            cardNode_right.name = "cardNode_right";
            this.rightHead.addChild(cardNode_right);
        }
        cardNode_right.getComponent(Card).setCardData(this.rightCardInfo);

        let cardCfg = this.rightCardInfo.generalInfo.generalCfg;
        this.rightName.string = cardCfg.name;
        this.rightHp.string = "血量：" + cardCfg.hp;
        this.rightMp.string = "智力：" + cardCfg.mp;
        this.rightAtk.string = "攻击：" + cardCfg.atk;
        this.rightDef.string = "防御：" + cardCfg.def;
    }

    showFightProgress(attackCardInfo: CardInfo, defendCardInfo: CardInfo){
        let atkCardCfg = attackCardInfo.generalInfo.generalCfg;
        let defCardCfg = this.rightCardInfo.generalInfo.generalCfg;

        if(atkCardCfg.hp <= 0 || defCardCfg.hp <= 0){
            return [attackCardInfo, defendCardInfo];
        }

        this.showTipsLable("开始攻击，攻击方："+atkCardCfg.name+"; 防御方： "+defCardCfg.name);
        let attack = atkCardCfg.atk;
        let defend = defCardCfg.def;

        if(atkCardCfg.mp > defCardCfg.mp){
            let multi = atkCardCfg.mp/defCardCfg.mp + 0.2;
            multi = parseFloat(multi.toFixed(2)); 
            if(multi > 1.5){
                multi = 1.5;
            }
            this.showTipsLable("攻击方智力值远高于防御方，攻击方攻击力提升！"+multi, cc.Color.YELLOW);
            attack *= multi;
            atkCardCfg.mp -= 10;
            if(atkCardCfg.mp < 0){
                atkCardCfg.mp = 0;
            }
        }else if(defCardCfg.mp > atkCardCfg.mp){
            let multi = defCardCfg.mp/atkCardCfg.mp + 0.2;
            multi = parseFloat(multi.toFixed(2)); 
            if(multi > 1.5){
                multi = 1.5;
            }
            this.showTipsLable("攻击方智力值远低于防御方，防御方防御力提升!"+multi, cc.Color.YELLOW);
            defend *= multi;
            defCardCfg.mp -= 10;
            if(defCardCfg.mp < 0){
                defCardCfg.mp = 0;
            }
        }

        let restriction = FightMgr.checkBingRestriction(atkCardCfg.bingzhong, defCardCfg.bingzhong);
        if(restriction == 1){
            this.showTipsLable("攻击方兵种克制防御方，攻击方攻击力提升1.3倍！", cc.Color.RED);
            attack *= 1.3;
        }else if(restriction == -1){
            this.showTipsLable("攻击方兵种被防御方克制，防御方防御力提升1.3倍！", cc.Color.BLUE);
            defend *= 1.3;
        }

        let harm = Math.floor(attack - defend)*10;
        if(harm <= 0){
            harm = 1;
            this.showTipsLable("攻击方太弱，防御方收到伤害：1", cc.Color.GREEN);
        }else{
            this.showTipsLable("防御方收到伤害："+harm);
        }
        let blood = defCardCfg.hp - harm;
        if(blood <= 0){
            this.showTipsLable("攻击方击败防御方，防御方阵亡！"+defCardCfg.name, cc.Color.GREEN);
        }

        defCardCfg.hp = blood;

        return [attackCardInfo, defendCardInfo];
    }

    showEffectAni(){
        let effectAtlas = null;
        let scale = 1.0;
        if(this.nShowType == 1){   //合成
            effectAtlas = this.hechengAtlas;
        }else if(this.nShowType == 2){   //战斗
            effectAtlas = this.attackAtlas;
            scale = 0.3;
        }
        let effNode = FightMgr.showFramesAniAndRemove(this.node, cc.v2(0, 0), effectAtlas, false);
        effNode.scale = scale;
        let stepDelay = 0.5;

        let rightCardCfg = this.rightCardInfo.generalInfo.generalCfg;
        let leftCardCfg = this.leftCardInfo.generalInfo.generalCfg;

        if(this.nShowType == 2){
            this.node.runAction(cc.sequence(
                cc.repeat(cc.sequence(cc.delayTime(stepDelay), cc.callFunc(function(){
                    let arr = this.showFightProgress(this.leftCardInfo, this.rightCardInfo);
                    this.leftCardInfo = arr[0];
                    this.rightCardInfo = arr[1];
                    this.showLeftUI();
                    this.showRightUI();
                }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
                    let arr = this.showFightProgress(this.rightCardInfo, this.leftCardInfo);
                    this.rightCardInfo = arr[0];
                    this.leftCardInfo = arr[1];
                    this.showLeftUI();
                    this.showRightUI();
                }.bind(this))), 3), 
            cc.delayTime(stepDelay), cc.callFunc(function(){
                effNode.removeFromParent(true);
                cc.log("fightEnd(), this.leftCardInfo = "+JSON.stringify(this.leftCardInfo));
                cc.log("fightEnd(), this.rightCardInfo = "+JSON.stringify(this.rightCardInfo));
                
                if(rightCardCfg.hp <= 0){
                    if(leftCardCfg.bingzhong == 403){  //弓兵攻击后不移动位置
                        this.srcBlock.showBlockCard(this.leftCardInfo);  //设置地块上的卡牌模型
                        this.destBlock.onRemoveCardNode();   //将本地块上的卡牌移走了
                    }else{
                        this.destBlock.showBlockCard(this.leftCardInfo);  //设置地块上的卡牌模型
                        this.srcBlock.onRemoveCardNode();   //将本地块上的卡牌移走了
                    }
                }else if(leftCardCfg.hp <= 0){
                    this.srcBlock.onRemoveCardNode();   //将本地块上的卡牌移走了
                    this.destBlock.showBlockCard(this.rightCardInfo);  //设置地块上的卡牌模型
                }else{
                    this.srcBlock.showBlockCard(this.leftCardInfo);  //设置地块上的卡牌模型
                    this.destBlock.showBlockCard(this.rightCardInfo);  //设置地块上的卡牌模型
                }
            }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
                this.node.removeFromParent(true);
                FightMgr.nextRoundOpt();  //下回合处理
            }.bind(this))))
        }
        else if(this.nShowType == 1){   //合成
            this.node.runAction(cc.sequence(cc.delayTime(stepDelay), cc.callFunc(function(){
                let totalVal = leftCardCfg.hp + rightCardCfg.hp;
                let newVal = Math.floor(totalVal/2);
                if(leftCardCfg.bingzhong == rightCardCfg.bingzhong){
                    newVal = Math.floor(newVal*1.2);
                    if(newVal > 1000){
                        newVal = 1000;
                    }
                    this.showTipsLable("兵种相同，合成新血量为双方血量折中后的1.2倍！", cc.Color.GREEN);
                }else{
                    this.showTipsLable("兵种不同，合成新血量为双方血量折中！", cc.Color.GREEN);
                }
                leftCardCfg.hp = newVal;
                this.leftHp.string = "血量："+newVal;
                this.rightHp.string = "血量：0";
            }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
                let totalVal = leftCardCfg.mp + rightCardCfg.mp;
                let newVal = Math.floor(totalVal/2);
                if(leftCardCfg.bingzhong == rightCardCfg.bingzhong){
                    newVal = Math.floor(newVal*1.2);
                    if(newVal > 100){
                        newVal = 100;
                    }
                    this.showTipsLable("兵种相同，合成新智力为双方智力折中后的1.2倍！", cc.Color.YELLOW);
                }else{
                    this.showTipsLable("兵种不同，合成新智力为双方智力折中！", cc.Color.YELLOW);
                }
                leftCardCfg.mp = newVal;
                this.leftMp.string = "智力："+newVal;
                this.rightMp.string = "智力：0";
            }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
                let totalVal = leftCardCfg.atk + rightCardCfg.atk;
                let newVal = Math.floor(totalVal/2);
                if(leftCardCfg.bingzhong == rightCardCfg.bingzhong){
                    newVal = Math.floor(newVal*1.3);
                    if(newVal > 100){
                        newVal = 100;
                    }
                    this.showTipsLable("兵种相同，合成新攻击为双方攻击折中后的1.3倍！", cc.Color.RED);
                }else{
                    newVal = Math.floor(newVal*1.1);
                    if(newVal > 100){
                        newVal = 100;
                    }
                    this.showTipsLable("兵种不同，合成新攻击为双方攻击折中后的1.1倍！", cc.Color.RED);
                }
                leftCardCfg.atk = newVal;
                this.leftAtk.string = "攻击："+newVal;
                this.rightAtk.string = "攻击：0";
            }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
                let totalVal = leftCardCfg.def + rightCardCfg.def;
                let newVal = Math.floor(totalVal/2);
                if(leftCardCfg.bingzhong == rightCardCfg.bingzhong){
                    newVal = Math.floor(newVal*1.2);
                    if(newVal > 100){
                        newVal = 100;
                    }
                    this.showTipsLable("兵种相同，合成新防御为双方防御折中后的1.2倍！", cc.Color.BLUE);
                }else{
                    this.showTipsLable("兵种不同，合成新防御为双方防御折中！", cc.Color.BLUE);
                }
                leftCardCfg.def = newVal;
                this.leftDef.string = "防御："+newVal;
                this.rightDef.string = "防御：0";
            }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
                effNode.removeFromParent(true);
                this.destBlock.showBlockCard(this.leftCardInfo);  //设置地块上的卡牌模型
                this.srcBlock.onRemoveCardNode();   //将本地块上的卡牌移走了
            }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
                this.node.removeFromParent(true);
                FightMgr.nextRoundOpt();  //下回合处理
            }.bind(this))))
        }
    }


}
