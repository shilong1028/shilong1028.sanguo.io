

--GlobalConstant.lua用于用户自定义全局常量, 自定义全局常量名前以 g_ 为标志

--运行平台在cocos\framework\device.lua中也有些其他定义
g_AppPlatform = cc.Application:getInstance():getTargetPlatform()

--导演单例
g_Director = cc.Director:getInstance()

--自定义的LayerEx, 作为游戏各功能Layer的父类
CCLayerEx = nil  



--全局唯一游戏场景对象
g_pGameScene = nil  --g_pGameScene包含g_pGameLayer以及一些游戏初始化及网络连接的内容
g_pGameLayer = nil  --g_pGameLayer是g_pGameScene的子层，用于承载游戏各种功能界面

--是否支持视频mp4（苹果或安卓）
g_bSupportVideoPlayer = false