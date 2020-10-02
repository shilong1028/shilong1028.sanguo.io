
import Radar from "../control/Radar";
import { ROOT_NODE } from "../login/rootNode";
import { GeneralInfo } from "../manager/ConfigManager";
import { BlockBuildType, CardInfo, CardState, SoliderType } from "../manager/Enum";
import { AttackResult, FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import BingAni from "./bingAni";
import Block from "./block";
import Card from "./card";


//战斗演示展示层
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Fight/fightShow")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class FightShow extends cc.Component {

    @property(cc.Label)
    leftName: cc.Label = null;   //攻击方名称
    @property(cc.Label)
    rightName: cc.Label = null;
    @property(cc.Label)
    leftHp: cc.Label = null;   //攻击方血量
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
    leftCardNode: cc.Node = null;   //左侧部曲头像
    @property(cc.Node)
    rightCardNode: cc.Node = null;

    @property(cc.Node)
    leftGenNode: cc.Node = null;   //左侧武将动画节点
    @property(cc.Node)
    rightGenNode: cc.Node = null;   //右侧武将动画节点
    @property(cc.Node)
    leftSoliderNode: cc.Node = null;   //左侧士兵动画节点
    @property(cc.Node)
    rightSoliderNode: cc.Node = null;   //右侧士兵动画节点
    @property(cc.Node)
    solidersNode: cc.Node = null;   //左右四种兵种预制体

    @property(Radar)
    leftRadar: Radar = null;
    @property(Radar)
    rightRadar: Radar = null;

    @property(cc.SpriteAtlas)
    attackAtlas: cc.SpriteAtlas = null;   //攻击序列帧

    leftBlock: Block = null;  // 主动方(左侧)地块
    rightBlock: Block = null;  //被动方（右侧）地块

    leftCardInfo: CardInfo = null;  // 主动方(左侧)卡牌信息
    rightCardInfo: CardInfo = null;  //被动方（右侧）卡牌信息
    resultCallback:Function = null;   //战斗结果回调

    bLeftUsedSkill: boolean = false;    //一次对战只能使用一次技能
    bRightUsedSkill: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        FightMgr.bStopTouch = true;   //是否停止触摸反应
    }

    start () {

    }

    update (dt) {
    }

    /**显示战斗展示信息 */
    initFightShowData(atkBlock: Block, defBlock: Block, resultCallback:Function){
        this.leftBlock= atkBlock;  // 主动方(左侧)地块
        this.rightBlock= defBlock;  //被动方（右侧）地块
        this.resultCallback = resultCallback;
        this.leftCardInfo = this.leftBlock.getBlockCardInfo();
        this.rightCardInfo = this.rightBlock.getBlockCardInfo();
        cc.log("initFightShowData(), this.leftCardInfo = "+JSON.stringify(this.leftCardInfo));
        cc.log("initFightShowData(), this.rightCardInfo = "+JSON.stringify(this.rightCardInfo));

        this.updateLeftAndRightUI(); //更新左右侧卡牌UI

        GameMgr.createAtlasAniNode(this.attackAtlas, 18, cc.WrapMode.Default, this.node);

        this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
            this.FightAiOpt();   //双方战斗操作过程
        }.bind(this))));
    }

    /**显示战斗信息提示 */
    showTipsLable(str: string, col: cc.Color = cc.Color.WHITE, posType: number = 0){
        let pos = cc.v2(0, 80);
        if(posType < 0){  //posType=0 中间位置 -1为左侧将军位置 1为右侧将军位置
            pos = cc.v2(this.leftGenNode.x + cc.winSize.width/2, 0);
        }else if(posType > 0){
            pos = cc.v2(this.rightGenNode.x + cc.winSize.width/2, 0);
        }
        ROOT_NODE.showTipsText(str, col, pos);
    }

    //更新左右侧卡牌UI
    updateLeftAndRightUI(){ 
        //显示主动方(左侧)卡牌UI
        this.leftCardNode.getComponent(Card).initCardData(this.leftCardInfo);
        let cardCfg = this.leftCardInfo.generalInfo.generalCfg;
        this.leftName.string = "攻击方：" + cardCfg.name;
        this.leftHp.string = "血量：" + this.leftCardInfo.generalInfo.fightHp;
        this.leftMp.string = "智力：" + this.leftCardInfo.generalInfo.fightMp;
        this.leftAtk.string = "攻击：" + cardCfg.atk;
        this.leftDef.string = "防御：" + cardCfg.def;

        //显示被动方（右侧）(被攻击者或被合成吸收者)卡牌UI
        this.rightCardNode.getComponent(Card).initCardData(this.rightCardInfo);
        cardCfg = this.rightCardInfo.generalInfo.generalCfg;
        this.rightName.string = "防御方：" + cardCfg.name;
        this.rightHp.string = "血量：" + this.rightCardInfo.generalInfo.fightHp;
        this.rightMp.string = "智力：" + this.rightCardInfo.generalInfo.fightMp;
        this.rightAtk.string = "攻击：" + cardCfg.atk;
        this.rightDef.string = "防御：" + cardCfg.def;

        this.showGeneralAttrRadar(this.leftCardInfo.generalInfo, 1);   //显示武将属性雷达图
        this.showGeneralAttrRadar(this.leftCardInfo.generalInfo, 2);   //显示武将属性雷达图

        this.leftGenNode.getComponent(BingAni).changeAniByType(1);  //1站在左侧，面向右侧, 1默认动作，2攻击动作
        this.rightGenNode.getComponent(BingAni).changeAniByType(1);  //1站在左侧，面向右侧, 1默认动作，2攻击动作
        this.showLeftAniUi(1);  //显示主动方(左侧)动画 1默认动作，2攻击动作
        this.showRightAniUi(1);  //显示被动方（右侧）(被攻击者或被合成吸收者)动画  1默认动作，2攻击动作
    }
    /**显示武将属性雷达图 */
    showGeneralAttrRadar(info: GeneralInfo, showPos: number=1){
        let radar = this.leftRadar;
        if(showPos == 2){
            radar = this.rightRadar
        }

        if(radar){
            let preArr = [1, 1, 1, 1, 1]
            let attrVal = [0, 0, 0, 0, 0]
            if(info && info.generalCfg){
                attrVal = [ info.generalLv, info.generalCfg.hp, 
                    info.generalCfg.mp, info.generalCfg.atk, info.generalCfg.def
                ];//等级、血量、智力、攻击、防御
                preArr = attrVal;   //每种属性，最高值为100
                preArr[1] = attrVal[1]/10;   //血量最大1000

                radar.changeSidePercent(preArr);
            }
        }
    }
    //显示主动方(左侧)动画 1默认动作，2攻击动作
    showLeftAniUi(optType: number){
        //每个士兵节点标识100兵
        let leftBingCount = Math.ceil((this.leftCardInfo.generalInfo.bingCount-10)/100);
        //作战兵种 401骑兵402刀兵403枪兵404弓兵
        let leftBingPf = this.solidersNode.getChildByName(`bing${this.leftCardInfo.bingzhong}_1_ani`)   //左右四种兵种预制体

        let maxCount = Math.max(leftBingCount, this.leftSoliderNode.childrenCount);
        for(let i=0; i<maxCount; ++i){
            let leftBing = this.leftSoliderNode.children[i];
            if(i < leftBingCount){
                if(!leftBing){
                    leftBing = cc.instantiate(leftBingPf);
                    this.leftSoliderNode.addChild(leftBing);
                }
                leftBing.active = true;
                let leftBingAni = leftBing.getComponent(BingAni);
                leftBingAni.changeAniByType(optType); 
            }else{
                if(leftBing){
                    leftBing.active = false;
                }
            }
        }
    }
    //显示被动方（右侧）(被攻击者或被合成吸收者)动画  1默认动作，2攻击动作
    showRightAniUi(optType: number){
        //每个士兵节点标识100兵
        let rightBingCount = Math.ceil((this.rightCardInfo.generalInfo.bingCount-10)/100);
        //作战兵种 401骑兵402刀兵403枪兵404弓兵
        let rightBingPf = this.solidersNode.getChildByName(`bing${this.rightCardInfo.bingzhong}_2_ani`)  //左右四种兵种预制体

        let maxCount = Math.max(rightBingCount, this.rightSoliderNode.childrenCount);
        for(let i=0; i<maxCount; ++i){
            let rightBing = this.rightSoliderNode.children[i];
            if(i < rightBingCount){
                if(!rightBing){
                    rightBing = cc.instantiate(rightBingPf);
                    this.rightSoliderNode.addChild(rightBing);
                }
                rightBing.active = true;
                let leftBingAni = rightBing.getComponent(BingAni);
                leftBingAni.changeAniByType(optType); 
            }else{
                if(rightBing){
                    rightBing.active = false;
                }
            }
        }
    }

    //----------------------- 以下为 战斗逻辑  ------------------------------

    //双方战斗操作过程
    FightAiOpt(){
        this.showTipsLable("开始战斗", cc.Color.YELLOW);
        let stepDelay = 0.5;
        this.node.runAction(cc.sequence(
            cc.repeat(cc.sequence(cc.delayTime(stepDelay), cc.callFunc(function(){
                this.leftHitRight();  //左侧攻击右侧（主动方攻击被动方）
            }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
                this.rightHitLeft();  //右侧攻击左侧（被动方还击主动方）
            }.bind(this))), 3), 
        cc.delayTime(0.1), cc.callFunc(function(){
            if(this.resultCallback){  //战斗结果回调
                this.resultCallback(this.leftCardInfo, this.rightCardInfo);
            }
            this.node.active = false;
        }.bind(this))));
    }

    //左侧攻击右侧（主动方攻击被动方）
    leftHitRight(){
        this.showLeftAniUi(2);  //显示主动方(左侧)动画 1默认动作，2攻击动作
        this.showRightAniUi(1);  //显示被动方（右侧）(被攻击者或被合成吸收者)动画  1默认动作，2攻击动作
        this.showTipsLable("攻击方进攻", cc.Color.YELLOW);
        this.showFightProgress(this.leftCardInfo, this.rightCardInfo, this.leftBlock.buildType, this.rightBlock.buildType);  
        this.updateLeftAndRightUI(); //更新左右侧卡牌UI
    }

    //右侧攻击左侧（被动方还击主动方）
    rightHitLeft(){
        let bBeatBack:boolean = true  //防御方反击
        if(this.rightCardInfo.bingzhong != SoliderType.gongbing){  //对方不是弓兵部曲
            if(this.leftCardInfo.bingzhong == SoliderType.gongbing || this.rightCardInfo.generalInfo.generalId.length < 4){   //弓兵攻击无反击  //防守方为纯士兵部曲，无反击
                bBeatBack = false;
            }
        }
        if(bBeatBack == true){
            this.showRightAniUi(2);  //显示被动方（右侧）(被攻击者或被合成吸收者)动画  1默认动作，2攻击动作
            this.showLeftAniUi(1);  
            this.showTipsLable("防御方反击", cc.Color.YELLOW);
            this.showFightProgress(this.rightCardInfo, this.leftCardInfo, this.rightBlock.buildType, this.leftBlock.buildType);
            this.updateLeftAndRightUI(); //更新左右侧卡牌UI
        }
    }

    //战斗过程  
    showFightProgress(attackCardInfo: CardInfo, defendCardInfo: CardInfo, atkBuild:BlockBuildType, defBuild:BlockBuildType){
        let atkInfo:AttackResult = FightMgr.handleAttackOpt(attackCardInfo, defendCardInfo, atkBuild, defBuild, false);  //预计算攻击伤害
        cc.log("handleAttackAndNoShow 无展示攻击 atkInfo = "+JSON.stringify(atkInfo))

        let bLeftIsAtk = true;
        if(attackCardInfo.generalInfo.timeId == this.leftCardInfo.generalInfo.timeId){   //攻击方是左侧
            bLeftIsAtk = true;
        }else{
            bLeftIsAtk = false;
        }

        if(atkBuild == BlockBuildType.Watchtower){   //建筑类型  0无，1营寨，2箭楼, 3粮仓
            this.showTipsLable("箭塔辅助，攻击力增加20%！", cc.Color.RED, (bLeftIsAtk == true ? -1 : 1));
        }
        if(defBuild == BlockBuildType.Barracks){   //建筑类型  0无，1营寨，2箭楼, 3粮仓
            this.showTipsLable("营寨辅助，防御力增加30%！", cc.Color.RED, (bLeftIsAtk == true ? 1 : -1));
        }else if(defBuild == BlockBuildType.Granary){   //建筑类型  0无，1营寨，2箭楼, 3粮仓
            cc.log("粮仓辅助，防御力增加20%！")
            this.showTipsLable("粮仓辅助，防御力增加20%！", cc.Color.RED, (bLeftIsAtk == true ? 1 : -1));
        }

        if(FightMgr.checkBingRestriction(attackCardInfo.bingzhong, defendCardInfo.bingzhong) > 0){  //兵种相克
            this.showTipsLable("兵种相克，攻击力增加20%！", cc.Color.RED, (bLeftIsAtk == true ? -1 : 1));
        }

        this.showTipsLable("武将受到伤害"+atkInfo.atkHp, cc.Color.GREEN, (bLeftIsAtk == true ? 1 : -1));
        this.showTipsLable("士兵受到伤害"+atkInfo.atkVal, cc.Color.GREEN, (bLeftIsAtk == true ? 1 : -1));

        let defGeneralHp = defendCardInfo.generalInfo.fightHp - atkInfo.atkHp;
        if(defGeneralHp < 0){
            defGeneralHp = 0;
            defendCardInfo.state = CardState.Dead;   //武将死亡
            this.showTipsLable("武将死亡", cc.Color.GREEN, (bLeftIsAtk == true ? 1 : -1));
        }
        defendCardInfo.generalInfo.fightHp = defGeneralHp;

        let defBingCount = defendCardInfo.generalInfo.bingCount - atkInfo.killCount;
        if(defBingCount < 0){
            defBingCount = 0;
        }
        if(defBingCount < 100){
            defendCardInfo.state = CardState.Flee;   //部曲逃逸(部曲士兵数量过少<100)
            this.showTipsLable("部曲逃逸", cc.Color.GREEN, (bLeftIsAtk == true ? 1 : -1));
        }
        defendCardInfo.generalInfo.bingCount = defBingCount;

        let atkGeneralMp = attackCardInfo.generalInfo.fightMp - atkInfo.usedMp;
        if(atkGeneralMp < 0){
            atkGeneralMp = 0;
        }
        attackCardInfo.generalInfo.fightMp = atkGeneralMp;
    }

}
