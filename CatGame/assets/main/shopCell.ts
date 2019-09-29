import viewCell from "../tableView/viewCell";
import { AudioMgr } from "../manager/AudioMgr";
import { st_shop_info, CfgMgr } from "../manager/ConfigManager";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { ROOT_NODE } from "../common/rootNode";
import { NotificationMy } from "../manager/NoticeManager";
import { NoticeType, BallInfo } from "../manager/Enum";
import { sdkWechat } from "../manager/SDK_Wechat";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopCell extends viewCell {

    @property(cc.Sprite)
    cellBg: cc.Sprite = null;
    @property(cc.Sprite)
    boxBg: cc.Sprite = null;
    @property(cc.Sprite)
    btnSpr: cc.Sprite = null;
    @property(cc.Sprite)
    btnIcon: cc.Sprite = null;
    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.Label)
    goldLabel: cc.Label = null;
    @property(cc.Label)
    diamondLabel: cc.Label = null;
    @property(cc.Label)
    weaponLabel: cc.Label = null;
    @property(cc.Label)
    itemLabel: cc.Label = null;

    @property(cc.SpriteAtlas)
    qualityAtlas: cc.SpriteAtlas = null;
    @property([cc.SpriteFrame])
    iconFrames: cc.SpriteFrame[] = new Array(3);
    @property([cc.SpriteFrame])
    bgFrames: cc.SpriteFrame[] = new Array(2);

    data : any = null;
    cellData : st_shop_info = null;  
    cellIdx : number = -1;  
  
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
            this.cellIdx = index; 
            this.cellData = this.data.array[this.cellIdx];
            this.node.active = true;
        //}

        this.onSelected(this._selectState);

        this.goldLabel.string = "金币约："+this.cellData.gold;
        this.diamondLabel.string = "钻石约："+this.cellData.diamond;
        this.weaponLabel.string = "武器概率："+(this.cellData.weapon*100)+"%";
        this.itemLabel.string = "饰品概率："+(this.cellData.item*100)+"%";

        this.boxBg.spriteFrame = this.qualityAtlas.getSpriteFrame("colorBg"+this.cellData.quality);
        if(this.cellIdx%2 == 0){
            this.cellBg.spriteFrame = this.bgFrames[0];
            this.btnSpr.spriteFrame = this.bgFrames[1];
        }else{
            this.cellBg.spriteFrame = this.bgFrames[1];
            this.btnSpr.spriteFrame = this.bgFrames[0];
        }

        if(this.cellData.vedio > 0){   //视频获取
            this.btnIcon.spriteFrame = this.iconFrames[0];
            this.numLabel.string = this.cellData.vedio.toString();
        }else if(this.cellData.costDiamond > 0){   //钻石获取
            this.btnIcon.spriteFrame = this.iconFrames[1];
            this.numLabel.string = this.cellData.costDiamond.toString();
        }else if(this.cellData.costGold > 0){   //金币获取
            this.btnIcon.spriteFrame = this.iconFrames[2];
            this.numLabel.string = this.cellData.costGold.toString();
        }else{
            this.btnIcon.spriteFrame = null;
            this.numLabel.string = "99999999";
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
            if(this.cellData.vedio > 0){   //视频获取
                let self = this;
                sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", false, ()=>{
                    console.log("reset 激励视频广告显示失败");
                }, (succ:boolean)=>{
                    console.log("reset 激励视频广告正常播放结束， succ = "+succ);
                    if(succ == true){
                        sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", true, null, null, self);   //预下载下一条视频广告
                        this.handleBuyShop();  
                    }else{
                        sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", true, null, null, self);   //预下载下一条视频广告
                    }
                }, self);   //播放下载的视频广告
            }else if(this.cellData.costDiamond > 0){   //钻石获取
                if(MyUserData.DiamondCount >= this.cellData.costDiamond){
                    MyUserDataMgr.updateUserDiamond(-this.cellData.costDiamond); 
                    this.handleBuyShop();
                }else{
                    ROOT_NODE.showGoldAddDialog();  //获取金币提示框
                }
            }else if(this.cellData.costGold > 0){   //金币获取
                if(MyUserData.GoldCount >= this.cellData.costGold){
                    MyUserDataMgr.updateUserGold(-this.cellData.costGold); 
                    this.handleBuyShop();
                }else{
                    ROOT_NODE.showGoldAddDialog();  //获取金币提示框
                }
            }
        }
    }

    //随机获得宝箱
    handleBuyShop(){
        //随机获取的金币值（0.5-1.0倍之间）
        if(this.cellData.costGold > 0){
            let gold = Math.floor((Math.random()*0.5 + 0.5)*this.cellData.costGold);
            if(gold > 0){
                ROOT_NODE.showTipsText("获得金币："+gold);
                MyUserDataMgr.updateUserGold(gold);
            }
        }
        //随机获取的金币值（0.3-1.0倍之间）
        if(this.cellData.costDiamond > 0){
            let diamond = Math.floor((Math.random()*0.7 + 0.3)*this.cellData.costDiamond);
            if(diamond > 0){
                ROOT_NODE.showTipsText("获得钻石："+diamond);
                MyUserDataMgr.updateUserDiamond(diamond);
            }
        }
        //随机获取武器的概率
        if(this.cellData.weapon > 0 && Math.random() <= this.cellData.weapon){
            let keys = Object.getOwnPropertyNames(CfgMgr.C_cannon_info);
            let idx = Math.floor(Math.random()*keys.length*0.99);
            let weaponId = parseInt(keys[idx]);
            let weaponCfg = CfgMgr.getCannonConf(weaponId);
            ROOT_NODE.showTipsText("获得："+weaponCfg.name);

            let ballInfo = new BallInfo(weaponId);
            MyUserDataMgr.addBallToBallList(ballInfo.clone(), true);  //添加小球到未出战列表
            NotificationMy.emit(NoticeType.BuyAddBall, ballInfo.clone());  //购买小球
        }
        //随机获取道具的概率
        if(this.cellData.item > 0 && Math.random() <= this.cellData.item){
            let keys = Object.getOwnPropertyNames(CfgMgr.C_item_info);
            let idx = Math.floor(Math.random()*keys.length*0.99);
            let itemId = parseInt(keys[idx]);
            let itemCfg = CfgMgr.getItemConf(itemId);
            ROOT_NODE.showTipsText("获得："+itemCfg.name);

            MyUserDataMgr.updateItemByCount(itemId, 1);  //修改用户背包物品列表
            NotificationMy.emit(NoticeType.UpdateItemList, null);   //刷新道具
        }
    }
}
