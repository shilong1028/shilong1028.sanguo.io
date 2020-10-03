
//兵种动画控制脚本
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Fight/bingAni")
@executionOrder(-1)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class BingAni extends cc.Component {

    @property(cc.SpriteAtlas)
    atkAtlas: cc.SpriteAtlas = null;   //攻击序列帧

    @property(cc.SpriteAtlas)
    defAtlas: cc.SpriteAtlas = null;   //待机序列帧
    
    // LIFE-CYCLE CALLBACKS:
    bingAni: cc.Animation = null;  //四个clips分别为左侧攻击，左侧待机，右侧攻击，右侧待机动作
    oldAniName: string = "";  //旧的动画名称

    onLoad () {
        this.bingAni = this.node.getComponent(cc.Animation);  

        let defClip = cc.AnimationClip.createWithSpriteFrames(this.defAtlas.getSpriteFrames(), 6);
        defClip.name = "defaultAniClip";
        defClip.wrapMode = cc.WrapMode.Loop;
        this.bingAni.addClip(defClip);

        let atkClip = cc.AnimationClip.createWithSpriteFrames(this.atkAtlas.getSpriteFrames(), 6);
        atkClip.name = "attackAniClip";
        atkClip.wrapMode = cc.WrapMode.Loop;
        this.bingAni.addClip(atkClip);

        // this.bingAni.on("stop", function () {
        //     if(this.oldAniName == "attackAniClip"){
        //         this.bingAni.play("defaultAniClip");
        //     }
        // });

        this.oldAniName = "defaultAniClip";  //旧的动画名称
        this.bingAni.play("defaultAniClip");

    }

    start () {
    }

    // update (dt) {}

    /**
     *  改变兵种动画  
     * @param optType  1默认动作，2攻击动作
     */
    changeAniByType(optType: number){
        cc.log("changeAniByType optType = "+optType)
        if(this.bingAni){
            if(optType == 1 && this.oldAniName != "defaultAniClip"){   //默认动画
                if(this.oldAniName.length > 0){
                    this.bingAni.stop(this.oldAniName);
                }
                this.oldAniName = "defaultAniClip";
                this.bingAni.play("defaultAniClip");
            }else if(this.oldAniName != "attackAniClip"){   //=0为攻击动画
                if(this.oldAniName.length > 0){
                    this.bingAni.stop(this.oldAniName);
                }
                this.oldAniName = "attackAniClip";
                this.bingAni.play("attackAniClip");
            }
        }
    }
}
