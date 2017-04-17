--初次进入游戏时的剧情动画
local StoryScene = class("StoryScene", cc.Scene)

function StoryScene:create()   --自定义的create()创建方法
    --G_Log_Info("StoryScene:create()")
    local scene = StoryScene.new()
    return scene
end

function StoryScene:ctor()  --new()会自动调用ctor()
    --G_Log_Info("StoryScene:ctor()")
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

function StoryScene:init()  
    --G_Log_Info("StoryScene:init()")
    local StoryLayer = require("Layer.Story.StoryLayer")
    local layer = StoryLayer:new()
    self:addChild(layer)
end

function StoryScene:onEnter()
    --G_Log_Info("StoryScene:onEnter()")
end

function StoryScene:onExit() 
    --G_Log_Info("StoryScene:onExit()")
end



return StoryScene
