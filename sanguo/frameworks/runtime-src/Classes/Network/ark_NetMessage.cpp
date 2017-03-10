#include "ark_NetMessage.h"
#include<list>
#include <vector>

using namespace std;

//////////////////////////////////////////////////////////////////////////
/// class ark_NetMsgQueue
ark_NetMsgQueue ark_NetMsgQueue::operator+(ark_NetMsgQueue& msgQueue)
{
	ark_NetMsgQueue retQueue;
	retQueue += msgQueue;
	return retQueue;
}

ark_NetMsgQueue& ark_NetMsgQueue::operator+=(ark_NetMsgQueue& msgQueue)
{
	for(list<ark_NetMsgPtr>::iterator it = msgQueue.listMsg.begin(); it != msgQueue.listMsg.end(); it++)
		this->listMsg.push_back(*it);

	return *this;
}

ark_NetMsgQueue& ark_NetMsgQueue::operator=(ark_NetMsgQueue& msgQueue)
{
	this->listMsg.clear();
	this->listMsg.assign(msgQueue.listMsg.begin(),msgQueue.listMsg.end());

	return *this;
}

void ark_NetMsgQueue::clear()
{
	this->listMsg.clear();
}

void ark_NetMsgQueue::clearAndRelease()
{
	for(list<ark_NetMsgPtr>::iterator it=this->listMsg.begin(); it!= this->listMsg.end(); it++)
		delete (*it);

	this->listMsg.clear();
}