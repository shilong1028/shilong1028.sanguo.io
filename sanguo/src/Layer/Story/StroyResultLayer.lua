
--剧情奖励信息
local StroyResultLayer = class("StroyResultLayer", CCLayerEx)

--local SmallOfficerCell = require("Layer.Role.SmallOfficerCell")
local ItemCell = require("Layer.Item.ItemCell")
local SmallOfficerCell = require("Layer.Role.SmallOfficerCell")

function StroyResultLayer:create()   --自定义的create()创建方法
    --G_Log_Info("StroyResultLayer:create()")
    local layer = StroyResultLayer.new()
    return layer
end

function StroyResultLayer:onExit()
    --G_Log_Info("StroyResultLayer:onExit()")
end

--初始化UI界面
function StroyResultLayer:init()  
    --G_Log_Info("StroyResultLayer:init()")
    local csb = cc.CSLoader:createNode("csd/StroyResultLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    --self:showInTheMiddle(csb)

    self.Image_bg = csb:getChildByName("Image_bg")
    self.titleBg = self.Image_bg:getChildByName("titleBg")
    self.Text_title = self.Image_bg:getChildByName("Text_title")

    self.Text_info = self.Image_bg:getChildByName("Text_info")

    self.Button_close = self.Image_bg:getChildByName("Button_close")   
    self.Button_close:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_ok = self.Image_bg:getChildByName("Button_ok")   
    self.Button_ok:addTouchEventListener(handler(self,self.touchEvent))

    self.ListView_army = self.Image_bg:getChildByName("ListView_army")
    self.ListView_army:setBounceEnabled(true)
    self.ListView_army:setScrollBarEnabled(false)   --屏蔽列表滚动条
    self.ListView_army:setItemsMargin(10.0)
    self.ListView_armySize = self.ListView_army:getContentSize()
    
    self.ListView_reward = self.Image_bg:getChildByName("ListView_reward")
    self.ListView_reward:setBounceEnabled(true)
    self.ListView_reward:setScrollBarEnabled(false)   --屏蔽列表滚动条
    self.ListView_reward:setItemsMargin(10.0)
    self.ListView_rewardSize = self.ListView_reward:getContentSize()
end

function StroyResultLayer:initStoryInfo(storyId)  
    self.storyId = storyId

    self.storyData = g_pTBLMgr:getStoryConfigTBLDataById(storyId) 
    if self.storyData then
        --G_Log_Dump(self.storyData, "self.storyData = ")
        if string.len(self.storyData.targetCity) > 0 then  --有寻路目标
            local storyPlayedState = g_HeroDataMgr:GetStoryPlayedState()  --任务故事进程状态（0初始，1文字播放完成，2展示寻路完成，3最终完成）
            --G_Log_Info("storyPlayedState = %s", storyPlayedState)
            if storyPlayedState == 1 then   --前往
                self.Button_ok:setTitleText("前 往")
            elseif storyPlayedState == 2 then   --领取
                self.Button_ok:setTitleText("领 取")
            else
                self.Button_ok:setTitleText("")
            end
        else  --无寻路目的城池，直接领取奖励
            self.Button_ok:setTitleText("领 取")
        end

        self.Text_title:setString(self.storyData.name)

        local bgWidth = 200
        if self.Text_title:getContentSize().width > 180 then
            bgWidth = self.Text_title:getContentSize().width + 20
        end
        self.titleBg:setContentSize(cc.size(bgWidth, self.Text_title:getContentSize().height + 10))

        self.Text_info:setString("    "..self.storyData.desc)

        for k, generalId in pairs(self.storyData.generalVec) do
            local generalData = g_pTBLMgr:getGeneralConfigTBLDataById(generalId) 
            if generalData then
                local officerCell = SmallOfficerCell:new()
                officerCell:initData(generalData, k) 

                local cur_item = ccui.Layout:create()
                cur_item:setContentSize(officerCell:getContentSize())
                cur_item:addChild(officerCell)
                cur_item:setEnabled(false)
                self.ListView_army:addChild(cur_item)
            end
        end

        self.rewardItemVec = {}

        for k, soldier in pairs(self.storyData.soldierVec) do
            local soldierId = soldier.itemId 
            local soldierData = g_pTBLMgr:getItemConfigTBLDataById(soldierId)  
            if soldierData then
                soldierData.num = soldier.num 
                table.insert(self.rewardItemVec, soldierData)

                local itemCell = ItemCell:new()
                itemCell:initData(soldierData, k) 

                local cur_item = ccui.Layout:create()
                cur_item:setContentSize(itemCell:getContentSize())
                cur_item:addChild(itemCell)
                cur_item:setEnabled(false)
                self.ListView_army:addChild(cur_item)
            end
        end
        local len = #self.storyData.soldierVec + #self.storyData.generalVec
        local armyInnerWidth = len*90 + 10*(len-1)
        if armyInnerWidth < self.ListView_armySize.width then
            self.ListView_army:setContentSize(cc.size(armyInnerWidth, self.ListView_armySize.height))
            self.ListView_army:setBounceEnabled(false)
        else
            self.ListView_army:setContentSize(self.ListView_armySize)
            self.ListView_army:setBounceEnabled(true)
        end
        self.ListView_army:forceDoLayout()   --forceDoLayout   --refreshView

        for k, reward in pairs(self.storyData.rewardsVec) do
            local itemId = reward.itemId    --{["itemId"] = strVec[1], ["num"] = strVec[2]}
            local itemData = g_pTBLMgr:getItemConfigTBLDataById(itemId) 
            if itemData then
                table.insert(self.rewardItemVec, itemData)

                itemData.num = reward.num 
                local itemCell = ItemCell:new()
                itemCell:initData(itemData, k) 

                local cur_item = ccui.Layout:create()
                cur_item:setContentSize(itemCell:getContentSize())
                cur_item:addChild(itemCell)
                cur_item:setEnabled(false)
                self.ListView_reward:addChild(cur_item)
            end
        end
        local len = #self.storyData.rewardsVec
        local rewardInnerWidth = len*90 + 10*(len-1)
        if rewardInnerWidth < self.ListView_rewardSize.width then
            self.ListView_reward:setContentSize(cc.size(rewardInnerWidth, self.ListView_rewardSize.height))
            self.ListView_reward:setBounceEnabled(false)
        else
            self.ListView_reward:setContentSize(self.ListView_rewardSize)
            self.ListView_reward:setBounceEnabled(true)
        end
        self.ListView_reward:forceDoLayout()   --forceDoLayout   --refreshView
    end
end

function StroyResultLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then  
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_StoryResultLayer)
        elseif sender == self.Button_ok then   --寻路或领取
            local storyPlayedState = g_HeroDataMgr:GetStoryPlayedState()  --任务故事进程状态（0初始，1文字播放完成，2展示寻路完成，3最终完成）
            if string.len(self.storyData.targetCity) > 0 and storyPlayedState == 1 then  --自动寻路
                local mapLayer = g_pGameLayer:GetLayerByUId(g_GameLayerTag.LAYER_TAG_CHINAMAP)
                if mapLayer then
                    mapLayer:autoPathMapByCity(self.storyData.targetCity)
                    g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_StoryResultLayer)
                end
            else   --领取奖励
                local tipsArr = {}
                local bagVec = {}
                for k, itemData in pairs(self.rewardItemVec) do
                    local str = string.format(lua_Item_String2, itemData.num, itemData.quality, itemData.name)   --"恭喜你，获得%d个%d级的%s！"
                    table.insert(tipsArr, {["text"]=str, ["color"]=g_ColorDef.Green, ["fontSize"]=g_rewardTipsFontSize})
                    table.insert(bagVec, {["itemId"]=itemData.id_str, ["num"]=itemData.num})
                end
                if #tipsArr > 0 then
                    g_pGameLayer:ShowScrollTips(tipsArr)
                    g_HeroDataMgr:SetBagXMLData(bagVec)   --保存玩家背包物品数据到bagXML
                end

                local campData = g_HeroDataMgr:GetHeroCampData()
                if campData and #self.storyData.generalVec > 0 then
                    local generalVec = campData.generalIdVec or {}
                    for k, generalId in pairs(self.storyData.generalVec) do
                        table.insert(generalVec, generalId)

                        local generalData = g_pTBLMgr:getGeneralConfigTBLDataById(generalId) 
                        if generalData then
                            g_HeroDataMgr:SetSingleGeneralData(generalData)   --保存单个武将数据到generalXML
                        else
                            G_Log_Error("generalData = nil, generalId = ", generalId or -1)
                        end
                    end
                    g_HeroDataMgr:SetHeroCampGeneral(generalVec)    --保存新武将到heroXML
                end

                --下一个剧情
                g_pGameLayer:StoryFinishCallBack(self.storyId) 

                g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_StoryResultLayer)
            end
        end
    end
end


return StroyResultLayer
