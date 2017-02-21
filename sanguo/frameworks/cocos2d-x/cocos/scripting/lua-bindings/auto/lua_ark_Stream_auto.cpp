#include "scripting/lua-bindings/auto/lua_ark_Stream_auto.hpp"
#include "ark_Stream.h"
#include "scripting/lua-bindings/manual/tolua_fix.h"
#include "scripting/lua-bindings/manual/LuaBasicConversions.h"

int lua_ark_Stream_ark_Stream_GetSeekPos(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_GetSeekPos'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_GetSeekPos'", nullptr);
            return 0;
        }
        unsigned long ret = cobj->GetSeekPos();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:GetSeekPos",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_GetSeekPos'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_ReadUnicodeString(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif
    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);
#if COCOS2D_DEBUG >= 1
    if (!cobj)
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_ReadUnicodeString'", nullptr);
        return 0;
    }
#endif
    argc = lua_gettop(tolua_S)-1;
    do{
        if (argc == 0) {
            std::string ret = cobj->ReadUnicodeString();
            tolua_pushcppstring(tolua_S,ret);
            return 1;
        }
    }while(0);
    ok  = true;
    do{
        if (argc == 1) {
            const char* arg0;
            std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ark_Stream:ReadUnicodeString"); arg0 = arg0_tmp.c_str();

            if (!ok) { break; }
            std::string ret = cobj->ReadUnicodeString(arg0);
            tolua_pushcppstring(tolua_S,ret);
            return 1;
        }
    }while(0);
    ok  = true;
    do{
        if (argc == 1) {
            std::string arg0;
            ok &= luaval_to_std_string(tolua_S, 2,&arg0, "ark_Stream:ReadUnicodeString");

            if (!ok) { break; }
            bool ret = cobj->ReadUnicodeString(arg0);
            tolua_pushboolean(tolua_S,(bool)ret);
            return 1;
        }
    }while(0);
    ok  = true;
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n",  "ark_Stream:ReadUnicodeString",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_ReadUnicodeString'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_WriteUInt(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_WriteUInt'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        unsigned int arg0;

        ok &= luaval_to_uint32(tolua_S, 2,&arg0, "ark_Stream:WriteUInt");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_WriteUInt'", nullptr);
            return 0;
        }
        cobj->WriteUInt(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:WriteUInt",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_WriteUInt'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_CreateReadStreamFromSelf(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromSelf'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        const char* arg0;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ark_Stream:CreateReadStreamFromSelf"); arg0 = arg0_tmp.c_str();
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromSelf'", nullptr);
            return 0;
        }
        void* ret = cobj->CreateReadStreamFromSelf(arg0);
        #pragma warning NO CONVERSION FROM NATIVE FOR void*;
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:CreateReadStreamFromSelf",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromSelf'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_WriteString(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif
    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);
#if COCOS2D_DEBUG >= 1
    if (!cobj)
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_WriteString'", nullptr);
        return 0;
    }
#endif
    argc = lua_gettop(tolua_S)-1;
    do{
        if (argc == 1) {
            std::string arg0;
            ok &= luaval_to_std_string(tolua_S, 2,&arg0, "ark_Stream:WriteString");

            if (!ok) { break; }
            cobj->WriteString(arg0);
            lua_settop(tolua_S, 1);
            return 1;
        }
    }while(0);
    ok  = true;
    do{
        if (argc == 2) {
            const void* arg0;
            #pragma warning NO CONVERSION TO NATIVE FOR void*
		ok = false;

            if (!ok) { break; }
            unsigned long arg1;
            ok &= luaval_to_ulong(tolua_S, 3, &arg1, "ark_Stream:WriteString");

            if (!ok) { break; }
            cobj->WriteString(arg0, arg1);
            lua_settop(tolua_S, 1);
            return 1;
        }
    }while(0);
    ok  = true;
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n",  "ark_Stream:WriteString",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_WriteString'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_CreateReadStreamFromZip(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromZip'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        const char* arg0;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ark_Stream:CreateReadStreamFromZip"); arg0 = arg0_tmp.c_str();
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromZip'", nullptr);
            return 0;
        }
        void* ret = cobj->CreateReadStreamFromZip(arg0);
        #pragma warning NO CONVERSION FROM NATIVE FOR void*;
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:CreateReadStreamFromZip",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromZip'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_GetSize(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_GetSize'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_GetSize'", nullptr);
            return 0;
        }
        unsigned long ret = cobj->GetSize();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:GetSize",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_GetSize'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_CreateWriteStream(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_CreateWriteStream'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        void* arg0;
        unsigned long arg1;

        #pragma warning NO CONVERSION TO NATIVE FOR void*
		ok = false;

        ok &= luaval_to_ulong(tolua_S, 3, &arg1, "ark_Stream:CreateWriteStream");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_CreateWriteStream'", nullptr);
            return 0;
        }
        cobj->CreateWriteStream(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 3) 
    {
        void* arg0;
        unsigned long arg1;
        bool arg2;

        #pragma warning NO CONVERSION TO NATIVE FOR void*
		ok = false;

        ok &= luaval_to_ulong(tolua_S, 3, &arg1, "ark_Stream:CreateWriteStream");

        ok &= luaval_to_boolean(tolua_S, 4,&arg2, "ark_Stream:CreateWriteStream");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_CreateWriteStream'", nullptr);
            return 0;
        }
        cobj->CreateWriteStream(arg0, arg1, arg2);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:CreateWriteStream",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_CreateWriteStream'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_ReadByte(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_ReadByte'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadByte'", nullptr);
            return 0;
        }
        uint16_t ret = cobj->ReadByte();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    if (argc == 1) 
    {
        uint16_t arg0;

        ok &= luaval_to_uint16(tolua_S, 2,&arg0, "ark_Stream:ReadByte");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadByte'", nullptr);
            return 0;
        }
        uint16_t ret = cobj->ReadByte(arg0);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:ReadByte",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_ReadByte'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_CreateReadStreamFromStreamSeek(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromStreamSeek'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        ark_Stream* arg0;
        unsigned long arg1;

        ok &= luaval_to_object<ark_Stream>(tolua_S, 2, "ark_Stream",&arg0, "ark_Stream:CreateReadStreamFromStreamSeek");

        ok &= luaval_to_ulong(tolua_S, 3, &arg1, "ark_Stream:CreateReadStreamFromStreamSeek");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromStreamSeek'", nullptr);
            return 0;
        }
        cobj->CreateReadStreamFromStreamSeek(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 3) 
    {
        ark_Stream* arg0;
        unsigned long arg1;
        bool arg2;

        ok &= luaval_to_object<ark_Stream>(tolua_S, 2, "ark_Stream",&arg0, "ark_Stream:CreateReadStreamFromStreamSeek");

        ok &= luaval_to_ulong(tolua_S, 3, &arg1, "ark_Stream:CreateReadStreamFromStreamSeek");

        ok &= luaval_to_boolean(tolua_S, 4,&arg2, "ark_Stream:CreateReadStreamFromStreamSeek");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromStreamSeek'", nullptr);
            return 0;
        }
        cobj->CreateReadStreamFromStreamSeek(arg0, arg1, arg2);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:CreateReadStreamFromStreamSeek",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromStreamSeek'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_CreateReadStreamFromUserDisk(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromUserDisk'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        const char* arg0;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ark_Stream:CreateReadStreamFromUserDisk"); arg0 = arg0_tmp.c_str();
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromUserDisk'", nullptr);
            return 0;
        }
        void* ret = cobj->CreateReadStreamFromUserDisk(arg0);
        #pragma warning NO CONVERSION FROM NATIVE FOR void*;
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:CreateReadStreamFromUserDisk",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromUserDisk'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_ReadWord(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_ReadWord'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadWord'", nullptr);
            return 0;
        }
        unsigned short ret = cobj->ReadWord();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    if (argc == 1) 
    {
        unsigned short arg0;

        ok &= luaval_to_ushort(tolua_S, 2, &arg0, "ark_Stream:ReadWord");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadWord'", nullptr);
            return 0;
        }
        unsigned short ret = cobj->ReadWord(arg0);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:ReadWord",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_ReadWord'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_CreateReadStreamFromBuf(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromBuf'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        const char* arg0;
        unsigned long arg1;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ark_Stream:CreateReadStreamFromBuf"); arg0 = arg0_tmp.c_str();

        ok &= luaval_to_ulong(tolua_S, 3, &arg1, "ark_Stream:CreateReadStreamFromBuf");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromBuf'", nullptr);
            return 0;
        }
        cobj->CreateReadStreamFromBuf(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    if (argc == 3) 
    {
        const char* arg0;
        unsigned long arg1;
        bool arg2;

        std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ark_Stream:CreateReadStreamFromBuf"); arg0 = arg0_tmp.c_str();

        ok &= luaval_to_ulong(tolua_S, 3, &arg1, "ark_Stream:CreateReadStreamFromBuf");

        ok &= luaval_to_boolean(tolua_S, 4,&arg2, "ark_Stream:CreateReadStreamFromBuf");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromBuf'", nullptr);
            return 0;
        }
        cobj->CreateReadStreamFromBuf(arg0, arg1, arg2);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:CreateReadStreamFromBuf",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_CreateReadStreamFromBuf'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_WriteWord(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_WriteWord'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        unsigned short arg0;

        ok &= luaval_to_ushort(tolua_S, 2, &arg0, "ark_Stream:WriteWord");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_WriteWord'", nullptr);
            return 0;
        }
        cobj->WriteWord(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:WriteWord",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_WriteWord'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_ReadFloat(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_ReadFloat'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        unsigned long arg0;

        ok &= luaval_to_ulong(tolua_S, 2, &arg0, "ark_Stream:ReadFloat");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadFloat'", nullptr);
            return 0;
        }
        double ret = cobj->ReadFloat(arg0);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:ReadFloat",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_ReadFloat'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_ReadBuffer(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_ReadBuffer'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        unsigned long arg0;
        unsigned char* arg1;

        ok &= luaval_to_ulong(tolua_S, 2, &arg0, "ark_Stream:ReadBuffer");

        #pragma warning NO CONVERSION TO NATIVE FOR unsigned char*
		ok = false;
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadBuffer'", nullptr);
            return 0;
        }
        const unsigned char* ret = cobj->ReadBuffer(arg0, arg1);
        #pragma warning NO CONVERSION FROM NATIVE FOR unsigned char*;
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:ReadBuffer",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_ReadBuffer'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_GetBuffer(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_GetBuffer'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_GetBuffer'", nullptr);
            return 0;
        }
        unsigned char* ret = cobj->GetBuffer();
        #pragma warning NO CONVERSION FROM NATIVE FOR unsigned char*;
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:GetBuffer",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_GetBuffer'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_ReadULongInt(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_ReadULongInt'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadULongInt'", nullptr);
            return 0;
        }
        long long ret = cobj->ReadULongInt();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    if (argc == 1) 
    {
        unsigned long long arg0;

        #pragma warning NO CONVERSION TO NATIVE FOR unsigned long long
		ok = false;
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadULongInt'", nullptr);
            return 0;
        }
        long long ret = cobj->ReadULongInt(arg0);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:ReadULongInt",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_ReadULongInt'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_ReadShort(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_ReadShort'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadShort'", nullptr);
            return 0;
        }
        int32_t ret = cobj->ReadShort();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    if (argc == 1) 
    {
        int32_t arg0;

        ok &= luaval_to_int32(tolua_S, 2,&arg0, "ark_Stream:ReadShort");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadShort'", nullptr);
            return 0;
        }
        int32_t ret = cobj->ReadShort(arg0);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:ReadShort",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_ReadShort'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_ReadInt(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_ReadInt'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadInt'", nullptr);
            return 0;
        }
        int ret = cobj->ReadInt();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    if (argc == 1) 
    {
        int arg0;

        ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ark_Stream:ReadInt");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadInt'", nullptr);
            return 0;
        }
        int ret = cobj->ReadInt(arg0);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:ReadInt",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_ReadInt'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_Seek(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif
    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);
#if COCOS2D_DEBUG >= 1
    if (!cobj)
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_Seek'", nullptr);
        return 0;
    }
#endif
    argc = lua_gettop(tolua_S)-1;
    do{
        if (argc == 2) {
            int arg0;
            ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ark_Stream:Seek");

            if (!ok) { break; }
            int arg1;
            ok &= luaval_to_int32(tolua_S, 3,(int *)&arg1, "ark_Stream:Seek");

            if (!ok) { break; }
            cobj->Seek(arg0, arg1);
            lua_settop(tolua_S, 1);
            return 1;
        }
    }while(0);
    ok  = true;
    do{
        if (argc == 1) {
            int arg0;
            ok &= luaval_to_int32(tolua_S, 2,(int *)&arg0, "ark_Stream:Seek");

            if (!ok) { break; }
            cobj->Seek(arg0);
            lua_settop(tolua_S, 1);
            return 1;
        }
    }while(0);
    ok  = true;
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n",  "ark_Stream:Seek",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_Seek'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_GetBufferSeek(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_GetBufferSeek'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_GetBufferSeek'", nullptr);
            return 0;
        }
        unsigned char* ret = cobj->GetBufferSeek();
        #pragma warning NO CONVERSION FROM NATIVE FOR unsigned char*;
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:GetBufferSeek",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_GetBufferSeek'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_CreateFromStreamSeek_Deep(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_CreateFromStreamSeek_Deep'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 2) 
    {
        ark_Stream* arg0;
        unsigned long arg1;

        ok &= luaval_to_object<ark_Stream>(tolua_S, 2, "ark_Stream",&arg0, "ark_Stream:CreateFromStreamSeek_Deep");

        ok &= luaval_to_ulong(tolua_S, 3, &arg1, "ark_Stream:CreateFromStreamSeek_Deep");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_CreateFromStreamSeek_Deep'", nullptr);
            return 0;
        }
        cobj->CreateFromStreamSeek_Deep(arg0, arg1);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:CreateFromStreamSeek_Deep",argc, 2);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_CreateFromStreamSeek_Deep'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_WriteByte(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_WriteByte'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1) 
    {
        uint16_t arg0;

        ok &= luaval_to_uint16(tolua_S, 2,&arg0, "ark_Stream:WriteByte");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_WriteByte'", nullptr);
            return 0;
        }
        cobj->WriteByte(arg0);
        lua_settop(tolua_S, 1);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:WriteByte",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_WriteByte'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_ReadDouble(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_ReadDouble'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadDouble'", nullptr);
            return 0;
        }
        double ret = cobj->ReadDouble();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    if (argc == 1) 
    {
        double arg0;

        ok &= luaval_to_number(tolua_S, 2,&arg0, "ark_Stream:ReadDouble");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadDouble'", nullptr);
            return 0;
        }
        double ret = cobj->ReadDouble(arg0);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:ReadDouble",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_ReadDouble'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_ReadUShort(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_ReadUShort'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadUShort'", nullptr);
            return 0;
        }
        unsigned short ret = cobj->ReadUShort();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    if (argc == 1) 
    {
        unsigned short arg0;

        ok &= luaval_to_ushort(tolua_S, 2, &arg0, "ark_Stream:ReadUShort");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadUShort'", nullptr);
            return 0;
        }
        unsigned short ret = cobj->ReadUShort(arg0);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:ReadUShort",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_ReadUShort'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_ReadUInt(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif


#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif

    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);

#if COCOS2D_DEBUG >= 1
    if (!cobj) 
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_ReadUInt'", nullptr);
        return 0;
    }
#endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadUInt'", nullptr);
            return 0;
        }
        unsigned int ret = cobj->ReadUInt();
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    if (argc == 1) 
    {
        unsigned int arg0;

        ok &= luaval_to_uint32(tolua_S, 2,&arg0, "ark_Stream:ReadUInt");
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_ReadUInt'", nullptr);
            return 0;
        }
        unsigned int ret = cobj->ReadUInt(arg0);
        tolua_pushnumber(tolua_S,(lua_Number)ret);
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:ReadUInt",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_ReadUInt'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_ReadString(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;
#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif

#if COCOS2D_DEBUG >= 1
    if (!tolua_isusertype(tolua_S,1,"ark_Stream",0,&tolua_err)) goto tolua_lerror;
#endif
    cobj = (ark_Stream*)tolua_tousertype(tolua_S,1,0);
#if COCOS2D_DEBUG >= 1
    if (!cobj)
    {
        tolua_error(tolua_S,"invalid 'cobj' in function 'lua_ark_Stream_ark_Stream_ReadString'", nullptr);
        return 0;
    }
#endif
    argc = lua_gettop(tolua_S)-1;
    do{
        if (argc == 0) {
            std::string ret = cobj->ReadString();
            tolua_pushcppstring(tolua_S,ret);
            return 1;
        }
    }while(0);
    ok  = true;
    do{
        if (argc == 1) {
            const char* arg0;
            std::string arg0_tmp; ok &= luaval_to_std_string(tolua_S, 2, &arg0_tmp, "ark_Stream:ReadString"); arg0 = arg0_tmp.c_str();

            if (!ok) { break; }
            std::string ret = cobj->ReadString(arg0);
            tolua_pushcppstring(tolua_S,ret);
            return 1;
        }
    }while(0);
    ok  = true;
    do{
        if (argc == 1) {
            std::string arg0;
            ok &= luaval_to_std_string(tolua_S, 2,&arg0, "ark_Stream:ReadString");

            if (!ok) { break; }
            bool ret = cobj->ReadString(arg0);
            tolua_pushboolean(tolua_S,(bool)ret);
            return 1;
        }
    }while(0);
    ok  = true;
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n",  "ark_Stream:ReadString",argc, 1);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_lerror:
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_ReadString'.",&tolua_err);
#endif

    return 0;
}
int lua_ark_Stream_ark_Stream_constructor(lua_State* tolua_S)
{
    int argc = 0;
    ark_Stream* cobj = nullptr;
    bool ok  = true;

#if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
#endif



    argc = lua_gettop(tolua_S)-1;
    if (argc == 0) 
    {
        if(!ok)
        {
            tolua_error(tolua_S,"invalid arguments in function 'lua_ark_Stream_ark_Stream_constructor'", nullptr);
            return 0;
        }
        cobj = new ark_Stream();
        tolua_pushusertype(tolua_S,(void*)cobj,"ark_Stream");
        tolua_register_gc(tolua_S,lua_gettop(tolua_S));
        return 1;
    }
    luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n", "ark_Stream:ark_Stream",argc, 0);
    return 0;

#if COCOS2D_DEBUG >= 1
    tolua_error(tolua_S,"#ferror in function 'lua_ark_Stream_ark_Stream_constructor'.",&tolua_err);
#endif

    return 0;
}

static int lua_ark_Stream_ark_Stream_finalize(lua_State* tolua_S)
{
    printf("luabindings: finalizing LUA object (ark_Stream)");
    return 0;
}

int lua_register_ark_Stream_ark_Stream(lua_State* tolua_S)
{
    tolua_usertype(tolua_S,"ark_Stream");
    tolua_cclass(tolua_S,"ark_Stream","ark_Stream","",nullptr);

    tolua_beginmodule(tolua_S,"ark_Stream");
        tolua_function(tolua_S,"new",lua_ark_Stream_ark_Stream_constructor);
        tolua_function(tolua_S,"GetSeekPos",lua_ark_Stream_ark_Stream_GetSeekPos);
        tolua_function(tolua_S,"ReadUnicodeString",lua_ark_Stream_ark_Stream_ReadUnicodeString);
        tolua_function(tolua_S,"WriteUInt",lua_ark_Stream_ark_Stream_WriteUInt);
        tolua_function(tolua_S,"CreateReadStreamFromSelf",lua_ark_Stream_ark_Stream_CreateReadStreamFromSelf);
        tolua_function(tolua_S,"WriteString",lua_ark_Stream_ark_Stream_WriteString);
        tolua_function(tolua_S,"CreateReadStreamFromZip",lua_ark_Stream_ark_Stream_CreateReadStreamFromZip);
        tolua_function(tolua_S,"GetSize",lua_ark_Stream_ark_Stream_GetSize);
        tolua_function(tolua_S,"CreateWriteStream",lua_ark_Stream_ark_Stream_CreateWriteStream);
        tolua_function(tolua_S,"ReadByte",lua_ark_Stream_ark_Stream_ReadByte);
        tolua_function(tolua_S,"CreateReadStreamFromStreamSeek",lua_ark_Stream_ark_Stream_CreateReadStreamFromStreamSeek);
        tolua_function(tolua_S,"CreateReadStreamFromUserDisk",lua_ark_Stream_ark_Stream_CreateReadStreamFromUserDisk);
        tolua_function(tolua_S,"ReadWord",lua_ark_Stream_ark_Stream_ReadWord);
        tolua_function(tolua_S,"CreateReadStreamFromBuf",lua_ark_Stream_ark_Stream_CreateReadStreamFromBuf);
        tolua_function(tolua_S,"WriteWord",lua_ark_Stream_ark_Stream_WriteWord);
        tolua_function(tolua_S,"ReadFloat",lua_ark_Stream_ark_Stream_ReadFloat);
        tolua_function(tolua_S,"ReadBuffer",lua_ark_Stream_ark_Stream_ReadBuffer);
        tolua_function(tolua_S,"GetBuffer",lua_ark_Stream_ark_Stream_GetBuffer);
        tolua_function(tolua_S,"ReadULongInt",lua_ark_Stream_ark_Stream_ReadULongInt);
        tolua_function(tolua_S,"ReadShort",lua_ark_Stream_ark_Stream_ReadShort);
        tolua_function(tolua_S,"ReadInt",lua_ark_Stream_ark_Stream_ReadInt);
        tolua_function(tolua_S,"Seek",lua_ark_Stream_ark_Stream_Seek);
        tolua_function(tolua_S,"GetBufferSeek",lua_ark_Stream_ark_Stream_GetBufferSeek);
        tolua_function(tolua_S,"CreateFromStreamSeek_Deep",lua_ark_Stream_ark_Stream_CreateFromStreamSeek_Deep);
        tolua_function(tolua_S,"WriteByte",lua_ark_Stream_ark_Stream_WriteByte);
        tolua_function(tolua_S,"ReadDouble",lua_ark_Stream_ark_Stream_ReadDouble);
        tolua_function(tolua_S,"ReadUShort",lua_ark_Stream_ark_Stream_ReadUShort);
        tolua_function(tolua_S,"ReadUInt",lua_ark_Stream_ark_Stream_ReadUInt);
        tolua_function(tolua_S,"ReadString",lua_ark_Stream_ark_Stream_ReadString);
    tolua_endmodule(tolua_S);
    std::string typeName = typeid(ark_Stream).name();
    g_luaType[typeName] = "ark_Stream";
    g_typeCast["ark_Stream"] = "ark_Stream";
    return 1;
}
TOLUA_API int register_all_ark_Stream(lua_State* tolua_S)
{
	tolua_open(tolua_S);
	
	tolua_module(tolua_S,nullptr,0);
	tolua_beginmodule(tolua_S,nullptr);

	lua_register_ark_Stream_ark_Stream(tolua_S);

	tolua_endmodule(tolua_S);
	return 1;
}

