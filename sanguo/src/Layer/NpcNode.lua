
--NpcNode用于构造静态展示模型，比如城池展示模型、跳转点、战场营寨等
local NpcNode = class("NpcNode", CCLayerEx) --填入类名

function NpcNode:create()   --自定义的create()创建方法
    --G_Log_Info("NpcNode:create()")
    local layer = NpcNode.new()
    return layer
end

function NpcNode:onExit()
    --G_Log_Info("NpcNode:onExit()")
    self:HandleMyselfDied()  --处理自身节点消亡（通知我方被攻击的敌方部曲列表中节点）

    self:DelAtkLimitUpdateEntry()   --战场营寨自动探测敌军计时器
    self:DelFightingCdUpdateEntry()  --部曲的物理攻击速率计时器更新
end

function NpcNode:init()  
    --G_Log_Info("NpcNode:init()")
end

--城池NPC
function NpcNode:initChengData(data)  
    --G_Log_Info("NpcNode:initChengData()")
    local imgStr = "public2_chengchi.png"
    if data.type == 1 then
    	imgStr = "public2_dushi.png"
    elseif data.type == 2 then
    	imgStr = "public2_chengchi.png"
    elseif data.type == 3 then
    	imgStr = "public2_guanai.png"
    end
	self.chengImage = cc.Sprite:createWithSpriteFrameName(imgStr) 
	self.chengImage:setScale(0.8)
	self:addChild(self.chengImage)  
	local imgSize = self.chengImage:getContentSize()
	self:setContentSize(imgSize)

	local textSize = cc.size(imgSize.width*2, g_defaultChengFontSize + 6)
    self.chengName = cc.Label:createWithTTF(data.name, g_sDefaultTTFpath, g_defaultChengFontSize, textSize, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
    self.chengName:setColor(g_ColorDef.Yellow)
    self.chengName:enableBold()   --加粗
    --self.chengName:enableShadow()   --阴影
    self.chengName:enableOutline(g_ColorDef.DarkRed, 1)   --描边
    self:addChild(self.chengName, 5)  
end

--跳转点NPC
function NpcNode:initMapJumpPtData(data)  
	--G_Log_Info("NpcNode:initMapJumpPtData()")
	self.Imod = ImodAnim:create()
	self.Imod:initAnimWithName("Ani/effect/chuansong.png", "Ani/effect/chuansong.ani")
	self.Imod:setScale(0.8)
	self.Imod:PlayActionRepeat(0)
	self:addChild(self.Imod)

	local modSize = self.Imod:getContentSize()
	self:setContentSize(modSize)

	local textSize = cc.size(modSize.width*2, g_defaultJumpPtFontSize + 6)
    self.jumpPtName = cc.Label:createWithTTF(data.desc, g_sDefaultTTFpath, g_defaultJumpPtFontSize, textSize, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
    self.jumpPtName:setColor(g_ColorDef.Yellow)
    self:addChild(self.jumpPtName, 5)  
end

------------------------------战场营寨----------------------------------------------------
function NpcNode:initYingZhaiData(data, parent)  
    --G_Log_Info("NpcNode:initYingZhaiData()")
    if data == nil then
        return 
    end

    self.yingzhaiData = data
    self.parentMapPage = parent   --节点所在的战场地图层
    self.nodeType = g_BattleObject.YingZhai  --战场对象类型，0无，1营寨，2敌军

    local quanStr = "public2_quanPurple.png"   --敌方紫色圈
    local qizhiStr = "public2_QiZhi2.png"
    if data.bEnemy == 0 then  --我方篮圈
        quanStr = "public2_quanBlue.png"
        qizhiStr = "public2_QiZhi1.png"
    end

    self.quanImage = cc.Sprite:createWithSpriteFrameName(quanStr)   
    self.maxScale = g_AtkLimitLen.yingzhaiLen/self.quanImage:getContentSize().width   --500像素内可见
    self.minScale = self.maxScale*0.9
    self.quanImage:setScale(self.maxScale) 
    self:addChild(self.quanImage) 

    --闪动放缩
    local SequenceAction = cc.Sequence:create(cc.ScaleTo:create(2.0, self.minScale), cc.ScaleTo:create(2.0, self.maxScale))    --scaleAction:reverse()
    self.quanImage:runAction(cc.RepeatForever:create(SequenceAction))

    local imgStr = "public2_yingzhai2.png"  
    if data.type >= 1 and data.type <= 3 then  --1前锋2左军3右军4后卫5中军
        imgStr = "public2_yingzhai2.png"
    elseif data.type == 4 then
        imgStr = "public2_yingzhai3.png"
    elseif data.type == 5 then 
        imgStr = "public2_yingzhai1.png"  --中军
    end

    self.yingzhaiImage = cc.Sprite:createWithSpriteFrameName(imgStr) 
    --self.yingzhaiImage:setScale(0.8)
    self:addChild(self.yingzhaiImage)  
    local imgSize = self.yingzhaiImage:getContentSize()
    self:setContentSize(imgSize)

    local textSize = cc.size(imgSize.width*2, g_defaultChengFontSize + 6)
    self.yingzhaiName = cc.Label:createWithTTF(data.name, g_sDefaultTTFpath, g_defaultChengFontSize, textSize, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
    if data.bEnemy == 0 then  --我方
        self.yingzhaiName:setColor(g_ColorDef.Blue)
    else
        self.yingzhaiName:setColor(g_ColorDef.Red)
    end
    self.yingzhaiName:setPosition(cc.p(imgSize.width/2, -10))
    self.yingzhaiName:enableBold()   --加粗
    self.yingzhaiName:enableShadow()   --阴影
    --self.yingzhaiName:enableOutline(g_ColorDef.White, 1)   --描边
    self.yingzhaiImage:addChild(self.yingzhaiName, 5)  

    self.qizhiImage = cc.Sprite:createWithSpriteFrameName(qizhiStr) 
    self.qizhiImage:setPosition(cc.p(imgSize.width/2 + self.qizhiImage:getContentSize().width/2, imgSize.height + 10))
    self.yingzhaiImage:addChild(self.qizhiImage) 

    ----------------------
    self.enemyNode = nil   --我方攻击或监视的敌方部曲
    self.UnderAttackVec = {}   --我方被攻击的敌方部曲列表
    self.bEnemyFighting = false  --正在攻击敌军部曲

    self.fightingCDStep = 0  ----兵种和营寨的物理攻击速率计时器步数（秒数）
    self.fightingCD = g_FightingCD.YingCD
end

function NpcNode:getNodePos()
    return cc.p(self:getPosition())
end

--战场营寨自动探测敌军计时器
function NpcNode:DelAtkLimitUpdateEntry()
    if self.atkLimitEntry then
        g_Scheduler:unscheduleScriptEntry(self.atkLimitEntry)
        self.atkLimitEntry = nil
    end
end

--战场营寨自动探测敌军计时器(战场地图初始化营寨和部曲之后，在战场层调用)
function NpcNode:initAtkLimitUpdateEntry()
    self:DelAtkLimitUpdateEntry()

    local function atkLimitUpdate(dt)
        self:atkLimitUpdate(dt)
    end
    self.atkLimitEntry = g_Scheduler:scheduleScriptFunc(atkLimitUpdate, 0.1, false) 
end

function NpcNode:atkLimitUpdate(dt)
    if self.parentMapPage then   --节点所在的战场地图层
        local bCatchEnemy = false
        local curPos = self:getNodePos()

        if self.enemyNode then    --攻击对象节点   
            self.enemyNode:setUnderAttackCallBack(self, false)   --向敌方单位注册攻击他的对象(是否添加)

            local enemyPos = self.enemyNode:getNodePos()
            local len = g_pMapMgr:CalcDistance(curPos, enemyPos)  
            if len <= g_FightingLen.YingLen then
                bCatchEnemy = true
            else
                self.bEnemyFighting = false  --正在攻击敌军部曲战斗
                self:DelFightingCdUpdateEntry()              
            end
        end
        if bCatchEnemy == false then
            local enemyNode = self.parentMapPage:checkEnemyUnit(self)
            local enemyPos = enemyNode:getNodePos()
            local len = g_pMapMgr:CalcDistance(curPos, enemyPos) 
            if len <= g_FightingLen.YingLen then   --兵种和营寨战斗攻击范围
                self.enemyNode = enemyNode  
                if self.bEnemyFighting ~= false then
                    self.bEnemyFighting = true  --正在攻击敌军部曲战斗
                    self:initFightingCdUpdateEntry()

                    self.enemyNode:setUnderAttackCallBack(self, true)   --向敌方单位注册攻击他的对象
                end
            else
                self.bEnemyFighting = false 
                self:DelFightingCdUpdateEntry()
            end
        end
    end
end

--我方攻击对象死亡消失时的回调处理
function NpcNode:handleEnemyNodeDied()
    self.enemyNode = nil   --我方攻击或监视的敌方部曲
    --self.UnderAttackVec = {}   --我方被攻击的敌方部曲列表
    self.bEnemyFighting = false  --正在攻击敌军部曲

    self:DelFightingCdUpdateEntry()  --部曲的物理攻击速率计时器更新
end

--处理自身节点消亡（通知我方被攻击的敌方部曲列表中节点）
function NpcNode:HandleMyselfDied()
    if self.parentMapPage then   --节点所在的战场地图层
        self.parentMapPage:handleNodeDied(self)  --战场地图中部曲或营寨消亡的处理
    end

    if self.UnderAttackVec then
        for k, node in pairs(self.UnderAttackVec) do    --我方被攻击的敌方部曲列表
            node:handleEnemyNodeDied()
        end
    end
end

--设置我方被攻击的敌军单位及绑定我死亡时给对方的回调
function NpcNode:setUnderAttackCallBack(atkNode, bAdd)
    local bFind = false
    for k, node in pairs(self.UnderAttackVec) do    --我方被攻击的敌方部曲列表
        if node.nodeType == atkNode.nodeType then   --战场对象类型，0无，1营寨，2敌军
            if atkNode.nodeType == g_BattleObject.EnemyUnit then
                if atkNode.battleOfficalData.generalIdStr == node.battleOfficalData.generalIdStr then   --战斗一方武将具有唯一性
                    if bAdd == true then
                        bFind = true 
                        break;
                    else
                        table.remove(self.UnderAttackVec, k)
                        return
                    end
                end
            end
        end
    end

    if bFind == false and bAdd == true then
        table.insert(self.UnderAttackVec, atkNode)
    end
end

--部曲的物理攻击速率计时器更新
function NpcNode:initFightingCdUpdateEntry()
    self:DelFightingCdUpdateEntry()

    local function fightingCdUpdate(dt)
        self:fightingCdUpdate(dt) 
    end
    if self.bEnemyFighting == true then
        self.fightingCdUpdateEntry = g_Scheduler:scheduleScriptFunc(fightingCdUpdate, 0.1, false) 
    end
end

--部曲的物理攻击速率计时器更新
function NpcNode:DelFightingCdUpdateEntry()
    if self.fightingCdUpdateEntry then
        g_Scheduler:unscheduleScriptEntry(self.fightingCdUpdateEntry)
        self.fightingCdUpdateEntry = nil
    end
end

--部曲的物理攻击速率计时器更新
function BattleOfficalNode:fightingCdUpdate(dt)
    if self.bEnemyFighting == true then
        self.fightingCDStep = self.fightingCDStep + 0.1  ----兵种和营寨的物理攻击速率计时器步数（秒数）
        if self.fightingCDStep >= self.fightingCD then  --攻击敌军
            
            self.fightingCDStep = 0
        end
    end
end

------------------------------战场营寨----------------------------------------------------


return NpcNode
