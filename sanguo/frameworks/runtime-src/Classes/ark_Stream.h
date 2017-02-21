#ifndef _ARK_STREAM_H_
#define _ARK_STREAM_H_

#include <iostream>
using namespace std;

//////////////////////////////////////////////////////////////////////////
/// ark_stream - 数据流
/// 描述： 
///     主要提供对指定内存、文件的包装以及相关读写函数
//////////////////////////////////////////////////////////////////////////
class ark_Stream
{
public:
    enum ARK_STREAM_SEEK
    {
	    SK_CUR,
	    SK_START,
	    SK_END,
    };

public:
	ark_Stream();
	virtual ~ark_Stream();

public:
    //从文件中的一个文件创建读文件流
	void* CreateReadStreamFromSelf(const char *filename);
    //从zip文件中读取
	void* CreateReadStreamFromZip(const char *filename);
	//从用户文件中创建读文件流
    void* CreateReadStreamFromUserDisk(const char *filename);
    //从内存块中创建读文件流
	void CreateReadStreamFromBuf(const char *buf, const unsigned long size, bool needRelease = false);
	//从内存块中创建读文件流
	void CreateReadStreamFromStreamSeek(ark_Stream* target, const unsigned long size, bool needRelease = false);
	//深拷贝，
	void CreateFromStreamSeek_Deep(ark_Stream* target, const unsigned long size);
    //创建一个写入流，外部指定写入大小，没有动态改变大小
	void CreateWriteStream(void *buf,const unsigned long size, bool needRelease = false);

public:
    //从流中读取一个字节
	unsigned char ReadByte(unsigned char defValue = 0);
    //从流中读取2个字节
	unsigned short ReadWord(unsigned short defValue = 0);
	unsigned short ReadUShort(unsigned short defValue = 0);
	short ReadShort(short defValue = 0);
    //从流中读取4个字节
	unsigned int ReadUInt(unsigned int defValue = 0);
	int ReadInt(int defValue = 0);
    //从流中读取8个字节,lua不支持unsigned long long
	long long ReadULongInt(unsigned long long defValue = 0); //unsigned
    //从流中读取double
    double ReadDouble(double defValue = 0.0);
    //从流中读取一段内存
	const unsigned char* ReadBuffer(const unsigned long size, unsigned char* buf);
	//从流中读取float
	float ReadFloat(const unsigned long size);
	//从流中读取一个字符串，前两个字节标识长度
    bool ReadString(string& str);
	bool ReadUnicodeString(string& str);

	string ReadUnicodeString(const char* defValue = "");
    string ReadString(const char* defValue = "");

    //往流中写入1个字节
	void WriteByte(const unsigned char l_byte);
    //往流中写入2个字节
	void WriteWord(const unsigned short l_word);
	//往流中写入4个字节
    void WriteUInt(const unsigned int l_int);
    //往流中写入字符串,前两个字节标识长度
	void WriteString(const void* buf, unsigned long size);
    //往流中写入字符串,前两个字节标识长度
    void WriteString(string& str);

public:
	//移动流读取位置
	void Seek(int seek);
    void Seek(const int offset, int mode);
	//获取当前流大小
    unsigned long GetSize() { return this->m_size; } 
    //获取当前指针偏移
    unsigned long GetSeekPos() { return this->m_seek; }
    //获取起始内存指针
    unsigned char* GetBuffer() { return (unsigned char*)m_stream; }
	//获取当前内存指针
    unsigned char* GetBufferSeek() { return (unsigned char*)((unsigned char*)this->m_stream + this->m_seek); }

private:
	void* m_stream;
	unsigned long m_size;
	unsigned long m_seek;
	bool m_need_realse_flag;
};

#endif