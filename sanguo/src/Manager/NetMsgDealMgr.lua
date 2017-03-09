
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

--登录游戏服务器
function NetMsgDealMgr:QueryGameLogin(uid, sid, checkStr, serverId)
    local stream = ark_Stream:new()
	MsgDealMgr:QueryInitWithCMD(1024, stream , g_SocketCMD.NET_LOGIN)
	stream:WriteUInt(uid)
	stream:WriteString(sid)
    stream:WriteString(checkStr)
	stream:WriteUInt(serverId)
	MsgDealMgr:QueryPackAndSend(stream)

    return SystemHelper:GetHexString(stream:GetBuffer(), stream:GetSeekPos())
end

--查询服务器
function NetMsgDealMgr:QueryLineUpServer(serId)
	local stream = ark_Stream:new()
	MsgDealMgr:QueryInitWithCMD(128, stream , g_SocketCMD.NET_ACC_LINEUP)
	stream:WriteUInt(serId)
	MsgDealMgr:QueryPackAndSend(stream)

	return SystemHelper:GetHexString(stream:GetBuffer(), stream:GetSeekPos())
end

return NetMsgDealMgr