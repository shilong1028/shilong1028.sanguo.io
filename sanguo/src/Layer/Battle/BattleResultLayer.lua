
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
    self.csbRoot = csb

    self.Image_bg = csb:getChildByName("Image_bg")
    self.titleBg = self.Image_bg:getChildByName("titleBg")
    self.Text_title = self.Image_bg:getChildByName("Text_title")

    self.Button_close = self.Image_bg:getChildByName("Button_close")   
    self.Button_close:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_ok = self.Image_bg:getChildByName("Button_ok")   
    self.Button_ok:addTouchEventListener(handler(self,self.touchEvent))

    self.Text_reward = self.Image_bg:getChildByName("Text_reward")
    --奖励物品列表
    self.ListView_reward = self.Image_bg:getChildByName("ListView_reward")
    self.ListView_reward:setBounceEnabled(true)
    self.ListView_reward:setScrollBarEnabled(false)   --屏蔽列表滚动条
    self.ListView_reward:setItemsMargin(10.0)
    self.ListView_rewardSize = self.ListView_reward:getContentSize()

    --攻击方
    self.Image_attHead = self.Image_bg:getChildByName("Image_attHead")
    self.Text_attlose_bing = self.Image_bg:getChildByName("Text_attlose_bing")   --消耗兵力
    self.Text_attlose_money = self.Image_bg:getChildByName("Text_attlose_money")   --消耗金钱
    self.Text_attlose_food = self.Image_bg:getChildByName("Text_attlose_food")    --消耗粮草

    --防御方
    self.Image_defHead = self.Image_bg:getChildByName("Image_defHead")
    self.Text_deflose_bing = self.Image_bg:getChildByName("Text_deflose_bing")
    self.Text_deflose_money = self.Image_bg:getChildByName("Text_deflose_money")
    self.Text_deflose_food = self.Image_bg:getChildByName("Text_deflose_food")

    --胜败及星星
    self.Image_effect = self.Image_bg:getChildByName("Image_effect")   --光芒背景
    self.Image_result = self.Image_bg:getChildByName("Image_result")   --胜败
    self.Image_starVec = {}
    self.Image_starVec[1] = self.Image_bg:getChildByName("Image_star1")   --星星
    self.Image_starVec[2] = self.Image_bg:getChildByName("Image_star2")
    self.Image_starVec[3] = self.Image_bg:getChildByName("Image_star3")
end

function BattleResultLayer:initBattleResult(result)  
    --G_Log_Dump(result, "result = ")
    --[[
        self.battleName = ""    --战斗名称
        self.battleDesc = ""     --战斗描述

        self.starNum = 0  --战斗星级，0为失败
        --我方主将ID，伤兵，耗金，耗粮
        self.myGeneralIdStr = ""
        self.myLoseBingNum = 0
        self.myLoseMoneyNum = 0
        self.myLoseFoodNum = 0
        --敌方主将ID，伤兵，耗金，耗粮
        self.enemyGeneralIdStr = ""
        self.enemyLoseBingNum = 0
        self.enemyLoseMoneyNum = 0
        self.enemyLoseFoodNum = 0

        self.rewardsVec = {}   --战斗奖励集合
    ]]
    self.resultData = result
    if result then
        self.Text_title:setString(self.resultData.battleName)

        local bgWidth = 200
        if self.Text_title:getContentSize().width > 180 then
            bgWidth = self.Text_title:getContentSize().width + 20
        end
        self.titleBg:setContentSize(cc.size(bgWidth, self.Text_title:getContentSize().height + 10))

        --攻击方
        self.Image_attHead:loadTexture(string.format("Head/%s.png", self.resultData.myGeneralIdStr), ccui.TextureResType.localType)
        self.Text_attlose_bing:setString(string.format(lua_Battle_String1, self.resultData.myLoseBingNum))
        self.Text_attlose_money:setString(string.format(lua_Battle_String2, self.resultData.myLoseMoneyNum))
        self.Text_attlose_food:setString(string.format(lua_Battle_String3, self.resultData.myLoseFoodNum))

        --防御方
        self.Image_defHead:loadTexture(string.format("Head/%s.png", self.resultData.enemyGeneralIdStr), ccui.TextureResType.localType)
        self.Text_deflose_bing:setString(string.format(lua_Battle_String1, self.resultData.enemyLoseBingNum))
        self.Text_deflose_money:setString(string.format(lua_Battle_String2, self.resultData.enemyLoseMoneyNum))
        self.Text_deflose_food:setString(string.format(lua_Battle_String3, self.resultData.enemyLoseFoodNum))

        if self.resultData.starNum <= 0 then  --<=0失败,>0胜利，123表示星星
            self.Image_result:loadTexture("public_fail.png", ccui.TextureResType.plistType)
            self.Image_effect:setVisible(false)

            local emitter1 = cc.ParticleSystemQuad:create("Particles/bigFire.plist")
            --设置粒子RGBA值
            --emitter1:setStartColor(cc.c4f(1,0,0,1))
            --是否添加混合
            emitter1:setBlendAdditive(false)
            --完成后制动移除       
            emitter1:setAutoRemoveOnFinish(false)
            emitter1:setScale(0.3)
            emitter1:setPosition(cc.p(self.Text_reward:getContentSize().width/2, self.Text_reward:getContentSize().height/2 - 100))
            self.Text_reward:addChild(emitter1) 

            self.ListView_reward:setVisible(false)
        else
            self.Image_result:loadTexture("public_win.png", ccui.TextureResType.plistType)
            --self.Image_effect:runAction(cc.RepeatForever:create(cc.RotateBy:create(10.0, 360)))
            self.Image_effect:setVisible(true)

            local emitter1 = cc.ParticleSystemQuad:create("Particles/flash.plist")
            --设置粒子RGBA值
            --emitter1:setStartColor(cc.c4f(1,0,0,1))
            --是否添加混合
            emitter1:setBlendAdditive(false)
            --完成后制动移除       
            emitter1:setAutoRemoveOnFinish(false)
            emitter1:setScale(0.7)
            emitter1:setPosition(cc.p(self.Image_effect:getContentSize().width/2, self.Image_effect:getContentSize().height/2))
            self.Image_effect:addChild(emitter1) 

            --奖励
            self.ListView_reward:setVisible(true)
            for k, reward in pairs(self.resultData.rewardsVec) do
                local itemId = reward.itemId    --{["itemId"] = strVec[1], ["num"] = strVec[2]}
                local itemData = g_pTBLMgr:getItemConfigTBLDataById(itemId) 
                if itemData then
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
            local len = #self.resultData.rewardsVec
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

        for i=1, 3 do
            if i <= self.resultData.starNum then
                self.Image_starVec[i]:loadTexture("public_star.png", ccui.TextureResType.plistType)
            else
                self.Image_starVec[i]:loadTexture("public_star_gray.png", ccui.TextureResType.plistType)
            end
        end
    end
end

function BattleResultLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close or sender == self.Button_ok then  
            local battleStoryData = g_BattleDataMgr:getBattleStoryData() 
            if battleStoryData and self.resultData.starNum > 0 then   --任务完成
                --下一个剧情
                g_pGameLayer:StoryFinishCallBack(battleStoryData.storyId) 
            end
 
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_BattleResultLayer)

            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_BATTLEMAP)

            g_pGameLayer:GameMainLayer()   --进入游戏
        end
    end
end


return BattleResultLayer
