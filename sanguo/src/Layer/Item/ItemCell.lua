--物品装备Cell
--不同品质的物品有不同的ID，和名称
local ItemCell = class("ItemCell", CCLayerEx)

function ItemCell:create()   --自定义的create()创建方法
    --G_Log_Info("ItemCell:create()")
    local layer = ItemCell.new()
    return layer
end

--初始化UI界面
function ItemCell:init()  
    --G_Log_Info("ItemCell:init()")
    local csb = cc.CSLoader:createNode("csd/ItemCell.csb")
    self:addChild(csb)
    self:setContentSize(cc.size(90, 90))

    self.Image_bg = csb:getChildByName("Image_bg")  
    self.Image_bg:setTouchEnabled(true)
    self.Image_bg:addTouchEventListener(handler(self,self.touchEvent))

    self.Image_color = csb:getChildByName("Image_color")   --品质，银灰1-3/绿色4-10/蓝色11-25/紫色26-50/橙色51-99
    self.Text_name = csb:getChildByName("Text_name")      --名称
    self.Text_num = csb:getChildByName("Text_num")   -- 数量
    self.Text_type = csb:getChildByName("Text_type")   --金币|粮草|护甲|武器|马匹|道具|令牌|物品
end

function ItemCell:initData(itemData)  
    --G_Log_Info("ItemCell:initData()")
    local bgSize = self.Image_bg:getContentSize()
    if not self.headImg then
        self.headImg =  ccui.ImageView:create(string.format("Item/%s.png", itemData.id_str), ccui.TextureResType.localType)
        self.headImg:setScale(bgSize.width/self.headImg:getContentSize().width)
        self.headImg:setPosition(cc.p(bgSize.width/2, bgSize.height/2))
        self.Image_bg:addChild(self.headImg)
    end

    self.Text_name:setString(itemData.name)    --名称
    self.Text_num:setString(string.format(lua_Item_String1, itemData.num))  --数量
    self.Text_type:setString(lua_Item_TypeStrs[itemData.type])    --金币|粮草|护甲|武器|马匹|道具|令牌|物品

    local colorIdx = G_GetGeneralColorIdxByLv(itemData.quality)
    if colorIdx > 0 and colorIdx <=5 then
        self.Image_color:setVisible(true)
        self.Image_color:loadTexture(string.format("public_colorBg%d.png", colorIdx), ccui.TextureResType.plistType)
    else
        self.Image_color:setVisible(false)
    end
end

function ItemCell:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Image_bg then   

        end
    end
end

return ItemCell
