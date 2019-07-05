
import viewCell from "../tableView/viewCell";
import RecruitLayer from "./recruitLayer";

//用于tableView的itemCell
const {ccclass, property} = cc._decorator;

@ccclass
export default class RecruitCell extends viewCell {

    @property(cc.Node)
    selBg: cc.Node = null;

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;

    cellData : any = null;  
    cellIdx : number = -1;  
    targetSc: RecruitLayer = null;


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

        this.iconSpr.spriteFrame = this.targetSc.iconFrames[index];
        this.titleLabel.string = this.targetSc.cellTitles[index];
        this.descLabel.string = this.targetSc.cellDescs[index];
    }

    onSelected(bSel:boolean){
        if(this.selBg && this.selBg.active != bSel){
            if(bSel == true){
                this.selBg.active = true;
                if(this.targetSc){
                    this.targetSc.handleSelCell(this.cellIdx);
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

    onRecruitBtn(){
        cc.log("招募, this.cellData = "+JSON.stringify(this.cellData));
    }

}
