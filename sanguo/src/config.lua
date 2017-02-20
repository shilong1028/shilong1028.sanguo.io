
-- 0 - disable debug info, 1 - less debug info, 2 - verbose debug info
DEBUG = 2

-- use framework, will disable all deprecated API, false - use legacy API
CC_USE_FRAMEWORK = true

-- show FPS on screen
CC_SHOW_FPS = true

-- disable create unexpected global variable
--关闭全局变量的检测功能，使用户可以随意定义全局变量
CC_DISABLE_GLOBAL = false  --true

UI_DESIGNSIZE = {["width"] = 1280, ["height"] = 720}

-- for module display
CC_DESIGN_RESOLUTION = {
    width = UI_DESIGNSIZE.width,
    height = UI_DESIGNSIZE.height,
    autoscale = "FIXED_HEIGHT",
    --"SHOW_ALL",   --屏幕宽、高分别和设计分辨率宽、高计算缩放因子，取较(小)者作为宽、高的缩放因子。保证了设计区域全部显示到屏幕上，但可能会有黑边。
     --"EXACT_FIT",   --屏幕宽 与 设计宽比 作为X方向的缩放因子，屏幕高 与 设计高比 作为Y方向的缩放因子。保证了设计区域完全铺满屏幕，但是可能会出现图像拉伸。
     --"NO_BORDER",   --屏幕宽、高分别和设计分辨率宽、高计算缩放因子，取较(大)者作为宽、高的缩放因子。保证了设计区域总能一个方向上铺满屏幕，而另一个方向一般会超出屏幕区域。
     --"FIXED_HEIGHT",   --保持传入的设计分辨率高度不变，根据屏幕分辨率修正设计分辨率的宽度。
    callback = function(framesize)
        local ratio = framesize.width / framesize.height
        -- if ratio <= 1.34 then
        --     -- iPad 768*1024(1536*2048) is 4:3 screen
        --     return {autoscale = "FIXED_WIDTH"}   --保持传入的设计分辨率宽度不变，根据屏幕分辨率修正设计分辨率的高度。
        -- end
        local ratio2 = UI_DESIGNSIZE.width / UI_DESIGNSIZE.height
        if ratio2 > ratio then
            return {autoscale = "FIXED_WIDTH"}
        end
    end
}
