
import ChapterScene from "./chapterScene";
import { AudioMgr } from "../manager/AudioMgr";
import { LevelInfo } from "../manager/Enum";

//关卡节点
const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelNode extends cc.Component {

    @property(cc.Label)
    levelIdLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property([cc.Sprite])
    starSprs: cc.Sprite[] = new Array(3);
    @property(cc.SpriteFrame)
    grayFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    lightFrame: cc.SpriteFrame = null;

    @property(cc.Sprite)
    levelSpr: cc.Sprite = null;  //关卡图标
    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    levelInfo: LevelInfo = null;
    targetScene: ChapterScene = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.levelIdLabel.string = "";
    }

    start () {

    }

    // update (dt) {}

    /**初始化关卡数据 */
    initLevelData(levelInfo: LevelInfo, targetScene: ChapterScene = null){
        this.levelInfo = levelInfo;
        this.targetScene = targetScene;
        this.levelIdLabel.string = this.levelInfo.levelId.toString();
        this.nameLabel.string = this.levelInfo.levelCfg.name;
        this.levelSpr.spriteFrame = this.iconAtlas.getSpriteFrame("monster_"+levelInfo.levelCfg.resId);

        for(let i=0; i<3; ++i){
            if(i < this.levelInfo.starNum){
                this.starSprs[i].spriteFrame = this.lightFrame;
            }else{
                this.starSprs[i].spriteFrame = this.grayFrame;
            }
        }
    }

    onClickLevel(){
        AudioMgr.playEffect("effect/hecheng/ui_click");
        if(this.targetScene){
            this.targetScene.onSelectLeve(this.levelInfo);
        }
    }
}
