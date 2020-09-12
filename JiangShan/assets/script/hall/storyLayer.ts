import { st_story_info, st_talk_info, CfgMgr, st_city_info, ItemInfo } from "../manager/ConfigManager";
import { NoticeMgr, NoticeType } from "../manager/NoticeManager";
import { TaskType } from "../manager/Enum";
import { GameMgr } from "../manager/GameManager";
import { ROOT_NODE } from "../login/rootNode";


//剧情阐述
const {ccclass, property} = cc._decorator;

@ccclass
export default class StoryLayer extends cc.Component {

    @property(cc.Node)
    leftHeadSpr: cc.Node = null;
    @property(cc.Node)
    rightHeadSpr: cc.Node = null;
    @property(cc.Node)
    rewardLayout: cc.Node = null;
    @property(cc.Label)
    taskTitleLabel: cc.Label = null;  //任务章节
    @property(cc.Label)
    taskNameLabel: cc.Label = null;  //任务名称

    @property(cc.Label)
    talkLabel: cc.Label = null;
    @property(cc.Node)
    skipNode: cc.Node = null;
    @property(cc.Label)
    skipLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    taskConf: st_story_info = null;   //剧情配置
    curTalkIdx: number = -1;  //当前话本索引
    curTalkConf: st_talk_info = null;   //当前话本配置数据
    curTalkStrIdx: number = 0;   //当前话本内容显示索引
    bUpdateStr: boolean = false;   //是否更新显示话本内容

    onLoad () {
        this.talkLabel.string = "";
        this.skipNode.active = false;
        this.leftHeadSpr.active = false;
        this.rightHeadSpr.active = false;
    }

    onDestroy(){
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    removeRewardItems(){
        for(let i=0; i<this.rewardLayout.childrenCount; i++){
            let item = this.rewardLayout.children[i];
            ROOT_NODE.removeItem(item);
        }
    }

    start () {
    }

    /**初始化主线任务 */
    initStoryConf(taskConf: st_story_info){
        if(taskConf){
            cc.log("initStoryConf taskConf = "+JSON.stringify(taskConf))
            this.taskConf = taskConf;
            this.curTalkIdx = -1;
            this.taskTitleLabel.string = `第${taskConf.chapterId}章`  //任务章节
            this.taskNameLabel.string = taskConf.name;  //任务名称
            
            this.setTalkStr();   //设置话本内容

            this.removeRewardItems();
            let rewards: Array<ItemInfo> = GameMgr.getItemArrByKeyVal(this.taskConf.rewards);
            for(let i=0; i<rewards.length; ++i){
                let item = ROOT_NODE.createrItem(rewards[i]);
                this.rewardLayout.addChild(item);
            }
        }
    }

    /**设置话本内容 */
    setTalkStr(){
        if(this.taskConf){
            this.bUpdateStr = false;
            this.curTalkIdx ++;
            this.curTalkConf = null;
            this.curTalkStrIdx = 0;

            if(this.curTalkIdx < this.taskConf.talks.length){
                if(this.curTalkIdx == this.taskConf.talks.length-1){
                    this.skipLabel.string = "结   束";
                }else{
                    this.skipLabel.string = "继   续";
                }

                let talkId = this.taskConf.talks[this.curTalkIdx];
                this.curTalkConf = CfgMgr.getTalkConf(talkId);
                //cc.log("this.curTalkConf = "+JSON.stringify(this.curTalkConf));
                this.bUpdateStr = true;

                let path = "head_talk/"
                if(this.curTalkConf.head > 100){  //对话头像，<100为head_talk中头像，>100为head头像
                    path = "head/"
                }
                path += this.curTalkConf.head;
    
                if(this.curTalkIdx % 2 == 0){   //左侧头像
                    this.leftHeadSpr.active  = true;
                    GameMgr.setSpriteFrameByImg(path, this.leftHeadSpr);
                }else{
                    this.rightHeadSpr.active  = true;
                    GameMgr.setSpriteFrameByImg(path, this.rightHeadSpr);
                }

                if(this.curTalkConf.city > 0){   //话本目标城池
                    let cityConf: st_city_info = CfgMgr.getCityConf(this.curTalkConf.city);
                    if(cityConf){
                        NoticeMgr.emit(NoticeType.MapMoveByCity, cc.v2(cityConf.pos_x, cityConf.pos_y), this.curTalkConf.type);   //话本目标通知（地图移动）
                    }
                }
            }
        }
    }

    update (dt) {
        if(this.bUpdateStr == true && this.curTalkConf){
            this.curTalkStrIdx ++;
            if(this.curTalkStrIdx >= this.curTalkConf.desc.length){
                this.talkLabel.string = this.curTalkConf.desc;
                this.bUpdateStr = false;

                if(this.curTalkIdx == this.taskConf.talks.length-1){   //最后一个对话
                    this.skipNode.active = true;
                }
            }else{
                let str = this.curTalkConf.desc.substr(0, this.curTalkStrIdx);  
                //substr(start,length)表示从start位置开始，截取length长度的字符串。
                //substring(start,end)表示从start到end之间的字符串，包括start位置的字符但是不包括end位置的字符。
                this.talkLabel.string = str;
            }

            if(this.curTalkConf.skip > 0 && this.curTalkStrIdx >= 10){
                this.skipNode.active = true;
            }
        }
    }

    onSkipBtn(){
        this.skipNode.active = false;
        if(this.curTalkConf && this.curTalkIdx < this.taskConf.talks.length-1){   //跳过
            this.setTalkStr();   //设置话本内容
        }else{  //结束
            if(this.taskConf.type == TaskType.Story){   //任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗 6学习技能 7攻城掠地
                GameMgr.handleStoryShowOver(this.taskConf);   //任务宣读(第一阶段）完毕处理
            }else if(this.taskConf.type == TaskType.Fight){
                let mainScene = GameMgr.getMainScene();
                if(mainScene){
                    mainScene.openFightByTask(this.taskConf);   //战斗选将准备界面
                }
            }
            this.node.destroy();
        }
    }

}
