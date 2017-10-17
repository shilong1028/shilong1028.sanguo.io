
--武将信息大界面
local GeneralLayer = class("GeneralLayer", CCLayerEx)  --填入类名

local SmallOfficerCell = require("Layer.Role.SmallOfficerCell")
local ItemCell = require("Layer.Item.ItemCell")

function GeneralLayer:create()   --自定义的create()创建方法
    --G_Log_Info("GeneralLayer:create()")
    local layer = GeneralLayer.new()
    return layer
end

function GeneralLayer:onExit()
    --G_Log_Info("GeneralLayer:onExit()")
end

--初始化UI界面
function GeneralLayer:init()  
    --G_Log_Info("GeneralLayer:init()")
    --self:setTouchEnabled(true)
    self:setSwallowTouches(true)

    local csb = cc.CSLoader:createNode("csd/GeneralInfoLayer.csb")
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    self:addChild(csb)

    self.Image_bg = csb:getChildByName("Image_bg")
    self.titleBg = self.Image_bg:getChildByName("titleBg")
    self.Text_title = self.Image_bg:getChildByName("Text_title")
    self.Text_title:setString(lua_general_Str1)

    self.Button_close = self.Image_bg:getChildByName("Button_close")   
    self.Button_close:addTouchEventListener(handler(self,self.touchEvent))
    --武将列表
    self.ListView_general = self.Image_bg:getChildByName("ListView_general")
    self.ListView_general:setTouchEnabled(true)
    self.ListView_general:setBounceEnabled(true)
    self.ListView_general:setScrollBarEnabled(false)   --屏蔽列表滚动条
    self.ListView_general:setItemsMargin(10.0)
    self.ListView_generalSize = self.ListView_general:getContentSize()

    --武将信息
    self.Button_InfoRadio = self.Image_bg:getChildByName("Button_InfoRadio")
    self.Button_InfoRadio:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_InfoRadio_Text = self.Button_InfoRadio:getChildByName("Text_btn")
    --武将部曲
    self.Button_armyRadio = self.Image_bg:getChildByName("Button_armyRadio")
    self.Button_armyRadio:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_armyRadio_Text = self.Button_armyRadio:getChildByName("Text_btn")
    --武将技能
    self.Button_skillRadio = self.Image_bg:getChildByName("Button_skillRadio")
    self.Button_skillRadio:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_skillRadio_Text = self.Button_skillRadio:getChildByName("Text_btn")

    --武将信息层
    self.Panel_Info = self.Image_bg:getChildByName("Panel_Info")
    local generalInfoNode = self.Panel_Info:getChildByName("generalInfoNode")

    self.info_Image_headBg = generalInfoNode:getChildByName("Image_headBg")    --头像背景
    self.info_Image_color = generalInfoNode:getChildByName("Image_color")   --品质颜色

    self.info_Image_toukui = generalInfoNode:getChildByName("Image_toukui")  --头盔
    self.info_Image_wuqi = generalInfoNode:getChildByName("Image_wuqi")      --武器
    self.info_Image_hujia = generalInfoNode:getChildByName("Image_hujia")    --护甲
    self.info_Image_zuoqi = generalInfoNode:getChildByName("Image_zuoqi")    --坐骑
    self.info_Image_daoju = generalInfoNode:getChildByName("Image_daoju")    --道具

    self.info_Text_name = generalInfoNode:getChildByName("Text_name")    --名称
    self.info_Text_lv = generalInfoNode:getChildByName("Text_lv")    --等级
    self.info_Text_offical = generalInfoNode:getChildByName("Text_offical")   --官职

    self.info_Text_hp = generalInfoNode:getChildByName("Text_hp")    --血量
    self.info_Text_mp = generalInfoNode:getChildByName("Text_mp")    --智力
    self.info_Text_att = generalInfoNode:getChildByName("Text_att")   --攻击
    self.info_Text_def = generalInfoNode:getChildByName("Text_def")   --防御

    self.info_Text_desc = generalInfoNode:getChildByName("Text_desc")   --武将类型，英雄，武将，文官
    self.info_Text_attr = generalInfoNode:getChildByName("Text_attr")   --属性描述（+装备加成）
    self.info_Text_generalDesc = generalInfoNode:getChildByName("Text_generalDesc")  --武将简介

    self:LoadGeneralList()

    self:setRadioPanel(1)
end

function GeneralLayer:setRadioPanel(idx)
    if idx < 0 or idx > 3 then
        return
    end
    if self.selRadioIdx and self.selRadioIdx == idx then
        return
    end
    self.selRadioIdx = idx

    if idx == 1 then   --武将信息
        self.Button_InfoRadio:loadTextureNormal("public_radio2.png", ccui.TextureResType.plistType)
        self.Button_armyRadio:loadTextureNormal("public_radio1.png", ccui.TextureResType.plistType)
        self.Button_skillRadio:loadTextureNormal("public_radio1.png", ccui.TextureResType.plistType)

        self.Button_InfoRadio_Text:enableOutline(g_ColorDef.DarkRed, 1)
        self.Button_armyRadio_Text:disableEffect()
        self.Button_skillRadio_Text:disableEffect()

        self.Panel_Info:setVisible(true)
    elseif idx == 2 then   --武将部曲
        self.Button_InfoRadio:loadTextureNormal("public_radio1.png", ccui.TextureResType.plistType)
        self.Button_armyRadio:loadTextureNormal("public_radio2.png", ccui.TextureResType.plistType)
        self.Button_skillRadio:loadTextureNormal("public_radio1.png", ccui.TextureResType.plistType)

        self.Button_armyRadio_Text:enableOutline(g_ColorDef.DarkRed, 1)
        self.Button_InfoRadio_Text:disableEffect()
        self.Button_skillRadio_Text:disableEffect()

        self.Panel_Info:setVisible(false)
    elseif idx == 3 then   --武将技能
        self.Button_InfoRadio:loadTextureNormal("public_radio1.png", ccui.TextureResType.plistType)
        self.Button_armyRadio:loadTextureNormal("public_radio1.png", ccui.TextureResType.plistType)
        self.Button_skillRadio:loadTextureNormal("public_radio2.png", ccui.TextureResType.plistType)

        self.Button_skillRadio_Text:enableOutline(g_ColorDef.DarkRed, 1)
        self.Button_InfoRadio_Text:disableEffect()
        self.Button_armyRadio_Text:disableEffect()

        self.Panel_Info:setVisible(false)
    end
end

function GeneralLayer:LoadGeneralList()
    self.generalVec = {}
    self.generalCellVec = {}

    local function callFunc(target, tagIdx)
        self:ListCellCallBack(target, tagIdx)
    end

    self.HeroCampData = g_HeroDataMgr:GetHeroCampData()
    if self.HeroCampData then
        local generalIdVec = self.HeroCampData.generalIdVec
        for k, generalId in pairs(generalIdVec) do
            local generalData = g_pTBLMgr:getGeneralConfigTBLDataById(generalId) 
            if generalData then
                table.insert(self.generalVec, generalData)
                local officerCell = SmallOfficerCell:new()
                officerCell:initData(generalData, k) 
                officerCell:setSelCallBack(callFunc)
                table.insert(self.generalCellVec, officerCell)

                local cur_item = ccui.Layout:create()
                cur_item:setContentSize(officerCell:getContentSize())
                cur_item:addChild(officerCell)
                --cur_item:setEnabled(true)

                self.ListView_general:addChild(cur_item)
                local pos = cc.p(cur_item:getPosition())
            end
        end
        local len = #self.generalCellVec
        local InnerWidth = len*90 + 10*(len-1)
        if InnerWidth < self.ListView_generalSize.width then
            self.ListView_general:setContentSize(cc.size(InnerWidth, self.ListView_generalSize.height))
            self.ListView_general:setBounceEnabled(false)
        else
            self.ListView_general:setContentSize(self.ListView_generalSize)
            self.ListView_general:setBounceEnabled(true)
        end
        self.ListView_general:refreshView()
    end

    self.lastSelOfficalCell = self.generalCellVec[1]
    self.lastSelOfficalCell:showSelEffect(true)
    self:initGeneralData(self.generalVec[1])
end

function GeneralLayer:ListCellCallBack(target, tagIdx)
    G_Log_Info("GeneralLayer:ListCellCallBack(), tagIdx = %d", tagIdx)
    if self.lastSelOfficalCell and target ~= self.lastSelOfficalCell then
        self.lastSelOfficalCell:showSelEffect(false)
    end
    self.lastSelOfficalCell = target
    self.lastSelOfficalCell:showSelEffect(true)

    self:initGeneralData(self.generalVec[tagIdx]) 
end

function GeneralLayer:initGeneralData(generalData)  
    --G_Log_Dump(generalData, "generalData = ")
    self.selGeneralData = generalData
    if generalData == nil then
        G_Log_Error("GeneralLayer:initGeneralData(), generalData = nil")
        return
    end
    --[[
    self.id_str = ""   --武将ID字符串(xml保存)
    self.name = ""     --武将名称
    self.level = 0     --武将等级(xml保存)
    self.type = 0    --将领类型，1英雄，2武将，3军师
    self.hp = 0    --初始血量值
    self.mp = 0        --初始智力值
    self.atk = 0     --初始攻击力
    self.def = 0     --初始防御力
    self.skillVec = {}    --初始技能，技能lv-ID字符串以;分割(xml保存)
    self.equipVec = {}    --初始装备，装备lv-ID字符串以;分割(xml保存)
    self.desc = ""    --描述
    --附加属性(xml保存)
    self.exp = 0   --战斗经验
    self.offical = ""    --官职ID字符串，官职可以提升武将血智攻防、额外带兵数（默认带1000兵）等属性
    self.zhongcheng = 100   --武将忠诚度
    self.bingTypeVec = {}    --轻装|重装|精锐|羽林品质的骑兵|枪戟兵|刀剑兵|弓弩兵等共16种（每个兵种仅可组建一支部曲）
    self.armyUnitVec = {}    --g_tbl_armyUnitConfig:new()   --武将部曲数据
    ]]

     --头像背景
    local bgHeadSize = self.info_Image_headBg:getContentSize()
    if not self.info_headImg then
        self.info_headImg =  ccui.ImageView:create(string.format("Head/%s.png", generalData.id_str), ccui.TextureResType.localType)
        self.info_headImg:setScale(bgHeadSize.width/self.info_headImg:getContentSize().width)
        self.info_headImg:setPosition(cc.p(bgHeadSize.width/2, bgHeadSize.height/2))
        self.info_Image_headBg:addChild(self.info_headImg)
    else
        self.info_headImg:loadTexture(string.format("Head/%d.png", generalData.id_str), ccui.TextureResType.localType)
    end
    --品质颜色
    local colorIdx = G_GetGeneralColorIdxByLv(generalData.level)
    if colorIdx > 0 and colorIdx <=5 then
        self.info_Image_color:setVisible(true)
        self.info_Image_color:loadTexture(string.format("public_colorBg%d.png", colorIdx), ccui.TextureResType.plistType)
        --self.info_Image_color:setScale(bgHeadSize.width/self.info_headImg:getContentSize().width)
    else
        self.info_Image_color:setVisible(false)
    end

    self.info_Text_name:setString(generalData.name)    --名称
    self.info_Text_lv:setString(string.format(lua_Role_String2, generalData.level))     --等级
    self.info_Text_generalDesc:setString(generalData.desc)  --武将简介

    self.info_Text_hp:setString(string.format(lua_Role_String3, generalData.hp))    --血量
    self.info_Text_mp:setString(string.format(lua_Role_String4, generalData.mp))    --智力
    self.info_Text_att:setString(string.format(lua_Role_String5, generalData.atk))   --攻击
    self.info_Text_def:setString(string.format(lua_Role_String6, generalData.def))   --防御

    --self.info_Text_offical = generalInfoNode:getChildByName("Text_offical")   --官职
    --self.info_Text_desc = generalInfoNode:getChildByName("Text_desc")   --武将类型，英雄，武将，文官

    -- self.info_Image_toukui = generalInfoNode:getChildByName("Image_toukui")  --头盔
    -- self.info_Image_wuqi = generalInfoNode:getChildByName("Image_wuqi")      --武器
    -- self.info_Image_hujia = generalInfoNode:getChildByName("Image_hujia")    --护甲
    -- self.info_Image_zuoqi = generalInfoNode:getChildByName("Image_zuoqi")    --坐骑
    -- self.info_Image_daoju = generalInfoNode:getChildByName("Image_daoju")    --道具
end

function GeneralLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then 
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_GeneralLayer)
        elseif sender == self.Button_InfoRadio then 
            self:setRadioPanel(1)
        elseif sender == self.Button_armyRadio then
            self:setRadioPanel(2)
        elseif sender == self.Button_skillRadio then
            self:setRadioPanel(3)
        end
    end
end


return GeneralLayer
