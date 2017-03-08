

--cocos\cocos2d\functions.lua已经定义了一些cocos自带的公用方法，比如print等
--GlobalFunction.lua用于用户自定义全局方法，自定义全局方法名前以 G_ 为标志

function G_Log_Info(msg, ...)    --信息输出黄色
	if DEBUG > 1 then
		msg = string.format(tostring(msg), ...)
		if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
			logger_info(msg)
		else
			print(msg)
		end
	end
end 

function G_Log_Debug(msg, ...)    --Debug输出紫色
	if DEBUG > 1 then
		msg = string.format(tostring(msg), ...)
		if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
			logger_debug(msg)
		else
			print(msg)
		end
	end
end 

function G_Log_Warning(msg, ...)    --警告输出暗绿色
	if DEBUG > 1 then
		msg = string.format(tostring(msg), ...)
		if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
			logger_warning("Warning: "..msg)
		else
			print("Warning: "..msg)
		end
	end
end 

function G_Log_Error(msg, ...)    --错误输出暗红色
	if DEBUG > 1 then
		msg = string.format(tostring(msg), ...)
		if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
			logger_error("Error: "..msg)
		else
			print("Error: "..msg)
		end
	end
end 

function G_Log_Fatal(msg, ...)    --致命错误输出亮红色
	if DEBUG > 1 then
		msg = string.format(tostring(msg), ...)
		if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
			logger_fatal("Fatal Error: "..msg)
		else
			print("Fatal Error: "..msg)
		end
	end
end 

--打印调用堆栈
function G_Log_Traceback()
	if DEBUG > 1 then
	    local msg = debug.traceback()
	    print("-----------------------------------")
	    print(msg)
	    print("-----------------------------------")
	end
end

--打印表数据
function G_Log_Dump(value, description, nesting)  --打印出lua的table数据
	if DEBUG > 1 then
		dump(value, description, nesting)
	end
end

function G_Resolution_BgImage(bg, layerSize, autoscale)   --根据适配方案，调整代码创建的背景图片
	if CC_DESIGN_RESOLUTION then
		--local view = cc.Director:getInstance():getOpenGLView()
		local framesize = layerSize  --view:getFrameSize()
		local bgSize = bg:getContentSize()
		local scaleX = framesize.width/bgSize.width
		local scaleY = framesize.height/bgSize.height

		if autoscale == "FIXED_WIDTH" then
			scaleY = scaleX
		elseif autoscale == "FIXED_HEIGHT" then
			scaleX = scaleY
		elseif autoscale == "NO_BORDER" then
			scaleX = math.max(scaleX, scaleY)
			scaleY = math.max(scaleX, scaleY)
		elseif autoscale == "SHOW_ALL" then
			scaleX = math.min(scaleX, scaleY)
			scaleY = math.min(scaleX, scaleY)
		else
			G_Log_Warning(string.format("display - invalid r.autoscale \"%s\"", autoscale))
			return 
		end

		--G_Log_Info("G_Resolution_BgImage scaleX = %0.2f, scaleY = %0.2f", scaleX, scaleY)
		bg:setContentSize(cc.size(scaleX*bgSize.width, scaleY*bgSize.height))
	end
end

