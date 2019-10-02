import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import { CfgMgr } from "../manager/ConfigManager";

//加载层
const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingLayer extends cc.Component {

    @property(cc.Label)
    progresslabel: cc.Label = null;
    @property(cc.ProgressBar)
    loadProBar: cc.ProgressBar = null;

    @property(cc.Node)
    bgNode: cc.Node = null;
    @property(cc.Node)
    infoNode: cc.Node = null;

    @property(cc.Sprite)
    catSpr: cc.Sprite = null;
    @property(cc.Label)
    catLabel: cc.Label = null;

    @property(cc.SpriteAtlas)
    catAtlas: cc.SpriteAtlas = null;

    sceneName:string = null;
    t1 : number = 0;
    curP : number = 0;

    onLoad () {
        this.initLoadData();
    }

    initLoadData(){
        this.sceneName = null;
        this.loadProBar.progress = 0;
        this.catLabel.string = "";
        this.t1 = 0;
        this.curP = 0;
    }

    start() {
        let palyerId = Math.floor(Math.random()*GameMgr.PlayerCount*0.99)+1;
        let playerCfg = CfgMgr.getPlayerConf(palyerId);
        if(playerCfg){
            this.catSpr.spriteFrame = this.catAtlas.getSpriteFrame("player_"+palyerId);
            this.catLabel.string = playerCfg.desc;
        }
    }

    goToScene(name){
        this.initLoadData();
        this.sceneName = name;  //下一个场景名称
        this.t1 = new Date().getTime();
    }

    // update (dt) {}

    onProgress(count, total, item) {
        //cc.log("Loading... this.sceneName = "+this.sceneName+"; count = "+count+"; total = "+total);
        let p = 1;
        if(total != 0){
            p = count/total;
        }

        if(p > this.curP){
            this.curP = p;
        }else{
            this.curP += 0.001;
        }

        if(this.curP > 1){
            this.curP = 1;
        }

        this.loadProBar.progress = this.curP;
        this.progresslabel.string = "资源加载中... "  + "(" + count + "/" + total + ")";
    }

    loadFinish(err, asset = null) {   //加载完成的回调
        this.loadProBar.progress = 1;

        if(new Date().getTime() - this.t1 < 300){
            this.scheduleOnce(this.loadGameScene, 0.3);
        }else{
            this.loadGameScene();
        }        
    }

    loadGameScene(){
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(function(){
            //HUD.hideLayer(this);
        }.bind(this))));

        let curScene = cc.director.getScene();
        if(curScene){
            //curScene.runAction(cc.fadeOut(0.5));
        }
        cc.director.loadScene(this.sceneName);
    }
}
