
#include "MyXMLManager.h"

WWXMLNode::WWXMLNode(tinyxml2::XMLElement *pElem) :
m_pXMLElem(pElem),
m_pXMLDocument(NULL)
{

}

WWXMLNode::WWXMLNode(tinyxml2::XMLElement *pElem, tinyxml2::XMLDocument *pDocument) :
m_pXMLElem(pElem),
m_pXMLDocument(pDocument)
{

}

WWXMLNode::~WWXMLNode()
{

}

WWXMLNode WWXMLNode::addChildNode(const char* name)
{
	if (m_pXMLElem && m_pXMLDocument)
	{
		tinyxml2::XMLElement *pElem = m_pXMLDocument->NewElement(name);
		if (pElem)
		{
			m_pXMLElem->LinkEndChild(pElem);
			WWXMLNode node(pElem, m_pXMLDocument);
			return node;
		}
	}
	return NULL;
}

WWXMLNode WWXMLNode::findChildNode(const char* name /* = NULL */)
{
	if (m_pXMLElem && m_pXMLDocument)
	{
		if (NULL == name)
		{
			WWXMLNode node(m_pXMLElem->FirstChildElement(), m_pXMLDocument);
			return node;
		}
		else
		{
			WWXMLNode node(m_pXMLElem->FirstChildElement(name), m_pXMLDocument);
			return node;
		}
	}
	return NULL;
}

void WWXMLNode::setAttributeValue(const char* name, const char* value)
{
	if (m_pXMLElem && NULL != name)
	{
		m_pXMLElem->SetAttribute(name, value);
	}
}

const char* WWXMLNode::getAttributeValue(const char* name)
{
	if (m_pXMLElem && NULL != name)
	{
		const char* pName = m_pXMLElem->Attribute(name);
		if (NULL == pName)
		{
			return "";
		}
		return pName;
	}
	return "";
}

void WWXMLNode::deleteAttribute(const char* name)
{
	if (m_pXMLElem)
	{
		m_pXMLElem->DeleteAttribute(name);
	}
}

void WWXMLNode::setNodeName(const char* name)
{
	if (m_pXMLElem && NULL != name)
	{
		m_pXMLElem->SetName(name);
	}
}

const char* WWXMLNode::getNodeName()
{
	if (m_pXMLElem)
	{
		const char* pName = m_pXMLElem->Name();
		if (NULL == pName)
		{
			return "";
		}
		return pName;
	}
	return "";
}

void WWXMLNode::setNodeValue(const char* value)
{
	if (m_pXMLElem && m_pXMLDocument)
	{
		tinyxml2::XMLText *pText = m_pXMLDocument->NewText(value);
		m_pXMLElem->LinkEndChild(pText);
	}
}

const char* WWXMLNode::getNodeValue()
{
	if (m_pXMLElem)
	{
		const char* pValue = m_pXMLElem->GetText();
		if (NULL == pValue)
		{
			return "";
		}
		return pValue;
	}
	return "";
}

void WWXMLNode::removeSelf()
{
	if (m_pXMLElem)
	{
		if (m_pXMLElem->Parent())
		{
			m_pXMLElem->Parent()->DeleteChild((tinyxml2::XMLNode*)m_pXMLElem);
		}
	}
}

void WWXMLNode::removeAllChildNode()
{
	if (m_pXMLElem)
	{
		m_pXMLElem->DeleteChildren();
	}
}

bool WWXMLNode::isNULL()
{
	return m_pXMLElem == NULL;
}

//////////////////////////////////////////////////////////////////////////////////////

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


bool MyXMLManager::loadXMLFile(const char* strXmlPath)
{
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

	m_pXMLDocument = new tinyxml2::XMLDocument();
	if (NULL == m_pXMLDocument)
	{
		return false;
	}

	//使用文件内容加载，直接加载可能会有兼容性问题，字符流内存需要手动释放
	std::string strXmlBuffer = CCFileUtils::getInstance()->getStringFromFile(strXmlPath);
	if (strXmlBuffer.empty())
	{
		CCLOG("WWXMLManager::%s file data is empty!", strXmlPath);
		return false;
	}

	//解析XML字符流
	if (tinyxml2::XML_SUCCESS != m_pXMLDocument->Parse(strXmlBuffer.c_str(), strXmlBuffer.length()))
	{
		CCLOG("WWXMLManager::%s Parse data error!", strXmlPath);
		return false;
	}

	return true;
}

//创建xml文件,默认为utf-8编码
bool MyXMLManager::createXMLFile(const char* strFileName, const char* rootNode /*= "root"*/)
{
	//首先置空，防止重复加载
	if (m_pXMLDocument)
	{
		delete m_pXMLDocument;
		m_pXMLDocument = NULL;
	}

	//利用tinyxml2方法创建xml文件
	tinyxml2::XMLDocument *pDoc = new tinyxml2::XMLDocument();
	if (NULL == pDoc)
	{
		return false;
	}

	bool bRet = false;
	do
	{
		tinyxml2::XMLDeclaration *pDeclaration = pDoc->NewDeclaration(NULL);
		if (NULL == pDeclaration)
		{
			bRet = false;
			break;
		}
		pDoc->LinkEndChild(pDeclaration);
		tinyxml2::XMLElement *pRootEle = pDoc->NewElement(rootNode);
		if (NULL == pRootEle)
		{
			bRet = false;
			break;
		}
		pDoc->LinkEndChild(pRootEle);

		if (tinyxml2::XML_SUCCESS != pDoc->SaveFile(strFileName))
		{
			bRet = false;
			break;
		}
		bRet = true;
	} while (0);

	if (pDoc)
	{
		delete pDoc;
	}

	//创建成功后加载
	loadXMLFile(strFileName);

	return bRet;
}

//保存文件，修改后需要调用此方法
bool MyXMLManager::saveXMLFile()
{
	if (m_pXMLDocument)
	{
		if (tinyxml2::XML_SUCCESS != m_pXMLDocument->SaveFile(m_strXMLFilePath.c_str()))
		{
			return false;
		}
	}
	return true;
}

WWXMLNode MyXMLManager::getTarChildNode(const char* node)
{
	if (NULL == m_pXMLDocument)
	{
		return NULL;
	}

	WWXMLNode itemNode(m_pXMLDocument->RootElement(), m_pXMLDocument);

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

	WWXMLNode parNode(m_pXMLDocument->RootElement(), m_pXMLDocument);

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

	WWXMLNode itemNode(m_pXMLDocument->RootElement(), m_pXMLDocument);
	//WWXMLNode itemNode = getTarChildNode(node);
	const char* root = "root";
	if (*node != *root){
		itemNode = getTarChildNode(node);
	}

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

