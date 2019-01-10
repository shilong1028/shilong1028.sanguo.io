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
    g_pMapMgr = g_pMapMgr or MapMgr:GetInstance() 

    --用于游戏战斗信息
    local BattleDataMgr = require "Manager.BattleDataMgr"
    g_BattleDataMgr = g_BattleDataMgr or BattleDataMgr:GetInstance() 
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

--重新开始游戏，并清空所有数据
function GameScene:reloadGameAndClearData()
    G_Log_Warning("GameScene:reloadGameAndClearData()")
    g_pGameLayer:showLoadingLayer(true) 

    g_HeroDataMgr:ClearAllUserXML()
    g_pGameLayer:ShowScrollTips("清空所有Xml，重启后生效！")

    self:runAction(cc.Sequence:create(cc.DelayTime:create(1.0), cc.CallFunc:create(function() 
        g_pGameLayer:showLoadingLayer(false)
        self:clearGameManager()
        g_NetworkMgr:StopCurConnect()

        local scene = require("Scene.HealthAnnouncementScene")
        local nextScene = scene:create()  --scene:new()

        if cc.Director:getInstance():getRunningScene() then
            cc.Director:getInstance():replaceScene(nextScene)  --cc.TransitionFade:create(1.0, nextScene, cc.c3b(0,0,0)))
        else
            cc.Director:getInstance():runWithScene(nextScene)
        end
    end)))
end


return GameScene
