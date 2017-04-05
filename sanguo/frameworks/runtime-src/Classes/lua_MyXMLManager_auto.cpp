#include "scripting/lua-bindings/auto/lua_MyXMLManager_auto.hpp"
#include "MyXMLManager.h"
#include "scripting/lua-bindings/manual/tolua_fix.h"
#include "scripting/lua-bindings/manual/LuaBasicConversions.h"

int lua_MyXMLManager_MyXMLManager_loadXMLFile(lua_State* tolua_S)
{
    int argc = 0;
    MyXMLManager* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"MyXMLManager",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (MyXMLManager*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_MyXMLManager_MyXMLManager_loadXMLFile'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        const char* arg0;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "MyXMLManager:loadXMLFile"); arg0 = arg0_tmp.c_str();
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_MyXMLManager_MyXMLManager_loadXMLFile'", nullptr);
            return 0;
        }
        bool ret = cobj->loadXMLFile(arg0);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "MyXMLManager:loadXMLFile",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_MyXMLManager_MyXMLManager_loadXMLFile'.",&tolua_err);
#endif

    return 0;
}
int lua_MyXMLManager_MyXMLManager_saveXMLFile(lua_State* tolua_S)
{
    int argc = 0;
    MyXMLManager* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"MyXMLManager",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (MyXMLManager*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_MyXMLManager_MyXMLManager_saveXMLFile'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_MyXMLManager_MyXMLManager_saveXMLFile'", nullptr);
            return 0;
        }
        bool ret = cobj->saveXMLFile();
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "MyXMLManager:saveXMLFile",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_MyXMLManager_MyXMLManager_saveXMLFile'.",&tolua_err);
#endif

    return 0;
}
int lua_MyXMLManager_MyXMLManager_deleteAttribute(lua_State* tolua_S)
{
    int argc = 0;
    MyXMLManager* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"MyXMLManager",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (MyXMLManager*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_MyXMLManager_MyXMLManager_deleteAttribute'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        const char* arg0;
        const char* arg1;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "MyXMLManager:deleteAttribute"); arg0 = arg0_tmp.c_str();

        std::string arg1_tmp; ok &= luaval_to_std_string(tolua_S, 3, &arg1_tmp, "MyXMLManager:deleteAttribute"); arg1 = arg1_tmp.c_str();
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_MyXMLManager_MyXMLManager_deleteAttribute'", nullptr);
            return 0;
        }
        cobj->deleteAttribute(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "MyXMLManager:deleteAttribute",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_MyXMLManager_MyXMLManager_deleteAttribute'.",&tolua_err);
#endif

    return 0;
}
int lua_MyXMLManager_MyXMLManager_removeNode(lua_State* tolua_S)
{
    int argc = 0;
    MyXMLManager* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"MyXMLManager",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (MyXMLManager*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_MyXMLManager_MyXMLManager_removeNode'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        const char* arg0;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "MyXMLManager:removeNode"); arg0 = arg0_tmp.c_str();
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_MyXMLManager_MyXMLManager_removeNode'", nullptr);
            return 0;
        }
        cobj->removeNode(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "MyXMLManager:removeNode",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_MyXMLManager_MyXMLManager_removeNode'.",&tolua_err);
#endif

    return 0;
}
int lua_MyXMLManager_MyXMLManager_getNodeAttrValue(lua_State* tolua_S)
{
    int argc = 0;
    MyXMLManager* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"MyXMLManager",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (MyXMLManager*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_MyXMLManager_MyXMLManager_getNodeAttrValue'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        const char* arg0;
        const char* arg1;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "MyXMLManager:getNodeAttrValue"); arg0 = arg0_tmp.c_str();

        std::string arg1_tmp; ok &= luaval_to_std_string(tolua_S, 3, &arg1_tmp, "MyXMLManager:getNodeAttrValue"); arg1 = arg1_tmp.c_str();
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_MyXMLManager_MyXMLManager_getNodeAttrValue'", nullptr);
            return 0;
        }
        std::string ret = cobj->getNodeAttrValue(arg0, arg1);
        tolua_pushcppstring(tolua_S,ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "MyXMLManager:getNodeAttrValue",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_MyXMLManager_MyXMLManager_getNodeAttrValue'.",&tolua_err);
#endif

    return 0;
}
int lua_MyXMLManager_MyXMLManager_setNodeAttrValue(lua_State* tolua_S)
{
    int argc = 0;
    MyXMLManager* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"MyXMLManager",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (MyXMLManager*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_MyXMLManager_MyXMLManager_setNodeAttrValue'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 3) 
    {
        const char* arg0;
        const char* arg1;
        const char* arg2;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "MyXMLManager:setNodeAttrValue"); arg0 = arg0_tmp.c_str();

        std::string arg1_tmp; ok &= luaval_to_std_string(tolua_S, 3, &arg1_tmp, "MyXMLManager:setNodeAttrValue"); arg1 = arg1_tmp.c_str();

        std::string arg2_tmp; ok &= luaval_to_std_string(tolua_S, 4, &arg2_tmp, "MyXMLManager:setNodeAttrValue"); arg2 = arg2_tmp.c_str();
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_MyXMLManager_MyXMLManager_setNodeAttrValue'", nullptr);
            return 0;
        }
        cobj->setNodeAttrValue(arg0, arg1, arg2);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "MyXMLManager:setNodeAttrValue",argc, 3);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_MyXMLManager_MyXMLManager_setNodeAttrValue'.",&tolua_err);
#endif

    return 0;
}
int lua_MyXMLManager_MyXMLManager_isNULL(lua_State* tolua_S)
{
    int argc = 0;
    MyXMLManager* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"MyXMLManager",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (MyXMLManager*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_MyXMLManager_MyXMLManager_isNULL'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        const char* arg0;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "MyXMLManager:isNULL"); arg0 = arg0_tmp.c_str();
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_MyXMLManager_MyXMLManager_isNULL'", nullptr);
            return 0;
        }
        bool ret = cobj->isNULL(arg0);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "MyXMLManager:isNULL",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_MyXMLManager_MyXMLManager_isNULL'.",&tolua_err);
#endif

    return 0;
}
int lua_MyXMLManager_MyXMLManager_removeAllChildNode(lua_State* tolua_S)
{
    int argc = 0;
    MyXMLManager* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"MyXMLManager",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (MyXMLManager*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_MyXMLManager_MyXMLManager_removeAllChildNode'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        const char* arg0;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "MyXMLManager:removeAllChildNode"); arg0 = arg0_tmp.c_str();
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_MyXMLManager_MyXMLManager_removeAllChildNode'", nullptr);
            return 0;
        }
        cobj->removeAllChildNode(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "MyXMLManager:removeAllChildNode",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_MyXMLManager_MyXMLManager_removeAllChildNode'.",&tolua_err);
#endif

    return 0;
}
int lua_MyXMLManager_MyXMLManager_addChildNode(lua_State* tolua_S)
{
    int argc = 0;
    MyXMLManager* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"MyXMLManager",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (MyXMLManager*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_MyXMLManager_MyXMLManager_addChildNode'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        const char* arg0;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "MyXMLManager:addChildNode"); arg0 = arg0_tmp.c_str();
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_MyXMLManager_MyXMLManager_addChildNode'", nullptr);
            return 0;
        }
        cobj->addChildNode(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "MyXMLManager:addChildNode",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_MyXMLManager_MyXMLManager_addChildNode'.",&tolua_err);
#endif

    return 0;
}
int lua_MyXMLManager_MyXMLManager_createXMLFile(lua_State* tolua_S)
{
    int argc = 0;
    MyXMLManager* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"MyXMLManager",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (MyXMLManager*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_MyXMLManager_MyXMLManager_createXMLFile'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        const char* arg0;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "MyXMLManager:createXMLFile"); arg0 = arg0_tmp.c_str();
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_MyXMLManager_MyXMLManager_createXMLFile'", nullptr);
            return 0;
        }
        bool ret = cobj->createXMLFile(arg0);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    if (argc == 2) 
    {
        const char* arg0;
        const char* arg1;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "MyXMLManager:createXMLFile"); arg0 = arg0_tmp.c_str();

        std::string arg1_tmp; ok &= luaval_to_std_string(tolua_S, 3, &arg1_tmp, "MyXMLManager:createXMLFile"); arg1 = arg1_tmp.c_str();
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_MyXMLManager_MyXMLManager_createXMLFile'", nullptr);
            return 0;
        }
        bool ret = cobj->createXMLFile(arg0, arg1);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "MyXMLManager:createXMLFile",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_MyXMLManager_MyXMLManager_createXMLFile'.",&tolua_err);
#endif

    return 0;
}
int lua_MyXMLManager_MyXMLManager_constructor(lua_State* tolua_S)
{
    int argc = 0;
    MyXMLManager* cobj = nullptr;
    bool ok  = true;
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

    argc = lua_gettop(tolua_S)-1;
    do{
        if (argc == 1) {
            const char* arg0;
            std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "MyXMLManager:MyXMLManager"); arg0 = arg0_tmp.c_str();

            if (!ok) { break; }
            cobj = new MyXMLManager(arg0);
            tolua_pushusertype(tolua_S,(void*)cobj,"MyXMLManager");
            tolua_register_gc(tolua_S,lua_gettop(tolua_S));
            return 1;
        }
    }while(0);
    ok  = true;
    do{
        if (argc == 0) {
            cobj = new MyXMLManager();
            tolua_pushusertype(tolua_S,(void*)cobj,"MyXMLManager");
            tolua_register_gc(tolua_S,lua_gettop(tolua_S));
            return 1;
        }
    }while(0);
    ok  = true;
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n",  "MyXMLManager:MyXMLManager",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_error(tolua_S,"#ferror in function 'lua_MyXMLManager_MyXMLManager_constructor'.",&tolua_err);
#endif

    return 0;
}

static int lua_MyXMLManager_MyXMLManager_finalize(lua_State* tolua_S)
{
    printf("luabindings: finalizing LUA object (MyXMLManager)");
    return 0;
}

int lua_register_MyXMLManager_MyXMLManager(lua_State* tolua_S)
{
    tolua_usertype(tolua_S,"MyXMLManager");
    tolua_cclass(tolua_S,"MyXMLManager","MyXMLManager","",nullptr);

    tolua_beginmodule(tolua_S,"MyXMLManager");
        tolua_function(tolua_S,"new",lua_MyXMLManager_MyXMLManager_constructor);
        tolua_function(tolua_S,"loadXMLFile",lua_MyXMLManager_MyXMLManager_loadXMLFile);
        tolua_function(tolua_S,"saveXMLFile",lua_MyXMLManager_MyXMLManager_saveXMLFile);
        tolua_function(tolua_S,"deleteAttribute",lua_MyXMLManager_MyXMLManager_deleteAttribute);
        tolua_function(tolua_S,"removeNode",lua_MyXMLManager_MyXMLManager_removeNode);
        tolua_function(tolua_S,"getNodeAttrValue",lua_MyXMLManager_MyXMLManager_getNodeAttrValue);
        tolua_function(tolua_S,"setNodeAttrValue",lua_MyXMLManager_MyXMLManager_setNodeAttrValue);
        tolua_function(tolua_S,"isNULL",lua_MyXMLManager_MyXMLManager_isNULL);
        tolua_function(tolua_S,"removeAllChildNode",lua_MyXMLManager_MyXMLManager_removeAllChildNode);
        tolua_function(tolua_S,"addChildNode",lua_MyXMLManager_MyXMLManager_addChildNode);
        tolua_function(tolua_S,"createXMLFile",lua_MyXMLManager_MyXMLManager_createXMLFile);
    tolua_endmodule(tolua_S);
    std::string typeName = typeid(MyXMLManager).name();
    g_luaType[typeName] = "MyXMLManager";
    g_typeCast["MyXMLManager"] = "MyXMLManager";
    return 1;
}
TOLUA_API int register_all_MyXMLManager(lua_State* tolua_S)
{
	tolua_open(tolua_S);
	
	tolua_module(tolua_S,nullptr,0);
	tolua_beginmodule(tolua_S,nullptr);

	lua_register_MyXMLManager_MyXMLManager(tolua_S);

	tolua_endmodule(tolua_S);
	return 1;
}

