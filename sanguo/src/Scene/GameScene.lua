--主场景

local GameScene = class("GameScene",function()
    return cc.Scene:create()
end)

function GameScene:create()   --自定义的create()创建方法
    --G_Log_Info("GameScene:create()")
    local scene = GameScene.new()
    return scene
end

function GameScene:ctor()   --new()会自动调用ctor()，如果直接调用.new()或:new()方法则会直接调用ctor()而不再调用create()
    --G_Log_Info("GameScene:ctor()")
    self:initNodeEvent()
	self:init()
end

function GameScene:initNodeEvent()
    --G_Log_Info("GameScene:initNodeEvent()")
    local function onNodeEvent(eventName)  
        if "enter" == eventName then 
            self:onEnter() 
        elseif "exit" == eventName then  
            self:onExit()
        elseif "enterTransitionFinish" == eventName then
            self:onEnterTransitionFinish()
        elseif "exitTransitionStart" == eventName then    
            self:onExitTransitionStart()
        elseif "cleanup" == eventName then
            self:onCleanup()
        end  
    end  
  
    self:registerScriptHandler(onNodeEvent) 
end

function GameScene:onEnter()
    --G_Log_Info("GameScene:onEnter()")
end

function GameScene:onExit()
    --G_Log_Info("GameScene:onExit()")
end

function GameScene:onEnterTransitionFinish()
    --G_Log_Info("GameScene:onEnterTransitionFinish()")
    local NetworkMgr = require "Manager.NetworkMgr"
    g_NetworkMgr = g_NetworkMgr or NetworkMgr:GetInstance()  --用于服务器和客户端之间的socket通信连接
end

function GameScene:onExitTransitionStart()
    --G_Log_Info("GameScene:onExitTransitionStart()")
end

function GameScene:onCleanup()
    --G_Log_Info("GameScene:onCleanup()")
end

--结束游戏
function GameScene:ExitGame()
    g_NetworkMgr:delInstance()
    cc.Director:getInstance():endToLua()
end

function GameScene:initGameManager()
    --玩家游戏数据管理
    local HeroDataMgr = require "Manager.HeroDataMgr"
    g_HeroDataMgr = g_HeroDataMgr or HeroDataMgr:GetInstance()

    --理游戏中的全局数据处理
    local GameDataMgr = require "Manager.GameDataMgr"
    g_GameDataMgr = g_GameDataMgr or GameDataMgr:GetInstance()

    --州郡地图管理单例
    local MapMgr = require "Manager.MapMgr"
    g_pMapMgr = g_pMapMgr or MapMgr:GetInstance()       --州郡地图管理单例
end

function GameScene:clearGameManager()
    package.loaded["Manager.HeroDataMgr"] = nil 
    g_HeroDataMgr = nil   --玩家游戏数据管理

    package.loaded["Manager.GameDataMgr"] = nil 
    g_GameDataMgr = nil   --理游戏中的全局数据处理

    package.loaded["Manager.nil"] = nil 
    g_pMapMgr = nil     --州郡地图管理单例
end


function GameScene:init()  
    --G_Log_Info("GameScene:init()")   
    self:initGameManager()

    local gameLayer = require("Layer.GameLayer")
    g_pGameLayer = gameLayer:create()  --gameLayer:new()
    self:addChild(g_pGameLayer)

    g_SpriteFrameCache:addSpriteFrames("plist/PublicRes2.plist", "plist/PublicRes2.png")

    --动画修改工具
    --g_pGameLayer:AddChild(g_GameLayerTag.LAYER_TAG_AniToolLayer, "AniTool.AniToolLayer")  

    --登录界面
    g_pGameLayer:AddChild(g_GameLayerTag.LAYER_TAG_LoginLayer, "Login.LoginLayer")

     --监听手机返回键
    if g_AppPlatform == cc.PLATFORM_OS_ANDROID then
        local function onRelease( keyCode, event )
            if keyCode == cc.KeyCode.KEY_BACK then
                self:ExitGame()
            end   
        end
        local listener = cc.EventListenerKeyboard:create()
        listener:registerScriptHandler(onRelease, cc.Handler.EVENT_KEYBOARD_RELEASED)
        g_EventDispatcher:addEventListenerWithSceneGraphPriority(listener,self) 
    end
end

--重新登录
function GameScene:reloadGame()
    G_Log_Warning("GameScene:reloadGame()")
    g_pGameLayer:showLoadingLayer(true) 

    self:clearGameManager()
    g_NetworkMgr:StopCurConnect()

    g_UserDefaultMgr:ClearUseXml("heroXML.xml")   --保存下一个主线剧情任务ID
    g_pGameLayer:ShowScrollTips("清空heroXml，重启后生效！")

    -- self:runAction(cc.Sequence:create(cc.DelayTime:create(1.0), cc.CallFunc:create(function() 
    --     local scene = require("Scene.HealthAnnouncementScene")
    --     local nextScene = scene:create()  --scene:new()

    --     if cc.Director:getInstance():getRunningScene() then
    --         cc.Director:getInstance():replaceScene(nextScene)  --cc.TransitionFade:create(1.0, nextScene, cc.c3b(0,0,0)))
    --     else
    --         cc.Director:getInstance():runWithScene(nextScene)
    --     end
    -- end)))

    SystemHelper:reloadGame()

    --[[
    local function table_clear(t)
        --这个要注意，#只针对连续数字下标的table
        while(t and #t > 0)do
            table.remove(t,1)
        end
        --非连续数字下标的key
        for k,v in pairs(t) do
            t[k] = nil
        end
    end

    local function table_contains(t,v)
        if not t then return false end;
        for k,value in pairs(t) do
            if value == v then
                return true
            end
        end
        return false
    end

    --理论上不是来自cocos2dx的cc.Node,都可以不重新加载
    local ignoreKeys = {"Manager.UserDefaultMgr", "Manager.VideoPlayerMgr", "Manager.TBLMgr", "Manager.AutoPathMgr", "Manager.NetMsgDealMgr"} --重登无需重新加载的模块,
    if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then --Windows调试时候全部重载，调试代码方便
        --table_clear(ignoreKeys)
    end

    for k,v in pairs(package.loaded) do
        if table_contains(_G["loadedOriginKey"],tostring(k)) then --_G底下的原始table,重登无需重复加载
            --print("not clear package.loaded",k,v)       
        elseif table_contains(ignoreKeys,tostring(k)) then --手动标记的部分table,重登无需重复加载
            --print("ignore package.loaded",k,v)  
        else
            package.loaded[k] = nil 
            --print("clear package.loaded",k,v) 
        end
        package.loaded[k] = nil 
    end

    _G["reloadGameInfo"] = {} --标记为重新登录，与第一次登录区别开
    SystemHelper:reloadGame()
    --]]
end


return GameScene
