--主场景

local GameScene = class("GameScene",function()
    return cc.Scene:create()
end)

function GameScene:create()   --自定义的create()创建方法
    local scene = GameScene.new()
    return scene
end

function GameScene:ctor()   --new()会自动调用ctor()
	--GameScene.super.ctor(self)
	self:init()
end

function GameScene:init()  

    local function onNodeEvent(event)  
        if "enter" == event then  
        elseif "exit" == event then  
            --self:unregisterScriptHandler()
            --self:unscheduleUpdate()
        end  
    end  
  
    self:registerScriptHandler(onNodeEvent)  

    --local mainMenu = require "Layer/MainMenuLayer"
    --self.mainMenuLayer = mainMenu.new()
    --主菜单层
    self.mainMenuLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_MAINMENU, "MainMenuLayer")
    --主城层
    self.mainCityLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_MAINCITY, "MainCityLayer")
    --全国地图层
    self.chinaMapLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_CHINAMAP, "ChinaMapLayer")
        
end

function GameScene:AddChild(uid, className, funcName, userTable)
    print("AddChild:", uid, className)
   
    local layer = self:getChildByTag(uid)
    if layer ~= nil then
        self:removeChildByTag(uid)
    end
    
    layer = require("Layer/"..className)
    local child = layer.new()  --layer:create()
    child:setTag(uid)
    self:addChild(child)

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
        fun(child,userTable)
    end
    
    return child
end

function GameScene:RemoveChildByUid(uid)
    local layer = self:getChildByTag(uid)
    if layer ~= nil then
        self:removeChildByTag(uid)
    end
end

function GameScene:RemoveAllChild()
    local children = self:getChildren()
    for i = 1,#(children) do
        if children[i]:getTag() < g_GameLayerTag.LAYER_TAG_MAINMENU 
            or children[i]:getTag() > g_GameLayerTag.LAYER_TAG_CHINAMAP then
            children[i]:removeFromParent()
        end
    end
end

function GameScene:GetLayerByUid(uid)
    local layer = self:getChildByTag(uid)
    if layer ~= nil then
        return layer
    end
    return nil
end




return GameScene
