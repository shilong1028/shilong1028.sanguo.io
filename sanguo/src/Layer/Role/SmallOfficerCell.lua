--小头像信息Cell

local SmallOfficerCell = class("SmallOfficerCell", CCLayerEx)

function SmallOfficerCell:create()   --自定义的create()创建方法
    --G_Log_Info("SmallOfficerCell:create()")
    local layer = SmallOfficerCell.new()
    return layer
end

--初始化UI界面
function SmallOfficerCell:init()  
    --G_Log_Info("SmallOfficerCell:init()")
    local csb = cc.CSLoader:createNode("csd/SmallOfficerCell.csb")
    self:addChild(csb)
    self:setContentSize(cc.size(90, 100))

    --self:setTouchEnabled(true)

    self.Image_bg = csb:getChildByName("Image_bg")  
    self.Image_sel = csb:getChildByName("Image_sel")
    self.Image_sel:setVisible(false)
    self.Image_color = csb:getChildByName("Image_color")   --品质，游击1-3/轻装4-10/重装11-25/精锐26-50/禁卫51-99

    self.Image_bg:setTouchEnabled(true)    --要想可点击响应，必须设置listView:setTouchEnabled(true)
    self.Image_bg:addTouchEventListener(handler(self,self.touchEvent))

    self.Image_type = csb:getChildByName("Image_type")    --兵种
    self.Text_name = csb:getChildByName("Text_name")      --名称&Lv
    self.Text_num = csb:getChildByName("Text_num")   -- 兵力
    self.Text_type = csb:getChildByName("Text_type")   --熟练度S/A/B/C/D
end

function SmallOfficerCell:setBgImgTouchEnabled(bEnabled)
    self.Image_bg:setTouchEnabled(bEnabled) 
end

function SmallOfficerCell:onTouchEnded(touch, event)
    G_Log_Info("SmallOfficerCell:onTouchEnded()")
end

function SmallOfficerCell:setSelCallBack(callFunc)
    self.SelCallBackFunc = callFunc or nil   --点击选中回调
end

function SmallOfficerCell:showSelEffect(bSel)
    self.Image_sel:setVisible(bSel)
end

function SmallOfficerCell:initData(generalData, tagIdx, callFunc)  
    --G_Log_Info("SmallOfficerCell:initData()")
    self.generalData = generalData
    self.tagIdx = tagIdx or -1
    self.SelCallBackFunc = callFunc or nil   --点击选中回调

    local bgSize = self.Image_bg:getContentSize()
    if not self.headImg then
        self.headImg =  ccui.ImageView:create(string.format("Head/%s.png", generalData.id_str), ccui.TextureResType.localType)
        self.headImg:setScale(bgSize.width/self.headImg:getContentSize().width)
        self.headImg:setPosition(cc.p(bgSize.width/2, bgSize.height/2))
        self.Image_bg:addChild(self.headImg)
    end

    self.Text_name:setString(generalData.name.."Lv"..generalData.level)    --名称&Lv

    self.Text_num:setString(string.format(lua_Role_String1, 0))    -- 兵力

    self.Text_type:setString("A")    --熟练度S/A/B/C/D

    local colorIdx = G_GetGeneralColorIdxByLv(generalData.level)
    if colorIdx > 0 and colorIdx <=5 then
        self.Image_color:setVisible(true)
        self.Image_color:loadTexture(string.format("public_colorBg%d.png", colorIdx), ccui.TextureResType.plistType)
    else
        self.Image_color:setVisible(false)
    end

    local typeStr = "public_daobing.png"
    if generalData.bingTypeVec[1] == "10001" then   --轻装|重装|精锐|羽林品质的骑兵|枪戟兵|刀剑兵|弓弩兵等共16种
        typeStr = "public_daobing.png"
    elseif generalData.bingTypeVec[1] == "10002" then
        typeStr = "public_qiangbing.png"
    elseif generalData.bingTypeVec[1] == "10003" then
        typeStr = "public_qibing.png"
    elseif generalData.bingTypeVec[1] == "10004" then
        typeStr = "public_gongbing.png"
    end

    self.Image_type:loadTexture(string.format("Head/%s.png", typeStr), ccui.TextureResType.localType)
end

function SmallOfficerCell:touchEvent(sender, eventType)
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Image_bg then   
            if self.SelCallBackFunc ~= nil then
                self.SelCallBackFunc(self, self.tagIdx)
            end
        end
    end
end

return SmallOfficerCell
