
--BattleMapLayer用于显示战斗（PVP)地图及点击处理等
local BattleMapLayer = class("BattleMapLayer", CCLayerEx) --填入类名

local BattleMenuPage = require "Layer.Battle.BattleMenuPage"  --战斗层菜单
local BattleMapPage = require "Layer.Battle.BattleMapPage"  --BattleMapPage 用于显示战斗（PVP)地图及点击处理等

function BattleMapLayer:create()   --自定义的create()创建方法
    --G_Log_Info("BattleMapLayer:create()")
    local layer = BattleMapLayer.new()
    return layer
end

function BattleMapLayer:onExit()
    --G_Log_Info("BattleMapLayer:onExit()")

end

--------------------------------- 初始化数据 ---------------------------------

function BattleMapLayer:init()  
    --G_Log_Info("BattleMapLayer:init()")
    --菜单层
    if self.BattleMenuPage then
    	self.BattleMenuPage:removeFromParent(true)
    end
    self.BattleMenuPage = BattleMenuPage:create()
    self:addChild(self.BattleMenuPage, 10, 999)

    --地图层
    if self.BattleMapPage then
    	self.BattleMapPage:removeFromParent(true)
    end
    self.BattleMapPage = BattleMapPage:create()
    self:addChild(self.BattleMapPage, 1, 555)
    self.BattleMapPage:setVisible(false)
end

function BattleMapLayer:ShowBattleMapImg(battleMapId, zhenXingData)  
	--菜单层
    if self.BattleMenuPage then
    	self.BattleMenuPage:initBattleData(battleMapId)
    end

    --地图层
    if self.BattleMapPage then
    	self.BattleMapPage:ShowBattleMapImg(battleMapId, zhenXingData) 
    	self.BattleMapPage:setVisible(true)
    end
end


return BattleMapLayer

--[[
战斗规则：
	1、营寨探测区域为半径500像素的范围圆，部曲探测区域为半径300像素的范围圆。
	敌人出现在我方某单位探测范围圆内，则敌方单位显示在战场上，且我方单位会立即改变作战状态主动进攻敌方单位（部曲优先，营寨最末）。
	2、营寨有一个防御力量（中军为1000，其他为500）和微弱的箭射攻击（中军每回合时间为200，其他为100）。
	只有消灭敌方营寨探测范围内的敌方部曲单位后，才可进攻敌方营寨。
	3、前锋军在敌前锋营未攻破前，只能进攻敌前锋营或其探测范围内的敌军部曲。
	敌前锋营被攻破后（敌该探测范围消失），前锋军可以进攻敌中军大帐或其探测范围内的敌军部曲。前锋军不可进攻敌后卫营。
	4、左护军在敌左营未攻破前，只能进攻敌左营、敌前锋营或其探测范围内的敌军部曲。
	敌前锋营被攻破后（敌该探测范围消失）而左营未被攻破，左护军只能进攻敌左营或其探测范围内的敌军部曲。
	敌左营被攻破后（敌该探测范围消失）而前锋营未被攻破，左护军只能进攻敌前锋营或其探测范围内的敌军部曲。
	敌左营和前锋营均被攻破后（敌该探测范围消失），左护军可以进攻敌中军大帐或敌后卫营或其探测范围内的敌军部曲。
	5、右护军类似左护军。
	6、后卫军不会主动进攻敌营寨，但可以进攻其探测范围内的敌军部曲。在我中军大帐未被攻击时，后卫军活动范围不会超出后卫营的探测范围。
	在我中军大帐被攻击时，后卫军可以前来支援中军，但活动范围不会超出后卫营的探测范围和中军大帐的探测范围。
	只有敌方的左护军或右护军方可进攻我后卫营，反之相同。
	7、中军部曲在敌前锋营未攻破前，可以进攻敌前锋营、左营、右营或其探测范围内的敌军部曲。
	敌前锋营被攻破后（敌该探测范围消失），中军部曲可以进攻敌中军大帐、左营、右营或其探测范围内的敌军部曲。中军部曲不可进攻敌后卫营。
	8、战斗胜利规则：倒计时时间为0，进攻方失败；中军大帐被攻破者，失败；主帅部曲消失（主帅死亡或士兵数量为0）者，失败。
	9、战斗开始时每只部曲士气为100，士气为0的部曲消失。部曲武将死亡时部曲消失。
	10、前锋营、左营、右营被攻破方，中军部曲士气减少10。攻破敌左营，我方获取敌携带粮草总量的10%。攻破敌右营，我方获取敌携带金钱总量的10%。
	攻破敌后卫营，我方获取敌携带粮草和金钱总量各20%，敌每只部曲士气减少10。攻破敌中军大帐或杀死敌主帅部曲，战斗胜利。
	11、全军进攻可以让除后卫军和主帅部曲以外的部队按照规则前进并对敌营寨进行攻击。
	全军待命可以让所有部曲停止前进原地警戒，但与敌接触部队仍会进行战斗，但不会进行追击。
	全军回防可以让所有部曲撤退到初始营寨中，营寨被攻破者撤退到中军大帐（但部曲性质不变，即左护军仍旧是左护军）。
	12、敌军出现在我部曲探测范围内时，如果我军被敌方克制，则我军撤退到营寨，否则我军主动进攻敌部曲。我军部曲出现在敌军部曲探测范围内时，规则相同。
]]
