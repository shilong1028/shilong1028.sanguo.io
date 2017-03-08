<GameFile>
  <PropertyGroup Name="LoginLayer" Type="Layer" ID="0c62e9f5-0d6e-42b0-ba74-5b0da8936d1d" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="11" ctype="GameLayerObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="LoginBg" ActionTag="678598944" Tag="22" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" TouchEnable="True" LeftEage="316" RightEage="316" TopEage="211" BottomEage="211" Scale9OriginX="316" Scale9OriginY="211" Scale9Width="648" Scale9Height="298" ctype="ImageViewObjectData">
            <Size X="1280.0000" Y="720.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="360.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="1.0000" Y="1.0000" />
            <FileData Type="Normal" Path="img/studio_loginBg.png" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="Text_title" ActionTag="-656111089" Tag="13" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="494.0000" RightMargin="494.0000" TopMargin="105.0001" BottomMargin="536.9999" FontSize="72" LabelText="汉末英雄" OutlineSize="5" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="294.0000" Y="82.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="575.9999" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="165" B="0" />
            <PrePosition X="0.5000" Y="0.8000" />
            <PreSize X="0.2281" Y="0.1083" />
            <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
            <OutlineColor A="255" R="0" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="nameBg" Visible="False" ActionTag="870069861" Tag="16" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="390.0000" RightMargin="390.0000" TopMargin="432.4000" BottomMargin="57.6000" Scale9Enable="True" LeftEage="72" RightEage="200" TopEage="40" BottomEage="40" Scale9OriginX="72" Scale9OriginY="40" Scale9Width="59" Scale9Height="20" ctype="ImageViewObjectData">
            <Size X="500.0000" Y="230.0000" />
            <Children>
              <AbstractNodeData Name="inputBg" ActionTag="2055389467" Tag="19" IconVisible="False" LeftMargin="165.0000" RightMargin="35.0000" TopMargin="25.0000" BottomMargin="155.0000" Scale9Enable="True" LeftEage="68" RightEage="68" TopEage="10" BottomEage="10" Scale9OriginX="68" Scale9OriginY="10" Scale9Width="73" Scale9Height="12" ctype="ImageViewObjectData">
                <Size X="300.0000" Y="50.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="165.0000" Y="180.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.3300" Y="0.7826" />
                <PreSize X="0.6000" Y="0.2174" />
                <FileData Type="PlistSubImage" Path="public_inputBg.png" Plist="plist/PublicRes.plist" />
              </AbstractNodeData>
              <AbstractNodeData Name="TextField" ActionTag="-1967125145" Tag="21" IconVisible="False" LeftMargin="170.0000" RightMargin="40.0000" TopMargin="32.5000" BottomMargin="162.5000" TouchEnable="True" FontSize="32" IsCustomSize="True" LabelText="" PlaceHolderText="输入用户名(6-10位)" MaxLengthText="10" ctype="TextFieldObjectData">
                <Size X="290.0000" Y="35.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="170.0000" Y="180.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="77" G="77" B="77" />
                <PrePosition X="0.3400" Y="0.7826" />
                <PreSize X="0.5800" Y="0.1522" />
              </AbstractNodeData>
              <AbstractNodeData Name="Text_name" ActionTag="-884279106" Tag="17" IconVisible="False" LeftMargin="32.0000" RightMargin="345.0000" TopMargin="32.0000" BottomMargin="162.0000" FontSize="36" LabelText="用户名：" OutlineSize="2" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="123.0000" Y="36.0000" />
                <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                <Position X="155.0000" Y="180.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="165" B="0" />
                <PrePosition X="0.3100" Y="0.7826" />
                <PreSize X="0.2460" Y="0.1565" />
                <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
                <OutlineColor A="255" R="101" G="9" B="9" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="inputBg_psw" ActionTag="-913996595" Tag="11" IconVisible="False" LeftMargin="165.0000" RightMargin="35.0000" TopMargin="85.0000" BottomMargin="95.0000" Scale9Enable="True" LeftEage="68" RightEage="68" TopEage="10" BottomEage="10" Scale9OriginX="68" Scale9OriginY="10" Scale9Width="73" Scale9Height="12" ctype="ImageViewObjectData">
                <Size X="300.0000" Y="50.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="165.0000" Y="120.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.3300" Y="0.5217" />
                <PreSize X="0.6000" Y="0.2174" />
                <FileData Type="PlistSubImage" Path="public_inputBg.png" Plist="plist/PublicRes.plist" />
              </AbstractNodeData>
              <AbstractNodeData Name="Text_psw" ActionTag="870887142" Tag="12" IconVisible="False" LeftMargin="68.0000" RightMargin="345.0000" TopMargin="92.0000" BottomMargin="102.0000" FontSize="36" LabelText="密码：" OutlineSize="2" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="87.0000" Y="36.0000" />
                <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                <Position X="155.0000" Y="120.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="165" B="0" />
                <PrePosition X="0.3100" Y="0.5217" />
                <PreSize X="0.1740" Y="0.1565" />
                <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
                <OutlineColor A="255" R="101" G="9" B="9" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="TextField_psw" ActionTag="-1148880803" Tag="13" IconVisible="False" LeftMargin="170.0000" RightMargin="40.0000" TopMargin="92.5000" BottomMargin="102.5000" TouchEnable="True" FontSize="32" IsCustomSize="True" LabelText="" PlaceHolderText="输入密码(6-10位)" MaxLengthText="10" ctype="TextFieldObjectData">
                <Size X="290.0000" Y="35.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="170.0000" Y="120.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="77" G="77" B="77" />
                <PrePosition X="0.3400" Y="0.5217" />
                <PreSize X="0.5800" Y="0.1522" />
              </AbstractNodeData>
              <AbstractNodeData Name="loginBtn" ActionTag="1990183117" Tag="20" IconVisible="False" LeftMargin="272.5000" RightMargin="72.5000" TopMargin="147.5000" BottomMargin="17.5000" TouchEnable="True" FontSize="30" ButtonText="登录" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="125" Scale9Height="43" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="155.0000" Y="65.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="350.0000" Y="50.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7000" Y="0.2174" />
                <PreSize X="0.3100" Y="0.2826" />
                <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
                <TextColor A="255" R="255" G="165" B="0" />
                <NormalFileData Type="PlistSubImage" Path="public_btn_green1.png" Plist="plist/PublicRes.plist" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="registerBtn" ActionTag="1853730019" Tag="10" IconVisible="False" LeftMargin="72.5000" RightMargin="272.5000" TopMargin="147.5000" BottomMargin="17.5000" TouchEnable="True" FontSize="30" ButtonText="注册" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="125" Scale9Height="43" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="155.0000" Y="65.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="150.0000" Y="50.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.3000" Y="0.2174" />
                <PreSize X="0.3100" Y="0.2826" />
                <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
                <TextColor A="255" R="255" G="165" B="0" />
                <NormalFileData Type="PlistSubImage" Path="public_btn_green1.png" Plist="plist/PublicRes.plist" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" />
            <Position X="640.0000" Y="57.6000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.0800" />
            <PreSize X="0.3906" Y="0.3194" />
            <FileData Type="Normal" Path="img/studio_listBg.png" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="registerBg" Visible="False" ActionTag="-754183013" Tag="14" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="390.0000" RightMargin="390.0000" TopMargin="372.4000" BottomMargin="57.6000" Scale9Enable="True" LeftEage="72" RightEage="200" TopEage="40" BottomEage="40" Scale9OriginX="72" Scale9OriginY="40" Scale9Width="59" Scale9Height="20" ctype="ImageViewObjectData">
            <Size X="500.0000" Y="290.0000" />
            <Children>
              <AbstractNodeData Name="inputBg" ActionTag="-982119993" Tag="15" IconVisible="False" LeftMargin="165.0000" RightMargin="35.0000" TopMargin="25.0000" BottomMargin="215.0000" Scale9Enable="True" LeftEage="68" RightEage="68" TopEage="10" BottomEage="10" Scale9OriginX="68" Scale9OriginY="10" Scale9Width="73" Scale9Height="12" ctype="ImageViewObjectData">
                <Size X="300.0000" Y="50.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="165.0000" Y="240.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.3300" Y="0.8276" />
                <PreSize X="0.6000" Y="0.1724" />
                <FileData Type="PlistSubImage" Path="public_inputBg.png" Plist="plist/PublicRes.plist" />
              </AbstractNodeData>
              <AbstractNodeData Name="TextField" ActionTag="590445907" Tag="16" IconVisible="False" LeftMargin="170.0000" RightMargin="40.0000" TopMargin="32.5000" BottomMargin="222.5000" TouchEnable="True" FontSize="32" IsCustomSize="True" LabelText="" PlaceHolderText="输入用户名(6-10位)" MaxLengthText="10" ctype="TextFieldObjectData">
                <Size X="290.0000" Y="35.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="170.0000" Y="240.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="77" G="77" B="77" />
                <PrePosition X="0.3400" Y="0.8276" />
                <PreSize X="0.5800" Y="0.1207" />
              </AbstractNodeData>
              <AbstractNodeData Name="Text_name" ActionTag="-216137564" Tag="17" IconVisible="False" LeftMargin="32.0000" RightMargin="345.0000" TopMargin="32.0000" BottomMargin="222.0000" FontSize="36" LabelText="用户名：" OutlineSize="2" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="123.0000" Y="36.0000" />
                <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                <Position X="155.0000" Y="240.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="165" B="0" />
                <PrePosition X="0.3100" Y="0.8276" />
                <PreSize X="0.2460" Y="0.1241" />
                <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
                <OutlineColor A="255" R="101" G="9" B="9" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="inputBg_psw" ActionTag="-703473624" Tag="18" IconVisible="False" LeftMargin="165.0000" RightMargin="35.0000" TopMargin="85.0000" BottomMargin="155.0000" Scale9Enable="True" LeftEage="68" RightEage="68" TopEage="10" BottomEage="10" Scale9OriginX="68" Scale9OriginY="10" Scale9Width="73" Scale9Height="12" ctype="ImageViewObjectData">
                <Size X="300.0000" Y="50.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="165.0000" Y="180.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.3300" Y="0.6207" />
                <PreSize X="0.6000" Y="0.1724" />
                <FileData Type="PlistSubImage" Path="public_inputBg.png" Plist="plist/PublicRes.plist" />
              </AbstractNodeData>
              <AbstractNodeData Name="Text_psw" ActionTag="-1719357824" Tag="19" IconVisible="False" LeftMargin="68.0000" RightMargin="345.0000" TopMargin="92.0000" BottomMargin="162.0000" FontSize="36" LabelText="密码：" OutlineSize="2" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="87.0000" Y="36.0000" />
                <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                <Position X="155.0000" Y="180.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="165" B="0" />
                <PrePosition X="0.3100" Y="0.6207" />
                <PreSize X="0.1740" Y="0.1241" />
                <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
                <OutlineColor A="255" R="101" G="9" B="9" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="TextField_psw" ActionTag="1758775655" Tag="20" IconVisible="False" LeftMargin="170.0000" RightMargin="40.0000" TopMargin="92.5000" BottomMargin="162.5000" TouchEnable="True" FontSize="32" IsCustomSize="True" LabelText="" PlaceHolderText="输入密码(6-10位)" MaxLengthText="10" ctype="TextFieldObjectData">
                <Size X="290.0000" Y="35.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="170.0000" Y="180.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="77" G="77" B="77" />
                <PrePosition X="0.3400" Y="0.6207" />
                <PreSize X="0.5800" Y="0.1207" />
              </AbstractNodeData>
              <AbstractNodeData Name="backBtn" ActionTag="-276789807" Tag="21" IconVisible="False" LeftMargin="272.5000" RightMargin="72.5000" TopMargin="207.5000" BottomMargin="17.5000" TouchEnable="True" FontSize="30" ButtonText="返回" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="125" Scale9Height="43" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="155.0000" Y="65.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="350.0000" Y="50.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7000" Y="0.1724" />
                <PreSize X="0.3100" Y="0.2241" />
                <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
                <TextColor A="255" R="255" G="165" B="0" />
                <NormalFileData Type="PlistSubImage" Path="public_btn_red1.png" Plist="plist/PublicRes.plist" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="registerBtn" ActionTag="-666086215" Tag="22" IconVisible="False" LeftMargin="72.5000" RightMargin="272.5000" TopMargin="207.5000" BottomMargin="17.5000" TouchEnable="True" FontSize="30" ButtonText="注册" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="125" Scale9Height="43" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="155.0000" Y="65.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="150.0000" Y="50.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.3000" Y="0.1724" />
                <PreSize X="0.3100" Y="0.2241" />
                <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
                <TextColor A="255" R="255" G="165" B="0" />
                <NormalFileData Type="PlistSubImage" Path="public_btn_green1.png" Plist="plist/PublicRes.plist" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="inputBg_psw2" ActionTag="-116299162" Tag="23" IconVisible="False" LeftMargin="165.0000" RightMargin="35.0000" TopMargin="145.0000" BottomMargin="95.0000" Scale9Enable="True" LeftEage="68" RightEage="68" TopEage="10" BottomEage="10" Scale9OriginX="68" Scale9OriginY="10" Scale9Width="73" Scale9Height="12" ctype="ImageViewObjectData">
                <Size X="300.0000" Y="50.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="165.0000" Y="120.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.3300" Y="0.4138" />
                <PreSize X="0.6000" Y="0.1724" />
                <FileData Type="PlistSubImage" Path="public_inputBg.png" Plist="plist/PublicRes.plist" />
              </AbstractNodeData>
              <AbstractNodeData Name="Text_psw2" ActionTag="1648713780" Tag="24" IconVisible="False" LeftMargin="22.0000" RightMargin="345.0000" TopMargin="155.0000" BottomMargin="105.0000" FontSize="30" LabelText="确认密码：" OutlineSize="2" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="133.0000" Y="30.0000" />
                <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                <Position X="155.0000" Y="120.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="165" B="0" />
                <PrePosition X="0.3100" Y="0.4138" />
                <PreSize X="0.2660" Y="0.1034" />
                <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
                <OutlineColor A="255" R="101" G="9" B="9" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="TextField_psw2" ActionTag="1802185358" Tag="25" IconVisible="False" LeftMargin="170.0000" RightMargin="40.0000" TopMargin="152.5000" BottomMargin="102.5000" TouchEnable="True" FontSize="32" IsCustomSize="True" LabelText="" PlaceHolderText="重复输入密码" MaxLengthText="10" ctype="TextFieldObjectData">
                <Size X="290.0000" Y="35.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="170.0000" Y="120.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="77" G="77" B="77" />
                <PrePosition X="0.3400" Y="0.4138" />
                <PreSize X="0.5800" Y="0.1207" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" />
            <Position X="640.0000" Y="57.6000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.0800" />
            <PreSize X="0.3906" Y="0.4028" />
            <FileData Type="Normal" Path="img/studio_listBg.png" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="serverListBg" Visible="False" ActionTag="1351739872" Tag="28" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="390.0000" RightMargin="390.0000" TopMargin="262.4000" BottomMargin="57.6000" Scale9Enable="True" LeftEage="72" RightEage="200" TopEage="40" BottomEage="40" Scale9OriginX="72" Scale9OriginY="40" Scale9Width="59" Scale9Height="20" ctype="ImageViewObjectData">
            <Size X="500.0000" Y="400.0000" />
            <Children>
              <AbstractNodeData Name="lastSerName" ActionTag="-877564070" Tag="31" IconVisible="False" LeftMargin="20.0000" RightMargin="347.0000" TopMargin="25.0000" BottomMargin="345.0000" FontSize="30" LabelText="上次登录：" OutlineSize="2" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="133.0000" Y="30.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="20.0000" Y="360.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="165" B="0" />
                <PrePosition X="0.0400" Y="0.9000" />
                <PreSize X="0.2660" Y="0.0750" />
                <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
                <OutlineColor A="255" R="101" G="9" B="9" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="serverListView" ActionTag="2144051435" Tag="40" IconVisible="False" LeftMargin="50.0000" RightMargin="50.0000" TopMargin="115.0000" BottomMargin="85.0000" TouchEnable="True" ClipAble="True" BackColorAlpha="110" ColorAngle="90.0000" IsBounceEnabled="True" ScrollDirectionType="0" ItemMargin="5" DirectionType="Vertical" HorizontalType="Align_HorizontalCenter" ctype="ListViewObjectData">
                <Size X="400.0000" Y="200.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="250.0000" Y="185.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.4625" />
                <PreSize X="0.8000" Y="0.5000" />
                <SingleColor A="255" R="150" G="150" B="255" />
                <FirstColor A="255" R="150" G="150" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="serListName" ActionTag="-1806634607" Tag="33" IconVisible="False" LeftMargin="22.4700" RightMargin="314.5300" TopMargin="75.0000" BottomMargin="295.0000" FontSize="30" LabelText="服务器列表：" OutlineSize="2" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="163.0000" Y="30.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="22.4700" Y="310.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="165" B="0" />
                <PrePosition X="0.0449" Y="0.7750" />
                <PreSize X="0.3260" Y="0.0750" />
                <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
                <OutlineColor A="255" R="101" G="9" B="9" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="lastSerBtn" ActionTag="172695028" Tag="41" IconVisible="False" LeftMargin="160.0000" RightMargin="40.0000" TopMargin="15.0000" BottomMargin="335.0000" TouchEnable="True" FontSize="30" ButtonText="上次登录服务器名" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="179" Scale9Height="10" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="300.0000" Y="50.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="310.0000" Y="360.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.6200" Y="0.9000" />
                <PreSize X="0.6000" Y="0.1250" />
                <TextColor A="255" R="255" G="165" B="0" />
                <NormalFileData Type="PlistSubImage" Path="public_inputBg.png" Plist="plist/PublicRes.plist" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="backBtn" ActionTag="-2144033272" Tag="35" IconVisible="False" LeftMargin="272.5000" RightMargin="72.5000" TopMargin="317.5000" BottomMargin="17.5000" TouchEnable="True" FontSize="30" ButtonText="返回" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="125" Scale9Height="43" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="155.0000" Y="65.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="350.0000" Y="50.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7000" Y="0.1250" />
                <PreSize X="0.3100" Y="0.1625" />
                <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
                <TextColor A="255" R="255" G="165" B="0" />
                <NormalFileData Type="PlistSubImage" Path="public_btn_red1.png" Plist="plist/PublicRes.plist" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="selectBtn" ActionTag="-367119892" Tag="36" IconVisible="False" LeftMargin="72.5000" RightMargin="272.5000" TopMargin="317.5000" BottomMargin="17.5000" TouchEnable="True" FontSize="30" ButtonText="进入" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="125" Scale9Height="43" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="155.0000" Y="65.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="150.0000" Y="50.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.3000" Y="0.1250" />
                <PreSize X="0.3100" Y="0.1625" />
                <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
                <TextColor A="255" R="255" G="165" B="0" />
                <NormalFileData Type="PlistSubImage" Path="public_btn_green1.png" Plist="plist/PublicRes.plist" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" />
            <Position X="640.0000" Y="57.6000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.0800" />
            <PreSize X="0.3906" Y="0.5556" />
            <FileData Type="Normal" Path="img/studio_listBg.png" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="serverBtn" ActionTag="996901002" Tag="26" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="465.0000" RightMargin="465.0000" TopMargin="510.0000" BottomMargin="150.0000" TouchEnable="True" FontSize="40" ButtonText="服务器名称" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="179" Scale9Height="10" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="350.0000" Y="60.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="180.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.2500" />
            <PreSize X="0.2734" Y="0.0833" />
            <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
            <TextColor A="255" R="255" G="165" B="0" />
            <NormalFileData Type="PlistSubImage" Path="public_inputBg.png" Plist="plist/PublicRes.plist" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="startGameBtn" ActionTag="684274013" Tag="27" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="562.5000" RightMargin="562.5000" TopMargin="579.5000" BottomMargin="75.5000" TouchEnable="True" FontSize="30" ButtonText="开始游戏" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="125" Scale9Height="43" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="155.0000" Y="65.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="108.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.1500" />
            <PreSize X="0.1211" Y="0.0903" />
            <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
            <TextColor A="255" R="255" G="165" B="0" />
            <NormalFileData Type="PlistSubImage" Path="public_btn_green1.png" Plist="plist/PublicRes.plist" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>