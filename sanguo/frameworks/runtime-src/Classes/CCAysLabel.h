#ifndef ARK_LABELANALYSISNODE_H_
#define ARK_LABELANALYSISNODE_H_

//变色文字,表情
#include "cocos2d.h"

#define UICOLOR_WHITE		Color3B(255, 255, 255)	    //白色
#define UICOLOR_BLACK		Color3B(0, 0, 0)			//黑色

#define UICOLOR_RED		    Color3B(0xff, 0x5a, 0x27)	//红色  
#define UICOLOR_BLUE		Color3B(0x01, 0x7f, 0xff)	//蓝色 
#define UICOLOR_GREEN		Color3B(0x33, 0xa6, 0x00)	//绿色 
#define UICOLOR_YELLOW		Color3B(0xce, 0xaa, 0x00)	//黄色  
#define UICOLOR_PINK		Color3B(0xff, 0x7c, 0x99)   //粉色  
#define UICOLOR_GRAY		Color3B(119, 118, 118)		//灰色  
#define UICOLOR_PURPLE		Color3B(0xcc, 0x31, 0xff)	//紫色  
#define UICOLOR_ORANGE		Color3B(0xff, 0xa2, 0x00)	//橙色  
#define UICOLOR_BROWN		Color3B(0x9e, 0x89, 0x64)	//棕色 

USING_NS_CC;
using namespace std;

class CCAysLabel:public Node
{
public:
	static const char TAG_EXPRE = 'e'; //表情
	static const char TAG_COLOR = 'c';
	
public:
	enum AysType
	{
		ATY_NORMAL      = 0,   //普通
		ATY_COLOR_TEXT	= 1,   //颜色字
		ATY_EM			= 2,   //表情
	};
	enum ColorIdx
	{
		COL_RED			=1,		//红色
		COL_BLUE		=2,		//蓝
		COL_GREEN		=3,		//绿
		COL_YELLOW		=4,		//黄
		COL_PINK		=5,		//粉
		COL_GRAY		=6,		//灰色
		COL_PUPLE		=7,		//紫色
		COL_ORINGE		=8,		//橙色
		COL_BROWN		=9, 	//棕色
	};
	
public:
	CCAysLabel(); 
	~CCAysLabel();
	static CCAysLabel* create();
	static CCAysLabel* create(string Text, Size ContentSize, Color3B color = UICOLOR_WHITE, string fontName = "Microsoft Yahei", int FontSize = 20, bool needStroke = false, bool NeedShadow = true);		
	void reset(string Text, Size ContentSize, Color3B color = UICOLOR_WHITE, string fontName = "Microsoft Yahei", int FontSize = 20, bool needStroke = false, bool NeedShadow_ = true);
	Size getSize(){ return _Rect.size; }

protected:
	void Init(string Text, Size ContentSize, Color3B color = UICOLOR_WHITE, string fontName = "Microsoft Yahei", int FontSize = 20, bool needStroke = false, bool NeedShadow = true);
	bool checkIsNewLine_manual(int singal);

private:
	//存储参数,如果create参数修改，这里记得同步
	string mp_Text;
	Size mp_ContentSize;
	Color3B mp_color;
	string mp_FontName;
	int mp_FontSize;
	bool mp_needStroke;
	bool mp_NeedShadow;
	Rect _Rect;
};

#endif