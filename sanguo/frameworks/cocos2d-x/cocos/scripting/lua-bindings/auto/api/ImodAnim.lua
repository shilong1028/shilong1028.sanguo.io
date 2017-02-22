
--------------------------------
-- @module ImodAnim
-- @extend Node
-- @parent_module 

--------------------------------
-- 
-- @function [parent=#ImodAnim] stopCurrentAni 
-- @param self
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] playFirstFrameIndex 
-- @param self
-- @param #int actionIdx
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] setFlippedX 
-- @param self
-- @param #bool flip
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] setMaxAniNum 
-- @param self
-- @param #int value
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] setFlippedY 
-- @param self
-- @param #bool flip
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] getNeedImageAsyncLoad 
-- @param self
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] PlayActionRepeat 
-- @param self
-- @param #int actIndex
-- @param #float durTime
-- @param #bool runTimerNow
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] setNeedImageAsyncLoad 
-- @param self
-- @param #bool bNeed
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] setBlendColor 
-- @param self
-- @param #color4f_table color
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] initAnimWithName 
-- @param self
-- @param #char utfPic
-- @param #char utfAni
-- @param #bool clearSpr
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] SetFrameCallBack 
-- @param self
-- @param #int frame
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] setOpacity 
-- @param self
-- @param #int Opacity
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] init 
-- @param self
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] unregisterScriptEndCBHandler 
-- @param self
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] ToggleAction 
-- @param self
-- @param #bool action
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] getOpacity 
-- @param self
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] transPathFormat 
-- @param self
-- @param #string path
-- @return string#string ret (return value: string)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] setExtFrameData 
-- @param self
-- @param #string txtFullPath
-- @param #array_table frameVec
-- @param #array_table timeVec
-- @param #int time_ms
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] resume 
-- @param self
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] stop 
-- @param self
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] GetHeight 
-- @param self
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] setGhost 
-- @param self
-- @param #bool isGhost
-- @param #float ghostDurTime
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] sethsv 
-- @param self
-- @param #vec3_table vec3
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] printAnimZorder 
-- @param self
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- @overload self, char         
-- @overload self, int         
-- @function [parent=#ImodAnim] removeAnim
-- @param self
-- @param #int ind
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)

--------------------------------
-- 
-- @function [parent=#ImodAnim] IsInitAnimation 
-- @param self
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] addAnimWithName 
-- @param self
-- @param #char utfPic
-- @param #char utfAni
-- @param #int Zorder
-- @param #color3b_table color
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] setColor 
-- @param self
-- @param #color3b_table sprColor
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] SetCurrentAction 
-- @param self
-- @param #int actIndex
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] GetColor 
-- @param self
-- @return color3b_table#color3b_table ret (return value: color3b_table)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] sethsvByIndex 
-- @param self
-- @param #int idx
-- @param #vec3_table vec3
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] resetAniData 
-- @param self
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] registerScriptEndCBHandler 
-- @param self
-- @param #int nHandler
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- @overload self, char, int         
-- @overload self, int, int         
-- @function [parent=#ImodAnim] ChangeZorderByIndex
-- @param self
-- @param #int index
-- @param #int zOrder
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)

--------------------------------
-- 
-- @function [parent=#ImodAnim] PlayAction 
-- @param self
-- @param #int actIndex
-- @param #float durTime
-- @param #bool isGhost
-- @param #float ghostDurTime
-- @param #bool runTimerNow
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] create 
-- @param self
-- @return ImodAnim#ImodAnim ret (return value: ImodAnim)
        
--------------------------------
-- 
-- @function [parent=#ImodAnim] ImodAnim 
-- @param self
-- @return ImodAnim#ImodAnim self (return value: ImodAnim)
        
return nil
