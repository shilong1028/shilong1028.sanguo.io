
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

    --attackZhenXML攻击阵型数据
    self:initAttackZheXMLData()

    --defendZhenXML防御阵型数据
    self:initDefendZheXMLData()
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
    self:ClearUserXML("attackZhenXML.xml")
    self:ClearUserXML("defendZhenXML.xml")

    self.heroData.storyData = {}  --剧情任务数据
    self.heroData.mapPosData = {}  --玩家地图位置信息
    self.heroData.campData = g_tbl_campConfig:new()  --玩家阵营信息
    self.heroData.vipData = {}   --vip信息
    self.heroData.generalVecData = {}   --武将数据
    self.heroData.bagVecData = {}   --武将数据
    self.heroData.attZhenData = {-1, -1, -1, -1, -1, -1, -1}   --攻击阵型数据1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
    self.heroData.defZhenData = {-1, -1, -1, -1, -1, -1, -1}   --防御阵型数据 {g_tbl_ZhenUnitStruct}
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
        self.heroData.storyData.storyPlayedState = tonumber(heroXML:getNodeAttrValue("storyData", "storyPlayedState"))  --任务故事进程状态

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

                generalData.qiLv = tblData.qiLv     --骑兵掌握熟练度等级，0-10,0为未获取相应兵种印玺
                generalData.qiangLv = tblData.qiangLv   --枪兵掌握熟练度等级
                generalData.daoLv = tblData.daoLv      --刀兵掌握熟练度等级
                generalData.gongLv = tblData.gongLv     --弓兵掌握熟练度等级

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
                    table.insert(generalData.equipVec, {["equipId"]=equipIdVec[i], ["lv"]=equipLvVec[i]})
                end

                generalData.armyUnitVec = {}    --g_tbl_armyUnitConfig:new()   --武将部曲数据
                for k, bingId in pairs(generalData.bingTypeVec) do
                    local armyUnit = g_tbl_armyUnitConfig:new()
                    local armyUnitNode = generalIdStr.."-armyUnitRoot-"..bingId
                    armyUnit.bingIdStr = generalXML:getNodeAttrValue(armyUnitNode, "bingIdStr")
                    armyUnit.bingCount = tonumber(generalXML:getNodeAttrValue(armyUnitNode, "bingCount"))
                    armyUnit.level = tonumber(generalXML:getNodeAttrValue(armyUnitNode, "level"))
                    armyUnit.exp = tonumber(generalXML:getNodeAttrValue(armyUnitNode, "exp"))
                    armyUnit.shiqi = tonumber(generalXML:getNodeAttrValue(armyUnitNode, "shiqi"))
                    armyUnit.zhenId = generalXML:getNodeAttrValue(armyUnitNode, "zhenId")
                    table.insert(generalData.armyUnitVec, armyUnit)
                end

                --table.insert(self.heroData.generalVecData, generalData)
                self.heroData.generalVecData[generalIdStr] = generalData
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

--attackZhenXML攻击阵型数据
function HeroDataMgr:initAttackZheXMLData()
    self.heroData.attZhenData = {-1, -1, -1, -1, -1, -1, -1}   --攻击阵型数据1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下

    local attZhenXML = g_UserDefaultMgr:loadXMLFile("attackZhenXML.xml")
    if attZhenXML then
        local vecStr = attZhenXML:getNodeAttrValue("zhenPosVecNode", "zhenPosVec")   --有效的阵型营寨数据pos集合
        if vecStr and vecStr ~= "" then
            local zhenPosVec = string.split(vecStr,";") 
            for i=1, #zhenPosVec do
                local nodeStr = "zhenPos"..tostring(zhenPosVec[i])

                local zhenUnit = g_tbl_ZhenUnitStruct:new()
                zhenUnit.zhenPos = tonumber(attZhenXML:getNodeAttrValue(nodeStr, "zhenPos"))
                zhenUnit.generalIdStr = attZhenXML:getNodeAttrValue(nodeStr, "generalIdStr")

                local armyUnit = g_tbl_armyUnitConfig:new()
                armyUnit.bingIdStr = attZhenXML:getNodeAttrValue(nodeStr, "bingIdStr")
                armyUnit.bingCount = tonumber(attZhenXML:getNodeAttrValue(nodeStr, "bingCount"))
                armyUnit.level = tonumber(attZhenXML:getNodeAttrValue(nodeStr, "level"))
                armyUnit.exp = tonumber(attZhenXML:getNodeAttrValue(nodeStr, "exp"))
                armyUnit.shiqi = tonumber(attZhenXML:getNodeAttrValue(nodeStr, "shiqi"))
                armyUnit.zhenId = attZhenXML:getNodeAttrValue(nodeStr, "zhenId")

                zhenUnit.unitData = armyUnit

                self.heroData.attZhenData[zhenUnit.zhenPos] = zhenUnit
            end
        end
    end
end

--defendZhenXML防御阵型数据
function HeroDataMgr:initDefendZheXMLData()
    self.heroData.defZhenData = {-1, -1, -1, -1, -1, -1, -1}   --攻击阵型数据1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下

    local defZhenXML = g_UserDefaultMgr:loadXMLFile("defendZhenXML.xml")
    if defZhenXML then
        local vecStr = defZhenXML:getNodeAttrValue("zhenPosVecNode", "zhenPosVec")   --有效的阵型营寨数据pos集合
        if vecStr and vecStr ~= "" then
            local zhenPosVec = string.split(vecStr,";") 
            for i=1, #zhenPosVec do
                local nodeStr = "zhenPos"..tostring(zhenPosVec[i])

                local zhenUnit = g_tbl_ZhenUnitStruct:new()
                zhenUnit.zhenPos = tonumber(defZhenXML:getNodeAttrValue(nodeStr, "zhenPos"))
                zhenUnit.generalIdStr = defZhenXML:getNodeAttrValue(nodeStr, "generalIdStr")

                local armyUnit = g_tbl_armyUnitConfig:new()
                armyUnit.bingIdStr = defZhenXML:getNodeAttrValue(nodeStr, "bingIdStr")
                armyUnit.bingCount = tonumber(defZhenXML:getNodeAttrValue(nodeStr, "bingCount"))
                armyUnit.level = tonumber(defZhenXML:getNodeAttrValue(nodeStr, "level"))
                armyUnit.exp = tonumber(defZhenXML:getNodeAttrValue(nodeStr, "exp"))
                armyUnit.shiqi = tonumber(defZhenXML:getNodeAttrValue(nodeStr, "shiqi"))
                armyUnit.zhenId = defZhenXML:getNodeAttrValue(nodeStr, "zhenId")

                zhenUnit.unitData = armyUnit

                self.heroData.defZhenData[zhenUnit.zhenPos] = zhenUnit
            end
        end
    end
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

function HeroDataMgr:GetStoryPlayedState()
    return clone(self.heroData.storyData.storyPlayedState)  --任务故事进程状态
end

function HeroDataMgr:SetStoryPlayedState(storyId, storyPlayedState)
    self.heroData.storyData.mainStoryId = storyId   --剧情任务数据(主线ID) 
    self.heroData.storyData.storyPlayedState = storyPlayedState   --任务故事进程状态

    local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if not heroXML then
        heroXML = g_UserDefaultMgr:createXMLFile("heroXML.xml", "root")
    end
    heroXML:removeNode("storyData")
    heroXML:addChildNode("storyData")
    heroXML:setNodeAttrValue("storyData", "mainStoryId", tostring(storyId))
    heroXML:setNodeAttrValue("storyData", "storyPlayedState", tostring(storyPlayedState))  
    heroXML:saveXMLFile()
end

function HeroDataMgr:SetNextStoryTalkId(storyId)
    self.heroData.storyData.mainStoryId = storyId   --剧情任务数据(主线ID) 
    self.heroData.storyData.storyPlayedState = g_StoryState.Init   --任务故事进程状态(0初始状态)

    local heroXML = g_UserDefaultMgr:loadXMLFile("heroXML.xml")
    if not heroXML then
        heroXML = g_UserDefaultMgr:createXMLFile("heroXML.xml", "root")
    end
    heroXML:removeNode("storyData")
    heroXML:addChildNode("storyData")
    heroXML:setNodeAttrValue("storyData", "mainStoryId", tostring(storyId))
    heroXML:setNodeAttrValue("storyData", "storyPlayedState", tostring(g_StoryState.Init))  
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

--获取可用劳力（预备役）人数
function HeroDataMgr:GetHeroPrepTroops()
    return math.floor(clone(self.heroData.campData.population)/100)
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
        self.heroData.generalVecData[generalIdStr] = nil
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

    local armyUnitRoot = generalIdStr.."-armyUnitRoot"
    generalXML:removeNode(armyUnitRoot)   
    generalXML:addChildNode(armyUnitRoot)
    for k, armyUnit in pairs(generalData.armyUnitVec) do   --武将部曲数据
        local armyUnitNode = armyUnitRoot.."-"..armyUnit.bingIdStr
        generalXML:removeNode(armyUnitNode)   
        generalXML:addChildNode(armyUnitNode)

        generalXML:setNodeAttrValue(armyUnitNode, "bingIdStr", tostring(armyUnit.bingIdStr))
        generalXML:setNodeAttrValue(armyUnitNode, "bingCount", tostring(armyUnit.bingCount))
        generalXML:setNodeAttrValue(armyUnitNode, "level", tostring(armyUnit.level))
        generalXML:setNodeAttrValue(armyUnitNode, "exp", tostring(armyUnit.exp))
        generalXML:setNodeAttrValue(armyUnitNode, "shiqi", tostring(armyUnit.shiqi))
        generalXML:setNodeAttrValue(armyUnitNode, "zhenId", tostring(armyUnit.zhenId))
    end

    generalXML:saveXMLFile()
end

function HeroDataMgr:SetSingleGeneralExp(generalIdStr, exp)
    local generalXML = g_UserDefaultMgr:loadXMLFile("generalXML.xml")
    if generalXML then
        generalXML:setNodeAttrValue(tostring(generalIdStr), "exp", tostring(exp))
        generalXML:saveXMLFile()

        if self.heroData.generalVecData[generalIdStr] then
            self.heroData.generalVecData[generalIdStr].exp = exp
        end
    end
end

--保存玩家单个武将单个部曲数据到generalXML
function HeroDataMgr:SetSingleGeneralUnit(generalIdStr, armyUnit)
    local generalXML = g_UserDefaultMgr:loadXMLFile("generalXML.xml")
    if generalXML then
        local armyUnitRoot = generalIdStr.."-armyUnitRoot"
        local armyUnitNode = armyUnitRoot.."-"..armyUnit.bingIdStr
        generalXML:removeNode(armyUnitNode)   
        generalXML:addChildNode(armyUnitNode)

        generalXML:setNodeAttrValue(armyUnitNode, "bingIdStr", tostring(armyUnit.bingIdStr))
        generalXML:setNodeAttrValue(armyUnitNode, "bingCount", tostring(armyUnit.bingCount))
        generalXML:setNodeAttrValue(armyUnitNode, "level", tostring(armyUnit.level))
        generalXML:setNodeAttrValue(armyUnitNode, "exp", tostring(armyUnit.exp))
        generalXML:setNodeAttrValue(armyUnitNode, "shiqi", tostring(armyUnit.shiqi))
        generalXML:setNodeAttrValue(armyUnitNode, "zhenId", tostring(armyUnit.zhenId))

        generalXML:saveXMLFile()

        g_pGameLayer:ShowScrollTips(lua_str_WarnTips18, g_ColorDef.Red, g_defaultTipsFontSize)  --"武将部曲保存成功！"

        if self.heroData.generalVecData[generalIdStr] then
            local bFind = false
            for k, unitData in pairs(self.heroData.generalVecData[generalIdStr].armyUnitVec) do
                if tonumber(unitData.bingIdStr) == tonumber(armyUnit.bingIdStr) then
                    self.heroData.generalVecData[generalIdStr].armyUnitVec[k] = armyUnit
                    bFind = true
                    break;
                end
            end
            if bFind == false then
                table.insert(self.heroData.generalVecData[generalIdStr].armyUnitVec, armyUnit)
            end
        end
    end
end

----------------------------武将信息处理 end  ------------------------

---------------------bagXML保存玩家背包物品数据 begin   ----------------------------------
function HeroDataMgr:GetBagXMLData()
    return clone(self.heroData.bagVecData)
end

function HeroDataMgr:GetBagItemDataById(itemId)
    local itemIdStr = tostring(itemId)
    for k, data in pairs(self.heroData.bagVecData) do
        if itemIdStr == data.itemId then   --{["itemId"] = itemId, ["num"] = itemNum }
            return clone(data)
        end
    end
    return nil
end

function HeroDataMgr:GetSoliderItemListById(itemId)
    local itemIdStr = tostring(itemId)
    local soliderList = {}
    for k, data in pairs(self.heroData.bagVecData) do
        if itemIdStr == data.itemId then   --{["itemId"] = itemId, ["num"] = itemNum }
            table.insert(soliderList, clone(data))
        end
    end
    return soliderList
end

function HeroDataMgr:SetBagXMLData(itemVec)
    --G_Log_Info("HeroDataMgr:SetBagXMLData()")
    if not itemVec then
        G_Log_Error("HeroDataMgr:SetBagXMLData(), error: itemVec = nil")
    end

    local bagXML = g_UserDefaultMgr:loadXMLFile("bagXML.xml")
    if not bagXML then
        bagXML = g_UserDefaultMgr:createXMLFile("bagXML.xml", "root")
    end

    local bItemIdChanged = false   --总物品是否有增加的新物品或删除的物品

    for i=1, #itemVec do
        local itemId = tonumber(itemVec[i].itemId)
        local itemIdStr = tostring(itemVec[i].itemId)
        local itemNum = tonumber(itemVec[i].num)

        --军队数量，金币粮草药材数量同步到camp数据中
        if itemId >= g_ItemIdDef.Item_Id_qiangbing and itemId <= g_ItemIdDef.Item_Id_qibing then    --枪刀弓骑兵
            local troops = g_HeroDataMgr:GetHeroCampTroops()
            troops = troops + itemNum
            g_HeroDataMgr:SetHeroCampTroops(troops)

            --发送军队数量变化监听事件
            local event = cc.EventCustom:new(g_EventListenerCustomName.MainMenu_troopEvent)
            event._usedata = string.format("%d", troops)  
            g_EventDispatcher:dispatchEvent(event) 
        elseif itemId == g_ItemIdDef.Item_Id_glod then  --金币
            local money = g_HeroDataMgr:GetHeroCampMoney()
            money = money + itemNum
            g_HeroDataMgr:SetHeroCampMoney(money)

            --发送金币变化监听事件
            local event = cc.EventCustom:new(g_EventListenerCustomName.MainMenu_moneyEvent)
            event._usedata = string.format("%d", money)  
            g_EventDispatcher:dispatchEvent(event) 
        elseif itemId == g_ItemIdDef.Item_Id_food then   --粮草
            local food = g_HeroDataMgr:GetHeroCampFood()
            food = food + itemNum
            g_HeroDataMgr:SetHeroCampFood(food)

            --发送粮草变化监听事件
            local event = cc.EventCustom:new(g_EventListenerCustomName.MainMenu_foodEvent)
            event._usedata = string.format("%d", food)  
            g_EventDispatcher:dispatchEvent(event) 
        elseif itemId == g_ItemIdDef.Item_Id_drug then   --药材
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

---------------------attackZhenXML defendZhenXML阵型数据 beging   ---------------
--保存玩家attackZhenXML攻击阵型数据
function HeroDataMgr:setAttackZheXMLData(attZhenData)
    if attZhenData == nil or attZhenData[5] == -1 then
        g_pGameLayer:ShowScrollTips(lua_str_WarnTips16, g_ColorDef.Red, g_defaultTipsFontSize)  --"该阵容中军主帅部曲未组建！"
        return
    end

    self.heroData.attZhenData = attZhenData  --{-1, -1, -1, -1, -1, -1, -1}   --攻击阵型数据1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下

    if not attZhenData then
        G_Log_Error("HeroDataMgr:setAttackZheXMLData(), error: attZhenData = nil")
    end

    local attZhenXML = g_UserDefaultMgr:loadXMLFile("attackZhenXML.xml")
    if not attZhenXML then
        attZhenXML = g_UserDefaultMgr:createXMLFile("attackZhenXML.xml", "root")
    end

    if attZhenXML then
        local totalZhenPosStr = ""
        local bNeedSub = false   --是否需要移除最后一个;号

        for k=1, 7 do   --注意按照1-7顺序
            local nodeStr = "zhenPos"..k
            attZhenXML:removeNode(nodeStr)

            local data = attZhenData[k]
            if data and data ~= -1 and data.unitData then
                totalZhenPosStr = totalZhenPosStr..tostring(data.zhenPos)..";"
                bNeedSub = true

                attZhenXML:addChildNode(nodeStr)
                attZhenXML:setNodeAttrValue(nodeStr, "zhenPos", tostring(data.zhenPos))
                attZhenXML:setNodeAttrValue(nodeStr, "generalIdStr", tostring(data.generalIdStr))
                attZhenXML:setNodeAttrValue(nodeStr, "bingIdStr", tostring(data.unitData.bingIdStr))
                attZhenXML:setNodeAttrValue(nodeStr, "bingCount", tostring(data.unitData.bingCount))
                attZhenXML:setNodeAttrValue(nodeStr, "level", tostring(data.unitData.level))
                attZhenXML:setNodeAttrValue(nodeStr, "exp", tostring(data.unitData.exp))
                attZhenXML:setNodeAttrValue(nodeStr, "shiqi", tostring(data.unitData.shiqi))
                attZhenXML:setNodeAttrValue(nodeStr, "zhenId", tostring(data.unitData.zhenId))
            end
        end

        if bNeedSub == true then
            totalZhenPosStr = string.sub(totalZhenPosStr , 1, -2)
        end
        --有效的阵型营寨数据pos集合
        attZhenXML:removeNode("zhenPosVecNode")  
        attZhenXML:addChildNode("zhenPosVecNode")
        attZhenXML:setNodeAttrValue("zhenPosVecNode", "zhenPosVec", tostring(totalZhenPosStr))
    end
    attZhenXML:saveXMLFile()

    g_pGameLayer:ShowScrollTips(lua_str_WarnTips17, g_ColorDef.Red, g_defaultTipsFontSize)  --"阵容保存成功！"
end

--玩家attackZhenXML攻击阵型数据
function HeroDataMgr:getAttackZheXMLData()
    return clone(self.heroData.attZhenData)
end

--保存玩家defendZhenXML防御阵型数据
function HeroDataMgr:setDefendZheXMLData(defZhenData)
    if defZhenData == nil or defZhenData[5] == -1 then
        g_pGameLayer:ShowScrollTips(lua_str_WarnTips16, g_ColorDef.Red, g_defaultTipsFontSize)  --"该阵容中军主帅部曲未组建！"
        return
    end

    self.heroData.defZhenData = defZhenData  --{-1, -1, -1, -1, -1, -1, -1}   --攻击阵型数据1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下

    if not defZhenData then
        G_Log_Error("HeroDataMgr:setDefendZheXMLData(), error: defZhenData = nil")
    end

    local attZhenXML = g_UserDefaultMgr:loadXMLFile("defendZhenXML.xml")
    if not attZhenXML then
        attZhenXML = g_UserDefaultMgr:createXMLFile("defendZhenXML.xml", "root")
    end

    if attZhenXML then
        local totalZhenPosStr = ""
        local bNeedSub = false   --是否需要移除最后一个;号

        for k=1, 7 do   --注意按照1-7顺序
            local nodeStr = "zhenPos"..k
            attZhenXML:removeNode(nodeStr)

            local data = defZhenData[k]
            if data and data ~= -1 and data.unitData then
                totalZhenPosStr = totalZhenPosStr..tostring(data.zhenPos)..";"
                bNeedSub = true

                attZhenXML:addChildNode(nodeStr)
                attZhenXML:setNodeAttrValue(nodeStr, "zhenPos", tostring(data.zhenPos))
                attZhenXML:setNodeAttrValue(nodeStr, "generalIdStr", tostring(data.generalIdStr))
                attZhenXML:setNodeAttrValue(nodeStr, "bingIdStr", tostring(data.unitData.bingIdStr))
                attZhenXML:setNodeAttrValue(nodeStr, "bingCount", tostring(data.unitData.bingCount))
                attZhenXML:setNodeAttrValue(nodeStr, "level", tostring(data.unitData.level))
                attZhenXML:setNodeAttrValue(nodeStr, "exp", tostring(data.unitData.exp))
                attZhenXML:setNodeAttrValue(nodeStr, "shiqi", tostring(data.unitData.shiqi))
                attZhenXML:setNodeAttrValue(nodeStr, "zhenId", tostring(data.unitData.zhenId))
            end
        end

        if bNeedSub == true then
            totalZhenPosStr = string.sub(totalZhenPosStr , 1, -2)
        end
        --有效的阵型营寨数据pos集合
        attZhenXML:removeNode("zhenPosVecNode")  
        attZhenXML:addChildNode("zhenPosVecNode")
        attZhenXML:setNodeAttrValue("zhenPosVecNode", "zhenPosVec", tostring(totalZhenPosStr))
    end
    attZhenXML:saveXMLFile()
    
    g_pGameLayer:ShowScrollTips(lua_str_WarnTips17, g_ColorDef.Red, g_defaultTipsFontSize)  --"阵容保存成功！"
end

--玩家defendZhenXML防御阵型数据
function HeroDataMgr:getDefendZheXMLData()
    return clone(self.heroData.defZhenData)
end

---------------------attackZhenXML defendZhenXML阵型数据 end  ---------------

return HeroDataMgr