#include "scripting/lua-bindings/auto/lua_ImodAnim_auto.hpp"
#include "ImodAnim.h"
#include "scripting/lua-bindings/manual/tolua_fix.h"
#include "scripting/lua-bindings/manual/LuaBasicConversions.h"

int lua_ImodAnim_ImodAnim_stopCurrentAni(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_stopCurrentAni'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_stopCurrentAni'", nullptr);
            return 0;
        }
        cobj->stopCurrentAni();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:stopCurrentAni",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_stopCurrentAni'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_playFirstFrameIndex(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_playFirstFrameIndex'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        int arg0;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:playFirstFrameIndex");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_playFirstFrameIndex'", nullptr);
            return 0;
        }
        cobj->playFirstFrameIndex(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:playFirstFrameIndex",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_playFirstFrameIndex'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_setFlippedX(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_setFlippedX'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        bool arg0;

        ok &= luaval_to_boolean(tolua_S, 2,&arg0, "ImodAnim:setFlippedX");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_setFlippedX'", nullptr);
            return 0;
        }
        cobj->setFlippedX(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:setFlippedX",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_setFlippedX'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_setMaxAniNum(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_setMaxAniNum'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        int arg0;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:setMaxAniNum");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_setMaxAniNum'", nullptr);
            return 0;
        }
        cobj->setMaxAniNum(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:setMaxAniNum",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_setMaxAniNum'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_setFlippedY(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_setFlippedY'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        bool arg0;

        ok &= luaval_to_boolean(tolua_S, 2,&arg0, "ImodAnim:setFlippedY");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_setFlippedY'", nullptr);
            return 0;
        }
        cobj->setFlippedY(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:setFlippedY",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_setFlippedY'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_getNeedImageAsyncLoad(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_getNeedImageAsyncLoad'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_getNeedImageAsyncLoad'", nullptr);
            return 0;
        }
        bool ret = cobj->getNeedImageAsyncLoad();
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:getNeedImageAsyncLoad",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_getNeedImageAsyncLoad'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_PlayActionRepeat(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_PlayActionRepeat'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        int arg0;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:PlayActionRepeat");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_PlayActionRepeat'", nullptr);
            return 0;
        }
        cobj->PlayActionRepeat(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 2) 
    {
        int arg0;
        double arg1;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:PlayActionRepeat");

        ok &= luaval_to_number(tolua_S, 3,&arg1, "ImodAnim:PlayActionRepeat");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_PlayActionRepeat'", nullptr);
            return 0;
        }
        cobj->PlayActionRepeat(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 3) 
    {
        int arg0;
        double arg1;
        bool arg2;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:PlayActionRepeat");

        ok &= luaval_to_number(tolua_S, 3,&arg1, "ImodAnim:PlayActionRepeat");

        ok &= luaval_to_boolean(tolua_S, 4,&arg2, "ImodAnim:PlayActionRepeat");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_PlayActionRepeat'", nullptr);
            return 0;
        }
        cobj->PlayActionRepeat(arg0, arg1, arg2);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:PlayActionRepeat",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_PlayActionRepeat'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_setNeedImageAsyncLoad(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_setNeedImageAsyncLoad'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        bool arg0;

        ok &= luaval_to_boolean(tolua_S, 2,&arg0, "ImodAnim:setNeedImageAsyncLoad");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_setNeedImageAsyncLoad'", nullptr);
            return 0;
        }
        cobj->setNeedImageAsyncLoad(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:setNeedImageAsyncLoad",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_setNeedImageAsyncLoad'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_setBlendColor(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_setBlendColor'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        cocos2d::Color4F arg0;

        ok &=luaval_to_color4f(tolua_S, 2, &arg0, "ImodAnim:setBlendColor");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_setBlendColor'", nullptr);
            return 0;
        }
        cobj->setBlendColor(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:setBlendColor",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_setBlendColor'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_initAnimWithName(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif
    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);
#if COCOS2D_DEBUG >= 1
    if (!cobj)
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_initAnimWithName'", nullptr);
        return 0;
    }
#endif
    argc = lua_gettop(tolua_S)-1;
    do{
        if (argc == 3) {
            std::string arg0;
            ok &= luaval_to_std_string(tolua_S, 2,&arg0, "ImodAnim:initAnimWithName");

            if (!ok) { break; }
            const char* arg1;
            std::string arg1_tmp; ok &= luaval_to_std_string(tolua_S, 3, &arg1_tmp, "ImodAnim:initAnimWithName"); arg1 = arg1_tmp.c_str();

            if (!ok) { break; }
            const char* arg2;
            std::string arg2_tmp; ok &= luaval_to_std_string(tolua_S, 4, &arg2_tmp, "ImodAnim:initAnimWithName"); arg2 = arg2_tmp.c_str();

            if (!ok) { break; }
            cobj->initAnimWithName(arg0, arg1, arg2);
            lua_settop(tolua_S, 1);
            return 1;
        }
    }while(0);
    ok  = true;
    do{
        if (argc == 2) {
            const char* arg0;
            std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ImodAnim:initAnimWithName"); arg0 = arg0_tmp.c_str();

            if (!ok) { break; }
            const char* arg1;
            std::string arg1_tmp; ok &= luaval_to_std_string(tolua_S, 3, &arg1_tmp, "ImodAnim:initAnimWithName"); arg1 = arg1_tmp.c_str();

            if (!ok) { break; }
            cobj->initAnimWithName(arg0, arg1);
            lua_settop(tolua_S, 1);
            return 1;
        }
    }while(0);
    ok  = true;
    do{
        if (argc == 3) {
            const char* arg0;
            std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ImodAnim:initAnimWithName"); arg0 = arg0_tmp.c_str();

            if (!ok) { break; }
            const char* arg1;
            std::string arg1_tmp; ok &= luaval_to_std_string(tolua_S, 3, &arg1_tmp, "ImodAnim:initAnimWithName"); arg1 = arg1_tmp.c_str();

            if (!ok) { break; }
            bool arg2;
            ok &= luaval_to_boolean(tolua_S, 4,&arg2, "ImodAnim:initAnimWithName");

            if (!ok) { break; }
            cobj->initAnimWithName(arg0, arg1, arg2);
            lua_settop(tolua_S, 1);
            return 1;
        }
    }while(0);
    ok  = true;
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n",  "ImodAnim:initAnimWithName",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_initAnimWithName'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_SetFrameCallBack(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_SetFrameCallBack'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        int arg0;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:SetFrameCallBack");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_SetFrameCallBack'", nullptr);
            return 0;
        }
        cobj->SetFrameCallBack(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:SetFrameCallBack",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_SetFrameCallBack'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_setOpacity(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_setOpacity'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        int arg0;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:setOpacity");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_setOpacity'", nullptr);
            return 0;
        }
        cobj->setOpacity(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:setOpacity",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_setOpacity'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_init(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_init'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_init'", nullptr);
            return 0;
        }
        bool ret = cobj->init();
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:init",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_init'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_unregisterScriptEndCBHandler(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_unregisterScriptEndCBHandler'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_unregisterScriptEndCBHandler'", nullptr);
            return 0;
        }
        cobj->unregisterScriptEndCBHandler();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:unregisterScriptEndCBHandler",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_unregisterScriptEndCBHandler'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_ToggleAction(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_ToggleAction'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        bool arg0;

        ok &= luaval_to_boolean(tolua_S, 2,&arg0, "ImodAnim:ToggleAction");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_ToggleAction'", nullptr);
            return 0;
        }
        cobj->ToggleAction(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:ToggleAction",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_ToggleAction'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_getOpacity(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_getOpacity'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_getOpacity'", nullptr);
            return 0;
        }
        int ret = cobj->getOpacity();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:getOpacity",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_getOpacity'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_transPathFormat(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_transPathFormat'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        std::string arg0;

        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "ImodAnim:transPathFormat");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_transPathFormat'", nullptr);
            return 0;
        }
        std::string ret = cobj->transPathFormat(arg0);
        tolua_pushcppstring(tolua_S,ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:transPathFormat",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_transPathFormat'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_setExtFrameData(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_setExtFrameData'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 3) 
    {
        std::string arg0;
        std::vector<int> arg1;
        std::vector<int> arg2;

        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "ImodAnim:setExtFrameData");

        ok &= luaval_to_std_vector_int(tolua_S, 3, &arg1, "ImodAnim:setExtFrameData");

        ok &= luaval_to_std_vector_int(tolua_S, 4, &arg2, "ImodAnim:setExtFrameData");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_setExtFrameData'", nullptr);
            return 0;
        }
        cobj->setExtFrameData(arg0, arg1, arg2);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 4) 
    {
        std::string arg0;
        std::vector<int> arg1;
        std::vector<int> arg2;
        int arg3;

        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "ImodAnim:setExtFrameData");

        ok &= luaval_to_std_vector_int(tolua_S, 3, &arg1, "ImodAnim:setExtFrameData");

        ok &= luaval_to_std_vector_int(tolua_S, 4, &arg2, "ImodAnim:setExtFrameData");

        ok &= luaval_to_int32(tolua_S, 5,(int *)&arg3, "ImodAnim:setExtFrameData");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_setExtFrameData'", nullptr);
            return 0;
        }
        cobj->setExtFrameData(arg0, arg1, arg2, arg3);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:setExtFrameData",argc, 3);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_setExtFrameData'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_resume(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_resume'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_resume'", nullptr);
            return 0;
        }
        cobj->resume();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:resume",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_resume'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_stop(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_stop'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_stop'", nullptr);
            return 0;
        }
        cobj->stop();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:stop",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_stop'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_GetHeight(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_GetHeight'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_GetHeight'", nullptr);
            return 0;
        }
        int ret = cobj->GetHeight();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:GetHeight",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_GetHeight'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_setGhost(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_setGhost'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        bool arg0;
        double arg1;

        ok &= luaval_to_boolean(tolua_S, 2,&arg0, "ImodAnim:setGhost");

        ok &= luaval_to_number(tolua_S, 3,&arg1, "ImodAnim:setGhost");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_setGhost'", nullptr);
            return 0;
        }
        cobj->setGhost(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:setGhost",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_setGhost'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_sethsv(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_sethsv'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        cocos2d::Vec3 arg0;

        ok &= luaval_to_vec3(tolua_S, 2, &arg0, "ImodAnim:sethsv");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_sethsv'", nullptr);
            return 0;
        }
        cobj->sethsv(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:sethsv",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_sethsv'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_printAnimZorder(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_printAnimZorder'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_printAnimZorder'", nullptr);
            return 0;
        }
        cobj->printAnimZorder();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:printAnimZorder",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_printAnimZorder'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_removeAnim(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif
    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);
#if COCOS2D_DEBUG >= 1
    if (!cobj)
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_removeAnim'", nullptr);
        return 0;
    }
#endif
    argc = lua_gettop(tolua_S)-1;
    do{
        if (argc == 1) {
            const char* arg0;
            std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ImodAnim:removeAnim"); arg0 = arg0_tmp.c_str();

            if (!ok) { break; }
            cobj->removeAnim(arg0);
            lua_settop(tolua_S, 1);
            return 1;
        }
    }while(0);
    ok  = true;
    do{
        if (argc == 1) {
            int arg0;
            ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:removeAnim");

            if (!ok) { break; }
            cobj->removeAnim(arg0);
            lua_settop(tolua_S, 1);
            return 1;
        }
    }while(0);
    ok  = true;
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n",  "ImodAnim:removeAnim",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_removeAnim'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_IsInitAnimation(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_IsInitAnimation'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_IsInitAnimation'", nullptr);
            return 0;
        }
        bool ret = cobj->IsInitAnimation();
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:IsInitAnimation",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_IsInitAnimation'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_addAnimWithName(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_addAnimWithName'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        const char* arg0;
        const char* arg1;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ImodAnim:addAnimWithName"); arg0 = arg0_tmp.c_str();

        std::string arg1_tmp; ok &= luaval_to_std_string(tolua_S, 3, &arg1_tmp, "ImodAnim:addAnimWithName"); arg1 = arg1_tmp.c_str();
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_addAnimWithName'", nullptr);
            return 0;
        }
        int ret = cobj->addAnimWithName(arg0, arg1);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    if (argc == 3) 
    {
        const char* arg0;
        const char* arg1;
        int arg2;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ImodAnim:addAnimWithName"); arg0 = arg0_tmp.c_str();

        std::string arg1_tmp; ok &= luaval_to_std_string(tolua_S, 3, &arg1_tmp, "ImodAnim:addAnimWithName"); arg1 = arg1_tmp.c_str();

        ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "ImodAnim:addAnimWithName");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_addAnimWithName'", nullptr);
            return 0;
        }
        int ret = cobj->addAnimWithName(arg0, arg1, arg2);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    if (argc == 4) 
    {
        const char* arg0;
        const char* arg1;
        int arg2;
        cocos2d::Color3B arg3;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ImodAnim:addAnimWithName"); arg0 = arg0_tmp.c_str();

        std::string arg1_tmp; ok &= luaval_to_std_string(tolua_S, 3, &arg1_tmp, "ImodAnim:addAnimWithName"); arg1 = arg1_tmp.c_str();

        ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "ImodAnim:addAnimWithName");

        ok &= luaval_to_color3b(tolua_S, 5, &arg3, "ImodAnim:addAnimWithName");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_addAnimWithName'", nullptr);
            return 0;
        }
        int ret = cobj->addAnimWithName(arg0, arg1, arg2, arg3);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:addAnimWithName",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_addAnimWithName'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_setColor(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_setColor'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        cocos2d::Color3B arg0;

        ok &= luaval_to_color3b(tolua_S, 2, &arg0, "ImodAnim:setColor");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_setColor'", nullptr);
            return 0;
        }
        cobj->setColor(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:setColor",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_setColor'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_SetCurrentAction(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_SetCurrentAction'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        int arg0;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:SetCurrentAction");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_SetCurrentAction'", nullptr);
            return 0;
        }
        cobj->SetCurrentAction(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:SetCurrentAction",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_SetCurrentAction'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_GetColor(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_GetColor'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_GetColor'", nullptr);
            return 0;
        }
        cocos2d::Color3B ret = cobj->GetColor();
        color3b_to_luaval(tolua_S, ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:GetColor",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_GetColor'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_sethsvByIndex(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_sethsvByIndex'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        int arg0;
        cocos2d::Vec3 arg1;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:sethsvByIndex");

        ok &= luaval_to_vec3(tolua_S, 3, &arg1, "ImodAnim:sethsvByIndex");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_sethsvByIndex'", nullptr);
            return 0;
        }
        cobj->sethsvByIndex(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:sethsvByIndex",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_sethsvByIndex'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_resetAniData(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_resetAniData'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_resetAniData'", nullptr);
            return 0;
        }
        cobj->resetAniData();
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 1) 
    {
        bool arg0;

        ok &= luaval_to_boolean(tolua_S, 2,&arg0, "ImodAnim:resetAniData");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_resetAniData'", nullptr);
            return 0;
        }
        cobj->resetAniData(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:resetAniData",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_resetAniData'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_registerScriptEndCBHandler(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_registerScriptEndCBHandler'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        int arg0;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:registerScriptEndCBHandler");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_registerScriptEndCBHandler'", nullptr);
            return 0;
        }
        cobj->registerScriptEndCBHandler(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:registerScriptEndCBHandler",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_registerScriptEndCBHandler'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_ChangeZorderByIndex(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif
    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);
#if COCOS2D_DEBUG >= 1
    if (!cobj)
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_ChangeZorderByIndex'", nullptr);
        return 0;
    }
#endif
    argc = lua_gettop(tolua_S)-1;
    do{
        if (argc == 2) {
            const char* arg0;
            std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ImodAnim:ChangeZorderByIndex"); arg0 = arg0_tmp.c_str();

            if (!ok) { break; }
            int arg1;
            ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "ImodAnim:ChangeZorderByIndex");

            if (!ok) { break; }
            cobj->ChangeZorderByIndex(arg0, arg1);
            lua_settop(tolua_S, 1);
            return 1;
        }
    }while(0);
    ok  = true;
    do{
        if (argc == 2) {
            int arg0;
            ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:ChangeZorderByIndex");

            if (!ok) { break; }
            int arg1;
            ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "ImodAnim:ChangeZorderByIndex");

            if (!ok) { break; }
            cobj->ChangeZorderByIndex(arg0, arg1);
            lua_settop(tolua_S, 1);
            return 1;
        }
    }while(0);
    ok  = true;
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n",  "ImodAnim:ChangeZorderByIndex",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_ChangeZorderByIndex'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_PlayAction(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ImodAnim*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ImodAnim_ImodAnim_PlayAction'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        int arg0;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:PlayAction");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_PlayAction'", nullptr);
            return 0;
        }
        cobj->PlayAction(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 2) 
    {
        int arg0;
        double arg1;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:PlayAction");

        ok &= luaval_to_number(tolua_S, 3,&arg1, "ImodAnim:PlayAction");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_PlayAction'", nullptr);
            return 0;
        }
        cobj->PlayAction(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 3) 
    {
        int arg0;
        double arg1;
        bool arg2;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:PlayAction");

        ok &= luaval_to_number(tolua_S, 3,&arg1, "ImodAnim:PlayAction");

        ok &= luaval_to_boolean(tolua_S, 4,&arg2, "ImodAnim:PlayAction");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_PlayAction'", nullptr);
            return 0;
        }
        cobj->PlayAction(arg0, arg1, arg2);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 4) 
    {
        int arg0;
        double arg1;
        bool arg2;
        double arg3;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:PlayAction");

        ok &= luaval_to_number(tolua_S, 3,&arg1, "ImodAnim:PlayAction");

        ok &= luaval_to_boolean(tolua_S, 4,&arg2, "ImodAnim:PlayAction");

        ok &= luaval_to_number(tolua_S, 5,&arg3, "ImodAnim:PlayAction");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_PlayAction'", nullptr);
            return 0;
        }
        cobj->PlayAction(arg0, arg1, arg2, arg3);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 5) 
    {
        int arg0;
        double arg1;
        bool arg2;
        double arg3;
        bool arg4;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ImodAnim:PlayAction");

        ok &= luaval_to_number(tolua_S, 3,&arg1, "ImodAnim:PlayAction");

        ok &= luaval_to_boolean(tolua_S, 4,&arg2, "ImodAnim:PlayAction");

        ok &= luaval_to_number(tolua_S, 5,&arg3, "ImodAnim:PlayAction");

        ok &= luaval_to_boolean(tolua_S, 6,&arg4, "ImodAnim:PlayAction");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_PlayAction'", nullptr);
            return 0;
        }
        cobj->PlayAction(arg0, arg1, arg2, arg3, arg4);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:PlayAction",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_PlayAction'.",&tolua_err);
#endif

    return 0;
}
int lua_ImodAnim_ImodAnim_create(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"ImodAnim",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 0)
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_create'", nullptr);
            return 0;
        }
        ImodAnim* ret = ImodAnim::create();
        object_to_luaval<ImodAnim>(tolua_S, "ImodAnim",(ImodAnim*)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "ImodAnim:create",argc, 0);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_create'.",&tolua_err);
#endif
    return 0;
}
int lua_ImodAnim_ImodAnim_constructor(lua_State* tolua_S)
{
    int argc = 0;
    ImodAnim* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif



    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ImodAnim_ImodAnim_constructor'", nullptr);
            return 0;
        }
        cobj = new ImodAnim();
        cobj->autorelease();
        int ID =  (int)cobj->_ID ;
        int* luaID =  &cobj->_luaID ;
        toluafix_pushusertype_ccobject(tolua_S, ID, luaID, (void*)cobj,"ImodAnim");
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ImodAnim:ImodAnim",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_error(tolua_S,"#ferror in function 'lua_ImodAnim_ImodAnim_constructor'.",&tolua_err);
#endif

    return 0;
}

static int lua_ImodAnim_ImodAnim_finalize(lua_State* tolua_S)
{
    printf("luabindings: finalizing LUA object (ImodAnim)");
    return 0;
}

int lua_register_ImodAnim_ImodAnim(lua_State* tolua_S)
{
    tolua_usertype(tolua_S,"ImodAnim");
    tolua_cclass(tolua_S,"ImodAnim","ImodAnim","cc.Node",nullptr);

    tolua_beginmodule(tolua_S,"ImodAnim");
        tolua_function(tolua_S,"new",lua_ImodAnim_ImodAnim_constructor);
        tolua_function(tolua_S,"stopCurrentAni",lua_ImodAnim_ImodAnim_stopCurrentAni);
        tolua_function(tolua_S,"playFirstFrameIndex",lua_ImodAnim_ImodAnim_playFirstFrameIndex);
        tolua_function(tolua_S,"setFlippedX",lua_ImodAnim_ImodAnim_setFlippedX);
        tolua_function(tolua_S,"setMaxAniNum",lua_ImodAnim_ImodAnim_setMaxAniNum);
        tolua_function(tolua_S,"setFlippedY",lua_ImodAnim_ImodAnim_setFlippedY);
        tolua_function(tolua_S,"getNeedImageAsyncLoad",lua_ImodAnim_ImodAnim_getNeedImageAsyncLoad);
        tolua_function(tolua_S,"PlayActionRepeat",lua_ImodAnim_ImodAnim_PlayActionRepeat);
        tolua_function(tolua_S,"setNeedImageAsyncLoad",lua_ImodAnim_ImodAnim_setNeedImageAsyncLoad);
        tolua_function(tolua_S,"setBlendColor",lua_ImodAnim_ImodAnim_setBlendColor);
        tolua_function(tolua_S,"initAnimWithName",lua_ImodAnim_ImodAnim_initAnimWithName);
        tolua_function(tolua_S,"SetFrameCallBack",lua_ImodAnim_ImodAnim_SetFrameCallBack);
        tolua_function(tolua_S,"setOpacity",lua_ImodAnim_ImodAnim_setOpacity);
        tolua_function(tolua_S,"init",lua_ImodAnim_ImodAnim_init);
        tolua_function(tolua_S,"unregisterScriptEndCBHandler",lua_ImodAnim_ImodAnim_unregisterScriptEndCBHandler);
        tolua_function(tolua_S,"ToggleAction",lua_ImodAnim_ImodAnim_ToggleAction);
        tolua_function(tolua_S,"getOpacity",lua_ImodAnim_ImodAnim_getOpacity);
        tolua_function(tolua_S,"transPathFormat",lua_ImodAnim_ImodAnim_transPathFormat);
        tolua_function(tolua_S,"setExtFrameData",lua_ImodAnim_ImodAnim_setExtFrameData);
        tolua_function(tolua_S,"resume",lua_ImodAnim_ImodAnim_resume);
        tolua_function(tolua_S,"stop",lua_ImodAnim_ImodAnim_stop);
        tolua_function(tolua_S,"GetHeight",lua_ImodAnim_ImodAnim_GetHeight);
        tolua_function(tolua_S,"setGhost",lua_ImodAnim_ImodAnim_setGhost);
        tolua_function(tolua_S,"sethsv",lua_ImodAnim_ImodAnim_sethsv);
        tolua_function(tolua_S,"printAnimZorder",lua_ImodAnim_ImodAnim_printAnimZorder);
        tolua_function(tolua_S,"removeAnim",lua_ImodAnim_ImodAnim_removeAnim);
        tolua_function(tolua_S,"IsInitAnimation",lua_ImodAnim_ImodAnim_IsInitAnimation);
        tolua_function(tolua_S,"addAnimWithName",lua_ImodAnim_ImodAnim_addAnimWithName);
        tolua_function(tolua_S,"setColor",lua_ImodAnim_ImodAnim_setColor);
        tolua_function(tolua_S,"SetCurrentAction",lua_ImodAnim_ImodAnim_SetCurrentAction);
        tolua_function(tolua_S,"GetColor",lua_ImodAnim_ImodAnim_GetColor);
        tolua_function(tolua_S,"sethsvByIndex",lua_ImodAnim_ImodAnim_sethsvByIndex);
        tolua_function(tolua_S,"resetAniData",lua_ImodAnim_ImodAnim_resetAniData);
        tolua_function(tolua_S,"registerScriptEndCBHandler",lua_ImodAnim_ImodAnim_registerScriptEndCBHandler);
        tolua_function(tolua_S,"ChangeZorderByIndex",lua_ImodAnim_ImodAnim_ChangeZorderByIndex);
        tolua_function(tolua_S,"PlayAction",lua_ImodAnim_ImodAnim_PlayAction);
        tolua_function(tolua_S,"create", lua_ImodAnim_ImodAnim_create);
    tolua_endmodule(tolua_S);
    std::string typeName = typeid(ImodAnim).name();
    g_luaType[typeName] = "ImodAnim";
    g_typeCast["ImodAnim"] = "ImodAnim";
    return 1;
}
TOLUA_API int register_all_ImodAnim(lua_State* tolua_S)
{
	tolua_open(tolua_S);
	
	tolua_module(tolua_S,nullptr,0);
	tolua_beginmodule(tolua_S,nullptr);

	lua_register_ImodAnim_ImodAnim(tolua_S);

	tolua_endmodule(tolua_S);
	return 1;
}

