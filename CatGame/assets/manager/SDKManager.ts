import { sdkWechat } from "./SDK_Wechat";
import { sdkQQ } from "./SDK_QQ";
import { sdkTT } from "./SDK_TT";
import { LDMgr, LDKey } from "./StorageManager";
import { GameMgr } from "./GameManager";
const {ccclass, property} = cc._decorator;

@ccclass
class SDKManager_class  {
    isSDK : boolean = false;
    WeiChat: any = null;   //微信小游戏
    QQ: any = null;  //qq小程序
    TT: any = null;  //字节跳动

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

    getAdCountByKey(key: string){
        return SDKMgr.adDayCounts[key];
    }

    initAdDayCount(){
        let day = LDMgr.getItemInt(LDKey.KEY_LoginDay);   //登录时间(天)
        if(GameMgr.isSameDayWithCurTime(day) == false){  //非同一天
            LDMgr.setItem("ChapterVedioId", 0);   //章节奖励  》15
            LDMgr.setItem("FuhuoVedioId", 0);    //复活
            LDMgr.setItem("KaijuVedioId", 0);   //开局奖励
            LDMgr.setItem("UpLvVedioId", 0);   //宠物升级
            LDMgr.setItem("ShopVedioId", 0);    //商店    》15
            LDMgr.setItem("GoldVedioId", 0);   //添加金币    》15
            LDMgr.setItem("SignVedioId", 0);    //签到    》15
        }
        LDMgr.setItem(LDKey.KEY_LoginDay, new Date().getTime());   //登录时间(天)

        SDKMgr.adDayCounts = {};
        SDKMgr.adDayCounts["ChapterVedioId"] = LDMgr.getItemInt("ChapterVedioId");
        SDKMgr.adDayCounts["FuhuoVedioId"] = LDMgr.getItemInt("FuhuoVedioId");
        SDKMgr.adDayCounts["KaijuVedioId"] = LDMgr.getItemInt("KaijuVedioId");
        SDKMgr.adDayCounts["UpLvVedioId"] = LDMgr.getItemInt("UpLvVedioId");
        SDKMgr.adDayCounts["ShopVedioId"] = LDMgr.getItemInt("ShopVedioId");
        SDKMgr.adDayCounts["GoldVedioId"] = LDMgr.getItemInt("GoldVedioId");
        SDKMgr.adDayCounts["SignVedioId"] = LDMgr.getItemInt("SignVedioId");
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

    //显示视频广告
    showVedioAd(adkey:string, failCallback, succCallback){
        let adCount = SDKMgr.adDayCounts[adkey];
        if(adCount > 5){
            adkey = "SignVedioId";   //签到及其他视频
        }

        let succCallFunc = function(){
            SDKMgr.adDayCounts[adkey] ++;
            LDMgr.setItem(adkey, SDKMgr.adDayCounts[adkey]); 

            succCallback();
        }

        if(SDKMgr.TT != null){   //小程序
            sdkTT.playVideoAd(adkey, ()=>{
                failCallback();
            }, (succ:boolean)=>{
                if(succ){
                    succCallFunc();
                }else{
                    failCallback()
                }
            }, this);   //播放下载的视频广告 
        }
        else if(SDKMgr.WeiChat != null){
            sdkWechat.playVideoAd(adkey, ()=>{
                failCallback();
            }, (succ:boolean)=>{
                if(succ){
                    succCallFunc();
                }else{
                    failCallback()
                }
            }, this);   //播放下载的视频广告 
        }
    }

}

export  let SDKMgr = new SDKManager_class();