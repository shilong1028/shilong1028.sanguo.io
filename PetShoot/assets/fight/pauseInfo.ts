import { NotificationMy } from "../manager/NoticeManager";
import { NoticeType, SkillInfo } from "../manager/Enum";
import { AudioMgr } from "../manager/AudioMgr";
import { FightMgr } from "../manager/FightManager";
import { GuideMgr, GuideStepEnum } from "../manager/GuideMgr";
import List from "../manager/List";
import FightSkillCell from "./fightSkillCell";


//暂停界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseInfo extends cc.Component {

    @property(cc.Node)
    bgImg: cc.Node = null;
    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(cc.Node)
    touchNode: cc.Node = null;
    @property(List)
    listView: List = null;
    @property(cc.Node)
    listBg: cc.Node = null;

    skillList:SkillInfo[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.descLabel.string = "";
    }

    start () {
        NotificationMy.emit(NoticeType.GamePause, null);   //游戏暂停，停止小球和砖块的动作，但动画特效不受影响

        this.skillList = FightMgr.getFightScene().skillList;
        this.listView.numItems = this.skillList.length;
        this.listView.selectedId = 0;

        if(GuideMgr.checkGuide_NewPlayer(GuideStepEnum.FightSet_Guide_Step2, this.guideSkillInfo, this) == false){  //点击技能，查看战斗技能说明。
        }
    }
    guideSkillInfo(step: GuideStepEnum){
        GuideMgr.showGuideLayer(this.listBg, ()=>{
            GuideMgr.endGuide_NewPlayer(step);
            this.descLabel.string = FightMgr.getFightScene().skillList[0].skillCfg.desc;
        });
    }

    //列表渲染器
    onListRender(item: cc.Node, idx: number) {
        if(item){
            let info = this.skillList[idx];
            item.getComponent(FightSkillCell).initCell(idx, info, this);
        }
    }

    //当列表项被选择...
    onListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!item)
            return;
        item.getComponent(FightSkillCell).onSelected(true);
    } 

    handleSelCell(cellIdx: number, skillInfo: SkillInfo){
        this.descLabel.string = skillInfo.skillCfg.desc;
    }

    // update (dt) {}

    touchEnd(event: cc.Touch){
        let pos = event.getLocation();
        let pos1 = this.bgImg.convertToNodeSpaceAR(pos);
        let rect1 = cc.rect(-this.bgImg.width/2, -this.bgImg.height/2, this.bgImg.width, this.bgImg.height);
        if(!rect1.contains(pos1)){
            this.onContinueBtn();
        }
    }

    /**继续游戏 */
    onContinueBtn(){
        AudioMgr.playEffect("effect/ui_click");
        NotificationMy.emit(NoticeType.GameResume, null);  //继续游戏
        this.node.destroy();
    }

    /**重新开始 */
    onRenewBtn(){
        AudioMgr.playEffect("effect/ui_click");
        NotificationMy.emit(NoticeType.GameReStart, null);  //重新开始游戏
        FightMgr.loadLevel(FightMgr.level_id, true);
        this.node.destroy();
    }

    /**退出战斗 */
    onExitBtn(){
        AudioMgr.playEffect("effect/ui_click");
        NotificationMy.emit(NoticeType.GameReStart, null);  //重新开始游戏

        FightMgr.getFightScene().exitFightScene();
    }
}
