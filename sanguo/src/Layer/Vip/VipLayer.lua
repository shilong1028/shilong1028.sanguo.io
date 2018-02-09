
local VipLayer = class("VipLayer", CCLayerEx) --填入类名

local VipInfoCell = require("Layer.Vip.VipInfoCell")

function VipLayer:create()         --自定义的create()创建方法
    --G_Log_Info("VipLayer:create()")
    local layer = VipLayer.new()
    return layer
end

function VipLayer:onExit() 
    --G_Log_Info("VipLayer:onExit()")
    if nil ~= self.vip_listener then   --vip监听
        g_EventDispatcher:removeEventListener(self.vip_listener)
    end
end

function VipLayer:init()  
    --G_Log_Info("VipLayer:init()")
    local csb = cc.CSLoader:createNode("csd/vipLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    self.csb = csb

    self.Image_bg = csb:getChildByName("Image_bg")   --背景图
    self.Panel_cell = self.Image_bg:getChildByName("Panel_cell")    --vipInfoCell容器
    self.Panel_cellRect = self.Panel_cell:getBoundingBox()   --cc.rect(0, 0, s.width, s.height)

    self.LoadingBarBg = self.Image_bg:getChildByName("LoadingBarBg")   --进度条
    self.LoadingBar = self.LoadingBarBg:getChildByName("LoadingBar")
    self.LoadingText = self.LoadingBarBg:getChildByName("Text_desc")  --10/100
    self.LoadingText:setString("")

    self.Text_cur = self.Image_bg:getChildByName("Text_cur")
    self.Text_curName = self.Image_bg:getChildByName("Text_curName")   --当前爵位名称
    self.Text_next = self.Image_bg:getChildByName("Text_next")
    self.Text_nextName = self.Image_bg:getChildByName("Text_nextName")  --下级爵位名称
    self.Text_desc = self.Image_bg:getChildByName("Text_desc")    --爵位差值说明/最高级

    self.Button_close = self.Image_bg:getChildByName("Button_close")   
    self.Button_close:addTouchEventListener(handler(self,self.touchEvent))  

    self.Button_left = self.Image_bg:getChildByName("Button_left")   
    self.Button_left:addTouchEventListener(handler(self,self.touchEvent))  
    self.Text_desc_left = self.Button_left:getChildByName("Text_desc_left")    --前一级

    self.Button_right = self.Image_bg:getChildByName("Button_right")   
    self.Button_right:addTouchEventListener(handler(self,self.touchEvent)) 
    self.Text_desc_right = self.Button_right:getChildByName("Text_desc_right")   --下一级

    self.vipCellSize = cc.size(700, 400)

    self:initTouchEvent()   --注册点击事件

    self:initVipData()

    --vip变化监听
    local function vip_listenerCallBack(event)
        local vipId = tonumber(event._usedata)
        self:initVipData()
    end
    self.vip_listener = cc.EventListenerCustom:create(g_EventListenerCustomName.MainMenu_vipEvent, vip_listenerCallBack)
    g_EventDispatcher:addEventListenerWithFixedPriority(self.vip_listener, 1)
end

function VipLayer:initVipData()   --vipLv从零开始
    self.maxVipId = g_pTBLMgr:getVipConfigMaxCount()
    local vipXml = g_HeroDataMgr:GetVipXmlData()
    local real_vipId = vipXml.vipId or 0
    self.real_vipId = real_vipId
    local curVipData = g_pTBLMgr:getVipConfigById(real_vipId)
    if curVipData then
        self.Text_curName:setString(real_vipId..curVipData.name)
        if real_vipId >= self.maxVipId then
            self.Text_next:setVisible(false)
            self.Text_nextName:setVisible(false)
            self.Text_desc:setString(lua_str_WarnTips7)   --"最高级"
            self.LoadingBar:setPercent(100)
            self.LoadingText:setString("")
        else
            self.Text_next:setVisible(true)
            self.Text_nextName:setVisible(true)
            local nextVipData = g_pTBLMgr:getVipConfigById(real_vipId + 1)
            self.Text_nextName:setString((real_vipId+1)..nextVipData.name)
            local offsetGlod = nextVipData.gold - vipXml.vipgold
            self.Text_desc:setString(string.format(lua_Vip_Str1, offsetGlod))   --"再充值%d银锭即可提升为"
            local percent = vipXml.vipgold/nextVipData.gold*100
            self.LoadingBar:setPercent(percent)
            self.LoadingText:setString(vipXml.vipgold.."/"..nextVipData.gold)
        end
    end

    self:initVipCell(real_vipId)
end

function VipLayer:initVipCell(vipId) 
    --G_Log_Info("initVipCell(), vipId = %d", vipId)
    if not self.preVipCell then
        self.preVipCell = VipInfoCell:create()
        self.preVipCell:setParentLayer(self, vipId-1)
        self.preVipCell:setPosition(cc.p(-self.vipCellSize.width,0))
        self.Panel_cell:addChild(self.preVipCell)
    end

    if not self.curVipCell then
        self.curVipCell = VipInfoCell:create()
        self.curVipCell:setParentLayer(self, vipId)
        self.curVipCell:setPosition(cc.p(0,0))
        self.Panel_cell:addChild(self.curVipCell)
    end

    if not self.nextVipCell then
        self.nextVipCell = VipInfoCell:create()
        self.nextVipCell:setParentLayer(self, vipId+1)
        self.nextVipCell:setPosition(cc.p(self.vipCellSize.width,0))
        self.Panel_cell:addChild(self.nextVipCell)
    end

    self.vipId = vipId
    if vipId <=0 then
        self.Button_left:setVisible(false)
        local nextVipData = g_pTBLMgr:getVipConfigById(vipId+1)
        self.Text_desc_right:setString(string.format(lua_Vip_Str2, (vipId+1)..nextVipData.name))
    elseif vipId >= self.maxVipId then
        self.Button_right:setVisible(false)
        local preVipData = g_pTBLMgr:getVipConfigById(vipId-1)
        self.Text_desc_left:setString(string.format(lua_Vip_Str3, (vipId-1)..preVipData.name))
    else
        self.Button_left:setVisible(true)
        self.Button_right:setVisible(true)
        local preVipData = g_pTBLMgr:getVipConfigById(vipId-1)
        self.Text_desc_left:setString(string.format(lua_Vip_Str3, (vipId-1)..preVipData.name))
        local nextVipData = g_pTBLMgr:getVipConfigById(vipId+1)
        self.Text_desc_right:setString(string.format(lua_Vip_Str2, (vipId+1)..nextVipData.name))
    end
end

function VipLayer:offsetUI(offset)
    --G_Log_Info("offsetUI, offset = %d", offset)
    local vipId = self.vipId + (offset or 0)
    if vipId <= 0 then
        vipId = 0 
    elseif vipId > self.maxVipId then
        vipId = self.maxVipId
    end
    self.vipId = vipId
    self:initVipCell(vipId)

    if offset == 0 then
        local offsetX = 0 - self.curVipCell:getPositionX()
        self:movingCell(offsetX, 0)
    elseif offset == 1 then   --向左移动大于一半，vipId+1
        local offsetX = -(801 + self.curVipCell:getPositionX())
        self:movingCell(offsetX, 1)
    elseif offset == -1 then   --向右移动大于一半，vipId-1
        local offsetX = 801 - self.curVipCell:getPositionX()
        self:movingCell(offsetX, -1)
    end
end

function VipLayer:movingCell(offsetX, offset)
    --G_Log_Info("movingCell, offsetX = %d", offsetX)
    self.curVipCell:stopAllActions()
    self.preVipCell:stopAllActions()
    self.nextVipCell:stopAllActions()

    if offset == nil then
        self.curVipCell:setPositionX(self.curVipCell:getPositionX() + offsetX)
        self.preVipCell:setPositionX(self.preVipCell:getPositionX() + offsetX)
        self.nextVipCell:setPositionX(self.nextVipCell:getPositionX() + offsetX)
    else
        local function callback()
            if offset == 0 then

            elseif offset == 1 then    --向左移动大于一半，viplv+1
                local temp = self.preVipCell
                self.preVipCell = self.curVipCell
                self.curVipCell = self.nextVipCell
                self.nextVipCell = temp
            elseif offset == -1 then   --向右移动大于一半，viplv-1
                local temp = self.nextVipCell
                self.nextVipCell = self.curVipCell
                self.curVipCell = self.preVipCell
                self.preVipCell = temp
            end
            self.curVipCell:setPosition(cc.p(0,0))
            self.curVipCell:setParentLayer(self, self.vipId)
            self.preVipCell:setPosition(cc.p(-self.vipCellSize.width,0))
            self.preVipCell:setParentLayer(self, self.vipId-1)
            self.nextVipCell:setPosition(cc.p(self.vipCellSize.width,0))
            self.nextVipCell:setParentLayer(self, self.vipId+1)
        end

        local time = math.abs(offsetX)/self.vipCellSize.width * 1.0
        self.curVipCell:runAction(cc.Sequence:create(cc.MoveBy:create(time, cc.p(offsetX,0)), cc.CallFunc:create(callback)))
        self.preVipCell:runAction(cc.MoveBy:create(time, cc.p(offsetX,0)))
        self.nextVipCell:runAction(cc.MoveBy:create(time, cc.p(offsetX,0)))
    end
end

function VipLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then 
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_VipLayer)
        elseif sender == self.Button_left then   
            self:offsetUI(-1)    --左，vipId-1
        elseif sender == self.Button_right then 
            self:offsetUI(1)    --右，vipId+1
        end
    end
end

function VipLayer:initTouchEvent()
    --G_Log_Info("VipLayer:initTouchEvent()")
    local function onTouchBegan(touch, event)
        return self:onTouchBegan(touch, event)
    end

    local function onTouchMoved(touch, event)
         self:onTouchMoved(touch, event)
    end

    local function onTouchEnded(touch, event)
        self:onTouchEnded(touch, event)
    end

    local listener = cc.EventListenerTouchOneByOne:create()
    --listener:setSwallowTouches(true)   --给触摸监听函数设置吞没事件，使得触摸上面的层的时候事件不会向下传递
    listener:registerScriptHandler(onTouchBegan,cc.Handler.EVENT_TOUCH_BEGAN )
    listener:registerScriptHandler(onTouchMoved,cc.Handler.EVENT_TOUCH_MOVED )
    listener:registerScriptHandler(onTouchEnded,cc.Handler.EVENT_TOUCH_ENDED )

    local eventDispatcher = self:getEventDispatcher()
    eventDispatcher:addEventListenerWithSceneGraphPriority(listener, self.Panel_cell)

    self.touchListener = listener
end

function VipLayer:onTouchBegan(touch, event)
    --G_Log_Info("VipLayer:onTouchBegan()")
    local pos = self.Image_bg:convertToNodeSpace(touch:getLocation())  
    if cc.rectContainsPoint(self.Panel_cellRect, pos) == true then
        self.beginPos = pos 
        self.firstBeginPos = pos
    else
        self.beginPos = nil
        self.firstBeginPos = nil
    end
    return true   --只有当onTouchBegan的返回值是true时才执行后面的onTouchMoved和onTouchEnded触摸事件
end

function VipLayer:onTouchMoved(touch, event)
    --G_Log_Info("VipLayer:onTouchMoved()")
    if self.beginPos and self.firstBeginPos then
        local pos = self.Image_bg:convertToNodeSpace(touch:getLocation())
        if cc.rectContainsPoint(self.Panel_cellRect, pos) == true then  
            local offsetX = pos.x - self.beginPos.x
            local curPosX = self.curVipCell:getPositionX()
            local orgPosX = 0
            if self.vipId <=0 and offsetX >=0 then   --向右移动，vipId将-1
                if offsetX <= -curPosX then
                    self:movingCell(offsetX)
                    self.beginPos = pos     
                end 
            elseif self.vipId >= self.maxVipId and offsetX <=0 then  --向左移动，vipId将+1
                if -offsetX <= curPosX then
                    self:movingCell(offsetX)
                    self.beginPos = pos 
                end 
            else
                self:movingCell(offsetX)
                self.beginPos = pos 
            end 
        else
            local offsetX = pos.x - self.firstBeginPos.x
            if self.vipId >0 and offsetX > self.vipCellSize.width/2 then   --向右移动大于一半，vipId-1
                self:offsetUI(-1)
            elseif self.vipId < self.maxVipId and offsetX < -self.vipCellSize.width/2 then   --向左移动大于一半，vipId+1
                self:offsetUI(1)
            else --还原
                self:offsetUI(0)
            end
            self.beginPos = nil
            self.firstBeginPos = nil
        end
    else
        self.beginPos = nil
        self.firstBeginPos = nil
    end
end

function VipLayer:onTouchEnded(touch, event)
    --G_Log_Info("VipLayer:onTouchEnded()")
    if self.firstBeginPos then
        local pos = self.Image_bg:convertToNodeSpace(touch:getLocation())
        local offsetX = pos.x - self.firstBeginPos.x
        if self.vipId >0 and offsetX > self.vipCellSize.width/2 then   --向右移动大于一半，vipId-1
            self:offsetUI(-1)
        elseif self.vipId < self.maxVipId and offsetX < -self.vipCellSize.width/2 then   --向左移动大于一半，vipId+1
            self:offsetUI(1)
        else --还原
            self:offsetUI(0)
        end
    end
    self.beginPos = nil
    self.firstBeginPos = nil
end

return VipLayer
