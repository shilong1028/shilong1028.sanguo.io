
#ifndef _MYXMLMANAGER_H_
#define _MYXMLMANAGER_H_

#include "cocos2d.h"
#include "../../external/tinyxml2/tinyxml2.h"

USING_NS_CC;
using namespace std;


/*
*   属性类，这里属性是只读的，修改请使用WWXMLNode类
*   <express name="test" value="nothing">This is a test!</express>
*   name 和 value 就是结点的属性
*/
class WWXMLAttribute
{
public:

	WWXMLAttribute(const tinyxml2::XMLAttribute *pXMLAttribute);

	~WWXMLAttribute();

	//下一个属性值
	WWXMLAttribute next();

	//获取属性名称
	const char* getName();

	//获取string类型属性值
	const char* value();

	//获取int类型属性值
	int intValue();

	//获取bool类型属性值
	bool boolValue();

	//获取float类型属性值
	float floatValue();

	//获取double类型属性值
	double doubleValue();

	//返回是否是空
	bool isNULL();

private:
	//文档属性对象
	const tinyxml2::XMLAttribute *m_pXMLAttribute;
};


/*
*  节点类，封装对节点的各种操作.
*  如下类型节点
*	<example name="ok", flag="1">text</example>
*
*  example是 nodeName
*  name和flag是attribute
*  text是 nodeValue
*/
class WWXMLNode
{
public:

	WWXMLNode(tinyxml2::XMLElement *pXMLElem);

	WWXMLNode(tinyxml2::XMLElement *pXMLElem, tinyxml2::XMLDocument *pXMLDocument);

	~WWXMLNode();

	//增加子节点
	WWXMLNode addChildNode(const char* name);

	//查找子节点，默认返回第一个子节点
	WWXMLNode findChildNode(const char* name = NULL);

	//查找下一个兄弟节点，默认返回下面第一个兄弟节点
	WWXMLNode findSlibingNode(const char* name = NULL);

	//查找上一个兄弟节点,默认返回上面第一个兄弟节点
	WWXMLNode preSlibingNode(const char* name = NULL);

	//设置节点属性值
	void setAttributeValue(const char* name, const char* value);

	//获取指定的属性值
	const char* getAttributeValue(const char* name);

	//删除一个指定名称的属性值
	void deleteAttribute(const char* name);

	//设置节点名称
	void setNodeName(const char* name);

	//获取节点名称
	const char* getNodeName();

	//设置节点值
	void setNodeValue(const char* value);

	//获取节点值
	const char* getNodeValue();

	//获取属性，默认返回第一个属性
	WWXMLAttribute firstAttribute(const char* name = NULL);

	//删除本节点
	void removeSelf();

	//删除所有子节点
	void removeAllChildNode();

	//是否是空节点
	bool isNULL();

private:
	tinyxml2::XMLDocument *m_pXMLDocument;
	tinyxml2::XMLElement *m_pXMLElem;
};

/*
* XML管理类，使用tinyxml2封装了操作xml的细节，需要配合WWXMLNode类使用。
* 封装了CCUserDefault提供的功能
*
* example:
* MyXMLManager myXML;
* myXML.createXMLFile("myXML.xml", "TestXMLManager");
* myXML.addRootChildNode("item");
* myXML.setNodeAttrValue("item", "flag", "true");
* myXML.saveXMLFile();
*/
class MyXMLManager
{
public:
	MyXMLManager();

	MyXMLManager(const char* strXMLPath);

	~MyXMLManager(void);

	//加载xml文件，utf-8格式文件
	bool loadXMLFile(const char* strXmlPath);

	//创建xml文件,默认为utf-8编码
	bool createXMLFile(const char* strFileName, const char* rootNode = "root");

	//保存文件，修改后需要调用此方法
	bool saveXMLFile();

	//在根节点上添加子节点,node为从根开始的以-为分割的递归子节点，比如"test-node-thirdnode"，为root下tes子节点下的node子节点的third子节点
	void addChildNode(const char* node);

	//设置节点属性及值
	void setNodeAttrValue(const char* node, const char* name, const char* value);
	string getNodeAttrValue(const char* node, const char* name);

	//删除一个指定名称的属性值
	void deleteAttribute(const char* node, const char* name);

	//删除根子节点
	void removeNode(const char* node);

	//删除所有子节点
	void removeAllChildNode(const char* node);

	//是否根子节点是空节点
	bool isNULL(const char* node);

private:
	//获取目标子节点,node为从根开始的以-为分割的递归子节点，比如"test-node-thirdnode"，为root下tes子节点下的node子节点的third子节点
	WWXMLNode getTarChildNode(const char* node);

private:
	tinyxml2::XMLDocument *m_pXMLDocument;
	//文件路径，每次load时改变
	std::string m_strXMLFilePath;
};

#endif
