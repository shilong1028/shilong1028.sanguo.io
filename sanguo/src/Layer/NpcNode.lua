
--NpcNode用于构造静态展示模型，比如NPC，展示模型等
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


return NpcNode
