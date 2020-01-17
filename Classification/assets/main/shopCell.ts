import viewCell from "../tableView/viewCell";
import { AudioMgr } from "../manager/AudioMgr";
import BagLayer from "./bagLayer";
import { ROOT_NODE } from "../common/rootNode";
import Stuff from "../common/Stuff";
import Item from "../common/item";
import { MyUserDataMgr } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";
import { BallInfo, TipsStrDef, ItemInfo } from "../manager/Enum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopCell extends viewCell {

    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(cc.Node)
    iconNode: cc.Node = null;

    data : any = null;
    cellData : any = null;  
    cellIdx : number = -1;  
    targetLayer: BagLayer = null;
    curListType: number = -1;

    iconChild: any = null;
  
    // LIFE-CYCLE CALLBACKS:

    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        if (index >= data.array.length) {
            //不显示
            this.cellData = null;  
            this.node.active = false;
            return;
        }

        if(data.gridType != this.curListType){
            this.iconNode.destroyAllChildren();
            this.iconChild = null;
        }

        //if(reload){
            this.data = data;   //{ array: list, target: x.js }
            this.targetLayer = data.target;
            this.cellIdx = index; 
            this.cellData = this.data.array[this.cellIdx];
            this.curListType = data.gridType;
            this.node.active = true;
        //}

        this.onSelected(this._selectState);

        if(this.curListType == 0){   //0装备小球，1饰品道具，2技能
            if(this.iconChild == null){
                this.iconChild = cc.instantiate(ROOT_NODE.pfStuff);
                this.iconNode.addChild(this.iconChild);
            }
            this.iconChild.getComponent(Stuff).setStuffData(this.cellData);  //设置地块小球模型数据
            this.iconChild.active = true;
            this.descLabel.string = this.cellData.cannonCfg.desc;
        }else if(this.curListType == 1){
            if(this.iconChild == null){
                this.iconChild = cc.instantiate(ROOT_NODE.pfItem);
                this.iconNode.addChild(this.iconChild);
            }
            this.iconChild.getComponent(Item).initItemByData(this.cellData);  //设置地块道具模型数据
            this.iconChild.active = true;
            this.descLabel.string = this.cellData.itemCfg.desc;
        }
    }

    onSelected(bSel){
        if(bSel){

        }else{

        }
    }

    //被点击时相应的方法
    clicked () {      
        this.onSelected(true);
    }

    onUsedBtn(){
        AudioMgr.playEffect("effect/ui_buy");

        let showPlayerInfo = this.targetLayer.curshowPlayerInfo;
        if(this.curListType == 0){   //0装备小球，1饰品道具，2技能
            if(showPlayerInfo && showPlayerInfo.useState == 1){   //已经拥有的炮台
                let equipBallInfo = null;
                if(showPlayerInfo.ballId > 0){
                    equipBallInfo = new BallInfo(showPlayerInfo.ballId);
                }
                showPlayerInfo.ballId = this.cellData.cannonId;
                ROOT_NODE.showTipsText("更新装备");

                MyUserDataMgr.updatePlayerFromList(showPlayerInfo);   //更新炮台到拥有的炮列表
                MyUserDataMgr.equipBallToPlayer(this.cellData.clone(), equipBallInfo);
            }else{
                ROOT_NODE.showTipsText(TipsStrDef.KEY_PlayerTip);
            }
        }else if(this.curListType == 1){
            if(showPlayerInfo && showPlayerInfo.useState == 1){   //已经拥有的炮台
                let equipItemInfo = null;
                if(showPlayerInfo.itemId > 0){
                    equipItemInfo = new ItemInfo(showPlayerInfo.itemId);
                }
                showPlayerInfo.itemId = this.cellData.itemId;
                ROOT_NODE.showTipsText("更新饰品");

                MyUserDataMgr.updatePlayerFromList(showPlayerInfo);   //更新炮台到拥有的炮列表
                MyUserDataMgr.equipItemToPlayer(this.cellData.clone(), equipItemInfo);
            }else{
                ROOT_NODE.showTipsText(TipsStrDef.KEY_PlayerTip);
            }
        }
        this.targetLayer.closeBagListView();
    }

    onDelBtn(){
        AudioMgr.playEffect("effect/ui_buy");
        let sellGold = 0;  
        if(this.curListType == 0){   //0装备小球，1饰品道具，2技能
            sellGold = this.cellData.cannonCfg.sell;
            MyUserDataMgr.sellBallFromBallList(this.cellData); 
        }else if(this.curListType == 1){
            sellGold = this.cellData.itemCfg.sell;
            MyUserDataMgr.sellItemFromItemList(this.cellData); 
        }
        if(sellGold > 0){
            GameMgr.showDelGainAni(sellGold);   //显示售卖收益 
            ROOT_NODE.showTipsText("饰品回收，获得金币："+sellGold);

            this.targetLayer.closeBagListView();
        }
    }

}
