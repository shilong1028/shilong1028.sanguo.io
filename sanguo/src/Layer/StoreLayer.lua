--初次进入游戏时的剧情动画
local StoreLayer = class("StoreLayer", function()
    return display.newLayer()
end)

function StoreLayer:create()         --自定义的create()创建方法
    print("StoreLayer:create()")
    local layer = StoreLayer.new()
    return layer
end

function StoreLayer:ctor()    --new()会自动调用ctor()
    print("StoreLayer:ctor()")
    local function onNodeEvent(event)
        if event == "enter" then
            self:onEnter()
        --elseif event == "enterTransitionFinish" then
            --self:enterTransitionFinish()
        elseif event == "exit" then
            self:onExit()
        --elseif event == "cleanup" then
            --self:onCleanup()   
        end
    end
    
    self:registerScriptHandler(onNodeEvent)

    self.scheduler = cc.Director:getInstance():getScheduler()

    self:initData()   --初始化数据成员
    self:init()      --x初始化UI界面
end

function StoreLayer:onEnter()
    print("StoreLayer:onEnter()")
    --self:scheduleUpdateWithPriorityLua(handler(self, self.update), 0)
    self.showUpdateHandler = self.scheduler:scheduleScriptFunc(handler(self, self.showStoryText), 0.01, false)
    -- if self.videoPlayer then     --视频播放
    --     self.videoPlayer:play()
    -- end
end

function StoreLayer:onExit() 
    --self:unscheduleUpdate()
    self.scheduler:unscheduleScriptEntry(self.showUpdateHandler)
end

function StoreLayer:init()  
    print("StoreLayer:init()")
    local frameSize = cc.Director:getInstance():getVisibleSize() --display.framesize

    local csb = cc.CSLoader:createNode("GameStoreLayer.csb")
    csb:setContentSize(frameSize)
    ccui.Helper:doLayout(csb)
    self:addChild(csb)

    self.Image_bg = csb:getChildByName("Image_bg")   --背景图
    self.Panel_MP4 = csb:getChildByName("Panel_MP4")    --MP4父节点（容器）
    self.Text_story = csb:getChildByName("Text_story")   --剧情文本
    self.Text_story:setString("")
    self.Button_skip = csb:getChildByName("Button_skip")   --跳过按钮
    self.Button_skip:addTouchEventListener(handler(self,self.touchEvent))  
    self.Button_skip:setVisible(false)

    local widgetSize = self.Panel_MP4:getContentSize()

    if g_bSupportVideoPlayer then      
        local function onVideoEventCallback(sener, eventType)
            if eventType == ccexp.VideoPlayerEvent.PLAYING then

            elseif eventType == ccexp.VideoPlayerEvent.PAUSED then

            elseif eventType == ccexp.VideoPlayerEvent.STOPPED then

            elseif eventType == ccexp.VideoPlayerEvent.COMPLETED then
                self:changeScene()
            end
        end

        local videoPlayer = ccexp.VideoPlayer:create()
        videoPlayer:setPosition(widgetSize.width/2, widgetSize.height/2)
        videoPlayer:setAnchorPoint(cc.p(0.5, 0.5))
        videoPlayer:setContentSize(cc.size(widgetSize.width, widgetSize.height))
        videoPlayer:addEventListener(onVideoEventCallback)
        self.Panel_MP4:addChild(videoPlayer)
        self.videoPlayer = videoPlayer

        self.videoPlayer:setTouchEnabled(false)   --视频播放，屏蔽触摸事件（暂停，全屏等）

        local videoFullPath = cc.FileUtils:getInstance():fullPathForFilename("mp4/story_1.mp4")
        self.videoPlayer:setFileName(videoFullPath)  
        self.videoPlayer:play() 
    end
end

function StoreLayer:initData()  
    self.storyStrLen = 1
    self.storyString = GameStoryString1
    self.totalStrLen = string.len(GameStoryString1)
end

function StoreLayer:refreshData(data)  
    self.data = data
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

local GameStoryStrLen1 = string.len(GameStoryString1)

function StoreLayer:showStoryText()
    if self.storyStrLen > 50 then
        self.Button_skip:setVisible(true)
    end
    if self.storyStrLen  <= self.totalStrLen then
        --logger_warning(str)
        local str = string.sub(self.storyString, 1, self.storyStrLen)
        self.Text_story:setString(str)
    else
        --切换背景图
        self:changeStoryString()    
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
    if g_bSupportVideoPlayer ~= true then
        --self.Image_bg:loadTexture("Image/storyChangeBg.png")
    end

    self.bNextBreakHandler = true   --下次显示完文本后，结束定时器 
end

function StoreLayer:changeScene()
    local scene = require("Scene/GameScene")   --进入登录界面
    cc.exports.g_pGameScene = scene:new()

    if cc.Director:getInstance():getRunningScene() then
        cc.Director:getInstance():replaceScene(cc.TransitionFade:create(1.0, g_pGameScene, cc.c3b(0,0,0)))
    else
        cc.Director:getInstance():runWithScene(g_pGameScene)
    end
end

return StoreLayer
