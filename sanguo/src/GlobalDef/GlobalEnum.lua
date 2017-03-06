

--GlobalEnum.lua用于用户自定义全局枚举定义， 自定义全局枚举名前以 g_ 为标志

--全局游戏界面层Tag定义
g_GameLayerTag = {
	LAYER_TAG_MAINMENU = 20,    --主界面菜单层，主菜单以后的层可以被删除，即各显示界面层
	LAYER_TAG_MAINCITY = 21,    --主城界面 
	LAYER_TAG_CHINAMAP = 22,    --全国地图界面,

	--主菜单层，主城层，全国地图层，不删除仅仅隐藏， 

	--tag < 100 为特殊层，100之后为一般功能界面层tag

	LAYER_TAG_AniToolLayer = 101,    --动画工具界面,
	LAYER_TAG_ScrollTipsLayer = 102,    --滚动提示文本界面,
}

--人物移动的方向状态标识
g_PlayerState = {
	HMS_NUM = 9,   --状态数量
	HMS_NOR = -1,  --站立姿态
	HMS_RDOWN = 0, --移动中的几个方向标记  cc.p(1,-1)
	HMS_DOWN = 1,  --cc.p(0,-1)
	HMS_LDOWN = 2, --cc.p(-1,-1)
	HMS_LEFT = 3,  --cc.p(-1,0)
	HMS_LUP = 4,   --cc.p(-1,1)
	HMS_UP = 5,    --cc.p(0,1)
	HMS_RUP = 6,   --cc.p(1,1)
	HMS_RIGHT = 7, --cc.p(1,0)
}

--用户自定义颜色值
g_ColorDef = {
	["White"] = cc.c3b(255,255,255),

}