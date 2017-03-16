<GameFile>
  <PropertyGroup Name="DialogOkCancelLayer" Type="Layer" ID="a8e43303-ccdd-4987-b0b5-eda740e3f973" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="557" ctype="GameLayerObjectData">
        <Size X="484.0000" Y="345.0000" />
        <Children>
          <AbstractNodeData Name="Image_bg" ActionTag="-380773326" Tag="558" IconVisible="False" LeftEage="159" RightEage="159" TopEage="113" BottomEage="113" Scale9OriginX="159" Scale9OriginY="113" Scale9Width="166" Scale9Height="119" ctype="ImageViewObjectData">
            <Size X="484.0000" Y="345.0000" />
            <AnchorPoint />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="1.0000" Y="1.0000" />
            <FileData Type="Normal" Path="img/studio_dialogBg.png" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="Text_title" ActionTag="-1055724178" Tag="559" IconVisible="False" LeftMargin="180.5000" RightMargin="180.5000" TopMargin="24.0000" BottomMargin="289.0000" FontSize="30" LabelText="显示标题" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="123.0000" Y="32.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="242.0000" Y="305.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="0" G="128" B="0" />
            <PrePosition X="0.5000" Y="0.8841" />
            <PreSize X="0.2541" Y="0.0928" />
            <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
            <OutlineColor A="255" R="0" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="ListView" ActionTag="1739325286" Tag="561" IconVisible="False" LeftMargin="42.0000" RightMargin="42.0000" TopMargin="90.0000" BottomMargin="85.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ScrollDirectionType="0" DirectionType="Vertical" ctype="ListViewObjectData">
            <Size X="400.0000" Y="170.0000" />
            <Children>
              <AbstractNodeData Name="Text_content" ActionTag="422579289" Tag="562" IconVisible="False" RightMargin="282.0000" BottomMargin="146.0000" FontSize="24" LabelText="Text Label" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="118.0000" Y="24.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="59.0000" Y="158.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="0" G="0" B="0" />
                <PrePosition X="0.1475" Y="0.9294" />
                <PreSize X="0.2950" Y="0.1412" />
                <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="1.0000" />
            <Position X="242.0000" Y="255.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.7391" />
            <PreSize X="0.8264" Y="0.4928" />
            <SingleColor A="255" R="150" G="150" B="255" />
            <FirstColor A="255" R="150" G="150" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="Button_cancel" ActionTag="-1956279294" Tag="563" IconVisible="False" LeftMargin="99.0000" RightMargin="293.0000" TopMargin="268.0000" BottomMargin="23.0000" TouchEnable="True" FontSize="25" ButtonText="取消" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="62" Scale9Height="32" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="92.0000" Y="54.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="145.0000" Y="50.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.2996" Y="0.1449" />
            <PreSize X="0.1901" Y="0.1565" />
            <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
            <TextColor A="255" R="255" G="165" B="0" />
            <NormalFileData Type="PlistSubImage" Path="public_btn_red2.png" Plist="plist/PublicRes.plist" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="Button_ok" ActionTag="862616813" Tag="564" IconVisible="False" LeftMargin="274.0000" RightMargin="118.0000" TopMargin="268.0000" BottomMargin="23.0000" TouchEnable="True" FontSize="25" ButtonText="确定" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="62" Scale9Height="32" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="92.0000" Y="54.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="320.0000" Y="50.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.6612" Y="0.1449" />
            <PreSize X="0.1901" Y="0.1565" />
            <FontResource Type="Normal" Path="font/DFYuanW7-GB2312.ttf" Plist="" />
            <TextColor A="255" R="255" G="165" B="0" />
            <NormalFileData Type="PlistSubImage" Path="public_btn_green2.png" Plist="plist/PublicRes.plist" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="Button_close" ActionTag="-651258780" Tag="565" IconVisible="False" LeftMargin="422.8332" RightMargin="26.1668" TopMargin="22.8784" BottomMargin="287.1216" TouchEnable="True" FontSize="24" Scale9Enable="True" LeftEage="8" RightEage="8" TopEage="11" BottomEage="11" Scale9OriginX="8" Scale9OriginY="11" Scale9Width="11" Scale9Height="5" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="35.0000" Y="35.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="440.3332" Y="304.6216" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9098" Y="0.8830" />
            <PreSize X="0.0723" Y="0.1014" />
            <TextColor A="255" R="242" G="176" B="3" />
            <NormalFileData Type="PlistSubImage" Path="public_close.png" Plist="plist/PublicRes.plist" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>