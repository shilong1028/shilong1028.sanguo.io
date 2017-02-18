--公司logo
-- local HealthAnnouncementScene = class("HealthAnnouncementScene",function()
--     return cc.Scene:create()
-- end)

local HealthAnnouncementScene = class("HealthAnnouncementScene", cc.Scene)

function HealthAnnouncementScene:create()
    local scene = HealthAnnouncementScene.new()
    return scene
end

function HealthAnnouncementScene:ctor()
    self:init()
end

function HealthAnnouncementScene:init()  
    local frameSize = cc.Director:getInstance():getVisibleSize()
    
    local layer = cc.Layer:create()
    layer:setContentSize(frameSize)  
    self:addChild(layer)
        
    --游戏健康公告
    local bkSprite = cc.Sprite:create("Image/HealthAnnouncement.png")
    bkSprite:setPosition(cc.p(frameSize.width/2, frameSize.height/2))
    layer:addChild(bkSprite)
    
    -- bkSprite:runAction(cc.Sequence:create(cc.DelayTime:create(0.5), cc.CallFunc:create(function() 
    --     local scene = require("Scene.GameScene")
    --     G_pGameScene = scene:new()
    --     if cc.Director:getInstance():getRunningScene() then
    --         cc.Director:getInstance():replaceScene(cc.TransitionFade:create(1.0, G_pGameScene, cc.c3b(0,0,0)))
    --     else
    --         cc.Director:getInstance():runWithScene(G_pGameScene)
    --     end
    -- end)))
end

return HealthAnnouncementScene
