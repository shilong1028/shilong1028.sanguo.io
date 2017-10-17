
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
	self.vipConfigVec = nil    --vip

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
		campConfig.money = stream:ReadUInt()     --初始财力（单位锭，1锭=100贯）
		campConfig.food = stream:ReadUInt()     --初始粮草（单位石，1石=100斤）
		campConfig.drug = stream:ReadUInt()     --初始药材（单位副，1副=100份）
		campConfig.generalIdVec = {}
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
		generalConfig.bingTypeVec = {}  --轻装|重装|精锐|羽林品质的骑兵|枪戟兵|刀剑兵|弓弩兵等共16种
		local bingzhong = stream:ReadString() 
		if bingzhong ~= "0" then
			generalConfig.bingTypeVec = string.split(bingzhong,";")
		end
		generalConfig.hp = stream:ReadUInt()    --初始血量值
		generalConfig.mp = stream:ReadUInt()        --初始智力值
		generalConfig.atk = stream:ReadUInt()     --初始攻击力
		generalConfig.def = stream:ReadUInt()     --初始防御力
		generalConfig.skillVec = {}
		local skillsStr = stream:ReadString()    --初始技能，技能ID字符串以;分割
		local skillVec = string.split(skillsStr,";")
		if skillVec[1] ~= "0" then
			for i=1, #skillVec do
				local vec = string.split(skillVec[i],"-")
				table.insert(generalConfig.skillVec, {["skillId"]=vec[2], ["lv"]=vec[1]})
			end
		end
		generalConfig.equipVec = {}
		local equipsStr = stream:ReadString()    --初始装备，装备ID字符串以;分割
		local equipVec = string.split(equipsStr,";")
		if equipVec[1] ~= "0" then
			for i=1, #equipVec do
				local vec = string.split(equipVec[i],"-")
				table.insert(generalConfig.equipVec, {["equipId"]=vec[2], ["lv"]=vec[1]})
			end
		end
		generalConfig.desc = stream:ReadString()    --描述

		generalConfig.armyUnitVec = {}    --g_tbl_armyUnitConfig:new()   --武将部曲数据
		for i=1, #generalConfig.bingTypeVec do
			local armyUnit = g_tbl_armyUnitConfig:new()
			armyUnit.bingIdStr = generalConfig.bingTypeVec[i]   --部曲兵种（游击|轻装|重装|精锐|禁军的弓刀枪骑兵）
			table.insert(generalConfig.armyUnitVec, armyUnit)
		end

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
		itemConfig.type = stream:ReadWord()     --物品类型
		itemConfig.quality = stream:ReadUInt()      --技能或装备等物品的品质
		itemConfig.skill = stream:ReadString()     --物品关联的技能ID字符串
		itemConfig.hp = stream:ReadUInt()     --装备增加的血量值
		itemConfig.mp = stream:ReadUInt()         --装备增加的智力值
		itemConfig.atk = stream:ReadUInt()      --装备增加的攻击力
		itemConfig.def = stream:ReadUInt()      --装备增加的防御力
		itemConfig.troops = stream:ReadUInt()         --附加兵力数量
		itemConfig.arm_type = stream:ReadUInt()      --开启兵种属性（刀枪弓骑）
		itemConfig.other = stream:ReadUInt()      --备用字段，用于使用某物品开启某种特性（如官职，技能，兵种等）
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
		talkConfig.id_str = stream:ReadString()        --对白ID字符串
		talkConfig.bg = stream:ReadString()    --对白背景图片
		talkConfig.headVec = {}
		local headStr = stream:ReadString()   --对白相关人物头像id_str，以;分割
		talkConfig.headVec = string.split(headStr,";")
		talkConfig.desc = stream:ReadString()    --对白内容

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
		storyConfig.vedio = stream:ReadString()   --主线剧情视频文件，"0"标识无
		if not storyConfig.vedio or storyConfig.vedio == "0" then
			storyConfig.vedio = ""
		end
		storyConfig.enemyIdVec = {}
		local enemyStr = stream:ReadString()    --敌方出战将领ID字符串，以;分割
		storyConfig.enemyIdVec = string.split(enemyStr,";")
		if storyConfig.enemyIdVec[1] == "0" then
			storyConfig.enemyIdVec = {}
		end
		storyConfig.rewardIdVec = {}
		local rewardStr = stream:ReadString()    --奖励物品，以;分割。物品ID字符串和数量用-分割
		local rewardIdVec = string.split(rewardStr,";")
		if rewardIdVec[1] ~= "0" then
			for k, d in pairs(rewardIdVec) do
				local strVec = string.split(d,"-")
				table.insert(storyConfig.rewardIdVec, {["itemId"] = strVec[1], ["num"] = strVec[2]})
			end
		end
		storyConfig.soldierVec = {}
		local soldierStr = stream:ReadString()   --奖励士兵，以;分割。物品ID字符串和数量用-分割  
		local soldierVec = string.split(soldierStr,";")
		if soldierStr[1] ~= "0" then
			for k, d in pairs(soldierVec) do
				local strVec = string.split(d,"-")
				table.insert(storyConfig.soldierVec, {["itemId"] = strVec[1], ["num"] = strVec[2]})
			end
		end
		storyConfig.offical = stream:ReadString()   --奖励官职id_str
		storyConfig.generalVec = {}   --奖励武将Id_str, 以;分割
		local generalStr = stream:ReadString()   
		storyConfig.generalVec = string.split(generalStr,";")
		if storyConfig.generalVec[1] == "0" then
			storyConfig.generalVec = {}
		end

		storyConfig.talkVec = {}
		local talkStr = stream:ReadString()    --对话内容，以;分割。人物ID字符串和文本用-分割，两个人物用|分割
		local talkVec = string.split(talkStr,";")
		for k, textIdStr in pairs(talkVec) do
			local textData = g_pTBLMgr:getTalkConfigTBLDataById(textIdStr)
			if textData then
				table.insert(storyConfig.talkVec, textData)
			end
		end
		storyConfig.desc = stream:ReadString()   --剧情简要描述，用于奖励或战斗界面展示

		storyConfig.bPlayedTalk = 0   ---是否已经播放过对话，0未，1已播放（则不再播放）

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

--Vip结构类
function TBLMgr:LoadVipConfigTBL()
	--G_Log_Info("TBLMgr:LoadVipConfigTBL()")
	if self.vipConfigVec ~= nil then
		return
	end

	local stream = ark_Stream:new()
	local p = stream:CreateReadStreamFromSelf("tbl/vipConfig_client.tbl")
	if(p == nil) then
		return
	end

	self.vipConfigVec = {}
	local Count = stream:ReadWord()
	for k=1, Count do
		local vipConfig = g_tbl_vipConfig:new()
		vipConfig.id = stream:ReadWord()        --vip等级ID
		vipConfig.name = stream:ReadString()    --vip名称
		vipConfig.gold = stream:ReadUInt()   --充值总额（1银锭=1人民币）
		vipConfig.rewardsVec = {}   --直接奖励物品，用;分割
		local rewardStr = stream:ReadString()
		local rewardIdVec = string.split(rewardStr,";")
		if rewardIdVec[1] ~= "0" then
			for k, d in pairs(rewardIdVec) do
				local strVec = string.split(d,"-")
				table.insert(vipConfig.rewardsVec, {["itemId"] = strVec[1], ["num"] = strVec[2]})
			end
		end
		vipConfig.money_per = stream:ReadUInt()/10000    --每天金币产出增加率（%,取万分值）
		vipConfig.food_per = stream:ReadUInt()/10000    --每天粮草产出增加率（%,取万分值）
		vipConfig.time_per = stream:ReadUInt()/10000    --建筑升级时间缩减率（%,取万分值）
		vipConfig.desc = ""
		local desc = stream:ReadString()    --
		local descVec = string.split(desc,"-")
		for k, str in pairs(descVec) do
			if k < #descVec then
				vipConfig.desc = vipConfig.desc..str.."\n"
			else
				vipConfig.desc = vipConfig.desc..str
			end
		end

		table.insert(self.vipConfigVec, vipConfig)
	end
end

function TBLMgr:getVipConfigMaxCount()
	if self.vipConfigVec == nil then
		self:LoadVipConfigTBL()
	end
	return #self.vipConfigVec -1
end

function TBLMgr:getVipConfigById(vipId)
	--G_Log_Info("TBLMgr:getVipConfigById(), vipId = %d", vipId)
	if self.vipConfigVec == nil then
		self:LoadVipConfigTBL()
	end

	if self.vipConfigVec then
		for i=1, #self.vipConfigVec do
			if self.vipConfigVec[i].id == vipId then
				return clone(self.vipConfigVec[i])
			end
		end
	end
	return nil
end

function TBLMgr:getVipIdByGlod(vipGlod)
	if self.vipConfigVec == nil then
		self:LoadVipConfigTBL()
	end

	for i=1, #self.vipConfigVec do
		if i >= #self.vipConfigVec then
			return clone(self.vipConfigVec[i].id)
		end
		if self.vipConfigVec[i+1].gold > vipGlod and self.vipConfigVec[i].gold <= vipGlod then
			return clone(self.vipConfigVec[i].id)
		end
	end
	return 0
end

--官职结构类
function TBLMgr:LoadOfficalConfigTBL()
	--G_Log_Info("TBLMgr:LoadOfficalConfigTBL()")
	if self.officalConfigVec ~= nil then
		return
	end

	local stream = ark_Stream:new()
	local p = stream:CreateReadStreamFromSelf("tbl/officalConfig_client.tbl")
	if(p == nil) then
		return
	end

	self.officalConfigVec = {}
	local Count = stream:ReadWord()
	for k=1, Count do
		local officalConfig = g_tbl_officalConfig:new()
		officalConfig.id_str = stream:ReadString()    --官职ID字符串
		officalConfig.name = stream:ReadString()     --名称
		officalConfig.type = stream:ReadWord()    --官职类型，0通用，1主角，2武将，3军师
		officalConfig.quality = stream:ReadWord()    --品质,0五品以下，1五品，2四品，3三品，4二品，5一品，6王侯，7皇帝
		officalConfig.hp = stream:ReadUInt()    --附加血量值
		officalConfig.mp = stream:ReadUInt()        --附加智力值
		officalConfig.troops = stream:ReadUInt()    --附加带兵数
		
		officalConfig.subs = {}     --下属官职id_str集合,-表示连续区间，;表示间隔区间
		local subStr = stream:ReadString()
		local subsVec = string.split(subStr,";")
		if subsVec[1] ~= "0" then
			for k, str in pairs(subsVec) do
				local idVec = string.split(str,"-")
				local beginId = tonumber(idVec[1])
				local endId = tonumber(idVec[2])
				for id = beginId, endId do
					table.insert(officalConfig.subs, tostring(id))
				end
			end
		end

		officalConfig.desc = stream:ReadString()    --官职介绍

		self.officalConfigVec[""..officalConfig.id_str] = officalConfig
	end
end

function TBLMgr:getOfficalConfigById(id_str)
	--G_Log_Info("TBLMgr:getOfficalConfigById(), id_str = %d", id_str)
	if self.officalConfigVec == nil then
		self:LoadOfficalConfigTBL()
	end
	return clone(self.officalConfigVec[""..id_str])
end

--技能结构类
function TBLMgr:LoadSkillConfigTBL()
	--G_Log_Info("TBLMgr:LoadSkillConfigTBL()")
	if self.skillConfigVec ~= nil then
		return
	end

	local stream = ark_Stream:new()
	local p = stream:CreateReadStreamFromSelf("tbl/skillConfig_client.tbl")
	if(p == nil) then
		return
	end

	self.skillConfigVec = {}
	local Count = stream:ReadWord()
	for k=1, Count do
		local skillConfig = g_tbl_skillConfig:new()
		skillConfig.id_str = stream:ReadString()    --技能ID字符串(9xxy，9为开始标志，xx为技能编号，y为升级编号）
		skillConfig.name = stream:ReadString()    --名称
		skillConfig.type = stream:ReadWord()   --1对己方，2对敌方。对己方加成，对敌方减少
		skillConfig.cooldown = stream:ReadUInt()    --冷却时间(单位毫秒）
		skillConfig.duration = stream:ReadUInt()    --持续时间
		skillConfig.hp = stream:ReadUInt()     --附加血量值
		skillConfig.mp = stream:ReadUInt()    --附加智力值
		skillConfig.atk = stream:ReadUInt()     --附加攻击力
		skillConfig.def = stream:ReadUInt()     --附加防御力
		skillConfig.speed = stream:ReadUInt()    --提升攻击速度
		skillConfig.baoji = stream:ReadUInt()     --提升暴击值（只有对己方有用）
		skillConfig.shanbi = stream:ReadUInt()     --提升闪避值（只有对己方有用）
		skillConfig.shiqi = stream:ReadUInt()     --对士气影响，对己方加成，对敌方减少
		skillConfig.desc = stream:ReadString()    --技能介绍

		self.skillConfigVec[""..skillConfig.id_str] = skillConfig
	end
end

function TBLMgr:getSkillConfigById(id_str)
	--G_Log_Info("TBLMgr:getSkillConfigById(), id_str = %d", id_str)
	if self.skillConfigVec == nil then
		self:LoadSkillConfigTBL()
	end
	return clone(self.skillConfigVec[""..id_str])
end


return TBLMgr
