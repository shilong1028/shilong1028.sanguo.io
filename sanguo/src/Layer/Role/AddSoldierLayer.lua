
--招募士兵信息
local AddSoldierLayer = class("AddSoldierLayer", CCLayerEx)

--士兵招募节点
bingNodeStruct = class("bingNodeStruct",__BaseStruct)
function bingNodeStruct:ctor()
    self.bingImg = nil   --兵种图片
    self.Text_bing = nil   --兵种文本
    self.Text_equip = nil   --兵器文本
    self.Text_count_equip = nil  --兵器数量（武库中的玩家打造的）  
    self.Text_limitNum = nil  --招募数量（由玩家武库中装备免费招募的限制）
    self.Text_count_soldier = nil   --实际招募数量
    self.CheckBox = nil  --自动购买
    self.Button_jian = nil  --加减按钮
    self.Button_jia = nil

    self.limitEquipCount = 0  --由玩家武库中装备免费招募的限制
    self.buyEquipCount = 0   --玩家当前购买的装备数量（每次1000增加或减少）
end

--士兵招募层
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

    self.totalCostGold = 0   --当前购买花费总值
    self.soldierEquipCount = 0  --由玩家武库中装备免费招募的兵甲限制
    self.totalEquipBuyNum = 0   --已经使用的兵甲数量
    self.soldierIdVec = {g_ItemIdDef.Item_Id_qiangji, g_ItemIdDef.Item_Id_daojian, g_ItemIdDef.Item_Id_gongnu, g_ItemIdDef.Item_Id_mapi, g_ItemIdDef.Item_Id_bingjia}
    self.autoBuyVec = {false, false, false, false, false}   --枪刀弓骑四种兵种自动购买及兵甲购买

    self.Image_bg = csb:getChildByName("Image_bg")
    self.titleBg = self.Image_bg:getChildByName("titleBg")
    self.Text_title = self.Image_bg:getChildByName("Text_title")

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

        nodeStruct.Button_jian = bingNode:getChildByName("Button_jian")   
        nodeStruct.Button_jian:addTouchEventListener(handler(self,self.touchJianEvent))

        nodeStruct.Button_jia = bingNode:getChildByName("Button_jia")   
        nodeStruct.Button_jia:addTouchEventListener(handler(self,self.touchJiaEvent))

        nodeStruct.CheckBox = bingNode:getChildByName("CheckBox")  --自动购买
        nodeStruct.CheckBox:setSelected(false)
        nodeStruct.CheckBox:addEventListener(handler(self,self.CheckboxSelectedEvent))

        table.insert(self.bingNodeVec, nodeStruct)
    end 

    self.Text_count_equip = self.Image_bg:getChildByName("Text_count_equip")   --兵甲数量
    self.Text_count_equip:setString("0")
    self.CheckBox = self.Image_bg:getChildByName("CheckBox")   --自动购买
    self.CheckBox:setSelected(false)
    self.CheckBox:addEventListener(handler(self,self.CheckboxSelectedEvent))

    self.Text_gold = self.Image_bg:getChildByName("Text_gold")    --金币花费
    self.Text_gold:setString("0")

    self.Button_close = self.Image_bg:getChildByName("Button_close")   
    self.Button_close:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_close:setVisible(false);   --默认不显示关闭按钮只显示提示按钮，关闭提示之后关闭按钮出现
    self.Button_ok = self.Image_bg:getChildByName("Button_ok")   
    self.Button_ok:addTouchEventListener(handler(self,self.touchEvent))  
    self.Button_help = self.Image_bg:getChildByName("Button_help")   
    self.Button_help:addTouchEventListener(handler(self,self.touchEvent))

    --帮助面板内容
    self.Panel_help = self.Image_bg:getChildByName("Panel_help")
    self.Panel_help:setVisible(true)
    self.ListView_desc = self.Panel_help:getChildByName("ListView_desc")
    self.descText = self.ListView_desc:getChildByName("descText")
    self:initSoldierNodeView()
end

function AddSoldierLayer:initSoldierNodeView()
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
    local equipStrVec = {"枪戟库存数量", "刀剑库存数量", "弓弩库存数量", "马匹库存数量", "兵甲库存"}

    for k=1, 4 do
        local nodeStruct = self.bingNodeVec[k]
        nodeStruct.bingImg:setSpriteFrame(imgStrVec[k])  --兵种图片
        --nodeStruct.bingImg:loadTexture(imgStrVec[k], ccui.TextureResType.plistType)  --兵种图片
        nodeStruct.Text_bing:setString(nameStrVec[k])   --兵种文本

        nodeStruct.Text_equip:setString(equipStrVec[k])    --兵器文本
        local bagItem = g_HeroDataMgr:GetBagItemDataById(self.soldierIdVec[k])
        local itemNum = 0
        if bagItem then   --{["itemId"] = itemId, ["num"] = itemNum }
            itemNum = bagItem.num * 1000   --士兵或装备都是每1000为一个单位
        end
        nodeStruct.limitEquipCount = itemNum  --由玩家武库中装备免费招募的限制

        nodeStruct.Text_count_equip:setString(""..itemNum)  --兵器数量（武库中的玩家打造的）
        nodeStruct.Text_limitNum:setString(""..itemNum)   --招募数量（由玩家武库中装备免费招募的限制）
        nodeStruct.Text_count_soldier:setString("+0")  --实际招募数量

        nodeStruct.CheckBox:setSelected(false)  --自动购买
    end

    local bagItem = g_HeroDataMgr:GetBagItemDataById(self.soldierIdVec[5])
    if bagItem then   --{["itemId"] = itemId, ["num"] = itemNum }
        self.soldierEquipCount = bagItem.num*1000  --由玩家武库中装备免费招募的兵甲限制
    end

    self.Text_count_equip:setString(""..self.soldierEquipCount)  --兵甲数量
    self.CheckBox:setSelected(false)   --自动购买

    self.Text_gold:setString("0") --金币花费

end

function AddSoldierLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then  
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_AddSoldierLayer)
        elseif sender == self.Button_ok then    --招募
            local campMoney = g_HeroDataMgr:GetHeroCampMoney()
            if campMoney >= self.totalCostGold then    
                local bagItemVec = {
                    {["itemId"] = g_ItemIdDef.Item_Id_glod, ["num"] = -1*self.totalCostGold}   --金币减少量
                } 

                --兵甲减少量
                local equipNum = math.floor(self.soldierEquipCount/1000)
                if self.totalEquipBuyNum < self.soldierEquipCount then  
                    equipNum =  math.floor(self.totalEquipBuyNum/1000)  --士兵或装备都是每1000为一个单位
                end
                table.insert(bagItemVec, {["itemId"] = self.soldierIdVec[5], ["num"] = -1*equipNum})

                local addSoldierCount = 0  --招募的士兵数量
                local idVec = {g_ItemIdDef.Item_Id_qiangbing, g_ItemIdDef.Item_Id_daobing, g_ItemIdDef.Item_Id_gongbing, g_ItemIdDef.Item_Id_qibing}
                for k=1, 4 do
                    local nodeStruct = self.bingNodeVec[k]
                    if nodeStruct.buyEquipCount >= 1000 then
                        --装备减少
                        equipNum = math.floor(nodeStruct.limitEquipCount/1000)
                        if nodeStruct.buyEquipCount < nodeStruct.limitEquipCount then 
                            equipNum =  math.floor(nodeStruct.buyEquipCount/1000)  --士兵或装备都是每1000为一个单位
                        end
                        table.insert(bagItemVec, {["itemId"] = self.soldierIdVec[k], ["num"] = -1*equipNum})
                        --士兵增加
                        addSoldierCount = addSoldierCount + nodeStruct.buyEquipCount
                        equipNum =  math.floor(nodeStruct.buyEquipCount/1000) 
                        table.insert(bagItemVec, {["itemId"] = idVec[k], ["num"] = equipNum})
                    end
                end

                local storyData = g_pGameLayer.MenuLayer.storyData
                --G_Log_Dump(storyData, "storyData = ")
                if storyData and storyData.type == g_StoryType.Soldier then   --招募士兵任务
                    if addSoldierCount >= 3000 then
                        g_pGameLayer:FinishStoryIntroduceByStep(storyData, g_StoryState.ActionFinish)  --5招募、建设、战斗等任务结束
                    else
                        g_pGameLayer:ShowScrollTips("招募士兵不足三千，请添加！", g_ColorDef.Red)
                        return
                    end
                end
                g_HeroDataMgr:SetBagXMLData(bagItemVec)   --保存玩家背包物品数据到bagXML
                g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_AddSoldierLayer)
            else
                g_pGameLayer:ShowScrollTips("金币不足！", g_ColorDef.Red)
            end
        elseif sender == self.Button_help then   --招募帮助信息
            self.Button_close:setVisible(true);   --默认不显示关闭按钮只显示提示按钮，关闭提示之后关闭按钮出现
            if self.Panel_help:isVisible() == true then
                self.Panel_help:setVisible(false)
            else
                self.Panel_help:setVisible(true)
            end
        end
    end
end

--士兵招募减少数量
function AddSoldierLayer:touchJianEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        for k=1, 4 do
            local nodeStruct = self.bingNodeVec[k]
            if nodeStruct and nodeStruct.Button_jian == sender then
                if nodeStruct.buyEquipCount >= 1000 then
                    --归还兵甲
                    if self.totalEquipBuyNum > self.soldierEquipCount then  
                        local cost = g_pTBLMgr:getBuyItemCost(self.soldierIdVec[5], 1) 
                        self.totalCostGold = self.totalCostGold - cost   
                    end
                    self.totalEquipBuyNum = self.totalEquipBuyNum - 1000

                    --归还装备
                    if nodeStruct.buyEquipCount > nodeStruct.limitEquipCount then 
                        local cost = g_pTBLMgr:getBuyItemCost(self.soldierIdVec[k], 1) 
                        self.totalCostGold = self.totalCostGold - cost  
                    end
                    nodeStruct.buyEquipCount = nodeStruct.buyEquipCount - 1000
                else
                    nodeStruct.buyEquipCount = 0   --玩家当前购买的装备数量（每次1000增加或减少）
                end
                nodeStruct.Text_count_soldier:setString("+"..nodeStruct.buyEquipCount)  --实际招募数量
                self:showCostGoldLabel()  --显示花费金币
                return
            end
        end
    end
end

--士兵招募增加数量
function AddSoldierLayer:touchJiaEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        for k=1, 4 do
            local nodeStruct = self.bingNodeVec[k]
            if nodeStruct and nodeStruct.Button_jia == sender then
                local nextCount = nodeStruct.buyEquipCount + 1000;
                if self.autoBuyVec[k] == true then   --可自动购买
                    if self.autoBuyVec[5] == true then   --可自动购买兵甲
                        self.totalEquipBuyNum = self.totalEquipBuyNum + 1000   --已经使用的兵甲数量
                        if self.totalEquipBuyNum > self.soldierEquipCount then   --已经使用的兵甲数量 >兵甲库存数量
                            local cost = g_pTBLMgr:getBuyItemCost(self.soldierIdVec[5], 1) 
                            self.totalCostGold = self.totalCostGold + cost   --当前购买花费总值
                        end
                    else
                        if nextCount > self.soldierEquipCount then   --兵甲库存数量
                            g_pGameLayer:ShowScrollTips("兵甲库存不足！", g_ColorDef.Red)
                            return
                        end
                    end

                    if nextCount > nodeStruct.limitEquipCount then   --装备库存
                        local cost = g_pTBLMgr:getBuyItemCost(self.soldierIdVec[k], 1) 
                        self.totalCostGold = self.totalCostGold + cost   --当前购买花费总值
                    end
                else
                    if nextCount > nodeStruct.limitEquipCount then   --装备库存
                        g_pGameLayer:ShowScrollTips("装备库存不足！", g_ColorDef.Red)
                        return
                    end
                end

                nodeStruct.buyEquipCount = nextCount   --玩家当前购买的装备数量（每次1000增加或减少）
                nodeStruct.Text_count_soldier:setString("+"..nodeStruct.buyEquipCount)  --实际招募数量 
                self:showCostGoldLabel()  --显示花费金币
                return
            end
        end
    end
end

--显示花费金币
function AddSoldierLayer:showCostGoldLabel()
    local campMoney = g_HeroDataMgr:GetHeroCampMoney()
    if campMoney >= self.totalCostGold then     
        self.Text_gold:setColor(cc.c3b(255,165,0))
    else
        self.Text_gold:setColor(cc.c3b(255,0,0))
        g_pGameLayer:ShowScrollTips("金币不足！", g_ColorDef.Red)
    end

    self.Text_gold:setString(""..self.totalCostGold)   --花费金币
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
                break
            end
        end
    end
end




return AddSoldierLayer
