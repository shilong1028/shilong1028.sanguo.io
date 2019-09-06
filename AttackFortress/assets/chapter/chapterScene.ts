import TableView from "../tableView/tableView";
import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";
import LevelLayer from "./levelLayer";
import { LevelInfo } from "../manager/Enum";
import { MyUserData } from "../manager/MyUserData";

//关卡选择场景
const {ccclass, property} = cc._decorator;

@ccclass
export default class ChapterScene extends cc.Component {

    @property(TableView)
    tableView: TableView = null;
    @property(cc.Label)
    levelIdLabel: cc.Label = null;

    @property(cc.Prefab)
    Pflevel: cc.Prefab = null;
    @property(cc.Prefab)
    pfLevelLayer: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    start () {
        this.levelIdLabel.string = MyUserData.curLevelId.toString();

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
