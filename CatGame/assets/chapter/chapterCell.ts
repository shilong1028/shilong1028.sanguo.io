
import viewCell from "../tableView/viewCell";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { LevelInfo } from "../manager/Enum";
import LevelNode from "./levelNode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class chapterCell extends viewCell {

    @property(cc.Node)
    levelsNode: cc.Node = null;

    posArr: cc.Vec2[] = new Array(cc.v2(220, 380), cc.v2(0, 310), cc.v2(-250, 230), cc.v2(-260, 0), cc.v2(-130, -150), cc.v2(-270, -370), cc.v2(-10, -330), cc.v2(220, -200), cc.v2(230, 110), cc.v2(50, 20));

    data : any = null;
    cellData : number = null;  
    cellIdx : number = -1;  
    
    // LIFE-CYCLE CALLBACKS:

    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        if (index >= data.array.length) {
            //不显示
            this.cellData = null;  
            this.node.active = false;
            return;
        }

        this.levelsNode.removeAllChildren();
        this.onSelected(this._selectState);

        //if(reload){
            this.data = data;   //{ array: list, target: x.js }
            this.node.active = true;
            
            this.cellData = this.data.array[index];  
            this.cellIdx = index;

        //}

        this.levelsNode.removeAllChildren(true);

        for(let i=1; i<= 10; ++i){
            let levelId = this.cellIdx*10 + i;
            let levelInfo = null;
            if(levelId <= MyUserData.curLevelId){   //已经通关
                levelInfo = MyUserDataMgr.getLevelInfoFromList(levelId);
            }else{
                levelInfo = new LevelInfo(levelId);
            }

            let level = cc.instantiate(this.data.target.Pflevel);
            level.setPosition(this.posArr[i-1]);
            this.levelsNode.addChild(level);
            if(levelInfo){
                level.getComponent(LevelNode).initLevelData(levelInfo, this.data.target);
            }
        }
    }

    onSelected(bSel){
        if(bSel){

        }else{

        }
    }

    //被点击时相应的方法
    clicked () {      
        this.onSelected(true);
    }

}
