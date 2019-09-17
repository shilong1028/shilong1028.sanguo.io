

const {ccclass, property} = cc._decorator;

/**震屏 */
@ccclass
export class SceneShake extends cc.Component {
    //tagart原始坐标
    _initial_x:number = 0;
    _initial_y:number = 0;
    
    //振幅
    strength_x:number = 0;
    strength_y:number = 0;

    //持续时间
    duration: number = 0;

    //目标执行节点
    target: cc.Node = null;

    create(target: cc.Node, duration:number, strength_x:number, strength_y:number){
        this.target = target;
        this.duration = duration;
        this._initial_x = target.position.x;
        this._initial_y = target.position.y;
        this.strength_x = strength_x;
        this.strength_y = strength_y;
    }

    _fgRangeRand(min:number, max:number){
        return Math.random()*(max - min) + min;
    }

    // Called once per frame. Time is the number of seconds of a frame interval.
    update(dt){
        if(this.target){
            this.duration -= dt;
            if(this.duration <= 0){
                this.clearShake(this.target);
            }else{
                let randx = this._fgRangeRand(-this.strength_x, this.strength_x);
                let randy = this._fgRangeRand(-this.strength_y, this.strength_y);
                //cc.log("update(), randx = "+randx+"; randy = "+randy);
            
                // move the target to a shaked position  
                this.target.setPosition(cc.v2(this._initial_x + randx, this._initial_y + randy));
            }
        }else{
            this.clearShake(this.target);
        }
    }

    clearShake(target: cc.Node){
        if(target){
            //this.target.setPosition(cc.v2(this._initial_x, this._initial_y));
            target.position = cc.v2(0,0);
            target.removeComponent(SceneShake);
        }
        this.target = null;
        this._initial_x = 0;
        this._initial_y = 0;
        this.strength_x = 0;
        this.strength_y = 0;
        this.duration = 0;
    }
}


class ShakeManager {
    /**由x和y振幅创建一个持续震屏动作 */
    runToSceneShakeByStrength(duration:number, strength:number, strength_y:number=-1000){
        //cc.log("runToSceneShakeByStrength(), duration = "+duration+"; strength = "+strength);
        let curSceneNode = cc.director.getScene().getChildByName('Canvas');
        if(curSceneNode){
            let mainCamera = curSceneNode.getChildByName("Main Camera");
            
            if(strength_y == -1000){
                strength_y = strength;
            }

            let sceneShake = curSceneNode.getComponent(SceneShake);
            if(sceneShake){
                sceneShake.clearShake(mainCamera); 
            }
            sceneShake = curSceneNode.addComponent(SceneShake); 
            sceneShake.create(mainCamera, duration, strength, strength_y);
        }
    }

    /**由震动等级创建一个震屏动作 */  //{ LOW = 1, MIDDLE, HIGH }
    runToSceneShakeByLevel(durtion: number, level: number){
        this.runToSceneShakeByStrength(durtion, 2.5/3*level, 1.5*level);
    }
}

/* 震屏相关通用功能 */
export  var ShakeMgr = new ShakeManager();
