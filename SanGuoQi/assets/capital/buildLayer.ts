import { ROOT_NODE } from "../common/rootNode";
import { CfgMgr } from "../manager/ConfigManager";
import { MyUserData } from "../manager/MyUserData";


//建筑介绍
const {ccclass, property} = cc._decorator;

@ccclass
export default class BuildLayer extends cc.Component {
    @property(cc.Sprite)
    buildSpr: cc.Sprite = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    lvLabel: cc.Label = null;
    @property(cc.Label)
    descLabel: cc.Label = null;

    @property(cc.SpriteAtlas)
    buildAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ROOT_NODE.showLayerMoney(this.node, cc.v2(0, 340));    //一级界面上的金币钻石粮草公用控件

        this.nameLabel.string = "";
        this.lvLabel.string = "";
        this.descLabel.string = "";
        this.buildSpr.spriteFrame = null;
    }

    onDestroy(){
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {

    }

    // update (dt) {}

    initBulidInfo(buildId: number){
        let buildCfg = CfgMgr.getBuildConf(buildId);
        if(buildCfg){
            if(buildId == 101){
                this.lvLabel.string = "等级：Lv"+MyUserData.capitalLv;
            }else{
                this.lvLabel.string = "等级：Lv0";
            }
            this.nameLabel.string = buildCfg.name;
            this.buildSpr.spriteFrame = this.buildAtlas.getSpriteFrame(buildId.toString());
            this.descLabel.string = buildCfg.desc;
        }
    }

    onCloseBtn(){
        this.node.destroy();
    }

}
