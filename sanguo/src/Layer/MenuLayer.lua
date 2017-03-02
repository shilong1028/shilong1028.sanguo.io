
--MenuLayer用于按钮菜单点击处理等
local MenuLayer = class("MenuLayer", CCLayerEx) --填入类名

function MenuLayer:create()   --自定义的create()创建方法
    --G_Log_Info("MenuLayer:create()")
    local layer = MenuLayer.new()
    return layer
end

function MenuLayer:onExit()
    --G_Log_Info("MenuLayer:onExit()")
end

function MenuLayer:init()  
    --G_Log_Info("MenuLayer:init()")
end

return MenuLayer
