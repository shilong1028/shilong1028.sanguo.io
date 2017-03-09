
--游戏数据存储
--cc.exports.UserDefaultMgr = {}
local UserDefaultMgr = class("UserDefaultMgr")

-- function UserDefaultMgr:new(o)
--     o = o or {}
--     setmetatable(o,self)
--     self.__index = self
--     return o
-- end

function  UserDefaultMgr:ctor()
    self:init()
end

function UserDefaultMgr:init()
end

function UserDefaultMgr:GetInstance()
    if self.instance == nil then
        self.instance = UserDefaultMgr:new()
    end
    return self.instance
end

--/////////////////////////////////////////

local UserDefault = cc.UserDefault:getInstance()

--获取用户名
function UserDefaultMgr:GetUserName()
    return UserDefault:getStringForKey("UserName")
end

function UserDefaultMgr:SetUserName(nameStr, bFlush)
    if not nameStr then
        return
    end
    UserDefault:setStringForKey("UserName",nameStr)
    if bFlush then
        UserDefault:flush()
    end
end

--获取用户登录密码
function UserDefaultMgr:GetUserPassword()
    return UserDefault:getStringForKey("UserPassword")
end

function UserDefaultMgr:SetUserPassword(psdStr, bFlush)
    if not psdStr then
        return
    end
    UserDefault:setStringForKey("UserPassword",psdStr)   --getBoolForKey
    if bFlush then
        UserDefault:flush()
    end
end

--获取用户登录服务器名称及ID
function UserDefaultMgr:GetUserServer()
    local serName = UserDefault:getStringForKey("UserServerName")
    local serId = UserDefault:getIntegerForKey("UserServerId")
    return serName, serId 
end

function UserDefaultMgr:SetUserServer(serName, serId, bFlush)
    if not serName or not serId then
        return
    end
    UserDefault:setStringForKey("UserServerName",serName)
    UserDefault:setIntegerForKey("UserServerId",serId)
    if bFlush then
        UserDefault:flush()
    end
end

--是否需要排队连接服务器
function UserDefaultMgr:IsNeedLineUp()
    return UserDefault:getBoolForKey("IsNeedLineUp")
end

function UserDefaultMgr:SetIsNeedLineUp(needline, bflush)
    UserDefault:setBoolForKey("IsNeedLineUp", needline)
    if bFlush then
        UserDefault:flush()
    end
end

--ip地址
function UserDefaultMgr:GetLineUpServerIp()
    return UserDefault:getStringForKey("LastLineUpServerId")
end

function UserDefaultMgr:SetLineUpServerIp(ipStr, bflush)
    UserDefault:setStringForKey("LastLineUpServerId", ipStr)
    if bFlush then
        UserDefault:flush()
    end
end

function UserDefaultMgr:GetLastSelServerIp()
    return UserDefault:getStringForKey("LastServerIp");
end

function UserDefaultMgr:SetLastSelServerIp(ipStr, bflush)
    UserDefault:setStringForKey("LastServerIp", ipStr)
    if bFlush then
        UserDefault:flush()
    end
end

--端口
function UserDefaultMgr:GetLineUpServerPort()
    return UserDefault:getIntegerForKey("LastLineUpServerPort")
end

function UserDefaultMgr:SetLineUpServerPort(port, bflush)
    UserDefault:setIntegerForKey("LastLineUpServerPort", port)
    if bFlush then
        UserDefault:flush()
    end
end

function UserDefaultMgr:GetLastSelServerPort()
    return UserDefault:getIntegerForKey("LastServerPort");
end

function UserDefaultMgr:SetLastSelServerPort(port, bflush)
    UserDefault:setIntegerForKey("LastServerPort", port)
    if bFlush then
        UserDefault:flush()
    end
end

--服务器id
function UserDefaultMgr:GetLastSelServerId()
    return UserDefault:getIntegerForKey("LastServerId");
end

function UserDefaultMgr:SetLastSelServerId(id, bflush)
    UserDefault:setIntegerForKey("LastServerId", id)
    if bFlush then
        UserDefault:flush()
    end
end


return UserDefaultMgr
