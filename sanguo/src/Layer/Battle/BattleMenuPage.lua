
--战斗层菜单
local BattleMenuPage = class("BattleMenuPage", CCLayerEx)  --填入类名

function BattleMenuPage:create()    --自定义的create()创建方法
    --G_Log_Info("BattleMenuPage:create()")
    local layer = BattleMenuPage.new()
    return layer
end

function BattleMenuPage:onExit()
    --G_Log_Info("BattleMenuPage:onExit()")
end

--初始化UI界面
function BattleMenuPage:init()  
    --G_Log_Info("BattleMenuPage:init()")
    self:setSwallowTouches(false)

    local csb = cc.CSLoader:createNode("csd/BattleMenuPage.csb")
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    self:addChild(csb)

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
    self.Button_atk = csb:getChildByName("Button_atk")    --全军攻击
    self.Button_atk:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_def = csb:getChildByName("Button_def")    --全军回防
    self.Button_def:addTouchEventListener(handler(self,self.touchEvent))
end

function BattleMenuPage:initBattleData(battleMapId)
    G_Log_Info("BattleMenuPage:initBattleData() battleMapId = %d", battleMapId)

    
end

function BattleMenuPage:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_exit then   --全军撤退

        elseif sender == self.Button_atk then   --全军攻击

        elseif sender == self.Button_def then   --全军回防

        end
    end
end

return BattleMenuPage
