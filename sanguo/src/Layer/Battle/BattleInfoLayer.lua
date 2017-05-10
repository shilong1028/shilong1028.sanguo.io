
--战役信息
local BattleInfoLayer = class("BattleInfoLayer", CCLayerEx)

local SmallOfficerCell = require("Layer.Role.SmallOfficerCell")
local ItemCell = require("Layer.Item.ItemCell")

function BattleInfoLayer:create()   --自定义的create()创建方法
    --G_Log_Info("BattleInfoLayer:create()")
    local layer = BattleInfoLayer.new()
    return layer
end

function BattleInfoLayer:onExit()
    --G_Log_Info("BattleInfoLayer:onExit()")
end

--初始化UI界面
function BattleInfoLayer:init()  
    --G_Log_Info("BattleInfoLayer:init()")
    local csb = cc.CSLoader:createNode("csd/BattleInfoLayer.csb")
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

    self.ListView_enemy = self.Image_bg:getChildByName("ListView_enemy")
    self.ListView_enemy:setBounceEnabled(true)
    self.ListView_enemy:setScrollBarEnabled(false)   --屏蔽列表滚动条
    self.ListView_enemy:setItemsMargin(5.0)
    self.ListView_enemySize = self.ListView_enemy:getContentSize()
    
    self.ListView_reward = self.Image_bg:getChildByName("ListView_reward")
    self.ListView_reward:setBounceEnabled(true)
    self.ListView_reward:setScrollBarEnabled(false)   --屏蔽列表滚动条
    self.ListView_reward:setItemsMargin(5.0)
    self.ListView_rewardSize = self.ListView_reward:getContentSize()
end

function BattleInfoLayer:initStoryInfo(storyId)  
    self.storyId = storyId
    self.storyData = g_pTBLMgr:getStoryConfigTBLDataById(storyId) 
    if self.storyData then
        self.Text_title:setString(self.storyData.name)

        local bgWidth = 200
        if self.Text_title:getContentSize().width > 180 then
            bgWidth = self.Text_title:getContentSize().width + 20
        end
        self.titleBg:setContentSize(cc.size(bgWidth, self.Text_title:getContentSize().height + 10))

        self.Text_info:setString("    "..self.storyData.desc)

        for k, enemId in pairs(self.storyData.enemyIdVec) do
            local generalData = g_pTBLMgr:getGeneralConfigTBLDataById(enemId) 
            if generalData then
                local officerCell = SmallOfficerCell:new()
                officerCell:initData(generalData) 

                local cur_item = ccui.Layout:create()
                cur_item:setContentSize(officerCell:getContentSize())
                cur_item:addChild(officerCell)
                cur_item:setEnabled(false)
                self.ListView_enemy:addChild(cur_item)
            end
        end
        local enemyInnerWidth = #self.storyData.enemyIdVec*(90 + 5)
        if enemyInnerWidth < self.ListView_enemySize.width then
            self.ListView_enemy:setContentSize(cc.size(enemyInnerWidth, self.ListView_enemySize.height))
            self.ListView_enemy:setBounceEnabled(false)
        else
            self.ListView_enemy:setContentSize(self.ListView_enemySize)
            self.ListView_enemy:setBounceEnabled(true)
        end

        for k, reward in pairs(self.storyData.rewardIdVec) do
            local itemId = reward.itemId    --{["itemId"] = strVec[1], ["num"] = strVec[2]}
            local itemData = g_pTBLMgr:getItemConfigTBLDataById(itemId) 
            if itemData then
                itemData.num = reward.num 
                local itemCell = ItemCell:new()
                itemCell:initData(itemData) 

                local cur_item = ccui.Layout:create()
                cur_item:setContentSize(itemCell:getContentSize())
                cur_item:addChild(itemCell)
                cur_item:setEnabled(false)
                self.ListView_reward:addChild(cur_item)
            end
        end
        local rewardInnerWidth = #self.storyData.rewardIdVec*(90 + 5)
        if rewardInnerWidth < self.ListView_rewardSize.width then
            self.ListView_reward:setContentSize(cc.size(rewardInnerWidth, self.ListView_rewardSize.height))
            self.ListView_reward:setBounceEnabled(false)
        else
            self.ListView_reward:setContentSize(self.ListView_rewardSize)
            self.ListView_reward:setBounceEnabled(true)
        end
    end
end

function BattleInfoLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then  
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_BattleInfoLayer)
        elseif sender == self.Button_ok then   --调兵遣将
            g_BattleDataMgr:setBattleStoryData(self.storyData)
            g_pGameLayer:showZhenXingLayer(true)
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_BattleInfoLayer)
        end
    end
end


return BattleInfoLayer
