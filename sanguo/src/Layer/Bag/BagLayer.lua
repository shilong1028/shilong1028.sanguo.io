
--背包信息
local BagLayer = class("BagLayer", CCLayerEx)

local ItemCell = require("Layer.Item.ItemCell")

function BagLayer:create()   --自定义的create()创建方法
    --G_Log_Info("BagLayer:create()")
    local layer = BagLayer.new()
    return layer
end

function BagLayer:onExit()
    --G_Log_Info("BagLayer:onExit()")
end

--初始化UI界面
function BagLayer:init()  
    --G_Log_Info("BagLayer:init()")
    local csb = cc.CSLoader:createNode("csd/BagLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    --self:showInTheMiddle(csb)

    self.Image_bg = csb:getChildByName("Image_bg")
    self.titleBg = self.Image_bg:getChildByName("titleBg")
    self.Text_title = self.Image_bg:getChildByName("Text_title")

    self.Panel_Grid = self.Image_bg:getChildByName("Panel_Grid")   --物品列表父容器

    self.Button_close = self.Image_bg:getChildByName("Button_close")   
    self.Button_close:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_use = self.Image_bg:getChildByName("Button_use")   
    self.Button_use:addTouchEventListener(handler(self,self.touchEvent))  
    self.Button_del = self.Image_bg:getChildByName("Button_del")   
    self.Button_del:addTouchEventListener(handler(self,self.touchEvent))
end

function BagLayer:initBagGrid()  
    G_Log_Info("BagLayer:initBagGrid()")
    -- self.itemListVec = {
    --     {["itemId"]="401", ["num"]=1000},{["itemId"]="402", ["num"]=1000},{["itemId"]="403", ["num"]=1000},{["itemId"]="404", ["num"]=1000},
    --     {["itemId"]="501", ["num"]=2000},{["itemId"]="502", ["num"]=2000},{["itemId"]="503", ["num"]=2000},{["itemId"]="504", ["num"]=2000},{["itemId"]="505", ["num"]=2000},
    --     {["itemId"]="6001", ["num"]=3000},{["itemId"]="6002", ["num"]=3000},{["itemId"]="6003", ["num"]=3000},
    --     {["itemId"]="401", ["num"]=4000},{["itemId"]="402", ["num"]=4000},{["itemId"]="403", ["num"]=4000},{["itemId"]="404", ["num"]=4000},
    --     {["itemId"]="501", ["num"]=5000},{["itemId"]="502", ["num"]=5000},{["itemId"]="503", ["num"]=5000},{["itemId"]="504", ["num"]=5000},{["itemId"]="505", ["num"]=5000},
    --     {["itemId"]="6001", ["num"]=6000},{["itemId"]="6002", ["num"]=6000},{["itemId"]="6003", ["num"]=6000},
    --     {["itemId"]="401", ["num"]=8000},{["itemId"]="402", ["num"]=8000},{["itemId"]="403", ["num"]=8000},{["itemId"]="404", ["num"]=8000},
    --     {["itemId"]="501", ["num"]=9000},{["itemId"]="502", ["num"]=9000},{["itemId"]="503", ["num"]=9000},{["itemId"]="504", ["num"]=9000},{["itemId"]="505", ["num"]=2000},
    --     {["itemId"]="6001", ["num"]=100},{["itemId"]="6002", ["num"]=100},{["itemId"]="6003", ["num"]=100},
    --     {["itemId"]="401", ["num"]=200},{["itemId"]="402", ["num"]=200},{["itemId"]="403", ["num"]=200},{["itemId"]="404", ["num"]=200},
    --     {["itemId"]="501", ["num"]=300},{["itemId"]="502", ["num"]=300},{["itemId"]="503", ["num"]=300},{["itemId"]="504", ["num"]=300},{["itemId"]="505", ["num"]=2000},
    --     {["itemId"]="6001", ["num"]=400},{["itemId"]="6002", ["num"]=400},{["itemId"]="6003", ["num"]=400},
    --     {["itemId"]="401", ["num"]=500},{["itemId"]="402", ["num"]=500},{["itemId"]="403", ["num"]=500},{["itemId"]="404", ["num"]=500},
    --     {["itemId"]="501", ["num"]=600},{["itemId"]="502", ["num"]=600},{["itemId"]="503", ["num"]=600},{["itemId"]="504", ["num"]=600},{["itemId"]="505", ["num"]=2000},
    --     {["itemId"]="6001", ["num"]=700},{["itemId"]="6002", ["num"]=700},{["itemId"]="6003", ["num"]=700},
    --     {["itemId"]="401", ["num"]=800},{["itemId"]="402", ["num"]=800},{["itemId"]="403", ["num"]=800},{["itemId"]="404", ["num"]=800},
    --     {["itemId"]="501", ["num"]=900},{["itemId"]="502", ["num"]=900},{["itemId"]="503", ["num"]=900},{["itemId"]="504", ["num"]=900},{["itemId"]="505", ["num"]=2000},
    --     {["itemId"]="6001", ["num"]=10},{["itemId"]="6002", ["num"]=10},{["itemId"]="6003", ["num"]=10},
    --     {["itemId"]="401", ["num"]=20},{["itemId"]="402", ["num"]=20},{["itemId"]="403", ["num"]=20},{["itemId"]="404", ["num"]=20},
    --     {["itemId"]="501", ["num"]=30},{["itemId"]="502", ["num"]=30},{["itemId"]="503", ["num"]=30},{["itemId"]="504", ["num"]=30},{["itemId"]="505", ["num"]=2000},
    --     {["itemId"]="6001", ["num"]=40},{["itemId"]="6002", ["num"]=40},{["itemId"]="6003", ["num"]=40},
    --     {["itemId"]="401", ["num"]=50},{["itemId"]="402", ["num"]=50},{["itemId"]="403", ["num"]=50},{["itemId"]="404", ["num"]=50},
    --     {["itemId"]="501", ["num"]=60},{["itemId"]="502", ["num"]=60},{["itemId"]="503", ["num"]=60},{["itemId"]="504", ["num"]=60},{["itemId"]="505", ["num"]=2000},
    --     {["itemId"]="6001", ["num"]=70},{["itemId"]="6002", ["num"]=70},{["itemId"]="6003", ["num"]=70}
    -- }

    self.itemListVec = g_HeroDataMgr:GetBagXMLData()
    dump(self.itemListVec, "self.itemListVec = ")

    self.gridLineNum = 5   --一行显示数量

    local tableView = cc.TableView:create(cc.size(730, 350))
    tableView:setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL)   --cc.SCROLLVIEW_DIRECTION_HORIZONTAL
    tableView:setPosition(cc.p(0, 0))
    tableView:setDelegate()
    tableView:setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN)
    self.Panel_Grid:addChild(tableView)

    tableView:registerScriptHandler(BagLayer.scrollViewDidScroll, cc.SCROLLVIEW_SCRIPT_SCROLL)
    tableView:registerScriptHandler(BagLayer.scrollViewDidZoom, cc.SCROLLVIEW_SCRIPT_ZOOM)
    tableView:registerScriptHandler(BagLayer.tableCellTouched, cc.TABLECELL_TOUCHED)   --TableView被触摸的时候的回调，主要用于选择TableView中的Cell
    tableView:registerScriptHandler(BagLayer.cellSizeForTable, cc.TABLECELL_SIZE_FOR_INDEX)   --此回调需要返回TableView中Cell的尺寸大小
    tableView:registerScriptHandler(BagLayer.tableCellAtIndex, cc.TABLECELL_SIZE_AT_INDEX)   --此回调需要为TableView创建在某个位置的Cell
    tableView:registerScriptHandler(BagLayer.numberOfCellsInTableView, cc.NUMBER_OF_CELLS_IN_TABLEVIEW)  --此回调需要返回TableView中Cell的数量
    tableView:reloadData()
end

function BagLayer.scrollViewDidScroll(view)  --在视图滚动时接到通知，包括一个指向被滚动视图的指针
    --print("scrollViewDidScroll")
end

function BagLayer.scrollViewDidZoom(view)   --每次拖动时随时调用
    --print("scrollViewDidZoom")
end

function BagLayer.cellSizeForTable(table,idx)  --tableViewCell大小
    return 730, 100
end

--[[
注意，numberOfCellsInTableView返回的个数和TableView创建的cell数量通常是不一样的，这是因为cocos2dx设计上为了节省资源，
创建的cell数量 = tabview的高度 / 单个cell的高度 + 1。所以在触摸和选中等逻辑处理的时候，一定不能使用cell来标识。
因为同一个cell物理对象，可能会映射N个逻辑对象。
通常的做法是在tableCellAtIndex中把当前cell对应的逻辑对象存起来，这样在tableCellTouched就可以直接找到物理cell对应的逻辑对象来处理了。
]]
function BagLayer.numberOfCellsInTableView(table)   --tableViewCell数量
    local self = g_pGameLayer:GetLayerByUId(g_GameLayerTag.LAYER_TAG_BagLayer)
    return math.ceil(#self.itemListVec/self.gridLineNum)
end

function BagLayer.tableCellTouched(table,cell)
    --G_Log_Info("BagLayer:tableCellTouched(), cellIndex = %d", cell:getIdx())
end

function BagLayer.tableCellAtIndex(table, idx)
    --G_Log_Info("BagLayer:tableCellAtIndex(), idx = %d", idx)
    local self = g_pGameLayer:GetLayerByUId(g_GameLayerTag.LAYER_TAG_BagLayer)
    local bIdx = idx*self.gridLineNum
    local vecData = {}
    for i=1, self.gridLineNum do
        local data = self.itemListVec[bIdx + i]
        if data and data.itemId then
            --table.insert(vecData, data)
            vecData[i] = data
        end
    end

    local cell = table:dequeueCell()
    if nil == cell then
        cell = cc.TableViewCell:new()
        for i=1, self.gridLineNum do
            local itemCell = ItemCell:new()
            itemCell:setPosition(140*(i-1)+40, 0)
            itemCell:setTag(1000 + i)
            --itemCell:setVisible(false)
            cell:addChild(itemCell)   
        end
    end

    for i=1, self.gridLineNum do
        local itemCell = cell:getChildByTag(1000+i)
        if i <= #vecData then
            local itemId = vecData[i].itemId
            local itemData = g_pTBLMgr:getItemConfigTBLDataById(itemId) 
            if itemData then
                itemData.num = vecData[i].num 
                itemCell:initData(itemData)
                itemCell:setVisible(true)
            end
        else
            itemCell:setVisible(false)
        end
    end

    return cell
end

function BagLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_close then  
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_BagLayer)
        elseif sender == self.Button_use then   
        elseif sender == self.Button_del then   
        end
    end
end


return BagLayer
