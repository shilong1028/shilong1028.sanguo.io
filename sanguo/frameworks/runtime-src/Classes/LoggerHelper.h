#pragma once
#pragma execution_character_set("utf-8")


#include <string>
#include "cocos2d.h"

extern "C" {
#include "lauxlib.h"
}

const std::string get_lua_print(lua_State* L)
{
	int nargs = lua_gettop(L);
	std::string lua_string;
	for (int i = 1; i <= nargs; i++)
	{
		if (lua_istable(L, i))
			lua_string += "table";
		else if (lua_isnone(L, i))
			lua_string += "none";
		else if (lua_isnil(L, i))
			lua_string += "nil";
		else if (lua_isboolean(L, i))
		{
			if (lua_toboolean(L, i) != 0)
				lua_string += "true";
			else
				lua_string += "false";
		}
		else if (lua_isfunction(L, i))
			lua_string += "function";
		else if (lua_islightuserdata(L, i))
			lua_string += "lightuserdata";
		else if (lua_isthread(L, i))
			lua_string += "thread";
		else
		{
			const char * str = lua_tostring(L, i);
			if (str)
				lua_string += lua_tostring(L, i);
			else
				lua_string += lua_typename(L, lua_type(L, i));
		}
		if (i != nargs)
			lua_string += "\t";
	}
	return lua_string;
}

enum logger_type
{
	nil,
	info,
	debug,
	warning,
	error,
	fatal,
};

int SetConsoleColorful(logger_type type)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
	HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	if (hConsole == INVALID_HANDLE_VALUE)
		return FALSE;
	BOOL bRet = FALSE;
	switch (type)
	{
	case logger_type::nil:
		bRet = SetConsoleTextAttribute(hConsole, FOREGROUND_GREEN | FOREGROUND_BLUE | FOREGROUND_RED );  //白色
		break;
	case logger_type::info:
		bRet = SetConsoleTextAttribute(hConsole, FOREGROUND_GREEN | FOREGROUND_RED);   //黄色
		break;
	case logger_type::debug:
		bRet = SetConsoleTextAttribute(hConsole, FOREGROUND_BLUE | FOREGROUND_RED);   //紫色
		break;
	case logger_type::warning:
		bRet = SetConsoleTextAttribute(hConsole, FOREGROUND_GREEN);
		break;
	case logger_type::error:
		bRet = SetConsoleTextAttribute(hConsole, FOREGROUND_RED ); 
		break;
	case logger_type::fatal:
		bRet = SetConsoleTextAttribute(hConsole, FOREGROUND_RED | FOREGROUND_INTENSITY);  // 如果没有FOREGROUND_INTENSITY 只有 FOREGROUND_RED  那么颜色就偏暗  BACKGROUND_INTENSITY 会有阴影
		break;
	}
	return bRet;
#else
	return -1;
#endif
}
#define IMPLEMENT_LOGGER_FUNCTION(NAME)    \
	int lua_logger_##NAME(lua_State* L)                    \
	{                                                    \
		const std::string logInfo = get_lua_print(L);    \
		SetConsoleColorful(logger_type::##NAME);        \
		CCLOG("[logger-%s] %s",#NAME,logInfo.c_str());    \
		SetConsoleColorful(logger_type::nil);            \
		return 0;                                        \
	}

IMPLEMENT_LOGGER_FUNCTION(info)
IMPLEMENT_LOGGER_FUNCTION(debug)
IMPLEMENT_LOGGER_FUNCTION(warning)
IMPLEMENT_LOGGER_FUNCTION(error)
IMPLEMENT_LOGGER_FUNCTION(fatal)



const luaL_reg logger_global_functions[] =
{
	{ "logger_info", lua_logger_info },
	{ "logger_debug", lua_logger_debug },
	{ "logger_warning", lua_logger_warning },
	{ "logger_error", lua_logger_error },
	{ "logger_fatal", lua_logger_fatal },
	{ NULL, NULL }
};

void luaRegister_loggerHelper(lua_State* L)
{
	luaL_register(L, "_G", logger_global_functions);
}
