#ifndef _ARK_SOCKETEVENT_H_
#define _ARK_SOCKETEVENT_H_

#include "ark_socket.h"
#include "ark_Stream.h"
#include <iostream>
#include "NetMsgMgr.h"
#include "ark_NetMessage.h"

using namespace std;
#include "cocos2d.h"
USING_NS_CC;


//class ClientSocket;
class ark_socketEvent : public ClientSocketEvent
{
public:
	ark_socketEvent()
	{
		ref = Node::create();
		ref->retain();
	}

	~ark_socketEvent()
	{
		ref->release();
		log("ark_socketEvent release()");
	}

	virtual void OnConnect(ClientSocket* s);
	virtual void OnConnectFail(ClientSocket* s);
	virtual void OnSocketError(ClientSocket* s);
	virtual void OnClose(ClientSocket* s);
	virtual void OnData(ClientSocket* s, const char* data, int dataLen);
	virtual void OnRunExData(ClientSocket* s);
	ark_Stream* getStream(){ return tempStream; }
	void releaseStream()
	{ 
		delete tempStream; 
		tempStream = nullptr; 
	};
	int getOnRecPack();
	Node* getNode()
	{ 
		return ref; 
	}
private:
	ark_Stream* tempStream = nullptr;
	ark_NetMsgPtr lastpMsg = nullptr;
	Node*  ref = nullptr;
};

#endif