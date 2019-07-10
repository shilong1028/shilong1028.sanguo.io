import TableView from "../tableView/tableView";
import { ROOT_NODE } from "../common/rootNode";
import { ItemInfo } from "../manager/Enum";
import { CfgMgr, st_item_info } from "../manager/ConfigManager";


//招募
const {ccclass, property} = cc._decorator;

@ccclass
export default class RecruitLayer extends cc.Component {

    @property(TableView)
    tableView: TableView = null;

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    @property([cc.SpriteFrame])
    iconFrames: cc.SpriteFrame[] = new Array(3);

    // LIFE-CYCLE CALLBACKS:

    cellArr: st_item_info[] = new Array();

    cellTitles: string[] = new Array("骑兵千人", "步兵千人", "弓兵千人");
    cellDescs: string[] = new Array("用于组建武将部曲，克制步兵", "用于组建武将部曲，克制弓兵", "用于组建武将部曲，克制骑兵");

    onLoad () {
        this.updateSelItemInfo(null);  //显示底部选中道具信息

        ROOT_NODE.showLayerMoney(this.node, cc.v2(0, 334));    //一级界面上的金币钻石粮草公用控件
    }

    onDestroy(){
        this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {
        for(let i=0; i<3; ++i){
            let soliderConf = CfgMgr.getItemConf(401+i);
            this.cellArr.push(soliderConf);
        }
        this.tableView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
        this.tableView.initTableView(this.cellArr.length, { array: this.cellArr, target: this }); 
        this.updateSelItemInfo(0);  //显示底部选中道具信息
    }

    // update (dt) {}

    handleSelCell(cellIdx: number){
        this.updateSelItemInfo(cellIdx);  //显示底部选中道具信息
    }

    /**显示底部选中道具信息 */
    updateSelItemInfo(cellIdx:number){
        this.iconSpr.spriteFrame = null;
        this.nameLabel.string = "";
        this.numLabel.string = "";
        this.descLabel.string = "";

        let itemConf = this.cellArr[cellIdx];
        if(itemConf){
            this.nameLabel.string = itemConf.name;
            this.iconSpr.spriteFrame = this.iconFrames[cellIdx];
            this.descLabel.string = itemConf.desc;
        }
    }

    onCloseBtn(){
        this.node.removeFromParent(true);
    }
}