
--------------------------------
-- @module SystemHelper
-- @parent_module 

--------------------------------
-- 
-- @function [parent=#SystemHelper] GetHexString 
-- @param self
-- @param #char buf
-- @param #int len
-- @param #bool blank
-- @return string#string ret (return value: string)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] FilterLimitedMsg 
-- @param self
-- @param #string msg
-- @param #bool isReg
-- @return string#string ret (return value: string)
        
--------------------------------
-- @overload self, double, double         
-- @overload self, int, int         
-- @function [parent=#SystemHelper] Min
-- @param self
-- @param #int a
-- @param #int b
-- @return int#int ret (return value: int)

--------------------------------
-- 
-- @function [parent=#SystemHelper] GetVersionStr 
-- @param self
-- @param #int vCode
-- @return string#string ret (return value: string)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] RandomRange 
-- @param self
-- @param #int min
-- @param #int max
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] GetCurTick 
-- @param self
-- @return double#double ret (return value: double)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] IsInTriangle 
-- @param self
-- @param #vec2_table pt
-- @param #vec2_table tr1
-- @param #vec2_table tr2
-- @param #vec2_table tr3
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] FloatApproxEquals 
-- @param self
-- @param #float f1
-- @param #float f2
-- @param #float Precision
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- @overload self, double, double         
-- @overload self, int, int         
-- @function [parent=#SystemHelper] Max
-- @param self
-- @param #int a
-- @param #int b
-- @return int#int ret (return value: int)

--------------------------------
-- 
-- @function [parent=#SystemHelper] reloadGame 
-- @param self
-- @return SystemHelper#SystemHelper self (return value: SystemHelper)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] CalcRectCenterPoint 
-- @param self
-- @param #rect_table r
-- @return vec2_table#vec2_table ret (return value: vec2_table)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] bit_and 
-- @param self
-- @param #int a
-- @param #int b
-- @return int#int ret (return value: int)
        
--------------------------------
-- @overload self, vec2_table, vec2_table         
-- @overload self, float, float, float, float         
-- @function [parent=#SystemHelper] calcDistance
-- @param self
-- @param #float x1
-- @param #float y1
-- @param #float x2
-- @param #float y2
-- @return float#float ret (return value: float)

--------------------------------
-- 
-- @function [parent=#SystemHelper] gettm 
-- @param self
-- @param #long long timestamp
-- @return tm#tm ret (return value: tm)
        
--------------------------------
-- @overload self, int, int, int, int         
-- @overload self, int, int, int         
-- @overload self, int, int, int, int, int         
-- @overload self, int, int, int, int, int, int         
-- @overload self, int, int, int, int, int, int, int         
-- @function [parent=#SystemHelper] IsEqualAny
-- @param self
-- @param #int v
-- @param #int r1
-- @param #int r2
-- @param #int r3
-- @param #int r4
-- @param #int r5
-- @param #int r6
-- @return int#int ret (return value: int)

--------------------------------
-- 
-- @function [parent=#SystemHelper] isNearRedColor 
-- @param self
-- @param #color3b_table a
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] bit_r 
-- @param self
-- @param #int a
-- @param #int b
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] GetHexStringByStream 
-- @param self
-- @param #ark_Stream stream
-- @param #int pos
-- @param #int len
-- @param #bool blank
-- @return string#string ret (return value: string)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] bit_or 
-- @param self
-- @param #int a
-- @param #int b
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] isNearYellowColor 
-- @param self
-- @param #color3b_table a
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] isNearBlueColor 
-- @param self
-- @param #color3b_table a
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] GetHexStringByBuf 
-- @param self
-- @param #char buf
-- @param #int len
-- @param #bool blank
-- @return string#string ret (return value: string)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] bit_l 
-- @param self
-- @param #int a
-- @param #int b
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] getTimeStamp 
-- @param self
-- @return long#long ret (return value: long)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] InRange 
-- @param self
-- @param #int v
-- @param #int min
-- @param #int max
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] bit_xor 
-- @param self
-- @param #int a
-- @param #int b
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] isNearGreenColor 
-- @param self
-- @param #color3b_table a
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] isSameColor 
-- @param self
-- @param #color3b_table a
-- @param #color3b_table b
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] GetStreamFromHexString 
-- @param self
-- @param #string str
-- @param #ark_Stream stream
-- @param #int maxLen
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#SystemHelper] getHSLGlprogramState 
-- @param self
-- @return GLProgramState#GLProgramState ret (return value: cc.GLProgramState)
        
return nil
