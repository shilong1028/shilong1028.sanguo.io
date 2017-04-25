
--帮助提示框
local HelpInfoLayer = class("HelpInfoLayer", CCLayerEx)

function HelpInfoLayer:create()   --自定义的create()创建方法
    --G_Log_Info("HelpInfoLayer:create()")
    local layer = HelpInfoLayer.new()
    return layer
end

function HelpInfoLayer:onExit()
    --G_Log_Info("HelpInfoLayer:onExit()")
end

--初始化UI界面
function HelpInfoLayer:init()  
    --G_Log_Info("HelpInfoLayer:init()")
    local csb = cc.CSLoader:createNode("csd/HelpInfoLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    --self:showInTheMiddle(csb)

    self.Image_bg = csb:getChildByName("Image_bg")
    self.titleBg = self.Image_bg:getChildByName("titleBg")
    self.Text_title = self.Image_bg:getChildByName("Text_title")

    self.Button_close = self.Image_bg:getChildByName("Button_close")   
    self.Button_close:addTouchEventListener(handler(self,self.touchEvent))

    self.ListView = self.Image_bg:getChildByName("ListView")
end

function HelpInfoLayer:bindingData(titleStr, infoStr)  
    self.Text_title:setString(titleStr)
    local bgWidth = 150
    if self.Text_title:getContentSize().width > 130 then
        bgWidth = self.Text_title:getContentSize().width + 20
    end
    self.titleBg:setContentSize(cc.size(bgWidth, self.Text_title:getContentSize().height + 10))

    self.Text_content = cc.Label:createWithTTF(infoStr, g_sDefaultTTFpath, g_defaultFontSize)
    self.Text_content:setAlignment(cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
    self.Text_content:setDimensions(self.ListView:getContentSize().width - 10, 0)
    self.Text_content:setColor(g_ColorDef.Yellow)
    --self.Text_content:enableBold()   --加粗
    --self.Text_content:enableShadow()   --阴影
    self.Text_content:enableOutline(g_ColorDef.DarkRed, 1)   --描边

    self.Text_content:setAnchorPoint(cc.p(0.5, 1))
    self.Text_content:setPosition(cc.p(self.ListView:getContentSize().width/2, self.ListView:getContentSize().height - 5))
    self.ListView:addChild(self.Text_content)
end

function HelpInfoLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then  
            --不能使用g_pGameLayer:RemoveChildByUId()，因为okcancel对话框公用Tag  
            self:removeFromParent(true)
        end
    end
end


return HelpInfoLayer
