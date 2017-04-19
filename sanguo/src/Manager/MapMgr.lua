
--MapMgr用于地图数据管理， 地图map中的格子是以左上角为0,0

local MapMgr = class("MapMgr")

function MapMgr:ctor()
	--G_Log_Info("MapMgr:ctor()")
    self:init()
end

function MapMgr:init()
	--G_Log_Info("MapMgr:init()")
	self.instance = nil

	self.curRolePos = 0   --当前人物所在位置（像素点）
	self.mapConfigData = nil  --地图表配置数据
	self.mapJumpPosData = {}  --游戏跳转点
	self._VecOpacity = nil   --地图中快透明数据

end

function MapMgr:GetInstance()
	--G_Log_Info("MapMgr:GetInstance()")
    if self.instance == nil then
        self.instance = MapMgr:new()
    end
    return self.instance
end

--加载并显示地图
function MapMgr:LoadMapStreamData(mapId)
	--G_Log_Info("MapMgr:LoadMapStreamData()")
	self._VecOpacity = nil   --地图中快透明数据
	--地图表配置数据
	self.mapConfigData = g_pTBLMgr:getMapConfigTBLDataById(mapId)
	if self.mapConfigData == nil then
		G_Log_Error("MapMgr--getMapConfigTBLDataById() failed, mapId = %d", mapId)
		return nil
	end
	--G_Log_Dump(self.mapConfigData, "self.mapConfigData = ")

	--添加游戏跳转点
	self.mapJumpPosData = {}
	for k, jumpId in pairs(self.mapConfigData.jumpptIdStrVec) do
		local jumpData = g_pTBLMgr:getMapJumpPtConfigTBLDataById(jumpId)
		if jumpData then
			if jumpData.map_id1 == mapId then
				jumpData.pos = cc.p(jumpData.map_pt1.x, self.mapConfigData.height - jumpData.map_pt1.y)    --转换为像素点,以左上角为00原点
			elseif jumpData.map_id2 == mapId then
				jumpData.pos = cc.p(jumpData.map_pt2.x, self.mapConfigData.height - jumpData.map_pt2.y)
			end

			table.insert(self.mapJumpPosData, jumpData)
		end
	end

    --读取寻路点配置信息
	local l_stream = ark_Stream:new()
	local mapPath = string.format("Map/%s/%s.map", self.mapConfigData.path, self.mapConfigData.path)
    if(l_stream:CreateReadStreamFromSelf(mapPath) == nil) then
    	G_Log_Error("MapMgr--CreateReadStreamFromSelf() failed, mapPath = %s", mapPath)
		return nil
	end

    --读取寻路块的个数(总宽32像素 总高32像素)
	local tileWidth = l_stream:ReadWord()
	local tileHeight = l_stream:ReadWord()

	g_pAutoPathMgr:AStarInit(mapId,tileWidth,tileHeight)

    --初始化寻路点信息
    local pos = 0
	local block = l_stream:ReadByte()

	for h=0, tileHeight-1 do
		local mapstr = ""
		for w=0, tileWidth-1 do
			if(SystemHelper:bit_and(block, SystemHelper:bit_l(1, pos%8)) ) ~= 0 then    --"cocos.cocos2d.bitExtend"   --SystemHelper:bit_l, SystemHelper:bit_and
				g_pAutoPathMgr:AStarSetCanWalk(false, w, h)
			else
				g_pAutoPathMgr:AStarSetCanWalk(true, w, h)
			end

            pos = pos+1
			if(math.floor(pos/8) ~= 0) then
				block = l_stream:ReadByte()
				pos=pos%8
			end
		end
	end

	local shelterLen = l_stream:GetSize() - (tileHeight * tileWidth/8 + 5)
	for i=1, shelterLen, 2 do
		local pt = cc.p(0,0)
		pt.x = l_stream:ReadByte()
		pt.y = l_stream:ReadByte()
		self:AddOpacity(pt)
	end

	return self.mapConfigData
end

function MapMgr:getMapJumpPosData()
	return self.mapJumpPosData
end

function MapMgr:checkJumpMap(curPos)
	for k, jumpData in pairs(self.mapJumpPosData) do
		if jumpData.pos then
			local stepLen = g_pMapMgr:CalcDistance(jumpData.pos, curPos)
			if stepLen < 50 then
				return jumpData
			end
		end
	end
	return nil
end

function MapMgr:AddOpacity(pt)
	if self._VecOpacity == nil then
		self._VecOpacity = {}
		local totalCount = self.mapConfigData.wTitleCount * self.mapConfigData.hTitleCount
		for i=1, totalCount do
			self._VecOpacity[i] = 0
		end
	end
	self._VecOpacity[math.floor(pt.y)*self.mapConfigData.wTitleCount + math.floor(pt.x) + 1] = 1
end

function MapMgr:IsOpacity(pos)
	if (not self._VecOpacity or #self._VecOpacity == 0) then
		return false
	end
	if(pos.y < 0 or pos.y > self._MaxTileHeight) then
		return false
	end
	if(pos.x < 0 or pos.x > self._MaxTileWidth) then
		return false
	end
	return self._VecOpacity[math.floor(pos.y)*self.mapConfigData.wTitleCount + math.floor(pos.x) + 1] == 1
end

function MapMgr:getMapConfigData()
	return self.mapConfigData
end

function MapMgr:getMapConfigHeight()
	return self.mapConfigData.height
end

--判断人物移动方向
function MapMgr:CalcMoveDirection(srcPos, destPos)
	--G_Log_Info("MapMgr:CalcMoveDirection()")
	local dirx = (destPos.x - srcPos.x) / 32
	local diry = (destPos.y - srcPos.y) / 32
	if dirx < 0 then 
		dirx = math.floor(dirx) 
	else
		dirx = math.ceil(dirx) 
	end
	if diry < 0 then 
		diry = math.floor(diry) 
	else
		diry = math.ceil(diry) 
	end

	local dir = cc.p(dirx, diry)
	if(dir.x > 1) then dir.x = 1 end
	if(dir.x < -1) then dir.x = -1 end
	if(dir.y > 1) then dir.y = 1 end
	if(dir.y < -1) then dir.y = -1 end

	if(dir.x == 0  and  dir.y == 0) then
        dir.x = destPos.x == srcPos.x and 0 or ((destPos.x - srcPos.x) < 0 and -1 or 1)
        dir.y = destPos.y == srcPos.y and 0 or ((destPos.y - srcPos.y) < 0 and -1 or 1)
	end

	local dirIdx = -1   --表示站立
	local ARY_HMS_DIR = {cc.p(1,-1),cc.p(0,-1),cc.p(-1,-1),cc.p(-1,0),cc.p(-1,1),cc.p(0,1),cc.p(1,1),cc.p(1,0)}
	for i=1, 8 do
		if(math.floor(dir.x) == math.floor(ARY_HMS_DIR[i].x) and math.floor(dir.y) == math.floor(ARY_HMS_DIR[i].y) ) then
            dirIdx = i -1
            break
		end
	end

    return dir, dirIdx
end

function MapMgr:CalcDistance(nowPos, dirPos)
	return math.sqrt((nowPos.x-dirPos.x)*(nowPos.x-dirPos.x) + (nowPos.y-dirPos.y)*(nowPos.y-dirPos.y))
end

--两个城池之间路径规划（包括跨地图转移）,srcCityId缺失为当前点位置
function MapMgr:getMovePathCityByCity(tarCityId, srcCityId)
	--G_Log_Info("MapMgr:getMovePathCityByCity(), tarCityId = %s",tarCityId)
	local srcMapData = self.mapConfigData
	local curCityVec = srcMapData.cityIdStrVec
	local srcMapId = self.mapConfigData.id --当前地图ID

	if srcCityId then
		local bSrcCurMap = false   --开始城池是否在当前地图
		for k, cityId in pairs(curCityVec) do
			if cityId == srcCityId then
				bSrcCurMap = true
				break;
			end
		end
		if bSrcCurMap == false then   --开始城池不在当前地图
			return
		end
	end

	local movePathVec = {}   --{["mapId"], ["movePos"]}

	local btarCurMap = false   --目标城池是否在当前地图
	for k, cityId in pairs(curCityVec) do
		if cityId == tarCityId then
			btarCurMap = true
			break;
		end
	end

	local tarCityData = g_pTBLMgr:getCityConfigTBLDataById(tarCityId)
	if tarCityData then
		if btarCurMap == false then   --目标城池不在当前地图
			--G_Log_Info("目标城池不在当前地图")
			local tarMapId = tarCityData.mapId
			--从配置表中读取多地图跳转的地图关系
			local nearMapVec = nil
			for k, vec in pairs(srcMapData.nearMapVec) do
				local lastIdx = #vec
				if vec[lastIdx] == tarMapId then
					nearMapVec = vec
					break;
				end
			end

			local srcPos = self.curRolePos  --当前人物所在位置（像素点）
			local lastjumpPos = nil
			for k, mapId in pairs(nearMapVec) do
				if k == #nearMapVec then
					local tarMapData = g_pTBLMgr:getMapConfigTBLDataById(mapId)
					if tarMapData then
						--相邻地图地图到目的点
						table.insert(movePathVec, {["mapId"] = mapId, ["movePos"] = cc.p(tarCityData.map_pt.x, tarMapData.height - tarCityData.map_pt.y)})
					end
				else
					if lastjumpPos then
						srcPos = lastjumpPos
					end
					local nextMapId = nearMapVec[k+1]
					local minJumpPos = self:getNearMapJumpPos(nextMapId, mapId, srcPos)
					if minJumpPos then
						lastjumpPos = minJumpPos
						table.insert(movePathVec, {["mapId"] = mapId, ["movePos"] = minJumpPos})
					end
				end

			end
		else    --目标城池在当前地图
			table.insert(movePathVec, {["mapId"] = srcMapId, ["movePos"] = cc.p(curCityVec.map_pt.x, curCityVec.height - curCityVec.map_pt.y)})
		end
	end

	return movePathVec
end

--获得到达相邻地图的最近跳转点,srcMapId缺失为当前地图
function MapMgr:getNearMapJumpPos(nearMapId, srcMapId, srcPos)
	--G_Log_Info("MapMgr:getNearMapJumpPos(), nearMapId = %d, srcMapId = %d", nearMapId, srcMapId)
	local srcMapData = self.mapConfigData
	if srcMapId ~= self.mapConfigData.id then  --非当前地图
		srcMapData = g_pTBLMgr:getMapConfigTBLDataById(srcMapId)
	end
	if not srcMapData then
		return 
	end
	if not srcPos then
		local firstCityId = srcMapData.near_citys[1]
		local cityData = g_pTBLMgr:getCityConfigTBLDataById(firstCityId)
	    if cityData then
		    srcPos = cc.p(cityData.map_pt.x, srcMapData.height - cityData.map_pt.y)  --转换为像素点,以左上角为00原点
		end
	end
	if not srcPos then
		return
	end

	if srcMapData then
		local jumpVec = srcMapData.jumpptIdStrVec
		local minLen = 0
		local minJumpPos = nil
		for k, jumpIdStr in pairs(jumpVec) do
			local jumpData = g_pTBLMgr:getMapJumpPtConfigTBLDataById(jumpIdStr)
			if jumpData then
				local dirPos = nil
				if (jumpData.map_id1 == srcMapId and jumpData.map_id2 == nearMapId) then
					dirPos = cc.p(jumpData.map_pt1.x, srcMapData.height - jumpData.map_pt1.y)  --转换为像素点,以左上角为00原点
				elseif(jumpData.map_id1 == nearMapId and jumpData.map_id2 == srcMapId) then
					dirPos = cc.p(jumpData.map_pt2.x, srcMapData.height - jumpData.map_pt2.y)  --转换为像素点,以左上角为00原点
				end

				if dirPos then
					local len = g_pMapMgr:CalcDistance(srcPos, dirPos) 
					if not minJumpPos or minLen > len then
						minLen = len
						minJumpPos = dirPos
					end
				end
			end
		end
		return minJumpPos
	end
	return nil
end

return MapMgr
