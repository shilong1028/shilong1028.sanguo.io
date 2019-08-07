
import viewCell from "../tableView/viewCell";
import { SkillInfo } from "../manager/Enum";
import SkillLayer from "./skillLayer";

//用于tableView的itemCell
const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillCell extends viewCell {

    @property(cc.Node)
    selBg: cc.Node = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;

    cellData : SkillInfo = null;  
    cellIdx : number = -1;  
    targetSc: SkillLayer = null;


    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        if (index >= data.array.length) {   //{ array: list, target: x.js }
            //不显示
            this.cellData = null;  
            this.targetSc = null;
            this.node.active = false;
            return;
        }
        this.targetSc = data.target;
        this.onSelected(this._selectState);

        //if(reload){
            this.cellIdx = index;  
            this.cellData = data.array[this.cellIdx];
            this.node.active = true;
        //}

        this.iconSpr.spriteFrame = this.targetSc.skillAtlas.getSpriteFrame(this.cellData.skillId.toString());
        this.nameLabel.string = this.cellData.skillCfg.name;
    }

    onSelected(bSel:boolean){
        if(this.selBg && this.selBg.active != bSel){
            if(bSel == true){
                this.selBg.active = true;
                if(this.targetSc){
                    this.targetSc.handleSelSkillCell(this.cellIdx);
                }
            }else{
                this.selBg.active = false;
            }
        }
    }

    //被点击时相应的方法
    clicked () {      
        this.onSelected(true);
    }

}
