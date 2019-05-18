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

function StoryTalkCell:initStoryTalkCellData(storyData)  
    --G_Log_Info("StoryTalkCell:initStoryTalkCellData()")
    self.storyData = storyData
    self.Label_target:setVisible(false)
    self.Text_target:setString("")
    self.Text_name:setString(storyData.name)      --任务名称
    self.Text_desc:setString(g_StoryStr[storyData.type])    --任务类型

    local cityData = g_pTBLMgr:getCityConfigTBLDataById(storyData.targetCity)
    if cityData then
        self.Label_target:setVisible(true)
        self.Text_target:setString(cityData.name)   --城池
    end
end

function StoryTalkCell:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Image_bg then  
            g_GameDataMgr:SetImplementTaskData(self.storyData)  --保存正在执行的任务剧情，用于检查是否到达了任务目的地
            if self.storyData.vedio ~= "" then   --新主线任务，且有视频剧情
                g_pGameLayer:showVedioLayer(self.storyData.vedio) 
            else
                -- self.storyData.storyPlayedState = g_StoryState.Init   --任务故事进程状态（0初始状态）
                -- g_pGameLayer:FinishStoryIntroduceByStep(self.storyData, g_StoryState.Init)  --完成当前剧情的指定步骤，并继续下一步
                g_pGameLayer:handleStoryNextIntroduce(self.storyData)  --处理剧情故事下一步操作
            end
        end
    end
end

return StoryTalkCell
