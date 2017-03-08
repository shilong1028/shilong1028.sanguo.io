

local LoginLayer = class("LoginLayer", CCLayerEx)

function LoginLayer:create()   --自定义的create()创建方法
    --G_Log_Info("LoginLayer:create()")
    local layer = LoginLayer.new()
    return layer
end

function LoginLayer:onExit()
    --G_Log_Info("LoginLayer:onExit()")

end

--初始化UI界面
function LoginLayer:init()  
    G_Log_Info("LoginLayer:init()")
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

    --登录密码
    self.passWordStr = ""  
    self.TextField_passWord  = self.loginNode:getChildByName("TextField_psw") 
    self.TextField_passWord:addEventListener(TextFieldEvent)

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

    --注册密码
    self.register_passWordStr = ""  
    self.TextField_register_passWord  = self.registerNode:getChildByName("TextField_psw") 
    self.TextField_register_passWord:addEventListener(TextFieldEvent)

    --注册密码2
    self.register_passWordStr2 = ""  
    self.TextField_register_passWord2  = self.registerNode:getChildByName("TextField_psw2") 
    self.TextField_register_passWord2:addEventListener(TextFieldEvent)

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

    local function listViewEvent(sender, eventType)
        if eventType == ccui.ListViewEventType.ONSELECTEDITEM_START then
            print("select child index = ",sender:getCurSelectedIndex())
        end
    end

    local function scrollViewEvent(sender, evenType)
        if evenType == ccui.ScrollviewEventType.scrollToBottom then
            print("SCROLL_TO_BOTTOM")
        elseif evenType ==  ccui.ScrollviewEventType.scrollToTop then
            print("SCROLL_TO_TOP")
        end
    end

    --服务器列表
    self.serverListView  = self.serverNode:getChildByName("serverListView") 
    -- local listView = ccui.ListView:create()
    -- listView:setDirection(ccui.ScrollViewDir.vertical)
    -- listView:setBounceEnabled(true)
    -- listView:setBackGroundImage("cocosui/green_edit.png")
    -- listView:setBackGroundImageScale9Enabled(true)
    -- listView:setContentSize(cc.size(240, 130))
    -- listView:setPosition(cc.p((x, y))
    self.serverListView:addEventListener(listViewEvent)
    self.serverListView:addScrollViewEventListener(scrollViewEvent)

    self.serverListView:removeAllChildren()

    --add custom item
    -- for i = 1,math.floor(count / 4) do
    --     local custom_button = ccui.Button:create("cocosui/button.png", "cocosui/buttonHighlighted.png")
    --     custom_button:setName("Title Button")
    --     custom_button:setScale9Enabled(true)
    --     custom_button:setContentSize(default_button:getContentSize())

    --     local custom_item = ccui.Layout:create()
    --     custom_item:setContentSize(custom_button:getContentSize())
    --     custom_button:setPosition(cc.p(custom_item:getContentSize().width / 2.0, custom_item:getContentSize().height / 2.0))
    --     custom_item:addChild(custom_button)

    --     listView:addChild(custom_item)
    -- end

    -- remove item by index
    -- items_count = table.getn(listView:getItems())
    -- listView:removeItem(items_count - 1)
    -- -- set all items layout gravity
    -- listView:setGravity(ccui.ListViewGravity.centerVertical)
    -- --set items margin
    -- listView:setItemsMargin(2.0)
end


function LoginLayer:touchEvent(sender, eventType)
    --G_Log_Info("LoginLayer:touchEvent")
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.serverBtn then     --选择服务器页面
            self.serverBtn:setVisible(true)
            self.startGameBtn:setVisible(true)
            self.loginNode:setVisible(false)
            self.registerNode:setVisible(false)
            self.serverNode:setVisible(false)
        elseif sender == self.startGameBtn then   --开始游戏

        elseif sender == self.loginBtn then   --登录

        elseif sender == self.registerBtn then   --注册界面
            self.serverBtn:setVisible(false)
            self.startGameBtn:setVisible(false)
            self.loginNode:setVisible(false)
            self.registerNode:setVisible(true)
            self.serverNode:setVisible(false)
        elseif sender == self.register_backBtn then   --注册返回
            self.serverBtn:setVisible(false)
            self.startGameBtn:setVisible(false)
            self.loginNode:setVisible(true)
            self.registerNode:setVisible(false)
            self.serverNode:setVisible(false)
        elseif sender == self.register_registerBtn then   --注册用户

        elseif sender == self.lastSerBtn then   --上一次登录服务器

        elseif sender == self.selectBtn then   --选好了服务器

        elseif sender == self.server_backBtn then   --服务器返回
            self.serverBtn:setVisible(true)
            self.startGameBtn:setVisible(true)
            self.loginNode:setVisible(false)
            self.registerNode:setVisible(false)
            self.serverNode:setVisible(false)
        end
    end
end

function LoginLayer:TextFieldEvent(sender, eventType)
    --G_Log_Info("LoginLayer:TextFieldEvent()")
    if eventType == ccui.TextFiledEventType.attach_with_ime then   --获得输入焦点
        --G_Log_Info("ATTACH_WITH_IME")
    elseif eventType == ccui.TextFiledEventType.detach_with_ime then   --失去输入焦点
        --G_Log_Info("DETACH_WITH_IME")
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

        elseif sender == self.TextField_userName then    --登录用户名
            self.userNameStr = self.TextField_userName:getString()
        elseif sender == self.TextField_passWord then   --登录密码
            self.passWordStr = self.TextField_passWord:getString()
        elseif sender == self.TextField_register_userName then  --注册用户名
            self.register_userNameStr = self.TextField_register_userName:getString()
        elseif sender == self.TextField_register_passWord then
            self.register_passWordStr = self.TextField_register_passWord:getString()
        end
    end
end



return LoginLayer
