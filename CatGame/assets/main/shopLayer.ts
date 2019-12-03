import TableView from "../tableView/tableView";
import { GameMgr } from "../manager/GameManager";
import { AudioMgr } from "../manager/AudioMgr";
import { CfgMgr } from "../manager/ConfigManager";
import { SDKMgr } from "../manager/SDKManager";
import { GuideStepEnum, GuideMgr } from "../manager/GuideMgr";
import ShopCell from "./shopCell";
import { MyUserDataMgr } from "../manager/MyUserData";
import { BallInfo, ItemInfo } from "../manager/Enum";
import { ROOT_NODE } from "../common/rootNode";

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
        let shopArr = [];
        for(let i=1; i<= GameMgr.ShopCount; ++i){
            let shopCfg = CfgMgr.getShopConf(i);
            if(!SDKMgr.isSDK && shopCfg.vedio > 0){
            }else{
                shopArr.push(shopCfg);
            }
        }

        this.tableView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
        this.tableView.initTableView(shopArr.length, { array: shopArr, target: this }); 
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.node.removeFromParent(true);
    }

    //点击商店，购买武器或饰品。
    guideBuy(step: GuideStepEnum){
        GuideMgr.showGuideLayer(null, ()=>{
            GuideMgr.endGuide_NewPlayer(step);
            this.handleGuideBuy();

            GameMgr.getMainScene().checkGuidePlayer();
        }, cc.size(200, 90), cc.v2(190, 105));
    }

    handleGuideBuy(){
        MyUserDataMgr.updateUserDiamond(-10); 
        let tipsStr = "";
        let bGetWeaopn = false;
        //随机获取武器的概率
        let keys = Object.getOwnPropertyNames(CfgMgr.C_cannon_info);
        let bRandom = true;
        let weaponId = 0;
        while(bRandom){
            let idx = Math.floor(Math.random()*keys.length*0.99);
            weaponId = parseInt(keys[idx]);
            let weaponCfg = CfgMgr.getCannonConf(weaponId);
            if(weaponCfg && weaponCfg.quality <= 2){
                bRandom = false;

                bGetWeaopn = true;
                if(tipsStr.length > 0){
                    tipsStr += ("\n获得："+weaponCfg.name);
                }else{
                    tipsStr += ("获得："+weaponCfg.name);
                }
                //ROOT_NODE.showTipsText("获得："+weaponCfg.name);
            }
        }
        let ballInfo = new BallInfo(weaponId);
        MyUserDataMgr.addBallToBallList(ballInfo.clone(), true);  //添加小球到未出战列表

        //随机获取道具的概率
        keys = Object.getOwnPropertyNames(CfgMgr.C_item_info);
        bRandom = true;
        let itemId1 = 0;
        let itemId2 = 0;
        while(bRandom){
            let idx = Math.floor(Math.random()*keys.length*0.99);
            let itemId = parseInt(keys[idx]);
            let itemCfg = CfgMgr.getItemConf(itemId);
            if(itemCfg && itemCfg.quality <= 3){
                if(itemId1 == 0){
                    itemId1 = itemId;
                }else if(itemId2 == 0){
                    itemId2 = itemId;
                }
                if(itemId1 > 0 && itemId2 > 0){
                    bRandom = false;
                }

                if(tipsStr.length > 0){
                    if(bGetWeaopn){
                        tipsStr += ("   获得："+itemCfg.name);
                    }else{
                        tipsStr += ("\n获得："+itemCfg.name);
                    }
                }else{
                    tipsStr += ("获得："+itemCfg.name);
                }
                //ROOT_NODE.showTipsText("获得："+itemCfg.name);
            }
        }
        MyUserDataMgr.addItemToItemList(new ItemInfo(itemId1), false);  //修改用户背包物品列表
        MyUserDataMgr.addItemToItemList(new ItemInfo(itemId2), true);  //修改用户背包物品列表
 
        ROOT_NODE.showTipsText(tipsStr);
    }
}
