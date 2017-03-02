
--g_pGameLayer是g_pGameScene的子层，用于承载游戏各种功能界面
local GameLayer = class("GameLayer", CCLayerEx) --填入类名

function GameLayer:create()   --自定义的create()创建方法
    --G_Log_Info("GameLayer:create()")
    local layer = GameLayer.new()
    return layer
end

function GameLayer:onExit()
    --G_Log_Info("GameLayer:onExit()")
    self.requireLuaVec = {}   --每个功能的Lua文件仅require一次即可

end

function GameLayer:init()  
    --G_Log_Info("GameLayer:init()")
    self.requireLuaVec = {}   --每个功能的Lua文件仅require一次即可
    
    --动画修改工具
    --self:AddChild(g_GameLayerTag.LAYER_TAG_AniToolLayer, "AniTool.AniToolLayer")
    -- --主菜单层
    -- self.MenuLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_MAINMENU, "MainMenuLayer")
    -- --主城层
    -- self.mainCityLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_MAINCITY, "MainCityLayer")
    --地图层
    self.MapLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_CHINAMAP, "MapLayer")
end

function GameLayer:AddChild(uid, className, funcName, userTable)   --className为Layer目录下的界面类路径，funcName为初始化方法，userTable初始数据
    G_Log_Info("GameLayer:AddChild: uid = %d, className = %s", uid, className)
   
    local layer = self:getChildByTag(uid)
    if layer ~= nil then
        self:removeChildByTag(uid)
    end
    
    if type(className) == "string" then
        local file = self.requireLuaVec["uid"..uid]
        if not file then
            file = require("Layer."..className)
            self.requireLuaVec["uid"..uid] = file
        end
        local child = file:create()  --file:new()
        child:setTag(uid)
        self:addChild(child)

        if uid == g_GameLayerTag.LAYER_TAG_MAINMENU then  --主菜单层
            child:setLocalZOrder(-1)
        elseif uid == g_GameLayerTag.LAYER_TAG_MAINCITY then  --主城层
            child:setLocalZOrder(-10)
        elseif uid == g_GameLayerTag.LAYER_TAG_CHINAMAP then  --地图层
            child:setLocalZOrder(-20)
        end

    else
        G_Log_Fatal("the lua file is nin, file = ", className) 
    end
  
    --初始数据
    if funcName then
        local fun = child[funcName]
        fun(userTable)
    end
    
    return child
end

function GameLayer:RemoveChildByUId(uid)
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

function GameLayer:GetLayerByUId(uid)
    local layer = self:getChildByTag(uid)
    if layer ~= nil then
        return layer
    end
    return nil
end




return GameLayer
