
--MapLayer用于显示地图及点击处理等
local MapLayer = class("MapLayer", CCLayerEx) --填入类名

local PlayerNode = require "Layer.PlayerNode"

function MapLayer:create()   --自定义的create()创建方法
    --G_Log_Info("MapLayer:create()")
    local layer = MapLayer.new()
    return layer
end

function MapLayer:onExit()
    --G_Log_Info("MapLayer:onExit()")
end

function MapLayer:init()  
    --G_Log_Info("MapLayer:init()")
    self:ShowMapImg(1)  --全国地图


end

function MapLayer:ShowMapImg(mapId)  
    --G_Log_Info("MapLayer:ShowMapImg()")
    self.mapConfigData = g_pMapMgr:LoadMapStreamData(mapId)  --地图表配置数据 
    if self.mapConfigData == nil then
    	G_Log_Error("MapLayer--mapConfigData = nil")
    	return
    end

    self.rootNode = cc.Node:create()
    self.rootNode:setContentSize(cc.size(self.mapConfigData.width, self.mapConfigData.height))
    --self.rootNode:setPosition(cc.p((g_WinSize.width - self.mapConfigData.width)/2, (g_WinSize.height - self.mapConfigData.height)/2))
    self:addChild(self.rootNode)

    local imgCount = self.mapConfigData.img_count
    local imgName = self.mapConfigData.path

    local imgWidth = self.mapConfigData.width / self.mapConfigData.column
    local imgHeight = self.mapConfigData.height / self.mapConfigData.row

    local posX = 0
	local posY = self.mapConfigData.height

	for i=1, imgCount do
		local str = string.format("Map/%s/%s%d.jpg", imgName, imgName, i)
		local Spr = cc.Sprite:create(str)
		if Spr == nil then
			G_Log_Error("MapLayer--mapImg = nil, mapName = %s, idx = %d", imgName, i)
		end
		Spr:setAnchorPoint(cc.p(0, 1))
		Spr:setPosition(cc.p(posX, posY))
		self.rootNode:addChild(Spr, 1)

		if i>=self.mapConfigData.column and i%self.mapConfigData.column == 0 then
			posX = 0
			posY = posY - imgHeight
		else
			posX = posX + imgWidth
		end
	end

    self.playerNode = PlayerNode:create()
    self.playerNode:initPlayerData()
    self:setRoleMapPosition(self.mapConfigData.default_pt)
    self.rootNode:addChild(self.playerNode, 10)
end

--主角在屏幕上的坐标
function MapLayer:setRoleWinPosition(winPos, bAutoPath)
	local rootNodePos = cc.p(self.rootNode:getPosition())
	local rolePos = cc.p(winPos.x - rootNodePos.x, winPos.y - rootNodePos.y)
	if rolePos.x > self.mapConfigData.width then
		rolePos.x = self.mapConfigData.width
	end
	if rolePos.y > self.mapConfigData.height then
		rolePos.y = self.mapConfigData.height
	end
	if bAutoPath == true then
		self:starAutoPath(rolePos)
	else
		self:setRoleMapPosition(rolePos)
	end
end

--主角在地图上的坐标
function MapLayer:setRoleMapPosition(rolePos)
	if self.playerNode then
		if rolePos.x > self.mapConfigData.width then
			rolePos.x = self.mapConfigData.width
		elseif rolePos.x < 0 then
			rolePos.x = 0
		end
		if rolePos.y > self.mapConfigData.height then
			rolePos.y = self.mapConfigData.height
		elseif rolePos.y < 0 then
			rolePos.y = 0
		end

		self.playerNode:setPosition(rolePos)
		self:resetRootNodePos(rolePos)
	end
end

--以主角为屏幕中心，适配地图
function MapLayer:resetRootNodePos(rolePos, moveTime)
	local rootPos = cc.p(0,0)

	if rolePos.x >= self.mapConfigData.width - g_WinSize.width/2 then
		rootPos.x = g_WinSize.width - self.mapConfigData.width
	elseif rolePos.x >= g_WinSize.width/2 then
		rootPos.x = g_WinSize.width/2 - rolePos.x
	end

	if rolePos.y >= self.mapConfigData.height - g_WinSize.height/2 then
		rootPos.y = g_WinSize.height -self.mapConfigData.height
	elseif rolePos.y >= g_WinSize.height/2 then
		rootPos.y = g_WinSize.height/2 - rolePos.y
	end

	if moveTime then
		self.rootNode:runAction(cc.MoveTo:create(moveTime, rootPos))
	else
		self.rootNode:setPosition(rootPos)
	end
end


function MapLayer:onTouchBegan(touch, event)
    --G_Log_Info("MapLayer:onTouchBegan()")
    local beginPos = touch:getLocation()   --直接从touch中获取,在getLocation()源码里会将坐标转成OpenGL坐标系,原点在屏幕左下角，x轴向右，y轴向上
    --local point = touch:getLocationInView() --获得屏幕坐标系,原点在屏幕左上角，x轴向右，y轴向下
    --point = cc.Director:getInstance():convertToGL(point)  --先获得屏幕坐标，在调用convertToGL转成OpenGl坐标系
    self:setRoleWinPosition(beginPos, true)
    return true   --只有当onTouchBegan的返回值是true时才执行后面的onTouchMoved和onTouchEnded触摸事件
end

function MapLayer:onTouchMoved(touch, event)
    --G_Log_Info("MapLayer:onTouchMoved()")
end

function MapLayer:onTouchEnded(touch, event)
    --G_Log_Info("MapLayer:onTouchEnded()")
end

--开始astar寻路
function MapLayer:starAutoPath(endPos)
	--G_Log_Info("MapLayer:starAutoPath()")
    --如果越界了
    if endPos.x < 0 or endPos.y < 0 or endPos.x > self.mapConfigData.width or endPos.y > self.mapConfigData.height then
    	G_Log_Error("endPos is not in Map, endPos.x = %f, endPos.y = %f", endPos.x, endPos.y)
		return;
	end

	if self.playerNode then
		local startPos = cc.p(self.playerNode:getPosition())
		local startPt = cc.p(math.floor(startPos.x / 32), math.floor((self.mapConfigData.height - startPos.y) / 32))    --地图块为32*32大小，且从0开始计数
		local endPt = cc.p(math.floor(endPos.x / 32), math.floor((self.mapConfigData.height - endPos.y) / 32))

		g_pAutoPathMgr:AStarFindPath(startPt.x, startPt.y, endPt.x, endPt.y)
		local autoPath = g_pAutoPathMgr:AStarGetPath(g_bAStarPathSmooth)
		self.playerNode:StartAutoPath(autoPath)
	end
end

return MapLayer
