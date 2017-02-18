#include "main.h"
#include "SimulatorWin.h"
#include <shellapi.h>

int WINAPI _tWinMain(HINSTANCE hInstance,
	HINSTANCE hPrevInstance,
	LPTSTR    lpCmdLine,
	int       nCmdShow)
{
	UNREFERENCED_PARAMETER(hPrevInstance);
	UNREFERENCED_PARAMETER(lpCmdLine);
    //auto simulator = SimulatorWin::getInstance();
    //return simulator->run();

#ifdef COCOS2D_DEBUG
	AllocConsole();
	HWND hwndConsole;
	hwndConsole = GetConsoleWindow();
	if (hwndConsole != NULL)
	{
		ShowWindow(hwndConsole, SW_SHOW);
		BringWindowToTop(hwndConsole);
		freopen("CONOUT$", "w", stdout);
		freopen("CONOUT$", "w", stderr);

		HMENU hmenu = GetSystemMenu(hwndConsole, FALSE);
		if (hmenu != NULL) DeleteMenu(hmenu, SC_CLOSE, MF_BYCOMMAND);
	}
#endif

	auto simulator = SimulatorWin::getInstance();
	int ret = simulator->run();

#ifdef COCOS2D_DEBUG
	FreeConsole();
#endif

	return ret;
}
