#ifndef ARK_MESSAGEDEALMANAGE_H_
#define ARK_MESSAGEDEALMANAGE_H_

//#include "../ark_platform/CommonInc.h"
#include "NetMsgMgr.h"
#include "../ark_Stream.h"
#include <unordered_map>
#include <deque>
#include <map>
#include <time.h>

#define MSG_CMD unsigned int

//////////////////////////////////////////////////////////////////////////
/// MsgDealMgr - 消息处理管理器
//////////////////////////////////////////////////////////////////////////

typedef std::unordered_map<int, int> lock_ms_type;
typedef std::unordered_map<int, long long> last_send_ms_type;


class MsgDealMgr
{
public:
	static void registerLock(int cmd,int ms);
	static void unregisterLock(int cmd, int ms);

public:
    //发送数据包(仅发送包头)
    static void QueryMsgHeader(MSG_CMD MEG_TAG);
    //直接发送数据
    static void QueryMsgBuffer(const char* buf, int size);

	static void  QueryInitWithCMD(int maxlen,ark_Stream* s,int cmd);
	static void  QueryPackAndSend(ark_Stream* s);

};

#endif