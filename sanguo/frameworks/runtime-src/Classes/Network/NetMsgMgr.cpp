#include "NetMsgMgr.h"
#include "mypthread.h"
static NetMsgMgr *g_MsgMgr = NULL;

//////////////////////////////////////////////////////////////////////////
/// class 
NetMsgMgr *NetMsgMgr::getInstance()
{
	if(g_MsgMgr == NULL)
	{
		g_MsgMgr = new NetMsgMgr();
        g_MsgMgr->Init();
	}
	return g_MsgMgr;
}

void NetMsgMgr::Init()
{
	pthread_mutex_init(&_SendMutex, NULL);
	pthread_mutex_init(&_RecvMutex, NULL);
}

NetMsgMgr::~NetMsgMgr()
{
	pthread_mutex_lock(&_SendMutex);
	_SendQueue.clearAndRelease();
	pthread_mutex_unlock(&_SendMutex);

	pthread_mutex_unlock(&_RecvMutex);
	_RecvQueue.clearAndRelease();
	pthread_mutex_unlock(&_RecvMutex);
}

void NetMsgMgr::freeInstance()
{
	delete g_MsgMgr;
	g_MsgMgr = NULL;
}

void NetMsgMgr::addRecvMsg(ark_NetMsgPtr l_message)
{
	pthread_mutex_lock(&_RecvMutex);
	_RecvQueue.addMsg(l_message);
	pthread_mutex_unlock(&_RecvMutex);
}
void NetMsgMgr::addSendMsg(ark_NetMsgPtr l_message)
{
	pthread_mutex_lock(&_SendMutex);
	_SendQueue.addMsg(l_message);
	pthread_mutex_unlock(&_SendMutex);
}

ark_NetMsgPtr NetMsgMgr::extractRecvMsg()
{
	ark_NetMsgPtr p;
	pthread_mutex_lock(&_RecvMutex);
	if (_RecvQueue.getSize() == 0)
	{
		pthread_mutex_unlock(&_RecvMutex);
		return NULL;
	}
	p = _RecvQueue.listMsg.front();
	_RecvQueue.listMsg.pop_front();
	pthread_mutex_unlock(&_RecvMutex);

	return p;
}

ark_NetMsgPtr NetMsgMgr::extractSendMsg()
{
	ark_NetMsgPtr p;
	pthread_mutex_lock(&_SendMutex);
	if (_SendQueue.getSize() == 0)
	{
		pthread_mutex_unlock(&_SendMutex);
		return NULL;
	}
	p = _SendQueue.listMsg.front();
	_SendQueue.listMsg.pop_front();
	pthread_mutex_unlock(&_SendMutex);
	return p;
}

void NetMsgMgr::ClearAllMsg()
{
	_SendQueue.clearAndRelease();
	_RecvQueue.clearAndRelease();
}


/////////////////////////////////////////////////////////////

//
//
//ark_NetMsg NetMsgMgr::extractRecvMsgL()
//{
//	ark_NetMsg p;
//	pthread_mutex_lock(&_RecvMutex);
//	if (_RecvQueue.getSize() == 0)
//	{
//		pthread_mutex_unlock(&_RecvMutex);
//		return p;
//	}
//	(&p) = _RecvQueue.listMsg.front();
//	_RecvQueue.listMsg.pop_front();
//	pthread_mutex_unlock(&_RecvMutex);
//
//	return p;
//}
//
//ark_NetMsg NetMsgMgr::extractSendMsgL()
//{
//	ark_NetMsgPtr p;
//	pthread_mutex_lock(&_SendMutex);
//	if (_SendQueue.getSize() == 0)
//	{
//		pthread_mutex_unlock(&_SendMutex);
//		return NULL;
//	}
//	p = _SendQueue.listMsg.front();
//	_SendQueue.listMsg.pop_front();
//	pthread_mutex_unlock(&_SendMutex);
//	return p;
//}
//
//void NetMsgMgr::addRecvMsgL(ark_NetMsg l_message)
//{
//	pthread_mutex_lock(&_RecvMutex);
//	_RecvQueue.addMsg(l_message);
//	pthread_mutex_unlock(&_RecvMutex);
//}
//void NetMsgMgr::addSendMsgL(ark_NetMsg l_message)
//{
//	pthread_mutex_lock(&_SendMutex);
//	_SendQueue.addMsg(l_message);
//	pthread_mutex_unlock(&_SendMutex);
//}