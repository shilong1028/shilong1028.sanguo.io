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

function GameScene:init()  
    G_Log_Info("GameScene:init()")   
    local gameLayer = require("Layer.GameLayer")
    g_pGameLayer = gameLayer:create()  --gameLayer:new()
    self:addChild(g_pGameLayer)

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


return GameScene
