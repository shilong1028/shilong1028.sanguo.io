--小头像信息Cell

local SmallOfficerCell = class("SmallOfficerCell", CCLayerEx)

function SmallOfficerCell:create()   --自定义的create()创建方法
    --G_Log_Info("SmallOfficerCell:create()")
    local layer = SmallOfficerCell.new()
    return layer
end

--初始化UI界面
function SmallOfficerCell:init()  
    --G_Log_Info("SmallOfficerCell:init()")
    local csb = cc.CSLoader:createNode("csd/SmallOfficerCell.csb")
    self:addChild(csb)
    self:setContentSize(cc.size(90, 90))

    self.Image_bg = csb:getChildByName("Image_bg")  
    self.Image_bg:setTouchEnabled(true)
    self.Image_bg:addTouchEventListener(handler(self,self.touchEvent))

    self.Image_color = csb:getChildByName("Image_color")   --品质，游击/轻装/重装/精锐/禁卫
    self.Image_type = csb:getChildByName("Image_type")    --兵种

    self.Text_name = csb:getChildByName("Text_name")      --名称
    self.Text_Lv = csb:getChildByName("Text_Lv")   -- 
end

function SmallOfficerCell:initData(storyData)  
    --G_Log_Info("SmallOfficerCell:initData()")

end

function SmallOfficerCell:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Image_bg then   

        end
    end
end

return SmallOfficerCell
