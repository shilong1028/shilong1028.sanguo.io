
import TableView from "../tableView/tableView";
import { st_general_info, CfgMgr } from "../manager/ConfigManager";

//武将来投
const {ccclass, property} = cc._decorator;

@ccclass
export default class GeneralJoin extends cc.Component {

    @property(TableView)
    tableView: TableView = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    cellArr: st_general_info[] = new Array();

    onLoad () {
    }

    onDestroy(){
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {
    }

    // update (dt) {}

    onCloseBtn(){
        this.node.removeFromParent(true);
    }

    initGeneralIds(idArr: number[]){
        cc.log("initGeneralIds(), idArr = "+JSON.stringify(idArr));
        let nameStr = ""
        for(let i=0; i<idArr.length; ++i){
            let cardCfg = CfgMgr.getGeneralConf(idArr[i]);
            this.cellArr.push(cardCfg);
            nameStr += cardCfg.name;
            if(i < idArr.length-1){
                nameStr +="、";
            }
        }
        nameStr +="武将来投";
        this.descLabel.string = nameStr;

        this.tableView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
        this.tableView.initTableView(this.cellArr.length, { array: this.cellArr, target: this }); 
    }
}
