import viewCell from "../tableView/viewCell";
import Card from "../fight/card";
import { ROOT_NODE } from "./rootNode";
import { GeneralInfo } from "../manager/Enum";

//用于tableView的GeneralCell
const {ccclass, property} = cc._decorator;

@ccclass
export default class GeneralCell extends viewCell {

    @property(cc.Node)
    selBg: cc.Node = null;
    @property(cc.Node)
    cellBg: cc.Node = null;
    @property(cc.Node)
    fightState: cc.Node = null;   //出战中...

    cardSc: Card = null;

    cellData : GeneralInfo = null;  
    cellIdx : number = -1;  

    targetSc: any = null;
    bShowSel: boolean = false;   //是否响应选中


    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        if (index >= data.array.length) {   //{ array: list, target: x.js , bShowSel: false}
            //不显示
            this.cellData = null;  
            this.node.active = false;
            return;
        }
        this.fightState.active = false;   //出战中...
        
        this.selBg.active = false;
        //if(reload){
            this.targetSc = data.target;
            this.bShowSel = data.bShowSel;  //是否响应选中
            
            this.cellIdx = index;  
            this.cellData = data.array[this.cellIdx];
            this.node.active = true;
        //}
        this.onSelected(this._selectState);

        this.showGenralUI();
    }

    showGenralUI(){
        //cc.log("showGenralUI(), this.cellIdx = "+this.cellIdx);
        if(this.cardSc == null){
            let itemNode = cc.instantiate(ROOT_NODE.pfCard);
            this.cellBg.addChild(itemNode, 10);
            this.cardSc = itemNode.getComponent(Card);
        }
        this.cardSc.showGeneralCard(this.cellData);

        if(this.cellData.tempFightInfo){
            if(this.cellData.tempFightInfo.bReadyFight == true){
                this.fightState.active = true;
            }else{
                this.fightState.active = false;
            }
        }
    }

    handelUpdateGeneral(generalInfo: GeneralInfo){
        //cc.log("handelUpdateGeneral(), this.cellIdx = "+this.cellIdx);
        if(this.cellData && this.cellData.timeId == generalInfo.timeId){
            this.cellData = generalInfo;
            this.showGenralUI();
        }
    }

    onSelected(bSel){
        if(this.selBg && this.selBg.active != bSel){
            if(bSel && this.bShowSel){
                this.selBg.active = true;
                if(this.targetSc && this.targetSc.handleGeneralCellClick){
                    this.targetSc.handleGeneralCellClick(this.cellIdx, this);   //点击选中回调
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
