
--TBLMgr用于管理本地tbl表格数据

local TBLMgr = class("TBLMgr")

function TBLMgr:ctor()
	--G_Log_Info("TBLMgr:ctor()")
    self:init()
end

function TBLMgr:init()
	--G_Log_Info("TBLMgr:init()")

	self.instance = nil

	self.mapConfigVec = nil
	self.cityConfigVec = nil
	self.mapJumpPtConfigVec = nil

end

function TBLMgr:GetInstance()
	--G_Log_Info("TBLMgr:GetInstance()")
    if self.instance == nil then
        self.instance = TBLMgr:new()
        self:LoadAllTBL()
    end
    return self.instance
end

function TBLMgr:LoadAllTBL()

end

--地图表结构类
function TBLMgr:LoadMapConfigTBL()
	--G_Log_Info("TBLMgr:LoadMapConfigTBL()")
	if self.mapConfigVec ~= nil then
		return
	end

	local stream = ark_Stream:new()
	local p = stream:CreateReadStreamFromSelf("tbl/mapConfig_client.tbl")
	if(p == nil) then
		return
	end

	self.mapConfigVec = {}
	local mapCount = stream:ReadWord()
	for k=1, mapCount do
		local mapConfig = g_tbl_mapConfig:new()
		mapConfig.id = stream:ReadWord()       --short 地图ID
		mapConfig.name = stream:ReadString()     --string 地图名称
		mapConfig.path = stream:ReadString()     --string 地图图片在res/Map文件夹中路径
		mapConfig.width = stream:ReadUInt()     --int 地图宽  像素点
		mapConfig.height = stream:ReadUInt()    --int 地图高
		mapConfig.img_count = stream:ReadUInt()    --切成的小图数量
		mapConfig.row = stream:ReadUInt()    --切成的小图的行列数
		mapConfig.column = stream:ReadUInt()

		mapConfig.cityIdStrVec = {}
		local citys = stream:ReadString()  --string 地图上所属郡城分布点
		mapConfig.cityIdStrVec = string.split(citys,";")

		mapConfig.jumpptIdStrVec = {}
		local jump_pt = stream:ReadString()     --string 跳转到其他地图的传送点  
		mapConfig.jumpptIdStrVec = string.split(jump_pt,";")

		--游戏附加数据
		mapConfig.wTitleCount = math.floor(mapConfig.width / 32)   --32*32为单位块的横向数量
		mapConfig.hTitleCount = math.floor(mapConfig.height / 32)   --32*32为单位块的纵向数量

		table.insert(self.mapConfigVec, mapConfig)
	end
end

function TBLMgr:getMapConfigTBLDataById(mapId)
	--G_Log_Info("TBLMgr:getMapConfigTBLDataById(), mapId = %d", mapId)
	if self.mapConfigVec == nil then
		self:LoadMapConfigTBL()
	end

	if self.mapConfigVec then
		for i=1, #self.mapConfigVec do
			if self.mapConfigVec[i].id == mapId then
				return self.mapConfigVec[i]
			end
		end
	end
	return nil
end

--城池表结构类
function TBLMgr:LoadCityConfigTBL()
	--G_Log_Info("TBLMgr:LoadCityConfigTBL()")
	if self.cityConfigVec ~= nil then
		return
	end

	local stream = ark_Stream:new()
	local p = stream:CreateReadStreamFromSelf("tbl/cityConfig_client.tbl")
	if(p == nil) then
		return
	end

	self.cityConfigVec = {}
	local Count = stream:ReadWord()
	for k=1, Count do
		local cityConfig = g_tbl_cityConfig:new()
		cityConfig.id_str = stream:ReadString()   --城池ID字符串
		cityConfig.name = stream:ReadString()     --城池名称
		cityConfig.type = stream:ReadUInt()     --城池类型1大城市，2郡城，3关隘渡口
		cityConfig.zhou_id = stream:ReadUInt()     --所属州
		cityConfig.map_row = stream:ReadUInt()    --城池在地图的行  32*32为单位块的横向数量
		cityConfig.map_col = stream:ReadUInt()    --城池在地图的列
		cityConfig.population = stream:ReadUInt()    --初始人口数量
		
		cityConfig.near_citys = {}
		local citys = stream:ReadString()   --周边相邻连接的城池
		cityConfig.near_citys = string.split(citys,";")

		cityConfig.desc = stream:ReadString()

		--游戏附加数据
		cityConfig.map_pt = cc.p(cityConfig.map_col*32 - 16, cityConfig.map_row*32 - 16)    --转换为像素点,以左上角为00原点

		self.cityConfigVec[""..cityConfig.id_str] = cityConfig
		--table.insert(self.cityConfigVec, cityConfig)
	end
end

function TBLMgr:getCityConfigTBLDataById(cityIdStr)
	--G_Log_Info("TBLMgr:getCityConfigTBLDataById(), cityIdStr = %s", cityIdStr)
	if self.cityConfigVec == nil then
		self:LoadCityConfigTBL()
	end

	return self.cityConfigVec[""..cityIdStr]
end

--地图跳转点表结构类
function TBLMgr:LoadMapJumpPtConfigTBL()
	--G_Log_Info("TBLMgr:LoadMapJumpPtConfigTBL()")
	if self.mapJumpPtConfigVec ~= nil then
		return
	end

	local stream = ark_Stream:new()
	local p = stream:CreateReadStreamFromSelf("tbl/mapJumpConfig_client.tbl")
	if(p == nil) then
		return
	end

	self.mapJumpPtConfigVec = {}
	local Count = stream:ReadWord()
	for k=1, Count do
		local mapJumpPtConfig = g_tbl_mapJumpPtConfig:new()
		mapJumpPtConfig.id_str = stream:ReadString()   --跳转点ID字符串
		mapJumpPtConfig.map_id1 = stream:ReadUInt()     --地图1ID 
		mapJumpPtConfig.map_row1 = stream:ReadUInt()     --跳转点在地图1的行  32*32为单位块的横向数量
		mapJumpPtConfig.map_col1 = stream:ReadUInt()    --跳转点在地图1的列
		mapJumpPtConfig.map_id2 = stream:ReadUInt()    
		mapJumpPtConfig.map_row2 = stream:ReadUInt()   
		mapJumpPtConfig.map_col2 = stream:ReadUInt()  
		mapJumpPtConfig.desc = stream:ReadString()

		--游戏附加数据
		mapJumpPtConfig.map_pt1 = cc.p(mapJumpPtConfig.map_col1*32 - 16, mapJumpPtConfig.map_row1*32 - 16)    --转换为像素点,以左上角为00原点
		mapJumpPtConfig.map_pt2 = cc.p(mapJumpPtConfig.map_col2*32 - 16, mapJumpPtConfig.map_row2*32 - 16)

		self.mapJumpPtConfigVec[""..mapJumpPtConfig.id_str] = mapJumpPtConfig
		--table.insert(self.mapJumpPtConfigVec, mapJumpPtConfig)
	end
end

function TBLMgr:getMapJumpPtConfigTBLDataById(IdStr)
	--G_Log_Info("TBLMgr:getMapJumpPtConfigTBLDataById(), IdStr = %s", IdStr)
	if self.mapJumpPtConfigVec == nil then
		self:LoadMapJumpPtConfigTBL()
	end

	return self.mapJumpPtConfigVec[""..IdStr]
end


return TBLMgr
