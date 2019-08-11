
import { CfgMgr } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";

//初始场景，用于初始化加载数据
const {ccclass, property} = cc._decorator;

@ccclass
export default class StartScene extends cc.Component {

    @property(cc.Label)
    tipText: cc.Label = null;

    @property(cc.SpriteAtlas)
    cicleAtlas: cc.SpriteAtlas = null;   //转圈序列帧

    // LIFE-CYCLE CALLBACKS:

    updateStep: number = 0;

    onLoad () {
        this.tipText.string = "加载配置中."
    }

    start () {
        CfgMgr.setOverCallback(this.handleLoadConfigOver, this);  //设置加载配置完毕回调

        CfgMgr.loadAllConfig();   //加载配置

        let aniNode = GameMgr.createAtlasAniNode(this.cicleAtlas, 6, cc.WrapMode.Loop);
        this.node.addChild(aniNode, 100);
    }

    update (dt) {
        if(this.updateStep < 20){
            this.updateStep ++;
            this.tipText.string = "加载配置中."
        }else if(this.updateStep < 40){
            this.updateStep ++;
            this.tipText.string = "加载配置中.."
        }else if(this.updateStep < 60){
            this.updateStep ++;
            if(this.updateStep == 60){
                this.updateStep = 0;
            }
            this.tipText.string = "加载配置中..."
        }
    }

    /**加载配置数据完毕 */
    handleLoadConfigOver(){
        //cc.log("handleLoadConfigOver()");
        cc.director.loadScene("loginScene"); 
    }


}
