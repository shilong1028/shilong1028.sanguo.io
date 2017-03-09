

--用于用户自定义全局公用管理器，游戏各功能管理器则放到各功能文件夹（模块）中而不置于Manager中
local UserDefaultMgr = require "Manager.UserDefaultMgr"
local TBLMgr = require "Manager.TBLMgr"
local AutoPathMgr = require "Manager.AutoPathMgr"
local NetMsgDealMgr = require "Manager.NetMsgDealMgr"

local MapMgr = require "Manager.MapMgr"


g_UserDefaultMgr = g_UserDefaultMgr or UserDefaultMgr:GetInstance()   --本地信息管理单例
g_pTBLMgr = g_pTBLMgr or TBLMgr:GetInstance()       --本地tbl表格数据单例
g_pAutoPathMgr = g_pAutoPathMgr or AutoPathMgr:GetInstance()  --寻路管理器单例
g_NetMsgDealMgr = g_NetMsgDealMgr or NetMsgDealMgr:GetInstance()  --用于客户端和服务器之间的通信管理

g_pMapMgr = g_pMapMgr or MapMgr:GetInstance()       --州郡地图管理单例
