
import { ROOT_NODE } from "../login/rootNode";
import { AudioMgr } from "../manager/AudioMgr";
import { AttackResult, BlockBuildType, CardInfo, CardState, SoliderType } from "../manager/Enum";
import { FightMgr } from "../manager/FightManager";
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
    leftEffect: cc.Node = null;  
    @property(cc.Node)
    rightEffect: cc.Node = null;
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

    @property(cc.Node)
    closeTIpNode: cc.Node = null;

    @property(cc.SpriteAtlas)
    attackAtlas: cc.SpriteAtlas = null;   //攻击序列帧

    leftBlock: Block = null;  // 主动方(左侧)地块
    rightBlock: Block = null;  //被动方（右侧）地块

    leftCardInfo: CardInfo = null;  // 主动方(左侧)卡牌信息
    rightCardInfo: CardInfo = null;  //被动方（右侧）卡牌信息
    resultCallback:Function = null;   //战斗结果回调

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    //战斗详情界面是隐藏复用的
    onEnable(){
        this.solidersNode.active = false;
        this.closeTIpNode.active = false;
        FightMgr.bStopTouch = true;   //是否停止触摸反应 
    }

    onDisable(){
        this.node.stopAllActions();
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

        if(this.leftCardInfo.generalInfo.generalId.length < 4){   //无武将
            this.leftGenNode.active = false;
        }else{
            this.leftGenNode.active = true;
        }
        if(this.rightCardInfo.generalInfo.generalId.length < 4){   //无武将
            this.rightGenNode.active = false;
        }else{
            this.rightGenNode.active = true;
        }

        this.updateLeftAndRightUI(); //更新左右侧卡牌UI
        if(this.leftGenNode.active){
            this.leftGenNode.getComponent(BingAni).changeAniByType(1);  //1站在左侧，面向右侧, 1默认动作，2攻击动作
        }
        if(this.rightGenNode.active){
            this.rightGenNode.getComponent(BingAni).changeAniByType(1);  //1站在左侧，面向右侧, 1默认动作，2攻击动作
        }
        this.showLeftAniUi(1);  //显示主动方(左侧)动画 1默认动作，2攻击动作
        this.showRightAniUi(1);  //显示被动方（右侧）(被攻击者或被合成吸收者)动画  1默认动作，2攻击动作

        this.node.runAction(cc.sequence(cc.delayTime(1.0), cc.callFunc(function(){
            this.FightAiOpt();   //双方战斗操作过程
        }.bind(this))));
    }

    /**显示战斗信息提示 */
    showTipsLable(str: string, col: cc.Color = cc.Color.WHITE, posType: number = 0){
        let pos = cc.v2(cc.winSize.width/2, cc.winSize.height/2);
        if(posType < 0){  //posType=0 中间位置 -1为左侧将军位置 1为右侧将军位置
            pos = cc.v2(cc.winSize.width/2 -100, cc.winSize.height/2);
        }else if(posType > 0){
            pos = cc.v2(cc.winSize.width/2 +100, cc.winSize.height/2);
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
    onCloseBtn(){
        AudioMgr.playBtnClickEffect();

        if(this.resultCallback){  //战斗结果回调
            this.resultCallback(this.leftCardInfo, this.rightCardInfo);
        }

        this.leftSoliderNode.destroyAllChildren();
        this.rightSoliderNode.destroyAllChildren();

        this.leftBlock= null;  // 主动方(左侧)地块
        this.rightBlock= null;  //被动方（右侧）地块
        this.resultCallback = null;
        this.leftCardInfo = null;
        this.rightCardInfo = null;

        this.node.active = false;
    }

    //双方战斗操作过程
    FightAiOpt(){
        this.showTipsLable("开始战斗", cc.Color.YELLOW);
        
        this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function(){
                this.leftHitRight();  //左侧攻击右侧（主动方攻击被动方）
            }.bind(this)), cc.delayTime(1.0), cc.callFunc(function(){
                this.rightHitLeft();  //右侧攻击左侧（被动方还击主动方）
            }.bind(this)),
        cc.delayTime(1.0), cc.callFunc(function(){
            this.closeTIpNode.active = true;
            // cc.log("战斗结束 atkCardInfo = "+JSON.stringify(this.leftCardInfo))
            // cc.log("战斗结束 defCardInfo = "+JSON.stringify(this.rightCardInfo))
            this.onCloseBtn();
        }.bind(this))));
    }

    //左侧攻击右侧（主动方攻击被动方）
    leftHitRight(){
        this.showTipsLable("攻击方进攻", cc.Color.YELLOW);
        GameMgr.createAtlasAniNode(this.attackAtlas, 10, cc.WrapMode.Default, this.rightEffect);

        if(this.leftGenNode.active){
            this.leftGenNode.getComponent(BingAni).changeAniByType(2);  //1站在左侧，面向右侧, 1默认动作，2攻击动作
        }
        if(this.rightGenNode.active){
            this.rightGenNode.getComponent(BingAni).changeAniByType(1);  //1站在左侧，面向右侧, 1默认动作，2攻击动作
        }
        this.showLeftAniUi(2);  //显示主动方(左侧)动画 1默认动作，2攻击动作
        this.showRightAniUi(1);  //显示被动方（右侧）(被攻击者或被合成吸收者)动画  1默认动作，2攻击动作
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
            this.showTipsLable("防御方反击", cc.Color.YELLOW);
            GameMgr.createAtlasAniNode(this.attackAtlas, 10, cc.WrapMode.Default, this.leftEffect);

            if(this.leftGenNode.active){
                this.leftGenNode.getComponent(BingAni).changeAniByType(1);  //1站在左侧，面向右侧, 1默认动作，2攻击动作
            }
            if(this.rightGenNode.active){
                this.rightGenNode.getComponent(BingAni).changeAniByType(2);  //1站在左侧，面向右侧, 1默认动作，2攻击动作
            }
            this.showLeftAniUi(1); 
            this.showRightAniUi(2);  //显示被动方（右侧）(被攻击者或被合成吸收者)动画  1默认动作，2攻击动作
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
