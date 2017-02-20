
--g_pGameLayer是g_pGameScene的子层，用于承载游戏各种功能界面
local GameLayer = class("GameLayer", CCLayerEx) --填入类名

-- function GameLayer:create()   --自定义的create()创建方法
--     G_Log_Info("GameLayer:create()")
--     local layer = GameLayer.new()
--     return layer
-- end

-- function GameLayer:ctor()   --new()会自动调用ctor()，如果直接调用.new()或:new()方法则会直接调用ctor()而不再调用create()
--     G_Log_Info("GameLayer:ctor()")
--     self.owner = self.owner or {}
    
--     self:initNodeEvent()
-- 	self:init()
-- end

-- function GameLayer:initNodeEvent()
--     G_Log_Info("CCLayerEx:initNodeEvent()")
--     local function onNodeEvent(eventName)  
--         if "enter" == eventName then 
--             self:onEnter() 
--         elseif "exit" == eventName then  
--             self:onExit()
--         elseif "enterTransitionFinish" == eventName then
--             self:onEnterTransitionFinish()
--         elseif "exitTransitionStart" == eventName then    
--             self:onExitTransitionStart()
--         elseif "cleanup" == eventName then
--             self:onCleanup()
--         end  
--     end  
  
--     self:registerScriptHandler(onNodeEvent) 
-- end

-- function GameLayer:onEnter()
-- end

-- function GameLayer:onExit()
-- end

-- function GameLayer:onEnterTransitionFinish()
-- end

-- function GameLayer:onExitTransitionStart()
-- end

-- function GameLayer:onCleanup()
-- end

function GameLayer:init()  
    G_Log_Info("GameLayer:init()")
    

    -- --主菜单层
    -- self.mainMenuLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_MAINMENU, "MainMenuLayer")
    -- --主城层
    -- self.mainCityLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_MAINCITY, "MainCityLayer")
    -- --全国地图层
    -- self.chinaMapLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_CHINAMAP, "ChinaMapLayer")
end

function GameLayer:AddChild(uid, className, funcName, userTable)   --className为Layer目录下的界面类路径，funcName为初始化方法，userTable初始数据
    G_Log_Info("GameLayer:AddChild: ", uid, className)
   
    local layer = self:getChildByTag(uid)
    if layer ~= nil then
        self:removeChildByTag(uid)
    end
    
    if type(className) == "string" then
        layer = require("Layer."..className)
        local child = layer:create()  --layer.new()
        child:setTag(uid)
        self:addChild(child)
    else
        G_Log_Fatal(msg) 
    end

    if uid == g_GameLayerTag.LAYER_TAG_MAINMENU then  --主界面
        child:setLocalZOrder(-1)
    elseif uid == g_GameLayerTag.LAYER_TAG_MAINCITY then  --主城
        child:setLocalZOrder(-2)
    elseif uid == g_GameLayerTag.LAYER_TAG_CHINAMAP then  --全国地图
        child:setLocalZOrder(-3)
    end
    
    --初始数据
    if funcName then
        local fun = child[funcName]
        fun(userTable)
    end
    
    return child
end

function GameLayer:RemoveChildByUid(uid)
    local layer = self:getChildByTag(uid)
    if layer ~= nil then
        self:removeChildByTag(uid)
    end
end

function GameLayer:RemoveAllChild()
    local children = self:getChildren()
    for i = 1,#(children) do
        if children[i]:getTag() < g_GameLayerTag.LAYER_TAG_MAINMENU 
            or children[i]:getTag() > g_GameLayerTag.LAYER_TAG_CHINAMAP then
            children[i]:removeFromParent()
        end
    end
end

function GameLayer:GetLayerByUid(uid)
    local layer = self:getChildByTag(uid)
    if layer ~= nil then
        return layer
    end
    return nil
end




return GameLayer
