import TableView from "../tableView/tableView";
import { GameMgr } from "../manager/GameManager";
import { AudioMgr } from "../manager/AudioMgr";
import { SkillInfo } from "../manager/Enum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillLayer extends cc.Component {

    @property(TableView)
    tableView: TableView = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.initTableData();
    }

    // update (dt) {}

    initTableData(){
        let skillArr = [];
        for(let i=1; i<= GameMgr.SkillCount; ++i){
            skillArr.push(new SkillInfo(i));
        }

        this.tableView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
        this.tableView.initTableView(skillArr.length, { array: skillArr, target: this }); 
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.node.removeFromParent(true);
    }
}
