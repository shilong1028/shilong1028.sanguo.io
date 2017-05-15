
--NpcNode用于构造静态展示模型，比如城池展示模型等
local NpcNode = class("NpcNode", CCLayerEx) --填入类名

function NpcNode:create()   --自定义的create()创建方法
    --G_Log_Info("NpcNode:create()")
    local layer = NpcNode.new()
    return layer
end

function NpcNode:onExit()
    --G_Log_Info("NpcNode:onExit()")

end

function NpcNode:init()  
    --G_Log_Info("NpcNode:init()")
end

--城池NPC
function NpcNode:initChengData(data)  
    --G_Log_Info("NpcNode:initChengData()")
    local imgStr = "public2_chengchi.png"
    if data.type == 1 then
    	imgStr = "public2_dushi.png"
    elseif data.type == 2 then
    	imgStr = "public2_chengchi.png"
    elseif data.type == 3 then
    	imgStr = "public2_guanai.png"
    end
	self.chengImage = cc.Sprite:createWithSpriteFrameName(imgStr) 
	self.chengImage:setScale(0.8)
	self:addChild(self.chengImage)  
	local imgSize = self.chengImage:getContentSize()
	self:setContentSize(imgSize)

	local textSize = cc.size(imgSize.width*2, g_defaultChengFontSize + 6)
    self.chengName = cc.Label:createWithTTF(data.name, g_sDefaultTTFpath, g_defaultChengFontSize, textSize, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
    self.chengName:setColor(g_ColorDef.Yellow)
    self.chengName:enableBold()   --加粗
    --self.chengName:enableShadow()   --阴影
    self.chengName:enableOutline(g_ColorDef.DarkRed, 1)   --描边
    self:addChild(self.chengName, 5)  
end

--跳转点NPC
function NpcNode:initMapJumpPtData(data)  
	--G_Log_Info("NpcNode:initMapJumpPtData()")
	self.Imod = ImodAnim:create()
	self.Imod:initAnimWithName("Ani/chuansong.png", "Ani/chuansong.ani")
	self.Imod:setScale(0.8)
	self.Imod:PlayActionRepeat(0)
	self:addChild(self.Imod)

	local modSize = self.Imod:getContentSize()
	self:setContentSize(modSize)

	local textSize = cc.size(modSize.width*2, g_defaultJumpPtFontSize + 6)
    self.jumpPtName = cc.Label:createWithTTF(data.desc, g_sDefaultTTFpath, g_defaultJumpPtFontSize, textSize, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
    self.jumpPtName:setColor(g_ColorDef.Yellow)
    self:addChild(self.jumpPtName, 5)  
end


return NpcNode
