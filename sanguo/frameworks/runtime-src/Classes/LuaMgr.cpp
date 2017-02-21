#include "LuaMgr.h"
#include "lua_module_register.h"
#include "lua_ark_Stream_auto.hpp"
#include "lua_ImodAnim_auto.hpp"


#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "LoggerHelper.h"
#endif

// if you want to use the package manager to install more packages, 
// don't modify or remove this function
static int register_all_packages()
{
	return 0; //flag for packages manager
}

static LuaMgr* gItemMgr = NULL;

LuaMgr::LuaMgr()
:hasSetLuaPath(false)
,hasSetAndroidLuaPath(false)
{
	isStart = false;
	pEngine = LuaEngine::getInstance();
	ScriptEngineManager::getInstance()->setScriptEngine(pEngine);
    pStack = pEngine->getLuaStack();

	// If you want to use Quick-Cocos2d-X, please uncomment below code
	// register_all_quick_manual(L);
	//其他地方执行过这里的话就无需再执行
}

void LuaMgr::initEnv()
{
	// register lua module
	auto engine = LuaEngine::getInstance();
	ScriptEngineManager::getInstance()->setScriptEngine(engine);
	lua_State* L = engine->getLuaStack()->getLuaState();
	lua_module_register(L);

#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
	luaRegister_loggerHelper(L);
#endif

	register_all_ImodAnim(L);
	register_all_ark_Stream(L);

	register_all_packages();
	
	LuaStack* stack = engine->getLuaStack();
	stack->setXXTEAKeyAndSign("2dxLua", strlen("2dxLua"), "XXTEA", strlen("XXTEA"));

	//重置pEngine，pStack
	pEngine = LuaEngine::getInstance();
	pStack = pEngine->getLuaStack();
}

//重载lua环境
/*
void LuaMgr::reloadEnv()
{
	log("reloadEnv");
	LuaEngine::releaseEngine();
	auto engine = LuaEngine::getInstance();
	ScriptEngineManager::getInstance()->resetScriptEngine(engine);
	lua_State* L = engine->getLuaStack()->getLuaState();
	lua_module_register(L);

	//register_all_packages();
	register_all_ImodAnim(L);
	register_all_ark_Stream(L);

	LuaStack* stack = engine->getLuaStack();
	stack->setXXTEAKeyAndSign("2dxLua", strlen("2dxLua"), "XXTEA", strlen("XXTEA"));

	//重置pEngine，pStack
	pEngine = LuaEngine::getInstance();
	pStack = pEngine->getLuaStack();
}
*/

LuaMgr::~LuaMgr()
{
}

LuaMgr* LuaMgr::GetInstance()
{
	if(gItemMgr == NULL)
		gItemMgr = new LuaMgr();
	return gItemMgr;
}

void LuaMgr::executeHandler(int nHandler)
{
	int ret = pStack->executeFunctionByHandler(nHandler, 0);
	pStack->clean();
}

void LuaMgr::executeHandlerByInt(int nHandler, int idx)
{
	pStack->pushInt(idx);
	int ret = pStack->executeFunctionByHandler(nHandler, 1);
	pStack->clean();
}
void LuaMgr::executeHandlerByBoolean(int nHandler, bool bValue)
{
	pStack->pushBoolean(bValue);
	int ret = pStack->executeFunctionByHandler(nHandler, 1);
	pStack->clean();
}

void LuaMgr::executeHandlerByTwoInt(int nHandler, int p1, int p2)
{
	pStack->pushInt(p1);
	pStack->pushInt(p2);
	int ret = pStack->executeFunctionByHandler(nHandler, 2);
	pStack->clean();
}

void LuaMgr::executeScriptFile(const char* url_)
{
    std::string path = FileUtils::getInstance()->fullPathForFilename(url_);
	log("LuaMgr::executeScriptFile,path = %s", path.c_str());
    pEngine->executeScriptFile(path.c_str());
}

void LuaMgr::setLuaSearchPath(const char* _storagePath,const char* luaOriginPath)
{
    if (hasSetLuaPath) {
        return;
    }
	LuaEngine::getInstance()->addSearchPath(_storagePath);
	LuaEngine::getInstance()->addSearchPath(luaOriginPath);
	hasSetLuaPath = true;
}

void LuaMgr::setAndroidLuaSearchPath(const char* _storagePath)
{
	if (hasSetAndroidLuaPath) {
        return;
    }
	//安卓渠道暂时不加这个优先级
// 	LuaEngine::getInstance()->addSearchPath(_storagePath);
// 	CCLOG("setAndroidLuaSearchPath,%s",_storagePath);
	hasSetAndroidLuaPath = true;
}

//设置默认查找路径，如果设置过优先查找路径了这里就不执行
void LuaMgr::setDefaultSearchPath()
{
	if (!hasSetLuaPath)
	{
		string p = FileUtils::getInstance()->fullPathForFilename("lua");
		LuaEngine::getInstance()->addSearchPath(p.c_str());
	}
}

void LuaMgr::resetDefaultSearchPath()
{
	string p = FileUtils::getInstance()->fullPathForFilename("lua");
	LuaEngine::getInstance()->addSearchPath(p.c_str());
}

void LuaMgr::executeReadLuaTable(const char* otNmae,const char* ntNmae,map<int,string>& m)
{
	lua_State* L = pStack->getLuaState();
	lua_getglobal(L, otNmae);
	int it = lua_gettop(L);
	lua_pushnil(L);
	//遍历字符串table，取出key和字符存储
	map<string,string> keyMap;
	while(lua_next(L, it))
	{
		const char* str = lua_tostring(L, -1);
		string key = ((string)lua_tostring(L, -2));
		keyMap[key] = string(str);
		lua_pop(L, 1);
		//CCLog("str:%s       key:%s",A2UC(str.c_str()),key.c_str());
	}
	lua_pop(L, 1);

	//遍历枚举table，做好key与键值的映射
	lua_getglobal(L, ntNmae);
	it = lua_gettop(L);
	lua_pushnil(L);

	string tmpKey("");
	int	   tmpVal=0;
	while(lua_next(L, it))
	{
		string str = ((string)lua_tostring(L, -1));
		int end = 0, off =0;
		end = StringHelper::ReadBeforeCharStr(str,'=',off,tmpKey);
		off = end+1;
		if(end != -1)
		{
			tmpVal = atoi(str.substr(off,str.size()).c_str());
		}else
		{
			tmpKey = str;
		}
		m[tmpVal] = keyMap[tmpKey];
		//CCLog("tmpKey:%s   tmpVal:%d  MsgStr: %s",tmpKey.c_str(),tmpVal, m[tmpVal].c_str());
		tmpVal++;
		lua_pop(L, 1);
	}
	lua_pop(L, 1);
}

void LuaMgr::executeReadLuaTable(const char* fileNmae,vector<string>& v)
{
	lua_State* L = pStack->getLuaState();
	lua_getglobal(L, fileNmae);
	int it = lua_gettop(L);
	lua_pushnil(L);

	int i=0;
	while(lua_next(L, it))
	{
		string str = ((string)lua_tostring(L, -1));
		v.push_back(str);
		//CCLog("Word_%d: %s",i++,str.c_str());
		lua_pop(L, 1);
	}
	lua_pop(L, 1);
}

const char* LuaMgr::executeReadString(const char* tag)
{
	lua_State* L = pStack->getLuaState();
	lua_getglobal(L, tag);
	if (lua_isstring(L, -1))
	{  
		return lua_tostring(L, -1);  
	}  
	return "";
}

int LuaMgr::executeReadInt(const char* tag)
{
	lua_State* L = pStack->getLuaState();
	lua_getglobal(L, tag);
	if (lua_isnumber(L, -1))  
	{  
		return (int)lua_tointeger(L, -1);  
	}  
	return 0;
}

bool LuaMgr::executeReadBoolean(const char* tag)
{
	lua_State* L = pStack->getLuaState();
	lua_getglobal(L, tag);  
	if (lua_isboolean(L, -1))
	{  
		return (bool)lua_toboolean(L, -1);  
	}  
	return false; 
}

//如果有异常（第一条），发给testing
std::string LuaMgr::reportError()
{
	return "";
}

void LuaMgr::recvmsg(int cmd,ark_Stream& stream)
{
    if (isStart)
    {
        m_stream = stream;
        pEngine->getLuaStack()->pushInt(cmd);
        pEngine->getLuaStack()->pushUserdata((void*)&m_stream);
       // pEngine->executeGlobalFunction("recvmsg",2);
    }
}

void LuaMgr::executeHandlerByUserData(int nHandler, void* param_x)
{
	pStack->pushUserdata(param_x);
	int ret = pStack->executeFunctionByHandler(nHandler, 1);
	pStack->clean();
}

void LuaMgr::executeHandlerByIntUserData(int nHandler, int value_, void* param_x)
{
	pStack->pushInt(value_);
	pStack->pushUserdata(param_x);
	int ret = pStack->executeFunctionByHandler(nHandler, 2);
	pStack->clean();
}

void LuaMgr::executeHandlerByUserDataTwoInt(int nHandler, void* param_x, int value_, int value1_)
{
	pStack->pushUserdata(param_x);
	pStack->pushInt(value_);
	pStack->pushInt(value1_);
	int ret = pStack->executeFunctionByHandler(nHandler, 3);
	pStack->clean();
}

void LuaMgr::executeGlobalFunction(const char* func)
{
	pEngine->executeGlobalFunction(func);
}

void LuaMgr::executeGlobalFunctionByUserData(const char* func, void* param_)
{
    if (isStart)
    {
        pEngine->getLuaStack()->pushUserdata((void*)param_);
        //pEngine->executeGlobalFunction(func,1);
    }
}

void LuaMgr::executeGlobalFunctionByTwoUserData(const char* func, void* param_, void* param1_)
{
	if (isStart)
    {
        pEngine->getLuaStack()->pushUserdata((void*)param_);
		pEngine->getLuaStack()->pushUserdata((void*)param1_);
       //pEngine->executeGlobalFunction(func,2);
    }
}

void LuaMgr::executeGlobalFunctionByUserDataOP(const char* func, void* param_, int op_)
{

    if (isStart)
    {
        pEngine->getLuaStack()->pushUserdata((void*)param_);
        pEngine->getLuaStack()->pushInt(op_);
        //pEngine->executeGlobalFunction(func,2);
    }
	
}

void LuaMgr::executeGlobalFunctionByUserDataTwoInt(const char* func, void* param_, int op_, int op1_)
{
	if (isStart)
    {
        pEngine->getLuaStack()->pushUserdata((void*)param_);
        pEngine->getLuaStack()->pushInt(op_);
		pEngine->getLuaStack()->pushInt(op1_);
        //pEngine->executeGlobalFunction(func,3);
    }
}

void LuaMgr::executeGlobalFunctionByUserDataIntBool(const char* func, void* param_, int op_, bool bol_)
{
	if (isStart)
    {
        pEngine->getLuaStack()->pushUserdata((void*)param_);
        pEngine->getLuaStack()->pushInt(op_);
		pEngine->getLuaStack()->pushBoolean(bol_);
        //pEngine->executeGlobalFunction(func,3);
    }	
}

void LuaMgr::executeGlobalFunctionByIntUserData(const char* func, int op_, void* param_)
{
	if (isStart)
    {
        pEngine->getLuaStack()->pushInt(op_);
		pEngine->getLuaStack()->pushUserdata((void*)param_);
        //pEngine->executeGlobalFunction(func,2);
    }	
}


