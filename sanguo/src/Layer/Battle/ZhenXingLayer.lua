
--阵型|布阵界面
local ZhenXingLayer = class("ZhenXingLayer", CCLayerEx)

local SmallOfficerCell = require("Layer.Role.SmallOfficerCell")

function ZhenXingLayer:create()   --自定义的create()创建方法
    --G_Log_Info("ZhenXingLayer:create()")
    local layer = ZhenXingLayer.new()
    return layer
end

function ZhenXingLayer:onExit()
    --G_Log_Info("ZhenXingLayer:onExit()")
end

--初始化UI界面
function ZhenXingLayer:init()  
    --G_Log_Info("ZhenXingLayer:init()")
    local csb = cc.CSLoader:createNode("csd/ZhenXingLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    --self:showInTheMiddle(csb)

    self.Image_bg = csb:getChildByName("Image_bg")   --界面背景
    self.titleBg = self.Image_bg:getChildByName("titleBg")
    self.Text_title = self.Image_bg:getChildByName("Text_title")  --标题
    self.Button_close = self.Image_bg:getChildByName("Button_close")   
    self.Button_close:addTouchEventListener(handler(self,self.touchEvent))

    --选阵
    self.Button_xuanzhenRadio = self.Image_bg:getChildByName("Button_xuanzhenRadio")
    self.Button_xuanzhenRadio:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_xuanzhenRadio_Text = self.Button_xuanzhenRadio:getChildByName("Text_btn")

    --布阵
    self.Button_buzhenRadio = self.Image_bg:getChildByName("Button_buzhenRadio")
    self.Button_buzhenRadio:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_buzhenRadio_Text = self.Button_buzhenRadio:getChildByName("Text_btn")

    self.Panel_Info = self.Image_bg:getChildByName("Panel_Info")

    --选阵界面
    self.xuanZhenNode = self.Panel_Info:getChildByName("xuanZhenNode")

    self.xuan_Text_selFightZhen = self.xuanZhenNode:getChildByName("Text_selFightZhen") --选择出战阵型
    self.xuan_Button_left = self.xuanZhenNode:getChildByName("Button_left")   --选中左侧攻击阵型
    self.xuan_Button_left:addTouchEventListener(handler(self,self.touchEvent))
    self.xuan_Button_right = self.xuanZhenNode:getChildByName("Button_right")   --选中右侧防御阵型
    self.xuan_Button_right:addTouchEventListener(handler(self,self.touchEvent))

    self.xuan_Button_AttEdit = self.xuanZhenNode:getChildByName("Button_AttEdit")   --编辑攻击阵型
    self.xuan_Button_AttEdit:addTouchEventListener(handler(self,self.touchEvent))
    self.xuan_Button_defEdit = self.xuanZhenNode:getChildByName("Button_defEdit")   --编辑防御阵型
    self.xuan_Button_defEdit:addTouchEventListener(handler(self,self.touchEvent))

    --攻击阵型
    self.xuan_Image_att = self.xuanZhenNode:getChildByName("ImageNode_att")    --攻击阵型
    self.xuan_Node_att = self.xuan_Image_att:getChildByName("zhenUINode")

    self.xuan_Node_att_help = self.xuan_Node_att:getChildByName("Button_help")   --布阵UI节点中的help，展示阵型信息
    self.xuan_Node_att_help:addTouchEventListener(handler(self,self.touchEvent))
    self.xuan_Node_att_sel = self.xuan_Node_att:getChildByName("Image_sel")  --布阵UI节点中的选中框
    self.xuan_Node_att_sel:setVisible(false)
    self.xuan_Node_att_qianfeng = self.xuan_Node_att:getChildByName("Image_qianfeng")   --布阵UI节点中的前锋营
    self.xuan_Node_att_zuohu = self.xuan_Node_att:getChildByName("Image_zuohu")   --布阵UI节点中的左护军
    self.xuan_Node_att_youhu = self.xuan_Node_att:getChildByName("Image_youhu")   --布阵UI节点中的右护军
    self.xuan_Node_att_houwei = self.xuan_Node_att:getChildByName("Image_houwei")   --布阵UI节点中的后卫营
    self.xuan_Node_att_zhushuai = self.xuan_Node_att:getChildByName("Image_zhushuai")   --布阵UI节点中的中军主帅
    self.xuan_Node_att_zhongjun1 = self.xuan_Node_att:getChildByName("Image_zhongjun1")   --布阵UI节点中的中军将1（上）
    self.xuan_Node_att_zhongjun2 = self.xuan_Node_att:getChildByName("Image_zhongjun2")   --布阵UI节点中的中军将2（下）

    --防御阵型
    self.xuan_Image_def = self.xuanZhenNode:getChildByName("ImageNode_def")    --防御阵型
    self.xuan_Node_def = self.xuan_Image_def:getChildByName("zhenUINode") 

    self.xuan_Node_def_help = self.xuan_Node_def:getChildByName("Button_help")   --布阵UI节点中的help，展示阵型信息
    self.xuan_Node_def_help:addTouchEventListener(handler(self,self.touchEvent))
    self.xuan_Node_def_sel = self.xuan_Node_def:getChildByName("Image_sel")  --布阵UI节点中的选中框
    self.xuan_Node_def_sel:setVisible(false)
    self.xuan_Node_def_qianfeng = self.xuan_Node_def:getChildByName("Image_qianfeng")   --布阵UI节点中的前锋营
    self.xuan_Node_def_zuohu = self.xuan_Node_def:getChildByName("Image_zuohu")   --布阵UI节点中的左护军
    self.xuan_Node_def_youhu = self.xuan_Node_def:getChildByName("Image_youhu")   --布阵UI节点中的右护军
    self.xuan_Node_def_houwei = self.xuan_Node_def:getChildByName("Image_houwei")   --布阵UI节点中的后卫营
    self.xuan_Node_def_zhushuai = self.xuan_Node_def:getChildByName("Image_zhushuai")   --布阵UI节点中的中军主帅
    self.xuan_Node_def_zhongjun1 = self.xuan_Node_def:getChildByName("Image_zhongjun1")   --布阵UI节点中的中军将1（上）
    self.xuan_Node_def_zhongjun2 = self.xuan_Node_def:getChildByName("Image_zhongjun2")   --布阵UI节点中的中军将2（下）

    --布阵界面
    self.buZhenNode = self.Panel_Info:getChildByName("buZhenNode")

    self.bu_ImageNode = self.buZhenNode:getChildByName("Image_buzhen")  --布阵节点 
    self.bu_Node_zhen = self.bu_ImageNode:getChildByName("zhenUINode") 

    self.bu_Node_zhen_help = self.bu_Node_zhen:getChildByName("Button_help")   --布阵UI节点中的help，展示阵型信息
    self.bu_Node_zhen_help:addTouchEventListener(handler(self,self.touchEvent))
    self.bu_Node_zhen_sel = self.bu_Node_zhen:getChildByName("Image_sel")  --布阵UI节点中的选中框
    self.bu_Node_zhen_sel:setVisible(false)
    self.bu_Node_zhen_qianfeng = self.bu_Node_zhen:getChildByName("Image_qianfeng")   --布阵UI节点中的前锋营
    self.bu_Node_zhen_qianfeng:addTouchEventListener(handler(self,self.touchEvent))
    self.bu_Node_zhen_zuohu = self.bu_Node_zhen:getChildByName("Image_zuohu")   --布阵UI节点中的左护军
    self.bu_Node_zhen_zuohu:addTouchEventListener(handler(self,self.touchEvent))
    self.bu_Node_zhen_youhu = self.bu_Node_zhen:getChildByName("Image_youhu")   --布阵UI节点中的右护军
    self.bu_Node_zhen_youhu:addTouchEventListener(handler(self,self.touchEvent))
    self.bu_Node_zhen_houwei = self.bu_Node_zhen:getChildByName("Image_houwei")   --布阵UI节点中的后卫营
    self.bu_Node_zhen_houwei:addTouchEventListener(handler(self,self.touchEvent))
    self.bu_Node_zhen_zhushuai = self.bu_Node_zhen:getChildByName("Image_zhushuai")   --布阵UI节点中的中军主帅
    self.bu_Node_zhen_zhushuai:addTouchEventListener(handler(self,self.touchEvent))
    self.bu_Node_zhen_zhongjun1 = self.bu_Node_zhen:getChildByName("Image_zhongjun1")   --布阵UI节点中的中军将1（上）
    self.bu_Node_zhen_zhongjun1:addTouchEventListener(handler(self,self.touchEvent))
    self.bu_Node_zhen_zhongjun2 = self.bu_Node_zhen:getChildByName("Image_zhongjun2")   --布阵UI节点中的中军将2（下）
    self.bu_Node_zhen_zhongjun2:addTouchEventListener(handler(self,self.touchEvent))

    self.bu_Node_zhen_save = self.buZhenNode:getChildByName("Button_save")      --保存阵型
    self.bu_Node_zhen_save:addTouchEventListener(handler(self,self.touchEvent))
    self.bu_Node_zhen_cancel = self.buZhenNode:getChildByName("Button_cancel")       --部曲下阵
    self.bu_Node_zhen_cancel:addTouchEventListener(handler(self,self.touchEvent))
    self.bu_Node_zhen_fight = self.buZhenNode:getChildByName("Button_fight")      --部曲上阵
    self.bu_Node_zhen_fight:addTouchEventListener(handler(self,self.touchEvent))

    -- local function touchListViewEvent(sender, event)
    --     if event == ccui.TouchEventType.began then --0began
    --         local listPos_begin = cc.p(sender:getTouchBeganPosition())
    --     elseif event == ccui.TouchEventType.moved then --1moved
    --     elseif event == ccui.TouchEventType.ended then --2ended
    --     else   --3cancelled
    --     end
    -- end

    self.ListView_general = self.buZhenNode:getChildByName("ListView_list")   --武将列表
    self.ListView_general:setBounceEnabled(true)
    self.ListView_general:setScrollBarEnabled(false)   --屏蔽列表滚动条
    self.ListView_general:setInertiaScrollEnabled(false)  --滑动的惯性
    self.ListView_general:setItemsMargin(10.0)
    --self.ListView_general:addTouchEventListener(handler(self,touchListViewEvent))
    self.ListView_generalSize = self.ListView_general:getContentSize()

    --布阵界面武将信息(2为被替换属性)
    self.buzhen_generalName = self.buZhenNode:getChildByName("Text_name")    --武将名称
    self.buzhen_generalName2 = self.buZhenNode:getChildByName("Text_name2")    --被替换武将名称
    self.buzhen_generalName2:setString("")
    self.buzhen_generalLv = self.buZhenNode:getChildByName("Text_lv")    --武将等级
    self.buzhen_generalLv2 = self.buZhenNode:getChildByName("Text_lv2")    
    self.buzhen_generalLv2:setString("")
    self.buzhen_generalHp = self.buZhenNode:getChildByName("Text_hp")    --武将血量
    self.buzhen_generalHp2 = self.buZhenNode:getChildByName("Text_hp2")    
    self.buzhen_generalHp2:setString("")
    self.buzhen_generalMp = self.buZhenNode:getChildByName("Text_mp")    --武将智力
    self.buzhen_generalMp2 = self.buZhenNode:getChildByName("Text_mp2")    
    self.buzhen_generalMp2:setString("")
    self.buzhen_generalAtt = self.buZhenNode:getChildByName("Text_att")    --武将攻击力
    self.buzhen_generalAtt2 = self.buZhenNode:getChildByName("Text_att2")    
    self.buzhen_generalAtt2:setString("")
    self.buzhen_generalDef = self.buZhenNode:getChildByName("Text_def")    --武将防御力
    self.buzhen_generalDef2 = self.buZhenNode:getChildByName("Text_def2")    
    self.buzhen_generalDef2:setString("")

    --布阵界面部曲信息
    self.buzhen_selImg = self.buZhenNode:getChildByName("Image_sel")  --布阵界面武将部曲选中框
    self.buzhen_selImg:setVisible(false)
    self.buzhen_qiangbing = self.buZhenNode:getChildByName("Image_qiangbing")   --布阵界面枪兵组
    self.buzhen_qiangbing:addTouchEventListener(handler(self,self.touchEvent))
    self.buzhen_daobing = self.buZhenNode:getChildByName("Image_daobing")   --布阵界面刀兵组
    self.buzhen_daobing:addTouchEventListener(handler(self,self.touchEvent))
    self.buzhen_gongbing = self.buZhenNode:getChildByName("Image_gongbing")   --布阵界面弓兵组
    self.buzhen_gongbing:addTouchEventListener(handler(self,self.touchEvent))
    self.buzhen_qibing = self.buZhenNode:getChildByName("Image_qibing")   --布阵界面骑兵组
    self.buzhen_qibing:addTouchEventListener(handler(self,self.touchEvent))

    --布阵界面部曲信息(2为被替换属性)
    self.buzhen_bingType = self.buZhenNode:getChildByName("Text_bingType")    --部曲兵种类型
    self.buzhen_bingType2 = self.buZhenNode:getChildByName("Text_bingType2")    
    self.buzhen_bingType2:setString("")
    self.buzhen_bingCount = self.buZhenNode:getChildByName("Text_bingCount")    --部曲兵力
    self.buzhen_bingCount2 = self.buZhenNode:getChildByName("Text_bingCount2")    
    self.buzhen_bingCount2:setString("")
    self.buzhen_bingLevel = self.buZhenNode:getChildByName("Text_bingLevel")    --部曲等级
    self.buzhen_bingLevel2 = self.buZhenNode:getChildByName("Text_bingLevel2")    
    self.buzhen_bingLevel2:setString("")
    self.buzhen_bingShiQi = self.buZhenNode:getChildByName("Text_bingShiQi")    --部曲士气
    self.buzhen_bingShiQi2 = self.buZhenNode:getChildByName("Text_bingShiQi2")    
    self.buzhen_bingShiQi2:setString("")
    self.buzhen_bingZhen = self.buZhenNode:getChildByName("Text_bingZhen")    --部曲阵型
    self.buzhen_bingZhen2 = self.buZhenNode:getChildByName("Text_bingZhen2")    
    self.buzhen_bingZhen2:setString("")
end

function ZhenXingLayer:setBoolPreFight(bPreFight)
    --print("ZhenXingLayer:setBoolPreFight(), bPreFight = ", bPreFight)
    if bPreFight == true then
        self.bPreFight = true   --是否为出战选阵
    else
        self.bPreFight = false 
    end

    self:setRadioPanel(1) 
end

function ZhenXingLayer:setRadioPanel(idx)
    if idx < 0 or idx > 2 then
        return
    end
    if self.selRadioIdx and self.selRadioIdx == idx then
        return
    end
    self.selRadioIdx = idx

    if idx == 1 then   --选阵
        self.Button_buzhenRadio:loadTextureNormal("public_radio1.png", ccui.TextureResType.plistType)
        self.Button_xuanzhenRadio:loadTextureNormal("public_radio2.png", ccui.TextureResType.plistType)
        self.Button_xuanzhenRadio_Text:enableOutline(g_ColorDef.DarkRed, 1)
        self.Button_buzhenRadio_Text:disableEffect()
        self.xuanZhenNode:setVisible(true)
        self.buZhenNode:setVisible(false)

        self.bZhenEditType = 0   --布阵界面编辑的阵型类型，0默认，1出战阵型，2防御阵型

        if self.bPreFight == true then   --是否为出战选阵
            self.xuan_Text_selFightZhen:setVisible(true) --选择出战阵型
            self.xuan_Button_left:setVisible(true)   --选中左侧攻击阵型
            self.xuan_Button_right:setVisible(true)    --选中右侧防御阵型
        else
            self.xuan_Text_selFightZhen:setVisible(false) --选择出战阵型
            self.xuan_Button_left:setVisible(false)   --选中左侧攻击阵型
            self.xuan_Button_right:setVisible(false)    --选中右侧防御阵型
        end
    elseif idx == 2 then   --布阵
        self.Button_buzhenRadio:loadTextureNormal("public_radio2.png", ccui.TextureResType.plistType)
        self.Button_xuanzhenRadio:loadTextureNormal("public_radio1.png", ccui.TextureResType.plistType)
        self.Button_buzhenRadio_Text:enableOutline(g_ColorDef.DarkRed, 2)
        self.Button_xuanzhenRadio_Text:disableEffect()
        self.buZhenNode:setVisible(true)
        self.xuanZhenNode:setVisible(false)

        if self.bZhenEditType and (self.bZhenEditType == 1 or self.bZhenEditType == 2) then  
            self.bu_Node_zhen_save:setVisible(true)      --保存阵型
            self.bu_Node_zhen_cancel:setVisible(true)       --部曲下阵
            self.bu_Node_zhen_fight:setVisible(true)      --部曲上阵
        else
            self.bu_Node_zhen_save:setVisible(false)      --保存阵型
            self.bu_Node_zhen_cancel:setVisible(false)       --部曲下阵
            self.bu_Node_zhen_fight:setVisible(false)      --部曲上阵
        end

        if not self.generalVec or not self.generalCellVec then
            self:LoadGeneralList()   --加载武将列表
        end

        self:GeneralListCellCallBack(self.generalCellVec[1], 1)   --默认选中第一个武将
    end
end

function ZhenXingLayer:LoadGeneralList()
    self.generalVec = {}
    self.generalCellVec = {}

    if self.ListView_general then
        self.ListView_general:removeAllChildren()
    end

    local function callFunc(target, tagIdx)
        self:GeneralListCellCallBack(target, tagIdx)
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

    --已有的阵型数据1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
    self.buZhenXingData_UnitVec = {-1, -1, -1, -1, -1, -1, -1}   

    if not self.buzhen_SelPreUnitIdx then
        self.buzhen_SelPreUnitIdx = 5 --默认打开布阵选择中军主帅
        self.bu_Node_zhen_sel:setVisible(true)
        self.bu_Node_zhen_sel:setPosition(cc.p(self.bu_Node_zhen_zhushuai:getPosition()))
    end
    self:initBuZhenRight_PreUnitUI(self.buzhen_SelPreUnitIdx)   --显示被替换部曲信息，1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
end

function ZhenXingLayer:GeneralListCellCallBack(target, tagIdx)
    --G_Log_Info("ZhenXingLayer:GeneralListCellCallBack(), tagIdx = %d", tagIdx)
    if self.lastSelOfficalCell and target ~= self.lastSelOfficalCell then
        self.lastSelOfficalCell:showSelEffect(false)
    end
    self.lastSelOfficalCell = target
    self.lastSelOfficalIdx = tagIdx
    if self.lastSelOfficalCell then
        self.lastSelOfficalCell:showSelEffect(true)
    end

    self:initBuZhenRightUI()   --显示布阵界面右侧信息UI
end

 --显示布阵界面右侧信息UI
function ZhenXingLayer:initBuZhenRightUI()  
    if not self.lastSelOfficalIdx or not self.generalVec then
        return
    end

    self.buzhenGeneralData =  self.generalVec[self.lastSelOfficalIdx]
    if self.buzhenGeneralData then
        --布阵界面武将信息(2为被替换属性)
        self.buzhen_generalName:setString(self.buzhenGeneralData.name)   --武将名称
        self.buzhen_generalName2:setString("")   --被替换武将名称
        self.buzhen_generalLv:setString(string.format(lua_Role_String2, self.buzhenGeneralData.level))    --武将等级   
        self.buzhen_generalLv2:setString("")
        self.buzhen_generalHp:setString(string.format(lua_Role_String3, self.buzhenGeneralData.hp))    --武将血量 
        self.buzhen_generalHp2:setString("")
        self.buzhen_generalMp:setString(string.format(lua_Role_String4, self.buzhenGeneralData.mp))    --武将智力 
        self.buzhen_generalMp2:setString("")
        self.buzhen_generalAtt:setString(string.format(lua_Role_String5, self.buzhenGeneralData.atk))    --武将攻击力   
        self.buzhen_generalAtt2:setString("")
        self.buzhen_generalDef:setString(string.format(lua_Role_String6, self.buzhenGeneralData.def))     --武将防御力  
        self.buzhen_generalDef2:setString("")

        self.buzhen_qiangbing:removeAllChildren()
        self.buzhen_daobing:removeAllChildren()
        self.buzhen_gongbing:removeAllChildren()
        self.buzhen_qibing:removeAllChildren()

        self.buzhenGeneralData_UnitVec = {-1, -1, -1, -1}   --武将枪兵\刀兵\弓兵\骑兵部曲信息，-1表示未组建
        local defaultIdx = -1  --默认选中的部曲框   
        for k, unitData in pairs(self.buzhenGeneralData.armyUnitVec) do
            unitData.bingData = g_pTBLMgr:getGeneralConfigTBLDataById(unitData.bingIdStr)   --兵种数据
            unitData.zhenData = nil   --阵型数据

            local iconImg = ccui.ImageView:create(string.format("Item/%s.png", unitData.bingIdStr), ccui.TextureResType.localType)
            iconImg:setPosition(cc.p(self.buzhen_qiangbing:getContentSize().width/2, self.buzhen_qiangbing:getContentSize().height/2))

            local bingId = tonumber(unitData.bingIdStr)   
            if bingId == g_ItemType.Item_Id_qiangbing then  --布阵界面枪兵组
                self.buzhenGeneralData_UnitVec[1] = unitData
                self.buzhen_qiangbing:addChild(iconImg)
                if defaultIdx < 0 then
                    self.buzhen_selImg:setPosition(cc.p(self.buzhen_qiangbing:getPosition()))
                    defaultIdx = 1 
                end
            elseif bingId == g_ItemType.Item_Id_daobing then   --布阵界面刀兵组
                self.buzhenGeneralData_UnitVec[2] = unitData
                self.buzhen_daobing:addChild(iconImg)
                if defaultIdx < 0 then
                    self.buzhen_selImg:setPosition(cc.p(self.buzhen_daobing:getPosition()))
                    defaultIdx = 2 
                end
            elseif bingId == g_ItemType.Item_Id_gongbing then   --布阵界面弓兵组
                self.buzhenGeneralData_UnitVec[3] = unitData
                self.buzhen_gongbing:addChild(iconImg)
                if defaultIdx < 0 then
                    self.buzhen_selImg:setPosition(cc.p(self.buzhen_gongbing:getPosition()))
                    defaultIdx = 3 
                end
            elseif bingId == g_ItemType.Item_Id_qibing then  --布阵界面骑兵组
                self.buzhenGeneralData_UnitVec[4] = unitData
                self.buzhen_qibing:addChild(iconImg)
                if defaultIdx < 0 then
                    self.buzhen_selImg:setPosition(cc.p(self.buzhen_qibing:getPosition()))
                    defaultIdx = 4 
                end
            end
        end
        if defaultIdx < 0 then
            defaultIdx = 1
            self.buzhen_selImg:setPosition(cc.p(self.buzhen_qiangbing:getPosition()))
        end
        self.buzhen_selImg:setVisible(true)

        self:initBuZhenRight_UnitUI(defaultIdx)  --显示布阵界面右侧部曲信息UI(1-4枪兵，刀兵，弓兵，骑兵，0未选中)
    end
end

--显示布阵界面右侧部曲信息UI(1-4枪兵，刀兵，弓兵，骑兵，0未选中)
function ZhenXingLayer:initBuZhenRight_UnitUI(nType) 
    --布阵界面部曲信息(2为被替换属性)
    self.buzhen_SelUnitIdx = nType
    local unitData = self.buzhenGeneralData_UnitVec[self.buzhen_SelUnitIdx]

    if unitData and unitData ~= -1 and unitData.bingData then
        self.buzhen_bingType:setString(string.format(lua_Unit_String1, unitData.bingData.name))   --部曲兵种类型  
        self.buzhen_bingCount:setString(string.format(lua_Unit_String2, unitData.bingCount))    --部曲兵力   
        self.buzhen_bingLevel:setString(string.format(lua_Unit_String3, unitData.level))    --部曲等级  
        self.buzhen_bingShiQi:setString(string.format(lua_Unit_String4, unitData.shiqi))    --部曲士气  
        self.buzhen_bingZhen:setString(string.format(lua_Unit_String5, "无"))    --部曲阵型 
    else
        self.buzhen_bingType:setString(string.format(lua_Unit_String1, "无"))   --部曲兵种类型  
        self.buzhen_bingType2:setString("")
        self.buzhen_bingCount:setString(string.format(lua_Unit_String2, 0))    --部曲兵力   
        self.buzhen_bingCount2:setString("")
        self.buzhen_bingLevel:setString(string.format(lua_Unit_String3, 0))    --部曲等级  
        self.buzhen_bingLevel2:setString("")
        self.buzhen_bingShiQi:setString(string.format(lua_Unit_String4, 0))    --部曲士气  
        self.buzhen_bingShiQi2:setString("")
        self.buzhen_bingZhen:setString(string.format(lua_Unit_String5, "无"))    --部曲阵型   
        self.buzhen_bingZhen2:setString("")
    end
end 

--显示被替换部曲信息，1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
function ZhenXingLayer:initBuZhenRight_PreUnitUI(nType) 
    self.buzhen_SelPreUnitIdx = nType
    local preUnitData = self.buZhenXingData_UnitVec[nType]
    if preUnitData and preUnitData ~= -1 and preUnitData.bingData and preUnitData.generalData then
        self.buzhen_generalName2:setString("")   --被替换武将名称
        self.buzhen_generalLv2:setString(string.format(lua_Role_String2, 0))    --被替换武将等级   
        self.buzhen_generalHp2:setString(string.format(lua_Role_String3, 0))    --被替换武将血量 
        self.buzhen_generalMp2:setString(string.format(lua_Role_String4, 0))    --被替换武将智力 
        self.buzhen_generalAtt2:setString(string.format(lua_Role_String5, 0))    --被替换武将攻击力   
        self.buzhen_generalDef2:setString(string.format(lua_Role_String6, 0))     --被替换武将防御力  

        self.buzhen_bingType2:setString(string.format(lua_Unit_String1, "无"))   --部曲兵种类型    
        self.buzhen_bingCount2:setString(string.format(lua_Unit_String2, 0))    --部曲兵力    
        self.buzhen_bingLevel2:setString(string.format(lua_Unit_String3, 0))    --部曲等级       
        self.buzhen_bingShiQi2:setString(string.format(lua_Unit_String4, 0))    --部曲士气  
        self.buzhen_bingZhen2:setString(string.format(lua_Unit_String5, "无"))    --部曲阵型      
    else
        self.buzhen_generalName2:setString("")   --被替换武将名称
        self.buzhen_generalLv2:setString("")    --被替换武将等级   
        self.buzhen_generalHp2:setString("")    --被替换武将血量 
        self.buzhen_generalMp2:setString("")    --被替换武将智力 
        self.buzhen_generalAtt2:setString("")    --被替换武将攻击力   
        self.buzhen_generalDef2:setString("")     --被替换武将防御力  

        self.buzhen_bingType2:setString("")
        self.buzhen_bingCount2:setString("")
        self.buzhen_bingLevel2:setString("")
        self.buzhen_bingShiQi2:setString("")
        self.buzhen_bingZhen2:setString("")
    end
end

--显示布阵界面左侧各阵型营寨UI
function ZhenXingLayer:initZhenXingHeadUI(nType)
    --已有的阵型数据1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
    local preUnitData = self.buZhenXingData_UnitVec[self.buzhen_SelPreUnitIdx]
    if preUnitData and preUnitData ~= -1 then
        local generalData = preUnitData.generalData
        if generalData then
            local officerCell = SmallOfficerCell:new()
            officerCell:initData(generalData, idx)
            officerCell:setBgImgTouchEnabled(false)
            officerCell:setPosition(cc.p(0, -10)) 
            
            if nType == 1 then
                self.bu_Node_zhen_qianfeng:removeAllChildren()
                self.bu_Node_zhen_qianfeng:addChild(officerCell)
            elseif nType == 2 then
                self.bu_Node_zhen_zuohu:removeAllChildren()
                self.bu_Node_zhen_zuohu:addChild(officerCell)
            elseif nType == 3 then
                self.bu_Node_zhen_youhu:removeAllChildren()
                self.bu_Node_zhen_youhu:addChild(officerCell)
            elseif nType == 4 then
                self.bu_Node_zhen_houwei:removeAllChildren()
                self.bu_Node_zhen_houwei:addChild(officerCell)
            elseif nType == 5 then
                self.bu_Node_zhen_zhushuai:removeAllChildren()
                self.bu_Node_zhen_zhushuai:addChild(officerCell)
            elseif nType == 6 then
                self.bu_Node_zhen_zhongjun1:removeAllChildren()
                self.bu_Node_zhen_zhongjun1:addChild(officerCell)
            elseif nType == 7 then
                self.bu_Node_zhen_zhongjun2:removeAllChildren()
                self.bu_Node_zhen_zhongjun2:addChild(officerCell)
            end
        end
    else
        if nType == 1 then
            self.bu_Node_zhen_qianfeng:removeAllChildren()
        elseif nType == 2 then
            self.bu_Node_zhen_zuohu:removeAllChildren()
        elseif nType == 3 then
            self.bu_Node_zhen_youhu:removeAllChildren()
        elseif nType == 4 then
            self.bu_Node_zhen_houwei:removeAllChildren()
        elseif nType == 5 then
            self.bu_Node_zhen_zhushuai:removeAllChildren()
        elseif nType == 6 then
            self.bu_Node_zhen_zhongjun1:removeAllChildren()
        elseif nType == 7 then
            self.bu_Node_zhen_zhongjun2:removeAllChildren()
        end
    end
end

function ZhenXingLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then  
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_ZhenXingLayer)
        elseif sender == self.Button_xuanzhenRadio then   --选阵按钮
            self:setRadioPanel(1)
        elseif sender == self.Button_buzhenRadio then   --布阵按钮
            self:setRadioPanel(2)
        elseif sender == self.xuan_Button_left then   --选阵界面的选中左侧攻击阵型

        elseif sender == self.xuan_Button_right then   --选阵界面的选中右侧防御阵型

        elseif sender == self.xuan_Button_AttEdit then   --选阵界面的编辑攻击阵型
            self.bZhenEditType = 1   --布阵界面编辑的阵型类型，0默认，1出战阵型，2防御阵型
            self:setRadioPanel(2)
        elseif sender == self.xuan_Button_defEdit then   --选阵界面的编辑防御阵型
            self.bZhenEditType = 2
            self:setRadioPanel(2)
        elseif sender == self.xuan_Node_att_help then  --选阵界面的选中左侧攻击阵型,布阵UI节点中的help，展示阵型信息

        elseif sender == self.xuan_Node_def_help then  --选阵界面的选中左侧攻击阵型,布阵UI节点中的help，展示阵型信息

        elseif sender == self.bu_Node_zhen_help then  --布阵界面中布阵UI节点中的help，展示阵型信息

        elseif sender == self.bu_Node_zhen_qianfeng then   --布阵UI节点中的前锋营
            self.bu_Node_zhen_sel:setPosition(cc.p(self.bu_Node_zhen_qianfeng:getPosition()))
            self:initBuZhenRight_PreUnitUI(1)
        elseif sender == self.bu_Node_zhen_zuohu then   --布阵UI节点中的左护军
            self.bu_Node_zhen_sel:setPosition(cc.p(self.bu_Node_zhen_zuohu:getPosition()))
            self:initBuZhenRight_PreUnitUI(2)
        elseif sender == self.bu_Node_zhen_youhu then   --布阵UI节点中的右护军
            self.bu_Node_zhen_sel:setPosition(cc.p(self.bu_Node_zhen_youhu:getPosition()))
            self:initBuZhenRight_PreUnitUI(3)
        elseif sender == self.bu_Node_zhen_houwei then   --布阵UI节点中的后卫营
            self.bu_Node_zhen_sel:setPosition(cc.p(self.bu_Node_zhen_houwei:getPosition()))
            self:initBuZhenRight_PreUnitUI(4)
        elseif sender == self.bu_Node_zhen_zhushuai then   --布阵UI节点中的中军主帅
            self.bu_Node_zhen_sel:setPosition(cc.p(self.bu_Node_zhen_zhushuai:getPosition()))
            self:initBuZhenRight_PreUnitUI(5)
        elseif sender == self.bu_Node_zhen_zhongjun1 then   --布阵UI节点中的中军将1（上）
            self.bu_Node_zhen_sel:setPosition(cc.p(self.bu_Node_zhen_zhongjun1:getPosition()))
            self:initBuZhenRight_PreUnitUI(6)
        elseif sender == self.bu_Node_zhen_zhongjun2 then   --布阵UI节点中的中军将2（下）
            self.bu_Node_zhen_sel:setPosition(cc.p(self.bu_Node_zhen_zhongjun2:getPosition()))
            self:initBuZhenRight_PreUnitUI(7)
        elseif sender == self.bu_Node_zhen_save then     --保存阵型

        elseif sender == self.bu_Node_zhen_cancel then      --部曲下阵
            --已有的阵型数据1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
            self.buZhenXingData_UnitVec[self.buzhen_SelPreUnitIdx] = -1
            self:initZhenXingHeadUI(self.buzhen_SelPreUnitIdx)
        elseif sender == self.bu_Node_zhen_fight then      --部曲上阵  
            local unitData = clone(self.buzhenGeneralData_UnitVec[self.buzhen_SelUnitIdx])
            if unitData and unitData ~= -1 and unitData.bingData then
                if unitData.bingCount >= 100 then
                    for k, data in pairs(self.buZhenXingData_UnitVec) do
                        if data and data ~= -1 and data.generalIdStr then
                            if tonumber(data.generalIdStr) == tonumber(self.buzhenGeneralData.id_str) then
                                g_pGameLayer:ShowScrollTips(lua_str_WarnTips13, g_ColorDef.Red, g_defaultTipsFontSize)  --"该武将已经出战！"
                                return
                            end
                        end
                    end

                    -- if self.buzhen_SelPreUnitIdx == 5 and self.buzhenGeneralData.type ~= 1 then  
                    --     g_pGameLayer:ShowScrollTips(lua_str_WarnTips12, g_ColorDef.Red, g_defaultTipsFontSize)  --"只有英雄类武将才能担任中军主将！"
                    --     return
                    -- end 
                    unitData.generalIdStr = self.buzhenGeneralData.id_str
                    unitData.generalData = clone(self.buzhenGeneralData)
                    --已有的阵型数据1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
                    self.buZhenXingData_UnitVec[self.buzhen_SelPreUnitIdx] = unitData
                    self:initZhenXingHeadUI(self.buzhen_SelPreUnitIdx)
                else
                    g_pGameLayer:ShowScrollTips(lua_str_WarnTips11, g_ColorDef.Red, g_defaultTipsFontSize)  --"该兵种部曲兵力少于100人，不能上阵！"
                    return
                end
            else
                g_pGameLayer:ShowScrollTips(lua_str_WarnTips10, g_ColorDef.Red, g_defaultTipsFontSize)  --"该兵种部曲未组建，不能上阵！"
                return
            end
        elseif sender == self.buzhen_qiangbing then   --布阵界面枪兵组
            self.buzhen_selImg:setPosition(cc.p(self.buzhen_qiangbing:getPosition()))
            self:initBuZhenRight_UnitUI(1)  --显示布阵界面右侧部曲信息UI(1-4枪兵，刀兵，弓兵，骑兵，0未选中)
        elseif sender == self.buzhen_daobing then   --布阵界面刀兵组
            self.buzhen_selImg:setPosition(cc.p(self.buzhen_daobing:getPosition()))
            self:initBuZhenRight_UnitUI(2)  --显示布阵界面右侧部曲信息UI(1-4枪兵，刀兵，弓兵，骑兵，0未选中)
        elseif sender == self.buzhen_gongbing then   --布阵界面弓兵组
            self.buzhen_selImg:setPosition(cc.p(self.buzhen_gongbing:getPosition()))
            self:initBuZhenRight_UnitUI(3)  --显示布阵界面右侧部曲信息UI(1-4枪兵，刀兵，弓兵，骑兵，0未选中)
        elseif sender == self.buzhen_qibing then   --布阵界面骑兵组
            self.buzhen_selImg:setPosition(cc.p(self.buzhen_qibing:getPosition()))
            self:initBuZhenRight_UnitUI(4)  --显示布阵界面右侧部曲信息UI(1-4枪兵，刀兵，弓兵，骑兵，0未选中)
        end
                    -- local result = {}
            -- result.storyId = self.storyId
            -- result.winStar = 2
            -- g_pGameLayer:showBattleResultLayer(result)

            --g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_ZhenXingLayer)
    end
end




return ZhenXingLayer
