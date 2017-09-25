--加载过渡页面
local LoadingLayer = class("LoadingLayer", CCLayerEx)

function LoadingLayer:create()   --自定义的create()创建方法
    --G_Log_Info("LoadingLayer:create()")
    local layer = LoadingLayer.new()
    return layer
end

function LoadingLayer:onExit()
    --G_Log_Info("LoadingLayer:onExit()")
    --self:unscheduleUpdate()
    if self.LoadingEntry then
        g_Scheduler:unscheduleScriptEntry(self.LoadingEntry)
        self.LoadingEntry = nil
    end
end

--初始化UI界面
function LoadingLayer:init()  
    --G_Log_Info("LoadingLayer:init()")
    local csb = cc.CSLoader:createNode("csd/LoadingLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    --self:showInTheMiddle(csb)

    self.BgImg = csb:getChildByName("BgImg")

    --随机背景图
    math.randomseed(os.time()) 
    local idx = math.random(1, g_StoryBgCount)
    self.BgImg:loadTexture(string.format("StoryBg/StoryBg_%d.jpg",idx), ccui.TextureResType.localType)

    local LoadingBarBg = csb:getChildByName("LoadingBarBg")
    self.LoadingBar = csb:getChildByName("LoadingBar")
    self.LoadingBar:setPercent(0)
    self.Text_desc = csb:getChildByName("Text_desc")   
    self.loadCount = 0
    self.bBreak = true  --假进度条，进行到80%时暂停，等待应用层返回之后，再增加，直到100后隐藏消失

    --self:scheduleUpdateWithPriorityLua(handler(self, self.update), 0)
    local function updateLoading(dt)
        self:updateLoading() 
    end
    self.LoadingEntry = g_Scheduler:scheduleScriptFunc(updateLoading, 0.01, false) 
end

function LoadingLayer:updateLoading()  
    self.loadCount = self.loadCount + 2.0

    if self.bBreak == true and self.loadCount > 80 then
        self.loadCount = 80 
    end

    if self.loadCount  <= 100 then
        self.LoadingBar:setPercent(self.loadCount)
        self.Text_desc:setString(string.format(lua_Loading_Str1.."...%d%%", self.loadCount))
    else
        g_Scheduler:unscheduleScriptEntry(self.LoadingEntry)
        self.LoadingEntry = nil
        g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_LoadingLayer)
    end  
end

function LoadingLayer:setBreakFalse()
    self.bBreak = setBreakFalse
end

return LoadingLayer
