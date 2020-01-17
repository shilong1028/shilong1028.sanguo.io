import { AudioMgr } from "../manager/AudioMgr";

//特效
const {ccclass, property} = cc._decorator;

@ccclass
export default class WenZi extends cc.Component {

    @property(cc.Animation)
    aniNode: cc.Animation = null;

    @property(cc.Sprite)
    titleSpr: cc.Sprite = null;

    @property([cc.SpriteFrame])
    titleFrames: cc.SpriteFrame[] = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    }

    // update (dt) {}

    showEffectAniByIdx(idx: number){
        this.titleSpr.spriteFrame = this.titleFrames[idx];
        
        this.aniNode.on("stop", function () {
            this.node.destroy();
        }.bind(this));

        let clips = this.aniNode.getClips();
        let clip = clips[0];
        clip.name = "Wenzi";
        clip.wrapMode = cc.WrapMode.Default; 
        this.aniNode.play("Wenzi");
    }
}
