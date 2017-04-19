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
    self.Panel_bottom = csb:getChildByName("Panel_bottom")    --底部文字遮罩

    self.Image_left = csb:getChildByName("Image_left") 
    self.Text_left = csb:getChildByName("Text_left")   
    self.Text_left:setString("")

    self.Image_right = csb:getChildByName("Image_right") 
    self.Text_right = csb:getChildByName("Text_right")   
    self.Text_right:setString("")

    self.Button_skip = csb:getChildByName("Button_skip")   --跳过按钮
    self.Button_skip:addTouchEventListener(handler(self,self.touchEvent))  
    self.Button_skip:setVisible(false) 
end

function StoryTalkLayer:initStoryData(storyData)
    --G_Log_Dump(storyData, "storyData = ")
    self.storyData = storyData
    self.talkVec = self.storyData.talkVec
    self.talkIdx = 0
    self:changeStoryString()
end

function StoryTalkLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_skip then   --跳过
            self:changeStoryString()
        end
    end
end

function StoryTalkLayer:showStoryText()
    self.storyStrLen = self.storyStrLen + 1
    if self.storyStrLen > 20 then
        self.Button_skip:setVisible(true)
    end
    if self.storyStrLen  <= self.totalStrLen then
        --logger_warning(str)
        local str = string.sub(self.storyString, 1, self.storyStrLen)
        self.Text_story:setString(str)  
    else
        if self.showUpdateHandler then
            g_Scheduler:unscheduleScriptEntry(self.showUpdateHandler)
        end
        self.showUpdateHandler = nil

        local function delayCallBack(dt)
            self:changeStoryString()    --切换
        end
        self.delayUpdateHandler = g_Scheduler:scheduleScriptFunc(delayCallBack, 1.0, false)
    end
end

--切换下一段剧情文本
function StoryTalkLayer:changeStoryString()
    --G_Log_Info("StoryTalkLayer:changeStoryString()")
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

        local mapLayer = g_pGameLayer:GetLayerByUId(g_GameLayerTag.LAYER_TAG_CHINAMAP)
        if mapLayer then
            mapLayer:autoPathMapByCity(self.storyData.targetCity)
        end

        g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_StoryTalkLayer)
        return
    end

    self.Button_skip:setVisible(false) 
    self.storyStrLen = 0
    self.storyString = self.talkVec[self.talkIdx].text
    self.totalStrLen = string.len(self.storyString)

    self.Text_left:setString("")
    self.Text_right:setString("")
    if self.talkIdx %2 == 0 then
        self.Image_left:setVisible(false)
        self.Image_right:setVisible(true)
        self.Text_story = self.Text_right
        self.Image_right:loadTexture(string.format("Head/%d.png", self.talkVec[self.talkIdx].heroId), ccui.TextureResType.localType)
    else
        self.Image_left:setVisible(true)
        self.Image_right:setVisible(false)
        self.Text_story = self.Text_left
        self.Image_left:loadTexture(string.format("Head/%d.png", self.talkVec[self.talkIdx].heroId), ccui.TextureResType.localType)
    end

    if self.showUpdateHandler then
        g_Scheduler:unscheduleScriptEntry(self.showUpdateHandler)
    end
    self.showUpdateHandler = nil
    self.showUpdateHandler = g_Scheduler:scheduleScriptFunc(handler(self, self.showStoryText), 0.02, false)
end

return StoryTalkLayer
