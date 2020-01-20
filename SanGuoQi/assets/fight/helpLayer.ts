

const {ccclass, property} = cc._decorator;

@ccclass
export default class HelpLayer extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onCloseBtn(){
        this.node.destroy();
    }
}
