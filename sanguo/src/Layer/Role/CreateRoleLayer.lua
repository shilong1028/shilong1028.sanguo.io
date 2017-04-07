--选角界面
local CreateRoleLayer = class("CreateRoleLayer", CCLayerEx)

function CreateRoleLayer:create()   --自定义的create()创建方法
    --G_Log_Info("CreateRoleLayer:create()")
    local layer = CreateRoleLayer.new()
    return layer
end

function CreateRoleLayer:onExit()
    --G_Log_Info("CreateRoleLayer:onExit()")
end

--初始化UI界面
function CreateRoleLayer:init()  
    --G_Log_Info("CreateRoleLayer:init()")
    local csb = cc.CSLoader:createNode("csd/CreateRoleLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    --self:showInTheMiddle(csb)

    self.Image_Zhao = csb:getChildByName("Image_Zhao")
    self.Image_Wei = csb:getChildByName("Image_Wei")
    self.Image_Zhao = csb:getChildByName("Image_Wu")
    self.Image_Wei = csb:getChildByName("Image_Shu")
    self.Image_Zhao = csb:getChildByName("Image_Han")

    self.Button_Han = csb:getChildByName("Button_Han")
    self.Button_Han:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_Zhao = csb:getChildByName("Button_Zhao")
    self.Button_Zhao:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_Shu = csb:getChildByName("Button_Shu")
    self.Button_Shu:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_Wu = csb:getChildByName("Button_Wu")
    self.Button_Wu:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_Wei = csb:getChildByName("Button_Wei")
    self.Button_Wei:addTouchEventListener(handler(self,self.touchEvent))

    self.Button_Sel = csb:getChildByName("Button_Sel")
    self.Button_Sel:addTouchEventListener(handler(self,self.touchEvent))
    self.descText = csb:getChildByName("descText")
end

function CreateRoleLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_Sel then
            g_pGameLayer:GameMainLayer()   --进入游戏
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_SelCampLayer)
        elseif sender == self.Button_Han then

        elseif sender == self.Button_Zhao then

        elseif sender == self.Button_Shu then

        elseif sender == self.Button_Wu then

        elseif sender == self.Button_Wei then

        end
    end
end

return CreateRoleLayer
