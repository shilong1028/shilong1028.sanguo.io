
--战役信息
local BattleInfoLayer = class("BattleInfoLayer", CCLayerEx)

local SmallOfficerCell = require("Layer.Role.SmallOfficerCell")

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
    self.ListView_reward = self.Image_bg:getChildByName("ListView_reward")
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
                self.ListView_enemy:addChild(officerCell)
            end
        end

        for k, rewardId in pairs(self.storyData.rewardIdVec) do

        end
        --self.ListView:addChild(self.Text_content)
    end
end

function BattleInfoLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then  

        elseif sender == self.Button_ok then   --调兵遣将

        end
    end
end


return BattleInfoLayer
