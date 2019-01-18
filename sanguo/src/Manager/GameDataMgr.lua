
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

--任务剧情相关  --end

--保存武将数据到XML中
function GameDataMgr:SaveGeneralDataToXML(generalId)
    local campData = g_HeroDataMgr:GetHeroCampData()
    if campData and generalId then
        local generalVec = campData.generalIdVec or {}
        table.insert(generalVec, generalId)

        local generalData = g_pTBLMgr:getGeneralConfigTBLDataById(generalId) 
        if generalData then
            g_HeroDataMgr:SetSingleGeneralData(generalData)   --保存单个武将数据到generalXML
        else
            G_Log_Error("generalData = nil, generalId = ", generalId or -1)
        end
        g_HeroDataMgr:SetHeroCampGeneral(generalVec)    --保存新武将到heroXML
    end
end

return GameDataMgr