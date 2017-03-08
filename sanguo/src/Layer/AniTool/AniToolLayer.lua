--动画修改工具层

local AniToolLayer = class("AniToolLayer", CCLayerEx)

function AniToolLayer:create()   --自定义的create()创建方法
    --G_Log_Info("AniToolLayer:create()")
    local layer = AniToolLayer.new()
    return layer
end

function AniToolLayer:onExit()
    --G_Log_Info("AniToolLayer:onExit()")
    if self.pausedTargets ~= nil then
        g_Director:getActionManager():resumeTargets(self.pausedTargets)
    end
    self.pausedTargets = nil
end

--初始化UI界面
function AniToolLayer:init()  
    --G_Log_Info("AniToolLayer:init()")
    local csb = cc.CSLoader:createNode("csd/aniToolLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    --self:showInTheMiddle(csb)

    --self.m_Menu         = tolua.cast(self.owner["m_layerMenu"],"cc.Menu") 
    self.backBg1 = csb:getChildByName("Image_left")   --左侧动画播放区域 (400,350)
    self.backBg2 = csb:getChildByName("Image_right")   --右侧动画帧信息列表

    local function BtnColseCallback(sender, eventType)
        self:touchEvent(sender, eventType)
    end
    self.Button_close = csb:getChildByName("Button_close")   
    self.Button_close:addTouchEventListener(BtnColseCallback)   --handler(self,self.touchEvent)

    local function BtnPlayCallback(sender, eventType)
        self:touchEvent(sender, eventType)
    end
    self.Button_play = csb:getChildByName("Button_play")   
    self.Button_play:addTouchEventListener(BtnPlayCallback)

    local function BtnPauseCallback(sender, eventType)
        self:touchEvent(sender, eventType)
    end
    self.Button_pause = csb:getChildByName("Button_pause")   
    self.Button_pause:addTouchEventListener(BtnPlayCallback)

    local function BtnResetCallback(sender, eventType)
        self:touchEvent(sender, eventType)
    end
    self.Button_reset = csb:getChildByName("Button_reset")   
    self.Button_reset:addTouchEventListener(BtnPlayCallback)

    self.tableViewCell = {}
    local tableViewSize = self.backBg2:getContentSize()

    local tableView = cc.TableView:create(tableViewSize)  --cc.size(515,600))
    tableView:setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL)
    tableView:setIgnoreAnchorPointForPosition(true)
    tableView:setPosition(cc.p(3, 0))
    tableView:setDelegate()
    tableView:setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN)
    self.backBg2:addChild(tableView, 100, 100)

    local function scrollViewDidScroll(view)
        --G_Log_Info("scrollViewDidScroll")
    end
    tableView:registerScriptHandler(scrollViewDidScroll, cc.SCROLLVIEW_SCRIPT_SCROLL)    --滑动
    local function scrollViewDidZoom(view)
        --G_Log_Info("scrollViewDidZoom")
    end
    tableView:registerScriptHandler(scrollViewDidZoom, cc.SCROLLVIEW_SCRIPT_ZOOM)    --放大
    local function tableCellTouched(view,cell)
        --G_Log_Info("cell touched at index: " .. cell:getIdx())
    end
    tableView:registerScriptHandler(tableCellTouched, cc.TABLECELL_TOUCHED)   --触摸事件
    local function cellSizeForTable(view,idx) 
        return 514,200
    end
    tableView:registerScriptHandler(cellSizeForTable, cc.TABLECELL_SIZE_FOR_INDEX)   --Cell大小
    local function tableCellAtIndex(view, idx)
        return self:tableCellAtIndex(view, idx)
    end
    tableView:registerScriptHandler(tableCellAtIndex, cc.TABLECELL_SIZE_AT_INDEX)  --添加Cell
    local function numberOfCellsInTableView(view)
       return 4
    end
    tableView:registerScriptHandler(numberOfCellsInTableView, cc.NUMBER_OF_CELLS_IN_TABLEVIEW)   --设置Cell个数
    tableView:reloadData()

    self.enemyPos = cc.p(50,250)
    self.playPos = cc.p(550,200)

    self.enemyAni = ImodAnim:create()
    self.enemyAni:initAnimWithName("Monster/btm7_zd.png", "Monster/btm7_zd.ani", true)   
    --调用initAnimWithName方法，会连报三个[LUA ERROR] function refid '1' does not reference a Lua function
    self.enemyAni:PlayActionRepeat(0, 0.1)
    self.enemyAni:setPosition(self.enemyPos)
    self.backBg1:addChild(self.enemyAni)

    self.gongjiAni = nil   --攻击动作
    self.shifaAni = nil   --施法特效
    self.feixingAni = nil  --飞行特效
    self.dajiAni = nil    --打击特效

    self.gongjiData = nil
    self.shifaData = nil
    self.feixingData = nil
    self.dajiData = nil

    self.bPause = false
    self.bPlayerAll = false
    self.pausedTargets = nil
end

function AniToolLayer:tableCellAtIndex(view, idx)
    --G_Log_Info("AniToolLayer:tableCellAtIndex(), idx = %d", idx)
    local cell = view:dequeueCell()
    local aniToolCell = nil
    if nil == cell then
        cell = cc.TableViewCell:new()
        local anicell = require("Layer.AniTool.AniToolCell")
        aniToolCell = anicell:create()   --anicell:new()
        cell:addChild(aniToolCell, 10, 111)    
    else
        aniToolCell = cell:getChildByTag(111)
    end

    if aniToolCell then
        aniToolCell:InitRealy(idx, self)
        table.insert(self.tableViewCell, aniToolCell)
    else
        G_Log_Warning("aniToolCell is nil, idx = %s", idx)
    end

    return cell
end

function AniToolLayer:touchEvent(sender, eventType)
    --G_Log_Info("AniToolLayer:touchEvent")
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then 
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_AniToolLayer) 
            cc.Director:getInstance():endToLua()
        elseif sender == self.Button_play then 
            self:playAllAni()
        elseif sender == self.Button_pause then  
            self:pauseAllAni()
        elseif sender == self.Button_reset then  
            self:removeAllAni()
        end
    end
end

function AniToolLayer:removeAni(cellIdx)
    --G_Log_Info("AniToolLayer:removeAni()")
    if cellIdx == 0 then  --攻击动作    --Monster/btm101_gj
        if self.gongjiAni then
            self.gongjiAni:removeFromParent(true)     
        end
        self.gongjiAni = nil
        self.gongjiData = nil
    elseif cellIdx == 1 then  --施法特效    --Skill/skill_1_s
        if self.shifaAni then
            self.shifaAni:removeFromParent(true)          
        end
        self.shifaAni = nil
        self.shifaData = nil
    elseif cellIdx == 2 then   --飞行特效   --Skill/skill_1_f
        if self.feixingAni then
            self.feixingAni:removeFromParent(true)    
        end
        self.feixingAni = nil
        self.feixingData = nil
    elseif cellIdx == 3 then  --打击特效    --Skill/skill_2_h
        if self.dajiAni then
            self.dajiAni:removeFromParent(true)   
        end
        self.dajiAni = nil
        self.dajiData = nil
    end
end

function AniToolLayer:playAni(beginZhenIdx, cellIdx, aniPath, time_ms)
    --G_Log_Info("AniToolLayer:playAni()")
    self.bPause = false

    if not beginZhenIdx then
        beginZhenIdx = 0
    end
    if not time_ms or time_ms == 0 then
        time_ms = 100
    end

    local imod = nil
    local pos = cc.p(0,0)
    if cellIdx == 0 then  --攻击动作    --Monster/btm101_gj
        if self.gongjiAni == nil then
            self.gongjiAni = ImodAnim:create()
            self.gongjiAni:initAnimWithName(aniPath..".png", aniPath..".ani")
            self.backBg1:addChild(self.gongjiAni);          
        end
        self.gongjiData = {["idx"] = beginZhenIdx, ["ms"] = time_ms}
        imod = self.gongjiAni
        pos = self.playPos
    elseif cellIdx == 1 then  --施法特效    --Skill/skill_1_s
        if self.shifaAni == nil then
            self.shifaAni = ImodAnim:create()
            self.shifaAni:initAnimWithName(aniPath..".png", aniPath..".ani")
            self.backBg1:addChild(self.shifaAni);       
        end
        self.shifaData = {["idx"] = beginZhenIdx, ["ms"] = time_ms}
        imod = self.shifaAni
        pos = self.playPos  
    elseif cellIdx == 2 then   --飞行特效   --Skill/skill_1_f
        if self.feixingAni == nil then
            self.feixingAni = ImodAnim:create()
            self.feixingAni:initAnimWithName(aniPath..".png", aniPath..".ani")
            self.backBg1:addChild(self.feixingAni);
        end
        self.feixingData = {["idx"] = beginZhenIdx, ["ms"] = time_ms}
        imod = self.feixingAni
        pos = self.playPos  
    elseif cellIdx == 3 then  --打击特效    --Skill/skill_1_h
        if self.dajiAni == nil then
            self.dajiAni = ImodAnim:create()
            self.dajiAni:initAnimWithName(aniPath..".png", aniPath..".ani")
            self.backBg1:addChild(self.dajiAni);
        end
        self.dajiData = {["idx"] = beginZhenIdx, ["ms"] = time_ms}
        imod = self.dajiAni   
        pos = self.enemyPos 
    end

    imod:PlayActionRepeat(beginZhenIdx, time_ms/1000)
    imod:setPosition(pos)
    imod:setVisible(true)

    -- if cellIdx == 2 then   --飞行特效
    --     if self.dajiAni then
    --         self.dajiAni:setVisible(false)
    --     end

    --     local function ActionSequenceCallback()
    --         self.feixingAni:setVisible(false)
    --         if self.dajiAni then
    --             self.dajiAni:setVisible(true)
    --         end
    --     end

    --     local function ActionSequenceCallback2()
    --         self.feixingAni:setPosition(self.playPos)  --cc.p(self.playPos.x, self.playPos.y + 50))
    --         self.feixingAni:setVisible(true)
    --         if self.dajiAni then
    --             self.dajiAni:setVisible(false)
    --         end
    --     end

    --     local actionMove = cc.MoveTo:create(1.0, self.enemyPos)   
    --     local actionSequence = cc.Sequence:create(actionMove, cc.CallFunc:create(ActionSequenceCallback), cc.DelayTime:create(1), cc.CallFunc:create(ActionSequenceCallback2))
    --     local actionRepeat = cc.RepeatForever:create(actionSequence)
    --     self.feixingAni:runAction(actionRepeat)
    -- end
end

function AniToolLayer:playAllAni(mask)
    G_Log_Info("AniToolLayer:playAllAni(), mask = %d", mask or 0)
    --攻击动作    --Monster/btm101_gj
    local bReturn = true
    if self.gongjiAni then
        self.gongjiAni:setVisible(false)
        bReturn = false
    end
    if self.shifaAni then
        self.shifaAni:setVisible(false)
        bReturn = false
    end
    if self.feixingAni then
        self.feixingAni:setVisible(false)
        bReturn = false
    end
    if self.dajiAni then
        self.dajiAni:setVisible(false)
        bReturn = false
    end

    if bReturn == true then
        return
    end

    if self.bPlayerAll == true and self.bPause == false then
        return
    end
    self.bPlayerAll = true

    if self.bPause == true then
        if self.pausedTargets ~= nil then
            g_Director:getActionManager():resumeTargets(self.pausedTargets)
            self.pausedTargets = nil
            self.bPause = false
            return
        end          
    end 

    local function BeginShiFaFunc(mask1)
         G_Log_Error("施法特效  BeginShiFaFunc, mask = %d", mask1 or 0)

        local function BeginFeiXingFunc(mask2)
            G_Log_Info("飞行特效  BeginFeiXingFunc, mask = %d", mask2 or 0)

            local function BeginDaJiFunc(mask3)
                G_Log_Error("打击特效  BeginDaJiFunc, mask = %d", mask3 or 0)

                local function ActionSequenceCallback()
                    self.dajiAni:setVisible(false)
                    self.bPlayerAll = false
                    self:playAllAni(1)
                end

                if self.dajiAni and self.dajiData then
                    self.dajiAni:setVisible(true)
                    if self.bPause == true then
                        --self.dajiAni:resume()           
                    end 
                    self.dajiAni:PlayActionRepeat(self.dajiData.idx, self.dajiData.ms/1000) 
                    --self.dajiAni:registerScriptEndCBHandler(ActionSequenceCallback)
                    self.dajiAni:runAction(cc.Sequence:create(cc.DelayTime:create(1.0), cc.CallFunc:create(ActionSequenceCallback)))
                else
                    self.bPlayerAll = false
                    self:playAllAni(2)
                end
            end

            local function ActionSequenceCallback2()
                self.feixingAni:setVisible(false)
                self.feixingAni:setPosition(self.playPos)  --cc.p(self.playPos.x, self.playPos.y + 50))
                BeginDaJiFunc(1)
            end

            if self.feixingAni and self.feixingData then
                self.feixingAni:setVisible(true)
                if self.bPause == true then
                    --self.feixingAni:resume()            
                end 
                self.feixingAni:PlayActionRepeat(self.feixingData.idx, self.feixingData.ms/1000)

                local actionMove = cc.MoveTo:create(1.0, self.enemyPos)   
                local actionSequence = cc.Sequence:create(actionMove, cc.CallFunc:create(ActionSequenceCallback2))
                self.feixingAni:runAction(actionSequence)
            else
                BeginDaJiFunc(2)
            end
        end

        local function ActionSequenceCallback3()
            if self.gongjiAni then
                self.gongjiAni:setVisible(false)
            end
            self.shifaAni:setVisible(false)
            BeginFeiXingFunc(1)
        end

        if self.shifaAni and self.shifaData then    --施法特效
            self.shifaAni:setVisible(true)
            if self.bPause == true then
                --self.shifaAni:resume()          
            end    
            self.shifaAni:PlayActionRepeat(self.shifaData.idx, self.shifaData.ms/1000) 
            --self.shifaAni:registerScriptEndCBHandler(ActionSequenceCallback3)
            self.shifaAni:runAction(cc.Sequence:create(cc.DelayTime:create(1.0), cc.CallFunc:create(ActionSequenceCallback3)))
        else
            BeginFeiXingFunc(2)
        end
    end

    if self.gongjiAni and self.gongjiData then   --攻击动作
        G_Log_Info("攻击动作")
        self.gongjiAni:setVisible(true)
        if self.bPause == true then
            --self.gongjiAni:resume() 
        end

        local function ActionSequenceCallback4()
            BeginShiFaFunc(1)
        end
        self.gongjiAni:PlayActionRepeat(self.gongjiData.idx, self.gongjiData.ms/1000)
        --self.gongjiAni:registerScriptEndCBHandler(ActionSequenceCallback4)
        self.gongjiAni:runAction(cc.Sequence:create(cc.DelayTime:create(1.0), cc.CallFunc:create(ActionSequenceCallback4)))
    else
        BeginShiFaFunc(2)
    end

    self.bPause = false
end

function AniToolLayer:pauseAllAni()
    --G_Log_Info("AniToolLayer:pauseAllAni()")
    self.bPause = true
    --攻击动作    --Monster/btm101_gj
    if self.gongjiAni then
        self.gongjiAni:stop()   
    end
    --施法特效    --Skill/skill_1_s
    if self.shifaAni then
        self.shifaAni:stop()        
    end
    --飞行特效   --Skill/skill_1_f
    if self.feixingAni then
        self.feixingAni:stop()  
    end
    --打击特效    --Skill/skill_2_h
    if self.dajiAni then
        self.dajiAni:stop() 
    end

    if self.bPlayerAll == true then
        local director = cc.Director:getInstance()
        self.pausedTargets = director:getActionManager():pauseAllRunningActions()
    end
end

function AniToolLayer:removeAllAni()
    --G_Log_Info("AniToolLayer:removeAllAni()")
    for i=1, #self.tableViewCell do
        self.tableViewCell[i]:removeAni()
    end
    self.bPlayerAll = false
end

return AniToolLayer
