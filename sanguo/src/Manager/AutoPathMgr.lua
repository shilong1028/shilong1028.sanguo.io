
--AutoPathMgr用于AStar寻路

local AutoPathMgr = class("AutoPathMgr")

function AutoPathMgr:ctor()
	--G_Log_Info("AutoPathMgr:ctor()")
    self:init()
end

function AutoPathMgr:init()
	--G_Log_Info("AutoPathMgr:init()")
	self.instance = nil

	self.AStar = nil  --AStar算法单例
end

function AutoPathMgr:GetInstance()
	--G_Log_Info("AutoPathMgr:GetInstance()")
    if self.instance == nil then
        self.instance = AutoPathMgr:new()
        self.AStar = CAStar:new()
    end
    return self.instance
end

function AutoPathMgr:AStarInit(mapId,tileWidth,tileHeight)
	--G_Log_Info("AutoPathMgr:AStarInit()")
	if self.AStar then
		self.AStar:Init(mapId,tileWidth,tileHeight,32)
	end
end

function AutoPathMgr:AStarSetCanWalk(bWalk, titleX, titleY)
	if self.AStar then
		self.AStar:SetCanWalk(bWalk, titleX, titleY)
	end
end

function AutoPathMgr:AStarFindPath(startPtx, startPty, endPtx, endPty)   --地图块为32*32大小，且从0开始计数
	if self.AStar then
		self.AStar:FindPath(startPtx, startPty, endPtx, endPty)
	end
end

function AutoPathMgr:AStarGetPath(bAStarPathSmooth)
	if self.AStar then
		return self.AStar:GetPath(bAStarPathSmooth)
	end
	return nil
end

function AutoPathMgr:AStarCanWalk(movePtx, movePty)
	if self.AStar then
		return self.AStar:CanWalk(movePtx, movePty)
	end
	return false
end




return AutoPathMgr