

--GlobalStruct.lua用于用户自定义一些结构对象table, 方便阅读和使用， 自定义全局枚举名前以 g_ 为标志

__BaseStruct = {__cname = "__BaseStruct"}

--动画工具辅助结构类
g_ImodAnim_ActionOpt = class("g_ImodAnim_ActionOpt",__BaseStruct)
function  g_ImodAnim_ActionOpt:ctor()
	self.size = 0
	self.frames = {}
	self.durations = {}
	--self.flags = {}   --标志是原动画文件中的动作帧0，还是附加的重复动作帧1
	self.times = {}   --重复次数，0为原帧，>0则表示在原帧之后，重复n次
end

--滚动文本提示数据结构体
g_ScrollTips_text = class("g_ScrollTips_text",__BaseStruct)
function  g_ScrollTips_text:ctor()
	self.text = ""
	self.color = g_ColorDef.White
	self.fontSize = g_defaultFontSize
end

--玩家登陆用户信息
g_Login_Account = class("g_Login_Account",__BaseStruct)
function g_Login_Account:ctor()
	self.serverList = {}  --g_Login_ServerInfo
	self.accountData = g_Login_AccountData:new()   --m_AccountData
	self.userAccount = g_Login_UserAccount:new()
	self.selServer = 0
	self.sid = 0
	self.uid = 0
end

--服务器区服信息
g_Login_ServerInfo = class("g_Login_ServerInfo",__BaseStruct)
function g_Login_ServerInfo:ctor()
	self.id  = -1  
	self.page  = -1   --服务器大区
	self.serId  = -1  --服务器ID
	self.serName  = "" 
	self.serIp  = ""
	self.serPort  = -1  
	self.errMsg  = "" 
	self.serType  = -1    -- 0正常 1推荐 2新服
	self.onlineState  = -1   --0绿 1黄 2红
	self.serState  = -1   --0正常 1维护中
	self.serPic  = -1    -- 服务器名称图片ID
	self.needLineUp  = false   --是否需要排队
	self.lineUpIp  = ""   --排队服ip
	self.lineUpPort  = 0   --排队服端口
end

--服务器区服的用户信息
g_Login_AccountData = class("g_Login_AccountData",__BaseStruct)
function g_Login_AccountData:ctor()
	self.userid  = 0 
	self.roleid  = 0 
	self.name  = 0 
	self.head  = 0 
	self.professional  = 0 
	self.level  = 0 
	self.sex  = 0 
	self.type  = 0 
end

--服务器区服的用户登录信息
g_Login_UserAccount = class("g_Login_UserAccount",__BaseStruct)
function g_Login_UserAccount:ctor()
	self.UserName  = ""    --Account
	self.Password  = ""
end














-------------------------以上为游戏结构体定义
-----------------------------------------------------------------
-------------------------以下为tbl表结构定义

--地图表结构类
g_tbl_mapConfig = class("g_tbl_mapConfig",__BaseStruct)
function  g_tbl_mapConfig:ctor()
	self.id = 0        --short 地图ID
	self.name = ""     --string 地图名称
	self.path = ""     --string 地图图片在res/Map文件夹中路径
	self.width = 0     --int 地图宽  像素点
	self.height = 0    --int 地图高
	self.default_pt = cc.p(0,0)  --string 跳转到此地图的默认点  每点以32*32为单位块，转换为像素点
	self.jump_pt = {}     --string 跳转到其他地图的传送点  每点以32*32为单位块，转换为像素点
	self.npc_id = {}      --string 本地图的NPC
	self.img_count = 1    --切成的小图数量
	self.row = 1    --切成的小图的行列数
	self.column = 1

	--游戏附加数据
	self.wTitleCount = 0   --32*32为单位块的横向数量
	self.hTitleCount = 0   --32*32为单位块的纵向数量
end




