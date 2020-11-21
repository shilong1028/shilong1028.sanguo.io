
//通用提示界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class TipsDialog extends cc.Component {

    @property(cc.Node)
    bgImg: cc.Node = null;

    @property(cc.Node)
    touchNode: cc.Node = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    callback: any = null;
    costNum: number = 0;

    onLoad () {
        //this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.descLabel.string = "";
    }

    start () {

    }

    // update (dt) {}

    touchEnd(event: cc.Touch){
        let pos1 = this.bgImg.convertToNodeSpaceAR(event.getLocation());
        let rect1 = cc.rect(-this.bgImg.width/2, -this.bgImg.height/2, this.bgImg.width, this.bgImg.height);
        if(!rect1.contains(pos1)){
            this.onCloseBtn();
        }
    }

    onCloseBtn(){
        this.node.destroy();
    }

    onOkBtn(){
        if(this.callback){
            this.callback();
        }
        this.node.destroy();
    }

    setTipStr(str: string, okCallback: any){
        this.callback = okCallback;
        this.descLabel.string = str;
    }
}
