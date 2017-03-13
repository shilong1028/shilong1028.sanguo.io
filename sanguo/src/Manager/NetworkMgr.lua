
--NetworkMgr用于服务器和客户端之间的socket通信连接，协议发送和请求在NetMsgDealMgr中处理

local NetworkMgr = class("NetworkMgr")

function NetworkMgr:ctor()
	--G_Log_Info("NetworkMgr:ctor()")
    self:init()
end

function NetworkMgr:init()
	--G_Log_Info("NetworkMgr:init()")
	self:initData()

	-- local function onNodeEvent(eventName)  
 --        if "enter" == eventName then 
 --        elseif "exit" == eventName then  
 --            self:onExit()
 --        elseif "enterTransitionFinish" == eventName then
 --        elseif "exitTransitionStart" == eventName then    
 --        elseif "cleanup" == eventName then
 --        	self:onExit()
 --        end  
 --    end  
  
 --    self:registerScriptHandler(onNodeEvent) 

    local function OnNetworkUpdate(dt)
        self:OnNetworkUpdate(dt)
    end
    
    local function OnSysTimeUpdate(dt)

    end
    
    if self.OnNetworkUpdateEntry then
		g_Scheduler:unscheduleScriptEntry(self.OnNetworkUpdateEntry)
	end
	if self.OnSysTimeUpdateEntry then
		g_Scheduler:unscheduleScriptEntry(self.OnSysTimeUpdateEntry)
	end
    self.OnNetworkUpdateEntry = g_Scheduler:scheduleScriptFunc(OnNetworkUpdate, 0, false)
    self.OnSysTimeUpdateEntry = g_Scheduler:scheduleScriptFunc(OnSysTimeUpdate, 1.0, false)
end

function NetworkMgr:initData()
	self.m_networkDelayTime = 0.0  --网络系统系统延迟频率（心跳包，断线等判定）
	self.lastTick = 0  --win平台的心跳包频率
	self.m_LoginMsgBuf = nil
    self.m_networkState = g_networkState.START
	self.m_networkError = g_networkError.FALSE
	--启动检测重连Timer
	self.m_ReLoginTimes = 0   --自动重新连接登录服务器次数，5次后断线用户重连
	self.m_ReLoginIp = ""
	self.m_ReLoginPort = 0

	self.m_loginServerData = nil  --已经或准备登录的服务器数据

	--玩家登陆用户信息
	self.m_LoginAccount = g_Login_Account:new()
end

function NetworkMgr:delInstance()
	--G_Log_Info("NetworkMgr:delInstance()")
	if self.OnNetworkUpdateEntry then
		g_Scheduler:unscheduleScriptEntry(self.OnNetworkUpdateEntry)
	end
	if self.OnSysTimeUpdateEntry then
		g_Scheduler:unscheduleScriptEntry(self.OnSysTimeUpdateEntry)
	end
	if self.OnReLoginUpdateEntry then
		g_Scheduler:unscheduleScriptEntry(self.OnReLoginUpdateEntry)
	end
	if self.NetworkHeartJumpEntry then
		g_Scheduler:unscheduleScriptEntry(self.NetworkHeartJumpEntry)
	end

	self.instance = nil
end

function NetworkMgr:GetInstance()
	--G_Log_Info("NetworkMgr:GetInstance()")
    if self.instance == nil then
        self.instance = NetworkMgr:new()
    end
    return self.instance
end

--保存用户登录信息
function NetworkMgr:SaveUserLoginData()
	if self.m_LoginAccount.userAccount.UserName ~= "" and self.m_LoginAccount.userAccount.Password ~= "" then
		g_UserDefaultMgr:SetUserName(self.m_LoginAccount.userAccount.UserName)    --保存用户名
		g_UserDefaultMgr:SetUserPassword(self.m_LoginAccount.userAccount.Password)  --保存用户登录密码
	end
end

function NetworkMgr:GetNetWorkSocket()
    if self.networkSocket == nil then
        self.networkSocket = ClientSocket:new()   --C++ ClientSocket客户端网络通信类 
    end
    return self.networkSocket
end

--//////////////////////////////////

local lapsedTime = 0
function NetworkMgr:CheckNetworkFail(dt)
    lapsedTime = lapsedTime + dt

    --网络失败检测, 2秒检测一次
    if(lapsedTime < 2.0) then
        return
    end
    lapsedTime = 0

	local clientSocket = self:GetNetWorkSocket()   --获得C++ ClientSocket客户端网络通信类 

	if (clientSocket:IsConnected() and self.m_networkDelayTime > 60) then  --网络系统系统延迟>60（心跳包，断线等判定）
		self:StopCurConnect()
		self.m_networkState = g_networkState.BREAK
		self.m_networkError = g_networkError.TRUE
	end

	if(self.m_networkState == g_networkState.BREAK or self.m_networkError == g_networkError.TRUE)then
		self.m_networkState = g_networkState.START
		self.m_networkError = g_networkError.FALSE
				
		self:ShowDisconnectDialog(lua_str_DialogTips1) --"与服务器断开连接，请检查您的网络环境，尝试重连？"
	end
end

function NetworkMgr:ShowDisconnectDialog(titleStr)
	self:StartGameLogin(self.m_loginServerData)
end

--选中某个服务器后点击登录触发，信号触发成功后会进入创建界面,老号直接登录游戏
function NetworkMgr:StartGameLogin(serverInfo)
	--G_Log_Info("NetworkMgr:ReStartGameLogin()")
	local lineUp = g_UserDefaultMgr:IsNeedLineUp() or false
	if serverInfo ~= nil then
		--选中某个服务器后点击登录触发，信号触发成功后会进入创建界面,老号直接登录游戏
		lineUp = serverInfo.needLineUp

		--保存上次登录的服务器信息
		g_UserDefaultMgr:SetLastSelServerName(serverInfo.serName)
		g_UserDefaultMgr:SetLastSelServerIp(serverInfo.serIp)
		g_UserDefaultMgr:SetLastSelServerPort(serverInfo.serPort)
		g_UserDefaultMgr:SetLastSelServerId(serverInfo.serId)
		g_UserDefaultMgr:SetIsNeedLineUp(serverInfo.needLineUp)
		g_UserDefaultMgr:SetLineUpServerIp(serverInfo.lineUpIp)
		g_UserDefaultMgr:SetLineUpServerPort(serverInfo.lineUpPort)
		g_UserDefaultMgr:Flush()
	end
	self.m_loginServerData = serverInfo  --已经或准备登录的服务器数据

	local lineUpIp = (serverInfo ~= nil) and serverInfo.lineUpIp or g_UserDefaultMgr:GetLineUpServerIp()
	local lineUpPort = (serverInfo ~= nil) and serverInfo.lineUpPort or g_UserDefaultMgr:GetLineUpServerPort()
	local serIp = (serverInfo ~= nil) and serverInfo.serIp or g_UserDefaultMgr:GetLastSelServerIp()
	local serPort = (serverInfo ~= nil) and serverInfo.serPort or g_UserDefaultMgr:GetLastSelServerPort()

	local ip = lineUp and lineUpIp or serIp
	local port = lineUp and lineUpPort or serPort
	local serId = (serverInfo ~= nil) and serverInfo.serId or g_UserDefaultMgr:GetLastSelServerId()

	self:ReconnectServer(ip, port)
	self.m_networkState = g_networkState.CONNECTING

	--默認直接連接遊戲服
	if(false == lineUp)then
		--设置服务器状态为游戏服GAME_SCENE:setServerType(SERVER_GAME);
		local uid = self.m_LoginAccount.uid
		local sid = self.m_LoginAccount.sid
		local version = "40001"
		self.m_LoginMsgBuf = g_NetMsgDealMgr:QueryGameLogin(uid, sid, version, serId)   --登录游戏服务器
	else
		--设置服务器状态为排队服GAME_SCENE:setServerType(SERVER_LINEUP);
		self.m_LoginMsgBuf = g_NetMsgDealMgr:QueryLineUpServer(serId)   --查询服务器
	end
	--"账号获取成功,正在连接服务器…"

	--启动检测重连Timer
	self:OpenReLoginUpdateListener(ip, port)
end

function NetworkMgr:StopCurConnect()
	--G_Log_Info("NetworkMgr:StopCurConnect()")
    if self.socketEvent then
        ScriptHandlerMgr:getInstance():unregisterScriptHandler(self.socketEvent:getNode(),cc.Handler.EVENT_CUSTOM_COMMON)
        self.socketEvent = nil
    end

    local clientSocket = self:GetNetWorkSocket()   --获得C++ ClientSocket客户端网络通信类 
    if clientSocket then
        clientSocket:clearEvent()
        if clientSocket:IsConnected() then
	        clientSocket:Stop()
	    end
    end
end

function NetworkMgr:ReconnectServer(ip, port)
    --G_Log_Info("NetworkMgr:ReconnectServer(), ip = %s, port = %s", ip, port)
    --清空发送缓存
    NetMsgMgr:getInstance():ClearAllMsg()   --C++   NetMsgMgr网络消息管理类
    self:StopCurConnect()
    
    local function socketCallback(psender,typ, msg)
        if typ == "OnConnect" then
            self:OnConnect(msg)
        elseif typ == "OnConnectFail" then
            self:OnConnectFail(msg)
        elseif typ == "OnSocketError" then
            self:OnSocketError(msg)
        end
    end

	if self.socketEvent then
		ScriptHandlerMgr:getInstance():unregisterScriptHandler(self.socketEvent:getNode(),cc.Handler.EVENT_CUSTOM_COMMON)
	end
	    
    local clientSocket = self:GetNetWorkSocket()   --获得C++ ClientSocket客户端网络通信类
    if clientSocket then
    	clientSocket:SetServerIP(ip, port)

    	self.socketEvent = ark_socketEvent:new() --代理
	    ScriptHandlerMgr:getInstance():registerScriptHandler(self.socketEvent:getNode(), socketCallback, cc.Handler.EVENT_CUSTOM_COMMON)

	    clientSocket:SetEvent(self.socketEvent)
	    clientSocket:Start()
    end
end

function NetworkMgr:OnConnect(msg)
    self.m_networkState = g_networkState.SUCCESS
end

function NetworkMgr:OnSocketError(msg)
    --self.ErrorMsg = msg
    self.m_networkState = g_networkState.BREAK
    self.m_networkError = g_networkError.TRUE
end

function NetworkMgr:OnConnectFail(msg)
    if self.socketEvent then
        --脚本回调里面不能注销回调接口，矛盾了
        --ScriptHandlerMgr:getInstance():unregisterScriptHandler(self.socketEvent:getNode(),cc.Handler.EVENT_CUSTOM_COMMON)
        --self.socketEvent = nil
    end
    
    -- local clientSocket = self:GetNetWorkSocket()   --获得C++ ClientSocket客户端网络通信类
    -- if clientSocket then
    --     --clientSocket:clearEvent();
    -- end

    --self.ErrorMsg = msg
	--启动检测重连Timer
    self:OpenReLoginUpdateListener()
end

function NetworkMgr:ConnectACLoginIfNeeded(forceReconnect)
	--G_Log_Info("NetworkMgr:ConnectACLoginIfNeeded()")
    if forceReconnect and type(forceReconnect) == "boolean" then
        self:ReconnectServer(g_SERVER_IP, g_SERVER_PORT)
    elseif(self:GetNetWorkSocket():IsConnected() == false) then
        self:ReconnectServer(g_SERVER_IP, g_SERVER_PORT)
	end
end

--发送登录协议，官方渠道是点击按钮发送，sdk是接收到渠道的uid token后发送
--sdk渠道的话因为sdk没有注册按钮，所以有可能会返回注册成功的协议（首次登录），然后进入服务器列表界面。
function NetworkMgr:StartACLogin(name, password, version,  adCode)
	--G_Log_Info("NetworkMgr:StartACLogin(), name = %s, psw = %s", name, password)
	version = "40001"
	adCode = 1   --官方

    self:ConnectACLoginIfNeeded()

	--登陆之前清除角色信息
	self.m_LoginAccount.userAccount.UserName = name
	self.m_LoginAccount.userAccount.Password = password
	self.m_LoginMsgBuf = g_NetMsgDealMgr:QueryACLogin(name,password,version,adCode)
 
    --启动检测重连Timer
    self:OpenReLoginUpdateListener(g_SERVER_IP, g_SERVER_PORT)
end

--注册用户
function NetworkMgr:StartACRegister(name, password, version, adCode, mobileInfo, panelRatio, mac)
	--G_Log_Info("NetworkMgr:StartACRegister(), name = %s, psw = %s", name, password)
	version = "40001"
	adCode = 1
	mobileInfo = ""
	panelRatio = ""
	mac = ""

    self:ConnectACLoginIfNeeded()

    self.m_LoginAccount.userAccount.UserName = name
	self.m_LoginAccount.userAccount.Password = password

    local lastUserName = g_UserDefaultMgr:GetUserName() or ""
    local isNewUser = lastUserName ~= "" and 0 or 1

	g_NetMsgDealMgr:QueryACReg(name, password, version, adCode, mobileInfo, panelRatio, mac, isNewUser)
end

function NetworkMgr:CloseReLoginUpdateListener()
	if self.OnReLoginUpdateEntry then
		g_Scheduler:unscheduleScriptEntry(self.OnReLoginUpdateEntry)
	end
end

function NetworkMgr:OpenReLoginUpdateListener(ip, port)
	--启动检测重连Timer
	if ip and port then
		self.m_ReLoginTimes = 0   --自动重新连接登录服务器次数，5次后断线用户重连
		self.m_ReLoginIp = ip
		self.m_ReLoginPort = port
	end

	local function ReLoginUpdate(dt)
		self:OnReLoginUpdate(dt)
    end
	if self.OnReLoginUpdateEntry then
		g_Scheduler:unscheduleScriptEntry(self.OnReLoginUpdateEntry)
	end
	self.OnReLoginUpdateEntry = g_Scheduler:scheduleScriptFunc(ReLoginUpdate, 30, false)
end

--网络心跳包计时器
function NetworkMgr:EnableNetworkHeartJumpListener(bOpen)
	if self.NetworkHeartJumpEntry then
		g_Scheduler:unscheduleScriptEntry(self.NetworkHeartJumpEntry)
	end
	if bOpen == true then
		local function NetworkHeartJumpUpdate(dt)
			self:NetworkHeartJumpUpdate(dt)
	    end
		self.NetworkHeartJumpEntry = g_Scheduler:scheduleScriptFunc(NetworkHeartJumpUpdate, 10, false)
	end
end

--///////////////////////  网络通信计时器 //////////////////////////////

function NetworkMgr:NetworkHeartJumpUpdate(dt)
	if g_AppPlatform == cc.PLATFORM_OS_WINDOWS then
		self.lastTick = self.lastTick or 0
		local nowTick = os.time()
		if(nowTick - self.lastTick > 10) then  --1000
			self.lastTick = nowTick
			g_NetMsgDealMgr:QueryHeartJump()
		end
	else
		self.m_networkDelayTime = self.m_networkDelayTime + dt
		g_NetMsgDealMgr:QueryHeartJump()
	end

end

function NetworkMgr:OnReLoginUpdate(dt)
    if(self.m_ReLoginTimes >= 5) then  --自动重新连接登录服务器次数，5次后断线用户重连
        if self.OnReLoginUpdateEntry then
            g_Scheduler:unscheduleScriptEntry(self.OnReLoginUpdateEntry)
        end
        self.m_ReLoginTimes = 0
        self:ShowDisconnectDialog(lua_str_DialogTips2)   --"无法登录服务器，请检查网络是否正常!"
        return
    end

    self.m_ReLoginTimes = self.m_ReLoginTimes + 1
    self:ReconnectServer(self.m_ReLoginIp, self.m_ReLoginPort)

    local function GetBufFromHexLen(str, maxLen)
	    if(str:len() % 2 ~= 0) then
	        return 0
	    end
	    local bufLen = str:len()/2  
	    if (maxLen < bufLen) then
	        return 0
	    end
	    return bufLen
	end
	local function GetBufFromHexString(str, maxLen)
	    local result = ""
	    if(str:len() % 2 ~= 0) then
	        return result
	    end
	    local bufLen = str:len()/2
	    if (maxLen < bufLen) then
	        return result
	    end
	    for i = 1, bufLen do
	        result = result..string.format("%02x",string.byte(str,(i-1)*2 + 1))
	    end
	    return result
	end

    --读取并发送缓存包--char buf[2048];
    local msgLen = GetBufFromHexLen(self.m_LoginMsgBuf, 2048)
    local buf = GetBufFromHexString(self.m_LoginMsgBuf, 2048)
    g_NetMsgDealMgr:QueryMsgBuffer(buf, msgLen)
end

function NetworkMgr:OnNetworkUpdate(dt)
	--G_Log_Debug("NetworkMgr:OnNetworkUpdate()")
    self:CheckNetworkFail(dt)

    local netMgr = NetMsgMgr:getInstance()   --C++   NetMsgMgr网络消息管理类
    --!!!注意：由于一次收5个包
    for i=1, 5 do
        --战斗中收到切图消息后不处理后续消息
        --正在加载资源时，不处理任何消息
        --!!!注意：由于一次收5个包，必须在循环内部判断，否则仍然有几个包未缓存

        if self.socketEvent then   --代理
            local result = self.socketEvent:getOnRecPack()
            if result > 0 then
                local stream = self.socketEvent:getStream()
                self:DispatchNetMsg(stream)
                self.socketEvent:releaseStream() --析构               
            end           
        end
    end
end

function NetworkMgr:DispatchNetMsg(stream)
	--G_Log_Info("NetworkMgr:DispatchNetMsg()")
    local seekPos = stream:GetSeekPos()
    local DLEN = stream:ReadWord()
    local CMD = stream:ReadWord()

    --local curTimeTick = SystemHelper:GetCurTick()
    --判断是否已进入游戏，收到服务器选择角色进入游戏命令之前，只处理特定任务

    --G_Log_Info("NetworkMgr:DispatchNetMsg(), 收到协议：= %d", CMD)
    if CMD ~= g_SocketCMD.NET_HEART_JUMP then
		g_pGameLayer:EnableSocketAni(false)
	end

    if CMD == g_SocketCMD.NET_LOGIN then   --1 登录游戏服务器
    	g_NetMsgDealMgr:DealGameLogin(stream)
    elseif CMD == g_SocketCMD.NET_CHOOSE_HERO then   --4 选择角色后进入游戏
    	self.m_networkDelayTime = 0.0  --打开心跳包
    	g_NetMsgDealMgr:DealStartGame(stream)
    elseif CMD == g_SocketCMD.NET_HEART_JUMP then  --102 心跳包 --网络系统系统延迟（心跳包，断线等判定）
    	self.m_networkDelayTime = 0.0  
    	--其实客户端不会接收到服务器发送的心跳包返回信息，因为此时客户端已经断线，服务器会保存相应用户信息并作下线处理
    elseif CMD == g_SocketCMD.NET_ACC_LOGIN then  --501 帐号服务器-登录
    	g_NetMsgDealMgr:DealACLogin(stream)
    elseif CMD == g_SocketCMD.NET_ACC_REG then  --502 账号注册
    	g_NetMsgDealMgr:DealAcLoginReg(stream)
    elseif CMD == g_SocketCMD.NET_ACC_LINEUP then	  --600 排队服务器--排队
    	g_NetMsgDealMgr:DealLineUpServer(stream)
    end

end




return NetworkMgr