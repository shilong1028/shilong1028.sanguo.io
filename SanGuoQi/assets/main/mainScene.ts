//全国地图场景
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {

    @property(cc.Node)
    mapNode: cc.Node = null;   //地图总节点

    @property(cc.Node)
    taskNode: cc.Node = null;  //任务总节点
    @property(cc.Node)
    taskOptNode: cc.Node = null;  //任务伸缩按钮节点
    @property(cc.Prefab)
    pfTask: cc.Prefab = null;  

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

        this.mapNode.position = cc.v2(0, -900);   //初始显示洛阳  5768*5264   2884*2632
        this.MapLimitPos = cc.v2(this.MapLimitPos.x - cc.winSize.width/2, this.MapLimitPos.y - cc.winSize.height/2);
    }

    start () {
        this.setTaskInfo();   //初始化任务
    }

    // update (dt) {}

    onDestroy(){
        this.node.targetOff(this);
    }

    setTaskInfo(){
        let task = cc.instantiate(this.pfTask)
        task.name = "TaskInfo";
        task.y = -95;
        this.taskNode.addChild(task, 10);

        this.bTaskUp = false;
        this.onTaskOptBtn();
    }



    /************************  以下为各种按钮事件 */

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
            
            let mapPos = this.mapNode.position.add(offset);
            if(mapPos.x > this.MapLimitPos.x){
                mapPos.x = this.MapLimitPos.x;
            }else if(mapPos.x < -this.MapLimitPos.x){
                mapPos.x = -this.MapLimitPos.x;
            }
            if(mapPos.y > this.MapLimitPos.y){
                mapPos.y = this.MapLimitPos.y;
            }else if(mapPos.y < -this.MapLimitPos.y){
                mapPos.y = -this.MapLimitPos.y;
            }
            this.mapNode.position = mapPos;
        }
    }

    touchEnd(event: cc.Touch){
        this.touchBeginPos = null;
    }

    onHomeBtn(){
        cc.director.loadScene("capitalScene");
    }

    onTaskOptBtn(){
        this.taskNode.stopAllActions();
        this.bTaskUp = !this.bTaskUp;
        if(this.bTaskUp == true){
            this.taskOptNode.scaleY = -1;
            let destY = 150 - this.taskNode.y;
            this.taskNode.runAction(cc.moveTo(destY/500, cc.v2(0, 150)));
        }else{
            this.taskOptNode.scaleY = 1;
            let destY = this.taskNode.y - 45;
            this.taskNode.runAction(cc.moveTo(destY/500, cc.v2(0, 45)));
        }
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

    onSoldierBtn(){

    }

    onGeneralBtn(){

    }

    
}
