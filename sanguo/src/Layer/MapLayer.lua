
--MapLayer用于显示地图及点击处理等
local MapLayer = class("MapLayer", CCLayerEx) --填入类名

function MapLayer:create()   --自定义的create()创建方法
    --G_Log_Info("MapLayer:create()")
    local layer = MapLayer.new()
    return layer
end

function MapLayer:onExit()
    --G_Log_Info("MapLayer:onExit()")
end

function MapLayer:init()  
    G_Log_Info("MapLayer:init()")
    self:ShowMapImg(1)  


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
		G_Log_Info("posX = %f, posY = %f", posX, posY)

		if i>=self.mapConfigData.column and i%self.mapConfigData.column == 0 then
			posX = 0
			posY = posY - imgHeight
		else
			posX = posX + imgWidth
		end
	end

    self.playerNode = ImodAnim:create()
    self.playerNode:initAnimWithName("Monster/btm7_zd.png", "Monster/btm7_zd.ani", true)   
    --调用initAnimWithName方法，会连报三个[LUA ERROR] function refid '1' does not reference a Lua function
    self.playerNode:PlayActionRepeat(0, 0.1)
    self:setRoleMapPosition(self.mapConfigData.default_pt)
    --self.playerNode:setPosition(self.mapConfigData.default_pt)
    self.rootNode:addChild(self.playerNode, 10)
end

--主角在屏幕上的坐标
function MapLayer:setRoleWinPosition(winPos)
	G_Log_Dump(winPos, "winPos = ")
	local rootNodePos = cc.p(self.rootNode:getPosition())
	local rolePos = cc.p(winPos.x - rootNodePos.x, winPos.y - rootNodePos.y)
	self:setRoleMapPosition(rolePos)
end

--主角在地图上的坐标
function MapLayer:setRoleMapPosition(rolePos)
	G_Log_Dump(rolePos, "rolePos = ")
	if self.playerNode then
		self.playerNode:setPosition(rolePos)
		self:resetRootNodePos(rolePos)
	end
end

--以主角为屏幕中心，适配地图
function MapLayer:resetRootNodePos(rolePos)
	local rootPos = cc.p(0,0)
	print("x = ", self.mapConfigData.width - g_WinSize.width/2)
	if rolePos.x >= self.mapConfigData.width - g_WinSize.width/2 then
		print("############")
		rootPos.x = g_WinSize.width/2 - self.mapConfigData.width
	elseif rolePos.x >= g_WinSize.width/2 then
		print("**************")
		rootPos.x = g_WinSize.width/2 - rolePos.x
	end
	print("y=", self.mapConfigData.height - g_WinSize.height/2)
	if rolePos.y >= self.mapConfigData.height - g_WinSize.height/2 then
		print("############")
		rootPos.y = g_WinSize.height/2 -self.mapConfigData.height
	elseif rolePos.y >= g_WinSize.height/2 then
		print("**************")
		rootPos.y = g_WinSize.height/2 - rolePos.y
	end
	G_Log_Dump(rootPos, "rootPos = ")
	self.rootNode:setPosition(rootPos)
end


function MapLayer:onTouchBegan(touch, event)
    G_Log_Info("MapLayer:onTouchBegan()")
    local beginPos = touch:getLocation()   --直接从touch中获取,在getLocation()源码里会将坐标转成OpenGL坐标系,原点在屏幕左下角，x轴向右，y轴向上
    --local point = touch:getLocationInView() --获得屏幕坐标系,原点在屏幕左上角，x轴向右，y轴向下
    --point = cc.Director:getInstance():convertToGL(point)  --先获得屏幕坐标，在调用convertToGL转成OpenGl坐标系
    self:setRoleWinPosition(beginPos)
    return true   --只有当onTouchBegan的返回值是true时才执行后面的onTouchMoved和onTouchEnded触摸事件
end

function MapLayer:onTouchMoved(touch, event)
    G_Log_Info("MapLayer:onTouchMoved()")
end

function MapLayer:onTouchEnded(touch, event)
    G_Log_Info("MapLayer:onTouchEnded()")
end

return MapLayer
