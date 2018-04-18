
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

    --左上角，玩家头像等节点
    local FileNode_head = csb:getChildByName("FileNode_head")
    self.head_icon = FileNode_head:getChildByName("head_icon")   --玩家头像
    self.Text_nick = FileNode_head:getChildByName("Text_nick")    --玩家昵称
    self.Button_chongzhi = FileNode_head:getChildByName("Button_chongzhi")   --充值按钮
    self.Button_chongzhi:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_qiandao = FileNode_head:getChildByName("Button_qiandao")
    self.Button_qiandao:addTouchEventListener(handler(self,self.touchEvent))   --连续签到按钮
    self.Button_libao = FileNode_head:getChildByName("Button_libao")     --在线礼包
    self.Button_libao:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_huodong = FileNode_head:getChildByName("Button_huodong")   --精彩活动
    self.Button_huodong:addTouchEventListener(handler(self,self.touchEvent))
    self.Text_vip = FileNode_head:getChildByName("Text_vip")    --VIP等级
    self.BtnVipAdd = FileNode_head:getChildByName("BtnVipAdd")   --提高VIP等级按钮
    self.BtnVipAdd:addTouchEventListener(handler(self,self.touchEvent))

    self.Button_gonggao = FileNode_bottom:getChildByName("Button_gonggao")   --公告按钮
    self.Button_gonggao:addTouchEventListener(handler(self,self.touchEvent))
end

function BattleMenuPage:initBattleData(battleMapId)
    G_Log_Info("BattleMenuPage:initBattleData() battleMapId = %d", battleMapId)

    
end

function BattleMenuPage:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_chongzhi then   --充值

        end
    end
end

return BattleMenuPage
