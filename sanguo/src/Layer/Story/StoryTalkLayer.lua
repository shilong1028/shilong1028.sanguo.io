--剧情动画
local StoryTalkLayer = class("StoryTalkLayer", CCLayerEx) --填入类名

function StoryTalkLayer:create()         --自定义的create()创建方法
    --G_Log_Info("StoryTalkLayer:create()")
    local layer = StoryTalkLayer.new()
    return layer
end

function StoryTalkLayer:onExit() 
    --G_Log_Info("StoryTalkLayer:onExit()")
    if self.showUpdateHandler then
        g_Scheduler:unscheduleScriptEntry(self.showUpdateHandler)
        self.showUpdateHandler = nil
    end
    if self.delayUpdateHandler then
        g_Scheduler:unscheduleScriptEntry(self.delayUpdateHandler)
        self.delayUpdateHandler = nil
    end       
end

function StoryTalkLayer:init()  
    --G_Log_Info("StoryTalkLayer:init()")
    local csb = cc.CSLoader:createNode("csd/StoryTalkLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)

    self.Panel_Bg = csb:getChildByName("Panel_Bg")
    self.Image_bg = csb:getChildByName("Image_bg")     --故事背景图片
    self.Image_bg:setVisible(false)
    self.Image_bottom = csb:getChildByName("Image_bottom")    --底部文字遮罩

    self.Image_left1 = csb:getChildByName("Image_left1") 
    self.Image_left2 = csb:getChildByName("Image_left2") 
    self.Image_left2:setVisible(false) 
    self.Text_left = csb:getChildByName("Text_left")   
    self.Text_left:setString("")

    self.Button_skip = csb:getChildByName("Button_skip")   --跳过按钮
    self.Button_skip:addTouchEventListener(handler(self,self.touchEvent))  
    self.Button_skip:setVisible(false) 
end

function StoryTalkLayer:initStoryData(storyData)
    --G_Log_Dump(storyData, "storyData = ")
    self.bStoryEnd = false   --是否讲述完毕
    self.storyData = storyData
    self.talkVec = self.storyData.talkVec
    self.talkIdx = 0
    self.Button_skip:setTitleText("跳 过") 
    self:changeStoryString()
end

function StoryTalkLayer:showStoryText()
    self.storyStrLen = self.storyStrLen + 1
    if self.storyStrLen > 20 then
        self.Button_skip:setVisible(true)
    end
    if self.storyStrLen  <= self.totalStrLen then
        --logger_warning(str)
        local str = string.sub(self.storyString, 1, self.storyStrLen)
        self.Text_left:setString(str)  
    else
        if self.showUpdateHandler then
            g_Scheduler:unscheduleScriptEntry(self.showUpdateHandler)
        end
        self.showUpdateHandler = nil

        if self.talkIdx == #self.talkVec then
            self.Button_skip:setTitleText("结 束") 
            self.bStoryEnd = true   --是否讲述完毕
        else
            self.Button_skip:setTitleText("跳 过")
        end

        local function delayCallBack(dt)
            --self:changeStoryString()    --切换
        end
        self.delayUpdateHandler = g_Scheduler:scheduleScriptFunc(delayCallBack, 1.0, false)
    end
end

--切换下一段剧情文本
function StoryTalkLayer:changeStoryString()
    G_Log_Info("StoryTalkLayer:changeStoryString()")
    if self.delayUpdateHandler then
        g_Scheduler:unscheduleScriptEntry(self.delayUpdateHandler)
        self.delayUpdateHandler = nil
    end  

    self.talkIdx = self.talkIdx + 1
    if self.talkIdx > #self.talkVec then
        if self.showUpdateHandler then
            g_Scheduler:unscheduleScriptEntry(self.showUpdateHandler)
            self.showUpdateHandler = nil
        end
        --self.Image_bg:setVisible(false)

        -- self.storyData.storyPlayedState = g_StoryState.TextFinish   --任务故事进程状态（1文字播放完成状态）
        -- g_pGameLayer:FinishStoryIntroduceByStep(self.storyData, g_StoryState.TextFinish)  --完成当前剧情的指定步骤，并继续下一步
        --g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_StoryTalkLayer)
        return
    end

    self.Button_skip:setVisible(false) 
    self.storyStrLen = 0
    local talkData = self.talkVec[self.talkIdx]
    self.storyString = talkData.desc
    self.totalStrLen = string.len(self.storyString)

    self.Image_bg:setVisible(false)
    if talkData.bg and talkData.bg ~= "" then
        self.Image_bg:loadTexture(string.format("StoryBg/%s.jpg", talkData.bg), ccui.TextureResType.localType)
        self.Image_bg:setVisible(true)
    end

    self.Text_left:setString("")
    self.Image_left1:setVisible(true)
    self.Image_left2:setVisible(false)
    self.Image_left1:loadTexture(string.format("Head/%d.png", talkData.headVec[1]), ccui.TextureResType.localType)
    if talkData.headVec[2] ~= nil then
        self.Image_left2:setVisible(true)
        self.Image_left2:loadTexture(string.format("Head/%d.png", talkData.headVec[2]), ccui.TextureResType.localType)
    end

    if self.showUpdateHandler then
        g_Scheduler:unscheduleScriptEntry(self.showUpdateHandler)
    end
    self.showUpdateHandler = nil
    self.showUpdateHandler = g_Scheduler:scheduleScriptFunc(handler(self, self.showStoryText), 0.02, false)
end

function StoryTalkLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_skip then   --跳过
            if self.talkIdx > #self.talkVec or self.bStoryEnd == true then  --是否讲述完毕
                self.storyData.storyPlayedState = g_StoryState.TextFinish   --任务故事进程状态（1文字播放完成状态）
                g_pGameLayer:FinishStoryIntroduceByStep(self.storyData, g_StoryState.TextFinish)  --完成当前剧情的指定步骤，并继续下一步
                g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_StoryTalkLayer)   --剧情故事
            else
                self:changeStoryString()
            end
        end
    end
end

return StoryTalkLayer
