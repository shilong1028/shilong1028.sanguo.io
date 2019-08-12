import { CfgMgr, st_rubbish_info } from "../manager/ConfigManager";
import { NoticeMgr, NoticeType } from "../manager/NoticeManager";
import { GameMgr } from "../manager/GameManager";
import CostWarn from "./costWarn";
import TableView from "../tableView/tableView";


//垃圾分类主界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class SearchScene extends cc.Component {

    @property(cc.Label)
    goldLabel: cc.Label = null;  //金币积分数量

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
    @property(cc.Node)
    classTipNode: cc.Node = null;   //无解时的提示

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

    @property(cc.Prefab)
    pfAddCost: cc.Prefab = null;   //积分获取

    // LIFE-CYCLE CALLBACKS:

    bSearching: boolean = false;   //正在查询中

    onLoad () {
        this.goldLabel.string = "";  //金币积分数量
        
        this.showResultNode(false);  //一定时间内显示答案
        this.showSearchResult(null);

        NoticeMgr.on(NoticeType.UpdateGold, this.UpdateGoldCount, this); 
    }

    onDestroy(){
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    start () {
        this.UpdateGoldCount();
        this.gameHandActions();
    }

    UpdateGoldCount(){
        this.goldLabel.string = GameMgr.getUserGold().toString();
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
        if(this.bSearching == true){  //正在查询中
            return;
        }

        let keyStr = this.editText.string;
        if(keyStr && keyStr.length > 0){
            let layer = GameMgr.showLayer(this.pfCost);
            layer.getComponent(CostWarn).initCostData(50, ()=>{
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
                cc.log("没有找到相似的答案");
                this.showSearchResult([], -1);
            }
        }else{
            cc.log("请输入查询关键字");
            this.bSearching = false;  //正在查询中
        }
    }

    showSearchResult(results: any[], resultType: number=0){
        cc.log("showSearchResult() results = "+JSON.stringify(results));
        this.bSearching = false;  //正在查询中
        this.tableView.clear();
        this.classTipNode.active = false;  //无解时的提示

        if(results){   //{"mathchCount":mathchCount, "obj":obj}
            if(resultType == -1){
                this.resultLabel.string = "数据库中未找到匹配答案!";  
                this.classTipNode.active = true;  //无解时的提示
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
            this.gameNode.opacity = 0;
            this.resultNode.opacity = 255;

            // this.resultNode.runAction(cc.sequence(cc.delayTime(5.0), cc.callFunc(function(){
            //     this.showResultNode(false);
            // }.bind(this))));
        }else{
            this.resultNode.opacity = 0;
            this.gameNode.opacity = 255;
        }
    }

    onHideRusult(){
        this.showResultNode(false);
    }

    onAddCost(){
        GameMgr.showLayer(this.pfAddCost);
    }

    onGame1Btn(){
        let layer = GameMgr.showLayer(this.pfCost);
        layer.getComponent(CostWarn).initCostData(10, ()=>{
            cc.director.loadScene("game1Scene");
        });
    }

    onGame2Btn(){
        let layer = GameMgr.showLayer(this.pfCost);
        layer.getComponent(CostWarn).initCostData(10, ()=>{
            cc.director.loadScene("game2Scene");
        });
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



}
