
--主菜单层
local MainMenuLayer = class("MainMenuLayer", CCLayerEx)  --填入类名
local StoryTalkCell = require("Layer.Story.StoryTalkCell")

function MainMenuLayer:create()    --自定义的create()创建方法
    --G_Log_Info("MainMenuLayer:create()")
    local layer = MainMenuLayer.new()
    return layer
end

function MainMenuLayer:onExit()
    --G_Log_Info("MainMenuLayer:onExit()")
    if nil ~= self.mainStory_listener then   --主线剧情任务监听
        g_EventDispatcher:removeEventListener(self.mainStory_listener)
    end

    if nil ~= self.vip_listener then   --vip监听
        g_EventDispatcher:removeEventListener(self.vip_listener)
    end

    if nil ~= self.troop_listener then   --军队数量变化监听
        g_EventDispatcher:removeEventListener(self.troop_listener)
    end

    if nil ~= self.money_listener then   --金币变化监听
        g_EventDispatcher:removeEventListener(self.money_listener)
    end

    if nil ~= self.food_listener then   --粮草变化监听
        g_EventDispatcher:removeEventListener(self.food_listener)
    end

    if nil ~= self.drug_listener then   --药材变化监听
        g_EventDispatcher:removeEventListener(self.drug_listener)
    end
end

--自定义异步事件监听
function MainMenuLayer:LoadEventListenerCustom()   
     --主线剧情任务监听
    local function mainStory_listenerCallBack(event)
        --[[发送处主线剧情任务监听事件
            local event = cc.EventCustom:new(g_EventListenerCustomName.MainMenu_mainStoryEvent)
            event._usedata = string.format("%d",nextStoryId)   --下一个剧情任务ID
            g_EventDispatcher:dispatchEvent(event)
        ]]
        --接收时解析
        local nextStoryId = tonumber(event._usedata)
        --G_Log_Info("mainStory_listenerCallBack(), nextStoryId = %d", nextStoryId)
        self:initStroyData(nextStoryId, true)
    end

    self.mainStory_listener = cc.EventListenerCustom:create(g_EventListenerCustomName.MainMenu_mainStoryEvent, mainStory_listenerCallBack)
    g_EventDispatcher:addEventListenerWithFixedPriority(self.mainStory_listener, 1)

    --vip变化监听
    local function vip_listenerCallBack(event)
        local vipId = tonumber(event._usedata)
        self:initVipData(vipId)
    end
    self.vip_listener = cc.EventListenerCustom:create(g_EventListenerCustomName.MainMenu_vipEvent, vip_listenerCallBack)
    g_EventDispatcher:addEventListenerWithFixedPriority(self.vip_listener, 1)

    --军队数量变化监听
    local function troop_listenerCallBack(event)
        local troop = tonumber(event._usedata)
    end
    self.troop_listener = cc.EventListenerCustom:create(g_EventListenerCustomName.MainMenu_troopEvent, troop_listenerCallBack)
    g_EventDispatcher:addEventListenerWithFixedPriority(self.troop_listener, 1)

    --金币变化监听
    local function money_listenerCallBack(event)
        local money = tonumber(event._usedata)
        if self.Text_glod then
            self.Text_glod:setString(money)  --元宝数量
        end
    end
    self.money_listener = cc.EventListenerCustom:create(g_EventListenerCustomName.MainMenu_moneyEvent, money_listenerCallBack)
    g_EventDispatcher:addEventListenerWithFixedPriority(self.money_listener, 1)

    --粮草变化监听
    local function food_listenerCallBack(event)
        local food = tonumber(event._usedata)
        if self.Text_liang then
            self.Text_liang:setString(food)  --粮草数量 担
        end
    end
    self.food_listener = cc.EventListenerCustom:create(g_EventListenerCustomName.MainMenu_foodEvent, food_listenerCallBack)
    g_EventDispatcher:addEventListenerWithFixedPriority(self.food_listener, 1)

    --药材变化监听
    local function drug_listenerCallBack(event)
        local drug = tonumber(event._usedata)
        if self.Text_yao then
            self.Text_yao:setString(drug)   --药材数量 单位副，1副=100份
        end
    end
    self.drug_listener = cc.EventListenerCustom:create(g_EventListenerCustomName.MainMenu_drugEvent, drug_listenerCallBack)
    g_EventDispatcher:addEventListenerWithFixedPriority(self.drug_listener, 1)
end

--初始化UI界面
function MainMenuLayer:init()  
    --G_Log_Info("MainMenuLayer:init()")
    self:setSwallowTouches(false)

    local csb = cc.CSLoader:createNode("csd/MainMenuLayer.csb")
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    self:addChild(csb)

    --左上角，玩家头像等节点
    local FileNode_head = csb:getChildByName("FileNode_head")
    self.head_icon = FileNode_head:getChildByName("head_icon")   --玩家头像
    self.Text_nick = FileNode_head:getChildByName("Text_nick")    --玩家昵称
    self.Text_Lv = FileNode_head:getChildByName("Text_Lv")    --玩家等级
    self.Text_Exp = FileNode_head:getChildByName("Text_Exp")    --经验数值
    self.LoadingBar = FileNode_head:getChildByName("LoadingBar")    --经验条
    self.Button_chongzhi = FileNode_head:getChildByName("Button_chongzhi")   --充值按钮
    self.Button_chongzhi:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_qiandao = FileNode_head:getChildByName("Button_qiandao")
    self.Button_qiandao:addTouchEventListener(handler(self,self.touchEvent))   --连续签到按钮
    self.Button_libao = FileNode_head:getChildByName("Button_libao")     --在线礼包
    self.Button_libao:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_huodong = FileNode_head:getChildByName("Button_huodong")   --精彩活动
    self.Button_huodong:addTouchEventListener(handler(self,self.touchEvent))
    self.Text_vip = FileNode_head:getChildByName("Text_vip")    --VIP等级
    self.BtnVipAdd = FileNode_head:getChildByName("BtnVipAdd")   --提高VIP等级按钮
    self.BtnVipAdd:addTouchEventListener(handler(self,self.touchEvent))

    --中间钱粮显示节点
    local FileNode_top = csb:getChildByName("FileNode_top")  
    self.Button_glod = FileNode_top:getChildByName("Button_glod")   --元宝添加
    self.Button_glod:addTouchEventListener(handler(self,self.touchEvent))
    self.Text_glod = FileNode_top:getChildByName("Text_glod")   --元宝数量

    self.Button_liang = FileNode_top:getChildByName("Button_liang")   --粮草添加
    self.Button_liang:addTouchEventListener(handler(self,self.touchEvent))
    self.Text_liang = FileNode_top:getChildByName("Text_liang")   --粮草数量 担

    self.Button_yao = FileNode_top:getChildByName("Button_yao")   --药材添加
    self.Button_yao:addTouchEventListener(handler(self,self.touchEvent))
    self.Text_yao = FileNode_top:getChildByName("Text_yao")    --药材数量 单位副，1副=100份

    --右上角 时间节点
    local FileNode_time = csb:getChildByName("FileNode_time")
    self.Text_time = FileNode_time:getChildByName("Text_time")   --纪年时间
    self.Button_renwu = FileNode_time:getChildByName("Button_renwu")   --任务按钮
    self.Button_renwu:addTouchEventListener(handler(self,self.touchEvent))
    self.Panel_renwu = FileNode_time:getChildByName("Panel_renwu")    --任务内容面板
    self.renWuButton_push = self.Panel_renwu:getChildByName("Button_push")  --任务列表收放按钮
    self.renWuButton_push:addTouchEventListener(handler(self,self.touchEvent))
    self.renWuButton_pushPosY = self.renWuButton_push:getPositionY()

    local function touchListViewEvent(sender, event)
        if event == ccui.TouchEventType.began then --0began
            --local pos = cc.p(sender:getTouchBeganPosition())
        elseif event == ccui.TouchEventType.moved then --1moved
        elseif event == ccui.TouchEventType.ended then --2ended
        else   --3cancelled
        end
    end

    self.bRenWuListHide = false
    self.bRenWuActioning = false
    self.renWuListView = self.Panel_renwu:getChildByName("ListView")   --任务列表
    -- self.renWuListView:setVisible(false)
    -- self.renWuListView = ccui.ListView:create()
    -- self.renWuListView:setDirection(ccui.ScrollViewDir.vertical)
    self.renWuListView:setBounceEnabled(true)
    self.renWuListView:setScrollBarEnabled(false)   --屏蔽列表滚动条
    self.renWuListView:setInertiaScrollEnabled(false)  --滑动的惯性
    self.renWuListView:setItemsMargin(2.0)
    -- self.renWuListView:setBackGroundImage("Image/Image_tipsBg.png")
    -- self.renWuListView:setBackGroundImageScale9Enabled(true)
    -- self.renWuListView:setPropagateTouchEvents(false) --是否取消取消传递对应控件的触摸事件
    -- self.renWuListView:setSwallowTouches(true) 
    -- self.renWuListView:setContentSize(renWuListView:getContentSize())
    -- self.renWuListView:setAnchorPoint(cc.p(renWuListView:getAnchorPoint()))
    -- self.renWuListView:setPosition(cc.p(renWuListView:getPosition()))
    -- self.Panel_renwu:addChild(self.renWuListView)
    self.renWuListWidth = self.renWuListView:getContentSize().width
    -- self.renWuListView:addTouchEventListener(touchListViewEvent)
    -- local items = self.renWuListView:getItems()
    -- local items_count = table.getn(items)
    
    --左下角，聊天节点
    local FileNode_chat = csb:getChildByName("FileNode_chat")
    self.Panel_chat = FileNode_chat:getChildByName("Panel_chat")    --聊天面板
    self.chatListView = self.Panel_chat:getChildByName("ListView")   --聊天列表
    self.chatListHeight = self.chatListView:getContentSize().height
    self.bChatListHide = false
    self.bChatListActioning = false
    self.Button_chat = self.Panel_chat:getChildByName("Button_chat")  --聊天按钮
    self.Button_chat:addTouchEventListener(handler(self,self.touchEvent))
    self.chatButton_push = self.Panel_chat:getChildByName("Button_push")   --聊天列表收放按钮
    self.chatButton_push:addTouchEventListener(handler(self,self.touchEvent))

    --右下角 切换节点
    local FileNode_bottom = csb:getChildByName("FileNode_bottom")
    self.Button_zhucheng = FileNode_bottom:getChildByName("Button_zhucheng")   --主城/地图切换按钮
    self.Button_zhucheng:addTouchEventListener(handler(self,self.touchEvent))
    self.Image_zhucheng = self.Button_zhucheng:getChildByName("Image_zhucheng")  --主城/地图图标
    self.Button_jingji = FileNode_bottom:getChildByName("Button_jingji")   --竞技场按钮
    self.Button_jingji:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_peiyang = FileNode_bottom:getChildByName("Button_peiyang")  --士兵培养按钮
    self.Button_peiyang:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_beibao = FileNode_bottom:getChildByName("Button_beibao")   --背包武库按钮
    self.Button_beibao:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_jiangling = FileNode_bottom:getChildByName("Button_jiangling")   --将领部队按钮
    self.Button_jiangling:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_lianmeng = FileNode_bottom:getChildByName("Button_lianmeng")   --联盟按钮
    self.Button_lianmeng:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_shejiao = FileNode_bottom:getChildByName("Button_shejiao")    --社交好友按钮
    self.Button_shejiao:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_shezhi = FileNode_bottom:getChildByName("Button_shezhi")    --设置按钮
    self.Button_shezhi:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_shangcheng = FileNode_bottom:getChildByName("Button_shangcheng")   --商城按钮
    self.Button_shangcheng:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_junqing = FileNode_bottom:getChildByName("Button_junqing")   --军情按钮
    self.Button_junqing:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_gonggao = FileNode_bottom:getChildByName("Button_gonggao")   --公告按钮
    self.Button_gonggao:addTouchEventListener(handler(self,self.touchEvent))

    self:initData()

    self:LoadEventListenerCustom()   --自定义异步事件监听
end

function MainMenuLayer:initData()
    g_campId = 0 
    local campData = g_HeroDataMgr:GetHeroCampData()
    if campData == nil then
        G_Log_Warning("campData = nil！")
        return
    end
    local campId = campData.campId     --g_UserDefaultMgr:GetRoleCampId()
    if campId and campId > 0 then
        g_campId = campId
        self.head_icon:loadTexture(string.format("Head/%d001.png", campId), ccui.TextureResType.localType)
    
        local captainId = g_HeroDataMgr:getHeroCaptainIdStr()
        local captainData = g_HeroDataMgr:GetSingleGeneralData(captainId)
        local expLimit = 999999
        local levelConfig = g_pTBLMgr:getLevelConfigById(captainData.level)
        if levelConfig then
            expLimit = levelConfig.add_exp
        end
        self:initLevelData(captainData.level, captainData.exp, expLimit)  --更新主角经验等级信息
    end
    self.Text_glod:setString(campData.money)  --元宝数量
    self.Text_liang:setString(campData.food)  --粮草数量 担
    self.Text_yao:setString(campData.drug)   --药材数量 单位副，1副=100份

    local userName = g_UserDefaultMgr:GetUserName()    --获取用户名
    self.Text_nick:setString(userName)    --玩家昵称

    local vipXml = g_HeroDataMgr:GetVipXmlData()
    local vipId = vipXml.vipId or 0
    self:initVipData(vipId)

    self.renWuListView:removeAllChildren()

    local storyId = g_HeroDataMgr:GetStoryTalkId()
    local bPlayerVedio = false
    if storyId and storyId > 0 then
    else
        storyId = 1
        bPlayerVedio = true
        g_HeroDataMgr:SaveNextStoryTalkId(storyId)   --保存新的任务ID到XML文件
    end

    self.mainStoryCell = nil   --主线剧情Cell
    self:initStroyData(storyId, bPlayerVedio)
end

--更新主角经验等级信息
function MainMenuLayer:initLevelData(lv, exp, limitExp)
    --G_Log_Info("initLevelData(), lv = %d, exp = %d, limitExp = %d", lv, exp, limitExp)
    self.Text_Lv:setString("Lv"..lv)    --玩家等级
    self.Text_Exp:setString(""..exp.."/"..limitExp)    --经验数值
    local progress = 100*exp/limitExp
    if progress > 100 then
        progress = 100
    end
    self.LoadingBar:setPercent(progress)   --经验条
end

function MainMenuLayer:initVipData(vipId)
    local vipData = g_pTBLMgr:getVipConfigById(vipId)
    self.Text_vip:setString("")
    if vipData then
        self.Text_vip:setString(vipId..vipData.name)
    end
end

function MainMenuLayer:initStroyData(storyId, bPlayerVedio)
    --G_Log_Info("MainMenuLayer:initStroyData(), storyId = %d", storyId)
    self.storyId = storyId
    self.storyData = g_pTBLMgr:getStoryConfigTBLDataById(storyId) 
    if self.storyData then
        self.storyData.storyPlayedState = g_HeroDataMgr:GetStoryPlayedState()  --任务故事进程状态
        if not self.mainStoryCell then
            local storyCell = StoryTalkCell:new()
            self.mainStoryCell = storyCell

            local cur_item = ccui.Layout:create()
            cur_item:setContentSize(storyCell:getContentSize())
            cur_item:addChild(storyCell)
            self.renWuListView:addChild(cur_item)
            
            local EffectImod = ImodAnim:create() 
            EffectImod:setPosition(cc.p(110, 40)) 
            EffectImod:initAnimWithName("Ani/effect/task_roundEffect.png","Ani/effect/task_roundEffect.ani") 
            EffectImod:PlayActionRepeat(0, 0.12) 
            EffectImod:setScaleX(0.95)
            self.mainStoryCell:addChild(EffectImod,2) 
        end
        self.mainStoryCell:setVisible(false)
        self.mainStoryCell:runAction(cc.Sequence:create(cc.DelayTime:create(0.2), cc.CallFunc:create(function () 
                self.mainStoryCell:setVisible(true) 
            end)))
        self.mainStoryCell:initStoryTalkCellData(self.storyData)
        self:renWuButton_pushAction(true)
    else  --没有剧情任务
        if self.mainStoryCell then
            self.mainStoryCell:getParent():removeFromParent(true)
        end
        self.mainStoryCell = nil
    end

    --剧情任务暂时调整大小
    self.Panel_renwu:setContentSize(cc.size(self.Panel_renwu:getContentSize().width, 100))
    self.renWuListView:setContentSize(cc.size(self.renWuListView:getContentSize().width, 80))
    self.renWuButton_push:setPositionY(self.renWuButton_pushPosY - 100)
end

--隐藏或显示剧情任务面板
function MainMenuLayer:renWuButton_pushAction(bNewStory)
    if self.bRenWuActioning == true then
        return
    end
    self.bRenWuActioning = true

    local angle = -90
    local offsetX = self.renWuListWidth
    if self.bRenWuListHide == true then  
        offsetX = -self.renWuListWidth 
        angle = 90
    elseif bNewStory == true then   --新剧情，且面板没有隐藏
        offsetX = 0
        angle = 90
    end
    if offsetX == 0 then
        self.bRenWuActioning = false
    else
        local moveBy = cc.MoveBy:create(0.5, cc.p(offsetX, 0))  
        local seqAction = cc.Sequence:create(moveBy, cc.CallFunc:create(function()  
                self.bRenWuActioning = false
                self.bRenWuListHide = not self.bRenWuListHide
                self.renWuButton_push:setRotation(angle)  --原图为箭头向下，按钮初始为箭头向右（旋转90度）
            end))
        self.Panel_renwu:runAction(seqAction)
    end
end

function MainMenuLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_chongzhi then   --充值
            g_pGameLayer:ShowScrollTips("充值")
            -- local textRich1 = CCAysLabel:create("白色[c1]红色富文本测试！[/c1]白色", cc.size(50, 0))
            -- textRich1:setPosition(g_WinSize.width/4, g_WinSize.height/2)
            -- self:addChild(textRich1, 100)

            -- local textRich2 = CCAysLabel:create("Green-simkai[c8]棕色富文本测试！[/c8]Green", cc.size(200, 0), g_ColorDef.Green, g_sDefaultTTFpath)
            -- textRich2:setPosition(g_WinSize.width/2, g_WinSize.height/2)
            -- self:addChild(textRich2, 100)

            -- self.textRich3 = CCAysLabel:create("Green-simkai[c2]加粗阴影蓝色24号富文本测试！[/c2]Green", cc.size(200, 0), g_ColorDef.Green, g_sDefaultTTFpath, 24, true, true)
            -- self.textRich3:setPosition(g_WinSize.width*3/4, g_WinSize.height/2)
            -- self:addChild(self.textRich3, 100)
        elseif sender == self.Button_qiandao then  --连续签到
            -- self.textRich3:reset("Green-simkai[c4]加粗阴影黄色24号富文本测试！[/c4]Green", cc.size(50, 0), g_ColorDef.Green, g_sDefaultTTFpath, 24, true, true)
            -- local richSize = self.textRich3:getSize()
        elseif sender == self.Button_libao then    --在线礼包
        elseif sender == self.Button_huodong then   --精彩活动
        elseif sender == self.BtnVipAdd then    --添加VIP等级
            g_pGameLayer:showVipLayer()
        elseif sender == self.Button_glod then   --元宝添加
        elseif sender == self.Button_liang then   --粮草添加
        elseif sender == self.Button_yao then     --药材添加
        elseif sender == self.Button_renwu then   --任务
        elseif sender == self.renWuButton_push then  --任务列表收放
            self:renWuButton_pushAction()
        elseif sender == self.Button_chat then   --聊天
        elseif sender == self.chatButton_push then  --聊天列表收放
            if self.bChatListActioning == true then
                return
            end
            self.bChatListActioning = true
            local angle = 180
            local offsetY = -self.chatListHeight
            if self.bChatListHide == true then  
                offsetY = self.chatListHeight 
                angle = 0
            end
            local moveBy = cc.MoveBy:create(0.5, cc.p(0, offsetY))  
            local seqAction = cc.Sequence:create(moveBy, cc.CallFunc:create(function()  
                    self.bChatListActioning = false
                    self.bChatListHide = not self.bChatListHide
                    self.chatButton_push:setRotation(angle)   --原图为箭头向下，按钮初始为箭头向下（旋转0度）
                end))
            self.Panel_chat:runAction(seqAction)
        elseif sender == self.Button_zhucheng then  --主城/地图切换
            -- local mainCityLayer = g_pGameLayer:GetLayerByUId(g_GameLayerTag.LAYER_TAG_MAINCITY)
            -- if mainCityLayer then
            --     if mainCityLayer:isVisible() == true then
            --         mainCityLayer:setVisible(false)
            --     else
            --         mainCityLayer:setVisible(true)
            --     end
            -- end
        elseif sender == self.Button_jingji then   --竞技场
        elseif sender == self.Button_peiyang then  --士兵培养
            g_pGameLayer:showAddSoldierLayer()   --招募士兵界面
        elseif sender == self.Button_beibao then   --背包武库
            g_pGameLayer:showBagLayer()
        elseif sender == self.Button_jiangling then  --将领部队
            g_pGameLayer:showGeneralLayer(1)  --1--武将信息，2--武将部曲，3--武将技能
        elseif sender == self.Button_lianmeng then   --联盟
            cc.Application:getInstance():openURL("https://www.ali213.net/zt/twtk/")  
        elseif sender == self.Button_shejiao then   --社交好友
        elseif sender == self.Button_shezhi then   --设置
            local function okCallBack()
                --重新开始游戏，并清空所有数据
                g_pGameScene:reloadGameAndClearData()
            end
            local dialog = g_pGameLayer:showDialogOkCancelLayer()
            dialog:bindingData(lua_Dialog_TitleStr1, lua_str_DialogTips3, okCallBack) 
        elseif sender == self.Button_shangcheng then  --商城
        elseif sender == self.Button_junqing then   --军情
            g_pGameLayer:showZhenXingLayer()  --布阵界面
        elseif sender == self.Button_gonggao then   --公告
            local dialog = g_pGameLayer:showDialogHelpLayer()
            dialog:bindingData(lua_Dialog_TitleStr2, lua_Help_OfficeStr1) 
        end
    end
end

return MainMenuLayer
