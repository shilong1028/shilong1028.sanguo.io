
--HeroDataMgr用于存储玩家游戏信息

local HeroDataMgr = class("HeroDataMgr")

function HeroDataMgr:ctor()
	--G_Log_Info("HeroDataMgr:ctor()")
    self:init()
end

function HeroDataMgr:init()
	--G_Log_Info("HeroDataMgr:init()")
	self.heroData = {}
    self.heroData.storyData = {}  --剧情任务数据
    self.heroData.mapPosData = {}  --玩家地图位置信息
	self.heroData.campData = g_tbl_campConfig:new()  --玩家阵营信息
    self.heroData.vipData = {}   --vip信息

	local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
	if heroXML then
        --剧情任务数据(主线ID) 
        self.heroData.storyData.mainStoryId = tonumber(heroXML:getNodeAttrValue("storyData", "mainStoryId")) 
        --vip数据
        self.heroData.vipData.vipId = tonumber(heroXML:getNodeAttrValue("vipData", "vipId")) or 0
        self.heroData.vipData.vipgold = tonumber(heroXML:getNodeAttrValue("vipData", "vipgold")) or 0
        --玩家地图位置信息
        self.heroData.mapPosData.mapId = tonumber(heroXML:getNodeAttrValue("mapPosData", "mapId")) 
        if self.heroData.mapPosData.mapId then
            local posX = tonumber(heroXML:getNodeAttrValue("mapPosData", "posX")) 
            local posY = tonumber(heroXML:getNodeAttrValue("mapPosData", "posY")) 
            self.heroData.mapPosData.rolePos = cc.p(posX, posY)
        end

		--阵营信息
		self.heroData.campData.campId = tonumber(heroXML:getNodeAttrValue("campData", "campId"))     --阵营ID
		if not self.heroData.campData.campId then
			self.heroData.campData.campId = 0
			return
		end
		self.heroData.campData.name = heroXML:getNodeAttrValue("campData", "name")     --阵营名称
		self.heroData.campData.captain = heroXML:getNodeAttrValue("campData", "captain")     --首领ID字符串
		self.heroData.campData.capital = heroXML:getNodeAttrValue("campData", "capital")   --首都城池ID字符串
		self.heroData.campData.population = tonumber(heroXML:getNodeAttrValue("campData", "population")) * 10000    --初始百姓人口（单位万）
		self.heroData.campData.troops = tonumber(heroXML:getNodeAttrValue("campData", "troops"))        --初始兵力（人）
		self.heroData.campData.money = tonumber(heroXML:getNodeAttrValue("campData", "money"))     --初始财力（单位锭，1锭=1000贯）
		self.heroData.campData.food = tonumber(heroXML:getNodeAttrValue("campData", "food"))     --初始粮草（单位石，1石=1000斤）
		self.heroData.campData.general = heroXML:getNodeAttrValue("campData", "general")    --初始将领ID字符串，以;分割
		--self.heroData.campData.desc = ""    --阵营描述不用存储
	end
	--G_Log_Dump(self.heroData.campData, "campData = ")
end

function HeroDataMgr:GetInstance()
	--G_Log_Info("HeroDataMgr:GetInstance()")
    if self.instance == nil then
        self.instance = HeroDataMgr:new()
    end
    return self.instance
end

------------------------------------------------------

--Vip数据  --begin
function HeroDataMgr:GetVipXmlData()
    return clone(self.heroData.vipData)
end

function HeroDataMgr:SetVipXmlData(vipId, vipgold)
    self.heroData.vipData.vipId = vipId   
    self.heroData.vipData.vipgold = vipgold

    local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if not heroXML then
        heroXML = g_UserDefaultMgr:createXMLFile("heroXML.xml", "root")
    end
    heroXML:removeNode("vipData")
    heroXML:addChildNode("vipData")
    heroXML:setNodeAttrValue("vipData", "vipId", tostring(vipId))
    heroXML:setNodeAttrValue("vipData", "vipgold", tostring(self.heroData.vipData.vipgold))
    heroXML:saveXMLFile()

    --vip监听事件
    local event = cc.EventCustom:new(g_EventListenerCustomName.MainMenu_vipEvent)
    event._usedata = string.format("%d", vipId)   
    g_EventDispatcher:dispatchEvent(event) 
end

--Vip数据处理  --end  ------------------------------------------------------

--剧情任务数据  --begin
function HeroDataMgr:GetStoryTalkId()
    return clone(self.heroData.storyData.mainStoryId)
end

function HeroDataMgr:SetStoryTalkId(storyId)
    self.heroData.storyData.mainStoryId = storyId   --剧情任务数据(主线ID) 

    local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if not heroXML then
        heroXML = g_UserDefaultMgr:createXMLFile("heroXML.xml", "root")
    end
    heroXML:removeNode("storyData")
    heroXML:addChildNode("storyData")
    heroXML:setNodeAttrValue("storyData", "mainStoryId", tostring(storyId))
    heroXML:saveXMLFile()
end

--剧情任务数据处理  --end  ------------------------------------------------------

--玩家地图位置信息处理   --beign
function HeroDataMgr:SetHeroMapPosData(mapId, rolePos)  --保存主角当前地图及位置坐标
    self.heroData.mapPosData = {} --玩家地图位置信息
    self.heroData.mapPosData.mapId = mapId
    self.heroData.mapPosData.rolePos = rolePos

    local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if not heroXML then
        heroXML = g_UserDefaultMgr:createXMLFile("heroXML.xml", "root")
    end
    heroXML:removeNode("mapPosData")
    heroXML:addChildNode("mapPosData")
    heroXML:setNodeAttrValue("mapPosData", "mapId", tostring(mapId))
    heroXML:setNodeAttrValue("mapPosData", "posX", string.format("%f", rolePos.x))
    heroXML:setNodeAttrValue("mapPosData", "posY", string.format("%f", rolePos.y))
    heroXML:saveXMLFile()
end

function HeroDataMgr:GetHeroMapPosData()
    return clone(self.heroData.mapPosData)
end

--玩家地图位置信息处理 ---end  ------------------------------------------------------

-----阵营信息处理  --begin
function HeroDataMgr:GetHeroCampData()
	return clone(self.heroData.campData)
end

function HeroDataMgr:SetHeroCampData(campData)   --保存主角阵营数据
	if not campData then
		G_Log_Error("HeroDataMgr:SetHeroCampData(), error: campData = nil")
	end
	self.heroData.campData = campData
	
    local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if not heroXML then
        heroXML = g_UserDefaultMgr:createXMLFile("heroXML.xml", "root")
    end
    heroXML:removeNode("campData")
    heroXML:addChildNode("campData")
    heroXML:setNodeAttrValue("campData", "campId", tostring(campData.campId))
    heroXML:setNodeAttrValue("campData", "name", tostring(campData.name))
    heroXML:setNodeAttrValue("campData", "captain", tostring(campData.captain))
    heroXML:setNodeAttrValue("campData", "capital", tostring(campData.capital))
    heroXML:setNodeAttrValue("campData", "population", tostring(campData.population))
    heroXML:setNodeAttrValue("campData", "troops", tostring(campData.troops))
    heroXML:setNodeAttrValue("campData", "money", tostring(campData.money))
    heroXML:setNodeAttrValue("campData", "food", tostring(campData.food))
    local generalIdVec = campData.generalIdVec
    local generalStr = ""
    for k, generalId in pairs(generalIdVec) do
    	generalStr = generalStr..generalId
    	if k ~= #generalIdVec then
        	generalStr = generalStr..";"
        end
    end
    heroXML:setNodeAttrValue("campData", "general", tostring(generalStr))
    heroXML:saveXMLFile()
end

function HeroDataMgr:SetHeroCampCapital(capital)
	local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    heroXML:setNodeAttrValue("campData", "capital", tostring(capital))
    heroXML:saveXMLFile()
end

function HeroDataMgr:SetHeroCampPopulation(population)
	local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    heroXML:setNodeAttrValue("campData", "population", tostring(population))
    heroXML:saveXMLFile()
end

function HeroDataMgr:SetHeroCampTroops(troops)
	local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    heroXML:setNodeAttrValue("campData", "troops", tostring(troops))
    heroXML:saveXMLFile()
end

function HeroDataMgr:SetHeroCampMoney(money)
	local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    heroXML:setNodeAttrValue("campData", "money", tostring(money))
    heroXML:saveXMLFile()
end

function HeroDataMgr:SetHeroCampFood(food)
	local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    heroXML:setNodeAttrValue("campData", "food", tostring(food))
    heroXML:saveXMLFile()
end

function HeroDataMgr:SetHeroCampGeneral(general)
	local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    heroXML:setNodeAttrValue("campData", "general", tostring(general))
    heroXML:saveXMLFile()
end

-----阵营信息处理  --end  ------------------------------------------------------


return HeroDataMgr