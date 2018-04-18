
--BattleDataMgr用于游戏战斗信息

local BattleDataMgr = class("BattleDataMgr")

function BattleDataMgr:ctor()
	--G_Log_Info("BattleDataMgr:ctor()")
    self:init()
end

function BattleDataMgr:init()
	--G_Log_Info("BattleDataMgr:init()")
    self.battleData  = nil
end

function BattleDataMgr:GetInstance()
	--G_Log_Info("BattleDataMgr:GetInstance()")
    if self.instance == nil then
        self.instance = BattleDataMgr:new()
    end
    return self.instance
end

------------------------------------------------------
--设置战斗剧情数据
function BattleDataMgr:setBattleStoryData(storyData)
    self.battleStoryData = clone(storyData)   --战斗剧情配置数据
    if self.battleStoryData then
        self.battleMapData = g_pTBLMgr:getBattleMapConfigById(self.battleStoryData.battleIdStr)   --战斗ID字符串，"0"标识无战斗
    else
        self.battleMapData = nil   --战斗战场配置数据
    end
    self.battleZhenXingData = nil   --战斗阵型数据
end

function BattleDataMgr:getBattleStoryData()
    return clone(self.battleStoryData)
end

function BattleDataMgr:getBattleMapData()
    return clone(self.battleMapData)
end

--设置战斗阵型数据
function BattleDataMgr:setBattleZhenXingData(zhenxingData)
    self.battleZhenXingData = clone(zhenxingData)
end

function BattleDataMgr:getBattleZhenXingData()
    return clone(self.battleZhenXingData)
end




return BattleDataMgr