import TableView from "../tableView/tableView";
import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";
import LevelLayer from "./levelLayer";
import { LevelInfo, NoticeType } from "../manager/Enum";
import { MyUserData } from "../manager/MyUserData";
import { NotificationMy } from "../manager/NoticeManager";

//关卡选择场景
const {ccclass, property} = cc._decorator;

@ccclass
export default class ChapterScene extends cc.Component {

    @property(TableView)
    tableView: TableView = null;
    @property(cc.Label)
    levelIdLabel: cc.Label = null;
    @property(cc.Label)
    labGold: cc.Label = null;   //玩家金币数

    @property(cc.Prefab)
    Pflevel: cc.Prefab = null;
    @property(cc.Prefab)
    pfLevelLayer: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        NotificationMy.on(NoticeType.UpdateGold, this.UpdateGold, this);  //金币更新
    }

    onDestroy(){
        NotificationMy.offAll(this);
        this.node.targetOff(this);
    }


    /**更新金币数量 */
    UpdateGold(){
        let valStr = GameMgr.num2e(MyUserData.GoldCount);
        this.labGold.string = valStr;  //金币数量

        this.labGold.node.stopAllActions();
        this.labGold.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.3), cc.scaleTo(0.1, 1.0)));
    }

    start () {
        this.levelIdLabel.string = MyUserData.curLevelId.toString();
        this.UpdateGold();

        this.tableView.clear();
        this.initTableData();
    }

    initTableData(){
        let chapterList: number[] = new Array();
        for(let i=0; i<10; ++i){
            chapterList.push(i);
        }

        this.tableView.initTableView(chapterList.length, { array: chapterList, target: this }); 
    }

    // update (dt) {}

    /**选择关卡处理 */
    onSelectLeve(levelInfo: LevelInfo){
        let infoLayer = GameMgr.showLayer(this.pfLevelLayer);
        infoLayer.getComponent(LevelLayer).initLevelInfo(levelInfo);
    }

    //返回
    onBackBtn(){
        AudioMgr.playEffect("effect/ui_click");

        GameMgr.gotoMainScene();
    }
}
