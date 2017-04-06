
--------------------------------
-- @module StringHelper
-- @parent_module 

--------------------------------
-- 
-- @function [parent=#StringHelper] CalcUnicodeLen 
-- @param self
-- @param #char pUtf8
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#StringHelper] AnsiToUtf8 
-- @param self
-- @param #char buf
-- @return string#string ret (return value: string)
        
--------------------------------
-- 
-- @function [parent=#StringHelper] ReplaceStr 
-- @param self
-- @param #string str
-- @param #char pOldStr
-- @param #char pNewStr
-- @return string#string ret (return value: string)
        
--------------------------------
-- 
-- @function [parent=#StringHelper] FloatToStr 
-- @param self
-- @param #float v
-- @return string#string ret (return value: string)
        
--------------------------------
-- 
-- @function [parent=#StringHelper] StrToInt 
-- @param self
-- @param #string s
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#StringHelper] IntToStr 
-- @param self
-- @param #int val
-- @return string#string ret (return value: string)
        
--------------------------------
-- 
-- @function [parent=#StringHelper] UnicodeToUtf8 
-- @param self
-- @param #char to
-- @param #unsigned int toLen
-- @param #char from
-- @param #unsigned int fromLen
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#StringHelper] splitStr 
-- @param self
-- @param #array_table arr
-- @param #string str
-- @param #char tagChar
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#StringHelper] IsBeginWith 
-- @param self
-- @param #string s
-- @param #char c
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#StringHelper] Utf8ToAnsi 
-- @param self
-- @param #char buf
-- @return string#string ret (return value: string)
        
--------------------------------
-- 
-- @function [parent=#StringHelper] StrToFloat 
-- @param self
-- @param #string s
-- @return float#float ret (return value: float)
        
--------------------------------
-- 
-- @function [parent=#StringHelper] TruncateByUnicode 
-- @param self
-- @param #char pUtf8
-- @param #unsigned int maxLen
-- @return string#string ret (return value: string)
        
--------------------------------
-- 
-- @function [parent=#StringHelper] Utf8ToUnicode 
-- @param self
-- @param #char to
-- @param #unsigned int toLen
-- @param #char from
-- @param #unsigned int fromLen
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#StringHelper] IsEndWidth 
-- @param self
-- @param #string s
-- @param #char c
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- @overload self, string, string         
-- @overload self, char, char         
-- @function [parent=#StringHelper] IsSameStr
-- @param self
-- @param #char s1
-- @param #char s2
-- @return bool#bool ret (return value: bool)

--------------------------------
-- 
-- @function [parent=#StringHelper] IsNumAndLetterOnly 
-- @param self
-- @param #string str
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#StringHelper] My_strnicmp 
-- @param self
-- @param #char dst
-- @param #char src
-- @param #int count
-- @return int#int ret (return value: int)
        
return nil
