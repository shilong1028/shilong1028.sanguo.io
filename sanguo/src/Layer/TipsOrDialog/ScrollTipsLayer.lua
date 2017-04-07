
--滚动列表叠加显示提示界面
local ScrollTipsLayer = class("ScrollTipsLayer", cc.Node)

function ScrollTipsLayer:create()
    local layer = ScrollTipsLayer.new()
    layer:init()
    return layer
end

function ScrollTipsLayer:ctor()
    self.m_addArray = {}    --还未添加的Item数组
    self.m_itemArray = {}   --累积的item数组
    self.m_nextInsertIdx = 1  --下次插入列表的item索引
    self.m_bInserting = false   --是否正在插入item
end

function ScrollTipsLayer:onExit()
    self.m_addArray = {}    --还未添加的Item数组
    self.m_itemArray = {}   --累积的item数组
    self.m_nextInsertIdx = 1  --下次插入列表的item索引
    self.m_bInserting = false   --是否正在插入item
end

function ScrollTipsLayer:init()       
    self:setContentSize(g_WinSize)
    ccui.Helper:doLayout(self)
    self:setPosition(cc.p(0,0))

    local function onNodeEvent(event)  
        if "exit" == event then
            self:onExit()  
        end  
    end
    self:registerScriptHandler(onNodeEvent)
end

--[[
    tipsArr = {
        function  g_ScrollTips_text:ctor()
            self.text = ""
            self.color = g_ColorDef.White
            self.fontSize = g_defaultFontSize
        end
    }
]]--
function ScrollTipsLayer:setTexts(tipsArr)   
    if not tipsArr then
        return
    end
    for idx=1, #(tipsArr)do
        if( tipsArr[idx].text and tipsArr[idx].text ~= "") then
            table.insert(self.m_addArray,tipsArr[idx])    --还未添加的Item数组
            table.insert(self.m_itemArray,tipsArr[idx])   --累积的item数组
        end
    end
    
    local function insertItemData(index)
        if #(self.m_itemArray) < index then
            self.m_bInserting = false
            self.m_addArray = {}
            return
        end
        
        self.m_bInserting = true
        local item = self.m_itemArray[index]
  
        local cellColor = g_ColorDef.White   --默认颜色
        local cellText = item.text
        local fontSize = g_defaultFontSize   --默认字体大小
        
        if(item.color ~= nil) then
            cellColor = item.color
        end    
        if item.fontSize then
            fontSize = item.fontSize
        end
      
        local cellSize = cc.size(400, 0)
        local itemLabel = cc.Label:createWithTTF(cellText, g_sDefaultTTFpath, fontSize, cellSize, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
                            --文本，字体库或字体文件，字体大小，label的尺寸大小（默认不设置尺寸），水平对齐方式（默认左对齐），垂直对齐方式（默认顶部）
        itemLabel:setColor(cellColor)
        itemLabel:setPosition(cc.p(g_WinSize.width/2, g_WinSize.height - 200)) 
        itemLabel:setOpacity(0)  
        self:addChild(itemLabel,1)

        local itemBk = cc.Scale9Sprite:create("Image/Image_tipsBg.png", cc.rect(10, 10, 10, 10))  
        itemBk:setContentSize(cc.size(400, itemLabel:getContentSize().height))
        itemBk:setPosition(cc.p(itemLabel:getPosition()))        
        itemBk:setOpacity(128)    
        self:addChild(itemBk)   
        
        local fadeSqu = cc.Sequence:create(cc.FadeIn:create(0.4), cc.DelayTime:create(0.4), cc.FadeOut:create(0.4))
        local moveBy = cc.MoveBy:create(2.0, cc.p(0, cellSize.height * 5))   --最多同屏显示五个tips
        local createDelay = cc.Sequence:create(cc.DelayTime:create(0.4), cc.CallFunc:create(function()   --每个tips创建的间隔时间
            self.m_nextInsertIdx = self.m_nextInsertIdx + 1           
            if #(self.m_itemArray) >= self.m_nextInsertIdx then
                insertItemData(self.m_nextInsertIdx)
            else
                self.m_bInserting = false
                self.m_addArray = {}
            end
        end),cc.DelayTime:create(0.4))
        
        itemLabel:runAction(cc.Sequence:create(cc.Spawn:create(fadeSqu:clone(), moveBy:clone()), cc.Hide:create(),cc.CallFunc:create(function() 
            itemLabel:removeFromParent()
        end))) 
        
        itemBk:runAction(cc.Sequence:create(cc.Spawn:create(fadeSqu,moveBy,createDelay), cc.Hide:create(), cc.CallFunc:create(function() 
            itemBk:removeFromParent()
            if(self.m_bInserting == false) then
                g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_ScrollTipsLayer)
            end
        end))) 
    end
    
    if(self.m_bInserting == false) then
        if #(self.m_addArray) > 0 then
            insertItemData(self.m_nextInsertIdx)
        else
            self.m_addArray = {}
        end      
    end
     
end

return ScrollTipsLayer