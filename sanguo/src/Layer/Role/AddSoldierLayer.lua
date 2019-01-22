
--招募士兵信息
local AddSoldierLayer = class("AddSoldierLayer", CCLayerEx)

bingNodeStruct = class("bingNodeStruct",__BaseStruct)
function bingNodeStruct:ctor()
    self.bingImg = nil   --兵种图片
    self.Text_bing = nil   --兵种文本
    self.Text_equip = nil   --兵器文本
    self.Text_count_equip = nil  --兵器数量（武库中的玩家打造的）  
    self.Text_limitNum = nil  --招募数量（由玩家武库中装备免费招募的限制）
    self.Text_count_soldier = nil   --实际招募数量
    self.LoadingBar = nil   --兵器数量消耗进度条
    self.Slider_num = nil  --招募滑动条
    self.CheckBox = nil  --自动购买

    self.limitEquipCount = 0  --由玩家武库中装备免费招募的限制
end

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

    self.autoBuyVec = {false, false, false, false, false}   --枪刀弓骑四种兵种自动购买及兵甲购买
    local nodeNameVec = {"qiangNode", "daoNode", "gongNode", "qiNode"}
    self.bingNodeVec = {}
    for k=1, 4 do
        local nodeStruct = bingNodeStruct:new()
        local bingNode = self.Image_bg:getChildByName(nodeNameVec[k])
        nodeStruct.bingImg = bingNode:getChildByName("bingImg")   --兵种图片
        nodeStruct.Text_bing = bingNode:getChildByName("Text_bing")   --兵种文本

        nodeStruct.Text_equip = bingNode:getChildByName("Text_equip")   --兵器文本
        nodeStruct.Text_count_equip = bingNode:getChildByName("Text_count_equip")   --兵器数量（武库中的玩家打造的）
        nodeStruct.Text_count_equip:setString("0")
        
        nodeStruct.Text_limitNum = bingNode:getChildByName("Text_limitNum")   --招募数量（由玩家武库中装备免费招募的限制）
        nodeStruct.Text_limitNum:setString("0")
        nodeStruct.Text_count_soldier = bingNode:getChildByName("Text_count_soldier")   --实际招募数量
        nodeStruct.Text_count_soldier:setString("0")
        
        nodeStruct.LoadingBar = bingNode:getChildByName("LoadingBar")   --兵器数量消耗进度条
        nodeStruct.LoadingBar:setPercent(0)

        nodeStruct.Slider_num = bingNode:getChildByName("Slider_num")  --招募滑动条
        nodeStruct.Slider_num:setPercent(0)
        nodeStruct.Slider_num:setMaxPercent(10000)    --一次可最多购买10000件/套
        nodeStruct.Slider_num:addEventListener(handler(self,self.percentChangedEvent))

        nodeStruct.CheckBox = bingNode:getChildByName("CheckBox")  --自动购买
        nodeStruct.CheckBox:setSelected(false)
        nodeStruct.CheckBox:addEventListener(handler(self,self.CheckboxSelectedEvent))

        table.insert(self.bingNodeVec, nodeStruct)
    end 

    self.Text_count_equip = self.Image_bg:getChildByName("Text_count_equip")   --兵甲数量
    self.Text_count_equip:setString("0")
    self.LoadingBar = self.Image_bg:getChildByName("LoadingBar")   --兵甲数量消耗进度条
    self.LoadingBar:setPercent(0)
    self.CheckBox = self.Image_bg:getChildByName("CheckBox")   --自动购买
    self.CheckBox:setSelected(false)
    self.CheckBox:addEventListener(handler(self,self.CheckboxSelectedEvent))

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
    self.ListView_desc = self.Panel_help:getChildByName("ListView_desc")
    self.descText = self.ListView_desc:getChildByName("descText")
    self:initHelpListView()
end

function AddSoldierLayer:initHelpListView()
    local desc = "    骑枪刀弓四个兵种之间存在克制关系：枪兵克制骑兵、刀兵克制枪兵、弓兵克制刀兵、骑兵克制弓兵。\
    兵种相克伤害在基础伤害之上，再加50%的附加伤害。这种附加伤害是单向伤害。刀兵在攻击相同防御力的枪兵和弓兵时，弓兵受到的伤害比枪兵大50%。\
    *枪戟兵拥有长枪或戟矛，护甲厚、防御高、攻击适中、行动缓慢，可以克制骑兵，但受到刀兵克制。枪戟兵攻城战，战斗力都没有额外加成。\
    *刀剑兵拥有前盾牌，护甲适中、防御适中、攻击适中、行动适中，可以克制枪兵，但受到弓兵克制。刀剑兵攻城战，战斗力都没有额外加成。\
    *弓弩兵拥有弓箭或弩机，护甲薄、防御低、攻击适高、行动快捷，可以克制刀兵，但受到骑兵克制。弓弩兵攻城战时，战斗力有5%加成。\
    *骑兵拥有马匹和一件马刀或短矛，护甲薄、防御低、攻击适中、冲击力强、行动灵敏，可以克制弓兵，但受到枪兵克制。骑兵攻城战时，战斗力有5%减弱。\
"
    self.descText:setTextAreaSize(cc.size(480, 0))   --480, 330
    self.descText:setString(desc)

    self.ListView_desc:jumpToTop()
    self.ListView_desc:refreshView()

    local imgStrVec = {"public_qiangbing.png", "public_daobing.png", "public_gongbing.png", "public_qibing.png"}
    local nameStrVec = {"招募枪兵", "招募刀兵", "招募弓兵", "招募骑兵"}
    local equipStrVec = {"枪戟数量", "刀剑数量", "弓弩数量", "马匹数量", "兵甲数量"}
    local soldierIdVec = {Item_Id_qiangji, Item_Id_daojian, Item_Id_gongnu, Item_Id_mapi, Item_Id_bingjia}

    for k=1, 4 do
        local nodeStruct = self.bingNodeVec[k]
        nodeStruct.bingImg:setSpriteFrame(imgStrVec[k])  --兵种图片
        --nodeStruct.bingImg:loadTexture(imgStrVec[k], ccui.TextureResType.plistType)  --兵种图片
        nodeStruct.Text_bing:setString(nameStrVec[k])   --兵种文本

        nodeStruct.Text_equip:setString(equipStrVec[k])    --兵器文本
        local bagItem = g_HeroDataMgr:GetBagItemDataById(soldierIdVec[k])
        local itemNum = 0
        if bagItem then   --{["itemId"] = itemId, ["num"] = itemNum }
            itemNum = bagItem.num
        end
        nodeStruct.limitEquipCount = itemNum  --由玩家武库中装备免费招募的限制

        nodeStruct.Text_count_equip:setString(""..itemNum)  --兵器数量（武库中的玩家打造的）
        nodeStruct.Text_limitNum:setString(""..itemNum)   --招募数量（由玩家武库中装备免费招募的限制）
        nodeStruct.Text_count_soldier:setString("+0")  --实际招募数量

        if itemNum > 0 then
            nodeStruct.LoadingBar:setPercent(100)
        else
            nodeStruct.LoadingBar:setPercent(0)  --兵器数量消耗进度条
        end
        nodeStruct.Slider_num:setPercent(0)   --招募滑动条
        nodeStruct.Slider_num:setMaxPercent(10000)    --一次可最多购买10000件/套

        nodeStruct.CheckBox:setSelected(false)  --自动购买
    end

    self.Text_count_equip:setString("0")  --兵甲数量
    self.LoadingBar:setPercent(0)   --兵甲数量消耗进度条
    self.CheckBox:setSelected(false)   --自动购买

    self.Text_gold:setString("0") --金币花费

end

function AddSoldierLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then  
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_AddSoldierLayer)
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

--自动购买兵种装备
function AddSoldierLayer:CheckboxSelectedEvent(sender,eventType)
    local bSel = false
    if eventType == ccui.CheckBoxEventType.selected then
        bSel = true
    elseif eventType == ccui.CheckBoxEventType.unselected then
        bSel = false
    end
    if sender == self.CheckBox then
        self.autoBuyVec[5] = bSel
    else
        for k=1, 4 do
            local nodeStruct = self.bingNodeVec[k]
            if nodeStruct and nodeStruct.CheckBox == sender then
                self.autoBuyVec[k] = bSel
                nodeStruct.Text_limitNum:setVisible(not bSel)  --招募数量（由玩家武库中装备免费招募的限制）
                --nodeStruct.Slider_num:setMaxPercent(bSel and 10000 or nodeStruct.limitEquipCount)   --一次可最多购买10000件/套
                if bSel ~= true then
                    local percent = nodeStruct.Slider_num:getPercent()
                    if percent > nodeStruct.limitEquipCount then
                        nodeStruct.Slider_num:setPercent(nodeStruct.limitEquipCount)   --招募滑动条, 不会触发percentChangedEvent
                    end
                end
                break
            end
        end
    end
end

--兵种招募滚动条
function AddSoldierLayer:percentChangedEvent(sender,eventType)
    if eventType == ccui.SliderEventType.percentChanged then
        local percent = sender:getPercent() --/ sender:getMaxPercent()
        for k=1, 4 do
            local nodeStruct = self.bingNodeVec[k]
            if nodeStruct and nodeStruct.Slider_num == sender then
                --G_Log_Info("percentChangedEvent(), k=%d, precent = %d, max = %d", k, sender:getPercent(), sender:getMaxPercent())
                if self.autoBuyVec[k] ~= true and percent > nodeStruct.limitEquipCount then
                    nodeStruct.Slider_num:setPercent(nodeStruct.limitEquipCount)   --招募滑动条
                end
                nodeStruct.Text_count_soldier:setString("+"..sender:getPercent())  --实际招募数量
                break
            end
        end
    elseif eventType == ccui.SliderEventType.slideBallUp then
    elseif eventType == ccui.SliderEventType.slideBallDown then
    elseif eventType == ccui.SliderEventType.slideBallCancel then
    end
end




return AddSoldierLayer
