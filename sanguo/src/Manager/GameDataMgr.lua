
--GameDataMgr用于处理游戏中的全局数据

local GameDataMgr = class("GameDataMgr")

function GameDataMgr:ctor()
	--G_Log_Info("GameDataMgr:ctor()")
    self:init()
end

function GameDataMgr:init()
	--G_Log_Info("GameDataMgr:init()")
	self.implementStoryData = nil  --正在执行的任务剧情ID

end

function GameDataMgr:GetInstance()
	--G_Log_Info("GameDataMgr:GetInstance()")
    if self.instance == nil then
        self.instance = GameDataMgr:new()
    end
    return self.instance
end


--任务剧情相关  --begin
function GameDataMgr:GetImplementTaskData()
	return self.implementStoryData  --正在执行的任务剧情
end

function GameDataMgr:SetImplementTaskData(storyData)
	self.implementStoryData = storyData --正在执行的任务剧情
end

--检查是否到达了任务目的地   --rolePos像素点
function GameDataMgr:CheckImplementTask(rolePos) 
	--G_Log_Info("GameDataMgr:CheckImplementTask()")
	if not self.implementStoryData then
		return
	end
	local targetCity = self.implementStoryData.targetCity
	local tarCityData = g_pTBLMgr:getCityConfigTBLDataById(targetCity)
	if tarCityData then
		local tarMapData = g_pTBLMgr:getMapConfigTBLDataById(tarCityData.mapId)
		if tarMapData then
			local targetPos = cc.p(tarCityData.map_pt.x, tarMapData.height - tarCityData.map_pt.y)  --以左上角为00原点转为左下角为原点的像素点
			local stepLen = g_pMapMgr:CalcDistance(targetPos, rolePos)
			if stepLen < 32 then
				self:HandleImplementTask()
				return true
			end
		end
	end
	return false
end

--触发执行当前剧情任务结果
function GameDataMgr:HandleImplementTask()
	if not self.implementStoryData then
		return
	end
	local curStoryId = self.implementStoryData.storyId
	--G_Log_Info("GameDataMgr:HandleImplementTask(), storyId = %d", curStoryId)
	g_pGameLayer:ShowScrollTips(string.format(lua_Story_String3, self.implementStoryData.name), g_ColorDef.Yellow, g_defaultTipsFontSize)

	local nextStoryId = curStoryId + 1
    --发送处主线剧情任务监听事件
    local event = cc.EventCustom:new(g_EventListenerCustomName.MainMenu_mainStoryEvent)
    event._usedata = string.format("%d", nextStoryId)   --下一个剧情任务ID
    g_EventDispatcher:dispatchEvent(event)  
end

--任务剧情相关  --end

return GameDataMgr