import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";

//金币或砖石飘动画
const {ccclass, property} = cc._decorator;

@ccclass
export default class IconEffect extends cc.Component {

    @property([cc.Sprite])
    iconSprArr: cc.Sprite[] = new Array(5);

    @property(cc.SpriteAtlas)
    effectAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        for(let i=0; i<5; ++i){
            this.iconSprArr[i].node.opacity = 0;
        }
    }

    start () {

    }

    // update (dt) {}

    initIconEffectAni(startPos: cc.Vec2, destPos: cc.Vec2, type: number){
        //cc.log("initIconEffectAni(), startPos = "+startPos+"; destPos = "+destPos+"; type = "+type);
        startPos = this.node.convertToNodeSpaceAR(startPos);
        destPos = this.node.convertToNodeSpaceAR(destPos);
        let len = destPos.sub(startPos).mag();
        let time = len/1500;
        for(let i=0; i<5; ++i){
            this.iconSprArr[i].node.position = startPos;
            this.iconSprArr[i].node.opacity = 255;
            this.iconSprArr[i].node.runAction(cc.sequence(cc.hide(), cc.delayTime(i*0.1), cc.show(), cc.moveTo(time, destPos), cc.hide(), cc.callFunc(function(){
                this.createEffectAniNode(destPos);
            }.bind(this))));
        }
    }

    createEffectAniNode(pos: cc.Vec2){
        AudioMgr.playEffect("effect/gold_fly");

        let aniNode = GameMgr.createAtlasAniNode(this.effectAtlas, 12, cc.WrapMode.Default);
        aniNode.scale = 2.0;
        aniNode.setPosition(pos);
        this.node.addChild(aniNode, 100);

        // let effectSpr = aniNode.getComponent(cc.Sprite);
        // if(effectSpr){
        //     effectSpr.srcBlendFactor = cc.macro.BlendFactor.SRC_ALPHA;
        //     effectSpr.dstBlendFactor = cc.macro.BlendFactor.ONE;
        // }
    }


}
