--剧情动画
local AddGeneralLayer = class("AddGeneralLayer", CCLayerEx) --填入类名

function AddGeneralLayer:create()         --自定义的create()创建方法
    --G_Log_Info("AddGeneralLayer:create()")
    local layer = AddGeneralLayer.new()
    return layer
end

function AddGeneralLayer:onExit() 
    --G_Log_Info("AddGeneralLayer:onExit()")     
end

function AddGeneralLayer:init()  
    --G_Log_Info("AddGeneralLayer:init()")
    local csb = cc.CSLoader:createNode("csd/AddGeneralLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)

    self.Panel_Bg = csb:getChildByName("Panel_Bg") 

    self.Image_bg = self.Panel_Bg:getChildByName("Image_bg")     --故事背景图片
    self.textBg = self.Panel_Bg:getChildByName("textBg")    --文字遮罩

    self.Image_head = self.Panel_Bg:getChildByName("Image_head") 
    self.Text_desc = self.Panel_Bg:getChildByName("Text_desc")   
    self.Text_desc:setString("")

    self.Button_ok = self.Panel_Bg:getChildByName("Button_ok")   --按钮
    self.Button_ok:addTouchEventListener(handler(self,self.touchEvent))  
end

--武将来投界面
function AddGeneralLayer:initGeneralData(generalData)
    self.Image_head:loadTexture(string.format("Head/%s.png", generalData.id_str), ccui.TextureResType.localType)
    self.Text_desc:setString(generalData.desc)
end

function AddGeneralLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_ok then   --接纳
            --g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_AddGeneralLayer)   --武将来投
            self:removeFromParent(true)
        end
    end
end

return AddGeneralLayer
