--公司logo
-- local HealthAnnouncementScene = class("HealthAnnouncementScene",function()
--     return cc.Scene:create()
-- end)

local HealthAnnouncementScene = class("HealthAnnouncementScene", cc.Scene)

function HealthAnnouncementScene:create()
    --G_Log_Info("HealthScene:create()")
    local scene = HealthAnnouncementScene.new()
    return scene
end

function HealthAnnouncementScene:ctor()
    --G_Log_Info("HealthScene:ctor()")
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
    
    self:init()
end

function HealthAnnouncementScene:onEnter()
    --G_Log_Info("HealthScene:onEnter()")
end

function HealthAnnouncementScene:onExit()
    --G_Log_Info("HealthScene:onExit()")
end

function HealthAnnouncementScene:onEnterTransitionFinish()
    --G_Log_Info("HealthScene:onEnterTransitionFinish()")
end

function HealthAnnouncementScene:onExitTransitionStart()
    --G_Log_Info("HealthScene:onExitTransitionStart()")
end

function HealthAnnouncementScene:onCleanup()
    --G_Log_Info("HealthScene:onCleanup()")
end

function HealthAnnouncementScene:init()  
    --G_Log_Info("HealthScene:init()")
    local layer = cc.Layer:create()
    layer:setContentSize(g_WinSize)  
    self:addChild(layer)
        
    --游戏健康公告
    local bkSprite = cc.Sprite:create("Image/Image_HealthAnnouncement.png")
    --local bkSprite = cc.Scale9Sprite:create("Image/HealthAnnouncement.png", cc.rect(10, 10, 10, 10))
    --bkSprite:setContentSize(frameSize)
    G_Resolution_BgImage(bkSprite, g_WinSize, "NO_BORDER")
    bkSprite:setPosition(cc.p(g_WinSize.width/2, g_WinSize.height/2))
    layer:addChild(bkSprite)
    
    bkSprite:runAction(cc.Sequence:create(cc.DelayTime:create(1.0), cc.CallFunc:create(function() 
        local scene = nil
        local nextScene = nil
        local bfirstLogin = true --g_UserDefaultMgr:GetIsFirstLogin()   --是否第一次登陆
        if bfirstLogin == true then
            scene = require("Scene.StoreScene")
            nextScene = scene:create()  --scene:new()
        else
            scene = require("Scene.GameScene")   --进入登录界面
            nextScene = scene:create()  --scene:new()
            g_pGameScene = nextScene
        end

        if cc.Director:getInstance():getRunningScene() then
            cc.Director:getInstance():replaceScene(nextScene)  --cc.TransitionFade:create(1.0, nextScene, cc.c3b(0,0,0)))
        else
            cc.Director:getInstance():runWithScene(nextScene)
        end
    end)))
end

return HealthAnnouncementScene
