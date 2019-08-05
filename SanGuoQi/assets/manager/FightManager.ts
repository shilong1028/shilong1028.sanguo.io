import FightScene from "../fight/fightScene";
import { CardInfo, GeneralInfo, NoticeType, SoliderType } from "./Enum";
import { NoticeMgr } from "./NoticeManager";

//战斗管理器
const {ccclass, property} = cc._decorator;

@ccclass
class FightManager { 
    randomGeneralArr: CardInfo[] = new Array();   //随机散布的卡牌

    battleEnemyArr: GeneralInfo[] = null;   //出战敌方部曲（和士兵）
    battleGeneralArr: GeneralInfo[] = null;   //出战我方部曲

    cardsCol: number = 4;    //行 Row 列 Column
    cardsRow: number = 5;

    myCampId: number = 1;   //阵营，0默认，1蓝方，2红方
    bStopTouch: boolean = false;   //是否停止触摸反应
    bMyRound: boolean = true;  //是否我方回合
    fightRoundCount: number = 0;   //战斗回合数

    FightWin: boolean = false;  //战斗胜利或失败
    EnemyAutoAi: boolean = false;  //敌方是否自动AI

    /**清除并初始化战斗数据，需要传递敌方武将数组和我方出战武将数组 */
    clearAndInitFightData(enemyArr:GeneralInfo[], generalArr: GeneralInfo[]){
        this.randomGeneralArr = new Array();  //随机散布的卡牌

        this.battleEnemyArr = enemyArr;   //出战敌方部曲（和士兵）
        this.battleGeneralArr = generalArr;   //出战我方部曲
    
        this.myCampId = 1;   //阵营，0默认，1蓝方，2红方
        this.bStopTouch = false;   //是否停止触摸反应
        this.bMyRound = true;  //是否我方回合
        this.fightRoundCount = 0;   //战斗回合数

        this.FightWin = false;  //战斗胜利或失败
        this.EnemyAutoAi = false;  //敌方自动AI

        if(enemyArr.length > 0 && generalArr.length > 0){
            cc.director.loadScene("fightScene");
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

    //卡牌均开启并制定位置
    getGeneralDataByBlockIdx(blockIdx: number): CardInfo{
        //敌方最多8个
        if(blockIdx >= 0 && blockIdx <= 11){
            if(blockIdx == 0 && this.battleEnemyArr[4]){
                let card = new CardInfo(2, this.battleEnemyArr[4]);
                return card.clone();
            }else if(blockIdx == 1 && this.battleEnemyArr[3]){
                let card = new CardInfo(2, this.battleEnemyArr[3]);
                return card.clone();
            }else if(blockIdx == 2 && this.battleEnemyArr[0]){
                let card = new CardInfo(2, this.battleEnemyArr[0]);
                return card.clone();
            }else if(blockIdx == 3 && this.battleEnemyArr[2]){
                let card = new CardInfo(2, this.battleEnemyArr[2]);
                return card.clone();
            }else if(blockIdx == 4 && this.battleEnemyArr[1]){
                let card = new CardInfo(2, this.battleEnemyArr[1]);
                return card.clone();
            }else if(blockIdx == 5 && this.battleEnemyArr[5]){
                let card = new CardInfo(2, this.battleEnemyArr[5]);
                return card.clone();
            }else if(blockIdx == 6 && this.battleEnemyArr[6]){
                let card = new CardInfo(2, this.battleEnemyArr[6]);
                return card.clone();
            }else if(blockIdx == 7 && this.battleEnemyArr[7]){
                let card = new CardInfo(2, this.battleEnemyArr[7]);
                return card.clone();
            }else{   //空
                let card = new CardInfo(0);  
                return card.clone();
            }
        }else{  //我方最多5个
            if(blockIdx == 19 && this.battleGeneralArr[4]){
                let card = new CardInfo(1, this.battleGeneralArr[4]);
                return card.clone();
            }else if(blockIdx == 18 && this.battleGeneralArr[3]){
                let card = new CardInfo(1, this.battleGeneralArr[3]);
                return card.clone();
            }else if(blockIdx == 17 && this.battleGeneralArr[0]){
                let card = new CardInfo(1, this.battleGeneralArr[0]);
                return card.clone();
            }else if(blockIdx == 16 && this.battleGeneralArr[2]){
                let card = new CardInfo(1, this.battleGeneralArr[2]);
                return card.clone();
            }else if(blockIdx == 15 && this.battleGeneralArr[1]){
                let card = new CardInfo(1, this.battleGeneralArr[1]);
                return card.clone();
            }else{   //空
                let card = new CardInfo(0);  
                return card.clone();
            }
        }
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

    /**下回合处理 */
    nextRoundOpt(){
        if(this.getFightScene().checkGameOver() == false){
            this.fightRoundCount ++;   //战斗回合数
            NoticeMgr.emit(NoticeType.PerNextRound, null);  //下一个回合准备
            if(this.bMyRound == true){
                this.handleEnemyRoundOpt();   //敌方回合处理
            }else{
                this.handleMyRoundOpt();   //我方回合处理
            }
        }
    }

    /**我方回合处理 */
    handleMyRoundOpt(){
        this.bMyRound = true;
        this.bStopTouch = false;  //是否停止触摸反应
        this.getFightScene().showRoundDesc();
    }

    /**敌方回合处理 */
    handleEnemyRoundOpt(){
        this.bMyRound = false;
        this.getFightScene().showRoundDesc();
        if(this.EnemyAutoAi == true){
            this.bStopTouch = true;  //是否停止触摸反应
            this.getFightScene().handleEnemyRoundOpt();
        }else{
            this.bStopTouch = false;  //是否停止触摸反应
        }
    }


    //****************************************************** */

    /*** 显示弹出框 */
    showLayer( prafab : cc.Prefab, mask:boolean = true, parent:cc.Node=null) : cc.Node {
        if(prafab == null){
            cc.log("showLayer, parfab is null");
            return null;
        }

        let layer = cc.instantiate(prafab);
        if(layer == null){
            cc.warn("instantiate prefab is error, prafab = "+prafab.name);
            return null;
        }

        cc.log("show layer ====== "+prafab.name);

        if(parent == null){
            cc.director.getScene().addChild(layer);
            layer.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.5);
        }else{
            parent.addChild(layer);
            let parSize = parent.getContentSize();
        }
        // if(mask == true){
        //     var maskNode = cc.instantiate(ROOT_Layer.colorSprite);
        //     maskNode.name = "layerbg_maskNode";
        //     maskNode.active = true;
        //     //var maskNode = layer.getChildByName("colorSpr");
            
        //     var sz = cc.winSize;
        //     maskNode.width = sz.width * 2;
        //     maskNode.height = sz.height * 2;
        //     //maskNode.color = cc.color(0, 0, 0);
        //     maskNode.opacity = 180;
        //     maskNode.setPosition(cc.v2(0, 0));
        //     layer.addChild(maskNode, -1000);

        //     //var act1 = cc.tintTo(0.5, 0, 0, 0);
        //     //var act1 = cc.delayTime(0.4);
        //     // var act2 = cc.fadeTo(0.5, 150);
        //     // maskNode.runAction(act2);
        // }

        return layer;
    }

	/**** 动态显示单个合图的帧动画 */   //sample为1s播放多少帧, bNewChild是否将动画作为子节点（=0则直接在node添加动画）
	showAltasAnimationONE(node, sprAtlas: cc.SpriteAtlas, name, pos = cc.Vec2.ZERO, bNewChild = 1, sample = 12, play = true, remove = true, wrapMode = cc.WrapMode.Default) {
		let point = node;
		if (bNewChild == 1) {
			point = new cc.Node();
			point.name = name + "AniNode";
			point.addComponent(cc.Sprite);
			point.setPosition(pos);
			node.addChild(point);
		}
		let animation = point.addComponent(cc.Animation);

		var clip = cc.AnimationClip.createWithSpriteFrames(sprAtlas.getSpriteFrames(), sample);
		clip.name = name;
		clip.wrapMode = wrapMode;
		animation.addClip(clip);

		if (remove) {
			animation.on("stop", function () {
				this.destroy();
			}, point);
		}

		if (play) {
			animation.play(name);
		}
		return animation;
	}

    showFramesAniAndRemove(parent: cc.Node, pos: cc.Vec2, effectAtlas: cc.SpriteAtlas, bRemove: boolean){
        if(effectAtlas && parent){
            let effNode = new cc.Node;
            effNode.addComponent(cc.Sprite);
            effNode.setPosition(pos);
            parent.addChild(effNode, 100);

            let wrapMode = cc.WrapMode.Default;
            if(bRemove == false){
                wrapMode = cc.WrapMode.Loop;
            }
            let animation: cc.Animation = this.showAltasAnimationONE(effNode, effectAtlas, "effectAtlas", cc.Vec2.ZERO, 0, 18, true, bRemove, wrapMode);
            return effNode;
        }
        return null;
    }

    /******************  以下为暂时废弃的接口   ********** */
    // /**获取全部随机武将数据 */
    // getAllRandomGenerals(){
    //     this.randomGeneralArr = new Array();  //随机散布的卡牌
    //     if(this.battleEnemyArr && this.battleGeneralArr){
    //         //我方
    //         for(let i=0; i<this.battleGeneralArr.length; ++i){
    //             let card = new CardInfo(1, this.battleGeneralArr[i]);
    //             card.shiqi = 100;   //士气值
    //             this.randomGeneralArr.push(card);
    //         }
    //         //敌方
    //         for(let i=0; i<this.battleEnemyArr.length; ++i){
    //             let card = new CardInfo(2, this.battleEnemyArr[i]);
    //             card.shiqi = 100;   //士气值
    //             this.randomGeneralArr.push(card);
    //         }
    //     }
    //     //空
    //     let totalCardCount = this.cardsCol*this.cardsRow - this.battleGeneralArr.length - this.battleEnemyArr.length;
    //     for(let i=0; i<totalCardCount; ++i){
    //         let card = new CardInfo(0);
    //         this.randomGeneralArr.push(card);
    //     }
    // }
    // /**从随机数组中获取武将数据 */
    // getGeneralDataFromRandomArr(blockIdx: number): CardInfo{
    //     let len = this.randomGeneralArr.length;
    //     let idx = Math.ceil(Math.random()*len);
    //     idx --;
    //     if(idx < 0){
    //         idx = 0;
    //     }
    //     let cardInfo = this.randomGeneralArr[idx];
    //     this.randomGeneralArr.splice(idx, 1);

    //     return cardInfo.clone();
    // }

}
export var FightMgr = new FightManager();