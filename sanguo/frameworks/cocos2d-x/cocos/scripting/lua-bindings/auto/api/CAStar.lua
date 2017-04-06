
--------------------------------
-- @module CAStar
-- @parent_module 

--------------------------------
-- 
-- @function [parent=#CAStar] FindNextPathByAngle 
-- @param self
-- @param #int startingX
-- @param #int startingY
-- @param #float angle
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#CAStar] SetCanWalk 
-- @param self
-- @param #bool walk
-- @param #unsigned short x
-- @param #unsigned short y
-- @return CAStar#CAStar self (return value: CAStar)
        
--------------------------------
-- 
-- @function [parent=#CAStar] FindPath 
-- @param self
-- @param #int startingX
-- @param #int startingY
-- @param #int targetX
-- @param #int targetY
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#CAStar] GetPath 
-- @param self
-- @return array_table#array_table ret (return value: array_table)
        
--------------------------------
-- 
-- @function [parent=#CAStar] Init 
-- @param self
-- @param #int mid
-- @param #int mapW
-- @param #int mapH
-- @param #float tileSize
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#CAStar] CanWalk 
-- @param self
-- @param #unsigned short x
-- @param #unsigned short y
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#CAStar] CAStar 
-- @param self
-- @return CAStar#CAStar self (return value: CAStar)
        
return nil
