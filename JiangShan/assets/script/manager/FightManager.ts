import Block from "../fight/block";
import FightScene from "../fight/fightScene";
import { ROOT_NODE } from "../login/rootNode";
import { CfgMgr, CityInfo, SkillInfo } from "./ConfigManager";
import { BlockBuildType, BlockRelation, CardInfo, CardType, EnemyAIResult, GameOverState, SoliderType } from "./Enum";
import { GameMgr } from "./GameManager";
import { NoticeMgr, NoticeType } from "./NoticeManager";


//战斗管理器
const {ccclass, property} = cc._decorator;

@ccclass
class FightManager { 
    battleEnemyArr: CardInfo[] = [];   //出战敌方部曲（和士兵），注意，战斗中使用的是拷贝数据
    battleGeneralArr: CardInfo[] = [];   //出战我方部曲， 注意，战斗中使用的是拷贝数据

    battleEnemyArr_copy: CardInfo[] = [];   //出战敌方部曲（和士兵），注意，战斗中使用的是拷贝数据
    battleGeneralArr_copy: CardInfo[] = [];   //出战我方部曲， 注意，战斗中使用的是拷贝数据

    midBoundBlockArr: Block[] = [];   //中间缓存地带的砖块
    myBoundBlockArr: Block[] = [];   //我方范围内的砖块
    enemyBoundBlockArr: Block[] = [];   //敌方范围内的砖块

    fightCityInfo: CityInfo = null;   //攻占的城池信息

    cardsRow: number = 7;  //行(横向) Row 列（纵向） Column
    cardsCol: number = 5; 

    MaxFightRouncCount: number = 50;  //最大战斗回合

    //------------ 以上数据重置时不需要重新赋值 ------------

    myCampId: number = 1;   //阵营，0默认，1蓝方(我方），2红方
    bStopTouch: boolean = false;   //是否停止触摸反应
    bMyRound: boolean = true;  //是否我方回合
    fightRoundCount: number = 0;   //战斗回合数

    GameFightOver: GameOverState = GameOverState.None;  //战斗是否结束
    FightWin: boolean = false;  //战斗胜利或失败
    EnemyAutoAi: boolean = true;  //敌方是否自动AI
    EnemyAutoAiCount: number = 0;   //敌方AI计数
    /**
     *  runAwayEnemy = null;    //敌方预逃走的单位
        runAwayWeight = 0;   //逃走权重
        hitEnemy = null;   //敌方出手的单位
        hitMy = null;    //我方预被击杀的单位
        hitWeight = 0;   //击杀权重
     */
    EnemyAIResult: EnemyAIResult = null;   //敌方AI返回结果

    //---------------------- 以下为方法接口 -------------------

    /**清除并初始化战斗数据，需要传递敌方武将数组和我方出战武将数组 */
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
        this.fightRoundCount = 0;   //战斗回合数

        this.GameFightOver = GameOverState.None;  //战斗是否结束
        this.FightWin = false;  //战斗胜利或失败
        this.EnemyAutoAi = true;  //敌方自动AI
        this.EnemyAutoAiCount = 0;   //敌方AI计数
        this.EnemyAIResult = null;   //敌方AI返回结果

        this.battleEnemyArr = [];   //出战敌方部曲（和士兵） ，注意，战斗中使用的是拷贝数据
        this.battleGeneralArr = [];   //出战我方部曲 ，注意，战斗中使用的是拷贝数据
        if(bReset){
            for(let i=0; i<this.battleEnemyArr_copy.length;++i){    //出战敌方部曲（和士兵） ，注意，战斗中使用的是拷贝数据
                this.battleEnemyArr.push(this.battleEnemyArr_copy[i].clone());
            }
            for(let i=0; i<this.battleGeneralArr_copy.length;++i){    //出战敌方部曲（和士兵） ，注意，战斗中使用的是拷贝数据
                this.battleGeneralArr.push(this.battleGeneralArr_copy[i].clone());
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
                        if(block && block.cardInfo == null && block.buildType == BlockBuildType.Watchtower){ //箭楼
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
                        if(block && block.cardInfo == null && block.buildType == BlockBuildType.None){ 
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
                            if(block && block.cardInfo == null && block.buildType == BlockBuildType.None){ 
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
        if(block_src.cardInfo == null || abs_Row > 2 || abs_Col > 2){  //地块行 Row 列 Column
            return BlockRelation.None;  //砖块之间的AI战斗联系 0无（距离远） 1可移动范围内  2攻击范围内 3可移动可攻击  4中间有阻碍
        }else{
            let bingzhong = block_src.cardInfo.bingzhong;     //作战兵种 401骑兵402刀兵403枪兵404弓兵
            if(bingzhong == SoliderType.qiangbing){ //骑兵四方向前进两格，四方向攻击一格；
                if(abs_Row == 0){  //同行
                    if(abs_Col == 1){
                        return BlockRelation.ReachAndAtk;
                    }else if(abs_Col == 2){
                        let mid_Row = (block_src.blockRow + block_tar.blockRow)/2;
                        let mid_Col = (block_src.blockColumn + block_tar.blockColumn)/2;
                        let midBlock = this.getFightScene().getBlockById(mid_Row*this.cardsCol + mid_Col);  //通过指定的索引返回砖块
                        if(midBlock && midBlock.cardInfo){  //中间有人
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
                        if(midBlock && midBlock.cardInfo){  //中间有人
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

    /**显示战斗详情界面 */
    showFightDetailLayer(atkBlock: Block, defBlock: Block, callback:Function){
        // let layer = FightMgr.showLayer(FightMgr.getFightScene().pfFightShow);
        // layer.y += 100;
        // layer.getComponent(FightShow).initFightShowData(nType, srcBlock, this);
    }

    /** 因部曲（阵亡，逃逸，被俘） 检查是否游戏结束 */
    checkGameOverByDead(){

    }

    /** 游戏结束通知 */
    handleGameOverNotice(overState: GameOverState){
        this.GameFightOver = overState;  //战斗是否结束
        if(overState > GameOverState.None){
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
            this.fightRoundCount ++;   //战斗回合数
            if(this.fightRoundCount > this.MaxFightRouncCount){   //最大战斗回合
                ROOT_NODE.showTipsText("回合数已用完")
                NoticeMgr.emit(NoticeType.GameOverNotice, GameOverState.MyRoundOver);  //游戏结束通知
            }else{
                NoticeMgr.emit(NoticeType.PerNextRound, null);  //通知地块准备下一个回合
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
            if(FightMgr.EnemyAutoAi == true){   //敌方自动AI
                this.EnemyAIResult = null;   //敌方AI返回结果
                this.EnemyAutoAiCount = this.getFightScene().enemyOpenBlocks.length;   //敌方AI计数
                cc.log("this.EnemyAutoAiCount = "+this.EnemyAutoAiCount);
                NoticeMgr.emit(NoticeType.EnemyRoundOptAI, null);
            }
        }else{
            this.bStopTouch = false;  //是否停止触摸反应
        }
    }






    


    

    /**从技能表中随机一个技能出来 */
    getRandomSkill(): SkillInfo{
        let keys = Object.getOwnPropertyNames(CfgMgr.C_skill_info);
        let idx = Math.floor(Math.random()*(keys.length-0.01));
        let skillId = parseInt(keys[idx]);
        return new SkillInfo(skillId)
    }

    /**兵种相克 */
    checkBingRestriction(srcType: number, destType: number){  
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



    /**敌方AI处理结果 */
    handelEnemyAIResult(AiResult: EnemyAIResult){
        this.EnemyAutoAiCount --;  //敌方AI计数
        if(AiResult){
            if(this.EnemyAIResult == null || (this.EnemyAIResult.hitWeight == 0 && this.EnemyAIResult.runAwayWeight == 0)){
                this.EnemyAIResult = AiResult;
            }else{
                if(this.EnemyAIResult.hitWeight >= 1.0){  //当前结果必杀有希望
                    if(AiResult.hitWeight > this.EnemyAIResult.hitWeight){
                        this.EnemyAIResult = AiResult;
                    }
                }else if(this.EnemyAIResult.runAwayWeight >= 1.0){   //当前结果要死
                    if(AiResult.hitWeight >= 1.0){  //必杀有希望
                        this.EnemyAIResult = AiResult;
                    }
                }else{  
                    //两个结果均是一般般
                    if(this.EnemyAIResult.hitWeight >= 0.8){  //当前结果有希望攻击
                        if(AiResult.runAwayWeight > this.EnemyAIResult.hitWeight){
                            this.EnemyAIResult = AiResult;
                        }
                    }else{
                        if(AiResult.runAwayWeight >= 1.0){
                            this.EnemyAIResult = AiResult;
                        }
                    }
                }
            }
        }
        //cc.log("handelEnemyAIResult(), this.EnemyAutoAiCount = "+this.EnemyAutoAiCount);
        if(this.EnemyAutoAiCount == 0){   //每个敌方均AI完毕
            this.getFightScene().handleEnemyAIResultOpt();    //根据AI结果处理敌方操作
        }
    }


}
export var FightMgr = new FightManager();