import FightScene from "../fight/fightScene";

import { CardInfo, GeneralInfo } from "./Enum";
import { CfgMgr, st_general_info } from "./ConfigManager";

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

    FightWin: boolean = false;  //战斗胜利或失败
    EnemyAutoAi: boolean = true;  //敌方自动AI

    /**清除并初始化战斗数据，需要传递敌方武将数组和我方出战武将数组 */
    clearAndInitFightData(enemyArr:GeneralInfo[], generalArr: GeneralInfo[]){
        this.randomGeneralArr = new Array();  //随机散布的卡牌

        this.battleEnemyArr = enemyArr;   //出战敌方部曲（和士兵）
        this.battleGeneralArr = generalArr;   //出战我方部曲
    
        this.myCampId = 1;   //阵营，0默认，1蓝方，2红方
        this.bStopTouch = false;   //是否停止触摸反应
        this.bMyRound = true;  //是否我方回合

        this.FightWin = false;  //战斗胜利或失败
        this.EnemyAutoAi = true;  //敌方自动AI
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

    /**获取全部随机武将数据 */
    getAllRandomGenerals(){
        this.randomGeneralArr = new Array();  //随机散布的卡牌

        if(this.battleEnemyArr && this.battleGeneralArr){
            //我方
            for(let i=0; i<this.battleGeneralArr.length; ++i){
                let card = new CardInfo(1, this.battleGeneralArr[i]);
                this.randomGeneralArr.push(card);
            }
            //敌方
            for(let i=0; i<this.battleEnemyArr.length; ++i){
                let card = new CardInfo(2, this.battleEnemyArr[i]);
                this.randomGeneralArr.push(card);
            }
        }
        //空
        let totalCardCount = this.cardsCol*this.cardsRow - this.battleGeneralArr.length - this.battleEnemyArr.length;
        for(let i=0; i<totalCardCount; ++i){
            let card = new CardInfo(0);
            this.randomGeneralArr.push(card);
        }
    }

    /**从随机数组中获取武将数据 */
    getGeneralDataFromRandomArr(): CardInfo{
        let len = this.randomGeneralArr.length;
        let idx = Math.ceil(Math.random()*len);
        idx --;
        if(idx < 0){
            idx = 0;
        }
        let cardInfo = this.randomGeneralArr[idx];
        this.randomGeneralArr.splice(idx, 1);

        return cardInfo.clone();
    }

    /**兵种相克 */
    checkBingRestriction(srcType: number, destType: number){  //401骑兵402步兵403弓兵
        if(srcType == 401){
            if(destType == 402){
                return 1;
            }else if(destType == 403){
                return -1;
            }
        }else if(srcType == 402){
            if(destType == 403){
                return 1;
            }else if(destType == 401){
                return -1;
            }
        }else if(srcType == 403){
            if(destType == 401){
                return 1;
            }else if(destType == 402){
                return -1;
            }
        }

        return 0;
    }

    /**下回合处理 */
    nextRoundOpt(){
        if(FightMgr.getFightScene().checkGameOver() == false){
            if(FightMgr.bMyRound == true){
                FightMgr.handleEnemyRoundOpt();   //敌方回合处理
            }else{
                FightMgr.handleMyRoundOpt();   //我方回合处理
            }
        }
    }

    /**我方回合处理 */
    handleMyRoundOpt(){
        this.bMyRound = true;
        this.bStopTouch = false;
        FightMgr.getFightScene().showRoundDesc();
    }

    /**敌方回合处理 */
    handleEnemyRoundOpt(){
        this.bMyRound = false;
        this.bStopTouch = true;
        FightMgr.getFightScene().showRoundDesc();

        FightMgr.getFightScene().handleEnemyRoundOpt();
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

}
export var FightMgr = new FightManager();