
--BattleOfficalNode 用于战斗地图中的武将表现
local BattleOfficalNode = class("BattleOfficalNode", CCLayerEx) --填入类名

function BattleOfficalNode:create()   --自定义的create()创建方法
    --G_Log_Info("BattleOfficalNode:create()")
    local layer = BattleOfficalNode.new()
    return layer
end

function BattleOfficalNode:onExit()
    --G_Log_Info("BattleOfficalNode:onExit()")
    self:DelAtkLimitUpdateEntry()
    self:DelAutoPathUpdateEntry()

end

function BattleOfficalNode:init()  
    --G_Log_Info("BattleOfficalNode:init()")
    local csb = cc.CSLoader:createNode("csd/BattleOfficalNode.csb")
    self:addChild(csb)
    -- csb:setContentSize(g_WinSize)
    -- ccui.Helper:doLayout(csb)

    self.Image_bg = csb:getChildByName("Image_bg")   --底框
    self.Image_bg:addTouchEventListener(handler(self,self.touchEvent))

    self.Image_color = csb:getChildByName("Image_color")   --底框品质颜色
    self.Image_sel = csb:getChildByName("Image_sel")   --底框选中框
    self.Image_sel:setVisible(false)

    --智力条
    self.LoadingBarBg_mp = csb:getChildByName("LoadingBarBg_mp") 
    self.LoadingBar_mp = csb:getChildByName("LoadingBar_mp")   
    self.LoadingBar_mp:setScale9Enabled(true)
    self.LoadingBar_mp:loadTexture("public_bar4.png",ccui.TextureResType.plistType)   --LoadingBar要初始化一个纹理（虽然显示颜色由studio编辑时决定），否则不显示。
    self.Text_mp = csb:getChildByName("Text_mp") 
    --生命条
    self.LoadingBarBg_hp = csb:getChildByName("LoadingBarBg_hp") 
    self.LoadingBar_hp = csb:getChildByName("LoadingBar_hp") 
    self.LoadingBar_hp:setScale9Enabled(true)
    self.LoadingBar_hp:loadTexture("public_bar3.png",ccui.TextureResType.plistType)
    self.Text_hp = csb:getChildByName("Text_hp") 
    --士气条
    self.LoadingBarBg_shiqi = csb:getChildByName("LoadingBarBg_shiqi")
    self.LoadingBar_shiqi = csb:getChildByName("LoadingBar_shiqi") 
    self.LoadingBar_shiqi:setScale9Enabled(true)
    self.LoadingBar_shiqi:loadTexture("public_bar2.png",ccui.TextureResType.plistType)
    self.Text_shiqi = csb:getChildByName("Text_shiqi") 
    --士兵数量条
    self.LoadingBarBg_solider = csb:getChildByName("LoadingBarBg_solider") 
    self.LoadingBar_solider = csb:getChildByName("LoadingBar_solider") 
    self.LoadingBar_solider:setScale9Enabled(true)
    self.LoadingBar_solider:loadTexture("public_bar5.png",ccui.TextureResType.plistType)
    self.Text_solider = csb:getChildByName("Text_solider") 

    self.Text_name = csb:getChildByName("Text_name")   --武将&兵种名称

    --进攻前锋/左翼/右翼/后卫
    self.rightBtn_atk1 = csb:getChildByName("rightBtn_atk1")   
    self.rightBtn_atk1:addTouchEventListener(handler(self,self.touchEvent))
    self.rightBtn_atk1:setVisible(false)
    --进攻中军
    self.rightBtn_atk2 = csb:getChildByName("rightBtn_atk2")   
    self.rightBtn_atk2:addTouchEventListener(handler(self,self.touchEvent))
    self.rightBtn_atk2:setVisible(false)
    --回防前锋/左翼/右翼/后卫
    self.leftBtn_def1 = csb:getChildByName("leftBtn_def1")   
    self.leftBtn_def1:addTouchEventListener(handler(self,self.touchEvent))
    self.leftBtn_def1:setVisible(false)
    --回防中军
    self.leftBtn_def2 = csb:getChildByName("leftBtn_def2")   
    self.leftBtn_def2:addTouchEventListener(handler(self,self.touchEvent))
    self.leftBtn_def2:setVisible(false)
    --待命
    self.topBtn_pause = csb:getChildByName("topBtn_pause")   
    self.topBtn_pause:addTouchEventListener(handler(self,self.touchEvent))
    self.topBtn_pause:setVisible(false)

    self.btnIsShow = false   --操作按钮是否可见
end

function BattleOfficalNode:initBattleOfficalData(mapConfigData, battleOfficalData, nType, officalSelCallBack, parent)
    if battleOfficalData == -1 or battleOfficalData == nil then
        G_Log_Error("BattleOfficalNode:initBattleOfficalData() data = -1")
        return
    end
    self.mapConfigData = mapConfigData   --战场地图数据，用于AStar寻路
    self.officalType = nType or -1  --敌人-1，友军0，我军1
    self.officalSelCallBack = officalSelCallBack
    self.parentMapPage = parent   --节点所在的战场地图层

    local quanStr = "public2_Quan2.png"   --敌人方红色圈
    if self.officalType == 0 then  --友方绿圈
        quanStr = "public2_Quan3.png"
    elseif self.officalType == 1 then  --我方蓝圈
        quanStr = "public2_Quan1.png"
    end
    self.quanImage = cc.Sprite:createWithSpriteFrameName(quanStr)   
    self.maxScale = g_AtkLimitLen.unitLen/self.quanImage:getContentSize().width   --200像素内可见
    self.minScale = self.maxScale*0.7
    self.quanImage:setScale(self.maxScale) 
    self.quanImage:setPosition(self.Image_bg:getPosition())
    self:addChild(self.quanImage) 

    --闪动放缩
    local SequenceAction = cc.Sequence:create(cc.ScaleTo:create(1.0, self.minScale), cc.ScaleTo:create(1.0, self.maxScale))    --scaleAction:reverse()
    self.quanImage:runAction(cc.RepeatForever:create(SequenceAction))

    self:DelAtkLimitUpdateEntry()

    local function atkLimitUpdate(dt)
        self:atkLimitUpdate(dt, false)
    end
    self.atkLimitEntry = g_Scheduler:scheduleScriptFunc(atkLimitUpdate, 0.1, false) 


    self.battleOfficalData = battleOfficalData
    --dump(battleOfficalData, "battleOfficalData = ")
    --[[
    [LUA-print] -         "class"        = *REF*
    [LUA-print] -         "generalIdStr" = "3001"
    [LUA-print] -         "unitData" = {
    [LUA-print] -             "bingIdStr" = ""
    [LUA-print] -             "class"     = *REF*
    [LUA-print] -             "zhenId"    = ""
    [LUA-print] -         }
    [LUA-print] -         "zhenPos"      = 5
    ]]
    --[[
        battleOfficalData.zhenPos = 0   --1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
        battleOfficalData.generalIdStr = "0"    --营寨武将ID字符串
        battleOfficalData.unitData = {
            unitData.bingIdStr = "0"   --部曲兵种（游击|轻装|重装|精锐|禁军的弓刀枪骑兵）
            unitData.bingCount = 0    --部曲兵力数量
            unitData.level = 0    --部曲等级
            unitData.exp = 0      --部曲训练度
            unitData.shiqi = 0    --部曲士气
            unitData.zhenId = "0"   --部曲阵法Id
            --附加信息
            unitData.bingData = {
                bingData.id_str = stream:ReadString()    --官职ID字符串
                bingData.name = stream:ReadString()     --名称
                bingData.type = stream:ReadWord()    --官职类型，0通用，1主角，2武将，3军师
                bingData.quality = stream:ReadWord()    --品质,0五品以下，1五品，2四品，3三品，4二品，5一品，6王侯，7皇帝
                bingData.hp = stream:ReadUInt()    --附加血量值
                bingData.mp = stream:ReadUInt()        --附加智力值
                bingData.troops = stream:ReadUInt()    --附加带兵数       
                bingData.subs = {}     --下属官职id_str集合,-表示连续区间，;表示间隔区间
                bingData.desc = stream:ReadString()    --官职介绍
            }
            unitData.zhenData = nil   --阵型数据
        }
        --附加信息  --营寨武将数据
        battleOfficalData.generalData = {
            generalData.id_str = "0"   --武将ID字符串(xml保存)
            generalData.name = ""     --武将名称
            generalData.level = 0     --武将等级(xml保存)
            generalData.type = 0    --将领类型，1英雄，2武将，3军师
            generalData.hp = 0    --初始血量值
            generalData.mp = 0        --初始智力值
            generalData.atk = 0     --初始攻击力
            generalData.def = 0     --初始防御力
            generalData.skillVec = {}    --初始技能，技能lv-ID字符串以;分割(xml保存)
            generalData.equipVec = {}    --初始装备，装备lv-ID字符串以;分割(xml保存)
            generalData.desc = ""    --描述

            --附加属性(xml保存)
            generalData.exp = 0   --战斗经验
            generalData.offical = "0"    --官职ID字符串，官职可以提升武将血智攻防、额外带兵数（默认带1000兵）等属性
            generalData.zhongcheng = 100   --武将忠诚度
            generalData.bingTypeVec = {}    --轻装|重装|精锐|羽林品质的骑兵|枪戟兵|刀剑兵|弓弩兵等共16种（每个兵种仅可组建一支部曲）
            generalData.armyUnitVec = {}    --g_tbl_armyUnitConfig:new()   --武将部曲数据
        }
    ]]

    if battleOfficalData.generalData == nil then
        battleOfficalData.generalData = g_HeroDataMgr:GetSingleGeneralData(battleOfficalData.generalIdStr)
    end
    if battleOfficalData.generalData == nil then
        G_Log_Error("BattleOfficalNode:initBattleOfficalData() generalData = nil")
        return
    end
    self.generalIdStr = battleOfficalData.generalData.id_str
    
    if battleOfficalData.unitData.bingData == nil then
        battleOfficalData.unitData.bingData = g_pTBLMgr:getGeneralConfigTBLDataById(battleOfficalData.unitData.bingIdStr)
    end
    if battleOfficalData.unitData.bingData == nil then
        G_Log_Error("BattleOfficalNode:initBattleOfficalData() bingData = nil")
        return
    end

    local bgSize = self.Image_bg:getContentSize()
    if not self.headImg then
        self.headImg =  ccui.ImageView:create(string.format("Head/%s.png", battleOfficalData.generalData.id_str), ccui.TextureResType.localType)
        self.headImg:setScale(bgSize.width/self.headImg:getContentSize().width)
        self.headImg:setPosition(cc.p(bgSize.width/2, bgSize.height/2))
        self.Image_bg:addChild(self.headImg)
    end

    local colorIdx = G_GetGeneralColorIdxByLv(battleOfficalData.generalData.level)
    if colorIdx > 0 and colorIdx <=5 then
        self.Image_color:setVisible(true)
        self.Image_color:loadTexture(string.format("public_colorBg%d.png", colorIdx), ccui.TextureResType.plistType)
    else
        self.Image_color:setVisible(false)
    end

    self.Text_name:setString(battleOfficalData.generalData.name.."&"..battleOfficalData.unitData.bingData.name)   --武将&兵种名称
    --智力条
    self.max_mp = battleOfficalData.generalData.mp
    self.LoadingBar_mp:setPercent(100*battleOfficalData.generalData.mp/self.max_mp)
    self.Text_mp:setString(battleOfficalData.generalData.mp.."/"..self.max_mp)
    --生命条
    self.max_hp = battleOfficalData.generalData.hp  -- + battleOfficalData.unitData.bingData.hp*battleOfficalData.unitData.bingCount
    self.LoadingBar_hp:setPercent(100*battleOfficalData.generalData.hp/self.max_hp)
    self.Text_hp:setString(battleOfficalData.generalData.hp.."/"..self.max_hp)
    --士气条
    self.max_shiqi = 100
    self.LoadingBar_shiqi:setPercent(100*battleOfficalData.unitData.shiqi/self.max_shiqi)
    self.Text_shiqi:setString(battleOfficalData.unitData.shiqi.."/"..self.max_shiqi)
    --士兵数量条
    self.max_bingCount = battleOfficalData.unitData.bingCount
    self.LoadingBar_solider:setPercent(100*battleOfficalData.unitData.bingCount/self.max_bingCount)
    self.Text_solider:setString(battleOfficalData.unitData.bingCount.."/"..self.max_bingCount)

    --1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
    self.rightBtn_atk2:setTitleText(lua_Battle_Str6..lua_Battle_Str5)    --进攻中军
    self.leftBtn_def2:setTitleText(lua_Battle_Str7..lua_Battle_Str5)  --回防中军

    if battleOfficalData.zhenPos == 1 then   
        self.rightBtn_atk1:setTitleText(lua_Battle_Str6..lua_Battle_Str1)    --进攻前锋/左翼/右翼/后卫
        self.leftBtn_def1:setTitleText(lua_Battle_Str7..lua_Battle_Str1)    --回防前锋/左翼/右翼/后卫
    elseif battleOfficalData.zhenPos == 2 then
        self.rightBtn_atk1:setTitleText(lua_Battle_Str6..lua_Battle_Str2)   
        self.leftBtn_def1:setTitleText(lua_Battle_Str7..lua_Battle_Str2)    
    elseif battleOfficalData.zhenPos == 3 then
        self.rightBtn_atk1:setTitleText(lua_Battle_Str6..lua_Battle_Str3)   
        self.leftBtn_def1:setTitleText(lua_Battle_Str7..lua_Battle_Str3) 
    elseif battleOfficalData.zhenPos == 4 then
        self.rightBtn_atk1:setTitleText(lua_Battle_Str6..lua_Battle_Str4)   
        self.leftBtn_def1:setTitleText(lua_Battle_Str7..lua_Battle_Str4) 
    elseif battleOfficalData.zhenPos >= 5 and battleOfficalData.zhenPos <=7 then
        self.rightBtn_atk1:setTitleText(lua_Battle_Str6..lua_Battle_Str1)   
        self.leftBtn_def1:setTitleText(lua_Battle_Str7..lua_Battle_Str1) 
    end

    self.curNodePos = cc.p(0, 0) --节点当前位置

    self:initAttackMoveAttr()   --初始化节点移动操作数据

end

--部曲的安全探测计时器更新（探测周边是否有敌军或敌营）
function BattleOfficalNode:DelAtkLimitUpdateEntry()
    if self.atkLimitEntry then
        g_Scheduler:unscheduleScriptEntry(self.atkLimitEntry)
        self.atkLimitEntry = nil
    end
end

function BattleOfficalNode:atkLimitUpdate(dt)
    if self.parentMapPage and self.atkState and self.atkState > g_AtkState.Pause then   --节点所在的战场地图层 --非待命状态
        local bCatchEnemy = false
        if self.enemyNode then    --攻击对象节点 
            local curPos = self:getNodePos()
            local enemyPos = self.enemyNode:getNodePos()
            local len = g_pMapMgr:CalcDistance(curPos, enemyPos)  
            if len < g_AtkLimitLen.unitLen then
                bCatchEnemy = true
            end
        end

        if bCatchEnemy == false then
            local enemyNode, atkObj = self.parentMapPage:checkEnemyUnitOrYingzhai(self)
            if enemyNode and atkObj > g_AtkObject.None then   --找到探测范围内的敌军或敌营
                self:setAttackObj(atkObj, enemyNode)
            else   --没有找到探测范围内的敌军单位，则按照既定的攻打营寨目标前进
            end
        end
    else
        --self:DelAtkLimitUpdateEntry()
        self:StopLastAutoPath()   --停止上一个自动寻路
    end
end

function BattleOfficalNode:setBtnIsShow(val)
    if self.officalType ~= 1 then  --敌人-1，友军0，我军1
        return
    end
    if val == nil then 
        val = not self.btnIsShow   --操作按钮是否可见
    end
    self.btnIsShow = val

    self.Image_sel:setVisible(self.btnIsShow)

    self.rightBtn_atk1:setVisible(self.btnIsShow)   --进攻前锋/左翼/右翼/后卫
    self.rightBtn_atk2:setVisible(self.btnIsShow)  --进攻中军
    if self.battleOfficalData and self.battleOfficalData.zhenPos >= 5 and self.battleOfficalData.zhenPos <=7 then
        self.leftBtn_def1:setVisible(false) 
    else
        self.leftBtn_def1:setVisible(self.btnIsShow)  --回防前锋/左翼/右翼/后卫
    end
    self.leftBtn_def2:setVisible(self.btnIsShow)  --回防中军
    self.topBtn_pause:setVisible(self.btnIsShow)  --待命
end

function BattleOfficalNode:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.rightBtn_atk1 then  --进攻前锋/左翼/右翼/后卫
            self.atkState = g_AtkState.Attack   --攻击状态，0待命，1进攻，2回防，3溃败
            self:updateAttackMove()  --根据攻击状态进行移动操作（攻击、回防、溃败等）
            self:setBtnIsShow(false)
        elseif sender == self.rightBtn_atk2 then   --进攻中军
            self.atkState = g_AtkState.Attack   --攻击状态，0待命，1进攻，2回防，3溃败

            self:setBtnIsShow(false)
        elseif sender == self.leftBtn_def1 then  --回防前锋/左翼/右翼/后卫
            self.atkState = g_AtkState.Defend   --攻击状态，0待命，1进攻，2回防，3溃败

            self:setBtnIsShow(false)
        elseif sender == self.leftBtn_def2 then  --回防中军
            self.atkState = g_AtkState.Defend   --攻击状态，0待命，1进攻，2回防，3溃败

            self:setBtnIsShow(false)
        elseif sender == self.topBtn_pause then  --待命
            self.atkState = g_AtkState.Pause   --攻击状态，0待命，1进攻，2回防，3溃败
            self:atkLimitUpdate()
            self:setBtnIsShow(false)
        elseif sender == self.Image_bg then  --选中自身
            self:setBtnIsShow()
            if self.officalSelCallBack then
                self.officalSelCallBack(self)
            end
        end
    end
end

--设置节点在战场上的位置
function BattleOfficalNode:setNodePos(pos)
    self.curNodePos = pos --节点当前位置
    self:setPosition(pos)
end

function BattleOfficalNode:getNodePos()
    return cc.p(self:getPosition())  --self.curNodePos
end

--初始化进攻属性对象  --初始化节点移动操作数据
function BattleOfficalNode:initAttackMoveAttr()
    --[[ 
        --初始化的部曲数据
        self.battleOfficalData = battleOfficalData   --数据
        self.officalType = nType or -1  --敌人-1，友军0，我军1
        self.officalSelCallBack = officalSelCallBack   --回调
        self.max_mp = battleOfficalData.generalData.mp  --智力条
        self.max_hp = battleOfficalData.generalData.hp  --生命条
        self.max_shiqi = 100  --士气条
        self.max_bingCount = battleOfficalData.unitData.bingCount  --士兵数量条
        self.curNodePos = cc.p(0, 0) --节点当前位置
    ]]
    self.atkState = g_AtkState.Pause   --攻击状态，0待命，1进攻，2回防，3溃败
    self.enemyType = g_AtkObject.None   --攻击对象类型，0无对象，1攻击营寨，2攻击敌军
    self.enemyNode = nil    --攻击对象节点 
    self.enemyOfficalType = -1  --敌人-1，友军0，我军1

    self.AutoPathVec = nil   --自动寻路路径
    self.bAutoMoving = false  --正在自动寻路
    self.bPauseAutoMoving = false  --暂停自动寻路，比如触发战斗，打开界面等
    self.AutoPathEntry = nil  --自动寻路定时器实体
    self.AutoPathOneByOneData = nil  --自动寻路一步步走的步伐数据

    self.MoveSpeed = g_BingSpeed.QiangSpeed   --移动速度
    local bingId = tonumber(self.battleOfficalData.unitData.bingIdStr)
    if bingId == g_ItemIdDef.Item_Id_qiangbing then
        self.MoveSpeed = g_BingSpeed.QiangSpeed
    elseif bingId == g_ItemIdDef.Item_Id_daobing then
        self.MoveSpeed = g_BingSpeed.DaoSpeed
    elseif bingId == g_ItemIdDef.Item_Id_gongbing then
        self.MoveSpeed = g_BingSpeed.GongSpeed
    elseif bingId == g_ItemIdDef.Item_Id_qibing then
        self.MoveSpeed = g_BingSpeed.QiSpeed
    end   
end

function BattleOfficalNode:setAttackObj(enemyType, node, atkState)
    G_Log_Info("BattleOfficalNode:setAttackObj(), enemyType = %d, ", enemyType, "; self.atkState = ", self.atkState)
    self.enemyType = enemyType   --攻击对象类型，0无对象，1攻击营寨，2攻击敌军
    self.enemyNode = node    --攻击对象节点
    self.enemyOfficalType = -1  --敌人-1，友军0，我军1

    self.enemyNodePos = nil
    if self.enemyNode then
        self.enemyOfficalType = node.officalType  --敌人-1，友军0，我军1

        if self.enemyType == g_AtkObject.EnemyUnit then
            self.enemyNodePos = node:getNodePos()   --地方对象目标位置
        elseif self.enemyType == g_AtkObject.YingZhai then
            self.enemyNodePos = node:getNodePos() 
        end
    end

    if atkState then
        self.atkState = atkState   --攻击状态，0待命，1进攻，2回防（指定营寨），3溃败（到中军后消失）
    end

    self:updateAttackMove()  --根据攻击状态进行移动操作（攻击、回防、溃败等）
end

--处理敌军移动
function BattleOfficalNode:handleEnemyNodeMoved(node)
    if self.enemyNode and self.enemyNode.generalIdStr and node and node.generalIdStr and self.enemyNode.generalIdStr == node.generalIdStr then
        self.enemyNode = node
        self.enemyNodePos = node:getNodePos() 
    end
    self:updateAttackMove()  --根据攻击状态进行移动操作（攻击、回防、溃败等）
end

--根据攻击状态进行移动操作（攻击、回防、溃败等）
function BattleOfficalNode:updateAttackMove()
    self:StopLastAutoPath()   --停止上一个自动寻路
    
    if self.atkState and self.enemyNodePos and self.atkState > g_AtkState.Pause then   --非待命状态
        --开始astar寻路,endPos为目标位置的像素点（左下角为00）
        local endPos = self.enemyNodePos
        if endPos.x < 0 or endPos.y < 0 or endPos.x > self.mapConfigData.width or endPos.y > self.mapConfigData.height then
            G_Log_Error("endPos is not in Map, endPos.x = %f, endPos.y = %f", endPos.x, endPos.y)  --如果越界了
            return;
        end

        local startPos = cc.p(self:getPosition())

        local stepLen = g_pMapMgr:CalcDistance(endPos, startPos)
        if stepLen < 32 then   --移动目的地就在附近
            --G_Log_Info("移动目的地就在附近")
            return 
        end

        local startPt = cc.p(math.floor(startPos.x / 32), math.floor((self.mapConfigData.height - startPos.y) / 32))    --地图块为32*32大小，且从0开始计数
        local endPt = cc.p(math.floor(endPos.x / 32), math.floor((self.mapConfigData.height - endPos.y) / 32))

        --G_Log_Info("startPt.x = %d, startPt.y = %d, endPt.x = %d, endPt.y = %d", startPt.x, startPt.y, endPt.x, endPt.y)
        g_pAutoPathMgr:AStarFindPath(startPt.x, startPt.y, endPt.x, endPt.y)
        local autoPath = g_pAutoPathMgr:AStarGetPath(g_bAStarPathSmooth)
        if autoPath and #autoPath > 0 then
            --寻路路径细化，50像素一个移动点
            local AutoPathVec = {}   --自动寻路路径
            local pt0 = cc.p(autoPath[1]:getX(), self.mapConfigData.height - autoPath[1]:getY())
            local pt1 = pt0
            table.insert(AutoPathVec, pt0)
            for k=2, #autoPath do   --SPoint转ccp, autoPath为32*32的块坐标，AutoPathVec为像素坐标
                pt1 = cc.p(autoPath[k]:getX(), self.mapConfigData.height - autoPath[k]:getY())
                local StepLen = g_pMapMgr:CalcDistance(pt0, pt1)   
                local count = math.floor(StepLen/50)
                local ptoffset = cc.p((pt1.x - pt0.x)/(count+1), (pt1.y - pt0.y)/(count+1) )
                for i=1, count do
                    local pathPos = cc.p(pt0.x + ptoffset.x*i, pt0.y + ptoffset.y*i )
                    table.insert(AutoPathVec, pathPos)
                end
                table.insert(AutoPathVec, pt1)
                pt0 = pt1
            end
            self:StartAutoPath(AutoPathVec)
        else
            g_pGameLayer:ShowScrollTips(lua_str_WarnTips6, g_ColorDef.Red, g_defaultTipsFontSize)   --"坐标为地图不可达部分！"
            G_Log_Error("autoPath is nil, bucause endPt not reachable! endPt.x = %d, endPt.y = %d", endPt.x, endPt.y)
        end
    end
end

function BattleOfficalNode:StopLastAutoPath()   --停止上一个自动寻路
    --G_Log_Info("BattleOfficalNode:StopLastAutoPath()")
    self:DelAutoPathUpdateEntry()

    if self.moveAction then
        self:stopAction(self.moveAction)
        self.moveAction = nil
    end

    self.bAutoMoving = false
    self.bPauseAutoMoving = false
    self.AutoPathVec = nil
end

function BattleOfficalNode:DelAutoPathUpdateEntry()
    if self.AutoPathEntry then
        g_Scheduler:unscheduleScriptEntry(self.AutoPathEntry)
        self.AutoPathEntry = nil
        self.AutoPathOneByOneData = nil  --自动寻路一步步走的步伐数据
    end
end

function BattleOfficalNode:StartAutoPath(autoPath)
    --G_Log_Info("BattleOfficalNode:StartAutoPath()")
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

function BattleOfficalNode:setPauseAutoPath(bPause)
    if self.bAutoMoving == true and #self.AutoPathVec > 0 then  --正在自动寻路
        self.bPauseAutoMoving =  bPause
        if self.bPauseAutoMoving == true then
            self:DelAutoPathUpdateEntry()
        else
            self:AutoPathUpdate()
        end
    end
end

function BattleOfficalNode:AutoPathUpdate()
    --G_Log_Info("BattleOfficalNode:AutoPathUpdate()")
    if self.bPauseAutoMoving == true then  --暂停自动寻路
        return
    end

    local function EndAutoPathUpdate()
        --G_Log_Info("************** BattleOfficalNode:EndAutoPathUpdate()")
        self:DelAutoPathUpdateEntry()
        self.bAutoMoving = false
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

        local moveTime = StepLen/self.MoveSpeed 

        -- if self.moveAction then
        --     self:stopAction(self.moveAction)
        --     self.moveAction = nil
        -- end
        -- self.moveAction = cc.MoveTo:create(moveTime, dirPos)
        -- self:runAction(self.moveAction)

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
        self.AutoPathEntry = g_Scheduler:scheduleScriptFunc(AutoPathUpdateOneByOne, 0.02, false) 
    end
end

function BattleOfficalNode:AutoPathUpdateOneByOne(dt)
    if self.AutoPathOneByOneData then
        if self.AutoPathOneByOneData.stepIdx >= self.AutoPathOneByOneData.step then
            self.curNodePos = self.AutoPathOneByOneData.dirPos  --人物当前位置
            self:setPosition(self.curNodePos)

            self:DelAutoPathUpdateEntry()
            self:AutoPathUpdate()
        else
            self.curNodePos = self.AutoPathOneByOneData.nextPos  --人物当前位置
            self:setPosition(self.curNodePos)

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


return BattleOfficalNode

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