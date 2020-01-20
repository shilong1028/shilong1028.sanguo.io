
import TableView from "../tableView/tableView";
import { GeneralInfo, ItemInfo, NoticeType } from "../manager/Enum";
import { MyUserMgr, MyUserData } from "../manager/MyUserData";
import { ROOT_NODE } from "../common/rootNode";
import Item from "../common/item";
import { GameMgr } from "../manager/GameManager";
import { NoticeMgr } from "../manager/NoticeManager";
import GeneralCell from "../common/generalCell";
import { SDKMgr } from "../manager/SDKManager";

//武将来投
const {ccclass, property} = cc._decorator;

@ccclass
export default class GeneralUnit extends cc.Component {

    @property(TableView)
    tableView: TableView = null;

    @property(cc.Label)
    descLabel: cc.Label = null;   //武将描述
    @property(cc.Label)
    bingNumLabel: cc.Label = null;  //部曲剩余兵力
    @property(cc.Node)
    bagItemNode: cc.Node = null;
    @property(cc.Label)
    bagNumLabel: cc.Label = null;  //背包数量

    @property(cc.Button)
    bagBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:
    selCellIdx: number = -1;   //选中的Cell索引
    selCellSc: GeneralCell = null;  //选中的武将cell
    selBingItem: ItemInfo = null;  //选中武将对应的士兵道具信息

    bBuying: boolean = false;   //正在购买中
    generalArr: GeneralInfo[] = new Array();


    onLoad () {
        ROOT_NODE.showLayerMoney(this.node, cc.v2(0, 380));    //一级界面上的金币钻石粮草公用控件
        this.clearShowInfo();
    }

    onDestroy(){
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {
        this.generalArr = MyUserMgr.getGeneralListClone();  //获取武将列表克隆

        this.tableView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
        this.tableView.initTableView(this.generalArr.length, { array: this.generalArr, target: this, bShowSel: true}); 
    }

    // update (dt) {}

    onCloseBtn(){
        this.node.destroy();
    }

    /**点击武将 */
    handleGeneralCellClick(cellIdx: number, cellSc: GeneralCell){
        if(this.selCellIdx == cellIdx){
            return;
        }
        this.selCellIdx = cellIdx;   //选中的Cell索引
        this.selCellSc = cellSc;  //选中的武将cell

        this.showSelGeneralUI();
    }

    clearShowInfo(){
        this.bingNumLabel.string = "部曲兵力：";
        this.descLabel.string = "";
        this.bagNumLabel.string = "x0";
        this.bagItemNode.destroyAllChildren();

        this.bagBtn.interactable = false;
    }

    showSelGeneralUI(){
        this.clearShowInfo();

        let selGeneralInfo: GeneralInfo = this.generalArr[this.selCellIdx];
        this.descLabel.string = selGeneralInfo.generalCfg.desc;

        let bingId = selGeneralInfo.generalCfg.bingzhong;
        this.selBingItem = MyUserMgr.getItemFromList(bingId);  //选中武将对应的士兵道具信息
        if(this.selBingItem){
            let itemNode = cc.instantiate(ROOT_NODE.pfItem);
            this.bagItemNode.addChild(itemNode, 10);
            itemNode.getComponent(Item).initItemData(this.selBingItem);

            this.bagNumLabel.string = "x"+this.selBingItem.count;
            if(this.selBingItem.count > 0){
                this.bagBtn.interactable = true;
            }
        }

        let maxBingCount = GameMgr.getMaxBingCountByLv(selGeneralInfo.generalLv);
        this.bingNumLabel.string = "部曲兵力："+selGeneralInfo.bingCount+"/"+maxBingCount;
        if(selGeneralInfo.bingCount >= maxBingCount){   //部曲满员
            this.bagBtn.interactable = false;
        }
    }

    onBagBtn(){
        if(this.bBuying == true){  //正在购买中
            return;
        } 
        if(this.selBingItem.count > 0){  //选中武将对应的士兵道具信息
            MyUserMgr.updateItemByCount(this.selBingItem.itemId, -1);  //修改用户背包物品列表
            this.updateGeneralBingCount();   //更新武将部曲士兵数量
        }
    }

    onBuyBtn(){
        if(this.bBuying == true){  //正在购买中
            return;
        } 
        let cost = Math.ceil(this.selBingItem.itemCfg.cost*2/1000);
        if(MyUserData.DiamondCount >= cost){  //选中武将对应的士兵道具信息
            MyUserMgr.updateUserDiamond(-cost);  //修改用户背包物品列表
            this.updateGeneralBingCount();   //更新武将部曲士兵数量
        }else{
            GameMgr.showGoldAddDialog();  //获取金币提示框
        }
    }

    /**视频免费按钮 */
    onVedioBtn(){
        SDKMgr.showVedioAd("GouBingVedioId", ()=>{
              //失败
        }, ()=>{
            this.updateGeneralBingCount();   //更新武将部曲士兵数量
        }); 
    }

    //更新武将部曲士兵数量
    updateGeneralBingCount(){
        let selGeneralInfo: GeneralInfo = this.generalArr[this.selCellIdx];
        selGeneralInfo.updateBingCount(1000);

        if(this.selCellSc && this.selCellSc.handelUpdateGeneral){
            this.selCellSc.handelUpdateGeneral(selGeneralInfo);
        }

        MyUserMgr.updateGeneralList(selGeneralInfo);   //修改用户武将列表
        this.bBuying = false;  //正在购买中

        this.showSelGeneralUI();

        if(GameMgr.curTaskConf.type == 4){   //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗 6学习技能 7攻城掠地
            GameMgr.handleStoryShowOver(GameMgr.curTaskConf);  //任务宣读(第一阶段）完毕处理
        }
    }
}
