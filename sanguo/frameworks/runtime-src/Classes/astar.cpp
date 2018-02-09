#include "astar.h"
#include "ark_Utility.h"
#include <list>

//////////////////////////////////////////////////////////////////////////
CAStar::~CAStar()
{
	if(m_pWalkability != NULL)
	{
		for(int i = 0; i < m_mapWidth; i++)
		{
			delete []m_pWalkability[i];
		}
	}
	
	if(m_pWhichList != NULL)
	{
		for(int i = 0; i < m_mapWidth+1; i++)
		{
			delete []m_pWhichList[i];
		}
	}
	
	if(m_pParentX != NULL)
	{
		for(int i = 0; i < m_mapWidth+1; i++)
		{
			delete m_pParentX[i];
		}
	}
	
	if(m_pParentY != NULL)
	{
		for(int i = 0; i < m_mapWidth+1; i++)
		{
			delete m_pParentY[i];
		}
	}

	if(m_pGcost != NULL)
	{
		for(int i = 0; i < m_mapWidth+1; i++)
		{
			delete m_pGcost[i];
		}
	}

	delete m_pWalkability;//[m_mapWidth][m_mapHeight];
	delete m_pOpenList;
	delete []m_pWhichList;
	delete m_pOpenX;//[m_mapWidth*m_mapHeight+2]; //1d array stores the x location of an item on the open list
	delete m_pOpenY;//[m_mapWidth*m_mapHeight+2]; //1d array stores the y location of an item on the open list
	delete []m_pParentX;//[m_mapWidth+1][m_mapHeight+1]; //2d array to store parent of each cell (x)
	delete []m_pParentY;//[m_mapWidth+1][m_mapHeight+1]; //2d array to store parent of each cell (y)
	delete m_pFcost;//[m_mapWidth*m_mapHeight+2];	//1d array to store F cost of a cell on the open list
	delete []m_pGcost;//[m_mapWidth+1][m_mapHeight+1]; 	//2d array to store G cost for each cell.
	delete m_pHcost;
}
bool CAStar::Init(int mid,int mapW,int mapH,float tileSize)
{
	if(m_pWalkability != NULL)
	{
		for(int i = 0; i < m_mapWidth; i++)
		{
			delete []m_pWalkability[i];
		}
	}
	
	if(m_pWhichList != NULL)
	{
		for(int i = 0; i < m_mapWidth+1; i++)
		{
			delete []m_pWhichList[i];
		}
	}
	
	if(m_pParentX != NULL)
	{
		for(int i = 0; i < m_mapWidth+1; i++)
		{
			delete m_pParentX[i];
		}
	}
	
	if(m_pParentY != NULL)
	{
		for(int i = 0; i < m_mapWidth+1; i++)
		{
			delete m_pParentY[i];
		}
	}

	if(m_pGcost != NULL)
	{
		for(int i = 0; i < m_mapWidth+1; i++)
		{
			delete m_pGcost[i];
		}
	}

	delete m_pWalkability;//[m_mapWidth][m_mapHeight];
	delete m_pOpenList;
	delete []m_pWhichList;
	delete m_pOpenX;//[m_mapWidth*m_mapHeight+2]; //1d array stores the x location of an item on the open list
	delete m_pOpenY;//[m_mapWidth*m_mapHeight+2]; //1d array stores the y location of an item on the open list
	delete []m_pParentX;//[m_mapWidth+1][m_mapHeight+1]; //2d array to store parent of each cell (x)
	delete []m_pParentY;//[m_mapWidth+1][m_mapHeight+1]; //2d array to store parent of each cell (y)
	delete m_pFcost;//[m_mapWidth*m_mapHeight+2];	//1d array to store F cost of a cell on the open list
	delete []m_pGcost;//[m_mapWidth+1][m_mapHeight+1]; 	//2d array to store G cost for each cell.
	delete m_pHcost;//[m_mapWidth*m_mapHeight+2];	//1d array to store H cost of a cell on the open list

	m_mapId = mid;
	m_mapWidth = mapW;
	m_mapHeight = mapH;
	m_tileSize = tileSize;
	
	m_pWalkability = new char*[m_mapWidth];
	for(int i = 0; i < m_mapWidth; i++)
	{
		m_pWalkability[i] = new char[m_mapHeight];
	}
	
	m_pOpenList = new int[m_mapWidth*m_mapHeight+2];//[m_mapWidth*m_mapHeight+2]; //1 dimensional array holding ID# of open list items
	
	m_pWhichList = new int*[m_mapWidth+1];//[m_mapWidth+1][m_mapHeight+1];  //2 dimensional array used to record 
	for(int i = 0; i < m_mapWidth+1; i++)
	{
		m_pWhichList[i] = new int[m_mapHeight+1];
	}

	m_pOpenX = new int[m_mapWidth*m_mapHeight+2];//[m_mapWidth*m_mapHeight+2]; //1d array stores the x location of an item on the open list
	m_pOpenY = new int[m_mapWidth*m_mapHeight+2]; //1d array stores the y location of an item on the open list

	m_pParentX = new int*[m_mapWidth+1];//[m_mapWidth+1][m_mapHeight+1];  //2 dimensional array used to record 
	for(int i = 0; i < m_mapWidth+1; i++)
	{
		m_pParentX[i] = new int[m_mapHeight+1];
	}
	
	m_pParentY = new int*[m_mapWidth+1];//[m_mapWidth+1][m_mapHeight+1];  //2 dimensional array used to record 
	for(int i = 0; i < m_mapWidth+1; i++)
	{
		m_pParentY[i] = new int[m_mapHeight+1];
	}

	m_pFcost = new int[m_mapWidth*m_mapHeight+2];;//[m_mapWidth*m_mapHeight+2];	//1d array to store F cost of a cell on the open list
	
	m_pGcost = new int*[m_mapWidth+1];//[m_mapWidth+1][m_mapHeight+1];  //2 dimensional array used to record 
	for(int i = 0; i < m_mapWidth+1; i++)
	{
		m_pGcost[i] = new int[m_mapHeight+1];
	}
	m_pHcost = new int[m_mapWidth*m_mapHeight+2];//[m_mapWidth*m_mapHeight+2];	//1d array to store H cost of a cell on the open list
	return true;
}

bool CAStar::FindNextPathByAngle(int startingX, int startingY,float angle)
{
	//FindNextPathByAngle
	int startX = startingX/m_tileSize;
	int startY = startingY/m_tileSize;	
	int targetX = startX;
	int targetY = startY;
	if (sin(angle) > 0)
	{
		targetY += 1;
	}
	else if (SystemHelper::FloatApproxEquals(sin(angle),0))
	{
		targetX += cos(angle);
	}
	else
	{
		targetY -= 1;
	}

	if (cos(angle) > 0)
	{
		targetX += 1;
	}
	else if (SystemHelper::FloatApproxEquals(cos(angle),0))
	{
		targetY += sin(angle);
	}
	else
	{
		targetX -= 1;
	}
	if(m_mapWidth < startX || m_mapHeight < startY || targetX > m_mapWidth || targetY > m_mapHeight || targetX <0 || targetY <0)
	{
		return false;
	}
	if (m_pWalkability[targetX][targetY] == m_scUnwalkable)
	{
		return false;
	}
	else
	{
		m_path.clear();
		SPoint* pathEnd = SPoint::create();
		pathEnd->x = targetX * m_tileSize - m_tileSize/2;
		pathEnd->y = targetY * m_tileSize - m_tileSize/2;
		m_path.pushBack(pathEnd); //push_back
		return true;
	}
}

//-----------------------------------------------------------------------------
// Name: FindPath
// Desc: Finds a path using A*
//-----------------------------------------------------------------------------
bool CAStar::FindPath (int startingX, int startingY,int targetX, int targetY)
{
	int onOpenList=0, parentXval=0, parentYval=0,
		a=0, b=0, m=0, u=0, v=0, temp=0, corner=0, numberOfOpenListItems=0,
		addedGCost=0, tempGcost = 0,
		tempx, pathX, pathY, newOpenListItemID=0;
	bool path = false;

	//1. Convert location data (in pixels) to coordinates in the m_pWalkability array.
	int startX = startingX;
	int startY = startingY;	
	targetX = targetX;
	targetY = targetY;

	//2.Quick Path Checks: Under the some circumstances no path needs to
	//	be generated ...

	m_path.clear();
	//	If starting location and target are in the same location...
	if (startX == targetX && startY == targetY)
		return false;

	if (startX < 0 || startY < 0 || startX >= m_mapWidth || startY >= m_mapHeight)
		return false;

	if (targetX < 0 || targetY < 0 || targetX >= m_mapWidth || targetY >= m_mapHeight)
		return false;

	//	If target square is m_scUnwalkable, return that it's a nonexistent path.
	if (m_pWalkability[targetX][targetY] == m_scUnwalkable)
		goto noPath;

	//3.Reset some variables that need to be cleared
	if (m_onClosedList > 50000) //reset m_pWhichList occasionally
	{
		for (int x = 0; x < m_mapWidth;x++) {
			for (int y = 0; y < m_mapHeight;y++)
				m_pWhichList [x][y] = 0;
		}
		m_onClosedList = 10;	
	}
	m_onClosedList = m_onClosedList+2; //changing the values of onOpenList and onClosed list is faster than redimming m_pWhichList() array
	onOpenList = m_onClosedList-1;
	//m_pathLength  = m_scNotStarted;//i.e, = 0
	//m_pathLocation  = m_scNotStarted;//i.e, = 0
	m_pGcost[startX][startY] = 0; //reset starting square's G value to 0

	//4.Add the starting location to the open list of squares to be checked.
	numberOfOpenListItems = 1;
	m_pOpenList[1] = 1;//assign it as the top (and currently only) item in the open list, which is maintained as a binary heap (explained below)
	m_pOpenX[1] = startX ; m_pOpenY[1] = startY;

	//5.Do the following until a path is found or deemed nonexistent.
	do
	{

		//6.If the open list is not empty, take the first cell off of the list.
		//	This is the lowest F cost cell on the open list.
		if (numberOfOpenListItems != 0)
		{

			//7. Pop the first item off the open list.
			parentXval = m_pOpenX[m_pOpenList[1]];
			parentYval = m_pOpenY[m_pOpenList[1]]; //record cell coordinates of the item
			m_pWhichList[parentXval][parentYval] = m_onClosedList;//add the item to the closed list

			//	Open List = Binary Heap: Delete this item from the open list, which
			//  is maintained as a binary heap. For more information on binary heaps, see:
			//	http://www.policyalmanac.org/games/binaryHeaps.htm
			numberOfOpenListItems = numberOfOpenListItems - 1;//reduce number of open list items by 1	

			//	Delete the top item in binary heap and reorder the heap, with the lowest F cost item rising to the top.
			m_pOpenList[1] = m_pOpenList[numberOfOpenListItems+1];//move the last item in the heap up to slot #1
			v = 1;

			//	Repeat the following until the new item in slot #1 sinks to its proper spot in the heap.
			do
			{
				u = v;		
				if (2*u+1 <= numberOfOpenListItems) //if both children exist
				{
					//Check if the F cost of the parent is greater than each child.
					//Select the lowest of the two children.
					if (m_pFcost[m_pOpenList[u]] >= m_pFcost[m_pOpenList[2*u]]) 
						v = 2*u;
					if (m_pFcost[m_pOpenList[v]] >= m_pFcost[m_pOpenList[2*u+1]]) 
						v = 2*u+1;		
				}
				else
				{
					if (2*u <= numberOfOpenListItems) //if only child #1 exists
					{
						//Check if the F cost of the parent is greater than child #1	
						if (m_pFcost[m_pOpenList[u]] >= m_pFcost[m_pOpenList[2*u]]) 
							v = 2*u;
					}
				}

				if (u != v) //if parent's F is > one of its children, swap them
				{
					temp = m_pOpenList[u];
					m_pOpenList[u] = m_pOpenList[v];
					m_pOpenList[v] = temp;			
				}
				else
					break; //otherwise, exit loop

			}
			while (1);//reorder the binary heap


			//7.Check the adjacent squares. (Its "children" -- these path children
			//	are similar, conceptually, to the binary heap children mentioned
			//	above, but don't confuse them. They are different. Path children
			//	are portrayed in Demo 1 with grey pointers pointing toward
			//	their parents.) Add these adjacent child squares to the open list
			//	for later consideration if appropriate (see various if statements
			//	below).
			for (b = parentYval-1; b <= parentYval+1; b++){
				for (a = parentXval-1; a <= parentXval+1; a++){

					//	If not off the map (do this first to avoid array out-of-bounds errors)
					if (a != -1 && b != -1 && a != m_mapWidth && b != m_mapHeight){

						//	If not already on the closed list (items on the closed list have
						//	already been considered and can now be ignored).			
						if (m_pWhichList[a][b] != m_onClosedList) { 

							//	If not a wall/obstacle square.
							if (m_pWalkability [a][b] != m_scUnwalkable) { 

								//	Don't cut across corners
								corner = m_scWalkable;	
								if (a == parentXval-1) 
								{
									if (b == parentYval-1)
									{
										if (m_pWalkability[parentXval-1][parentYval] == m_scUnwalkable
											|| m_pWalkability[parentXval][parentYval-1] == m_scUnwalkable) \
											corner = m_scUnwalkable;
									}
									else if (b == parentYval+1)
									{
										if (m_pWalkability[parentXval][parentYval+1] == m_scUnwalkable
											|| m_pWalkability[parentXval-1][parentYval] == m_scUnwalkable) 
											corner = m_scUnwalkable; 
									}
								}
								else if (a == parentXval+1)
								{
									if (b == parentYval-1)
									{
										if (m_pWalkability[parentXval][parentYval-1] == m_scUnwalkable 
											|| m_pWalkability[parentXval+1][parentYval] == m_scUnwalkable) 
											corner = m_scUnwalkable;
									}
									else if (b == parentYval+1)
									{
										if (m_pWalkability[parentXval+1][parentYval] == m_scUnwalkable 
											|| m_pWalkability[parentXval][parentYval+1] == m_scUnwalkable)
											corner = m_scUnwalkable; 
									}
								}	
								if (corner == m_scWalkable) {

									//	If not already on the open list, add it to the open list.			
									if (m_pWhichList[a][b] != onOpenList) 
									{	

										//Create a new open list item in the binary heap.
										newOpenListItemID = newOpenListItemID + 1; //each new item has a unique ID #
										m = numberOfOpenListItems+1;
										m_pOpenList[m] = newOpenListItemID;//place the new open list item (actually, its ID#) at the bottom of the heap
										m_pOpenX[newOpenListItemID] = a;
										m_pOpenY[newOpenListItemID] = b;//record the x and y coordinates of the new item

										//Figure out its G cost
										if (abs(a-parentXval) == 1 && abs(b-parentYval) == 1)
											addedGCost = 14;//cost of going to diagonal squares	
										else	
											addedGCost = 10;//cost of going to non-diagonal squares				
										m_pGcost[a][b] = m_pGcost[parentXval][parentYval] + addedGCost;

										//Figure out its H and F costs and parent
										m_pHcost[m_pOpenList[m]] = 10*(abs(a - targetX) + abs(b - targetY));
										m_pFcost[m_pOpenList[m]] = m_pGcost[a][b] + m_pHcost[m_pOpenList[m]];
										m_pParentX[a][b] = parentXval ; m_pParentY[a][b] = parentYval;	

										//Move the new open list item to the proper place in the binary heap.
										//Starting at the bottom, successively compare to parent items,
										//swapping as needed until the item finds its place in the heap
										//or bubbles all the way to the top (if it has the lowest F cost).
										while (m != 1) //While item hasn't bubbled to the top (m=1)	
										{
											//Check if child's F cost is < parent's F cost. If so, swap them.	
											if (m_pFcost[m_pOpenList[m]] <= m_pFcost[m_pOpenList[m/2]])
											{
												temp = m_pOpenList[m/2];
												m_pOpenList[m/2] = m_pOpenList[m];
												m_pOpenList[m] = temp;
												m = m/2;
											}
											else
												break;
										}
										numberOfOpenListItems = numberOfOpenListItems+1;//add one to the number of items in the heap

										//Change m_pWhichList to show that the new item is on the open list.
										m_pWhichList[a][b] = onOpenList;
									}

									//8.If adjacent cell is already on the open list, check to see if this 
									//	path to that cell from the starting location is a better one. 
									//	If so, change the parent of the cell and its G and F costs.	
									else //If m_pWhichList(a,b) = onOpenList
									{

										//Figure out the G cost of this possible new path
										if (abs(a-parentXval) == 1 && abs(b-parentYval) == 1)
											addedGCost = 14;//cost of going to diagonal tiles	
										else	
											addedGCost = 10;//cost of going to non-diagonal tiles				
										tempGcost = m_pGcost[parentXval][parentYval] + addedGCost;

										//If this path is shorter (G cost is lower) then change
										//the parent cell, G cost and F cost. 		
										if (tempGcost < m_pGcost[a][b]) 
											//if G cost is less,										
										{
											m_pParentX[a][b] = parentXval; //change the square's parent
											m_pParentY[a][b] = parentYval;
											m_pGcost[a][b] = tempGcost;//change the G cost			

											//Because changing the G cost also changes the F cost, if
											//the item is on the open list we need to change the item's
											//recorded F cost and its position on the open list to make
											//sure that we maintain a properly ordered open list.
											for (int x = 1; x <= numberOfOpenListItems; x++) //look for the item in the heap
											{
												if (m_pOpenX[m_pOpenList[x]] == a && m_pOpenY[m_pOpenList[x]] == b) //item found
												{
													m_pFcost[m_pOpenList[x]] = m_pGcost[a][b] + m_pHcost[m_pOpenList[x]];//change the F cost

													//See if changing the F score bubbles the item up from it's current location in the heap
													m = x;
													while (m != 1) //While item hasn't bubbled to the top (m=1)	
													{
														//Check if child is < parent. If so, swap them.	
														if (m_pFcost[m_pOpenList[m]] < m_pFcost[m_pOpenList[m/2]])
														{
															temp = m_pOpenList[m/2];
															m_pOpenList[m/2] = m_pOpenList[m];
															m_pOpenList[m] = temp;
															m = m/2;
														}
														else
															break;
													} 
													break; //exit for x = loop
												} //If m_pOpenX(m_pOpenList(x)) = a
											} //For x = 1 To numberOfOpenListItems
										}//If tempGcost < m_pGcost(a,b)

									}//else If m_pWhichList(a,b) = onOpenList	
								}//If not cutting a corner
							}//If not a wall/obstacle square.
						}//If not already on the closed list 
					}//If not off the map
				}//for (a = parentXval-1; a <= parentXval+1; a++){
			}//for (b = parentYval-1; b <= parentYval+1; b++){

		}//if (numberOfOpenListItems != 0)

		//9.If open list is empty then there is no path.	
		else
		{
			path = false; break;
		}  

		//If target is added to open list then path has been found.
		if (m_pWhichList[targetX][targetY] == onOpenList)
		{
			path = true; break;
		}

	}
	while (1);//Do until path is found or deemed nonexistent
	
	//10.Save the path if it exists.
	if (path)
	{

		//c. Now copy the path information over to the databank. Since we are
		//	working backwards from the target to the start location, we copy
		//	the information to the data bank in reverse order. The result is
		//	a properly ordered set of path data, from the first step to the
		//	last.
		pathX = targetX ; pathY = targetY;
		list<SPoint> tempPath;
		do
		{
			//d.Look up the parent of the current cell.	
			if (pathX < 0 || pathX >= m_mapWidth || pathY < 0 || pathY >= m_mapHeight)
			{
				log("FindPath:%d %d %d %d %d", m_mapId, startX, startY, targetX, targetY);
				log("FindPath:%d %d %d %d", pathX, pathY, m_mapWidth, m_mapHeight);
				break;
			}

			SPoint p;
			p.x = pathX*m_tileSize + m_tileSize / 2;
			p.y = pathY*m_tileSize + m_tileSize / 2;
			tempPath.push_front(p);
			
			tempx = m_pParentX[pathX][pathY];		
			pathY = m_pParentY[pathX][pathY];
			pathX = tempx;

			//e.If we have reached the starting square, exit the loop.	
		}
		while (pathX != startX || pathY != startY);	

		for(list<SPoint>::iterator i = tempPath.begin(); i != tempPath.end(); i++)
		{
			SPoint p = *i;
			SPoint* np = SPoint::create();  //新建Ref同时拷贝数据
			np->x = p.x;
			np->y = p.y;
			m_path.pushBack(np);  //pushBack push_back
		}
	}
	return path;


	//13.If there is no path to the selected target, set the pathfinder's
	//	m_xPath and m_yPath equal to its current location and return that the
	//	path is nonexistent.
noPath:
	return false;
}

bool CAStar::Walkable(SPoint a,SPoint b)
{
	if(!CanWalk(a.x/m_tileSize,a.y/m_tileSize))
		return false;
	if(!CanWalk(b.x/m_tileSize,b.y/m_tileSize))
		return false;
	Vec2 sPos = Vec2(a.x,a.y);
	Vec2 tPos = Vec2(b.x,b.y);
	//计算两点之间距离
	int distanseLen = SystemHelper::calcDistance(sPos,tPos);
	//每次移动0.1单位，计算移动次数
	int totalStep = distanseLen/(m_tileSize*0.1f);
	//x y 方向每一步移动的距离
	int stepXlen = (b.x-a.x)/totalStep;
	int stepYlen = (b.y-a.y)/totalStep;

	SPoint ctPos,lhPos,llPos,rhPos,rlPos;
	const int blocksize = m_tileSize;
	for(int i=0; i<totalStep; i++)
	{
		//中心点
		ctPos.x = a.x+stepXlen*i;
		ctPos.y = a.y+stepYlen*i;
		//左上
		lhPos.x = ctPos.x-blocksize/2;
		lhPos.y = ctPos.y+blocksize/2;
		//左下
		llPos.x = ctPos.x-blocksize/2;
		llPos.y = ctPos.y-blocksize/2;
		//右上
		rhPos.x = ctPos.x+blocksize/2;
		rhPos.y = ctPos.y+blocksize/2;
		//右下
		rlPos.x = ctPos.x+blocksize/2;
		rlPos.y = ctPos.y-blocksize/2;
		if(!CanWalk(ctPos.x/m_tileSize,ctPos.y/m_tileSize) || 
		   !CanWalk(lhPos.x/m_tileSize,lhPos.y/m_tileSize) ||
		   !CanWalk(llPos.x/m_tileSize,llPos.y/m_tileSize) ||
		   !CanWalk(rhPos.x/m_tileSize,rhPos.y/m_tileSize) ||
		   !CanWalk(rlPos.x/m_tileSize,rlPos.y/m_tileSize))
			return false;
	}

	return true;
}

void CAStar::SmoothingPath(Vector<SPoint*>& path)
{
	if(path.size()<3)
		return;

	SPoint* A = path.at(0);
	SPoint* B = path.at(1);
	int i = 2;
	while ((int)path.size()>i)
	{
		if(Walkable(*A,*path.at(i)))
		{
			B = path.at(i);
			path.erase(path.begin()+i-1);
		}
		else
		{
			A = B;
			B = path.at(i++);
		}
	}
}
