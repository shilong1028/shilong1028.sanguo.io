
import Brick from "./Brick";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BrickCollider extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
    }  
    
    onDestroy(){
    }

    start () {
    }

    //移动砖块碰撞处理（与砖块碰撞，与小球碰撞，与指示线碰撞）
    onCollisionEnter(other, self){
        let brickNode = this.node.parent;
        if(brickNode){
            let brick = brickNode.getComponent(Brick);
            if(brick && brick.isBrickDead() == false){
                let otherGroup = other.node.group;
                if(otherGroup == "Ball"){  //与小球相撞
                    brick.handleBallCollisionEnter(other.node);
                }else if(otherGroup == "Dot"){   //与指示线
                    brick.handleDotCollisionEnter(other.node);
                } 
            }
        }
    }

    update (dt) {
    }
}
