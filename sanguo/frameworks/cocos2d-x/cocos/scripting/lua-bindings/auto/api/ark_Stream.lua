
--------------------------------
-- @module ark_Stream
-- @parent_module 

--------------------------------
-- 
-- @function [parent=#ark_Stream] GetSeekPos 
-- @param self
-- @return unsigned long#unsigned long ret (return value: unsigned long)
        
--------------------------------
-- @overload self, char         
-- @overload self, string         
-- @function [parent=#ark_Stream] ReadUnicodeString
-- @param self
-- @param #string str
-- @return bool#bool ret (return value: bool)

--------------------------------
-- 
-- @function [parent=#ark_Stream] WriteUInt 
-- @param self
-- @param #unsigned int l_int
-- @return ark_Stream#ark_Stream self (return value: ark_Stream)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] CreateReadStreamFromSelf 
-- @param self
-- @param #char filename
-- @return void#void ret (return value: void)
        
--------------------------------
-- @overload self, string         
-- @overload self, void, unsigned long         
-- @function [parent=#ark_Stream] WriteString
-- @param self
-- @param #void buf
-- @param #unsigned long size
-- @return ark_Stream#ark_Stream self (return value: ark_Stream)

--------------------------------
-- 
-- @function [parent=#ark_Stream] CreateReadStreamFromZip 
-- @param self
-- @param #char filename
-- @return void#void ret (return value: void)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] GetSize 
-- @param self
-- @return unsigned long#unsigned long ret (return value: unsigned long)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] CreateWriteStream 
-- @param self
-- @param #void buf
-- @param #unsigned long size
-- @param #bool needRelease
-- @return ark_Stream#ark_Stream self (return value: ark_Stream)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] ReadByte 
-- @param self
-- @return unsigned char#unsigned char ret (return value: unsigned char)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] CreateReadStreamFromStreamSeek 
-- @param self
-- @param #ark_Stream target
-- @param #unsigned long size
-- @param #bool needRelease
-- @return ark_Stream#ark_Stream self (return value: ark_Stream)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] CreateReadStreamFromUserDisk 
-- @param self
-- @param #char filename
-- @return void#void ret (return value: void)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] ReadWord 
-- @param self
-- @return unsigned short#unsigned short ret (return value: unsigned short)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] CreateReadStreamFromBuf 
-- @param self
-- @param #char buf
-- @param #unsigned long size
-- @param #bool needRelease
-- @return ark_Stream#ark_Stream self (return value: ark_Stream)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] WriteWord 
-- @param self
-- @param #unsigned short l_word
-- @return ark_Stream#ark_Stream self (return value: ark_Stream)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] ReadFloat 
-- @param self
-- @param #unsigned long size
-- @return float#float ret (return value: float)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] ReadBuffer 
-- @param self
-- @param #unsigned long size
-- @param #unsigned char buf
-- @return unsigned char#unsigned char ret (return value: unsigned char)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] GetBuffer 
-- @param self
-- @return unsigned char#unsigned char ret (return value: unsigned char)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] ReadULongInt 
-- @param self
-- @return long long#long long ret (return value: long long)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] ReadShort 
-- @param self
-- @return short#short ret (return value: short)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] ReadInt 
-- @param self
-- @return int#int ret (return value: int)
        
--------------------------------
-- @overload self, int, int         
-- @overload self, int         
-- @function [parent=#ark_Stream] Seek
-- @param self
-- @param #int offset
-- @param #int mode
-- @return ark_Stream#ark_Stream self (return value: ark_Stream)

--------------------------------
-- 
-- @function [parent=#ark_Stream] GetBufferSeek 
-- @param self
-- @return unsigned char#unsigned char ret (return value: unsigned char)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] CreateFromStreamSeek_Deep 
-- @param self
-- @param #ark_Stream target
-- @param #unsigned long size
-- @return ark_Stream#ark_Stream self (return value: ark_Stream)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] WriteByte 
-- @param self
-- @param #unsigned char l_byte
-- @return ark_Stream#ark_Stream self (return value: ark_Stream)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] ReadDouble 
-- @param self
-- @return double#double ret (return value: double)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] ReadUShort 
-- @param self
-- @return unsigned short#unsigned short ret (return value: unsigned short)
        
--------------------------------
-- 
-- @function [parent=#ark_Stream] ReadUInt 
-- @param self
-- @return unsigned int#unsigned int ret (return value: unsigned int)
        
--------------------------------
-- @overload self, char         
-- @overload self, string         
-- @function [parent=#ark_Stream] ReadString
-- @param self
-- @param #string str
-- @return bool#bool ret (return value: bool)

--------------------------------
-- 
-- @function [parent=#ark_Stream] ark_Stream 
-- @param self
-- @return ark_Stream#ark_Stream self (return value: ark_Stream)
        
return nil
