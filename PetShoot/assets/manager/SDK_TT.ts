import { SDKMgr } from "./SDKManager";
import { GameMgr } from "./GameManager";
import { ROOT_NODE } from "../common/rootNode";
import { FightMgr } from "./FightManager";

var TT_VedioIds = {
    GoldVedioId:    "7lh9np2328p474e5im",    //添加金币    》15
    //其他都用一个
    ChapterVedioId: "lmjod6cnnq13f9uahs",   //章节奖励  》15
    FuhuoVedioId:   "9abi0s9o7bs108bcdh",    //复活
    KaijuVedioId:   "k41g2m9pbjj2e9fe8j",   //开局奖励
    UpLvVedioId:    "6tntmadmh753m4a0bg",   //宠物升级
    ShopVedioId:    "55p8tr0qnkdm94g59j",    //商店    》15
    SignVedioId:    "5m1knnlfhf95bgi1o1",    //签到    》15
}

var shareImageUrl= 'https://mmocgame.qpic.cn/wechatgame/jTqetgM5ksJB5QHQ8anlZGWdicrK3Cllk7a8XOPCD2jicENfrRR9XVQaKZOV1VyfnZ/0';

export class SDK_TT  {

    ///////////////////////初始化SDK 更新和分享按钮
    systemInfo: any = null;
    launch_option: any = null;
    isConnected: boolean = true;
    networkType: any = null;
    toutiao_hide: boolean = false;
    has_tt_videoad: boolean = false;
    is_shareAppMessage: boolean = false;

    initSDK(){
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }

        //tt.setPreferredFramesPerSecond(60);

        this.getSetting();
        this.toutiao_recorderManager();
        this.checkToutiaoUpdate();
        this.setKeepScreenOn();

        let launch_option = tt.getLaunchOptionsSync();
        if (launch_option) {
            this.launch_option = launch_option;
        }

        tt.onNetworkStatusChange(res => {
            //isConnected: 当前是否有网络链接
            //networkType: 网络类型{wifi,2g,3g,4g,unknown,none}
            sdkTT.isConnected = res.isConnected;
            sdkTT.networkType = res.networkType;
        });

        tt.onHide(res => {
            // 当用户点击左上角关闭，或者按了设备 Home 键离开微信，小程序并没有直接销毁，而是进入了后台
            // mode: 'hide',targetAction: 8,targetPagePath: 'com.tencent.mm.ui.transmit.SelectConversationUI'
            sdkTT.toutiao_hide = true;
            sdkTT.has_keep_screen_on = false;
            cc.audioEngine.stopAll();
        });
        tt.onShow(res => {
            //再次进入微信或再次打开小程序，又会从后台进入前台,
            //只有当小程序进入后台一定时间，或者系统资源占用过高，才会被真正的销毁
            sdkTT.toutiao_hide = false;

            // 不在播放广告的时候播放音乐
            if (!this.has_tt_videoad) {
                //ddzAudio.play_playing_music();
            } else {
                this.has_tt_videoad = false;
            }

            if (this.is_shareAppMessage) {
                this.is_shareAppMessage = false;
            }

            this.checkToutiaoUpdate();
            this.getSetting();
        });

        this.systemInfo = tt.getSystemInfoSync();

        // 显示转发按钮
        tt.showShareMenu({
            success: res => {
            },
            fail: res => {
            },
            complete: res => {
            },
        });

        // 分享回调
        tt.onShareAppMessage(res => {
            cc.log('tt.onShareAppMessage res:', res);
            return {
                title: "萌宠们根本停不下来，一起疯狂弹射打怪。",
                imageUrl: shareImageUrl,
                query: "",
                success(res) {
                },
                fail(res) {
                },
            };
        });
    }


    share(titleStr: string){
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }

        this.is_shareAppMessage = true;

        tt.shareAppMessage({
            channel: '',
            title: titleStr,
            imageUrlId: shareImageUrl,
            imageUrl: '1e29bdm71eg5b2pcp0',
            query: '',
            success: res => {
            },
            fail: res => {
            },
            complete: res => {
            },
        });
    }

    has_keep_screen_on: boolean = false;
    setKeepScreenOn() {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }

        if (!tt.setKeepScreenOn) {
            return;
        }
        if (this.has_keep_screen_on) {
            return;
        }
        // 保持屏幕常亮
        tt.setKeepScreenOn({
            keepScreenOn: true,
            success: res => {
                sdkTT.has_keep_screen_on = (res.errMsg == 'setKeepScreenOn:ok');
            },
            fail: res => {
            }
        });
    }

    checkToutiaoUpdate() {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }

        let updateManager = tt.getUpdateManager();
        updateManager.onCheckForUpdate(function (res) {
        });
        updateManager.onUpdateReady(() => {
            tt.showModal({
                title: '更新提示',
                showCancel: false,
                confirmText: '确定',
                content: '新版本已经准备好，是否重启应用？',
                success(res) {
                    if (res.confirm) {
                        cc.audioEngine.stopAll();
                        updateManager.applyUpdate();
                    }
                },
            });
        });
        updateManager.onUpdateFailed(() => {
            ROOT_NODE.showTipsText('新版本更新失败，请退出游戏并确认网络后重新启动！');
        });
    }

    recorderManager: any = null;
    record: any = null;
    record_state: any = null;
    stop_record_voice_time: any = null;
    start_record_voice_time: any = null;
    is_canel_record: boolean = false;
    soundUpLoad: any = null;
    innerAudioContext: any = null;
    toutiao_recorderManager() {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }

        this.recorderManager = tt.getRecorderManager();
        this.recorderManager.onStart(() => {
            if (sdkTT.record_state!=null && sdkTT.record_state==1) {
                sdkTT.recorderManager.stop();
            }
        });
        this.recorderManager.onStop((res) => {
            if (sdkTT.stop_record_voice_time && sdkTT.start_record_voice_time) {
                let duration = Math.ceil((sdkTT.stop_record_voice_time-sdkTT.start_record_voice_time)/1000);
                if (!sdkTT.is_canel_record) {
                    if ((sdkTT.stop_record_voice_time-sdkTT.start_record_voice_time) < 500) {
                        ROOT_NODE.showTipsText("录音时间太短");
                    } else {
                        if (duration > 11) {
                            return;
                        }
                        sdkTT.record = res.tempFilePath;
                        ROOT_NODE.showTipsText("录音完成！");
                        sdkTT.toutiao_upLoadFile(sdkTT.soundUpLoad, res.tempFilePath, 'mp3', duration);
                    }
                } else {
                    ROOT_NODE.showTipsText("取消录音！");
                }
            }
        });
        this.recorderManager.onError(() => {
            if (sdkTT.get_auth_scope('scope.record') <= 0) {
                return;
            }
        });
        this.innerAudioContext = tt.createInnerAudioContext();
        this.innerAudioContext.onError((res) => {
            ROOT_NODE.showTipsText("播放录音失败！");
        });
    }
    toutiao_upLoadFile(server_url, path, type, duration) {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }
        tt.uploadFile({
            url: server_url,
            filePath: path,
            name: type,
            formData: {
                user: 'hougege'
            },
            success: (res) => {
                let response_data = JSON.parse(res.data);
                if (response_data.errorCode != 0) {
                    ROOT_NODE.showTipsText(response_data.errorCode);
                    return;
                }
                //cc.ddz.ChatSystem.SendChatMsg(ddzEnum.ChatType.MsgVoice, response_data.obj, duration);
            },
            fail(res) {
            },
            complete(res) {
            }
        })
    }

    get_auth_scope_userinfo(callback=null) {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }
        this.authorize(
            'scope.userInfo',
            success => {
                let auth_val = sdkTT.get_auth_scope('scope.userInfo');
                if (auth_val > 0) {
                    sdkTT.getUserInfo();
                } else {
                    if (callback) { callback(); }
                }
            },
            fail => {
                if (callback) { callback(); }
            }
        );
    }
    get_auth_scope(auth_str:string) {
        if (!this.authSetting) {                            // 没有授权数据
            return -1;
        } else if (this.authSetting[auth_str] === true) {   // 已授权
            return 1;
        } else if (this.authSetting[auth_str] === false) {  // 拒绝授权
            return 0;
        } else {                                            // 没有授权数据
            return -1;
        }
    }
    authorize(auth_str:string, succ_callback=null, fail_callback=null) {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }
        let auth_val = this.get_auth_scope(auth_str);
        if (auth_val > 0) {
            if (succ_callback) {
                succ_callback();
            }
        } else if (auth_val == 0) {
            cc.log('tt.authorize deny');
        } else {
            tt.authorize({
                scope: auth_str,
                success: res => {
                    sdkTT.getSetting(succ_callback);
                },
                fail: res => {
                    if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                        // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                    }
                    sdkTT.getSetting(fail_callback);
                },
                complete: res => {
                },
            });
        }
    }

    authSetting: any = null;
    getSetting(callback = null) {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }
        tt.getSetting({
            success: res => {
                sdkTT.authSetting = res.authSetting;
                if (callback) {
                    callback();
                }
            },
            fail: res => {
            },
            complete: () => {
            },
        });
    }
    //请求用户信息或授权请求
    userInfo: any = null;
    getUserInfo() {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }

        tt.getSetting({  //获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
            success(res) {
                if (res.authSetting['scope.userInfo']) {   //已经授权
                    sdkTT.getUserInfoFunc();   //获取用户信息
                } else {
                    //不授权登录
                    sdkTT.onLoginOK(null);
                }
            },
            fail(res) {
                // 获取用户的当前设置失败, 不授权登录
                sdkTT.onLoginOK(null);
            }
        });
    }
    //获取玩家信息
    getUserInfoFunc() {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }

        tt.getUserInfo({
            withCredentials: true,
            success: res => {
                sdkTT.userInfo = res.userInfo;
                sdkTT.onLoginOK(res);
            },
            fail: res => {
                sdkTT.onLoginOK(null);  //不授权登录
            },
            complete: () => {
            },
        });
    }
    
    //////////////////////////////////////
    onLoginOK(res: any) {
        SDKMgr.SDK_Login();
    }

    //登录
    loginTT() {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }

        tt.login({
            force: false,
            success: res => {
                //发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.code) {   //头条账号登录
                    sdkTT.getUserInfo();  //请求用户信息或授权请求
                } else {   //匿名登录
                    sdkTT.onLoginOK(null);  //不授权登录
                }
            },
            fail: res => {
            },
            complete: res => {
            },
        });
    }

    ////////////////////////////广告相关功能  ////////////////////////////////////////////
    curBanner:any = null;
    
    createBannerWithWidth(adUnitId){   //414*144, 315*109.6 349*121.4  300*104.4     高为宽的0.348
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }

        if(this.curBanner != null){   //创建新的 BannerAd 并将之前的 BannerAd 进行销毁。如果不对废弃的 BannerAd 进行销毁，则会导致其上的事件监听器无法释放。
            this.curBanner.destroy();
            this.curBanner = null;
        }

        let adWidth = GameMgr.GetBannerWidth();
        let frameSize = cc.view.getFrameSize();

        let adHeight = (adWidth / 16) * 9; // 根据系统约定尺寸计算出广告高度
        let bannerAd = tt.createBannerAd({
            adUnitId: adUnitId,
            style: {
                left: (sdkTT.systemInfo.windowWidth - adWidth) * 0.5 + 0.1,
                top: (sdkTT.systemInfo.windowHeight - adHeight) + 0.1,
                width: adWidth,   //在组件内部会以此值为基准，根据 Banner 广告的标准尺寸，进行缩放。
            }
        });

        bannerAd.onError(err => {
        });

        bannerAd.onResize(size => {   //如果在 onResize 的回调函数中重设 width 且总是与上一次缩放后的 width 不同，那么可能会导致 onResize 的回调函数一直触发，并卡死在 onResize 的回调函数中。
            bannerAd.style.left = (sdkTT.systemInfo.windowWidth - size.width) * 0.5 + 0.1;
            bannerAd.style.top = (sdkTT.systemInfo.windowHeight - size.height) + 0.1;   //left和top都加上0.1，不加就会被iphonex该死的底部bar给顶上去，而且时而顶上去，时而又是正常
        });

        // 在适合的场景显示 Banner 广告
        //bannerAd.show();
        //this.curBanner = bannerAd;

        let self = this;
        bannerAd.onLoad(function() {
            bannerAd
              .show()
              .then(() => {
                self.curBanner = bannerAd;
              })
              .catch(err => {
              });
          });
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
        console.log("playVideoAd adkey = "+adkey)
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }

        this.callTarget = callTarget;  //
        this.videoCallBack = videoCallBack;   //播放视频成功回调
        this.errorCallBack = errorCallBack;   //加载视频失败回调

        let adId = TT_VedioIds[adkey];
       // console.log("playVideoAd adId = "+adId)
        var rewardedVideoAd = tt.createRewardedVideoAd({
            adUnitId: adId
        });
        rewardedVideoAd.canHandleCallBack = true;

        rewardedVideoAd.onLoad(() =>{
            // if (rewardedVideoAd){
            //     rewardedVideoAd.offLoad()
            // }
        });
        // rewardedVideoAd.show().then(() => {
        //     //console.log("视频显示")
        // })
        // .catch(err => {
            // 可以手动加载一次
            //console.log("视频显示失败， 手动拉去一次")
            rewardedVideoAd.load().then(() => {
                // 加载成功后需要再显示广告
                return rewardedVideoAd.show();
            })
            .catch(err => {
                ROOT_NODE.showTipsText("视频获取失败，"+err.errCode+"; "+err.errMsg)
                if(rewardedVideoAd.canHandleCallBack && sdkTT.errorCallBack && sdkTT.callTarget){
                    rewardedVideoAd.canHandleCallBack = false;
                    sdkTT.errorCallBack.call(sdkTT.callTarget, false);
                }
            });
        //});
        rewardedVideoAd.onClose(res => {
            // if (rewardedVideoAd){
            //     rewardedVideoAd.offClose()//防止多次回调
            // }
            if(rewardedVideoAd.canHandleCallBack == true){
                rewardedVideoAd.canHandleCallBack = false;
                if (res && res.isEnded) {
                    if(sdkTT.videoCallBack && sdkTT.callTarget){
                        sdkTT.videoCallBack.call(sdkTT.callTarget, true);
                    }
                } else {
                    if(sdkTT.videoCallBack && sdkTT.callTarget){
                        sdkTT.videoCallBack.call(sdkTT.callTarget, false);
                    }
                }
            }
        });
        rewardedVideoAd.onError(err => {
            // if (rewardedVideoAd){
            //     rewardedVideoAd.offError()
            // }
            ROOT_NODE.showTipsText("视频获取失败，请稍后重试或重新登录游戏。")
            if(rewardedVideoAd.canHandleCallBack && sdkTT.errorCallBack && sdkTT.callTarget){
                rewardedVideoAd.canHandleCallBack = false;
                sdkTT.errorCallBack.call(sdkTT.callTarget, false);
            }
        });
    }

    requestToutiaoPos() {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }
        tt.getLocation({
            type: 'wgs84',
            altitude: false,
            success: res => {
            },
            fail: res => {
            },
            complete: res => {
            },
        });
    }

    openSetting(callback, scope_str) {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }
        tt.openSetting({
            success: res => {
            },
            fail: res => {
            },
            complete: res => {
            },
        });
    }

    exitMiniProgram() {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }
        tt.exitMiniProgram({
            success: res => {
            },
            fail: res => {
            },
            complete: res => {
            }
        });
    }

    vibrateLong() {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }
        tt.vibrateLong({
            success: function (res) {
            },
            fail: function (res) {
            },
            complete: function (res) {
            },
        });
    }

    getNetworkType(callback) {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }
        tt.getNetworkType({
            success: function (res) {
                sdkTT.networkType = res.networkType;
            },
            fail: function (res) {
            },
            complete: function (res) {
            },
        });
    }

    //录屏
    game_recorder: any = null;
    is_recording_video: boolean = false;
    startRecordTime: any = null;
    stopRecordTime: any = null;

    createGameRecordManager() {
        let tt = (window as any).tt;  
        if (tt == null) {
            return;
        }
        this.game_recorder = tt.getGameRecorderManager();
        this.game_recorder.onStart(res => {
            sdkTT.is_recording_video = true;
            sdkTT.startRecordTime = new Date().getTime();
            FightMgr.getFightScene().showRecordSpr();
        });
        this.game_recorder.onStop(res => {
            sdkTT.is_recording_video = false;
            sdkTT.stopRecordTime = new Date().getTime();
            sdkTT.dealRecordVideoStopHandler(res.videoPath);
            FightMgr.getFightScene().showRecordSpr();
        });
        this.game_recorder.onError(res => {
            sdkTT.is_recording_video = false;
            FightMgr.getFightScene().showRecordSpr();
        });

        this.game_recorder.start({
            duration: 300
        });
    }
    dealRecordVideoStopHandler(videoPath) {
        if (!this.startRecordTime || !this.stopRecordTime) {
            return;
        }
        if ((this.stopRecordTime - this.startRecordTime)/1000.0 <= 3.0) {
            ROOT_NODE.showTipsText('亲，时间太短啦，需要录制超过3秒');
            return;
        }

        GameMgr.showTipsDialog("录屏完成，快去分享给好友吧？", ()=>{
            let tt = (window as any).tt;  
            if (tt == null) {
                return;
            }
            tt.shareAppMessage({
                channel: 'video',
                imageUrl: shareImageUrl,
                query: '',
                extra: {
                    videoPath: videoPath,
                    videoTopics: ['联萌大作战'],
                    createChallenge: false
                },
                success() {
                },
                fail() {
                }
            });
        });
    }
    stopGameRecord() {
        if (this.game_recorder) {
            this.game_recorder.stop();
        }
    }

    toutiao_startRecord_mp3() {
        let auth_val = this.get_auth_scope('scope.record');
        this.record_state = 0; //  0:开始 1：结束
        if (auth_val > 0) {
            this.start_record_voice_time = new Date().getTime();
            this.recorderManager.start({
                sampleRate: 8000,
                numberOfChannels: 1,
                encodeBitRate: 16000,
                format: 'mp3'
            });

        } else {
            this.authorize(
                'scope.record',
                success => {
                },
                fail => {
                    ROOT_NODE.showTipsText('录音失败,请打开右上角菜单设置内语音权限');
                }
            );
        }
    }
    toutiao_stopRecord() {
        this.is_canel_record = false;
        this.record_state = 1;
        this.stop_record_voice_time = new Date().getTime();
        this.recorderManager.stop();
    }
    toutiao_canelRecord() {
        this.is_canel_record = true;
        this.recorderManager.stop();
    }

}

export var sdkTT = new SDK_TT();

