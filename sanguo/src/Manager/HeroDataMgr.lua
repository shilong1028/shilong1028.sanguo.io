
--HeroDataMgr用于存储玩家游戏信息（保存于XML文件）

local HeroDataMgr = class("HeroDataMgr")

function HeroDataMgr:ctor()
	--G_Log_Info("HeroDataMgr:ctor()")
    self:init()
end

function HeroDataMgr:init()
	--G_Log_Info("HeroDataMgr:init()")
	self.heroData = {}

    --heroXMl数据
    self:initHeroXMLData()

    --generalXML数据，因为武将列表在camp中，因此该方法在initHeroXMLData()之后调用
    self:initGeneralXMLData()

    --bagXML数据
    self:initBagXMLData()
end

function HeroDataMgr:GetInstance()
	--G_Log_Info("HeroDataMgr:GetInstance()")
    if self.instance == nil then
        self.instance = HeroDataMgr:new()
    end
    return self.instance
end

--创角之后，构建玩家数据heroXML、generalXML、BagXML等
function HeroDataMgr:CreateAndInitHeroXMLData(campData)
    self:SetHeroCampData(campData)

    local generalId = campData.generalIdVec[1]
    local generalData = g_pTBLMgr:getGeneralConfigTBLDataById(generalId) 
    if generalData then
        self:SetSingleGeneralData(generalData)   --保存单个武将数据
    else
        G_Log_Error("generalData = nil, generalId = ", generalId or -1)
    end
end

function HeroDataMgr:ClearUserXML(strXmlPath)
    g_UserDefaultMgr:ClearUseXml(strXmlPath)   
end

function HeroDataMgr:ClearAllUserXML()
    self:ClearUserXML("heroXML.xml")
    self:ClearUserXML("generalXML.xml")
    self:ClearUserXML("bagXML.xml")

    self.heroData.storyData = {}  --剧情任务数据
    self.heroData.mapPosData = {}  --玩家地图位置信息
    self.heroData.campData = g_tbl_campConfig:new()  --玩家阵营信息
    self.heroData.vipData = {}   --vip信息
    self.heroData.generalVecData = {}   --武将数据
    self.heroData.bagVecData = {}   --武将数据

end

--heroXMl数据
function HeroDataMgr:initHeroXMLData()
    self.heroData.storyData = {}  --剧情任务数据
    self.heroData.mapPosData = {}  --玩家地图位置信息
    self.heroData.campData = g_tbl_campConfig:new()  --玩家阵营信息
    self.heroData.vipData = {}   --vip信息

    local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if heroXML then
        --剧情任务数据(主线ID) 
        self.heroData.storyData.mainStoryId = tonumber(heroXML:getNodeAttrValue("storyData", "mainStoryId")) 
        self.heroData.storyData.bPlayedTalk = tonumber(heroXML:getNodeAttrValue("storyData", "mainStoryMask"))   ---是否已经播放过对话，0未，1已播放（则不再播放）

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
        self.heroData.campData.generalIdVec = {}
        local generalStr = heroXML:getNodeAttrValue("campData", "general")    --初始将领ID字符串，以;分割
        if generalStr and generalStr ~= "" then
            self.heroData.campData.generalIdVec = string.split(generalStr,";")
        end
        --self.heroData.campData.desc = ""    --阵营描述不用存储
    end
    --G_Log_Dump(self.heroData.campData, "campData = ")
end

--generalXML数据，因为武将列表在camp中，因此该方法在initHeroXMLData()之后调用
function HeroDataMgr:initGeneralXMLData()
    self.heroData.generalVecData = {}   --武将数据

    local generalXML = g_UserDefaultMgr:loadXMLFile("generalXML.xml")
    if generalXML then
        local generalIdVec = self.heroData.campData.generalIdVec
        if generalIdVec == nil then
            return
        end
        for k, idStr in pairs(generalIdVec) do
            local generalIdStr = tostring(idStr)
            local generalData = g_tbl_generalConfig:new()
            local tblData = g_pTBLMgr:getGeneralConfigTBLDataById(generalIdStr)
            if tblData then
                generalData.id_str = generalIdStr        --武将ID字符串
                generalData.name = tblData.name     --武将名称         
                generalData.type = tblData.type   --将领类型，1英雄，2武将，3军师 

                generalData.hp = tblData.hp    --初始血量值
                generalData.mp = tblData.mp        --初始智力值
                generalData.atk = tblData.atk     --初始攻击力
                generalData.def = tblData.def     --初始防御力              
                generalData.desc = tblData.desc    --描述

                generalData.level = tonumber(generalXML:getNodeAttrValue(generalIdStr, "level"))     --武将初始登录等级

                --附加属性(xml保存)
                generalData.exp = tonumber(generalXML:getNodeAttrValue(generalIdStr, "exp"))   --战斗经验
                generalData.offical = tonumber(generalXML:getNodeAttrValue(generalIdStr, "offical"))   --官职ID字符串，官职可以提升武将血智攻防、额外带兵数（默认带1000兵）等属性
                generalData.zhongcheng = tonumber(generalXML:getNodeAttrValue(generalIdStr, "zhongcheng"))  --武将忠诚度
                generalData.bingTypeVec = {}    --轻装|重装|精锐|羽林品质的骑兵|枪戟兵|刀剑兵|弓弩兵等共16种
                local bingTypeStr = generalXML:getNodeAttrValue(generalIdStr, "bingTypeVec")  
                if bingTypeStr and bingTypeStr ~= "" then
                    generalData.bingTypeVec = string.split(bingTypeStr,";")  
                end

                generalData.skillVec = {}    --技能，技能ID字符串以;分割  {["skillId"]=vec[2], ["lv"]=vec[1]}
                local skillIdStr = generalXML:getNodeAttrValue(generalIdStr, "skillIdVec")  
                local skillIdVec = {}
                if skillIdStr and skillIdStr ~= "" then
                    skillIdVec = string.split(skillIdStr,";") 
                end 
                local skillLvStr = generalXML:getNodeAttrValue(generalIdStr, "skillLvVec")  
                local skillLvVec = {}
                if skillLvStr and skillLvStr ~= "" then
                    skillLvVec = string.split(skillLvStr,";")  
                end
                for i=1, #skillIdVec do
                    table.insert(generalData.skillVec, {["skillId"]=skillIdVec[i], ["lv"]=skillLvVec[i]})
                end

                generalData.equipVec = {}    --装备，装备ID字符串以;分割{["equipId"]=vec[2], ["lv"]=vec[1]}
                local equipIdStr = generalXML:getNodeAttrValue(generalIdStr, "equipIdVec")  
                local equipIdVec = {}
                if equipIdStr and equipIdStr ~= "" then
                    equipIdVec = string.split(equipIdStr,";")  
                end
                local equipLvStr = generalXML:getNodeAttrValue(generalIdStr, "equipLvVec")  
                local equipLvVec = {}
                if equipLvStr and equipLvStr ~= "" then
                    equipLvVec = string.split(equipLvStr,";")  
                end
                for i=1, #equipIdVec do
                    table.insert(generalData.equipVec, {["skillId"]=equipIdVec[i], ["lv"]=equipLvVec[i]})
                end

                generalData.armyUnit = g_tbl_armyUnitConfig:new()   --武将部曲数据
                local armyUnitNode = generalIdStr.."-armyUnit"
                generalData.armyUnit.bingIdStr = tonumber(generalXML:getNodeAttrValue(armyUnitNode, "bingIdStr"))
                generalData.armyUnit.bingCount = tonumber(generalXML:getNodeAttrValue(armyUnitNode, "bingCount"))
                generalData.armyUnit.exp = tonumber(generalXML:getNodeAttrValue(armyUnitNode, "exp"))
                generalData.armyUnit.shiqi = tonumber(generalXML:getNodeAttrValue(armyUnitNode, "shiqi"))
                generalData.armyUnit.zhenId = tonumber(generalXML:getNodeAttrValue(armyUnitNode, "zhenId"))

                table.insert(self.heroData.generalVecData, generalData)
            end
        end
    end
    --G_Log_Dump(self.heroData.generalVecData, "generalVecData = ")
end

--bagXML保存玩家背包物品数据
function HeroDataMgr:initBagXMLData()
    --G_Log_Info("HeroDataMgr:initBagXMLData()")
    self.heroData.bagVecData = {}   --武将数据

    local bagXML = g_UserDefaultMgr:loadXMLFile("bagXML.xml")
    if bagXML then
        local vecStr = bagXML:getNodeAttrValue("itemIdVecNode", "itemIdVec")
        if vecStr and vecStr ~= "" then
            local itemIdVec = string.split(vecStr,";") 
            for i=1, #itemIdVec do
                local itemIdStr = tostring(itemIdVec[i])
                local itemId = bagXML:getNodeAttrValue(itemIdStr, "itemId")
                local itemNum = tonumber(bagXML:getNodeAttrValue(itemIdStr, "num"))
                if itemNum > 0 then
                    local itemData = {["itemId"] = itemId, ["num"] = itemNum }
                    self.heroData.bagVecData[itemIdStr] = itemData
                end
            end
        end
    end
    --G_Log_Dump(self.heroData.bagVecData, "bagVecData = ")
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
function HeroDataMgr:SaveNextStoryTalkId(storyId)   --保存新的任务ID到XML文件
    g_GameDataMgr:SetImplementTaskData(nil)     --保存正在执行的任务剧情，用于检查是否到达了任务目的地
    g_HeroDataMgr:SetNextStoryTalkId(storyId)   --保存主线剧情任务ID
end

function HeroDataMgr:GetStoryTalkId()
    return clone(self.heroData.storyData.mainStoryId)
end

function HeroDataMgr:GetStoryTalkMask()
    return clone(self.heroData.storyData.bPlayedTalk)
end

function HeroDataMgr:SetStoryTalkMask(storyId)
    self.heroData.storyData.mainStoryId = storyId   --剧情任务数据(主线ID) 
    self.heroData.storyData.bPlayedTalk = 1   ---是否已经播放过对话，0未，1已播放（则不再播放）

    local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if not heroXML then
        heroXML = g_UserDefaultMgr:createXMLFile("heroXML.xml", "root")
    end
    heroXML:removeNode("storyData")
    heroXML:addChildNode("storyData")
    heroXML:setNodeAttrValue("storyData", "mainStoryId", tostring(storyId))
    heroXML:setNodeAttrValue("storyData", "mainStoryMask", tostring(1))   ---是否已经播放过对话，0未，1已播放（则不再播放）
    heroXML:saveXMLFile()
end

function HeroDataMgr:SetNextStoryTalkId(storyId)
    self.heroData.storyData.mainStoryId = storyId   --剧情任务数据(主线ID) 
    self.heroData.storyData.bPlayedTalk = 0   ---是否已经播放过对话，0未，1已播放（则不再播放）

    local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if not heroXML then
        heroXML = g_UserDefaultMgr:createXMLFile("heroXML.xml", "root")
    end
    heroXML:removeNode("storyData")
    heroXML:addChildNode("storyData")
    heroXML:setNodeAttrValue("storyData", "mainStoryId", tostring(storyId))
    heroXML:setNodeAttrValue("storyData", "mainStoryMask", tostring(0))   ---是否已经播放过对话，0未，1已播放（则不再播放）
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

--保存主角阵营数据
function HeroDataMgr:SetHeroCampData(campData)  
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
    heroXML:setNodeAttrValue("campData", "drug", tostring(campData.drug))
    local generalIdVec = campData.generalIdVec
    local generalStr = ""
    for k, generalId in pairs(generalIdVec) do
    	generalStr = generalStr..generalId..";"
    end
    generalStr = string.sub(generalStr , 1, -2)

    heroXML:setNodeAttrValue("campData", "general", tostring(generalStr))
    heroXML:saveXMLFile()
end

function HeroDataMgr:SetHeroCampCapital(capital)
    self.heroData.campData.capital = capital
	local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if heroXML then
        heroXML:setNodeAttrValue("campData", "capital", tostring(capital))
        heroXML:saveXMLFile()
    end
end

function HeroDataMgr:SetHeroCampPopulation(population)
    self.heroData.campData.population = population
	local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if heroXML then
        heroXML:setNodeAttrValue("campData", "population", tostring(population))
        heroXML:saveXMLFile()
    end
end

function HeroDataMgr:GetHeroCampTroops()
    return clone(self.heroData.campData.troops)
end

function HeroDataMgr:SetHeroCampTroops(troops)
    self.heroData.campData.troops = troops
	local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if heroXML then
        heroXML:setNodeAttrValue("campData", "troops", tostring(troops))
        heroXML:saveXMLFile()
    end
end

function HeroDataMgr:GetHeroCampMoney()
    return clone(self.heroData.campData.money)
end

function HeroDataMgr:SetHeroCampMoney(money)
    self.heroData.campData.money = money
	local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if heroXML then
        heroXML:setNodeAttrValue("campData", "money", tostring(money))
        heroXML:saveXMLFile()
    end
end

function HeroDataMgr:GetHeroCampFood()
    return clone(self.heroData.campData.food)
end

function HeroDataMgr:SetHeroCampFood(food)
    self.heroData.campData.food = food
	local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if heroXML then
        heroXML:setNodeAttrValue("campData", "food", tostring(food))
        heroXML:saveXMLFile()
    end
end

function HeroDataMgr:GetHeroCampDrug()
    return clone(self.heroData.campData.drug)
end

function HeroDataMgr:SetHeroCampDrug(drug)
    self.heroData.campData.drug = food
    local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if heroXML then
        heroXML:setNodeAttrValue("campData", "drug", tostring(drug))
        heroXML:saveXMLFile()
    end
end

function HeroDataMgr:SetHeroCampGeneral(generalIdVec)
    self.heroData.campData.generalIdVec = generalIdVec
    local generalStr = ""
    for k, generalId in pairs(generalIdVec) do
        generalStr = generalStr..generalId..";"
    end
    generalStr = string.sub(generalStr , 1, -2)

	local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if heroXML then
        heroXML:setNodeAttrValue("campData", "general", tostring(generalStr))
        heroXML:saveXMLFile()
    end
end

-----阵营信息处理  --end  ------------------------------------------------------

-----武将信息处理  --begin
function HeroDataMgr:GetAllGeneralData()
    return clone(self.heroData.generalVecData)
end

function HeroDataMgr:GetSingleGeneralData(generalIdStr)
    return clone(self.heroData.generalVecData[tostring(generalIdStr)])
end

function HeroDataMgr:DeleteSingleGeneralData(generalIdStr)
    local generalXML = g_UserDefaultMgr:loadXMLFile("generalXML.xml")
    if generalXML then
        generalXML:removeNode(tostring(generalIdStr))    --每个武将数据，用generalId字符串作为节点
    end
end

--保存单个武将数据
function HeroDataMgr:SetSingleGeneralData(generalData)  
    --G_Log_Info("HeroDataMgr:SetSingleGeneralData()")
    if not generalData then
        G_Log_Error("HeroDataMgr:SetSingleGeneralData(), error: generalData = nil")
    end

    local generalIdStr = tostring(generalData.id_str)
    self.heroData.generalVecData[generalIdStr] = generalData
    
    local generalXML = g_UserDefaultMgr:loadXMLFile("generalXML.xml")
    if not generalXML then
        generalXML = g_UserDefaultMgr:createXMLFile("generalXML.xml", "root")
    end
    generalXML:removeNode(generalIdStr)    --每个武将数据，用generalId字符串作为节点
    generalXML:addChildNode(generalIdStr)

    generalXML:setNodeAttrValue(generalIdStr, "id_str", tostring(generalData.id_str))
    generalXML:setNodeAttrValue(generalIdStr, "exp", tostring(generalData.exp))
    generalXML:setNodeAttrValue(generalIdStr, "level", tostring(generalData.level))
    generalXML:setNodeAttrValue(generalIdStr, "offical", tostring(generalData.offical))
    generalXML:setNodeAttrValue(generalIdStr, "zhongcheng", tostring(generalData.zhongcheng))

    local bingTypeVec = generalData.bingTypeVec
    local bingTypeStr = ""
    for k, bingId in pairs(bingTypeVec) do
        bingTypeStr = bingTypeStr..bingId..";"
    end
    bingTypeStr = string.sub(bingTypeStr , 1, -2)

    generalXML:setNodeAttrValue(generalIdStr, "bingTypeVec", tostring(bingTypeStr))

    local skillVec = generalData.skillVec
    local skillIdStr = ""
    local skillLvStr = ""
    for k, vec in pairs(skillVec) do
        skillIdStr = skillIdStr..vec["skillId"]..";"
        skillLvStr = skillLvStr..vec["lv"]..";"
    end
    skillIdStr = string.sub(skillIdStr , 1, -2)
    skillLvStr = string.sub(skillLvStr , 1, -2)

    generalXML:setNodeAttrValue(generalIdStr, "skillIdVec", tostring(skillIdStr))
    generalXML:setNodeAttrValue(generalIdStr, "skillLvVec", tostring(skillLvStr))

    local equipVec = generalData.equipVec
    local equipIdStr = ""
    local equipLvStr = ""
    for k, vec in pairs(equipVec) do
        equipIdStr = equipIdStr..vec["equipId"]..";"
        equipLvStr = equipLvStr..vec["lv"]..";"
    end
    equipIdStr = string.sub(equipIdStr , 1, -2)
    equipLvStr = string.sub(equipLvStr , 1, -2)

    generalXML:setNodeAttrValue(generalIdStr, "equipIdVec", tostring(equipIdStr))
    generalXML:setNodeAttrValue(generalIdStr, "equipLvVec", tostring(equipLvStr))

    local armyUnitNode = generalIdStr.."-armyUnit"
    generalXML:removeNode(armyUnitNode)   
    generalXML:addChildNode(armyUnitNode)
    local armyUnit = generalData.armyUnit
    if armyUnit then
        generalXML:setNodeAttrValue(armyUnitNode, "bingIdStr", tostring(armyUnit.bingIdStr))
        generalXML:setNodeAttrValue(armyUnitNode, "bingCount", tostring(armyUnit.bingCount))
        generalXML:setNodeAttrValue(armyUnitNode, "exp", tostring(armyUnit.exp))
        generalXML:setNodeAttrValue(armyUnitNode, "shiqi", tostring(armyUnit.shiqi))
        generalXML:setNodeAttrValue(armyUnitNode, "zhenId", tostring(armyUnit.zhenId))
    end

    generalXML:saveXMLFile()
end

function HeroDataMgr:SetSingleGeneralExp(generalIdStr, exp)
    local generalXML = g_UserDefaultMgr:loadXMLFile("generalXML.xml")
    generalXML:setNodeAttrValue(tostring(generalIdStr), "exp", tostring(exp))
    generalXML:saveXMLFile()
end

----------------------------武将信息处理 end  ------------------------

---------------------bagXML保存玩家背包物品数据 begin   ----------------------------------
function HeroDataMgr:GetBagXMLData()
    return clone(self.heroData.bagVecData)
end

function HeroDataMgr:SetBagXMLData(itemVec)
    --G_Log_Info("HeroDataMgr:SetBagXMLData()")
    if not itemVec then
        G_Log_Error("HeroDataMgr:SetBagXMLData(), error: itemVec = nil")
    end
    --dump(itemVec, "itemVec = ")

    local bagXML = g_UserDefaultMgr:loadXMLFile("bagXML.xml")
    if not bagXML then
        bagXML = g_UserDefaultMgr:createXMLFile("bagXML.xml", "root")
    end

    local bItemIdChanged = false   --总物品是否有增加的新物品或删除的物品

    for i=1, #itemVec do
        local itemIdStr = tostring(itemVec[i].itemId)
        local itemNum = tonumber(itemVec[i].num)

        --军队数量，金币粮草药材数量同步到camp数据中
        if itemIdStr == "401" or itemIdStr == "402" or itemIdStr == "403" or itemIdStr == "404" then
            local troops = g_HeroDataMgr:GetHeroCampTroops()
            troops = troops + itemNum
            g_HeroDataMgr:SetHeroCampTroops(troops)

            --发送军队数量变化监听事件
            local event = cc.EventCustom:new(g_EventListenerCustomName.MainMenu_troopEvent)
            event._usedata = string.format("%d", troops)  
            g_EventDispatcher:dispatchEvent(event) 
        elseif itemIdStr == "6001" then
            local money = g_HeroDataMgr:GetHeroCampMoney()
            money = money + itemNum
            g_HeroDataMgr:SetHeroCampMoney(money)

            --发送金币变化监听事件
            local event = cc.EventCustom:new(g_EventListenerCustomName.MainMenu_moneyEvent)
            event._usedata = string.format("%d", money)  
            g_EventDispatcher:dispatchEvent(event) 
        elseif itemIdStr == "6002" then
            local food = g_HeroDataMgr:GetHeroCampFood()
            food = food + itemNum
            g_HeroDataMgr:SetHeroCampFood(food)

            --发送粮草变化监听事件
            local event = cc.EventCustom:new(g_EventListenerCustomName.MainMenu_foodEvent)
            event._usedata = string.format("%d", food)  
            g_EventDispatcher:dispatchEvent(event) 
        elseif itemIdStr == "6003" then
            local drug = g_HeroDataMgr:GetHeroCampDrug()
            drug = drug + itemNum
            g_HeroDataMgr:SetHeroCampDrug(drug)

            --发送药材变化监听事件
            local event = cc.EventCustom:new(g_EventListenerCustomName.MainMenu_drugEvent)
            event._usedata = string.format("%d", drug)  
            g_EventDispatcher:dispatchEvent(event) 
        end

        if self.heroData.bagVecData[itemIdStr] == nil then
            bItemIdChanged = true    --增加新物品
            self.heroData.bagVecData[itemIdStr] = itemVec[i]
        else
            itemNum = itemNum + tonumber(self.heroData.bagVecData[itemIdStr].num)   --合并现有物品数量
            if itemNum == 0 then
                bItemIdChanged = true    --删除的物品
                self.heroData.bagVecData[itemIdStr] = nil
            else   
                itemVec[i].num = itemNum
                self.heroData.bagVecData[itemIdStr] = itemVec[i]
            end
        end
        
        bagXML:removeNode(itemIdStr)    --每个物品用itemIdStr字符串作为节点
        if itemNum > 0 then
            bagXML:addChildNode(itemIdStr)
            bagXML:setNodeAttrValue(itemIdStr, "itemId", tostring(itemIdStr))
            bagXML:setNodeAttrValue(itemIdStr, "num", tostring(itemNum))
        end
    end

    if bItemIdChanged == true then  --总物品有增加的新物品或删除的物品
        local totalIdStr = ""
        local bNeedSub = false   --是否需要移除最后一个;号
        for k, data in pairs(self.heroData.bagVecData) do
            if data and data.itemId and tonumber(data.num) > 0 then
                local itemId = data.itemId
                totalIdStr = totalIdStr..tostring(itemId)..";"
                bNeedSub = true
            end
        end
        if bNeedSub == true then
            totalIdStr = string.sub(totalIdStr , 1, -2)
        end

        bagXML:removeNode("itemIdVecNode")
        bagXML:addChildNode("itemIdVecNode")
        bagXML:setNodeAttrValue("itemIdVecNode", "itemIdVec", tostring(totalIdStr))
    end

    bagXML:saveXMLFile()
end


---------------------bagXML保存玩家背包物品数据 end   ------------------------------------


return HeroDataMgr