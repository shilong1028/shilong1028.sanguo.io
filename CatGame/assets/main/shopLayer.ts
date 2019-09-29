import TableView from "../tableView/tableView";
import { GameMgr } from "../manager/GameManager";
import { AudioMgr } from "../manager/AudioMgr";
import { CfgMgr } from "../manager/ConfigManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopLayer extends cc.Component {

    @property(TableView)
    tableView: TableView = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.initTableData();
    }

    // update (dt) {}

    initTableData(){
        let shopArr = new Array();
        for(let i=1; i<= GameMgr.ShopCount; ++i){
            shopArr.push(CfgMgr.getShopConf(i));
        }

        this.tableView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
        this.tableView.initTableView(shopArr.length, { array: shopArr, target: this }); 
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.node.removeFromParent(true);
    }
}
