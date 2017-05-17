
--------------------------------
-- @module CCAysLabel
-- @extend Node
-- @parent_module 

--------------------------------
-- 
-- @function [parent=#CCAysLabel] reset 
-- @param self
-- @param #string Text
-- @param #size_table ContentSize
-- @param #color3b_table color
-- @param #string fontName
-- @param #int FontSize
-- @param #bool needStroke
-- @param #bool NeedShadow_
-- @return CCAysLabel#CCAysLabel self (return value: CCAysLabel)
        
--------------------------------
-- 
-- @function [parent=#CCAysLabel] getSize 
-- @param self
-- @return size_table#size_table ret (return value: size_table)
        
--------------------------------
-- @overload self, string, size_table, color3b_table, string, int, bool, bool         
-- @overload self         
-- @function [parent=#CCAysLabel] create
-- @param self
-- @param #string Text
-- @param #size_table ContentSize
-- @param #color3b_table color
-- @param #string fontName
-- @param #int FontSize
-- @param #bool needStroke
-- @param #bool NeedShadow
-- @return CCAysLabel#CCAysLabel ret (return value: CCAysLabel)

--------------------------------
-- 
-- @function [parent=#CCAysLabel] CCAysLabel 
-- @param self
-- @return CCAysLabel#CCAysLabel self (return value: CCAysLabel)
        
return nil
