#include "iconv.h"
#include "ark_Utility.h"
#include "scripting/lua-bindings/manual/CCLuaEngine.h"

//////////////////////////////  SystemHelper   ////////////////////////////////////////////
//返回毫秒
double SystemHelper::GetCurTick()
{	
	struct timeval start;
	gettimeofday(&start, nullptr);
	return (start.tv_sec * 1000.0 + start.tv_usec / 1000.0);
}

//位操作
int SystemHelper::bit_l(int a, int b)
{
	return a << b;
}
int SystemHelper::bit_r(int a, int b)
{
	return a >> b;
}
int SystemHelper::bit_and(int a, int b)
{
	return a & b;
}
int SystemHelper::bit_or(int a, int b)
{
	return a | b;
}
int SystemHelper::bit_xor(int a, int b)
{
	return a ^ b;
}

int SystemHelper::RandomRange(int min, int max)
{
    //相等直接返回
    if(min == max)
        return min;

    //大小不匹配则交换
	if(min > max) { int t=min; min=max; max = t; }
	
    return min + rand() % (max-min+1);
}

bool SystemHelper::FloatApproxEquals(float f1, float f2, float Precision)
{
	return (fabs(f1-f2) < Precision);
}

string SystemHelper::FilterLimitedMsg(string &msg, bool isReg)
{
	static bool IsMsgLoaded = false;
	static vector<string> LIMITED_MSG;
	static vector<string> REG_LIMITED_MSG;
	//auto timer1 = GetCurTick();
	if (!IsMsgLoaded)
	{
		LuaEngine::getInstance()->executeScriptFile("str/ForbiddenWord.lua");
		//LuaMgr::GetInstance()->executeScriptFile("str/ForbiddenWord.lua"); //lua/
		//LuaMgr::GetInstance()->executeReadLuaTable("LIMITED_MSG",LIMITED_MSG);
		//LuaMgr::GetInstance()->executeReadLuaTable("REG_LIMITED_MSG",REG_LIMITED_MSG);
		IsMsgLoaded = true;
	}

	bool found = false;
    char buf[2048] = {0};
	char *p = buf;
	snprintf(buf, sizeof(buf), "%s", msg.c_str());

    int totalCount = LIMITED_MSG.size();
	for(int i = 0; i < totalCount; i++)
	{
		if ((p = strstr(buf, LIMITED_MSG[i].c_str())) != NULL)
		{
			found = true;
			for (size_t j = 0; j < LIMITED_MSG[i].length(); j++)
			{
				if(*p != '\0')
					*p++ = '*';
				else
					break;
			}
			i--;
		}
	}
	//登录注册追加屏蔽字符
	if(isReg)
	{
		totalCount = REG_LIMITED_MSG.size();
		for(int i = 0; i < totalCount; i++)
		{
			if ((p = strstr(buf, REG_LIMITED_MSG[i].c_str())) != NULL)
			{
				found = true;
				int lenth = REG_LIMITED_MSG[i].length();
				for (int j = 0; j < lenth; j++)
				{
					if(*p != '\0')
						*p++ = '*';
					else
						break;
				}
				i--;
			}
		}
	}
	
	msg.clear();
	msg = buf;

    //检查是否全是星号
    bool IsAllStar = true;
    for (size_t i=0; i<msg.size(); i++)
    {
        if(msg[i] != '*')
        {
            IsAllStar = false;
            break;
        }
    }
	return msg;
}

bool SystemHelper::isSameColor(const Color3B &a, const Color3B &b)
{
	return (a.b == b.b && a.g == b.g && a.r == b.r);
}

bool SystemHelper::isNearRedColor(const Color3B &a)
{
	return (a.b <=30 && a.g <= 30 && a.r >= 220);
}

bool SystemHelper::isNearGreenColor(const Color3B &a)
{
	return (a.b <=30 && a.g >= 220 && a.r <= 30);
}

bool SystemHelper::isNearBlueColor(const Color3B &a)
{
	return (a.b >=220 && a.g <= 30 && a.r <= 30);
}

bool SystemHelper::isNearYellowColor(const Color3B &a)
{
	return (a.b <=30 && a.g >= 220 && a.r >= 220);
}

std::string SystemHelper::GetVersionStr(int vCode)
{
    char buf[256];
    sprintf(buf, "%d.%d.%d", vCode/10000, (vCode%10000)/100, vCode%100);
    return string(buf);
}

std::string SystemHelper::GetHexString(const char* buf, int len, bool blank)
{
    string strRet;
    
	for (int i = 0; i < len; i++)
	{
        char strbuf[4] = {0};
        sprintf(strbuf,"%02x",(unsigned char)buf[i]);
		strRet.append(strbuf);
		if(blank)
			strRet.append("   ");
	}
    return strRet;
}

int SystemHelper::GetBufFromHexString(const string& str, char* buf, int maxLen)
{
    if(str.size() % 2 != 0)
        return 0;
    
    const int bufLen = (int)str.size()/2;

    if (maxLen < bufLen)
	    return 0;
	
	for (int i = 0; i < bufLen; i++)
	{
		int temp = 0;
		sscanf(&str[i*2],"%02x",&temp);
		buf[i] = temp;
		
	}
	return bufLen;
}

int SystemHelper::GetStreamFromHexString(const string& str, ark_Stream* stream, int maxLen)
{
	if (str.size() % 2 != 0)
		return 0;

	const int bufLen = (int)str.size() / 2;

	if (maxLen < bufLen)
		return 0;
	char* buf = new char[bufLen];
	for (int i = 0; i < bufLen; i++)
	{
		int temp = 0;
		sscanf(&str[i * 2], "%02x", &temp);
		buf[i] = temp;

	}
	//ark_Stream* nstream = new ark_Stream();
	stream->CreateReadStreamFromBuf(buf, bufLen);
	//delete buf;
	return bufLen;
}

std::string SystemHelper::GetHexStringByStream(ark_Stream* stream, int pos, int len, bool blank)
{
	const char* buf = (char*)stream->GetBuffer() + pos;
	/*string strRet;

	for (int i = 0; i < len; i++)
	{
		char strbuf[4] = { 0 };
		sprintf(strbuf, "%02x", (unsigned char)buf[i]);
		strRet.append(strbuf);
		if (blank)
			strRet.append("   ");
	}*/
	return GetHexStringByBuf(buf, len, blank);
}

std::string SystemHelper::GetHexStringByBuf(const char* buf, int len, bool blank)
{
	string strRet;

	for (int i = 0; i < len; i++)
	{
		char strbuf[4] = { 0 };
		sprintf(strbuf, "%02x", (unsigned char)buf[i]);
		strRet.append(strbuf);
		if (blank)
			strRet.append("   ");
	}
	return strRet;
}

bool SystemHelper::IsInTriangle(Vec2 pt, Vec2 tr1, Vec2 tr2, Vec2 tr3)
{
    class opr
    {
    public:
        static float calcArea(Vec2 p1, Vec2 p2, Vec2 p3) 
        {
            return fabs((p1.x * p2.y + p2.x * p3.y + p3.x * p1.y - p2.x * p1.y - p3.x * p2.y - p1.x * p3.y) / 2.0f);
        }
    };

    float tArea = opr::calcArea(tr1, tr2, tr3);
    float totalArea = opr::calcArea(pt, tr1, tr2);
    totalArea += opr::calcArea(pt, tr1, tr3);
    totalArea += opr::calcArea(pt, tr2, tr3);
    float epsilon = 0.0001f;
    if (fabs(tArea - totalArea) < epsilon)
        return true;
    return false;
}

//获取时间戳
time_t SystemHelper::getTimeStamp()
{
	std::chrono::time_point<std::chrono::system_clock, std::chrono::milliseconds> tp = std::chrono::time_point_cast<std::chrono::milliseconds>(std::chrono::system_clock::now());
	auto tmp = std::chrono::duration_cast<std::chrono::milliseconds>(tp.time_since_epoch());
	time_t timestamp = tmp.count();
	//std::time_t timestamp = std::chrono::system_clock::to_time_t(tp);  
	return timestamp;
}

//时间戳转日期
std::tm* SystemHelper::gettm(long long timestamp)
{
	long long milli = timestamp + (long long)8 * 60 * 60 * 1000;//此处转化为东八区北京时间，如果是其它时区需要按需求修改  
	auto mTime = std::chrono::milliseconds(milli);
	auto tp = std::chrono::time_point<std::chrono::system_clock, std::chrono::milliseconds>(mTime);
	auto tt = std::chrono::system_clock::to_time_t(tp);
	std::tm* now = gmtime(&tt);
	printf("%4d年%02d月%02d日 %02d:%02d:%02d\n", now->tm_year + 1900, now->tm_mon + 1, now->tm_mday, now->tm_hour, now->tm_min, now->tm_sec);
	return now;
}

static GLProgramState*	_GHSLglprogramstate = nullptr; //单例
GLProgramState* SystemHelper::getHSLGlprogramState()
{
	if (!_GHSLglprogramstate)
	{
		auto glp = GLProgram::createWithFilenames("Shaders/BasicTexture.vsh", "Shaders/HsvTexture.fsh");
		_GHSLglprogramstate = GLProgramState::getOrCreateWithGLProgram(glp);
		GLProgramCache::getInstance()->addGLProgram(glp, "HsvTexture");

	}
	return _GHSLglprogramstate;
}

///////////////////////////////  StringHelper  //////////////////////////////

int code_convert(const char *from_charset, const char *to_charset, const char *inbuf, size_t inlen, char *outbuf, size_t outlen)
{
#if (CC_TARGET_PLATFORM != CC_PLATFORM_IOS)
	iconv_t cd;
	const char *temp = inbuf;
	const char **pin = &temp;
	char **pout = &outbuf;
	memset(outbuf, 0, outlen);
	cd = iconv_open(to_charset, from_charset);
	if (cd == 0) return -1;
	if (iconv(cd, pin, &inlen, pout, &outlen) == -1) return -1;
	iconv_close(cd);
#endif
	return 0;
}

//////////////////////////////////////////////////////////////////////////
std::string StringHelper::AnsiToUtf8(const char* buf)
{
#if (CC_TARGET_PLATFORM != CC_PLATFORM_IOS && CC_TARGET_PLATFORM != CC_PLATFORM_ANDROID)
	std::string strRet;
	size_t inlen = strlen(buf);
	char * outbuf = new char[inlen * 2 + 2];
	if (code_convert("GBK", "utf-8", buf, inlen, outbuf, inlen * 2 + 2) == 0)
		strRet = outbuf;
	delete[] outbuf;
	return strRet;
#else
	return std::string(buf);
#endif
}

std::string StringHelper::Utf8ToAnsi(const char* buf)
{
#if (CC_TARGET_PLATFORM != CC_PLATFORM_IOS)
	size_t inlen = strlen(buf);
	char* outbuf = new char[inlen * 2 + 2];
	std::string strRet;
	if (code_convert("utf-8", "gbk", buf, inlen, outbuf, inlen * 2 + 2) == 0)
		strRet = outbuf;
	delete[] outbuf;
	return strRet;
#else
	return std::string(buf);
#endif
}

int StringHelper::Utf8ToUnicode(char *to, size_t toLen, const char *from, size_t fromLen)
{
	static iconv_t sCdUnicodeGbk = iconv_open("UNICODELITTLE", "utf-8");
	size_t oldToLen = toLen;
	iconv(sCdUnicodeGbk, (const char**)&from, &fromLen, &to, &toLen);
	return (oldToLen - toLen);
}

int StringHelper::UnicodeToUtf8(char *to, size_t toLen, const char *from, size_t fromLen)
{
	static iconv_t sCdUnicodeGbk = iconv_open("utf-8", "UNICODELITTLE");
	size_t oldToLen = toLen;
	iconv(sCdUnicodeGbk, (const char**)&from, &fromLen, &to, &toLen);
	return (oldToLen - toLen);
}

int StringHelper::CalcUnicodeLen(const char* pUtf8)
{
	//////////////////////////////////////////////////////////////////////////
	/// Unicode符号范围 | UTF-8编码方式
	/// (十六进制) | （二进制）
	/// --------------------+---------------------------------------------
	/// 0000 0000-0000 007F | 0xxxxxxx
	/// 0000 0080-0000 07FF | 110xxxxx 10xxxxxx
	/// 0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
	/// 0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
	//////////////////////////////////////////////////////////////////////////

	int n = 0;
	char ch = 0;
	while ((ch = *pUtf8))
	{
		CC_BREAK_IF(!ch);

		if (0x80 != (0xC0 & ch))
			++n;
		++pUtf8;
	}
	return n;
}

string StringHelper::TruncateByUnicode(const char* pUtf8, unsigned int maxLen)
{
	string str = pUtf8;

	std::vector<std::string> vecChars;
	while (str.size() > 0)
	{
		std::string iStr;
		int delLen = 1;
		while (0x80 == (0xC0 & str.at(str.size() - delLen))) { delLen++; }
		while (delLen > 0) { iStr.insert(iStr.begin(), str[str.size() - 1]); str.erase(str.end() - 1); delLen--; }
		vecChars.insert(vecChars.begin(), iStr);
	}

	if (vecChars.size() > maxLen)
	{
		while (vecChars.size() > maxLen)
			vecChars.erase(vecChars.end() - 1);
	}

	str.clear();
	for (size_t i = 0; i < vecChars.size(); i++)
		str.append(vecChars[i]);

	return str;
}

std::string StringHelper::ReplaceStr(const string& str, const char* pOldStr, const char* pNewStr)
{
	size_t pos = 0;
	string tempStr = str;
	string oldStr = pOldStr;
	string newStr = pNewStr;
	string::size_type newStrLen = newStr.length();
	string::size_type oldStrLen = oldStr.length();
	while (true)
	{
		pos = tempStr.find(oldStr, pos);
		if (pos == string::npos) break;

		tempStr.replace(pos, oldStrLen, newStr);
		pos += newStrLen;
	}

	return tempStr;
}

int StringHelper::ReadBeforeCharStr(const string& s, char tagChar, int offset, string& str)
{
	int pos = s.find(tagChar, offset);
	if (pos != -1)
		str = s.substr(offset, pos - offset);
	return pos;
}

int StringHelper::ReadBeforeCharInt(const string& s, char tagChar, int offset, int& intv)
{
	string str;
	int pos = ReadBeforeCharStr(s, tagChar, offset, str);
	if (pos != -1)
		intv = atoi(str.c_str());
	return pos;
}

int StringHelper::ReadBeforeCharFloat(const string& s, char tagChar, int offset, float& v)
{
	string str;
	int pos = ReadBeforeCharStr(s, tagChar, offset, str);
	if (pos != -1)
		v = __String(str.c_str()).floatValue();
	return pos;
}

int StringHelper::splitStr(std::vector<std::string>& arr, std::string str, char tagChar)
{
	int index = 0;
	int pos = str.find_first_of(tagChar);
	std::string substr = "";
	while (pos != str.npos)
	{
		substr = str.substr(0, pos);
		int len = strlen(str.c_str());
		str = str.substr(pos + 1, len - 1);
		arr.push_back(substr);
		index++;
		/*		arr[index++] = substr;*/
		pos = str.find_first_of(tagChar);
	}
	int len = strlen(str.c_str());
	if (len > 0)
	{
		arr.push_back(str);
		index++;
	}
	return arr.size();
}

int StringHelper::My_strnicmp(const char *dst, const char *src, int count)
{
	int ch1, ch2;
	do
	{
		if (((ch1 = (unsigned char)(*(dst++))) >= 'A') && (ch1 <= 'Z'))
			ch1 += 0x20;
		if (((ch2 = (unsigned char)(*(src++))) >= 'A') && (ch2 <= 'Z'))
			ch2 += 0x20;
	} while (--count && ch1 && (ch1 == ch2));
	return (ch1 - ch2);
}

int StringHelper::IsNumAndLetterOnly(const string& str)
{
    for(size_t i = 0;i < str.size();i ++)
    {
        const char it = str[i];
        if(!(((it >= 'a' && it <= 'z')|| (it >= 'A' && it <= 'Z')) || (it >= '0' && it <= '9'))){
            return 0;	
        }
    }
    return 1;
}

std::string StringHelper::IntToStr(int val)
{
    std::ostringstream os;
    os<<(val);
    std::string str = os.str();
    return str;
}

string StringHelper::FloatToStr(float v)
{
    std::ostringstream os;
    os<<(v);
    std::string str = os.str();
    return str;
}

bool StringHelper::IsSameStr(const char* s1, const char* s2)
{
    return strcmp(s1, s2) == 0;
}

bool StringHelper::IsSameStr(const string& s1, const string& s2)
{
    return IsSameStr(s1.c_str(), s2.c_str());
}

float StringHelper::StrToFloat(const string& s)
{
    return __String(s.c_str()).floatValue();
}

int StringHelper::StrToInt(const string& s)
{
    return __String(s.c_str()).intValue();
}

