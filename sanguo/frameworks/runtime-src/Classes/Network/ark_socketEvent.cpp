
#include "ark_socketEvent.h"


void ark_socketEvent::OnConnect(ClientSocket* s)
{
	LuaScriptData data(getNode(), "cc.Node");
	data.push("string", (void*)"OnConnect");
	data.push("string", (void*)s->GetMsg().c_str());
	ScriptEvent scriptEvent(kCustomLuaEvent, &data);
	ScriptEngineManager::getInstance()->getScriptEngine()->sendEvent(&scriptEvent);
}
void ark_socketEvent::OnConnectFail(ClientSocket* s)
{
	LuaScriptData data(getNode(), "cc.Node");
	data.push("string", (void*)"OnConnectFail");
	//data.push("string", (void*)s->GetMsg().c_str());
	ScriptEvent scriptEvent(kCustomLuaEvent, &data);
	ScriptEngineManager::getInstance()->getScriptEngine()->sendEvent(&scriptEvent);
}
void ark_socketEvent::OnSocketError(ClientSocket* s)
{
	LuaScriptData data(getNode(), "cc.Node");
	data.push("string", (void*)"OnSocketError");
	data.push("string", (void*)s->GetMsg().c_str());
	ScriptEvent scriptEvent(kCustomLuaEvent, &data);
	ScriptEngineManager::getInstance()->getScriptEngine()->sendEvent(&scriptEvent);
}
void ark_socketEvent::OnClose(ClientSocket* s)
{
	LuaScriptData data(this, "ark_socketEvent");
	data.push("string", (void*)"OnClose");
	data.push("string", (void*)s->GetMsg().c_str());
	ScriptEvent scriptEvent(kCustomLuaEvent, &data);
	ScriptEngineManager::getInstance()->getScriptEngine()->sendEvent(&scriptEvent);
}
//接收
void ark_socketEvent::OnData(ClientSocket* s, const char* data, int dataLen)
{
	ark_NetMsg* pMsg = new ark_NetMsg((unsigned char*)(data), dataLen);
	NetMsgMgr::getInstance()->addRecvMsg(pMsg);
}

//发送
void ark_socketEvent::OnRunExData(ClientSocket* s)
{
	ark_NetMsgPtr pMsg = NetMsgMgr::getInstance()->extractSendMsg();
	if (!pMsg) return;

	unsigned char* p = (unsigned char*)pMsg->getBuffer();
	int size = s->Send((const char*)p, pMsg->getSize());
	if (size != (int)pMsg->getSize())
		log("ClientSocket::send Error sentSize=%d, msgSize=%d", size, pMsg->getSize());
	delete pMsg;
}


int ark_socketEvent::getOnRecPack()
{
	tempStream = nullptr;
	lastpMsg = nullptr;
	NetMsgMgr* netMgr = NetMsgMgr::getInstance();
	if (!netMgr) return 0;
	ark_NetMsgPtr pMsg = netMgr->extractRecvMsg();
	if (!pMsg)
		return 0;
	//ark_Stream stream;
	tempStream = new ark_Stream();
	tempStream->CreateReadStreamFromBuf((const char*)pMsg->getBuffer(), pMsg->getSize());
	lastpMsg = pMsg;
	//这里不释放，releaseStream 里面释放tempStream时候ark_Stream的析构会释放m_stream（即pMsg的buf）
	//delete pMsg;  
	return 1;
}