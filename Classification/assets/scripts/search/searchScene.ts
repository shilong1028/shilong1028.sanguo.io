
//垃圾分类主界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class SearchScene extends cc.Component {

    @property(cc.EditBox)
    editbox: cc.EditBox = null;
    @property(cc.Label)
    editText: cc.Label = null;
    @property(cc.Label)
    editPlaceText: cc.Label = null;

    @property(cc.Node)
    resultNode: cc.Node = null;   //查询返回节点
    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;   //垃圾类型图标
    @property(cc.Label)
    resultLable: cc.Label = null;   //答案
    @property(cc.Label)
    descLabel: cc.Label = null;  //说明
    @property(cc.Label)
    otherLabel: cc.Label = null;  //没有找到答案的参考
    @property([cc.SpriteFrame])
    iconFrames: cc.SpriteFrame[] = new Array(4);

    @property(cc.Node)
    gameNode: cc.Node = null;   //小游戏节点
    @property(cc.Sprite)
    handSpr: cc.Sprite = null;
    @property([cc.SpriteFrame])
    handFrames: cc.SpriteFrame[] = new Array(2);

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.resultNode.opacity = 0;
        this.gameNode.opacity = 255;

        this.showSearchResult(null);
    }

    start () {
        this.gameHandActions();
    }

    // update (dt) {}

    editingDidBegan (event) {
        cc.log('editing did began');
        // this.editText.node.active = true;
        // this.editPlaceText.node.active = false;
    }

    textChanged (event) {
        cc.log('text changed: ' + event);
        this.editText.string = event;
    }

    editingDidEnded (event) {
        cc.log('editing did ended');
    }

    editingReturn (event) {
        cc.log('editing retrun');
    }

    onSearchBtn(){
        // this.editText.node.active = false;
        // this.editPlaceText.node.active = true;
    }

    showSearchResult(result:any){
        this.iconSpr.spriteFrame = null;
        this.resultLable.string = "";
        this.descLabel.string = "";
        this.otherLabel.string = "";

        if(result){

            this.gameNode.opacity = 0;
            this.resultNode.opacity = 255;
        }
    }

    onGameBtn(){
        cc.director.loadScene("game1Scene");
    }

    gameHandActions(){
        this.handSpr.node.runAction(cc.repeatForever(cc.sequence(
            cc.delayTime(0.3), cc.callFunc(function(){
                this.handSpr.spriteFrame = this.handFrames[1];
            }.bind(this)), cc.delayTime(0.3), cc.callFunc(function(){
                this.handSpr.spriteFrame = this.handFrames[0];
            }.bind(this))
        )));
    }



}
