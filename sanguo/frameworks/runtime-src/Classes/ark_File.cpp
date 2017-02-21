#include "ark_File.h"
#include "cocos2d.h"

USING_NS_CC;
using namespace std;

static ark_File *g_ark_File = NULL;

ark_File* ark_File::shareFile()
{
	if(g_ark_File == NULL)
	{
		g_ark_File = new ark_File();
		return g_ark_File;
	}
	return g_ark_File;
}

void ark_File::freeShareFile()
{
	if(g_ark_File)
	{
		delete g_ark_File;
		g_ark_File=NULL;
	}
}

unsigned char* ark_File::ark_File_ReadData_FromSelf(const char *filename, unsigned long *size)
{
	unsigned char* l_pData = NULL;
	std::string path = filename;
	path = FileUtils::getInstance()->fullPathForFilename(path.c_str());
	l_pData = FileUtils::getInstance()->getFileData(path.c_str(),"rb",(ssize_t*)size);

	return l_pData;
}

unsigned char* ark_File::ark_File_ReadData_FromZip(const char *filename, unsigned long *size)
{
	unsigned char* l_pData = NULL;
	std::string path = filename;
	path = FileUtils::getInstance()->fullPathForFilename(path.c_str());
	l_pData = FileUtils::getInstance()->getFileDataFromZip(path.c_str(), "rb", (ssize_t*)size);
	//unsigned char* getFileDataFromZip(const char* pszZipFilePath, const char* pszFileName, unsigned long * pSize);
	return l_pData;
}

unsigned char* ark_File::ark_File_ReadData_FromUserDisk(const char *filename, unsigned long *size)
{
	unsigned char *l_pData = NULL;
	do 
	{
		std::string path = "";
		//CCFileUtilsWin32 *fileUtilsWin32 =  CCFileUtilsWin32::create();
		path = FileUtils::getInstance()->getWritablePath();
		path += filename;
		ARK_FILEPTR fp = ark_File_Open(path.c_str(),ARK_READ);
		if(fp == NULL)
		{
			break;
		}
		int len = ark_File_GetSize(fp);
		ark_File_Read(fp,(char*)l_pData,len);
		ark_File_Close(fp);

	}while(0);

	return l_pData;
}

void ark_File::ark_File_WriteData_ToUserDisk(const char *filename,unsigned char *data,int len,int mode)
{
	do 
	{	
		std::string path = "";
		path = FileUtils::getInstance()->getWritablePath();
		path += filename;
		ARK_FILEPTR fp = ark_File_Open(path.c_str(),mode);
		if(fp == NULL)
		{
			break;
		}
		ark_File_Write(fp,(char*)data,len);
		ark_File_Close(fp);
	}while(0);
	
}

ARK_FILEPTR ark_File::ark_File_Open(const char *filename,int flag)
{
	char flag_str[10] = {0};
	if((flag&ARK_WRITE)&&(flag&ARK_READ))
	{
		if(flag&ARK_CREATE_ALWAYS)
		{
			memcpy(flag_str,"w+",2);
		}else if(flag&ARK_CREATE)
		{
			memcpy(flag_str,"a+",2);
		}else{
			memcpy(flag_str,"r+",2);
		}
	}else if(flag&ARK_WRITE){
		if(flag&ARK_CREATE_ALWAYS)
		{
			memcpy(flag_str,"w",2);
		}else if(flag&ARK_CREATE){
			memcpy(flag_str,"a",1);
		}

	}else if(flag&ARK_READ){
		memcpy(flag_str,"r",1);
	}
	strcat(flag_str,"b");
	return fopen(filename,flag_str);
}

int ark_File::ark_File_Read(ARK_FILEPTR fp,char *data,int len)
{
	return fread(data,1,len * sizeof(char),fp);
}
int ark_File::ark_File_Write(ARK_FILEPTR fp,const char *data,int len)
{
	return fwrite(data,1,len * sizeof(char),fp);
}
int ark_File::ark_File_Close(ARK_FILEPTR fp)
{
	return fclose(fp);
}
int ark_File::ark_File_GetSize(ARK_FILEPTR fp)
{
	int size = 0;
	fseek((FILE*)fp,0L,SEEK_END);
	size = ftell((FILE*)fp);
	fseek((FILE*)fp,0L,SEEK_SET);
	return size;
}

int ark_File::ark_File_Seek(ARK_FILEPTR fp,int offset,int mode)
{
	switch(mode)
	{
	case ARK_BEGIN:
		return fseek((ARK_FILEPTR)fp,offset,SEEK_SET);
		break;
	case ARK_CURRENT:
		return fseek((ARK_FILEPTR)fp,offset,SEEK_CUR);
		break;
	case ARK_END:
		return fseek((ARK_FILEPTR)fp,offset,SEEK_END);
		break;
	}
	return 0;
}