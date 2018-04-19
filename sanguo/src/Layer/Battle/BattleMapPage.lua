
--BattleMapPage 用于显示战斗（PVP)地图及点击处理等
local BattleMapPage = class("BattleMapPage", CCLayerEx) --填入类名

local NpcNode = require "Layer.NpcNode"  --NpcNode用于构造静态展示模型，比如城池展示模型、跳转点、战场营寨等
local BattleOfficalNode = require "Layer.Battle.BattleOfficalNode"  --BattleOfficalNode 用于战斗地图中的武将表现

function BattleMapPage:create()   --自定义的create()创建方法
    --G_Log_Info("BattleMapPage:create()")
    local layer = BattleMapPage.new()
    return layer
end

function BattleMapPage:onExit()
    --G_Log_Info("BattleMapPage:onExit()")
    if self.OnTouchMoveUpdateEntry then
		self.OnTouchMoveUpdateEntry = g_Scheduler:unscheduleScriptEntry(self.OnTouchMoveUpdateEntry)
	end
	self.OnTouchMoveUpdateEntry = nil
end

function BattleMapPage:CreateDirectionWheel(bShow, moveLen, movePos, beginPos)
	local wheelBgImg = self:getChildByTag(9999)   --摇杆底盘
	local directionWheelImg = self:getChildByTag(9998)   --摇杆小球
	if bShow == true then
		if not wheelBgImg then
			wheelBgImg = cc.Sprite:createWithSpriteFrameName("public2_directionWheelBg.png")
			self:addChild(wheelBgImg, 200, 9999)
		end
		if not directionWheelImg then
			directionWheelImg = cc.Sprite:createWithSpriteFrameName("public2_directionWheel.png")
			self:addChild(directionWheelImg, 201, 9998)
		end
		wheelBgImg:setPosition(beginPos)
		directionWheelImg:setPosition(beginPos)

		local offsetPos = cc.p(movePos.x - beginPos.x, movePos.y - beginPos.y)

		if moveLen > 80 then
			local scale = 80/moveLen
			local newPos = cc.p(beginPos.x + offsetPos.x*scale, beginPos.y + offsetPos.y*scale)
			directionWheelImg:setPosition(newPos)
		else
			directionWheelImg:setPosition(movePos)
		end

		wheelBgImg:setVisible(true)
		directionWheelImg:setVisible(true)
	else
		if wheelBgImg then
			wheelBgImg:setVisible(false)
		end
		if directionWheelImg then
			directionWheelImg:setVisible(false)
		end
	end
end

function BattleMapPage:IsDirectionWheelVisible()
	local bDirectionWheel = false  --摇杆是否出现了
	local wheelBgImg = self:getChildByTag(9999)   --摇杆地盘
	local directionWheelImg = self:getChildByTag(9998)   --摇杆小球
	if wheelBgImg and directionWheelImg and wheelBgImg:isVisible() and directionWheelImg:isVisible() then
		bDirectionWheel = true  --摇杆是否出现了
	end
	return bDirectionWheel
end

--显示或取消方向摇杆
function BattleMapPage:ShowDirectionWheel(bShow)
	--print("ShowDirectionWheel(), bShow = ", bShow, "; self._TouchMoveLen = ", self._TouchMoveLen or 0)
	if bShow == true then
		if self._TouchBeginPos == nil or self._TouchMovePos == nil then
			return 
		end

		self:CreateDirectionWheel(true, self._TouchMoveLen, self._TouchMovePos, self._TouchBeginPos)

		local offsetPos = cc.p(self._TouchMovePos.x - self._TouchBeginPos.x, self._TouchMovePos.y - self._TouchBeginPos.y)
		local offsetLen = cc.pGetDistance(cc.p(0, 0), offsetPos)
		local scale = 50/offsetLen

		local rolePos = cc.p(self.rolePos.x + offsetPos.x*scale, self.rolePos.y + offsetPos.y*scale)   --视图中心在地图上的位置
		self:setRoleMapPosition(rolePos)
		--hero:HeroMoveByDirectionWheel(offsetPos, self._TouchMoveLen, 0.1)
	else
		if self.OnTouchMoveUpdateEntry then
			self.OnTouchMoveUpdateEntry = g_Scheduler:unscheduleScriptEntry(self.OnTouchMoveUpdateEntry)
		end
		self.OnTouchMoveUpdateEntry = nil

		self:CreateDirectionWheel(false)
	end
end

function BattleMapPage:onTouchBegan(touch, event)
    --G_Log_Info("BattleMapPage:onTouchBegan()")
    --local beginPos = touch:getLocation()   --直接从touch中获取,在getLocation()源码里会将坐标转成OpenGL坐标系,原点在屏幕左下角，x轴向右，y轴向上
    --local point = touch:getLocationInView() --获得屏幕坐标系,原点在屏幕左上角，x轴向右，y轴向下
    --point = cc.Director:getInstance():convertToGL(point)  --先获得屏幕坐标，在调用convertToGL转成OpenGl坐标系
    --self:setRoleWinPosition(beginPos)

	if self.lastSelOfficalNode then
		if self.parentBattleMapLayer then
			self.parentBattleMapLayer:ShowBattleMenuBtn(false)     --最终反馈到战斗菜单层,--是否显示全军操作按钮
		end
		self.lastSelOfficalNode:setBtnIsShow(false)
		self.lastSelOfficalNode = nil
	end

	self:ShowDirectionWheel(false)

	self._TouchBeginPos = touch:getLocation()    --self:convertToNodeSpace(touch:getLocation())
	self._TouchMovePos = nil
	self._TouchMoveLen = 0

	if self.OnTouchMoveUpdateEntry then
		self.OnTouchMoveUpdateEntry = g_Scheduler:unscheduleScriptEntry(self.OnTouchMoveUpdateEntry)
	end
	self.OnTouchMoveUpdateEntry = nil

    return true   --只有当onTouchBegan的返回值是true时才执行后面的onTouchMoved和onTouchEnded触摸事件
end

function BattleMapPage:onTouchMoved( touch,  event) 
	if self._TouchBeginPos then 
		--G_Log_Info("BattleMapPage:onTouchMoved()")  
		self._TouchMovePos = touch:getLocation()
		self._TouchMoveLen = cc.pGetDistance(self._TouchBeginPos, self._TouchMovePos)
		if self._TouchMoveLen > 0.1  then    --and self._TouchMoveLen < 300.0
			if self.OnTouchMoveUpdateEntry == nil then
				local function OnTouchMoveUpdate(dt)
					self:ShowDirectionWheel(true)
				end
				self.OnTouchMoveUpdateEntry = g_Scheduler:scheduleScriptFunc(OnTouchMoveUpdate, 0.1, false)
			end
		else
			self:ShowDirectionWheel(false)
		end
	else
		self:ShowDirectionWheel(false)
	end
end

function BattleMapPage:onTouchEnded( touch,  event)
	--G_Log_Info("BattleMapPage:onTouchEnded()")  
	local bDirectionWheel = self:IsDirectionWheelVisible()  --摇杆是否出现了
	self:ShowDirectionWheel(false)

	if self._TouchBeginPos == nil then
		return
	end

	if bDirectionWheel == false then 
        self:setRoleWinPosition(touch:getLocation())   --移动到到点击点位置
	end
end


--中心视角在屏幕上的坐标（点击触发）
function BattleMapPage:setRoleWinPosition(winPos)
	local rootNodePos = cc.p(self.rootNode:getPosition())
	local rolePos = cc.p(winPos.x - rootNodePos.x, winPos.y - rootNodePos.y)
	if rolePos.x > self.mapConfigData.width then
		rolePos.x = self.mapConfigData.width
	end
	if rolePos.y > self.mapConfigData.height then
		rolePos.y = self.mapConfigData.height
	end

	self:showTouchImg(rolePos)

	self:setRoleMapPosition(rolePos)
end

--中心视角在地图上的坐标
function BattleMapPage:setRoleMapPosition(rolePos)
	if rolePos.x > self.mapConfigData.width then
		rolePos.x = self.mapConfigData.width
	elseif rolePos.x < 0 then
		rolePos.x = 0
	end
	if rolePos.y > self.mapConfigData.height then
		rolePos.y = self.mapConfigData.height
	elseif rolePos.y < 0 then
		rolePos.y = 0
	end

	self.rolePos = rolePos   --视图中心在地图上的位置
	self:resetRootNodePos(rolePos)
end

--以主角为屏幕中心，适配地图
function BattleMapPage:resetRootNodePos(rolePos, moveTime)
	local rootPos = cc.p(0,0)

	if rolePos.x >= self.mapConfigData.width - g_WinSize.width/2 then
		rootPos.x = g_WinSize.width - self.mapConfigData.width
	elseif rolePos.x >= g_WinSize.width/2 then
		rootPos.x = g_WinSize.width/2 - rolePos.x
	end

	if rolePos.y >= self.mapConfigData.height - g_WinSize.height/2 then
		rootPos.y = g_WinSize.height -self.mapConfigData.height
	elseif rolePos.y >= g_WinSize.height/2 then
		rootPos.y = g_WinSize.height/2 - rolePos.y
	end
	--G_Log_Info("BattleMapPage:resetRootNodePos, rootPos.x = %f, rootPos.y = %f", rootPos.x, rootPos.y)

	if moveTime then
		self.rootNode:runAction(cc.MoveTo:create(moveTime, rootPos))
	else
		self.rootNode:setPosition(rootPos)
	end
end

function BattleMapPage:showTouchImg(pos)
    if(self.m_touchImg == nil)then   --点击屏幕时的显示图片
        self.m_touchImg = cc.Sprite:create("Image/Image_Click1.png")
        self.m_touchImg:setVisible(false)
        self.rootNode:addChild(self.m_touchImg, 2)
    end

    if(self.m_touchImg:isVisible() == true)then
        self.m_touchImg:stopAllActions()
        self.m_touchImg:setVisible(false)
    end

    self.m_touchImg:setPosition(pos)
    
    local animation = cc.Animation:create()
    animation:addSpriteFrameWithFile("Image/Image_Click1.png")
    animation:addSpriteFrameWithFile("Image/Image_Click2.png")
    animation:addSpriteFrameWithFile("Image/Image_Click3.png")

    -- should last 0.3 seconds. And there are 3 frames.
    animation:setDelayPerUnit(0.3 / 3)
    animation:setRestoreOriginalFrame(true)
    local animate = cc.Animate:create(animation)

    self.m_touchImg:setVisible(true)
    self.m_touchImg:runAction(cc.Sequence:create(cc.Show:create(), animate, cc.Hide:create()))
end

--------------------------------- 初始化数据 ---------------------------------

function BattleMapPage:init()  
    --G_Log_Info("BattleMapPage:init()")
    --ClearMapObj不清除的数据
    self.rootNode = nil    --根节点
    self.mapConfigData = nil  --地图表配置数据 

    -------ClearMapObj清除的数据----------


    self:initTouchEvent()   --注册点击事件

    self.world = nil  --刚体世界
    --self:initPhysicsBody()
end

function BattleMapPage:initPhysicsBody()
	--刚体世界  cc.PhysicsBody
    self.world = cc.Director:getInstance():getRunningScene():getPhysicsWorld()  --创建物理世界

    self.world:setGravity(cc.p(0, 0))   --设置物理世界的重力

    local debug = true
    self.world:setDebugDrawMask(debug and cc.PhysicsWorld.DEBUGDRAW_ALL or cc.PhysicsWorld.DEBUGDRAW_NONE)   --设置显示debug

    self.world:setAutoStep(false)   --物理世界自动同步关掉, 防止PhysicsBody会乱飞乱跳、抖动

    self.world:setFixedUpdateRate(0)  --当传入参数为0时表示关闭fixed step system，默认值为零。其含义是每秒钟物理世界更新多少次，一般传入30-50左右足矣，数值越大物理模拟越精确，每秒更新次数过多性能也会下降。

    --创建边界盒
    local VisibleRect = cc.Director:getInstance():getOpenGLView():getVisibleRect()
    local wall = cc.Node:create()
    wall:setPhysicsBody(cc.PhysicsBody:createEdgeBox(cc.size(VisibleRect.width, VisibleRect.height),
                                                     cc.PhysicsMaterial(0.1, 1.0, 0.0)))
    wall:setPosition(VisibleRect:center());
    self:addChild(wall)
end

function BattleMapPage:ClearMapObj()
	self.rootNode:removeAllChildren()
    self.rootNode:setPosition(cc.p(0,0))

end

--初始化战场数据
function BattleMapPage:initBattleMapImgData(parent)  
    --G_Log_Info("BattleMapPage:initBattleMapImgData()")
    collectgarbage("collect")
    -- avoid memory leak
    collectgarbage("setpause", 100)
    collectgarbage("setstepmul", 5000)
    math.randomseed(os.time())

    g_pGameLayer:showLoadingLayer(true) 

    self.parentBattleMapLayer = parent    --战斗场景总层

    --战斗战场配置数据
    self.battleMapData = g_BattleDataMgr:getBattleMapData() 
    if self.battleMapData == nil then
    	G_Log_Error("MapLayer--battleMapData = nil")
    	return
    end
    --[[
    	battleMapData.id_str = ""    --战斗ID字符串
		battleMapData.name = ""     --战斗名称
		battleMapData.mapId = 0    --战斗战场ID
		battleMapData.rewardsVec = {}   --战斗奖励集合
		battleMapData.yingzhaiVec = {}    --营寨集合
		battleMapData.enemyVec = {}     --敌人部曲集合
    ]]

    local battleMapId = self.battleMapData.mapId
    self.mapConfigData = nil
    self.mapConfigData = g_pMapMgr:LoadMapStreamData(battleMapId)  --地图表配置数据 
    if self.mapConfigData == nil then
    	G_Log_Error("MapLayer--mapConfigData = nil")
    	return
    end
    --G_Log_Dump(self.mapConfigData, "self.mapConfigData = ")
    if not self.rootNode then
    	self.rootNode = cc.Node:create()
    	self:addChild(self.rootNode)
    end

    self:ClearMapObj()

    self.rootNode:setContentSize(cc.size(self.mapConfigData.width, self.mapConfigData.height))
    --self.rootNode:setPosition(cc.p((g_WinSize.width - self.mapConfigData.width)/2, (g_WinSize.height - self.mapConfigData.height)/2))

    local imgCount = self.mapConfigData.img_count
    local imgName = self.mapConfigData.path

    local imgWidth = 512  --self.mapConfigData.width / self.mapConfigData.column
    local imgHeight = 512   --self.mapConfigData.height / self.mapConfigData.row

    local posX = 0
	local posY = self.mapConfigData.height

	for i=1, imgCount do
		local str = string.format("Map/%s/images/%s_%d.jpg", imgName, imgName, i)
		local Spr = cc.Sprite:create(str)
		if Spr == nil then
			G_Log_Error("MapLayer--mapImg = nil, mapName = %s, idx = %d, str = %s", imgName, i, str)
		end
		Spr:setAnchorPoint(cc.p(0, 1))
		Spr:setPosition(cc.p(posX, posY))
		self.rootNode:addChild(Spr, 1)
		--G_Log_Info("idx = %d, posX = %d, posY = %d", i, posX, posY)

		if i%self.mapConfigData.column == 0 then
			posX = 0
			posY = posY - imgHeight
		else
			posX = posX + imgWidth
		end
	end

	--添加城池(0我方营寨,1敌方营寨)
	self.myYingZhaiVec = {}
	self.enemyYingZhaiVec = {}
	for k, yingzhaiId in pairs(self.battleMapData.yingzhaiVec) do   --战斗战场配置数据
		local yingzhaiData = g_pTBLMgr:getBattleYingZhaiTBLDataById(yingzhaiId)
		--[[
		battleYingZhaiConfig.id_str = stream:ReadString()         --营寨ID字符串
		battleYingZhaiConfig.name = stream:ReadString()      --营寨名称
		battleYingZhaiConfig.type = stream:ReadShort()     --营寨类型 1前锋2左军3右军4后卫5中军
		battleYingZhaiConfig.bEnemy = stream:ReadShort()     --0我方营寨，1敌方营寨
		battleYingZhaiConfig.battleMapId = stream:ReadUInt()     --营寨所在地图Id
		battleYingZhaiConfig.map_posX = stream:ReadUInt()   --以左上角为00原点的地图坐标
		battleYingZhaiConfig.map_posY = stream:ReadUInt()    --以左上角为00原点的地图坐标 
		]]
		if yingzhaiData then
		    local yingzhaiNode = NpcNode:create()
		    yingzhaiNode:initYingZhaiData(yingzhaiData)
		    self.rootNode:addChild(yingzhaiNode, 10)

		    local pos = cc.p(yingzhaiData.map_posX, self.mapConfigData.height - yingzhaiData.map_posY)    --以左上角为00原点转为左下角为原点的像素点
		    yingzhaiNode:setPosition(pos)

		    if yingzhaiData.bEnemy == 0 then  --0我方营寨，1敌方营寨
		    	table.insert(self.myYingZhaiVec, {["node"]=yingzhaiNode, ["data"]=yingzhaiData})
		    else
		    	table.insert(self.enemyYingZhaiVec, {["node"]=yingzhaiNode, ["data"]=yingzhaiData})
		    end
		end
	end

	--战斗我方阵型数据
    self.zhenXingData = g_BattleDataMgr:getBattleZhenXingData()  --我方出战阵容数据(1-7个数据，-1标识没有武将出战)
	--dump(self.zhenXingData, "self.zhenXingData = ")
	--[[
		zhenXingData.zhenPos = 0   --1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
		zhenXingData.generalIdStr = "0"    --营寨武将ID字符串
		zhenXingData.unitData = {
			unitData.bingIdStr = "0"   --部曲兵种（游击|轻装|重装|精锐|禁军的弓刀枪骑兵）
			unitData.bingCount = 0    --部曲兵力数量
			unitData.level = 0    --部曲等级
			unitData.exp = 0      --部曲训练度
			unitData.shiqi = 0    --部曲士气
			unitData.zhenId = "0"   --部曲阵法Id
			--附加信息
			unitData.bingData = nil   --兵种数据
			unitData.zhenData = nil   --阵型数据
		}
		--附加信息
		zhenXingData.generalData = nil   --营寨武将数据
	]]

	local function officalSelCallBack(node)
		if self.lastSelOfficalNode and self.lastSelOfficalNode.generalIdStr ~= node.generalIdStr then
			self.lastSelOfficalNode:setBtnIsShow(false)
			self.lastSelOfficalNode = nil
		end
		self.lastSelOfficalNode = node

		if self.parentBattleMapLayer then
			if node.officalType == 1 and node.battleOfficalData.zhenPos ==  5 then   --我方中军主帅
				self.parentBattleMapLayer:ShowBattleMenuBtn(true)     --最终反馈到战斗菜单层,--是否显示全军操作按钮
			else
				self.parentBattleMapLayer:ShowBattleMenuBtn(false) 
			end
		end
	end

	self.myOfficalNodeVec = {}
	for k, battleOfficalData in pairs(self.zhenXingData) do   --我方出战阵容数据(1-7个数据，-1标识没有武将出战)
		if type(battleOfficalData) == "table" then
			local officalNode = BattleOfficalNode:create()
			officalNode:initBattleOfficalData(self.mapConfigData, battleOfficalData, 1, officalSelCallBack)
			self.rootNode:addChild(officalNode, 20)

			local pos = self:getSrcOrDestPosByYingzhai(battleOfficalData.zhenPos, self.myYingZhaiVec)
			officalNode:setNodePos(pos)   --自定义方法

			table.insert(self.myOfficalNodeVec, officalNode)
		end
	end

	--敌方部曲
	local enemyUnitIdVec = self.battleMapData.enemyVec  --战斗战场配置数据，1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
	self.enemyZhenXingData = {-1, -1, -1, -1, -1, -1, -1}
	for k, idStr in pairs(enemyUnitIdVec) do
		local enemyUnitData = g_pTBLMgr:getBattleEnemyConfigById(idStr)
		if enemyUnitData and type(enemyUnitData.zhenUnit) == "table" then
			enemyUnitData.zhenUnit.zhenPos = k   --1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
			self.enemyZhenXingData[k] = enemyUnitData.zhenUnit
		end
	end
	--dump(self.enemyZhenXingData, "self.enemyZhenXingData = ")

	self.enemyOfficalNodeVec = {}
	for k, battleOfficalData in pairs(self.enemyZhenXingData) do   --敌方出战阵容数据(1-7个数据，-1标识没有武将出战)
		if type(battleOfficalData) == "table" then
			local officalNode = BattleOfficalNode:create()
			officalNode:initBattleOfficalData(self.mapConfigData, battleOfficalData, -1, officalSelCallBack)
			self.rootNode:addChild(officalNode, 20)

			local pos = self:getSrcOrDestPosByYingzhai(battleOfficalData.zhenPos, self.enemyYingZhaiVec)
			officalNode:setNodePos(pos)  --自定义方法

			table.insert(self.enemyOfficalNodeVec, officalNode)
		end
	end

	self:setRoleMapPosition(cc.p(g_WinSize.width/2, g_WinSize.height/2))  --视图中心在地图上的位置

	if self.parentBattleMapLayer then
		self.parentBattleMapLayer:initBattleUnitCallBack(self.enemyZhenXingData)     --战斗场景总层,最终反馈到战斗菜单层
	end

	g_pGameLayer:showLoadingLayer(false) 
end

function BattleMapPage:getSrcOrDestPosByYingzhai(zhenPos, yingzhaiVec)
	local pos = nil
	if zhenPos >= 5 and zhenPos <= 7 then
		zhenPos = 5 
	end

	if zhenPos >= 1 and zhenPos <= 5 then
		for k, yingzhai in pairs(yingzhaiVec) do
			--zhenPos  1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
			--yingzhaiData.type 营寨类型 1前锋2左军3右军4后卫5中军
			if zhenPos == yingzhai.data.type then
				pos = cc.p(yingzhai.data.map_posX, self.mapConfigData.height - yingzhai.data.map_posY)    --以左上角为00原点转为左下角为原点的像素点
				break;
			end
		end
	end
	return pos 
end


return BattleMapPage

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
