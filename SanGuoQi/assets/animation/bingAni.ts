
//兵种动画控制脚本
const {ccclass, property} = cc._decorator;

@ccclass
export default class BingAni extends cc.Component {

    @property(cc.Animation)
    bingAni: cc.Animation = null;

    // LIFE-CYCLE CALLBACKS:

    oldAniName: string = "";  //旧的动画名称
    aniClips: any[] = null;   //AnimationClip[]

    onLoad () {
        if(this.bingAni){
            this.aniClips = this.bingAni.getClips();
            this.oldAniName = "";  //小球旧的动画名称
        }
    }

    start () {

    }

    // update (dt) {}

    //改变兵种动画
    changeAniByType(posType: number, optType: number){
        if(this.bingAni && this.oldAniName.length > 0){
            this.bingAni.stop(this.oldAniName);
            this.oldAniName = "";  //小球旧的动画名称
        }
        let clipIdx = -1;
        if(posType == 1){   //站在左侧，面向右侧
            if(optType == 1){   //默认动画
                clipIdx = 1;
            }else{   //=0为攻击动画
                clipIdx = 0;
            }
        }else if(posType == 2){   //站在右侧，面向左侧
            if(optType == 1){   //默认动画
                clipIdx = 3;
            }else{   //=0为攻击动画
                clipIdx = 2;
            }
        }

        if(clipIdx >= 0){
            let clip = this.aniClips[clipIdx];
            //clip.wrapMode = cc.WrapMode.Loop;
            
            this.oldAniName = clip.name;
            this.bingAni.play(this.oldAniName);
        }

    }
}
