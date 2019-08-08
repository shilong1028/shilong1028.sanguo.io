
import viewCell from "../tableView/viewCell";
import BeautifulLayer from "./beautifulLayer";
import { BeautifulInfo } from "../manager/Enum";

//用于tableView的itemCell
const {ccclass, property} = cc._decorator;

@ccclass
export default class BeautifulCell extends viewCell {

    @property(cc.Node)
    selBg: cc.Node = null;

    @property(cc.Sprite)
    headSpr: cc.Sprite = null;

    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;

    cellData : BeautifulInfo = null;  
    cellIdx : number = -1;  
    targetSc: BeautifulLayer = null;

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

        this.headSpr.spriteFrame = this.targetSc.beautifulAtlas.getSpriteFrame(this.cellData.nvId.toString());
        this.nameLabel.string = this.cellData.nvCfg.name;
        this.descLabel.string = this.cellData.nvCfg.desc;
    }

    onSelected(bSel:boolean){
        if(this.selBg && this.selBg.active != bSel){
            if(bSel == true){
                this.selBg.active = true;
                if(this.targetSc){
                    //this.targetSc.handleSelCell(this.cellIdx);
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
