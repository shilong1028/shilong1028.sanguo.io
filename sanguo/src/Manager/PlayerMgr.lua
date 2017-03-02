
--PlayerMgr用于有属性的活动的模型的数据处理，比如主角，敌怪等

local PlayerMgr = class("PlayerMgr")

function PlayerMgr:ctor()
	--G_Log_Info("PlayerMgr:ctor()")
    self:init()
end

function PlayerMgr:init()
	--G_Log_Info("PlayerMgr:init()")
end

function PlayerMgr:GetInstance()
	--G_Log_Info("PlayerMgr:GetInstance()")
    if self.instance == nil then
        self.instance = PlayerMgr:new()
    end
    return self.instance
end

return PlayerMgr