
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
	G_Log_Info("VideoPlayerMgr:createVideoPlayer()")
	local videoPlayer = nil
	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
		videoPlayer = WinMoviePlayer:create(widgetSize)
	else
	    videoPlayer = ccexp.VideoPlayer:create()
	    videoPlayer:setContentSize(widgetSize)
	end
	if videoPlayer then
    	--self:addEventListener(videoPlayer, VideoEventCallback)
	end
	return videoPlayer
end

function VideoPlayerMgr:addEventListener(videoPlayer, VideoEventCallback)
	G_Log_Info("VideoPlayerMgr:addEventListener()")
    if nil  ~= videoPlayer and onVideoEventCallback then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
    		videoPlayer:registerScriptHandler(onVideoEventCallback)
		else
			local function onVideoEventCallback(sener, eventType)
		        if eventType == ccexp.VideoPlayerEvent.PLAYING then
		        	VideoEventCallback(sener, "PLAYING")
		        elseif eventType == ccexp.VideoPlayerEvent.PAUSED then
		        	VideoEventCallback(sener, "PAUSED")
		        elseif eventType == ccexp.VideoPlayerEvent.STOPPED then
		        	VideoEventCallback(sener, "STOPPED")
		        elseif eventType == ccexp.VideoPlayerEvent.COMPLETED then
		        	VideoEventCallback(sener, "COMPLETED")
		        end
		    end
	        videoPlayer:addEventListener(onVideoEventCallback)
	    end
    end
end

function VideoPlayerMgr:pause(videoPlayer)
	G_Log_Info("VideoPlayerMgr:pause()")
    if nil  ~= videoPlayer then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
    		videoPlayer:pause()
		else
	        videoPlayer:pause()
	    end
    end
end

function VideoPlayerMgr:resume(videoPlayer)
	G_Log_Info("VideoPlayerMgr:resume()")
    if nil  ~= videoPlayer then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
    		videoPlayer:resume()
		else
	        videoPlayer:resume()
	    end
    end
end

function VideoPlayerMgr:stop(videoPlayer)
	G_Log_Info("VideoPlayerMgr:stop()")
    if nil  ~= videoPlayer then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
    		videoPlayer:stop()
		else
	        videoPlayer:stop()
	    end
    end
end

function VideoPlayerMgr:playByPath(videoPlayer, videoPath)
	G_Log_Info("VideoPlayerMgr:playByPath()")
    if nil  ~= videoPlayer then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
    		videoPlayer:playByPath(videoPath)
		else  
			local videoFullPath = cc.FileUtils:getInstance():fullPathForFilename(videoPath)  --"cocosvideo.mp4"
            videoPlayer:setFileName(videoFullPath)   
            videoPlayer:play()
	    end
    end
end

function VideoPlayerMgr:playByURL(videoPlayer, videoURL)
	G_Log_Info("VideoPlayerMgr:playByURL()")
    if nil  ~= videoPlayer then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
    		videoPlayer:playByURL(videoURL)
		else
			videoPlayer:setURL(videoURL)  --"http://benchmark.cocos2d-x.org/cocosvideo.mp4"
	        videoPlayer:play()
	    end
    end
end

function VideoPlayerMgr:setFullScreenEnabled(videoPlayer)
    if nil  ~= videoPlayer then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then

		else
	        videoPlayer:setFullScreenEnabled(not videoPlayer:isFullScreenEnabled())
	    end
    end
end

function VideoPlayerMgr:setKeepAspectRatioEnabled(videoPlayer)
    if nil  ~= videoPlayer then
    	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then

		else
	        videoPlayer:setKeepAspectRatioEnabled(not videoPlayer:isKeepAspectRatioEnabled())
	    end
    end
end




return VideoPlayerMgr
