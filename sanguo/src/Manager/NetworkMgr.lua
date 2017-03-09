
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
	self.m_networkDelayTime = 0.0  --网络系统系统延迟（心跳包，断线等判定）
    self.m_networkState = g_networkState.START
	self.m_networkError = g_networkError.FALSE
	--启动检测重连Timer
	self.m_ReLoginTimes = 0   --自动重新连接登录服务器次数，5次后断线用户重连
	self.m_ReLoginIp = ""
	self.m_ReLoginPort = 0

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
	self.instance = nil
end

function NetworkMgr:GetInstance()
	--G_Log_Info("NetworkMgr:GetInstance()")
    if self.instance == nil then
        self.instance = NetworkMgr:new()
    end
    return self.instance
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
	self:ReStartGameLogin()
end

function NetworkMgr:ReStartGameLogin()
	G_Log_Info("NetworkMgr:ReStartGameLogin()")
	local lineUp = g_UserDefaultMgr:IsNeedLineUp() or false

	local lineUpIp = g_UserDefaultMgr:GetLineUpServerIp()
	local lineUpPort = g_UserDefaultMgr:GetLineUpServerPort()
	local serIp = g_UserDefaultMgr:GetLastSelServerIp()
	local serPort = g_UserDefaultMgr:GetLastSelServerPort()

	local ip = lineUp and lineUpIp or serIp
	local port = lineUp and lineUpPort or serPort
	local serId = g_UserDefaultMgr:GetLastSelServerId()

	self:ReconnectServer(ip, port)
	self.m_networkState = g_networkState.CONNECTING

	--默認直接連接遊戲服
	if(false == lineUp)then
		--设置服务器状态为游戏服GAME_SCENE:setServerType(SERVER_GAME);
		-- local uid = DATA_MGR.Account.uid
		-- local sid = DATA_MGR.Account.sid
		-- local checkStr = ark_Download:GetClientVerion()
		--self.m_LoginMsgBuf = g_NetMsgDealMgr:QueryGameLogin(uid, sid, checkStr, serId)   --登录游戏服务器
	else
		--设置服务器状态为排队服GAME_SCENE:setServerType(SERVER_LINEUP);
		self.m_LoginMsgBuf = g_NetMsgDealMgr:QueryLineUpServer(serId)   --查询服务器
	end
	--"账号获取成功,正在连接服务器…"

	--启动检测重连Timer
	self.m_ReLoginTimes = 0   --自动重新连接登录服务器次数，5次后断线用户重连
	self.m_ReLoginIp = ip
	self.m_ReLoginPort = port

	local function ReLoginUpdate(dt)
		self:OnReLoginUpdate(dt)
    end
	if self.OnReLoginUpdateEntry then
		g_Scheduler:unscheduleScriptEntry(self.OnReLoginUpdateEntry)
	end
	self.OnReLoginUpdateEntry = g_Scheduler:scheduleScriptFunc(ReLoginUpdate, 60, false)
end

function NetworkMgr:StopCurConnect()
	G_Log_Info("NetworkMgr:StopCurConnect()")
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
    G_Log_Info("NetworkMgr:ReconnectServer()")
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
	    ScriptHandlerMgr:getInstance():registerScriptHandler(self.socketEvent:getNode(),socketCallback,cc.Handler.EVENT_CUSTOM_COMMON)

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
	local function ReLoginUpdate(dt)
		self:OnReLoginUpdate(dt)
    end
	if self.OnReLoginUpdateEntry then
		g_Scheduler:unscheduleScriptEntry(self.OnReLoginUpdateEntry)
	end
	self.OnReLoginUpdateEntry = g_Scheduler:scheduleScriptFunc(ReLoginUpdate, 30, false)
end



--///////////////////////  网络通信计时器 //////////////////////////////

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
    if (CMD == g_SocketCMD.MSG_HEART_JUMP) then  --102 心跳包
    	self.m_networkDelayTime = 0.0  --网络系统系统延迟（心跳包，断线等判定）
    elseif (CMD == g_SocketCMD.NET_LOGIN) then   --1 登录游戏服务器
    elseif (CMD == g_SocketCMD.NET_ACC_LINEUP) then	  --600 排队服务器
    end

end




return NetworkMgr