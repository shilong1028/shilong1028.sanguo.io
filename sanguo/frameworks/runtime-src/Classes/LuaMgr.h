#ifndef LuaMgr_H_
#define LuaMgr_H_

//#include "SimpleAudioEngine.h"

#include "scripting/lua-bindings/manual/CCLuaEngine.h"
#include <vector>
#include <string>
#include "cocos2d.h"

#include "ark_Stream.h"
#include "ark_Utility.h"

using namespace std;

class LuaMgr
{
private:
    LuaEngine* pEngine;
    LuaStack *pStack;	
	ark_Stream m_stream;
	
	bool hasSetLuaPath;
	bool hasSetAndroidLuaPath;

public:
	bool isStart;
	
public:
	LuaMgr();
	~LuaMgr();

	LuaEngine* getEngine(){ return pEngine;}
	void initEnv();
	//void reloadEnv();
	static LuaMgr* GetInstance();
	lua_State* getLuaState(){ return pStack->getLuaState(); }

	void executeHandler(int nHandler);
	void executeScriptFile(const char* url_);
	void executeHandlerByInt(int nHandler, int idx);
	void executeHandlerByBoolean(int nHandler, bool bValue);
	void executeHandlerByTwoInt(int nHandler, int p1, int p2);
	
	void recvmsg(int cmd, ark_Stream& stream);
	ark_Stream& getStream(){ return m_stream; }

	std::string reportError();  //如果有异常（第一条），发给testing

	void executeHandlerByUserData(int nHandler, void* param_x);
	void executeHandlerByIntUserData(int nHandler, int value_, void* param_x);
	void executeHandlerByUserDataTwoInt(int nHandler, void* param_x, int value_, int value1_);

	void executeGlobalFunction(const char* func);
	void executeGlobalFunctionByUserData(const char* func, void* param_);
	void executeGlobalFunctionByTwoUserData(const char* func, void* param_, void* param1_);
	void executeGlobalFunctionByUserDataOP(const char* func, void* param_, int op_);

	void executeGlobalFunctionByUserDataTwoInt(const char* func, void* param_, int op_, int op1_);
	void executeGlobalFunctionByUserDataIntBool(const char* func, void* param_, int op_, bool bol_);
	void executeGlobalFunctionByIntUserData(const char* func, int op_, void* param_);

	void setLuaSearchPath(const char* _storagePath,const char* luaOriginPath);
	void setAndroidLuaSearchPath(const char* _storagePath);
	void setDefaultSearchPath();
	void resetDefaultSearchPath();
	
	void executeReadLuaTable(const char* otNmae,const char* ntNmae,map<int,string>& m);
	void executeReadLuaTable(const char* fileNmae,vector<string>& v);
	const char* executeReadString(const char* tag);
	int executeReadInt(const char* tag);
	bool executeReadBoolean(const char* tag); //读取布尔型  

};

//NS_CC_END
#endif
