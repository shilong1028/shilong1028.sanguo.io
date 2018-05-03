
--NpcNode用于构造静态展示模型，比如城池展示模型、跳转点、战场营寨等
local NpcNode = class("NpcNode", CCLayerEx) --填入类名

function NpcNode:create()   --自定义的create()创建方法
    --G_Log_Info("NpcNode:create()")
    local layer = NpcNode.new()
    return layer
end

function NpcNode:onExit()
    --G_Log_Info("NpcNode:onExit()")
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
    --[[
        yingzhaiData.id_str = ""        --营寨ID字符串
        yingzhaiData.name = ""     --营寨名称
        yingzhaiData.type = 0     --营寨类型 1前锋2左军3右军4后卫5中军
        yingzhaiData.bEnemy = 0     --0我方营寨，1敌方营寨
        yingzhaiData.imgStr = ""   --营寨资源路径名称
        yingzhaiData.atk = 0   --营寨攻击力
        yingzhaiData.hp = 0   --营寨生命防御值
        yingzhaiData.battleMapId = 0     --营寨所在地图Id
        yingzhaiData.map_posX = 0   --以左上角为00原点的地图坐标
        yingzhaiData.map_posY = 0    --以左上角为00原点的地图坐标   
    ]]
    self.parentMapPage = parent   --节点所在的战场地图层
    self.nodeType = g_BattleObject.YingZhai  --战场对象类型，0无，1营寨，2敌军

    local quanStr = "public2_quanPurple.png"   --敌方紫色圈
    local qizhiStr = "public2_QiZhi2.png"
    if data.bEnemy == 0 then  --我方篮圈
        quanStr = "public2_quanBlue.png"
        qizhiStr = "public2_QiZhi1.png"
    end

    self.quanImage = cc.Sprite:createWithSpriteFrameName(quanStr)   
    self.maxScale = g_AtkLimitLen.yingzhaiLen/(self.quanImage:getContentSize().width/2)   --300像素内可见
    self.minScale = self.maxScale*0.9
    self.quanImage:setScale(self.maxScale) 
    self:addChild(self.quanImage) 

    --闪动放缩
    local SequenceAction = cc.Sequence:create(cc.ScaleTo:create(2.0, self.minScale), cc.ScaleTo:create(2.0, self.maxScale))    --scaleAction:reverse()
    self.quanImage:runAction(cc.RepeatForever:create(SequenceAction))

    local imgStr = self.yingzhaiData.imgStr    --"public2_yingzhai2.png"  
    -- if data.type >= 1 and data.type <= 3 then  --1前锋2左军3右军4后卫5中军
    --     imgStr = "public2_yingzhai2.png"
    -- elseif data.type == 4 then
    --     imgStr = "public2_yingzhai3.png"
    -- elseif data.type == 5 then 
    --     imgStr = "public2_yingzhai1.png"  --中军
    -- end

    self.yingzhaiImage = cc.Sprite:createWithSpriteFrameName(imgStr..".png") 
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

    --生命条
    self.LoadingBarBg_hp = ccui.Scale9Sprite:createWithSpriteFrameName("public_bar1.png")
    self.LoadingBarBg_hp:setInsetLeft(10)
    self.LoadingBarBg_hp:setInsetTop(2)
    self.LoadingBarBg_hp:setInsetRight(10)
    self.LoadingBarBg_hp:setInsetBottom(2)
    self.LoadingBarBg_hp:setContentSize(cc.size(100, 5)) 
    self.LoadingBarBg_hp:setAnchorPoint(cc.p(0.5, 0.5))
    self.LoadingBarBg_hp:setPosition(cc.p(imgSize.width/2, 20))
    self.yingzhaiImage:addChild(self.LoadingBarBg_hp, 10) 

    self.LoadingBar_hp = ccui.LoadingBar:create("public_bar5.png",ccui.TextureResType.plistType, 100)
    self.LoadingBar_hp:setDirection(ccui.LoadingBarDirection.LEFT)
    self.LoadingBar_hp:setScale9Enabled(true)
    self.LoadingBar_hp:setContentSize(cc.size(100, 5)) 
    self.LoadingBar_hp:setAnchorPoint(cc.p(0, 0))
    self.LoadingBar_hp:setPosition(cc.p(0, 0))
    self.LoadingBarBg_hp:addChild(self.LoadingBar_hp)

    self.max_hp = self.yingzhaiData.hp
    local hpStr = self.max_hp.."/"..self.max_hp
    local hptextSize = cc.size(120, g_defaultFontSize + 5)
    self.Text_hp = cc.Label:createWithTTF(hpStr, g_sDefaultTTFpath, g_defaultFontSize, hptextSize, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
    self.Text_hp:setColor(g_ColorDef.White)
    self.Text_hp:setAnchorPoint(cc.p(0.5, 0.5))
    self.Text_hp:setPosition(cc.p(imgSize.width/2, 20))
    self.yingzhaiImage:addChild(self.Text_hp, 20) 

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
    if self.enemyNode and self.bEnemyFighting == true then
        return
    end

    if self.parentMapPage then   --节点所在的战场地图层
        local bCatchEnemy = false
        local curPos = self:getNodePos()

        if self.enemyNode then    --攻击对象节点   
            local enemyPos = self.enemyNode:getNodePos()
            local len = g_pMapMgr:CalcDistance(curPos, enemyPos)  
            if len <= g_FightingLen.YingLen then
                bCatchEnemy = true
                if self.bEnemyFighting ~= true then
                    self.bEnemyFighting = true  --正在攻击敌军部曲战斗
                    self:initFightingCdUpdateEntry()

                    self.enemyNode:setUnderAttackCallBack(self, true)   --向敌方单位注册攻击他的对象
                end
            else
                --上一个被监视的攻击对象已经脱离我方攻击范围了
                self.enemyNode:setUnderAttackCallBack(self, false)   --向敌方单位注册攻击他的对象(是否添加)     
            end
        end

        if bCatchEnemy == false then
            local enemyNode = self.parentMapPage:checkEnemyUnit(self)
            if enemyNode then
                self.enemyNode = enemyNode 

                local enemyPos = enemyNode:getNodePos()
                local len = g_pMapMgr:CalcDistance(curPos, enemyPos) 
                if len <= g_FightingLen.YingLen then   --兵种和营寨战斗攻击范围
                    if self.bEnemyFighting ~= true then
                        self.bEnemyFighting = true  --正在攻击敌军部曲战斗
                        self:initFightingCdUpdateEntry()

                        self.enemyNode:setUnderAttackCallBack(self, true)   --向敌方单位注册攻击他的对象
                    end
                elseif self.bEnemyFighting == true then
                    self.bEnemyFighting = false 
                    self:DelFightingCdUpdateEntry()
                end
            elseif self.enemyNode then
                self:handleEnemyNodeDied()  --我方攻击对象死亡消失时的回调处理
            end
        end
    end
end

--我方攻击对象死亡消失时的回调处理
function NpcNode:handleEnemyNodeDied()
    --G_Log_Info("NpcNode:handleEnemyNodeDied()")
    self.enemyNode = nil   --我方攻击或监视的敌方部曲
    --self.UnderAttackVec = {}   --我方被攻击的敌方部曲列表
    self.bEnemyFighting = false  --正在攻击敌军部曲

    self:DelFightingCdUpdateEntry()  --部曲的物理攻击速率计时器更新
end

--处理自身节点消亡（通知我方被攻击的敌方部曲列表中节点）
function NpcNode:HandleMyselfDied()
    self.bMyselfDied = true 

    if self.parentMapPage then   --节点所在的战场地图层
        self.parentMapPage:handleNodeDied(self)  --战场地图中部曲或营寨消亡的处理
    end

    if self.enemyNode then
        self.enemyNode:setUnderAttackCallBack(self, false)   --向敌方单位注册攻击他的对象(是否添加) 
    end 

    if self.UnderAttackVec then
        for k, node in pairs(self.UnderAttackVec) do    --我方被攻击的敌方部曲列表
            node:handleEnemyNodeDied()
        end
    end

    self:removeFromParent(true)
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

--是否显示人物头像上方攻击动画
function NpcNode:showFightAni(bShow)
    if bShow == true then
        if self.fightAni == nil then
            self.fightAni = ImodAnim:create()
            self.fightAni:initAnimWithName("Ani/effect/fighting.png", "Ani/effect/fighting.ani")
            self.fightAni:PlayActionRepeat(0)
            self.fightAni:setPosition(cc.p(self.yingzhaiImage:getPositionX(), self.yingzhaiImage:getPositionY() + 100))
            self:addChild(self.fightAni, 10)
        end
        self.fightAni:setVisible(true)
    else
        if self.fightAni then
            self.fightAni:setVisible(false)
        end
    end
end

--部曲的物理攻击速率计时器更新
function NpcNode:initFightingCdUpdateEntry()
    self:DelFightingCdUpdateEntry()
    --G_Log_Info("NpcNode:initFightingCdUpdateEntry()")

    self:showFightAni(true)  --是否显示人物头像上方攻击动画

    local function fightingCdUpdate(dt)
        self:fightingCdUpdate(dt) 
    end
    if self.enemyNode and self.bEnemyFighting == true then
        self.fightingCdUpdateEntry = g_Scheduler:scheduleScriptFunc(fightingCdUpdate, 0.1, false) 
    end
end

--部曲的物理攻击速率计时器更新
function NpcNode:DelFightingCdUpdateEntry()
    --G_Log_Info("NpcNode:DelFightingCdUpdateEntry()")
    self:showFightAni(false)  --是否显示人物头像上方攻击动画

    if self.fightingCdUpdateEntry then
        g_Scheduler:unscheduleScriptEntry(self.fightingCdUpdateEntry)
    end
    self.fightingCdUpdateEntry = nil
    self.fightingCDStep = 0
end

--部曲的物理攻击速率计时器更新
function NpcNode:fightingCdUpdate(dt)
    if self.enemyNode and self.bEnemyFighting == true then
        self.fightingCDStep = self.fightingCDStep + 0.1  ----兵种和营寨的物理攻击速率计时器步数（秒数）
        if self.fightingCDStep >= self.fightingCD then  --攻击敌军
            self:handleAttackEnemy()
            self.fightingCDStep = 0
        end
    end
end

--处理攻击敌方逻辑
function NpcNode:handleAttackEnemy()
    if self.enemyNode and self.bEnemyFighting == true  then  --正在攻击敌军部曲或营寨
        --播放射箭等攻击动作
        local arrowStr = "public2_jian_red.png"  --我方红箭（箭头水平朝右）
        if self.yingzhaiData.bEnemy == 1 then     --0我方营寨，1敌方营寨
            arrowStr = "public2_jian_black.png"  --敌方黑箭
        end

        for i=1, 8 do
            local arrow = cc.Sprite:createWithSpriteFrameName(arrowStr) 
            arrow:setScale(0.25)
            local curPos = self:getNodePos()
            local enemyPos = self.enemyNode:getNodePos()
            arrow:setPosition(curPos)
            self:getParent():addChild(arrow, 9999)

            --箭射的贝塞尔曲线运动
            local offsetX = enemyPos.x - curPos.x
            local offsetY = math.abs(offsetX)
            local maxY = math.max(curPos.y, enemyPos.y)

            local bezier = {
                cc.p(curPos.x + (0.25 + (i-4)*0.01)*offsetX, maxY + (0.5 + (i-4)*0.02)*offsetY),    --controlPoint_1
                cc.p(curPos.x + (0.65 + (i-4)*0.01)*offsetX, maxY + (0.3 + (i-4)*0.01)*offsetY),    --controlPoint_2
                cc.p(enemyPos.x, enemyPos.y),    --endPosition
            }
            arrow:runAction(cc.Sequence:create(cc.BezierTo:create(1.0, bezier), cc.CallFunc:create(function() 
            end)))  

            --贝塞尔曲线运动的同时，箭头方向变化动作（箭头默认水平朝右，cocos顺时针旋转为正反向）
            --cc.pGetAngle(self,other) 获得2个点与原点之间的夹角
            local angle0 = math.deg(cc.pToAngleSelf(cc.p(bezier[1].x - curPos.x, bezier[1].y - curPos.y)))*-1
            arrow:setRotation(angle0)
            local angle1 = offsetX >= 0 and 0 or 180
            local angle2 = math.deg(cc.pToAngleSelf(cc.p(bezier[2].x - bezier[1].x, bezier[2].y - bezier[1].y)))*-1
            local angle3 = math.deg(cc.pToAngleSelf(cc.p(enemyPos.x - bezier[2].x, enemyPos.y - bezier[2].y)))*-1
            arrow:runAction(cc.Sequence:create(cc.RotateTo:create(0.3, angle1), cc.RotateTo:create(0.35, angle2), cc.RotateTo:create(0.35, angle3), cc.CallFunc:create(function() 
                arrow:removeFromParent(true)
            end))) 
        end

         --计算敌方损伤
        local realAtk = self.yingzhaiData.atk   --营寨的攻击为直接攻击，不用考虑被攻击部曲的防御能力
        if realAtk > 0 then
            self.enemyNode:handleUnderAttackEffect(realAtk)
        end
    end
end

--处理我方被攻击的逻辑
function NpcNode:handleUnderAttackEffect(realAtk)
    if self.bMyselfDied == true then
        return
    end

    local hurt = math.floor(realAtk/1000)   --营寨收到攻击时，自身承受攻击力的千分之一

    local myHp = math.floor(self.yingzhaiData.hp - hurt)    --营寨收到攻击时，自身承受攻击力的千分之一
    if myHp <= 0 then
        --营寨消失
        self:HandleMyselfDied()  --处理自身节点消亡（通知我方被攻击的敌方部曲列表中节点）
    else
        self.yingzhaiData.hp = myHp
    end

    --射箭等攻击动作之后，播放损伤动画及更新血条和士兵条
    self:runAction(cc.Sequence:create(cc.DelayTime:create(1.0), cc.CallFunc:create(function() 
        if self.bMyselfDied ~= true then
            local textSize = cc.size(100, g_defaultFontSize + 5)
            local hurt_text = cc.Label:createWithTTF("-"..hurt, g_sDefaultTTFpath, g_defaultFontSize, textSize, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
            hurt_text:setColor(g_ColorDef.Red)
            hurt_text:setAnchorPoint(cc.p(0.5, 0.5))
            hurt_text:setPosition(cc.p(self.yingzhaiImage:getContentSize().width/2, self.yingzhaiImage:getContentSize().height + 50))
            self.yingzhaiImage:addChild(hurt_text, 100) 

            hurt_text:runAction(cc.Sequence:create(cc.MoveBy:create(0.5, cc.p(0, 50)), cc.DelayTime:create(0.2), cc.CallFunc:create(function() 
                hurt_text:removeFromParent(true)
            end)))

             --生命条
            self.LoadingBar_hp:setPercent(100*myHp/self.max_hp)
            self.Text_hp:setString(myHp.."/"..self.max_hp)
        end
    end)))
end

------------------------------战场营寨----------------------------------------------------


return NpcNode
