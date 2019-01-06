--主菜单层剧情活动Cell

local StoryTalkCell = class("StoryTalkCell", CCLayerEx)

function StoryTalkCell:create()   --自定义的create()创建方法
    --G_Log_Info("StoryTalkCell:create()")
    local layer = StoryTalkCell.new()
    return layer
end

--初始化UI界面
function StoryTalkCell:init()  
    --G_Log_Info("StoryTalkCell:init()")
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

function StoryTalkCell:initData(storyData)  
    --G_Log_Info("StoryTalkCell:initData()")
    self.storyData = storyData
    self.Text_name:setString(storyData.name)      --战役名称
    local cityData = g_pTBLMgr:getCityConfigTBLDataById(storyData.targetCity)
    if cityData then
        self.Text_target:setString(cityData.name)   --城池
    end
end

function StoryTalkCell:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Image_bg then  
            g_GameDataMgr:SetImplementTaskData(self.storyData)  --保存正在执行的任务剧情，用于检查是否到达了任务目的地
            if self.storyData.bPlayedTalk == 1 then   ---是否已经播放过对话，0未，1已播放（则不再播放） 
                g_pGameLayer:handleStoryIntroduceEnd(self.storyData)  --剧情故事讲述完毕，准备自动寻路或显示结果
            else
                self.storyData.bPlayedTalk = 1
                g_HeroDataMgr:SetStoryTalkMask(self.storyData.storyId) 
                g_pGameLayer:showStoryTalkLayer(self.storyData)
            end
        end
    end
end

return StoryTalkCell
