#ifndef _ARK_SOCKET_H_
#define _ARK_SOCKET_H_

#include <iostream>
#include <string>
using namespace std;

//#include "ODSocket.h" //这个已经不用了，只是需要里面用到的包含头文件部分，单独拷贝#include部分就行

#ifndef WIN32
#include <sys/ioctl.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/types.h>

#include <netdb.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <arpa/inet.h>
#include <errno.h>
typedef int				SOCKET;

//#pragma region define win32 const variable in linux
#define INVALID_SOCKET	-1
#define SOCKET_ERROR	-1

#else
#include <ws2tcpip.h>
#include <winsock.h>
typedef int				socklen_t;


#include <winsock2.h>
#include <windows.h>
#pragma comment(lib, "ws2_32.lib")
#endif

//#include <pthread.h>
#include <thread>
#include <functional>
#include <memory>
extern string SERVER_HOST;
extern int SERVER_PORT;

class ClientSocket;
class ark_Stream;

#define MAX_RECV_BUFSIZE (64*1024)



//////////////////////////////////////////////////////////////////////////
/// 回调事件
class ClientSocketEvent
{
public:
    virtual void OnConnect(ClientSocket* s) = 0;
    virtual void OnConnectFail(ClientSocket* s) = 0;
    virtual void OnSocketError(ClientSocket* s) = 0;
    virtual void OnClose(ClientSocket* s) = 0;
    virtual void OnData(ClientSocket* s, const char* data, int dataLen) = 0;
    virtual void OnRunExData(ClientSocket* s) = 0;
};

//////////////////////////////////////////////////////////////////////////
/// 客户端网络通信类
class ClientSocket
{
public:
	ClientSocket();
	~ClientSocket();

public:
	int Start();
	void Stop();
	int Close();
	void closeThread();
	void SetServerIP(const char* ip, int port);
    int Send(const char* data, int dataLen);
    bool IsConnected() { return _IsConnected; }
	void clearEvent() { _Event = nullptr; }
    void SetEvent(ClientSocketEvent* evt) { _Event = evt; }
    ClientSocketEvent* GetEvent() { return _Event; }

	void SetMsg(string msg){ _Msg = msg; }
	string GetMsg(){ return _Msg; }
	
public:
	int				_Socket;
	int				_RecvLen;
    bool            _IsConnected;
	
	char			_RecvBuf[MAX_RECV_BUFSIZE];
	
	string			_ServerIP;
	int				_ServerPort;

	string			_Msg = "";

public:
    void DoOnConnect();
    void DoOnConnectFail();
    void DoOnSocketError();
    void DoOnClose();
    void DoOnData(const char* data, int dataLen);
    void DoOnRunExData();
	void OnRecvData();
	const std::string getCurrentSystemTime();
private:
    ClientSocketEvent*      _Event;
    //my_pthread_t               _SocketThread;
	//std::thread				_SocketThread;
	std::shared_ptr<std::thread>  _SocketThread;
};

#endif