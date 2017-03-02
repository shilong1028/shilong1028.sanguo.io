#ifndef _A_STAR_H_
#define _A_STAR_H_

/*
;===================================================================
;A* Pathfinder (Version 1.71a) by Patrick Lester. Used by permission.
;===================================================================
;Last updated 06/16/03 -- Visual C++ version
*/

#include <vector>
#include <stdlib.h>
using namespace std;

typedef unsigned char   uint8;
typedef unsigned short  uint16;
typedef short           int16;
typedef unsigned int    uint32;
typedef long long       int64;
typedef unsigned long long uint64;
typedef unsigned long	ulong;

#include "cocos2d.h"
USING_NS_CC;

//////////////////////////////////////////////////////////////////////////
/// AStar 寻路算法
class SPoint:public Ref
{
public:
	int x;
	int y;
	int getx(){ return x; }
	int gety(){ return y; }
	int getX(){ return x; }
	int getY(){ return y; }
	CREATE_FUNC(SPoint);
	virtual bool init(){ return true; }
};
class CAStar
{
public:
    
public:
	CAStar():m_onClosedList(10),m_scNotStarted(0)
	{
		m_pWalkability 		= NULL;
		m_pOpenList			= NULL;
		m_pWhichList		= NULL;
		m_pOpenX			= NULL;
		m_pOpenY			= NULL;
		m_pParentX			= NULL;
		m_pParentY			= NULL;
		m_pFcost			= NULL;
		m_pGcost			= NULL;
		m_pHcost			= NULL;
		m_mapWidth = 0;
		m_mapHeight = 0;
		m_tileSize = 0;
	}
	~CAStar();
	bool Init(int mid,int mapW,int mapH,float tileSize);

	bool FindNextPathByAngle(int startingX, int startingY,float angle);
	bool FindPath (int startingX, int startingY,int targetX, int targetY);

	Vector<SPoint*> GetPath(bool isSmoothing=false)
	{
		if(isSmoothing)
		{
			Vector<SPoint*> path = m_path;
			SmoothingPath(path);
			return path;
		}
		return m_path;
	}
	void SetCanWalk(bool walk,uint16 x,uint16 y)
	{
		if(x >= m_mapWidth || y >= m_mapHeight)
			return;
		if(walk)
			m_pWalkability[x][y] = m_scWalkable;
		else
			m_pWalkability[x][y] = m_scUnwalkable;
	}
	bool CanWalk(uint16 x,uint16 y)
	{
		if(x >= m_mapWidth || y >= m_mapHeight)
			return false;
		return m_pWalkability[x][y] == m_scWalkable;
	}

private:
	bool Walkable(SPoint a, SPoint b);
	void SmoothingPath(Vector<SPoint*>& path);
private:
	int m_mapId;
	int m_mapWidth;
	int m_mapHeight;
	float m_tileSize;
	int m_onClosedList;
	int m_scNotStarted;// path-related constants
	static const char m_scWalkable = 0, m_scUnwalkable = 1;// m_pWalkability array constants

	//Create needed arrays
	char **m_pWalkability;
	int *m_pOpenList;
	int **m_pWhichList;
	
    //whether a cell is on the open list or on the closed list.
	int *m_pOpenX;
	int *m_pOpenY;
	int **m_pParentX;
	int **m_pParentY;
	int *m_pFcost;
	int **m_pGcost;
	int *m_pHcost;
	Vector<SPoint*> m_path;
};

#endif