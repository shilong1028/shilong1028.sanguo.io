#include "scripting/lua-bindings/auto/lua_ark_Utility_auto.hpp"
#include "ark_Utility.h"
#include "scripting/lua-bindings/manual/tolua_fix.h"
#include "scripting/lua-bindings/manual/LuaBasicConversions.h"

int lua_ark_Utility_SystemHelper_GetHexString(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 2)
    {
        const char* arg0;
        int arg1;
        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "SystemHelper:GetHexString"); arg0 = arg0_tmp.c_str();
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:GetHexString");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_GetHexString'", nullptr);
            return 0;
        }
        std::string ret = SystemHelper::GetHexString(arg0, arg1);
        tolua_pushcppstring(tolua_S,ret);
        return 1;
    }
    if (argc == 3)
    {
        const char* arg0;
        int arg1;
        bool arg2;
        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "SystemHelper:GetHexString"); arg0 = arg0_tmp.c_str();
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:GetHexString");
        ok &= luaval_to_boolean(tolua_S, 4,&arg2, "SystemHelper:GetHexString");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_GetHexString'", nullptr);
            return 0;
        }
        std::string ret = SystemHelper::GetHexString(arg0, arg1, arg2);
        tolua_pushcppstring(tolua_S,ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:GetHexString",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_GetHexString'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_FilterLimitedMsg(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 1)
    {
        std::string arg0;
        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "SystemHelper:FilterLimitedMsg");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_FilterLimitedMsg'", nullptr);
            return 0;
        }
        std::string ret = SystemHelper::FilterLimitedMsg(arg0);
        tolua_pushcppstring(tolua_S,ret);
        return 1;
    }
    if (argc == 2)
    {
        std::string arg0;
        bool arg1;
        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "SystemHelper:FilterLimitedMsg");
        ok &= luaval_to_boolean(tolua_S, 3,&arg1, "SystemHelper:FilterLimitedMsg");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_FilterLimitedMsg'", nullptr);
            return 0;
        }
        std::string ret = SystemHelper::FilterLimitedMsg(arg0, arg1);
        tolua_pushcppstring(tolua_S,ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:FilterLimitedMsg",argc, 1);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_FilterLimitedMsg'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_Min(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S)-1;

    do 
    {
        if (argc == 2)
        {
            double arg0;
            ok &= luaval_to_number(tolua_S, 2,&arg0, "SystemHelper:Min");
            if (!ok) { break; }
            double arg1;
            ok &= luaval_to_number(tolua_S, 3,&arg1, "SystemHelper:Min");
            if (!ok) { break; }
            double ret = SystemHelper::Min(arg0, arg1);
            tolua_pushnumber(tolua_S,(lua_Number)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    do 
    {
        if (argc == 2)
        {
            int arg0;
            ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:Min");
            if (!ok) { break; }
            int arg1;
            ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:Min");
            if (!ok) { break; }
            int ret = SystemHelper::Min(arg0, arg1);
            tolua_pushnumber(tolua_S,(lua_Number)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d", "SystemHelper:Min",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_Min'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_GetVersionStr(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 1)
    {
        int arg0;
        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:GetVersionStr");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_GetVersionStr'", nullptr);
            return 0;
        }
        std::string ret = SystemHelper::GetVersionStr(arg0);
        tolua_pushcppstring(tolua_S,ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:GetVersionStr",argc, 1);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_GetVersionStr'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_RandomRange(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 2)
    {
        int arg0;
        int arg1;
        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:RandomRange");
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:RandomRange");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_RandomRange'", nullptr);
            return 0;
        }
        int ret = SystemHelper::RandomRange(arg0, arg1);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:RandomRange",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_RandomRange'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_GetCurTick(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 0)
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_GetCurTick'", nullptr);
            return 0;
        }
        double ret = SystemHelper::GetCurTick();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:GetCurTick",argc, 0);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_GetCurTick'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_IsInTriangle(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 4)
    {
        cocos2d::Vec2 arg0;
        cocos2d::Vec2 arg1;
        cocos2d::Vec2 arg2;
        cocos2d::Vec2 arg3;
        ok &= luaval_to_vec2(tolua_S, 2, &arg0, "SystemHelper:IsInTriangle");
        ok &= luaval_to_vec2(tolua_S, 3, &arg1, "SystemHelper:IsInTriangle");
        ok &= luaval_to_vec2(tolua_S, 4, &arg2, "SystemHelper:IsInTriangle");
        ok &= luaval_to_vec2(tolua_S, 5, &arg3, "SystemHelper:IsInTriangle");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_IsInTriangle'", nullptr);
            return 0;
        }
        bool ret = SystemHelper::IsInTriangle(arg0, arg1, arg2, arg3);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:IsInTriangle",argc, 4);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_IsInTriangle'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_FloatApproxEquals(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 2)
    {
        double arg0;
        double arg1;
        ok &= luaval_to_number(tolua_S, 2,&arg0, "SystemHelper:FloatApproxEquals");
        ok &= luaval_to_number(tolua_S, 3,&arg1, "SystemHelper:FloatApproxEquals");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_FloatApproxEquals'", nullptr);
            return 0;
        }
        bool ret = SystemHelper::FloatApproxEquals(arg0, arg1);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    if (argc == 3)
    {
        double arg0;
        double arg1;
        double arg2;
        ok &= luaval_to_number(tolua_S, 2,&arg0, "SystemHelper:FloatApproxEquals");
        ok &= luaval_to_number(tolua_S, 3,&arg1, "SystemHelper:FloatApproxEquals");
        ok &= luaval_to_number(tolua_S, 4,&arg2, "SystemHelper:FloatApproxEquals");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_FloatApproxEquals'", nullptr);
            return 0;
        }
        bool ret = SystemHelper::FloatApproxEquals(arg0, arg1, arg2);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:FloatApproxEquals",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_FloatApproxEquals'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_Max(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S)-1;

    do 
    {
        if (argc == 2)
        {
            double arg0;
            ok &= luaval_to_number(tolua_S, 2,&arg0, "SystemHelper:Max");
            if (!ok) { break; }
            double arg1;
            ok &= luaval_to_number(tolua_S, 3,&arg1, "SystemHelper:Max");
            if (!ok) { break; }
            double ret = SystemHelper::Max(arg0, arg1);
            tolua_pushnumber(tolua_S,(lua_Number)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    do 
    {
        if (argc == 2)
        {
            int arg0;
            ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:Max");
            if (!ok) { break; }
            int arg1;
            ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:Max");
            if (!ok) { break; }
            int ret = SystemHelper::Max(arg0, arg1);
            tolua_pushnumber(tolua_S,(lua_Number)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d", "SystemHelper:Max",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_Max'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_reloadGame(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 0)
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_reloadGame'", nullptr);
            return 0;
        }
        SystemHelper::reloadGame();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:reloadGame",argc, 0);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_reloadGame'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_CalcRectCenterPoint(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 1)
    {
        cocos2d::Rect arg0;
        ok &= luaval_to_rect(tolua_S, 2, &arg0, "SystemHelper:CalcRectCenterPoint");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_CalcRectCenterPoint'", nullptr);
            return 0;
        }
        cocos2d::Vec2 ret = SystemHelper::CalcRectCenterPoint(arg0);
        vec2_to_luaval(tolua_S, ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:CalcRectCenterPoint",argc, 1);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_CalcRectCenterPoint'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_bit_and(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 2)
    {
        int arg0;
        int arg1;
        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:bit_and");
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:bit_and");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_bit_and'", nullptr);
            return 0;
        }
        int ret = SystemHelper::bit_and(arg0, arg1);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:bit_and",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_bit_and'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_calcDistance(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S)-1;

    do 
    {
        if (argc == 2)
        {
            cocos2d::Vec2 arg0;
            ok &= luaval_to_vec2(tolua_S, 2, &arg0, "SystemHelper:calcDistance");
            if (!ok) { break; }
            cocos2d::Vec2 arg1;
            ok &= luaval_to_vec2(tolua_S, 3, &arg1, "SystemHelper:calcDistance");
            if (!ok) { break; }
            double ret = SystemHelper::calcDistance(arg0, arg1);
            tolua_pushnumber(tolua_S,(lua_Number)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    do 
    {
        if (argc == 4)
        {
            double arg0;
            ok &= luaval_to_number(tolua_S, 2,&arg0, "SystemHelper:calcDistance");
            if (!ok) { break; }
            double arg1;
            ok &= luaval_to_number(tolua_S, 3,&arg1, "SystemHelper:calcDistance");
            if (!ok) { break; }
            double arg2;
            ok &= luaval_to_number(tolua_S, 4,&arg2, "SystemHelper:calcDistance");
            if (!ok) { break; }
            double arg3;
            ok &= luaval_to_number(tolua_S, 5,&arg3, "SystemHelper:calcDistance");
            if (!ok) { break; }
            double ret = SystemHelper::calcDistance(arg0, arg1, arg2, arg3);
            tolua_pushnumber(tolua_S,(lua_Number)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d", "SystemHelper:calcDistance",argc, 4);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_calcDistance'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_gettm(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 1)
    {
        long long arg0;
        ok &= luaval_to_long_long(tolua_S, 2,&arg0, "SystemHelper:gettm");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_gettm'", nullptr);
            return 0;
        }
        tm* ret = SystemHelper::gettm(arg0);
        #pragma warning NO CONVERSION FROM NATIVE FOR tm*;
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:gettm",argc, 1);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_gettm'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_IsEqualAny(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S)-1;

    do 
    {
        if (argc == 4)
        {
            int arg0;
            ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg1;
            ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg2;
            ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg3;
            ok &= luaval_to_int32(tolua_S, 5,(int *)&arg3, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int ret = SystemHelper::IsEqualAny(arg0, arg1, arg2, arg3);
            tolua_pushnumber(tolua_S,(lua_Number)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    do 
    {
        if (argc == 3)
        {
            int arg0;
            ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg1;
            ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg2;
            ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int ret = SystemHelper::IsEqualAny(arg0, arg1, arg2);
            tolua_pushnumber(tolua_S,(lua_Number)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    do 
    {
        if (argc == 5)
        {
            int arg0;
            ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg1;
            ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg2;
            ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg3;
            ok &= luaval_to_int32(tolua_S, 5,(int *)&arg3, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg4;
            ok &= luaval_to_int32(tolua_S, 6,(int *)&arg4, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int ret = SystemHelper::IsEqualAny(arg0, arg1, arg2, arg3, arg4);
            tolua_pushnumber(tolua_S,(lua_Number)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    do 
    {
        if (argc == 6)
        {
            int arg0;
            ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg1;
            ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg2;
            ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg3;
            ok &= luaval_to_int32(tolua_S, 5,(int *)&arg3, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg4;
            ok &= luaval_to_int32(tolua_S, 6,(int *)&arg4, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg5;
            ok &= luaval_to_int32(tolua_S, 7,(int *)&arg5, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int ret = SystemHelper::IsEqualAny(arg0, arg1, arg2, arg3, arg4, arg5);
            tolua_pushnumber(tolua_S,(lua_Number)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    do 
    {
        if (argc == 7)
        {
            int arg0;
            ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg1;
            ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg2;
            ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg3;
            ok &= luaval_to_int32(tolua_S, 5,(int *)&arg3, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg4;
            ok &= luaval_to_int32(tolua_S, 6,(int *)&arg4, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg5;
            ok &= luaval_to_int32(tolua_S, 7,(int *)&arg5, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int arg6;
            ok &= luaval_to_int32(tolua_S, 8,(int *)&arg6, "SystemHelper:IsEqualAny");
            if (!ok) { break; }
            int ret = SystemHelper::IsEqualAny(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
            tolua_pushnumber(tolua_S,(lua_Number)ret);
            return 1;
        }
    } while (0);
    ok  = true;
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d", "SystemHelper:IsEqualAny",argc, 7);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_IsEqualAny'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_isNearRedColor(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 1)
    {
        cocos2d::Color3B arg0;
        ok &= luaval_to_color3b(tolua_S, 2, &arg0, "SystemHelper:isNearRedColor");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_isNearRedColor'", nullptr);
            return 0;
        }
        bool ret = SystemHelper::isNearRedColor(arg0);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:isNearRedColor",argc, 1);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_isNearRedColor'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_bit_r(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 2)
    {
        int arg0;
        int arg1;
        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:bit_r");
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:bit_r");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_bit_r'", nullptr);
            return 0;
        }
        int ret = SystemHelper::bit_r(arg0, arg1);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:bit_r",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_bit_r'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_GetHexStringByStream(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 3)
    {
        ark_Stream* arg0;
        int arg1;
        int arg2;
        ok &= luaval_to_object<ark_Stream>(tolua_S, 2, "ark_Stream",&arg0, "SystemHelper:GetHexStringByStream");
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:GetHexStringByStream");
        ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "SystemHelper:GetHexStringByStream");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_GetHexStringByStream'", nullptr);
            return 0;
        }
        std::string ret = SystemHelper::GetHexStringByStream(arg0, arg1, arg2);
        tolua_pushcppstring(tolua_S,ret);
        return 1;
    }
    if (argc == 4)
    {
        ark_Stream* arg0;
        int arg1;
        int arg2;
        bool arg3;
        ok &= luaval_to_object<ark_Stream>(tolua_S, 2, "ark_Stream",&arg0, "SystemHelper:GetHexStringByStream");
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:GetHexStringByStream");
        ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "SystemHelper:GetHexStringByStream");
        ok &= luaval_to_boolean(tolua_S, 5,&arg3, "SystemHelper:GetHexStringByStream");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_GetHexStringByStream'", nullptr);
            return 0;
        }
        std::string ret = SystemHelper::GetHexStringByStream(arg0, arg1, arg2, arg3);
        tolua_pushcppstring(tolua_S,ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:GetHexStringByStream",argc, 3);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_GetHexStringByStream'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_bit_or(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 2)
    {
        int arg0;
        int arg1;
        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:bit_or");
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:bit_or");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_bit_or'", nullptr);
            return 0;
        }
        int ret = SystemHelper::bit_or(arg0, arg1);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:bit_or",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_bit_or'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_isNearYellowColor(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 1)
    {
        cocos2d::Color3B arg0;
        ok &= luaval_to_color3b(tolua_S, 2, &arg0, "SystemHelper:isNearYellowColor");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_isNearYellowColor'", nullptr);
            return 0;
        }
        bool ret = SystemHelper::isNearYellowColor(arg0);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:isNearYellowColor",argc, 1);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_isNearYellowColor'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_isNearBlueColor(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 1)
    {
        cocos2d::Color3B arg0;
        ok &= luaval_to_color3b(tolua_S, 2, &arg0, "SystemHelper:isNearBlueColor");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_isNearBlueColor'", nullptr);
            return 0;
        }
        bool ret = SystemHelper::isNearBlueColor(arg0);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:isNearBlueColor",argc, 1);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_isNearBlueColor'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_GetHexStringByBuf(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 2)
    {
        const char* arg0;
        int arg1;
        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "SystemHelper:GetHexStringByBuf"); arg0 = arg0_tmp.c_str();
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:GetHexStringByBuf");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_GetHexStringByBuf'", nullptr);
            return 0;
        }
        std::string ret = SystemHelper::GetHexStringByBuf(arg0, arg1);
        tolua_pushcppstring(tolua_S,ret);
        return 1;
    }
    if (argc == 3)
    {
        const char* arg0;
        int arg1;
        bool arg2;
        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "SystemHelper:GetHexStringByBuf"); arg0 = arg0_tmp.c_str();
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:GetHexStringByBuf");
        ok &= luaval_to_boolean(tolua_S, 4,&arg2, "SystemHelper:GetHexStringByBuf");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_GetHexStringByBuf'", nullptr);
            return 0;
        }
        std::string ret = SystemHelper::GetHexStringByBuf(arg0, arg1, arg2);
        tolua_pushcppstring(tolua_S,ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:GetHexStringByBuf",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_GetHexStringByBuf'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_bit_l(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 2)
    {
        int arg0;
        int arg1;
        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:bit_l");
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:bit_l");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_bit_l'", nullptr);
            return 0;
        }
        int ret = SystemHelper::bit_l(arg0, arg1);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:bit_l",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_bit_l'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_getTimeStamp(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 0)
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_getTimeStamp'", nullptr);
            return 0;
        }
        long ret = SystemHelper::getTimeStamp();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:getTimeStamp",argc, 0);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_getTimeStamp'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_InRange(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 3)
    {
        int arg0;
        int arg1;
        int arg2;
        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:InRange");
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:InRange");
        ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "SystemHelper:InRange");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_InRange'", nullptr);
            return 0;
        }
        int ret = SystemHelper::InRange(arg0, arg1, arg2);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:InRange",argc, 3);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_InRange'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_bit_xor(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 2)
    {
        int arg0;
        int arg1;
        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "SystemHelper:bit_xor");
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "SystemHelper:bit_xor");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_bit_xor'", nullptr);
            return 0;
        }
        int ret = SystemHelper::bit_xor(arg0, arg1);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:bit_xor",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_bit_xor'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_isNearGreenColor(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 1)
    {
        cocos2d::Color3B arg0;
        ok &= luaval_to_color3b(tolua_S, 2, &arg0, "SystemHelper:isNearGreenColor");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_isNearGreenColor'", nullptr);
            return 0;
        }
        bool ret = SystemHelper::isNearGreenColor(arg0);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:isNearGreenColor",argc, 1);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_isNearGreenColor'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_isSameColor(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 2)
    {
        cocos2d::Color3B arg0;
        cocos2d::Color3B arg1;
        ok &= luaval_to_color3b(tolua_S, 2, &arg0, "SystemHelper:isSameColor");
        ok &= luaval_to_color3b(tolua_S, 3, &arg1, "SystemHelper:isSameColor");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_isSameColor'", nullptr);
            return 0;
        }
        bool ret = SystemHelper::isSameColor(arg0, arg1);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:isSameColor",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_isSameColor'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_GetStreamFromHexString(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 3)
    {
        std::string arg0;
        ark_Stream* arg1;
        int arg2;
        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "SystemHelper:GetStreamFromHexString");
        ok &= luaval_to_object<ark_Stream>(tolua_S, 3, "ark_Stream",&arg1, "SystemHelper:GetStreamFromHexString");
        ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "SystemHelper:GetStreamFromHexString");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_GetStreamFromHexString'", nullptr);
            return 0;
        }
        int ret = SystemHelper::GetStreamFromHexString(arg0, arg1, arg2);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:GetStreamFromHexString",argc, 3);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_GetStreamFromHexString'.",&tolua_err);
#endif
    return 0;
}
int lua_ark_Utility_SystemHelper_getHSLGlprogramState(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SystemHelper",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 0)
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Utility_SystemHelper_getHSLGlprogramState'", nullptr);
            return 0;
        }
        cocos2d::GLProgramState* ret = SystemHelper::getHSLGlprogramState();
        object_to_luaval<cocos2d::GLProgramState>(tolua_S, "cc.GLProgramState",(cocos2d::GLProgramState*)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SystemHelper:getHSLGlprogramState",argc, 0);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Utility_SystemHelper_getHSLGlprogramState'.",&tolua_err);
#endif
    return 0;
}
static int lua_ark_Utility_SystemHelper_finalize(lua_State* tolua_S)
{
    printf("luabindings: finalizing LUA object (SystemHelper)");
    return 0;
}

int lua_register_ark_Utility_SystemHelper(lua_State* tolua_S)
{
    tolua_usertype(tolua_S,"SystemHelper");
    tolua_cclass(tolua_S,"SystemHelper","SystemHelper","",nullptr);

    tolua_beginmodule(tolua_S,"SystemHelper");
        tolua_function(tolua_S,"GetHexString", lua_ark_Utility_SystemHelper_GetHexString);
        tolua_function(tolua_S,"FilterLimitedMsg", lua_ark_Utility_SystemHelper_FilterLimitedMsg);
        tolua_function(tolua_S,"Min", lua_ark_Utility_SystemHelper_Min);
        tolua_function(tolua_S,"GetVersionStr", lua_ark_Utility_SystemHelper_GetVersionStr);
        tolua_function(tolua_S,"RandomRange", lua_ark_Utility_SystemHelper_RandomRange);
        tolua_function(tolua_S,"GetCurTick", lua_ark_Utility_SystemHelper_GetCurTick);
        tolua_function(tolua_S,"IsInTriangle", lua_ark_Utility_SystemHelper_IsInTriangle);
        tolua_function(tolua_S,"FloatApproxEquals", lua_ark_Utility_SystemHelper_FloatApproxEquals);
        tolua_function(tolua_S,"Max", lua_ark_Utility_SystemHelper_Max);
        tolua_function(tolua_S,"reloadGame", lua_ark_Utility_SystemHelper_reloadGame);
        tolua_function(tolua_S,"CalcRectCenterPoint", lua_ark_Utility_SystemHelper_CalcRectCenterPoint);
        tolua_function(tolua_S,"bit_and", lua_ark_Utility_SystemHelper_bit_and);
        tolua_function(tolua_S,"calcDistance", lua_ark_Utility_SystemHelper_calcDistance);
        tolua_function(tolua_S,"gettm", lua_ark_Utility_SystemHelper_gettm);
        tolua_function(tolua_S,"IsEqualAny", lua_ark_Utility_SystemHelper_IsEqualAny);
        tolua_function(tolua_S,"isNearRedColor", lua_ark_Utility_SystemHelper_isNearRedColor);
        tolua_function(tolua_S,"bit_r", lua_ark_Utility_SystemHelper_bit_r);
        tolua_function(tolua_S,"GetHexStringByStream", lua_ark_Utility_SystemHelper_GetHexStringByStream);
        tolua_function(tolua_S,"bit_or", lua_ark_Utility_SystemHelper_bit_or);
        tolua_function(tolua_S,"isNearYellowColor", lua_ark_Utility_SystemHelper_isNearYellowColor);
        tolua_function(tolua_S,"isNearBlueColor", lua_ark_Utility_SystemHelper_isNearBlueColor);
        tolua_function(tolua_S,"GetHexStringByBuf", lua_ark_Utility_SystemHelper_GetHexStringByBuf);
        tolua_function(tolua_S,"bit_l", lua_ark_Utility_SystemHelper_bit_l);
        tolua_function(tolua_S,"getTimeStamp", lua_ark_Utility_SystemHelper_getTimeStamp);
        tolua_function(tolua_S,"InRange", lua_ark_Utility_SystemHelper_InRange);
        tolua_function(tolua_S,"bit_xor", lua_ark_Utility_SystemHelper_bit_xor);
        tolua_function(tolua_S,"isNearGreenColor", lua_ark_Utility_SystemHelper_isNearGreenColor);
        tolua_function(tolua_S,"isSameColor", lua_ark_Utility_SystemHelper_isSameColor);
        tolua_function(tolua_S,"GetStreamFromHexString", lua_ark_Utility_SystemHelper_GetStreamFromHexString);
        tolua_function(tolua_S,"getHSLGlprogramState", lua_ark_Utility_SystemHelper_getHSLGlprogramState);
    tolua_endmodule(tolua_S);
    std::string typeName = typeid(SystemHelper).name();
    g_luaType[typeName] = "SystemHelper";
    g_typeCast["SystemHelper"] = "SystemHelper";
    return 1;
}
TOLUA_API int register_all_ark_Utility(lua_State* tolua_S)
{
	tolua_open(tolua_S);
	
	tolua_module(tolua_S,nullptr,0);
	tolua_beginmodule(tolua_S,nullptr);

	lua_register_ark_Utility_SystemHelper(tolua_S);

	tolua_endmodule(tolua_S);
	return 1;
}

