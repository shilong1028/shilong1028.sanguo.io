--动画修改工具层

local AniToolCell = class("AniToolCell", CCLayerEx)

function AniToolCell:create()   --自定义的create()创建方法
    --G_Log_Info("AniToolCell:create()")
    local layer = AniToolCell.new()
    return layer
end

--初始化UI界面
function AniToolCell:init()  
    --G_Log_Info("AniToolCell:init()")
    local csb = cc.CSLoader:createNode("csd/aniToolCell.csb")
    self:addChild(csb)

    self.Image_bg = csb:getChildByName("Image_bg")  
    self.Image_xian = csb:getChildByName("Image_xian")      --帧线条
    self.Text_name = csb:getChildByName("Text_name")   --攻击动作、施法飞行打击特效等标签
    self.Text_zhenCount = csb:getChildByName("Text_zhenCount")   --原共n帧

    self.menuAddPos = cc.p(20, self.Image_xian:getPositionY())
    self.menuAddSize = cc.size(44,44)

    self.m_Menu = cc.Menu:create()
    self.m_Menu:setPosition(cc.p(0, 0))
    csb:addChild(self.m_Menu)

    self.TextField_4  = csb:getChildByName("TextField_4")  
    self.TextField_1  = csb:getChildByName("TextField_1") 
    self.TextField_2  = csb:getChildByName("TextField_2") 
    self.TextField_3  = csb:getChildByName("TextField_3") 

    self.m_inputString1 = ""    --文件名
    self.m_inputString2 = ""    --播放速度（毫秒）
    self.m_inputString3 = ""    --开始帧
    self.m_inputString4 = ""    --文件夹名

    local function TextFieldEvent(sender, eventType)
        self:TextFieldEvent(sender, eventType)
    end
    self.TextField_4:addEventListener(TextFieldEvent)
    self.TextField_1:addEventListener(TextFieldEvent)
    self.TextField_2:addEventListener(TextFieldEvent)
    self.TextField_3:addEventListener(TextFieldEvent)

    self.TextField_4:setCursorEnabled(true)
    self.TextField_1:setCursorEnabled(true)
    self.TextField_2:setCursorEnabled(true)
    self.TextField_3:setCursorEnabled(true)

    local function BtnPlayCallback(sender, eventType)
        self:onTouchButton(sender, eventType)
    end
    self.Button_play = csb:getChildByName("Button_play")   
    self.Button_play:addTouchEventListener(BtnPlayCallback)

    local function BtnSaveCallback(sender, eventType)
        self:onTouchButton(sender, eventType)
    end
    self.Button_save = csb:getChildByName("Button_save")   
    self.Button_save:addTouchEventListener(BtnSaveCallback)

    local function BtnResetCallback(sender, eventType)
        self:onTouchButton(sender, eventType)
    end
    self.Button_reset = csb:getChildByName("Button_reset")   
    self.Button_reset:addTouchEventListener(BtnResetCallback)

    self.aniZhenMenuVec = {}
    self.actionVec = nil
    self.m_action1OptVec = nil

    self.fullAnimPath = ""
    self.txtFullPath = ""
end

function AniToolCell:TextFieldEvent(sender, eventType)
    --G_Log_Info("AniToolCell:TextFieldEvent()")
    if eventType == ccui.TextFiledEventType.attach_with_ime then   --获得输入焦点
        --G_Log_Info("ATTACH_WITH_IME")
    elseif eventType == ccui.TextFiledEventType.detach_with_ime then   --失去输入焦点
        --G_Log_Info("DETACH_WITH_IME")
    elseif eventType == ccui.TextFiledEventType.insert_text then  --输入了文本
        --G_Log_Info("INSERT_TEXT")
    elseif eventType == ccui.TextFiledEventType.delete_backward then   --删除了文字
        --G_Log_Info("DELETE_BACKWARD")
    end
end

function AniToolCell:onTouchButton(sender, eventType)
    --G_Log_Info("AniToolCell:onTouchButton()")
    if eventType == ccui.TouchEventType.ended then  
        if sender == self.Button_save then  --保存（之后会重新播放）
            local frameVec = {}   --添加复用的帧序列集合
            local timeVec = {}    --添加复用的帧序列重复次数集合

            for i=1, self.m_action1OptVec.size do
                if self.m_action1OptVec.times[i] > 0 then
                    table.insert(frameVec, self.m_action1OptVec.frames[i])
                    table.insert(timeVec, self.m_action1OptVec.times[i])
                end
            end

            local time_ms = 100
            if self.m_inputString2 and self.m_inputString2 ~= "" then
                time_ms = tonumber(self.m_inputString2)
            end
            local aniInstance = ImodAnim:create()
            aniInstance:setExtFrameData(self.txtFullPath, frameVec, timeVec, time_ms)
        elseif sender == self.Button_play then 
            self:playAni()
        elseif sender == self.Button_reset then  --重置（放弃之前的修改）
            self:resetAniFile()                   
        end
    end
end

function AniToolCell:InitRealy(idx, target)
    --G_Log_Info("AniToolCell:InitRealy(), idx = %d", idx)
    self.cellIdx = idx
    self.target = target
    if idx == 0 then
        self.Text_name:setString("攻击动作")

        self.m_inputString4 = "Monster"
        self.TextField_4:setString("Monster")

        self.m_inputString1 = "btm101_gj"
        self.TextField_1:setString("btm101_gj")
    elseif idx == 1 then
        self.Text_name:setString("施法特效")

        self.m_inputString4 = "Skill"
        self.TextField_4:setString("Skill")

        self.m_inputString1 = "skill_1_s"
        self.TextField_1:setString("skill_1_s")
    elseif idx == 2 then
        self.Text_name:setString("飞行特效")

        self.m_inputString4 = "Skill"
        self.TextField_4:setString("Skill")

        self.m_inputString1 = "skill_1_f"
        self.TextField_1:setString("skill_1_f")
    elseif idx == 3 then
        self.Text_name:setString("打击特效")

        self.m_inputString4 = "Skill"
        self.TextField_4:setString("Skill")

        self.m_inputString1 = "skill_1_h"
        self.TextField_1:setString("skill_1_h")
    end
    self:resetAniFile(self.m_inputString1) 
end

function AniToolCell:resetAniFile(inputStr) 
    --G_Log_Info("AniToolCell:resetAniFile()")
    for i=1, #self.aniZhenMenuVec do
        local zhenMenu = self.aniZhenMenuVec[i]
        zhenMenu:removeFromParent(true)
    end 
    self.aniZhenMenuVec = {}
    self.actionVec = nil
    self.m_action1OptVec = nil

    self.fullAnimPath = ""
    self.txtFullPath = ""

    self.m_inputString2 = "100"
    self.TextField_2:setString(self.m_inputString2)
    self.m_inputString3 = "0"
    self.TextField_3:setString(self.m_inputString3)

    if inputStr and inputStr ~= "" then   --重新输入内容之后的重置
        self.m_inputString1 = inputStr
    else   --点击重置按钮之后，原文件重置
        inputStr = self.aniPathInput
        self.m_inputString1 = self.aniPathInput
        self.TextField_1:setString(self.m_inputString1)
    end

    self:initAniData(inputStr)

    self:removeAni()
end

function AniToolCell:initAniData(aniPath)   --Monster/btm1_gj
    --G_Log_Info("AniToolCell:initAniData(), aniPath = %s", aniPath)
    self.aniPathInput = aniPath
    local utfPic = self.m_inputString4.."/"..aniPath..".png"
    local utfAnim = self.m_inputString4.."/"..aniPath..".ani"
    --//读取动画文件并解析
    self.fullAnimPath = cc.FileUtils:getInstance():fullPathForFilename(utfAnim)
    if not self.fullAnimPath or self.fullAnimPath == "" then
        G_Log_Warning("self.fullAnimPath = %s", self.fullAnimPath or "nil")
        return;
    end
    local actionVec = self:getAnimActionVec(self.fullAnimPath)  
    self.actionVec = actionVec

    if actionVec then
        local firstActionOpt = actionVec[1]   --可能包含多个方向，调整一个方向后其他方向同样适用
        self.m_action1OptVec = firstActionOpt

        local frameCount = #firstActionOpt.frames
        self.m_action1OptVec.size = frameCount
    
        self.Text_zhenCount:setString("原共"..frameCount.."帧")
    --[[
    function  extActionOpt:ctor()
        self.size = 0;
        self.frames = {};
        self.durations = {};
        --self.flags = {};   --//标志是原动画文件中的动作帧0，还是附加的重复动作帧1
        self.times = {};   --重复次数，0为原帧，>0则表示在原帧之后，重复n次
    end
    ]]
        for i=1, #firstActionOpt.frames do
            local frameIdx = firstActionOpt.frames[i]
            --local flag = firstActionOpt.frames[i]
            local count = firstActionOpt.times[i]

            local menuTag = 300 + i
            self:createAddMenu(0, menuTag, frameIdx)

            if count == 0 then  --原动画文件中的动作帧
            elseif count > 0 then   --附加的重复动作帧n个
                for j=1, count do
                    menuTag = 400 + i
                    self:createAddMenu(1, menuTag)
                end
            end
        end 

        self:resetAddMenuPos()
    end
end

function AniToolCell:playAni()
    --G_Log_Info("AniToolCell:playAni()")
    local beginZhenIdx = 0
    if self.m_inputString3 and self.m_inputString3 ~= "" then
        beginZhenIdx = tonumber(self.m_inputString3)
    end
    local offset = 0
    for i=1, self.m_action1OptVec.size do
        if beginZhenIdx >= i and self.m_action1OptVec.times[i] > 0 then
            offset = offset + self.m_action1OptVec.times[i]
        else
            break;
        end
    end
    beginZhenIdx = beginZhenIdx + offset

    local time_ms = 100
    if self.m_inputString2 and self.m_inputString2 ~= "" then
        time_ms = tonumber(self.m_inputString2)
    end

    local aniPath = self.m_inputString4.."/"..self.aniPathInput
    self.target:playAni(beginZhenIdx, self.cellIdx, aniPath, time_ms)
end

function AniToolCell:removeAni()
    --G_Log_Info("AniToolCell:removeAni()")
    self.target:removeAni(self.cellIdx)
end

function AniToolCell:onTouchMenu(tag, pSender)
    --G_Log_Info("AniToolCell:onTouchMenu(), tag = %d", tag)  
    if tag >= 301  and tag < 400 then   --加帧
        local oldFrameIdx = tag - 300
        local count = self.m_action1OptVec.times[oldFrameIdx]
        self.m_action1OptVec.times[oldFrameIdx] = count + 1

        local menuTag = 400 + oldFrameIdx
        self:createAddMenu(1, menuTag, -1, pSender)
        self:resetAddMenuPos()
    elseif tag >= 401 then  --减帧
        local addFrameIdx = tag - 400    --self.m_action1OptVec.frames索引位置的帧
        local count = self.m_action1OptVec.times[addFrameIdx]
        if count > 1 then
            self.m_action1OptVec.times[addFrameIdx] = count - 1
        else
            self.m_action1OptVec.times[addFrameIdx] = 0
        end

        for i=2, #self.aniZhenMenuVec do
            if self.aniZhenMenuVec[i] == pSender then
                pSender:removeFromParent(true)
                table.remove(self.aniZhenMenuVec, i)
                self:resetAddMenuPos()
                break;
            end
        end
    end
end

function AniToolCell:createAddMenu(flag, menuTag, frameId, pSender)  --标志是原动画文件中的动作帧0，还是附加的重复动作帧1
    --G_Log_Info("AniToolCell:createAddMenu(), flag = %d, menuTag = %d", flag, menuTag)
    local menuStr = "aniTool_add.png"
    if flag == 1 then
        menuStr = "aniTool_jian.png"
    end

    local function addMenuCallBack(tag,sender) 
        self:onTouchMenu(tag,sender)
    end

    local sr = cc.Sprite:createWithSpriteFrameName(menuStr) 
    local zhenMenu = cc.MenuItemSprite:create(sr,sr) 
    zhenMenu:setAnchorPoint(cc.p(0.5,0.5)) 
    zhenMenu:setPosition(self.menuAddPos)    
    zhenMenu:registerScriptTapHandler(addMenuCallBack)
    zhenMenu:setScale(0.5)
    self.m_Menu:addChild(zhenMenu,10,menuTag) 

    if flag == 0 then
        self:createLabelToMenu(frameId, zhenMenu)
    end

    if pSender == nil then
        table.insert(self.aniZhenMenuVec, zhenMenu)
    else
        for i=1, #self.aniZhenMenuVec do
            if self.aniZhenMenuVec[i] == pSender then
                table.insert(self.aniZhenMenuVec, i+1, zhenMenu)
                break;
            end
        end
    end
end

function AniToolCell:createLabelToMenu(idx, menu)
    --G_Log_Info("AniToolCell:createLabelToMenu(), idx = %d", idx)
    local numlable = cc.Label:createWithTTF(tostring(idx), g_sDefaultTTFpath, 20)
    numlable:setAnchorPoint(cc.p(0.5 , 0))
    numlable:setPosition(cc.p(self.menuAddSize.width/2 , self.menuAddSize.height+5))
    menu:addChild(numlable)
end

function AniToolCell:resetAddMenuPos()
    --G_Log_Info("AniToolCell:resetAddMenuPos()")
    for i=1, #self.aniZhenMenuVec do
        local zhenMenu = self.aniZhenMenuVec[i]
        zhenMenu:setPosition(cc.p(self.menuAddPos.x + 22*(i-1), self.menuAddPos.y))
    end
end

function AniToolCell:getAnimActionVec(utfAnim)
    --G_Log_Info("AniToolCell:getAnimActionVec()")
    --//读取动画的额外数据 begin-------------------------------LogUI/he1
    local off_txt = string.find(utfAnim, ".ani");   
    local pathTxt = "";
    if (off_txt > 1)then
        pathTxt = string.sub(utfAnim, 1, off_txt-1).. ".dat";  
    end

    self.txtFullPath = pathTxt

    --//重置动画的额外数据
    local TxtVec = {};  --//动画的额外数据
    TxtVec.txtPath = pathTxt;
    TxtVec.durTime = 0.1;  --//默认值
    TxtVec.size = 0;
    TxtVec.frameIdx = {};
    TxtVec.times = {};

    local FrameIdx = 1;   --//额外复用的帧下次待插入帧动画数据的帧索引在TxtVec.frameIdx中的索引

    local txtStream = ark_Stream:new()
    txtStream:CreateReadStreamFromSelf(pathTxt)

    local durTime = txtStream:ReadUInt()  --//动画播放时间（保存为毫秒数）
    if not durTime or durTime <= 0 then
        durTime = 100   --默认100毫秒
    end
    self.m_inputString2 = ""..durTime
    self.TextField_2:setString(self.m_inputString2)
    TxtVec.durTime = durTime / 1000;   --//动画播放时间（保存为毫秒数）
    extFrameDurtionTime = TxtVec.durTime;   --//动画播放帧间隔时间

    TxtVec.size = txtStream:ReadByte();    --//额外复用的帧总数量

    for i=1, TxtVec.size do
        local idx = txtStream:ReadShort();       --//额外复用的帧索引（从小到大依次排序）
        local times = txtStream:ReadShort();    --//额外复用的帧索引对应的帧重复次数

        table.insert(TxtVec.frameIdx, idx);
        table.insert(TxtVec.times, times);
    end

    --//读取动画文件并解析
    local aniStream = ark_Stream:new()
    aniStream:CreateReadStreamFromSelf(utfAnim)

    --//读取模块数据（帧图片数据，每帧两幅图片）
    local moduleNum = aniStream:ReadByte();
    for i=1,  moduleNum do
        local sx = aniStream:ReadShort();
        local sy = aniStream:ReadShort();
        local w = aniStream:ReadShort();
        local h = aniStream:ReadShort();
    end

    --//读取帧数据
    local frameNum = aniStream:ReadByte();
    for i=1, frameNum do
        local moduleLen = aniStream:ReadByte();
        if(moduleLen < 2)then
        else
            print("moduleLen > 2")
        end
        for c=1, moduleLen do
            local sx = aniStream:ReadShort();
            local sy = aniStream:ReadShort();
            local module_id = aniStream:ReadByte();
            local flag = aniStream:ReadByte();
        end
    end

    --//读取动作数据
    local actionVec = {};
    local actionNum = aniStream:ReadByte();
    for i=1, actionNum do
        local ma = g_ImodAnim_ActionOpt:new()
        --[[
        function  g_ImodAnim_ActionOpt:ctor()
            self.size = 0;
            self.frames = {};
            self.durations = {};
            --self.flags = {};   --//标志是原动画文件中的动作帧0，还是附加的重复动作帧1
            self.times = {};   --重复次数，0为原帧，>0则表示在原帧之后，重复n次
        end
        ]]

        local len = aniStream:ReadByte();
        ma.size = len;
        for c=1, len do
            local frame = aniStream:ReadByte();
            local duration = aniStream:ReadByte();
            table.insert(ma.frames, frame);
            table.insert(ma.durations, duration);
            --table.insert(ma.flags, 0);
            local times = 0
        
            if (TxtVec.size >0 and FrameIdx <= len and FrameIdx <= #TxtVec.frameIdx)then
                local txtFrameIdx = TxtVec.frameIdx[FrameIdx];  --//额外复用的帧下次待插入帧动画数据的帧索引
                if (txtFrameIdx == frame) then   --//存在额外重复帧数据，且当前帧即为重复帧，则插入数据
                    local counts = TxtVec.times[FrameIdx];
                    -- ma.size = ma.size + counts;
                    -- for j=1, counts do
                    --  table.insert(ma.frames, frame);
                    --  table.insert(ma.durations, duration);
                    --  table.insert(ma.flags, 1);
                    -- end

                    times = counts
                    FrameIdx = FrameIdx + 1
                end
            end
            table.insert(ma.times, times);
        end
        table.insert(actionVec, ma);
    end

    return actionVec;
end


return AniToolCell
