

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