#ifndef _ARK_FILE_H_
#define _ARK_FILE_H_

#include "cocos2d.h"

USING_NS_CC;

typedef FILE ARK_FILE,*ARK_FILEPTR;

enum{
	ARK_WRITE = 1,
	ARK_READ = 2,
	ARK_CREATE = 4,
	ARK_CREATE_ALWAYS = 8,
};

enum{
	ARK_BEGIN = 0,
	ARK_CURRENT,
	ARK_END,

};
class ark_File
{
public:
	static ark_File* shareFile(); //伪单例
	static void freeShareFile();
	unsigned char* ark_File_ReadData_FromSelf(const char *filename, unsigned long *size);//直接从文件中读取数据
	unsigned char* ark_File_ReadData_FromZip(const char *filename, unsigned long *size);//从zip中读取
	unsigned char* ark_File_ReadData_FromUserDisk(const char *filename, unsigned long *size);//从用户文件中读取数据
	void ark_File_WriteData_ToUserDisk(const char *filename,unsigned char *data,int len,int mode);//写数据到用户文件中
public:
	//C language
	ARK_FILEPTR ark_File_Open(const char *filename,int flag);
	int ark_File_Read(ARK_FILEPTR fp,char *data,int len);
	int ark_File_Write(ARK_FILEPTR fp,const char *data,int len);
	int ark_File_Close(ARK_FILEPTR fp);
	int ark_File_GetSize(ARK_FILEPTR fp);
	int ark_File_Seek(ARK_FILEPTR fp,int offset,int mode);
private:
	ark_File(){};
	virtual ~ark_File(){};
private:
	//void ark_File_ReadByCFile(char *filename);
};

#endif