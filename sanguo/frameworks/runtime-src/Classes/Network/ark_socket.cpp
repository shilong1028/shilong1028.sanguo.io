
#include "ark_socket.h"
#include "cocos2d.h"
#include "mypthread.h"

#include <stdio.h>
#include <stdlib.h>

class ClientSocket;

#define NI_MAXHOST 1025
void* ThreadRun(void* data)
{
    class NetOpr
    {
    public:
        static void InitSockAddr(sockaddr_in& sockAddr, const char* ip, int port)
        {
            memset(&sockAddr,0,sizeof(sockAddr));
			//判断是否合法IP
			if(INADDR_NONE != inet_addr(ip))
				sockAddr.sin_addr.s_addr = inet_addr(ip);
			else
			{
				struct hostent *hptr=NULL;
				char **pptr=NULL;
				if((hptr = gethostbyname(ip)) == NULL)
				{
					CCLOG("InitSockAddr Error: gethostbyname error for host:%s", ip);
					return; 
				}
				else
				{
					CCLOG("InitSockAddr official hostname:%s\n",hptr->h_name);
					for(pptr = hptr->h_aliases; *pptr != NULL; pptr++)
						CCLOG("InitSockAddr h_aliases:%s",*pptr);

					switch(hptr->h_addrtype)
					{
					case AF_INET:
					case AF_INET6:
						for(pptr = hptr->h_addr_list; *pptr != NULL; pptr++)
							CCLOG("InitSockAddr h_addr_list:%s",*pptr);

						memcpy(&(sockAddr.sin_addr.s_addr), hptr->h_addr, hptr->h_length);
						break;
					default:
						CCLOG("InitSockAddr Error: unknown address type");
						break;
					}
				}
			}
			sockAddr.sin_port = htons(port);
			sockAddr.sin_family = AF_INET;
        }

		static int Connect(ClientSocket* pClient)
		{
			int ret;
			char ipbuf[128];
			struct addrinfo hints, *res, *cur;

			memset(&hints, 0, sizeof(struct addrinfo));
			//ipv6
#if (defined(__IPHONE_OS_VERSION_MIN_REQUIRED) && __IPHONE_OS_VERSION_MIN_REQUIRED >= 90000) || (defined(__MAC_OS_X_VERSION_MIN_REQUIRED) && __MAC_OS_X_VERSION_MIN_REQUIRED >= 101100)
			hints.ai_family = AF_INET6;		/* Allow IPv4 */
#els
			hints.ai_family = AF_INET;		/* Allow IPv4 */
#endif
			hints.ai_flags = AI_PASSIVE;	/* For wildcard IP address */
			hints.ai_protocol = 0;			/* Any protocol */
			hints.ai_socktype = SOCK_STREAM;

			ret = getaddrinfo(pClient->_ServerIP.c_str(), NULL, &hints, &res);
			if (ret == -1)
			{
				CCLOG("InitSockAddr Error: getaddrinfo");
				return -1;
			}

			if (res == NULL)
				return -1;

			for (cur = res; cur != NULL; cur = cur->ai_next)
			{
				pClient->_Socket = socket(cur->ai_family, SOCK_STREAM, 0);
				if (pClient->_Socket < 0)
				{
					pClient->SetMsg("pClient->_Socket < 0");
					pClient->DoOnSocketError();
					return -1;
				}


				GetIpPort(cur->ai_addr, ipbuf, 128, pClient->_ServerPort);
				CCLOG("ClientSocket::ConnectServer URL=%s IP=%s,Socket=%d,ai_family=%d,ai_addrlen=%d", pClient->_ServerIP.c_str(), ipbuf, pClient->_Socket, cur->ai_family, cur->ai_addrlen);

				if (connect(pClient->_Socket, cur->ai_addr, cur->ai_addrlen) == 0)
					return 0;

			}

			freeaddrinfo(res);

			return -1;
		}

		static char* GetIpPort(struct sockaddr *sa, char *s, size_t maxlen, int port)
		{
			switch (sa->sa_family) {
			case AF_INET:
				((struct sockaddr_in *)sa)->sin_port = htons(port);
				inet_ntop(AF_INET, &(((struct sockaddr_in *)sa)->sin_addr), s, maxlen);
				break;

			case AF_INET6:
				((struct sockaddr_in6 *)sa)->sin6_port = htons(port);
				inet_ntop(AF_INET6, &(((struct sockaddr_in6 *)sa)->sin6_addr), s, maxlen);
				break;
			default:
				strncpy(s, "Unknown AF", maxlen);
				return NULL;
			}
			return s;
		}

        static bool InitNetwork()
        {
            #ifdef WIN32
				WSADATA wsaData;
				WORD version = MAKEWORD(2, 0);
				if(WSAStartup(version, &wsaData) != 0)
					return false;
            #endif
            return true;
        }

        static bool SetSendRecvTimeOut(int socket)
        {
            #ifdef WIN32
                //设置接收和发送超时时间
			    struct timeval tv;
			    tv.tv_sec = 6;
			    tv.tv_usec = 0;
			    if(setsockopt(socket, SOL_SOCKET, SO_RCVTIMEO, (const char *)&tv, sizeof(tv)) == -1)
				    return false;
			    if(setsockopt(socket, SOL_SOCKET, SO_SNDTIMEO, (const char *)&tv, sizeof(tv)) == -1)
				    return false;
            #endif
            return true;
        }
    };

	ClientSocket* pClient = (ClientSocket*)data;
	bool IsFirstRun = true;
	fd_set fds;
	timeval timeout = {0, 100*1000};
	int maxfd;

	NetOpr::InitNetwork();
	int connRet = NetOpr::Connect(pClient); //ipv6
	//ipv4
	/*pClient->_Socket = socket(AF_INET, SOCK_STREAM, 0);
	if (pClient->_Socket < 0)
	{
		pClient->SetMsg("pClient->_Socket < 0");
		pClient->DoOnSocketError();
		cocos2d::log("Close return NULL");
		return NULL;
	}

	CCLOG("ClientSocket::ConnectServer IP=%s Port=%d", pClient->_ServerIP.c_str(), pClient->_ServerPort);
	struct sockaddr_in addr;
	NetOpr::InitSockAddr(addr, pClient->_ServerIP.c_str(), pClient->_ServerPort);
	int connRet = connect(pClient->_Socket, (sockaddr*)&addr, sizeof(addr));*/
	if (connRet == -1)
	{
		pClient->SetMsg("connRet == -1");
		pClient->DoOnConnectFail();
		pClient->Close();
		cocos2d::log("Close return NULL");
		return NULL;
	}
	pClient->_IsConnected = true;
	pClient->DoOnConnect();
	while (pClient->_IsConnected)
	{
		FD_ZERO(&fds); 
		FD_SET(pClient->_Socket, &fds);
		maxfd = pClient->_Socket + 1;
		timeout.tv_sec = 0;
		timeout.tv_usec = 100 * 1000;
		switch (select(maxfd, &fds, NULL, NULL, &timeout))
		{
		case -1:	//select错误，退出程序 
			pClient->SetMsg("select(maxfd, &fds, NULL, NULL, &timeout) == -1");
			pClient->DoOnSocketError();
			pClient->Close();
			return NULL;
		case 0:
			break; //再次轮询 
		default:
            if(pClient->_Socket == -1)
			{
				pClient->SetMsg("pClient->_Socket == -1");
				return NULL;
			}
			if (FD_ISSET(pClient->_Socket, &fds)) //可读
			{  
				pClient->OnRecvData();
			}
			break;
		}
		pClient->DoOnRunExData();
		
    }
	return NULL;
}

ClientSocket::ClientSocket()
{
	_Socket = -1;
	_RecvLen = 0;
	_ServerPort = 0;
    _IsConnected = false;
    _Event = NULL;
	_Msg = "";
}

ClientSocket::~ClientSocket()
{
    Stop();
}



int ClientSocket::Start()
{
	int errcode = 0;
	do
	{
		my_pthread_attr_t l_attr;
		errcode = pthread_attr_init(&l_attr);
		CC_BREAK_IF(errcode != 0);

		errcode = l_attr.foo;
		if (errcode != 0)
		{
			pthread_attr_destroy(&l_attr);
			break;
		}
		//errcode = pthread_create(&_SocketThread, &l_attr, std::bind(&ThreadRun, (void*)this), (void*)this);
		//cocos2d::log("use_count:%d", _SocketThread.use_count());
		errcode = pthread_create((my_pthread_t *)&_SocketThread, &l_attr, std::bind(ThreadRun, std::placeholders::_1), (void*)this);
		pthread_attr_destroy(&l_attr);
	} while (0);
	return errcode;
}


void ClientSocket::SetServerIP(const char * ip, int pot)
{
	_ServerIP = ip;
	_ServerPort = pot;
}

void ClientSocket::Stop()
{
	_RecvLen = 0;
	Close();
	//休眠100毫秒等待执行线程关闭，detach模式开启这个，偶尔SetMsg会有崩溃
	//std::this_thread::sleep_for(std::chrono::milliseconds(100));

//new
	/*_RecvLen = 0;
	if (_IsConnected)
	{
		_IsConnected = false;
		_SocketThread->join();
		closesocket(_Socket);
		WSACleanup();
		DoOnClose();

		_Socket = -1;
	}
	else
	{
		return;
	}*/

	////休眠100毫秒等待执行线程关闭
	//std::this_thread::sleep_for(std::chrono::milliseconds(100));

//_RecvLen = 0;
//Close();
//#ifndef WIN32
//	usleep(100 * 1000);
//#else
//	Sleep(100);
//#endif

	clearEvent(); //清掉回调句柄
	cocos2d::log("*******ClientSocket::Stop Finish*******");
}

void ClientSocket::closeThread()
{
	_IsConnected = false;
	if (_SocketThread.use_count() > 0 && _SocketThread->joinable() )
	{
		_SocketThread->join(); 
	}
}

int ClientSocket::Close()
{
	int ret = 0;
 	if(_Socket == -1)
 		return 0;
	
	if (!_IsConnected)
		return 0;

	closeThread();
#ifdef WIN32
	ret = closesocket(_Socket);
	WSACleanup();
#else
	ret = shutdown(_Socket,SHUT_RDWR);
	if(ret < 0)
		CCLOG("ClientSocket::shutdown socket error ret = %d,errno = %d", ret, errno);
	
	ret = close(_Socket);
	if(ret < 0)
		CCLOG("ClientSocket::close socket error ret = %d,errno = %d", ret, errno);
#endif

    //通知关闭消息
    DoOnClose();

	_Socket = -1;
	CCLOG("ClientSocket::close");
	return ret;
}

int ClientSocket::Send(const char* data, int dataLen)
{
    //发送失败，则抛出连接错误
    const int sendBytes = send(_Socket, data, dataLen, 0);
    if(sendBytes != dataLen)
	{
		SetMsg("sendBytes != dataLen");
		DoOnSocketError();
	}
        
    return sendBytes;
}


void ClientSocket::DoOnConnectFail()
{
    if(GetEvent() != NULL) 
	{ 
		cocos2d::Director::getInstance()->getScheduler()->performFunctionInCocosThread([&, this]
		{
			GetEvent()->OnConnectFail(this);
		});
		
	}
}

void ClientSocket::DoOnSocketError()
{
    _IsConnected = false;
	//closeThread();
    if(GetEvent() != NULL) 
	{
		cocos2d::Director::getInstance()->getScheduler()->performFunctionInCocosThread([&, this]
		{
			GetEvent()->OnSocketError(this);
		});
	}
	
}

void ClientSocket::DoOnClose()
{
    _IsConnected = false;
    if(GetEvent() != NULL) 
	{
		cocos2d::Director::getInstance()->getScheduler()->performFunctionInCocosThread([&, this]
		{
			GetEvent()->OnClose(this);
		});
	}
}

void ClientSocket::DoOnConnect()
{
	if (GetEvent() != NULL) 
	{ 
		cocos2d::Director::getInstance()->getScheduler()->performFunctionInCocosThread([&, this]
		{
			GetEvent()->OnConnect(this);
		});
	}
}

void ClientSocket::DoOnData(const char* data, int dataLen)
{
    if(GetEvent() != NULL) { GetEvent()->OnData(this, data, dataLen); }
	
}

void ClientSocket::DoOnRunExData()
{
	if (!_IsConnected)
		return;
    if(GetEvent() != NULL) { GetEvent()->OnRunExData(this); }
	
}

void ClientSocket::OnRecvData()
{
	SetMsg("OnRecvDataIn");
	int len = recv(_Socket, _RecvBuf + _RecvLen, sizeof(_RecvBuf) - _RecvLen, 0);
	if (len == 0)
	{
		SetMsg("OnRecvDataLen == 0");
		DoOnSocketError();
		Close();
	}
	else if (len < 0)
	{
		const int ERR_NO = errno;
		if (ERR_NO != EINTR && ERR_NO != EAGAIN && ERR_NO != ETIMEDOUT)
		{
			SetMsg("OnRecvDataLen < 0");
			DoOnSocketError();
			Close();
		}
	}
	else
	{
		_RecvLen += len;
		int pos = 0;
		unsigned short dataLen = 0;
		unsigned short cmd = 0;
		while (_RecvLen >= 4)
		{
			memcpy(&dataLen, _RecvBuf + pos, sizeof(dataLen)); //包体长度
			memcpy(&cmd, _RecvBuf + pos + 2, sizeof(cmd));  //cmd
			if (_RecvLen < dataLen + 4)  //发现粘包
				break;
			DoOnData(_RecvBuf + pos, dataLen + 4);
			pos += dataLen + 4;
			_RecvLen -= dataLen + 4;
		}
		if (pos>0 && _RecvLen > 0)
		{
			memmove(_RecvBuf, _RecvBuf + pos, _RecvLen);
		}
	}
	SetMsg("OnRecvDataOut");
}

const std::string ClientSocket::getCurrentSystemTime()
{
	auto tt = std::chrono::system_clock::to_time_t
		(std::chrono::system_clock::now());
	struct tm* ptm = localtime(&tt);
	char date[60] = { 0 };
	sprintf(date, "%d-%02d-%02d      %02d:%02d:%02d",
		(int)ptm->tm_year + 1900, (int)ptm->tm_mon + 1, (int)ptm->tm_mday,
		(int)ptm->tm_hour, (int)ptm->tm_min, (int)ptm->tm_sec);
	return std::string(date);
}