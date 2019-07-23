
import viewCell from "../tableView/viewCell";
import { st_rubbish_info } from "../manager/ConfigManager";
import SearchScene from "./searchScene";

//用于tableView的itemCell
const {ccclass, property} = cc._decorator;

@ccclass
export default class ResultCell extends viewCell {

    //@property(cc.Node)
    selBg: cc.Node = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;

    @property(cc.Sprite)
    typeSpr: cc.Sprite = null;

    cellData : any = null;  
    cellIdx : number = -1;  
    targetSc: SearchScene = null;


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
            this.cellData = data.array[this.cellIdx];    //{"mathchCount":100, "obj":obj, "idstr":idstr}
            this.node.active = true;
        //}

        let conf: st_rubbish_info = this.cellData.obj;

        this.typeSpr.spriteFrame = this.targetSc.typeFrames[conf.type-1];
        this.iconSpr.spriteFrame = this.targetSc.iconAtlas.getSpriteFrame(this.cellData.idstr);

        this.nameLabel.string = conf.name;
        this.descLabel.string = conf.desc;
    }

    onSelected(bSel:boolean){
        if(this.selBg && this.selBg.active != bSel){
            if(bSel == true){
                this.selBg.active = true;
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
