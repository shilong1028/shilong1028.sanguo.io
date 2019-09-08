import { BallInfo, NoticeType, TipsStrDef } from "../manager/Enum";
import { NotificationMy } from "../manager/NoticeManager";
import Stuff from "./Stuff";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";
import { ROOT_NODE } from "../common/rootNode";
import { AudioMgr } from "../manager/AudioMgr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component {

    @property(cc.Node)
    addNode : cc.Node = null;  //添加按钮节点
    @property(cc.Node)
    lockNode: cc.Node = null;  //锁
    @property(cc.Node)
    shadeNode: cc.Node = null;   //影子节点
    @property(cc.Sprite)
    goundSpr: cc.Sprite = null;   //地块精灵
    @property(cc.Sprite)
    selSpr: cc.Sprite = null;   //选择框精灵
    @property(cc.SpriteFrame)
    selNorFrame: cc.SpriteFrame = null;  //选中后，其他非同等级地块小球光圈显示（白色）
    @property(cc.SpriteFrame)
    selLightFrame: cc.SpriteFrame = null;   //选中后，其他同等级地块小球光圈显示（黄色)

    nStuff: cc.Node = null;   //小球模型节点
    stuffPosY: number = 20;
    blockIdx : number = 0;   //网格位置索引
    ballInfo: BallInfo = null;  //地块上小球数据
    isLock : boolean = true;   //砖块是否锁定

    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        this.addNode.active = false;
        this.lockNode.active = false;
        this.shadeNode.active = false;   //影子节点
        this.goundSpr.node.active = false;   //地块精灵
        this.selSpr.node.active = false;  //光圈

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

        NotificationMy.on(NoticeType.BlockBallSel, this.handleBlockBallSel, this);   //地块上小球被选择，相同等级的小球地块要显示光圈
    }

    onDestroy(){
        this.node.targetOff(this);
        NotificationMy.offAll(this);
    }

    start () {
    }

    update (dt) {
    }

    /**初始化地块数据 */
    initBlockData(idx: number, ballInfo: BallInfo){
        this.blockIdx = idx+1;
        this.ballInfo = ballInfo;

        this.setBlockShow();   //根据开启情形来显示地块外观
        this.setBallStuff(ballInfo);  //设置地块上的小球模型
    }

    /**招募或下阵初始化地块数据 */
    initBlockByBallInfo(ballInfo: BallInfo){
        this.ballInfo = ballInfo;
        this.setBlockShow();   //根据开启情形来显示地块外观
        this.setBallStuff(ballInfo);  //设置地块上的小球模型
    }

    /**根据开启情形来显示地块外观 */
    setBlockShow(){
        this.addNode.active = false;
        this.lockNode.active = false;
        this.selSpr.node.active = false;  //光圈
        this.goundSpr.node.active = false;   //地块精灵

        if(this.blockIdx <= MyUserData.blockCount){   //已开启
            this.isLock = false;   //砖块是否锁定
            if(this.ballInfo == null){
                this.goundSpr.node.active = true;   //地块精灵
                this.addNode.active = true;
            }
        }else{
            this.isLock = true;   //砖块是否锁定
            this.goundSpr.node.active = true;   //地块精灵
            this.lockNode.active = true;
        }
    }

    /**点击地块*/
    onBlockBtn(){
        if(this.isLock == true){    //砖块是否锁定
            let tipStr = "通关第"+GameMgr.blockOpenLevel[this.blockIdx-1]+"后自动开启，点击确定进入关卡场景！";
            ROOT_NODE.showTipsDialog(tipStr, ()=>{
            });
        }else{   //购买小球
            GameMgr.showLayer(GameMgr.getMainScene().pfShop);
        }
    }

    /**设置地块上的小球模型 */
    setBallStuff(ballInfo: BallInfo){
        this.shadeNode.active = false;   //影子节点
        this.ballInfo = ballInfo;
        if(this.nStuff && (ballInfo == null || this.blockIdx >= MyUserData.blockCount)){
            this.nStuff.removeFromParent(true);
            this.nStuff = null;
        }
        if(ballInfo && this.blockIdx <= MyUserData.blockCount){   //已开启
            if(this.nStuff == null){
                this.nStuff = cc.instantiate(GameMgr.getMainScene().pfStuff);
                this.nStuff.y = this.stuffPosY;
                this.node.addChild(this.nStuff, 100);
            }
            this.nStuff.getComponent(Stuff).setStuffData(ballInfo);  //设置地块小球模型数据
        }

        this.setStuffOpacity(255);
    }

    /**设置小球模型透明度 */
    setStuffOpacity(opacity: number){
        if(this.nStuff){  
            this.shadeNode.active = true;   //影子节点
            this.nStuff.opacity = opacity;
        }
    }

    onTouchStart(event: cc.Event.EventTouch) {
        if( this.isLock || this.ballInfo == null || this.nStuff == null){
            return;
        }
        this.handleTouchSelStuff();   //处理选中并拖动
    }

    /**处理选中并拖动 */
    handleTouchSelStuff(bSel: boolean = true){
        if(bSel){
            this.setStuffOpacity(120);  //被移动地块上小球变成半透明
            GameMgr.getMainScene().setSelectStuff(this);   //拖动更新选中的小球模型的位置

            NotificationMy.emit(NoticeType.BlockBallSel, this.ballInfo);   //地块上小球被选择，相同等级的小球地块要显示光圈
        }else{
            this.setStuffOpacity(255);
        }
    }

    /**地块上小球被选择，相同等级的小球地块要显示光圈 */
    handleBlockBallSel(ballInfo: BallInfo){
        if(this.isLock == false){
            if(ballInfo){
                this.selSpr.node.active = true;  //光圈
                if(this.ballInfo && this.ballInfo.cannonId == ballInfo.cannonId && this.ballInfo.timeId != ballInfo.timeId){
                    this.selSpr.spriteFrame = this.selLightFrame;
                }else{
                    this.selSpr.spriteFrame = this.selNorFrame;
                }
            }else{
                this.selSpr.node.active = false;  //光圈
            }
        }else{
            this.selSpr.node.active = false;  //光圈
        }
    }

    /**将本地块上的小球卖掉 */
    onSellBall(){
        if(this.ballInfo){
            let sellNum = this.ballInfo.cannonCfg.sell;
            MyUserDataMgr.sellBallFromBallList(this.ballInfo);  
            this.onBallRemoveBlock();

            return sellNum;
        }
        return 0;
    }

    /**将本地块上的小球移走了 */
    onBallRemoveBlock(){
        if( this.isLock || this.ballInfo == null || this.nStuff == null){
            return;
        }
        this.nStuff.removeFromParent(true);
        this.shadeNode.active = false;   //影子节点

        this.ballInfo = null;
        this.nStuff = null;
        
        this.setBlockShow();   //根据开启情形来显示地块外观
    }

    /**交换小球 */
    onSwapBallBlock(ballInfo: BallInfo){
        this.setBallStuff(ballInfo);  //设置地块上的小球模型
    }

    /**将一个地块上的小球放置到本地块上 */
    onBallDropBlock(dropBlock: Block){
        if(dropBlock.blockIdx == this.blockIdx){
            this.setStuffOpacity(255);
            return;
        }

        if(this.isLock == true){
            dropBlock.onBallDropBlock(dropBlock);   //将一个地块上的小球放置到本地块上
            return;
        }

        let ballInfo: BallInfo = dropBlock.ballInfo;

        if(this.ballInfo){
            if(this.ballInfo.cannonId == ballInfo.cannonId){   //升级
                if(this.ballInfo.cannonId >= GameMgr.ballMaxLv){   //最大等级小球不可合成
                    this.setBallStuff(this.ballInfo);  //设置地块上的小球模型
                    dropBlock.setBallStuff(ballInfo);  //设置地块上的小球模型
                    ROOT_NODE.showTipsText(TipsStrDef.KEY_HeChengTip3);  //"最高等级士兵无法继续合成。"
                }else{
                    let cannonId = this.ballInfo.cannonId + 1;
                    this.ballInfo.updateCannon(cannonId); 
                    this.setBallStuff(this.ballInfo);  //设置地块上的小球模型
                    this.nStuff.opacity = 0;

                    MyUserDataMgr.updateBallInBallList(this.ballInfo, dropBlock.ballInfo.clone());    //更新未出战小球 
  
                    dropBlock.onBallRemoveBlock();   //将本地块上的小球移走了
                    this.showUpdateBallEffect();  //显示升级小球特效     
                }
            }else{    //交换
                dropBlock.onSwapBallBlock(this.ballInfo);
                this.onSwapBallBlock(ballInfo);
            }
        }else{  //放置
            this.setBallStuff(ballInfo);  //设置地块上的小球模型
            dropBlock.onBallRemoveBlock();   //将本地块上的小球移走了
        }
    }

    /**显示升级小球特效 */
    showUpdateBallEffect(){
        let oldInfo: BallInfo = new BallInfo(this.ballInfo.cannonId - 1);

        let aniStuff = cc.instantiate(GameMgr.getMainScene().pfStuff);
        aniStuff.y = this.stuffPosY;
        this.node.addChild(aniStuff, 90);
        aniStuff.getComponent(Stuff).setStuffData(oldInfo);  //设置地块小球模型数据

        let aniStuff2 = cc.instantiate(GameMgr.getMainScene().pfStuff);
        aniStuff2.y = this.stuffPosY;
        this.node.addChild(aniStuff2, 90);
        aniStuff2.getComponent(Stuff).setStuffData(oldInfo);  //设置地块小球模型数据

        AudioMgr.playEffect("effect/compound");
        
        aniStuff.runAction(cc.sequence(cc.moveBy(0.2, cc.v2(-100, 0)), cc.moveBy(0.1, cc.v2(100, 0)), cc.hide(), cc.removeSelf(true)));
        aniStuff2.runAction(cc.sequence(cc.moveBy(0.2, cc.v2(100, 0)), cc.moveBy(0.1, cc.v2(-100, 0)), cc.hide(), cc.callFunc(function(){
            this.showUpdateAni();
        }.bind(this), cc.removeSelf(true))));
    }

    /**显示升级动画 */
    showUpdateAni(){
        this.setStuffOpacity(255);

        let aniNode = GameMgr.createAtlasAniNode(GameMgr.getMainScene().stuffUpAtlas, 12, cc.WrapMode.Default);
        aniNode.scale = 2.0;
        this.node.addChild(aniNode, 110, "hechengAniNode");

        // let effectSpr = aniNode.getComponent(cc.Sprite);
        // if(effectSpr){
        //     effectSpr.srcBlendFactor = cc.macro.BlendFactor.SRC_ALPHA;
        //     effectSpr.dstBlendFactor = cc.macro.BlendFactor.ONE;
        // }
    }

}
