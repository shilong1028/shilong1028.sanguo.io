
--GameDataMgr用于处理游戏中的全局数据（仅限内存，不保存于XML文件）

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

--保存正在执行的任务剧情，用于检查是否到达了任务目的地
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

	self.implementStoryData.storyPlayedState = 2
    g_HeroDataMgr:SetStoryPlayedState(self.implementStoryData.storyId, self.implementStoryData.storyPlayedState)  --任务故事进程状态（0初始，1文字播放完成，2展示寻路完成，3最终完成）

	local curStoryId = self.implementStoryData.storyId
	--G_Log_Info("GameDataMgr:HandleImplementTask(), storyId = %d", curStoryId)
	--G_Log_Dump(self.implementStoryData, "self.implementStoryData = ")
	if string.len(self.implementStoryData.battleIdStr) > 1 then
		g_pGameLayer:showBattleInfoLayer(curStoryId)
	else
		g_pGameLayer:showStoryResultLayer(curStoryId)
	end

	self:SetImplementTaskData(nil)
end

--任务剧情相关  --end

return GameDataMgr