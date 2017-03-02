
--AutoPathMgr用于AStar寻路

local AutoPathMgr = class("AutoPathMgr")

function AutoPathMgr:ctor()
	G_Log_Info("AutoPathMgr:ctor()")
    self:init()
end

function AutoPathMgr:init()
	G_Log_Info("AutoPathMgr:init()")
	self.instance = nil

	self.AStar = nil  --AStar算法单例
end

function AutoPathMgr:GetInstance()
	G_Log_Info("AutoPathMgr:GetInstance()")
    if self.instance == nil then
        self.instance = AutoPathMgr:new()
        self.AStar = CAStar:new()
    end
    return self.instance
end

function AutoPathMgr:AStarInit(mapId,tileWidth,tileHeight)
	G_Log_Info("AutoPathMgr:AStarInit()")
	if self.AStar then
		self.AStar:Init(mapId,tileWidth,tileHeight,32)
	end
end

function AutoPathMgr:AStarSetCanWalk(bWalk, titleX, titleY)
	if self.AStar then
		self.AStar:SetCanWalk(bWalk, titleX, titleY)
	end
end






return AutoPathMgr