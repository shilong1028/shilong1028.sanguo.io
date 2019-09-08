import TableView from "../tableView/tableView";
import { AudioMgr } from "../manager/AudioMgr";
import { MyUserDataMgr } from "../manager/MyUserData";
import { ItemInfo, PlayerInfo } from "../manager/Enum";
import { ROOT_NODE } from "../common/rootNode";
import Item from "../common/item";
import { FightMgr } from "../manager/FightManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class playerItemLayer extends cc.Component {

    @property(TableView)
    tableView: TableView = null;
    @property(cc.Label)
    itemDesc: cc.Label = null;

    @property(cc.Label)
    atkLabel: cc.Label = null;
    @property(cc.Label)
    baojiLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Sprite)
    playerSpr: cc.Sprite = null;

    @property(cc.Prefab)
    pfItem: cc.Prefab = null;

    @property(cc.SpriteAtlas)
    playerAtlas: cc.SpriteAtlas = null;

    @property([cc.Node])
    itemNodes: cc.Node[] = new Array(3);
    @property([cc.Node])
    itemCloses: cc.Node[] = new Array(3);

    // LIFE-CYCLE CALLBACKS:

    selItemInfo: ItemInfo = null;  //选中的道具
    palyerInfo: PlayerInfo = null;  //炮台信息
    equipItemList: ItemInfo[] = new Array();

    onLoad () {
        this.itemDesc.string = "";
        this.atkLabel.string = "提升攻击：";
        this.baojiLabel.string = "提升暴击：";
        this.nameLabel.string = "";
        this.playerSpr.spriteFrame = null;

        for(let i=0; i<3; ++i){
            this.itemNodes[i].active = false;
            this.itemCloses[i].active = false;
        }
    }

    onDestroy(){

    }

    start () {
        let playerInfo: PlayerInfo = MyUserDataMgr.getCurPlayerInfo();
        this.palyerInfo = playerInfo;
        if(playerInfo){
            let cfg = playerInfo.playerCfg;
            this.atkLabel.string = "提升攻击："+cfg.attack_up*100+"%";
            this.baojiLabel.string = "提升暴击："+cfg.baoji_up*100+"%";
            this.nameLabel.string = cfg.name;
            this.playerSpr.spriteFrame = this.playerAtlas.getSpriteFrame("player_"+playerInfo.playerId);

            for(let i=0; i<cfg.itemCount; ++i){
                this.itemNodes[i].active = true;
                this.itemCloses[i].active = false;
            }
        }

        this.initTableData();
    }

    // update (dt) {}

    initTableData(){
        let itemList = MyUserDataMgr.getItemListClone();
        this.tableView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
        this.tableView.initTableView(itemList.length, { array: itemList, target: this }); 
    }

    /**选中出战Cell */
    handleSelCell(cellIdx:number, cellData: ItemInfo){
        this.selItemInfo = cellData;  //选中的道具
        this.itemDesc.string = this.selItemInfo.itemCfg.desc;
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        cc.log("this.equipItemList = "+JSON.stringify(this.equipItemList));
        
        if(this.equipItemList == null || this.equipItemList.length == 0){
            ROOT_NODE.showTipsDialog("确定炮台不装备任何道具出战？", ()=>{
                FightMgr.getFightScene().setPlayerItems(this.equipItemList);
                this.node.removeFromParent(true);
            });
        }else{
            FightMgr.getFightScene().setPlayerItems(this.equipItemList);
            this.node.removeFromParent(true);
        }
    }

    onItemCloseBtn(sender: any, customData: string){
        AudioMgr.playEffect("effect/ui_click");
        let idx = parseInt(customData);
        let itemNode = this.itemNodes[idx].getChildByName("ItemNode");
        if(itemNode){
            let itemInfo = itemNode.getComponent(Item).itemInfo;
            ROOT_NODE.showTipsDialog("是否卸载该孔位装备？", ()=>{
                for(let i=0; i<this.equipItemList.length; ++i){
                    if(this.equipItemList[i].itemId == itemInfo.itemId){
                        this.equipItemList.splice(i, 1);
                        this.itemCloses[i].active = false;
                        break;
                    }
                }
                this.itemNodes[idx].removeAllChildren(true);
            });
        }else{
            ROOT_NODE.showTipsText("该孔位没有装备！");
        }
    }

    onEquipBtn(){
        AudioMgr.playEffect("effect/ui_click");

        if(this.selItemInfo == null){
            ROOT_NODE.showTipsText("请选择需要装备的道具！");
            return;
        }

        for(let i=0; i<this.equipItemList.length; ++i){
            if(this.equipItemList[i].itemId == this.selItemInfo.itemId){
                ROOT_NODE.showTipsText("道具"+this.selItemInfo.itemCfg.name+"已经装备了！");
                return;
            }
        }

        for(let i=0; i<3; ++i){
            if(this.itemNodes[i].active == true){
                let itemNode = this.itemNodes[i].getChildByName("ItemNode");
                if(itemNode == null){
                    this.equipItemList.push(this.selItemInfo);
                    this.handleEquipItem(i, this.selItemInfo.clone())
                    return;
                }
            }
        }

        ROOT_NODE.showTipsText("炮台孔位已满，不可装备！");
    }

    handleEquipItem(idx: number, itemInfo: ItemInfo){
        let itemNode = cc.instantiate(this.pfItem);
        itemNode.name = "ItemNode";
        this.itemNodes[idx].addChild(itemNode, 10);
        itemNode.getComponent(Item).initItemByData(itemInfo, false); 
        this.itemCloses[idx].active = true;
    }
}
