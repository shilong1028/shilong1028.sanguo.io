
import { GameMgr } from "../manager/GameManager";
import { AudioMgr } from "../manager/AudioMgr";
import { SkillInfo } from "../manager/Enum";
import List from "../manager/List";
import SkillCell from "./skillCell";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillLayer extends cc.Component {

    @property(List)
    listView: List = null;

    skillArr:SkillInfo[] = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.initTableData();
    }

    // update (dt) {}

    initTableData(){
        this.skillArr = [];
        for(let i=1; i<= GameMgr.SkillCount; ++i){
            this.skillArr.push(new SkillInfo(i));
        }

        this.listView.numItems = this.skillArr.length;
    }

    //列表渲染器
    onListRender(item: cc.Node, idx: number) {
        if(item){
            let info = this.skillArr[idx];
            item.getComponent(SkillCell).initCell(idx, info, this);
        }
    }

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.node.destroy();
    }
}
