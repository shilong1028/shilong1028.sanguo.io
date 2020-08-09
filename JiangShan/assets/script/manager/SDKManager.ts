import { ChannelDef, FunMgr } from "./Enum";
import { sdkTT } from "./SDK_TT";
import { sdkWechat } from "./SDK_Wechat";
import { LDMgr, LDKey } from "./StorageManager";
import { GameMgr } from "./GameManager";
import { ROOT_NODE } from "../login/rootNode";


//微信头条等SDK管理器
const {ccclass, property} = cc._decorator;

@ccclass
class SDKManager_class  {
    Channel: string = "Default";
    WeChat: any = null;   //微信小游戏
    TT: any = null;  //字节跳动

    bAutoPlayVedio: boolean = false;
    adVedioPlaying: boolean = false;

    adMaxCount: number = 20;
    adTotalCount: number = 0;   //今日总的视频次数
    adDayCounts: any = null;   //每种视频观看次数
    bOpenVedioShop: boolean = false;   //是否开启视频商城
    autoAdTime: number = 0;
    timeOutId: any = null;

    sdkCheckSuccCallBack: any = null;   //SDK用户数据校验成功回调
    callBackTarget: any = null;

    bannerCheckTime: number = 15781541870000000000000000;   //字节跳动屏蔽Banner时间戳

    is_ad_sdk(){
        return cc.sys.platform === cc.sys.WECHAT_GAME;
    }
    isBrowser() {
        return cc.sys.isBrowser;
    }
    isMobile() {
        return cc.sys.isMobile;
    }
    isAndroid() {
        return cc.sys.os === cc.sys.OS_ANDROID;
    }
    isIOS() {
        return cc.sys.os === cc.sys.OS_IOS;
    }
    /**是否头条微信等广告平台 */
    is_ad_platform(){
        return cc.sys.platform === cc.sys.WECHAT_GAME && (SDKMgr.TT != null || SDKMgr.WeChat != null);
    }
    /** 判断是否微信小游戏平台(也有可能是头条渠道，需要先过滤掉头条小游戏渠道) */
    is_wechat_platform() {
        let is_wechat = cc.sys.platform === cc.sys.WECHAT_GAME && SDKMgr.WeChat != null && SDKMgr.Channel == ChannelDef.Wechat;
        return is_wechat;
    }
    /** 判断是否微信小游戏平台(也有可能是头条渠道，需要先过滤掉头条小游戏渠道) */
    is_tt_platform() {
        let is_tt = cc.sys.platform === cc.sys.WECHAT_GAME && SDKMgr.TT != null && SDKMgr.Channel == ChannelDef.TouTiao;
        return is_tt;
    }
    /**判断是否微信内置浏览器 */
    is_wechat_browser() {
        // Android wechat:mqqbrowser qq: mqqbrowser
        // iOS wechat:wechat qq: qq
        let ua = window.navigator.userAgent.toLowerCase();
        let is_wechat = ((cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT) || 
                        (ua.indexOf("micromessenger") > -1)) &&
                        SDKMgr.Channel == ChannelDef.Wechat;
        return is_wechat;
    }
    is_qq_browser() {
        let ua = window.navigator.userAgent.toLowerCase();
        let ua_res = ua.match(/\sQQ/i);
        if (ua_res && ua_res instanceof Array) {
            return ua_res[0] == " qq";
        } else {
            return false;
        }
    }
    is_safari_browser() {
        return cc.sys.browserType == cc.sys.BROWSER_TYPE_SAFARI;
    }


    /** 检查和初始化可用的SDK */
    initSDK(){
        SDKMgr.WeChat = (window as any).wx;  //微信小游戏
        SDKMgr.TT = (window as any).tt;;  //字节跳动   
        SDKMgr.bannerCheckTime = 1578754065000;  //毫秒数 字节跳动屏蔽Banner时间戳

        if(SDKMgr.is_tt_platform() == true){   //字节跳动小程序
            SDKMgr.WeChat = null;
            sdkTT.initSDK();
        }
        else if(SDKMgr.is_wechat_platform() == true){   //微信小游戏
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

        if(SDKMgr.is_tt_platform() == true){  
            sdkTT.loginTT();
        }
        else if(SDKMgr.is_wechat_platform() == true){   //微信小游戏
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
        if(SDKMgr.is_tt_platform() == true){   //头条小程序
            sdkTT.share(titleStr);
        }
        else if(SDKMgr.is_wechat_platform() == true){   //微信小游戏
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
        if(SDKMgr.is_tt_platform() == true){   //头条小程序
            let curTime = new Date().getTime();
            if(curTime > SDKMgr.bannerCheckTime){
                sdkTT.createBannerWithWidth("33a5n4jxb5h23h07h7");  //Banner广告
                setInterval(()=>{
                    sdkTT.createBannerWithWidth("33a5n4jxb5h23h07h7");
                }, 100000);   //每隔固定时间被调用一次
            }
        }
        else if(SDKMgr.is_wechat_platform() == true){   //微信小游戏
            sdkWechat.createBannerWithWidth("adunit-311e568f40c7b724");  //Banner广告
            setInterval(()=>{
                sdkWechat.createBannerWithWidth("adunit-311e568f40c7b724");
            }, 100000);   //每隔固定时间被调用一次
        }
    }

    removeBannerAd(){
        if(SDKMgr.is_tt_platform() == true){   //头条小程序
            sdkTT.removeBanner();
        }
        else if(SDKMgr.is_wechat_platform() == true){   //微信小游戏
            sdkWechat.removeBanner();
        }
    }

    getAdCountByKey(key: string){
        return SDKMgr.adDayCounts[key];
    }

    initAdDayCount(){
        let day = LDMgr.getItemInt(LDKey.KEY_LoginTime);   //上一个登录时间
        if(FunMgr.isSameDayWithCurTime(day) == false){  //非同一天
            LDMgr.setItem("ChapterVedioId", 0);   //章节奖励  》15
            LDMgr.setItem("FuhuoVedioId", 0);    //复活
            LDMgr.setItem("KaijuVedioId", 0);   //开局奖励
            LDMgr.setItem("UpLvVedioId", 0);   //宠物升级
            LDMgr.setItem("ShopVedioId", 0);    //商店    》15
            LDMgr.setItem("GoldVedioId", 0);   //添加金币    》15
            LDMgr.setItem("SignVedioId", 0);    //签到    》15
            LDMgr.setItem(LDKey.KEY_LoginTime, new Date().getTime());
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
        return SDKMgr.adTotalCount < SDKMgr.adMaxCount;
    }

    closeAutoPlayAdVedio(){
        if(SDKMgr.timeOutId){
            clearTimeout(SDKMgr.timeOutId);
            SDKMgr.timeOutId = null;
        }
        SDKMgr.autoAdTime = 0;
        if(SDKMgr.bAutoPlayVedio == true){
            SDKMgr.bAutoPlayVedio = false;
            ROOT_NODE.updateAdResultDialog();
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
            // if(GameMgr.getMainScene() != null){
            //     if(Math.random() > 0.5){
            //         GameMgr.getMainScene().gotoFightScene();
            //     }
            // }else if(FightMgr.getFightScene() != null){
            //     if(Math.random() > 0.5){
            //         FightMgr.getFightScene().exitFightScene();
            //     }
            // }
            let randomTime = Math.ceil(Math.random()*(30*Math.ceil(SDKMgr.adTotalCount/10)+1) + 50);
            if(SDKMgr.TT != null ){
                randomTime += Math.ceil(Math.random()*50 + 50);
            }
            SDKMgr.autoAdTime = randomTime;
            // if(SDKMgr.timeOutId){
            //     clearTimeout(SDKMgr.timeOutId);
            //     SDKMgr.timeOutId = null;
            // }
            // SDKMgr.timeOutId = setTimeout(()=>{
            //     autoVedioFunc();
            // }, randomTime*1000)
        }

        let autoVedioFunc = function(){
            // if(SDKMgr.bAutoPlayVedio != true || SDKMgr.canPlayAdByCount() == false){
            //     SDKMgr.closeAutoPlayAdVedio();
            //     return;
            // }

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
            GameMgr.showTipsDialog("今日视频次数已达最大限度（20-30次），请明日再来！", failCallback);
            return;
        }

        SDKMgr.adVedioPlaying = true;

        let succCallFunc = function(){
            SDKMgr.adTotalCount ++;
            SDKMgr.adDayCounts[adkey] ++;
            LDMgr.setItem(adkey, SDKMgr.adDayCounts[adkey]); 

            ROOT_NODE.updateAdResultDialog();

            SDKMgr.adVedioPlaying = false;

            succCallback();
        }

        let errorCallFunc = function(){
            SDKMgr.adVedioPlaying = false;
            SDKMgr.closeAutoPlayAdVedio();

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

        if(SDKMgr.is_tt_platform() == true){   //头条小程序
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
        else if(SDKMgr.is_wechat_platform() == true){   //微信小游戏
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

    //上传开放域数据
    setUserCloudStorage(key: string, val: string) {
        console.log("setUserCloudStorage(), key = "+key+"; val = "+val);
        if(SDKMgr.is_tt_platform() == true){   //头条小程序

        }
        else if(SDKMgr.is_wechat_platform() == true){   //微信小游戏
            sdkWechat.setUserCloudStorage(key, val);
        }
    }


}

export  let SDKMgr = new SDKManager_class();