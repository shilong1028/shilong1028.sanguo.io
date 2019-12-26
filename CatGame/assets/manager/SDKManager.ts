import { sdkWechat } from "./SDK_Wechat";
import { sdkTT } from "./SDK_TT";
import { LDMgr, LDKey } from "./StorageManager";
import { GameMgr } from "./GameManager";
import { FightMgr } from "./FightManager";
import { ROOT_NODE } from "../common/rootNode";
const {ccclass, property} = cc._decorator;

@ccclass
class SDKManager_class  {
    isSDK : boolean = false;
    WeiChat: any = null;   //微信小游戏
    QQ: any = null;  //qq小程序
    TT: any = null;  //字节跳动

    bAutoPlayVedio: boolean = false;
    adVedioPlaying: boolean = false;

    adTotalCount: number = 0;   //今日总的视频次数
    adDayCounts: any = null;   //每种视频观看次数
    bOpenVedioShop: boolean = false;   //是否开启视频商城

    sdkCheckSuccCallBack: any = null;   //SDK用户数据校验成功回调
    callBackTarget: any = null;

    bannerCheckTime: number = 1577121839000000;   //字节跳动屏蔽Banner时间戳

    /** 检查和初始化可用的SDK */
    initSDK(){
        SDKMgr.initAdDayCount();

        SDKMgr.WeiChat = (window as any).wx;  //微信小游戏
        //SDKMgr.TT = (window as any).tt;;  //字节跳动
        SDKMgr.bannerCheckTime = 1577121839000;  //毫秒数 字节跳动屏蔽Banner时间戳

        if(SDKMgr.TT != null){   //字节跳动小程序
            SDKMgr.isSDK = true;
            SDKMgr.WeiChat = null;
            sdkTT.initSDK();
        }
        else if(SDKMgr.WeiChat != null){   //微信小游戏
            SDKMgr.isSDK = true;
            SDKMgr.TT = null;
            sdkWechat.initSDK();
        }
        else {
            //cc.log("没有找到SDK对应信息");
        }
    }

    //设定SDK用户数据校验成功回调
    loginWithSDK(callback: any, target: any){
        this.sdkCheckSuccCallBack = callback;
        this.callBackTarget = target;

        if(SDKMgr.TT != null){  
            sdkTT.loginTT();
        }
        else if(SDKMgr.WeiChat != null){
            sdkWechat.loginWeiChat();
        }
        else{
            SDKMgr.SDK_Login();
        }
    }

    /**
     * 本地服务器验证OPPO会员信息
     * @param data OPPO平台返回的OPPO会员信息
     */
    SDK_Login(data:any=null){
        if(this.callBackTarget && this.sdkCheckSuccCallBack){  //SDK用户数据校验成功回调
            this.sdkCheckSuccCallBack.call(this.callBackTarget, data);
        }
        this.sdkCheckSuccCallBack = null;  
        this.callBackTarget = null;
    }

    //************************** 分享  ******************************** */
    shareCallTarget:any = null;
    shareCallback: any = null;

    /**分享 */
    shareGame(titleStr: string, callback:any = null, callTarget:any = null){
        this.shareCallback = callback;
        this.shareCallTarget = callTarget;
        if(SDKMgr.TT != null){   //小程序
            sdkTT.share(titleStr);
        }
        else if(SDKMgr.WeiChat != null){   //微信小游戏
            sdkWechat.share(titleStr);
        }
    }

    // handleShareSucc(){
    //     if(this.shareCallback && this.shareCallTarget){
    //         setTimeout(()=>{
    //             if(this.shareCallback && this.shareCallTarget){
    //                 this.shareCallback.call(this.shareCallTarget, true);
    //             }else{
    //             }
    //         }, 500)
    //     }else{
    //     }
    // }

    //Banner管理
    createrBannerAd(){
        if(SDKMgr.TT != null){   
            let curTime = new Date().getTime();
            if(curTime > SDKMgr.bannerCheckTime){
                sdkTT.createBannerWithWidth("33a5n4jxb5h23h07h7");  //Banner广告
                setInterval(()=>{
                    sdkTT.createBannerWithWidth("33a5n4jxb5h23h07h7");
                }, 100000);   //每隔固定时间被调用一次
            }
        }
        else if(SDKMgr.WeiChat != null){
            sdkWechat.createBannerWithWidth("adunit-0895b0ed4218bdfd");  //Banner广告
            setInterval(()=>{
                sdkWechat.createBannerWithWidth("adunit-0895b0ed4218bdfd");
            }, 100000);   //每隔固定时间被调用一次
        }
    }


    getAdCountByKey(key: string){
        return SDKMgr.adDayCounts[key];
    }

    initAdDayCount(){
        let day = LDMgr.getItemInt(LDKey.KEY_VedioTime);   //上一个视频时间
        if(GameMgr.isSameDayWithCurTime(day) == false){  //非同一天
            LDMgr.setItem("ChapterVedioId", 0);   //章节奖励  》15
            LDMgr.setItem("FuhuoVedioId", 0);    //复活
            LDMgr.setItem("KaijuVedioId", 0);   //开局奖励
            LDMgr.setItem("UpLvVedioId", 0);   //宠物升级
            LDMgr.setItem("ShopVedioId", 0);    //商店    》15
            LDMgr.setItem("GoldVedioId", 0);   //添加金币    》15
            LDMgr.setItem("SignVedioId", 0);    //签到    》15
        }

        SDKMgr.adDayCounts = {};
        SDKMgr.adTotalCount = 0;
        SDKMgr.adDayCounts["ChapterVedioId"] = LDMgr.getItemInt("ChapterVedioId");
        SDKMgr.adTotalCount += SDKMgr.adDayCounts["ChapterVedioId"];
        SDKMgr.adDayCounts["FuhuoVedioId"] = LDMgr.getItemInt("FuhuoVedioId");
        SDKMgr.adTotalCount += SDKMgr.adDayCounts["FuhuoVedioId"];
        SDKMgr.adDayCounts["KaijuVedioId"] = LDMgr.getItemInt("KaijuVedioId");
        SDKMgr.adTotalCount += SDKMgr.adDayCounts["KaijuVedioId"];
        SDKMgr.adDayCounts["UpLvVedioId"] = LDMgr.getItemInt("UpLvVedioId");
        SDKMgr.adTotalCount += SDKMgr.adDayCounts["UpLvVedioId"];
        SDKMgr.adDayCounts["ShopVedioId"] = LDMgr.getItemInt("ShopVedioId");
        SDKMgr.adTotalCount += SDKMgr.adDayCounts["ShopVedioId"];
        SDKMgr.adDayCounts["GoldVedioId"] = LDMgr.getItemInt("GoldVedioId");
        SDKMgr.adTotalCount += SDKMgr.adDayCounts["GoldVedioId"];
        SDKMgr.adDayCounts["SignVedioId"] = LDMgr.getItemInt("SignVedioId");
        SDKMgr.adTotalCount += SDKMgr.adDayCounts["SignVedioId"];
    }

    canPlayAdByCount(){
        return SDKMgr.adTotalCount < 30;
    }

    closeAutoPlayAdVedio(){
        SDKMgr.bAutoPlayVedio = false;
        ROOT_NODE.showTipsText("自动视频播放已关闭")
        if(GameMgr.getMainScene()){
            GameMgr.getMainScene().showAutoAdNode();
        }else{
            FightMgr.getFightScene().exitFightScene();
        }
    }

    autoPlayAdVedio(){
        if(SDKMgr.bAutoPlayVedio == true  && SDKMgr.canPlayAdByCount() == false){
            SDKMgr.closeAutoPlayAdVedio();
            return;
        }
        SDKMgr.bAutoPlayVedio = true;

        let adKeys = [
            "ChapterVedioId",
            "FuhuoVedioId",
            "KaijuVedioId",
            "UpLvVedioId",
            "ShopVedioId",
            "GoldVedioId"
        ]

        let handleAdOver = function(){
            if(GameMgr.getMainScene() != null){
                if(Math.random() > 0.5){
                    GameMgr.getMainScene().gotoFightScene();
                }
            }else if(FightMgr.getFightScene() != null){
                if(Math.random() > 0.5){
                    FightMgr.getFightScene().exitFightScene();
                }
            }

            let randomTime = Math.ceil(Math.random()*(30*Math.ceil(SDKMgr.adTotalCount/10)) + 50)*1000;
            console.log("handleAdOver randomTime = "+randomTime)
            setTimeout(()=>{
                autoVedioFunc();
            }, randomTime)
        }

        let autoVedioFunc = function(){
            if(SDKMgr.bAutoPlayVedio != true || SDKMgr.canPlayAdByCount() == false){
                SDKMgr.closeAutoPlayAdVedio();
                return;
            }

            let randomIdx = Math.floor(Math.random()*adKeys.length*0.99);
            let adKey = adKeys[randomIdx];
            SDKMgr.showVedioAd(adKey, handleAdOver, handleAdOver,()=>{
                SDKMgr.closeAutoPlayAdVedio();
            })
        }
        autoVedioFunc();
    }

    //显示视频广告
    showVedioAd(adkey:string, failCallback, succCallback, errorCallback=null){
        let adCount = SDKMgr.adDayCounts[adkey];
        console.log("showVedioAd adkey = "+adkey+"; adCount = "+adCount)
        if(adCount > 5){
            adkey = "SignVedioId";   //签到及其他视频
        }

        if(SDKMgr.canPlayAdByCount() == false){
            GameMgr.showTipsDialog("今日视频次数已达最大限度（30次），请明日再来！", failCallback);
            return;
        }

        SDKMgr.adVedioPlaying = true;

        let succCallFunc = function(){
            SDKMgr.adTotalCount ++;
            SDKMgr.adDayCounts[adkey] ++;
            LDMgr.setItem(adkey, SDKMgr.adDayCounts[adkey]); 

            SDKMgr.adVedioPlaying = false;

            succCallback();

            if(GameMgr.getMainScene()){
                GameMgr.getMainScene().updateAdCount();
            }
        }

        let errorCallFunc = function(){
            SDKMgr.adVedioPlaying = false;

            if(errorCallback){
                errorCallback();
            }else{
                failCallback();
            }
        }

        let failCallFunc = function(){
            SDKMgr.adVedioPlaying = false;
            failCallback();
        }

        if(SDKMgr.TT != null){   //小程序
            sdkTT.playVideoAd(adkey, ()=>{
                errorCallFunc();
            }, (succ:boolean)=>{
                if(succ){
                    succCallFunc();
                }else{
                    failCallFunc()
                }
            }, this);   //播放下载的视频广告 
        }
        else if(SDKMgr.WeiChat != null){
            sdkWechat.playVideoAd(adkey, ()=>{
                errorCallFunc();
            }, (succ:boolean)=>{
                if(succ){
                    succCallFunc();
                }else{
                    failCallFunc()
                }
            }, this);   //播放下载的视频广告 
        }
    }

}

export  let SDKMgr = new SDKManager_class();