import Rubbish from "./rubbish";
import { CfgMgr } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";

//垃圾分类小游戏2
const {ccclass, property} = cc._decorator;

@ccclass
export default class Game2Scene extends cc.Component {

    @property(cc.Node)
    qipanNode: cc.Node = null;
    @property(cc.Label)   
    stepLabel: cc.Label = null;
    @property(cc.Node)
    targetNode: cc.Node = null;   //回收任务节点
    @property(cc.Label)
    targetText: cc.Label = null;
    @property(cc.Sprite)
    targetIcon: cc.Sprite = null;

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
    fightRubbishType: number = 1;   //战斗中找出的垃圾类型 1有害垃圾 2可回收垃圾 3餐厨（湿垃圾） 4其他（干垃圾）

    rubbishDropCount: number = 0;  //关卡战斗垃圾落地总数
    rubbishSuccClickNum: number = 0;   //点击正确的垃圾总数
    rubbishCreateStep: number = 5;   //垃圾产出帧数间隔

    rubbishSpeed: number = 500;  //垃圾下落速度
    rubbishKeys: string[] = new Array();  //配置中的垃圾ID集合

    bStopTouch: boolean = false;   //是否停止触摸反应
    selectRubbish: Rubbish = null;


    onLoad () {
        this.beginTime = 0;
        this.beginStep = 0;
        this.stepLabel.string = "准备开始";

        this.rubbishDropCount = 0;  //关卡战斗垃圾落地总数
        this.rubbishSuccClickNum = 0;   //点击正确的垃圾总数
        this.rubbishCreateStep = 5;   //垃圾产出帧数间隔

        this.bGameOver = false;

        this.fightRubbishType = Math.ceil(Math.random()*4);  //战斗中找出的垃圾类型
        this.targetNode.active = false;

        this.countLabel.string = "";
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
        this.bGameOver = true;
        GameMgr.showLayer(this.pfGameOver);
    }

    start () {
        this.targetNode.active = true;
        this.targetIcon.spriteFrame = this.targetFrames[this.fightRubbishType-1];
        if(this.fightRubbishType == 1){
            this.targetText.string = "有害垃圾";
            this.targetText.node.color = cc.color(233, 47, 35);
            this.countLabel.node.color = cc.color(233, 47, 35);
        }else if(this.fightRubbishType == 2){
            this.targetText.string = "可回收垃圾";
            this.targetText.node.color = cc.color(16, 71, 131);
            this.countLabel.node.color = cc.color(16, 71, 131);
        }else if(this.fightRubbishType == 3){
            this.targetText.string = "湿(餐厨)垃圾";
            this.targetText.node.color = cc.color(105, 65, 55);
            this.countLabel.node.color = cc.color(105, 65, 55);
        }else if(this.fightRubbishType == 4){
            this.targetText.string = "干(其他)垃圾";
            this.targetText.node.color = cc.color(44, 43, 41);
            this.countLabel.node.color = cc.color(44, 43, 41);
        }
        this.countLabel.string = "0";
    }

    update (dt) {
        if(this.bGameOver == false){
            this.beginTime ++;
            if(this.beginTime >= 60.0){
                if(this.beginStep < 4){
                    this.beginTime = 0;
                    this.beginStep ++;
                    this.stepLabel.string = (4 - this.beginStep).toString();
                }else{
                    this.beginTime = 0;
                    this.beginStep = 5;   //开始战斗
                    this.stepLabel.string = "";
                    this.targetNode.active = false;

                    if(this.rubbishCreateStep >= 1){  //垃圾产出帧数间隔
                        this.rubbishCreateStep = 0;
                        this.createOneRandomRubbish();
                    }else{
                        this.rubbishCreateStep ++;
                    }
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
        let randIdx = Math.ceil(Math.random()*this.rubbishKeys.length);
        let randIdStr = this.rubbishKeys[randIdx];
        cc.log("createOneRandomRubbish(), randIdStr = "+randIdStr);

        let rubbishNode = this.createRubbishFromPool();
        if(rubbishNode){
            let randPosX = (Math.random()-0.5)*(this.qipanNode.width/2 - 50);
            rubbishNode.position = cc.v2(randPosX, this.qipanNode.height/2);
            cc.log("rubbishNode.position = "+rubbishNode.position);
            this.qipanNode.addChild(rubbishNode, 10);
            rubbishNode.getComponent(Rubbish).initRubbish(parseInt(randIdStr), this, false);
        }
    }

    //垃圾落地
    handleRubbishEnd(rubbishType: number){
        if(this.bGameOver == false && this.fightRubbishType == rubbishType){
            this.rubbishDropCount ++;  //关卡战斗垃圾落地总数
            let num = 10 - this.rubbishDropCount;
            this.tipNum.string = num + "/10";
            this.progressBar.progress = num/10;

            if(this.rubbishDropCount > 10){   //游戏结束
                this.bGameOver = true;
            }
        }
    }

    //正确点击回收的垃圾
    handleRubbishSuccClick(rubbishType: number){
        if(this.bGameOver == false && this.fightRubbishType == rubbishType){
            this.rubbishSuccClickNum ++;   //点击正确的垃圾总数
            this.countLabel.string = this.rubbishSuccClickNum.toString();
        }
    }
}
