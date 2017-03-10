#include "MsgDealMgr.h"
#include "../ark_Utility.h"

#define MSG_INIT_WITH_CMD(maxlen, s, cmd)   ark_Stream s; \
	char _xbuf[maxlen]; s.CreateWriteStream(_xbuf, sizeof(_xbuf)); \
	s.WriteWord(0); s.WriteWord((unsigned short)cmd);
#define MSG_PACK_AND_SEND(s)  { int len = (int)s.GetSeekPos()-4; \
if (len<0 || len>(65535 - 4)) { len = 0; }; \
	s.Seek(0, ark_Stream::SK_START); s.WriteWord(len); \
	QueryMsgBuffer((const char*)s.GetBuffer(), len + 4); \
	s.Seek(len + 4, ark_Stream::SK_START); }

//////////////////////////////////////////////////////////////////////////

lock_ms_type lock_ms;  //锁定毫秒数
last_send_ms_type last_send_ms; //上一次发送的毫秒数

void MsgDealMgr::registerLock(int cmd, int ms)
{
	lock_ms[cmd] = ms;
}

void MsgDealMgr::unregisterLock(int cmd, int ms)
{
	auto iter = lock_ms.find(cmd);
	if (iter != lock_ms.end()) //有
	{
		lock_ms.erase(iter);
	}
}


void MsgDealMgr::QueryMsgHeader(MSG_CMD MEG_TAG)
{
	MSG_INIT_WITH_CMD(128, ll_stream, MEG_TAG);
	MSG_PACK_AND_SEND(ll_stream);
}

void MsgDealMgr::QueryMsgBuffer(const char* buf, int size)
{
	if (size >= 4)
	{
		char cmdc[4] = { 0 };
		memcpy(cmdc, buf, 4);
		short h = cmdc[1] & 0xFF;
		h = h << 8;
		short len = (h | cmdc[0] & 0xFF);

		h = cmdc[3] & 0xFF;
		h = h << 8;
		short cmd = (h | cmdc[2] & 0xFF);

		//log("QueryMsgBuffer cmd:%d", cmd);
		if (lock_ms.find(cmd) != lock_ms.end()) //有注册
		{
			int grid_ms = lock_ms[cmd];

			long long last_ms = 0;
			if (last_send_ms.find(cmd) != last_send_ms.end())
			{
				last_ms = last_send_ms[cmd];
			}
			long long nowms = SystemHelper::GetCurTick();
			printf("QueryMsgBuffer nowms:%lld", nowms);
			if (nowms - last_ms >= grid_ms)
			{
				//间隔时间够
				//可以发送，从新注册时间
				last_send_ms[cmd] = nowms;
			}
			else
			{
				//间隔不够
				printf("QueryMsgBuffer not enough ms:%lld,%lld,%lld", nowms, last_ms, nowms - last_ms);
				return;
			}
		}
		else
		{
			//没注册
			//可以发送，不用重新注册时间
		}
	}
	//log("QueryMsgBuffer;%s,%d", buf,size);
	ark_NetMsg* msg = new ark_NetMsg((unsigned char*)buf, size);
	NetMsgMgr::getInstance()->addSendMsg(msg);
}

void MsgDealMgr::QueryInitWithCMD(int maxlen, ark_Stream* s, int cmd)
{
	if (!s)
	{
		printf("QueryInitWithCMD error s is NULL");
	}

	char* _xbuf = new char[maxlen];   //maxlen
	s->CreateWriteStream(_xbuf, sizeof(_xbuf), true);
	s->WriteWord(0);
	s->WriteWord((unsigned short)cmd);
}

void MsgDealMgr::QueryPackAndSend(ark_Stream* s)
{
	if (!s)
	{
		printf("QueryInitWithCMD error s is NULL");
	}
	int len = (int)s->GetSeekPos() - 4;
	if (len<0 || len>(65535 - 4)) { len = 0; };
	s->Seek(0, ark_Stream::SK_START);
	s->WriteWord(len);
	QueryMsgBuffer((const char*)s->GetBuffer(), len + 4);
	s->Seek(len + 4, ark_Stream::SK_START);
}





/////////////////////////////////////////////////////