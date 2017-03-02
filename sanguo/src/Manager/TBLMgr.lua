
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
	self:LoadMapConfigTBL()
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
		local default_pt = stream:ReadString()  --string 跳转到此地图的默认点  每点以32*32为单位块
		local ptVec = string.split(default_pt,"-")
		mapConfig.default_pt = cc.p(tonumber(ptVec[1])*32 - 16, mapConfig.height - tonumber(ptVec[2])*32 + 16)   --转换为像素点
		mapConfig.jump_pt = {}
		local jump_pt = stream:ReadString()     --string 跳转到其他地图的传送点  每点以32*32为单位块
		local jumpVec = string.split(default_pt,";")
		for j=1, #jumpVec do
			ptVec = string.split(jumpVec[j],"-")
			table.insert(mapConfig.jump_pt, cc.p(tonumber(ptVec[1])*32 - 16, mapConfig.height - tonumber(ptVec[2])*32 + 16))   --转换为像素点
		end
		mapConfig.npc_id = {}
		local npc_id = stream:ReadString()      --string 本地图的NPC
		local idVec = string.split(npc_id,"-")
		for j=1, #idVec do
			table.insert(mapConfig.npc_id, tonumber(idVec[j]))
		end
		mapConfig.img_count = stream:ReadUInt()    --切成的小图数量
		mapConfig.row = stream:ReadUInt()    --切成的小图的行列数
		mapConfig.column = stream:ReadUInt()

		--游戏附加数据
		mapConfig.wTitleCount = math.floor(mapConfig.width / 32)   --32*32为单位块的横向数量
		mapConfig.hTitleCount = math.floor(mapConfig.height / 32)   --32*32为单位块的纵向数量

		table.insert(self.mapConfigVec, mapConfig)
	end
end

function TBLMgr:getMapConfigTBLDataById(mapId)
	--G_Log_Info("TBLMgr:getMapConfigTBLDataById(), mapId = %d", mapId)
	if self.mapConfigVec then
		for i=1, #self.mapConfigVec do
			if self.mapConfigVec[i].id == mapId then
				return self.mapConfigVec[i]
			end
		end
	end
	return nil
end


return TBLMgr
