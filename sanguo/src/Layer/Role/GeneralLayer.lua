
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

    self.Panel_Info = self.Image_bg:getChildByName("Panel_Info")
    --武将信息层
    local generalInfoNode = self.Panel_Info:getChildByName("generalInfoNode")
    self.generalInfoNode = generalInfoNode

    self.info_Image_headBg = generalInfoNode:getChildByName("Image_headBg")    --头像背景
    self.info_Image_headBg:addTouchEventListener(handler(self,self.touchImageEvent))
    self.info_Image_color = generalInfoNode:getChildByName("Image_color")   --品质颜色

    self.info_Image_sel = generalInfoNode:getChildByName("Image_sel")   --武将装备选中框
    self.info_Image_sel:setVisible(false)

    self.info_Image_toukui = generalInfoNode:getChildByName("Image_toukui")  --头盔
    self.info_Image_toukui:addTouchEventListener(handler(self,self.touchImageEvent))
    self.info_Image_wuqi = generalInfoNode:getChildByName("Image_wuqi")      --武器
    self.info_Image_wuqi:addTouchEventListener(handler(self,self.touchImageEvent))
    self.info_Image_hujia = generalInfoNode:getChildByName("Image_hujia")    --护甲
    self.info_Image_hujia:addTouchEventListener(handler(self,self.touchImageEvent))
    self.info_Image_zuoqi = generalInfoNode:getChildByName("Image_zuoqi")    --坐骑
    self.info_Image_zuoqi:addTouchEventListener(handler(self,self.touchImageEvent))
    self.info_Image_daoju = generalInfoNode:getChildByName("Image_daoju")    --道具
    self.info_Image_daoju:addTouchEventListener(handler(self,self.touchImageEvent))

    self.info_Text_name = generalInfoNode:getChildByName("Text_name")    --名称
    self.info_Text_lv = generalInfoNode:getChildByName("Text_lv")    --等级
    self.info_Text_offical = generalInfoNode:getChildByName("Text_offical")   --官职
    self.info_Text_zhongcheng = generalInfoNode:getChildByName("Text_zhongcheng")   --忠诚度

    self.info_Text_hp = generalInfoNode:getChildByName("Text_hp")    --血量
    self.info_Text_mp = generalInfoNode:getChildByName("Text_mp")    --智力
    self.info_Text_att = generalInfoNode:getChildByName("Text_att")   --攻击
    self.info_Text_def = generalInfoNode:getChildByName("Text_def")   --防御

    self.info_Text_desc = generalInfoNode:getChildByName("Text_desc")   --武将类型，英雄，武将，文官
    self.info_Text_attr = generalInfoNode:getChildByName("Text_attr")   --属性描述（+装备加成）
    self.info_Text_generalDesc = generalInfoNode:getChildByName("Text_generalDesc")  --武将简介

    --部曲层
    local generalUnitNode = self.Panel_Info:getChildByName("generalUnitNode")
    self.generalUnitNode = generalUnitNode

    self.unit_Image_headBg = generalUnitNode:getChildByName("Image_headBg")    --头像背景
    self.unit_Image_color = generalUnitNode:getChildByName("Image_color")   --品质颜色

    self.unit_Image_sel = generalUnitNode:getChildByName("Image_sel")   --部曲选中框
    self.unit_Image_sel:setVisible(false)

    self.unit_Image_qibing = generalUnitNode:getChildByName("Image_qibing")  --骑兵部曲
    self.unit_Image_qibing:addTouchEventListener(handler(self,self.touchImageEvent))
    self.unit_Image_qiangbing = generalUnitNode:getChildByName("Image_qiangbing") --枪兵部曲
    self.unit_Image_qiangbing:addTouchEventListener(handler(self,self.touchImageEvent))
    self.unit_Image_daobing = generalUnitNode:getChildByName("Image_daobing")  --刀兵部曲
    self.unit_Image_daobing:addTouchEventListener(handler(self,self.touchImageEvent))
    self.unit_Image_gongbing = generalUnitNode:getChildByName("Image_gongbing") --弓兵部曲
    self.unit_Image_gongbing:addTouchEventListener(handler(self,self.touchImageEvent))

    self.unit_Text_name = generalUnitNode:getChildByName("Text_name")    --武将名称
    self.unit_Text_UnitName = generalUnitNode:getChildByName("Text_unit_name")    --部曲名称
    self.unit_Text_UnitLv = generalUnitNode:getChildByName("Text_unit_lv")    --部曲等级

    self.unit_Text_bingCount = generalUnitNode:getChildByName("Text_bingCount")   --预备兵数量
    self.unit_Text_bingjia = generalUnitNode:getChildByName("Text_bingjia")   --兵甲数量
    self.unit_Text_bingqi = generalUnitNode:getChildByName("Text_bingqi")   --兵器数量
    self.unit_Text_mapi = generalUnitNode:getChildByName("Text_mapi")   --马匹数量

    self.unit_Text_cost = generalUnitNode:getChildByName("Text_cost")    --花费金币
    self.unit_Text_cost_gold = generalUnitNode:getChildByName("Text_cost_gold")   --花费金币数量

    self.unit_Text_numCount = generalUnitNode:getChildByName("Text_numCount")   --选中部曲的数量
    self.unit_Slider_num = generalUnitNode:getChildByName("Slider_num")   --滑动条
    self.unit_Slider_num:setMaxPercent(100)   --默认是100
    self.unit_Slider_num:setPercent(0)
    self.unit_Slider_num:setEnabled(true)

    --[[
    local slider = ccui.Slider:create()
    slider:setTouchEnabled(true)
    slider:loadBarTexture("cocosui/sliderTrack.png")
    slider:loadProgressBarTexture("cocosui/sliderProgress.png")
    slider:loadSlidBallTextures("cocosui/sliderThumb.png", "cocosui/sliderThumb.png", "")  
    slider:setPosition(cc.p(size.width / 2.0, size.height * 0.15 + slider:getSize().height * 2.0))
    slider:setPercent(52)
    slider:addEventListenerSlider(sliderEvent)
    layer:addChild(slider)
    ]]
    local function sliderEvent(sender, eventType)
        if eventType == ccui.SliderEventType.percentChanged then
            --print("SliderPercent = ", sender:getPercent() / 100.0)
            self:hanldeSliderEvent(sender, eventType)
        end
    end
    self.unit_Slider_num:addEventListener(sliderEvent)   --addEventListener  --addEventListenerSlider

    self.Button_save = generalUnitNode:getChildByName("Button_save")   --部曲保存
    self.Button_save:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_update = generalUnitNode:getChildByName("Button_update")    --部曲升阶
    self.Button_update:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_useItem = generalUnitNode:getChildByName("Button_useItem")   --使用背包士兵Item
    self.Button_useItem:addTouchEventListener(handler(self,self.touchEvent))

    --背包士兵Item列表
    self.ListView_Item = generalUnitNode:getChildByName("ListView_Item")
    self.ListView_Item:setTouchEnabled(true)
    self.ListView_Item:setBounceEnabled(true)
    self.ListView_Item:setScrollBarEnabled(false)   --屏蔽列表滚动条
    self.ListView_Item:setItemsMargin(10.0)
    self.ListView_ItemSize = self.ListView_Item:getContentSize()


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

        self.generalInfoNode:setVisible(true)
        self.generalUnitNode:setVisible(false)
    elseif idx == 2 then   --武将部曲
        self.Button_InfoRadio:loadTextureNormal("public_radio1.png", ccui.TextureResType.plistType)
        self.Button_armyRadio:loadTextureNormal("public_radio2.png", ccui.TextureResType.plistType)
        self.Button_skillRadio:loadTextureNormal("public_radio1.png", ccui.TextureResType.plistType)

        self.Button_armyRadio_Text:enableOutline(g_ColorDef.DarkRed, 1)
        self.Button_InfoRadio_Text:disableEffect()
        self.Button_skillRadio_Text:disableEffect()

        self.generalInfoNode:setVisible(false)
        self.generalUnitNode:setVisible(true)
    elseif idx == 3 then   --武将技能
        self.Button_InfoRadio:loadTextureNormal("public_radio1.png", ccui.TextureResType.plistType)
        self.Button_armyRadio:loadTextureNormal("public_radio1.png", ccui.TextureResType.plistType)
        self.Button_skillRadio:loadTextureNormal("public_radio2.png", ccui.TextureResType.plistType)

        self.Button_skillRadio_Text:enableOutline(g_ColorDef.DarkRed, 1)
        self.Button_InfoRadio_Text:disableEffect()
        self.Button_armyRadio_Text:disableEffect()

        self.generalInfoNode:setVisible(false)
        self.generalUnitNode:setVisible(false)
    end
end

function GeneralLayer:LoadGeneralList()
    self.generalVec = {}
    self.generalCellVec = {}

    if self.ListView_general then
        self.ListView_general:removeAllChildren()
    end

    local function callFunc(target, tagIdx)
        self:ListCellCallBack(target, tagIdx)
    end

    local generalVec = g_HeroDataMgr:GetAllGeneralData()
    local idx = 0
    for k, generalData in pairs(generalVec) do 
        if generalData then
            local officalData = g_pTBLMgr:getOfficalConfigById(generalData.offical)
            generalData.officalData = officalData  --官职信息
            generalData.maxBingCount = 1000
            if officalData then
                generalData.maxBingCount = generalData.maxBingCount + officalData.troops   --单个部曲最大带兵数
            end
            table.insert(self.generalVec, generalData)

            idx = idx + 1
            local officerCell = SmallOfficerCell:new()
            officerCell:initData(generalData, idx) 
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
    self.ListView_general:forceDoLayout()   --forceDoLayout   --refreshView

    self.lastSelOfficalIdx = 1
    self.lastSelOfficalCell = self.generalCellVec[1]
    if self.lastSelOfficalCell then
        self.lastSelOfficalCell:showSelEffect(true)
    end
    self:initGeneralData(self.generalVec[1])
end

function GeneralLayer:ListCellCallBack(target, tagIdx)
    --G_Log_Info("GeneralLayer:ListCellCallBack(), tagIdx = %d", tagIdx)
    if self.lastSelOfficalCell and target ~= self.lastSelOfficalCell then
        self.lastSelOfficalCell:showSelEffect(false)
    end
    self.lastSelOfficalCell = target
    self.lastSelOfficalIdx = tagIdx
    if self.lastSelOfficalCell then
        self.lastSelOfficalCell:showSelEffect(true)
    end

    local generalData = self.generalVec[self.lastSelOfficalIdx]
    self:initGeneralData(generalData) 
end

function GeneralLayer:initGeneralData(generalData)  
    --G_Log_Dump(generalData, "generalData = ")
    self.GeneralData = generalData
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

    --初始化信息界面UI
    self:initInfoUI()

    --部曲信息
    self:initUnitUI()

end

--初始化信息界面UI
function GeneralLayer:initInfoUI()
    --头像背景
    local bgHeadSize = self.info_Image_headBg:getContentSize()
    if not self.info_headImg then
        self.info_headImg =  ccui.ImageView:create(string.format("Head/%s.png", self.GeneralData.id_str), ccui.TextureResType.localType)
        self.info_headImg:setScale(bgHeadSize.width/self.info_headImg:getContentSize().width)
        self.info_headImg:setPosition(cc.p(bgHeadSize.width/2, bgHeadSize.height/2))
        self.info_Image_headBg:addChild(self.info_headImg)
    else
        self.info_headImg:loadTexture(string.format("Head/%d.png", self.GeneralData.id_str), ccui.TextureResType.localType)
    end
    --品质颜色
    local colorIdx = G_GetGeneralColorIdxByLv(self.GeneralData.level)
    if colorIdx > 0 and colorIdx <=5 then
        self.info_Image_color:setVisible(true)
        self.info_Image_color:loadTexture(string.format("public_colorBg%d.png", colorIdx), ccui.TextureResType.plistType)
        --self.info_Image_color:setScale(bgHeadSize.width/self.info_headImg:getContentSize().width)

        self.unit_Image_color:setVisible(true)
        self.unit_Image_color:loadTexture(string.format("public_colorBg%d.png", colorIdx), ccui.TextureResType.plistType)
        --self.unit_Image_color:setScale(bgHeadSize.width/self.info_headImg:getContentSize().width)
    else
        self.info_Image_color:setVisible(false)
        self.unit_Image_color:setVisible(false)
    end

    self.info_Text_desc:setString(lua_Role_TypeStrVec[self.GeneralData.type])   --武将类型，英雄，武将，文官

    self:initInfoRightUI(0)

    self.info_Image_sel:setVisible(false)
    self.info_Image_toukui:removeAllChildren()
    self.info_Image_wuqi:removeAllChildren()
    self.info_Image_hujia:removeAllChildren()
    self.info_Image_zuoqi:removeAllChildren()
    self.info_Image_daoju:removeAllChildren()

    self.GeneralEquipVec = {-1, -1, -1, -1, -1}   --武将头盔、武器、护甲、坐骑、道具信息，-1表示未装备

    for k, equip in pairs(self.GeneralData.equipVec) do
        local equipData = g_pTBLMgr:getItemConfigTBLDataById(equip.equipId) 
        if equipData then
            local colorIdx = G_GetGeneralColorIdxByLv(equipData.quality)
            if colorIdx <= 0 or colorIdx >5 then
                colorIdx = 1
            end
            local colorImg = ccui.ImageView:create(string.format("public_colorBg%d.png", colorIdx), ccui.TextureResType.plistType)
            local iconImg = ccui.ImageView:create(string.format("Item/%s.png", equipData.id_str), ccui.TextureResType.localType)
            iconImg:setPosition(cc.p(colorImg:getContentSize().width/2, colorImg:getContentSize().height/2))
            --iconImg:setAnchorPoint(cc.p(0, 0))
            colorImg:addChild(iconImg)
            colorImg:setPosition(cc.p(self.info_Image_toukui:getContentSize().width/2, self.info_Image_toukui:getContentSize().height/2))
            --colorImg:setAnchorPoint(cc.p(0, 0))

            if equipData.type == g_ItemType.Item_General_toukui then   --头盔
                self.GeneralEquipVec[1] = equipData
                self.info_Image_toukui:addChild(colorImg)
            elseif equipData.type == g_ItemType.Item_General_wuqi then  --武器
                self.GeneralEquipVec[2] = equipData
                self.info_Image_wuqi:addChild(colorImg)
            elseif equipData.type == g_ItemType.Item_General_hujia then   --护甲
                self.GeneralEquipVec[3] = equipData
                self.info_Image_hujia:addChild(colorImg)
            elseif equipData.type == g_ItemType.Item_General_zuoqi then   --坐骑
                self.GeneralEquipVec[4] = equipData
                self.info_Image_zuoqi:addChild(colorImg)
            elseif equipData.type == g_ItemType.Item_General_daoju then   --道具
                self.GeneralEquipVec[5] = equipData
                self.info_Image_daoju:addChild(colorImg)
            end
        end
    end
end

--初始化信息界面右侧信息（武将信息0或装备信息1-5）
function GeneralLayer:initInfoRightUI(nType)
    if nType == 0 then
        self.info_Text_name:setString(self.GeneralData.name)    --名称
        self.info_Text_lv:setString(string.format(lua_Role_String2, self.GeneralData.level))     --等级
        self.info_Text_generalDesc:setString(self.GeneralData.desc)  --武将简介

        self.info_Text_hp:setString(string.format(lua_Role_String3, self.GeneralData.hp))    --血量
        self.info_Text_mp:setString(string.format(lua_Role_String4, self.GeneralData.mp))    --智力
        self.info_Text_att:setString(string.format(lua_Role_String5, self.GeneralData.atk))   --攻击
        self.info_Text_def:setString(string.format(lua_Role_String6, self.GeneralData.def))   --防御

        local officalName = lua_Role_String_No
        if self.GeneralData.officalData then
            officalName = self.GeneralData.officalData.name
        end
        self.info_Text_offical:setString(string.format(lua_Role_String9, officalName))   --官职
        self.info_Text_zhongcheng:setString(string.format(lua_Role_String10, self.GeneralData.zhongcheng))  --忠诚度
    else
        local equipData = self.GeneralEquipVec[nType]  --武将头盔、武器、护甲、坐骑、道具信息, -1表示未装备
        if not equipData or equipData == -1 then
            self.info_Text_name:setString(lua_general_Str2)    --名称   --"未装备"
            self.info_Text_lv:setString("")     --等级
            self.info_Text_generalDesc:setString(lua_general_Str2)  --简介

            self.info_Text_hp:setString(string.format(lua_Role_String3, 0))    --血量
            self.info_Text_mp:setString(string.format(lua_Role_String4, 0))    --智力
            self.info_Text_att:setString(string.format(lua_Role_String5, 0))   --攻击
            self.info_Text_def:setString(string.format(lua_Role_String6, 0))   --防御

            self.info_Text_offical:setString("")   --官职
            self.info_Text_zhongcheng:setString("")  --忠诚度
        else
            self.info_Text_name:setString(equipData.name)    --名称
            self.info_Text_lv:setString(string.format(lua_Role_String2, equipData.level))     --等级
            self.info_Text_generalDesc:setString(equipData.desc)  --简介

            self.info_Text_hp:setString(string.format(lua_Role_String3, equipData.hp))    --血量
            self.info_Text_mp:setString(string.format(lua_Role_String4, equipData.mp))    --智力
            self.info_Text_att:setString(string.format(lua_Role_String5, equipData.atk))   --攻击
            self.info_Text_def:setString(string.format(lua_Role_String6, equipData.def))   --防御

            self.info_Text_offical:setString("")   --官职
            self.info_Text_zhongcheng:setString("")  --忠诚度
        end
    end
end

function GeneralLayer:touchImageEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.info_Image_headBg then   --头像背景
            self.info_Image_sel:setVisible(false)
            self:initInfoRightUI(0)
        elseif sender == self.info_Image_toukui then   --头盔
            self.info_Image_sel:setPosition(cc.p(self.info_Image_toukui:getPosition()))
            self.info_Image_sel:setVisible(true)
            self:initInfoRightUI(1)
        elseif sender == self.info_Image_wuqi then  --武器
            self.info_Image_sel:setPosition(cc.p(self.info_Image_wuqi:getPosition()))
            self.info_Image_sel:setVisible(true)
            self:initInfoRightUI(2)
        elseif sender == self.info_Image_hujia then   --护甲
            self.info_Image_sel:setPosition(cc.p(self.info_Image_hujia:getPosition()))
            self.info_Image_sel:setVisible(true)
            self:initInfoRightUI(3)
        elseif sender == self.info_Image_zuoqi then   --坐骑
            self.info_Image_sel:setPosition(cc.p(self.info_Image_zuoqi:getPosition()))
            self.info_Image_sel:setVisible(true)
            self:initInfoRightUI(4)
        elseif sender == self.info_Image_daoju then   --道具
            self.info_Image_sel:setPosition(cc.p(self.info_Image_daoju:getPosition()))
            self.info_Image_sel:setVisible(true)
            self:initInfoRightUI(5)
        elseif sender == self.unit_Image_qibing then    --骑兵部曲
            self.unit_Image_sel:setPosition(cc.p(self.unit_Image_qibing:getPosition()))
            self.unit_Image_sel:setVisible(true)
            self:initUnitRightUI(4)
        elseif sender == self.unit_Image_qiangbing then  --枪兵部曲
            self.unit_Image_sel:setPosition(cc.p(self.unit_Image_qiangbing:getPosition()))
            self.unit_Image_sel:setVisible(true)
            self:initUnitRightUI(1)
        elseif sender == self.unit_Image_daobing then   --刀兵部曲
            self.unit_Image_sel:setPosition(cc.p(self.unit_Image_daobing:getPosition()))
            self.unit_Image_sel:setVisible(true)
            self:initUnitRightUI(2)
        elseif sender == self.unit_Image_gongbing then   --弓兵部曲
            self.unit_Image_sel:setPosition(cc.p(self.unit_Image_gongbing:getPosition()))
            self.unit_Image_sel:setVisible(true)
            self:initUnitRightUI(3)
        end
    end
end

--初始化部曲增兵界面显示
function GeneralLayer:initUnitUI()
    self.unit_Text_cost:setVisible(false)   --花费金币
    self.unit_Text_cost_gold:setString("")   --花费金币数量
    self.unit_Slider_num:setPercent(100)   ----滑动条
    self.unit_Slider_num:setPercent(0)
    self.unit_Slider_num:setEnabled(true)

    local bgHeadSize = self.info_Image_headBg:getContentSize()
    if not self.unit_headImg then  --头像背景
        self.unit_headImg =  ccui.ImageView:create(string.format("Head/%s.png", self.GeneralData.id_str), ccui.TextureResType.localType)
        self.unit_headImg:setScale(bgHeadSize.width/self.unit_headImg:getContentSize().width)
        self.unit_headImg:setPosition(cc.p(bgHeadSize.width/2, bgHeadSize.height/2))
        self.unit_Image_headBg:addChild(self.unit_headImg)
    else
        self.unit_headImg:loadTexture(string.format("Head/%d.png", self.GeneralData.id_str), ccui.TextureResType.localType)
    end
    self.unit_Text_name:setString(self.GeneralData.name)    --武将名称

    self.unit_Image_qiangbing:removeAllChildren()
    self.unit_Image_daobing:removeAllChildren()
    self.unit_Image_gongbing:removeAllChildren()
    self.unit_Image_qibing:removeAllChildren()

    self.unit_Image_sel:setPosition(cc.p(self.unit_Image_qibing:getPosition()))
    self.unit_Image_sel:setVisible(true)

    self.GeneralUnitVec = {-1, -1, -1, -1}   --武将枪兵\刀兵\弓兵\骑兵部曲信息，-1表示未组建
    local defaultIdx = -1  --默认选中的部曲框
    for k, unitData in pairs(self.GeneralData.armyUnitVec) do
        local iconImg = ccui.ImageView:create(string.format("Item/%s.png", unitData.bingIdStr), ccui.TextureResType.localType)
        iconImg:setPosition(cc.p(self.unit_Image_qibing:getContentSize().width/2, self.unit_Image_qibing:getContentSize().height/2))

        local bingId = tonumber(unitData.bingIdStr)
        if bingId == g_ItemIdDef.Item_Id_qiangbing then   --枪兵
            self.GeneralUnitVec[1] = unitData
            self.unit_Image_qiangbing:addChild(iconImg)
            if defaultIdx < 0 then
                self.unit_Image_sel:setPosition(cc.p(self.unit_Image_qiangbing:getPosition()))
                defaultIdx = 1 
            end
        elseif bingId == g_ItemIdDef.Item_Id_daobing then   --刀兵
            self.GeneralUnitVec[2] = unitData
            self.unit_Image_daobing:addChild(iconImg)
            if defaultIdx < 0 then
                self.unit_Image_sel:setPosition(cc.p(self.unit_Image_daobing:getPosition()))
                defaultIdx = 2 
            end
        elseif bingId == g_ItemIdDef.Item_Id_gongbing then   --弓兵
            self.GeneralUnitVec[3] = unitData
            self.unit_Image_gongbing:addChild(iconImg)
            if defaultIdx < 0 then
                self.unit_Image_sel:setPosition(cc.p(self.unit_Image_gongbing:getPosition()))
                defaultIdx = 3 
            end
        elseif bingId == g_ItemIdDef.Item_Id_qibing then   --骑兵
            self.GeneralUnitVec[4] = unitData
            self.unit_Image_qibing:addChild(iconImg)
            if defaultIdx < 0 then
                defaultIdx = 4 
            end
        end
    end
    if defaultIdx < 0 then
        defaultIdx = 4 
    end 

    local PrepTroops = g_HeroDataMgr:GetHeroPrepTroops()  --获取可用劳力（预备役）人数
    self.unit_Text_bingCount:setString(string.format(lua_Role_String11, PrepTroops) )  --预备兵数量

    local bingjiaItem = g_HeroDataMgr:GetBagItemDataById(tostring(g_ItemIdDef.Item_Id_bingjia))
    self.unit_Text_bingjia:setString(string.format(lua_Role_String12, bingjiaItem and bingjiaItem.num or 0) )  --兵甲数量

    self:initUnitRightUI(defaultIdx)
end

function GeneralLayer:hanldeSliderEvent(sender, eventType)
    if eventType == ccui.SliderEventType.percentChanged then
        local addSoliderNum = sender:getPercent()
        --G_Log_Info("addSoliderNum = %d", addSoliderNum)
    end
end

--初始化部曲界面右侧信息（部曲信息1-4），默认选中武将默认兵种
function GeneralLayer:initUnitRightUI(nType)
    self.SelUnitIdx = nType 
    local unitData = self.GeneralUnitVec[self.SelUnitIdx]  --武将枪兵\刀兵\弓兵\骑兵部曲信息，-1表示未组建

    if not unitData or unitData == -1 then
        self.unit_Slider_num:setMaxPercent(100)   --默认是100
        self.unit_Slider_num:setPercent(0)
        self.unit_Slider_num:setEnabled(false)
        self.unit_Text_numCount:setString("+0")
        self.unit_Text_bingqi:setString("")   --兵器数量
        self.unit_Text_mapi:setString("")    --马匹数量
        self.unit_Text_UnitName:setString(lua_general_Str3..lua_unitNameVec[nType])   --部曲名称  --"未组建"
        self.unit_Text_UnitLv:setString("")   --部曲等级
    else
        local offsetCount = self.GeneralData.maxBingCount - unitData.bingCount
        if offsetCount <= 0 then
            self.unit_Slider_num:setMaxPercent(100)   --默认是100
            self.unit_Slider_num:setPercent(0)
            self.unit_Slider_num:setEnabled(false)
        else
            self.unit_Slider_num:setMaxPercent(offsetCount)   --默认是100
            self.unit_Slider_num:setPercent(0)
            self.unit_Slider_num:setEnabled(true)
        end
        self.unit_Text_numCount:setString(string.format("+%d(%d/%d)", 0, unitData.bingCount, self.GeneralData.maxBingCount))   --选中部曲的数量
        self.unit_Text_mapi:setString("")    --马匹数量
        if nType == 1 then
            local item = g_HeroDataMgr:GetBagItemDataById(tostring(g_ItemIdDef.Item_Id_qiangji))
            self.unit_Text_bingqi:setString(string.format(lua_Role_String13, item and item.num or 0) )  --枪戟数
            self:LoadSoliderItemList(g_ItemIdDef.Item_Id_qiangbing)
        elseif nType == 2 then
            local item = g_HeroDataMgr:GetBagItemDataById(tostring(g_ItemIdDef.Item_Id_daojian))
            self.unit_Text_bingqi:setString(string.format(lua_Role_String14, item and item.num or 0) )  --刀剑数
            self:LoadSoliderItemList(g_ItemIdDef.Item_Id_daobing)
        elseif nType == 3 then
            local item = g_HeroDataMgr:GetBagItemDataById(tostring(g_ItemIdDef.Item_Id_gongnu))
            self.unit_Text_bingqi:setString(string.format(lua_Role_String15, item and item.num or 0) )  --弓弩数
            self:LoadSoliderItemList(g_ItemIdDef.Item_Id_gongbing)
        elseif nType == 4 then
            self.unit_Text_bingqi:setString("")   --兵器数量
            local item = g_HeroDataMgr:GetBagItemDataById(tostring(g_ItemIdDef.Item_Id_mapi))
            self.unit_Text_mapi:setString(string.format(lua_Role_String16, item and item.num or 0) )  --马匹数
            self:LoadSoliderItemList(g_ItemIdDef.Item_Id_qibing)
        end
        self.unit_Text_UnitName:setString(lua_unitNameVec[nType])   --部曲名称
        self.unit_Text_UnitLv:setString(string.format(lua_Role_String17, unitData.level))   --部曲等级
    end
end

--加载背包中的预备役士兵,401-404:枪兵\刀兵\弓兵\骑兵
function GeneralLayer:LoadSoliderItemList(soliderId)
    self.SoliderItemVec = {}  
    self.SoliderItemCellVec = {}

    self.ListView_Item:removeAllChildren()

    local function callFunc(target, tagIdx)
        self:SoliderItemListCallBack(target, tagIdx)
    end

    local soliderList = g_HeroDataMgr:GetSoliderItemListById(soliderId)
    if soliderList and #soliderList >0 then
        self.ListView_Item:setVisible(true)
        self.Button_useItem:setVisible(true)

        for k, item in pairs(soliderList) do  --{["itemId"] = itemId, ["num"] = itemNum }
            local soliderData = g_pTBLMgr:getItemConfigTBLDataById(item.itemId) 
            if soliderData then
                soliderData.num = item.num
                table.insert(self.SoliderItemVec, soliderData)

                local itemCell = ItemCell:new()
                itemCell:initData(soliderData, k) 
                itemCell:setSelCallBack(callFunc)
                table.insert(self.SoliderItemCellVec, itemCell)

                local cur_item = ccui.Layout:create()
                cur_item:setContentSize(itemCell:getContentSize())
                cur_item:addChild(itemCell)
                --cur_item:setEnabled(true)

                self.ListView_Item:addChild(cur_item)
                local pos = cc.p(cur_item:getPosition())
            end
        end
        local len = #self.SoliderItemCellVec
        local InnerWidth = len*90 + 10*(len-1)
        if InnerWidth < self.ListView_ItemSize.width then
            self.ListView_Item:setContentSize(cc.size(InnerWidth, self.ListView_ItemSize.height))
            self.ListView_Item:setBounceEnabled(false)
        else
            self.ListView_Item:setContentSize(self.ListView_ItemSize)
            self.ListView_Item:setBounceEnabled(true)
        end
        self.ListView_Item:forceDoLayout()   --forceDoLayout   --refreshView
    else
        self.ListView_Item:setVisible(false)
        self.Button_useItem:setVisible(false)
    end

    self.lastSelSoliderIdx = 1
    self.lastSelSoliderCell = self.SoliderItemCellVec[1]
    if self.lastSelSoliderCell then
        self.lastSelSoliderCell:showSelEffect(true)
    end
end

function GeneralLayer:SoliderItemListCallBack(target, tagIdx)
    --G_Log_Info("GeneralLayer:SoliderItemListCallBack(), tagIdx = %d", tagIdx)
    if self.lastSelSoliderCell and target ~= self.lastSelSoliderCell then
        self.lastSelSoliderCell:showSelEffect(false)
    end
    self.lastSelSoliderCell = target
    if self.lastSelSoliderCell then
        self.lastSelSoliderCell:showSelEffect(true)
    end

    self.lastSelSoliderIdx = tagIdx
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
        elseif sender == self.Button_save then   --部曲保存
        elseif sender == self.Button_update then   --部曲升阶
        elseif sender == self.Button_useItem then   --使用背包士兵Item
            local unitData = self.GeneralUnitVec[self.SelUnitIdx]  --武将枪兵\刀兵\弓兵\骑兵部曲信息，-1表示未组建
            if not unitData or unitData == -1 then   --未组建
                g_pGameLayer:ShowScrollTips(lua_str_WarnTips8, g_ColorDef.Red, g_defaultTipsFontSize)  -- "该兵种部曲未解锁，暂不能组建！"
                return
            end

            if self.lastSelSoliderIdx and self.lastSelSoliderIdx > 0 then
                local soliderData = self.SoliderItemVec[self.lastSelSoliderIdx]
                if soliderData then
                    if tonumber(unitData.bingIdStr) ~= tonumber(soliderData.id_str) then
                        G_Log_Error("错误，兵种类型不一致！")
                        return
                    end

                    local costNum = self.GeneralData.maxBingCount - unitData.bingCount
                    if costNum == 0 then
                        g_pGameLayer:ShowScrollTips(lua_str_WarnTips9, g_ColorDef.Red, g_defaultTipsFontSize)  -- "该兵种部曲士兵已满员！"
                        return
                    end

                    local offsetCount = soliderData.num - costNum
                    if offsetCount >= 0 then   --有剩余
                        unitData.bingCount = self.GeneralData.maxBingCount
                    else
                        unitData.bingCount = unitData.bingCount + soliderData.num
                        costNum = soliderData.num
                    end

                    if unitData.bingCount >0 and unitData.level == 0 then   --初次组建
                        unitData.level = 1
                    end

                    g_HeroDataMgr:SetSingleGeneralUnit(self.GeneralData.id_str, unitData)   --保存玩家单个武将单个部曲数据到generalXML

                    self.GeneralUnitVec[self.SelUnitIdx] = unitData
                    for k, data in pairs(self.GeneralData.armyUnitVec) do
                        if tonumber(data.bingIdStr) == tonumber(unitData.bingIdStr) then
                            self.GeneralData.armyUnitVec[k] = clone(unitData)
                        end
                    end
                    self.generalVec[self.lastSelOfficalIdx] = self.GeneralData

                    --dump(self.generalVec, "self.generalVec = ", 5)
                    local bagItemVec = {
                        {["itemId"] = soliderData.id_str, ["num"] = -1*costNum}
                    }
                    g_HeroDataMgr:SetBagXMLData(bagItemVec)   --保存玩家背包物品数据到bagXML

                    self:initUnitRightUI(self.SelUnitIdx)
                end
            end
        end
    end
end


return GeneralLayer
