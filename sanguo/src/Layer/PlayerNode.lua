--PlayerNode用于展示有属性的活动的模型，比如主角，敌怪等
local PlayerNode = class("PlayerNode", CCLayerEx) --填入类名

function PlayerNode:create()   --自定义的create()创建方法
    --G_Log_Info("PlayerNode:create()")
    local layer = PlayerNode.new()
    return layer
end

function PlayerNode:onExit()
    --G_Log_Info("PlayerNode:onExit()")
    self:DelAutoPathUpdateEntry()
end

function PlayerNode:init()  
    --G_Log_Info("PlayerNode:init()")
	self.ImodAni_zd = nil  --站立动画
	self.ImodAni_pb = nil  --跑步的动画
	self.ImodAni_FrameIdx = 0  --ani对应的图片文件的方向序列，每8帧图一个方向序号，从0-7
	self.bAniFlipX = false   --是否反转

    self.AutoPathVec = nil   --自动寻路路径
    self.bAutoMoving = false  --正在自动寻路
    self.bPauseAutoMoving = false  --暂停自动寻路，比如触发战斗，打开界面等
    self.AutoPathEntry = nil  --自动寻路定时器实体
    self.AutoPathOneByOneData = nil  --自动寻路一步步走的步伐数据
    self.curPos = nil  --人物当前位置

    self.MoveSpeed = 160   --人物移动速度，默认180,从人物3属性中读取
    self.curMoveState = g_PlayerState.HMS_NOR   --人物移动的方向状态标识
    self.FaceDirection = g_PlayerState.HMS_DOWN   --人物脸朝向，等于非站立状态
end

function PlayerNode:initPlayerData(playerData) 
	self:showPlayerImodAni(true) 
end

--展示人物形象(是否站立)
function PlayerNode:showPlayerImodAni(bStandUp)  
	local roleStr = "caocao"
	if g_campId == 1 then
		roleStr = "handi"
	elseif g_campId == 2 then
		roleStr = "yuanshao"
	elseif g_campId == 3 then
		roleStr = "caocao"
	elseif g_campId == 4 then
		roleStr = "sunjian"
	elseif g_campId == 5 then
		roleStr = "liubei"
	end

	if bStandUp == true and self.ImodAni_zd == nil then --站立动画
		self.ImodAni_zd = ImodAnim:create()
		self.ImodAni_zd:initAnimWithName("Ani/role/"..roleStr.."_zd.png", "Ani/role/"..roleStr.."_zd.ani", true)   
	    --调用initAnimWithName方法，会连报三个[LUA ERROR] function refid '1' does not reference a Lua function
	    self.ImodAni_zd:PlayActionRepeat(0, 0.1)
	    self.ImodAni_zd:setPosition(cc.p(0,0))
	    self.ImodAni_zd:setScale(0.6)
	    self:addChild(self.ImodAni_zd, 1)
	elseif bStandUp ~= true and self.ImodAni_pb == nil then --跑步的动画
		self.ImodAni_pb = ImodAnim:create()
		self.ImodAni_pb:initAnimWithName("Ani/role/"..roleStr.."_pb.png", "Ani/role/"..roleStr.."_pb.ani", true)   
	    --调用initAnimWithName方法，会连报三个[LUA ERROR] function refid '1' does not reference a Lua function
	    self.ImodAni_pb:PlayActionRepeat(0, 0.1)
	    self.ImodAni_pb:setPosition(cc.p(0,0))
	    self.ImodAni_pb:setScale(0.6)
	    self:addChild(self.ImodAni_pb, 1)
	end
end

function PlayerNode:StopLastAutoPath()   --停止上一个自动寻路
	self:DelAutoPathUpdateEntry()

    self.bAutoMoving = false
    self.bPauseAutoMoving = false
    self.AutoPathVec = nil
end

function PlayerNode:DelAutoPathUpdateEntry()
	if self.AutoPathEntry then
    	g_Scheduler:unscheduleScriptEntry(self.AutoPathEntry)
    	self.AutoPathEntry = nil
    	self.AutoPathOneByOneData = nil  --自动寻路一步步走的步伐数据
    end
end

function PlayerNode:StartAutoPath(autoPath)
	--G_Log_Info("PlayerNode:StartAutoPath()")
	if autoPath and #autoPath >0 then
    	if self.bAutoMoving == true then  --正在自动寻路
    		self.bAutoMoving = false
    		self:DelAutoPathUpdateEntry()
    	end

    	self.AutoPathVec = nil   --自动寻路路径--self.AutoPathVec为像素坐标, 非32*32的块坐标，
    	self.AutoPathVec = autoPath 
		--G_Log_Dump(self.AutoPathVec, "self.AutoPathVec = ")

		self.bAutoMoving = true
		--self.bPauseAutoMoving = false  --暂停自动寻路，比如触发战斗，打开界面等

		self:AutoPathUpdate()
	end
end

function PlayerNode:setPauseAutoPath(bPause)
	if self.bAutoMoving == true and #self.AutoPathVec > 0 then  --正在自动寻路
		self.bPauseAutoMoving =  bPause
		if self.bPauseAutoMoving == true then
			self:DelAutoPathUpdateEntry()
		else
			self:AutoPathUpdate()
		end
	end
end

function PlayerNode:AutoPathUpdate()
	--G_Log_Info("PlayerNode:AutoPathUpdate()")
	if self.bPauseAutoMoving == true then  --暂停自动寻路，比如触发战斗，打开界面等
		return
	end

	local function EndAutoPathUpdate()
		--G_Log_Info("************** PlayerNode:EndAutoPathUpdate()")
		self:DelAutoPathUpdateEntry()
	    self.bAutoMoving = false
		self:ChangeMoveAnimate(self.curMoveState, g_PlayerState.HMS_NOR)   --切换站立或跑步动画

		local jumpData = g_pMapMgr:checkJumpMap(self.curPos)  --像素点
        if jumpData and self.mapLayer then
        	self.mapLayer:changeMapByJumpPoint(jumpData)       	
        end
	end

	if self.bAutoMoving == false or not self.AutoPathVec or #self.AutoPathVec <= 0 then
		EndAutoPathUpdate()
		return
	end

	if #self.AutoPathVec <= 0 then  --最后一个自动寻路的点索引
        --[[移动结束回调]]
	else   --继续寻路
		local dirPos = cc.p(self.AutoPathVec[1].x, self.AutoPathVec[1].y)   --self.AutoPathVec为像素坐标		
		local nowPos = cc.p(self:getPosition())
		local dirIdx = g_pMapMgr:CalcMoveDirection(nowPos, dirPos)
		
        --当不是当前正在执行的动作时（转向的时候，切换动作）
		if(self.curMoveState ~= dirIdx)then
			self:ChangeMoveAnimate(self.curMoveState, dirIdx)   --切换站立或跑步动画
		end
		
        --计算距离进行移动
		local StepLen = g_pMapMgr:CalcDistance(nowPos, dirPos)      --cc.pDistanceSQ(nowPos, dirPos) 
		if StepLen < 32 then  --32为地图块大小
			table.remove(self.AutoPathVec,1)  --删掉astar,取下一个点
		else 
			--走到一半的时候，不删除点P，生成P中间点，到达中间点后再删除P
			local midPos = cc.pMidpoint(nowPos, dirPos)
			--判断这个位置是否可以移动
			local movePt = cc.p(math.floor(midPos.x/32), math.floor(midPos.y/32))
			if g_pAutoPathMgr:AStarCanWalk(movePt.x, movePt.y) == true then
				dirPos = midPos
				StepLen = g_pMapMgr:CalcDistance(nowPos, dirPos)
			else
				local newMid = cc.pMidpoint(nowPos, midPos)
				movePt = cc.p(math.floor(newMid.x/32), math.floor(newMid.y/32))
				if g_pAutoPathMgr:AStarCanWalk(movePt.x, movePt.y) == true then
					dirPos = newMid
					StepLen = g_pMapMgr:CalcDistance(nowPos, dirPos)
				else
					newMid = cc.pMidpoint(midPos, dirPos)
					movePt = cc.p(math.floor(newMid.x/32), math.floor(newMid.y/32))
					if g_pAutoPathMgr:AStarCanWalk(movePt.x, movePt.y) == true then
						dirPos = newMid
						StepLen = g_pMapMgr:CalcDistance(nowPos, dirPos)
					else
						--G_Log_Info("PlayerNode:AutoPathUpdate()--位置不可以移动")
					end
				end		
			end
		end

		self.mapLayer = g_pGameLayer:GetLayerByUId(g_GameLayerTag.LAYER_TAG_CHINAMAP)
		if self.mapLayer then
		    local moveTime = StepLen/self.MoveSpeed	
		    local step = moveTime/0.02
		    local posOffset = cc.p((dirPos.x - nowPos.x)/step, (dirPos.y - nowPos.y)/step )
		    self.AutoPathOneByOneData = {}  --自动寻路一步步走的步伐数据
		    self.AutoPathOneByOneData.step = math.floor(step)
		    self.AutoPathOneByOneData.stepIdx = 1
		    self.AutoPathOneByOneData.posOffset = cc.p((dirPos.x - nowPos.x)/step, (dirPos.y - nowPos.y)/step )
		    self.AutoPathOneByOneData.dirPos = dirPos
		    self.AutoPathOneByOneData.nextPos = cc.p(nowPos.x + posOffset.x, nowPos.y + posOffset.y)

		    local function AutoPathUpdateOneByOne(dt)
		    	self:AutoPathUpdateOneByOne(dt)
		    end
		    self.AutoPathEntry = g_Scheduler:scheduleScriptFunc(AutoPathUpdateOneByOne, 0.01, false) 
		end
	end
end

function PlayerNode:AutoPathUpdateOneByOne(dt)
	if self.mapLayer and self.AutoPathOneByOneData then
		if self.AutoPathOneByOneData.stepIdx >= self.AutoPathOneByOneData.step then
			self.curPos = self.AutoPathOneByOneData.dirPos  --人物当前位置
			self.mapLayer:setRoleMapPosition(self.AutoPathOneByOneData.dirPos)
			self:DelAutoPathUpdateEntry()
			self:AutoPathUpdate()
		else
			self.curPos = self.AutoPathOneByOneData.nextPos  --人物当前位置
			self.mapLayer:setRoleMapPosition(self.AutoPathOneByOneData.nextPos)
			self.AutoPathOneByOneData.stepIdx = self.AutoPathOneByOneData.stepIdx + 1
			local nowPos = self.AutoPathOneByOneData.nextPos
			local posOffset = self.AutoPathOneByOneData.posOffset
			self.AutoPathOneByOneData.nextPos = cc.p(nowPos.x + posOffset.x, nowPos.y + posOffset.y)
		end
	else
		self:DelAutoPathUpdateEntry()
		self:AutoPathUpdate()
	end
end

--切换站立或跑步动画
function PlayerNode:ChangeMoveAnimate(nowState, nextState)
	--G_Log_Info("PlayerNode:ChangeMoveAnimate(), nowState = %d, nextState = %d", nowState, nextState)
	if(nowState == nextState) then
		return
	end

	self.curMoveState = nextState

	local heroImod = self.ImodAni_zd   --站立动画
	local durTime = 0.15

	if nextState == g_PlayerState.HMS_NOR then --站立
		if self.ImodAni_pb then  --跑步的动画
			self.ImodAni_pb:stop()
			self.ImodAni_pb:setVisible(false)
		end
		if self.ImodAni_zd == nil then
			self:showPlayerImodAni(true)
		end
		self.ImodAni_zd:setVisible(true)	
    else  --跑步
    	if self.ImodAni_zd then
    		self.ImodAni_zd:stop()
    		self.ImodAni_zd:setVisible(false)
    	end
    	if self.ImodAni_pb == nil then
			self:showPlayerImodAni(false)
		end
		self.ImodAni_pb:setVisible(true)	

		heroImod = self.ImodAni_pb     --跑步的动画
		durTime = 0.07
	end

	local faceDir = nextState  --人物脸朝向，等于非站立状态
	if nextState ~= g_PlayerState.HMS_NOR then  --站立
		self.FaceDirection = nextState
	else
		faceDir = self.FaceDirection
	end

	self.bAniFlipX = false   --是否反转
	self:UpdateFace(faceDir)

	heroImod:setFlippedX(self.bAniFlipX)  --是否反转
	heroImod:PlayActionRepeat(self.ImodAni_FrameIdx, durTime, true)   --ani对应的图片文件的方向序列，每8帧图一个方向序号，从0-7
end

--控制4方向还是8方向
function PlayerNode:UpdateFace(face)
	--G_Log_Info("PlayerNode:UpdateFace(), face = %d", face)
	if face == g_PlayerState.HMS_RIGHT or face == g_PlayerState.HMS_RDOWN then	
		self.ImodAni_FrameIdx = 0  --ani对应的图片文件的方向序列，每8帧图一个方向序号，从0-7
		self.bAniFlipX = false   --是否反转
	elseif face == g_PlayerState.HMS_DOWN or face == g_PlayerState.HMS_LDOWN then 
		self.ImodAni_FrameIdx = 0
		self.bAniFlipX = true
	elseif face == g_PlayerState.HMS_LEFT or face == g_PlayerState.HMS_LUP then 
		self.ImodAni_FrameIdx = 1
		self.bAniFlipX = true
	elseif face == g_PlayerState.HMS_UP or face == g_PlayerState.HMS_RUP then 
		self.ImodAni_FrameIdx = 1
		self.bAniFlipX = false
	end	
end

--更新透明度
function PlayerNode:UpdateOpacity(heroPos)
	local isOpacity = g_pMapMgr:IsOpacity(heroPos)
	local opacityVal = 255
	
	if isOpacity then
		opacityVal = 155
	else
		opacityVal = 255
	end

	--更新人物和坐骑透明度
	if self.ImodAni_zd then
		self.ImodAni_zd:setOpacity(opacityVal)	
	end
	if self.ImodAni_pb then
		self.ImodAni_pb:setOpacity(opacityVal)	
	end
end


return PlayerNode