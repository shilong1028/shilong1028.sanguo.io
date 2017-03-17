--初次进入游戏时的剧情动画
local StoreScene = class("StoreScene", cc.Scene)

function StoreScene:create()   --自定义的create()创建方法
    --G_Log_Info("StoreScene:create()")
    local scene = StoreScene.new()
    return scene
end

function StoreScene:ctor()  --new()会自动调用ctor()
    --G_Log_Info("StoreScene:ctor()")
    local function onNodeEvent(event)
        if event == "enter" then
            self:onEnter()
        elseif event == "enterTransitionFinish" then
            self:init()
        --self:enterTransitionFinish()
        elseif event == "exit" then
            self:onExit()
        --elseif event == "cleanup" then
            --self:onCleanup()   
        end
    end
    
    self:registerScriptHandler(onNodeEvent)
end

function StoreScene:init()  
    --G_Log_Info("StoreScene:init()")
    local StoreLayer = require("Layer.StoreLayer")
    local layer = StoreLayer:new()
    self:addChild(layer)
end

function StoreScene:onEnter()
    --G_Log_Info("StoreScene:onEnter()")
end

function StoreScene:onExit() 
    --G_Log_Info("StoreScene:onExit()")
end



return StoreScene
