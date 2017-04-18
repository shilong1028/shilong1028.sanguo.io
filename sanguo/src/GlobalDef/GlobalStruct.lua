

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
	self.img_count = 1    --切成的小图数量
	self.row = 1    --切成的小图的行列数
	self.column = 1
	self.nearMapVec = {}    --相邻地图ID集合
	self.cityIdStrVec = {}     --string 地图上所属郡城分布点
	self.jumpptIdStrVec = {}      --string 跳转到其他地图的传送点 

	--游戏附加数据
	self.wTitleCount = 0   --32*32为单位块的横向数量
	self.hTitleCount = 0   --32*32为单位块的纵向数量
end

--城池表结构类
g_tbl_cityConfig = class("g_tbl_cityConfig",__BaseStruct)
function  g_tbl_cityConfig:ctor()
	self.id_str = ""   --string 城池ID字符串
	self.name = ""     --string 城池名称
	self.type = 0     --城池类型1大城市，2郡城，3关隘渡口
	self.zhou_id = 0    --所属州
	self.mapId = 0    --所在地图ID
	self.map_row = 0    --城池在地图的行  32*32为单位块的横向数量
	self.map_col = 0    --城池在地图的列
	self.population = 0   --初始人口数量
	self.near_citys = {}     --周边相邻连接的城池
	self.desc = ""      --string 

	--游戏附加数据
	self.map_pt = cc.p(0,0)  --转换为像素点,以左上角为00原点
end

--地图跳转点表结构类
g_tbl_mapJumpPtConfig = class("g_tbl_mapJumpPtConfig",__BaseStruct)
function  g_tbl_mapJumpPtConfig:ctor()
	self.id_str = ""        --跳转点ID字符串
	self.map_id1 = 0     --地图1ID 
	self.map_row1 = 0     --跳转点在地图1的行  32*32为单位块的横向数量
	self.map_col1 = 0     --跳转点在地图1的列
	self.map_id2 = 0   
	self.map_row2 = 0    
	self.map_col2 = 0   
	self.desc = ""     

	--游戏附加数据
	self.map_pt1 = cc.p(0,0)   --转换为像素点,以左上角为00原点
	self.map_pt2 = cc.p(0,0)   --转换为像素点,以左上角为00原点
end 

--州表结构类
g_tbl_zhouConfig = class("g_tbl_zhouConfig",__BaseStruct)
function  g_tbl_zhouConfig:ctor()
	self.id = 0        --州ID
	self.name = ""     --地图名称
	self.map_id = 0     --地图ID
	self.capital = ""    --首府ID字符串
	self.desc = ""   
end

--阵营表结构类
g_tbl_campConfig = class("g_tbl_campConfig",__BaseStruct)
function  g_tbl_campConfig:ctor()
	self.campId = 0        --阵营ID
	self.name = ""     --阵营名称
	self.captain = ""     --首领ID字符串
	self.capital = ""    --首都城池ID字符串
	self.population = 0    --初始百姓人口（单位万）
	self.troops = 0        --初始兵力（人）
	self.money = 0     --初始财力（单位锭，1锭=1000贯）
	self.food = 0     --初始粮草（单位石，1石=1000斤）
	self.generalIdVec = ""    --初始将领ID字符串，以;分割
	self.desc = ""    --阵营描述
end

--武将表结构类
g_tbl_generalConfig = class("g_tbl_generalConfig",__BaseStruct)
function  g_tbl_generalConfig:ctor()
	self.id_str = ""        --武将ID字符串
	self.name = ""     --武将名称
	self.level = 0     --武将初始登录等级
	self.type = 0    --将领类型，1英雄，2武将，3军师
	self.hp = 0    --初始血量值
	self.mp = 0        --初始智力值
	self.atk = 0     --初始攻击力
	self.def = 0     --初始防御力
	self.skillIdVec = ""    --初始技能，技能ID字符串以;分割
	self.equipIdVec = ""    --初始装备，装备ID字符串以;分割
	self.desc = ""    --描述
end

--物品装备表结构类
g_tbl_itemConfig = class("g_tbl_itemConfig",__BaseStruct)
function  g_tbl_itemConfig:ctor()
	self.id_str = ""        --物品ID字符串
	self.name = ""     --物品名称
	self.type = 0    --物品类型，1金币，2粮草，3技能丹，4装备，…
	self.money = 0    --物品增加的金币数量
	self.food = 0        --物品增加的粮草数量
	self.level = 0     --技能或装备等物品的等级
	self.skill = ""     --物品关联的技能ID字符串
	self.hp = 0    --装备增加的血量值
	self.mp = 0        --装备增加的智力值
	self.atk = 0     --装备增加的攻击力
	self.def = 0     --装备增加的防御力
	self.desc = ""    --描述
end

--对话文本表结构类
g_tbl_talkConfig = class("g_tbl_talkConfig",__BaseStruct)
function  g_tbl_talkConfig:ctor()
	self.id_str = ""        --ID字符串
	self.desc = ""    --描述
end

--剧情表结构类
g_tbl_storyConfig = class("g_tbl_storyConfig",__BaseStruct)
function  g_tbl_storyConfig:ctor()
	self.storyId = 0        --剧情ID
	self.targetCity = ""    --目标城池ID字符串
	self.name = ""    --战役名称
	self.enemyIdVec = ""    --敌方出战将领ID字符串，以;分割
	self.rewardIdVec = ""    --奖励物品，以;分割。物品ID字符串和数量用-分割   {["itemId"], ["num"]}
	self.talkVec = ""    --对话内容，以;分割。人物ID字符串和文本用-分割   {["heroId"], ["text"]}
end




