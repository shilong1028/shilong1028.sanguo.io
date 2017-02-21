
--自定义的LayerEx, 作为游戏各功能Layer的父类
local CCLayerEx = class("CCLayerEx", function()
    return display.newLayer()
end) 

function CCLayerEx:create()   --自定义的create()创建方法
    --G_Log_Info("CCLayerEx:create()")
    local layer = CCLayerEx.new()
    return layer
end

function CCLayerEx:ctor()   --new()会自动调用ctor()，如果直接调用.new()或:new()方法则会直接调用ctor()而不再调用create()
    --G_Log_Info("CCLayerEx:ctor()")
    self:initTouchEvent()
    self:initNodeEvent()
	self:init()
end

function CCLayerEx:initNodeEvent()
    --G_Log_Info("CCLayerEx:initNodeEvent()")
    local function onNodeEvent(eventName)  
        if "enter" == eventName then 
            self:onEnter() 
        elseif "exit" == eventName then  
            self:onExit()
        elseif "enterTransitionFinish" == eventName then
            self:onEnterTransitionFinish()
        elseif "exitTransitionStart" == eventName then    
            self:onExitTransitionStart()
        elseif "cleanup" == eventName then
            self:onCleanup()
        end  
    end  
  
    self:registerScriptHandler(onNodeEvent) 
end

function CCLayerEx:onEnter()
    --G_Log_Info("CCLayerEx:onEnter()")
end

function CCLayerEx:onExit()
    --G_Log_Info("CCLayerEx:onExit()")
end

function CCLayerEx:onEnterTransitionFinish()
    --G_Log_Info("CCLayerEx:onEnterTransitionFinish()")
end

function CCLayerEx:onExitTransitionStart()
    --G_Log_Info("CCLayerEx:onExitTransitionStart()")
end

function CCLayerEx:onCleanup()
    --G_Log_Info("CCLayerEx:onCleanup()")
end

function CCLayerEx:initTouchEvent()
    --G_Log_Info("CCLayerEx:initTouchEvent()")
    local function onTouchBegan(touch, event)
         self:onTouchBegan(touch, event);
    end

    local function onTouchMoved(touch, event)
         self:onTouchEnded(touch, event);
    end

    local function onTouchEnded(touch, event)
        self:onTouchEnded(touch, event)
    end

    local listener = cc.EventListenerTouchOneByOne:create()
    listener:setSwallowTouches(true)   --给触摸监听函数设置吞没事件，使得触摸上面的层的时候事件不会向下传递
    listener:registerScriptHandler(onTouchBegan,cc.Handler.EVENT_TOUCH_BEGAN )
    listener:registerScriptHandler(onTouchMoved,cc.Handler.EVENT_TOUCH_MOVED )
    listener:registerScriptHandler(onTouchEnded,cc.Handler.EVENT_TOUCH_ENDED )

    local eventDispatcher = self:getEventDispatcher()
    eventDispatcher:addEventListenerWithSceneGraphPriority(listener, self)
end

function CCLayerEx:onTouchBegan(touch, event)
    --G_Log_Info("CCLayerEx:onTouchBegan()")
    return true   --只有当onTouchBegan的返回值是true时才执行后面的onTouchMoved和onTouchEnded触摸事件
end

function CCLayerEx:onTouchMoved(touch, event)
    --G_Log_Info("CCLayerEx:onTouchMoved()")
end

function CCLayerEx:onTouchEnded(touch, event)
    --G_Log_Info("CCLayerEx:onTouchEnded()")
end

function CCLayerEx:init()  
   --G_Log_Info("CCLayerEx:init()")
       
end

--屏幕适配
function CCLayerEx:showInTheMiddle(csb)  
    --G_Log_Info("CCLayerEx:showInTheMiddle()")
    local wsize = g_WinSize  --g_VisibleSize
    local csize = csb:getContentSize()
    csb:ignoreAnchorPointForPosition(true)
    csb:setPosition(cc.p((wsize.width - csize.width)/2,(wsize.height - csize.height)/2))
end

return CCLayerEx
