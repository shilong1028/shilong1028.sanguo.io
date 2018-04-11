
--BattleOfficalNode 用于战斗地图中的武将表现
local BattleOfficalNode = class("BattleOfficalNode", CCLayerEx) --填入类名

function BattleOfficalNode:create()   --自定义的create()创建方法
    --G_Log_Info("BattleOfficalNode:create()")
    local layer = BattleOfficalNode.new()
    return layer
end

function BattleOfficalNode:onExit()
    --G_Log_Info("BattleOfficalNode:onExit()")

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
    self.LoadingBar_mp = csb:getChildByName("LoadingBar_mp")   
    self.Text_mp = csb:getChildByName("Text_mp") 
    --生命条
    self.LoadingBar_hp = csb:getChildByName("LoadingBar_hp") 
    self.Text_hp = csb:getChildByName("Text_hp") 
    --士气条
    self.LoadingBar_shiqi = csb:getChildByName("LoadingBar_shiqi") 
    self.Text_shiqi = csb:getChildByName("Text_shiqi") 
    --士兵数量条
    self.LoadingBar_solider = csb:getChildByName("LoadingBar_solider") 
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

function BattleOfficalNode:initBattleOfficalData(battleOfficalData)
    if battleOfficalData == -1 or battleOfficalData == nil then
        G_Log_Error("BattleOfficalNode:initBattleOfficalData() data = -1")
        return
    end
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
            unitData.bingData = nil   --兵种数据   --和generalData数据结构相同
            unitData.zhenData = nil   --阵型数据
        }
        --附加信息  --营寨武将数据
        battleOfficalData.generalData = {
            officalConfig.id_str = stream:ReadString()    --官职ID字符串
            officalConfig.name = stream:ReadString()     --名称
            officalConfig.type = stream:ReadWord()    --官职类型，0通用，1主角，2武将，3军师
            officalConfig.quality = stream:ReadWord()    --品质,0五品以下，1五品，2四品，3三品，4二品，5一品，6王侯，7皇帝
            officalConfig.hp = stream:ReadUInt()    --附加血量值
            officalConfig.mp = stream:ReadUInt()        --附加智力值
            officalConfig.troops = stream:ReadUInt()    --附加带兵数       
            officalConfig.subs = {}     --下属官职id_str集合,-表示连续区间，;表示间隔区间
            officalConfig.desc = stream:ReadString()    --官职介绍
        }
    ]]

    battleOfficalData.generalData = g_HeroDataMgr:GetSingleGeneralData(battleOfficalData.generalIdStr)
    if battleOfficalData.generalData == nil then
        G_Log_Error("BattleOfficalNode:initBattleOfficalData() generalData = nil")
        return
    end
    battleOfficalData.unitData.bingData = g_HeroDataMgr:GetSingleGeneralData(battleOfficalData.unitData.bingIdStr)
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
    self.LoadingBar_solider:setPercent(100*battleOfficalData.unitData.bingCountp/self.max_bingCount)
    self.Text_solider:setString(battleOfficalData.unitData.bingCount.."/"..self.max_bingCount)

    --1前锋营\2左护军\3右护军\4后卫营\5中军主帅\6中军武将上\7中军武将下
    self.rightBtn_atk2:setTitleText(lua_Battle_Str6..lua_Battle_Str5)    --进攻中军
    self.leftBtn_def2:setTitleText(lua_Battle_Str7..lua_Battle_Str1)  --回防中军

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

end

function BattleOfficalNode:setBtnIsShow(val)
    if val == nil then 
        val = not self.btnIsShow   --操作按钮是否可见
    end
    self.btnIsShow = val
    self.rightBtn_atk1:setVisible(self.btnIsShow)   --进攻前锋/左翼/右翼/后卫
    self.rightBtn_atk2:setVisible(self.btnIsShow)  --进攻中军
    if self.battleOfficalData.zhenPos >= 5 and self.battleOfficalData.zhenPos <=7 then
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
            self:setBtnIsShow(false)
        elseif sender == self.rightBtn_atk2 then   --进攻中军
            self:setBtnIsShow(false)
        elseif sender == self.leftBtn_def1 then  --回防前锋/左翼/右翼/后卫
            self:setBtnIsShow(false)
        elseif sender == self.leftBtn_def2 then  --回防中军
            self:setBtnIsShow(false)
        elseif sender == self.topBtn_pause then  --待命
            self:setBtnIsShow(false)
        elseif sender == self.Image_bg then  --选中自身
            self:setBtnIsShow()
        end
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