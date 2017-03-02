
--NPCMgr用于静态展示模型的数据管理，比如NPC，展示模型等

local NPCMgr = class("NPCMgr")

function NPCMgr:ctor()
	--G_Log_Info("NPCMgr:ctor()")
    self:init()
end

function NPCMgr:init()
	--G_Log_Info("NPCMgr:init()")
end

function NPCMgr:GetInstance()
	--G_Log_Info("NPCMgr:GetInstance()")
    if self.instance == nil then
        self.instance = NPCMgr:new()
    end
    return self.instance
end

return NPCMgr