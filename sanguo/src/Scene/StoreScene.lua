--初次进入游戏时的剧情动画
local StoreLayer = require("Layer.StoreLayer")

local StoreScene = class("StoreScene", cc.Scene)

function StoreScene:create()   --自定义的create()创建方法
    print("StoreScene:create()")
    local scene = StoreScene.new()
    return scene
end

function StoreScene:ctor()  --new()会自动调用ctor()
    print("StoreScene:ctor()")
    local function onNodeEvent(event)
        if event == "enter" then
            self:onEnter()
        --elseif event == "enterTransitionFinish" then
            --self:enterTransitionFinish()
        elseif event == "exit" then
            self:onExit()
        --elseif event == "cleanup" then
            --self:onCleanup()   
        end
    end
    
    self:registerScriptHandler(onNodeEvent)

    self:init()
end

function StoreScene:init()  
    print("StoreScene:init()")
    local layer = StoreLayer:new()
    self:addChild(layer)
end

function StoreScene:onEnter()
    print("StoreScene:onEnter()")
end

function StoreScene:onExit() 
    print("StoreScene:onExit()")
end



return StoreScene
