import TableView from "../tableView/tableView";
import { AudioMgr } from "../manager/AudioMgr";
import { PlayerInfo, NoticeType } from "../manager/Enum";
import { MyUserData } from "../manager/MyUserData";
import { NotificationMy } from "../manager/NoticeManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerLayer extends cc.Component {

    @property(TableView)
    tableView: TableView = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        NotificationMy.on(NoticeType.UpdatePlayer, this.initTableData, this);  //炮台更新
    }

    onDestroy(){
        NotificationMy.offAll(this);
        this.node.targetOff(this);
    }

    start () {
        this.initTableData();
    }

    // update (dt) {}

    initTableData(){
        let ballArr = new Array();
        for(let i=1; i<= 3; ++i){
            let useState = 0;  //使用状态，0未拥有，1已拥有，2使用中
            for(let j=0; j<MyUserData.playerList.length; ++j){
                if(MyUserData.playerList[j].playerId == i){
                    useState = 1;
                    if(j == MyUserData.curPlayerIdx){
                        useState = 2;
                    }
                    let info = MyUserData.playerList[j].clone();
                    info.useState = useState;
                    ballArr.push(info);
                    break;
                }
            }
            if(useState == 0){
                ballArr.push(new PlayerInfo(i));
            }
        }

        this.tableView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
        this.tableView.initTableView(ballArr.length, { array: ballArr, target: this }); 
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/hecheng/ui_click");
        this.node.removeFromParent(true);
    }
}
