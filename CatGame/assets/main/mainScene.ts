import { NotificationMy } from "../manager/NoticeManager";
import { NoticeType, TipsStrDef, BallInfo, PlayerInfo } from "../manager/Enum";
import { SDKMgr } from "../manager/SDKManager";
import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";
import { ROOT_NODE } from "../common/rootNode";
import Block from "./Block";
import IconEffect from "./iconEffect";
import Stuff from "./Stuff";
import { MyUserDataMgr, MyUserData } from "../manager/MyUserData";
import GainGoldNode from "./gainNode";
import TableView from "../tableView/tableView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {

    @property(cc.Node)
    nSlots: cc.Node = null;   //网格节点
    @property(cc.Node)
    bottomNode: cc.Node = null;
    @property(cc.Node)
    topNode: cc.Node = null;

    @property(cc.Node)
    delNode: cc.Node = null;   //删除节点
    @property(cc.Node)
    shareBtn: cc.Node = null;  //分享
    @property(cc.Label)
    labGold: cc.Label = null;   //玩家金币数
    @property(cc.Node)
    goldIcon: cc.Node = null;   //金币图标

    @property(cc.Sprite)
    playerSpr: cc.Sprite = null;   //炮台图标
    @property(cc.Label)
    playerDesc: cc.Label = null;  //炮台介绍

    @property(cc.Node)
    tableNode: cc.Node = null;
    @property(cc.Label)
    fightTip: cc.Label = null;
    @property(cc.Label)
    fightNum: cc.Label = null;
    @property(TableView)
    tableView: TableView = null;  //出战列表

    @property(cc.Sprite)
    musicSpr: cc.Sprite = null;   //背景音乐控制按钮图标
    @property(cc.SpriteFrame)
    musicCloseFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    musicOpenFrame: cc.SpriteFrame = null;

    @property(cc.Prefab)
    pfBlock: cc.Prefab = null;   //地块预制体
    @property(cc.Prefab)
    pfStuff: cc.Prefab = null;   //小球模型预制体
    @property(cc.Prefab)
    pfGainGold: cc.Prefab = null;   //金币增益预制体
    @property(cc.Prefab)
    pfIconEffect: cc.Prefab = null;   //金币飘动预制体
    @property(cc.Prefab)
    pfShop: cc.Prefab = null;  //小球商店
    @property(cc.Prefab)
    pfPlayer: cc.Prefab = null;  //炮台更换

    @property(cc.SpriteAtlas)
    stuffUpAtlas: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    playerAtlas: cc.SpriteAtlas = null;

    bLoadRoleDataFinish: boolean = false;   //是否已经加载完毕用户数据

    nSelectStuff: cc.Node = null;   //拖动选择的小球模型
    selectBlock: Block = null;   //拖动的地块数据

    fightList: BallInfo[] = new Array();   //出战列表
    selFightBall: BallInfo = null;  //选中的出战小球

    onLoad(){
        this.bLoadRoleDataFinish = false;  //是否已经加载完毕用户数据
        
        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);

        NotificationMy.on(NoticeType.UpdateGold, this.UpdateGold, this);  //金币更新

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.ontTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.ontTouchEnd, this);

        this.delNode.active= false;  //小球解雇和升级节点
        this.shareBtn.active = false;  //分享
        if(SDKMgr.WeiChat){
            //this.shareBtn.active = true;  //分享
            //sdkWechat.createBannerWithWidth("adunit-7c748fc257f96483");
        }
    }

    onDestroy(){
        NotificationMy.offAll(this);
        this.node.targetOff(this);
    }

    /**后台切回前台 */
    onShow() {
        cc.log("************* onShow() 后台切回前台 ***********************")
        //NotificationMy.emit(NoticeType.GameResume, null);  //继续游戏
        cc.game.resume();
    }

    /**游戏切入后台 */
    onHide() {
        cc.log("_____________  onHide()游戏切入后台  _____________________")
        //NotificationMy.emit(NoticeType.GAME_ON_HIDE, null);
        //NotificationMy.emit(NoticeType.GamePause, null);   //游戏暂停，停止小球和砖块的动作，但动画特效不受影响
        cc.game.pause();
    }

    start(){  
        this.initCombineData();   //初始化数据
    }

    /**初始化数据 */
    initCombineData () {
        this.bLoadRoleDataFinish = true;  //是否已经加载完毕用户数据
        this.showMusicSpr();

        this.UpdateGold();   //更新金币数量
        this.UpdatePlayer();  //显示炮台信息
        this.initFightList();  //刷新出战列表
        this.loadBlocksGrid();   //加载小球地块网格
    }

    // update (dt) {
    // }

    /**更新金币数量 */
    UpdateGold(){
        let valStr = GameMgr.num2e(MyUserData.GoldCount);
        this.labGold.string = valStr;  //金币数量

        this.labGold.node.stopAllActions();
        this.labGold.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.3), cc.scaleTo(0.1, 1.0)));
    }

    /**显示炮台信息 */
    UpdatePlayer(){
        this.playerSpr.spriteFrame = null;
        this.playerDesc.string = "";
        let playerInfo: PlayerInfo = MyUserDataMgr.getCurPlayerInfo();
        if(playerInfo){
            this.playerSpr.spriteFrame = this.playerAtlas.getSpriteFrame("player_"+playerInfo.playerId);
            this.playerDesc.string = playerInfo.playerCfg.desc;
        }
    }

    //刷新出战列表
    initFightList(){
        this.fightList = MyUserDataMgr.getFightListClone();
        this.fightNum.string = "出战数量："+this.fightList.length+"/"+MyUserData.fightCount;

        if(this.fightList.length > 0){
            this.fightTip.string = "";
        }else{
            this.fightTip.string = "拖入此处加入战斗！";
        }

        this.tableView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
        this.tableView.initTableView(this.fightList.length, { array: this.fightList, target: this, bShowSel: true}); 
    }

    /**选中出战Cell */
    handleSelCell(cellIdx:number, cellData:BallInfo){
        this.selFightBall = cellData;  //选中的出战小球
    }

    /**加载小球地块网格 */
    loadBlocksGrid(){
        this.nSlots.removeAllChildren();
        let ballList = MyUserDataMgr.getBallListClone();

        for(let i=0; i<12; ++i){
            let ballInfo: BallInfo = null;
            if(i < ballList.length){
                ballInfo = ballList[i];
            }

            let node = cc.instantiate(this.pfBlock);
            this.nSlots.addChild(node);
            let block = node.getComponent(Block);
            block.initBlockData(i, ballInfo);
        }
    }

    //显示金币或钻石飘动动画
    showIconEffectAni(startPos: cc.Vec2, type: number){
        let layer = GameMgr.showLayer(this.pfIconEffect);
        let layerSc = layer.getComponent(IconEffect); 
        if(layerSc){
            let destPos = this.goldIcon.convertToWorldSpaceAR(cc.Vec2.ZERO)
            layerSc.initIconEffectAni(startPos, destPos, type);
        }
    }

    onTouchStart(event: cc.Event.EventTouch) {  
        if(this.selectBlock){
            this.delNode.active= true;  //小球解雇和升级节点
            this.updateSelectStuff(event.getLocation());   //拖动更新选中的小球模型的位置
        }
    }

    onTouchMove(event: cc.Event.EventTouch) {
        if(this.nSelectStuff && this.selectBlock){ 
            this.updateSelectStuff(event.getLocation());   //拖动更新选中的小球模型的位置
        }
    }

    ontTouchEnd(event: cc.Event.EventTouch) {
        if(this.nSelectStuff && this.selectBlock){  
            this.fightTip.string = "";
            this.placeSelectStuff(event.getLocation());   //放置选中的小球模型
            NotificationMy.emit(NoticeType.BlockBallSel, null);   //地块上小球被选择，相同等级的小球地块要显示光圈
        }
    }

    /**设置选中的将要移动的小球地块 */
    setSelectStuff(block: Block){
        this.fightTip.string = "拖入此处加入战斗！";
        this.selectBlock = block;   //拖动的地块数据
    }

    /**拖动更新选中的小球模型的位置 */
    updateSelectStuff(touchPos: cc.Vec2){
        if(this.selectBlock){
            touchPos = GameMgr.adaptTouchPos(touchPos, this.node.position);  //校正因适配而产生的触摸偏差
            if(this.nSelectStuff == null){
                this.nSelectStuff = cc.instantiate(this.pfStuff);
                this.nSelectStuff.setPosition(-3000, -3000);
                this.node.addChild(this.nSelectStuff, 100);
            }
            let stuff = this.nSelectStuff.getComponent(Stuff);
            stuff.setStuffData(this.selectBlock.ballInfo);   //设置地块小球模型数据 
    
            let pos = this.node.convertToNodeSpaceAR(touchPos);
            this.nSelectStuff.setPosition(pos);
        }
    }

    /**放置选中的小球模型 */
    placeSelectStuff(touchPos : cc.Vec2){
        if(this.selectBlock && this.selectBlock){
            touchPos = GameMgr.adaptTouchPos(touchPos, this.node.position);  //校正因适配而产生的触摸偏差
            let pos = this.delNode.convertToNodeSpace(touchPos);   //删除节点
            let rect = cc.rect(0, 0, this.delNode.width, this.delNode.height);
            if(rect.contains(pos)){  //删除士兵
                if(MyUserData.ballList.length == 1 && MyUserData.fightList.length == 0){   //最后一个小球不可删除
                    ROOT_NODE.showTipsText(TipsStrDef.KEY_FireTip);
                    this.selectBlock.onBallDropBlock(this.selectBlock);   //将一个地块上的小球放置到本地块上
                    this.selectBlock = null;   //拖动的地块数据
                }else{
                    let sellGold = this.selectBlock.onSellBall();  
                    this.showDelBallGainAni(sellGold);   //显示售卖士兵收益 
                }
                this.nSelectStuff.setPosition(-3000, -3000);
            }else{
                let pos = this.tableNode.convertToNodeSpace(touchPos);   //删除节点
                let rect = cc.rect(0, 0, this.tableNode.width, this.tableNode.height);
                if(rect.contains(pos)){    //出战
                    if(this.fightList.length >= MyUserData.fightCount){
                        ROOT_NODE.showTipsText("出战列表已满额！");
                        ROOT_NODE.showTipsText("闯关可以解锁新的出战位！");
                        this.selectBlock.onBallDropBlock(this.selectBlock);   //将一个地块上的小球放置到本地块上
                    }else{
                        MyUserDataMgr.addBallToFightList(this.selectBlock.ballInfo);
                        this.selectBlock.onBallRemoveBlock();
                        this.initFightList();  //刷新出战列表
                    }
                }else{
                    let dropBlock: cc.Node = this.getBlockSlotIndex(touchPos);   //根据位置找到对应的地块
                    if(dropBlock == null){   //未找到合适的地块
                        this.selectBlock.onBallDropBlock(this.selectBlock);   //将一个地块上的小球放置到本地块上
                    }else{
                        dropBlock.getComponent(Block).onBallDropBlock(this.selectBlock);   //将一个地块上的小球放置到选中的地块上
                    }
                }
            }
            this.selectBlock = null;   //拖动的地块数据
            this.nSelectStuff.setPosition(-3000, -3000);
            this.delNode.active= false;  //小球解雇和升级节点
        }
    }

    /**根据位置找到对应的地块 */
    getBlockSlotIndex(touchPos: cc.Vec2): cc.Node{
        let pos = this.nSlots.convertToNodeSpaceAR(touchPos);
        let blocks = this.nSlots.children;
        for(let i=0; i< blocks.length; i++){
            let len = blocks[i].getPosition().sub(pos).mag();
            if(len <= 100){
                if(blocks[i].getComponent(Block).isLock == false){
                    return blocks[i];
                }
                break;
            }
        }
        return null;
    }

    /**显示售卖士兵收益 */
    showDelBallGainAni(sellGold: number){
        if(sellGold >= 0){
            MyUserDataMgr.updateUserGold(sellGold);   //修改用户金币 
            AudioMgr.playEffect("effect/gold_gain");

            let pos = this.bottomNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
            this.showIconEffectAni(cc.v2(pos.x, pos.y + 60), 0);

            let gainNode = cc.instantiate(this.pfGainGold);
            gainNode.setPosition(cc.v2(0, 60));
            this.bottomNode.addChild(gainNode, 100);
            gainNode.getComponent(GainGoldNode).showGainGlodVal(sellGold);
                
        }
    }

    //购买炮台
    handleBuyPlayer(playerInfo: PlayerInfo){
        if(playerInfo){
            if(MyUserData.GoldCount >= playerInfo.playerCfg.cost){
                MyUserDataMgr.updateUserGold(-playerInfo.playerCfg.cost);
                MyUserDataMgr.addPlayerToPlayerList(playerInfo);   //添加新炮台到拥有的炮列表
                NotificationMy.emit(NoticeType.UpdatePlayer, null);  //更新炮台显示
            }else{
                ROOT_NODE.showGoldAddDialog();  //获取金币提示框
            }
        }
    }

    //换装炮台
    handleChangePlayer(curIdx: number){
        if(curIdx >= 0){
            MyUserDataMgr.updateCurPlayerIdx(curIdx);
            this.UpdatePlayer();  //显示炮台信息
            NotificationMy.emit(NoticeType.UpdatePlayer, null);  //更新炮台显示
        }
    }

    /**购买小球 */
    handleBuyStuff(ballInfo: BallInfo){
        if(ballInfo){
            cc.log("MyUserData.ballList = "+JSON.stringify(MyUserData.ballList));
            if(MyUserData.GoldCount >= ballInfo.cannonCfg.cost){
                if(MyUserData.ballList.length >= MyUserData.blockCount){
                    ROOT_NODE.showTipsText("合成网格中可用地块已满，无法购买！请解雇无用的对象后重新购买。");
                }else{
                    this.addBallToOneBlock(ballInfo, true);
                }
            }else{
                ROOT_NODE.showGoldAddDialog();  //获取金币提示框
            }
        }
    }

    /**添加一个小球到地块 */
    addBallToOneBlock(ballInfo: BallInfo, bBuyBall:boolean){
        cc.log("addBallToOneBlock(), ballInfo = "+JSON.stringify(ballInfo));
        if(ballInfo){
            let blocks = this.nSlots.children;
            for(let i=0; i<blocks.length; i++){
                let block: Block = blocks[i].getComponent(Block);
                if(block.isLock == false && block.ballInfo == null){
                    if(bBuyBall == true){
                        MyUserDataMgr.updateUserGold(-ballInfo.cannonCfg.cost);
                        MyUserDataMgr.addBallToBallList(ballInfo.clone(), true);

                        block.initBlockByBallInfo(ballInfo);
                        //this.showBuyBallAni(block, ballInfo);   //显示招募小球的动画特效
                    }else{
                        block.initBlockByBallInfo(ballInfo);
                    }
                    break;
                }
            }
        }
    }

    /**显示招募小球的动画特效 */
    showBuyBallAni(block: Block, ballInfo: BallInfo){
        let worldPos = block.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let destPos = this.node.convertToNodeSpaceAR(worldPos);

        let worldPos2 = this.delNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let btnPos = this.node.convertToNodeSpaceAR(worldPos2);

        let dir: cc.Vec2 = btnPos.sub(destPos).normalize();
        let srcPos = destPos.add(dir.mul(150));
 
        let tempStuff = cc.instantiate(this.pfStuff);
        tempStuff.opacity = 0;
        tempStuff.position = srcPos;
        this.node.addChild(tempStuff, 100);
        tempStuff.getComponent(Stuff).setStuffData(ballInfo);   //设置地块小球模型数据 

        tempStuff.runAction(cc.sequence(cc.spawn(cc.fadeIn(0.12), cc.moveTo(0.12, destPos)), cc.callFunc(function(){
            block.initBlockByBallInfo(ballInfo);
            tempStuff.removeFromParent(true);
        }.bind(this))))
    }

    /**下阵出战小球 */
    onCancelFightBtn(){
        if(this.selFightBall){  //选中的出战小球
            //cc.log("MyUserData.blockCount = "+MyUserData.blockCount+"; MyUserData.ballList = "+JSON.stringify(MyUserData.ballList));
            if(MyUserData.ballList.length >= MyUserData.blockCount){
                ROOT_NODE.showTipsText("合成网格中可用地块已满，出战对象无法下阵！");
            }else{
                ROOT_NODE.showTipsDialog("是否将选中的对象从出战列表移除到下方网格中？", ()=>{
                    let ballInfo = this.selFightBall.clone();
                    MyUserDataMgr.removeBallFromFightList(this.selFightBall);
                    this.addBallToOneBlock(ballInfo, false);
                    this.initFightList();  //刷新出战列表
                });
            }
        } 
    }

    /**点击售卖按钮 */
    onSellBtn(){
        AudioMgr.playEffect("effect/ui_click");

        ROOT_NODE.showTipsText(TipsStrDef.KEY_RecoverTip);
    }

    onShareBtn(){
        AudioMgr.playEffect("effect/ui_click");

        SDKMgr.shareGame("分享快乐", (succ:boolean)=>{
            console.log("loginScene 分享 succ = "+succ);
            if(succ == true){
            }
        }, this);
    }

    //换炮界面
    onPlayerBtn(){
        AudioMgr.playEffect("effect/ui_click");
        GameMgr.showLayer(this.pfPlayer);
    }

    /**出战按钮 */
    onFightBtn(){
        AudioMgr.playEffect("effect/ui_click");
        if(MyUserData.fightList.length == 0){
            ROOT_NODE.showTipsText("出战列表为空，请拖入炮弹！");
        }else{
            GameMgr.gotoChapterScene();
        }
    }

    /**音乐开关 */
    onMusicBtn(){
        AudioMgr.playEffect("effect/ui_click");

        let keyVal = AudioMgr.getMusicOnOffState();   //获取音效总开关状态
        keyVal = 1- keyVal;
        AudioMgr.setMusicOnOffState(keyVal);
        this.showMusicSpr();
    }

    showMusicSpr(){
        let keyVal = AudioMgr.getMusicOnOffState();   //获取音效总开关状态
        if(keyVal == 0){     //现在为开启状态，按钮显示开启图标
            this.musicSpr.spriteFrame = this.musicOpenFrame;
        }else{ 
            this.musicSpr.spriteFrame = this.musicCloseFrame;
        }
    }

}

