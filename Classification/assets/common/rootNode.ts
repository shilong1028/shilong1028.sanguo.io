import TipsText from "./tipsText";
import AdResultDialog from "./adResultDialog";

//游戏常驻节点
const {ccclass, property} = cc._decorator;

@ccclass
export default class RootNode extends cc.Component {

    @property(cc.Prefab)
    pfTipsText: cc.Prefab = null;   //提示文本
    @property(cc.Prefab)
    pfTipsDialog: cc.Prefab = null;  //提示框
    @property(cc.Prefab)
    pfRewardDialog: cc.Prefab = null;  //奖励提示框
    @property(cc.Prefab)
    pfLoading: cc.Prefab = null;  //加载进度层
    @property(cc.Prefab)
    pfGoldAdd: cc.Prefab = null;  //获取金币提示框
    @property(cc.Prefab)
    adResultPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    pfItem: cc.Prefab = null;
    @property(cc.Prefab)
    pfStuff: cc.Prefab = null;
    @property(cc.Prefab)
    pfSkill: cc.Prefab = null;
    
    // LIFE-CYCLE CALLBACKS:

    tipsArr: string[] = [];   //提示文本数组
    tipsStep: number = 0;   //提示步骤

    onLoad () {
        (cc.game as any).addPersistRootNode(this.node);
        //在creator的引擎里面只有根节点才能够被成功的设置为常驻节点，这一点貌似官方文档是没用提到的
        ROOT_NODE = this;
    }

    start () {
    }

    onDestroy(){
    }

    update (dt) {
        if(this.tipsStep > 0){
            this.tipsStep --;
            if(this.tipsStep <= 0){
                this.tipsStep = 0;
                this.createTipsText();  //创建并提示文本
            }
        }
    }

    /**显示提示文本 */
    showTipsText(tipStr: string){
        this.tipsArr.push(tipStr);
        if(this.tipsArr.length == 1 && this.tipsStep == 0){
            this.createTipsText();  //创建并提示文本
        }
    }
    //创建并提示文本
    createTipsText(){
        if(this.tipsArr.length <= 0){
            this.tipsStep = 0;
            return;
        }else{
            this.tipsStep = 10;

            let tipStr = this.tipsArr.shift();
            let tips = cc.instantiate(this.pfTipsText);
            // tips.y = 700;
            // tips.x = cc.winSize.width/2;
            // cc.director.getScene().addChild(tips);
            this.node.addChild(tips);
            tips.getComponent(TipsText).initTipsText(tipStr);
        }
    }

    clearTipsText(){
        this.tipsArr = [];
    }

    ShowAdResultDialog(){
        let dialog = this.node.getChildByName("adResultPrefab");
        if(dialog){
            return;
        }
        dialog = cc.instantiate(this.adResultPrefab);
        dialog.name = "adResultPrefab"
        // tips.y = cc.winSize.height/2;
        // tips.x = cc.winSize.width/2;
        this.node.addChild(dialog);
    }
    updateAdResultDialog(){
        let dialog = this.node.getChildByName("adResultPrefab");
        if(dialog){
            dialog.getComponent(AdResultDialog).updateAdDataLabel();
        }
    }
}

export var ROOT_NODE : RootNode;
