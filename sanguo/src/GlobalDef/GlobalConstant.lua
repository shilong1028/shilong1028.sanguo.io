

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
--事件分发器单例
g_EventDispatcher = cc.Director:getInstance():getEventDispatcher()
--精灵缓存
g_SpriteFrameCache = cc.SpriteFrameCache:getInstance()
--用户游戏数据xml文件写入路径
g_XmlWritePath = cc.FileUtils:getInstance():getWritablePath()    --在工程根目录中的myXmlData文件夹中
g_XmlWritePath_Win = cc.FileUtils:getInstance():getWritablePath().."myXmlData/"    --在工程根目录中的myXmlData文件夹中

--自定义的LayerEx, 作为游戏各功能Layer的父类
CCLayerEx = nil  

--全局唯一游戏场景对象
g_pGameScene = nil  --g_pGameScene包含g_pGameLayer以及一些游戏初始化及网络连接的内容
g_pGameLayer = nil  --g_pGameLayer是g_pGameScene的子层，用于承载游戏各种功能界面

g_UserDefaultMgr = nil  --本地信息管理单例
g_VideoPlayerMgr = nil  --VideoPlayerMgr用于跨平台播放mp4视频
g_NetworkMgr = nil  --用于服务器和客户端之间的socket通信连接
g_NetMsgDealMgr = nil  --用于客户端和服务器之间的通信管理
g_pAutoPathMgr = nil  --寻路管理器单例
g_pTBLMgr = nil       --本地tbl表格数据单例

--玩家游戏数据管理
g_HeroDataMgr = nil

--理游戏中的全局数据处理
g_GameDataMgr = nil 

--州郡地图管理单例
g_pMapMgr = nil     

--用于游戏战斗信息  
g_BattleDataMgr = nil

--默认的华康圆体路径
g_sDefaultTTFpath = "font/simkai.ttf"   

--AStar寻路
g_bAStarPathSmooth = true --false --寻路拉直

--玩家阵营ID
g_campId = 0

--部曲出战最小士兵数量
g_UnitFightMinBingCount = 100

--默认文本大小
g_defaultFontSize = 20
g_defaultTipsFontSize = 24    --滚动提示文本大小
g_rewardTipsFontSize = 28    --奖励提示文字大小
g_defaultChengFontSize = 40   --城池名字大小
g_defaultJumpPtFontSize = 30   --跳转点名字大小

--定义一个Zorder用于显示一些最上层数据
g_TopZOrder = 100

--故事背景图片数量，用于随机Loading背景
g_StoryBgCount = 24


--内网服务器IP和Port
-- g_SERVER_IP = "192.168.0.183"
-- g_SERVER_PORT = "6102" 

--外网服务器IP和Port
g_SERVER_IP = "115.159.99.24"
g_SERVER_PORT = "6102" 
