
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

local UserDefault = cc.UserDefault:getInstance()

--获取用户名
function UserDefaultMgr:GetUserName()
    return UserDefault:getStringForKey("UserName") or ""
end

function UserDefaultMgr:SetUserName(nameStr)
    UserDefault:setStringForKey("UserName",nameStr)
    UserDefault:flush()
end

--获取用户登录密码
function UserDefaultMgr:GetUserPassword()
    return UserDefault:getStringForKey("UserPassword") or ""
end

function UserDefaultMgr:SetUserPassword(psdStr)
    UserDefault:setStringForKey("UserPassword",psdStr)   --getBoolForKey
    UserDefault:flush()
end

--获取用户登录服务器
function UserDefaultMgr:GetUserServer()
    local serName = UserDefault:getStringForKey("UserServerName") or ""
    local serId = UserDefault:getIntegerForKey("UserServerId",serId) or 0
    return serName, serId 
end

function UserDefaultMgr:SetUserServer(serName, serId)
    UserDefault:setStringForKey("UserServerName",serName)
    UserDefault:setIntegerForKey("UserServerId",serId)
    UserDefault:flush()
end

return UserDefaultMgr
