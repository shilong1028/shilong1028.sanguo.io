
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

    --登录界面
    self:AddChild(g_GameLayerTag.LAYER_TAG_LoginLayer, "Login.LoginLayer")
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
        layer = file:create()  --file:new()
        layer:setTag(uid)
        self:addChild(layer)

        if uid == g_GameLayerTag.LAYER_TAG_MAINMENU then  --主菜单层
            layer:setLocalZOrder(-1)
        elseif uid == g_GameLayerTag.LAYER_TAG_MAINCITY then  --主城层
            layer:setLocalZOrder(-10)
        elseif uid == g_GameLayerTag.LAYER_TAG_CHINAMAP then  --地图层
            layer:setLocalZOrder(-20)
        end

    else
        G_Log_Fatal("the lua file is nin, file = ", className) 
    end
  
    --初始数据
    if funcName then
        local fun = layer[funcName]
        fun(userTable)
    end
    
    return layer
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
            children[i]:removeFromParent(true)
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

--[[
--滚动列表叠加显示提示界面
tipsArr = {
{text, color, fontSize},
{text, color, fontSize}
}
]]
function GameLayer:ShowScrollTips(tips, color, fontSize)
    local tipsArr = {}
    if type(tips) == "string" then
        local cell = g_ScrollTips_text:new()
        cell.text = tips

        if color then
            cell.color = color
        end
        if fontSize then
            cell.fontSize = fontSize
        end
        table.insert(tipsArr, cell)
    elseif type(tips) == "table" then
        for i=1, #(tips)do
            if(tips[i].text and tips[i].text ~= "")then
                table.insert(tipsArr, tips[i])
            end
        end
    else
        g_Log_Error("ShowScrollTips, type(tips) is error!")
        return
    end

    if #tipsArr < 1 then
        g_Log_Warning("ShowScrollTips, tipsArr is empty!")
        return
    end

    local scrollTipsLayer = self:getChildByTag(g_GameLayerTag.LAYER_TAG_ScrollTipsLayer)
    if(scrollTipsLayer == nil) then
        scrollTipsLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_ScrollTipsLayer, "TipsOrDialog.ScrollTipsLayer")
        scrollTipsLayer:setLocalZOrder(g_TopZOrder)
    end

    scrollTipsLayer:setTexts(tipsArr)   

    return scrollTipsLayer
end


--/////////////////////// 以下为各个功能界面开启  ////////////////////////////

--开始游戏界面
function GameLayer:StartGameLayer()
    self:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_LoginLayer)
    --主城层
    --self.mainCityLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_MAINCITY, "MainCityLayer")
    --主菜单层
    self.MenuLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_MAINMENU, "MainMenuLayer")
    --地图层
    self.MapLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_CHINAMAP, "MapLayer")
end



return GameLayer
