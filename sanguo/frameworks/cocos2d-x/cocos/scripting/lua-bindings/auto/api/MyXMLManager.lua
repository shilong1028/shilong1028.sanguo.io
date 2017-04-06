
--------------------------------
-- @module MyXMLManager
-- @parent_module 

--------------------------------
-- 
-- @function [parent=#MyXMLManager] loadXMLFile 
-- @param self
-- @param #char strXmlPath
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#MyXMLManager] saveXMLFile 
-- @param self
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#MyXMLManager] deleteAttribute 
-- @param self
-- @param #char node
-- @param #char name
-- @return MyXMLManager#MyXMLManager self (return value: MyXMLManager)
        
--------------------------------
-- 
-- @function [parent=#MyXMLManager] removeNode 
-- @param self
-- @param #char node
-- @return MyXMLManager#MyXMLManager self (return value: MyXMLManager)
        
--------------------------------
-- 
-- @function [parent=#MyXMLManager] getNodeAttrValue 
-- @param self
-- @param #char node
-- @param #char name
-- @return string#string ret (return value: string)
        
--------------------------------
-- 
-- @function [parent=#MyXMLManager] setNodeAttrValue 
-- @param self
-- @param #char node
-- @param #char name
-- @param #char value
-- @return MyXMLManager#MyXMLManager self (return value: MyXMLManager)
        
--------------------------------
-- 
-- @function [parent=#MyXMLManager] isNULL 
-- @param self
-- @param #char node
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- 
-- @function [parent=#MyXMLManager] removeAllChildNode 
-- @param self
-- @param #char node
-- @return MyXMLManager#MyXMLManager self (return value: MyXMLManager)
        
--------------------------------
-- 
-- @function [parent=#MyXMLManager] addChildNode 
-- @param self
-- @param #char node
-- @return MyXMLManager#MyXMLManager self (return value: MyXMLManager)
        
--------------------------------
-- 
-- @function [parent=#MyXMLManager] createXMLFile 
-- @param self
-- @param #char strFileName
-- @param #char rootNode
-- @return bool#bool ret (return value: bool)
        
--------------------------------
-- @overload self, char         
-- @overload self         
-- @function [parent=#MyXMLManager] MyXMLManager
-- @param self
-- @param #char strXMLPath
-- @return MyXMLManager#MyXMLManager self (return value: MyXMLManager)

return nil
