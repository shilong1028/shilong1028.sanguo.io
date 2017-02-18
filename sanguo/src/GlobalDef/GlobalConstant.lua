

--GlobalConstant.lua用于用户自定义全局常量

--运行平台在cocos\framework\device.lua中也有些其他定义
G_AppPlatform = cc.Application:getInstance():getTargetPlatform()

--导演单例
G_Director = cc.Director:getInstance()





--全局唯一游戏场景对象
G_pGameScene = nil  
G_pGameLayer = nil

--是否支持视频mp4（苹果或安卓）
G_bSupportVideoPlayer = false