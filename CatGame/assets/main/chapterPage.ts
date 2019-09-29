import { ChapterInfo } from "../manager/Enum";
import { MyUserData } from "../manager/MyUserData";

//章节页签
const {ccclass, property} = cc._decorator;

@ccclass
export default class ChapterPage extends cc.Component {

    @property(cc.Label)
    chapterLabel: cc.Label = null;   //第几章
    @property(cc.Label)
    nameLabel: cc.Label = null;  //章节名称
    @property(cc.Label)
    descLabel: cc.Label = null;  //说明文本
    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;   //章节Icon
    @property(cc.Node)
    lockImg: cc.Node = null;  //锁

    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;  


    // LIFE-CYCLE CALLBACKS:

    chapterInfo: ChapterInfo = null;

    onLoad () {
        this.chapterLabel.string = "";
        this.nameLabel.string = "";
        this.descLabel.string = "";
        this.iconSpr.spriteFrame = null;
    }

    start () {

    }

    // update (dt) {}

    initChapterPage(chapterIdx: number){
        let chapterId = chapterIdx +1;
        this.chapterInfo = new ChapterInfo(chapterId);
        this.chapterLabel.string = chapterId.toString();
        this.nameLabel.string = this.chapterInfo.chapterCfg.name;
        this.iconSpr.spriteFrame = this.iconAtlas.getSpriteFrame("chapter_"+chapterId);
        this.descLabel.string = "拥有关卡第"+this.chapterInfo.chapterCfg.levels[0]+"-"+this.chapterInfo.chapterCfg.levels[1]+"关";

        if(chapterId <= MyUserData.curChapterId){
            this.lockImg.active = false;
        }else{
            this.lockImg.active = true;
        }
    }
}
