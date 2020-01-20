import TableView from "../tableView/tableView";
import { CfgMgr } from "../manager/ConfigManager";
import { BeautifulInfo } from "../manager/Enum";

//招募
const {ccclass, property} = cc._decorator;

@ccclass
export default class BeautifulLayer extends cc.Component {

    @property(TableView)
    tableView: TableView = null;

    @property(cc.SpriteAtlas)
    beautifulAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:

    cellArr: BeautifulInfo[] = new Array();

    onLoad () {
    }

    onDestroy(){
        this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {
        let keys = Object.getOwnPropertyNames(CfgMgr.C_beautiful_info);
        for (let k of keys) {
            this.cellArr.push(new BeautifulInfo(parseInt(k)));
        }
        this.tableView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
        this.tableView.initTableView(this.cellArr.length, { array: this.cellArr, target: this }); 
    }

    // update (dt) {}

    onCloseBtn(){
        this.node.destroy();
    }
}
