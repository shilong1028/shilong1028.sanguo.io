
local VipInfoCell = class("VipInfoCell", CCLayerEx) --填入类名
local ItemCell = require("Layer.Item.ItemCell")

function VipInfoCell:create()         --自定义的create()创建方法
    --G_Log_Info("VipInfoCell:create()")
    local layer = VipInfoCell.new()
    return layer
end

function VipInfoCell:onExit() 
    --G_Log_Info("VipInfoCell:onExit()")
end

function VipInfoCell:init()  
    --G_Log_Info("VipInfoCell:init()")
    local csb = cc.CSLoader:createNode("csd/vipInfoCell.csb")
    self:addChild(csb)

    self:setTouchEnabled(false)

    self.Image_bg = csb:getChildByName("Image_bg")   --背景图
    self.Text_desc_left = csb:getChildByName("Text_desc_left")    --特权描述
    self.Button_chongzhi = csb:getChildByName("Button_chongzhi")   
    self.Button_chongzhi:addTouchEventListener(handler(self,self.touchEvent))  

    self.itemImgVec = {}
    for i=1, 4 do
        local itemBg = csb:getChildByName("Image_"..i) 
        table.insert(self.itemImgVec, itemBg)
    end
end

function VipInfoCell:setParentLayer(parent, vipId)
    self.parentLayer = parent
    self.vipId = vipId
    self:setVisible(true)
    if self.vipId < 0 or self.vipId > self.parentLayer.maxVipId then
        self:setVisible(false)
        return
    end

    local curVipData = g_pTBLMgr:getVipConfigById(self.vipId)
    if curVipData then
        self.Text_desc_left:setString(curVipData.desc)    --特权描述
        for i=1, 4 do
            if i <= #curVipData.rewardsVec then
                self.itemImgVec[i]:removeAllChildren()
                self.itemImgVec[i]:setVisible(true)

                local reward = curVipData.rewardsVec[i]
                local itemId = reward.itemId    --{["itemId"] = strVec[1], ["num"] = strVec[2]}
                local itemData = g_pTBLMgr:getItemConfigTBLDataById(itemId) 
                if itemData then
                    itemData.num = reward.num 
                    local itemCell = ItemCell:new()
                    itemCell:initData(itemData) 
                    self.itemImgVec[i]:addChild(itemCell)
                else
                    self.itemImgVec[i]:setVisible(false)
                end
            else
                self.itemImgVec[i]:setVisible(false)
            end
        end
    end
end

function VipInfoCell:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_chongzhi then   --充值
            g_pGameLayer:ShowScrollTips("点击一次充值10元！")
            local vipXml = g_HeroDataMgr:GetVipXmlData()
            local vipgold = vipXml.vipgold + 10
            local vipId = g_pTBLMgr:getVipIdByGlod(vipgold)
            g_HeroDataMgr:SetVipXmlData(vipId, vipgold)
        end
    end
end

return VipInfoCell
