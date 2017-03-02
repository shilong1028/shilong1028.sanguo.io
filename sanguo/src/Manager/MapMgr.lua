
--MapMgr用于地图数据管理， 地图map中的格子是以左上角为0,0

local MapMgr = class("MapMgr")

function MapMgr:ctor()
	--G_Log_Info("MapMgr:ctor()")
    self:init()
end

function MapMgr:init()
	--G_Log_Info("MapMgr:init()")
	self.instance = nil

	self.mapConfigData = nil  --地图表配置数据
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

    --读取寻路点配置信息
	local l_stream = ark_Stream:new()
	local mapPath = string.format("Map/%s.map", self.mapConfigData.path)
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

function MapMgr:AddOpacity(pt)
	if self._VecOpacity == nil then
		self._VecOpacity = {}
		local totalCount = self.mapConfigData.wTitleCount * self.mapConfigData.hTitleCount
		for i=1, totalCount do
			self._VecOpacity[i] = 0
		end
	end
	self._VecOpacity[math.floor(pt.y)*self._MaxTileWidth + math.floor(pt.x) + 1] = 1
end

function MapMgr:getMapConfigData()
	return self.mapConfigData
end






return MapMgr
