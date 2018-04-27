
--战斗层菜单
local BattleMenuPage = class("BattleMenuPage", CCLayerEx)  --填入类名

function BattleMenuPage:create()    --自定义的create()创建方法
    --G_Log_Info("BattleMenuPage:create()")
    local layer = BattleMenuPage.new()
    return layer
end

function BattleMenuPage:onExit()
    --G_Log_Info("BattleMenuPage:onExit()")
    if self.scheduleTime then
        g_Scheduler:unscheduleScriptEntry(self.scheduleTime)
        self.scheduleTime = nil 
    end
end

--初始化UI界面
function BattleMenuPage:init()  
    --G_Log_Info("BattleMenuPage:init()")
    self:setSwallowTouches(false)

    local csb = cc.CSLoader:createNode("csd/BattleMenuPage.csb")
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    self:addChild(csb)

    self.csbNode = csb

    local Image_Bg = csb:getChildByName("Image_Bg")
    self.Image_vs = csb:getChildByName("Image_vs")    --中间的vs及vs边框
    self.Image_vsBg = csb:getChildByName("Image_vsBg")

    self.Image_leftBarBg = csb:getChildByName("Image_leftBg")    --左右兵力进度条背景
    self.Image_rightBarBg = csb:getChildByName("Image_rightBg")
    self.LoadingBar_left = csb:getChildByName("LoadingBar_left")
    self.LoadingBar_left:setPercent(100)
    self.LoadingBar_right = csb:getChildByName("LoadingBar_right")
    self.LoadingBar_right:setPercent(100)

    self.Image_bingLeft = csb:getChildByName("Image_bingLeft")    --左右兵力图标及文本
    self.Image_bingRight = csb:getChildByName("Image_bingRight")
    self.Text_bingLeft = csb:getChildByName("Text_bingLeft")
    self.Text_bingLeft:setString("")
    self.Text_bingRight = csb:getChildByName("Text_bingRight")
    self.Text_bingRight:setString("")

    self.Image_buquLeft = csb:getChildByName("Image_buquLeft")    --左右部曲图标及文本
    self.Image_buquRight = csb:getChildByName("Image_buquRight")
    self.Text_buquLeft = csb:getChildByName("Text_buquLeft")
    self.Text_buquLeft:setString("")
    self.Text_buquRight = csb:getChildByName("Text_buquRight")
    self.Text_buquRight:setString("")

    self.Image_headLeft = csb:getChildByName("Image_headLeft")    --左右主帅头像
    self.Image_headRight = csb:getChildByName("Image_headRight")
    self.Text_time = csb:getChildByName("Text_time")    --战斗倒计时
    self.Text_time:setString("")
    self.Text_name = csb:getChildByName("Text_name")    --战斗名称
    self.Text_name:setString("")
    self.Text_target = csb:getChildByName("Text_target")   --战斗目标
    self.Text_target:setString("")

    self.Button_exit = csb:getChildByName("Button_exit")    --全军撤退
    self.Button_exit:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_exit:setVisible(false)
    self.Button_atk = csb:getChildByName("Button_atk")    --全军攻击
    self.Button_atk:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_atk:setVisible(false)
    self.Button_def = csb:getChildByName("Button_def")    --全军回防
    self.Button_def:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_def:setVisible(false)
end

--是否显示全军操作按钮
function BattleMenuPage:ShowBattleMenuBtn(bShow)
    self.Button_exit:setVisible(bShow)
    self.Button_atk:setVisible(bShow)
    self.Button_def:setVisible(bShow)
end

--初始化战场按钮数据
function BattleMenuPage:initBattleData(parent, enemyUnitVec)
    --G_Log_Info("BattleMenuPage:initBattleData()")
    self.parentBattleMapLayer = parent    --战斗场景总层
    --战斗剧情配置数据
    self.battleStoryData = g_BattleDataMgr:getBattleStoryData()   --self.battleStoryData.battleIdStr   --战斗ID字符串，"0"标识无战斗
    --[[
        battleStoryData.storyId = 0        --剧情ID
        battleStoryData.targetCity = "0"    --目标城池ID字符串
        battleStoryData.name = ""    --战役名称
        battleStoryData.vedio = "0"   --主线剧情视频文件，"0"标识无
        battleStoryData.battleIdStr = "0"   --战斗ID字符串，"0"标识无战斗
        battleStoryData.enemyIdVec = {}    --敌方出战将领ID字符串，以;分割
        battleStoryData.rewardIdVec = {}    --奖励物品，以;分割。物品ID字符串和数量用-分割   {["itemId"], ["num"]}
        battleStoryData.soldierVec = {}    --奖励士兵，以;分割。物品ID字符串和数量用-分割  {["itemId"], ["num"]}
        battleStoryData.offical = "0"   --奖励官职id_str
        battleStoryData.generalVec = {}   --奖励武将Id_str, 以;分割
        battleStoryData.talkVec = {}    --对话内容，以;分割
        battleStoryData.desc = ""    --剧情简要描述，用于奖励或战斗界面展示

        --附加成员
        battleStoryData.bPlayedTalk = 0   ---是否已经播放过对话，0未，1已播放（则不再播放）
    ]]

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

    --战斗我方阵型数据
    self.zhenXingData = g_BattleDataMgr:getBattleZhenXingData()  --我方出战阵容数据(1-7个数据，-1标识没有武将出战)
    --敌方部曲
    self.enemyZhenXingData = enemyUnitVec   --{-1, -1, -1, -1, -1, -1, -1}
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

    --战斗名称及目标
    --self.Text_name:setString(self.battleMapData.name)   ----地图表配置数据
    self.Text_name:setString(self.battleStoryData.name)   ----地图表配置数据
    self.Text_target:setString(self.battleMapData.targetStr)   ----地图表配置数据

    --左右主帅头像
    self.Image_headLeft:setVisible(false)
    self.Image_headRight:setVisible(false)

    --显示敌我双方武将小头像（中军为大头像）
    self.myHeadVec = {-1, -1, -1, -1, -1, -1, -1}   --1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
    self.enemyHeadVec = {-1, -1, -1, -1, -1, -1, -1}

    local leftHeadBeginPos = cc.p(self.Text_buquLeft:getPositionX(), self.Text_buquLeft:getPositionY())
    local rightHeadBeginPos = cc.p(self.Text_buquRight:getPositionX(), self.Text_buquRight:getPositionY())
    local offsetX = 50
    local scale = 0.35

    self.myUnitCount = 0
    self.myBingCount = 0
    for k, data in pairs(self.zhenXingData) do
        if data ~= -1 then
            self.myUnitCount = self.myUnitCount + 1
            self.myBingCount = self.myBingCount + data.unitData.bingCount

            if data.generalIdStr and data.generalIdStr ~= "" and data.generalIdStr ~= "0" then
                if data.zhenPos == 5 then
                    self.Image_headLeft:loadTexture(string.format("Head/%s.png", data.generalIdStr), ccui.TextureResType.localType)
                    self.Image_headLeft:setVisible(true)
                    self.myHeadVec[5] = {["Icon"]=self.Image_headLeft, ["idStr"]=data.generalIdStr}
                else
                    local head = cc.Sprite:create(string.format("Head/%s.png", data.generalIdStr))
                    head:setScale(scale)
                    head:setPosition(cc.p(leftHeadBeginPos.x + offsetX*self.myUnitCount, leftHeadBeginPos.y))
                    self.csbNode:addChild(head, 10)
                    self.myHeadVec[k] = {["Icon"]=head, ["idStr"]=data.generalIdStr}
                end
            end
        end
    end

    self.enemyUnitCount = 0
    self.enemyBingCount = 0
    for k, data in pairs(self.enemyZhenXingData) do
        if data ~= -1 then
            self.enemyUnitCount = self.enemyUnitCount + 1
            self.enemyBingCount = self.enemyBingCount + data.unitData.bingCount

            if data.generalIdStr and data.generalIdStr ~= "" and data.generalIdStr ~= "0" then
                if data.zhenPos == 5 then
                    self.Image_headRight:loadTexture(string.format("Head/%s.png", data.generalIdStr), ccui.TextureResType.localType)
                    self.Image_headRight:setVisible(true)
                    self.enemyHeadVec[5] = {["Icon"]=self.Image_headLeft, ["idStr"]=data.generalIdStr}
                else
                    local head = cc.Sprite:create(string.format("Head/%s.png", data.generalIdStr))
                    head:setScale(scale)
                    head:setPosition(cc.p(rightHeadBeginPos.x - offsetX*self.enemyUnitCount, rightHeadBeginPos.y))
                    self.csbNode:addChild(head, 10)
                    self.enemyHeadVec[k] = {["Icon"]=head, ["idStr"]=data.generalIdStr}
                end
            end
        end
    end

    --左右兵力进度条及文本
    self.LoadingBar_left:setPercent(100)
    self.LoadingBar_right:setPercent(100)

    self.Text_bingLeft:setString(self.myBingCount)
    self.Text_bingRight:setString(self.enemyBingCount)

    --左右部曲文本
    self.Text_buquLeft:setString(self.myUnitCount)
    self.Text_buquRight:setString(self.enemyUnitCount)

    self:ShowBattleMenuBtn(true)   --显示全军操作按钮

    --战斗倒计时开始（10分钟）
    self.battleTimeCD = 10*60
    self:OnTimeUpdate()

    if self.scheduleTime then
        g_Scheduler:unscheduleScriptEntry(self.scheduleTime)
        self.scheduleTime = nil 
    end
    local function timeupdate( dt )
        self:OnTimeUpdate(dt)
    end
    self.scheduleTime = g_Scheduler:scheduleScriptFunc(timeupdate, 1.0, false)   --是否暂停
end

function BattleMenuPage:OnTimeUpdate(dt)
    self.battleTimeCD = self.battleTimeCD - 1

    --如果全部冷却时间都清除，可以关闭定时器
    if self.battleTimeCD < 0 then
        g_Scheduler:unscheduleScriptEntry(self.scheduleTime) 
        self.scheduleTime = nil
        return
    end

    if self.battleTimeCD >= 0 then
        self.Text_time:setString(string.format("%02d:%02d", math.floor((self.battleTimeCD%3600)/60), self.battleTimeCD%60))
    end
end

--战场地图中部曲或营寨消亡的处理
function BattleMenuPage:handleNodeDied(generalIdStr, officalType)   --敌人-1，友军0，我军1
    local headVec = self.myHeadVec
    local offsetX = -50
    if officalType == -1 then
        headVec = self.enemyHeadVec 
        offsetX = 50
    end

    local delIdx = 0
    for k, data in pairs(headVec) do
        if data ~= -1 and data.idStr == generalIdStr then
            data.Icon:removeFromParent(true)
            headVec[k] = -1
            delIdx = k
            break;
        end
    end

    if delIdx > 0 and delIdx ~= 5 then   --移动头像
        for k, data in pairs(headVec) do
            if data ~= -1 and k > delIdx and k ~= 5 then
                data.Icon:runAction(cc.MoveBy(0.1, cc.p(offsetX, 0)))
            end
        end
    end
end

function BattleMenuPage:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if self.parentBattleMapLayer then    --战斗场景总层 
            if sender == self.Button_exit then   --全军撤退
                self.parentBattleMapLayer:handleAllNodeAtkOrDefOpt(g_AtkState.Failed) 
            elseif sender == self.Button_atk then   --全军攻击
                self.parentBattleMapLayer:handleAllNodeAtkOrDefOpt(g_AtkState.Attack) 
            elseif sender == self.Button_def then   --全军回防
                self.parentBattleMapLayer:handleAllNodeAtkOrDefOpt(g_AtkState.Defend) 
            end
        end
        self:ShowBattleMenuBtn(false)   --显示全军操作按钮
    end
end

return BattleMenuPage
