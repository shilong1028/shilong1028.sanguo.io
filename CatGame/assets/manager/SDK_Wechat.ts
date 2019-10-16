import { SDKMgr } from "./SDKManager";


export class SDK_Wechat  {

    ///////////////////////初始化SDK 更新和分享按钮
    initSDK(){
        let wx = (window as any).wx;  //微信小游戏
        const updateManager = wx.getUpdateManager();

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate);
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

    share(titleStr: string){
        let wx = SDKMgr.WeiChat;
        if (wx == null) {
            return;
        }
        //平台上的分享图片链接地址
        let imgUrls = ['https://mmocgame.qpic.cn/wechatgame/ap8QGBf5gXg4n7Ese58NnzS4saYJf4THM3aOx394fcRVHKrp9bSgDjjrsyYL1gbS/0'];
        //平台上的分享图片编号
        let imgIds = ['1IqtE4CzQUyV5TP0MTxYCw'];

        wx.updateShareMenu({
            withShareTicket: true,
            success(res) {
                console.log("分享成功", res);
                SDKMgr.handleShareSucc();
            },
            fail(res) {
                console.log("分享失败", res);

            }
        })

        wx.shareAppMessage({
            title: titleStr,
            imageUrlId: imgIds[0],
            imageUrl: imgUrls[0],
        });
    }

    //**************************  反馈和客服 ********************** */
    feedbackBtn: any = null;
    customerBtn: any = null;

    //反馈
    createFeedbackBtn(worldPos: cc.Vec2, size: cc.Size){
        let wx = SDKMgr.WeiChat;
        if (wx == null) {
            return;
        }

        let sceneSize = cc.size(750, 1334);
        let sysInfo = wx.getSystemInfoSync();
        //console.log("反馈 sysInfo = "+JSON.stringify(sysInfo)+"; cc.winSize = "+JSON.stringify(cc.winSize));
        //console.log("worldPos = "+worldPos+"; size = "+JSON.stringify(size));
        let w = sysInfo.screenWidth/cc.winSize.width * size.width * cc.winSize.height/sceneSize.height;
        let h = sysInfo.screenHeight/cc.winSize.height * size.height * cc.winSize.width/sceneSize.width;
        let t  = sysInfo.screenHeight/cc.winSize.height * (sceneSize.height - worldPos.y) * cc.winSize.height/sceneSize.height -h/2;
        let l  = sysInfo.screenWidth/cc.winSize.width * worldPos.x * cc.winSize.width/sceneSize.width - w/2;
        //console.log("w = "+w+"; h = "+h+"; t = "+t+"; l = "+l);

        this.feedbackBtn = wx.createFeedbackButton({
            type: 'text',    //text, image
            image: '',   //按钮的背景图片，仅当 type 为 image 时有效
            text: '',   //按钮上的文本，仅当 type 为 text 时有效
            style: {
                left: l,   //左上角横坐标
                top: t,   //左上角纵坐标
                width: w,   //宽度
                height: h,   //高度
                // lineHeight: 40,   //文本的行高
                // backgroundColor: '#ff0000',   //背景颜色
                // color: '#ffffff',
                // textAlign: 'center',   //文本的水平居中方式
                // fontSize: 16,    //字号
                // borderRadius: 4   //边框圆角
            }
        });
    }
    removeFeedbackBtn(){
        if(this.feedbackBtn){
            this.feedbackBtn.destroy();
        }
    }

    //游戏圈
    createGameClubBtn(worldPos: cc.Vec2, size: cc.Size){
        let wx = SDKMgr.WeiChat;
        if (wx == null) {
            return;
        }

        let sceneSize = cc.size(750, 1334);
        let sysInfo = wx.getSystemInfoSync();
        //console.log("客服 sysInfo = "+JSON.stringify(sysInfo)+"; cc.winSize = "+JSON.stringify(cc.winSize));
        //console.log("worldPos = "+worldPos+"; size = "+JSON.stringify(size));
        let w = sysInfo.screenWidth/cc.winSize.width * size.width * cc.winSize.height/sceneSize.height;
        let h = sysInfo.screenHeight/cc.winSize.height * size.height * cc.winSize.width/sceneSize.width;
        let t  = sysInfo.screenHeight/cc.winSize.height * (sceneSize.height - worldPos.y) * cc.winSize.height/sceneSize.height -h/2;
        let l  = sysInfo.screenWidth/cc.winSize.width * worldPos.x * cc.winSize.width/sceneSize.width - w/2;
        //console.log("w = "+w+"; h = "+h+"; t = "+t+"; l = "+l);

        this.customerBtn = wx.createGameClubButton({
            type: 'image',
            icon: 'light',   //游戏圈按钮的图标，仅当 type 参数为 image 时有效  green 绿色的图标 white 白色的图标 dark 有黑色圆角背景的白色图标 light 有白色圆角背景的绿色图标
            image: '',
            text: '',
            style: {
                left: l,
                top: t,
                width: w,
                height: h
            }
        });
    }
    removeCurstomerBtn(){
        if(this.customerBtn){
            this.customerBtn.destroy();
        }
    }

    openConversation(){
        console.log("openConversation");
        let wx = SDKMgr.WeiChat;
        if (wx == null) {
            return;
        }

        wx.openCustomerServiceConversation({
            sendMessageTitle:"测试"
        });
    }

    ////////////////////////////广告相关功能  ////////////////////////////////////////////
    curBanner:any = null;
    
    createBannerWithWidth(adWidth: number=300){
        let wx = (window as any).wx;
        if(wx == null){
            return;
        }

        if(this.curBanner != null){   //创建新的 BannerAd 并将之前的 BannerAd 进行销毁。如果不对废弃的 BannerAd 进行销毁，则会导致其上的事件监听器无法释放。
            this.curBanner.destroy();
            this.curBanner = null;
        }

        const info = wx.getSystemInfoSync();
        console.log("info = "+JSON.stringify(info));

        let bannerAd = wx.createBannerAd({
            adUnitId: "adunit-0895b0ed4218bdfd",
            style: {
                left: 0,
                top: 0,
                width: adWidth,   //当 style.width 小于 300 时，会取作 300。 当 style.width 大于屏幕宽度时，会取作屏幕宽度。 在组件内部会以此值为基准，根据 Banner 广告的标准尺寸，进行缩放。
            }
        });

        bannerAd.onError(err => {
            console.log(err)
        });

        bannerAd.onResize(res => {   //如果在 onResize 的回调函数中重设 width 且总是与上一次缩放后的 width 不同，那么可能会导致 onResize 的回调函数一直触发，并卡死在 onResize 的回调函数中。
            console.log("bannerAd.style = "+JSON.stringify(bannerAd.style));
            bannerAd.style.left = (info.windowWidth - bannerAd.style.realWidth) * 0.5;
            bannerAd.style.top = (info.windowHeight - bannerAd.style.realHeight);
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

    preLoadVideoAd: any = null;   //提前预加载完毕了视频广告
    /**预加载或播放视频广告 */
    preLoadAndPlayVideoAd(bPreLoad:boolean, errorCallBack:any, videoCallBack:any, callTarget:any){
        //console.log('preLoadAndPlayVideoAd, 预加载或播放视频广告 bPreLoad = '+bPreLoad);
        let wx = (window as any).wx;
        if(wx == null){
            return;
        }

        this.callTarget = callTarget;  //
        this.videoCallBack = videoCallBack;   //播放视频成功回调
        this.errorCallBack = errorCallBack;   //加载视频失败回调

        let self = this;
        let adId = "adunit-40458eb80d6b2cd3";
        var rewardedVideoAd = null;
        if(bPreLoad == true){   //预下载
            this.preLoadVideoAd = null;
            rewardedVideoAd = wx.createRewardedVideoAd({
                adUnitId: adId
            });

            rewardedVideoAd.load()
            .then(() => {
                console.log('预加载激励视频广告成功');
                self.preLoadVideoAd = rewardedVideoAd;
            })
            .catch(err => {
                console.log('激励视频广告显示失败, err = '+err);
                self.preLoadVideoAd = null;
                if(self.errorCallBack && self.callTarget){
                    self.errorCallBack.call(self.callTarget, "无法观看视频");
                }else{
                    //console.log("预显示回调错误");
                }
            })
        }else{
            rewardedVideoAd = this.preLoadVideoAd;
            if(rewardedVideoAd == null){
                rewardedVideoAd = wx.createRewardedVideoAd({
                    adUnitId: adId
                });

            }

            rewardedVideoAd.onClose(res => {
                if (res && res.isEnded) {
                    console.log("激励视频广告正常播放结束，可以下发游戏奖励， res = "+JSON.stringify(res));
                    if(self.videoCallBack && self.callTarget){
                        self.videoCallBack.call(self.callTarget, true);
                    }else{
                        //console.log("播放成功回调错误");
                    }
                } else {
                    console.log("激励视频广告播放中途退出，不下发游戏奖励， res = "+JSON.stringify(res));
                    if(self.videoCallBack && self.callTarget){
                        self.videoCallBack.call(self.callTarget, false);
                    }else{
                        //console.log("播放失败回调错误");
                    }
                }
            })

            rewardedVideoAd.show().catch(() => {
                // 失败重试
                rewardedVideoAd.load()
                .then(() => {
                    console.log('经过预下载后，但仍需要加载视频');
                    rewardedVideoAd.show();
                })
                .catch(err => {
                    console.log('经过预下载后，激励视频广告仍然显示失败, err = '+err);
                })
            });
        }

        rewardedVideoAd.onError(err => {
            //console.log("今日观看视频数量已达上限, err = "+err);
        });

    }


    //****************************登录和用户信息  *********************** */
    wxAuthBtn:any = null;
    removeAuthorizeBtn () {
        if(this.wxAuthBtn != null){
            this.wxAuthBtn.destroy();
        }
    }

    
    //检测微信用户是否授权，并显示授权按钮
    checkWechatAuthorize (){
        let wx = SDKMgr.WeiChat;
        if(wx == null){
            return;
        }
        let self = this;
        wx.getSetting({  //获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
            success(res) {
                console.log('res.authSetting = ' + JSON.stringify(res.authSetting));
                if (res.authSetting['scope.userInfo']) {   //已经授权
                }else {
                    self.showAuthorizeBtn();   //显示微信授权界面和获取用户信息按钮
                }
            },
            fail(res) {
                self.showAuthorizeBtn();   //显示微信授权界面和获取用户信息按钮
            }
        });
    }

    //显示微信授权界面和获取用户信息按钮
    showAuthorizeBtn () {
        let wx = SDKMgr.WeiChat;
        if(wx == null){
            return;
        }
        console.log('showAuthorizeBtn');

        let sysInfo = wx.getSystemInfoSync();
        // let screenW = sysInfo.screenWidth;
        // let screenH = sysInfo.screenHeight;

        // let rate = sysInfo.screenWidth/750;
        // let h = rate * 385;
        // let screenW = sysInfo.screenWidth*0.5 - 10;
        // let screenH = 75*rate;
        // let t  = sysInfo.screenHeight * 0.5 - screenH - h;
        // let l  = sysInfo.screenWidth * 0.5;
        // let button = wx.createUserInfoButton({
        //     type: 'text',
        //     text: '   ',
        //     style: {
        //         left: l,
        //         top: t,
        //         width: screenW,
        //         height: screenH,
        //         lineHeight: 40,
        //         backgroundColor: '',
        //         color: '#ffffff',
        //         textAlign: 'center',
        //         fontSize: 25,
        //         borderRadius: 4
        //     }
        // });

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
                        self.onAuthorizeOK(res);
                        self.removeAuthorizeBtn();
                    },
                    fail(res) {
                        // 获取失败的去引导用户授权
                        console.log('获取用户信息失败！res = ' + JSON.stringify(res));
                        //不授权登录
                        self.onAuthorizeOK(null);
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

    onAuthorizeOK(res){
        console.log('onAuthorizeOK() res = ' + JSON.stringify(res));
    }

    //登录
    loginWeiChat() {
        let wx = SDKMgr.WeiChat;
        if (wx == null) {
            return;
        }
        let self = this;

        //微信账号登录
        wx.login({
            success(res) {
                console.log('微信登录！res = ' + JSON.stringify(res));
                //res = {"errMsg":"login:ok","code":"023uNqjb1xlyMw0yYDjb1Vy5jb1uNqjQ"}
                //发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.code) {
                    console.log('登录成功！' + res.code);
                    SDKMgr.SdkData.code = res.code;

                    self.getUserInfo();  //请求用户信息或授权请求
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        })
    }

    //请求用户信息或授权请求
    getUserInfo (){
        let wx = SDKMgr.WeiChat;
        let self = this;
        wx.getSetting({  //获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
            success(res) {
                console.log('res.authSetting = ' + JSON.stringify(res.authSetting));
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
        let wx = SDKMgr.WeiChat;
        let self = this;
        // 必须是在用户已经授权的情况下调用
        wx.getUserInfo({  //获取用户信息,自从微信接口有了新的调整之后 这个wx.getUserInfo（）便不再出现授权弹窗了，需要使用button做引导
            success(res) {
                console.log('getUserInfoFunc() res = ' + JSON.stringify(res));
                /**
                 * res = {"errMsg":"getUserInfo:ok",
                 * "rawData":"{\"nickName\":\"shilong1028\",\"gender\":1,\"language\":\"zh_CN\",\"city\":\"Xuhui\",\"province\":\"Shanghai\",\"country\":\"China\",
                 * \"avatarUrl\":\"https://wx.qlogo.cn/mmopen/vi_32/lcib9AaFmzOfTZHoKHaDF42h6nHCpE4lj7SP1icCt9R185kic3jLyc7EydDkLhAlFAYFK0KuztVa1kibIaOiabscbrQ/132\"}",
                 * "userInfo":{"nickName":"shilong1028","gender":1,"language":"zh_CN","city":"Xuhui","province":"Shanghai","country":"China",
                 * "avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/lcib9AaFmzOfTZHoKHaDF42h6nHCpE4lj7SP1icCt9R185kic3jLyc7EydDkLhAlFAYFK0KuztVa1kibIaOiabscbrQ/132"},
                 * "signature":"741eb561136150a1189ba679d3e9e53f1ee4099d",
                 * "encryptedData":"k+mbVAXDT1A0325Flt6e+GZ309QK/iv1KR8HYyJOrQ2T7GyWIc6zvR4hVLmv+2BgQKWT8M89dlMygyTYSbt6JLb7jjbVlEAF8ElwKUSUdwS7qlegQ4h1IaBARxRCSJd8
                    * JwraTGSDn6mAAzQsKIFUeP2bNxMq40LMrWtfekv2ZoKmpG+jvrhufUtRkIS70UsF3uFEMr85ZjV0cXcn/hi14CeF7AM/BSyZYpF3KoPB9ZBqmlWIX3SstdjK324Ra5O3a5A7TfXnOk+T7uWWU5mVlb
                    * FsS9vDbwAWxXZjFsqXnTUonNkTNWACRMdYZhBd64Xl3LeHbZrelo9BliqDYHz2PuhP1aEt2umqWJKJHLoX7CB5JzqdQMx2sfeQvWvdU8DVan9+xGpBsYVkFT6H8xiLWU8mJIcaZ1Iv3uEACvnlICt
                    * CftaMRkGR0lRGM8TQQg0fEVnA1yPkIYitSZBvad3uVX2hqdBv+JaDWHqr7tSA0Lw=",
                * "iv":"MKNFdyMEyjS/SgErvzeFXg=="}
                */

                self.onLoginOK(res);
            },
            fail(res) {
                // 获取失败的去引导用户授权
                console.log('获取用户信息失败！res = ' + JSON.stringify(res));
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

export var sdkWechat = new SDK_Wechat();

