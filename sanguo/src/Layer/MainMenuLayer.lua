
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
        g_GameDataMgr:SetImplementTaskData(nil)
        self:initStroyData(nextStoryId)
    end

    self.mainStory_listener = cc.EventListenerCustom:create(g_EventListenerCustomName.MainMenu_mainStoryEvent, mainStory_listenerCallBack)
    g_EventDispatcher:addEventListenerWithFixedPriority(self.mainStory_listener, 1)
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
    self.Text_bi = FileNode_top:getChildByName("Text_bi")    --钱贯数量 1元宝 = 1000 贯
    self.Button_liang = FileNode_top:getChildByName("Button_liang")   --粮草添加
    self.Button_liang:addTouchEventListener(handler(self,self.touchEvent))
    self.Text_liang = FileNode_top:getChildByName("Text_liang")   --粮草数量 担
    self.Text_mi = FileNode_top:getChildByName("Text_mi")   --粮草斤数 1担 = 1000 斤

    --右上角 时间节点
    local FileNode_time = csb:getChildByName("FileNode_time")
    self.Text_time = FileNode_time:getChildByName("Text_time")   --纪年时间
    self.Button_renwu = FileNode_time:getChildByName("Button_renwu")   --任务按钮
    self.Button_renwu:addTouchEventListener(handler(self,self.touchEvent))
    self.Panel_renwu = FileNode_time:getChildByName("Panel_renwu")    --任务内容面板
    self.renWuListView = self.Panel_renwu:getChildByName("ListView")   --任务列表
    self.renWuListWidth = self.renWuListView:getContentSize().width
    self.bRenWuListHide = false
    self.bRenWuActioning = false
    self.renWuButton_push = self.Panel_renwu:getChildByName("Button_push")  --任务列表收放按钮
    self.renWuButton_push:addTouchEventListener(handler(self,self.touchEvent))

    local function listViewEvent(sender, eventType)
        if eventType == ccui.ListViewEventType.ONSELECTEDITEM_START then
            --print("select child index = ",sender:getCurSelectedIndex())
        end
    end

    local function scrollViewEvent(sender, evenType)
        if evenType == ccui.ScrollviewEventType.scrollToBottom then
            --print("SCROLL_TO_BOTTOM")
        elseif evenType ==  ccui.ScrollviewEventType.scrollToTop then
            --print("SCROLL_TO_TOP")
        end
    end

    --local listView = ccui.ListView:create()
    -- set list view ex direction
    -- self.renWuListView:setDirection(ccui.ScrollViewDir.vertical)
    -- self.renWuListView:setBounceEnabled(true)
    -- self.renWuListView:setContentSize(cc.size(230, 200))
    -- self.renWuListView:setPosition(cc.p(250,200))
    self.renWuListView:setScrollBarEnabled(false)   --屏蔽列表滚动条
    self.renWuListView:setItemsMargin(2.0)
    --self.renWuListView:addEventListener(listViewEvent)
    --self.renWuListView:addScrollViewEventListener(scrollViewEvent)
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

    --剧情任务暂时调整大小
    self.Panel_renwu:setContentSize(cc.size(self.Panel_renwu:getContentSize().width, 100))
    self.renWuListView:setContentSize(cc.size(self.renWuListView:getContentSize().width, 80))
    self.renWuButton_push:setPosition(cc.p(self.renWuButton_push:getPositionX(), self.renWuButton_push:getPositionY() - 100))

    self:initData()

    self:LoadEventListenerCustom()   --自定义异步事件监听
end

function MainMenuLayer:initData()
    g_campId = 0 
    local campId = g_HeroDataMgr:GetHeroCampData().campId     --g_UserDefaultMgr:GetRoleCampId()
    if campId and campId > 0 then
        g_campId = campId
        self.head_icon:loadTexture(string.format("Head/%d001.png", campId), ccui.TextureResType.localType)
    end
    local userName = g_UserDefaultMgr:GetUserName()    --获取用户名
    self.Text_nick:setString(userName)    --玩家昵称

    self.renWuListView:removeAllChildren()

    local storyId = g_HeroDataMgr:GetStoryTalkId()
    if storyId and storyId > 0 then
    else
        storyId = 1
    end

    self.mainStoryCell = nil   --主线剧情Cell
    self:initStroyData(storyId)
end

function MainMenuLayer:initStroyData(storyId)
    --G_Log_Info("MainMenuLayer:initStroyData(), storyId = %d", storyId)
    self.storyId = storyId
    self.storyData = g_pTBLMgr:getStoryConfigTBLDataById(storyId) 
    if self.storyData then
        if not self.mainStoryCell then
            local storyCell = StoryTalkCell:new()
            local cur_item = ccui.Layout:create()
            cur_item:setContentSize(cc.size(220, 80))
            cur_item:addChild(storyCell)
            self.renWuListView:addChild(cur_item)
            self.mainStoryCell = storyCell

            local EffectImod = ImodAnim:create() 
            EffectImod:setPosition(cc.p(110, 40)) 
            EffectImod:initAnimWithName("Ani/task_roundEffect.png","Ani/task_roundEffect.ani") 
            EffectImod:PlayActionRepeat(0, 0.12) 
            EffectImod:setScaleX(0.95)
            self.mainStoryCell:addChild(EffectImod,2) 
        end
        self.mainStoryCell:setVisible(false)
        self.mainStoryCell:runAction(cc.Sequence:create(cc.DelayTime:create(0.2), cc.CallFunc:create(function () 
                    self.mainStoryCell:setVisible(true) 
                    end)))
        self.mainStoryCell:initData(self.storyData)
        self:renWuButton_pushAction(true)
    else  --没有剧情任务
        if self.mainStoryCell then
            self.mainStoryCell:getParent():removeFromParent(true)
        end
        self.mainStoryCell = nil
    end
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
        elseif sender == self.Button_qiandao then  --连续签到
        elseif sender == self.Button_libao then    --在线礼包
        elseif sender == self.Button_huodong then   --精彩活动
        elseif sender == self.BtnVipAdd then    --添加VIP等级
        elseif sender == self.Button_glod then   --元宝添加
        elseif sender == self.Button_liang then   --粮草添加
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
        elseif sender == self.Button_beibao then   --背包武库
        elseif sender == self.Button_jiangling then  --将领部队
        elseif sender == self.Button_lianmeng then   --联盟
        elseif sender == self.Button_shejiao then   --社交好友
        elseif sender == self.Button_shezhi then   --设置
        elseif sender == self.Button_shangcheng then  --商城
        elseif sender == self.Button_junqing then   --军情
        elseif sender == self.Button_gonggao then   --公告
        end
    end
end

return MainMenuLayer
