#include "scripting/lua-bindings/auto/lua_WinMoviePlayer_auto.hpp"
#include "scripting/lua-bindings/manual/CCLuaValue.h"
#include "scripting/lua-bindings/manual/cocos2d/LuaScriptHandlerMgr.h"
#include "WinMoviePlayer.h"
#include "scripting/lua-bindings/manual/tolua_fix.h"
#include "scripting/lua-bindings/manual/LuaBasicConversions.h"

int lua_WinMoviePlayer_WinMoviePlayer_ResumeVedio(lua_State* tolua_S)
{
    int argc = 0;
    WinMoviePlayer* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"WinMoviePlayer",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (WinMoviePlayer*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_WinMoviePlayer_WinMoviePlayer_ResumeVedio'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_WinMoviePlayer_WinMoviePlayer_ResumeVedio'", nullptr);
            return 0;
        }
        cobj->ResumeVedio();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "WinMoviePlayer:ResumeVedio",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_WinMoviePlayer_WinMoviePlayer_ResumeVedio'.",&tolua_err);
#endif

    return 0;
}
int lua_WinMoviePlayer_WinMoviePlayer_isEndReached(lua_State* tolua_S)
{
    int argc = 0;
    WinMoviePlayer* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"WinMoviePlayer",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (WinMoviePlayer*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_WinMoviePlayer_WinMoviePlayer_isEndReached'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_WinMoviePlayer_WinMoviePlayer_isEndReached'", nullptr);
            return 0;
        }
        bool ret = cobj->isEndReached();
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "WinMoviePlayer:isEndReached",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_WinMoviePlayer_WinMoviePlayer_isEndReached'.",&tolua_err);
#endif

    return 0;
}
int lua_WinMoviePlayer_WinMoviePlayer_playByURL(lua_State* tolua_S)
{
    int argc = 0;
    WinMoviePlayer* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"WinMoviePlayer",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (WinMoviePlayer*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_WinMoviePlayer_WinMoviePlayer_playByURL'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        std::string arg0;

        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "WinMoviePlayer:playByURL");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_WinMoviePlayer_WinMoviePlayer_playByURL'", nullptr);
            return 0;
        }
        cobj->playByURL(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 2) 
    {
        std::string arg0;
        bool arg1;

        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "WinMoviePlayer:playByURL");

        ok &= luaval_to_boolean(tolua_S, 3,&arg1, "WinMoviePlayer:playByURL");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_WinMoviePlayer_WinMoviePlayer_playByURL'", nullptr);
            return 0;
        }
        cobj->playByURL(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "WinMoviePlayer:playByURL",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_WinMoviePlayer_WinMoviePlayer_playByURL'.",&tolua_err);
#endif

    return 0;
}
int lua_WinMoviePlayer_WinMoviePlayer_unregisterEndScriptHandler(lua_State* tolua_S)
{
    int argc = 0;
    WinMoviePlayer* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"WinMoviePlayer",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (WinMoviePlayer*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_WinMoviePlayer_WinMoviePlayer_unregisterEndScriptHandler'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_WinMoviePlayer_WinMoviePlayer_unregisterEndScriptHandler'", nullptr);
            return 0;
        }
        cobj->unregisterEndScriptHandler();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "WinMoviePlayer:unregisterEndScriptHandler",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_WinMoviePlayer_WinMoviePlayer_unregisterEndScriptHandler'.",&tolua_err);
#endif

    return 0;
}
int lua_WinMoviePlayer_WinMoviePlayer_StopVedio(lua_State* tolua_S)
{
    int argc = 0;
    WinMoviePlayer* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"WinMoviePlayer",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (WinMoviePlayer*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_WinMoviePlayer_WinMoviePlayer_StopVedio'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_WinMoviePlayer_WinMoviePlayer_StopVedio'", nullptr);
            return 0;
        }
        cobj->StopVedio();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "WinMoviePlayer:StopVedio",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_WinMoviePlayer_WinMoviePlayer_StopVedio'.",&tolua_err);
#endif

    return 0;
}
int lua_WinMoviePlayer_WinMoviePlayer_registerEndScriptHandler(lua_State* tolua_S)
{
    int argc = 0;
    WinMoviePlayer* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"WinMoviePlayer",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (WinMoviePlayer*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_WinMoviePlayer_WinMoviePlayer_registerEndScriptHandler'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        int arg0;
		/*
        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "WinMoviePlayer:registerEndScriptHandler");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_WinMoviePlayer_WinMoviePlayer_registerEndScriptHandler'", nullptr);
            return 0;
        }
		*/
		
		if (!toluafix_isfunction(tolua_S, 2, "LUA_FUNCTION", 0, &tolua_err)) {
			goto tolua_lerror;
		}

		LUA_FUNCTION handler = (toluafix_ref_function(tolua_S, 2, 0));
		ScriptHandlerMgr::HandlerType handlerType = (ScriptHandlerMgr::HandlerType)(int)ScriptHandlerMgr::HandlerType::EVENT_CUSTIOM;
		ScriptHandlerMgr::getInstance()->addObjectHandler((void*)cobj, handler, handlerType);

		//arg0 = toluafix_ref_function(tolua_S, 2, 0);
        //cobj->registerEndScriptHandler(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "WinMoviePlayer:registerEndScriptHandler",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_WinMoviePlayer_WinMoviePlayer_registerEndScriptHandler'.",&tolua_err);
#endif

    return 0;
}
int lua_WinMoviePlayer_WinMoviePlayer_init(lua_State* tolua_S)
{
    int argc = 0;
    WinMoviePlayer* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"WinMoviePlayer",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (WinMoviePlayer*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_WinMoviePlayer_WinMoviePlayer_init'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        cocos2d::Size arg0;

        ok &= luaval_to_size(tolua_S, 2, &arg0, "WinMoviePlayer:init");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_WinMoviePlayer_WinMoviePlayer_init'", nullptr);
            return 0;
        }
        bool ret = cobj->init(arg0);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "WinMoviePlayer:init",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_WinMoviePlayer_WinMoviePlayer_init'.",&tolua_err);
#endif

    return 0;
}
int lua_WinMoviePlayer_WinMoviePlayer_PauseVedio(lua_State* tolua_S)
{
    int argc = 0;
    WinMoviePlayer* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"WinMoviePlayer",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (WinMoviePlayer*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_WinMoviePlayer_WinMoviePlayer_PauseVedio'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_WinMoviePlayer_WinMoviePlayer_PauseVedio'", nullptr);
            return 0;
        }
        cobj->PauseVedio();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "WinMoviePlayer:PauseVedio",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_WinMoviePlayer_WinMoviePlayer_PauseVedio'.",&tolua_err);
#endif

    return 0;
}
int lua_WinMoviePlayer_WinMoviePlayer_isPlaying(lua_State* tolua_S)
{
    int argc = 0;
    WinMoviePlayer* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"WinMoviePlayer",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (WinMoviePlayer*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_WinMoviePlayer_WinMoviePlayer_isPlaying'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_WinMoviePlayer_WinMoviePlayer_isPlaying'", nullptr);
            return 0;
        }
        bool ret = cobj->isPlaying();
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "WinMoviePlayer:isPlaying",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_WinMoviePlayer_WinMoviePlayer_isPlaying'.",&tolua_err);
#endif

    return 0;
}
int lua_WinMoviePlayer_WinMoviePlayer_playByPath(lua_State* tolua_S)
{
    int argc = 0;
    WinMoviePlayer* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"WinMoviePlayer",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (WinMoviePlayer*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_WinMoviePlayer_WinMoviePlayer_playByPath'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        std::string arg0;

        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "WinMoviePlayer:playByPath");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_WinMoviePlayer_WinMoviePlayer_playByPath'", nullptr);
            return 0;
        }
        cobj->playByPath(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 2) 
    {
        std::string arg0;
        bool arg1;

        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "WinMoviePlayer:playByPath");

        ok &= luaval_to_boolean(tolua_S, 3,&arg1, "WinMoviePlayer:playByPath");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_WinMoviePlayer_WinMoviePlayer_playByPath'", nullptr);
            return 0;
        }
        cobj->playByPath(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "WinMoviePlayer:playByPath",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_WinMoviePlayer_WinMoviePlayer_playByPath'.",&tolua_err);
#endif

    return 0;
}
int lua_WinMoviePlayer_WinMoviePlayer_create(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"WinMoviePlayer",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 1)
    {
        cocos2d::Size arg0;
        ok &= luaval_to_size(tolua_S, 2, &arg0, "WinMoviePlayer:create");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_WinMoviePlayer_WinMoviePlayer_create'", nullptr);
            return 0;
        }
        WinMoviePlayer* ret = WinMoviePlayer::create(arg0);
        object_to_luaval<WinMoviePlayer>(tolua_S, "WinMoviePlayer",(WinMoviePlayer*)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "WinMoviePlayer:create",argc, 1);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_WinMoviePlayer_WinMoviePlayer_create'.",&tolua_err);
#endif
    return 0;
}
static int lua_WinMoviePlayer_WinMoviePlayer_finalize(lua_State* tolua_S)
{
    printf("luabindings: finalizing LUA object (WinMoviePlayer)");
    return 0;
}

int lua_register_WinMoviePlayer_WinMoviePlayer(lua_State* tolua_S)
{
    tolua_usertype(tolua_S,"WinMoviePlayer");
    tolua_cclass(tolua_S,"WinMoviePlayer","WinMoviePlayer","cc.Sprite",nullptr);

    tolua_beginmodule(tolua_S,"WinMoviePlayer");
        tolua_function(tolua_S,"ResumeVedio",lua_WinMoviePlayer_WinMoviePlayer_ResumeVedio);
        tolua_function(tolua_S,"isEndReached",lua_WinMoviePlayer_WinMoviePlayer_isEndReached);
        tolua_function(tolua_S,"playByURL",lua_WinMoviePlayer_WinMoviePlayer_playByURL);
        tolua_function(tolua_S,"unregisterEndScriptHandler",lua_WinMoviePlayer_WinMoviePlayer_unregisterEndScriptHandler);
        tolua_function(tolua_S,"StopVedio",lua_WinMoviePlayer_WinMoviePlayer_StopVedio);
        tolua_function(tolua_S,"registerEndScriptHandler",lua_WinMoviePlayer_WinMoviePlayer_registerEndScriptHandler);
        tolua_function(tolua_S,"init",lua_WinMoviePlayer_WinMoviePlayer_init);
        tolua_function(tolua_S,"PauseVedio",lua_WinMoviePlayer_WinMoviePlayer_PauseVedio);
        tolua_function(tolua_S,"isPlaying",lua_WinMoviePlayer_WinMoviePlayer_isPlaying);
        tolua_function(tolua_S,"playByPath",lua_WinMoviePlayer_WinMoviePlayer_playByPath);
        tolua_function(tolua_S,"create", lua_WinMoviePlayer_WinMoviePlayer_create);
    tolua_endmodule(tolua_S);
    std::string typeName = typeid(WinMoviePlayer).name();
    g_luaType[typeName] = "WinMoviePlayer";
    g_typeCast["WinMoviePlayer"] = "WinMoviePlayer";
    return 1;
}
TOLUA_API int register_all_WinMoviePlayer(lua_State* tolua_S)
{
	tolua_open(tolua_S);
	
	tolua_module(tolua_S,nullptr,0);
	tolua_beginmodule(tolua_S,nullptr);

	lua_register_WinMoviePlayer_WinMoviePlayer(tolua_S);

	tolua_endmodule(tolua_S);
	return 1;
}

