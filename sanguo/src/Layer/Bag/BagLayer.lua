
--背包信息
local BagLayer = class("BagLayer", CCLayerEx)

local ItemCell = require("Layer.Item.ItemCell")

function BagLayer:create()   --自定义的create()创建方法
    --G_Log_Info("BagLayer:create()")
    local layer = BagLayer.new()
    return layer
end

function BagLayer:onExit()
    --G_Log_Info("BagLayer:onExit()")
end

--初始化UI界面
function BagLayer:init()  
    --G_Log_Info("BagLayer:init()")
    local csb = cc.CSLoader:createNode("csd/BagLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    --self:showInTheMiddle(csb)

    self.Image_bg = csb:getChildByName("Image_bg")
    self.titleBg = self.Image_bg:getChildByName("titleBg")
    self.Text_title = self.Image_bg:getChildByName("Text_title")

    self.Button_close = self.Image_bg:getChildByName("Button_close")   
    self.Button_close:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_use = self.Image_bg:getChildByName("Button_use")   
    self.Button_use:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_del = self.Image_bg:getChildByName("Button_del")   
    self.Button_del:addTouchEventListener(handler(self,self.touchEvent))
end

function BagLayer:initBagGrid()  

end

function BagLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then  
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_BagLayer)
        elseif sender == self.Button_use then   
        elseif sender == self.Button_del then   
        end
    end
end


return BagLayer
