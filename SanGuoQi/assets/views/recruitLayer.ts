import TableView from "../tableView/tableView";
import { ROOT_NODE } from "../common/rootNode";
import { ItemInfo } from "../manager/Enum";


//招募
const {ccclass, property} = cc._decorator;

@ccclass
export default class RecruitLayer extends cc.Component {

    @property(TableView)
    tableView: TableView = null;

    // LIFE-CYCLE CALLBACKS:

    cellArr: ItemInfo[] = new Array();

    onLoad () {
        ROOT_NODE.showLayerMoney(this.node, cc.v2(0, 360));    //一级界面上的金币钻石粮草公用控件
    }

    onDestroy(){
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {
        for(let i=0; i<4; ++i){
            this.cellArr.push(new ItemInfo(401+i, 1));
        }
        this.tableView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
        this.tableView.initTableView(this.cellArr.length, { array: this.cellArr, target: this }); 
    }

    // update (dt) {}

    onCloseBtn(){
        this.node.removeFromParent(true);
    }
}
