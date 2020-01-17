import { CfgMgr, st_rubbish_info } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";
import CostWarn from "./costWarn";
import TableView from "../tableView/tableView";
import { SDKMgr } from "../manager/SDKManager";
import { NotificationMy } from "../manager/NoticeManager";
import { NoticeType, TipsStrDef } from "../manager/Enum";
import { MyUserData } from "../manager/MyUserData";
import { AudioMgr } from "../manager/AudioMgr";
import { ROOT_NODE } from "../common/rootNode";


//垃圾分类主界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class SearchScene extends cc.Component {

    @property(cc.Node)
    bottomNode: cc.Node = null;
    @property(cc.Node)
    topNode: cc.Node = null;

    @property(cc.Node)
    shareBtn: cc.Node = null;  //分享
    @property(cc.Label)
    labGold: cc.Label = null;   //玩家金币数

    @property(cc.Sprite)
    musicSpr: cc.Sprite = null;   //背景音乐控制按钮图标
    @property(cc.SpriteFrame)
    musicCloseFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    musicOpenFrame: cc.SpriteFrame = null;

    @property(cc.EditBox)
    editbox: cc.EditBox = null;
    @property(cc.Label)
    editText: cc.Label = null;
    @property(cc.Label)
    editPlaceText: cc.Label = null;

    @property(cc.Node)
    resultNode: cc.Node = null;   //查询返回节点\
    @property(cc.Label)
    resultLabel: cc.Label = null;  //答案
    @property(TableView)
    tableView: TableView = null;

    @property([cc.SpriteFrame])
    typeFrames: cc.SpriteFrame[] = new Array(4);
    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    @property(cc.Node)
    gameNode: cc.Node = null;   //小游戏节点
    @property(cc.Sprite)
    handSpr: cc.Sprite = null;
    @property([cc.SpriteFrame])
    handFrames: cc.SpriteFrame[] = new Array(2);

    @property(cc.Prefab)
    pfCost: cc.Prefab = null;   //花费支出

    // LIFE-CYCLE CALLBACKS:

    bSearching: boolean = false;   //正在查询中

    onLoad () {
        GameMgr.adaptBgByScene(this.topNode, this.bottomNode);   //场景背景图适配

        NotificationMy.on(NoticeType.UpdateGold, this.UpdateGold, this);  //金币更新

        this.shareBtn.active = false;  //分享
        if(SDKMgr.isSDK == true){
            this.shareBtn.active = true;  //分享
        }
        
        this.showResultNode(false);  //一定时间内显示答案
        this.showSearchResult(null);
    }

    onDestroy(){
        NotificationMy.offAll(this);
        this.node.targetOff(this);
    }


    start () {
        this.showMusicSpr();
        this.UpdateGold();  
        this.gameHandActions();

        SDKMgr.createrBannerAd();   //创建Banner
    }

    /**更新金币数量 */
    UpdateGold(){
        let valStr = GameMgr.num2e(MyUserData.GoldCount);
        this.labGold.string = valStr;  //金币数量

        this.labGold.node.stopAllActions();
        this.labGold.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.3), cc.scaleTo(0.1, 1.0)));
    }

    onShareBtn(){
        AudioMgr.playEffect("effect/ui_click");

        SDKMgr.shareGame(TipsStrDef.KEY_Share, (succ:boolean)=>{
        }, this);
    }

    onAddGoldBtn(){
        AudioMgr.playEffect("effect/ui_click");
        GameMgr.showGoldAddDialog();  //获取金币提示框
    }

    /**音乐开关 */
    onMusicBtn(){
        AudioMgr.playEffect("effect/ui_click");

        let keyVal = AudioMgr.getMusicOnOffState();   //获取音效总开关状态
        keyVal = 1- keyVal;
        AudioMgr.setMusicOnOffState(keyVal);
        this.showMusicSpr();
    }

    showMusicSpr(){
        let keyVal = AudioMgr.getMusicOnOffState();   //获取音效总开关状态
        if(keyVal == 0){     //现在为开启状态，按钮显示开启图标
            this.musicSpr.spriteFrame = this.musicOpenFrame;
        }else{ 
            this.musicSpr.spriteFrame = this.musicCloseFrame;
        }
    }

    // update (dt) {}

    editingDidBegan (event) {
        //cc.log('editing did began');
        this.showResultNode(false);  //一定时间内显示答案
    }

    textChanged (event) {
        //cc.log('text changed: ' + event);
        this.editText.string = event;
    }

    editingDidEnded (event) {
        //cc.log('editing did ended');
    }

    editingReturn (event) {
        //cc.log('editing retrun');
    }

    onSearchBtn(){
        AudioMgr.playEffect("effect/ui_click");
        if(this.bSearching == true){  //正在查询中
            return;
        }

        let keyStr = this.editText.string;
        if(keyStr && keyStr.length > 0){
            let layer = GameMgr.showLayer(this.pfCost);
            layer.getComponent(CostWarn).initCostData(0, ()=>{
                this.handleSearch();
            });
        }
    }

    handleSearch(){
        this.bSearching = true;
        let inputStr = this.editText.string;

        if(inputStr && inputStr.length > 0){
            let keys = Object.getOwnPropertyNames(CfgMgr.C_rubbish_info);
            let mathchArr = new Array();   //匹配数据
            for (let i=1; i<=keys.length; ++i) { // 遍历Map
                let idstr = keys[i];
                let obj: st_rubbish_info = CfgMgr.getRubbishConf(parseInt(idstr));
                if(obj){
                    if(inputStr == obj.name){
                        this.showSearchResult([{"mathchCount":100, "obj":obj, "idstr":idstr}], 1);
                        return;
                    }else{
                        let mathchCount = 0;
                        for(let j=0; j<inputStr.length; ++j){
                            if(obj.name.indexOf(inputStr[j]) != -1){   //indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。如果要检索的字符串值没有出现，则该方法返回 -1。
                                mathchCount ++;
                            }
                        }
                        if(mathchCount > 0){
                            mathchArr.push({"mathchCount":mathchCount, "obj":obj, "idstr":idstr});
                        }
                    }
                }
            }

            if(mathchArr.length > 0){
                mathchArr.sort((a:any, b:any)=>{ return b.mathchCount - a.mathchCount;})
                this.showSearchResult(mathchArr, 2);   //相似答案
            }else{
                //cc.log("没有找到相似的答案");
                this.showSearchResult([], -1);
            }
        }else{
            //cc.log("请输入查询关键字");
            this.bSearching = false;  //正在查询中
        }
    }

    showSearchResult(results: any[], resultType: number=0){
        //cc.log("showSearchResult() results = "+JSON.stringify(results));
        this.bSearching = false;  //正在查询中
        this.tableView.clear();

        if(results){   //{"mathchCount":mathchCount, "obj":obj}
            if(resultType == -1){
                this.resultLabel.string = "数据库中未找到匹配答案!";  
            }else{
                if(resultType == 1){
                    let conf: st_rubbish_info = results[0].obj;
                    this.resultLabel.string = "答案："+conf.name+"是"+conf.typeName;  
                }else if(resultType == 2){
                    this.resultLabel.string = "未找到匹配答案，可参考：";  
                }

                this.tableView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
                this.tableView.initTableView(results.length, { array: results, target: this }); 
            }

            this.showResultNode(true);  //一定时间内显示答案
        }
    }

    //一定时间内显示答案
    showResultNode(bShow:boolean){
        this.resultNode.stopAllActions();
        if(bShow == true){
            this.gameNode.active = false;
            this.resultNode.active = true;

            // this.resultNode.runAction(cc.sequence(cc.delayTime(5.0), cc.callFunc(function(){
            //     this.showResultNode(false);
            // }.bind(this))));
        }else{
            this.resultNode.active = false;
            this.gameNode.active = true;
        }
    }

    onHideRusult(){
        AudioMgr.playEffect("effect/ui_click");
        this.showResultNode(false);
    }

    onGame1Btn(){
        AudioMgr.playEffect("effect/ui_click");
        let layer = GameMgr.showLayer(this.pfCost);
        layer.getComponent(CostWarn).initCostData(1, ()=>{
            GameMgr.goToSceneWithLoading("game1Scene", true); 
        });
    }

    onGame2Btn(){
        AudioMgr.playEffect("effect/ui_click");
        let layer = GameMgr.showLayer(this.pfCost);
        layer.getComponent(CostWarn).initCostData(2, ()=>{
            GameMgr.goToSceneWithLoading("game2Scene", true); 
        });
    }

    onGameFightBtn(){
        GameMgr.gotoMainScene();
    }

    gameHandActions(){
        this.handSpr.node.runAction(cc.repeatForever(cc.sequence(
            cc.delayTime(0.3), cc.callFunc(function(){
                this.handSpr.spriteFrame = this.handFrames[1];
            }.bind(this)), cc.delayTime(0.3), cc.callFunc(function(){
                this.handSpr.spriteFrame = this.handFrames[0];
            }.bind(this))
        )));

        this.handSpr.node.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(5.0, cc.v2(250, -100)), cc.moveTo(5.0, cc.v2(-100, -100))
        )));
    }

    onBoxBtn(){
        GameMgr.boxTouchCount ++;
        if(GameMgr.boxTouchCount == 10 && SDKMgr.bAutoPlayVedio == false){
            GameMgr.boxTouchCount = 0;
            
            ROOT_NODE.ShowAdResultDialog();
        }
    }

}
