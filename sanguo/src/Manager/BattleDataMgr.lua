
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
--设置剧情战斗数据
function BattleDataMgr:setBattleStoryData(storyData)
    self.battleData = storyData
end


return BattleDataMgr