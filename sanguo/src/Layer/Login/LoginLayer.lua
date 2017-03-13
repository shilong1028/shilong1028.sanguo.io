

local LoginLayer = class("LoginLayer", CCLayerEx)

function LoginLayer:create()   --自定义的create()创建方法
    --G_Log_Info("LoginLayer:create()")
    local layer = LoginLayer.new()
    return layer
end

function LoginLayer:onExit()
    --G_Log_Info("LoginLayer:onExit()")
    if nil ~= self.serList_listener then   --服务器列表监听
        g_EventDispatcher:removeEventListener(self.serList_listener)
    end
end

--初始化UI界面
function LoginLayer:init()  
    --G_Log_Info("LoginLayer:init()")
    local csb = cc.CSLoader:createNode("csd/LoginLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    --self:showInTheMiddle(csb)

    local function BtnCallback(sender, eventType)
        self:touchEvent(sender, eventType)
    end
    self.serverBtn = csb:getChildByName("serverBtn")    --选择服务器页面
    self.serverBtn:addTouchEventListener(BtnCallback) 
    self.serverBtn:setVisible(false)

    self.startGameBtn = csb:getChildByName("startGameBtn")    --开始游戏
    self.startGameBtn:addTouchEventListener(BtnCallback)
    self.startGameBtn:setVisible(false)

    self.backLoginBtn = csb:getChildByName("backLoginBtn")    --重新登陆
    self.backLoginBtn:addTouchEventListener(BtnCallback)
    self.backLoginBtn:setVisible(false)

    local function TextFieldEvent(sender, eventType)
        self:TextFieldEvent(sender, eventType)
    end

    --登录界面
    self.loginNode = csb:getChildByName("nameBg")   
    --self.loginNode:setVisible(false)

    --登录用户名
    self.userNameStr = ""  
    self.TextField_userName  = self.loginNode:getChildByName("TextField") 
    self.TextField_userName:addEventListener(TextFieldEvent)
    self.TextField_userName:setCursorEnabled(true)

    --登录密码
    self.passWordStr = ""  
    self.TextField_passWord  = self.loginNode:getChildByName("TextField_psw") 
    self.TextField_passWord:addEventListener(TextFieldEvent)
    self.TextField_passWord:setCursorEnabled(true)

    self.loginBtn = self.loginNode:getChildByName("loginBtn")     --登录
    self.loginBtn:addTouchEventListener(BtnCallback)

    self.registerBtn = self.loginNode:getChildByName("registerBtn")    --注册界面
    self.registerBtn:addTouchEventListener(BtnCallback)

    --注册界面
    self.registerNode = csb:getChildByName("registerBg")   
    self.registerNode:setVisible(false)

    --注册用户名
    self.register_userNameStr = ""  
    self.TextField_register_userName  = self.registerNode:getChildByName("TextField") 
    self.TextField_register_userName:addEventListener(TextFieldEvent)
    self.TextField_register_userName:setCursorEnabled(true)

    --注册密码
    self.register_passWordStr = ""  
    self.TextField_register_passWord  = self.registerNode:getChildByName("TextField_psw") 
    self.TextField_register_passWord:addEventListener(TextFieldEvent)
    self.TextField_register_passWord:setCursorEnabled(true)

    --注册密码2
    self.register_passWordStr2 = ""  
    self.TextField_register_passWord2  = self.registerNode:getChildByName("TextField_psw2") 
    self.TextField_register_passWord2:addEventListener(TextFieldEvent)
    self.TextField_register_passWord2:setCursorEnabled(true)

    self.register_backBtn = self.registerNode:getChildByName("backBtn")     --注册返回
    self.register_backBtn:addTouchEventListener(BtnCallback)

    self.register_registerBtn = self.registerNode:getChildByName("registerBtn")    --注册用户
    self.register_registerBtn:addTouchEventListener(BtnCallback)

    --服务器界面
    self.serverNode = csb:getChildByName("serverListBg")   
    self.serverNode:setVisible(false)

    self.lastSerBtn = self.serverNode:getChildByName("lastSerBtn")     --上一次登录服务器
    self.lastSerBtn:addTouchEventListener(BtnCallback)

    self.selectBtn = self.serverNode:getChildByName("selectBtn")     --选好了服务器
    self.selectBtn:addTouchEventListener(BtnCallback)

    self.server_backBtn = self.serverNode:getChildByName("backBtn")    --服务器返回
    self.server_backBtn:addTouchEventListener(BtnCallback)

    self.m_selServerName = ""
    self.m_selServerId = 0  --在服务器选择界面选中的服务器名称和ID
    self.m_lastSelServerBtn = nil --上次选中的服务器列表元素
    self.serListData = nil  --服务器列表数据
    self.m_selServerData = nil  --选中的服务器数据

    -- local function listViewEvent(sender, eventType)
    --     if eventType == ccui.ListViewEventType.ONSELECTEDITEM_START then
    --         --print("select child index = ",sender:getCurSelectedIndex())
    --     end
    -- end

    -- local function scrollViewEvent(sender, evenType)
    --     if evenType == ccui.ScrollviewEventType.scrollToBottom then
    --     elseif evenType ==  ccui.ScrollviewEventType.scrollToTop then
    --     end
    -- end

    --服务器列表
    self.serverListView  = self.serverNode:getChildByName("serverListView") 
    --self.serverListView:setScrollBarEnabled(false)
    -- local listView = ccui.ListView:create()
    -- listView:setDirection(ccui.ScrollViewDir.vertical)
    -- listView:setBounceEnabled(true)
    -- listView:setBackGroundImage("cocosui/green_edit.png")
    -- listView:setBackGroundImageScale9Enabled(true)
    -- listView:setContentSize(cc.size(240, 130))
    -- listView:setPosition(cc.p((x, y))
    -- self.serverListView:addEventListener(listViewEvent)
    -- self.serverListView:addScrollViewEventListener(scrollViewEvent)
    -- remove item by index
    -- items_count = table.getn(listView:getItems())
    -- listView:removeItem(items_count - 1)
    -- -- set all items layout gravity
    -- listView:setGravity(ccui.ListViewGravity.centerVertical)
    -- --set items margin
    -- listView:setItemsMargin(2.0)
    self.serverListView:removeAllChildren()

    self:LoadUserDataAndShowUI()

    self:LoadEventListenerCustom()   --自定义异步事件监听
end

--自定义异步事件监听
function LoginLayer:LoadEventListenerCustom()   
    --服务器列表监听
    local function serList_listenerCallBack(event)
        --[[发送处有此定义
            local event = cc.EventCustom:new(g_EventListenerCustomName.Login_serverListEvent)
            event._usedata = string.format("%d",count2)
            g_EventDispatcher:dispatchEvent(event)
        ]]
        --接收时解析
        --local str = "Custom event 2 received, "..event._usedata.." times"
    end

    self.serList_listener = cc.EventListenerCustom:create(g_EventListenerCustomName.Login_serverListEvent, serList_listenerCallBack)
    g_EventDispatcher:addEventListenerWithFixedPriority(self.serList_listener, 1)
end

function LoginLayer:LoadUserDataAndShowUI()
    self.m_userName = g_UserDefaultMgr:GetUserName()    --获取用户名
    self.m_passWord = g_UserDefaultMgr:GetUserPassword()  --获取用户登录密码
    self.m_serverName, self.m_serverId = g_UserDefaultMgr:GetUserServer()  --获取用户登录服务器名称及ID

    if self.m_userName and self.m_userName ~= "" then
        if string.len(self.m_userName) > 10 then
            self.m_userName = string.sub(self.m_userName, 1, 10)
        end
        self.TextField_userName:setString(self.m_userName)
        self.userNameStr = self.m_userName
    end

    if self.m_passWord and self.m_passWord ~= "" then
        if string.len(self.m_passWord) > 10 then
            self.m_passWord = string.sub(self.m_passWord, 1, 10)
        end
        self.TextField_passWord:setString(self.m_passWord)
        self.passWordStr = self.m_passWord
    end
end

function LoginLayer:TextFieldEvent(sender, eventType)
    --G_Log_Info("LoginLayer:TextFieldEvent()")
    if eventType == ccui.TextFiledEventType.attach_with_ime then   --获得输入焦点
    elseif eventType == ccui.TextFiledEventType.detach_with_ime then   --失去输入焦点
    elseif eventType == ccui.TextFiledEventType.insert_text    --输入了文本
        or eventType == ccui.TextFiledEventType.delete_backward   --删除了文字
    then  
        --G_Log_Info("INSERT_TEXT or DELETE_BACKWARD")
        if sender == self.TextField_userName then  --登录用户名
            self.userNameStr = self.TextField_userName:getString()
        elseif sender == self.TextField_passWord then   --登录密码
            self.passWordStr = self.TextField_passWord:getString()
        elseif sender == self.TextField_register_userName then  --注册用户名
            self.register_userNameStr = self.TextField_register_userName:getString()
        elseif sender == self.TextField_register_passWord then  --注册密码
            self.register_passWordStr = self.TextField_register_passWord:getString()
        elseif sender == self.TextField_register_passWord2 then  --注册密码2
            self.register_passWordStr2 = self.TextField_register_passWord2:getString()
        end
    end
end

--登录页面
function LoginLayer:BeginLogin()
    --G_Log_Info("LoginLayer:BeginLogin()")
    self.serverBtn:setVisible(false)
    self.startGameBtn:setVisible(false)
    self.backLoginBtn:setVisible(false)
    self.loginNode:setVisible(true)
    self.registerNode:setVisible(false)
    self.serverNode:setVisible(false)

    if self.m_userName and self.m_userName ~= "" then
        self.TextField_userName:setString(self.m_userName)
    end

    if self.m_passWord and self.m_passWord ~= "" then
        self.TextField_passWord:setString(self.m_passWord)
    end
end

--开始进入游戏页面
function LoginLayer:BeginStartGame()
    --G_Log_Info("LoginLayer:BeginStartGame()")
    self.m_lastSelServerBtn = nil --上次选中的服务器列表元素

    if not self.m_userName or string.len(self.userNameStr) < 6 or string.len(self.userNameStr) > 10 or 
        not self.m_passWord or string.len(self.passWordStr) < 6 or string.len(self.passWordStr) > 10 then
        self:BeginLogin()   --用户名或密码非法，进入登录界面，否则进入开始游戏界面
    end

    self.serverBtn:setVisible(true)
    self.startGameBtn:setVisible(true)
    self.backLoginBtn:setVisible(true)
    self.loginNode:setVisible(false)
    self.registerNode:setVisible(false)
    self.serverNode:setVisible(false)

    if self.m_serverName and self.m_serverName ~= "" and self.m_serverId and self.m_serverId > 0 then
        self.serverBtn:setTitleText(self.m_serverName)
    else
        self.serverBtn:setTitleText("")
    end
end

--开始服务器列表界面
function LoginLayer:BeginStartSerList(bForceOpen)
    --G_Log_Info("LoginLayer:BeginStartSerList()")
    self.serListData = g_NetworkMgr.m_LoginAccount.serverList
    --G_Log_Dump(self.serListData, "self.serListData = ")

    if (not bForceOpen or bForceOpen == false) and self.serListData then
        if self.m_serverId and self.m_serverId > 0 then
            for i = 1, #self.serListData do
                if self.serListData[i].serId == self.m_serverId then
                    self.m_selServerData = self.serListData[i]  --选中的服务器数据
                    self:BeginStartGame()
                    return;
                end
            end
        end
    end

    self.serverBtn:setVisible(false)
    self.startGameBtn:setVisible(false)
    self.backLoginBtn:setVisible(false)
    self.loginNode:setVisible(false)
    self.registerNode:setVisible(false)
    self.serverNode:setVisible(true)

    if self.m_serverName and self.m_serverName ~= "" and self.m_serverId and self.m_serverId > 0 then
        self.lastSerBtn:setTitleText(self.m_serverName)
        self.lastSerBtn:setVisible(true)
    else
        self.lastSerBtn:setTitleText("")
        self.lastSerBtn:setVisible(false)
    end

    self:UpdateLoginServerList()
end

--登录或注册成功时会返回服务器列表信息
function LoginLayer:UpdateLoginServerList()
    --G_Log_Info("LoginLayer:UpdateLoginServerList()")
    self.serverListView:removeAllChildren()
    if #self.serListData < 1 then
        return
    end

    local function listBtnCallBack(sender,eventType)
        if eventType == ccui.TouchEventType.began then
        elseif eventType == ccui.TouchEventType.moved then
        elseif eventType == ccui.TouchEventType.ended then
            local idx = sender:getTag() - 500
            local serData = self.serListData[idx]
            self.m_selServerData = serData  --选中的服务器数据

            self.m_selServerName = serData.serName
            self.m_selServerId = serData.serId

            sender:setBright(false)
            if self.m_lastSelServerBtn and sender ~= self.m_lastSelServerBtn then --上次选中的服务器列表元素
                self.m_lastSelServerBtn:setBright(true)
            end
            self.m_lastSelServerBtn = sender
        elseif eventType == ccui.TouchEventType.canceled then
        end
    end

    --add custom item
    for i = 1, #self.serListData do
        local custom_button = ccui.Button:create("public_bar2.png", "public_bar4.png", "public_bar4.png", ccui.TextureResType.plistType)
        custom_button:setTag(500 + i)  --self.serListData[i].serId)
        custom_button:setTouchEnabled(true)
        custom_button:addTouchEventListener(listBtnCallBack)
        custom_button:setTitleText(self.serListData[i].serName)
        custom_button:setTitleColor(cc.c3b(255, 165, 0))
        custom_button:setTitleFontSize(30)
        custom_button:setTitleFontName(g_sDefaultTTFpath)
        custom_button:setScale9Enabled(true)
        custom_button:setContentSize(cc.size(300, 50))

        local custom_item = ccui.Layout:create()
        custom_item:setContentSize(cc.size(300, 50))
        custom_button:setPosition(cc.p(custom_item:getContentSize().width / 2.0, custom_item:getContentSize().height / 2.0))
        custom_item:addChild(custom_button)

        self.serverListView:addChild(custom_item)
    end
end

function LoginLayer:touchEvent(sender, eventType)
    --G_Log_Info("LoginLayer:touchEvent()")
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.serverBtn then     --选择服务器页面
            self:BeginStartSerList(true)
        elseif sender == self.startGameBtn then   --开始游戏
            g_UserDefaultMgr:SetUserName(self.m_userName)    --保存用户名
            g_UserDefaultMgr:SetUserPassword(self.m_passWord)  --保存用户登录密码
            g_UserDefaultMgr:SetUserServer(self.m_serverName, self.m_serverId)  --保存用户登录服务器名称及ID

            --选中某个服务器后点击登录触发，信号触发成功后会进入创建界面,老号直接登录游戏
            --g_NetworkMgr:StartGameLogin(self.m_selServerData)  --选中的服务器数据

            --demo直接进入游戏,不请求网络
            g_pGameLayer:StartGameLayer()
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_LoginLayer)
        elseif sender == self.backLoginBtn then   --重新登陆
            self:BeginLogin()
        elseif sender == self.loginBtn then   --登录
            if string.len(self.userNameStr) < 6 or string.len(self.userNameStr) > 10 then
                g_pGameLayer:ShowScrollTips(lua_str_WarnTips1, g_ColorDef.Red, g_defaultTipsFontSize)
                return
            end
            if string.len(self.passWordStr) < 6 or string.len(self.passWordStr) > 10 then
                g_pGameLayer:ShowScrollTips(lua_str_WarnTips2, g_ColorDef.Red, g_defaultTipsFontSize)
                return
            end

            self.m_userName = self.userNameStr  --新的用户名
            self.m_passWord = self.passWordStr  --新的用户登录密码
            --self:BeginStartGame()
            g_NetworkMgr:StartACLogin(self.m_userName, self.m_passWord)
        elseif sender == self.registerBtn then   --注册界面
            self.serverBtn:setVisible(false)
            self.startGameBtn:setVisible(false)
            self.backLoginBtn:setVisible(false)
            self.loginNode:setVisible(false)
            self.registerNode:setVisible(true)
            self.serverNode:setVisible(false)
        elseif sender == self.register_backBtn then   --注册返回     
            self:BeginLogin()
        elseif sender == self.register_registerBtn then   --注册用户
            if string.len(self.register_userNameStr) < 6 or string.len(self.register_userNameStr) > 10 then
                g_pGameLayer:ShowScrollTips(lua_str_WarnTips1, g_ColorDef.Red, g_defaultTipsFontSize)
                return
            end
            if string.len(self.register_passWordStr) < 6 or string.len(self.register_passWordStr) > 10 then
                g_pGameLayer:ShowScrollTips(lua_str_WarnTips2, g_ColorDef.Red, g_defaultTipsFontSize)
                return
            end
            if self.register_passWordSt2 and self.register_passWordSt2 ~= self.register_passWordSt then
                g_pGameLayer:ShowScrollTips(lua_str_WarnTips5, g_ColorDef.Red, g_defaultTipsFontSize)   --"注册密码不一致！"
                return
            end

            --保存注册的信息
            self.m_userName = self.register_userNameStr  --新的用户名
            self.m_passWord = self.register_passWordStr  --新的用户登录密码

            g_NetworkMgr:StartACRegister(self.m_userName, self.m_passWord)
        elseif sender == self.lastSerBtn then   --上一次登录服务器
            self:BeginStartGame()
        elseif sender == self.selectBtn then   --选好了服务器
            self.m_serverName = self.m_selServerName
            self.m_serverId = self.m_selServerId
            self:BeginStartGame()
        elseif sender == self.server_backBtn then   --服务器返回
            self:BeginStartGame()
        end
    end
end





return LoginLayer
