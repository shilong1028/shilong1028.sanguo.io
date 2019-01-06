

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
	self.id_str = "0"   --string 城池ID字符串
	self.name = ""     --string 城池名称
	self.type = 0     --城池类型1大城市，2郡城，3关隘渡口
	self.zhou_id = 0    --所属州
	self.mapId = 0    --所在地图ID
	self.map_row = 0    --城池在地图的行  32*32为单位块的横向数量
	self.map_col = 0    --城池在地图的列
	self.population = 0   --初始人口数量
	self.pop_limits = {}  --最小户口-正常户口-最大户口,《最小限，人口停止增长；正常限，正常增长；》最大限，瘟疫发生，人口减少
	self.near_citys = {}     --周边相邻连接的城池
	self.counties = {}   --郡下辖的县名称（游戏中用
	self.desc = ""      --string 

	--游戏附加数据
	self.map_pt = cc.p(0,0)  --以左上角为00原点的地图坐标
end

--地图跳转点表结构类
g_tbl_mapJumpPtConfig = class("g_tbl_mapJumpPtConfig",__BaseStruct)
function  g_tbl_mapJumpPtConfig:ctor()
	self.id_str = ""        --跳转点ID字符串
	self.map_id1 = 0     --地图1ID 
	self.map_col1 = 0     --跳转点在地图1的列
	self.map_row1 = 0     --跳转点在地图1的行  32*32为单位块的横向数量
	self.off_col1 = 0 
	self.off_row1 = 0   ---跳转到地图后人物的偏移位置,针对目的地图而言，为了能表示负数，将真实值加10计算打表
	self.desc = ""  
	self.sameIdStr = ""  --目的地图上的配对跳转点ID字符串
	self.map_id2 = 0  
	self.map_col2 = 0  
	self.map_row2 = 0      
	self.off_col2 = 0    
	self.off_row2 = 0     

	--游戏附加数据
	self.map_pt1 = cc.p(0,0)   --以左上角为00原点的地图坐标
	self.map_pt2 = cc.p(0,0)   --以左上角为00原点的地图坐标
end 

--战场营寨表结构类
g_tbl_battleYingZhaiConfig = class("g_tbl_battleYingZhaiConfig",__BaseStruct)
function  g_tbl_battleYingZhaiConfig:ctor()
	self.id_str = ""        --营寨ID字符串
	self.name = ""     --营寨名称
	self.type = 0     --营寨类型 1前锋2左军3右军4后卫5中军
	self.bEnemy = 0     --0我方营寨，1敌方营寨
	self.imgStr = ""   --营寨资源路径名称
	self.atk = 0   --营寨攻击力
	self.hp = 0   --营寨生命防御值
	self.battleMapId = 0     --营寨所在地图Id
	self.map_posX = 0   --以左上角为00原点的地图坐标
	self.map_posY = 0    --以左上角为00原点的地图坐标   
end 

--州表结构类
g_tbl_zhouConfig = class("g_tbl_zhouConfig",__BaseStruct)
function  g_tbl_zhouConfig:ctor()
	self.id = 0        --州ID
	self.name = ""     --地图名称
	self.map_id = 0     --地图ID
	self.capital = "0"    --首府ID字符串
	self.citys = {}  --下辖郡城及关隘ID字符串，以;分割
	self.desc = ""   
end

--阵营表结构类
g_tbl_campConfig = class("g_tbl_campConfig",__BaseStruct)
function  g_tbl_campConfig:ctor()
	self.campId = 0        --阵营ID
	self.name = ""     --阵营名称
	self.captain = "0"     --首领ID字符串
	self.capital = "0"    --首都城池ID字符串
	self.src_city = ""    --人物初始城池ID字符串
	self.population = 0    --初始百姓人口（单位万）
	self.troops = 0        --初始兵力（人）
	self.money = 0     --初始财力（单位锭，1锭=100贯）
	self.food = 0     --初始粮草（单位石，1石=100斤）
	self.drug = 0     --初始药材（单位副，1副=100份）
	self.generalIdVec = {}    --初始将领ID字符串，以;分割
	self.desc = ""    --阵营描述
end

--武将表结构类
g_tbl_generalConfig = class("g_tbl_generalConfig",__BaseStruct)
function  g_tbl_generalConfig:ctor()
	self.id_str = "0"   --武将ID字符串(xml保存)
	self.name = ""     --武将名称
	self.type = 0    --将领类型，1英雄，2武将，3军师
	self.hp = 0    --初始血量值
	self.mp = 0        --初始智力值
	self.atk = 0     --初始攻击力
	self.def = 0     --初始防御力
	self.qiLv = 0    --骑兵掌握熟练度等级，0-10,0为未获取相应兵种印玺
	self.qiangLv = 0   --枪兵掌握熟练度等级
	self.daoLv = 0     --刀兵掌握熟练度等级
	self.gongLv = 0     --弓兵掌握熟练度等级
	self.desc = ""    --描述

	--附加属性(xml保存)
	self.level = 0     --武将等级(xml保存)
	self.exp = 0   --战斗经验
	self.offical = "0"    --官职ID字符串，官职可以提升武将血智攻防、额外带兵数（默认带1000兵）等属性
	self.zhongcheng = 100   --武将忠诚度
	self.skillVec = {}    --初始技能，技能lv-ID字符串以;分割(xml保存)
	self.equipVec = {}    --初始装备，装备lv-ID字符串以;分割(xml保存)
	self.bingTypeVec = {}    --轻装|重装|精锐|羽林品质的骑兵|枪戟兵|刀剑兵|弓弩兵等共16种（每个兵种仅可组建一支部曲）
	self.armyUnitVec = {}    --g_tbl_armyUnitConfig:new()   --武将部曲数据
end

--武将部曲结构类
g_tbl_armyUnitConfig = class("g_tbl_armyUnitConfig",__BaseStruct)
function  g_tbl_armyUnitConfig:ctor()
	self.bingIdStr = "0"   --部曲兵种（游击|轻装|重装|精锐|禁军的弓刀枪骑兵）
	self.bingCount = 0    --部曲兵力数量
	self.level = 0    --部曲等级
	self.exp = 0      --部曲训练度
	self.shiqi = 0    --部曲士气
	self.zhenId = "0"   --部曲阵法Id

	--附加信息
	self.bingData = nil   --兵种数据
	self.zhenData = nil   --阵型数据
end

--攻击阵型或防御阵型中各营寨数据
g_tbl_ZhenUnitStruct = class("g_tbl_ZhenUnitStruct",__BaseStruct)
function  g_tbl_ZhenUnitStruct:ctor()
	self.zhenPos = 0   --1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
	self.generalIdStr = "0"    --营寨武将ID字符串
	self.unitData = g_tbl_armyUnitConfig:new()    --营寨武将部曲数据

	--附加信息
	self.generalData = nil   --营寨武将数据
end

--物品装备表结构类
g_tbl_itemConfig = class("g_tbl_itemConfig",__BaseStruct)
function  g_tbl_itemConfig:ctor()
	self.id_str = "0"        --物品ID字符串
	self.name = ""     --物品名称
	self.type = 0    --物品类型，
	self.quality = 0     --技能或装备等物品的品质
	self.skill = "0"     --物品关联的技能ID字符串
	self.hp = 0    --装备增加的血量值
	self.mp = 0        --装备增加的智力值
	self.atk = 0     --装备增加的攻击力
	self.def = 0     --装备增加的防御力
	self.troops = 0         --附加兵力数量
	self.arm_type = 0      --开启兵种属性（刀枪弓骑）
	self.other = 0     --备用字段，用于使用某物品开启某种特性（如官职，技能，兵种等）
	self.desc = ""    --描述

	--附加属性
	self.level = 1
	self.exp = 0
end

--对话文本表结构类
g_tbl_talkConfig = class("g_tbl_talkConfig",__BaseStruct)
function  g_tbl_talkConfig:ctor()
	self.id_str = ""        --ID字符串
	self.bg = ""   --对白背景图片
	self.headVec = {}   --对白相关人物头像id_str，以;分割
	self.desc = ""    --描述
end

--剧情表结构类
g_tbl_storyConfig = class("g_tbl_storyConfig",__BaseStruct)
function  g_tbl_storyConfig:ctor()
	self.storyId = 0        --剧情ID
	self.targetCity = "0"    --目标城池ID字符串
	self.name = ""    --战役名称
	self.vedio = "0"   --主线剧情视频文件，"0"标识无
	self.battleIdStr = "0"   --战斗ID字符串，"0"标识无战斗
	self.rewardsVec = {}    --奖励物品，以;分割。物品ID字符串和数量用-分割   {["itemId"], ["num"]}
	self.soldierVec = {}    --奖励士兵，以;分割。物品ID字符串和数量用-分割  {["itemId"], ["num"]}
	self.offical = "0"   --奖励官职id_str
	self.generalVec = {}   --奖励武将Id_str, 以;分割
	self.talkVec = {}    --对话内容，以;分割
	self.desc = ""    --剧情简要描述，用于奖励或战斗界面展示

	--附加成员
	self.bPlayedTalk = 0   ---是否已经播放过对话，0未，1已播放（则不再播放）
end

--vip表结构类
g_tbl_vipConfig = class("g_tbl_vipConfig",__BaseStruct)
function  g_tbl_vipConfig:ctor()
	self.id = 0        --vip等级ID
	self.name = ""    --vip名称
	self.gold = 0    --充值总额（1银锭=1人民币）
	self.rewardsVec = {}   --直接奖励物品，用;分割
	self.money_per = 0    --每天金币产出增加率（%,取万分值）
	self.food_per = 0    --每天粮草产出增加率（%,取万分值）
	self.time_per = 0    --建筑升级时间缩减率（%,取万分值）
	self.desc = ""    --
end

--官职表结构类
g_tbl_officalConfig = class("g_tbl_officalConfig",__BaseStruct)
function  g_tbl_officalConfig:ctor()
	self.id_str = ""    --官职ID字符串
	self.name = ""     --名称
	self.type = 0    --官职类型，0通用，1主角，2武将，3军师
	self.quality = 0   --品质,0五品以下，1五品，2四品，3三品，4二品，5一品，6王侯，7皇帝
	self.tips = ""     --官职小提示
	self.hp = 0    --附加血量值
	self.mp = 0        --附加智力值
	self.troops = 0     --附加带兵数
	self.subs = {}     --下属官职id_str集合,-表示连续区间，;表示间隔区间
	self.desc = ""    --官职介绍
end

--技能表结构类
g_tbl_skillConfig = class("g_tbl_skillConfig",__BaseStruct)
function  g_tbl_skillConfig:ctor()
	self.id_str = ""    --技能ID字符串(9xxy，9为开始标志，xx为技能编号，y为升级编号）
	self.name = ""     --名称
	self.type = 0    --1对己方，2对敌方。对己方加成，对敌方减少
	self.cooldown = 0    --冷却时间(单位毫秒）
	self.duration = 0    --持续时间
	self.hp = 0     --附加血量值
	self.mp = 0    --附加智力值
	self.atk = 0     --附加攻击力
	self.def = 0     --附加防御力
	self.speed = 0    --提升攻击速度
	self.baoji = 0     --提升暴击值（只有对己方有用）
	self.shanbi = 0     --提升闪避值（只有对己方有用）
	self.shiqi = 0     --对士气影响，对己方加成，对敌方减少
	self.desc = ""    --技能介绍
end

--战斗战场结构类
g_tbl_battleMapConfig = class("g_tbl_battleMapConfig",__BaseStruct)
function  g_tbl_battleMapConfig:ctor()
	self.id_str = ""    --战斗ID字符串
	self.name = ""     --战斗名称
	self.mapId = 0    --战斗战场ID
	self.targetStr = ""  --战斗目标
	self.rewardsVec = {}   --战斗奖励集合
	self.yingzhaiVec = {}    --营寨集合
	self.enemyVec = {}     --敌人部曲集合{idStr部曲ID, atkTime主动进攻时间，-1不进攻}
end

--战斗结果结构类
g_tbl_battleRusultStruct = class("g_tbl_battleRusultStruct",__BaseStruct)
function  g_tbl_battleRusultStruct:ctor()
	self.battleName = ""    --战斗名称
	self.battleDesc = ""     --战斗描述

	self.starNum = 0  --战斗星级，0为失败
	--我方主将ID，伤兵，耗金，耗粮
	self.myGeneralIdStr = ""
	self.myLoseBingNum = 0
	self.myLoseMoneyNum = 0
	self.myLoseFoodNum = 0
	--敌方主将ID，伤兵，耗金，耗粮
	self.enemyGeneralIdStr = ""
	self.enemyLoseBingNum = 0
	self.enemyLoseMoneyNum = 0
	self.enemyLoseFoodNum = 0

	self.rewardsVec = {}   --战斗奖励集合
end


