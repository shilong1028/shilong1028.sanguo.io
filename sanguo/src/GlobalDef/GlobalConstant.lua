

--GlobalConstant.lua用于用户自定义全局常量, 自定义全局常量名前以 g_ 为标志

--运行平台在cocos\framework\device.lua中也有些其他定义
g_AppPlatform = cc.Application:getInstance():getTargetPlatform()

--导演单例
g_Director = cc.Director:getInstance()
g_VisibleSize = g_Director:getVisibleSize()
g_WinSize = g_Director:getWinSize()
--FrameSize就是屏幕的实际分辨率，这是不变的。比如我用的盖世三的手机分辨率为1280x720，这就是盖世三的FrameSize。
--分辨率和实际的长宽没有必然联系。比如，盖世3的尺寸（长宽）为4.8寸，分辨率为1280x720
--WinSize就是设计分辨率，相当于游戏设计的逻辑大小，可以这样理解，上面的FrameSize就是画框，这里的WinSize就是画布。
--VisibleSize就是画布显示在画框中的部分，注意：它的大小是用WinSize来表示的。
--VisibleOrigin就是VisibleSize在画框中的左下角坐标点，注意也是用WinSize来表示的。

--定时器单例
g_Scheduler = cc.Director:getInstance():getScheduler()

--自定义的LayerEx, 作为游戏各功能Layer的父类
CCLayerEx = nil  

--全局唯一游戏场景对象
g_pGameScene = nil  --g_pGameScene包含g_pGameLayer以及一些游戏初始化及网络连接的内容
g_pGameLayer = nil  --g_pGameLayer是g_pGameScene的子层，用于承载游戏各种功能界面

g_pAutoPathMgr = nil  --寻路管理器单例
g_pMapMgr = nil       --州郡地图管理单例
g_pTBLMgr = nil       --本地tbl表格数据单例

--默认的华康圆体路径
g_sDefaultTTFpath = "font/DFYuanW7-GB2312.ttf"

--是否支持视频mp4（苹果或安卓）
g_bSupportVideoPlayer = false

--AStar寻路
g_bAStarPathSmooth = true --false --寻路拉直