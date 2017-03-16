--初次进入游戏时的剧情动画
local StoreLayer = class("StoreLayer", CCLayerEx) --填入类名

function StoreLayer:create()         --自定义的create()创建方法
    --G_Log_Info("StoreLayer:create()")
    local layer = StoreLayer.new()
    return layer
end

function StoreLayer:onExit() 
    --G_Log_Info("StoreLayer:onExit()")
    self.scheduler:unscheduleScriptEntry(self.showUpdateHandler)
end

function StoreLayer:init()  
    G_Log_Info("StoreLayer:init()")
    local csb = cc.CSLoader:createNode("StoreLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)

    self.Image_bg = csb:getChildByName("Image_bg")   --背景图
    self.Panel_MP4 = csb:getChildByName("Panel_MP4")    --MP4父节点（容器）
    self.Text_story = csb:getChildByName("Text_story")   --剧情文本
    self.Text_story:setString("")
    self.Button_skip = csb:getChildByName("Button_skip")   --跳过按钮

    self.Button_skip:addTouchEventListener(handler(self,self.touchEvent))  
    self.Button_skip:setVisible(false)

    self.storyStrLen = 1
    self.storyString = lua_Story_String1
    self.totalStrLen = string.len(lua_Story_String1)
  
    local function onVideoEventCallback(sener, eventType)
        if eventType == ccexp.VideoPlayerEvent.PLAYING then

        elseif eventType == ccexp.VideoPlayerEvent.PAUSED then

        elseif eventType == ccexp.VideoPlayerEvent.STOPPED then

        elseif eventType == ccexp.VideoPlayerEvent.COMPLETED then
            self:changeScene()
        end
    end

    --self:scheduleUpdateWithPriorityLua(handler(self, self.update), 0)
    self.showUpdateHandler = self.scheduler:scheduleScriptFunc(handler(self, self.showStoryText), 0.01, false)
end

function StoreLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_skip then   --跳过
            if self.bNextBreakHandler == true then
                if self.videoPlayer then     --视频播放
                    self.videoPlayer:stop()
                end
                self:changeScene()  
            else
                self:changeStoryString()  --切换下一段剧情文本
            end
        end
    end
end

function StoreLayer:showStoryText()
    if self.storyStrLen > 50 then
        self.Button_skip:setVisible(true)
    end
    if self.storyStrLen  <= self.totalStrLen then
        --logger_warning(str)
        local str = string.sub(self.storyString, 1, self.storyStrLen)
        self.Text_story:setString(str)
    else
        self:changeStoryString()    --切换背景图
    end
    self.storyStrLen = self.storyStrLen + 1
end

--切换下一段剧情文本
function StoreLayer:changeStoryString()
    if self.bNextBreakHandler == true then
        self.scheduler:unscheduleScriptEntry(self.showUpdateHandler)
        return
    end

    self.Button_skip:setVisible(false) 
    self.storyStrLen = 1
    self.Text_story:setString("")
    self.storyString = GameStoryString2
    self.totalStrLen = string.len(GameStoryString2)
    --self.Image_bg:loadTexture("Image/storyChangeBg.png")

    self.bNextBreakHandler = true   --下次显示完文本后，结束定时器 
end

function StoreLayer:changeScene()
    local scene = require("Scene.GameScene")   --进入登录界面
    g_pGameScene = scene:create()  --scene:new()

    if cc.Director:getInstance():getRunningScene() then
        cc.Director:getInstance():replaceScene(cc.TransitionFade:create(1.0, g_pGameScene, cc.c3b(0,0,0)))
    else
        cc.Director:getInstance():runWithScene(g_pGameScene)
    end
end

return StoreLayer
