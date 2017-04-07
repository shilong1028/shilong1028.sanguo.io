
--主菜单层
local MainMenuLayer = class("MainMenuLayer", CCLayerEx)  --填入类名

function MainMenuLayer:create()    --自定义的create()创建方法
    --G_Log_Info("MainMenuLayer:create()")
    local layer = MainMenuLayer.new()
    return layer
end

function MainMenuLayer:onExit()
    --G_Log_Info("MainMenuLayer:onExit()")
end

--初始化UI界面
function MainMenuLayer:init()  
    --G_Log_Info("MainMenuLayer:init()")
    self:setSwallowTouches(false)

    local csb = cc.CSLoader:createNode("csd/MainMenuLayer.csb")
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    self:addChild(csb)

    --左上角，玩家头像等节点
    local FileNode_head = csb:getChildByName("FileNode_head")
    self.head_icon = FileNode_head:getChildByName("head_icon")   --玩家头像
    self.Button_chongzhi = FileNode_head:getChildByName("Button_chongzhi")   --充值按钮
    self.Button_chongzhi:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_qiandao = FileNode_head:getChildByName("Button_qiandao")
    self.Button_qiandao:addTouchEventListener(handler(self,self.touchEvent))   --连续签到按钮
    self.Button_libao = FileNode_head:getChildByName("Button_libao")     --在线礼包
    self.Button_libao:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_huodong = FileNode_head:getChildByName("Button_huodong")   --精彩活动
    self.Button_huodong:addTouchEventListener(handler(self,self.touchEvent))
    self.Text_nick = FileNode_head:getChildByName("Text_nick")    --玩家昵称
    self.Text_vip = FileNode_head:getChildByName("Text_vip")    --VIP等级
    self.BtnVipAdd = FileNode_head:getChildByName("BtnVipAdd")   --提高VIP等级按钮
    self.BtnVipAdd:addTouchEventListener(handler(self,self.touchEvent))

    --中间钱粮显示节点
    local FileNode_top = csb:getChildByName("FileNode_top")  
    self.Button_glod = FileNode_top:getChildByName("Button_glod")   --元宝添加
    self.Button_glod:addTouchEventListener(handler(self,self.touchEvent))
    self.Text_glod = FileNode_top:getChildByName("Text_glod")   --元宝数量
    self.Text_bi = FileNode_top:getChildByName("Text_bi")    --钱贯数量 1元宝 = 1000 贯
    self.Button_liang = FileNode_top:getChildByName("Button_liang")   --粮草添加
    self.Button_liang:addTouchEventListener(handler(self,self.touchEvent))
    self.Text_liang = FileNode_top:getChildByName("Text_liang")   --粮草数量 担
    self.Text_mi = FileNode_top:getChildByName("Text_mi")   --粮草斤数 1担 = 1000 斤

    --右上角 时间节点
    local FileNode_time = csb:getChildByName("FileNode_time")
    self.Text_time = FileNode_time:getChildByName("Text_time")   --纪年时间
    self.Button_renwu = FileNode_time:getChildByName("Button_renwu")   --任务按钮
    self.Button_renwu:addTouchEventListener(handler(self,self.touchEvent))
    self.Panel_renwu = FileNode_time:getChildByName("Panel_renwu")    --任务内容面板
    self.renWuListView = self.Panel_renwu:getChildByName("ListView")   --任务列表
    self.renWuButton_push = self.Panel_renwu:getChildByName("Button_push")  --任务列表收放按钮
    self.renWuButton_push:addTouchEventListener(handler(self,self.touchEvent))

    --左下角，聊天节点
    local FileNode_chat = csb:getChildByName("FileNode_chat")
    self.Panel_chat = FileNode_chat:getChildByName("Panel_chat")    --聊天面板
    self.chatListView = self.Panel_chat:getChildByName("ListView")   --聊天列表
    self.Button_chat = self.Panel_chat:getChildByName("Button_chat")  --聊天按钮
    self.Button_chat:addTouchEventListener(handler(self,self.touchEvent))
    self.chatButton_push = self.Panel_chat:getChildByName("Button_push")   --聊天列表收放按钮
    self.chatButton_push:addTouchEventListener(handler(self,self.touchEvent))

    --右下角 切换节点
    local FileNode_bottom = csb:getChildByName("FileNode_bottom")
    self.Button_zhucheng = FileNode_bottom:getChildByName("Button_zhucheng")   --主城/地图切换按钮
    self.Button_zhucheng:addTouchEventListener(handler(self,self.touchEvent))
    self.Image_zhucheng = self.Button_zhucheng:getChildByName("Image_zhucheng")  --主城/地图图标
    self.Button_jingji = FileNode_bottom:getChildByName("Button_jingji")   --竞技场按钮
    self.Button_jingji:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_peiyang = FileNode_bottom:getChildByName("Button_peiyang")  --士兵培养按钮
    self.Button_peiyang:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_beibao = FileNode_bottom:getChildByName("Button_beibao")   --背包武库按钮
    self.Button_beibao:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_jiangling = FileNode_bottom:getChildByName("Button_jiangling")   --将领部队按钮
    self.Button_jiangling:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_lianmeng = FileNode_bottom:getChildByName("Button_lianmeng")   --联盟按钮
    self.Button_lianmeng:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_shejiao = FileNode_bottom:getChildByName("Button_shejiao")    --社交好友按钮
    self.Button_shejiao:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_shezhi = FileNode_bottom:getChildByName("Button_shezhi")    --设置按钮
    self.Button_shezhi:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_shangcheng = FileNode_bottom:getChildByName("Button_shangcheng")   --商城按钮
    self.Button_shangcheng:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_junqing = FileNode_bottom:getChildByName("Button_junqing")   --军情按钮
    self.Button_junqing:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_gonggao = FileNode_bottom:getChildByName("Button_gonggao")   --公告按钮
    self.Button_gonggao:addTouchEventListener(handler(self,self.touchEvent))

end

function MainMenuLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_chongzhi then   --充值
            local myXML = MyXMLManager:new()
            myXML:createXMLFile("myXML.xml", "root")
            myXML:addChildNode("firstNode")
            myXML:setNodeAttrValue("firstNode", "flag", "testValue")
            myXML:setNodeAttrValue("firstNode", "flag2", "2testValue")
            myXML:addChildNode("firstNode-secondNode")
            myXML:setNodeAttrValue("firstNode-secondNode", "test", "tValue")
            myXML:setNodeAttrValue("firstNode-secondNode", "test2", "2tValue")
            myXML:saveXMLFile()
            g_pGameLayer:ShowScrollTips("充值")
        elseif sender == self.Button_qiandao then  --连续签到
            local myXML = MyXMLManager:new()
            myXML:loadXMLFile("myXML.xml")
            local ret = myXML:getNodeAttrValue("firstNode-secondNode", "test2")
            g_pGameLayer:ShowScrollTips("连续签到 ret = "..ret)
        elseif sender == self.Button_libao then    --在线礼包
        elseif sender == self.Button_huodong then   --精彩活动
            local strXmlBuffer = cc.FileUtils:getInstance():getStringFromFile("myXML.xml")
            g_pGameLayer:ShowScrollTips("精彩活动 = "..strXmlBuffer, nil, nil, cc.size(200, 100))
        elseif sender == self.BtnVipAdd then    --添加VIP等级
        elseif sender == self.Button_glod then   --元宝添加
        elseif sender == self.Button_liang then   --粮草添加
        elseif sender == self.Button_renwu then   --任务
        elseif sender == self.renWuButton_push then  --任务列表收放
        elseif sender == self.Button_chat then   --聊天
        elseif sender == self.chatButton_push then  --聊天列表收放
        elseif sender == self.Button_zhucheng then  --主城/地图切换
            local mainCityLayer = g_pGameLayer:GetLayerByUId(g_GameLayerTag.LAYER_TAG_MAINCITY)
            if mainCityLayer then
                if mainCityLayer:isVisible() == true then
                    mainCityLayer:setVisible(false)
                else
                    mainCityLayer:setVisible(true)
                end
            end
        elseif sender == self.Button_jingji then   --竞技场
        elseif sender == self.Button_peiyang then  --士兵培养
        elseif sender == self.Button_beibao then   --背包武库
        elseif sender == self.Button_jiangling then  --将领部队
        elseif sender == self.Button_lianmeng then   --联盟
        elseif sender == self.Button_shejiao then   --社交好友
        elseif sender == self.Button_shezhi then   --设置
        elseif sender == self.Button_shangcheng then  --商城
        elseif sender == self.Button_junqing then   --军情
        elseif sender == self.Button_gonggao then   --公告
        end
    end
end

return MainMenuLayer
