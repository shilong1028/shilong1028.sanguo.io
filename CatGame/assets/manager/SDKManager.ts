import { sdkWechat } from "./SDK_Wechat";
import { sdkQQ } from "./SDK_QQ";
const {ccclass, property} = cc._decorator;

@ccclass
class SDKManager_class  {
    isSDK : boolean = false;
    WeiChat: any = null;   //微信小游戏
    QQ: any = null;  //qq小程序

    sdkCheckSuccCallBack: any = null;   //SDK用户数据校验成功回调
    callBackTarget: any = null;

    /** 检查和初始化可用的SDK */
    initSDK(){
        //console.log("initSDK()");
        SDKMgr.WeiChat = (window as any).wx;  //微信小游戏
        SDKMgr.QQ = (window as any).qq;   //qq小程序

        if(SDKMgr.WeiChat != null){   //微信小游戏
            SDKMgr.isSDK = true;
            sdkWechat.initSDK();
        }else if(SDKMgr.QQ != null){   //qq小程序
            SDKMgr.isSDK = true;
            sdkQQ.initSDK();
        }
        else{
            cc.log("没有找到SDK对应信息");
        }
    }

    //设定SDK用户数据校验成功回调
    loginWithSDK(callback: any, target: any){
        //console.log("loginWithSDK")
        this.sdkCheckSuccCallBack = callback;
        this.callBackTarget = target;

        if(this.WeiChat != null){
            sdkWechat.loginWeiChat();
        }
        else if(SDKMgr.QQ != null){   //qq小程序
            sdkQQ.loginQQ();
        }
        else{
            cc.log("没有找到SDK平台")
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
        if(SDKMgr.WeiChat != null){   //微信小游戏
            sdkWechat.share(titleStr);
        }else if(SDKMgr.QQ != null){   //qq小程序
            sdkQQ.share(titleStr);
        }
    }

    handleShareSucc(){
        if(this.shareCallback && this.shareCallTarget){
            setTimeout(()=>{
                if(this.shareCallback && this.shareCallTarget){
                    this.shareCallback.call(this.shareCallTarget, true);
                }else{
                    //console.log("分享回调错误");
                }
            }, 500)
        }else{
            //console.log("无分享回调");
        }
    }

    //Banner管理
    createrBannerAd(){
        if(SDKMgr.WeiChat){
            sdkWechat.createBannerWithWidth("adunit-0895b0ed4218bdfd");  //Banner广告
            setInterval(()=>{
                sdkWechat.createBannerWithWidth("adunit-0895b0ed4218bdfd");
            }, 200000);   //每隔固定时间被调用一次
        }
        else if(SDKMgr.QQ != null){   //qq小程序
            sdkQQ.createBannerWithWidth("d4fbb33ed6b0b8168d06c601fd107119");  //Banner广告
            setInterval(()=>{
                sdkQQ.createBannerWithWidth("d4fbb33ed6b0b8168d06c601fd107119");
            }, 200000);   //每隔固定时间被调用一次
        }
    }

    //显示视频广告
    showVedioAd(adkey:string, failCallback, succCallback){
        if(SDKMgr.WeiChat){
            sdkWechat.playVideoAd(adkey, ()=>{
                //console.log("reset 激励视频广告显示失败");
                failCallback();
            }, (succ:boolean)=>{
                //console.log("reset 激励视频广告正常播放结束， succ = "+succ+"; self.proTime = "+self.proTime);
                if(succ){
                    succCallback();
                }else{
                    failCallback()
                }
            }, this);   //播放下载的视频广告 
        }
        else if(SDKMgr.QQ != null){   //qq小程序
            sdkQQ.playVideoAd(adkey, ()=>{
                //console.log("reset 激励视频广告显示失败");
                failCallback();
            }, (succ:boolean)=>{
                //console.log("reset 激励视频广告正常播放结束， succ = "+succ+"; self.proTime = "+self.proTime);
                if(succ){
                    succCallback();
                }else{
                    failCallback()
                }
            }, this);   //播放下载的视频广告 
        }
    }

}

export  let SDKMgr = new SDKManager_class();