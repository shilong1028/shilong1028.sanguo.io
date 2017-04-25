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
    local csb = cc.CSLoader:createNode("csd/storyTalkCell.csb")
    self:addChild(csb)

    self.Image_bg = csb:getChildByName("Image_bg")  
    self.Image_bg:setTouchEnabled(true)
    self.Image_bg:addTouchEventListener(handler(self,self.touchEvent))

    self.Text_name = csb:getChildByName("Text_name")      --战役名称
    self.Label_target = csb:getChildByName("Label_target")   --攻目标
    self.Text_target = csb:getChildByName("Text_target")   --城池
    self.Text_desc = csb:getChildByName("Text_desc")   --主线支线  

    self:setContentSize(cc.size(220, 80))
end

function TextOfficerCell:initData(storyData)  
    --G_Log_Info("TextOfficerCell:initData()")
    self.storyData = storyData
    self.Text_name:setString(storyData.name)      --战役名称
    local cityData = g_pTBLMgr:getCityConfigTBLDataById(storyData.targetCity)
    if cityData then
        self.Text_target:setString(cityData.name)   --城池
    end
end

function TextOfficerCell:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Image_bg then   
            g_pGameLayer:showStoryTalkLayer(self.storyData)
        end
    end
end

return TextOfficerCell
