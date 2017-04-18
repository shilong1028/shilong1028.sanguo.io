
--NetMsgDealMgr用于客户端和服务器之间的通信管理，发送协议或接收协议（协议具体解析，建议在各个功能管理器中，而不要放在NetMsgMgr中

local NetMsgDealMgr = class("NetMsgDealMgr")

function NetMsgDealMgr:ctor()
	--G_Log_Info("NetMsgDealMgr:ctor()")
    self:init()
end

function NetMsgDealMgr:init()
	--G_Log_Info("NetMsgDealMgr:init()")
end

function NetMsgDealMgr:GetInstance()
	--G_Log_Info("NetMsgDealMgr:GetInstance()")
    if self.instance == nil then
        self.instance = NetMsgDealMgr:new()
    end
    return self.instance
end


--////////////////////////////////////////////
--直接发送数据
function NetMsgDealMgr:QueryMsgBuffer(buf, msgLen)
	MsgDealMgr:QueryMsgBuffer(buf, msgLen)    --C++ MsgDealMgr消息处理管理器
end

--发送协议并显示等待动画
function NetMsgDealMgr:QueryPackAndSend(stream, bShowAni)
	MsgDealMgr:QueryPackAndSend(stream)

	if not bShowAni or bShowAni == true then
		g_pGameLayer:EnableSocketAni(true)
	else
		g_pGameLayer:EnableSocketAni(false)
	end
end

--1 登录游戏服务器
function NetMsgDealMgr:QueryGameLogin(uid, sid, checkStr, serverId)
    local stream = ark_Stream:new()
	MsgDealMgr:QueryInitWithCMD(1024, stream , g_SocketCMD.NET_LOGIN)   
	stream:WriteUInt(uid)
	stream:WriteString(sid)
    stream:WriteString(checkStr)
	stream:WriteUInt(serverId)
	self:QueryPackAndSend(stream)

    return SystemHelper:GetHexString(tostring(stream:GetBuffer()), stream:GetSeekPos())
end

--1 登录游戏服务器
function NetMsgDealMgr:DealGameLogin(stream)  
    --清除重新登录定时器
    g_NetworkMgr:CloseReLoginUpdateListener()
    local succ = stream:ReadByte()
    --G_Log_Info("NetMsgDealMgr:DealGameLogin()， succ = %d", succ)
    if(succ == 1) then  --成功
          --保存用户信息
        local acData = g_NetworkMgr.m_LoginAccount.accountData 
		acData.type = stream:ReadByte()
		acData.userid = stream:ReadUInt()
		acData.roleid = stream:ReadUInt()
		if(acData.roleid == 0) then
			--正式版本时，如果没有角色信息，则return
		else
			acData.name = stream:ReadString()
			acData.head  = stream:ReadByte()
			acData.professional = stream:ReadByte()
			acData.level = stream:ReadByte()
			acData.sex = stream:ReadByte()
		end


		if g_NetworkMgr.m_loginServerData then   --已经登录游戏并选服进入，接着选角或开始游戏
			g_pGameLayer:StartGameLayer()
			g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_LoginLayer)
		else  --还没有登录成功

		end
    else  --失败
        local errMsg = stream:ReadString()
        g_pGameLayer:ShowScrollTips(errMsg, g_ColorDef.Red, g_defaultTipsFontSize)
    end
end

--4 选择角色后进入游戏
function NetMsgDealMgr:QueryStartGame(roleId)
	local stream = ark_Stream:new()
	MsgDealMgr:QueryInitWithCMD(1024, stream , g_SocketCMD.NET_CHOOSE_HERO)   
	stream:WriteUInt(roleId)
	self:QueryPackAndSend(stream)
end

--4 选择角色后进入游戏
function NetMsgDealMgr:DealStartGame(stream)        

end

--心跳包
function NetMsgDealMgr:QueryHeartJump()
	local stream = ark_Stream:new()
	MsgDealMgr:QueryInitWithCMD(32, stream, g_SocketCMD.NET_HEART_JUMP)  
	self:QueryPackAndSend(stream)
end


--501  帐号服务器-登录
function NetMsgDealMgr:QueryACLogin(name, password, version, adCode)
	--G_Log_Info("NetMsgDealMgr:QueryACLogin(), name = %s, psw = %s", name, password)
	local stream = ark_Stream:new()
	MsgDealMgr:QueryInitWithCMD(2048, stream, g_SocketCMD.NET_ACC_LOGIN)  
	stream:WriteString(name)
	stream:WriteString(password)
	stream:WriteString(version)
	stream:WriteWord(adCode)
	local bfirstLogin = g_UserDefaultMgr:GetIsFirstLogin()   --是否第一次登陆
    stream:WriteByte(bfirstLogin == false and 0 or 1)
	local mobile = ""
	local panelRatio = ""
	local mac = ""
	local idfa = ""
	-- if g_AppPlatform == cc.PLATFORM_OS_IPHONE or g_AppPlatform == cc.PLATFORM_OS_IPAD then   --加区分，加上IOS的获取，仅限越狱版
	-- 	mobile = SysUtilsWrapper:GetPhoneType()
	-- 	mac = SysUtilsWrapper:GetPhoneMac()
	-- else
	-- 	mobile = CallJava_GetAndroidVersion()
	-- 	panelRatio =  CallJava_GetAndroidPanelRatio()
	-- 	if ark_Download:IsTencentSDK() then
	-- 		mac = CallJava_getTencentMid()
	-- 	else
	-- 		mac = CallJava_GetAndroidMacAddress()
	-- 	end
	-- end
	stream:WriteString(mobile)
	stream:WriteString(panelRatio)
	stream:WriteString(mac)
	stream:WriteString(idfa)
	self:QueryPackAndSend(stream)
    --返回当前发送包二进制数据
    return SystemHelper:GetHexString(tostring(stream:GetBuffer()),stream:GetSeekPos())
end

--501  帐号服务器-登录
function NetMsgDealMgr:DealACLogin(stream)
	--G_Log_Info("NetMsgDealMgr:DealACLogin(stream)")
	local succ = stream:ReadByte()
	if(succ == 1) then  --登陆成功
		self:DealMsgAcLoginInfo(stream)
        --登陆成功发送idfa码
	else  --登陆失败
		local errMsg = stream:ReadString()
		g_pGameLayer:ShowScrollTips(errMsg, g_ColorDef.Red, g_defaultTipsFontSize)
	end
end

--502 账号注册
function NetMsgDealMgr:QueryACReg(name, password, ver, adCode, mobileInfo, panelRatio, mac, newUser)
	--G_Log_Info("NetMsgDealMgr:QueryACReg(), name = %s, psw = %s", name, password)
	local stream = ark_Stream:new()
	MsgDealMgr:QueryInitWithCMD(1024, stream, g_SocketCMD.NET_ACC_REG)  
	stream:WriteByte(2)
	stream:WriteString(name)
	stream:WriteString(password)
	stream:WriteString(ver)
	stream:WriteWord(adCode)
	stream:WriteString(mobileInfo)
	stream:WriteString(panelRatio)
	stream:WriteByte(newUser)
	stream:WriteString(mac)	
	self:QueryPackAndSend(stream)
end

--502 账号注册（检查用户名是否占用）
function NetMsgDealMgr:QueryACCheckNickName(name)
	local stream = ark_Stream:new()
	MsgDealMgr:QueryInitWithCMD(1024, stream, g_SocketCMD.NET_ACC_REG) 
	stream:WriteByte(1)
	stream:WriteString(name)
    self:QueryPackAndSend(stream)
end

--502 账号注册
function NetMsgDealMgr:DealAcLoginReg( stream)
	--G_Log_Info("NetMsgDealMgr:DealAcLoginReg(stream)")
	local op = stream:ReadByte()
    if(op == 1) then  --校验用户名
        local userName = stream:ReadString()
		local succ = stream:ReadByte()
		if succ == 0 then
			local errMsg = userName..lua_str_WarnTips4
			g_pGameLayer:ShowScrollTips(errMsg, g_ColorDef.Red, g_defaultTipsFontSize)   -- "用户名已经被注册！"
		else
		end
    elseif(op == 2) then  --注册
		local succ = stream:ReadByte()
		if(succ == 1) then  --成功
			self:DealMsgAcLoginInfo(stream,true)
        else     
			local errMsg = stream:ReadString()
			g_pGameLayer:ShowScrollTips(errMsg, g_ColorDef.Red, g_defaultTipsFontSize)
		end
	end
end

--帐号服务器-登录
function NetMsgDealMgr:DealMsgAcLoginInfo(stream, fromReg)   --fromReg是否从注册协议过来的，默认从登录协议501过来
	--G_Log_Info("NetMsgDealMgr:DealMsgAcLoginInfo(stream)")
	local uid = stream:ReadUInt()
	local sid = stream:ReadString()

	--玩家登陆用户信息
	g_NetworkMgr.m_LoginAccount.uid = uid
	g_NetworkMgr.m_LoginAccount.sid = sid

	local starttime = 0
	local canenterstate = 0
	local IsKoreaSdk = false  --ark_Download:IsKoreaSdk()
	if IsKoreaSdk == true then   
		starttime = stream:ReadUInt() --删除开始计算时间
		canenterstate = stream:ReadByte() --0 表示可以进入， 1表示已删除不可进入
	end

	g_NetworkMgr.m_LoginAccount.serverList = {}
	local num = stream:ReadUInt()
	for i = 1, num do
		local data = g_Login_ServerInfo:new()

		data.id = stream:ReadWord()
		data.page = stream:ReadWord()
		data.serName = stream:ReadString()
		data.serIp = stream:ReadString()
		data.serPort = stream:ReadUInt()
		data.serId = stream:ReadUInt()
		data.serType = stream:ReadByte()
		data.onlineState = stream:ReadByte()
		data.serState = stream:ReadByte()
		data.serPic = stream:ReadWord()
		data.errMsg = stream:ReadString()
		if(data.errMsg == "") then
    		data.errMsg = lua_str_WarnTips3 -- "当前选择的服务器维护中暂时无法进入!"
		end
		data.needLineUp = stream:ReadByte()==1
		data.lineUpIp = stream:ReadString()
		data.lineUpPort = stream:ReadUInt()
		table.insert(g_NetworkMgr.m_LoginAccount.serverList, data)
	end

	--保存用户登录信息
	g_NetworkMgr:SaveUserLoginData()

	local loginLayer = g_pGameLayer:GetLayerByUId(g_GameLayerTag.LAYER_TAG_LoginLayer)
	if loginLayer then
		--loginLayer:UpdateLoginServerList()
		loginLayer:BeginStartSerList()
	end
end

--600 排队服务器--排队
function NetMsgDealMgr:QueryLineUpServer(serId)
	local stream = ark_Stream:new()
	MsgDealMgr:QueryInitWithCMD(128, stream , g_SocketCMD.NET_ACC_LINEUP)   --600 排队服务器--排队
	stream:WriteUInt(serId)
	self:QueryPackAndSend(stream)

	return SystemHelper:GetHexString(tostring(stream:GetBuffer()), stream:GetSeekPos())
end

--600 排队服务器--排队
function NetMsgDealMgr:DealLineUpServer(stream)
	local serverId = stream:ReadUInt()
	local succ = stream:ReadByte()
	if(succ == 0) then   --还在排队
		local lineUpIdx = stream:ReadUInt()
		return lineUpIdx
	else  --成功 直接进入游戏服务器
		return -1
	end
end

return NetMsgDealMgr