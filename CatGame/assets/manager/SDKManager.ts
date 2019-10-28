import { sdkWechat } from "./SDK_Wechat";


const {ccclass, property} = cc._decorator;

//平台SDK数据
export class SDK_DATA {
    appid = "";
    appkey = "";
    appsecret = "";
    openid = "";
    token = "";
    packageName = "";

    code = "";   //微信用
    wid = "";   //微信用
}

@ccclass
class SDKManager_class  {
    isSDK : boolean = false;
    QGMark: string = "";   //用于区分oppo或vivo

    QGOppo : any = null;    //Oppo快游戏
    QGVivo: any = null;   //Vivo快游戏
    WeiChat: any = null;   //微信小游戏

    SdkData: SDK_DATA = null;  //平台数据

    sdkCheckSuccCallBack: any = null;   //SDK用户数据校验成功回调
    callBackTarget: any = null;

    /** 检查和初始化可用的SDK */
    initSDK(){
        console.log("initSDK()");

        let QG = (window as any).qg;
        SDKMgr.WeiChat = (window as any).wx;  //微信小游戏

        this.SdkData = new SDK_DATA();

        if(QG != null){
            if(this.QGMark == "OPPO_QG"){  //Oppo快游戏
                SDKMgr.QGOppo = QG;
                SDKMgr.isSDK = true;
            }
            else if(this.QGMark == "VIVO_QG"){   //Vivo 快游戏
                SDKMgr.QGVivo = QG;
                SDKMgr.isSDK = true;
            }
        }
        else if(SDKMgr.WeiChat != null){   //微信小游戏
            SDKMgr.isSDK = true;

            this.SdkData.appkey = "wx5d22862f5d66286f";
            this.SdkData.appsecret = "66394f83ea585cb0e3fd5e6fb8975ff9";

            sdkWechat.initSDK();

        }else{
            cc.log("没有找到SDK对应信息");
        }
    }

    //设定SDK用户数据校验成功回调
    loginWithSDK(callback: any, target: any){
        console.log("loginWithSDK")
        this.sdkCheckSuccCallBack = callback;
        this.callBackTarget = target;

        if(this.QGOppo != null){
            this.loginOppoQG();
        }else if(this.QGVivo != null){
            this.loginVivoQG();
        }else if(this.WeiChat != null){
            sdkWechat.loginWeiChat();
        }
        else{
            cc.log("没有找到SDK平台")
            SDKMgr.SDK_Login();
        }
    }

    //vivo快游戏登录
    loginVivoQG(){
        cc.log("loginVivoQG(), packageName = "+this.SdkData.packageName)
        this.QGVivo.authorize({
            type: "token",
            success: function (obj) {
                let obj_json = JSON.stringify(obj);
                console.log("authorize(), obj_json = "+obj_json);
                //authorize(), obj_json = {"state":"","code":"","accessToken":"9dddfcbf0db25671ed4ab628a2d54c18","tokenType":"","expiresIn":86400,"scope":"scope.baseProfile"}
                this.SdkData.token = obj.accessToken;

                SDKMgr.SDK_Login();

                // SDKMgr.QGVivo.getProfile({
                //     token: obj.accessToken,
                //     success: function(data){
                //         let data_json = JSON.stringify(data);
                //         /**
                //          * 用户的openid，可作为用户的唯一标识。id用户的user id，可能为空。unionid用户在开放平台上的唯一标示符，可能为空。
                //          * getProfile(), obj_json = {"openid":"0Y3Hvizwq8S0TxNAHda-regKRvENpbC4rDquGPNetHs","id":"0Y3Hvizwq8S0TxNAHda-regKRvENpbC4rDquGPNetHs",
                //          * "unionid":"","nickname":"vivo57680498171","avatar":"https://shequwsdl.vivo.com.cn/shequ/shequ/20181121/f684c045b2004dd785bf4a8a627f5446.jpg"}
                //          */
                //         SDKMgr.SDK_Login();
                //     },
                //     fail: function(data, code) {
                //         HUD.showMessage("获取账号信息失败!");
                //         // SDKMgr.QGVivo.showToast({
                //         //     message: "handling fail, code=" + code
                //         // })
                //     }
                // })
            },
            fail: function (data, code) {
                console.log("loginVivoQG, authorize() fail. "+JSON.stringify(data));
            }
        })
    }

    //oppo快游戏登录
    loginOppoQG(){
        cc.log("loginOppoQG(), packageName = "+this.SdkData.packageName)
        this.QGOppo.login({
            pkgName: this.SdkData.packageName,
            success: function(resp){
                /**
                 * uid用户唯一Id，avatar头像， location地理位置
                 * {"age":"-1","avatar":"http://cdopic0.oppomobile.com/play/201811/12/7e7ca0f9-20dc-4ce9-a239-dff4c57b747f.jpg","birthday":"-1","constellation":"",
                 * "location":"","nickName":"","phoneNum":"159******95","sex":"","sign":"","token":"c2fefe065ac79537b63556738691b8ce","uid":"394557060","code":0}
                */
                console.log("loginOppoQG(), resp = "+JSON.stringify(resp));
                SDKMgr.SdkData.openid = resp.uid;
                SDKMgr.SdkData.token = resp.token;

                SDKMgr.SDK_Login();
            },
            fail: function(resp){
            }
        });
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
        }
    }

    handleShareSucc(){
        if(this.shareCallback && this.shareCallTarget){
            setTimeout(()=>{
                if(this.shareCallback && this.shareCallTarget){
                    this.shareCallback.call(this.shareCallTarget, true);
                }else{
                    console.log("分享回调错误");
                }
            }, 500)
        }else{
            console.log("无分享回调");
        }
    }

    //Banner管理
    createrBannerAd(){
        if(SDKMgr.WeiChat){
            sdkWechat.createBannerWithWidth();  //Banner广告

            setInterval(()=>{
                sdkWechat.createBannerWithWidth();
            }, 200000);   //每隔固定时间被调用一次
        }
    }

    //显示视频广告
    showVedioAd(failCallback, succCallback){
        sdkWechat.preLoadAndPlayVideoAd(false, ()=>{
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

export  let SDKMgr = new SDKManager_class();