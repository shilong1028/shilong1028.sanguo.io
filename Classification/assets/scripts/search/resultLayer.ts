import TableView from "../tableView/tableView";

//招募
const {ccclass, property} = cc._decorator;

@ccclass
export default class ResultLayer extends cc.Component {

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

    cellArr: ItemInfo[] = new Array();

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
            this.cellArr.push(new ItemInfo(401+i, 1));
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

        let item = this.cellArr[cellIdx];
        if(item && item.itemCfg){
            this.nameLabel.string = item.itemCfg.name;
            this.iconSpr.spriteFrame = this.iconFrames[cellIdx];
            this.descLabel.string = item.itemCfg.desc;
        }
    }

    onCloseBtn(){
        this.node.removeFromParent(true);
    }
}
