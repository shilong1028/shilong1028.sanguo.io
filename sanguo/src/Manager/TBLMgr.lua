
--TBLMgr用于管理本地tbl表格数据

local TBLMgr = class("TBLMgr")

function TBLMgr:ctor()
	--G_Log_Info("TBLMgr:ctor()")
    self:init()
end

function TBLMgr:init()
	--G_Log_Info("TBLMgr:init()")

	self.instance = nil

	self.mapConfigVec = nil   --地图表结构类
	self.cityConfigVec = nil   --城池表结构类
	self.mapJumpPtConfigVec = nil   --地图跳转点表结构类
	self.zhouConfigVec = nil   --州数据表
	self.campConfigVec = nil   --阵营表结构类
	self.generalConfigVec = nil  --武将表
	self.itemConfigVec = nil  --物品装备表
	self.talkConfigVec = nil  --对话文本表
	self.storyConfigVec = nil  --剧情表

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

		mapConfig.nearMapVec = {}    --相邻地图ID集合
		local nearMaps = stream:ReadString()
		local nearMapVec = string.split(nearMaps,";")
		for k, vecStr in pairs(nearMapVec) do
			local nearStrVec = string.split(vecStr,"-")
			local nearVec = {}
			for i, idx in pairs(nearStrVec) do
				table.insert(nearVec, tonumber(idx))
			end
			table.insert(mapConfig.nearMapVec, nearVec)
		end

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
				return clone(self.mapConfigVec[i])
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
		cityConfig.mapId = stream:ReadUInt()    --所在地图ID
		cityConfig.map_row = stream:ReadUInt()    --城池在地图的行  32*32为单位块的横向数量
		cityConfig.map_col = stream:ReadUInt()    --城池在地图的列
		cityConfig.population = stream:ReadUInt()    --初始人口数量
		
		cityConfig.near_citys = {}
		local citys = stream:ReadString()   --周边相邻连接的城池
		cityConfig.near_citys = string.split(citys,";")

		cityConfig.desc = stream:ReadString()

		--游戏附加数据
		cityConfig.map_pt = cc.p(cityConfig.map_col*32 - 16, cityConfig.map_row*32 - 16)    --以左上角为00原点的地图坐标

		self.cityConfigVec[""..cityConfig.id_str] = cityConfig
		--table.insert(self.cityConfigVec, cityConfig)
	end
end

function TBLMgr:getCityConfigTBLDataById(cityIdStr)
	--G_Log_Info("TBLMgr:getCityConfigTBLDataById(), cityIdStr = %s", cityIdStr)
	if self.cityConfigVec == nil then
		self:LoadCityConfigTBL()
	end

	return clone(self.cityConfigVec[""..cityIdStr])
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
		mapJumpPtConfig.map_pt1 = cc.p(mapJumpPtConfig.map_col1*32 - 16, mapJumpPtConfig.map_row1*32 - 16)    --以左上角为00原点的地图坐标
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

	return clone(self.mapJumpPtConfigVec[""..IdStr])
end

--州数据表
function TBLMgr:LoadZhouConfigTBL()
	--G_Log_Info("TBLMgr:LoadZhouConfigTBL()")
	if self.zhouConfigVec ~= nil then
		return
	end

	local stream = ark_Stream:new()
	local p = stream:CreateReadStreamFromSelf("tbl/zhouConfig_client.tbl")
	if(p == nil) then
		return
	end

	self.zhouConfigVec = {}
	local Count = stream:ReadWord()
	for k=1, Count do
		local zhouConfig = g_tbl_zhouConfig:new()
		zhouConfig.id = stream:ReadWord()         --short 州ID
		zhouConfig.name = stream:ReadString()     --string 地图名称
		zhouConfig.map_id = stream:ReadUInt()     --int 地图ID
		zhouConfig.capital = stream:ReadString()    --string 首府ID字符串
		zhouConfig.desc = stream:ReadString()    --string

		table.insert(self.zhouConfigVec, zhouConfig)
	end
end

function TBLMgr:getZhouConfigTBLDataById(zhouId)
	--G_Log_Info("TBLMgr:getZhouConfigTBLDataById(), zhouId = %d", zhouId)
	if self.zhouConfigVec == nil then
		self:LoadZhouConfigTBL()
	end

	if self.zhouConfigVec then
		for i=1, #self.zhouConfigVec do
			if self.zhouConfigVec[i].id == zhouId then
				return clone(self.zhouConfigVec[i])
			end
		end
	end
	return nil
end

--阵营表结构类
function TBLMgr:LoadCampConfigTBL()
	--G_Log_Info("TBLMgr:LoadCampConfigTBL()")
	if self.campConfigVec ~= nil then
		return
	end

	local stream = ark_Stream:new()
	local p = stream:CreateReadStreamFromSelf("tbl/campConfig_client.tbl")
	if(p == nil) then
		return
	end

	self.campConfigVec = {}
	local Count = stream:ReadWord()
	for k=1, Count do
		local campConfig = g_tbl_campConfig:new()
		campConfig.campId = stream:ReadWord()         --short 阵营ID
		campConfig.name = stream:ReadString()     --string 阵营名称
		campConfig.captain = stream:ReadString()     --int 首领ID字符串
		campConfig.capital = stream:ReadString()    --string 首都城池ID字符串
		campConfig.population = stream:ReadUInt()    --初始百姓人口（单位万）
		campConfig.troops = stream:ReadUInt()         --初始兵力（人）
		campConfig.money = stream:ReadUInt()     --初始财力（单位锭，1锭=1000贯）
		campConfig.food = stream:ReadUInt()     --初始粮草（单位石，1石=1000斤）
		local generalStr = stream:ReadString()    --初始将领ID字符串，以;分割
		campConfig.generalIdVec = string.split(generalStr,";")
		campConfig.desc = stream:ReadString()    --阵营描述

		table.insert(self.campConfigVec, campConfig)
	end
end

function TBLMgr:getCampConfigTBLDataById(campId)
	--G_Log_Info("TBLMgr:getCampConfigTBLDataById(), campId = %d", campId)
	if self.campConfigVec == nil then
		self:LoadCampConfigTBL()
	end

	if self.campConfigVec then
		for i=1, #self.campConfigVec do
			if self.campConfigVec[i].campId == campId then
				return clone(self.campConfigVec[i])
			end
		end
	end
	return nil
end

--武将表结构类
function TBLMgr:LoadGeneralConfigTBL()
	--G_Log_Info("TBLMgr:LoadGeneralConfigTBL()")
	if self.generalConfigVec ~= nil then
		return
	end

	local stream = ark_Stream:new()
	local p = stream:CreateReadStreamFromSelf("tbl/generalConfig_client.tbl")
	if(p == nil) then
		return
	end

	self.generalConfigVec = {}
	local Count = stream:ReadWord()
	for k=1, Count do
		local generalConfig = g_tbl_generalConfig:new()
		generalConfig.id_str =stream:ReadString()        --武将ID字符串
		generalConfig.name = stream:ReadString()     --武将名称
		generalConfig.level = stream:ReadUInt()      --武将初始登录等级
		generalConfig.type = stream:ReadWord()   --将领类型，1英雄，2武将，3军师
		local bingzhong = stream:ReadString() 
		generalConfig.bingzhong = string.split(bingzhong,";")
		generalConfig.hp = stream:ReadUInt()    --初始血量值
		generalConfig.mp = stream:ReadUInt()        --初始智力值
		generalConfig.atk = stream:ReadUInt()     --初始攻击力
		generalConfig.def = stream:ReadUInt()     --初始防御力
		local skillsStr = stream:ReadString()    --初始技能，技能ID字符串以;分割
		generalConfig.skillIdVec = string.split(skillsStr,";")
		local equipsStr = stream:ReadString()    --初始装备，装备ID字符串以;分割
		generalConfig.equipIdVec = string.split(equipsStr,";")
		generalConfig.desc = stream:ReadString()    --描述

		self.generalConfigVec[""..generalConfig.id_str] = generalConfig
		--table.insert(self.generalConfigVec, generalConfig)
	end
end

function TBLMgr:getGeneralConfigTBLDataById(generalId)
	--G_Log_Info("TBLMgr:getGeneralConfigTBLDataById(), generalId = %d", generalId)
	if self.generalConfigVec == nil then
		self:LoadGeneralConfigTBL()
	end

	return clone(self.generalConfigVec[""..generalId])
end

--物品装备表结构类
function TBLMgr:LoadItemConfigTBL()
	--G_Log_Info("TBLMgr:LoadItemConfigTBL()")
	if self.itemConfigVec ~= nil then
		return
	end

	local stream = ark_Stream:new()
	local p = stream:CreateReadStreamFromSelf("tbl/itemConfig_client.tbl")
	if(p == nil) then
		return
	end

	self.itemConfigVec = {}
	local Count = stream:ReadWord()
	for k=1, Count do
		local itemConfig = g_tbl_itemConfig:new()
		itemConfig.id_str = stream:ReadString()        --物品ID字符串
		itemConfig.name = stream:ReadString()     --物品名称
		itemConfig.type = stream:ReadWord()     --物品类型，1金币，2粮草，3技能丹，4装备，…
		itemConfig.money = stream:ReadUInt()     --物品增加的金币数量
		itemConfig.food = stream:ReadUInt()         --物品增加的粮草数量
		itemConfig.level = stream:ReadUInt()      --技能或装备等物品的等级
		itemConfig.skill = stream:ReadString()     --物品关联的技能ID字符串
		itemConfig.hp = stream:ReadUInt()     --装备增加的血量值
		itemConfig.mp = stream:ReadUInt()         --装备增加的智力值
		itemConfig.atk = stream:ReadUInt()      --装备增加的攻击力
		itemConfig.def = stream:ReadUInt()      --装备增加的防御力
		itemConfig.desc = stream:ReadString()    --描述

		self.itemConfigVec[""..itemConfig.id_str] = itemConfig
	end
end

function TBLMgr:getItemConfigTBLDataById(itemId)
	--G_Log_Info("TBLMgr:getItemConfigTBLDataById(), itemId = %d", itemId)
	if self.itemConfigVec == nil then
		self:LoadItemConfigTBL()
	end

	return clone(self.itemConfigVec[""..itemId])
end

--对话文本表结构类
function TBLMgr:LoadTalkConfigTBL()
	--G_Log_Info("TBLMgr:LoadTalkConfigTBL()")
	if self.talkConfigVec ~= nil then
		return
	end

	local stream = ark_Stream:new()
	local p = stream:CreateReadStreamFromSelf("tbl/talkConfig_client.tbl")
	if(p == nil) then
		return
	end

	self.talkConfigVec = {}
	local Count = stream:ReadWord()
	for k=1, Count do
		local talkConfig = g_tbl_talkConfig:new()
		talkConfig.id_str = stream:ReadString()        --ID字符串
		talkConfig.desc = stream:ReadString()    --描述

		self.talkConfigVec[""..talkConfig.id_str] = talkConfig
	end
end

function TBLMgr:getTalkConfigTBLDataById(talkId)
	--G_Log_Info("TBLMgr:getTalkConfigTBLDataById(), talkId = %d", talkId)
	if self.talkConfigVec == nil then
		self:LoadTalkConfigTBL()
	end

	return clone(self.talkConfigVec[""..talkId])
end

--剧情结构类
function TBLMgr:LoadStoryConfigTBL()
	--G_Log_Info("TBLMgr:LoadStoryConfigTBL()")
	if self.storyConfigVec ~= nil then
		return
	end

	local stream = ark_Stream:new()
	local p = nil
	local campId = g_HeroDataMgr:GetHeroCampData().campId     --g_UserDefaultMgr:GetRoleCampId()
    if campId and campId > 0 then
    	p = stream:CreateReadStreamFromSelf("tbl/storyConfig"..campId.."_client.tbl")
    end
	if(p == nil) then
		return
	end

	self.storyConfigVec = {}
	local Count = stream:ReadWord()
	for k=1, Count do
		local storyConfig = g_tbl_storyConfig:new()
		storyConfig.storyId = stream:ReadWord()        --剧情ID
		storyConfig.targetCity = stream:ReadString()    --目标城池ID字符串
		storyConfig.name = stream:ReadString()    --战役名称
		local enemyStr = stream:ReadString()    --敌方出战将领ID字符串，以;分割
		storyConfig.enemyIdVec = string.split(enemyStr,";")
		storyConfig.rewardIdVec = {}
		local rewardStr = stream:ReadString()    --奖励物品，以;分割。物品ID字符串和数量用-分割
		local rewardIdVec = string.split(rewardStr,";")
		for k, d in pairs(rewardIdVec) do
			local strVec = string.split(d,"-")
			table.insert(storyConfig.rewardIdVec, {["itemId"] = strVec[1], ["num"] = strVec[2]})
		end
		storyConfig.talkVec = {}
		local talkStr = stream:ReadString()    --对话内容，以;分割。人物ID字符串和文本用-分割
		local talkVec = string.split(talkStr,";")
		for k, d in pairs(talkVec) do
			local strVec = string.split(d,"-")
			local heroIdStr = strVec[1]
			local textIdStr = strVec[2]
			local textData = g_pTBLMgr:getTalkConfigTBLDataById(textIdStr)
			local textStr = textIdStr
			if textData then
				textStr = textData.desc
			end
			table.insert(storyConfig.talkVec, {["heroId"] = heroIdStr, ["text"] = textStr})
		end
		storyConfig.desc = stream:ReadString() 

		table.insert(self.storyConfigVec, storyConfig)
	end
end

function TBLMgr:getStoryConfigTBLDataById(storyId)
	--G_Log_Info("TBLMgr:getStoryConfigTBLDataById(), storyId = %d", storyId)
	if self.storyConfigVec == nil then
		self:LoadStoryConfigTBL()
	end

	if self.storyConfigVec then
		for i=1, #self.storyConfigVec do
			if self.storyConfigVec[i].storyId == storyId then
				return clone(self.storyConfigVec[i])
			end
		end
	end
	return nil
end


return TBLMgr
