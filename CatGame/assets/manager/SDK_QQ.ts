import { SDKMgr } from "./SDKManager";
import { GameMgr } from "./GameManager";
import { ROOT_NODE } from "../common/rootNode";

var QQ_VedioIds = {
    ChapterVedioId: "10f9fc47d6f7f7584ec5544078ad8b01",   //章节奖励  》15
    FuhuoVedioId:   "80945ae10eb1884700e603079d9704a7",    //复活
    KaijuVedioId:   "58342de57f6d73b656c955a365c452c4",   //开局奖励
    UpLvVedioId:    "e530bb9f92eaa3ae3ab7d9cd8d942e31",   //宠物升级
    ShopVedioId:    "07e77e716fe1c2602bc8152e36d74aa0",    //商店    》15
    GoldVedioId:    "f2a566f06d20c2bda17dbf7216f4a24f",    //添加金币    》15
    SignVedioId:    "693f5c79979255da21e5c15c74cefe0e",    //签到    》15
}

//qq小程序(不支持个人开发)
export class SDK_QQ  {

    ///////////////////////初始化SDK 更新和分享按钮
    initSDK(){
        let qq = (window as any).qq;  
        const updateManager = qq.getUpdateManager();

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            //console.log(res.hasUpdate);
        });

        updateManager.onUpdateReady(function () {
            qq.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate();
                    }
                }
            })
        });

        updateManager.onUpdateFailed(function () {
            // 新版本下载失败
        });

        //微信分享菜单
        qq.showShareMenu({
            withShareTicket: true,
            success(res) {
            },
            fail(res) {
            }
        })
    }

    share(titleStr: string){
        let qq = (window as any).qq;  
        if (qq == null) {
            return;
        }
        //平台上的分享图片链接地址
        let imgUrls = ['https://mmocgame.qpic.cn/wechatgame/jTqetgM5ksJB5QHQ8anlZGWdicrK3Cllk7a8XOPCD2jicENfrRR9XVQaKZOV1VyfnZ/0'];
        //平台上的分享图片编号
        let imgIds = ['JYY2Z/rRTJ2U9IeEVGSwgw=='];

        qq.updateShareMenu({
            withShareTicket: true,
            success(res) {
                //console.log("分享成功", res);
                SDKMgr.handleShareSucc();
            },
            fail(res) {
                //console.log("分享失败", res);

            }
        })

        qq.shareAppMessage({
            title: titleStr,
            imageUrlId: imgIds[0],
            imageUrl: imgUrls[0],
        });
    }

    ////////////////////////////广告相关功能  ////////////////////////////////////////////
    curBanner:any = null;
    
    createBannerWithWidth(adUnitId){   //414*144, 315*109.6 349*121.4  300*104.4     高为宽的0.348
        let qq = (window as any).qq;  
        if (qq == null) {
            return;
        }

        if(this.curBanner != null){   //创建新的 BannerAd 并将之前的 BannerAd 进行销毁。如果不对废弃的 BannerAd 进行销毁，则会导致其上的事件监听器无法释放。
            this.curBanner.destroy();
            this.curBanner = null;
        }
  
        let adWidth = GameMgr.GetBannerWidth();
        let frameSize = cc.view.getFrameSize();
        adWidth = frameSize.width;
        
        var info = qq.getSystemInfoSync();

        let adHeight = (adWidth / 16) * 9; // 根据系统约定尺寸计算出广告高度

        let bannerAd = qq.createBannerAd({
            adUnitId: adUnitId,
            style: {
                left: (info.windowWidth - adWidth) * 0.5 + 0.1,
                top: (info.windowHeight - adHeight/2) + 0.1,
                width: adWidth,   //在组件内部会以此值为基准，根据 Banner 广告的标准尺寸，进行缩放。
            }
        });

        bannerAd.onError(err => {
            //console.log(err)
        });

        bannerAd.onResize(res => {   //如果在 onResize 的回调函数中重设 width 且总是与上一次缩放后的 width 不同，那么可能会导致 onResize 的回调函数一直触发，并卡死在 onResize 的回调函数中。
            bannerAd.style.left = (info.windowWidth - bannerAd.style.realWidth) * 0.5 + 0.1;
            bannerAd.style.top = (info.windowHeight - bannerAd.style.realHeight/2) + 0.1;   //left和top都加上0.1，不加就会被iphonex该死的底部bar给顶上去，而且时而顶上去，时而又是正常
        });

        // 在适合的场景显示 Banner 广告
        bannerAd.show();
        this.curBanner = bannerAd;
    }

    removeBanner(){
        if(this.curBanner != null){
            this.curBanner.destroy();
            this.curBanner = null;
        }
    }

    callTarget:any = null;  //
    videoCallBack: any = null;   //播放视频成功回调
    errorCallBack: any = null;   //加载视频失败回调

    /**预加载或播放视频广告 */
    playVideoAd(adkey: string, errorCallBack:any, videoCallBack:any, callTarget:any){
        //console.log('preLoadAndPlayVideoAd, 预加载或播放视频广告 bPreLoad = '+bPreLoad);
        let qq = (window as any).qq;  
        if (qq == null) {
            return;
        }

        this.callTarget = callTarget;  //
        this.videoCallBack = videoCallBack;   //播放视频成功回调
        this.errorCallBack = errorCallBack;   //加载视频失败回调

        let self = this;
        let adId = QQ_VedioIds[adkey];
        //console.log("adId = "+adId);
        var rewardedVideoAd = qq.createRewardedVideoAd({
            adUnitId: adId
        });
        rewardedVideoAd.onLoad(() =>{
            if (rewardedVideoAd){
                rewardedVideoAd.offLoad()
            }
        });
        rewardedVideoAd.show().catch(() => {
            // 失败重试
            rewardedVideoAd.load()
            .then(() => {
                //console.log('经过预下载后，但仍需要加载视频');
                rewardedVideoAd.show();
            })
            .catch(err => {
                //console.log('经过预下载后，激励视频广告仍然显示失败, err = '+err);
            })
        });
        rewardedVideoAd.onClose(res => {
            if (rewardedVideoAd){
                rewardedVideoAd.offClose()//防止多次回调
            }
            if (res && res.isEnded) {
                //console.log("激励视频广告正常播放结束，可以下发游戏奖励， res = "+JSON.stringify(res));
                if(self.videoCallBack && self.callTarget){
                    self.videoCallBack.call(self.callTarget, true);
                }else{
                    //console.log("播放成功回调错误");
                }
            } else {
                //console.log("激励视频广告播放中途退出，不下发游戏奖励， res = "+JSON.stringify(res));
                if(self.videoCallBack && self.callTarget){
                    self.videoCallBack.call(self.callTarget, false);
                }else{
                    //console.log("播放失败回调错误");
                }
            }
        });
        rewardedVideoAd.onError(err => {
            if (rewardedVideoAd){
                rewardedVideoAd.offError()
            }
            //console.log("今日观看视频数量已达上限, err = "+err);
        });

    }

    //****************************登录和用户信息  *********************** */

    //登录
    loginQQ() {
        let qq = (window as any).qq;  
        if (qq == null) {
            return;
        }
        let self = this;

        //微信账号登录
        qq.login({
            success(res) {
                //console.log('登录！res = ' + JSON.stringify(res));
                //res = {"errMsg":"login:ok","code":"023uNqjb1xlyMw0yYDjb1Vy5jb1uNqjQ"}
                //发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.code) {
                    //console.log('登录成功！' + res.code);
                    self.getUserInfo();  //请求用户信息或授权请求
                } else {
                    //console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        })
    }

    //请求用户信息或授权请求
    getUserInfo (){
        let qq = (window as any).qq;  
        if (qq == null) {
            return;
        }
        let self = this;
        qq.getSetting({  //获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
            success(res) {
                //console.log('res.authSetting = ' + JSON.stringify(res.authSetting));
                if (res.authSetting['scope.userInfo']) {   //已经授权
                    self.getUserInfoFunc();   //获取用户信息
                } else {
                    //不授权登录
                    self.onLoginOK(null);
                }
            },
            fail(res) {
                // 获取用户的当前设置失败, 不授权登录
                self.onLoginOK(null);
            }
        });
    }

    //获取微信玩家信息
    getUserInfoFunc() {
        let qq = (window as any).qq;  
        if (qq == null) {
            return;
        }
        let self = this;
        // 必须是在用户已经授权的情况下调用
        qq.getUserInfo({  //获取用户信息,自从微信接口有了新的调整之后 这个wx.getUserInfo（）便不再出现授权弹窗了，需要使用button做引导
            success(res) {
                //console.log('getUserInfoFunc() res = ' + JSON.stringify(res));
                self.onLoginOK(res);
            },
            fail(res) {
                // 获取失败的去引导用户授权
                //console.log('获取用户信息失败！res = ' + JSON.stringify(res));
                //不授权登录
                self.onLoginOK(null);
            }
        })
    }

    //处理微信登录并获取用户信息成功
    onLoginOK(res: any) {
        SDKMgr.SDK_Login();
    }
}

export var sdkQQ = new SDK_QQ();

