#include "ImodAnim.h"
#include "ark_typedef.h"
#include "ark_Stream.h"
#include "ark_Utility.h"

#include "scripting/lua-bindings/manual/cocos2d/LuaScriptHandlerMgr.h"

//////////////////////////////////////////////////////////////////////////
static GLProgramState*				_GBlendglprogramstate = nullptr;

ImodAnim::ImodAnim()
{
	m_nScriptEndCBHandler = 1;
	_Opacity = 255;
	_FrameEndTarget = NULL;
	_FrameTarget = NULL;
	_FrameEndCB = NULL;
	_FrameCB = NULL;
	_FramesNum = 0;
	_ActionsNum = 0;
	_aniNum = 0;
	for(int i = 0;i < ANI_MAX_COUNT;i ++)
    {
		_Ticker[i] = 0;
		_CurFrame[i] = 0;
		_CurAction[i] = 0;
		_hsvVec3s[i] = {0,0,0};
		_shaderModes[i] = ShaderMode::ShaderMode_None;
	}
	_IsNeedDraw = false;
	_IsNeedCircle = false;
	_IsFlipX = false;
	_IsFilpY = false;
	_IsGhost = false;
	_GhostDurTime = 100.0f;
	_SpriteColor = Color3B(255,255,255);
	_MaxHeight = 100;

	//---------------------------------------------
	extFrameDurtionTime = 0.1;
	//重置动画的额外数据
	this->extTxtOptInit();
	//---------------------------------------------

	//_Blendglprogramstate = nullptr;
	//_HSLglprogramstate = nullptr;
	_FrameCBIdx = -1;
	//异步加载相关
	isNeedImageAsyncLoad = false;
}

void ImodAnim::setOpacity(int Opacity)
{
	_Opacity = Opacity;
	for(size_t i = 0 ;i < this->getChildrenCount();i ++)
    {
        if(Sprite* spr = dynamic_cast<Sprite*>(this->getChildren().at(i)))
		    spr->setOpacity(Opacity);
    }
}

void ImodAnim::resetAniData(bool clearSpr)
{
	//删除旧多层动画	
	if (clearSpr)
		clearAniSprite();

	unscheduleAllCallbacks();
	_FrameCBIdx = -1;
	_FramesNum = 0;
	_ActionsNum = 0;
	_aniNum = 0;
	_IsNeedDraw = false;
	_IsNeedCircle = false;
	_IsFlipX  = false;
	_IsFilpY = false;
	_MaxHeight = 100;
	this->_IsGhost = false;
	this->_GhostDurTime = 100.0f;

	//---------------------------------------------
	extFrameDurtionTime = 0.1;
	//重置动画的额外数据
	this->extTxtOptInit();
	//---------------------------------------------

	for(int i = 0;i < ANI_MAX_COUNT;i ++)
    {
		_Ticker[i] = 0;
		_CurFrame[i] = 0;
		_CurAction[i] = 0;
		for (int j = 0; j < (int)_VecModules[i].size(); j++)
		{
			ModuleOpt &module = _VecModules[i][j];
			if (module.frame)
			{
				module.frame->release();
			}
		}
		_VecModules[i].clear();
		_VecSpritesOpt[i].clear();
		_VecActions[i].clear();
        _ActionZorders[i] = 0;
		_ActionColors[i] = Color3B::WHITE;
	}
	
	registerScriptEndCBHandler(1);
}

bool ImodAnim::init()
{
	Node::init();
	return true;
}

void ImodAnim::playFirstFrameIndex(int actionIdx)
{
    if(actionIdx >= _ActionsNum)
		return;
	
	_IsNeedCircle = false;
	_IsNeedDraw = true;
	for(int i = 0;i < _aniNum;i ++)
    {
		_CurAction[i] = actionIdx;
		if(_VecActions[i].size() > 0)
			_CurFrame[i] = _VecActions[i][actionIdx].frames[0];
		else
			break;
	}

	clearAniSprite();
	
    for(int j = 0;j < _aniNum;j ++)
    {
		createAniSprite(j, _CurFrame[j]);
	}
}

void ImodAnim::ChangeZorderByIndex(const char *aniName, int zOrder)
{
	int ind = -1;
	for (int i = 0; i < _aniNum; i++)
	{
		if (_VecPic[i].compare(0, strlen(aniName), aniName) == 0)
		{
			ind = i;
			break;
		}
	}
	if (ind >= 0)
		ChangeZorderByIndex(ind,zOrder);
}

void ImodAnim::ChangeZorderByIndex(int index, int zOrder)
{
    if(index >=0 && index < ANI_MAX_COUNT)
		_ActionZorders[index] = zOrder;
}


int ImodAnim::addAnimWithName(const char * utfPic, const char * utfAnim, int Zorder, Color3B color)
{
	//找到最近的存放动画的位置
	int idx = -1;
	if (_aniNum >= m_max_ani)
	{
		log("addAnimWithName:over size");
		return -1;
	}
	idx = _aniNum;
	_VecPic[idx] = utfAnim;

	Texture2D* tex = nullptr;
	//Texture2D* tex=TextureCache::getInstance()->addImage(utfPic);
	//异步加载资源回调
	auto imageLoadCallback = [=, &tex](Texture2D* tex_, int idx_, const char* utfPic_)->void
	{
		tex = tex_;
		std::string path_ = tex_->getPath();
		log("recvTexByPath3:%s,%d", path_.c_str(),idx_);
		for (auto& module : _VecModules[idx_])
		{
			module.frame = SpriteFrame::createWithTexture(tex_, Rect(module.sx, module.sy, module.w, module.h));
			module.frame->retain();
		}

	};
	
	//这块异步相关代码需要清理
	if (isNeedImageAsyncLoad)
	{	
		//mode1,弃用
		/*ImodAnimAsynLoadItem* _AsynLoadItem = new ImodAnimAsynLoadItem(this,idx, utfPic, imageLoadCallback);
		_AsynLoadItems.push_back(_AsynLoadItem);
		TextureCache::getInstance()->addImageAsync(utfPic, _AsynLoadItem->AsynCallback);
		log("new ImodAnimAsynLoadItem:%d,%s", _AsynLoadItem->idx, _AsynLoadItem->utfPic.c_str());*/

		//mode2
		std::string tpath = transPathFormat(utfPic);    //转后后缀，mydp为png
		Texture2D* texture = TextureCache::getInstance()->getTextureForKey(tpath);
		if (texture) //已加载
		{
			tex = texture;
		}
		else
		{
			//未加载,判断是否达到上限，太多异步加载就转为同步
			if (ImodAnimAsynLoadMgr::getInstance()->isAsynPoolFull())
			{
				tex = TextureCache::getInstance()->addImage(utfPic);
			}
			else
			{
				//未加载,启动异步加载
				ImodAnimAsynLoadItem _AsynLoadItem(this, idx, utfPic, imageLoadCallback);
				ImodAnimAsynLoadMgr::getInstance()->push_back(std::move(_AsynLoadItem));
				TextureCache::getInstance()->addImageAsync(utfPic, ImodAnimAsynLoadMgr::getInstance()->AsynCallback);
				log("new ImodAnimAsynLoadItem:%d,%s", _AsynLoadItem.idx, _AsynLoadItem.utfPic.c_str());
			}
		}
	}
	else
	{
		tex = TextureCache::getInstance()->addImage(utfPic);
	}
	
	//读取动画文件并解析
	string pathAnim = FileUtils::getInstance()->fullPathForFilename(utfAnim);
	ssize_t size = 1000;
	ark_byte *fileBuf = FileUtils::getInstance()->getFileData(pathAnim.c_str(), "rb", &size);
	if (fileBuf == NULL)
	{
		log("fileBuf == NULL, aniname =%s,pngname = %s", pathAnim.c_str(), utfPic);
		return -1;
	}

	_aniNum++;

	/*
	string moduleName = utfPic;
	int off = moduleName.find(".mydp", 0);
	if (off > 0){
		moduleName = moduleName.substr(0, off);
	}
	*/

	//读取动画的额外数据 begin-------------------------------
	int off_txt = pathAnim.find(".ani", 0);
	string pathTxt = ""; 
	if (off_txt > 0){
		pathTxt = pathAnim.substr(0, off_txt) + ".dat";
	}
	ssize_t sizeTxt = 1000;
	ark_byte *fileTxt = FileUtils::getInstance()->getFileData(pathTxt.c_str(), "rb", &sizeTxt);

	 //重置动画的额外数据
	this->extTxtOptInit();

	extTxtVec.txtPath = pathTxt;

	if (fileTxt == NULL){
#if(CC_TARGET_PLATFORM == CC_PLATFORM_WIN32 )

#endif
	}
	else{
		ark_Stream txtStream;
		txtStream.CreateWriteStream((void*)fileTxt, sizeTxt, true);

		extTxtVec.durTime = (float)txtStream.ReadUInt()/1000;   //动画播放时间（保存为毫秒数）
		extFrameDurtionTime = extTxtVec.durTime;   //动画播放帧间隔时间
		extTxtVec.size = txtStream.ReadByte();    //额外复用的帧总数量
		//-------------------------------------
		if (extTxtVec.size > 0){
			_DurationTime = extFrameDurtionTime;
		}
		//-------------------------------------

		for (int i = 0; i < extTxtVec.size; i++){
			short idx = txtStream.ReadShort();       //额外复用的帧索引（从小到大依次排序）
			short times = txtStream.ReadShort();    //额外复用的帧索引对应的帧重复次数

			extTxtVec.frameIdx.push_back(idx);
			extTxtVec.times.push_back(times);
		}
	}
	//读取动画的额外数据 end-------------------------------

	//创建一个自动释放内存流
	ark_Stream aniStream;
	aniStream.CreateWriteStream((void*)fileBuf, size, true);

	ModuleOpt module;
	//读取模块数据（帧图片数据，每帧两幅图片）
	int moduleNum = aniStream.ReadByte();

	_VecModules[idx].clear();
	for (int i = 0; i < moduleNum; i++)
	{
		module.sx = aniStream.ReadShort();
		module.sy = aniStream.ReadShort();
		module.w = aniStream.ReadShort();
		module.h = aniStream.ReadShort();
		if (tex)
		{
			module.frame = SpriteFrame::createWithTexture(tex, Rect(module.sx, module.sy, module.w, module.h));
			module.frame->retain();
		}
		_VecModules[idx].push_back(module);
	}

	//读取帧数据
	_VecSpritesOpt[idx].clear();
	int frameNum = aniStream.ReadByte();
	_FramesNum = frameNum;

	for (int i = 0; i < frameNum; i++)
	{
		int moduleLen = aniStream.ReadByte();
		SpriteOpt sp;

		sp.size = moduleLen;
		assert(moduleLen < 2);
		for (int c = 0; c < moduleLen; c++)
		{
			sp.sx[c] = aniStream.ReadShort();
			sp.sy[c] = aniStream.ReadShort();
			sp.module_id[c] = aniStream.ReadByte();
			sp.flag[c] = aniStream.ReadByte();
		}
		_VecSpritesOpt[idx].push_back(sp);

	}
	
	//读取动作数据
	_VecActions[idx].clear();
	int actionNum = aniStream.ReadByte();
	_ActionsNum = actionNum;
	for (int i = 0; i < actionNum; i++)
	{
		int extFrameIdx = 0;   //额外复用的帧下次待插入帧动画数据的帧索引在extTxtVec.frameIdx中的索引

		int len = aniStream.ReadByte();
		ActionOpt ma;   //单个方向的动作帧序列

		ma.size = len;
		for (int c = 0; c < len; c++)
		{
			char frame = aniStream.ReadByte();
			char duration = aniStream.ReadByte();
			ma.frames.push_back(frame);
			ma.durations.push_back(duration);

			//---------------------------------------------
			if (extTxtVec.size >0 && extFrameIdx < size && extFrameIdx < extTxtVec.frameIdx.size()){
				int txtFrameIdx = extTxtVec.frameIdx[extFrameIdx];  //额外复用的帧下次待插入帧动画数据的帧索引
				if (txtFrameIdx == frame) {   //存在额外重复帧数据，且当前帧即为重复帧，则插入数据
					int counts = extTxtVec.times[extFrameIdx];
					ma.size += counts;
					for (int j = 0; j < counts; j++){
						ma.frames.push_back(frame);
						ma.durations.push_back(duration);
					}
					extFrameIdx++;
				}
			}
			//---------------------------------------------
		}
		_VecActions[idx].push_back(ma);   //可能包含多个方向
	}

	//初始一个自己的Zorder
	_ActionZorders[idx] = Zorder;
	//初始自己的混合色
	_ActionColors[idx] = color;

	_CurAction[idx] = _CurAction[0];
	_Ticker[idx] = _Ticker[0];

	//本体和附加特效切片帧数不统一时需进行匹配操作
	int ind = -1;
	for (int i = 0; i < _VecActions[0][_CurAction[0]].size; i++)
	{
		if (_CurFrame[0] == _VecActions[0][_CurAction[0]].frames[i])
		{
			ind = i;
			break;
		}
	}
	if (ind == -1)
	{
		log("addAnimWithName:error"); //不可能发生
		ind = 0;
	}
	ind = ind % _VecActions[idx][_CurAction[idx]].size;
	_CurFrame[idx] = _VecActions[idx][_CurAction[idx]].frames[ind];

	return idx;
}

//---------------------------------------------
void ImodAnim::extTxtOptInit()
{
	//重置动画的额外数据
	extTxtVec.txtPath = "";
	extTxtVec.durTime = 0.1;  //默认值
	extTxtVec.size = 0;
	extTxtVec.frameIdx.clear();
	extTxtVec.times.clear();
}

void ImodAnim::setExtFrameData(string &txtFullPath, vector<int> &frameVec, vector<int> &timeVec, int time_ms)
{
#if(CC_TARGET_PLATFORM == CC_PLATFORM_WIN32 )
	string pathTxt = txtFullPath;
	if (pathTxt.size() == 0){
		return;
	}

	char size = (char)frameVec.size();
	int sizeTxt = 1000;  // size * 2 + 5 + 4;
	//ark_byte *fileTxt = FileUtils::getInstance()->getFileData(pathTxt.c_str(), "wb", &sizeTxt);

	ark_Stream txtStream;
	char* fileTxt = new char[sizeTxt];   //maxlen
	txtStream.CreateWriteStream((void*)fileTxt, sizeTxt, true);

	txtStream.WriteUInt(time_ms);   //动画播放时间（保存为毫秒数）
	
	txtStream.WriteByte(size);    //额外复用的帧总数量

	for (int i = 0; i < size; i++){
		txtStream.WriteWord(frameVec[i]);       //额外复用的帧索引（从小到大依次排序）
		txtStream.WriteWord(timeVec[i]);    //额外复用的帧索引对应的帧重复次数
	}

	Data data;
	data.fastSet((unsigned char*)txtStream.GetBuffer(), txtStream.GetSize());

	FileUtils::getInstance()->writeDataToFile(data, pathTxt);
	//log("fileTxt  has write, fileTxt =%s", pathTxt.c_str());

	data.fastSet(nullptr, 0);
#endif
}

//---------------------------------------------

void ImodAnim::removeAnim(int ind)
{
	clearAniSprite(ind);

	for (int j = 0; j < (int)_VecModules[ind].size(); j++)
	{
		ModuleOpt &module = _VecModules[ind][j];
		if (module.frame)
		{
			module.frame->release();
		}
		
	}
	_VecModules[ind].clear();
	for (int i = ind; i < _aniNum - 1; i++)
	{
		_VecPic[i] = _VecPic[i + 1];
		_VecModules[i] = _VecModules[i + 1];
		_VecSpritesOpt[i] = _VecSpritesOpt[i + 1];
		_VecActions[i] = _VecActions[i + 1];
		_ActionZorders[i] = _ActionZorders[i+1];
		_ActionColors[i] = _ActionColors[i+1];
	}
	_VecModules[_aniNum - 1].clear();
	_aniNum--;
}

void ImodAnim::removeAnim(const char *aniName)
{
	int ind = -1;
	for (int i = 0; i < _aniNum; i++)
	{
		if (_VecPic[i].compare(0, strlen(aniName), aniName) == 0)
		{
			ind = i;
			break;
		}
	}
	if (ind >= 0)
		removeAnim(ind);
}

void ImodAnim::initAnimWithName(const char * utfPic, const char * utfAnim, bool clearSpr)
{
	resetAniData(clearSpr);
	addAnimWithName(utfPic, utfAnim, 1);
}

void ImodAnim::initAnimWithName(const string& utfPic, const string& utfAnim)
{
    addAnimWithName(utfPic.c_str(), utfAnim.c_str());
}

void ImodAnim::initAnimWithName(const string& utfFile, const char* picExt, const char* aniExt)
{
	string utfPic = utfFile, utfAni = utfFile;
    initAnimWithName(utfPic.append(picExt).c_str(), utfAni.append(aniExt).c_str());
}

ImodAnim::~ImodAnim()
{
	this->resetAniData();
	unscheduleAllCallbacks();
	ScriptHandlerMgr::getInstance()->removeObjectAllHandlers(this);

	ImodAnimAsynLoadMgr::getInstance()->deleteByImodeAnim(this);
}

void ImodAnim::PlayAction(int actIndex, float durTime, bool isGhost, float ghostDurTime, bool runTimerNow)
{
	this->_IsGhost = isGhost;
	this->_GhostDurTime = ghostDurTime;

    if(actIndex >= _ActionsNum)
		return;
	
	for(int i = 0; i < ANI_MAX_COUNT; i++)
    {
		_CurAction[i] = actIndex;
		if(_VecActions[i].size() > 0)
			_CurFrame[i] = _VecActions[i][actIndex].frames[0];
		else 
			break;
	}
	_IsNeedCircle = false;
	_IsNeedDraw = true;
	_DurationTime = durTime;
	//---------------------------------------------
	if (extTxtVec.size > 0){
		_DurationTime = extFrameDurtionTime;
	}
	//---------------------------------------------
	this->unschedule(schedule_selector(ImodAnim::OnAnimateUpdate));
	this->schedule(schedule_selector(ImodAnim::OnAnimateUpdate), _DurationTime);
	if (runTimerNow)
	{
		OnAnimateUpdate(_DurationTime);
	}
}

void ImodAnim::setFlippedX(bool flip)
{
	_IsFlipX = flip;
}
void ImodAnim::setFlippedY(bool flip)
{
	_IsFilpY = flip;
}

void ImodAnim::clearAniSprite(int startIdx)
{
	for (int j=startIdx; j < _aniNum; j++)
		this->removeChildByTag(111 + j);
}

void ImodAnim::createAniSprite(int animateIdx, int frameIdx)
{
	if (animateIdx >= _aniNum)
		return;

	SpriteOpt &frame = _VecSpritesOpt[animateIdx][frameIdx];
	int size = frame.size;
	_shaderMode = _shaderModes[animateIdx];
	_hsvVec3 = _hsvVec3s[animateIdx];
	for (int i = 0; i < size; i++)
	{
		int sx = frame.sx[i];
		int sy = frame.sy[i];
		int flag = frame.flag[i];

		const int mid = frame.module_id[i];
		ModuleOpt &module = _VecModules[animateIdx][mid];
		Sprite* sp = (Sprite *)this->getChildByTag(111 + animateIdx);
		if (!sp)
		{
			if (module.frame)
			{
				sp = Sprite::createWithSpriteFrame(module.frame); 
			}
			else
			{
				continue; //没有资源直接中断
			}
			sp->setTag(111 + animateIdx);
			sp->setOpacity(_Opacity);
			sp->setColor(_ActionColors[animateIdx]);
			this->addChild(sp, _ActionZorders[animateIdx]);
			_originBlendFunc = sp->getBlendFunc();
			_originGLPState = sp->getGLProgramState();
		}
		else
		{
			sp->setLocalZOrder(_ActionZorders[animateIdx]);
			if (module.frame)
			{
				sp->setSpriteFrame(module.frame);
			}
			else
			{
				log("null2 module.frame:%d,%d,%d", animateIdx, i,mid);
			}
		}
		sp->setVisible(true);
		//test
		//origin:GL_ONE, GL_ONE_MINUS_SRC_ALPHA
		if (_shaderMode == ShaderMode_Blend) //blend模式 目前没使用过
		{
			//{ GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA }
			sp->setBlendFunc(BlendFunc::ALPHA_NON_PREMULTIPLIED); //GL_ZERO,GL_ONE_MINUS_SRC_ALPHA
			if (!_GBlendglprogramstate)
			{
				_GBlendglprogramstate = GLProgramState::getOrCreateWithGLProgram(GLProgram::createWithFilenames("Shaders/BasicTexture.vsh", "Shaders/BlendTexture.fsh"));
			}
			if (!_Blendglprogramstate)
			{
				_Blendglprogramstate = _GBlendglprogramstate->clone();
			}
			sp->setGLProgramState(_Blendglprogramstate);
			_Blendglprogramstate->setUniformVec4("color2", Vec4(_blendColor.r, _blendColor.g, _blendColor.b, _blendColor.a)); //CCRANDOM_0_1()
		}
		else if (_shaderMode == ShaderMode_HSV)
		{
			if (!_HSLglprogramstate) //克隆自_GHSLglprogramstate
			{
				_HSLglprogramstate = SystemHelper::getHSLGlprogramState()->clone();
				//_HSLglprogramstate = _GHSLglprogramstate->clone(); //改成从ObjectHelper获取单例
			}
			if (sp->getBlendFunc() != BlendFunc::ALPHA_NON_PREMULTIPLIED)
			{
				//GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA，采用这种混合模式，使用与半透明图片混合
				sp->setBlendFunc(BlendFunc::ALPHA_NON_PREMULTIPLIED); //GL_ZERO,GL_ONE_MINUS_SRC_ALPHA
				sp->setGLProgramState(_HSLglprogramstate);
			}
			_HSLglprogramstate->setUniformFloat("u_dH", _hsvVec3.x); //_hsvVec3.x
			_HSLglprogramstate->setUniformFloat("u_dS", _hsvVec3.y);
			_HSLglprogramstate->setUniformFloat("u_dL", _hsvVec3.z);
		}
		else
		{
			sp->setBlendFunc(_originBlendFunc); //GL_ZERO,GL_ONE_MINUS_SRC_ALPHA
			sp->setGLProgramState(_originGLPState);
		}

		float org_x = sx + (module.w / 2.0);
		if (_IsFlipX)
			org_x = -org_x;

		float org_y = -sy - (module.h / 2.0);
		if (_IsFilpY)
			org_y = -org_y;

		int offsetX = 0;
		int offsetY = 0;
		if ((flag & FLIP_X) != 0)
		{
			if ((flag & ROTATE_90) != 0)
				offsetX = -(offsetX + module.h);
			else
				offsetX = -(offsetX + module.w);
		}

		if ((flag & FLIP_Y) != 0)
		{
			if ((flag & ROTATE_90) != 0)
				offsetY = -(offsetY + module.w);
			else
				offsetY = -(offsetY + module.h);
		}
		sp->setPosition(Vec2(org_x + offsetX, org_y + offsetY));
		sp->setFlippedX(_IsFlipX);
		sp->setFlippedY(_IsFilpY);

		int height = sp->getContentSize().height;
		if (height>_MaxHeight)
			_MaxHeight = height;
	}
}

void ImodAnim::doFrameCallback(int curFrame)
{
	if (curFrame-1 == _FrameCBIdx && _FrameTarget && _FrameCB)
	{
		(this->_FrameTarget->*(_FrameCB))(this);
		_FrameTarget = NULL;
		_FrameCB = NULL;
	}
	if ((kScriptTypeNone != _scriptType) && curFrame - 1 == _FrameCBIdx)
	{
		_FrameCBIdx = -1;
		executeFrameCBScript();
	}
}

void ImodAnim::doEndCallback(bool retain)
{
	if (_FrameEndTarget && _FrameEndCB)
	{
		this->_IsGhost = false;
		(this->_FrameEndTarget->*(_FrameEndCB))(this);

		//释放回调
		if (retain == false)
		{
			_FrameEndTarget = NULL;
			_FrameEndCB = NULL;
		}
	}
	if ((kScriptTypeNone != _scriptType) && (m_nScriptEndCBHandler != 0))
	{
		this->_IsGhost = false;
		executeEndCBScript();
		//释放回调
		if (retain == false)
		{
			m_nScriptEndCBHandler = 0;
		}
	}
}

void ImodAnim::OnAnimateUpdate(float dt)
{
	if(_IsNeedDraw)
	{
        for(int j = 0;j < _aniNum;j ++)
        {
			createAniSprite(j, _CurFrame[j]);

 			_Ticker[j]++;

			//指定帧回调
			doFrameCallback(_Ticker[j]);

			{
				int ticker2 = _Ticker[j];
				ActionOpt &action = _VecActions[j][_CurAction[j]];
				int frameNum = action.size;
				if(ticker2 == frameNum)
				{ 
					if(_IsNeedCircle)//如果是循环播放则从头开始否则停止并执行回调
					{
						_Ticker[j] = 0;
						_CurFrame[j] = action.frames[0];
					}
					else
					{
						unschedule(schedule_selector(ImodAnim::OnAnimateUpdate));
						_Ticker[j] = 0;
						
						//执行回调并保留
						doEndCallback(true);
					}
				}
				else
				{
					if (ticker2 + 1 <= (int)action.frames.size())
						_CurFrame[j] = action.frames[ticker2];
					else
					{
						unschedule(schedule_selector(ImodAnim::OnAnimateUpdate));
						_Ticker[j] = 0;

                        //执行回调并删除
						doEndCallback();
					}
				}
			}
		}
	}
}

void ImodAnim::SetCurrentAction(int actIndex)
{
	for (int i = 0; i < _aniNum; i++)
	{
		_CurAction[i] = actIndex;
		_CurFrame[i] = _VecActions[i][actIndex].frames[0];
		_Ticker[i] = 0;
	}
	OnAnimateUpdate(0.0f);
}

void ImodAnim::PlayActionRepeat(int actIndex, float durTime, bool runTimerNow)
{
	this->_IsGhost = false;
	this->_GhostDurTime = 100.0f;

	if(actIndex >= _ActionsNum)
		return;

	_IsNeedCircle = true;
	_IsNeedDraw = true;
	_DurationTime = durTime;
	//-------------------------------------
	if (extTxtVec.size > 0){
		_DurationTime = extFrameDurtionTime;
	}
	//-------------------------------------
	SetCurrentAction(actIndex);

    this->unschedule(schedule_selector(ImodAnim::OnAnimateUpdate));
	this->schedule(schedule_selector(ImodAnim::OnAnimateUpdate), _DurationTime);
    
    //如果立即执行，则调用
    if(runTimerNow)
        OnAnimateUpdate(0.0f);
}

void ImodAnim::stop()
{
	unscheduleAllCallbacks();
}

void ImodAnim::resume()
{
	Node::resume();
	
}

void ImodAnim::onEnter()
{
	Node::onEnter();
	//this->unschedule(schedule_selector(ImodAnim::OnAnimateUpdate));
	//schedule(schedule_selector(ImodAnim::OnAnimateUpdate), _DurationTime);
}
void ImodAnim::stopCurrentAni()
{
	unscheduleAllCallbacks();
	
	for (int j = 0; j < _aniNum; j++)
    {
		createAniSprite(j, 0);

		_Ticker[j]++;
		
        {
			int ticker2 = _Ticker[j];

			ActionOpt& action = _VecActions[j][0];
			int frameNum = action.size;
			if(ticker2 == frameNum)
			{ 
				if(_IsNeedCircle)
				{
					_Ticker[j] = 0;
					_CurFrame[j] = action.frames[0];
				}
				else
				{
					_Ticker[j]--;
				}
			}
			else
			{
				_CurFrame[j] = action.frames[ticker2];
			}
		}
	}
}

void ImodAnim::setGhost(bool isGhost,float ghostDurTime)
{
	if(this->_IsGhost == isGhost)
		return;

    this->_IsGhost = isGhost;
	this->_GhostDurTime = ghostDurTime;
	
    if(isGhost)
    {
		this->schedule((SEL_SCHEDULE)&ImodAnim::OnGhostUpdate);
		OnGhostUpdate(0.05f);
	}
	else
		this->unschedule((SEL_SCHEDULE)&ImodAnim::OnGhostUpdate);
}

void ImodAnim::OnGhostEndCallBack(Node* pSender)
{
	pSender->removeFromParent();
}

void ImodAnim::OnGhostUpdate(float dt)
{
	//判断是否加入残影
	if(this->_IsGhost && this->getParent())
    {
		for(int i = 0; this->getChildByTag(111 + i); i++)
        {
			Sprite* thSpr = (Sprite*)this->getChildByTag(111 + i);
			Sprite* ghostSpr = Sprite::createWithTexture(thSpr->getTexture());
			ghostSpr->setPosition(Vec2(this->getParent()->getPosition().x + thSpr->getPositionX(),this->getParent()->getPosition().y + thSpr->getPositionY()));
			ghostSpr->setTextureRect(thSpr->getTextureRect());
			ghostSpr->setColor(Color3B(155,155,155));
			ghostSpr->setFlippedX(_IsFlipX);
			ghostSpr->setFlippedY(_IsFilpY);
			ghostSpr->setScale(this->getScale());
			CallFuncN *CallBack = CallFuncN::create(CC_CALLBACK_1(ImodAnim::OnGhostEndCallBack, this));
			ghostSpr->runAction(Sequence::create(FadeTo::create(_GhostDurTime,0),CallBack,NULL));
			this->getParent()->getParent()->addChild(ghostSpr, this->getLocalZOrder() - 1);
		}
	}
    else
    {
		this->_IsGhost = false;
		this->unschedule((SEL_SCHEDULE)&ImodAnim::OnGhostUpdate);
	}
}

bool ImodAnim::getNeedImageAsyncLoad()
{
	return isNeedImageAsyncLoad;
}

void ImodAnim::setNeedImageAsyncLoad(bool bNeed)
{
	isNeedImageAsyncLoad = bNeed;
}

void ImodAnim::setColor(Color3B color)
{
    _SpriteColor = color;

    //覆盖所有动作的颜色
    for (size_t i=0; i<ANI_MAX_COUNT; i++)
        _ActionColors[i] = color;
}

void ImodAnim::registerScriptEndCBHandler(int nHandler)
{
    unregisterScriptEndCBHandler();
    m_nScriptEndCBHandler = nHandler;
    LUALOG("[LUA] Add ImodAnim script handler: %d", m_nScriptEndCBHandler);
}

void ImodAnim::unregisterScriptEndCBHandler(void)
{
	//temp note
    if (m_nScriptEndCBHandler)
    {
        ScriptEngineManager::getInstance()->getScriptEngine()->removeScriptHandler(m_nScriptEndCBHandler);
        LUALOG("[LUA] Remove ImodAnim script handler: %d", m_nScriptEndCBHandler);
        m_nScriptEndCBHandler = 0;
    }
}

void ImodAnim::executeEndCBScript()
{
	//temp note
	int nHandler = m_nScriptEndCBHandler;
    if (0 == m_nScriptEndCBHandler) return;
    //LuaMgr::GetInstance()->executeHandler(nHandler);

	LuaScriptData data(this, "ImodAnim");
	data.push("string", (void*)"end");
	ScriptEvent scriptEvent(kCustomLuaEvent, &data);
	ScriptEngineManager::getInstance()->getScriptEngine()->sendEvent(&scriptEvent);
}

void ImodAnim::executeFrameCBScript()
{
	LuaScriptData data(this, "ImodAnim");
	data.push("string", (void*)"frame");
	ScriptEvent scriptEvent(kCustomLuaEvent, &data);
	ScriptEngineManager::getInstance()->getScriptEngine()->sendEvent(&scriptEvent);
}

void ImodAnim::printAnimZorder()
{
	log("_ActionZorders:_%d_%d_%d_%d_%d",_ActionZorders[0],_ActionZorders[1],_ActionZorders[2],_ActionZorders[3],_ActionZorders[4]);
}

void ImodAnim::setBlendColor(Color4F color)
{
	_isBlend = true;
	_shaderMode = ShaderMode::ShaderMode_Blend;
	_blendColor = Color4F(color);
}

void ImodAnim::sethsv(Vec3 vec3)
{
	//转换ps值到（360，1，1）
	float h = vec3.x;
	float s = (vec3.y)/100;
	float v = (vec3.z)/100;
	if (vec3.isZero())
	{
		for (auto _hsvVec3 : _hsvVec3s)
		{
			_hsvVec3 = Vec3(0,0,0);
		}
		for (auto _shaderMode : _shaderModes)
		{
			_shaderMode = ShaderMode::ShaderMode_None;
		}
	}
	else
	{
		//没有指定index,全部设置shader
		for (auto _hsvVec3 : _hsvVec3s)
		{
			_hsvVec3 = Vec3(h, s, v);
		}
		for (auto _shaderMode : _shaderModes)
		{
			_shaderMode = ShaderMode::ShaderMode_HSV;
		}
	}
}

void ImodAnim::sethsvByIndex(int idx, Vec3 vec3)
{
	//转换ps值到（360，1，1）
	float h = vec3.x;
	float s = (vec3.y) / 100;
	float v = (vec3.z) / 100;
	if (vec3.isZero())
	{
		_shaderModes[idx] = ShaderMode::ShaderMode_None;
		_hsvVec3s[idx] = Vec3(0, 0, 0);
	}
	else
	{
		_hsvVec3s[idx] = Vec3(h, s, v);
		_shaderModes[idx] = ShaderMode::ShaderMode_HSV;
	}
	
}

void ImodAnim::setMaxAniNum(int value)
{
	m_max_ani = value;
}

/////////////////////////////////////////////////////////////ImodAnimAsynLoadItem//////////////////////////////////////////////////
ImodAnimAsynLoadItem::ImodAnimAsynLoadItem(ImodAnim* owner_, int idx_, const char* utfPic_, const std::function<void(Texture2D*, int, const char*)>& callback_)
{
	owner = owner_;
	callback = callback_;
	utfPic = utfPic_;
	idx = idx_;
	picName = utfPic_;
	//picName 只截取名字去掉后缀
	int off = picName.find(".mydp", 0);
	if (off != std::string::npos && off > 0){
		picName = picName.substr(0, off);
		//picName.append(PngFileExtension); // .png  .mydp
	}
	else
	{
		off = picName.find(".png", 0);
		if (off != std::string::npos && off > 0){
			picName = picName.substr(0, off);
			//picName.append(PngFileExtension); // .png  .mydp
		}
	}
	starttime = SystemHelper::GetCurTick();
	AsynCallback = [=](Texture2D* tex_)->void
	{
		//多线程同步
		cocos2d::Director::getInstance()->getScheduler()->performFunctionInCocosThread([=]
		{
			if (callback && utfPic.size() > 0)
			{

				callback(tex_, idx, utfPic.c_str());
			}
			else{
				log("error ImodAnimAsynLoadItem callback:%d", idx); //, utfPic.c_str()
			}
		});
	};
}

ImodAnimAsynLoadItem::~ImodAnimAsynLoadItem()
{
	owner = nullptr;
	callback = nullptr;
	utfPic = "";
	idx = -1;
	AsynCallback = nullptr;
}
void ImodAnimAsynLoadItem::trigCallback(Texture2D* tex_)
{
	if (callback && utfPic.size() > 0)
	{

		callback(tex_, idx, utfPic.c_str());
	}
	else{
		log("error ImodAnimAsynLoadItem callback:%d,%s", idx, utfPic.c_str());
	}
}

/////////////////////////////////////////////////////////////ImodAnimAsynLoadMgr//////////////////////////////////////////////////
static ImodAnimAsynLoadMgr* ImodAnimAsynLoadMgr_instance = nullptr;
ImodAnimAsynLoadMgr::ImodAnimAsynLoadMgr()
{
	AsynCallback = [=](Texture2D* tex_)->void
	{
		if (tex_)
		{
			std::string path_ = tex_->getPath();
			//log("recvTexByPath1:%s", path_.c_str());
			//多线程同步
			cocos2d::Director::getInstance()->getScheduler()->performFunctionInCocosThread([=]
			{
				recvTexByPath(tex_);
			});
		}
	};
}
ImodAnimAsynLoadMgr::~ImodAnimAsynLoadMgr()
{
	loadItems.clear();
	if (ImodAnimAsynLoadMgr_instance)
	{
		delete ImodAnimAsynLoadMgr_instance;
		ImodAnimAsynLoadMgr_instance = nullptr;
	}
}

ImodAnimAsynLoadMgr* ImodAnimAsynLoadMgr::getInstance()
{
	if (!ImodAnimAsynLoadMgr_instance)
	{
		ImodAnimAsynLoadMgr_instance = new ImodAnimAsynLoadMgr();
	}
	return ImodAnimAsynLoadMgr_instance;
}

//性能有问题，loadItems可能会很大
void ImodAnimAsynLoadMgr::deleteByImodeAnim(ImodAnim* target)
{
	//loadItems_mutex.lock();
	for (std::list<ImodAnimAsynLoadItem>::iterator iter = loadItems.begin(); iter != loadItems.end();)
	{
		if ((*iter).owner == target)
		{
			iter = loadItems.erase(iter);
		}
		else
		{
			iter++;
		}
	}
	//loadItems_mutex.unlock();
	//log("ImodAnimAsynLoadMgr::deleteByImodeAnim size:%d", loadItems.size());
}

void ImodAnimAsynLoadMgr::push_back(ImodAnimAsynLoadItem item)
{
	//loadItems_mutex.lock();
	loadItems.push_back(item);
	//loadItems_mutex.unlock();
	//log("ImodAnimAsynLoadMgr::push_back size:%d", loadItems.size());
	//判断是否清理
	if (loadItems.size() >= ASYNLOAD_MAXSIZE) //太多异步加载了，判断是不是有太多废加载(找不到资源，根本无法回调)
	{
		clearOvertimeLoads();
	}
}

void ImodAnimAsynLoadMgr::clearOvertimeLoads()
{
	for (std::list<ImodAnimAsynLoadItem>::iterator iter = loadItems.begin(); iter != loadItems.end();)
	{
		double pasttime = SystemHelper::GetCurTick() - (*iter).starttime;
		if (pasttime >= ASYNLOAD_MAXMILLISEC) //超过n秒认为超时
		{
			iter = loadItems.erase(iter); //异步加载超时了
			log("clearOvertimeLoads tomuch time :%f", pasttime);
		}
		else
		{
			iter++;
		}
	}
}

void ImodAnimAsynLoadMgr::recvTexByPath(Texture2D* tex_)
{
	//loadItems_mutex.lock();
	std::string path_ = tex_->getPath();

	for (std::list<ImodAnimAsynLoadItem>::iterator iter = loadItems.begin(); iter != loadItems.end();)
	{
		const char* ret = strstr(path_.c_str(), (*iter).picName.c_str());
		if (ret && (*iter).picName.size() > 0)
		{
			if ((*iter).callback)
			{
				(*iter).trigCallback(tex_);
			}
			iter = loadItems.erase(iter);
			//break; //每次只处理一个，防止卡顿
		}
		else
		{
			double pasttime = SystemHelper::GetCurTick() - (*iter).starttime;
			if (pasttime >= ASYNLOAD_MAXMILLISEC) //超过n秒认为超时
			{
				iter = loadItems.erase(iter); //异步加载超时了
				log("recvTexByPath tomuch time :%f", pasttime);
			}
			else
			{
				iter++;
			}
			
		}
	}
	//loadItems_mutex.unlock();
	log("ImodAnimAsynLoadMgr::recvTexByPath size:%d", loadItems.size());
}

