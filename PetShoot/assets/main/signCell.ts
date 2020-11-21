import SignLayer from "./signLayer";
import { MyUserData } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";
import { st_sign_info, CfgMgr } from "../manager/ConfigManager";
import { ItemInfo, BallInfo } from "../manager/Enum";


//签到cell
const {ccclass, property} = cc._decorator;

@ccclass
export default class SignCell extends cc.Component {

    @property(cc.Label)
    dayLabel: cc.Label = null;   //第几天
    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;   //钻石或金币
    @property(cc.Sprite)
    colorSpr: cc.Sprite = null;   //道具品质
    @property(cc.Label)
    descLabel: cc.Label = null;   
    @property(cc.Node)
    maskNode: cc.Node = null;  //已经签到标签
    @property(cc.Sprite)
    bgSpr: cc.Sprite = null;
    @property(cc.SpriteFrame)
    curBgFrame: cc.SpriteFrame = null;  //当前可领取的签到背景
    
    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    @property([cc.SpriteFrame])
    iconFrames: cc.SpriteFrame[] = new Array(2);

    signIdx: number = 0;
    signData: st_sign_info = null;
    parentLayer: SignLayer = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.dayLabel.string = "";
        this.maskNode.active = false;
        this.colorSpr.spriteFrame = null;
        this.iconSpr.spriteFrame = null;
    }

    start () {

    }

    // update (dt) {}

    initSignCell(idx: number, parentLayer: SignLayer){
        this.signIdx = idx;  //1-7
        this.parentLayer = parentLayer;
        this.signData = CfgMgr.getSignConf(idx);

        this.dayLabel.string = this.signIdx.toString();
        this.descLabel.string = this.signData.desc;

        if(this.signData.type == 1){   //金币
            this.iconSpr.spriteFrame = this.iconFrames[0];
            this.iconSpr.node.scale = 1.0;
        }else if(this.signData.type == 2){   //钻石
            this.iconSpr.spriteFrame = this.iconFrames[1];
            this.iconSpr.node.scale = 1.0;
        }else if(this.signData.type == 3){   //饰品道具
            let itemInfo = new ItemInfo(this.signData.rewardId);
            this.iconSpr.spriteFrame = this.iconAtlas.getSpriteFrame("item_"+itemInfo.itemCfg.res);
            this.colorSpr.spriteFrame = this.iconAtlas.getSpriteFrame("colorBg_"+itemInfo.itemCfg.quality);
            this.iconSpr.node.scale = 0.5;
        }else if(this.signData.type == 4){   //武器
            let ballInfo = new BallInfo(this.signData.rewardId);
            this.iconSpr.spriteFrame = this.iconAtlas.getSpriteFrame("weapon_"+ballInfo.cannonCfg.res);
            this.colorSpr.spriteFrame = this.iconAtlas.getSpriteFrame("colorBg_"+ballInfo.cannonCfg.quality);
            this.iconSpr.node.scale = 0.5;
        }
        

        if(MyUserData.lastSignIdx >= 7){   //1-7
            this.onSigned();
        }else{
            if(idx <= MyUserData.lastSignIdx){
                this.onSigned();
            }else if(idx == MyUserData.lastSignIdx + 1){
                if(GameMgr.isSameDayWithCurTime(MyUserData.lastSignTime) == false){  //同一天
                    this.bgSpr.spriteFrame = this.curBgFrame;
                    this.onSelect();
                }
            }
        }

        if(this.signIdx == 7){
            this.bgSpr.node.width = 450;
            this.maskNode.width = 450;
        }else{
            this.bgSpr.node.width = 150;
            this.maskNode.width = 150;
        }
        
    }

    onSelect(){
        if(this.parentLayer){
            this.parentLayer.onSelectSignCell(this);
        }
    }

    onSigned(){
        this.maskNode.active = true;
    }

}
