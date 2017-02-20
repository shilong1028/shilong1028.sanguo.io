
--关闭编译时客户端显示fileutils加载luac文件的信息提示
cc.FileUtils:getInstance():setPopupNotify(false)

cc.FileUtils:getInstance():addSearchPath("src/")
cc.FileUtils:getInstance():addSearchPath("res/")

require "config"
require "cocos.init"
--cocos.init文件根据配置信息初始化Cocos2d-lua框架（require加载lua模块时必须使用”.”来代替路径中的”/”符号）
require "GlobalDef.init"  --用户全局自定义
require "Manager.init"  --用户全局管理器

local function main()
    collectgarbage("collect")
    -- avoid memory leak
    collectgarbage("setpause", 100)
    collectgarbage("setstepmul", 5000)
    math.randomseed(os.time())

	--set FPS. the default value is 1.0/60 if you don't call this
	g_Director:setAnimationInterval(1.0 / 30)

	--turn on display FPS
	if CC_SHOW_FPS == true then      
		g_Director:setDisplayStats(true)
	else
		g_Director:setDisplayStats(false)
    end

    --是否支持视频mp4（苹果或安卓）
    if (cc.PLATFORM_OS_IPHONE == g_AppPlatform or cc.PLATFORM_OS_IPAD == g_AppPlatform or cc.PLATFORM_OS_ANDROID == g_AppPlatform) then
        g_bSupportVideoPlayer = true
    else
        g_bSupportVideoPlayer = false
    end
    
    --自定义的LayerEx, 作为游戏各功能Layer的父类
    CCLayerEx = require("Layer.CCLayerEx")

    --健康公告场景
    local scene = require("Scene.HealthAnnouncementScene")
    scene = scene:new()
    if cc.Director:getInstance():getRunningScene() then
        cc.Director:getInstance():replaceScene(cc.TransitionFade:create(1.0, scene, cc.c3b(0,0,0)))
    else
        cc.Director:getInstance():runWithScene(scene)
    end
end

--使用xpcall可以解决这个问题, 比pcall多了一个参数。使用debug.traceback可以将traceback的信息存储到msg变量。
--xpcall 接受两个参数：调用函数、错误处理函数。当错误发生时，Lua会在栈释放以前调用错误处理函数，因此可以使用debug库收集错误相关信息。
--常用的debug处理函数：debug.debug和debug.traceback，前者给出Lua的提示符，你可以自己动手察看错误发生时的情况；
--后者通过traceback创建更多的错误信息，也是控制台解释器用来构建错误信息的函数。
--你可以在任何时候调用debug.traceback获取当前运行的traceback信息。
local status, msg = xpcall(main, __G__TRACKBACK__)
if not status then
	print("----------------------------------------------------------")
    print("LUA-ERROR from __G__TRACKBACK__:",msg)
    print("----------------------------------------------------------")
end
