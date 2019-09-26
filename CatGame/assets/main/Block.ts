import { BallInfo, NoticeType, TipsStrDef, ItemInfo, SkillInfo } from "../manager/Enum";
import { NotificationMy } from "../manager/NoticeManager";
import Stuff from "./Stuff";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";
import { ROOT_NODE } from "../common/rootNode";
import { AudioMgr } from "../manager/AudioMgr";
import BagLayer from "./bagLayer";
import Item from "../common/item";
import Skill from "../common/skill";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component {

    @property(cc.Node)
    addNode : cc.Node = null;  //添加按钮节点
    @property(cc.Node)
    lockNode: cc.Node = null;  //锁
    @property(cc.Sprite)
    goundSpr: cc.Sprite = null;   //地块精灵
    @property(cc.Sprite)
    selSpr: cc.Sprite = null;   //选择框精灵
    @property(cc.SpriteFrame)
    selNorFrame: cc.SpriteFrame = null;  //选中后，其他非同等级地块小球光圈显示（白色）
    @property(cc.SpriteFrame)
    selLightFrame: cc.SpriteFrame = null;   //选中后，其他同等级地块小球光圈显示（黄色)

    @property([cc.SpriteFrame])
    groundSprFrames: cc.SpriteFrame[] = new Array(3);

    nModel: cc.Node = null;   //模型节点   //小球装备、饰品道具、技能图标
    ballInfo: BallInfo = null;  //地块上小球数据
    itemInfo: ItemInfo = null;   //地块上道具数据
    skillInfo: SkillInfo = null;   //地块上的技能数据

    blockIdx : number = 0;   //网格位置索引
    isLock : boolean = true;   //砖块是否锁定

    curGirdType = 0;   //0装备小球，1饰品道具，2技能
    bagLayer: BagLayer = null;

    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        this.addNode.active = false;
        this.lockNode.active = false;
        this.goundSpr.node.active = false;   //地块精灵
        this.selSpr.node.active = false;  //光圈

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

        NotificationMy.on(NoticeType.BlockBallSel, this.handleBlockBallSel, this);   //地块上小球被选择，相同等级的小球地块要显示光圈
        NotificationMy.on(NoticeType.UnEquipSkill, this.handleUnEquipSkill, this);   //卸载炮台技能
    }

    onDestroy(){
        this.node.targetOff(this);
        NotificationMy.offAll(this);
    }

    start () {
    }

    update (dt) {
    }

    /**根据开启情形来显示地块外观 */
    setBlockShow(){
        this.addNode.active = false;
        this.lockNode.active = false;
        this.selSpr.node.active = false;  //光圈
        this.goundSpr.node.active = false;   //地块精灵

        if(this.curGirdType == 0){  //0装备小球
            if(this.curGirdType == 0 && this.blockIdx <= MyUserData.blockCount){   //已开启
                this.isLock = false;   //砖块是否锁定
                if(this.ballInfo == null){
                    this.goundSpr.node.active = true;   //地块精灵
                    this.addNode.active = true;
                }
            }else{
                this.isLock = true;   //砖块是否锁定
                this.lockNode.active = true;
            }
        }else if(this.curGirdType == 1){ //1饰品道具
            if(this.itemInfo){
                this.isLock = false;   
            }else{
                this.isLock = true;  
            }
            this.goundSpr.node.active = true;   //地块精灵
        }else if(this.curGirdType == 2){  //2技能
            this.isLock = false;   //砖块是否锁定
            this.goundSpr.node.active = true;   //地块精灵
            if(this.skillInfo){
                if(this.skillInfo.skillLv == 0){   //未拥有
                    this.isLock = true;   
                    this.lockNode.active = true;
                }else if(this.skillInfo.skillPlayerId > 0){   //炮台已经装备
                    this.isLock = true; 
                }
            }
        } 
    }

    /**设置小球模型透明度 */
    setModelOpacity(opacity: number){
        if(this.nModel){  
            this.nModel.opacity = opacity;
        }
    }

    onTouchStart(event: cc.Event.EventTouch) {
        if(this.bagLayer){
            if(this.curGirdType == 0){   //0装备小球
                if(this.ballInfo){
                    let cfg = this.ballInfo.cannonCfg;
                    this.bagLayer.gridLabel.string = cfg.name+", 攻击"+cfg.attack+", 暴击"+cfg.baoji+", 回收价"+cfg.sell;
                }else{
                    this.bagLayer.gridLabel.string = "请选择武器装备！";
                }    
            }else if(this.curGirdType == 1){   //1饰品道具
                if(this.itemInfo){
                    this.bagLayer.gridLabel.string = this.itemInfo.itemCfg.name + ": "+this.itemInfo.itemCfg.desc;
                }else{
                    this.bagLayer.gridLabel.string = "请选择饰品道具！";
                }
            }else  if(this.curGirdType == 2){   //2技能
                this.bagLayer.gridLabel.string = "请选择萌宠技能！";
            }
        }

        if( this.isLock || this.nModel == null){
            return;
        }
        this.handleTouchSelModel();   //处理选中并拖动
    }

    /**处理选中并拖动 */
    handleTouchSelModel(bSel: boolean = true){
        if(bSel){
            this.setModelOpacity(120);  //被移动地块上小球变成半透明
            this.bagLayer.setSelectBlock(this);   //拖动更新选中的小球模型的位置

            if(this.curGirdType == 0){
                NotificationMy.emit(NoticeType.BlockBallSel, this.ballInfo);   //地块上小球被选择，相同等级的小球地块要显示光圈
            }else{
                this.selSpr.node.active = true;  //光圈
            }
        }else{
            this.setModelOpacity(255);
        }
    }

    /**复原本地块模型 */
    onRecoverSelf(){
        this.setModelOpacity(255);
    }

    /**将本地块上的模型移走了 */
    onRemoveModel(){
        if( this.isLock || this.nModel == null){
            return;
        }
        if(this.curGirdType == 0){
            this.setBallStuff(null);
        }

        this.ballInfo = null;  //地块上小球数据
        this.itemInfo = null;   //地块上道具数据
    }

    /**将一个地块上的模型放置到本地块上 */
    onModelDropBlock(dropBlock: Block){
        if(dropBlock.blockIdx == this.blockIdx){
            this.onRecoverSelf();   //复原本地块模型
            return;
        }
        if(this.isLock == true){
            dropBlock.onRecoverSelf();   //复原本地块模型
            return;
        }

        if(this.curGirdType == 0){
            this.onBallDropBlock(dropBlock);
        }
    }

    //-------------------  以下为地块及鞥能接口 --------------------

    /**初始化地块数据 */
    initBlockBySkill(idx: number, skillInfo: SkillInfo, bagLayer: BagLayer){
        this.blockIdx = idx+1;
        this.curGirdType = 2;   //0装备小球，1饰品道具，2技能
        this.bagLayer = bagLayer;
        this.goundSpr.spriteFrame = this.groundSprFrames[2];

        this.setSkillModel(skillInfo);  //设置地块上的技能模型
    }

    //卸载炮台技能
    handleUnEquipSkill(skillId: number){
        if(this.skillInfo && this.skillInfo.skillId == skillId){
            this.skillInfo.skillPlayerId = 0;
            this.setSkillModel(this.skillInfo);   //根据开启情形来显示地块外观
        }
    }

    /**设置地块上的技能模型 */
    setSkillModel(skillInfo: SkillInfo){
        this.skillInfo = skillInfo;
        this.setBlockShow();   //根据开启情形来显示地块外观

        if(skillInfo == null){
            if(this.nModel){
                this.nModel.removeFromParent(true);
                this.nModel = null;
            }
            this.skillInfo = null;
        }else{
            if(this.nModel == null){
                this.nModel = cc.instantiate(this.bagLayer.pfSkill);
                this.node.addChild(this.nModel, 100);
            }
            this.nModel.getComponent(Skill).initSkillByData(skillInfo);  //设置地块技能模型数据
            this.setModelOpacity(255);
        }
    }

    //**********  以下为地块道具接口 ********** */

    /**初始化地块数据 */
    initBlockByItem(idx: number, itemInfo: ItemInfo, bagLayer: BagLayer){
        this.blockIdx = idx+1;
        this.curGirdType = 1;   //0装备小球，1饰品道具，2技能
        this.bagLayer = bagLayer;
        this.goundSpr.spriteFrame = this.groundSprFrames[1];

        this.setItemModel(itemInfo);  //设置地块上的道具模型
    }

    /**设置地块上的道具模型 */
    setItemModel(itemInfo: ItemInfo){
        this.itemInfo = itemInfo;
        this.setBlockShow();   //根据开启情形来显示地块外观

        if(itemInfo == null || this.blockIdx > MyUserData.ItemList.length){
            if(this.nModel){
                this.nModel.removeFromParent(true);
                this.nModel = null;
            }
            this.itemInfo = null;
        }else{
            if(this.nModel == null){
                this.nModel = cc.instantiate(this.bagLayer.pfItem);
                this.node.addChild(this.nModel, 100);
            }
            this.nModel.getComponent(Item).initItemByData(itemInfo, true);  //设置地块道具模型数据
            this.setModelOpacity(255);
        }
    }

    //////////////  以下为地块小球接口  /////////////////////////////

    /**初始化地块数据 */
    initBlockByBall(idx: number, ballInfo: BallInfo, bagLayer: BagLayer){
        this.blockIdx = idx+1;
        this.curGirdType = 0;   //0装备小球，1饰品道具，2技能
        this.bagLayer = bagLayer;
        this.goundSpr.spriteFrame = this.groundSprFrames[0];

        this.setBallStuff(ballInfo);  //设置地块上的小球模型
    }

    onBallDropBlock(dropBlock: Block){
        let ballInfo: BallInfo = dropBlock.ballInfo.clone();
        if(this.nModel){
            if(this.ballInfo.cannonId == ballInfo.cannonId){   //升级
                if(this.ballInfo.cannonId >= GameMgr.ballMaxLv){   //最大等级小球不可合成
                    this.onRecoverSelf();  //设置地块上的小球模型
                    dropBlock.onRecoverSelf();  //设置地块上的小球模型
                    ROOT_NODE.showTipsText(TipsStrDef.KEY_HeChengTip3);  //"最高等级士兵无法继续合成。"
                }else{
                    let cannonId = this.ballInfo.cannonId + 1;
                    this.ballInfo.updateCannon(cannonId); 
                    this.setBallStuff(this.ballInfo);  //设置地块上的小球模型
                    this.setModelOpacity(0);

                    MyUserDataMgr.updateBallInBallList(this.ballInfo, ballInfo);    //更新未出战小球 
  
                    dropBlock.onRemoveModel();   //将本地块上的模型移走了
                    this.showUpdateBallEffect();  //显示升级小球特效     
                }
            }else{    //交换
                dropBlock.setBallStuff(this.ballInfo.clone());  //设置地块上的小球模型
                this.setBallStuff(ballInfo);  //设置地块上的小球模型
            }
        }else{  //放置
            this.setBallStuff(ballInfo);  //设置地块上的小球模型
            dropBlock.onRemoveModel();   //将本地块上的模型移走了
        }
    }

    /**设置地块上的小球模型 */
    setBallStuff(ballInfo: BallInfo){
        let bshowUI = true;
        if(this.ballInfo && ballInfo){
            bshowUI = false;
        }
        this.ballInfo = ballInfo;
        if(bshowUI == true){
            this.setBlockShow();   //根据开启情形来显示地块外观
        }

        if(ballInfo == null || this.blockIdx > MyUserData.blockCount){
            if(this.nModel){
                this.nModel.removeFromParent(true);
                this.nModel = null;
            }
            this.ballInfo = null;
        }else{
            if(this.nModel == null){
                this.nModel = cc.instantiate(this.bagLayer.pfStuff);
                this.node.addChild(this.nModel, 100);
            }
            this.nModel.getComponent(Stuff).setStuffData(ballInfo);  //设置地块小球模型数据
            this.setModelOpacity(255);
        }
    }

    /**地块上小球被选择，相同等级的小球地块要显示光圈 */
    handleBlockBallSel(ballInfo: BallInfo){
        if(this.isLock == false && this.curGirdType == 0){
            if(ballInfo){
                this.selSpr.node.active = true;  //光圈
                if(this.ballInfo && this.ballInfo.cannonId == ballInfo.cannonId){
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

    /**点击地块*/
    onAddBtn(){
        if(this.isLock == true){    //砖块是否锁定
            let tipStr = "通关第"+GameMgr.blockOpenLevel[this.blockIdx-1]+"后自动开启，点击确定进入关卡场景！";
            ROOT_NODE.showTipsDialog(tipStr, ()=>{
            });
        }else{   //购买小球
            GameMgr.showLayer(this.bagLayer.pfBallShop);
        }
    }

    /**将本地块上的小球卖掉 */
    onSellBall(){
        if(this.ballInfo){
            let sellNum = this.ballInfo.cannonCfg.sell;
            MyUserDataMgr.sellBallFromBallList(this.ballInfo);  
            this.onRemoveModel();   //模型

            return sellNum;
        }
        return 0;
    }

    /**显示升级小球特效 */
    showUpdateBallEffect(){
        let oldInfo: BallInfo = new BallInfo(this.ballInfo.cannonId - 1);

        let aniStuff = cc.instantiate(this.bagLayer.pfStuff);
        this.node.addChild(aniStuff, 90);
        aniStuff.getComponent(Stuff).setStuffData(oldInfo);  //设置地块小球模型数据

        let aniStuff2 = cc.instantiate(this.bagLayer.pfStuff);
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
        this.setModelOpacity(255);

        let aniNode = GameMgr.createAtlasAniNode(this.bagLayer.stuffUpAtlas, 12, cc.WrapMode.Default);
        this.node.addChild(aniNode, 110, "hechengAniNode");

        // let effectSpr = aniNode.getComponent(cc.Sprite);
        // if(effectSpr){
        //     effectSpr.srcBlendFactor = cc.macro.BlendFactor.SRC_ALPHA;
        //     effectSpr.dstBlendFactor = cc.macro.BlendFactor.ONE;
        // }
    }

}
