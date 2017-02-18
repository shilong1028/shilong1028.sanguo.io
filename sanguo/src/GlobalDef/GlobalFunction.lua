

--cocos\cocos2d\functions.lua已经定义了一些cocos自带的公用方法，比如print等
--GlobalFunction.lua用于用户自定义全局方法

function  G_Log_Info(msg)    --信息输出默认色
	if DEBUG > 1 then
		if G_AppPlatform == cc.PLATFORM_OS_WINDOWS then
			logger_info(msg)
		else
			print(msg)
		end
	end
end 

function  G_Log_Debug(msg)    --Debug输出蓝色
	if DEBUG > 1 then
		if G_AppPlatform == cc.PLATFORM_OS_WINDOWS then
			logger_debug(msg)
		else
			print(msg)
		end
	end
end 

function  G_Log_Warning(msg)    --警告输出绿色
	if DEBUG > 1 then
		if G_AppPlatform == cc.PLATFORM_OS_WINDOWS then
			logger_warning("Warning: "..msg)
		else
			print("Warning: "..msg)
		end
	end
end 

function  G_Log_Error(msg)    --错误输出红色
	if DEBUG > 1 then
		if G_AppPlatform == cc.PLATFORM_OS_WINDOWS then
			logger_error("Error: "..msg)
		else
			print("Error: "..msg)
		end
	end
end 

function  G_Log_Fatal(msg)    --致命错误输出红色
	if DEBUG > 1 then
		if G_AppPlatform == cc.PLATFORM_OS_WINDOWS then
			logger_fatal("Fatal Error: "..msg)
		else
			print("Fatal Error: "..msg)
		end
	end
end 
