import Block from "./block";
import { FightMgr } from "../manager/FightManager";
import Card from "./card";
import { CardInfo, SoliderType, SkillInfo, GeneralInfo } from "../manager/Enum";
import ShowLabel from "./showLabel";
import BingAni from "../animation/bingAni";
import { GameMgr } from "../manager/GameManager";

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

    @property(cc.Node)
    leftGenNode: cc.Node = null;   //左侧武将动画节点
    @property(cc.Node)
    rightGenNode: cc.Node = null;   //右侧武将动画节点
    @property(cc.Node)
    soldiersNode: cc.Node = null;   //中间士兵动画节点

    @property(cc.Sprite)
    fightIcon: cc.Sprite = null;
    @property(cc.Label)
    typeLabel: cc.Label = null;
    @property(cc.SpriteFrame)
    hechengIcon: cc.SpriteFrame = null;

    @property(cc.SpriteAtlas)
    attackAtlas: cc.SpriteAtlas = null;   //攻击序列帧
    @property(cc.SpriteAtlas)
    hechengAtlas: cc.SpriteAtlas = null;   //合成序列帧

    @property([cc.SpriteAtlas])
    effectAtlas: cc.SpriteAtlas[] = new Array(8);  //攻击升降，防御升降，血量升降，士气升降特效

    @property(cc.Prefab)
    pfCard: cc.Prefab = null;   //卡牌
    @property(cc.Prefab)
    pfTips: cc.Prefab = null;  //提示文本
    @property([cc.Prefab])
    pfBings: cc.Prefab[] = new Array(4);  //骑刀枪弓四种兵种节点

    nShowType: number = 0;   //1合成2战斗
    leftBlock: Block = null;  // 主动方(左侧)
    rightBlock: Block = null;   //被动方（右侧）(被攻击者或被合成吸收者)
    leftCardInfo: CardInfo = null;  // 主动方(左侧)卡牌信息
    rightCardInfo: CardInfo = null;  //被动方（右侧）卡牌信息

    bLeftUsedSkill: boolean = false;    //一次对战只能使用一次技能
    bRightUsedSkill: boolean = false;

    leftBingArr: BingAni[] = new Array();   //左侧士兵节点集合
    rightBingArr: BingAni[] = new Array();   //右侧士兵节点集合

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
        let pos = cc.v2(0, 80);
        if(tips.posType < 0){  //posType=0 中间位置 -1为左侧将军位置 1为右侧将军位置
            pos = cc.v2(this.leftGenNode.x, -100);
        }else if(tips.posType > 0){
            pos = cc.v2(this.rightGenNode.x, -100);
        }

        let tipNode = cc.instantiate(this.pfTips);
        tipNode.getComponent(ShowLabel).showTips(tips.str, tips.col, pos);
        this.node.addChild(tipNode, 100);
    }

    showTipsLable(str: string, col: cc.Color = cc.Color.WHITE, posType: number = 0){
        cc.log("showTipsLable(), str = "+str);
        this.tipsArr.push({"str":str, "col":col, "posType":posType});   //posType=0 中间位置 -1为左侧将军位置 1为右侧将军位置
    }

    /**显示战斗或合成 
     * @param nType 1合成2战斗
     * @param leftBlock 主动方(左侧)
     * @param rightBlock 被动方（右侧）(被攻击者或被合成吸收者)
    */
    initFightShowData(nType: number, leftBlock: Block, rightBlock: Block){
        this.nShowType = nType;
        this.leftBlock = leftBlock;
        this.rightBlock = rightBlock;
        this.leftCardInfo = leftBlock.cardInfo;
        this.rightCardInfo = rightBlock.cardInfo;
        cc.log("initFightShowData(), this.leftCardInfo = "+JSON.stringify(this.leftCardInfo));
        cc.log("initFightShowData(), this.rightCardInfo = "+JSON.stringify(this.rightCardInfo));

        if(this.nShowType == 1){   //合成
            this.fightIcon.spriteFrame = this.hechengIcon;
            this.typeLabel.string = "合成";
            this.showTipsLable("合成", cc.Color.YELLOW);
            FightMgr.showFramesAniAndRemove(this.node, cc.v2(0, 0), this.hechengAtlas, false);
        }else if(this.nShowType == 2){   //战斗
            this.typeLabel.string = "战斗";
            this.showTipsLable("开始战斗", cc.Color.GREEN);
            FightMgr.showFramesAniAndRemove(this.node, cc.v2(0, 0), this.attackAtlas, false);
        }
        
        this.updateLeftAndRightUI(); //更新左右侧卡牌UI
        this.showAniUI();   //显示左右侧动画

        this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function(){
            if(this.nShowType == 1){   //合成
                this.HechengAiOpt();   //合成操作过程
            }else{
                this.FightAiOpt();   //双方战斗操作过程
            }
        }.bind(this))));
    }

    //双方战斗操作过程
    FightAiOpt(){
        cc.log("开始战斗");
        let stepDelay = 0.5;
        this.node.runAction(cc.sequence(
            cc.repeat(cc.sequence(cc.delayTime(stepDelay), cc.callFunc(function(){
                this.leftHitRight();  //左侧攻击右侧（主动方攻击被动方）
            }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
                this.rightHitLeft();  //右侧攻击左侧（被动方还击主动方）
            }.bind(this))), 3), 
        cc.delayTime(0.1), cc.callFunc(function(){
            cc.log("对战回合结束处理");
            if(this.checkFightUnitDead() == false){ //检测战斗部曲状态（血量《0，兵力《0，士气《0，则部曲溃逃）
                //双方均未死亡
                this.leftBlock.showBlockCard(this.leftCardInfo);  //设置地块上的卡牌模型
                this.rightBlock.showBlockCard(this.rightCardInfo);  //设置地块上的卡牌模型

                this.handleFightEnd();  //武将死亡或对战回合结束处理
            }
        }.bind(this))));
    }

    //武将死亡或对战回合结束处理
    handleFightEnd(){
        cc.log("handleFightEnd, this.leftCardInfo = "+JSON.stringify(this.leftCardInfo));
        cc.log("handleFightEnd, this.rightCardInfo = "+JSON.stringify(this.rightCardInfo));
        this.node.stopAllActions();
        let stepDelay = 0.5;
        this.node.runAction(cc.sequence(cc.delayTime(stepDelay), cc.callFunc(function(){
            this.showLeftAniUi(1);  //显示主动方(左侧)动画 1默认动作，2攻击动作
            this.showRightAniUi(1);  //显示被动方（右侧）(被攻击者或被合成吸收者)动画  1默认动作，2攻击动作
        }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
            this.node.removeFromParent(true);
            FightMgr.nextRoundOpt();  //下回合处理
        }.bind(this))))
    }

    //检测战斗部曲状态（血量《0，兵力《0，士气《0，则部曲溃逃）
    checkFightUnitDead(){
        cc.log("checkFightUnitDead() 检测战斗部曲状态（血量《0，兵力《0，士气《0，则部曲溃逃）");
        let leftGeneral = this.leftCardInfo.generalInfo;
        let rightGeneral = this.rightCardInfo.generalInfo;

        let leftUnitDead = false;
        let rightUnitDead = false;

        if(leftGeneral.tempFightInfo.fightHp <= 0){
            this.showTipsLable("主动方(左侧)"+leftGeneral.generalCfg.name+"武将阵亡！", cc.Color.GREEN, -1);
            leftUnitDead = true;
        }else if(rightGeneral.tempFightInfo.fightHp <= 0){
            this.showTipsLable("被动方（右侧）"+rightGeneral.generalCfg.name+"武将阵亡！", cc.Color.GREEN, 1);
            rightUnitDead = true;
        }
        else if(leftGeneral.bingCount <= 0){
            this.showTipsLable("主动方(左侧)"+leftGeneral.generalCfg.name+"部曲已无士兵，部曲解散！", cc.Color.GREEN, -1);
            leftUnitDead = true;
        }else if(rightGeneral.bingCount <= 0){
            this.showTipsLable("被动方（右侧）"+rightGeneral.generalCfg.name+"部曲已无士兵，部曲解散！", cc.Color.GREEN, 1);
            rightUnitDead = true;
        }
        else if(this.leftCardInfo.shiqi <= 0){
            this.showTipsLable("主动方(左侧)"+leftGeneral.generalCfg.name+"部曲士气用尽，部曲溃逃！", cc.Color.GREEN, -1);
            leftUnitDead = true;
        }else if(this.rightCardInfo.shiqi <= 0){
            this.showTipsLable("被动方（右侧）"+rightGeneral.generalCfg.name+"部曲士气用尽，部曲溃逃！", cc.Color.GREEN, 1);
            rightUnitDead = true;
        }

        if(leftUnitDead == true && rightUnitDead == true){   //双方均死亡
            if(this.rightCardInfo.campId == FightMgr.myCampId){
                FightMgr.getFightScene().setMyOpenBlock(false, this.rightBlock);   //设置我方已经开启的卡牌
                FightMgr.getFightScene().setEnemyOpenBlock(false, this.leftBlock);   //设置敌方已经开启的卡牌
            }else if(this.leftCardInfo.campId == FightMgr.myCampId){
                FightMgr.getFightScene().setMyOpenBlock(false, this.leftBlock);   //设置我方已经开启的卡牌
                FightMgr.getFightScene().setEnemyOpenBlock(false, this.rightBlock);   //设置敌方已经开启的卡牌
            }
            this.leftBlock.onRemoveCardNode();   //将本地块上的卡牌移走了
            this.rightBlock.onRemoveCardNode();   //将本地块上的卡牌移走了
        }
        else if(rightUnitDead == true){  //被动方（右侧）死亡（主动方会根据兵种决定是否移动格子）
            if(this.rightCardInfo.campId == FightMgr.myCampId){
                FightMgr.getFightScene().handelShiqiChangeByDead(true, this.leftBlock);  
                FightMgr.getFightScene().setMyOpenBlock(false, this.rightBlock);   //设置我方已经开启的卡牌
            }else{
                FightMgr.getFightScene().handelShiqiChangeByDead(false, this.leftBlock);  //当敌对方武将死亡时的士气变动
                FightMgr.getFightScene().setEnemyOpenBlock(false, this.rightBlock);   //设置敌方已经开启的卡牌
            }

            if(leftGeneral.generalCfg.bingzhong == SoliderType.gongbing){  //弓兵攻击后不移动位置
                this.leftBlock.showBlockCard(this.leftCardInfo);  //设置地块上的卡牌模型
                this.rightBlock.onRemoveCardNode();   //将本地块上的卡牌移走了
            }else{
                //其他兵种，需要移动
                if(this.leftBlock.cardInfo.campId == FightMgr.myCampId){
                    FightMgr.getFightScene().setMyOpenBlock(false, this.leftBlock);   //设置我方已经开启的卡牌
                }else{
                    FightMgr.getFightScene().setEnemyOpenBlock(false, this.leftBlock);   //设置敌方已经开启的卡牌
                }

                this.rightBlock.showBlockCard(this.leftCardInfo);  //设置地块上的卡牌模型
                this.leftBlock.onRemoveCardNode();   //将本地块上的卡牌移走了

                //移动后新格子上的卡牌敌我集团
                if(this.rightBlock.cardInfo.campId == FightMgr.myCampId){
                    FightMgr.getFightScene().setMyOpenBlock(true, this.rightBlock);   //设置我方已经开启的卡牌
                }else{
                    FightMgr.getFightScene().setEnemyOpenBlock(true, this.rightBlock);   //设置敌方已经开启的卡牌
                }
            }
        }
        else if(leftUnitDead == true){   //主动方(左侧)死亡(被动方不会移动格子)
            if(this.leftCardInfo.campId == FightMgr.myCampId){
                FightMgr.getFightScene().handelShiqiChangeByDead(true, this.rightBlock);  
                FightMgr.getFightScene().setMyOpenBlock(false, this.leftBlock);   //设置我方已经开启的卡牌
            }else{
                FightMgr.getFightScene().handelShiqiChangeByDead(false, this.rightBlock);  //当敌对方武将死亡时的士气变动
                FightMgr.getFightScene().setEnemyOpenBlock(false, this.leftBlock);   //设置敌方已经开启的卡牌
            }

            this.leftBlock.onRemoveCardNode();   //将本地块上的卡牌移走了
            this.rightBlock.showBlockCard(this.rightCardInfo);  //设置地块上的卡牌模型
        }
        else{   //双方均未死亡
            return false;
        }

        this.handleFightEnd();//武将死亡或对战回合结束处理
        return true;
    }

    //左侧攻击右侧（主动方攻击被动方）
    leftHitRight(){
        if(this.checkFightUnitDead() == false){ //检测战斗部曲状态（血量《0，兵力《0，士气《0，则部曲溃逃）
            this.showLeftAniUi(2);  //显示主动方(左侧)动画 1默认动作，2攻击动作
            this.showRightAniUi(1);  //显示被动方（右侧）(被攻击者或被合成吸收者)动画  1默认动作，2攻击动作
            this.showFightProgress(this.leftCardInfo, this.rightCardInfo, this.leftBlock.ArrowOrTown, this.rightBlock.ArrowOrTown);
            this.updateLeftAndRightUI(); //更新左右侧卡牌UI
            this.updateBingAniCount(2);  //更新左右侧动画显示  1站在左侧面向右侧 2站在右侧面向左侧
        }
    }

    //右侧攻击左侧（被动方还击主动方）
    rightHitLeft(){
        if(this.checkFightUnitDead() == false){ //检测战斗部曲状态（血量《0，兵力《0，士气《0，则部曲溃逃）
            this.showLeftAniUi(1);  //显示主动方(左侧)动画 1默认动作，2攻击动作
            let bDefenderAtk: boolean = true;   //防御方反击
            if(this.leftCardInfo.generalInfo.generalCfg.bingzhong == SoliderType.gongbing){   //弓兵攻击两格
                if(this.rightCardInfo.generalInfo.generalCfg.bingzhong != SoliderType.gongbing){ 
                    if(this.leftBlock.node.position.sub(this.rightBlock.node.position).mag() >= 250 ){
                        bDefenderAtk = false;  //两格且防御非弓兵
                    }
                }
            }
            if(bDefenderAtk == true){
                this.showRightAniUi(2);  //显示被动方（右侧）(被攻击者或被合成吸收者)动画  1默认动作，2攻击动作
                this.showFightProgress(this.rightCardInfo, this.leftCardInfo, this.rightBlock.ArrowOrTown, this.leftBlock.ArrowOrTown);
                this.updateLeftAndRightUI(); //更新左右侧卡牌UI
                this.updateBingAniCount(1);  //更新左右侧动画显示  1站在左侧面向右侧 2站在右侧面向左侧
            }
        }
    }

    //战斗过程
    showFightProgress(attackCardInfo: CardInfo, defendCardInfo: CardInfo, atkArrowTown:number=0, defArrowTown:number=0){
        let bLeftIsAtk = true;
        if(attackCardInfo.generalInfo.timeId == this.leftCardInfo.generalInfo.timeId){   //攻击方是左侧
            bLeftIsAtk = true;
        }else{
            bLeftIsAtk = false;
        }

        let atkCardCfg = attackCardInfo.generalInfo.generalCfg;
        let defCardCfg = defendCardInfo.generalInfo.generalCfg;

        cc.log("开始攻击，攻击方："+atkCardCfg.name+"; 防御方： "+defCardCfg.name);
        let basicAtk = atkCardCfg.atk;
        let basicDef = defCardCfg.def;
        //技能进攻
        let retArr = this.handleFightSkill(attackCardInfo.generalInfo, defendCardInfo.generalInfo);
        cc.log("basicAtk = "+basicAtk+"; basicDef = "+basicDef+"; retArr = "+JSON.stringify(retArr));
        basicAtk = retArr[0];
        basicDef = retArr[1];

        let attack = basicAtk *((attackCardInfo.generalInfo.generalLv-1)/2+1);
        let defend = basicDef *((defendCardInfo.generalInfo.generalLv-1)/3+1);
        basicAtk = attack;
        basicDef = defend;
        cc.log("atkLv = "+attackCardInfo.generalInfo.generalLv+"; basicAtk = "+basicAtk+"; defLv = "+defendCardInfo.generalInfo.generalLv+"; basicDef = "+basicDef);

        //攻击方在箭塔下
        if(atkArrowTown == 1){
            this.showTipsLable("箭塔辅助，攻击力增加20%！", cc.Color.RED, (bLeftIsAtk == true ? -1 : 1));
            attack += basicAtk * 0.2;
        }
        //防御方在城池下
        if(defArrowTown == 2){
            this.showTipsLable("城池辅助，防御力增加30%！", cc.Color.BLUE, (bLeftIsAtk == true ? 1 : -1));
            defend += basicDef * 0.3;
        }

        if(atkCardCfg.bingzhong == SoliderType.gongbing){   //弓兵攻击翻倍
            this.showTipsLable("弓兵抛射，攻击力增加50%！", cc.Color.RED, (bLeftIsAtk == true ? -1 : 1));
            attack += basicAtk * 0.5;
        }else{
            //兵种相克，401骑兵克制402刀兵， 402刀兵克制403枪兵，403枪兵克制401骑兵， 404弓兵为不克制兵种
            let restriction = FightMgr.checkBingRestriction(atkCardCfg.bingzhong, defCardCfg.bingzhong);
            if(restriction == 1){
                this.showTipsLable("兵种克制对方，攻击力增加30%！", cc.Color.RED, (bLeftIsAtk == true ? -1 : 1));
                attack += basicAtk * 0.3;
            }else if(restriction == -1){
                this.showTipsLable("兵种被对方克制，攻击力降低30%！", cc.Color.GREEN, (bLeftIsAtk == true ? -1 : 1));
                attack -= basicAtk * 0.3;
            }
        }

        attack = attack * (attackCardInfo.shiqi/100);
        this.showTipsLable("士气加成攻击！", cc.Color.GREEN, (bLeftIsAtk == true ? -1 : 1));
        defend = defend * (defendCardInfo.shiqi/100);
        this.showTipsLable("士气加成防御！", cc.Color.GREEN, (bLeftIsAtk == true ? 1 : -1));

        let atkBingScale = attackCardInfo.generalInfo.bingCount/GameMgr.getMaxBingCountByLv(attackCardInfo.generalInfo.generalLv);
        atkBingScale.toFixed(2);
        this.showTipsLable("士兵满编率加成攻击！", cc.Color.GREEN, (bLeftIsAtk == true ? -1 : 1));
        let defBingScale = defendCardInfo.generalInfo.bingCount/GameMgr.getMaxBingCountByLv(defendCardInfo.generalInfo.generalLv);
        defBingScale.toFixed(2);
        this.showTipsLable("士兵满编率加成防御！", cc.Color.GREEN, (bLeftIsAtk == true ? 1 : -1));
        attack = attack * atkBingScale;
        defend = defend * defBingScale;

        let harm = (attack - defend*0.5)*3;
        let minHarm = attack*0.1;
        if(harm <= minHarm){
            harm = minHarm;
        }
        harm = Math.ceil(harm);   //伤害取整
        let generalHarm = Math.ceil(harm/(defendCardInfo.generalInfo.generalLv+1));
        this.showTipsLable("武将受到伤害"+generalHarm, cc.Color.GREEN, (bLeftIsAtk == true ? 1 : -1));
        let soldierHarm = harm - generalHarm;
        this.showTipsLable("士兵受到伤害"+generalHarm, cc.Color.GREEN, (bLeftIsAtk == true ? 1 : -1));
        cc.log("攻击 "+attack+"; 防御 "+defend+"; 伤害 "+harm+"; 武将伤害 "+generalHarm+"; 士兵伤害 "+soldierHarm+"; minHarm = "+minHarm);

        let blood = defendCardInfo.generalInfo.tempFightInfo.fightHp - generalHarm;
        if(blood <= 0){
            blood = 0;
        }
        defendCardInfo.generalInfo.tempFightInfo.fightHp = blood;

        let bingCount = defendCardInfo.generalInfo.bingCount - soldierHarm;
        if(bingCount <= 0){
            bingCount = 0;
            attackCardInfo.generalInfo.tempFightInfo.killCount += defendCardInfo.generalInfo.bingCount;
        }else{
            attackCardInfo.generalInfo.tempFightInfo.killCount += soldierHarm;
        }
        defendCardInfo.generalInfo.bingCount = bingCount;
    }

    //释放技能
    handleFightSkill(attackGeneral: GeneralInfo, defendGeneral: GeneralInfo){
        let bLeftIsAtk = true;
        let atkUsedSkill = false;
        let defUsedSkill = false;
        let atkNode = this.leftGenNode;
        let defNode = this.rightGenNode;
        if(attackGeneral.timeId == this.leftCardInfo.generalInfo.timeId){   //攻击方是左侧
            atkUsedSkill = this.bLeftUsedSkill;
            defUsedSkill = this.bRightUsedSkill;
        }else{
            bLeftIsAtk = false;
            atkNode = this.rightGenNode;
            defNode = this.leftGenNode;
            atkUsedSkill = this.bRightUsedSkill;
            defUsedSkill = this.bLeftUsedSkill;
        }
        cc.log("释放技能, bLeftIsAtk = "+bLeftIsAtk+"; atkUsedSkill = "+atkUsedSkill+"; defUsedSkill = "+defUsedSkill);

        let basicAtk = attackGeneral.generalCfg.atk;
        let basicDef = defendGeneral.generalCfg.def;
        //攻击方未使用过技能
        if(atkUsedSkill == false && attackGeneral.tempFightInfo.fightMp >= 20){
            let atkSkills = attackGeneral.skills;
            if(atkSkills.length > 0 && Math.random() > 0.7){   //攻击方随机释放技能
                cc.log("攻击方随机释放技能");
                let randIdx = Math.floor(Math.random()*(atkSkills.length-0.01));
                let randSkill: SkillInfo = atkSkills[randIdx];
                if(randSkill && randSkill.skillCfg){
                    if(randSkill.skillCfg.atk > 0){
                        this.handleAtkUseSkill(bLeftIsAtk);  //使用技能减少Mp值
                        basicAtk += randSkill.skillCfg.atk;
                        FightMgr.showFramesAniAndRemove(atkNode, cc.v2(0, 0), this.effectAtlas[0], true);
                        this.showTipsLable("使用技能"+randSkill.skillCfg.name+"，提升攻击力"+randSkill.skillCfg.atk, cc.Color.YELLOW), (bLeftIsAtk == true ? -1 : 1);
                    }else if(randSkill.skillCfg.def < 0){
                        this.handleAtkUseSkill(bLeftIsAtk);  //使用技能减少Mp值
                        basicDef += randSkill.skillCfg.def;
                        FightMgr.showFramesAniAndRemove(defNode, cc.v2(0, 0), this.effectAtlas[3], true);
                        this.showTipsLable("受到技能"+randSkill.skillCfg.name+"，降低防御力"+randSkill.skillCfg.atk, cc.Color.YELLOW, (bLeftIsAtk == true ? 1 : -1));
                    }else if(randSkill.skillCfg.hp != 0){
                        this.handleAtkUseSkill(bLeftIsAtk, randSkill.skillCfg.hp);  //使用技能减少Mp值
                        if(randSkill.skillCfg.hp > 0){
                            FightMgr.showFramesAniAndRemove(atkNode, cc.v2(0, 0), this.effectAtlas[4], true);
                            this.showTipsLable("使用技能"+randSkill.skillCfg.name+"，生命值增加"+randSkill.skillCfg.hp, cc.Color.YELLOW, (bLeftIsAtk == true ? -1 : 1));
                        }else if(randSkill.skillCfg.hp < 0){
                            FightMgr.showFramesAniAndRemove(defNode, cc.v2(0, 0), this.effectAtlas[5], true);
                            this.showTipsLable("受到技能"+randSkill.skillCfg.name+"，生命值降低"+randSkill.skillCfg.hp, cc.Color.YELLOW, (bLeftIsAtk == true ? 1 : -1));
                        }
                    }else if(randSkill.skillCfg.shiqi != 0){
                        this.handleAtkUseSkill(bLeftIsAtk, 0, randSkill.skillCfg.shiqi);  //使用技能减少Mp值
                        if(randSkill.skillCfg.shiqi > 0){
                            FightMgr.showFramesAniAndRemove(atkNode, cc.v2(0, 0), this.effectAtlas[6], true);
                            this.showTipsLable("使用技能"+randSkill.skillCfg.name+"，提升士气"+randSkill.skillCfg.shiqi, cc.Color.YELLOW, (bLeftIsAtk == true ? -1 : 1));
                        }else if(randSkill.skillCfg.shiqi < 0){
                            FightMgr.showFramesAniAndRemove(defNode, cc.v2(0, 0), this.effectAtlas[7], true);
                            this.showTipsLable("受到技能"+randSkill.skillCfg.name+"，降低士气"+randSkill.skillCfg.shiqi, cc.Color.YELLOW, (bLeftIsAtk == true ? -1 : 1));
                        }
                    }
                }
            }
        }

        //防御方未使用过技能
        if(defUsedSkill == false && defendGeneral.tempFightInfo.fightMp >= 20){
            let defSkills = defendGeneral.skills;
            if(defSkills.length > 0 && Math.random() > 0.7){   //防御方随机释放技能
                cc.log("防御方随机释放技能");
                let randIdx = Math.floor(Math.random()*(defSkills.length-0.01));
                let randSkill: SkillInfo = defSkills[randIdx];
                if(randSkill && randSkill.skillCfg){
                    if(randSkill.skillCfg.atk < 0){
                        this.handleAtkUseSkill(!bLeftIsAtk);  //使用技能减少Mp值
                        basicAtk += randSkill.skillCfg.atk;
                        FightMgr.showFramesAniAndRemove(atkNode, cc.v2(0, 0), this.effectAtlas[1], true);
                        this.showTipsLable("受到技能"+randSkill.skillCfg.name+"，降低攻击力"+randSkill.skillCfg.atk, cc.Color.YELLOW), (bLeftIsAtk == true ? -1 : 1);
                    }
                    else if(randSkill.skillCfg.def > 0){
                        this.handleAtkUseSkill(!bLeftIsAtk);  //使用技能减少Mp值
                        basicDef += randSkill.skillCfg.def;
                        FightMgr.showFramesAniAndRemove(defNode, cc.v2(0, 0), this.effectAtlas[2], true);
                        this.showTipsLable("使用技能"+randSkill.skillCfg.name+"，提升防御力"+randSkill.skillCfg.atk, cc.Color.YELLOW, (bLeftIsAtk == true ? 1 : -1));
                    }
                    else if(randSkill.skillCfg.hp != 0){
                        this.handleAtkUseSkill(!bLeftIsAtk, randSkill.skillCfg.hp);  //使用技能减少Mp值
                        if(randSkill.skillCfg.hp > 0){
                            FightMgr.showFramesAniAndRemove(defNode, cc.v2(0, 0), this.effectAtlas[4], true);
                            this.showTipsLable("使用技能"+randSkill.skillCfg.name+"，生命值增加"+randSkill.skillCfg.hp, cc.Color.YELLOW, (bLeftIsAtk == true ? 1 : -1));
                        }else if(randSkill.skillCfg.hp < 0){
                            FightMgr.showFramesAniAndRemove(atkNode, cc.v2(0, 0), this.effectAtlas[5], true);
                            this.showTipsLable("受到技能"+randSkill.skillCfg.name+"，生命值降低"+randSkill.skillCfg.hp, cc.Color.YELLOW, (bLeftIsAtk == true ? -1 : 1));
                        }
                    }
                    else if(randSkill.skillCfg.shiqi != 0){
                        this.handleAtkUseSkill(!bLeftIsAtk, 0, randSkill.skillCfg.shiqi);  //使用技能减少Mp值
                        if(randSkill.skillCfg.shiqi > 0){
                            FightMgr.showFramesAniAndRemove(defNode, cc.v2(0, 0), this.effectAtlas[6], true);
                            this.showTipsLable("使用技能"+randSkill.skillCfg.name+"，提升士气"+randSkill.skillCfg.shiqi, cc.Color.YELLOW, (bLeftIsAtk == true ? 1 : -1));
                        }else if(randSkill.skillCfg.shiqi < 0){
                            FightMgr.showFramesAniAndRemove(atkNode, cc.v2(0, 0), this.effectAtlas[7], true);
                            this.showTipsLable("受到技能"+randSkill.skillCfg.name+"，降低士气"+randSkill.skillCfg.shiqi, cc.Color.YELLOW, (bLeftIsAtk == true ? -1 : 1));
                        }
                    }
                }
            }
        }

        if(basicAtk > 100){
            basicAtk = 100;
        }else if(basicAtk < 0){
            basicAtk = 0;
        }
        if(basicDef > 100){
            basicDef = 100;
        }else if(basicDef < 0){
            basicDef = 0;
        }

        return [basicAtk, basicDef];
    }

    //使用技能减少Mp值
    handleAtkUseSkill(bLeftUseSkill:boolean, hp:number=0, shiqi:number=0){
        cc.log("handleAtkUseSkill(), bLeftUseSkill = "+bLeftUseSkill+"; hp = "+hp+"; shiqi = "+shiqi);
        if(bLeftUseSkill == true){
            this.bLeftUsedSkill = true;
            this.leftCardInfo.generalInfo.tempFightInfo.fightMp -= 20;
            if(this.leftCardInfo.generalInfo.tempFightInfo.fightMp < 0){
                this.leftCardInfo.generalInfo.tempFightInfo.fightMp = 0;
            }

            if(hp > 0){   //增加血量
                this.leftCardInfo.generalInfo.tempFightInfo.fightHp += hp;
                if(this.leftCardInfo.generalInfo.tempFightInfo.fightHp > 1000){
                    this.leftCardInfo.generalInfo.tempFightInfo.fightHp = 1000;
                }
            }else if(hp < 0){  //减少血量
                this.rightCardInfo.generalInfo.tempFightInfo.fightHp += hp;
                if(this.rightCardInfo.generalInfo.tempFightInfo.fightHp < 0){
                    this.rightCardInfo.generalInfo.tempFightInfo.fightHp = 0;
                }
            }

            if(shiqi > 0){   //增加士气
                this.leftCardInfo.shiqi += shiqi;
                if(this.leftCardInfo.shiqi > 100){
                    this.leftCardInfo.shiqi = 100;
                }
            }else if(shiqi < 0){  //减少士气
                this.rightCardInfo.shiqi += shiqi;
                if(this.rightCardInfo.shiqi < 0){
                    this.rightCardInfo.shiqi = 0;
                }
            }
        }else{
            this.bRightUsedSkill = true;
            this.rightCardInfo.generalInfo.tempFightInfo.fightMp -= 20;
            if(this.rightCardInfo.generalInfo.tempFightInfo.fightMp < 0){
                this.rightCardInfo.generalInfo.tempFightInfo.fightMp = 0;
            }

            if(hp > 0){   //增加血量
                this.rightCardInfo.generalInfo.tempFightInfo.fightHp += hp;
                if(this.rightCardInfo.generalInfo.tempFightInfo.fightHp > 1000){
                    this.rightCardInfo.generalInfo.tempFightInfo.fightHp = 1000;
                }
            }else if(hp < 0){  //减少血量
                this.leftCardInfo.generalInfo.tempFightInfo.fightHp += hp;
                if(this.leftCardInfo.generalInfo.tempFightInfo.fightHp < 0){
                    this.leftCardInfo.generalInfo.tempFightInfo.fightHp = 0;
                }
            }

            if(shiqi > 0){   //增加士气
                this.rightCardInfo.shiqi += shiqi;
                if(this.rightCardInfo.shiqi > 100){
                    this.rightCardInfo.shiqi = 100;
                }
            }else if(shiqi < 0){  //减少士气
                this.leftCardInfo.shiqi += shiqi;
                if(this.leftCardInfo.shiqi < 0){
                    this.leftCardInfo.shiqi = 0;
                }
            }
        }
    }

    //合成操作过程
    HechengAiOpt(){
        cc.log("开始合成");
        let stepDelay = 0.5;

        let rightCardCfg = this.rightCardInfo.generalInfo.generalCfg;
        let leftCardCfg = this.leftCardInfo.generalInfo.generalCfg;

        //合成之后，血量直接叠加，兵力按照兵种叠加（有损失），智力折中叠加，攻击折中叠加，防御折中叠加
        this.node.runAction(cc.sequence(cc.delayTime(stepDelay), cc.callFunc(function(){
            let newVal = leftCardCfg.hp + rightCardCfg.hp;
            if(leftCardCfg.bingzhong == rightCardCfg.bingzhong){
                this.showTipsLable("兵种相同，合成新血量为血量总和！", cc.Color.GREEN);
            }else{
                newVal = Math.floor(newVal * 0.8);
                this.showTipsLable("兵种不同，合成新血量为双方血量总和的80%！", cc.Color.GREEN);
            }
            if(newVal > 1000){
                newVal = 1000;
            }
            leftCardCfg.hp = newVal;
            this.leftHp.string = "血量："+newVal;
            this.rightHp.string = "血量：0";
        }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
            let totalVal = leftCardCfg.mp + rightCardCfg.mp;
            let newVal = Math.floor(totalVal/2);
            if(leftCardCfg.mp >= rightCardCfg.mp * 1.2){
                newVal = Math.floor(newVal*1.5);
                this.showTipsLable("卡牌智力较高，合成新智力为双方智力折中后的1.5倍！", cc.Color.YELLOW);
            }else{
                this.showTipsLable("卡牌智力一般，合成新智力为双方智力折中！", cc.Color.YELLOW);
            }
            if(newVal > 100){
                newVal = 100;
            }
            leftCardCfg.mp = newVal;
            this.leftMp.string = "智力："+newVal;
            this.rightMp.string = "智力：0";
        }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
            let totalVal = leftCardCfg.atk + rightCardCfg.atk;
            let newVal = Math.floor(totalVal/2);
            if(leftCardCfg.bingzhong == rightCardCfg.bingzhong){
                newVal = Math.floor(newVal*1.5);
                this.showTipsLable("兵种相同，合成新攻击为双方攻击折中后的1.5倍！", cc.Color.RED);
            }else{
                this.showTipsLable("兵种不同，合成新攻击为双方攻击折中值！", cc.Color.RED);
            }
            if(newVal > 100){
                newVal = 100;
            }
            leftCardCfg.atk = newVal;
            this.leftAtk.string = "攻击："+newVal;
            this.rightAtk.string = "攻击：0";
        }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
            let totalVal = leftCardCfg.def + rightCardCfg.def;
            let newVal = Math.floor(totalVal/2);
            if(leftCardCfg.bingzhong != rightCardCfg.bingzhong){
                newVal = Math.floor(newVal*1.6);
                this.showTipsLable("兵种互补，合成新防御为双方防御折中后的1.6倍！", cc.Color.BLUE);
            }else{
                newVal = Math.floor(newVal*1.2);
                this.showTipsLable("兵种相同，合成新防御为双方防御折中后的1.2倍！", cc.Color.BLUE);
            }
            if(newVal > 100){
                newVal = 100;
            }
            leftCardCfg.def = newVal;
            this.leftDef.string = "防御："+newVal;
            this.rightDef.string = "防御：0";
        }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
            let totalVal = this.leftCardInfo.generalInfo.bingCount + this.rightCardInfo.generalInfo.bingCount;
            let newVal = Math.floor(totalVal/2);
            if(leftCardCfg.bingzhong == rightCardCfg.bingzhong){
                newVal = Math.floor(newVal*1.5);
                this.showTipsLable("兵种相同，合成新兵力为双方兵力折中后的1.5倍！", cc.Color.BLUE);
            }else{
                newVal = Math.floor(newVal*1.2);
                this.showTipsLable("兵种不同，合成新兵力为双方兵力折中后后的1.2倍！", cc.Color.BLUE);
            }
            let bingMax = GameMgr.getMaxBingCountByLv(this.leftCardInfo.generalInfo.generalLv);
            if(newVal > bingMax){
                newVal = bingMax;
            }
            this.leftCardInfo.generalInfo.bingCount = newVal;
            this.rightCardInfo.generalInfo.bingCount = 0;

            cc.log("合成后的卡牌 this.leftCardInfo = "+JSON.stringify(this.leftCardInfo));
        }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
            if(this.rightBlock.cardInfo.campId == FightMgr.myCampId){
                FightMgr.getFightScene().setMyOpenBlock(false, this.rightBlock);   //设置我方已经开启的卡牌
            }else{
                FightMgr.getFightScene().setEnemyOpenBlock(false, this.rightBlock);   //设置敌方已经开启的卡牌
            }
            if(this.leftBlock.cardInfo.campId == FightMgr.myCampId){
                FightMgr.getFightScene().setMyOpenBlock(false, this.leftBlock);   //设置我方已经开启的卡牌
            }else{
                FightMgr.getFightScene().setEnemyOpenBlock(false, this.leftBlock);   //设置敌方已经开启的卡牌
            }

            this.rightBlock.showBlockCard(this.leftCardInfo);  //设置地块上的卡牌模型
            this.leftBlock.onRemoveCardNode();   //将本地块上的卡牌移走了

            if(this.rightBlock.cardInfo.campId == FightMgr.myCampId){
                FightMgr.getFightScene().setMyOpenBlock(true, this.rightBlock);   //设置我方已经开启的卡牌
            }else{
                FightMgr.getFightScene().setEnemyOpenBlock(true, this.rightBlock);   //设置敌方已经开启的卡牌
            }
        }.bind(this)), cc.delayTime(stepDelay), cc.callFunc(function(){
            this.node.removeFromParent(true);
            FightMgr.nextRoundOpt();  //下回合处理
        }.bind(this))))
    }



    /***********************  以下为左右侧 UI显示接口  *************** */

    //更新左右侧卡牌UI
    updateLeftAndRightUI(){ 
        this.showLeftUI();
        this.showRightUI();
    }
    //显示主动方(左侧)卡牌UI
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
        this.leftHp.string = "血量：" + this.leftCardInfo.generalInfo.tempFightInfo.fightHp;
        this.leftMp.string = "智力：" + this.leftCardInfo.generalInfo.tempFightInfo.fightMp;
        this.leftAtk.string = "攻击：" + cardCfg.atk;
        this.leftDef.string = "防御：" + cardCfg.def;
    }
    //显示被动方（右侧）(被攻击者或被合成吸收者)卡牌UI
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
        this.rightHp.string = "血量：" + this.rightCardInfo.generalInfo.tempFightInfo.fightHp;
        this.rightMp.string = "智力：" + this.rightCardInfo.generalInfo.tempFightInfo.fightMp;
        this.rightAtk.string = "攻击：" + cardCfg.atk;
        this.rightDef.string = "防御：" + cardCfg.def;
    }

    //显示左右侧动画
    showAniUI(){
        this.leftGenNode.getComponent(BingAni).changeAniByType(1, 1);  //1站在左侧，面向右侧, 1默认动作，2攻击动作
        this.rightGenNode.getComponent(BingAni).changeAniByType(2, 1);  //1站在左侧，面向右侧, 1默认动作，2攻击动作

        //每个士兵节点标识200兵
        let leftBingCount = Math.ceil((this.leftCardInfo.generalInfo.bingCount-50)/200);
        let rightBingCount = Math.ceil((this.rightCardInfo.generalInfo.bingCount-50)/200);
        let maxCount = Math.max(leftBingCount, rightBingCount);

        let leftOffPosX = 200/(Math.ceil(leftBingCount/3)+1);
        let rightOffPosX = 200/(Math.ceil(rightBingCount/3)+1);
        let posYArr = new Array(65, 0, -65);

        let leftBingPf = this.pfBings[this.leftCardInfo.generalInfo.generalCfg.bingzhong-401];
        let rightBingPf = this.pfBings[this.rightCardInfo.generalInfo.generalCfg.bingzhong-401];

        let yIdx = 0;
        let leftBeginX = -200 + leftOffPosX;
        let rightBeginX = 200 - rightOffPosX;
        for(let i=0; i<maxCount; ++i){
            if(i < leftBingCount){
                let leftBing = cc.instantiate(leftBingPf);
                let leftBingAni = leftBing.getComponent(BingAni);
                leftBingAni.changeAniByType(1, 1); 
                this.leftBingArr.push(leftBingAni);
                
                leftBing.position = cc.v2(leftBeginX, posYArr[yIdx]);
                this.soldiersNode.addChild(leftBing);
            }
            if(i < rightBingCount){
                let rightBing = cc.instantiate(rightBingPf);
                let rightBingAni = rightBing.getComponent(BingAni);
                rightBingAni.changeAniByType(2, 1); 
                this.rightBingArr.push(rightBingAni);

                rightBing.position = cc.v2(rightBeginX, posYArr[yIdx]);
                this.soldiersNode.addChild(rightBing);
            }
            yIdx++;
            if(yIdx > 2){
                yIdx = 0;
                leftBeginX += leftOffPosX;
                rightBeginX -= rightOffPosX;
            }
        }
    }
    //显示主动方(左侧)动画 1默认动作，2攻击动作
    showLeftAniUi(optType: number){
        this.leftGenNode.getComponent(BingAni).changeAniByType(1, optType);  //1站在左侧，面向右侧, 1默认动作，2攻击动作
        for(let i=0; i<this.leftBingArr.length; ++i){
            let leftBingAni = this.leftBingArr[i];
            leftBingAni.changeAniByType(1, optType); 
        }
    }
    //显示被动方（右侧）(被攻击者或被合成吸收者)动画  1默认动作，2攻击动作
    showRightAniUi(optType: number){
        this.rightGenNode.getComponent(BingAni).changeAniByType(2, optType);  //2站在右侧，面向左侧, 1默认动作，2攻击动作
        for(let i=0; i<this.rightBingArr.length; ++i){
            let rightBingAni = this.rightBingArr[i];
            rightBingAni.changeAniByType(2, optType); 
        }
    }
    //更新左右侧动画显示  1站在左侧面向右侧 2站在右侧面向左侧
    updateBingAniCount(posType: number){
        if(posType == 1){  //1站在左侧，面向右侧
            let leftBingCount = Math.ceil((this.leftCardInfo.generalInfo.bingCount-50)/200);
            let off = this.leftBingArr.length - leftBingCount;
            if(off > 0){
                this.leftBingArr.splice(leftBingCount-1, off);
            }
        }else if(posType == 2){
            let rightBingCount = Math.ceil((this.rightCardInfo.generalInfo.bingCount-50)/200);
            let off = this.rightBingArr.length - rightBingCount;
            if(off > 0){
                this.rightBingArr.splice(rightBingCount-1, off);
            }
        }
    }

}
