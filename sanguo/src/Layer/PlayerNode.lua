--PlayerNode用于展示有属性的活动的模型，比如主角，敌怪等
local PlayerNode = class("PlayerNode", CCLayerEx) --填入类名

function PlayerNode:create()   --自定义的create()创建方法
    --G_Log_Info("PlayerNode:create()")
    local layer = PlayerNode.new()
    return layer
end

function PlayerNode:onExit()
    --G_Log_Info("PlayerNode:onExit()")
    if self.AutoPathEntry then
    	g_Scheduler:unscheduleScriptEntry(self.AutoPathEntry)
    	self.AutoPathEntry = nil
    end
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

    --self.MoveDirectionPt = cc.p(0,0)   --移动方向，8个向量方向
    self.MoveSpeed = 100   --人物移动速度，默认180,从人物3属性中读取

    self.FollowPathVec = {}  --跟随路径点
    self.FollowPathCount = 20   --最多的跟随点数量

    self.curMoveState = g_PlayerState.HMS_NOR   --人物移动的方向状态标识
    --self.lastMoveState = g_PlayerState.HMS_NOR   --人物移动的方向状态标识
    self.FaceDirection = g_PlayerState.HMS_DOWN   --人物脸朝向，等于非站立状态
end

function PlayerNode:initPlayerData(playerData) 
	self:showPlayerImodAni(true) 
end

--展示人物形象(是否站立)
function PlayerNode:showPlayerImodAni(bStandUp)  
	if bStandUp == true and self.ImodAni_zd == nil then --站立动画
		self.ImodAni_zd = ImodAnim:create()
		self.ImodAni_zd:initAnimWithName("Monster/btm5_zd.png", "Monster/btm5_zd.ani", true)   
	    --调用initAnimWithName方法，会连报三个[LUA ERROR] function refid '1' does not reference a Lua function
	    self.ImodAni_zd:PlayActionRepeat(0, 0.1)
	    self.ImodAni_zd:setPosition(cc.p(0,0))
	    self:addChild(self.ImodAni_zd, 1)
	elseif bStandUp ~= true and self.ImodAni_pb == nil then --跑步的动画
		self.ImodAni_pb = ImodAnim:create()
		self.ImodAni_pb:initAnimWithName("Monster/btm5_pb.png", "Monster/btm5_pb.ani", true)   
	    --调用initAnimWithName方法，会连报三个[LUA ERROR] function refid '1' does not reference a Lua function
	    self.ImodAni_pb:PlayActionRepeat(0, 0.1)
	    self.ImodAni_pb:setPosition(cc.p(0,0))
	    self:addChild(self.ImodAni_pb, 1)
	end
end

function PlayerNode:StartAutoPath(autoPath)
	--G_Log_Info("PlayerNode:StartAutoPath()")
	if autoPath and #autoPath >0 then
    	if self.bAutoMoving == true then  --正在自动寻路
    		self.bAutoMoving = false
    		if self.AutoPathEntry then
		    	g_Scheduler:unscheduleScriptEntry(self.AutoPathEntry)
		    	self.AutoPathEntry = nil
		    end
    	end

    	self.AutoPathVec = {}   --自动寻路路径
    	local mapHeight = g_pMapMgr:getMapConfigHeight() 
		for k,v in pairs(autoPath) do  --SPoint转ccp, autoPath为32*32的块坐标，self.AutoPathVec为像素坐标
			table.insert(self.AutoPathVec, cc.p(v:getX(), mapHeight - v:getY()))
		end
		--G_Log_Dump(self.AutoPathVec, "self.AutoPathVec = ")

		self.bAutoMoving = true
		--self.bPauseAutoMoving = false  --暂停自动寻路，比如触发战斗，打开界面等

		--self.AutoPathEntry = g_Scheduler:scheduleScriptFunc(AutoPathUpdate, 0.02, false) 
		self:AutoPathUpdate()
	end
end

function PlayerNode:setPauseAutoPath(bPause)
	if self.bAutoMoving == true and #self.AutoPathVec > 0 then  --正在自动寻路
		self.bPauseAutoMoving =  bPause
		if self.bPauseAutoMoving == true then
			if self.AutoPathEntry then
		    	g_Scheduler:unscheduleScriptEntry(self.AutoPathEntry)
		    	self.AutoPathEntry = nil
		    end
		else
			--self.AutoPathEntry = g_Scheduler:scheduleScriptFunc(AutoPathUpdate, 0.02, false) 
			self:AutoPathUpdate()
		end
	end
end

--添加跟随点（宠物跟随时用到）
function PlayerNode:AddFollowPathPos(pos)
	--保存跟随点
	table.insert(self.FollowPathVec, pos)  --跟随路径点
	if(#self.FollowPathVec > self.FollowPathCount) then  --最多的跟随点数量
		table.remove(self.FollowPathVec,1)
	end
end

function PlayerNode:AutoPathUpdate(dt)
	--G_Log_Info("PlayerNode:AutoPathUpdate()")
	if self.bPauseAutoMoving == true then  --暂停自动寻路，比如触发战斗，打开界面等
		return
	end

	local function EndAutoPathUpdate()
		--G_Log_Info("************** PlayerNode:EndAutoPathUpdate()")
		if self.AutoPathEntry then
	    	g_Scheduler:unscheduleScriptEntry(self.AutoPathEntry)
	    	self.AutoPathEntry = nil
	    end
	    self.bAutoMoving = false
		self:ChangeMoveAnimate(self.curMoveState, g_PlayerState.HMS_NOR)   --切换站立或跑步动画
	end

	if self.bAutoMoving == false or not self.AutoPathVec or #self.AutoPathVec <= 0 then
		EndAutoPathUpdate()
	end

	if #self.AutoPathVec <= 0 then  --最后一个自动寻路的点索引
        --[[移动结束回调]]
        G_Log_Info("PlayerNode:AutoPathUpdate()--移动结束回调")
	else   --继续寻路
		local dirPos = cc.p(self.AutoPathVec[1].x, self.AutoPathVec[1].y)   --self.AutoPathVec为像素坐标		
		--判断这个位置是否可以移动
		-- local movePt = cc.p(math.floor(dirPos.x/32), math.floor(dirPos.y/32))
		-- if g_pAutoPathMgr:AStarCanWalk(movePt.x, movePt.y) ~= true then
		-- 	G_Log_Info("PlayerNode:AutoPathUpdate()--位置不可以移动")
		-- 	EndAutoPathUpdate()
		-- 	return
		-- end

		local nowPos = cc.p(self:getPosition())
		local dirPt, dirIdx = g_pMapMgr:CalcMoveDirection(nowPos, dirPos)
		
		-- --判断是否改变移动状态
  --       if(dirIdx == g_PlayerState.HMS_NOR) then   --表示站立
  --       	EndAutoPathUpdate()
  --           return
		-- end
        --当不是当前正在执行的动作时（转向的时候，切换动作）
		if(self.curMoveState ~= dirIdx - 1)then
			self:ChangeMoveAnimate(self.curMoveState, dirIdx-1)   --切换站立或跑步动画
			--self.MoveDirectionPt = dirPt
		end
		
        --计算距离进行移动
		local StepLen = g_pMapMgr:CalcDistance(nowPos, dirPos)      --cc.pDistanceSQ(nowPos, dirPos) 
		if StepLen < 32 then  --距离小于32, 地图块大小
			table.remove(self.AutoPathVec,1)  --删掉astar,取下一个点
		else 
			--走到一半的时候，不删除点P，生成P中间点，到达中间点后再删除P
			--dirPos = cc.pMidpoint(nowPos, dirPos)
			--StepLen = g_pMapMgr:CalcDistance(nowPos, dirPos)
		end

		--保存跟随点
		self:AddFollowPathPos(movePos)

		--重新定位人物坐标，并向服务器发送最新位置信息（服务器为地图坐标，即左上角为原点）
		--MsgDealMgr:QueryHeroMove(MSG_CLIENT_UPDATE_POS,math.floor(movePos.x),math.floor(gameMap:GetMapSize().height - movePos.y));
		local mapLayer = g_pGameLayer:GetLayerByUId(g_GameLayerTag.LAYER_TAG_CHINAMAP)
		if mapLayer then
			--移动完成后延时继续执行下一步操作
			local function MoveEndCallBack()
				self:AutoPathUpdate()
			end

			local moveTime = StepLen/self.MoveSpeed			
			local moveTo = cc.MoveTo:create(moveTime, dirPos)
			self:runAction(cc.Sequence:create(moveTo, cc.CallFunc:create(function() 
				MoveEndCallBack()
		    end)))

		    mapLayer:resetRootNodePos(dirPos, moveTime)
		end
	end
end

--切换站立或跑步动画
function PlayerNode:ChangeMoveAnimate(nowState, nextState)
	--G_Log_Info("PlayerNode:ChangeMoveAnimate(), nowState = %d, nextState = %d", nowState, nextState)
	if(nowState == nextState) then
		return
	end

	--self.lastMoveState = nowState
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

	heroImod:setFlippedX(self.bAniFlipX)  --是否反转
	heroImod:PlayActionRepeat(self.ImodAni_FrameIdx, durTime, true)   --ani对应的图片文件的方向序列，每8帧图一个方向序号，从0-7

	local faceDir = nextState  --人物脸朝向，等于非站立状态
	if nextState ~= g_PlayerState.HMS_NOR then
		self.FaceDirection = nextState
	else
		faceDir = self.FaceDirection
	end
	self:UpdateFace(faceDir)
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


return PlayerNode