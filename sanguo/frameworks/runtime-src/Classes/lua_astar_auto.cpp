#include "scripting/lua-bindings/auto/lua_astar_auto.hpp"
#include "astar.h"
#include "scripting/lua-bindings/manual/tolua_fix.h"
#include "scripting/lua-bindings/manual/LuaBasicConversions.h"

int lua_astar_SPoint_getx(lua_State* tolua_S)
{
    int argc = 0;
    SPoint* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"SPoint",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (SPoint*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_astar_SPoint_getx'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_astar_SPoint_getx'", nullptr);
            return 0;
        }
        int ret = cobj->getx();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "SPoint:getx",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_astar_SPoint_getx'.",&tolua_err);
#endif

    return 0;
}
int lua_astar_SPoint_gety(lua_State* tolua_S)
{
    int argc = 0;
    SPoint* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"SPoint",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (SPoint*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_astar_SPoint_gety'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_astar_SPoint_gety'", nullptr);
            return 0;
        }
        int ret = cobj->gety();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "SPoint:gety",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_astar_SPoint_gety'.",&tolua_err);
#endif

    return 0;
}
int lua_astar_SPoint_getX(lua_State* tolua_S)
{
    int argc = 0;
    SPoint* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"SPoint",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (SPoint*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_astar_SPoint_getX'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_astar_SPoint_getX'", nullptr);
            return 0;
        }
        int ret = cobj->getX();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "SPoint:getX",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_astar_SPoint_getX'.",&tolua_err);
#endif

    return 0;
}
int lua_astar_SPoint_init(lua_State* tolua_S)
{
    int argc = 0;
    SPoint* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"SPoint",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (SPoint*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_astar_SPoint_init'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_astar_SPoint_init'", nullptr);
            return 0;
        }
        bool ret = cobj->init();
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "SPoint:init",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_astar_SPoint_init'.",&tolua_err);
#endif

    return 0;
}
int lua_astar_SPoint_getY(lua_State* tolua_S)
{
    int argc = 0;
    SPoint* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"SPoint",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (SPoint*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_astar_SPoint_getY'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_astar_SPoint_getY'", nullptr);
            return 0;
        }
        int ret = cobj->getY();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "SPoint:getY",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_astar_SPoint_getY'.",&tolua_err);
#endif

    return 0;
}
int lua_astar_SPoint_create(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"SPoint",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 0)
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_astar_SPoint_create'", nullptr);
            return 0;
        }
        SPoint* ret = SPoint::create();
        object_to_luaval<SPoint>(tolua_S, "SPoint",(SPoint*)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "SPoint:create",argc, 0);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_astar_SPoint_create'.",&tolua_err);
#endif
    return 0;
}
static int lua_astar_SPoint_finalize(lua_State* tolua_S)
{
    printf("luabindings: finalizing LUA object (SPoint)");
    return 0;
}

int lua_register_astar_SPoint(lua_State* tolua_S)
{
    tolua_usertype(tolua_S,"SPoint");
    tolua_cclass(tolua_S,"SPoint","SPoint","cc.Ref",nullptr);

    tolua_beginmodule(tolua_S,"SPoint");
        tolua_function(tolua_S,"getx",lua_astar_SPoint_getx);
        tolua_function(tolua_S,"gety",lua_astar_SPoint_gety);
        tolua_function(tolua_S,"getX",lua_astar_SPoint_getX);
        tolua_function(tolua_S,"init",lua_astar_SPoint_init);
        tolua_function(tolua_S,"getY",lua_astar_SPoint_getY);
        tolua_function(tolua_S,"create", lua_astar_SPoint_create);
    tolua_endmodule(tolua_S);
    std::string typeName = typeid(SPoint).name();
    g_luaType[typeName] = "SPoint";
    g_typeCast["SPoint"] = "SPoint";
    return 1;
}

int lua_astar_CAStar_FindNextPathByAngle(lua_State* tolua_S)
{
    int argc = 0;
    CAStar* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"CAStar",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (CAStar*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_astar_CAStar_FindNextPathByAngle'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 3) 
    {
        int arg0;
        int arg1;
        double arg2;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "CAStar:FindNextPathByAngle");

        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "CAStar:FindNextPathByAngle");

        ok &= luaval_to_number(tolua_S, 4,&arg2, "CAStar:FindNextPathByAngle");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_astar_CAStar_FindNextPathByAngle'", nullptr);
            return 0;
        }
        bool ret = cobj->FindNextPathByAngle(arg0, arg1, arg2);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "CAStar:FindNextPathByAngle",argc, 3);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_astar_CAStar_FindNextPathByAngle'.",&tolua_err);
#endif

    return 0;
}
int lua_astar_CAStar_SetCanWalk(lua_State* tolua_S)
{
    int argc = 0;
    CAStar* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"CAStar",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (CAStar*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_astar_CAStar_SetCanWalk'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 3) 
    {
        bool arg0;
        unsigned short arg1;
        unsigned short arg2;

        ok &= luaval_to_boolean(tolua_S, 2,&arg0, "CAStar:SetCanWalk");

        ok &= luaval_to_ushort(tolua_S, 3, &arg1, "CAStar:SetCanWalk");

        ok &= luaval_to_ushort(tolua_S, 4, &arg2, "CAStar:SetCanWalk");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_astar_CAStar_SetCanWalk'", nullptr);
            return 0;
        }
        cobj->SetCanWalk(arg0, arg1, arg2);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "CAStar:SetCanWalk",argc, 3);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_astar_CAStar_SetCanWalk'.",&tolua_err);
#endif

    return 0;
}
int lua_astar_CAStar_FindPath(lua_State* tolua_S)
{
    int argc = 0;
    CAStar* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"CAStar",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (CAStar*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_astar_CAStar_FindPath'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 4) 
    {
        int arg0;
        int arg1;
        int arg2;
        int arg3;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "CAStar:FindPath");

        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "CAStar:FindPath");

        ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "CAStar:FindPath");

        ok &= luaval_to_int32(tolua_S, 5,(int *)&arg3, "CAStar:FindPath");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_astar_CAStar_FindPath'", nullptr);
            return 0;
        }
        bool ret = cobj->FindPath(arg0, arg1, arg2, arg3);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "CAStar:FindPath",argc, 4);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_astar_CAStar_FindPath'.",&tolua_err);
#endif

    return 0;
}
int lua_astar_CAStar_GetPath(lua_State* tolua_S)
{
    int argc = 0;
    CAStar* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"CAStar",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (CAStar*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_astar_CAStar_GetPath'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_astar_CAStar_GetPath'", nullptr);
            return 0;
        }
        cocos2d::Vector<SPoint *> ret = cobj->GetPath();
        ccvector_to_luaval(tolua_S, ret);
        return 1;
    }
    if (argc == 1) 
    {
        bool arg0;

        ok &= luaval_to_boolean(tolua_S, 2,&arg0, "CAStar:GetPath");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_astar_CAStar_GetPath'", nullptr);
            return 0;
        }
        cocos2d::Vector<SPoint *> ret = cobj->GetPath(arg0);
        ccvector_to_luaval(tolua_S, ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "CAStar:GetPath",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_astar_CAStar_GetPath'.",&tolua_err);
#endif

    return 0;
}
int lua_astar_CAStar_Init(lua_State* tolua_S)
{
    int argc = 0;
    CAStar* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"CAStar",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (CAStar*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_astar_CAStar_Init'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 4) 
    {
        int arg0;
        int arg1;
        int arg2;
        double arg3;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "CAStar:Init");

        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "CAStar:Init");

        ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "CAStar:Init");

        ok &= luaval_to_number(tolua_S, 5,&arg3, "CAStar:Init");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_astar_CAStar_Init'", nullptr);
            return 0;
        }
        bool ret = cobj->Init(arg0, arg1, arg2, arg3);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "CAStar:Init",argc, 4);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_astar_CAStar_Init'.",&tolua_err);
#endif

    return 0;
}
int lua_astar_CAStar_CanWalk(lua_State* tolua_S)
{
    int argc = 0;
    CAStar* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"CAStar",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (CAStar*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_astar_CAStar_CanWalk'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        unsigned short arg0;
        unsigned short arg1;

        ok &= luaval_to_ushort(tolua_S, 2, &arg0, "CAStar:CanWalk");

        ok &= luaval_to_ushort(tolua_S, 3, &arg1, "CAStar:CanWalk");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_astar_CAStar_CanWalk'", nullptr);
            return 0;
        }
        bool ret = cobj->CanWalk(arg0, arg1);
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "CAStar:CanWalk",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_astar_CAStar_CanWalk'.",&tolua_err);
#endif

    return 0;
}
int lua_astar_CAStar_constructor(lua_State* tolua_S)
{
    int argc = 0;
    CAStar* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif



    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_astar_CAStar_constructor'", nullptr);
            return 0;
        }
        cobj = new CAStar();
        tolua_pushusertype(tolua_S,(void*)cobj,"CAStar");
        tolua_register_gc(tolua_S,lua_gettop(tolua_S));
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "CAStar:CAStar",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_error(tolua_S,"#ferror in function 'lua_astar_CAStar_constructor'.",&tolua_err);
#endif

    return 0;
}

static int lua_astar_CAStar_finalize(lua_State* tolua_S)
{
    printf("luabindings: finalizing LUA object (CAStar)");
    return 0;
}

int lua_register_astar_CAStar(lua_State* tolua_S)
{
    tolua_usertype(tolua_S,"CAStar");
    tolua_cclass(tolua_S,"CAStar","CAStar","",nullptr);

    tolua_beginmodule(tolua_S,"CAStar");
        tolua_function(tolua_S,"new",lua_astar_CAStar_constructor);
        tolua_function(tolua_S,"FindNextPathByAngle",lua_astar_CAStar_FindNextPathByAngle);
        tolua_function(tolua_S,"SetCanWalk",lua_astar_CAStar_SetCanWalk);
        tolua_function(tolua_S,"FindPath",lua_astar_CAStar_FindPath);
        tolua_function(tolua_S,"GetPath",lua_astar_CAStar_GetPath);
        tolua_function(tolua_S,"Init",lua_astar_CAStar_Init);
        tolua_function(tolua_S,"CanWalk",lua_astar_CAStar_CanWalk);
    tolua_endmodule(tolua_S);
    std::string typeName = typeid(CAStar).name();
    g_luaType[typeName] = "CAStar";
    g_typeCast["CAStar"] = "CAStar";
    return 1;
}
TOLUA_API int register_all_astar(lua_State* tolua_S)
{
	tolua_open(tolua_S);
	
	tolua_module(tolua_S,nullptr,0);
	tolua_beginmodule(tolua_S,nullptr);

	lua_register_astar_SPoint(tolua_S);
	lua_register_astar_CAStar(tolua_S);

	tolua_endmodule(tolua_S);
	return 1;
}

