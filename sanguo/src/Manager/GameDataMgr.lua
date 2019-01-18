
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
function GameDataMgr:SaveGeneralDataToXML(generalData)
    local campData = g_HeroDataMgr:GetHeroCampData()
    if campData and generalData then
        local generalVec = campData.generalIdVec or {}
        table.insert(generalVec, generalData.id_str)

        g_HeroDataMgr:SetSingleGeneralData(generalData)   --保存单个武将数据到generalXML

        g_HeroDataMgr:SetHeroCampGeneral(generalVec)    --保存新武将到heroXML
    end
end

--处理武将经验导致等级增加
function GameDataMgr:handleGeneralExpAdd(generalData, expVal, bTotalExp)
    if not generalData then
        return
    end
    if not bTotalExp then
        bTotalExp = false
    end
    --G_Log_Info("handleGeneralExpAdd(), exp = %d, bTotalExp= %s", expVal, bTotalExp)

    local lv = generalData.level
    local exp = generalData.exp
    --G_Log_Info("generalData, lv = %d, exp= %d", lv, exp)

    local levelConfig = g_pTBLMgr:getLevelConfigById(lv)
    --G_Log_Dump(levelConfig, "levelConfig =")
    if levelConfig then
        local totalAddExp = exp + expVal
        if bTotalExp == true then
            totalAddExp = expVal - levelConfig.exp
        end

        while totalAddExp > 0 do
            if totalAddExp >= levelConfig.add_exp then   --连升多级
                lv = lv +1
                levelConfig = g_pTBLMgr:getLevelConfigById(lv)
                if levelConfig then
                    totalAddExp = totalAddExp - levelConfig.exp
                else
                    totalAddExp = 0
                    break
                end
                --升级
            else  
                break
            end
        end
        --G_Log_Info("new generalData, lv = %d, exp= %d", lv, totalAddExp)
        generalData.level = lv
        generalData.exp = totalAddExp

        g_HeroDataMgr:SetSingleGeneralData(generalData)  --保存单个武将数据
    end
end

return GameDataMgr