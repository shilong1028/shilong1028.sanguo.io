

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


