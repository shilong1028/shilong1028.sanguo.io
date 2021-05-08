/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:14:18
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 14:40:26
 * @Description: 
 */
import { SDKMgr } from "./SDKManager";
import { GameMgr } from "./GameManager";
import { ROOT_NODE } from "../login/rootNode";


var WeChat_VedioIds = {
    DefaultVedioId: "adunit-6ec807cbe470c213",

}

export class SDK_Wechat {

    ///////////////////////初始化SDK 更新和分享按钮
    initSDK() {
        let wx = (window as any).wx;  //微信小游戏
        const updateManager = wx.getUpdateManager();

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            //console.log(res.hasUpdate);
        });

        updateManager.onUpdateReady(function () {
            wx.showModal({
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
        wx.showShareMenu({
            withShareTicket: true,
            success(res) {
            },
            fail(res) {
            }
        })
    }

    share(titleStr: string) {
        let wx = SDKMgr.WeChat;
        if (wx == null) {
            return;
        }

        wx.shareAppMessage({
            title: titleStr,
            imageUrlId: "1IqtE4CzQUyV5TP0MTxYCw",
            imageUrl: "https://mmocgame.qpic.cn/wechatgame/ap8QGBf5gXg4n7Ese58NnzS4saYJf4THM3aOx394fcRVHKrp9bSgDjjrsyYL1gbS/0",
        });
    }

    ////////////////////////////广告相关功能  ////////////////////////////////////////////
    curBanner: any = null;

    createBannerWithWidth(adUnitId) {   //414*144, 315*109.6 349*121.4  300*104.4     高为宽的0.348
        let wx = (window as any).wx;
        if (wx == null) {
            return;
        }

        if (this.curBanner != null) {   //创建新的 BannerAd 并将之前的 BannerAd 进行销毁。如果不对废弃的 BannerAd 进行销毁，则会导致其上的事件监听器无法释放。
            this.curBanner.destroy();
            this.curBanner = null;
        }

        //const info = wx.getSystemInfoSync();
        let adWidth = GameMgr.GetBannerWidth();
        let frameSize = cc.view.getFrameSize();

        let bannerAd = wx.createBannerAd({
            adUnitId: adUnitId,
            style: {
                left: 0,
                top: 0,
                width: adWidth,   //在组件内部会以此值为基准，根据 Banner 广告的标准尺寸，进行缩放。
            }
        });

        bannerAd.onError(err => {
        });

        bannerAd.onResize(res => {   //如果在 onResize 的回调函数中重设 width 且总是与上一次缩放后的 width 不同，那么可能会导致 onResize 的回调函数一直触发，并卡死在 onResize 的回调函数中。
            bannerAd.style.left = (frameSize.width - bannerAd.style.realWidth) * 0.5 + 0.1;
            bannerAd.style.top = (frameSize.height - bannerAd.style.realHeight) + 0.1;   //left和top都加上0.1，不加就会被iphonex该死的底部bar给顶上去，而且时而顶上去，时而又是正常
        });

        // 在适合的场景显示 Banner 广告
        bannerAd.show();
        this.curBanner = bannerAd;
    }

    removeBanner() {
        if (this.curBanner != null) {
            this.curBanner.destroy();
            this.curBanner = null;
        }
    }

    callTarget: any = null;  //
    videoCallBack: any = null;   //播放视频成功回调
    errorCallBack: any = null;   //加载视频失败回调

    /**预加载或播放视频广告 */
    playVideoAd(adkey: string, errorCallBack: any, videoCallBack: any, callTarget: any) {
        let wx = (window as any).wx;
        if (wx == null) {
            return;
        }

        this.callTarget = callTarget;  //
        this.videoCallBack = videoCallBack;   //播放视频成功回调
        this.errorCallBack = errorCallBack;   //加载视频失败回调

        let self = this;
        let adId = WeChat_VedioIds[adkey];
        var rewardedVideoAd = wx.createRewardedVideoAd({
            adUnitId: adId,
            multiton: true
        });
        rewardedVideoAd.canHandleCallBack = true;

        rewardedVideoAd.onLoad(() => {
            // if (rewardedVideoAd){
            //     rewardedVideoAd.offLoad()
            // }
        });
        rewardedVideoAd.show().then(() => {
        })
            .catch(err => {
                // 可以手动加载一次
                rewardedVideoAd.load().then(() => {
                    // 加载成功后需要再显示广告
                    return rewardedVideoAd.show();
                })
                    .catch(err => {
                        ROOT_NODE.showTipsText("视频获取失败，请稍后重试或重新登录游戏。")
                        if (rewardedVideoAd.canHandleCallBack && sdkWechat.errorCallBack && sdkWechat.callTarget) {
                            rewardedVideoAd.canHandleCallBack = false;
                            sdkWechat.errorCallBack.call(sdkWechat.callTarget, false);
                        }
                    });
            });
        rewardedVideoAd.onClose(res => {
            // if (rewardedVideoAd){
            //     rewardedVideoAd.offClose()//防止多次回调
            // }
            //console.log("onClose canHandleCallBack = "+rewardedVideoAd.canHandleCallBack)
            if (rewardedVideoAd.canHandleCallBack == true) {
                rewardedVideoAd.canHandleCallBack = false;
                if (res && res.isEnded) {
                    if (self.videoCallBack && self.callTarget) {
                        self.videoCallBack.call(self.callTarget, true);
                    }
                } else {
                    if (self.videoCallBack && self.callTarget) {
                        self.videoCallBack.call(self.callTarget, false);
                    }
                }
            }
        });
        rewardedVideoAd.onError(err => {
            // if (rewardedVideoAd){
            //     rewardedVideoAd.offError()
            // }
            ROOT_NODE.showTipsText("视频获取失败，" + err.errCode + "; " + err.errMsg)
            if (rewardedVideoAd.canHandleCallBack && sdkWechat.errorCallBack && sdkWechat.callTarget) {
                rewardedVideoAd.canHandleCallBack = false;
                sdkWechat.errorCallBack.call(sdkWechat.callTarget, false);
            }
        });

    }

    //****************************登录和用户信息  *********************** */
    wxAuthBtn: any = null;
    removeAuthorizeBtn() {
        if (this.wxAuthBtn != null) {
            this.wxAuthBtn.destroy();
        }
    }


    //检测微信用户是否授权，并显示授权按钮
    checkWechatAuthorize() {
        let wx = SDKMgr.WeChat;
        if (wx == null) {
            return;
        }
        let self = this;
        wx.getSetting({  //获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
            success(res) {
                if (res.authSetting['scope.userInfo']) {   //已经授权
                } else {
                    self.showAuthorizeBtn();   //显示微信授权界面和获取用户信息按钮
                }
            },
            fail(res) {
                self.showAuthorizeBtn();   //显示微信授权界面和获取用户信息按钮
            }
        });
    }

    //显示微信授权界面和获取用户信息按钮
    showAuthorizeBtn() {
        let wx = SDKMgr.WeChat;
        if (wx == null) {
            return;
        }

        let button = wx.createUserInfoButton({
            type: 'text',
            text: '获取用户信息',
            style: {
                left: 10,
                top: 76,
                width: 200,
                height: 40,
                lineHeight: 40,
                backgroundColor: '#ff0000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        })

        button.onTap((res) => {
            if (res.rawData && res.rawData.length > 1) {
                button.destroy();  //授权之后隐藏该按钮
                let self = this;
                // 必须是在用户已经授权的情况下调用
                wx.getUserInfo({  //获取用户信息,自从微信接口有了新的调整之后 这个wx.getUserInfo（）便不再出现授权弹窗了，需要使用button做引导
                    success(res) {
                        self.removeAuthorizeBtn();
                    },
                    fail(res) {
                        // 获取失败的去引导用户授权
                        //不授权登录
                        self.removeAuthorizeBtn();
                    }
                })
            } else {
                //获取授权失败
                //不处理，用户可以再次点击授权按钮
            }
        });
        this.wxAuthBtn = button;
    }

    //登录
    loginWeiChat() {
        let wx = SDKMgr.WeChat;
        if (wx == null) {
            return;
        }
        let self = this;

        //微信账号登录
        wx.login({
            success(res) {
                if (res.code) {
                    self.getUserInfo();  //请求用户信息或授权请求
                } else {
                }
            }
        })
    }

    //请求用户信息或授权请求
    getUserInfo() {
        let wx = SDKMgr.WeChat;
        let self = this;
        wx.getSetting({  //获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
            success(res) {
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
        let wx = SDKMgr.WeChat;
        let self = this;
        // 必须是在用户已经授权的情况下调用
        wx.getUserInfo({  //获取用户信息,自从微信接口有了新的调整之后 这个wx.getUserInfo（）便不再出现授权弹窗了，需要使用button做引导
            success(res) {
                self.onLoginOK(res);
            },
            fail(res) {
                // 获取失败的去引导用户授权
                //不授权登录
                self.onLoginOK(null);
            }
        })
    }

    //处理微信登录并获取用户信息成功
    onLoginOK(res: any) {
        SDKMgr.SDK_Login();
    }

    //上传开放域数据
    setUserCloudStorage(keyStr: string, valStr: string) {
        let wx = SDKMgr.WeChat;
        if (wx == null) {
            return;
        }
        wx.setUserCloudStorage({
            KVDataList: [
                { key: keyStr, value: valStr },
            ],
            success: (res) => {
                console.log("setUserCloudStorage success:res=>", res)
            },
            fail: (res) => {
                console.log("setUserCloudStorage fail:res=>", res)
            }
        })
    }
}

export var sdkWechat = new SDK_Wechat();

