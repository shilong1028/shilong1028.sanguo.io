import viewCell from "../tableView/viewCell";
import { AudioMgr } from "../manager/AudioMgr";
import { st_shop_info, CfgMgr } from "../manager/ConfigManager";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { ROOT_NODE } from "../common/rootNode";
import { BallInfo, ItemInfo } from "../manager/Enum";
import { sdkWechat } from "../manager/SDK_Wechat";
import { GameMgr } from "../manager/GameManager";
import { SDKMgr } from "../manager/SDKManager";
import ShopLayer from "./shopLayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopCell extends viewCell {

    @property(cc.Sprite)
    cellBg: cc.Sprite = null;
    @property(cc.Sprite)
    boxSpr: cc.Sprite = null;
    @property(cc.Sprite)
    btnSpr: cc.Sprite = null;
    @property(cc.Sprite)
    btnIcon: cc.Sprite = null;
    @property(cc.Label)
    numLabel: cc.Label = null;
    @property(cc.Label)
    descLabel: cc.Label = null;

    @property(cc.Label)
    goldLabel: cc.Label = null;
    @property(cc.Label)
    diamondLabel: cc.Label = null;
    @property(cc.Label)
    weaponLabel: cc.Label = null;
    @property(cc.Label)
    itemLabel: cc.Label = null;

    @property([cc.SpriteFrame])
    boxFrames: cc.SpriteFrame[] = new Array(3);
    @property([cc.SpriteFrame])
    iconFrames: cc.SpriteFrame[] = new Array(3);
    @property([cc.SpriteFrame])
    bgFrames: cc.SpriteFrame[] = new Array(2);

    data : any = null;
    cellData : st_shop_info = null;  
    cellIdx : number = -1;  
    targetLayer: ShopLayer = null;
  
    // LIFE-CYCLE CALLBACKS:

    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        if (index >= data.array.length) {
            //不显示
            this.cellData = null;  
            this.node.active = false;
            return;
        }

        //if(reload){
            this.data = data;   //{ array: list, target: x.js }
            this.targetLayer = data.target;
            this.cellIdx = index; 
            this.cellData = this.data.array[this.cellIdx];
            this.node.active = true;
        //}

        this.onSelected(this._selectState);

        if(SDKMgr.bOpenVedioShop == true){   //视频商城
            this.goldLabel.string = "已看次数："+SDKMgr.getAdCountByKey(this.cellData.name);
            this.diamondLabel.string = "最大次数： 5"
            this.weaponLabel.string = this.cellData.name;
            this.itemLabel.string = "";
        }else{
            this.goldLabel.string = "金币约："+this.cellData.gold;
            this.diamondLabel.string = "钻石约："+this.cellData.diamond;
            this.weaponLabel.string = "武器概率："+(this.cellData.weapon*100)+"%";
            this.itemLabel.string = "饰品概率："+(this.cellData.item*100)+"%";
        }

        this.descLabel.string = this.cellData.desc;

        this.boxSpr.spriteFrame = this.boxFrames[this.cellData.res-1];
        if(this.cellIdx%2 == 0){
            this.cellBg.spriteFrame = this.bgFrames[0];
            this.btnSpr.spriteFrame = this.bgFrames[1];
        }else{
            this.cellBg.spriteFrame = this.bgFrames[1];
            this.btnSpr.spriteFrame = this.bgFrames[0];
        }

        if(this.cellData.vedio > 0){   //视频获取
            this.btnIcon.spriteFrame = this.iconFrames[2];
            this.numLabel.string = this.cellData.vedio.toString();
        }else if(this.cellData.costDiamond > 0){   //钻石获取
            this.btnIcon.spriteFrame = this.iconFrames[1];
            this.numLabel.string = this.cellData.costDiamond.toString();
        }else if(this.cellData.costGold > 0){   //金币获取
            this.btnIcon.spriteFrame = this.iconFrames[0];
            this.numLabel.string = this.cellData.costGold.toString();
        }else{
            this.btnIcon.spriteFrame = null;
            this.numLabel.string = "未开启";
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

    onBuyBtn(){
        AudioMgr.playEffect("effect/ui_buy");

        if(this.cellData){
            if(SDKMgr.bOpenVedioShop == true){   //视频商城
                let adCount = SDKMgr.getAdCountByKey(this.cellData.name);
                if(adCount <= 5){
                    SDKMgr.showVedioAd(this.cellData.name, ()=>{
                        //失败
                  }, ()=>{
                        //成功
                        if(this.targetLayer){
                            this.targetLayer.initTableData(true);
                        }
                  }); 
                }
            }else{
                if(this.cellData.vedio > 0){   //视频获取
                    SDKMgr.showVedioAd("ShopVedioId", ()=>{
                          //失败
                    }, ()=>{
                        this.handleBuyShop();  //成功
                    }); 
                }else if(this.cellData.costDiamond > 0){   //钻石获取
                    if(MyUserData.DiamondCount >= this.cellData.costDiamond){
                        MyUserDataMgr.updateUserDiamond(-this.cellData.costDiamond); 
                        this.handleBuyShop();
                    }else{
                        GameMgr.showGoldAddDialog();  //获取金币提示框
                    }
                }else if(this.cellData.costGold > 0){   //金币获取
                    if(MyUserData.GoldCount >= this.cellData.costGold){
                        MyUserDataMgr.updateUserGold(-this.cellData.costGold); 
                        this.handleBuyShop();
                    }else{
                        GameMgr.showGoldAddDialog();  //获取金币提示框
                    }
                }
            }
        }
    }

    //随机获得宝箱
    handleBuyShop(){
        let tipsStr = "";
        //随机获取的金币值（0.5-1.0倍之间）
        if(this.cellData.gold > 0){
            let gold = Math.floor((Math.random()*0.5 + 0.5)*this.cellData.gold);
            if(gold > 0){
                tipsStr += ("获得金币："+gold);
                //ROOT_NODE.showTipsText("获得金币："+gold);
                MyUserDataMgr.updateUserGold(gold);
            }
        }
        //随机获取的金币值（0.3-1.0倍之间）
        if(this.cellData.diamond > 0){
            let diamond = Math.floor((Math.random()*0.5 + 0.5)*this.cellData.diamond);
            if(diamond > 0){
                if(tipsStr.length > 0){
                    tipsStr += ("   获得钻石："+diamond);
                }else{
                    tipsStr += ("获得钻石："+diamond);
                }
                //ROOT_NODE.showTipsText("获得钻石："+diamond);
                MyUserDataMgr.updateUserDiamond(diamond);
            }
        }
        let bGetWeaopn = false;
        //随机获取武器的概率
        if(this.cellData.weapon > 0 && Math.random() <= this.cellData.weapon){
            let keys = Object.getOwnPropertyNames(CfgMgr.C_cannon_info);
            let bRandom = true;
            let weaponId = 0;
            while(bRandom){
                let idx = Math.floor(Math.random()*keys.length*0.99);
                weaponId = parseInt(keys[idx]);
                let weaponCfg = CfgMgr.getCannonConf(weaponId);
                if(weaponCfg && weaponCfg.quality <= this.cellData.quality){
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
        }
        //随机获取道具的概率
        if(this.cellData.item > 0 && Math.random() <= this.cellData.item){
            let keys = Object.getOwnPropertyNames(CfgMgr.C_item_info);
            let bRandom = true;
            let itemId = 0;
            while(bRandom){
                let idx = Math.floor(Math.random()*keys.length*0.99);
                itemId = parseInt(keys[idx]);
                let itemCfg = CfgMgr.getItemConf(itemId);
                if(itemCfg && itemCfg.quality <= this.cellData.quality){
                    bRandom = false;

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
            MyUserDataMgr.addItemToItemList(new ItemInfo(itemId), true);  //修改用户背包物品列表
        }
        ROOT_NODE.showTipsText(tipsStr);
    }
}
