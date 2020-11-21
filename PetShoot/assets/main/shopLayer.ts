import TableView from "../tableView/tableView";
import { GameMgr } from "../manager/GameManager";
import { AudioMgr } from "../manager/AudioMgr";
import { CfgMgr, st_shop_info } from "../manager/ConfigManager";
import { SDKMgr } from "../manager/SDKManager";
import { GuideStepEnum, GuideMgr } from "../manager/GuideMgr";
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

    initTableData(bClear:boolean = false){
        if(bClear == true && this.tableView){
            this.tableView.clear();
        }
        let shopArr = [];

        if(SDKMgr.bOpenVedioShop == true){   //视频商城
            let adKeys = [
                "ChapterVedioId",   //章节奖励  》15
                "FuhuoVedioId",    //复活
                "KaijuVedioId",   //开局奖励
                "UpLvVedioId",   //宠物升级
                "ShopVedioId",    //商店    》15
                "GoldVedioId",    //添加金币    》15
                "SignVedioId",    //签到    》15
            ]
            for(let i=0; i< 7; ++i){
                let temp = new st_shop_info();
                temp.initAdShopCell(adKeys[i]);
                shopArr.push(temp);
            }
        }else{
            for(let i=1; i<= GameMgr.ShopCount; ++i){
                let shopCfg = CfgMgr.getShopConf(i);
                if(!SDKMgr.isSDK && shopCfg.vedio > 0){
                }else{
                    shopArr.push(shopCfg);
                }
            }
        }

        this.tableView.openListCellSelEffect(false);   //是否开启Cell选中状态变换
        this.tableView.initTableView(shopArr.length, { array: shopArr, target: this }); 
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.node.destroy();
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
                    tipsStr += ("\n获得两个："+weaponCfg.name);
                }else{
                    tipsStr += ("获得两个："+weaponCfg.name);
                }
            }
        }
        let ballInfo = new BallInfo(weaponId);
        MyUserDataMgr.addBallToBallList(ballInfo.clone(), true);  //添加小球到未出战列表

        //随机获取道具的概率
        keys = Object.getOwnPropertyNames(CfgMgr.C_item_info);
        bRandom = true;
        let itemId = 0;
        while(bRandom){
            let idx = Math.floor(Math.random()*keys.length*0.99);
            itemId = parseInt(keys[idx]);
            let itemCfg = CfgMgr.getItemConf(itemId);
            if(itemCfg && itemCfg.quality <= 2){
                bRandom = false;

                if(tipsStr.length > 0){
                    if(bGetWeaopn){
                        tipsStr += ("   获得两个："+itemCfg.name);
                    }else{
                        tipsStr += ("\n获得两个："+itemCfg.name);
                    }
                }else{
                    tipsStr += ("获得两个："+itemCfg.name);
                }
            }
        }
        MyUserDataMgr.addItemToItemList(new ItemInfo(itemId), false);  //修改用户背包物品列表
        MyUserDataMgr.addItemToItemList(new ItemInfo(itemId), true);  //修改用户背包物品列表
 
        ROOT_NODE.showTipsText(tipsStr);
    }
}
