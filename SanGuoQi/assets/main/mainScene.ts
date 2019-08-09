import { NoticeMgr } from "../manager/NoticeManager";
import { NoticeType, SpecialStory } from "../manager/Enum";
import { GameMgr } from "../manager/GameManager";
import { MyUserData } from "../manager/MyUserData";
import { st_story_info } from "../manager/ConfigManager";
import FightReady from "../views/fightReady";
import { ROOT_NODE } from "../common/rootNode";
import { FightMgr } from "../manager/FightManager";

//全国地图场景
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {

    @property(cc.Label)
    goldLabel: cc.Label = null;   //金币
    @property(cc.Label)
    diamondLabel: cc.Label = null;   //钻石（金锭）
    @property(cc.Label)
    foodLabel: cc.Label = null;   //粮草
    @property(cc.Label)
    lvLabel: cc.Label = null;   //主角等级
    @property(cc.Label)
    lineTimeLabel: cc.Label = null;   //在线时长
    @property(cc.Sprite)
    headSpr: cc.Sprite = null;   //主角头像

    @property(cc.Sprite)
    handSpr: cc.Sprite = null;   //引导手指
    @property([cc.SpriteFrame])
    handFrames: cc.SpriteFrame[] = new Array(2);

    @property(cc.Node)
    mapNode: cc.Node = null;   //地图总节点
    @property(cc.Node)
    homeBtnNode: cc.Node = null;  //主城按钮
    @property(cc.Node)
    skillBtnNode: cc.Node = null;  //技能按钮
    @property(cc.Node)
    unitBtnNode: cc.Node = null;  //部曲按钮
    @property(cc.Node)
    mubingBtnNode: cc.Node = null;  //募兵按钮

    @property(cc.Node)
    topNode: cc.Node = null;
    @property(cc.Node)
    bottomNode: cc.Node = null;
    @property(cc.Node)
    leftNode: cc.Node = null;
    @property(cc.Node)
    rightNode: cc.Node = null;

    @property(cc.Node)
    taskNode: cc.Node = null;  //任务总节点
    @property(cc.Node)
    taskOptNode: cc.Node = null;  //任务伸缩按钮节点

    @property(cc.Prefab)
    pfTask: cc.Prefab = null;  //任务界面
    @property(cc.Prefab)
    pfBag: cc.Prefab = null;   //背包界面
    @property(cc.Prefab)
    pfRecruit: cc.Prefab = null;  //招募界面
    @property(cc.Prefab)
    pfUnit: cc.Prefab = null;   //武将部曲界面
    @property(cc.Prefab)
    pfFightReady: cc.Prefab = null;   //武将出战界面
    @property(cc.Prefab)
    pfSkill: cc.Prefab = null;  //技能界面

    @property(cc.SpriteAtlas)
    cicleAtlas: cc.SpriteAtlas = null;   //转圈序列帧
    @property(cc.SpriteAtlas)
    upgradeAtlas: cc.SpriteAtlas = null;   //主角升级序列帧

    // LIFE-CYCLE CALLBACKS:

    MapLimitPos: cc.Vec2 = cc.v2(2884, 2632);  //地图位置限制
    touchBeginPos: cc.Vec2 = null;  //触摸起点
    bTaskUp: boolean = false;  //任务是否拉伸出来了

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);

        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);

        NoticeMgr.on(NoticeType.UpdateGold, this.UpdateGoldCount, this); 
        NoticeMgr.on(NoticeType.UpdateDiamond, this.UpdateDiamondCount, this); 
        NoticeMgr.on(NoticeType.UpdateFood, this.UpdateFoodCount, this); 
        NoticeMgr.on(NoticeType.UpdateRoleLvOffical, this.updateRoleLvLabel, this);  //更新主角等级
        
        NoticeMgr.on(NoticeType.MapMoveByCity, this.handleMapMoveByCityPos, this);   //话本目标通知（地图移动）

        this.topNode.y = cc.winSize.height/2;
        this.bottomNode.y = -cc.winSize.height/2;
        this.leftNode.position = cc.v2(-cc.winSize.width/2, cc.winSize.height/2);
        this.rightNode.position = cc.v2(cc.winSize.width/2, cc.winSize.height/2);

        this.mapNode.active = true;
        if(MyUserData.capitalLv > 0){
            this.mapNode.position = cc.v2(-600, -900);   //主城开启后显示山阳郡昌邑
        }else{
            this.mapNode.position = cc.v2(0, -900);   //初始显示洛阳  5768*5264   2884*2632
        }
        this.MapLimitPos = cc.v2(this.MapLimitPos.x - cc.winSize.width/2, this.MapLimitPos.y - cc.winSize.height/2);

        this.showMenuBtnByTask();  //根据任务进度是否显示募兵、部曲、技能、主城等按钮
    }

    start () {
        this.UpdateGoldCount();
        this.UpdateDiamondCount();
        this.UpdateFoodCount();
        this.updateRoleLvLabel();  //更新主角等级

        this.showHandActions(-1);   //引导用的手指动画（一定要放到任务之前初始，因为位置由任务决定）

        this.initTaskInfo();   //初始化任务
        this.showLineTime();   //显示在线时长
    }

    update (dt) {
        this.showLineTime();   //显示在线时长
    }

    onDestroy(){
        this.node.targetOff(this);
        NoticeMgr.offAll(this);
    }

    //显示在线时长
    showLineTime(){
        let hour = Math.floor(MyUserData.totalLineTime/60/60);
        let min = Math.floor(MyUserData.totalLineTime/60);
        let sec = Math.floor(MyUserData.totalLineTime%60);
        if(hour > 0){
            this.lineTimeLabel.string = hour + ":" + min + ":" + sec;
        }else{
            this.lineTimeLabel.string = min + ":" + sec;
        }
    }

    //更新主角等级
    updateRoleLvLabel(oldRoleLv: number=0){
        this.lvLabel.string = MyUserData.roleLv.toString();
        if(oldRoleLv > 0){   //主角等级提升
            ROOT_NODE.showTipsText("主角等级提升!");
            FightMgr.showFramesAniAndRemove(this.headSpr.node, cc.v2(0, 20), this.upgradeAtlas, true);
        }
    }

    UpdateGoldCount(){
        this.goldLabel.string = MyUserData.GoldCount.toString();
    }

    UpdateDiamondCount(){
        this.diamondLabel.string = MyUserData.DiamondCount.toString();
    }

    UpdateFoodCount(){
        this.foodLabel.string = MyUserData.FoodCount.toString();
    }

    //初始化任务
    initTaskInfo(){
        let task = cc.instantiate(this.pfTask)
        task.name = "TaskInfo";
        task.y = -95;
        this.taskNode.addChild(task, 10);

        this.bTaskUp = false;
        this.onTaskOptBtn();
    }

    /**预处理地图将要移动的目标坐标，放置移动过大地图出现黑边 */
    preCheckMapDestPos(offset: cc.Vec2){
        let destPos = this.mapNode.position.add(offset);
        if(destPos.x > this.MapLimitPos.x){
            destPos.x = this.MapLimitPos.x;
        }else if(destPos.x < -this.MapLimitPos.x){
            destPos.x = -this.MapLimitPos.x;
        }
        if(destPos.y > this.MapLimitPos.y){
            destPos.y = this.MapLimitPos.y;
        }else if(destPos.y < -this.MapLimitPos.y){
            destPos.y = -this.MapLimitPos.y;
        }
        return destPos;
    }


    //*******************  以下为各种事件处理方法  ************ */
    
    /** 将地图移动到指定目标点
     *  @param talkType 故事类型，0默认（摇旗）1起义暴乱（火） 2 战斗（双刀）
    */
    handleMapMoveByCityPos(cityPos: cc.Vec2, talkType:number=0){
        this.mapNode.stopAllActions();

        let midPos = this.mapNode.position.neg();    //当前视图中心在地图上的坐标
        let offset = midPos.sub(cityPos);
        let destPos = this.preCheckMapDestPos(offset);   //预处理地图将要移动的目标坐标，放置移动过大地图出现黑边

        let moveTime = destPos.sub(midPos).mag()/1000;
        this.mapNode.runAction(cc.sequence(cc.moveTo(moveTime, destPos), cc.callFunc(function(){
            let aniNode = GameMgr.createAtlasAniNode(this.cicleAtlas, 12, cc.WrapMode.Default);
            aniNode.position = cityPos;
            this.mapNode.addChild(aniNode, 100);
        }.bind(this))));
    }

    /**引导用的手指动画 */
    showHandActions(showTaskType: number){
        //cc.log("showHandActions(), showTaskType = "+showTaskType);
        if(showTaskType == -1){   //初始
            this.handSpr.node.opacity = 0;

            this.handSpr.node.runAction(cc.repeatForever(cc.sequence(
                cc.delayTime(0.3), cc.callFunc(function(){
                    this.handSpr.spriteFrame = this.handFrames[1];
                }.bind(this)), cc.delayTime(0.3), cc.callFunc(function(){
                    this.handSpr.spriteFrame = this.handFrames[0];
                }.bind(this))
            )));
        }else{
            let pos = cc.v2(320, -cc.winSize.height/2 + 30);  //默认位置（任务详情或奖励） cc.v2(320, -640)
            if(showTaskType == 2){   //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗 6学习技能 7攻城掠地
                pos = cc.v2(cc.winSize.width/2 - 30, cc.winSize.height/2 - 140);   //引导主城   640+posY cc.v2(350, 530)
            }else if(showTaskType == 3){
                pos = cc.v2(cc.winSize.width/2 - 30, cc.winSize.height/2 - 250);  //引导招募  cc.v2(350, 420)
            }else if(showTaskType == 4){
                pos = cc.v2(cc.winSize.width/2 - 30, cc.winSize.height/2 - 360);  //引导部曲  cc.v2(350, 310)
            }else if(showTaskType == 6){
                pos = cc.v2(-cc.winSize.width/2 + 70, cc.winSize.height/2 - 360);    //引导技能  cc.v2(-300, 310)
            }else if(showTaskType == 0){   //默认位置（任务详情或奖励）

            }

            this.handSpr.node.position = pos;

            if(pos.y < 0){
                if(this.bTaskUp == true){  //任务是否拉伸出来了
                    this.handSpr.node.opacity = 255;
                }else{
                    this.handSpr.node.opacity = 0;
                }
            }else{
                this.handSpr.node.opacity = 255;
            }   
        }
    }


    /************************  以下为各种按钮事件 ***************/

    /**后台切回前台 */
    onShow() {
        cc.log("************* onShow() 后台切回前台 ***********************")
    }

    /**游戏切入后台 */
    onHide() {
        cc.log("_____________  onHide()游戏切入后台  _____________________")
        //NotificationMy.emit(NoticeType.GAME_ON_HIDE, null);
    }

    touchStart(event: cc.Touch){
        this.touchBeginPos = event.getLocation();
    }

    touchMove(event: cc.Touch){
        if(this.touchBeginPos){
            let pos = event.getLocation();
            let offset = pos.sub(this.touchBeginPos);
            this.touchBeginPos = pos;

            this.mapNode.stopAllActions();
            
            let mapPos = this.preCheckMapDestPos(offset);   //预处理地图将要移动的目标坐标，放置移动过大地图出现黑边
            this.mapNode.position = mapPos;
        }
    }

    touchEnd(event: cc.Touch){
        this.touchBeginPos = null;
    }

    /**任务战斗准备 */
    openFightByTask(taskConf: st_story_info){
        if(taskConf.type == 5 && taskConf.battleId > 0){  //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗 6学习技能 7攻城掠地
            let layer = GameMgr.showLayer(this.pfFightReady);
            layer.getComponent(FightReady).initBattleInfo(taskConf.battleId);
        }
    }

    //根据任务进度是否显示募兵、部曲、技能、主城等按钮
    showMenuBtnByTask(){
        if(MyUserData.TaskId >= SpecialStory.mubingOpen){  //开启募兵
            this.mubingBtnNode.active = true; 
            if(MyUserData.TaskId >= SpecialStory.unitOpen){  //开启部曲
                this.unitBtnNode.active = true; 
                if(MyUserData.TaskId >= SpecialStory.skillOpen){  //开启技能
                    this.skillBtnNode.active = true; 
                    if(MyUserData.TaskId >= SpecialStory.capitalOpen){  //开启主城
                        this.homeBtnNode.active = true; 
                    }else{
                        this.homeBtnNode.active = false;
                    }
                }else{
                    this.skillBtnNode.active = false;
                    this.homeBtnNode.active = false;
                }
            }else{
                this.unitBtnNode.active = false;
                this.skillBtnNode.active = false;
                this.homeBtnNode.active = false;
            }
        }else{
            this.mubingBtnNode.active = false;
            this.unitBtnNode.active = false;
            this.skillBtnNode.active = false;
            this.homeBtnNode.active = false;
        }
    }

    //任务栏伸缩操作
    onTaskOptBtn(){
        this.taskNode.stopAllActions();
        this.bTaskUp = !this.bTaskUp;
        if(this.bTaskUp == true){  //任务是否拉伸出来了
            this.taskOptNode.scaleY = -1;
            let destY = 150 - this.taskNode.y;
            this.taskNode.runAction(cc.moveTo(destY/500, cc.v2(0, 150)));

            if(this.handSpr.node.y < 0){
                this.handSpr.node.opacity = 255;
            }
        }else{
            this.taskOptNode.scaleY = 1;
            let destY = this.taskNode.y - 45;
            this.taskNode.runAction(cc.moveTo(destY/500, cc.v2(0, 45)));

            if(this.handSpr.node.y < 0){
                this.handSpr.node.opacity = 0;
            }
        }
    }

    onHomeBtn(){
        cc.director.loadScene("capitalScene");  //点击主城
    }
    onBagBtn(){
        GameMgr.showLayer(this.pfBag);  //背包（武库）界面
    }
    onSkillBtn(){
        GameMgr.showLayer(this.pfSkill);  //技能界面
    }    
    onSoldierBtn(){
        GameMgr.showLayer(this.pfRecruit);   //招募界面
    }

    onGeneralBtn(){
        GameMgr.showLayer(this.pfUnit);   //武将部曲
    }

    onRoleBtn(){
        
    }

    onShopBtn(){

    }

    onSignBtn(){

    }

    onRankBtn(){

    }

    onMoreBtn(){

    }

    onSetBtn(){

    }



}
