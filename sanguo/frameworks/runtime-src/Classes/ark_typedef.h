#ifndef __ARK_TYPEDEF_H__
#define __ARK_TYPEDEF_H__

#include <vector>
#include "cocos2d.h"
//#include "cocos-ext.h"
USING_NS_CC;
//USING_NS_CC_EXT;
using namespace std;

class PItem;
class HeroData;
class PetData;

typedef unsigned char ark_byte;
typedef unsigned short ark_word;
typedef unsigned int ark_uint;
typedef unsigned long ark_ulong;
typedef long long ark_int64;
typedef unsigned long long ark_uint64;

typedef std::vector<int> VECTOR_INT;

typedef void (Ref::*SEL_CallFuncI)(int idx);
typedef void (Ref::*SEL_CallFuncII)(int val1,int val2);
typedef void (Ref::*SEL_CallFuncIII)(int val1,int val2,int val3);
typedef void (Ref::*SEL_CallFuncNII)(Node* pSender,int val1,int val2);
typedef void (Ref::*SEL_CallFuncNI)(Ref* pSender,int menuTag);
typedef void (Ref::*SEL_CallFuncIN)(bool isSucc,Node*);//移动回调

typedef void (Ref::*SEL_CallFuncText)(const char* text);
typedef void (Ref::*SEL_CallFuncTextIn)(int type,string input);

typedef void (Ref::*SEL_CallFuncArray)(bool arr[]);
typedef void (Ref::*SEL_CallFuncPos)(Vec2 pos);

typedef void (Ref::*SEL_CallFuncHeroData)(int idx,HeroData heroData);
//背包回调函数 m_Page页数，m_idx索引，EndPos若是拖曳传回拖曳到的坐标不是拖曳则传回Vec2(0,0);
typedef void (Ref::*SEL_CallFuncItemData)(const PItem& it, Vec2 EndPos, int itemPos);

typedef void (Ref::*SEL_CallFuncPetI)(int idx,PetData& data);



#endif