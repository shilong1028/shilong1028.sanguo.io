
--武将信息大界面
local GeneralLayer = class("GeneralLayer", CCLayerEx)  --填入类名

function GeneralLayer:create()   --自定义的create()创建方法
    --G_Log_Info("GeneralLayer:create()")
    local layer = GeneralLayer.new()
    return layer
end

function GeneralLayer:onExit()
    --G_Log_Info("GeneralLayer:onExit()")
end

--初始化UI界面
function GeneralLayer:init()  
    --G_Log_Info("GeneralLayer:init()")
    self:setSwallowTouches(true)

    local csb = cc.CSLoader:createNode("csd/MainMenuLayer.csb")
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
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

        local FileNode_head = csb:getChildByName("FileNode_head")
    self.head_icon = FileNode_head:getChildByName("head_icon")   --玩家头像
end

function GeneralLayer:initData(generalData)  
    --G_Log_Dump(generalData, "generalData = ")

    local name = ""
    local lv = 0
    local pro = ""
    local offical = ""
    local num = 0
    local sType = ""
    local hp = 0
    local mp = 0
    local att = 0
    local def = 0
    local baoji = 0
    local shanbi = 0

    if generalData then
        -- name = generalData.name
        -- lv = generalData.level
        -- pro = generalData.name
        -- local officalId = generalData.offical
        -- offical = officalId
        -- num = generalData.name
        -- sType = generalData.name
        -- hp = generalData.name
        -- mp = generalData.name
        -- att = generalData.name
        -- def = generalData.name
        -- baoji = generalData.name
        -- shanbi = generalData.name
    end

end

function GeneralLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  

    end
end


return GeneralLayer
