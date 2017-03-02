--PlayerNode用于展示有属性的活动的模型，比如主角，敌怪等
local PlayerNode = class("PlayerNode", CCLayerEx) --填入类名

function PlayerNode:create()   --自定义的create()创建方法
    --G_Log_Info("PlayerNode:create()")
    local layer = PlayerNode.new()
    return layer
end

function PlayerNode:onExit()
    --G_Log_Info("PlayerNode:onExit()")

end

function PlayerNode:init()  
    --G_Log_Info("PlayerNode:init()")
end


return PlayerNode