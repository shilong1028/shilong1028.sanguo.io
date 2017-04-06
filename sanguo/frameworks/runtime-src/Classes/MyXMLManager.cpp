
#include "MyXMLManager.h"

MyXMLManager::MyXMLManager() :
m_pXMLDocument(NULL),
m_strXMLFilePath("")
{

}

MyXMLManager::MyXMLManager(const char* strXMLPath) :
m_pXMLDocument(NULL),
m_strXMLFilePath(strXMLPath)
{
	loadXMLFile(strXMLPath);
}

MyXMLManager::~MyXMLManager(void)
{
	if (m_pXMLDocument)
	{
		delete m_pXMLDocument;
	}
}


bool MyXMLManager::loadXMLFile(const char* strXmlPath1)
{
	string path = ""; // FileUtils::getInstance()->getWritablePath();
	const char* strXmlPath = (path + strXmlPath1).c_str();

	//加载同一文件时，直接返回
	if (strcmp(m_strXMLFilePath.c_str(), strXmlPath) == 0)
	{
		return true;
	}

	m_strXMLFilePath = strXmlPath;
	//首先置空，防止重复加载
	if (m_pXMLDocument)
	{
		delete m_pXMLDocument;
		m_pXMLDocument = NULL;
	}

	m_pXMLDocument = new WWXMLManager();
	if (NULL == m_pXMLDocument)
	{
		return false;
	}

	return m_pXMLDocument->loadXMLFile(strXmlPath);
}

//创建xml文件,默认为utf-8编码
bool MyXMLManager::createXMLFile(const char* strFileName1, const char* rootNode /*= "root"*/)
{
	//首先置空，防止重复加载
	if (m_pXMLDocument)
	{
		delete m_pXMLDocument;
		m_pXMLDocument = NULL;
	}

	m_pXMLDocument = new WWXMLManager();
	if (NULL == m_pXMLDocument)
	{
		return false;
	}

	string path = ""; //FileUtils::getInstance()->getWritablePath();
	string strFileName = path + strFileName1;

	return m_pXMLDocument->createXMLFile(strFileName.c_str(), rootNode);
}

//保存文件，修改后需要调用此方法
bool MyXMLManager::saveXMLFile()
{
	if (NULL == m_pXMLDocument)
	{
		return false;
	}

	return m_pXMLDocument->saveXMLFile();
}

WWXMLNode MyXMLManager::getTarChildNode(const char* node)
{
	if (NULL == m_pXMLDocument)
	{
		return NULL;
	}

	WWXMLNode itemNode = m_pXMLDocument->getXMLRootNode();

	string nodeStr = node;
	int beginPos = 0;
	int endPos = 0;
	int strLen = nodeStr.length();

	while (endPos != string::npos){
		endPos = nodeStr.find('-', beginPos);
		int subLen = endPos - beginPos;
		string subNode = nodeStr.substr(beginPos, subLen);
		itemNode = itemNode.findChildNode(subNode.c_str());
		if (itemNode.isNULL() == true){
			return NULL;
		}
		beginPos = endPos + 1;
	}

	return itemNode;
}

//在根节点上添加子节点
void MyXMLManager::addChildNode(const char* node /*= "item"*/)
{
	if (NULL == m_pXMLDocument)
	{
		return;
	}

	WWXMLNode parNode = m_pXMLDocument->getXMLRootNode();

	string nodeStr = node;
	int beginPos = 0;
	int endPos = 0;
	int strLen = nodeStr.length();

	while (endPos != string::npos){
		endPos = nodeStr.find('-', beginPos);
		int subLen = endPos - beginPos;
		string subNode = nodeStr.substr(beginPos, subLen);

		WWXMLNode itemNode = parNode.findChildNode(subNode.c_str());
		if (itemNode.isNULL() == true){
			parNode.addChildNode(subNode.c_str());
		}
		parNode = itemNode;
		beginPos = endPos + 1;
	}
}

//设置节点属性及值
void MyXMLManager::setNodeAttrValue(const char* node, const char* name, const char* value)
{
	if (NULL == m_pXMLDocument)
	{
		return;
	}

	WWXMLNode itemNode = getTarChildNode(node);
	if (false == itemNode.isNULL()){
		itemNode.setAttributeValue(name, value);
	}
}

string MyXMLManager::getNodeAttrValue(const char* node, const char* name)
{
	if (NULL == m_pXMLDocument)
	{
		return "";
	}

	WWXMLNode itemNode = getTarChildNode(node);
	if (false == itemNode.isNULL())
		return itemNode.getAttributeValue(name);
	else
		return "";
}

//删除一个指定名称的属性值
void MyXMLManager::deleteAttribute(const char* node, const char* name)
{
	if (NULL == m_pXMLDocument)
	{
		return;
	}

	WWXMLNode itemNode = getTarChildNode(node);
	if (false == itemNode.isNULL())
		itemNode.deleteAttribute(name);
}

//删除根子节点
void MyXMLManager::removeNode(const char* node)
{
	if (NULL == m_pXMLDocument)
	{
		return;
	}

	WWXMLNode itemNode = getTarChildNode(node);
	if (false == itemNode.isNULL())
		itemNode.removeSelf();
}

//删除所有根子节点
void MyXMLManager::removeAllChildNode(const char* node)
{
	if (NULL == m_pXMLDocument)
	{
		return;
	}

	WWXMLNode itemNode = getTarChildNode(node);
	if (false == itemNode.isNULL())
		itemNode.removeAllChildNode();
}

//是否根子节点是空节点
bool MyXMLManager::isNULL(const char* node)
{
	if (NULL == m_pXMLDocument)
	{
		return true;
	}

	WWXMLNode itemNode = getTarChildNode(node);
	if (false == itemNode.isNULL())
		return itemNode.isNULL();
	else
		return true;
}

