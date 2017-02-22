#ifndef IMODANIM_H_
#define IMODANIM_H_

#include <string>
#include "cocos2d.h"
#include "base/ccTypes.h"

USING_NS_CC;
using namespace std;

struct ModuleOpt
{
	short sx;
	short sy;
	short w;
	short h;
	SpriteFrame *frame;
	ModuleOpt()
	{
		frame = nullptr;
	}
};
struct SpriteOpt
{
	char size;
	short sx[2];
	short sy[2];
	char flag[2];
	char module_id[2];
};

struct ActionOpt
{
	char size;
	vector<char> frames;
	vector<char> durations;
};

//-----------------------------------
struct extTxtOpt   //动画的额外数据
{
	string txtPath;  //文件路径
	float durTime;   //动画播放时间
	char size;   //额外复用的帧总数量
	vector<short> frameIdx;  //额外复用的帧索引（从小到大依次排序）
	vector<short> times;   //额外复用的帧索引对应的帧重复次数
};
//-----------------------------------

class ImodAnimAsynLoadItem;
class ImodAnimAsynLoadMgr;

class ImodAnim: public Node
{
private:
    enum { ANI_MAX_COUNT = 10, };
	unsigned char GetActionsNum() { return _ActionsNum; }
	vector<ModuleOpt>& GetModules() { return _VecModules[0]; }
	vector<SpriteOpt>& GetSprites() { return _VecSpritesOpt[0]; }
	vector<ActionOpt>& GetActions() { return _VecActions[0]; }

public:    
    ImodAnim();
	virtual ~ImodAnim();
    CREATE_FUNC(ImodAnim);
    virtual bool init();
	virtual void onEnter();
private:
	
	enum ShaderMode
	{
		ShaderMode_None,
		ShaderMode_Blend,
		ShaderMode_HSV,
	};

	enum TRANS
	{
		TRANS_NONE = 0,
		TRANS_ROT90,
		TRANS_ROT180,
		TRANS_ROT270,
		TRANS_MIRROR,
		TRANS_MIRROR_ROT90,
		TRANS_MIRROR_ROT180,
		TRANS_MIRROR_ROT270,
		FLIP_X = 0x2,
		FLIP_Y = 0x1,
		ROTATE_90 = 0x1000,
		ROTATE_180 = (short) (FLIP_X | FLIP_Y),
	};

private:
	void initAnimWithName(const string& utfPic, const string& utfAni); //这个不导出，避免重载导出问题
	void initAnimWithName(const string& utfFile, const char* picExt, const char* aniExt);

	void createAniSprite(int animateIdx,int frameIdx);				   //公用方法，创建每帧动画切片精灵
	void clearAniSprite(int startIdx=0);							   //清除切片从某个idx开始默认为零全部清除
	void doFrameCallback(int curFrame);								   //执行帧回调
	void doEndCallback(bool retain = false);						   //执行结束回调（是否保留回调）

	//---------------------------------------------
	void extTxtOptInit();
public:
	void setExtFrameData(string &txtFullPath, vector<int> &frameVec, vector<int> &timeVec, int time_ms = 100);

	//转后后缀，mydp为png
	std::string transPathFormat(const std::string &path)
	{
		std::string tpath = path;
		int off = tpath.find(".mydp", 0);
		if (off > 0){
			tpath = tpath.substr(0, off);
			tpath.append(".png"); // .png  .mydp
		}
		return tpath;
	}
	//---------------------------------------------

public:
    //初始化数据(注意：次函数会清空重置成员变量，必须先调用次函数，再设置其他属性),默认不会清除已创建的精灵，有需要设置参数为true
	void initAnimWithName(const char * utfPic, const char * utfAni,bool clearSpr=true);
    
    //加入附加动画模块
	int addAnimWithName(const char * utfPic, const char * utfAni, int Zorder = 1, Color3B color = Color3B::WHITE);
	//删除特定层动画
	void removeAnim(int ind);
	//删除特定文件名动画
	void removeAnim(const char *aniName);
    //播放action(仅播放一次)
	void PlayAction(int actIndex, float durTime = 0.1f, bool isGhost = false, float ghostDurTime = 100.0f, bool runTimerNow = false);
	//重复播放action
    void PlayActionRepeat(int actIndex, float durTime = 0.1f, bool runTimerNow = false); 
	//播放特定幀action
	void playFirstFrameIndex(int actionIdx);
	//设置当前action
	void SetCurrentAction(int actIndex);
	//设置重绘
	void ToggleAction(bool action){ _IsNeedDraw = action; }
    //改变某项特效的层级
	void ChangeZorderByIndex(int index,int zOrder);
	void ChangeZorderByIndex(const char *aniName, int zOrder);
    //设置播放完毕回调
    void SetFrameEndCallBack(Ref* target, SEL_CallFuncN fn) { _FrameEndTarget = target; _FrameEndCB = fn; }
    //设置桢回调(到达指定桢时回调)
    void _setFrameCallBack(int frame, Ref* target=NULL, SEL_CallFuncN fn=NULL) { 	_FrameCBIdx = frame; _FrameTarget = target; _FrameCB = fn; }
	void SetFrameCallBack(int frame){ _FrameCBIdx = frame;  }
	//停止播放當前動畫，恢復到原始狀態
	void stopCurrentAni();
	//重置所有數據
    void resetAniData(bool clearSpr=false);
	void stop();
	void resume();
    
    int getOpacity() { return _Opacity; }
    Color3B GetColor() { return _SpriteColor; }
	int GetHeight(){ return _MaxHeight; }
	
    void setFlippedX(bool flip);
	void setFlippedY(bool flip);
    void setColor(Color3B sprColor);
    void setOpacity(int Opacity);

    //设置残影
    void setGhost(bool isGhost, float ghostDurTime);
	bool IsInitAnimation(){ return !(_aniNum == 0); }
	//脚本回调
	void registerScriptEndCBHandler(int nHandler); //最后一帧结束
	void unregisterScriptEndCBHandler(void);

	void printAnimZorder();
	void setBlendColor(Color4F color);
	void sethsv(Vec3 vec3);
	void sethsvByIndex(int idx,Vec3 vec3);
	void setMaxAniNum(int value);

	void setNeedImageAsyncLoad(bool bNeed);
	bool getNeedImageAsyncLoad();
private:
	void OnGhostEndCallBack(Node* pSender);
	void OnGhostUpdate(float dt);
    void OnAnimateUpdate(float dt);
	void executeEndCBScript();
	void executeFrameCBScript();
private:
	Ref*						_FrameEndTarget;        //结束桢回调目标
    SEL_CallFuncN               _FrameEndCB;            //结束桢回调函数
    Ref*						_FrameTarget;           //指定桢回调目标
    SEL_CallFuncN               _FrameCB;               //指定桢回调函数
    int	                        _FrameCBIdx;            //指定回调桢索引
	
	vector<ModuleOpt>           _VecModules[ANI_MAX_COUNT];         //依次是: x,y,w,h,image_id
	vector<SpriteOpt>           _VecSpritesOpt[ANI_MAX_COUNT];      //精灵参数
	vector<ActionOpt>           _VecActions[ANI_MAX_COUNT];         //动作列表
	int                         _ActionZorders[ANI_MAX_COUNT];      //不同动作Zorder
	Color3B						_ActionColors[ANI_MAX_COUNT];       //不同动作混合色

	string                      _VecPic[ANI_MAX_COUNT];             //资源文件名
	unsigned char               _ActionsNum;            //总动作个数
	unsigned char               _FramesNum;             //总帧数
	float                       _DurationTime;
	unsigned int                _Ticker[ANI_MAX_COUNT];	 //当前动作已播放帧数
	int                         _CurFrame[ANI_MAX_COUNT];//当前帧
	int                         _CurAction[ANI_MAX_COUNT];//当前动作
	int                         _aniNum;				//动画层数
	bool                        _IsNeedDraw;            //是否需要重绘
	bool                        _IsNeedCircle;          //是否需要循环
	bool                        _IsFlipX;               //X轴翻转
    bool                        _IsFilpY;               //Y轴翻转
    int                         _Opacity;               //透明度
	Color3B						_SpriteColor;           //Sprite混色值
	int							_MaxHeight;				//最大高度
	
	bool                        _IsGhost;               //是否有残影
	float                       _GhostDurTime;          //残影播放时间
	int							m_nScriptEndCBHandler;	//播放结束回调开关（lua）默认有回调

	int							m_max_ani = ANI_MAX_COUNT;
	bool						_isBlend = false;
	ShaderMode					_shaderMode = ShaderMode::ShaderMode_None;
	Color4F						_blendColor;
	Vec3						_hsvVec3;  //{360,1,1}
	Vec3						_hsvVec3s[ANI_MAX_COUNT];
	ShaderMode					_shaderModes[ANI_MAX_COUNT];
	GLProgramState*				_originGLPState;
	BlendFunc					_originBlendFunc;
	GLProgram*					_Blendglprogram;// = GLProgram::createWithFilenames("Shaders/example_MultiTexture.vsh", "Shaders/example_MultiTexture.fsh");
	
	GLProgramState*				_HSLglprogramstate = nullptr;
	GLProgramState*				_Blendglprogramstate = nullptr;
	//异步加载
	bool						isNeedImageAsyncLoad;

	//---------------------------------------------
	extTxtOpt extTxtVec;  //动画的额外数据
	float extFrameDurtionTime;   //动画播放帧间隔时间
	//---------------------------------------------
	
};


//异步加载结构体
class ImodAnimAsynLoadItem
{
public:
	std::function<void(Texture2D*, int, const char*)> callback;
	std::function<void(Texture2D*)> AsynCallback;
	std::string utfPic;  //name.png
	std::string picName; //name
	int idx;
	double starttime;
	ImodAnim* owner;
	ImodAnimAsynLoadItem(){}
	ImodAnimAsynLoadItem(ImodAnim* owner_, int idx_, const char* utfPic_, const std::function<void(Texture2D*, int, const char*)>& callback_);
	~ImodAnimAsynLoadItem();
	void trigCallback(Texture2D* tex_);
};

class ImodAnimAsynLoadMgr
{
public:
	static const int ASYNLOAD_MAXSIZE = 300; //异步加载最大上限，超过就改为同步
	static const int ASYNLOAD_MAXMILLISEC = 5000; //x豪秒内异步加载不回包主动丢弃回调

private:
	std::list<ImodAnimAsynLoadItem> loadItems;
	std::mutex loadItems_mutex;
public:

	std::function<void(Texture2D*)> AsynCallback;
public:
	ImodAnimAsynLoadMgr();
	~ImodAnimAsynLoadMgr();

	static ImodAnimAsynLoadMgr* getInstance();
	void deleteByImodeAnim(ImodAnim* target);
	void push_back(ImodAnimAsynLoadItem item);
	void recvTexByPath(Texture2D* tex_);
	bool isAsynPoolFull(){ return loadItems.size() >= ASYNLOAD_MAXSIZE; }
	void clearOvertimeLoads();
};

#endif