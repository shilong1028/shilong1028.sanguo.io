
--HeroDataMgr用于存储玩家游戏信息

local HeroDataMgr = class("HeroDataMgr")

function HeroDataMgr:ctor()
	--G_Log_Info("HeroDataMgr:ctor()")
    self:init()
end

function HeroDataMgr:init()
	--G_Log_Info("HeroDataMgr:init()")
	self.heroData = {}
	self.heroData.campData = g_tbl_campConfig:new()

	local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
	if heroXML then
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

--阵营信息处理
function HeroDataMgr:GetHeroCampData()
	return clone(self.heroData.campData)
end

function HeroDataMgr:SetHeroCampData(campData)
	if not campData then
		G_Log_Error("HeroDataMgr:SetHeroCampData(), error: campData = nil")
	end
    local heroXML = g_UserDefaultMgr:createXMLFile("heroXML.xml", "root")
    heroXML:addChildNode("campData")
    heroXML:setNodeAttrValue("campData", "campId", tostring(campData.campId))
    heroXML:setNodeAttrValue("campData", "name", tostring(campData.name))
    heroXML:setNodeAttrValue("campData", "captain", tostring(campData.captain))
    heroXML:setNodeAttrValue("campData", "capital", tostring(campData.capital))
    heroXML:setNodeAttrValue("campData", "population", tostring(campData.population))
    heroXML:setNodeAttrValue("campData", "troops", tostring(campData.troops))
    heroXML:setNodeAttrValue("campData", "money", tostring(campData.money))
    heroXML:setNodeAttrValue("campData", "food", tostring(campData.food))
    heroXML:setNodeAttrValue("campData", "general", tostring(campData.general))
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




return HeroDataMgr