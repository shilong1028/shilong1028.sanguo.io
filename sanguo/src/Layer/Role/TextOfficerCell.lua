--武将文本信息Cell

local TextOfficerCell = class("TextOfficerCell", CCLayerEx)

function TextOfficerCell:create()   --自定义的create()创建方法
    --G_Log_Info("TextOfficerCell:create()")
    local layer = TextOfficerCell.new()
    return layer
end

--初始化UI界面
function TextOfficerCell:init()  
    --G_Log_Info("TextOfficerCell:init()")
    local csb = cc.CSLoader:createNode("csd/TextOfficerCell.csb")
    self:addChild(csb)

    self.Image_bg = csb:getChildByName("Image_bg")  
    self.Image_bg:setTouchEnabled(true)
    self.Image_bg:addTouchEventListener(handler(self,self.touchEvent))

    self.Text_name = csb:getChildByName("Text_name")      --名称
    self.Text_offical = csb:getChildByName("Text_offical")   --官职
    self.Text_chengchi = csb:getChildByName("Text_chengchi")   --城池
    self.Text_Lv = csb:getChildByName("Text_desc")   --等级 

    self:setContentSize(cc.size(220, 80))
end

function TextOfficerCell:initData(storyData)  
    --G_Log_Info("TextOfficerCell:initData()")

end

function TextOfficerCell:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Image_bg then   

        end
    end
end

return TextOfficerCell
