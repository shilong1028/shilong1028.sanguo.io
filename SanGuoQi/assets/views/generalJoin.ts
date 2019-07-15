
import TableView from "../tableView/tableView";
import { GeneralInfo } from "../manager/Enum";
import { MyUserMgr } from "../manager/MyUserData";

//武将来投
const {ccclass, property} = cc._decorator;

@ccclass
export default class GeneralJoin extends cc.Component {

    @property(TableView)
    tableView: TableView = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    cellArr: GeneralInfo[] = new Array();

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
            let info = new GeneralInfo(idArr[i]);
            this.cellArr.push(info);

            nameStr += info.generalCfg.name;
            if(i < idArr.length-1){
                nameStr +="、";
                MyUserMgr.addGeneralToList(info, false);   //添加武将到列表
            }else{
                MyUserMgr.addGeneralToList(info, true);
            }
        }
        nameStr +="武将来投";
        this.descLabel.string = nameStr;

        this.tableView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
        this.tableView.initTableView(this.cellArr.length, { array: this.cellArr, target: this }); 
    }
}
