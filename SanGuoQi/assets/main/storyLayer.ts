import { st_story_info, CfgMgr, st_talk_info } from "../manager/ConfigManager";
import { MyUserData } from "../manager/MyUserData";

//剧情阐述
const {ccclass, property} = cc._decorator;

@ccclass
export default class StoryLayer extends cc.Component {

    @property(cc.Node)
    tvNode: cc.Node = null;

    @property(cc.VideoPlayer)
    videoPlayer: cc.VideoPlayer = null;

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

    bVedioPlayedOver: boolean = true;   //视频是否播放完毕

    onLoad () {
        this.talkLabel.string = "";
        this.tvNode.active = false;
        this.skipNode.active = false;
    }

    start () {
    }

    update (dt) {
        if(this.bUpdateStr == true && this.curTalkConf){
            this.curTalkStrIdx ++;
            if(this.curTalkStrIdx >= this.curTalkConf.desc.length){
                this.talkLabel.string = this.curTalkConf.desc;
                this.bUpdateStr = false;

                if(this.curTalkIdx == this.taskConf.talk.length-1){
                    if(this.bVedioPlayedOver == true){
                        this.skipNode.active = true;
                    }
                }else{
                    this.skipNode.active = true;
                }
            }else{
                let str = this.curTalkConf.desc.substr(0, this.curTalkStrIdx);  
                //substr(start,length)表示从start位置开始，截取length长度的字符串。
                //substring(start,end)表示从start到end之间的字符串，包括start位置的字符但是不包括end位置的字符。
                this.talkLabel.string = str;
            }
        }
    }

    /**初始化主线任务 */
    initStoryConf(taskConf: st_story_info){
        if(taskConf){
            this.taskConf = taskConf;
            this.curTalkIdx = -1;
            this.setTalkStr();   //设置话本内容

            // if(this.taskConf.vedio.length > 1){
            //     this.tvNode.active = true;
            //     this.bVedioPlayedOver = false;
            //     this.playLocalVideo(this.taskConf.vedio);
            //     //this.playOnlineVideo();
            // }
        }
    }

    /**设置话本内容 */
    setTalkStr(){
        if(this.taskConf){
            this.bUpdateStr = false;
            this.curTalkIdx ++;
            this.curTalkConf = null;
            this.curTalkStrIdx = 0;
            
            if(this.curTalkIdx < this.taskConf.talk.length){
                if(this.curTalkIdx == this.taskConf.talk.length-1){
                    this.skipLabel.string = "结束";
                }else{
                    this.skipLabel.string = "继续";
                }

                let talkId = this.taskConf.talk[this.curTalkIdx];
                this.curTalkConf = CfgMgr.getTalkConf(talkId);
                cc.log("this.curTalkConf = "+JSON.stringify(this.curTalkConf));
                this.bUpdateStr = true;
            }
        }
    }

    playLocalVideo (videoName: string) {
        cc.log("playLocalVideo(), videoName = "+videoName);
        this.videoPlayer.resourceType = cc.VideoPlayer.ResourceType.LOCAL;

        this.videoPlayer.clip = "mp4/"+videoName+".mp4";
        this.videoPlayer.play();
    }

    onSkipBtn(){
        this.skipNode.active = false;
        if(this.curTalkConf && this.curTalkIdx < this.taskConf.talk.length-1){
            this.setTalkStr();   //设置话本内容
        }else{
            this.node.removeFromParent(true);
        }
    }

    onVideoPlayerEvent (sender, event) {
        cc.log("onVideoPlayerEvent(), event = "+event);
        if (event === cc.VideoPlayer.EventType.COMPLETED) {
            this.bVedioPlayedOver = true;
            if(this.curTalkIdx == this.taskConf.talk.length-1 && this.curTalkStrIdx >= this.curTalkConf.desc.length){
                this.skipNode.active = true;
            }

        }
        // else if (event === cc.VideoPlayer.EventType.CLICKED) {
        //     if (this.videoPlayer.isPlaying()) {
        //         this.videoPlayer.pause();
        //     } else {
        //         this.videoPlayer.play();
        //     }
        // }
        // else if (event === cc.VideoPlayer.EventType.PLAYING) {
        // }else if (event === cc.VideoPlayer.EventType.PAUSED) {
        // }else if (event === cc.VideoPlayer.EventType.STOPPED) {
        // }else if (event === cc.VideoPlayer.EventType.META_LOADED) {
        // }else if (event === cc.VideoPlayer.EventType.READY_TO_PLAY) {
        // }
    }

    playOnlineVideo () {
        this.videoPlayer.resourceType = cc.VideoPlayer.ResourceType.REMOTE;
        this.videoPlayer.remoteURL = 'http://benchmark.cocos2d-x.org/cocosvideo.mp4';
        //this.videoPlayer.isFullscreen = true;
        this.videoPlayer.play();
    }

}
