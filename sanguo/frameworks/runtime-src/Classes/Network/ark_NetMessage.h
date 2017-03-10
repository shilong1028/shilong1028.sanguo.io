#ifndef _ARK_MESSAGECHANEL_H_
#define _ARK_MESSAGECHANEL_H_

#include <vector>
#include <list>
#include <stdlib.h>

using namespace std;

//////////////////////////////////////////////////////////////////////////
/// ark_NetMsg - 网络消息(格式为：2进制流 + 流长度)
class ark_NetMsg
{
public:
	ark_NetMsg()
    {
		this->m_buf = NULL;
		this->m_size = 0;
	};
    
    ~ark_NetMsg()
    {
		if(this->m_buf)
		{
			delete [] this->m_buf;
			this->m_buf = NULL;
		}
	};

	void destroy()
	{
		delete this;
	};

	ark_NetMsg(unsigned char* buf, unsigned long size)
	{
		this->m_size = size;
		this->m_buf = new unsigned char[size];
		memcpy(this->m_buf, buf, size);
	};

	ark_NetMsg& operator=(const ark_NetMsg& msg)
	{
		this->m_buf = new unsigned char[msg.m_size];
		this->m_size = msg.m_size;
        memcpy(this->m_buf, msg.getBufferConst(), this->m_size);

		return (*this);
	};

	unsigned char* getBuffer(){ return m_buf; }
    unsigned char* getBufferConst() const { return m_buf; }
    int getSize(){ return m_size; }

private:
	unsigned char*  m_buf;
	unsigned long   m_size;
};

typedef ark_NetMsg* ark_NetMsgPtr;

//////////////////////////////////////////////////////////////////////////
/// ark_NetMsgQueue - 消息队列
class ark_NetMsgQueue
{
public:
	ark_NetMsgQueue(){};
	~ark_NetMsgQueue()
    {
		clearAndRelease();
	};
public:
	void addMsg(ark_NetMsgPtr pMsg) { this->listMsg.push_back(pMsg); };
	int getSize(){ return listMsg.size(); };
	
    ark_NetMsgQueue operator+(ark_NetMsgQueue&);
	ark_NetMsgQueue& operator += (ark_NetMsgQueue&);
	ark_NetMsgQueue& operator=(ark_NetMsgQueue&);

public:
	void clear();
    void clearAndRelease();

public:
	list<ark_NetMsgPtr> listMsg;
};

#endif