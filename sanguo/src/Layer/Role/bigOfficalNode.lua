
--武将信息大界面
local bigOfficalNode = class("bigOfficalNode", CCLayerEx)

function bigOfficalNode:create()   --自定义的create()创建方法
    --G_Log_Info("bigOfficalNode:create()")
    local layer = bigOfficalNode.new()
    return layer
end

function bigOfficalNode:onExit()
    --G_Log_Info("ZhenXingLayer:onExit()")
end

--初始化UI界面
function bigOfficalNode:init()  
    --G_Log_Info("ZhenXingLayer:init()")
    local csb = cc.CSLoader:createNode("csd/bigOfficalNode.csb")
    self:addChild(csb)

    self.Image_Bg = csb:getChildByName("Image_Bg")

    self.Image_headBg = csb:getChildByName("Image_Bg")    --头像背景
    self.Image_color = csb:getChildByName("Image_color")   --品质颜色
    self.Image_toukui = csb:getChildByName("Image_toukui")  --头盔
    self.Image_wuqi = csb:getChildByName("Image_wuqi")      --武器
    self.Image_hujia = csb:getChildByName("Image_hujia")    --护甲
    self.Image_zuoqi = csb:getChildByName("Image_zuoqi")    --坐骑
    self.Image_daoju = csb:getChildByName("Image_daoju")    --道具
    self.Image_type = csb:getChildByName("Image_type")    --兵种图标

    self.Text_name = csb:getChildByName("Text_name")    --名称
    self.Text_lv = csb:getChildByName("Text_lv")    --等级
    self.Text_pro = csb:getChildByName("Text_pro")   --熟练度SABCD
    self.Text_offical = csb:getChildByName("Text_offical")   --官职
    self.Text_num = csb:getChildByName("Text_num")      --兵力
    self.Text_type = csb:getChildByName("Text_type")    --兵种文本

    self.Text_hp = csb:getChildByName("Text_hp")    --血量
    self.Text_mp = csb:getChildByName("Text_mp")    --智力
    self.Text_att = csb:getChildByName("Text_att")   --攻击
    self.Text_def = csb:getChildByName("Text_def")   --防御
    self.Text_baoji = csb:getChildByName("Text_baoji")   --暴击
    self.Text_shanbi = csb:getChildByName("Text_shanbi")  --闪避

end

function bigOfficalNode:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  

    end
end


return bigOfficalNode
