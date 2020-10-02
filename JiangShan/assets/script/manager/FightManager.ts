import Block from "../fight/block";
import FightScene from "../fight/fightScene";
import { ROOT_NODE } from "../login/rootNode";
import { CfgMgr, CityInfo, SkillInfo } from "./ConfigManager";
import { BlockBuildType, BlockRelation, CardInfo, CardState, CardType, GameOverState, SoliderType } from "./Enum";
import { GameMgr } from "./GameManager";
import { NoticeMgr, NoticeType } from "./NoticeManager";

//敌方AI处理结果
class EnemyAIResult{
    aiWeight = 0;    //AI结果权重，150一击杀敌主将 100一击杀敌，90攻击敌营，70-89最近最快非驻守回防大营，60非驻守被围逃离，
    //50接触攻击 已经攻入对方本阵范围概率高55，40随机移动，30驻守部曲随机概率随机移动
    srcBlock:Block = null;   //源操作部曲砖块
    destBlock:Block = null;   //一击必杀等目标部曲砖块

    constructor(aiWeight:number, srcBlock:Block, destBlock:Block){
        this.aiWeight = aiWeight;
        this.srcBlock = srcBlock;
        this.destBlock = destBlock;
    }
}

//攻击结果结果
export class AttackResult{
    atkVal = 0;  //攻击方的净攻击力
    beatBackVal = 0;  //对方反击的反击攻击力
    atkHp = 0;   //攻击导致对方损失的武将血量
    beatBackHp = 0;  //对方还击对攻击方造成的武将损失血量
    usedMp = 0;  //攻击过程使用技能，使用的智力值
    killCount = 0;  //攻击造成的对方部曲士兵死亡数量
    beadBackCount = 0;  //对方还击对攻击方造成的部曲士兵损失量

    constructor(){
        this.atkVal = 0;
        this.beatBackVal = 0;
        this.atkHp = 0;
        this.beatBackHp = 0;
        this.usedMp = 0;
        this.killCount = 0;
        this.beadBackCount = 0;
    }
}

//战斗管理器
const {ccclass, property} = cc._decorator;

@ccclass
class FightManager { 
    battleEnemyArr_copy: CardInfo[] = [];   //出战敌方部曲（和士兵），注意，战斗中使用的是拷贝数据
    battleGeneralArr_copy: CardInfo[] = [];   //出战我方部曲， 注意，战斗中使用的是拷贝数据

    midBoundBlockArr: Block[] = [];   //中间缓存地带的砖块
    myBoundBlockArr: Block[] = [];   //我方范围内的砖块
    enemyBoundBlockArr: Block[] = [];   //敌方范围内的砖块

    fightCityInfo: CityInfo = null;   //攻占的城池信息

    cardsRow: number = 7;  //行(横向) Row 列（纵向） Column
    cardsCol: number = 5; 

    MaxFightRouncCount: number = 50;  //最大战斗回合

    maxFightHp: number = 0;   //战斗卡牌最大血量，用于进度条显示
    maxFightBingCount: number = 0;  //战斗卡牌最大士兵数量，用于进度条显示

    //------------ 以上数据重置时不需要重新赋值 ------------
    battleEnemyArr: CardInfo[] = [];   //出战敌方部曲（和士兵）
    battleGeneralArr: CardInfo[] = [];   //出战我方部曲

    myCampId: number = 1;   //阵营，0默认，1蓝方(我方），2红方
    bStopTouch: boolean = false;   //是否停止触摸反应
    bMyRound: boolean = true;  //是否我方回合
    fightRoundCount: number = 1;   //战斗回合数

    GameFightOver: GameOverState = GameOverState.None;  //战斗是否结束
    FightWin: boolean = false;  //战斗胜利或失败
    EnemyAutoAi: boolean = true;  //敌方是否自动AI
    EnemyAIResult: EnemyAIResult = null;   //敌方AI返回结果

    //---------------------- 以下为方法接口 -------------------

    /**清除并初始化战斗数据，
     * enemyArr 敌方武将部曲卡牌数组
     * generalArr 我方武将部曲卡牌数组
     * fightCityInfo 任务，而是指定攻占某城池
      */
    clearAndInitFightData(enemyArr:CardInfo[], generalArr: CardInfo[], fightCityInfo: CityInfo=null){
        this.battleEnemyArr_copy = enemyArr;   //出战敌方部曲（和士兵） ，注意，战斗中使用的是拷贝数据
        this.battleGeneralArr_copy = generalArr;   //出战我方部曲 ，注意，战斗中使用的是拷贝数据
        this.fightCityInfo = fightCityInfo;   //攻占的城池信息

        this.midBoundBlockArr = [];   //中间缓存地带的砖块
        this.myBoundBlockArr = [];   //我方范围内的砖块
        this.enemyBoundBlockArr = [];   //敌方范围内的砖块
    
        this.clearFightMgrData(true);  //清除或重置战斗数据

        if(enemyArr.length > 0 && generalArr.length > 0){
            GameMgr.goToSceneWithLoading("fightScene");
        }
    }
    /** 清除或重置战斗数据 */
    clearFightMgrData(bReset:boolean = true){
        this.myCampId = 1;   //阵营，0默认，1蓝方(我方)，2红方
        this.bStopTouch = false;   //是否停止触摸反应
        this.bMyRound = true;  //是否我方回合
        this.fightRoundCount = 1;   //战斗回合数

        this.GameFightOver = GameOverState.None;  //战斗是否结束
        this.FightWin = false;  //战斗胜利或失败
        this.EnemyAutoAi = true;  //敌方自动AI
        this.EnemyAIResult = null;   //敌方AI返回结果

        this.battleEnemyArr = [];   //出战敌方部曲（和士兵） ，注意，战斗中使用的是拷贝数据
        this.battleGeneralArr = [];   //出战我方部曲 ，注意，战斗中使用的是拷贝数据
        if(bReset){
            for(let i=0; i<this.battleEnemyArr_copy.length;++i){    //出战敌方部曲（和士兵） ，注意，战斗中使用的是拷贝数据
                let cardInfo:CardInfo = this.battleEnemyArr_copy[i].clone();
                this.battleEnemyArr.push(cardInfo);
                if(cardInfo.generalInfo.fightHp >  this.maxFightHp){
                    this.maxFightHp = cardInfo.generalInfo.fightHp   //战斗卡牌最大血量，用于进度条显示
                }
                if(cardInfo.generalInfo.bingCount >  this.maxFightBingCount){
                    this.maxFightBingCount = cardInfo.generalInfo.bingCount   //战斗卡牌最大士兵数量，用于进度条显示
                }
            }
            for(let i=0; i<this.battleGeneralArr_copy.length;++i){    //出战敌方部曲（和士兵） ，注意，战斗中使用的是拷贝数据
                let cardInfo:CardInfo = this.battleGeneralArr_copy[i].clone();
                this.battleGeneralArr.push(cardInfo);
                if(cardInfo.generalInfo.fightHp >  this.maxFightHp){
                    this.maxFightHp = cardInfo.generalInfo.fightHp   //战斗卡牌最大血量，用于进度条显示
                }
                if(cardInfo.generalInfo.bingCount >  this.maxFightBingCount){
                    this.maxFightBingCount = cardInfo.generalInfo.bingCount   //战斗卡牌最大士兵数量，用于进度条显示
                }
            }
        }
    }

    /**获取战斗场景 */
    getFightScene(): FightScene {
        let fightScene: FightScene = null;
        let layer = cc.director.getScene().getChildByName("Canvas");
        if (layer != null) {
            fightScene = layer.getComponent(FightScene);
        }
        return fightScene;
    }

    /**设置敌我中间砖块范围数组*/
    addBlockToBound(block: Block, blockType:number){  //地块类型， 0中间地带，1我方范围，2敌方范围
        if(blockType == 1){
            this.myBoundBlockArr.push(block);   //我方范围内的砖块
        }else if(blockType == 2){
            this.enemyBoundBlockArr.push(block);   //敌方范围内的砖块
        }else{
            this.midBoundBlockArr.push(block);   //中间缓存地带的砖块
        }

        return null;
    }

    /**初始化双方武将初始布局 */
    initGeneralToBlock(){
        this.initGeneralToBlockByCamp(this.battleEnemyArr, this.enemyBoundBlockArr);  //出战敌方部曲（和士兵）
        this.initGeneralToBlockByCamp(this.battleGeneralArr, this.myBoundBlockArr);  //出战我方部曲
    }
    initGeneralToBlockByCamp(cardArr: CardInfo[], boundBlockArr: Block[]){
        for(let i=0; i<cardArr.length;++i){  
            let cardInfo:CardInfo = cardArr[i];
            if(cardInfo){
                if(cardInfo.type == CardType.Chief){  //类型，0普通，1主将，2前锋，3后卫
                    for(let b=0; b<boundBlockArr.length;++b){   
                        let block: Block = boundBlockArr[b];
                        if(block && block.buildType == BlockBuildType.Barracks){ //营寨
                            block.showBlockCard(cardInfo);  //显示地块上卡牌
                            break;
                        }
                    }
                }else if(cardInfo.type == CardType.Forward){  //前锋
                    for(let b=0; b<boundBlockArr.length;++b){   
                        let block: Block = boundBlockArr[b];
                        if(block && block.cardNode == null && block.buildType == BlockBuildType.Watchtower){ //箭楼
                            block.showBlockCard(cardInfo);  //显示地块上卡牌
                            break;
                        }
                    }
                }else if(cardInfo.type == CardType.Guard){  //后卫
                    for(let b=0; b<boundBlockArr.length;++b){   
                        let block: Block = boundBlockArr[b];
                        if(block && block.buildType == BlockBuildType.Granary){ //粮仓
                            block.showBlockCard(cardInfo);  //显示地块上卡牌
                            break;
                        }
                    }
                }else{
                    //3侧卫随机存放敌范围到非（1主将+2前锋+1后卫）的砖块上
                    let offRand = 0.2;
                    let bSet = false;
                    for(let b=0; b<boundBlockArr.length;++b){   
                        let block: Block = boundBlockArr[b];
                        if(block && block.cardNode == null && block.buildType == BlockBuildType.None){ 
                            let rand = Math.random() + offRand;
                            if(rand > 0.8){
                                bSet = true;
                                block.showBlockCard(cardInfo);  //显示地块上卡牌
                                break;
                            }else{
                                offRand += 0.3;
                            }
                        }
                    }
                    if(bSet != true){   //很不幸，第一次没有随机存放，第二次遇到空位即存放
                        for(let b=0; b<boundBlockArr.length;++b){   
                            let block: Block = boundBlockArr[b];
                            if(block && block.cardNode == null && block.buildType == BlockBuildType.None){ 
                                block.showBlockCard(cardInfo);  //显示地块上卡牌
                                break;
                            }
                        }
                    }
                }

            }
        }
    }

    /** 检测两个砖块之间的AI战斗联系 block_src为检测源，block_tar为周边砖块*/
    checkBlocksRelation_AI(block_src: Block, block_tar: Block){
        let abs_Row = Math.abs(block_src.blockRow - block_tar.blockRow);
        let abs_Col = Math.abs(block_src.blockColumn - block_tar.blockColumn);
        if(block_src.cardNode == null || abs_Row > 2 || abs_Col > 2){  //地块行 Row 列 Column
            return BlockRelation.None;  //砖块之间的AI战斗联系 0无（距离远） 1可移动范围内  2攻击范围内 3可移动可攻击  4中间有阻碍
        }else{
            let bingzhong = block_src.getBlockBingzhong();     //作战兵种 401骑兵402刀兵403枪兵404弓兵
            // cc.log("srcId: "+block_src.blockId+"; tarId: "+block_tar.blockId)
            // cc.log("abs_Row: "+abs_Row+"; abs_Col: "+abs_Col+"; bingzhong = "+bingzhong)
            if(bingzhong == SoliderType.qibing){ //骑兵四方向前进两格，四方向攻击一格；
                if(abs_Row == 0){  //同行
                    if(abs_Col == 1){
                        return BlockRelation.ReachAndAtk;
                    }else if(abs_Col == 2){
                        let mid_Row = (block_src.blockRow + block_tar.blockRow)/2;
                        let mid_Col = (block_src.blockColumn + block_tar.blockColumn)/2;
                        let midBlock = this.getFightScene().getBlockById(mid_Row*this.cardsCol + mid_Col);  //通过指定的索引返回砖块
                        if(midBlock && midBlock.cardNode){  //中间有人
                            return BlockRelation.Obstruct; 
                        }else{
                            return BlockRelation.Reach;
                        }
                    }
                }else if(abs_Col == 0){  //同列
                    if(abs_Row == 1){
                        return BlockRelation.ReachAndAtk;
                    }else if(abs_Row == 2){
                        let mid_Row = (block_src.blockRow + block_tar.blockRow)/2;
                        let mid_Col = (block_src.blockColumn + block_tar.blockColumn)/2;
                        let midBlock = this.getFightScene().getBlockById(mid_Row*this.cardsCol + mid_Col);  //通过指定的索引返回砖块
                        if(midBlock && midBlock.cardNode){  //中间有人
                            return BlockRelation.Obstruct; 
                        }else{
                            return BlockRelation.Reach;
                        }
                    }
                }
            }else if(bingzhong == SoliderType.daobing){  //刀兵九方向前进一格，九方向攻击一格；
                if(abs_Row == 0){  //同行
                    if(abs_Col == 1){
                        return BlockRelation.ReachAndAtk;
                    }
                }else if(abs_Col == 0){  //同列
                    if(abs_Row == 1){
                        return BlockRelation.ReachAndAtk;
                    }
                }else if(abs_Row == 1){  //相邻行
                    if(abs_Col == 1){
                        return BlockRelation.ReachAndAtk;
                    }
                }else if(abs_Col == 1){  //相邻列
                    if(abs_Row == 1){
                        return BlockRelation.ReachAndAtk;
                    }
                }
            }else if(bingzhong == SoliderType.qiangbing){ //枪兵四方向前进一格，四方向攻击一格；
                if(abs_Row == 0){  //同行
                    if(abs_Col == 1){
                        return BlockRelation.ReachAndAtk;
                    }
                }else if(abs_Col == 0){  //同列
                    if(abs_Row == 1){
                        return BlockRelation.ReachAndAtk;
                    }
                }
            }else if(bingzhong == SoliderType.gongbing){  //弓兵九方向前进一格，九方向攻击一格，四方向攻击两格；
                if(abs_Row == 0){  //同行
                    if(abs_Col == 1){
                        return BlockRelation.ReachAndAtk;
                    }else if(abs_Col == 2){
                        return BlockRelation.Attack;
                    }
                }else if(abs_Col == 0){  //同列
                    if(abs_Row == 1){
                        return BlockRelation.ReachAndAtk;
                    }else if(abs_Row == 2){
                        return BlockRelation.Attack;
                    }
                }else if(abs_Row == 1){  //相邻行
                    if(abs_Col == 1){
                        return BlockRelation.ReachAndAtk;
                    }
                }else if(abs_Col == 1){  //相邻列
                    if(abs_Row == 1){
                        return BlockRelation.ReachAndAtk;
                    }
                }
            }else{
                cc.log("地块兵种异常")
            }
            return BlockRelation.None;   //0无（距离远）
        }
    }

    /**检测大营周边是否有对方部曲*/
    checkBarracksBlockIsDanger(campId:number){
        let tar_block = this.getFightScene().getBlockById(2); 
        if(campId == this.myCampId){
            tar_block = this.getFightScene().getBlockById(32); 
        }
        let otherBlockV2s = [
            cc.v2(tar_block.blockRow-1, tar_block.blockColumn), cc.v2(tar_block.blockRow+1, tar_block.blockColumn),
            cc.v2(tar_block.blockRow, tar_block.blockColumn-1), cc.v2(tar_block.blockRow, tar_block.blockColumn+1),
        ];
        for(let i=0; i<4; i++){
            let block_v2 = otherBlockV2s[i];
            if(block_v2.x < 0 || block_v2.y < 0){   //0非法砖块（边框外）
            }else{
                let tempBlock = this.getFightScene().getBlockById(block_v2.x*this.cardsCol + block_v2.y);  //通过指定的索引返回砖块
                if(tempBlock && tempBlock.cardNode){  //有人
                    if(tempBlock.getBlockCampId() != campId){
                        return true;   //有对方部曲
                    }
                }
            }
        }
        return false;  //暂无对方部曲
    }

    /** 检测指定砖块周边情况，并AutoAI处理。如包围士气变化，敌军下一步自动攻击预处理等*/
    checkBlocksRelation_AutoAtkAI(tar_block: Block){
        cc.log("checkBlocksRelation_AutoAtkAI 检测指定砖块周边情况，并AutoAI处理 tar_blockId = "+tar_block.blockId)
        if(tar_block.cardNode == null){
            return null;
        }
        let tarBlockCardInfo = tar_block.getBlockCardInfo();
        if(tarBlockCardInfo == null){
            return null;
        }

        //------------- 1、检测地块卡牌周边敌对攻击接触情况  ----------------
        let otherBlocks: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];   
        //0-3前后左右，4-7左前右前左后右后，8-11两格前后左右 卡牌情况 0非法砖块（边框外） 1空砖块 2队友 3对方空建筑 4己方空建筑 5对角或两格不处理，obj对方卡牌砖块
        let otherBlockV2s = [
            cc.v2(tar_block.blockRow-1, tar_block.blockColumn), cc.v2(tar_block.blockRow+1, tar_block.blockColumn),
            cc.v2(tar_block.blockRow, tar_block.blockColumn-1), cc.v2(tar_block.blockRow, tar_block.blockColumn+1),
            cc.v2(tar_block.blockRow-1, tar_block.blockColumn-1), cc.v2(tar_block.blockRow-1, tar_block.blockColumn+1),
            cc.v2(tar_block.blockRow+1, tar_block.blockColumn-1), cc.v2(tar_block.blockRow+1, tar_block.blockColumn+1),
            cc.v2(tar_block.blockRow-2, tar_block.blockColumn), cc.v2(tar_block.blockRow+2, tar_block.blockColumn),
            cc.v2(tar_block.blockRow, tar_block.blockColumn-2), cc.v2(tar_block.blockRow, tar_block.blockColumn+2),
        ];

        //空建筑用于后续AI算法使用
        let otherEmptyBuildBlock: Block = null;  //3对方空建筑
        let myselfEmptyBuildBlock: Block = null;  //4我方空建筑

        let surroundOtherCount = 0;   //前后左右对方部曲数量
        let surroundBlockCount = 0;   //前后左右地块数量
        for(let idx=0; idx<12; idx++){
            let block_v2 = otherBlockV2s[idx];
            //cc.log(" idx = "+idx+"; block_v2 = "+block_v2)
            if(block_v2.x < 0 || block_v2.x > this.cardsRow-1 || block_v2.y < 0 || block_v2.y > this.cardsCol-1){ 
                otherBlocks[idx] = 0;  //0非法砖块（边框外）
            }else{
                let tempBlock: Block = null;
                let bingzhong = tar_block.getBlockBingzhong();     //作战兵种 401骑兵402刀兵403枪兵404弓兵
                if(idx>=8){ 
                    if(bingzhong == SoliderType.qibing || bingzhong == SoliderType.gongbing){
                        //骑兵四方向前进两格，四方向攻击一格； //弓兵九方向前进一格，九方向攻击一格，四方向攻击两格；
                        tempBlock = this.getFightScene().getBlockById(block_v2.x*this.cardsCol + block_v2.y);  //通过指定的索引返回砖块
                    }else{
                        otherBlocks[idx] = 5;  //5对角或两格不处理
                    }
                }else if(idx<4){
                    tempBlock = this.getFightScene().getBlockById(block_v2.x*this.cardsCol + block_v2.y);  //通过指定的索引返回砖块
                }else{
                    if(bingzhong == SoliderType.daobing || bingzhong == SoliderType.gongbing){
                        //刀兵九方向前进一格，九方向攻击一格； //弓兵九方向前进一格，九方向攻击一格，四方向攻击两格；
                        tempBlock = this.getFightScene().getBlockById(block_v2.x*this.cardsCol + block_v2.y);  //通过指定的索引返回砖块
                    }else{
                        otherBlocks[idx] = 5;  //5对角或两格不处理
                    }
                }
                if(tempBlock){
                    if(idx < 4){
                        surroundBlockCount ++;   //前后左右对方地块数量
                    }
                    if(tempBlock.cardNode){
                        if(tempBlock.getBlockCampId() != tar_block.getBlockCampId()){   //不同阵营
                            otherBlocks[idx] = tempBlock;  //obj对方卡牌砖块
                            if(idx < 4){
                                surroundOtherCount ++;   //前后左右对方部曲数量
                            }
                        }else{
                            otherBlocks[idx] = 2;  //2队友
                        }
                    }else{
                        if(idx < 4){
                            otherBlocks[idx] = tempBlock.checkBuildRelationByCard(tar_block.getBlockCampId());   //1空砖块 3对方空建筑 4己方空建筑
                            //空建筑用于后续AI算法使用
                            if(otherBlocks[idx]  == 4 ){
                                myselfEmptyBuildBlock = tempBlock; 
                            }else if(otherBlocks[idx] == 3){
                                otherEmptyBuildBlock = tempBlock; 
                            }
                        }else{
                            otherBlocks[idx] = 1; 
                        }
                    }
                }
            }
        }
        cc.log("包围状态 tar_blockId = "+tar_block.blockId+"; surroundBlockCount = "+surroundBlockCount+"; surroundOtherCount = "+surroundOtherCount)
        if(surroundOtherCount >=3){
            if(surroundBlockCount - surroundOtherCount == 0){
                ROOT_NODE.showTipsText("置之死地，士气+2")
                tar_block.changeCardShiqi(2, true)   //置之死地，士气+2
            }else if(surroundBlockCount - surroundOtherCount == 1){
                ROOT_NODE.showTipsText("围三缺一，士气-2")
                tar_block.changeCardShiqi(-2, true)   //围三缺一，士气-2
            }
        }else if(surroundOtherCount == 2){
            if(((typeof(otherBlocks[0]) == "object") && (typeof(otherBlocks[1]) == "object")) 
                || ((typeof(otherBlocks[2]) == "object") && (typeof(otherBlocks[3]) == "object")))
            {
                ROOT_NODE.showTipsText("双向夹击，士气-1")
                tar_block.changeCardShiqi(-1, true)   //前后或左右夹击，士气-1
            }
        }
        
        //  ---------------- 以下为自动AI预处理结果  ---------------------
        cc.log("this.bMyRound = "+this.bMyRound+"; FightMgr.EnemyAutoAi = "+FightMgr.EnemyAutoAi)
        if(tarBlockCardInfo.campId == this.myCampId){
            cc.log("我方武将部曲不参与AutoAI, tar_blockId = "+tar_block.blockId)
            return;
        }else if(this.bMyRound != true || FightMgr.EnemyAutoAi != true){ //当前敌方回合，下一回合我方回合  //敌方自动AI（关闭）
            cc.log("当前敌方回合，下一回合我方回合 或 敌方自动AI（关闭）")
            this.EnemyAIResult = null;   //敌方AI返回结果
            return;
        }
        let bNextAuto:boolean = true;  //是否继续后续大步AI检测

        // --------------- 2.1、抢占对方空建筑 -------------------
        if(otherEmptyBuildBlock){  //对方空建筑
            cc.log("抢占对方空建筑")
            let aiResult: EnemyAIResult = new EnemyAIResult(110, tar_block, otherEmptyBuildBlock)
            this.updateEnemyAutoAIResult(aiResult);  //保存下回合前的敌方卡牌AutoAI预处理结果
            bNextAuto = false;  //是否继续后续大步AI检测
        }

        let killedBlock:any = {atkInfo:null, destBlock:null, sortPar: 0};   //保留最高攻击记录，以供以后随机攻击使用
        cc.log("检测地块卡牌一击必杀情况 ")
        //0-3前后左右，4-7左前右前左后右后，8-11两格前后左右 卡牌情况 0非法砖块（边框外） 1空砖块 2队友 3对方空建筑 4己方空建筑 5对角或两格不处理，obj对方卡牌砖块
        for(let i=0; i<12; i++){
            //------------- 2.2、检测地块卡牌一击必杀情况  ----------------
            if((typeof(otherBlocks[i]) == "object")){
                let tempBlock = <Block>otherBlocks[i];
                let otherBlockCardInfo:CardInfo = tempBlock.getBlockCardInfo();
                if(otherBlockCardInfo && otherBlockCardInfo.generalInfo){
                    let atkInfo:AttackResult = this.handleAttackOpt(tarBlockCardInfo, otherBlockCardInfo, tar_block.buildType, tempBlock.buildType, false);  //预计算攻击伤害
                    cc.log("击杀预判结果 atkInfo = "+JSON.stringify(atkInfo))
                    let residueHp = atkInfo.atkHp - otherBlockCardInfo.generalInfo.fightHp
                    let residueBing = atkInfo.killCount - otherBlockCardInfo.generalInfo.bingCount;
                    if(residueHp >= 0){
                        if(otherBlockCardInfo.type == CardType.Chief){  //类型，0普通，1主将，2前锋，3后卫
                            cc.log("一击必杀对方主将")
                            let aiResult: EnemyAIResult = new EnemyAIResult(150, tar_block, tempBlock)
                            this.updateEnemyAutoAIResult(aiResult);  //保存下回合前的敌方卡牌AutoAI预处理结果
                            bNextAuto = false;  //是否继续后续大步AI检测
                            return;
                        }
                        cc.log("一击必杀对方")
                        let aiWeight = 100 + Math.ceil(residueHp/10)
                        let aiResult: EnemyAIResult = new EnemyAIResult(aiWeight, tar_block, tempBlock)
                        this.updateEnemyAutoAIResult(aiResult);  //保存下回合前的敌方卡牌AutoAI预处理结果
                        bNextAuto = false;  //是否继续后续大步AI检测
                    }else if(residueBing >= 100){
                        if(otherBlockCardInfo.type == CardType.Chief){  //类型，0普通，1主将，2前锋，3后卫
                            cc.log("一击必杀对方主将部曲")
                            let aiResult: EnemyAIResult = new EnemyAIResult(150, tar_block, tempBlock)
                            this.updateEnemyAutoAIResult(aiResult);  //保存下回合前的敌方卡牌AutoAI预处理结果
                            bNextAuto = false;  //是否继续后续大步AI检测
                            return;
                        }
                        cc.log("一击必杀对方部曲")
                        let aiWeight = 100 + Math.ceil(residueBing/10)
                        let aiResult: EnemyAIResult = new EnemyAIResult(aiWeight, tar_block, tempBlock)
                        this.updateEnemyAutoAIResult(aiResult);  //保存下回合前的敌方卡牌AutoAI预处理结果
                        bNextAuto = false;  //是否继续后续大步AI检测
                    }
    
                    //保留最高攻击记录，以供以后随机攻击使用
                    let sortPar = atkInfo.atkHp*0.4 + atkInfo.killCount*0.6;
                    if(tar_block.buildType != BlockBuildType.Barracks){  //建筑类型  0无，1营寨，2箭楼, 3粮仓)
                        sortPar *= 0.8;
                    }
                    if(killedBlock.atkInfo == null){
                        killedBlock.atkInfo = atkInfo
                        killedBlock.destBlock = tempBlock
                        killedBlock.sortPar = sortPar
                    }else{
                        if(sortPar > killedBlock.sortPar){
                            killedBlock.atkInfo = atkInfo
                            killedBlock.destBlock = tempBlock
                            killedBlock.sortPar = sortPar
                        }
                    } 
                }

                //--------------  2.3、检测是否可以攻击对方大营   -------------------
                if(tempBlock.buildNode.active && tempBlock.buildType == BlockBuildType.Barracks){   //建筑类型  0无，1营寨，2箭楼, 3粮仓
                    if(tempBlock.blockType == tarBlockCardInfo.campId){   //地块类型， 0中间地带，1我方范围，2敌方范围
                        //己方建筑
                    }else{  //对方大营
                        cc.log("攻击对方大营")
                        let aiResult: EnemyAIResult = new EnemyAIResult(90, tar_block, tempBlock)
                        this.updateEnemyAutoAIResult(aiResult);  //保存下回合前的敌方卡牌AutoAI预处理结果
                        bNextAuto = false;  //是否继续后续大步AI检测
                    }
                }
            }
        }
        if(bNextAuto != true){   //是否继续后续大步AI检测
            return;
        }

        //--------------  3、检测己方大营四方是否有对手，有则最近非驻守部曲回防大营   -------------------
        if(tar_block.isGarrisonBlock() == 0){  //是否驻守卡牌地块
            if(this.checkBarracksBlockIsDanger(tarBlockCardInfo.campId)){  //检测大营周边是否有对方部曲
                //0-3前后左右，4-7左前右前左后右后，8-11两格前后左右 卡牌情况 0非法砖块（边框外） 1空砖块 2队友 3对方空建筑 4己方空建筑 5对角或两格不处理，obj对方卡牌砖块
                for(let i=0; i<12; i++){
                    if((typeof(otherBlocks[i]) == "number")){
                        if(otherBlocks[i] == 1 || otherBlocks[i] == 3 || otherBlocks[i] == 4){
                            let row = 0;
                            let col = 2;
                            if(tarBlockCardInfo.campId == this.myCampId){
                                row = this.cardsRow - 1;
                            }
                            let moveStep = Math.floor(Math.abs(tar_block.blockRow-row) + Math.abs(tar_block.blockColumn-col)/2)
                            let aiWeight = Math.max(70, 89-moveStep)
                            cc.log("最近非驻守部曲回防大营")
                            let block_v2 = otherBlockV2s[i];
                            let destBlock = this.getFightScene().getBlockById(block_v2.x*this.cardsCol + block_v2.y);  //通过指定的索引返回砖块
                            let aiResult: EnemyAIResult = new EnemyAIResult(aiWeight, tar_block, destBlock)
                            this.updateEnemyAutoAIResult(aiResult);  //保存下回合前的敌方卡牌AutoAI预处理结果
                            bNextAuto = false;  //是否继续后续大步AI检测
                            break;
                        }
                    }
                }
            }
        }else{
            cc.log("大营安全 或 砖块驻守不能回防大营  tar_blockId = "+tar_block.blockId)
        }
        if(bNextAuto != true){   //是否继续后续大步AI检测
            return;
        }

        // ------------------------ 4 围三缺一 夹击 情况下 脱离包围 -----------------
        if(tar_block.isGarrisonBlock() == 0){  //是否驻守卡牌地块
            let bSuround:boolean = false;  //是否被包围
            if(surroundBlockCount >=3 ){
                if(surroundBlockCount - surroundOtherCount == 0){     //置之死地，士气+2
                }else if(surroundBlockCount - surroundOtherCount == 1){  //围三缺一，士气-2
                    bSuround = true;
                }
            }else if(surroundOtherCount == 2){
                if(((typeof(otherBlocks[0]) == "object") && (typeof(otherBlocks[1]) == "object")) 
                    || ((typeof(otherBlocks[2]) == "object") && (typeof(otherBlocks[3]) == "object")))
                {  //前后或左右夹击，士气-1
                    bSuround = true;
                }
            }
            if(bSuround){
                //0-3前后左右，4-7左前右前左后右后，8-11两格前后左右 卡牌情况 0非法砖块（边框外） 1空砖块 2队友 3对方空建筑 4己方空建筑 5对角或两格不处理，obj对方卡牌砖块
                for(let i=0; i<12; i++){
                    if((typeof(otherBlocks[i]) == "number")){
                        if(otherBlocks[i] == 1 || otherBlocks[i] == 3 || otherBlocks[i] == 4){
                            cc.log("围三缺一 夹击 情况下 脱离包围")
                            let block_v2 = otherBlockV2s[i];
                            let destBlock = this.getFightScene().getBlockById(block_v2.x*this.cardsCol + block_v2.y);  //通过指定的索引返回砖块
                            let aiResult: EnemyAIResult = new EnemyAIResult(60, tar_block, destBlock)
                            this.updateEnemyAutoAIResult(aiResult);  //保存下回合前的敌方卡牌AutoAI预处理结果
                            bNextAuto = false;  //是否继续后续大步AI检测
                            break;
                        }
                    }
                }
            }
        }else{
            cc.log("砖块未被包围 或 砖块驻守不能脱离包围 tar_blockId = "+tar_block.blockId)
        }
        if(bNextAuto != true){   //是否继续后续大步AI检测
            return;
        }

        // ------------------------ 5 接触攻击 已经攻入对方本阵范围概率高 -----------------
        if(killedBlock && killedBlock.destBlock){  //前面的保留最高攻击记录，以供以后随机攻击使用
            cc.log("接触攻击 已经攻入对方本阵范围概率高 killedBlock.destBlock.blockId = "+killedBlock.destBlock.blockId)
            let aiWeight = 50;
            if(this.isInOtherBlockBound(tar_block)){ //检测是否已经攻入对方本阵范围
                aiWeight = 55;
            }
            let aiResult: EnemyAIResult = new EnemyAIResult(aiWeight, tar_block, killedBlock.destBlock)
            this.updateEnemyAutoAIResult(aiResult);  //保存下回合前的敌方卡牌AutoAI预处理结果
            bNextAuto = false;  //是否继续后续大步AI检测
        }
        if(bNextAuto != true){   //是否继续后续大步AI检测
            return;
        }

        // ------------------------ 6 随机移动-----------------
        if(tar_block.isGarrisonBlock() == 0){  //是否驻守卡牌地块
            //0-3前后左右，4-7左前右前左后右后，8-11两格前后左右 卡牌情况 0非法砖块（边框外） 1空砖块 2队友 3对方空建筑 4己方空建筑 5对角或两格不处理，obj对方卡牌砖块
            for(let i=0; i<12; i++){
                if((typeof(otherBlocks[i]) == "number")){
                    if(otherBlocks[i] == 1 || otherBlocks[i] == 3 || otherBlocks[i] == 4){
                        cc.log("随机移动")
                        let block_v2 = otherBlockV2s[i];
                        let destBlock = this.getFightScene().getBlockById(block_v2.x*this.cardsCol + block_v2.y);  //通过指定的索引返回砖块
                        let aiResult: EnemyAIResult = new EnemyAIResult(40, tar_block, destBlock)
                        this.updateEnemyAutoAIResult(aiResult);  //保存下回合前的敌方卡牌AutoAI预处理结果
                        bNextAuto = false;  //是否继续后续大步AI检测
                        break;
                    }
                }
            }
        }else{
            cc.log("砖块驻守不能随机移动 tar_blockId = "+tar_block.blockId)
            // ------------------------ 7 驻守部曲随机概率随机移动-----------------
            if(tar_block.buildType != BlockBuildType.Barracks && Math.random() > 0.7){  //是否驻守卡牌地块  //建筑类型  0无，1营寨，2箭楼, 3粮仓
                //0-3前后左右，4-7左前右前左后右后，8-11两格前后左右 卡牌情况 0非法砖块（边框外） 1空砖块 2队友 3对方空建筑 4己方空建筑 5对角或两格不处理，obj对方卡牌砖块
                for(let i=0; i<12; i++){
                    if((typeof(otherBlocks[i]) == "number") && !( i == 0 || i == 4 || i== 5 || i == 8)){
                        if(otherBlocks[i] == 1 || otherBlocks[i] == 3 || otherBlocks[i] == 4){
                            cc.log("驻守部曲随机概率随机移动")
                            let block_v2 = otherBlockV2s[i];
                            let destBlock = this.getFightScene().getBlockById(block_v2.x*this.cardsCol + block_v2.y);  //通过指定的索引返回砖块
                            let aiResult: EnemyAIResult = new EnemyAIResult(30, tar_block, destBlock)
                            this.updateEnemyAutoAIResult(aiResult);  //保存下回合前的敌方卡牌AutoAI预处理结果
                            bNextAuto = false;  //是否继续后续大步AI检测
                            return;
                        }
                    }
                }
            }
        }

        //   --------------  8 autoAI无结果
        cc.log("autoAI无结果 tar_blockId = "+tar_block.blockId)
    }

    /**检测是否已经攻入对方本阵范围*/
    isInOtherBlockBound(tar_block:Block){
        let tarBlockCardInfo = tar_block.getBlockCardInfo();
        if(tarBlockCardInfo){
            if(tarBlockCardInfo.campId == this.myCampId){   //我方卡牌
                if(tar_block.blockRow < 2){
                    return true;
                }
            }else{
                if(tar_block.blockRow >= this.cardsRow - 2){
                    return true;
                }
            }
        }
        return false;
    }

    /** 保存下回合前的敌方卡牌AutoAI预处理结果 */
    updateEnemyAutoAIResult(aiResult: EnemyAIResult){
        cc.log("updateEnemyAutoAIResult aiResult.aiWeight = "+aiResult.aiWeight+"; destBlock = "+aiResult.destBlock+"; srcBlock = "+aiResult.destBlock)
        if(aiResult == null || aiResult.aiWeight == 0 || aiResult.destBlock == null || aiResult.srcBlock == null){
            return;
        }
        if(this.EnemyAIResult == null){   //敌方AI返回结果
            this.EnemyAIResult = aiResult;
        }else if(aiResult.aiWeight > this.EnemyAIResult.aiWeight){
            this.EnemyAIResult = aiResult;
        }
    }

    /**兵种相克 */
    checkBingRestriction(srcType: SoliderType, destType: SoliderType){  
        //兵种相克，401骑兵克制402刀兵， 402刀兵克制403枪兵，403枪兵克制401骑兵， 404弓兵为不克制兵种
        if(srcType == SoliderType.qibing){
            if(destType == SoliderType.daobing){
                return 1;
            }else if(destType == SoliderType.qiangbing){
                return -1;
            }
        }else if(srcType == SoliderType.daobing){
            if(destType == SoliderType.qiangbing){
                return 1;
            }else if(destType == SoliderType.qibing){
                return -1;
            }
        }else if(srcType == SoliderType.qiangbing){
            if(destType == SoliderType.qibing){
                return 1;
            }else if(destType == SoliderType.daobing){
                return -1;
            }
        }
        return 0;
    }

    /** 预计算攻击伤害*/
    handleAttackOpt(atkCard:CardInfo, defCard:CardInfo, atkBuild:BlockBuildType, defBuild:BlockBuildType, bBeatBack:boolean = true): AttackResult{
        let atkResult = new AttackResult();
        if(atkCard == null || defCard == null){
            cc.log("handleAttackOpt 卡牌有误")
            return atkResult;
        }
        if(atkCard.campId == defCard.campId ){
            cc.log("handleAttackOpt 异常， 同阵营攻击")
            return atkResult;
        }
        if(atkCard.generalInfo == null || defCard.generalInfo == null){
            cc.log("handleAttackOpt 武将信息有误")
            return atkResult;
        }

        let atk_bing = CfgMgr.getGeneralConf(atkCard.bingzhong.toString());
        let def_bing = CfgMgr.getGeneralConf(defCard.bingzhong.toString());
        if(atkCard == null || defCard == null){
            cc.log("handleAttackOpt 兵种配置有误")
            return atkResult;
        }
        // cc.log("atkCard.generalInfo = "+JSON.stringify(atkCard.generalInfo))
        // cc.log("atk_bing = "+JSON.stringify(atk_bing))
        // cc.log("defCard.generalInfo = "+JSON.stringify(defCard.generalInfo))
        // cc.log("def_bing = "+JSON.stringify(def_bing))

        let atkSkillScale = 1.0;   //攻击方技能提升的攻击倍率
        let defSkillScale = 1.0;   //攻击方技能降低的对方防御倍率
        //技能随机触发
        let attackVal = 0;
        if(atkCard.generalInfo.generalId.length >= 4){
            attackVal = (atkCard.generalInfo.fightAtk + atk_bing.atk * atkCard.generalInfo.bingCount/1000)*atkSkillScale;
        }else{
            attackVal = atk_bing.atk * atkCard.generalInfo.bingCount/1000;
        }
        if(this.checkBingRestriction(atkCard.bingzhong, defCard.bingzhong) > 0){  //兵种相克
            cc.log("兵种相克，攻击力增加20%！")
            attackVal *= 1.2;   //兵种相克，攻击力提升20%
        }
        if(atkBuild == BlockBuildType.Watchtower){   //建筑类型  0无，1营寨，2箭楼, 3粮仓
            cc.log("箭塔辅助，攻击力增加20%！")
            attackVal *= 1.2;    //箭塔辅助，攻击力增加20%
        }
        let defVal = 0
        if(defCard.generalInfo.generalId.length >= 4){
            defVal = (defCard.generalInfo.fightDef + def_bing.def * defCard.generalInfo.bingCount/1000)*defSkillScale*(defCard.shiqi/100);
        }else{
            defVal = (def_bing.def * defCard.generalInfo.bingCount/1000)*defSkillScale*(defCard.shiqi/100);
            defVal = defVal * (Math.random()*0.5 + 0.5);  //无武将的部曲防御力在0.5-1.0之间随机
        }
        if(defBuild == BlockBuildType.Barracks){   //建筑类型  0无，1营寨，2箭楼, 3粮仓
            cc.log("营寨辅助，防御力增加30%！")
            defVal *= 1.3;    //营寨辅助，防御力增加30%
        }else if(defBuild == BlockBuildType.Granary){   //建筑类型  0无，1营寨，2箭楼, 3粮仓
            cc.log("粮仓辅助，防御力增加20%！")
            defVal *= 1.2;    //粮仓辅助，防御力增加20%
        }

        if(attackVal <= defVal){
            cc.log("不破防")
            atkResult.usedMp = 0;  //攻击过程使用技能，使用的智力值
            atkResult.killCount = 10;  //攻击造成的对方部曲士兵死亡数量
        }else{
            //有效攻击 =  攻击士气倍率 *（（攻击武将攻击力+部曲士兵攻击力）*攻击武将技能攻击倍率 - （防守武将防御力+部曲士兵防御力）*攻击武将技能防御倍率*防守士气倍率 ）
            let atkRealVal = Math.floor((attackVal - defVal)*(atkCard.shiqi/100));
            atkResult.atkVal = atkRealVal;  //攻击方的净攻击力
            atkResult.usedMp = 0;  //攻击过程使用技能，使用的智力值
            atkResult.atkHp = Math.ceil(atkRealVal/2);   //攻击导致对方损失的武将血量  //有效攻击的50%直接作用武将血量减少
            atkResult.killCount = Math.ceil(atkRealVal*1000/def_bing.hp);  //攻击造成的对方部曲士兵死亡数量
        }

        //bBeatBack=true反击多为autoAi计算使用，故反击不计技能、兵种、及建筑加成。
        if(bBeatBack){   //有反击
            //-------------- 防守反击处理 ----------------
            if(defCard.bingzhong != SoliderType.gongbing){   //对方不是弓兵部曲
                if(atkCard.bingzhong == SoliderType.gongbing || defCard.generalInfo.generalId.length < 4){   //弓兵攻击无反击  //防守方为纯士兵部曲，无反击
                    return atkResult;
                }
            }

            //反击不可触发技能
            let beatBackAtk = 0;
            if(defCard.generalInfo.generalId.length >= 4){
                beatBackAtk = (defCard.generalInfo.fightAtk + def_bing.atk * defCard.generalInfo.bingCount/1000)*(defCard.shiqi/100);
            }
            //反击不加成兵种相克
            // if(this.checkBingRestriction(defCard.bingzhong, atkCard.bingzhong) > 0){  //兵种相克
            //     beatBackAtk *= 1.2;   //兵种相克，攻击力提升20%
            // }
            let beatBackDef = 0;
            if(atkCard.generalInfo.generalId.length >= 4){
                beatBackDef = (atkCard.generalInfo.fightDef + atk_bing.def * atkCard.generalInfo.bingCount/1000);
            }else{
                beatBackDef = atk_bing.def * atkCard.generalInfo.bingCount/1000;
                beatBackDef = beatBackDef * (Math.random()*0.5 + 0.5);  //无武将的部曲防御力在0.5-1.0之间随机
            }

            if(beatBackAtk <= beatBackDef){
                cc.log("反击不破防")
            }else{
                //有效反击 = 防守士气倍率 *（（防守武将攻击力+部曲士兵攻击力）*防守士气倍率 - （攻击武将防御力+部曲士兵防御力））
                let beatBackRealAtk = Math.floor((beatBackAtk - beatBackDef)*(defCard.shiqi/100));
                atkResult.beatBackVal = beatBackRealAtk; //对方反击的反击攻击力
                atkResult.beatBackHp = Math.ceil(beatBackAtk/2);  //对方还击对攻击方造成的武将损失血量  //有效攻击的50%直接作用武将血量减少
                atkResult.beadBackCount = Math.ceil(beatBackAtk*1000/atk_bing.hp);  //对方还击对攻击方造成的部曲士兵损失量
            }
        }
        return atkResult;
    }


    /**显示战斗详情界面 */
    showFightDetailLayer(atkBlock: Block, defBlock: Block, callback:Function){
        // let layer = FightMgr.showLayer(FightMgr.getFightScene().pfFightShow);
        // layer.y += 100;
        // layer.getComponent(FightShow).initFightShowData(nType, srcBlock, this);
        this.handleAttackAndNoShow(atkBlock, defBlock, callback);
    }

    /**无展示攻击 */
    handleAttackAndNoShow(atkBlock: Block, defBlock: Block, callback:Function){
        let atkCardInfo = atkBlock.getBlockCardInfo();
        let defCardInfo = defBlock.getBlockCardInfo();
        if(!atkCardInfo || !defCardInfo){
            cc.log("handleAttackAndNoShow 攻击卡牌或防御卡牌数据有误")
            return;
        }

        let bBeatBack:boolean = true
        if(defCardInfo.bingzhong != SoliderType.gongbing){   //对方不是弓兵部曲
            if(atkCardInfo.bingzhong == SoliderType.gongbing || defCardInfo.generalInfo.generalId.length < 4){   //弓兵攻击无反击  //防守方为纯士兵部曲，无反击
                bBeatBack = false;
            }
        }

        let atkInfo:AttackResult = this.handleAttackOpt(atkCardInfo, defCardInfo, atkBlock.buildType, defBlock.buildType, bBeatBack);  //预计算攻击伤害
        cc.log("handleAttackAndNoShow 无展示攻击 atkInfo = "+JSON.stringify(atkInfo))
        //攻击
        let defGeneralHp = defCardInfo.generalInfo.fightHp - atkInfo.atkHp;
        if(defGeneralHp < 0){
            defGeneralHp = 0;
            defCardInfo.state = CardState.Dead;   //武将死亡
        }
        defCardInfo.generalInfo.fightHp = defGeneralHp;

        let defBingCount = defCardInfo.generalInfo.bingCount - atkInfo.killCount;
        if(defBingCount < 0){
            defBingCount = 0;
        }
        if(defBingCount < 100){
            defCardInfo.state = CardState.Flee;   //部曲逃逸(部曲士兵数量过少<100)
        }
        defCardInfo.generalInfo.bingCount = defBingCount;
        atkCardInfo.killCount += atkInfo.killCount; //杀敌（士兵）数量（战斗后会转换为经验）

        let atkGeneralMp = atkCardInfo.generalInfo.fightMp - atkInfo.usedMp;
        if(atkGeneralMp < 0){
            atkGeneralMp = 0;
        }
        atkCardInfo.generalInfo.fightMp = atkGeneralMp;
        
        ROOT_NODE.showTipsText(`攻击：${atkInfo.atkHp}，杀敌：${atkInfo.killCount}`)

        //反击
        //bBeatBack=true反击多为autoAi计算使用，故反击不计技能、兵种、及建筑加成。
        let atkGeneralHp = atkCardInfo.generalInfo.fightHp - atkInfo.beatBackHp;
        if(atkGeneralHp < 0){
            atkGeneralHp = 0;
            atkCardInfo.state = CardState.Dead;   //武将死亡
        }
        atkCardInfo.generalInfo.fightHp = atkGeneralHp;

        let atkBingCount = atkCardInfo.generalInfo.bingCount - atkInfo.beadBackCount;
        if(atkBingCount < 0){
            atkBingCount = 0;
        }
        if(atkBingCount < 100){
            atkCardInfo.state = CardState.Flee;   //部曲逃逸(部曲士兵数量过少<100)
        }
        atkCardInfo.generalInfo.bingCount = atkBingCount;
        defCardInfo.killCount += atkInfo.beadBackCount; //杀敌（士兵）数量（战斗后会转换为经验）

        ROOT_NODE.showTipsText(`反击：${atkInfo.beatBackHp}，反杀：${atkInfo.beadBackCount}`)

        if(callback){
            callback(atkCardInfo, defCardInfo);
        }

    }

    /**更新同步卡牌数据（战斗士气变动）*/
    handleUpdateBlockCardInfo(cardInfo: CardInfo){
        if(cardInfo.campId == this.myCampId){   //我方部曲卡牌
            for(let i=0; i<this.battleGeneralArr.length;++i){  
                if(cardInfo.cardIdStr == this.battleGeneralArr[i].cardIdStr){   //卡牌编号，用于定位 campId_generalId_bingzhong
                    //cc.log("我方卡牌变动 cardInfo = "+JSON.stringify(cardInfo))
                    //cc.log("卡牌原数据 this.battleGeneralArr[i] = "+JSON.stringify(this.battleGeneralArr[i]))
                    this.battleGeneralArr[i] = cardInfo;
                    this.getFightScene().handleUpdateBlockCardInfo(cardInfo.campId, i);
                    return;
                }
            }
        }else{  //敌方部曲卡牌
            for(let i=0; i<this.battleEnemyArr.length;++i){  
                if(cardInfo.cardIdStr == this.battleEnemyArr[i].cardIdStr){   //卡牌编号，用于定位 campId_generalId_bingzhong
                    //cc.log("敌方卡牌变动 cardInfo = "+JSON.stringify(cardInfo))
                    //cc.log("卡牌原数据 this.battleEnemyArr[i] = "+JSON.stringify(this.battleEnemyArr[i]))
                    this.battleEnemyArr[i] = cardInfo;
                    this.getFightScene().handleUpdateBlockCardInfo(cardInfo.campId, i);
                    return;
                }
            }
        }
    }

    // /** 因部曲（阵亡，逃逸，被俘） 检查是否游戏结束 */
    // checkGameOverByDead(deadCampId:number){
    //     if(this.GameFightOver > GameOverState.None){
    //         cc.log("游戏已经结束")
    //         return;
    //     }
    //     if(deadCampId == this.myCampId){   //我方部曲卡牌消亡
    //         let aliveCount = 0;   //还存活有效的部曲数量
    //         for(let i=0; i<this.battleGeneralArr.length;++i){  
    //             let state = this.battleGeneralArr[i].state
    //             if(state == CardState.Confusion || state == CardState.Dead || state == CardState.Flee || state == CardState.Prisoner){  //混乱，阵亡，逃逸，被俘
    //             }else{
    //                 aliveCount ++
    //                 return;
    //             }
    //         }
    //         if(aliveCount <= 0){
    //             NoticeMgr.emit(NoticeType.GameOverNotice, GameOverState.MyUnitLose);  //游戏结束通知
    //         }
    //     }else{  //敌方部曲卡牌消亡
    //         let aliveCount = 0;   //还存活有效的部曲数量
    //         for(let i=0; i<this.battleEnemyArr.length;++i){  
    //             let state = this.battleEnemyArr[i].state
    //             if(state == CardState.Confusion || state == CardState.Dead || state == CardState.Flee || state == CardState.Prisoner){  //混乱，阵亡，逃逸，被俘
    //             }else{
    //                 aliveCount ++
    //                 return;
    //             }
    //         }
    //         if(aliveCount <= 0){
    //             NoticeMgr.emit(NoticeType.GameOverNotice, GameOverState.EnemyUnitLose);  //游戏结束通知
    //         }
    //     }
    // }

    /** 游戏结束通知 */
    handleGameOverNotice(overState: GameOverState){
        this.GameFightOver = overState;  //战斗是否结束
        if(this.GameFightOver > GameOverState.None){
            if(overState >= GameOverState.EnemyChiefDead){   //我方胜利
                FightMgr.FightWin = true;  //战斗胜利或失败
            }else{
                FightMgr.FightWin = false;  //战斗胜利或失败
            }
        }
    }

    /**下回合处理 */
    nextRoundOpt(){
        cc.log("nextRoundOpt() 下回合处理, this.bMyRound = "+this.bMyRound);
        if(this.GameFightOver == GameOverState.None){
            this.EnemyAIResult = null;   //敌方AI返回结果
            this.fightRoundCount ++;   //战斗回合数
            if(this.fightRoundCount > this.MaxFightRouncCount){   //最大战斗回合
                ROOT_NODE.showTipsText("回合数已用完")
                NoticeMgr.emit(NoticeType.GameOverNotice, GameOverState.MyRoundOver);  //游戏结束通知
            }else{
                NoticeMgr.emit(NoticeType.PerNextRound, null);  //通知地块准备下一个回合(砖块接收到消息通知后，会AutoAI被围士气和AI攻击)
                if(this.bMyRound == true){
                    this.handleEnemyRoundOpt();   //敌方回合处理
                }else{
                    this.handleMyRoundOpt();   //我方回合处理
                }
            }
        }
    }

    /**我方回合处理 */
    handleMyRoundOpt(){
        cc.log("handleMyRoundOpt() 我方回合处理");
        this.bMyRound = true;
        this.bStopTouch = false;  //是否停止触摸反应
        this.getFightScene().showMyRoundDesc();
    }

    /**敌方回合处理 */
    handleEnemyRoundOpt(){
        cc.log("handleEnemyRoundOpt() 敌方回合处理");
        this.bMyRound = false;
        this.getFightScene().showEnemyRoundDesc();
        if(this.EnemyAutoAi == true){
            this.bStopTouch = true;  //是否停止触摸反应
            cc.log("敌方AI结果 this.EnemyAIResult = "+this.EnemyAIResult)
            if(this.EnemyAIResult){   //敌方AI返回结果
                if(this.EnemyAIResult.srcBlock){
                    this.EnemyAIResult.srcBlock.handleBlockAutoAIResult(this.EnemyAIResult.destBlock);
                }else{
                    cc.log("敌方AI返回结果 数据 异常 ");
                }
            }else{
                ROOT_NODE.showTipsText("敌方AutoAI结果：敌军全部原地驻守");
                this.nextRoundOpt();
            }
        }else{
            this.bStopTouch = false;  //是否停止触摸反应
        }
    }

    //--------------------------------------------以上为棋盘移动主要逻辑接口  --------------------


    // ----------------  以下为详情战斗逻辑的主要接口   -------------------
    


    

    /**从技能表中随机一个技能出来 */
    getRandomSkill(): SkillInfo{
        let keys = Object.getOwnPropertyNames(CfgMgr.C_skill_info);
        let idx = Math.floor(Math.random()*(keys.length-0.01));
        let skillId = parseInt(keys[idx]);
        return new SkillInfo(skillId)
    }




}
export var FightMgr = new FightManager();