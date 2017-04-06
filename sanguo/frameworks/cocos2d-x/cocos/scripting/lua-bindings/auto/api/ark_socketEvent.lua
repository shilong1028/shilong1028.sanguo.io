
--------------------------------
-- @module ark_socketEvent
-- @extend ClientSocketEvent
-- @parent_module 

--------------------------------
-- 
-- @function [parent=#ark_socketEvent] getOnRecPack 
-- @param self
-- @return int#int ret (return value: int)
        
--------------------------------
-- 
-- @function [parent=#ark_socketEvent] OnRunExData 
-- @param self
-- @param #ClientSocket s
-- @return ark_socketEvent#ark_socketEvent self (return value: ark_socketEvent)
        
--------------------------------
-- 
-- @function [parent=#ark_socketEvent] OnConnect 
-- @param self
-- @param #ClientSocket s
-- @return ark_socketEvent#ark_socketEvent self (return value: ark_socketEvent)
        
--------------------------------
-- 
-- @function [parent=#ark_socketEvent] OnSocketError 
-- @param self
-- @param #ClientSocket s
-- @return ark_socketEvent#ark_socketEvent self (return value: ark_socketEvent)
        
--------------------------------
-- 
-- @function [parent=#ark_socketEvent] OnClose 
-- @param self
-- @param #ClientSocket s
-- @return ark_socketEvent#ark_socketEvent self (return value: ark_socketEvent)
        
--------------------------------
-- 
-- @function [parent=#ark_socketEvent] releaseStream 
-- @param self
-- @return ark_socketEvent#ark_socketEvent self (return value: ark_socketEvent)
        
--------------------------------
-- 
-- @function [parent=#ark_socketEvent] OnData 
-- @param self
-- @param #ClientSocket s
-- @param #char data
-- @param #int dataLen
-- @return ark_socketEvent#ark_socketEvent self (return value: ark_socketEvent)
        
--------------------------------
-- 
-- @function [parent=#ark_socketEvent] OnConnectFail 
-- @param self
-- @param #ClientSocket s
-- @return ark_socketEvent#ark_socketEvent self (return value: ark_socketEvent)
        
--------------------------------
-- 
-- @function [parent=#ark_socketEvent] getNode 
-- @param self
-- @return Node#Node ret (return value: cc.Node)
        
--------------------------------
-- 
-- @function [parent=#ark_socketEvent] getStream 
-- @param self
-- @return ark_Stream#ark_Stream ret (return value: ark_Stream)
        
--------------------------------
-- 
-- @function [parent=#ark_socketEvent] ark_socketEvent 
-- @param self
-- @return ark_socketEvent#ark_socketEvent self (return value: ark_socketEvent)
        
return nil
