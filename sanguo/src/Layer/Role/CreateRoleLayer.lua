--选角界面
local CreateRoleLayer = class("CreateRoleLayer", CCLayerEx)

function CreateRoleLayer:create()   --自定义的create()创建方法
    --G_Log_Info("CreateRoleLayer:create()")
    local layer = CreateRoleLayer.new()
    return layer
end

function CreateRoleLayer:onExit()
    --G_Log_Info("CreateRoleLayer:onExit()")
    if self.curSelBtn then
        self.curSelBtn:stopAllActions()
    end
end

--初始化UI界面
function CreateRoleLayer:init()  
    --G_Log_Info("CreateRoleLayer:init()")
    local csb = cc.CSLoader:createNode("csd/CreateRoleLayer.csb")
    self:addChild(csb)
    csb:setContentSize(g_WinSize)
    ccui.Helper:doLayout(csb)
    --self:showInTheMiddle(csb)

    --阵营图标
    self.Image_Zhao = csb:getChildByName("Image_Zhao")
    self.Image_Wei = csb:getChildByName("Image_Wei")
    self.Image_Wu = csb:getChildByName("Image_Wu")
    self.Image_Shu = csb:getChildByName("Image_Shu")
    self.Image_Han = csb:getChildByName("Image_Han")

    --人物头像按钮
    self.Button_Han = csb:getChildByName("Button_Han")
    self.Button_Han:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_Zhao = csb:getChildByName("Button_Zhao")
    self.Button_Zhao:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_Shu = csb:getChildByName("Button_Shu")
    self.Button_Shu:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_Wu = csb:getChildByName("Button_Wu")
    self.Button_Wu:addTouchEventListener(handler(self,self.touchEvent))
    self.Button_Wei = csb:getChildByName("Button_Wei")
    self.Button_Wei:addTouchEventListener(handler(self,self.touchEvent))

    self.Button_Sel = csb:getChildByName("Button_Sel")
    self.Button_Sel:addTouchEventListener(handler(self,self.touchEvent))

    self.ListView_desc = csb:getChildByName("ListView_desc");
    self.descText1 = self.ListView_desc:getChildByName("descText1")
    self.descText1:setFontName(g_sDefaultTTFpath)
    self.descText2 = self.ListView_desc:getChildByName("descText2")
    self.descText2:setFontName(g_sDefaultTTFpath)

    self.curSelCampId = 1  --当前选中并放缩的阵营ID
    self.curSelBtn = self.Button_Han  --当前选中并放缩的阵营按钮
    self.lastSelBtn = nil
    self:ScaleSelBtn()
end

function CreateRoleLayer:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_Sel then
            local campData = g_pTBLMgr:getCampConfigTBLDataById(self.curSelCampId)
            if campData == nil then
                G_Log_Warning("campData = nil！")
                return
            end
            campData.population = 0   --初始人口为0

            local generalIdVec = clone(campData.generalIdVec)    --初始游戏，仅提供主角一个武将（汉灵帝、袁绍、曹操、刘备、孙坚）
            campData.generalIdVec = {}
            table.insert(campData.generalIdVec, generalIdVec[1])

            --创角之后，构建玩家数据heroXML、generalXML、BagXML等
            local bagItemVec = {
                {["itemId"] = "404", ["num"] = campData.troops},  --骑兵
                {["itemId"] = "6001", ["num"] = campData.money},  --金币
                {["itemId"] = "6002", ["num"] = campData.food},  --粮草
                {["itemId"] = "6003", ["num"] = campData.drug},  --药材
            }

            g_HeroDataMgr:SetBagXMLData(bagItemVec)   --保存玩家背包物品数据到bagXML
            g_HeroDataMgr:CreateAndInitHeroXMLData(campData)   --保存阵营信息到heroXML

            g_pGameLayer:GameMainLayer()   --进入游戏
            g_pGameLayer:RemoveChildByUId(g_GameLayerTag.LAYER_TAG_SelCampLayer)
        else
            if self.lastSelBtn and self.curSelBtn == sender then
                return
            end
            if sender == self.Button_Han then
                self.curSelCampId = 1  --当前选中并放缩的阵营ID
            elseif sender == self.Button_Zhao then
                self.curSelCampId = 2  --当前选中并放缩的阵营ID
            elseif sender == self.Button_Wei then
                self.curSelCampId = 3  --当前选中并放缩的阵营ID
            elseif sender == self.Button_Wu then
                self.curSelCampId = 4  --当前选中并放缩的阵营ID
            elseif sender == self.Button_Shu then
                self.curSelCampId = 5  --当前选中并放缩的阵营ID
            else
                return
            end

            self.lastSelBtn = self.curSelBtn
            self.curSelBtn = sender  --当前选中并放缩的阵营按钮
            self:ScaleSelBtn()
        end
    end
end
    
function CreateRoleLayer:ScaleSelBtn()
    --G_Log_Info("ScaleSelBtn(), self.curSelCampId = %d", self.curSelCampId)
    if self.lastSelBtn then
        self.lastSelBtn:stopAllActions()
        self.lastSelBtn:setScale(1.0)
    end
    if self.curSelBtn then
        --闪动放缩
        local scaleAction = cc.ScaleBy:create(0.5, 1.2)
        local SequenceAction = cc.Sequence:create(scaleAction, scaleAction:reverse())
        self.curSelBtn:runAction(cc.RepeatForever:create(SequenceAction))
    end

    local campData = g_pTBLMgr:getCampConfigTBLDataById(self.curSelCampId)
    --G_Log_Dump(campData, "campData = ")
    if campData then
        local generalIdVec = campData.generalIdVec
        local generalStr = ""
        for k, generalId in pairs(generalIdVec) do
            local heroData = g_pTBLMgr:getGeneralConfigTBLDataById(generalId)
            if heroData then
                generalStr = generalStr..heroData.name
            else
                generalStr = generalStr..generalId
            end

            if k ~= #generalIdVec then
                generalStr = generalStr..";"
            end
        end

        self.descText1:setTextAreaSize(cc.size(800, 0));
        self.descText1:setString(campData.desc)

        --"初始财政：资金%s锭  粮草%s石  药材%s副\n初始兵力：%d名骑兵\n初始将领：%s"
        local descStr = string.format(lua_SelCamp_String1, campData.money, campData.food, campData.drug, campData.troops, generalStr)
        self.descText2:setTextAreaSize(cc.size(800, 0));
        self.descText2:setString(descStr)

        self.ListView_desc:jumpToTop();
        self.ListView_desc:refreshView();
    end
end



return CreateRoleLayer
