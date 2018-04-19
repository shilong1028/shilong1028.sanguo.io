

--GlobalEnum.lua用于用户自定义全局枚举定义， 自定义全局枚举名前以 g_ 为标志

--网络Socket连接状态State和Error定义
g_networkState ={
	CONNECTING = 0,
	SUCCESS = 1,
	BREAK = 2,
	START = 3,
}

g_networkError ={
	FALSE = 0,
	TRUE  = 1
}

--全局游戏界面层Tag定义
g_GameLayerTag = {
	LAYER_TAG_MAINMENU = 20,    --主界面菜单层，主菜单以后的层可以被删除，即各显示界面层
	LAYER_TAG_MAINCITY = 21,    --主城界面 
	LAYER_TAG_CHINAMAP = 22,    --全国地图界面,
	LAYER_TAG_BATTLEMAP = 23,    --战场地图界面,
	
	--主菜单层，主城层，全国地图层，不删除仅仅隐藏， 
	LAYER_TAG_SocketAni = 99,    --网络通信动画层,
	--tag < 100 为特殊层，100之后为一般功能界面层tag
	LAYER_TAG_LoginLayer = 100, --登录界面
	LAYER_TAG_AniToolLayer = 101,    --动画工具界面,
	LAYER_TAG_ScrollTipsLayer = 102,    --滚动提示文本界面,
	LAYER_TAG_LoadingLayer = 103,    --加载过渡层
	LAYER_TAG_SelCampLayer = 104,    --选角界面
	LAYER_TAG_StoryTalkLayer = 105,    --剧情对话层
	LAYER_TAG_DialogOkCancelLayer = 106,    --okcancel对话框
	LAYER_TAG_DialogHelpLayer = 107,    --help对话框
	LAYER_TAG_BattleInfoLayer = 108,    --战役信息
	LAYER_TAG_BattleResultLayer = 109,    --战役结果
	LAYER_TAG_ZhenXingLayer = 110,    --阵型|布阵界面
	LAYER_TAG_VipLayer = 111,    --Vip界面
	LAYER_TAG_StoryResultLayer = 112,    --剧情奖励界面
	LAYER_TAG_BagLayer = 113,    --背包界面
	LAYER_TAG_VedioLayer = 114,    --视频播放界面
	LAYER_TAG_GeneralLayer = 115,    --将领界面


}

--兵种移动速度
g_BingSpeed = {
	QiangSpeed = 300,
	DaoSpeed = 400,
	GongSpeed = 450,
	QiSpeed = 600
}

--战场部曲攻击状态，0待命，1进攻，2回防，3溃败
g_AtkState = {
	Pause = 0,
	Attack = 1,
	Defend = 2, 
	Failed = 3
}

--战场部曲攻击对象类型，0无对象，1攻击营寨，2攻击敌军
g_AtkObject = {
	None = 0,
	YingZhai = 1,
	EnemyUnit = 2
}

--营寨或部曲的安全探测范围（敌军显示距离）
g_AtkLimitLen = {
	yingzhaiLen = 500,  --500像素内可见敌方单位
	unitLen = 200   --200像素内可见
}

--人物移动的方向状态标识
g_PlayerState = {
	HMS_NUM = 9,   --状态数量
	HMS_NOR = 0,  --站立姿态
	HMS_RDOWN = 1, --移动中的几个方向标记  cc.p(1,-1)
	HMS_DOWN = 2,  --cc.p(0,-1)
	HMS_LDOWN = 3, --cc.p(-1,-1)
	HMS_LEFT = 4,  --cc.p(-1,0)
	HMS_LUP = 5,   --cc.p(-1,1)
	HMS_UP = 6,    --cc.p(0,1)
	HMS_RUP = 7,   --cc.p(1,1)
	HMS_RIGHT = 8, --cc.p(1,0)
}

--物品类型定义值
g_ItemType = {
	Item_Glod = 1,  --金钱(类型)
	Item_Food = 2,  --粮草(类型)
	Item_Drug = 3,  --药材(类型)
	Item_Army = 4, --预备役士兵(类型)
	Item_SoldierEquip = 5, --士兵装备(类型)
	Item_General_toukui = 81,  --武将头盔(类型)
	Item_General_wuqi = 82,  --武将武器(类型)
	Item_General_hujia = 83,  --武将护甲(类型)
	Item_General_zuoqi = 84,  --武将坐骑(类型)
	Item_General_daoju = 85,  --武将道具(类型)
}

g_ItemIdDef = {
	Item_Id_qiangbing = 401,   --枪兵(ID)
	Item_Id_daobing = 402,   --刀兵(ID)
	Item_Id_gongbing = 403,   --弓兵(ID)
	Item_Id_qibing = 404,   --骑兵(ID)
	Item_Id_qiangji = 501,   --枪戟(ID)
	Item_Id_daojian = 502,   --刀剑(ID)
	Item_Id_gongnu = 503,   --弓弩(ID)
	Item_Id_mapi = 504,   --马匹(ID)
	Item_Id_bingjia = 505,   --弓弩(ID)
	Item_Id_glod = 6001,  --金钱(ID)
	Item_Id_food = 6002,  --粮草(ID)
	Item_Id_drug = 6003,  --药材(ID)
}

--用户自定义颜色值
g_ColorDef = {
	White = cc.c3b(255,255,255),
	Red = cc.c3b(255,0,0),
	DarkRed = cc.c3b(101,9,9),
	Yellow = cc.c3b(249,154,5),
	Green = cc.c3b(0,128,0),
	Blue = cc.c3b(0,127,255),
}


--自定义异步事件监听的事件名称定义
g_EventListenerCustomName = {
	Login_serverListEvent = "Login_serverListEvent",   --登录界面的服务器列表监听事件
	MainMenu_mainStoryEvent = "MainMenu_mainStoryEvent",   --主线剧情任务监听
	MainMenu_vipEvent = "MainMenu_vipEvent",   --vip变化监听
	MainMenu_troopEvent = "MainMenu_troopEvent",   --军队数量变化监听
	MainMenu_moneyEvent = "MainMenu_moneyEvent",   --金币变化监听
	MainMenu_foodEvent = "MainMenu_foodEvent",   --粮草变化监听
	MainMenu_drugEvent = "MainMenu_drugEvent",   --药材变化监听
}


--网络通信协议号
g_SocketCMD = {
	NET_LOGIN = 1,    --登录游戏服务器
	NET_CHOOSE_HERO = 4, --选择角色进入游戏
	NET_HEART_JUMP = 102, --心跳包
	NET_ACC_LOGIN = 501,  --帐号服务器-登录
	NET_ACC_REG = 502,  --账号注册

	NET_ACC_LINEUP = 600, --排队服务器--排队

}