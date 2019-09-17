import { FightMgr } from "../manager/FightManager";
import { GameMgr } from "../manager/GameManager";
import { AudioMgr } from "../manager/AudioMgr";
import { MyUserDataMgr, MyUserData } from "../manager/MyUserData";
import { SDKMgr } from "../manager/SDKManager";
import { TipsStrDef } from "../manager/Enum";
import { sdkWechat } from "../manager/SDK_Wechat";
import Item from "../common/item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FightResult extends cc.Component {

    @property(cc.Label)
    titleLabel: cc.Label = null;
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(cc.Label)
    rewardLabel: cc.Label = null;   //奖励数量

    @property(cc.Button)
    vedioBtn: cc.Button = null;
    @property(cc.Node)
    videoIcon: cc.Node = null;
    @property(cc.Node)
    shareIcon: cc.Node = null;

    @property([cc.Sprite])
    starSprs: cc.Sprite[] = new Array(3);
    @property(cc.SpriteFrame)
    grayFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    lightFrame: cc.SpriteFrame = null;

    @property(cc.Node)
    itemLayout: cc.Node = null;  //道具掉落
    @property(cc.Prefab)
    pfItem: cc.Prefab = null;  //道具

    rewardGold: number = 0;   //奖励金币

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.levelLabel.string = "";
        this.titleLabel.string = "";

        if(false){ 
            this.videoIcon.active = true;
            this.shareIcon.active = false;
        }else{
            this.videoIcon.active = false;
            this.shareIcon.active = true;
        }
    }

    start () {
        this.levelLabel.string = FightMgr.level_id.toString();  //第几关

        let stars = 0;
        this.rewardGold = 0;   //奖励金币
        if(FightMgr.win == true){
            this.titleLabel.string = "战斗胜利";
            stars = Math.ceil(0.01 + Math.random()*2.98);

            let levelCfg = FightMgr.level_info.levelCfg;

            this.rewardGold = Math.ceil(levelCfg.gold * 0.5 * stars); //1星为75%，3星为150%
            let probability = levelCfg.probability*stars * 3;
            if(MyUserData.curLevelId < 3 && MyUserData.curLevelId == FightMgr.level_id-1){
                probability *= 10;
            }
            for(let i=0; i<levelCfg.itemids.length; ++i){
                let itemId = levelCfg.itemids[i];

                if(Math.random() < probability){
                    let item = cc.instantiate(this.pfItem);
                    this.itemLayout.addChild(item);
                    item.getComponent(Item).initItemById(itemId);

                    MyUserDataMgr.updateItemByCount(itemId, 1);   //添加道具
                }
            }
        }else{
            this.titleLabel.string = "战斗失败";
        }
        this.rewardLabel.string = "+"+GameMgr.num2e(this.rewardGold);
        MyUserDataMgr.saveLevelFightInfo(FightMgr.level_id, FightMgr.win, stars);

        for(let i=0; i<3; ++i){
            if(i < stars){
                this.starSprs[i].spriteFrame = this.lightFrame;
            }else{
                this.starSprs[i].spriteFrame = this.grayFrame;
            }
        }
    }

    // update (dt) {}

    onBackBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.handleNormal(false);
    }

    onVedioBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.vedioBtn.interactable = false;       
        let self = this;
        if(this.shareIcon.active == true){
            SDKMgr.shareGame(TipsStrDef.KEY_Share, (succ:boolean)=>{
                console.log("reset 分享 succ = "+succ);
                if(succ == true){
                    self.handleNormal(true);  //复活或显示结算
                }else{
                    self.handleNormal(false);
                }
            },self);
        }else{
            sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", false, ()=>{
                console.log("reset 激励视频广告显示失败");
            }, (succ:boolean)=>{
                console.log("reset 激励视频广告正常播放结束， succ = "+succ);
                if(succ == true){
                    sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", true, null, null, self);   //预下载下一条视频广告
                    self.handleNormal(true);  //复活或显示结算
                }else{
                    sdkWechat.preLoadAndPlayVideoAd("adunit-dccf6a6b0bf49344", true, null, null, self);   //预下载下一条视频广告
                    self.handleNormal(false);
                }
            }, self);   //播放下载的视频广告
        }
    }

    //复活或显示结算
    handleNormal(bVedioSucc:boolean){
        if(bVedioSucc == true){
            MyUserDataMgr.updateUserGold(this.rewardGold*2);
        }else{
            MyUserDataMgr.updateUserGold(this.rewardGold);
        }
        //this.node.removeFromParent(true);
        GameMgr.gotoChapterScene();
    }
}
