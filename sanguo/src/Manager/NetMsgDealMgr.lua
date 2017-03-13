
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

--1 登录游戏服务器
function NetMsgDealMgr:QueryGameLogin(uid, sid, checkStr, serverId)
    local stream = ark_Stream:new()
	MsgDealMgr:QueryInitWithCMD(1024, stream , g_SocketCMD.NET_LOGIN)   
	stream:WriteUInt(uid)
	stream:WriteString(sid)
    stream:WriteString(checkStr)
	stream:WriteUInt(serverId)
	MsgDealMgr:QueryPackAndSend(stream)

    return SystemHelper:GetHexString(tostring(stream:GetBuffer()), stream:GetSeekPos())
end

--1 登录游戏服务器
function NetMsgDealMgr:DealGameLogin(stream)  
    --清除重新登录定时器
    g_NetMsgDealMgr:CloseReLoginUpdateListener()

    local succ = stream:ReadByte()
    if(succ == 1) then  --成功
          --保存用户信息
        local acData = g_NetworkMgr.m_LoginAccount.accountData 
		acData.type = stream:ReadByte()
		acData.userid = stream:ReadUInt()
		acData.roleid = stream:ReadUInt()
		if(acData.roleid == 0) then
			return
		end
		acData.name = stream:ReadString()
		acData.head  = stream:ReadByte()
		acData.professional = stream:ReadByte()
		acData.level = stream:ReadByte()
		acData.sex = stream:ReadByte()

		self:QueryStartGame(acData.roleid)   --4 选择角色进入游戏
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
	MsgDealMgr:QueryPackAndSend(stream)
end

--4 选择角色后进入游戏
function NetMsgDealMgr:DealStartGame(stream)        
    --打开心跳包
    self.gameDelayTime = 0.0;
    self.isChooseHero = true;
    
    if self.DelayTimeUpdateEntry then
        GFunc_unschedule(self.DelayTimeUpdateEntry)    
        self.DelayTimeUpdateEntry = nil
    end
    local function DelayTimeUpdate(dt)
        self:DelayTimeUpdate(dt)
    end
    self.DelayTimeUpdateEntry = GFunc_schedule(DelayTimeUpdate,10.0)    
    -- self:unschedule((SEL_SCHEDULE)&GameScene:DelayTimeUpdate);
    -- self:schedule(schedule_selector(GameScene:DelayTimeUpdate),10.0f);

    local succ = stream:ReadByte();
    if(succ == 1) then
        --清空内存储
        DATA_MGR.Account.userAccount.Account = "";
        DATA_MGR.Account.userAccount.Password = "";
        
        --建立gameLayer主界面
        MsgDealMgrL:DealMsgStartGame(stream);

        self:RemoveLoginConsole();
        
        if(not self:GetGameLayer()) then
        
            --建立Loading场景
            self:ShowLoadingLayer();

            self._GameLayer = GameLayer:create();
            --GAMELAYER = self._GameLayer
			_G["GAMELAYER"] = self._GameLayer
            self._GameLayer:setTag(TAG_GAME_LAYER);
            self:addChild(self._GameLayer);

            --1级的时候有一个过场动画
            if(self.m_enterGame) then
                self:GetLoadingLayer():setVisible(false);
                self._GameLayer:setVisible(false);
            end
        
        else
        
            --判断重连时是否在战斗界面，如果在需要重新创建
            local bLayer = self:GetGameLayer():GetBattleLayer()
            if bLayer then
                if(bLayer:IsSoonClose()) then
                    bLayer:removeFromParent();
                else
                    self._RecreateBattleLayer = true;
                end
            end
            self:GetGameLayer():GetGameMap():ClearAllMonster();
            self:GetGameLayer():GetGameMap():ClearAllNPC();
            self:GetGameLayer():GetGameMap():SetFightMode(false);

            self:GetGameLayer():ResetFirstLoad();
            self:GetGameLayer():DealFirstLoadRqest();

            local hero = DATA_MGR.Hero.MyHeroInfo;
            local mapHero = GAMELAYER:GetGameMap():GetHeroData();
            --如果是同一个地图则抛掉
            if mapHero and hero then
                local isSameMap = hero.sid == mapHero.sid;
                local isSamePos = SystemHelper:calcDistance(ccp(hero.posx,hero.posy),ccp(mapHero.posx,mapHero.posy))<50;

                if(isSameMap and isSamePos) then
                    return;
                end
                self:GetGameLayer():GetGameMap():GetHeroNode():RemoveAllFollow();
                self:GetGameLayer():GetGameMap():GetHeroNode():SetTeamId(0);
                self:GetGameLayer():GetGameMap():GetHeroNode():SetLeader(NULL);
				table_clear(DATA_MGR.Hero.MyTeam)
                --DATA_MGR.Hero.MyTeam:clear();
                self:GetGameLayer():ChangeScene(hero);
            end
            
        end

        local data = DATA_MGR.Hero.MyHeroInfo;
        local ad = ark_Download:GetClientADCode();
        
        local roleId = INT2STR(data.id);
        local roleName = data.name;
        local roleLevel = INT2STR(data.level);
        local zoneId = USER_CFG:GetLastSelServerId();
        local zoneName = USER_CFG:GetLastSelServerName();
        local FactionName = data.FactionId > 0 and data.FactionName or "";
        local leftMoney = data.DetailData.TongBao;
        local vipLevel = data.vipLevel;

        --@@@
        -- if(ad == AD_ARD_UC) then
            -- doUCExtraData(roleId, roleName, roleLevel, zoneId, zoneName);
        -- elseif(ad == AD_ARD_HUAWEI) then
            -- CallJava_huaweisaveRoleInfo(data.level,data.name,zoneName,FactionName);
        -- elseif(ad == AD_ARD_37) then
            -- CallJava_goSumit37RoleData(INT2STR(zoneId),zoneName,roleId,roleName,roleLevel,INT2STR(leftMoney),FactionName,INT2STR(vipLevel));
        -- elseif(IsTaiWanSDK() or ark_Download:IsKoreaSdk()) then
            -- CallJava_ShowTaiwanToolList(INT2STR(DATA_MGR.Account.m_AccountData.userid),INT2STR(zoneId),roleId);
        -- elseif (IsYshqgOfficial() and GAME_SCENE:isLoginShare and !DATA_MGR.Account.IsMultiServer()) then
            -- MsgDealMgr:QueryWxShareGift(SHARE_TYPE_SERLIST);
        -- end
-- #ifdef _IOS_SDK_TW
        -- vector<const char*> val;
        -- val.push_back(INT2STR(zoneId).c_str());
        -- TWCSdkfunctionWraper:setEventName(0,val);
-- #endif
-- #ifdef _IOS_SDK_KOREA
        -- vector<const char*> val;
        -- val.push_back(INT2STR(zoneId).c_str());
        -- KrCSdkfunctionWraper:setEventName(0, val);
-- #endif
    
    else
    --失败
        local errMsg = stream:ReadString();
        TipsMgr:GetInstance():SetCenterTip(errMsg);
    end
end

--心跳包
function NetMsgDealMgr:QueryHeartJump()
	local stream = ark_Stream:new()
	MsgDealMgr:QueryInitWithCMD(32, stream, g_SocketCMD.NET_HEART_JUMP)  
	MsgDealMgr:QueryPackAndSend(stream)
end


--501  帐号服务器-登录
function NetMsgDealMgr:QueryACLogin(name, password, version, adCode)
	G_Log_Info("NetMsgDealMgr:QueryACLogin(), name = %s, psw = %s", name, password)
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
	MsgDealMgr:QueryPackAndSend(stream)
    --返回当前发送包二进制数据
    return SystemHelper:GetHexString(tostring(stream:GetBuffer()),stream:GetSeekPos())
end

--501  帐号服务器-登录
function NetMsgDealMgr:DealACLogin(stream)
	G_Log_Info("NetMsgDealMgr:DealACLogin(stream)")
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
	G_Log_Info("NetMsgDealMgr:QueryACReg(), name = %s, psw = %s", name, password)
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
	MsgDealMgr:QueryPackAndSend(stream)
end

--502 账号注册（检查用户名是否占用）
function NetMsgDealMgr:QueryACCheckNickName(name)
	local stream = ark_Stream:new()
	MsgDealMgr:QueryInitWithCMD(1024, stream, g_SocketCMD.NET_ACC_REG) 
	stream:WriteByte(1)
	stream:WriteString(name)
    MsgDealMgr:QueryPackAndSend(stream)
end

--502 账号注册
function NetMsgDealMgr:DealAcLoginReg( stream)
	G_Log_Info("NetMsgDealMgr:DealAcLoginReg(stream)")
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
	G_Log_Info("NetMsgDealMgr:DealMsgAcLoginInfo(stream)")
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
		loginLayer:UpdateLoginServerList()
	end
end

--600 排队服务器--排队
function NetMsgDealMgr:QueryLineUpServer(serId)
	local stream = ark_Stream:new()
	MsgDealMgr:QueryInitWithCMD(128, stream , g_SocketCMD.NET_ACC_LINEUP)   --600 排队服务器--排队
	stream:WriteUInt(serId)
	MsgDealMgr:QueryPackAndSend(stream)

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