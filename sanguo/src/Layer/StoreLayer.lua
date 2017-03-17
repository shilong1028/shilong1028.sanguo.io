--初次进入游戏时的剧情动画
local StoreLayer = class("StoreLayer", CCLayerEx) --填入类名

function StoreLayer:create()         --自定义的create()创建方法
    --G_Log_Info("StoreLayer:create()")
    local layer = StoreLayer.new()
    return layer
end

function StoreLayer:onExit() 
    --G_Log_Info("StoreLayer:onExit()")
    if self.showUpdateHandler then
        g_Scheduler:unscheduleScriptEntry(self.showUpdateHandler)
        self.showUpdateHandler = nil
    end
end

function StoreLayer:init()  
    --G_Log_Info("StoreLayer:init()")
    local csb = cc.CSLoader:createNode("csd/StoreLayer.csb")
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
    self.Image_bg:loadTexture("StoryBg/StoryBg_huangjin.jpg", ccui.TextureResType.localType)

    local function onVideoEventCallback(sender, eventType)
        self:onVideoEventCallback(sender, eventType)
    end

    self:createVideoPlayer("res/MP4/story_1.mp4")
  
    --self:scheduleUpdateWithPriorityLua(handler(self, self.update), 0)
    if self.showUpdateHandler then
        g_Scheduler:unscheduleScriptEntry(self.showUpdateHandler)
        self.showUpdateHandler = nil
    end
    self.showUpdateHandler = g_Scheduler:scheduleScriptFunc(handler(self, self.showStoryText), 0.02, false)
end

function StoreLayer:createVideoPlayer(vedioName)
    G_Log_Info("StoreLayer:createVideoPlayer(), vedioName = %s", vedioName)
    local function onVideoEventCallback(sender, eventType)
        self:onVideoEventCallback(sender, eventType)
    end
    if self.vedioPlayer then
        self.vedioPlayer:removeFromParent()
    end
    self.vedioPlayer = g_VideoPlayerMgr:createVideoPlayer(g_WinSize, onVideoEventCallback)
    g_VideoPlayerMgr:playByPath(self.vedioPlayer, "res/MP4/story_1.mp4")
    self.vedioPlayer:setPosition(g_WinSize.width/2, g_WinSize.height/2)
    self.Panel_MP4:addChild(self.vedioPlayer)
end

function StoreLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_skip then   --跳过
            if self.bNextBreakHandler == true then
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
    --G_Log_Info("StoreLayer:changeStoryString()")
    if self.bNextBreakHandler == true and self.showUpdateHandler then
        g_Scheduler:unscheduleScriptEntry(self.showUpdateHandler)
        self.showUpdateHandler = nil
        return
    end

    self.Button_skip:setVisible(false) 
    self.storyStrLen = 1
    self.Text_story:setString("")
    self.storyString = lua_Story_String2
    self.totalStrLen = string.len(lua_Story_String2)
    self.Image_bg:loadTexture("StoryBg/StoryBg_gongcheng.jpg", ccui.TextureResType.localType)

    if self.vedioPlayer then
        g_VideoPlayerMgr:playByPath(self.vedioPlayer, "res/MP4/fight_1.mp4")
    end

    self.bNextBreakHandler = true   --下次显示完文本后，结束定时器 
end

function StoreLayer:onVideoEventCallback(sener, eventType)
    G_Log_Info("StoreLayer:onVideoEventCallback()")
    if self.bNextBreakHandler == true and eventType == "COMPLETED" then
        --g_VideoPlayerMgr:playByPath(self.vedioPlayer, "res/MP4/login_after.mp4", true)
        self:changeScene() 
    end
end

function StoreLayer:changeScene() 
    G_Log_Info("StoreLayer:changeScene()")
    if self.vedioPlayer and g_VideoPlayerMgr:isPlaying() == true then
        g_VideoPlayerMgr:stop(self.vedioPlayer)
    end
    self.vedioPlayer:removeFromParent(true)
    self.vedioPlayer = nil

    local scene = require("Scene.GameScene")   --进入登录界面
    g_pGameScene = scene:create()  --scene:new()

    if cc.Director:getInstance():getRunningScene() then
        cc.Director:getInstance():replaceScene(cc.TransitionFade:create(1.0, g_pGameScene, cc.c3b(0,0,0)))
    else
        cc.Director:getInstance():runWithScene(g_pGameScene)
    end
end

return StoreLayer
