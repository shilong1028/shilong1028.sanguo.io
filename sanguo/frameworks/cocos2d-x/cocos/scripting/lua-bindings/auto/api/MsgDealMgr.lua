
--------------------------------
-- @module MsgDealMgr
-- @parent_module 

--------------------------------
-- 
-- @function [parent=#MsgDealMgr] QueryPackAndSend 
-- @param self
-- @param #ark_Stream s
-- @return MsgDealMgr#MsgDealMgr self (return value: MsgDealMgr)
        
--------------------------------
-- 
-- @function [parent=#MsgDealMgr] registerLock 
-- @param self
-- @param #int cmd
-- @param #int ms
-- @return MsgDealMgr#MsgDealMgr self (return value: MsgDealMgr)
        
--------------------------------
-- 
-- @function [parent=#MsgDealMgr] unregisterLock 
-- @param self
-- @param #int cmd
-- @param #int ms
-- @return MsgDealMgr#MsgDealMgr self (return value: MsgDealMgr)
        
--------------------------------
-- 
-- @function [parent=#MsgDealMgr] QueryMsgHeader 
-- @param self
-- @param #unsigned int MEG_TAG
-- @return MsgDealMgr#MsgDealMgr self (return value: MsgDealMgr)
        
--------------------------------
-- 
-- @function [parent=#MsgDealMgr] QueryInitWithCMD 
-- @param self
-- @param #int maxlen
-- @param #ark_Stream s
-- @param #int cmd
-- @return MsgDealMgr#MsgDealMgr self (return value: MsgDealMgr)
        
--------------------------------
-- 
-- @function [parent=#MsgDealMgr] QueryMsgBuffer 
-- @param self
-- @param #char buf
-- @param #int size
-- @return MsgDealMgr#MsgDealMgr self (return value: MsgDealMgr)
        
return nil
