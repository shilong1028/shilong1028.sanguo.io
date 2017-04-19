
--MapLayer用于显示地图及点击处理等
local MapLayer = class("MapLayer", CCLayerEx) --填入类名

local PlayerNode = require "Layer.PlayerNode"
local NpcNode = require "Layer.NpcNode"

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
    --ClearMapObj不清除的数据
    self.rootNode = nil    --根节点
    self.mapConfigData = nil  --地图表配置数据 
	self.movePathMapByMap = nil  --跨地图跳转数据

    -------ClearMapObj清除的数据----------
    self.playerNode = nil  --主角节点
	self.m_touchImg = nil  --点击动画
    self.m_arrowImgVec = {}  --路径箭头
    self.curRolePos = 0   --当前人物所在位置（像素点）
    self.mapJumpPosData = {}  --游戏跳转点   
end

function MapLayer:ClearMapObj()
	self.rootNode:removeAllChildren()
    self.rootNode:setPosition(cc.p(0,0))
    self.playerNode = nil  --主角节点
	self.m_touchImg = nil  --点击动画
    self.m_arrowImgVec = {}  --路径箭头
    self.curRolePos = 0   --当前人物所在位置（像素点）
    g_pMapMgr.curRolePos = 0
    self.mapJumpPosData = {}  --游戏跳转点
end

function MapLayer:ShowMapImg(mapId)  
    G_Log_Info("MapLayer:ShowMapImg() mapId = %d", mapId)
    collectgarbage("collect")
    -- avoid memory leak
    collectgarbage("setpause", 100)
    collectgarbage("setstepmul", 5000)
    math.randomseed(os.time())

    g_pGameLayer:showLoadingLayer(true) 

    self.mapConfigData = nil
    self.mapConfigData = g_pMapMgr:LoadMapStreamData(mapId)  --地图表配置数据 
    if self.mapConfigData == nil then
    	G_Log_Error("MapLayer--mapConfigData = nil")
    	return
    end
    --G_Log_Dump(self.mapConfigData, "self.mapConfigData = ")
    if not self.rootNode then
    	self.rootNode = cc.Node:create()
    	self:addChild(self.rootNode)
    end

    self:ClearMapObj()

    self.rootNode:setContentSize(cc.size(self.mapConfigData.width, self.mapConfigData.height))
    --self.rootNode:setPosition(cc.p((g_WinSize.width - self.mapConfigData.width)/2, (g_WinSize.height - self.mapConfigData.height)/2))

    local imgCount = self.mapConfigData.img_count
    local imgName = self.mapConfigData.path

    local imgWidth = 512  --self.mapConfigData.width / self.mapConfigData.column
    local imgHeight = 512   --self.mapConfigData.height / self.mapConfigData.row

    local posX = 0
	local posY = self.mapConfigData.height

	for i=1, imgCount do
		local str = string.format("Map/%s/images/%s_%d.jpg", imgName, imgName, i)
		local Spr = cc.Sprite:create(str)
		if Spr == nil then
			G_Log_Error("MapLayer--mapImg = nil, mapName = %s, idx = %d", imgName, i)
		end
		Spr:setAnchorPoint(cc.p(0, 1))
		Spr:setPosition(cc.p(posX, posY))
		self.rootNode:addChild(Spr, 1)
		--G_Log_Info("idx = %d, posX = %d, posY = %d", i, posX, posY)

		if i%self.mapConfigData.column == 0 then
			posX = 0
			posY = posY - imgHeight
		else
			posX = posX + imgWidth
		end
	end

	--添加游戏跳转点
	self.mapJumpPosData = g_pMapMgr:getMapJumpPosData()
	for k, jumpData in pairs(self.mapJumpPosData) do
		if jumpData and jumpData.pos then
		    local jumpPt = NpcNode:create()
		    jumpPt:initMapJumpPtData(jumpData)
		    self.rootNode:addChild(jumpPt, 10)
		    jumpPt:setPosition(jumpData.pos)
		end
	end

	--添加城池
	for k, chengId in pairs(self.mapConfigData.cityIdStrVec) do
		local chengData = g_pTBLMgr:getCityConfigTBLDataById(chengId)
		if chengData then
		    local chengchi = NpcNode:create()
		    chengchi:initChengData(chengData)
		    self.rootNode:addChild(chengchi, 10)

		    local pos = cc.p(chengData.map_pt.x, self.mapConfigData.height - chengData.map_pt.y)    --转换为像素点,以左上角为00原点
		    chengchi:setPosition(pos)
		end
	end

	g_pGameLayer:showLoadingLayer(false) 
end

--显示人物
function MapLayer:ShowPlayerNode(rolePos)
	--添加人物
	if not self.playerNode then
		self.playerNode = PlayerNode:create()
	    self.playerNode:initPlayerData()
	    self.rootNode:addChild(self.playerNode, 20)
	end

	if not rolePos then
	    local defaultCityId = self.mapConfigData.cityIdStrVec[1]
	    local cityData = g_pTBLMgr:getCityConfigTBLDataById(defaultCityId)
	    if cityData then
	    	rolePos = cc.p(cityData.map_pt.x, self.mapConfigData.height - cityData.map_pt.y)  --转换为像素点,以左上角为00原点
	    else
	    	rolePos = cc.p(0,0)
	    end
	end

    self:setRoleMapPosition(rolePos)  
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

	self:showTouchImg(rolePos)
	self.movePathMapByMap = nil  --跨地图跳转数据

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
		self.curRolePos = rolePos   --当前人物所在位置（像素点）
		g_pMapMgr.curRolePos = rolePos 
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
	--G_Log_Info("MapLayer:resetRootNodePos, rootPos.x = %f, rootPos.y = %f", rootPos.x, rootPos.y)

	if moveTime then
		self.rootNode:runAction(cc.MoveTo:create(moveTime, rootPos))
	else
		self.rootNode:setPosition(rootPos)
	end
end

function MapLayer:showTouchImg(pos)
    if(self.m_touchImg == nil)then   --点击屏幕时的显示图片
        self.m_touchImg = cc.Sprite:create("Image/Image_Click1.png")
        self.m_touchImg:setVisible(false)
        self.rootNode:addChild(self.m_touchImg, 2)
    end

    if(self.m_touchImg:isVisible() == true)then
        self.m_touchImg:stopAllActions()
        self.m_touchImg:setVisible(false)
    end

    self.m_touchImg:setPosition(pos)
    
    local animation = cc.Animation:create()
    animation:addSpriteFrameWithFile("Image/Image_Click1.png")
    animation:addSpriteFrameWithFile("Image/Image_Click2.png")
    animation:addSpriteFrameWithFile("Image/Image_Click3.png")

    -- should last 0.3 seconds. And there are 3 frames.
    animation:setDelayPerUnit(0.3 / 3)
    animation:setRestoreOriginalFrame(true)
    local animate = cc.Animate:create(animation)

    self.m_touchImg:setVisible(true)
    self.m_touchImg:runAction(cc.Sequence:create(cc.Show:create(), animate, cc.Hide:create()))
end


function MapLayer:onTouchBegan(touch, event)
    --G_Log_Info("MapLayer:onTouchBegan()")
    local beginPos = touch:getLocation()   --直接从touch中获取,在getLocation()源码里会将坐标转成OpenGL坐标系,原点在屏幕左下角，x轴向右，y轴向上
    --local point = touch:getLocationInView() --获得屏幕坐标系,原点在屏幕左上角，x轴向右，y轴向下
    --point = cc.Director:getInstance():convertToGL(point)  --先获得屏幕坐标，在调用convertToGL转成OpenGl坐标系
    self:setRoleWinPosition(beginPos, true)
    return true   --只有当onTouchBegan的返回值是true时才执行后面的onTouchMoved和onTouchEnded触摸事件
end

--开始astar寻路,endPos为目标位置的像素点，movePt为目标位置的32*32地图块坐标
function MapLayer:starAutoPath(endPos, movePt)
	G_Log_Info("MapLayer:starAutoPath(), endPos.x = %f, endPos.y = %f", endPos.x, endPos.y)
    if endPos.x < 0 or endPos.y < 0 or endPos.x > self.mapConfigData.width or endPos.y > self.mapConfigData.height then
    	G_Log_Error("endPos is not in Map, endPos.x = %f, endPos.y = %f", endPos.x, endPos.y)  --如果越界了
		return;
	end

	if self.playerNode then
		self.playerNode:StopLastAutoPath()   --停止上一个自动寻路
		local startPos = cc.p(self.playerNode:getPosition())
		local startPt = cc.p(math.floor(startPos.x / 32), math.floor((self.mapConfigData.height - startPos.y) / 32))    --地图块为32*32大小，且从0开始计数
		local endPt = movePt
		if not movePt then
			endPt = cc.p(math.floor(endPos.x / 32), math.floor((self.mapConfigData.height - endPos.y) / 32))
		end

		G_Log_Info("startPt.x = %d, startPt.y = %d, endPt.x = %d, endPt.y = %d", startPt.x, startPt.y, endPt.x, endPt.y)
		g_pAutoPathMgr:AStarFindPath(startPt.x, startPt.y, endPt.x, endPt.y)
		local autoPath = g_pAutoPathMgr:AStarGetPath(g_bAStarPathSmooth)
		if autoPath then
			self:drawAutoPathArrow(autoPath, true)
		else
			G_Log_Error("autoPath is nil!")
		end
	end
end

--直接跳转到指定城市所在地图的城池
function MapLayer:changeMapByCity(cityId)
	local cityData = g_pTBLMgr:getCityConfigTBLDataById(cityId)
    if cityData then
	    self:ShowMapImg(cityData.mapId)  --全国地图
	    self:ShowPlayerNode(cc.p(cityData.map_pt.x, self.mapConfigData.height - cityData.map_pt.y))  --转换为像素点,以左上角为00原点
	end
end

--直接通过跳转点跳转到另一个地图相应跳转点附近
function MapLayer:changeMapByJumpPoint(jumpData)
	G_Log_Info("MapLayer:changeMapByJumpPoint(), curMapId = %d", self.mapConfigData.id)
	if jumpData then
		if jumpData.map_id1 == self.mapConfigData.id then
			self:ShowMapImg(jumpData.map_id2)  
			self:ShowPlayerNode(cc.p(jumpData.map_pt2.x, self.mapConfigData.height - jumpData.map_pt2.y))    --转换为像素点,以左上角为00原点
		elseif jumpData.map_id2 == self.mapConfigData.id then
			self:ShowMapImg(jumpData.map_id1) 
			self:ShowPlayerNode(cc.p(jumpData.map_pt1.x, self.mapConfigData.height - jumpData.map_pt1.y))    --转换为像素点,以左上角为00原点
		end
		--跨地图移动
		if self.movePathMapByMap and #self.movePathMapByMap > 0 then
			self:autoPathByMapsPath()
		end
	end
end

--跨地图移动
function MapLayer:autoPathByMapsPath()
	G_Log_Info("autoPathByMapsPath")
	if not self.movePathMapByMap then
		return
	end
	G_Log_Dump(self.movePathMapByMap, "self.movePathMapByMap = ")

	local moveData = self.movePathMapByMap[1]
	table.remove(self.movePathMapByMap, 1)
	
	self:starAutoPath(moveData.movePos, moveData.movePt)
end

--自动寻路跳转到城池所在地图的目标城池
function MapLayer:autoPathMapByCity(tarCityId, srcCityId)
	G_Log_Info("MapLayer:autoPathMapByCity(), tarCityId = %s", tarCityId)
	local movePath = g_pMapMgr:getMovePathCityByCity(tarCityId, srcCityId)
	self.movePathMapByMap = movePath   --{["mapId"], ["movePt"] , ["movePos"]}

	self:autoPathByMapsPath()
	-- local cityData = g_pTBLMgr:getCityConfigTBLDataById(cityId)
 --    if cityData then
	--     self:ShowMapImg(cityData.mapId)  --全国地图
	--     self:ShowPlayerNode(cc.p(cityData.map_pt.x, self.mapConfigData.height - cityData.map_pt.y))  --转换为像素点,以左上角为00原点
	-- end
end

--设置任务标志路径
function MapLayer:drawAutoPathArrow(autoPath, bDrawPath)
	G_Log_Info("MapLayer:drawAutoPathArrow()")
	if autoPath and #autoPath >0 then
		local AutoPathVec = {}   --自动寻路路径
		local pt0 = cc.p(autoPath[1]:getX(), self.mapConfigData.height - autoPath[1]:getY())
	    local pt1 = pt0
	    table.insert(AutoPathVec, pt0)
		for k=2, #autoPath do   --SPoint转ccp, autoPath为32*32的块坐标，AutoPathVec为像素坐标
			pt1 = cc.p(autoPath[k]:getX(), self.mapConfigData.height - autoPath[k]:getY())
            local StepLen = g_pMapMgr:CalcDistance(pt0, pt1)   --箭头长度49
            local count = math.floor(StepLen/50)
            local ptoffset = cc.p((pt1.x - pt0.x)/(count+1), (pt1.y - pt0.y)/(count+1) )
        	for i=1, count do
                local pathPos = cc.p(pt0.x + ptoffset.x*i, pt0.y + ptoffset.y*i )
                table.insert(AutoPathVec, pathPos)
            end
			table.insert(AutoPathVec, pt1)
            pt0 = pt1
		end
		--G_Log_Dump(AutoPathVec, "AutoPathVec = ")
		if bDrawPath == true then   --绘制路径箭头
			for k, arrow in pairs(self.m_arrowImgVec) do 
		        arrow:setVisible(false)
		        arrow:removeFromParent(true)
		    end
		    self.m_arrowImgVec = {}

		    local pt0 = AutoPathVec[1]
	    	local pt1 = pt0
		    for k=2, #AutoPathVec do 
				local arrowImg =  ccui.ImageView:create("public_arrow.png",ccui.TextureResType.plistType)
	            arrowImg:setPosition(pt0)
	            self.rootNode:addChild(arrowImg, 1)
	            table.insert(self.m_arrowImgVec, arrowImg)

	            pt1 = AutoPathVec[k]
				local countX = pt1.x - pt0.x
	            local countY = pt1.y - pt0.y
	            if(countX > 0) then   
	                if(countY > 0)then --右下箭头
	                    arrowImg:setRotation(-45)
	                elseif(countY < 0)then --右上箭头
	                    arrowImg:setRotation(45)
	                else
	                	arrowImg:setRotation(0)  --右箭头
	                end
	            elseif(countX < 0)then  
	                if(countY > 0)then --左下箭头
	                    arrowImg:setRotation(-135)
	                elseif(countY < 0)then --左上箭头
	                    arrowImg:setRotation(135)
	                else
	                	arrowImg:setRotation(180)  --左箭头
	                end
	            else
	                if(countY > 0)then --下箭头
	                    arrowImg:setRotation(-90)
	                elseif(countY < 0)then --上箭头
	                    arrowImg:setRotation(90)
	                end
	            end
                pt0 = pt1
		    end
		end
		self.playerNode:StartAutoPath(AutoPathVec)
	end
end


return MapLayer
