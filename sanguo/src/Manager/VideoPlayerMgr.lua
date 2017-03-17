
--VideoPlayerMgr用于跨平台播放mp4视频

local VideoPlayerMgr = class("VideoPlayerMgr")

function VideoPlayerMgr:ctor()
	--G_Log_Info("VideoPlayerMgr:ctor()")
    self:init()
end

function VideoPlayerMgr:init()
	--G_Log_Info("VideoPlayerMgr:init()")
end

function VideoPlayerMgr:GetInstance()
	--G_Log_Info("VideoPlayerMgr:GetInstance()")
    if self.instance == nil then
        self.instance = VideoPlayerMgr:new()
    end
    return self.instance
end


--///////////////////////////////////////////

function VideoPlayerMgr:createVideoPlayer(widgetSize, VideoEventCallback)
	--G_Log_Info("VideoPlayerMgr:createVideoPlayer()")
	local videoPlayer = nil
	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
		videoPlayer = WinMoviePlayer:create(widgetSize)
	else
	    videoPlayer = ccexp.VideoPlayer:create()
	    videoPlayer:setContentSize(widgetSize)
	    videoPlayer:setTouchEnabled(false)   --视频播放，屏蔽触摸事件（暂停，全屏等）
	end
	self:addEventListener(videoPlayer, VideoEventCallback)

	return videoPlayer
end

function VideoPlayerMgr:addEventListener(videoPlayer, VideoEventCallback)
	G_Log_Info("VideoPlayerMgr:addEventListener()")
    if nil  ~= videoPlayer and VideoEventCallback then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
    		local function onVideoEventCallback(sender, eventType)
    			ScriptHandlerMgr:getInstance():unregisterScriptHandler(sender,cc.Handler.EVENT_CUSTOM_COMMON)
    			if eventType == "COMPLETED" then
    				VideoEventCallback(sender, "COMPLETED")
    			end
    		end
    		G_Log_Info("VideoPlayerMgr:registerEndScriptHandler()")
    		--videoPlayer:registerEndScriptHandler(onVideoEventCallback)
    		ScriptHandlerMgr:getInstance():registerScriptHandler(videoPlayer, onVideoEventCallback, cc.Handler.EVENT_CUSTOM_COMMON)
		else
			local function onVideoEventCallback(sender, eventType)
		        if eventType == ccexp.VideoPlayerEvent.PLAYING then
		        	--VideoEventCallback(sender, "PLAYING")
		        elseif eventType == ccexp.VideoPlayerEvent.PAUSED then
		        	--VideoEventCallback(sender, "PAUSED")
		        elseif eventType == ccexp.VideoPlayerEvent.STOPPED then
		        	--VideoEventCallback(sender, "STOPPED")
		        elseif eventType == ccexp.VideoPlayerEvent.COMPLETED then
		        	VideoEventCallback(sender, "COMPLETED")
		        end
		    end
	        videoPlayer:addEventListener(onVideoEventCallback)
	    end
    end
end

function VideoPlayerMgr:pause(videoPlayer)
	--G_Log_Info("VideoPlayerMgr:pause()")
    if nil  ~= videoPlayer then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
    		videoPlayer:PauseVedio()
		else
	        videoPlayer:pause()
	    end
    end
end

function VideoPlayerMgr:resume(videoPlayer)
	--G_Log_Info("VideoPlayerMgr:resume()")
    if nil  ~= videoPlayer then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
    		videoPlayer:ResumeVedio()
		else
	        videoPlayer:resume()
	    end
    end
end

function VideoPlayerMgr:stop(videoPlayer)
	--G_Log_Info("VideoPlayerMgr:stop()")
    if nil  ~= videoPlayer then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
    		videoPlayer:StopVedio()
		else
	        videoPlayer:stop()
	    end
    end
end

function VideoPlayerMgr:playByPath(videoPlayer, videoPath, replay)
	--G_Log_Info("VideoPlayerMgr:playByPath()")
	if not replay then replay = true end 
    if nil  ~= videoPlayer then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
    		videoPlayer:playByPath(videoPath, replay) --"res/MP4/story_1.mp4"
		else  
			--local videoFullPath = cc.FileUtils:getInstance():fullPathForFilename(videoPath)  --"cocosvideo.mp4"
            videoPlayer:setFileName(videoPath)    --绝对路径，或res/路径都可以。但是不能带有res去获取绝对路径
            videoPlayer:play()
	    end
    end
end

function VideoPlayerMgr:playByURL(videoPlayer, videoURL, replay)
	--G_Log_Info("VideoPlayerMgr:playByURL()")
	if not replay then replay = true end 
    if nil  ~= videoPlayer then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
    		videoPlayer:playByURL(videoURL, replay)
		else
			videoPlayer:setURL(videoURL)  --"http://benchmark.cocos2d-x.org/cocosvideo.mp4"
	        videoPlayer:play()
	    end
    end
end

function VideoPlayerMgr:isPlaying(videoPlayer)
	G_Log_Info("VideoPlayerMgr:isPlaying()")
	if nil  ~= videoPlayer then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
    		videoPlayer:isPlaying()
		else
	        videoPlayer:isPlaying()
	    end
    end
end


return VideoPlayerMgr
