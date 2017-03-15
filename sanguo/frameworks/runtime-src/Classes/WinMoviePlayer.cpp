
#include "WinMoviePlayer.h"

void *lock(void *data, void **p_pixels)
{
	auto player = static_cast<WinMoviePlayer*>(data);
	*p_pixels = player->m_videobuf;
	return NULL;
}

void unlock(void *data, void *id, void *const *p_pixels)
{
	assert(id == NULL);
}

void display(void *data, void *id)
{
	auto player = static_cast<WinMoviePlayer*>(data);
	player->m_readyToShow = true;
	assert(id == NULL);
}

void endReached(const struct libvlc_event_t *event, void *data)
{
	if (libvlc_MediaPlayerEndReached == event->type)
	{
		WinMoviePlayer *self = (WinMoviePlayer *)data;
		self->m_isEndReached = true;
	}
}

WinMoviePlayer::WinMoviePlayer() :
vlc(0), 
vlc_player(0),
width(960),
height(640),
m_isEndReached(false),
m_curMedia(""),
m_repeat(true),
m_pause(false),
m_readyToShow(false),
m_bFilePath(true)
{

}

WinMoviePlayer::~WinMoviePlayer()
{
	libvlc_media_player_stop(vlc_player);
	libvlc_media_player_release(vlc_player);
	libvlc_release(vlc);
	free(m_videobuf);
}

WinMoviePlayer* WinMoviePlayer::create(Size size)
{
	auto player = new WinMoviePlayer;
	if (player && player->init(size)) {
		player->autorelease();
	}
	else {
		CC_SAFE_DELETE(player);
	}
	return player;
}

bool WinMoviePlayer::init(Size &size)
{
	vlc = libvlc_new(0, NULL);
	if (vlc == NULL)
		return false;

	vlc_player = libvlc_media_player_new(vlc);
	width = size.width;
	height = size.height;
	m_videobuf = (char *)malloc((width * height) << 2);
	memset(m_videobuf, 0, (width * height) << 2);
	libvlc_video_set_callbacks(vlc_player, lock, unlock, display, this);
	libvlc_video_set_format(vlc_player, "RGBA", width, height, width << 2);
	libvlc_event_attach(libvlc_media_player_event_manager(vlc_player),
		libvlc_MediaPlayerEndReached,
		endReached,
		(void *)this);
	Texture2D *texture = new Texture2D();
	texture->initWithData(m_videobuf,
		(width * height) << 2,
		Texture2D::PixelFormat::RGBA8888,
		width, height, size);
	texture->autorelease();
	initWithTexture(texture);
	//scheduleUpdate();
	return true;
}

void WinMoviePlayer::playByPath(std::string &path, bool repeat)
{
	m_isEndReached = false;
	m_curMedia = path;
	m_repeat = repeat;
	m_pause = false;
	m_readyToShow = false;
	m_bFilePath = true;
	libvlc_media_t *media = libvlc_media_new_path(vlc, path.c_str());   //用于打开文件
	libvlc_media_player_set_media(vlc_player, media);
	libvlc_media_release(media);
	libvlc_media_player_play(vlc_player);
	scheduleUpdate();
}

void WinMoviePlayer::playByURL(std::string &url, bool repeat)
{
	m_isEndReached = false;
	m_curMedia = url;
	m_repeat = repeat;
	m_pause = false;
	m_readyToShow = false;
	m_bFilePath = false;
	libvlc_media_t *media = libvlc_media_new_location(vlc, url.c_str());   //用于打开协议，如“udp://….”，“http://”。“screen://”协议就可以进行屏幕录制
	libvlc_media_player_set_media(vlc_player, media);
	libvlc_media_release(media);
	libvlc_media_player_play(vlc_player);
	scheduleUpdate();
}

void WinMoviePlayer::StopVedio(void)
{
	m_pause = false;
	unscheduleUpdate();
	libvlc_media_player_stop(vlc_player);
}

void WinMoviePlayer::ResumeVedio(void)
{
	m_pause = false;
	libvlc_media_player_set_pause(vlc_player, 0);
}

void WinMoviePlayer::PauseVedio(void)
{
	m_pause = true;
	libvlc_media_player_pause(vlc_player);
}

bool WinMoviePlayer::isPlaying(void)
{
	return (1 == libvlc_media_player_is_playing(vlc_player)) ? true : false;
}

bool WinMoviePlayer::isEndReached()
{
	return m_isEndReached;
}

void WinMoviePlayer::draw(Renderer *renderer, const Mat4 &transform, uint32_t flags)
{
	_insideBounds = (flags & FLAGS_TRANSFORM_DIRTY) ? renderer->checkVisibility(transform, _contentSize) : _insideBounds;
	if (_insideBounds)
	{
		if (m_readyToShow) {
			m_readyToShow = false;
			Texture2D *texture = new Texture2D();
			texture->initWithData(m_videobuf,
				(width * height) << 2,
				Texture2D::PixelFormat::RGBA8888,
				width, height, Size(width, height));
			texture->autorelease();
			setTexture(texture);
		}
		_quadCommand.init(_globalZOrder, _texture->getName(), getGLProgramState(), _blendFunc, &_quad, 1, transform);
		renderer->addCommand(&_quadCommand);
#if CC_SPRITE_DEBUG_DRAW
		_debugDrawNode->clear();
		Vec2 vertices[4] = {
			Vec2(_quad.bl.vertices.x, _quad.bl.vertices.y),
			Vec2(_quad.br.vertices.x, _quad.br.vertices.y),
			Vec2(_quad.tr.vertices.x, _quad.tr.vertices.y),
			Vec2(_quad.tl.vertices.x, _quad.tl.vertices.y),
		};
		_debugDrawNode->drawPoly(vertices, 4, true, Color4F(1.0, 1.0, 1.0, 1.0));
#endif //CC_SPRITE_DEBUG_DRAW
	}
}


void WinMoviePlayer::update(float dt)
{
	if (m_repeat && !m_pause && isEndReached())
	{
		if (m_bFilePath == true)
			playByPath(m_curMedia);
		else
			playByURL(m_curMedia);
	}
}




