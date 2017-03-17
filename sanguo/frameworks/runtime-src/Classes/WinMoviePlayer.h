#ifndef __VLCMOVIEPLAYER_H__
#define __VLCMOVIEPLAYER_H__

#include "vlc/vlc.h"
#include "cocos2d.h"

USING_NS_CC;

class WinMoviePlayer : public cocos2d::Sprite
{
public:
	~WinMoviePlayer();

	static WinMoviePlayer* create(cocos2d::Size size);
	bool init(cocos2d::Size &size);
	void playByPath(std::string &path, bool repeat = true);
	void playByURL(std::string &url, bool repeat = true);
	void StopVedio(void);
	void PauseVedio(void);
	void ResumeVedio(void);
	bool isPlaying(void);
	bool isEndReached();

	virtual void draw(cocos2d::Renderer *renderer, const cocos2d::Mat4 &transform, uint32_t flags) override;
	virtual void update(float dt) override;


	friend void endReached(const struct libvlc_event_t *event, void *data);
	friend void *lock(void *data, void **p_pixels);
	friend void unlock(void *data, void *id, void *const *p_pixels);
	friend void display(void *data, void *id);


	//脚本回调
	void registerEndScriptHandler(int nHandler);
	void unregisterEndScriptHandler(void);
protected:
	WinMoviePlayer();

	void executeEndScriptHandler();
private:
	libvlc_instance_t     *vlc;    //代表一个libVLC的实例
	libvlc_media_player_t *vlc_player;    //代表一个VLC媒体播放器（一个视频播放器播放一个视频）。注意VLC并不仅仅用于媒体播放。
	unsigned int          width;
	unsigned int          height;
	char                  *m_videobuf;
	bool                  m_isEndReached;
	std::string           m_curMedia;
	bool                  m_repeat;
	bool                  m_pause;
	bool                  m_readyToShow;
	bool                  m_bFilePath;
	/** Quad command. */
	QuadCommand           _quadCommand;

	int					 m_nEndScriptHandler;	//回调（lua）
};

#endif