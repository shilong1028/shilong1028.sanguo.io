#include "ark_Stream.h"
#include "ark_File.h"
#include "ark_Utility.h"

int ark_Stream_Count = 0;
ark_Stream::ark_Stream()
:m_stream(NULL),m_size(0),m_seek(0),m_need_realse_flag(true)
{
	ark_Stream_Count++;
	//cocos2d::log("ark_Stream_Count create:%d", ark_Stream_Count);
}

ark_Stream::~ark_Stream()
{
	if(this->m_need_realse_flag && this->m_stream)
	{
		delete[] (char*)this->m_stream;
		this->m_stream = NULL;
	}
	ark_Stream_Count--;
	//cocos2d::log("ark_Stream_Count delete:%d", ark_Stream_Count);
}

void* ark_Stream::CreateReadStreamFromSelf(const char *filename)
{
	this->m_stream = ark_File::shareFile()->ark_File_ReadData_FromSelf(filename,&this->m_size);
	return this->m_stream;
}
void* ark_Stream::CreateReadStreamFromZip(const char *filename)
{
	this->m_stream = ark_File::shareFile()->ark_File_ReadData_FromZip(filename,&this->m_size);
	return this->m_stream;
}

void* ark_Stream::CreateReadStreamFromUserDisk(const char *filename)
{
	this->m_stream = ark_File::shareFile()->ark_File_ReadData_FromUserDisk(filename,&this->m_size);
	return this->m_stream;
}
void ark_Stream::CreateReadStreamFromBuf(const char *buf,const unsigned long size, bool needRelease)
{
	this->m_stream = (void*)buf;
	this->m_size = size;
	this->m_need_realse_flag = needRelease;
}

void ark_Stream::CreateReadStreamFromStreamSeek(ark_Stream* target, const unsigned long size, bool needRelease)
{
	this->m_stream = target->GetBufferSeek();
	this->m_size = size;
	this->m_need_realse_flag = needRelease;
}

void ark_Stream::CreateFromStreamSeek_Deep(ark_Stream* target, const unsigned long size)
{
	this->m_stream = new unsigned char[size];
	this->m_size = size;
	this->m_seek = target->GetSeekPos();
	memcpy(this->m_stream, target->GetBuffer(), this->m_size);
	this->m_need_realse_flag = true; //要弄成析构时候自动销毁指向内存 
}

void ark_Stream::CreateWriteStream(void *buf,const unsigned long size, bool needRelease)
{
	this->m_stream = buf;
	this->m_size = size;
	this->m_need_realse_flag = needRelease;
}

void ark_Stream::Seek(int seek)
{
	this->m_seek = seek;
}

unsigned char ark_Stream::ReadByte(unsigned char defValue)
{
    //检查是否有足够空间
    if(GetSize() - GetSeekPos() < 1)
    {
#ifdef DEBUG
        assert(false);
#endif
        return defValue;
    }

	return ((unsigned char*)this->m_stream)[this->m_seek++];
}

unsigned short ark_Stream::ReadWord(unsigned short defValue)
{
    //检查是否有足够空间
    if(GetSize() - GetSeekPos() < 2)
    {
#ifdef DEBUG
        assert(false);
#endif    
        return defValue;
    }

	short aa;
	unsigned char bb[2];
	char *buf = (char*)this->m_stream;
	bb[0] = ((unsigned char*)this->m_stream)[this->m_seek++];
	bb[1] = ((unsigned char*)this->m_stream)[this->m_seek++];
	aa = (short)((short)(bb[1] <<8)|(short)(bb[0]));
	return aa;
}

 unsigned short ark_Stream::ReadUShort(unsigned short defValue)
 {
    //检查是否有足够空间
    if(GetSize() - GetSeekPos() < 2)
    {
#ifdef DEBUG
        assert(false);
#endif
        return defValue;
    }

	short aa;
	unsigned char bb[2];
	char *buf = (char*)this->m_stream;
	bb[0] = ((unsigned char*)this->m_stream)[this->m_seek++];
	bb[1] = ((unsigned char*)this->m_stream)[this->m_seek++];

	short h = bb[1] & 0xFF;
	h = h<<8;
	unsigned char l = bb[0] & 0xFF;
	aa = (h | l);
	return aa;
 }

 short ark_Stream::ReadShort(short defValue)
 {
    //检查是否有足够空间
    if(GetSize() - GetSeekPos() < 2)
    {
#ifdef DEBUG
        assert(false);
#endif
        return defValue;
    }

    short ret;
    unsigned char bb[2];
    char *buf = (char*)this->m_stream;
    bb[0] = ((unsigned char*)this->m_stream)[this->m_seek++];
    bb[1] = ((unsigned char*)this->m_stream)[this->m_seek++];

    short h = bb[1] & 0xFF;
    h = h<<8;
    unsigned char l = bb[0] & 0xFF;
    ret = (h | l);
    return ret;
 }

unsigned int ark_Stream::ReadUInt(unsigned int defValue)
{
    //检查是否有足够空间
    if(GetSize() - GetSeekPos() < 4)
    {
#ifdef DEBUG
        assert(false);
#endif
        return defValue;
    }

	int aa;
	unsigned char bb[4];
	int i = 0;
	for(i = 0;i<4;i++)
	{
		bb[i] = ((unsigned char*)this->m_stream)[this->m_seek++];
	}
	aa = (int)(((int)(bb[3]<<24))|((int)(bb[2]<<16))|((int)(bb[1]<<8))|((int)bb[0]));
	return aa;
}

int ark_Stream::ReadInt(int defValue)
{
	//检查是否有足够空间
	if (GetSize() - GetSeekPos() < 4)
	{
#ifdef DEBUG
		assert(false);
#endif
		return defValue;
	}

	int aa;
	unsigned char bb[4];
	int i = 0;
	for (i = 0; i<4; i++)
	{
		bb[i] = ((unsigned char*)this->m_stream)[this->m_seek++];
	}
	aa = (int)(((int)(bb[3] << 24)) | ((int)(bb[2] << 16)) | ((int)(bb[1] << 8)) | ((int)bb[0]));
	return aa;
}

long long ark_Stream::ReadULongInt(unsigned long long defValue)
{    
    //检查是否有足够空间
    if(GetSize() - GetSeekPos() < 8)
    {
#ifdef DEBUG
        assert(false);
#endif    
        return defValue;
    }

	long long aa;
	unsigned char bb[8];
	int i = 0;
	for(i = 0;i<8;i++)
	{
		bb[i] = ((unsigned char*)this->m_stream)[this->m_seek++];
	}
	aa = *((long long *)bb);
	return aa;
}


double ark_Stream::ReadDouble(double defValue)
{
    //检查是否有足够空间
    if(GetSize() - GetSeekPos() < 8)
    {
#ifdef DEBUG
        assert(false);
#endif    
        return defValue;
    }

    double aa;
    unsigned char bb[8];
    int i = 0;
    for(i=0; i<8; i++)
    {
        bb[i] = ((unsigned char*)this->m_stream)[this->m_seek++];
    }
    aa = *((double *)bb);
    return aa;
}

const unsigned char* ark_Stream::ReadBuffer(const unsigned long size, unsigned char *return_buf)
{
    //检查是否有足够空间
    if(GetSize() - GetSeekPos() < size)
    {
#ifdef DEBUG
        assert(false);
#endif        
        return NULL;
    }

	unsigned char *p = return_buf;
	unsigned char *l_start = (unsigned char*)this->m_stream + this->m_seek;
	this->m_seek += size;
	memcpy(return_buf,l_start,size);
	return p;
}

float ark_Stream::ReadFloat(const unsigned long size)
{
	//检查是否有足够空间
	if (GetSize() - GetSeekPos() < 4)
	{		
#ifdef DEBUG
		assert(false);
#endif    
		return 0.0;
	}

	float aa;
	unsigned char bb[4];
	int i = 0;
	for (i = 0; i<4; i++)
	{
		bb[i] = ((unsigned char*)this->m_stream)[this->m_seek++];
	}
	aa = *((float *)bb);
	return aa;
}

bool ark_Stream::ReadString(string &str)
{
	//读取字节数
	unsigned short bufLen = ReadWord();
	if (bufLen == 0)
	{
		str = "";
		return false;
	}

	//log("ReadString streamSize = %d seekPos = %d ,bufLen = %d", GetSize(), GetSeekPos(), bufLen);
	//检查是否有足够空间
	if (GetSize() - GetSeekPos() < bufLen)
	{
#ifdef DEBUG
		assert(false);
#endif    
		return false;
	}

	//读取buf
	char* buf = new char[bufLen + 1];
	buf = (char*)ReadBuffer(bufLen, (unsigned char*)buf);
	buf[bufLen] = '\0';

	str = string(buf);
	delete[] buf;

	return true;
}

string ark_Stream::ReadUnicodeString(const char* defValue)
{
	string strRet;
	if (ReadUnicodeString(strRet))
		return strRet;
	return defValue;
}


bool ark_Stream::ReadUnicodeString(string &str)
{
	//读取字节数
	unsigned short bufLen = ReadWord();
	if (bufLen == 0)
	{
		str = "";
		return false;
	}

	//log("ReadString streamSize = %d seekPos = %d ,bufLen = %d", GetSize(), GetSeekPos(), bufLen);
	//检查是否有足够空间
	if (GetSize() - GetSeekPos() < bufLen)
	{
#ifdef DEBUG
		assert(false);
#endif    
		return false;
	}

	//读取buf
	char* buf = new char[bufLen + 1];
	buf = (char*)ReadBuffer(bufLen, (unsigned char*)buf);
	buf[bufLen] = '\0';

	//申请2倍内存空间
	int utfLen = 2 * bufLen;
	char *utf8Buf = new char[utfLen + 1];
	utfLen = StringHelper::UnicodeToUtf8(utf8Buf, utfLen, buf, bufLen);
	utf8Buf[utfLen] = '\0';
	str = string(utf8Buf);
	delete[] utf8Buf;
	delete[] buf;

	return true;
}

string ark_Stream::ReadString(const char* defValue)
{
    string strRet;
    if(ReadString(strRet))
        return strRet;
    return defValue;
}

void ark_Stream::WriteByte(const unsigned char l_byte)
{
	((unsigned char*)this->m_stream)[this->m_seek++] = l_byte;
}

void ark_Stream::WriteWord(const unsigned short l_word)
{
	char aa[2];
	aa[0] = (unsigned char)(l_word&0xff);
	aa[1] = (unsigned char)((l_word>>8)&0xff);

	((unsigned char*)this->m_stream)[this->m_seek ++] = aa[0];
	((unsigned char*)this->m_stream)[this->m_seek ++] = aa[1];
}

void ark_Stream::WriteUInt(const unsigned int l_int)
{
	unsigned char aa[4];
	aa[0] = (unsigned char)(l_int&0xff);
	aa[1] = (unsigned char)((l_int>>8)&0xff);
	aa[2] = (unsigned char)((l_int>>16)&0xff);
	aa[3] = (unsigned char)((l_int>>24)&0xff);

	((unsigned char*)this->m_stream)[this->m_seek ++] = aa[0];
	((unsigned char*)this->m_stream)[this->m_seek ++] = aa[1];
	((unsigned char*)this->m_stream)[this->m_seek ++] = aa[2];
	((unsigned char*)this->m_stream)[this->m_seek ++] = aa[3];
}


void ark_Stream::WriteString(const void* buf, unsigned long size)
{
	size = size > 65536 ? 65536 : size;

	//申请2倍长度
	int bufLen = 2 * size;
	char* unicode = new char[bufLen + 1];
	bufLen = StringHelper::Utf8ToUnicode(unicode, bufLen, (const char*)buf, size);
	WriteWord(size);
	memcpy((unsigned char *)this->m_stream + this->m_seek, buf, size);
	this->m_seek += size;

	delete[] unicode;
}

void ark_Stream::WriteString(string& str)
{
    WriteString(str.c_str(), str.length());
}

void ark_Stream::Seek(const int offset, int mode)
{
	switch(mode)
	{
	case ark_Stream::SK_START:
		if(offset < (int)this->m_size)
			this->m_seek = offset;
		else
			this->m_size = this->m_size - 1;
		break;
	case SK_CUR:
		if(this->m_seek + offset < this->m_size)
			this->m_seek += offset;
		else
			this->m_seek = m_size - 1;
		break;
	case SK_END:
		if(offset < (int)this->m_size)
			this->m_seek = this->m_size - offset -1;
		else
			this->m_seek = 0;
		break;
	}
}

