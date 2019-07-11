import Rubbish from "./rubbish";
import { CfgMgr } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";
import GameOver from "./gameover";

//垃圾分类小游戏1
const {ccclass, property} = cc._decorator;

@ccclass
export default class Game1Scene extends cc.Component {

    @property(cc.Node)
    qipanNode: cc.Node = null;
    @property(cc.Label)   
    stepLabel: cc.Label = null;
    @property(cc.Node)
    targetNode: cc.Node = null;   //回收任务节点

    @property(cc.Node)
    reclaimNode: cc.Node = null;   //垃圾回收节点
    @property([cc.Node])
    reclaimArr: cc.Node[] = new Array(4);

    @property(cc.Node)
    resultNode: cc.Node = null;
    @property(cc.Label)
    countLabel: cc.Label = null;  //回收数量
    @property(cc.Label)
    tipNum: cc.Label = null;  //原谅次数
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Prefab)
    pfRubbish: cc.Prefab = null;
    @property(cc.Prefab)
    pfGameOver: cc.Prefab = null;

    @property([cc.SpriteFrame])
    targetFrames: cc.SpriteFrame[] = new Array(4);

    // LIFE-CYCLE CALLBACKS:

    rubbishPool: cc.NodePool =  null;   //缓存池

    beginTime: number = 0;   //战斗时间
    beginStep: number = 0;   //战斗步骤，0准备开始，1-4倒计时3-2-1-0

    bGameOver: boolean = false;  //战斗是否结束

    rubbishDropCount: number = 0;  //关卡战斗垃圾落地总数
    rubbishSuccClickNum: number = 0;   //点击正确的垃圾总数
    rubbishCreateStep: number = 50;   //垃圾产出帧数间隔

    rubbishSpeed: number = 200;  //垃圾下落速度
    rubbishKeys: string[] = new Array();  //配置中的垃圾ID集合

    bStopTouch: boolean = false;   //是否停止触摸反应
    selectRubbish: Rubbish = null;


    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.ontTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.ontTouchEnd, this);

        this.beginTime = 0;
        this.beginStep = 0;
        this.stepLabel.string = "准备开始";

        this.rubbishDropCount = 0;  //关卡战斗垃圾落地总数
        this.rubbishSuccClickNum = 0;   //点击正确的垃圾总数
        this.rubbishCreateStep = 50;   //垃圾产出帧数间隔

        this.bGameOver = false;

        this.targetNode.active = false;
        this.reclaimNode.active = false;

        this.countLabel.string = "0";
        this.tipNum.string = "10/10";
        this.progressBar.progress = 100;

        this.rubbishKeys = Object.getOwnPropertyNames(CfgMgr.C_rubbish_info);

        this.rubbishPool =  new cc.NodePool(Rubbish);   //砖块缓存池
        //只有在new cc.NodePool(Rubbish)时传递poolHandlerComp，才能使用 Pool.put() 回收节点后，会调用unuse 方法
    }

    onDestroy(){
        this.rubbishPool.clear();
    }

    onBackBtn(){
        this.handleGameOver();   //游戏结束
    }

    start () {
        this.targetNode.active = true;
    }

    update (dt) {
        if(this.bGameOver == false){
            this.beginTime ++;
            if(this.beginTime >= 60.0 && this.beginStep <= 4){
                if(this.beginStep < 4){
                    this.beginTime = 0;
                    this.beginStep ++;
                    this.stepLabel.string = (4 - this.beginStep).toString();

                    if(this.beginStep == 4){
                        this.reclaimNode.active = true;
                    }
                }else{
                    this.beginTime = 0;
                    this.beginStep = 5;   //开始战斗
                    this.stepLabel.string = "";
                    this.targetNode.active = false;
                }
            }

            if(this.beginStep == 5){
                if(this.rubbishCreateStep >= 50){  //垃圾产出帧数间隔
                    this.createOneRandomRubbish();
                }else{
                    this.rubbishCreateStep ++;
                }
            }
        }
    }

    /**从缓存池中获取或创建砖块 */
    createRubbishFromPool(): cc.Node{
        if (this.rubbishPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            return this.rubbishPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            return cc.instantiate(this.pfRubbish);
        }
    }

    /**将砖块回收到缓存池 */
    removeRubbishToPool(brick: cc.Node){
        this.rubbishPool.put(brick); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }

    //随机产生一个垃圾
    createOneRandomRubbish(){
        this.rubbishCreateStep = 0;
        let randIdx = Math.ceil(Math.random()*this.rubbishKeys.length);
        let randIdStr = this.rubbishKeys[randIdx];

        let rubbishNode = this.createRubbishFromPool();
        if(rubbishNode){
            let randPosX = (Math.random()-0.5)*(this.qipanNode.width/2 - 50);
            rubbishNode.position = cc.v2(randPosX, this.qipanNode.height/2);
            this.qipanNode.addChild(rubbishNode, 10);
            rubbishNode.getComponent(Rubbish).initRubbish(parseInt(randIdStr), this, true);
        }
    }

    onTouchStart(event: cc.Event.EventTouch) {  
        if(this.bGameOver == false && this.selectRubbish){ //是否停止触摸反应
            this.updateSelectRubbish(event.getLocation());  
        }
    }

    onTouchMove(event: cc.Event.EventTouch) {
        if(this.bGameOver == false && this.selectRubbish){
            this.updateSelectRubbish(event.getLocation());   //拖动更新选中模型的位置
        }
    }

    ontTouchEnd(event: cc.Event.EventTouch) {
        if(this.bGameOver == false && this.selectRubbish){
            this.placeSelectRubbish(event.getLocation());   //放置选中的模型
        }
    }

    /**设置选中的将要移动的模型 */
    setSelectRubbish(block: Rubbish){
        if(this.bGameOver == false){
            this.selectRubbish = block; 
        }
    }

    /**拖动更新选中的模型的位置 */
    updateSelectRubbish(touchPos: cc.Vec2){
        if(this.selectRubbish == null){
            return;
        }
        let pos = this.qipanNode.convertToNodeSpaceAR(touchPos);
        this.selectRubbish.udpatePosByTouch(pos);
    }

    /**放置选中的模型 */
    placeSelectRubbish(touchPos : cc.Vec2){
        if(this.selectRubbish == null){
            return;
        }
        let pos = this.reclaimNode.convertToNodeSpaceAR(touchPos);   //删除节点
        let rect = cc.rect(-this.reclaimNode.width/2, 0, this.reclaimNode.width, this.reclaimNode.height);
        if(rect.contains(pos)){  //删除
            let rubbishType = this.selectRubbish.rubbishConf.type;
            let destNode = this.reclaimArr[rubbishType-1];
            let destRect = cc.rect(destNode.x-destNode.width/2, destNode.y-destNode.height/2, destNode.width, destNode.height);
            if(destRect.contains(pos)){   //回收正确
                this.selectRubbish.handleReclaimRubbish(true, true);   //是否正确回收垃圾
            }else{
                this.selectRubbish.handleReclaimRubbish(false, true);   //是否正确回收垃圾
            }
        }else{
            this.selectRubbish.resetMoveToEnd();   //垃圾移动到底部
        }

        this.selectRubbish = null;   //拖动的模型数据
    }

    //垃圾落地
    handleRubbishEnd(){
        if(this.bGameOver == false){
            this.rubbishDropCount ++;  //关卡战斗垃圾落地总数
            let num = 10 - this.rubbishDropCount;
            this.tipNum.string = num + "/10";
            this.progressBar.progress = num/10;
    
            if(this.rubbishDropCount > 10){   //游戏结束
                this.handleGameOver();   //游戏结束
            }
        }
    }

    //正确点击回收的垃圾
    handleRubbishSuccClick(){
        if(this.bGameOver == false){
            this.rubbishSuccClickNum ++;   //点击正确的垃圾总数
            this.countLabel.string = this.rubbishSuccClickNum.toString();

            this.createOneRandomRubbish();
        }
    }

    handleGameOver(){
        this.bGameOver = true;
        let layer = GameMgr.showLayer(this.pfGameOver);
        layer.getComponent(GameOver).initGameOverData(this.beginTime, this.rubbishSuccClickNum, this.rubbishSuccClickNum*5);
    }
}
