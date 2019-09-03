import viewCell from "../tableView/viewCell";
import { BallInfo } from "../manager/Enum";
import Stuff from "./Stuff";
import { GameMgr } from "../manager/GameManager";

//用于tableView的itemCell
const {ccclass, property} = cc._decorator;

@ccclass
export default class FightCell extends viewCell {

    @property(cc.Node)
    selBg: cc.Node = null;

    stuffSc: Stuff = null;

    cellData : BallInfo = null;  
    cellIdx : number = -1;  

    targetSc: any = null;


    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        if (index >= data.array.length) {   //{ array: list, target: x.js }
            //不显示
            this.cellData = null;  
            this.node.active = false;
            this.targetSc = null;
            return;
        }
        this.selBg.active = false;
        
        //if(reload){
            this.cellIdx = index;  
            this.targetSc = data.target;
            this.cellData = data.array[this.cellIdx];
            this.node.active = true;
        //}
        this.onSelected(this._selectState);

        if(this.stuffSc == null){
            let stuffNode = cc.instantiate(GameMgr.getMainScene().pfStuff);
            this.node.addChild(stuffNode, 10);
            this.stuffSc = stuffNode.getComponent(Stuff);
        }
        this.stuffSc.setStuffData(this.cellData);  //设置地块小球模型数据

    }

    onSelected(bSel){
        if(this.selBg && this.selBg.active != bSel){
            if(bSel){
                this.selBg.active = true;
                if(this.targetSc && this.targetSc.handleSelCell){
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

}
