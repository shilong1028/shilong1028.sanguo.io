
#ifndef __NET_MSG_MGR_H__
#define __NET_MSG_MGR_H__

//#include <pthread.h>
#include "ark_NetMessage.h"
#include<thread>
#include<mutex>

//////////////////////////////////////////////////////////////////////////
/// NetMsgMgr - 网络消息管理类
class NetMsgMgr
{
public:

	~NetMsgMgr();

public:
	static NetMsgMgr *getInstance();
	static void freeInstance();

public:
	void addRecvMsg(ark_NetMsgPtr);
	void addSendMsg(ark_NetMsgPtr);

	ark_NetMsgPtr extractSendMsg();
	ark_NetMsgPtr extractRecvMsg();

	/*void addRecvMsgL(ark_NetMsg);
	void addSendMsgL(ark_NetMsg);

	ark_NetMsg extractSendMsgL();
	ark_NetMsg extractRecvMsgL();*/

	void ClearAllMsg();
private:
	ark_NetMsgQueue _SendQueue;
	ark_NetMsgQueue _RecvQueue;

	std::mutex _RecvMutex; //my_pthread_mutex_t
	std::mutex _SendMutex;

private:
	void Init();
};

#endif
