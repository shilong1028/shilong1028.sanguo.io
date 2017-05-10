
--战役结束信息
local BattleResultLayer = class("BattleResultLayer", CCLayerEx)

local ItemCell = require("Layer.Item.ItemCell")

function BattleResultLayer:create()   --自定义的create()创建方法
    --G_Log_Info("BattleResultLayer:create()")
    local layer = BattleResultLayer.new()
    return layer
end

function BattleResultLayer:onExit()
    --G_Log_Info("BattleResultLayer:onExit()")
end

--初始化UI界面
function BattleResultLayer:init()  
    --G_Log_Info("BattleResultLayer:init()")
    local csb = cc.CSLoader:createNode("csd/BattleResultLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    --self:showInTheMiddle(csb)

    self.Image_bg = csb:getChildByName("Image_bg")
    self.titleBg = self.Image_bg:getChildByName("titleBg")
    self.Text_title = self.Image_bg:getChildByName("Text_title")

    self.Button_close = self.Image_bg:getChildByName("Button_close")   
    self.Button_close:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_ok = self.Image_bg:getChildByName("Button_ok")   
    self.Button_ok:addTouchEventListener(handler(self,self.touchEvent))

    self.ListView_reward = self.Image_bg:getChildByName("ListView_reward")
    self.ListView_reward:setBounceEnabled(true)
    self.ListView_reward:setScrollBarEnabled(false)   --屏蔽列表滚动条
    self.ListView_reward:setItemsMargin(5.0)
    self.ListView_rewardSize = self.ListView_reward:getContentSize()

    --攻击方
    self.Image_attHead = self.Image_bg:getChildByName("Image_attHead")
    self.Text_attlose_bing = self.Image_bg:getChildByName("Text_attlose_bing")
    self.Text_attlose_money = self.Image_bg:getChildByName("Text_attlose_money")
    self.Text_attlose_food = self.Image_bg:getChildByName("Text_attlose_food")

    --防御方
    self.Image_defHead = self.Image_bg:getChildByName("Image_defHead")
    self.Text_deflose_bing = self.Image_bg:getChildByName("Text_deflose_bing")
    self.Text_deflose_money = self.Image_bg:getChildByName("Text_deflose_money")
    self.Text_deflose_food = self.Image_bg:getChildByName("Text_deflose_food")

    --胜败及星星
    self.Image_effect = self.Image_bg:getChildByName("Image_effect")
    self.Image_result = self.Image_bg:getChildByName("Image_result")
    self.Image_starVec = {}
    self.Image_starVec[1] = self.Image_bg:getChildByName("Image_star1")
    self.Image_starVec[2] = self.Image_bg:getChildByName("Image_star2")
    self.Image_starVec[3] = self.Image_bg:getChildByName("Image_star3")
end

function BattleResultLayer:initBattleResult(result)  
    --G_Log_Dump(result, "result = ")
    local storyId = result.storyId
    self.storyData = g_pTBLMgr:getStoryConfigTBLDataById(storyId) 
    if self.storyData then
        self.Text_title:setString(self.storyData.name)

        local bgWidth = 200
        if self.Text_title:getContentSize().width > 180 then
            bgWidth = self.Text_title:getContentSize().width + 20
        end
        self.titleBg:setContentSize(cc.size(bgWidth, self.Text_title:getContentSize().height + 10))

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

        --攻击方
        local campId = g_HeroDataMgr:GetHeroCampData().campId
        self.Image_attHead:loadTexture(string.format("Head/%d001.png", campId), ccui.TextureResType.localType)
        self.Text_attlose_bing:setString(string.format(lua_Battle_String1, 800))
        self.Text_attlose_money:setString(string.format(lua_Battle_String2, 800))
        self.Text_attlose_food:setString(string.format(lua_Battle_String3, 800))

        --防御方
        self.Image_defHead:loadTexture(string.format("Head/%s.png", self.storyData.enemyIdVec[1]), ccui.TextureResType.localType)
        self.Text_deflose_bing:setString(string.format(lua_Battle_String1, 1000))
        self.Text_deflose_money:setString(string.format(lua_Battle_String2, 1000))
        self.Text_deflose_food:setString(string.format(lua_Battle_String3, 1000))

        local winStar = result.winStar  --<=0失败,>0胜利，123表示星星
        if winStar <= 0 then
            self.Image_result:loadTexture("public_fail.png", ccui.TextureResType.plistType)
        else
            self.Image_result:loadTexture("public_win.png", ccui.TextureResType.plistType)
            self.Image_effect:runAction(cc.RepeatForever:create(cc.RotateBy:create(10.0, 360)))

            --下一个剧情
            local nextStoryId = storyId + 1
            g_HeroDataMgr:SetStoryTalkId(nextStoryId)   --保存下一个主线剧情任务ID

            --发送处主线剧情任务监听事件
            local event = cc.EventCustom:new(g_EventListenerCustomName.MainMenu_mainStoryEvent)
            event._usedata = string.format("%d", nextStoryId)   --下一个剧情任务ID
            g_EventDispatcher:dispatchEvent(event)  
        end
        for i=1, 3 do
            if i <= winStar then
                self.Image_starVec[i]:loadTexture("public_star.png", ccui.TextureResType.plistType)
            else
                self.Image_starVec[i]:loadTexture("public_star_gray.png", ccui.TextureResType.plistType)
            end
        end
    end
end

function BattleResultLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then  
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_BattleResultLayer)
        elseif sender == self.Button_ok then   
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_BattleResultLayer)
        end
    end
end


return BattleResultLayer
