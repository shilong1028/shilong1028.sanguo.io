#include "scripting/lua-bindings/auto/lua_CCAysLabel_auto.hpp"
#include "CCAysLabel.h"
#include "scripting/lua-bindings/manual/tolua_fix.h"
#include "scripting/lua-bindings/manual/LuaBasicConversions.h"

int lua_CCAysLabel_CCAysLabel_reset(lua_State* tolua_S)
{
    int argc = 0;
    CCAysLabel* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"CCAysLabel",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (CCAysLabel*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_CCAysLabel_CCAysLabel_reset'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        std::string arg0;
        cocos2d::Size arg1;

        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "CCAysLabel:reset");

        ok &= luaval_to_size(tolua_S, 3, &arg1, "CCAysLabel:reset");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_CCAysLabel_CCAysLabel_reset'", nullptr);
            return 0;
        }
        cobj->reset(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 3) 
    {
        std::string arg0;
        cocos2d::Size arg1;
        cocos2d::Color3B arg2;

        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "CCAysLabel:reset");

        ok &= luaval_to_size(tolua_S, 3, &arg1, "CCAysLabel:reset");

        ok &= luaval_to_color3b(tolua_S, 4, &arg2, "CCAysLabel:reset");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_CCAysLabel_CCAysLabel_reset'", nullptr);
            return 0;
        }
        cobj->reset(arg0, arg1, arg2);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 4) 
    {
        std::string arg0;
        cocos2d::Size arg1;
        cocos2d::Color3B arg2;
        std::string arg3;

        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "CCAysLabel:reset");

        ok &= luaval_to_size(tolua_S, 3, &arg1, "CCAysLabel:reset");

        ok &= luaval_to_color3b(tolua_S, 4, &arg2, "CCAysLabel:reset");

        ok &= luaval_to_std_string(tolua_S, 5,&arg3, "CCAysLabel:reset");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_CCAysLabel_CCAysLabel_reset'", nullptr);
            return 0;
        }
        cobj->reset(arg0, arg1, arg2, arg3);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 5) 
    {
        std::string arg0;
        cocos2d::Size arg1;
        cocos2d::Color3B arg2;
        std::string arg3;
        int arg4;

        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "CCAysLabel:reset");

        ok &= luaval_to_size(tolua_S, 3, &arg1, "CCAysLabel:reset");

        ok &= luaval_to_color3b(tolua_S, 4, &arg2, "CCAysLabel:reset");

        ok &= luaval_to_std_string(tolua_S, 5,&arg3, "CCAysLabel:reset");

        ok &= luaval_to_int32(tolua_S, 6,(int *)&arg4, "CCAysLabel:reset");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_CCAysLabel_CCAysLabel_reset'", nullptr);
            return 0;
        }
        cobj->reset(arg0, arg1, arg2, arg3, arg4);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 6) 
    {
        std::string arg0;
        cocos2d::Size arg1;
        cocos2d::Color3B arg2;
        std::string arg3;
        int arg4;
        bool arg5;

        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "CCAysLabel:reset");

        ok &= luaval_to_size(tolua_S, 3, &arg1, "CCAysLabel:reset");

        ok &= luaval_to_color3b(tolua_S, 4, &arg2, "CCAysLabel:reset");

        ok &= luaval_to_std_string(tolua_S, 5,&arg3, "CCAysLabel:reset");

        ok &= luaval_to_int32(tolua_S, 6,(int *)&arg4, "CCAysLabel:reset");

        ok &= luaval_to_boolean(tolua_S, 7,&arg5, "CCAysLabel:reset");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_CCAysLabel_CCAysLabel_reset'", nullptr);
            return 0;
        }
        cobj->reset(arg0, arg1, arg2, arg3, arg4, arg5);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 7) 
    {
        std::string arg0;
        cocos2d::Size arg1;
        cocos2d::Color3B arg2;
        std::string arg3;
        int arg4;
        bool arg5;
        bool arg6;

        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "CCAysLabel:reset");

        ok &= luaval_to_size(tolua_S, 3, &arg1, "CCAysLabel:reset");

        ok &= luaval_to_color3b(tolua_S, 4, &arg2, "CCAysLabel:reset");

        ok &= luaval_to_std_string(tolua_S, 5,&arg3, "CCAysLabel:reset");

        ok &= luaval_to_int32(tolua_S, 6,(int *)&arg4, "CCAysLabel:reset");

        ok &= luaval_to_boolean(tolua_S, 7,&arg5, "CCAysLabel:reset");

        ok &= luaval_to_boolean(tolua_S, 8,&arg6, "CCAysLabel:reset");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_CCAysLabel_CCAysLabel_reset'", nullptr);
            return 0;
        }
        cobj->reset(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "CCAysLabel:reset",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_CCAysLabel_CCAysLabel_reset'.",&tolua_err);
#endif

    return 0;
}
int lua_CCAysLabel_CCAysLabel_getSize(lua_State* tolua_S)
{
    int argc = 0;
    CCAysLabel* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"CCAysLabel",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (CCAysLabel*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_CCAysLabel_CCAysLabel_getSize'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_CCAysLabel_CCAysLabel_getSize'", nullptr);
            return 0;
        }
        cocos2d::Size ret = cobj->getSize();
        size_to_luaval(tolua_S, ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "CCAysLabel:getSize",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_CCAysLabel_CCAysLabel_getSize'.",&tolua_err);
#endif

    return 0;
}
int lua_CCAysLabel_CCAysLabel_create(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"CCAysLabel",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S)-1;

    do 
    {
        if (argc == 2)
        {
            std::string arg0;
            ok &= luaval_to_std_string(tolua_S, 2,&arg0, "CCAysLabel:create");
            if (!ok) { break; }
            cocos2d::Size arg1;
            ok &= luaval_to_size(tolua_S, 3, &arg1, "CCAysLabel:create");
            if (!ok) { break; }
            CCAysLabel* ret = CCAysLabel::create(arg0, arg1);
            object_to_luaval<CCAysLabel>(tolua_S, "CCAysLabel",(CCAysLabel*)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    do 
    {
        if (argc == 3)
        {
            std::string arg0;
            ok &= luaval_to_std_string(tolua_S, 2,&arg0, "CCAysLabel:create");
            if (!ok) { break; }
            cocos2d::Size arg1;
            ok &= luaval_to_size(tolua_S, 3, &arg1, "CCAysLabel:create");
            if (!ok) { break; }
            cocos2d::Color3B arg2;
            ok &= luaval_to_color3b(tolua_S, 4, &arg2, "CCAysLabel:create");
            if (!ok) { break; }
            CCAysLabel* ret = CCAysLabel::create(arg0, arg1, arg2);
            object_to_luaval<CCAysLabel>(tolua_S, "CCAysLabel",(CCAysLabel*)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    do 
    {
        if (argc == 4)
        {
            std::string arg0;
            ok &= luaval_to_std_string(tolua_S, 2,&arg0, "CCAysLabel:create");
            if (!ok) { break; }
            cocos2d::Size arg1;
            ok &= luaval_to_size(tolua_S, 3, &arg1, "CCAysLabel:create");
            if (!ok) { break; }
            cocos2d::Color3B arg2;
            ok &= luaval_to_color3b(tolua_S, 4, &arg2, "CCAysLabel:create");
            if (!ok) { break; }
            std::string arg3;
            ok &= luaval_to_std_string(tolua_S, 5,&arg3, "CCAysLabel:create");
            if (!ok) { break; }
            CCAysLabel* ret = CCAysLabel::create(arg0, arg1, arg2, arg3);
            object_to_luaval<CCAysLabel>(tolua_S, "CCAysLabel",(CCAysLabel*)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    do 
    {
        if (argc == 5)
        {
            std::string arg0;
            ok &= luaval_to_std_string(tolua_S, 2,&arg0, "CCAysLabel:create");
            if (!ok) { break; }
            cocos2d::Size arg1;
            ok &= luaval_to_size(tolua_S, 3, &arg1, "CCAysLabel:create");
            if (!ok) { break; }
            cocos2d::Color3B arg2;
            ok &= luaval_to_color3b(tolua_S, 4, &arg2, "CCAysLabel:create");
            if (!ok) { break; }
            std::string arg3;
            ok &= luaval_to_std_string(tolua_S, 5,&arg3, "CCAysLabel:create");
            if (!ok) { break; }
            int arg4;
            ok &= luaval_to_int32(tolua_S, 6,(int *)&arg4, "CCAysLabel:create");
            if (!ok) { break; }
            CCAysLabel* ret = CCAysLabel::create(arg0, arg1, arg2, arg3, arg4);
            object_to_luaval<CCAysLabel>(tolua_S, "CCAysLabel",(CCAysLabel*)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    do 
    {
        if (argc == 6)
        {
            std::string arg0;
            ok &= luaval_to_std_string(tolua_S, 2,&arg0, "CCAysLabel:create");
            if (!ok) { break; }
            cocos2d::Size arg1;
            ok &= luaval_to_size(tolua_S, 3, &arg1, "CCAysLabel:create");
            if (!ok) { break; }
            cocos2d::Color3B arg2;
            ok &= luaval_to_color3b(tolua_S, 4, &arg2, "CCAysLabel:create");
            if (!ok) { break; }
            std::string arg3;
            ok &= luaval_to_std_string(tolua_S, 5,&arg3, "CCAysLabel:create");
            if (!ok) { break; }
            int arg4;
            ok &= luaval_to_int32(tolua_S, 6,(int *)&arg4, "CCAysLabel:create");
            if (!ok) { break; }
            bool arg5;
            ok &= luaval_to_boolean(tolua_S, 7,&arg5, "CCAysLabel:create");
            if (!ok) { break; }
            CCAysLabel* ret = CCAysLabel::create(arg0, arg1, arg2, arg3, arg4, arg5);
            object_to_luaval<CCAysLabel>(tolua_S, "CCAysLabel",(CCAysLabel*)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    do 
    {
        if (argc == 7)
        {
            std::string arg0;
            ok &= luaval_to_std_string(tolua_S, 2,&arg0, "CCAysLabel:create");
            if (!ok) { break; }
            cocos2d::Size arg1;
            ok &= luaval_to_size(tolua_S, 3, &arg1, "CCAysLabel:create");
            if (!ok) { break; }
            cocos2d::Color3B arg2;
            ok &= luaval_to_color3b(tolua_S, 4, &arg2, "CCAysLabel:create");
            if (!ok) { break; }
            std::string arg3;
            ok &= luaval_to_std_string(tolua_S, 5,&arg3, "CCAysLabel:create");
            if (!ok) { break; }
            int arg4;
            ok &= luaval_to_int32(tolua_S, 6,(int *)&arg4, "CCAysLabel:create");
            if (!ok) { break; }
            bool arg5;
            ok &= luaval_to_boolean(tolua_S, 7,&arg5, "CCAysLabel:create");
            if (!ok) { break; }
            bool arg6;
            ok &= luaval_to_boolean(tolua_S, 8,&arg6, "CCAysLabel:create");
            if (!ok) { break; }
            CCAysLabel* ret = CCAysLabel::create(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
            object_to_luaval<CCAysLabel>(tolua_S, "CCAysLabel",(CCAysLabel*)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    do 
    {
        if (argc == 0)
        {
            CCAysLabel* ret = CCAysLabel::create();
            object_to_luaval<CCAysLabel>(tolua_S, "CCAysLabel",(CCAysLabel*)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d", "CCAysLabel:create",argc, 0);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_CCAysLabel_CCAysLabel_create'.",&tolua_err);
#endif
    return 0;
}
int lua_CCAysLabel_CCAysLabel_constructor(lua_State* tolua_S)
{
    int argc = 0;
    CCAysLabel* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif



    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_CCAysLabel_CCAysLabel_constructor'", nullptr);
            return 0;
        }
        cobj = new CCAysLabel();
        cobj->autorelease();
        int ID =  (int)cobj->_ID ;
        int* luaID =  &cobj->_luaID ;
        toluafix_pushusertype_ccobject(tolua_S, ID, luaID, (void*)cobj,"CCAysLabel");
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "CCAysLabel:CCAysLabel",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_error(tolua_S,"#ferror in function 'lua_CCAysLabel_CCAysLabel_constructor'.",&tolua_err);
#endif

    return 0;
}

static int lua_CCAysLabel_CCAysLabel_finalize(lua_State* tolua_S)
{
    printf("luabindings: finalizing LUA object (CCAysLabel)");
    return 0;
}

int lua_register_CCAysLabel_CCAysLabel(lua_State* tolua_S)
{
    tolua_usertype(tolua_S,"CCAysLabel");
    tolua_cclass(tolua_S,"CCAysLabel","CCAysLabel","cc.Node",nullptr);

    tolua_beginmodule(tolua_S,"CCAysLabel");
        tolua_function(tolua_S,"new",lua_CCAysLabel_CCAysLabel_constructor);
        tolua_function(tolua_S,"reset",lua_CCAysLabel_CCAysLabel_reset);
        tolua_function(tolua_S,"getSize",lua_CCAysLabel_CCAysLabel_getSize);
        tolua_function(tolua_S,"create", lua_CCAysLabel_CCAysLabel_create);
    tolua_endmodule(tolua_S);
    std::string typeName = typeid(CCAysLabel).name();
    g_luaType[typeName] = "CCAysLabel";
    g_typeCast["CCAysLabel"] = "CCAysLabel";
    return 1;
}
TOLUA_API int register_all_CCAysLabel(lua_State* tolua_S)
{
	tolua_open(tolua_S);
	
	tolua_module(tolua_S,nullptr,0);
	tolua_beginmodule(tolua_S,nullptr);

	lua_register_CCAysLabel_CCAysLabel(tolua_S);

	tolua_endmodule(tolua_S);
	return 1;
}

