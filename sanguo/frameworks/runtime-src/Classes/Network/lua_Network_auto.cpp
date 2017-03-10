#include "scripting/lua-bindings/auto/lua_Network_auto.hpp"
#include "ark_socket.h"
#include "MsgDealMgr.h"
#include "NetMsgMgr.h"
#include "ark_socketEvent.h"
#include "scripting/lua-bindings/manual/tolua_fix.h"
#include "scripting/lua-bindings/manual/LuaBasicConversions.h"

int lua_Network_ClientSocket_DoOnClose(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_DoOnClose'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_DoOnClose'", nullptr);
            return 0;
        }
        cobj->DoOnClose();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:DoOnClose",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_DoOnClose'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_GetEvent(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_GetEvent'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_GetEvent'", nullptr);
            return 0;
        }
        ClientSocketEvent* ret = cobj->GetEvent();
        object_to_luaval<ClientSocketEvent>(tolua_S, "ClientSocketEvent",(ClientSocketEvent*)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:GetEvent",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_GetEvent'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_DoOnConnect(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_DoOnConnect'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_DoOnConnect'", nullptr);
            return 0;
        }
        cobj->DoOnConnect();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:DoOnConnect",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_DoOnConnect'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_GetMsg(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_GetMsg'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_GetMsg'", nullptr);
            return 0;
        }
        std::string ret = cobj->GetMsg();
        tolua_pushcppstring(tolua_S,ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:GetMsg",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_GetMsg'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_DoOnRunExData(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_DoOnRunExData'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_DoOnRunExData'", nullptr);
            return 0;
        }
        cobj->DoOnRunExData();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:DoOnRunExData",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_DoOnRunExData'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_clearEvent(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_clearEvent'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_clearEvent'", nullptr);
            return 0;
        }
        cobj->clearEvent();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:clearEvent",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_clearEvent'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_Stop(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_Stop'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_Stop'", nullptr);
            return 0;
        }
        cobj->Stop();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:Stop",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_Stop'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_SetServerIP(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_SetServerIP'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        const char* arg0;
        int arg1;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ClientSocket:SetServerIP"); arg0 = arg0_tmp.c_str();

        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "ClientSocket:SetServerIP");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_SetServerIP'", nullptr);
            return 0;
        }
        cobj->SetServerIP(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:SetServerIP",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_SetServerIP'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_Send(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_Send'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        const char* arg0;
        int arg1;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ClientSocket:Send"); arg0 = arg0_tmp.c_str();

        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "ClientSocket:Send");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_Send'", nullptr);
            return 0;
        }
        int ret = cobj->Send(arg0, arg1);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:Send",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_Send'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_OnRecvData(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_OnRecvData'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_OnRecvData'", nullptr);
            return 0;
        }
        cobj->OnRecvData();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:OnRecvData",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_OnRecvData'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_SetEvent(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_SetEvent'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        ClientSocketEvent* arg0;

        ok &= luaval_to_object<ClientSocketEvent>(tolua_S, 2, "ClientSocketEvent",&arg0, "ClientSocket:SetEvent");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_SetEvent'", nullptr);
            return 0;
        }
        cobj->SetEvent(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:SetEvent",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_SetEvent'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_Start(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_Start'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_Start'", nullptr);
            return 0;
        }
        int ret = cobj->Start();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:Start",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_Start'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_DoOnSocketError(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_DoOnSocketError'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_DoOnSocketError'", nullptr);
            return 0;
        }
        cobj->DoOnSocketError();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:DoOnSocketError",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_DoOnSocketError'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_IsConnected(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_IsConnected'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_IsConnected'", nullptr);
            return 0;
        }
        bool ret = cobj->IsConnected();
        tolua_pushboolean(tolua_S,(bool)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:IsConnected",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_IsConnected'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_DoOnConnectFail(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_DoOnConnectFail'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_DoOnConnectFail'", nullptr);
            return 0;
        }
        cobj->DoOnConnectFail();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:DoOnConnectFail",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_DoOnConnectFail'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_Close(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_Close'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_Close'", nullptr);
            return 0;
        }
        int ret = cobj->Close();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:Close",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_Close'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_getCurrentSystemTime(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_getCurrentSystemTime'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_getCurrentSystemTime'", nullptr);
            return 0;
        }
        const std::string ret = cobj->getCurrentSystemTime();
        tolua_pushcppstring(tolua_S,ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:getCurrentSystemTime",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_getCurrentSystemTime'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_DoOnData(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_DoOnData'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        const char* arg0;
        int arg1;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ClientSocket:DoOnData"); arg0 = arg0_tmp.c_str();

        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "ClientSocket:DoOnData");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_DoOnData'", nullptr);
            return 0;
        }
        cobj->DoOnData(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:DoOnData",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_DoOnData'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_SetMsg(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_SetMsg'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        std::string arg0;

        ok &= luaval_to_std_string(tolua_S, 2,&arg0, "ClientSocket:SetMsg");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_SetMsg'", nullptr);
            return 0;
        }
        cobj->SetMsg(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:SetMsg",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_SetMsg'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_closeThread(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ClientSocket",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ClientSocket*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ClientSocket_closeThread'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_closeThread'", nullptr);
            return 0;
        }
        cobj->closeThread();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:closeThread",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_closeThread'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ClientSocket_constructor(lua_State* tolua_S)
{
    int argc = 0;
    ClientSocket* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif



    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ClientSocket_constructor'", nullptr);
            return 0;
        }
        cobj = new ClientSocket();
        tolua_pushusertype(tolua_S,(void*)cobj,"ClientSocket");
        tolua_register_gc(tolua_S,lua_gettop(tolua_S));
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ClientSocket:ClientSocket",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ClientSocket_constructor'.",&tolua_err);
#endif

    return 0;
}

static int lua_Network_ClientSocket_finalize(lua_State* tolua_S)
{
    printf("luabindings: finalizing LUA object (ClientSocket)");
    return 0;
}

int lua_register_Network_ClientSocket(lua_State* tolua_S)
{
    tolua_usertype(tolua_S,"ClientSocket");
    tolua_cclass(tolua_S,"ClientSocket","ClientSocket","",nullptr);

    tolua_beginmodule(tolua_S,"ClientSocket");
        tolua_function(tolua_S,"new",lua_Network_ClientSocket_constructor);
        tolua_function(tolua_S,"DoOnClose",lua_Network_ClientSocket_DoOnClose);
        tolua_function(tolua_S,"GetEvent",lua_Network_ClientSocket_GetEvent);
        tolua_function(tolua_S,"DoOnConnect",lua_Network_ClientSocket_DoOnConnect);
        tolua_function(tolua_S,"GetMsg",lua_Network_ClientSocket_GetMsg);
        tolua_function(tolua_S,"DoOnRunExData",lua_Network_ClientSocket_DoOnRunExData);
        tolua_function(tolua_S,"clearEvent",lua_Network_ClientSocket_clearEvent);
        tolua_function(tolua_S,"Stop",lua_Network_ClientSocket_Stop);
        tolua_function(tolua_S,"SetServerIP",lua_Network_ClientSocket_SetServerIP);
        tolua_function(tolua_S,"Send",lua_Network_ClientSocket_Send);
        tolua_function(tolua_S,"OnRecvData",lua_Network_ClientSocket_OnRecvData);
        tolua_function(tolua_S,"SetEvent",lua_Network_ClientSocket_SetEvent);
        tolua_function(tolua_S,"Start",lua_Network_ClientSocket_Start);
        tolua_function(tolua_S,"DoOnSocketError",lua_Network_ClientSocket_DoOnSocketError);
        tolua_function(tolua_S,"IsConnected",lua_Network_ClientSocket_IsConnected);
        tolua_function(tolua_S,"DoOnConnectFail",lua_Network_ClientSocket_DoOnConnectFail);
        tolua_function(tolua_S,"Close",lua_Network_ClientSocket_Close);
        tolua_function(tolua_S,"getCurrentSystemTime",lua_Network_ClientSocket_getCurrentSystemTime);
        tolua_function(tolua_S,"DoOnData",lua_Network_ClientSocket_DoOnData);
        tolua_function(tolua_S,"SetMsg",lua_Network_ClientSocket_SetMsg);
        tolua_function(tolua_S,"closeThread",lua_Network_ClientSocket_closeThread);
    tolua_endmodule(tolua_S);
    std::string typeName = typeid(ClientSocket).name();
    g_luaType[typeName] = "ClientSocket";
    g_typeCast["ClientSocket"] = "ClientSocket";
    return 1;
}

int lua_Network_NetMsgMgr_extractRecvMsg(lua_State* tolua_S)
{
    int argc = 0;
    NetMsgMgr* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"NetMsgMgr",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (NetMsgMgr*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_NetMsgMgr_extractRecvMsg'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_NetMsgMgr_extractRecvMsg'", nullptr);
            return 0;
        }
        ark_NetMsg* ret = cobj->extractRecvMsg();
        object_to_luaval<ark_NetMsg>(tolua_S, "ark_NetMsg",(ark_NetMsg*)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "NetMsgMgr:extractRecvMsg",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_NetMsgMgr_extractRecvMsg'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_NetMsgMgr_addRecvMsg(lua_State* tolua_S)
{
    int argc = 0;
    NetMsgMgr* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"NetMsgMgr",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (NetMsgMgr*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_NetMsgMgr_addRecvMsg'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        ark_NetMsg* arg0;

        ok &= luaval_to_object<ark_NetMsg>(tolua_S, 2, "ark_NetMsg",&arg0, "NetMsgMgr:addRecvMsg");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_NetMsgMgr_addRecvMsg'", nullptr);
            return 0;
        }
        cobj->addRecvMsg(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "NetMsgMgr:addRecvMsg",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_NetMsgMgr_addRecvMsg'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_NetMsgMgr_addSendMsg(lua_State* tolua_S)
{
    int argc = 0;
    NetMsgMgr* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"NetMsgMgr",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (NetMsgMgr*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_NetMsgMgr_addSendMsg'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        ark_NetMsg* arg0;

        ok &= luaval_to_object<ark_NetMsg>(tolua_S, 2, "ark_NetMsg",&arg0, "NetMsgMgr:addSendMsg");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_NetMsgMgr_addSendMsg'", nullptr);
            return 0;
        }
        cobj->addSendMsg(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "NetMsgMgr:addSendMsg",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_NetMsgMgr_addSendMsg'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_NetMsgMgr_extractSendMsg(lua_State* tolua_S)
{
    int argc = 0;
    NetMsgMgr* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"NetMsgMgr",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (NetMsgMgr*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_NetMsgMgr_extractSendMsg'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_NetMsgMgr_extractSendMsg'", nullptr);
            return 0;
        }
        ark_NetMsg* ret = cobj->extractSendMsg();
        object_to_luaval<ark_NetMsg>(tolua_S, "ark_NetMsg",(ark_NetMsg*)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "NetMsgMgr:extractSendMsg",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_NetMsgMgr_extractSendMsg'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_NetMsgMgr_ClearAllMsg(lua_State* tolua_S)
{
    int argc = 0;
    NetMsgMgr* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"NetMsgMgr",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (NetMsgMgr*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_NetMsgMgr_ClearAllMsg'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_NetMsgMgr_ClearAllMsg'", nullptr);
            return 0;
        }
        cobj->ClearAllMsg();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "NetMsgMgr:ClearAllMsg",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_NetMsgMgr_ClearAllMsg'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_NetMsgMgr_getInstance(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"NetMsgMgr",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 0)
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_NetMsgMgr_getInstance'", nullptr);
            return 0;
        }
        NetMsgMgr* ret = NetMsgMgr::getInstance();
        object_to_luaval<NetMsgMgr>(tolua_S, "NetMsgMgr",(NetMsgMgr*)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "NetMsgMgr:getInstance",argc, 0);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_NetMsgMgr_getInstance'.",&tolua_err);
#endif
    return 0;
}
int lua_Network_NetMsgMgr_freeInstance(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"NetMsgMgr",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 0)
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_NetMsgMgr_freeInstance'", nullptr);
            return 0;
        }
        NetMsgMgr::freeInstance();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "NetMsgMgr:freeInstance",argc, 0);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_NetMsgMgr_freeInstance'.",&tolua_err);
#endif
    return 0;
}
static int lua_Network_NetMsgMgr_finalize(lua_State* tolua_S)
{
    printf("luabindings: finalizing LUA object (NetMsgMgr)");
    return 0;
}

int lua_register_Network_NetMsgMgr(lua_State* tolua_S)
{
    tolua_usertype(tolua_S,"NetMsgMgr");
    tolua_cclass(tolua_S,"NetMsgMgr","NetMsgMgr","",nullptr);

    tolua_beginmodule(tolua_S,"NetMsgMgr");
        tolua_function(tolua_S,"extractRecvMsg",lua_Network_NetMsgMgr_extractRecvMsg);
        tolua_function(tolua_S,"addRecvMsg",lua_Network_NetMsgMgr_addRecvMsg);
        tolua_function(tolua_S,"addSendMsg",lua_Network_NetMsgMgr_addSendMsg);
        tolua_function(tolua_S,"extractSendMsg",lua_Network_NetMsgMgr_extractSendMsg);
        tolua_function(tolua_S,"ClearAllMsg",lua_Network_NetMsgMgr_ClearAllMsg);
        tolua_function(tolua_S,"getInstance", lua_Network_NetMsgMgr_getInstance);
        tolua_function(tolua_S,"freeInstance", lua_Network_NetMsgMgr_freeInstance);
    tolua_endmodule(tolua_S);
    std::string typeName = typeid(NetMsgMgr).name();
    g_luaType[typeName] = "NetMsgMgr";
    g_typeCast["NetMsgMgr"] = "NetMsgMgr";
    return 1;
}

int lua_Network_MsgDealMgr_QueryPackAndSend(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"MsgDealMgr",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 1)
    {
        ark_Stream* arg0;
        ok &= luaval_to_object<ark_Stream>(tolua_S, 2, "ark_Stream",&arg0, "MsgDealMgr:QueryPackAndSend");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_MsgDealMgr_QueryPackAndSend'", nullptr);
            return 0;
        }
        MsgDealMgr::QueryPackAndSend(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "MsgDealMgr:QueryPackAndSend",argc, 1);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_MsgDealMgr_QueryPackAndSend'.",&tolua_err);
#endif
    return 0;
}
int lua_Network_MsgDealMgr_registerLock(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"MsgDealMgr",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 2)
    {
        int arg0;
        int arg1;
        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "MsgDealMgr:registerLock");
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "MsgDealMgr:registerLock");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_MsgDealMgr_registerLock'", nullptr);
            return 0;
        }
        MsgDealMgr::registerLock(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "MsgDealMgr:registerLock",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_MsgDealMgr_registerLock'.",&tolua_err);
#endif
    return 0;
}
int lua_Network_MsgDealMgr_unregisterLock(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"MsgDealMgr",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 2)
    {
        int arg0;
        int arg1;
        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "MsgDealMgr:unregisterLock");
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "MsgDealMgr:unregisterLock");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_MsgDealMgr_unregisterLock'", nullptr);
            return 0;
        }
        MsgDealMgr::unregisterLock(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "MsgDealMgr:unregisterLock",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_MsgDealMgr_unregisterLock'.",&tolua_err);
#endif
    return 0;
}
int lua_Network_MsgDealMgr_QueryMsgHeader(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"MsgDealMgr",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 1)
    {
        unsigned int arg0;
        ok &= luaval_to_uint32(tolua_S, 2,&arg0, "MsgDealMgr:QueryMsgHeader");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_MsgDealMgr_QueryMsgHeader'", nullptr);
            return 0;
        }
        MsgDealMgr::QueryMsgHeader(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "MsgDealMgr:QueryMsgHeader",argc, 1);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_MsgDealMgr_QueryMsgHeader'.",&tolua_err);
#endif
    return 0;
}
int lua_Network_MsgDealMgr_QueryInitWithCMD(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"MsgDealMgr",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 3)
    {
        int arg0;
        ark_Stream* arg1;
        int arg2;
        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "MsgDealMgr:QueryInitWithCMD");
        ok &= luaval_to_object<ark_Stream>(tolua_S, 3, "ark_Stream",&arg1, "MsgDealMgr:QueryInitWithCMD");
        ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "MsgDealMgr:QueryInitWithCMD");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_MsgDealMgr_QueryInitWithCMD'", nullptr);
            return 0;
        }
        MsgDealMgr::QueryInitWithCMD(arg0, arg1, arg2);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "MsgDealMgr:QueryInitWithCMD",argc, 3);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_MsgDealMgr_QueryInitWithCMD'.",&tolua_err);
#endif
    return 0;
}
int lua_Network_MsgDealMgr_QueryMsgBuffer(lua_State* tolua_S)
{
    int argc = 0;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertable(tolua_S,1,"MsgDealMgr",0,&tolua_err)) goto tolua_lerror;
#endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 2)
    {
        const char* arg0;
        int arg1;
        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "MsgDealMgr:QueryMsgBuffer"); arg0 = arg0_tmp.c_str();
        ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "MsgDealMgr:QueryMsgBuffer");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_MsgDealMgr_QueryMsgBuffer'", nullptr);
            return 0;
        }
        MsgDealMgr::QueryMsgBuffer(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d\n ", "MsgDealMgr:QueryMsgBuffer",argc, 2);
    return 0;
#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_MsgDealMgr_QueryMsgBuffer'.",&tolua_err);
#endif
    return 0;
}
static int lua_Network_MsgDealMgr_finalize(lua_State* tolua_S)
{
    printf("luabindings: finalizing LUA object (MsgDealMgr)");
    return 0;
}

int lua_register_Network_MsgDealMgr(lua_State* tolua_S)
{
    tolua_usertype(tolua_S,"MsgDealMgr");
    tolua_cclass(tolua_S,"MsgDealMgr","MsgDealMgr","",nullptr);

    tolua_beginmodule(tolua_S,"MsgDealMgr");
        tolua_function(tolua_S,"QueryPackAndSend", lua_Network_MsgDealMgr_QueryPackAndSend);
        tolua_function(tolua_S,"registerLock", lua_Network_MsgDealMgr_registerLock);
        tolua_function(tolua_S,"unregisterLock", lua_Network_MsgDealMgr_unregisterLock);
        tolua_function(tolua_S,"QueryMsgHeader", lua_Network_MsgDealMgr_QueryMsgHeader);
        tolua_function(tolua_S,"QueryInitWithCMD", lua_Network_MsgDealMgr_QueryInitWithCMD);
        tolua_function(tolua_S,"QueryMsgBuffer", lua_Network_MsgDealMgr_QueryMsgBuffer);
    tolua_endmodule(tolua_S);
    std::string typeName = typeid(MsgDealMgr).name();
    g_luaType[typeName] = "MsgDealMgr";
    g_typeCast["MsgDealMgr"] = "MsgDealMgr";
    return 1;
}

int lua_Network_ark_socketEvent_getOnRecPack(lua_State* tolua_S)
{
    int argc = 0;
    ark_socketEvent* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_socketEvent",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_socketEvent*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ark_socketEvent_getOnRecPack'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ark_socketEvent_getOnRecPack'", nullptr);
            return 0;
        }
        int ret = cobj->getOnRecPack();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_socketEvent:getOnRecPack",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ark_socketEvent_getOnRecPack'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ark_socketEvent_OnRunExData(lua_State* tolua_S)
{
    int argc = 0;
    ark_socketEvent* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_socketEvent",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_socketEvent*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ark_socketEvent_OnRunExData'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        ClientSocket* arg0;

        ok &= luaval_to_object<ClientSocket>(tolua_S, 2, "ClientSocket",&arg0, "ark_socketEvent:OnRunExData");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ark_socketEvent_OnRunExData'", nullptr);
            return 0;
        }
        cobj->OnRunExData(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_socketEvent:OnRunExData",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ark_socketEvent_OnRunExData'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ark_socketEvent_OnConnect(lua_State* tolua_S)
{
    int argc = 0;
    ark_socketEvent* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_socketEvent",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_socketEvent*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ark_socketEvent_OnConnect'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        ClientSocket* arg0;

        ok &= luaval_to_object<ClientSocket>(tolua_S, 2, "ClientSocket",&arg0, "ark_socketEvent:OnConnect");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ark_socketEvent_OnConnect'", nullptr);
            return 0;
        }
        cobj->OnConnect(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_socketEvent:OnConnect",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ark_socketEvent_OnConnect'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ark_socketEvent_OnSocketError(lua_State* tolua_S)
{
    int argc = 0;
    ark_socketEvent* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_socketEvent",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_socketEvent*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ark_socketEvent_OnSocketError'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        ClientSocket* arg0;

        ok &= luaval_to_object<ClientSocket>(tolua_S, 2, "ClientSocket",&arg0, "ark_socketEvent:OnSocketError");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ark_socketEvent_OnSocketError'", nullptr);
            return 0;
        }
        cobj->OnSocketError(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_socketEvent:OnSocketError",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ark_socketEvent_OnSocketError'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ark_socketEvent_OnClose(lua_State* tolua_S)
{
    int argc = 0;
    ark_socketEvent* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_socketEvent",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_socketEvent*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ark_socketEvent_OnClose'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        ClientSocket* arg0;

        ok &= luaval_to_object<ClientSocket>(tolua_S, 2, "ClientSocket",&arg0, "ark_socketEvent:OnClose");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ark_socketEvent_OnClose'", nullptr);
            return 0;
        }
        cobj->OnClose(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_socketEvent:OnClose",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ark_socketEvent_OnClose'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ark_socketEvent_releaseStream(lua_State* tolua_S)
{
    int argc = 0;
    ark_socketEvent* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_socketEvent",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_socketEvent*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ark_socketEvent_releaseStream'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ark_socketEvent_releaseStream'", nullptr);
            return 0;
        }
        cobj->releaseStream();
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_socketEvent:releaseStream",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ark_socketEvent_releaseStream'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ark_socketEvent_OnData(lua_State* tolua_S)
{
    int argc = 0;
    ark_socketEvent* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_socketEvent",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_socketEvent*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ark_socketEvent_OnData'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 3) 
    {
        ClientSocket* arg0;
        const char* arg1;
        int arg2;

        ok &= luaval_to_object<ClientSocket>(tolua_S, 2, "ClientSocket",&arg0, "ark_socketEvent:OnData");

        std::string arg1_tmp; ok &= luaval_to_std_string(tolua_S, 3, &arg1_tmp, "ark_socketEvent:OnData"); arg1 = arg1_tmp.c_str();

        ok &= luaval_to_int32(tolua_S, 4,(int *)&arg2, "ark_socketEvent:OnData");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ark_socketEvent_OnData'", nullptr);
            return 0;
        }
        cobj->OnData(arg0, arg1, arg2);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_socketEvent:OnData",argc, 3);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ark_socketEvent_OnData'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ark_socketEvent_OnConnectFail(lua_State* tolua_S)
{
    int argc = 0;
    ark_socketEvent* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_socketEvent",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_socketEvent*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ark_socketEvent_OnConnectFail'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        ClientSocket* arg0;

        ok &= luaval_to_object<ClientSocket>(tolua_S, 2, "ClientSocket",&arg0, "ark_socketEvent:OnConnectFail");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ark_socketEvent_OnConnectFail'", nullptr);
            return 0;
        }
        cobj->OnConnectFail(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_socketEvent:OnConnectFail",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ark_socketEvent_OnConnectFail'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ark_socketEvent_getNode(lua_State* tolua_S)
{
    int argc = 0;
    ark_socketEvent* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_socketEvent",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_socketEvent*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ark_socketEvent_getNode'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ark_socketEvent_getNode'", nullptr);
            return 0;
        }
        cocos2d::Node* ret = cobj->getNode();
        object_to_luaval<cocos2d::Node>(tolua_S, "cc.Node",(cocos2d::Node*)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_socketEvent:getNode",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ark_socketEvent_getNode'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ark_socketEvent_getStream(lua_State* tolua_S)
{
    int argc = 0;
    ark_socketEvent* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_socketEvent",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_socketEvent*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_Network_ark_socketEvent_getStream'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ark_socketEvent_getStream'", nullptr);
            return 0;
        }
        ark_Stream* ret = cobj->getStream();
        object_to_luaval<ark_Stream>(tolua_S, "ark_Stream",(ark_Stream*)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_socketEvent:getStream",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ark_socketEvent_getStream'.",&tolua_err);
#endif

    return 0;
}
int lua_Network_ark_socketEvent_constructor(lua_State* tolua_S)
{
    int argc = 0;
    ark_socketEvent* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif



    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_Network_ark_socketEvent_constructor'", nullptr);
            return 0;
        }
        cobj = new ark_socketEvent();
        tolua_pushusertype(tolua_S,(void*)cobj,"ark_socketEvent");
        tolua_register_gc(tolua_S,lua_gettop(tolua_S));
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_socketEvent:ark_socketEvent",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_error(tolua_S,"#ferror in function 'lua_Network_ark_socketEvent_constructor'.",&tolua_err);
#endif

    return 0;
}

static int lua_Network_ark_socketEvent_finalize(lua_State* tolua_S)
{
    printf("luabindings: finalizing LUA object (ark_socketEvent)");
    return 0;
}

int lua_register_Network_ark_socketEvent(lua_State* tolua_S)
{
    tolua_usertype(tolua_S,"ark_socketEvent");
    tolua_cclass(tolua_S,"ark_socketEvent","ark_socketEvent","ClientSocketEvent",nullptr);

    tolua_beginmodule(tolua_S,"ark_socketEvent");
        tolua_function(tolua_S,"new",lua_Network_ark_socketEvent_constructor);
        tolua_function(tolua_S,"getOnRecPack",lua_Network_ark_socketEvent_getOnRecPack);
        tolua_function(tolua_S,"OnRunExData",lua_Network_ark_socketEvent_OnRunExData);
        tolua_function(tolua_S,"OnConnect",lua_Network_ark_socketEvent_OnConnect);
        tolua_function(tolua_S,"OnSocketError",lua_Network_ark_socketEvent_OnSocketError);
        tolua_function(tolua_S,"OnClose",lua_Network_ark_socketEvent_OnClose);
        tolua_function(tolua_S,"releaseStream",lua_Network_ark_socketEvent_releaseStream);
        tolua_function(tolua_S,"OnData",lua_Network_ark_socketEvent_OnData);
        tolua_function(tolua_S,"OnConnectFail",lua_Network_ark_socketEvent_OnConnectFail);
        tolua_function(tolua_S,"getNode",lua_Network_ark_socketEvent_getNode);
        tolua_function(tolua_S,"getStream",lua_Network_ark_socketEvent_getStream);
    tolua_endmodule(tolua_S);
    std::string typeName = typeid(ark_socketEvent).name();
    g_luaType[typeName] = "ark_socketEvent";
    g_typeCast["ark_socketEvent"] = "ark_socketEvent";
    return 1;
}
TOLUA_API int register_all_Network(lua_State* tolua_S)
{
	tolua_open(tolua_S);
	
	tolua_module(tolua_S,nullptr,0);
	tolua_beginmodule(tolua_S,nullptr);

	lua_register_Network_ark_socketEvent(tolua_S);
	lua_register_Network_MsgDealMgr(tolua_S);
	lua_register_Network_ClientSocket(tolua_S);
	lua_register_Network_NetMsgMgr(tolua_S);

	tolua_endmodule(tolua_S);
	return 1;
}

