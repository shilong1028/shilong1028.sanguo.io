
--g_pGameLayer是g_pGameScene的子层，用于承载游戏各种功能界面
local GameLayer = class("GameLayer", CCLayerEx) --填入类名

function GameLayer:create()   --自定义的create()创建方法
    --G_Log_Info("GameLayer:create()")
    local layer = GameLayer.new()
    return layer
end

function GameLayer:onExit()
    --G_Log_Info("GameLayer:onExit()")
    self.requireLuaVec = {}   --每个功能的Lua文件仅require一次即可

end

function GameLayer:init()  
    --G_Log_Info("GameLayer:init()")
    self.requireLuaVec = {}   --每个功能的Lua文件仅require一次即可
  
end

function GameLayer:AddChild(uid, className, funcName, userTable)   --className为Layer目录下的界面类路径，funcName为初始化方法，userTable初始数据
    G_Log_Info("GameLayer:AddChild: uid = %d, className = %s", uid, className)
   
    local layer = self:getChildByTag(uid)
    if layer ~= nil then
        self:removeChildByTag(uid)
    end
    
    if type(className) == "string" then
        local file = self.requireLuaVec["uid"..uid]
        if not file then
            file = require("Layer."..className)
            self.requireLuaVec["uid"..uid] = file
        end
        layer = file:create()  --file:new()
        layer:setTag(uid)
        self:addChild(layer)

        if uid == g_GameLayerTag.LAYER_TAG_MAINMENU then  --主菜单层
            layer:setLocalZOrder(-1)
        elseif uid == g_GameLayerTag.LAYER_TAG_MAINCITY then  --主城层
            layer:setLocalZOrder(-10)
        elseif uid == g_GameLayerTag.LAYER_TAG_CHINAMAP or uid == g_GameLayerTag.LAYER_TAG_BATTLEMAP then  --地图层,战场
            layer:setLocalZOrder(-20)
        elseif uid == g_GameLayerTag.LAYER_TAG_DialogOkCancelLayer then   --okcancel对话框  
            layer:setLocalZOrder(100)
        elseif uid == g_GameLayerTag.LAYER_TAG_DialogHelpLayer then   --help对话框  
            layer:setLocalZOrder(100)
        elseif uid == g_GameLayerTag.LAYER_TAG_LoadingLayer then   --加载过渡层
            layer:setLocalZOrder(199)
        end

    else
        G_Log_Fatal("the lua file is nin, file = ", className) 
    end
  
    --初始数据
    if funcName then
        local fun = layer[funcName]
        fun(userTable)
    end
    
    return layer
end

function GameLayer:RemoveChildByUId(uid)
    local layer = self:getChildByTag(uid)
    if layer ~= nil then
        self:removeChildByTag(uid)
    end
    return nil
end

function GameLayer:RemoveAllChild()
    local children = self:getChildren()
    for i = 1,#(children) do
        if children[i]:getTag() < g_GameLayerTag.LAYER_TAG_MAINMENU 
            or children[i]:getTag() > g_GameLayerTag.LAYER_TAG_CHINAMAP then
            children[i]:removeFromParent(true)
        end
    end
end

function GameLayer:GetLayerByUId(uid)
    local layer = self:getChildByTag(uid)
    if layer ~= nil then
        return layer
    end
    return nil
end

--剧情反馈（完成，下一个）
function GameLayer:StoryFinishCallBack(storyId, bMainStory)
    if not bMainStory then bMainStory = true end
    local nextStoryId = storyId + 1

    g_HeroDataMgr:SaveNextStoryTalkId(nextStoryId)   --保存新的任务ID到XML文件

    --发送处主线剧情任务监听事件
    local event = cc.EventCustom:new(g_EventListenerCustomName.MainMenu_mainStoryEvent)
    event._usedata = string.format("%d", nextStoryId)   --下一个剧情任务ID
    g_EventDispatcher:dispatchEvent(event) 
end

--/////////////////////// 以下为各个功能界面开启  ////////////////////////////

--开始游戏界面
function GameLayer:StartGameLayer()
    --G_Log_Info("GameLayer:StartGameLayer()")
    local campId = g_HeroDataMgr:GetHeroCampData().campId     --g_UserDefaultMgr:GetRoleCampId()
    if campId and campId > 0 then
        --进入游戏
        self:GameMainLayer()  
    else
        --选角界面
        self:AddChild(g_GameLayerTag.LAYER_TAG_SelCampLayer, "Role.CreateRoleLayer")
    end
end

--进入游戏
function GameLayer:GameMainLayer()
    --主城层
    --self.mainCityLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_MAINCITY, "MainCityLayer")
    --主菜单层
    self.MenuLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_MAINMENU, "MainMenuLayer")
    --地图层
    self.MapLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_CHINAMAP, "MapLayer")
    --战场地图
    self.BattleMapLayer = self:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_BATTLEMAP)

    local roleMapPosData = g_HeroDataMgr:GetHeroMapPosData()
    local mapId = roleMapPosData.mapId
    local rolePos = roleMapPosData.rolePos
    if not mapId then  --没有地图信息，默认显示玩家阵营初始位置及地图（第一次登陆，选角之后会进入该分支）
        local campId = g_HeroDataMgr:GetHeroCampData().campId     --g_UserDefaultMgr:GetRoleCampId()
        if campId and campId > 0 then
            local campData = g_pTBLMgr:getCampConfigTBLDataById(campId)
            if campData then
                self.MapLayer:changeMapByCity(campData.src_city)
            end
        end
    else
        self.MapLayer:changeMapBymapId(mapId, rolePos)
    end
end

--进入战斗场景
function GameLayer:ShowGameBattleMapLayer()
    self.MenuLayer = self:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_MAINMENU)
    self.MapLayer = self:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_CHINAMAP)

    --战场地图
    self.BattleMapLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_BATTLEMAP, "Battle.BattleMapLayer")
    self.BattleMapLayer:initBattleData()
end

--[[
--滚动列表叠加显示提示界面
tipsArr = {
{text, color, fontSize},
{text, color, fontSize}
}
]]
function GameLayer:ShowScrollTips(tips, color, fontSize)
    local tipsArr = {}
    if type(tips) == "string" then
        local cell = g_ScrollTips_text:new()
        cell.text = tips

        if color then
            cell.color = color
        end
        if fontSize then
            cell.fontSize = fontSize
        end
        table.insert(tipsArr, cell)
    elseif type(tips) == "table" then
        for i=1, #(tips)do
            if(tips[i].text and tips[i].text ~= "")then
                table.insert(tipsArr, tips[i])
            end
        end
    else
        G_Log_Error("ShowScrollTips, type(tips) is error!")
        return
    end

    if #tipsArr < 1 then
        G_Log_Warning("ShowScrollTips, tipsArr is empty!")
        return
    end

    local scrollTipsLayer = self:getChildByTag(g_GameLayerTag.LAYER_TAG_ScrollTipsLayer)
    if(scrollTipsLayer == nil) then
        scrollTipsLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_ScrollTipsLayer, "TipsOrDialog.ScrollTipsLayer")
        scrollTipsLayer:setLocalZOrder(g_TopZOrder)
    end

    scrollTipsLayer:setTexts(tipsArr)   

    return scrollTipsLayer
end

--通信等待动画显示和隐藏
function GameLayer:EnableSocketAni(bShowAni)
    local pColorLayer = self:GetLayerByUId(g_GameLayerTag.LAYER_TAG_SocketAni)
    local aniSprite = nil
    if not pColorLayer then
        pColorLayer = cc.LayerColor:create(cc.c4b(0, 0, 0, 255 * 0.75), g_WinSize.width, g_WinSize.height)
        --pColorLayer:setPosition(cc.p(g_WinSize.width / 2, g_WinSize.height / 2))
        pColorLayer:setTouchEnabled(true)

        aniSprite = cc.Sprite:createWithSpriteFrameName("public_loading_icon2.png") 
        aniSprite:setPosition(cc.p(g_WinSize.width / 2, g_WinSize.height / 2))
        aniSprite:runAction(cc.RepeatForever:create(cc.RotateBy:create(1.0, -360)))
        pColorLayer:addChild(aniSprite, 10, 111)

        self:addChild(pColorLayer, 200, g_GameLayerTag.LAYER_TAG_SocketAni)
    end

    if bShowAni == true then --动画等待动画
        pColorLayer:setVisible(true)
        g_Director:getActionManager():resumeTarget(aniSprite)
    else
        pColorLayer:setVisible(false)
        g_Director:getActionManager():pauseTarget(aniSprite)
    end
end

--显示加载过渡页面
function GameLayer:showLoadingLayer(bShow) 
    if self.LoadingLayer then
        if bShow == true then
            self:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_LoadingLayer)
        else
            self.LoadingLayer:setBreakFalse()
        end
    end
    if bShow == true then
        self.LoadingLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_LoadingLayer, "LoadingLayer")
    end
end

--显示okCancel对话框  
function GameLayer:showDialogOkCancelLayer() 
    local dialogLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_DialogOkCancelLayer, "TipsOrDialog.DialogOkCancelLayer")
    return dialogLayer
end

--显示help对话框  
function GameLayer:showDialogHelpLayer() 
    local dialogLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_DialogHelpLayer, "TipsOrDialog.HelpInfoLayer")
    return dialogLayer
end

--显示视频动画
function GameLayer:showVedioLayer(vedio) 
    local vedioLayer = self:GetLayerByUId(g_GameLayerTag.LAYER_TAG_VedioLayer)
    if not vedioLayer then
        vedioLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_VedioLayer, "Story.StoryLayer")
    end
    vedioLayer:PlayVedioFile(vedio)
end

--显示剧情动画
function GameLayer:showStoryTalkLayer(storyData) 
    local storytalkLayer = self:GetLayerByUId(g_GameLayerTag.LAYER_TAG_StoryTalkLayer)
    if not storytalkLayer then
        storytalkLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_StoryTalkLayer, "Story.StoryTalkLayer")
    end
    storytalkLayer:initStoryData(storyData)
end

--显示武将来投(可以显示多个)
function GameLayer:showAddGeneralLayer(generalData) 
    local addGeneralLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_AddGeneralLayer, "Story.StoryTalkLayer")
    addGeneralLayer:initGeneralData(generalData)
end

--完成当前剧情的指定步骤，并继续下一步
function GameLayer:FinishStoryIntroduceByStep(storyData, step)
    storyData.storyPlayedState = step   --任务故事进程状态
    g_HeroDataMgr:SetStoryPlayedState(storyData.storyId, step) 
    self:handleStoryNextIntroduce(storyData)  --处理剧情故事下一步操作
end

--处理剧情故事下一步操作
function GameLayer:handleStoryNextIntroduce(storyData)
    local storyPlayedState = g_HeroDataMgr:GetStoryPlayedState()
    G_Log_Info("handleStoryNextIntroduce(), storyPlayedState = %d", storyPlayedState)
    G_Log_Traceback()
    if storyPlayedState == g_StoryState.Init then  --任务故事进程状态（0初始状态）
        self:showStoryTalkLayer(storyData)
    elseif storyPlayedState == g_StoryState.TextFinish then   --任务故事进程状态（1文字播放完成状态）
        self:FinishStoryIntroduceByStep(storyData, g_StoryState.AddGeneral)
        for k, generalId in pairs(storyData.generalVec) do   --武将来投
            local generalData = g_pTBLMgr:getGeneralConfigTBLDataById(generalId) 
            if generalData then
                self:showAddGeneralLayer(generalData) 
            end
        end
    elseif storyPlayedState == g_StoryState.AddGeneral then   --任务故事进程状态（2武将来投完成状态）
        self:showStoryResultLayer(storyData.storyId)  --展示显示剧情信息或剧情奖励
    elseif storyPlayedState == g_StoryState.ShowInfo then  --任务故事进程状态（3展示任务内容奖励）
        local mapLayer = self:GetLayerByUId(g_GameLayerTag.LAYER_TAG_CHINAMAP)
        if mapLayer then
            mapLayer:autoPathMapByCity(storyData.targetCity)
        end
    elseif storyPlayedState == g_StoryState.AutoPath then  --任务故事进程状态（4寻路完成）
        local mapLayer = self:GetLayerByUId(g_GameLayerTag.LAYER_TAG_CHINAMAP)
        if mapLayer then
            local bReach = mapLayer:CheckStoryDistanceByRolePos(storyData)  --根据玩家位置判定任务完成度
            if bReach == true then
                if string.len(storyData.battleIdStr) > 1 then   
                    self:showBattleInfoLayer(storyData.storyId)  --触发剧情战斗
                else
                    self:showStoryResultLayer(storyData.storyId)  --显示剧情奖励
                end
            else
                mapLayer:autoPathMapByCity(storyData.targetCity)   --寻路
            end
        end
    elseif storyPlayedState == g_StoryState.ActionFinish then  --任务故事进程状态（5招募、建设、战斗等任务结束）
        if string.len(storyData.battleIdStr) > 1 then   
            self:showBattleInfoLayer(storyData.storyId)  --触发剧情战斗
        else
            self:showStoryResultLayer(storyData.storyId)  --显示剧情奖励
        end
    elseif storyPlayedState == g_StoryState.AllFinish then  --任务故事进程状态（6最终完成）
        self:StoryFinishCallBack(storyData.storyId)  --下一个剧情
    end
end

--显示剧情奖励界面
function GameLayer:showStoryResultLayer(storyId) 
    local storyResultLayer = self:GetLayerByUId(g_GameLayerTag.LAYER_TAG_StoryResultLayer)
    if not storyResultLayer then
        storyResultLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_StoryResultLayer, "Story.StroyResultLayer")
    end
    storyResultLayer:initStoryInfo(storyId)
end

--显示战役介绍界面
function GameLayer:showBattleInfoLayer(storyId) 
    local battleInfoLayer = self:GetLayerByUId(g_GameLayerTag.LAYER_TAG_BattleInfoLayer)
    if not battleInfoLayer then
        battleInfoLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_BattleInfoLayer, "Battle.BattleInfoLayer")
    end
    battleInfoLayer:initStoryInfo(storyId)
end

--显示战役介绍界面
function GameLayer:showBattleResultLayer(result) 
    local battleResultLayer = self:GetLayerByUId(g_GameLayerTag.LAYER_TAG_BattleResultLayer)
    if not battleResultLayer then
        battleResultLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_BattleResultLayer, "Battle.BattleResultLayer")
    end
    battleResultLayer:initBattleResult(result)
end

--显示阵型|布阵界面,bPreFight是否准备出战
function GameLayer:showZhenXingLayer(bPreFight) 
    local zhenxingLayer = self:GetLayerByUId(g_GameLayerTag.LAYER_TAG_ZhenXingLayer)
    if not zhenxingLayer then
        zhenxingLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_ZhenXingLayer, "Battle.ZhenXingLayer")
    end
    zhenxingLayer:setBoolPreFight(bPreFight)
end

--Vip界面
function GameLayer:showVipLayer() 
    local vipLayer = self:GetLayerByUId(g_GameLayerTag.LAYER_TAG_VipLayer)
    if not vipLayer then
        vipLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_VipLayer, "Vip.VipLayer")
    end
end

--背包界面
function GameLayer:showBagLayer() 
    local bagLayer = self:GetLayerByUId(g_GameLayerTag.LAYER_TAG_BagLayer)
    if not bagLayer then
        bagLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_BagLayer, "Bag.BagLayer")
    end
    bagLayer:initBagGrid()
end

--将领界面
function GameLayer:showGeneralLayer() 
    local generalLayer = self:GetLayerByUId(g_GameLayerTag.LAYER_TAG_GeneralLayer)
    if not generalLayer then
        generalLayer = self:AddChild(g_GameLayerTag.LAYER_TAG_GeneralLayer, "Role.GeneralLayer")
    end
end





return GameLayer
