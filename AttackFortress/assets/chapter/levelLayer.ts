import { AudioMgr } from "../manager/AudioMgr";
import { LevelInfo } from "../manager/Enum";
import { MyUserData } from "../manager/MyUserData";
import Item from "../common/item";

//关卡描述
const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelLayer extends cc.Component {

    @property(cc.Label)
    levelIdLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    levelDesc: cc.Label = null;   //关卡描述
    @property([cc.Sprite])
    starSprs: cc.Sprite[] = new Array(3);
    @property(cc.SpriteFrame)
    grayFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    lightFrame: cc.SpriteFrame = null;
    @property(cc.Label)
    costText: cc.Label = null;
    @property(cc.Label)
    rewardText: cc.Label = null;
    @property(cc.Label)
    probabilityText: cc.Label = null;
    @property(cc.Node)
    itemLayout: cc.Node = null;  //道具掉落

    @property(cc.Prefab)
    pfItem: cc.Prefab = null;  //道具

    @property(cc.Button)
    fightBtn: cc.Button = null;  //战斗按钮
    @property(cc.Sprite)
    levelSpr: cc.Sprite = null;  //关卡图标
    @property(cc.SpriteAtlas)
    iconAtlas: cc.SpriteAtlas = null;

    levelInfo: LevelInfo = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.levelIdLabel.string = "";
        this.levelDesc.string = "";
        this.costText.string = "";
        this.rewardText.string = "";
        this.probabilityText.string = "概率";
        this.fightBtn.interactable = false;
    }

    start () {

    }

    // update (dt) {}

    onCloseBtn(){
        AudioMgr.playEffect("effect/hecheng/ui_click");
        this.node.removeFromParent(true);
    }

    onStartBtn(){
        AudioMgr.playEffect("effect/hecheng/ui_click");

        // if(this.levelInfo.levelId > 0){
        //     FightMgr.level_id = this.levelInfo.levelId;
        //     GameMgr.goToSceneWithLoading("FightScene");
        // }
    }

    /**初始化关卡信息 */
    initLevelInfo(levelInfo: LevelInfo){ 
        this.levelInfo = levelInfo;
        if(this.levelInfo.levelId <= MyUserData.curLevelId+1){
            this.fightBtn.interactable = true;
        }else{
            this.fightBtn.interactable = false;
        }

        this.levelIdLabel.string = this.levelInfo.levelId.toString();

        let levelCfg = this.levelInfo.levelCfg;
        this.nameLabel.string = levelCfg.name;
        this.costText.string = levelCfg.cost.toString();
        this.rewardText.string = levelCfg.gold.toString()+"（随星级变化）";
        this.levelDesc.string = "本关有"+levelCfg.total_lines+"行，敌人总数"+levelCfg.enemy_count+"个，等级"+levelCfg.enemy_ids[0]+"至"+levelCfg.enemy_ids[1]+"级随机";
        this.probabilityText.string = "概率"+levelCfg.probability*100+"%"+"（随星级翻倍）";

        this.levelSpr.spriteFrame = this.iconAtlas.getSpriteFrame("monster_"+levelCfg.resId);

        for(let i=0; i<3; ++i){
            if(i < this.levelInfo.starNum){
                this.starSprs[i].spriteFrame = this.lightFrame;
            }else{
                this.starSprs[i].spriteFrame = this.grayFrame;
            }
        }

        for(let i=0; i<levelCfg.itemids.length; ++i){
            let itemId = levelCfg.itemids[i];
            let item = cc.instantiate(this.pfItem);
            this.itemLayout.addChild(item);
            item.getComponent(Item).initItemById(itemId);
        }
    }
}
