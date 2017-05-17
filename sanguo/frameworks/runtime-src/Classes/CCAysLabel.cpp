#include "CCAysLabel.h"

CCAysLabel::CCAysLabel()
{
}

CCAysLabel::~CCAysLabel()
{
}
 
CCAysLabel* CCAysLabel::create()
{
	CCAysLabel *pob = new CCAysLabel();
	if(pob && pob->init())
    {
		pob->autorelease();
		return pob;
	}
	return NULL;
}

CCAysLabel* CCAysLabel::create(string Text, Size ContentSize, Color3B color, string fontName, int FontSize, bool needStroke, bool NeedShadow)
{
	CCAysLabel *pob = new CCAysLabel();
	if(pob && pob->init())
    {
		pob->autorelease();
		pob->Init(Text, ContentSize, color, fontName, FontSize, needStroke, NeedShadow);
		return pob;
	}
	return NULL;
}

//刷新内容
void CCAysLabel::reset(string Text, Size ContentSize, Color3B color, string fontName, int FontSize, bool needStroke, bool NeedShadow)
{
	this->removeAllChildren();
	this->Init(Text, ContentSize, color, fontName, FontSize, needStroke, NeedShadow);
}

//手动\n换行符
bool CCAysLabel::checkIsNewLine_manual(int singal)
{
	return singal == 10;  // 是 \n
}

void CCAysLabel::Init(string Text, Size ContentSize, Color3B color, string fontName, int FontSize, bool needStroke, bool NeedShadow)
{
	//存储参数,如果create参数修改，这里记得同步
	mp_Text = Text;
	mp_ContentSize = ContentSize;
	mp_color = color;
	mp_FontName = fontName;
	mp_FontSize = FontSize;
	mp_needStroke = needStroke;
	mp_NeedShadow = NeedShadow;
    _Rect = Rect(0, -FontSize, ContentSize.width, FontSize);
    ContentSize.height = FontSize;

	//int t = '[';

	int AYS_TYPE = ATY_NORMAL;			//是否为特殊状态,用来标记：普通，人名，物品名，颜色字，按钮，声音。不包含表情
	int step = 0;						//for循环的步长，换行符，半角==1，全角==2，汉字==3,i+step表示for循环的下一个符号
	int off = 0;      //Text字符当前计算中的idx
	int thWidth = 0;  //for每计算一个字符会累加,添加表情或者表情包也会累加，用来判断是否换行的
	float WLen = FontSize;
	float BLen = FontSize / 2.f;
	float DBLen = FontSize;   //表情宽

	Color3B thColor = color;

	//当前记录的位置，每次addChild对象都会递增，换行OffsetX归零
	int OffsetX = 0; //每次addChild的时候OffsetX会累加，用来设置每个部件的PositionX,thWidth是用来for循环计算用的，用来判断换行
	int OffsetY = 0;

	int offWidth = 0;
	int line = 0; //当前行数

	bool isNeedNewLineByEM = false;

	/*
	*for逻辑块
	*1:根据字符类型设置步长step
	*2:if 特殊类型 && AYS_TYPE == ATY_NORMAL ,区别出不同类型，设置AYS_TYPE值，表情直接addChild,并且设置位置，判断是否换行,如果处在换行位置且空间不够，不会addChild,跳转到第四步
	*3:else 特殊类型 && AYS_TYPE != ATY_NORMAL ,根据第二步设置的AYS_TYPE值创建对象，addChild,和设置位置
	*4:if 换行,根据2设置的AYS_TYPE值创建对象，addChild,和设置位置, 同时：处理第一步略过的可能换行且空间不够的表情Spr,打上标记 AYS_TYPE = ATY_NORMAL，设置好off,跳到第一步下一轮处理
	*5:处理最后一截文字
	*/
	for(size_t i = 0;i < Text.size();)  //每次循环：i += step
	{//end line：410
		//判断字符类型
		if (checkIsNewLine_manual(Text[i])){  //手动换行符 
			Text.erase(Text.begin() + i);
			i --;
			step = 1;
			goto NEXTLINE;
			return;
		}

		if((unsigned char)Text[i] < 0x7f){		//半角
			step = 1;
			thWidth += BLen;
		}else if((unsigned char)Text[i] < 0xdf) {  //全角
			step = 2;
			thWidth += BLen;
		}else{							       //汉字
			step = 3;
			thWidth += WLen;
		}

		if(i >= Text.size())				   //超过则弹出
			return;

		//特殊字符显示
		if(Text[i] == '[' && AYS_TYPE == ATY_NORMAL)  //如果有信息并且不是在信息之内
		{ //end line：232
			int count = i - off;
			if (count > 0){ //过滤空字符
				string Str = Text.substr(off, count);

				Label* ttfLabel = Label::createWithSystemFont(Str.c_str(), mp_FontName, FontSize);
				ttfLabel->setColor(color);
				if (mp_needStroke){
					ttfLabel->enableBold();
				}
				if (mp_NeedShadow){
					ttfLabel->enableShadow();
				}
				ttfLabel->setAnchorPoint(Vec2(0, 1));
				ttfLabel->setPosition(Vec2(OffsetX, OffsetY));
				this->addChild(ttfLabel, 1);
				OffsetX += ttfLabel->getContentSize().width;
			}
            thWidth -= BLen;

			if(i + 1 >= Text.size())
				return;

			switch(Text[i + 1])
			{
			case TAG_EXPRE://表情
				{  //上下行表情如果叠在一起可以通过调节行间距space 参数拉开距离
					off = i + 2; //起点,+2表示 [X 字符
					i = Text.find(']',off); //“]”位置
					if(i >= Text.size() || (int)i <= off - 2){
						off = Text.size();
						goto ENDAYS;
						return;
					}
					int Eid = atoi(Text.substr(off,i - off).c_str());
					char idStr[100];
					sprintf(idStr, "bq_%d.png", (Eid + 1));

					SpriteFrame* frame = SpriteFrameCache::getInstance()->getSpriteFrameByName(idStr);
					if(frame == NULL)
						frame = SpriteFrameCache::getInstance()->getSpriteFrameByName("bq_1.png");
					if(Sprite* spr = Sprite::createWithSpriteFrame(frame))
					{
						float EmWidth = FontSize * 1.6; //表情的宽度
						float EmHeight = FontSize;     //每行的间隔都是 FontSize + space
						float EmScale = FontSize * 2 / spr->getContentSize().width; //缩放
						spr->setPosition(Vec2(OffsetX + EmWidth / 2.0f, OffsetY - EmHeight / 2.f));
						spr->setScale(EmScale);
						OffsetX += EmWidth;
						thWidth += EmWidth;
					
						//判断算否处于换行位置（剩余空间不够显示表情Spr）
						//表情符号有可能和普通字符串混合使用，所以必须有此判断（表情包不会混合使用，因此不必判断是否处于换行位置）
						if(OffsetX >= ContentSize.width){
							OffsetX = 0;
							isNeedNewLineByEM = true; //剩余空间不足，打上标记略过addChild,放在下一轮(行)再addChild
							//剩余宽度不够可，本次判断添加此标签，放在换行逻辑里面添加
							off = off - 2; //归位起点，
							AYS_TYPE = ATY_EM;
							break;
						}
						else{
							this->addChild(spr, 1);
						}
					}
					//设置标志位并设置off为最后点，off偏移量算上符号：“]”
					off = i + 1;
				}break;			
			case TAG_COLOR:
				{
					off = i + 2;
					i = Text.find(']',off);
					if(i >= Text.size() || (int)i <= off - 2)
						return;

					int colorType = atoi(Text.substr(off,i - off).c_str());
					switch(colorType)//颜色类型
					{
						case COL_RED://红色
							thColor = UICOLOR_RED; break; 
						case COL_BLUE://蓝色
							thColor = UICOLOR_BLUE; break;
						case COL_GREEN://绿色
							thColor = UICOLOR_GREEN; break; 
						case COL_YELLOW://金色
							thColor = UICOLOR_YELLOW; break;  
						case COL_PINK://粉色
							thColor = UICOLOR_PINK; break; 
						case COL_GRAY://灰黑色
							thColor = UICOLOR_GRAY; break; 
						case COL_PUPLE://紫色
							thColor = UICOLOR_PURPLE; break; 
						case COL_ORINGE://橙色
							thColor = UICOLOR_ORANGE; break; 
						case COL_BROWN://棕色
							thColor = UICOLOR_BROWN; break; 
						default:
							thColor = UICOLOR_WHITE; break;
					}
					//设置标志位并设置off为最后点
					off = i + 1;
					AYS_TYPE = ATY_COLOR_TEXT;
				}break;
			default:
				{
					i = Text.find(']',off);
					if(i >= Text.size() || (int)i <= off - 2)
						return;

					//设置标志位并设置off为最后点
					off = i + 1;
					AYS_TYPE = ATY_NORMAL;
				}break;
			}//switch
		} //begin line：119,分析普通状态内的if语句结束
		else if(Text[i] == '[' && AYS_TYPE != ATY_NORMAL)   //在特殊状态内
		{
			thWidth -= BLen;
			string Str = Text.substr(off,i - off);
			switch(AYS_TYPE)
			{
				case ATY_COLOR_TEXT://颜色字
					{
						Label* ttfLabel = Label::createWithSystemFont(Str.c_str(), mp_FontName, FontSize);
						ttfLabel->setColor(thColor);
						if (mp_needStroke){
							ttfLabel->enableBold();
						}
						if (mp_NeedShadow){
							ttfLabel->enableShadow();
						}
						ttfLabel->setAnchorPoint(Vec2(0,1));		
						ttfLabel->setPosition(Vec2(OffsetX,OffsetY));					
						this->addChild(ttfLabel, 1);
						OffsetX += ttfLabel->getContentSize().width;
					}break;
				default:
					AYS_TYPE = ATY_NORMAL;
					break;
			}
			//还原状态
			AYS_TYPE = ATY_NORMAL;
			i = Text.find(']',off);
			if(i >= Text.size() || (int)i <= off - 2)
				return;

			thColor = color;
			off = i + 1;
		} //begin line：241,分析特殊状态内的if语句结束

		bool isCountToChangeLine; //根据计算是否需要换行
		isCountToChangeLine = (thWidth + offWidth) >= ContentSize.width; //这个值计算出来有偏差，底下会进行修正(影响性能)
		//这是优化算法(防止因为字体原因每行超框)，如果影响性能可以屏蔽,屏蔽会引发超框问题
		//普通文本，并且表情换行，或者计算出来需要换行了(isNeedNewLineByEM == true 表示肯定要换行了，这里没必要修正) //AYS_TYPE == ATY_NORMAL && (!isNeedNewLineByEM || isCountToChangeLine)

		if (AYS_TYPE == ATY_NORMAL) //如果是Label,并且还未到换行阶段，判断是否需要换行（上面每个字符按FontSize/2计算，不准确，调用系统Label计算）
		{
			//修正代码
			float absLen = abs(ContentSize.width - (thWidth + offWidth));
			if (absLen <= ContentSize.width/2) //纠正区间定位 ContentSize.width/2
			{
				string Str = Text.substr(off, i - off + step);
				Label* ttfLabel = Label::createWithSystemFont(Str.c_str(), mp_FontName, FontSize);
				if (ttfLabel->getContentSize().width + OffsetX >= ContentSize.width) {  //从像素判断确实需要换行
					isCountToChangeLine = true;
				}else{
					if (isCountToChangeLine){
						isCountToChangeLine = false; //修正
					}
				}
			}
		}//优化算法 end

		//需要换行时候还要过滤，紧接着是\n形式的手动换行，此时换行必须被忽略
		if (isCountToChangeLine || isNeedNewLineByEM)
		{
			int nextCharIndex = i + step; //下一个符号idx
			if (nextCharIndex < Text.size()){
				int nextchar = Text[nextCharIndex]; //下一个符号
				if (checkIsNewLine_manual(nextchar )){   //\n
					isCountToChangeLine = false;
					isNeedNewLineByEM = false;
				}
			}
			
		}

		//需要换行了,计算文本长度超过，或者因为表情符号正好压在行末位置
		if (isCountToChangeLine || isNeedNewLineByEM)
		{
NEXTLINE:
			offWidth = 0;
			line += 1;
			bool isKeepOffToNextRound = false; //off是否要保持到下一次for 循环，默认是要偏移off
			string Str = Text.substr(off,i - off + step);
			float amend = 0; //修正变量，默认每行间隔是FontSize + space + amend,

			switch(AYS_TYPE)
			{
				case ATY_NORMAL://普通字符
					{
						Label* ttfLabel = Label::createWithSystemFont(Str.c_str(), mp_FontName, FontSize);
						ttfLabel->setColor(color);
						if (mp_needStroke){
							ttfLabel->enableBold();
						}
						if (mp_NeedShadow){
							ttfLabel->enableShadow();
						}
						ttfLabel->setAnchorPoint(Vec2(0,1));
						ttfLabel->setPosition(Vec2(OffsetX,OffsetY));
						this->addChild(ttfLabel, 1);
					}break;
				case ATY_COLOR_TEXT://颜色字
					{
						Label* ttfLabel = Label::createWithSystemFont(Str.c_str(), mp_FontName, FontSize);
						ttfLabel->setColor(thColor);
						if (mp_needStroke){
							ttfLabel->enableBold();
						}
						if (mp_NeedShadow){
							ttfLabel->enableShadow();
						}
						ttfLabel->setAnchorPoint(Vec2(0,1));
						ttfLabel->setPosition(Vec2(OffsetX,OffsetY));
						this->addChild(ttfLabel, 1);
					}break;
				case ATY_EM:
					{  //本轮表情在最后位置空间不够显示，设置为下一轮for循环再addChild,打上标记为ATY_NORMAL，下一轮进入重新计算坐标逻辑块
						isKeepOffToNextRound = true;
						AYS_TYPE = ATY_NORMAL;
					}break;
				default:
					AYS_TYPE = ATY_NORMAL;
					break;
			}//switch

			//还原状态
			if (!isKeepOffToNextRound){   //非表情超出，不需要保持off
				off = i + step;
			}else{
				i = off - step;  //下一轮重新处理，i值要归位
			}
			thWidth = 0;
			OffsetX = 0;
			OffsetY -= (FontSize + amend);
		}//判断换行if逻辑结束

		//for循环增加步长,line:120
		i += step;

	} //begin line：90
	//Text文本for循环解析结束

ENDAYS:
	//补上最后一段文字
	string Str = Text.substr(off,Text.size() - off);

	Label* ttfLabel = Label::createWithSystemFont(Str.c_str(), mp_FontName, FontSize);
	ttfLabel->setColor(color);
	if (mp_needStroke){
		ttfLabel->enableBold();
	}
	if (mp_NeedShadow){
		ttfLabel->enableShadow();
	}
	ttfLabel->setAnchorPoint(Vec2(0,1));
	ttfLabel->setPosition(Vec2(OffsetX,OffsetY));
	this->addChild(ttfLabel, 1);

	//设置整个Node大小
	if(ttfLabel->getContentSize().height > 0 || OffsetX > 0 || OffsetY == 0)
		OffsetY -= WLen;

	if(OffsetY - WLen > 0 || line>0)
		_Rect = Rect(0,OffsetY,ContentSize.width,-OffsetY);
	else
		_Rect = Rect(0,OffsetY,OffsetX + ttfLabel->getContentSize().width,-OffsetY);

	if(_Rect.size.width==0)
		_Rect.size.width = 60;
	if(_Rect.size.height == 0)
		_Rect.size.height = FontSize;
}
