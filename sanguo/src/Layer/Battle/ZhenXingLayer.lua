
--阵型|布阵界面
local ZhenXingLayer = class("ZhenXingLayer", CCLayerEx)

local bigOfficalNode = require("Layer.Role.bigOfficalNode")
local ZhenXingNode = require("Layer.Battle.ZhenXingNode")

function ZhenXingLayer:create()   --自定义的create()创建方法
    --G_Log_Info("ZhenXingLayer:create()")
    local layer = ZhenXingLayer.new()
    return layer
end

function ZhenXingLayer:onExit()
    --G_Log_Info("ZhenXingLayer:onExit()")
end

--初始化UI界面
function ZhenXingLayer:init()  
    --G_Log_Info("ZhenXingLayer:init()")
    local csb = cc.CSLoader:createNode("csd/ZhenXingLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    --self:showInTheMiddle(csb)

    self.Image_bg = csb:getChildByName("Image_bg")
    self.titleBg = self.Image_bg:getChildByName("titleBg")
    self.Text_title = self.Image_bg:getChildByName("Text_title")
    self.Button_close = self.Image_bg:getChildByName("Button_close")   
    self.Button_close:addTouchEventListener(handler(self,self.touchEvent))

    --布阵，阵型
    self.Button_buzhenRadio = self.Image_bg:getChildByName("Button_buzhenRadio")
    self.Button_buzhenRadio:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_buzhenRadio_Text = self.Button_buzhenRadio:getChildByName("Text_btn")

    self.Button_zhenxingRadio = self.Image_bg:getChildByName("Button_zhenxingRadio")
    self.Button_zhenxingRadio:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_zhenxingRadio_Text = self.Button_zhenxingRadio:getChildByName("Text_btn")

    --布阵节点
    self.Panel_buzhen = self.Image_bg:getChildByName("Panel_buzhen")
    self.ListView_list = self.Panel_buzhen:getChildByName("ListView_list")   --武将列表
    self.Button_load = self.Panel_buzhen:getChildByName("Button_load")      --载入阵型
    self.Button_load:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_save = self.Panel_buzhen:getChildByName("Button_save")       --保存阵型
    self.Button_save:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_fight = self.Panel_buzhen:getChildByName("Button_fight")      --出战
    self.Button_fight:addTouchEventListener(handler(self,self.touchEvent))

    self.Image_buzhen = self.Panel_buzhen:getChildByName("Image_buzhen")  
    self.buZhenNode = ZhenXingNode:create()    --阵型节点
    self.buZhenNode:setSelAndEditVisible(false)
    self.buZhenNode:setParentLayer(self)
    self.Image_buzhen:addChild(self.buZhenNode)

    self.Image_officalInfo = self.Panel_buzhen:getChildByName("Image_officalInfo") 
    self.bigOfficalNode = bigOfficalNode:create()    --武将信息节点
    self.Image_officalInfo:addChild(self.bigOfficalNode)

    --阵型节点
    self.Panel_zhenxing = self.Image_bg:getChildByName("Panel_zhenxing")

    self.buzhenNode_att = self.Panel_zhenxing:getChildByName("buzhenNode_att")  
    self.attZhenNode = ZhenXingNode:create()    --攻击阵型节点
    self.attZhenNode:setOptImgVisible(false)
    self.attZhenNode:setParentLayer(self)
    self.buzhenNode_att:addChild(self.attZhenNode)

    self.buzhenNode_def = self.Panel_zhenxing:getChildByName("buzhenNode_def")  
    self.defZhenNode = ZhenXingNode:create()    --防御阵型节点
    self.defZhenNode:setOptImgVisible(false)
    self.defZhenNode:setParentLayer(self)
    self.buzhenNode_def:addChild(self.defZhenNode)

    self:setRadioPanel(1)
end

function ZhenXingLayer:setRadioPanel(idx)
    if idx < 0 or idx > 2 then
        return
    end
    if self.selRadioIdx and self.selRadioIdx == idx then
        return
    end
    self.selRadioIdx = idx
    if idx == 1 then
        self.Button_buzhenRadio:loadTextureNormal("public_radio2.png", ccui.TextureResType.plistType)
        self.Button_zhenxingRadio:loadTextureNormal("public_radio1.png", ccui.TextureResType.plistType)
        self.Button_buzhenRadio_Text:enableOutline(g_ColorDef.DarkRed, 1)
        self.Button_zhenxingRadio_Text:disableEffect()
        self.Panel_buzhen:setVisible(true)
        self.Panel_zhenxing:setVisible(false)
    elseif idx == 2 then
        self.Button_buzhenRadio:loadTextureNormal("public_radio1.png", ccui.TextureResType.plistType)
        self.Button_zhenxingRadio:loadTextureNormal("public_radio2.png", ccui.TextureResType.plistType)
        self.Button_zhenxingRadio_Text:enableOutline(g_ColorDef.DarkRed, 1)
        self.Button_buzhenRadio_Text:disableEffect()
        self.Panel_zhenxing:setVisible(true)
        self.Panel_buzhen:setVisible(false)
    end
end

function ZhenXingLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then  
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_ZhenXingLayer)
        elseif sender == self.Button_load then     --载入阵型
            self:setRadioPanel(2)
        elseif sender == self.Button_save then     --保存阵型

        elseif sender == self.Button_fight then    --出战
            -- local result = {}
            -- result.storyId = self.storyId
            -- result.winStar = 2
            -- g_pGameLayer:showBattleResultLayer(result)

            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_ZhenXingLayer)
        elseif sender == self.Button_buzhenRadio then   --布阵
            self:setRadioPanel(1)
        elseif sender == self.Button_zhenxingRadio then   --阵型
            self:setRadioPanel(2)
        end
    end
end


return ZhenXingLayer
