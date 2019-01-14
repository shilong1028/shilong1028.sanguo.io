--初次进入游戏时的剧情动画
local StoryLayer = class("StoryLayer", CCLayerEx) --填入类名

function StoryLayer:create()         --自定义的create()创建方法
    --G_Log_Info("StoryLayer:create()")
    local layer = StoryLayer.new()
    return layer
end

function StoryLayer:onExit() 
    --G_Log_Info("StoryLayer:onExit()")
    if self.showUpdateHandler then
        g_Scheduler:unscheduleScriptEntry(self.showUpdateHandler)
        self.showUpdateHandler = nil
    end
end

function StoryLayer:init()  
    --G_Log_Info("StoryLayer:init()")
    local csb = cc.CSLoader:createNode("csd/StoryLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)

    self.Image_bg = csb:getChildByName("Image_bg")   --背景图
    self.Image_bg:setVisible(false)
    --self.Image_bg:loadTexture("StoryBg/StoryBg_1.jpg", ccui.TextureResType.localType)

    self.Panel_MP4 = csb:getChildByName("Panel_MP4")    --MP4父节点（容器）
    self.Text_story = csb:getChildByName("Text_story")   --剧情文本
    self.Text_story:setString("")

    self.Button_skip = csb:getChildByName("Button_skip")   --跳过按钮
    self.Button_skip:addTouchEventListener(handler(self,self.touchEvent))  
    self.Button_skip:setVisible(false)

    self.bNextBreakHandler = true    --false则有多段动画，ture只有一段
    self.bLoadingStory = false   --是否为初次进入游戏的故事背景介绍动画视频
end

--加载初次进入游戏的故事背景介绍动画视频
function StoryLayer:InitLoadingStroy()
    self.bLoadingStory = true
    self:createVideoPlayer("res/MP4/loading_story.mp4")   
end

--播放指定MP4文件的视频
function StoryLayer:PlayVedioFile(vedio)
    self.bLoadingStory = false
    self:createVideoPlayer(string.format("res/MP4/%s", vedio)) 
end

function StoryLayer:createVideoPlayer(vedioName)
    --G_Log_Info("StoryLayer:createVideoPlayer(), vedioName = %s", vedioName)
    self.vedioName = vedioName;
    local function onVideoEventCallback(sender, eventType)
        self:onVideoEventCallback(sender, eventType)
    end
    if self.vedioPlayer then
        self.vedioPlayer:removeFromParent()
    end
    self.vedioPlayer = g_VideoPlayerMgr:createVideoPlayer(g_WinSize, onVideoEventCallback)
    g_VideoPlayerMgr:playByPath(self.vedioPlayer, vedioName)
    self.vedioPlayer:setPosition(g_WinSize.width/2, g_WinSize.height/2)
    self.Panel_MP4:addChild(self.vedioPlayer)

    --self:scheduleUpdateWithPriorityLua(handler(self, self.update), 0)
    if self.showUpdateHandler then
        g_Scheduler:unscheduleScriptEntry(self.showUpdateHandler)
        self.showUpdateHandler = nil
    end
    self.Button_skip:setVisible(false) 
    --self.showUpdateHandler = g_Scheduler:scheduleScriptFunc(handler(self, self.showStoryText), 0.02, false)
    self.showUpdateHandler = g_Scheduler:scheduleScriptFunc(handler(self, self.showSkipBtn), 1.0, false)
end

function StoryLayer:showSkipBtn()
    self.Button_skip:setVisible(true)
    if self.showUpdateHandler then
        g_Scheduler:unscheduleScriptEntry(self.showUpdateHandler)
        self.showUpdateHandler = nil
    end
end

function StoryLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_skip then   --跳过
            self:handleEndEvent()
        end
    end
end

function StoryLayer:onVideoEventCallback(sener, eventType)
    --G_Log_Info("StoryLayer:onVideoEventCallback()")
    if eventType == "COMPLETED" or eventType == "PAUSED" then
        self:handleEndEvent()
    end
end

--处理视频结束或点击跳过
function StoryLayer:handleEndEvent()
    --G_Log_Info("StoryLayer:handleEndEvent()")
    if self.bNextBreakHandler == true then
        if self.bLoadingStory == true then   --初次进入游戏的故事背景介绍动画视频，结束后进入游戏场景
            self:changeScene() 
        else
            if self.vedioPlayer and g_VideoPlayerMgr:isPlaying() == true then
                g_VideoPlayerMgr:stop(self.vedioPlayer)
            end
            self.vedioPlayer:removeFromParent(true)
            self.vedioPlayer = nil

            if self.vedioName and string.len(self.vedioName) > 0 then
                local curStoryData = g_GameDataMgr:GetImplementTaskData()
                if curStoryData.vedio ~= "" and self.vedioName == string.format("res/MP4/%s", curStoryData.vedio) then   --新主线任务，且有视频剧情
                    g_pGameLayer:StoryFinishCallBack(curStoryData.storyId)  --下一个剧情
                end
            end

            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_VedioLayer)
        end
    else
        self:nextMp4Vedio()
    end
end

function StoryLayer:changeScene() 
    --G_Log_Info("StoryLayer:changeScene()")
    if self.vedioPlayer and g_VideoPlayerMgr:isPlaying() == true then
        g_VideoPlayerMgr:stop(self.vedioPlayer)
    end
    self.vedioPlayer:removeFromParent(true)
    self.vedioPlayer = nil

    local scene = require("Scene.GameScene")   --进入登录界面
    g_pGameScene = scene:create()  --scene:new()

    if cc.Director:getInstance():getRunningScene() then
        cc.Director:getInstance():replaceScene(g_pGameScene)  --cc.TransitionFade:create(1.0, g_pGameScene, cc.c3b(0,0,0)))
    else
        cc.Director:getInstance():runWithScene(g_pGameScene)
    end
end

function StoryLayer:nextMp4Vedio()
    --self.bNextBreakHandler = true   
    --self:createVideoPlayer("res/MP4/fight_1.mp4")
end

return StoryLayer
