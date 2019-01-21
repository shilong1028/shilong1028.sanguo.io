
--招募士兵信息
local AddSoldierLayer = class("AddSoldierLayer", CCLayerEx)

function AddSoldierLayer:create()   --自定义的create()创建方法
    --G_Log_Info("AddSoldierLayer:create()")
    local layer = AddSoldierLayer.new()
    return layer
end

function AddSoldierLayer:onExit()
    --G_Log_Info("AddSoldierLayer:onExit()")
end

--初始化UI界面
function AddSoldierLayer:init()  
    --G_Log_Info("AddSoldierLayer:init()")
    local csb = cc.CSLoader:createNode("csd/AddSoldierLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    --self:showInTheMiddle(csb)

    self.Image_bg = csb:getChildByName("Image_bg")
    self.titleBg = self.Image_bg:getChildByName("titleBg")
    self.Text_title = self.Image_bg:getChildByName("Text_title")

    local daoNode = self.Image_bg:getChildByName("daoNode")
    self.dao_Text_count_equip = self.Image_bg:getChildByName("Text_count_equip")   --兵器数量
    self.dao_Text_count_equip:setString("0")
    self.dao_LoadingBar = self.Image_bg:getChildByName("LoadingBar")
    self.dao_CheckBox = self.Image_bg:getChildByName("CheckBox")
    self.dao_Text_count_soldier = self.Image_bg:getChildByName("Text_count_soldier")   --招募数量
    self.dao_Text_count_soldier:setString("0")
    self.dao_Text_limitNum = self.Image_bg:getChildByName("Text_limitNum")   --招募数量（免费）
    self.dao_Text_limitNum:setString("0")
    self.dao_Slider_num = self.Image_bg:getChildByName("Slider_num")

    local qiangNode = self.Image_bg:getChildByName("qiangNode")
    self.qiang_Text_count_equip = self.Image_bg:getChildByName("Text_count_equip")   --兵器数量
    self.qiang_Text_count_equip:setString("0")
    self.qiang_LoadingBar = self.Image_bg:getChildByName("LoadingBar")
    self.qiang_CheckBox = self.Image_bg:getChildByName("CheckBox")
    self.qiang_Text_count_soldier = self.Image_bg:getChildByName("Text_count_soldier")   --招募数量
    self.qiang_Text_count_soldier:setString("0")
    self.qiang_Text_limitNum = self.Image_bg:getChildByName("Text_limitNum")   --招募数量（免费）
    self.qiang_Text_limitNum:setString("0")
    self.qiang_Slider_num = self.Image_bg:getChildByName("Slider_num")

    local gongNode = self.Image_bg:getChildByName("gongNode")
    self.gong_Text_count_equip = self.Image_bg:getChildByName("Text_count_equip")   --兵器数量
    self.gong_Text_count_equip:setString("0")
    self.gong_LoadingBar = self.Image_bg:getChildByName("LoadingBar")
    self.gong_CheckBox = self.Image_bg:getChildByName("CheckBox")
    self.gong_Text_count_soldier = self.Image_bg:getChildByName("Text_count_soldier")   --招募数量
    self.gong_Text_count_soldier:setString("0")
    self.gong_Text_limitNum = self.Image_bg:getChildByName("Text_limitNum")   --招募数量（免费）
    self.gong_Text_limitNum:setString("0")
    self.gong_Slider_num = self.Image_bg:getChildByName("Slider_num")

    local qiNode = self.Image_bg:getChildByName("qiNode")
    self.qi_Text_count_equip = self.Image_bg:getChildByName("Text_count_equip")   --兵器数量
    self.qi_Text_count_equip:setString("0")
    self.qi_LoadingBar = self.Image_bg:getChildByName("LoadingBar")
    self.qi_CheckBox = self.Image_bg:getChildByName("CheckBox")
    self.qi_Text_count_soldier = self.Image_bg:getChildByName("Text_count_soldier")   --招募数量
    self.qi_Text_count_soldier:setString("0")
    self.qi_Text_limitNum = self.Image_bg:getChildByName("Text_limitNum")   --招募数量（免费）
    self.qi_Text_limitNum:setString("0")
    self.qi_Slider_num = self.Image_bg:getChildByName("Slider_num")

    self.Text_count_equip = self.Image_bg:getChildByName("Text_count_equip")   --兵甲数量
    self.Text_count_equip:setString("0")
    self.LoadingBar = self.Image_bg:getChildByName("LoadingBar")
    self.CheckBox = self.Image_bg:getChildByName("CheckBox")

    self.Text_gold = self.Image_bg:getChildByName("Text_gold")    --金币花费
    self.Text_gold:setString("0")

    self.Button_close = self.Image_bg:getChildByName("Button_close")   
    self.Button_close:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_ok = self.Image_bg:getChildByName("Button_ok")   
    self.Button_ok:addTouchEventListener(handler(self,self.touchEvent))  
    self.Button_help = self.Image_bg:getChildByName("Button_help")   
    self.Button_help:addTouchEventListener(handler(self,self.touchEvent))

    --帮助面板内容
    self.Panel_help = self.Image_bg:getChildByName("Panel_help")
    self.ListView_desc = self.Image_bg:getChildByName("ListView_desc")
    self.descText = self.Image_bg:getChildByName("descText")
    self:initHelpListView()
end


function AddSoldierLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then  
            --g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_BagLayer)
        elseif sender == self.Button_ok then    --招募

        elseif sender == self.Button_help then   --招募帮助信息
            if self.Panel_help:isVisible() == true then
                self.Panel_help:setVisible(false)
            else
                self.Panel_help:setVisible(true)
            end
        end
    end
end

function AddSoldierLayer:initHelpListView()
    local desc = "    骑枪刀弓四个兵种之间存在克制关系：枪兵克制骑兵、刀兵克制枪兵、弓兵克制刀兵、骑兵克制弓兵。\
    兵种相克伤害在基础伤害之上，再加50%的附加伤害。这种附加伤害是单向伤害。刀兵在攻击相同防御力的枪兵和弓兵时，弓兵受到的伤害比枪兵大50%。\
    *枪戟兵拥有长枪或戟矛，护甲厚、防御高、攻击适中、行动缓慢，可以克制骑兵，但受到刀兵克制。枪戟兵攻城战，战斗力都没有额外加成。\
    *刀剑兵拥有前盾牌，护甲适中、防御适中、攻击适中、行动适中，可以克制枪兵，但受到弓兵克制。刀剑兵攻城战，战斗力都没有额外加成。\
    *弓弩兵拥有弓箭或弩机，护甲薄、防御低、攻击适高、行动快捷，可以克制刀兵，但受到骑兵克制。弓弩兵攻城战时，战斗力有5%加成。\
    *骑兵拥有马匹和一件马刀或短矛，护甲薄、防御低、攻击适中、冲击力强、行动灵敏，可以克制弓兵，但受到枪兵克制。骑兵攻城战时，战斗力有5%减弱。\
"

    self.descText:setTextAreaSize(cc.size(480, 0));   --480, 330
    self.descText:setString(desc)

    self.ListView_desc:jumpToTop();
    self.ListView_desc:refreshView();
end


return AddSoldierLayer
