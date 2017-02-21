#ifndef _ARK_UTILITY_H_
#define _ARK_UTILITY_H_

#include <string>
#include "cocos2d.h"
#include "math.h"

USING_NS_CC;
using namespace std;

#include "ark_Stream.h"
//////////////////////////////////////////////////////////////////////////
//智能指针
template<typename Type>
class AutoReleasePtr
{
public:
	AutoReleasePtr(Type *ptr) {	p = ptr; }
	~AutoReleasePtr() { if(p) { delete p; } }
private:
	Type *p;
};

//////////////////////////////////////////////////////////////////////////
/// 系统辅助文件
class SystemHelper
{
public:
	//位操作
	static int bit_l(int a, int b);
	static int bit_r(int a, int b);
	static int bit_and(int a, int b);
	static int bit_or(int a, int b);
	static int bit_xor(int a, int b);

	//获取当前时间戳
	static double GetCurTick();
    //获取最大值最小值
    static int Max(int a, int b) { return a>b?a:b; }
	static double Max(double a, double b) { return a>b?a:b; }
    static int Min(int a, int b) { return a<b?a:b; }
	static double Min(double a, double b) { return a<b?a:b; }
    //是否在指定范围内
    static int InRange(int v, int min, int max) { return v>=min && v<=max; }
    static int IsEqualAny(int v, int r1, int r2) { return v==r1 || v==r2; }
    static int IsEqualAny(int v, int r1, int r2, int r3) { return IsEqualAny(v,r1,r2) || v==r3; }
    static int IsEqualAny(int v, int r1, int r2, int r3, int r4) { return IsEqualAny(v,r1,r2,r3) || v==r4; }
    static int IsEqualAny(int v, int r1, int r2, int r3, int r4, int r5) { return IsEqualAny(v,r1,r2,r3,r4) || v==r5; }
    static int IsEqualAny(int v, int r1, int r2, int r3, int r4, int r5, int r6) { return IsEqualAny(v,r1,r2,r3,r4,r5) || v==r6; }
    //获取随机数(包含min和max)
	static int RandomRange(int min, int max);
	//浮点近似相等
	static bool FloatApproxEquals(float f1, float f2, float Precision=0.00001f);
    //计算一个点是否在三角行内
    static bool IsInTriangle(Vec2 pt, Vec2 tr1, Vec2 tr2, Vec2 tr3);
    //计算两点之间的直线距离
    static float calcDistance(float x1, float y1, float x2, float y2) { return sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)); }
    static float calcDistance(Vec2 p1, Vec2 p2) { return calcDistance(p1.x, p1.y, p2.x, p2.y); }
    //计算CCRect中心点
    static Vec2 CalcRectCenterPoint(const Rect& r) { return Vec2(r.origin.x+r.size.width/2, r.origin.y+r.size.height/2); }
    //版本号字符格式
    static string GetVersionStr(int vCode);
    //获取指定内存的16进制字符串
    static string GetHexString(const char* buf, int len, bool blank=false);
    static int GetBufFromHexString(const string& str, char* buf, int maxLen);
	//pos指起始偏移量，没有就是0
	static string GetHexStringByStream(ark_Stream* stream, int pos,int len, bool blank = false);
	static string GetHexStringByBuf(const char* buf, int len, bool blank = false);
	static int GetStreamFromHexString(const string& str, ark_Stream* stream, int maxLen);

    //过滤非法字符串
	static string FilterLimitedMsg(std::string &msg, bool isReg = false);

	static bool isSameColor(const Color3B &a, const Color3B &b);

	//接近某种颜色
	static bool isNearRedColor(const Color3B &a);
	static bool isNearBlueColor(const Color3B &a);
	static bool isNearGreenColor(const Color3B &a);
	static bool isNearYellowColor(const Color3B &a);

	//获取时间戳
	static time_t getTimeStamp();

	//时间戳转日期
	static std::tm* gettm(long long timestamp);

	//获得染色shader_state
	static GLProgramState* getHSLGlprogramState();
};

//////////////////////////////////////////////////////////////////////////
/// 字符串辅助
class StringHelper
{
public:
    static string IntToStr(int val);
    static int StrToInt(const string& s);
    static string FloatToStr(float v);
    static float StrToFloat(const string& s);
    //检查是否只有数字和字母
    static int IsNumAndLetterOnly(const string& str);
    //字符串是否一致
    static bool IsSameStr(const char* s1, const char* s2);
    static bool IsSameStr(const string& s1, const string& s2);

	//字符串比较，不区分大小写
	static int  My_strnicmp(const char *dst,const char *src,int count);

public:
	//GBK和UTF8互转
	static std::string AnsiToUtf8(const char* buf);
	static std::string Utf8ToAnsi(const char* buf);

	//UTF8和UNICODE互转
	static int Utf8ToUnicode(char *to, size_t toLen, const char *from, size_t fromLen);
	static int UnicodeToUtf8(char *to, size_t toLen, const char *from, size_t fromLen);

public:
    //计算Unicode字符长度
    static int CalcUnicodeLen(const char* pUtf8);
    //截断到指定Unicode字符长度
    static string TruncateByUnicode(const char* pUtf8, unsigned int maxLen);

public:
    //替换字符串
    static string ReplaceStr(const string& str, const char* pOldStr, const char* pNewStr);
    //读取指定字符前的字符串，并返回指定字符的偏移
    static int ReadBeforeCharStr(const string& s, char tagChar, int offset, string& str);
    //读取指定字符前的整数，并返回指定字符的偏移
    static int ReadBeforeCharInt(const string& s, char tagChar, int offset, int& intv);
    //读取指定字符前的浮点数，并返回指定字符的偏移
    static int ReadBeforeCharFloat(const string& s, char tagChar, int offset, float& v);
	//拆分字符串，返回长度
	static int splitStr( std::vector<std::string>& arr,std::string str, char tagChar);
    //是否是以指定字符开头
    static bool IsBeginWith(const string& s, char c) { return s.size() > 0 && s[0] == c; }
    //是否是以指定字符结尾
    static bool IsEndWidth(const string& s, char c) { return s.size() > 0 && s[s.size()-1] == c; }
};

#define INT2STR(v) (StringHelper::IntToStr(v))
#define STR2INT(v) (StringHelper::StrToInt(v))
#define FLOAT2STR(v) (StringHelper::FloatToStr(v))
#define STR2FLOAT(v) (StringHelper::StrToFloat(v))

#define CCSTR_FMT1(fmt, p) (__String::createWithFormat(fmt,p)->getCString())
#define CCSTR_FMT2(fmt, p1, p2) (__String::createWithFormat(fmt,p1,p2)->getCString())
#define CCSTR_FMT3(fmt, p1, p2,p3) (__String::createWithFormat(fmt,p1,p2,p3)->getCString())

#define U2W StringHelper::Utf8ToUnicode
#define W2U StringHelper::UnicodeToUtf8

#define EQUAL_ANY2(v,r1,r2) SystemHelper::IsEqualAny(v,r1,r2)
#define EQUAL_ANY3(v,r1,r2,r3) SystemHelper::IsEqualAny(v,r1,r2,r3)
#define EQUAL_ANY4(v,r1,r2,r3,r4) SystemHelper::IsEqualAny(v,r1,r2,r3,r4)
#define EQUAL_ANY5(v,r1,r2,r3,r4,r5) SystemHelper::IsEqualAny(v,r1,r2,r3,r4,r5)
#define EQUAL_ANY6(v,r1,r2,r3,r4,r5,r6) SystemHelper::IsEqualAny(v,r1,r2,r3,r4,r5,r6)

#endif