import { ItemInfo, BallInfo, SkillInfo } from "../manager/Enum";
import { ROOT_NODE } from "./rootNode";
import Stuff from "./Stuff";
import Item from "./item";
import Skill from "./skill";

//奖励提示界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class TipsReward extends cc.Component {

    @property(cc.Label)
    goldLabel: cc.Label = null;

    @property(cc.Label)
    diamondLabel: cc.Label = null;

    @property(cc.Node)
    rewardNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    callback: any = null;

    onLoad () {
        this.goldLabel.string = "";
        this.diamondLabel.string = "";
    }

    start () {
    }

    // update (dt) {}

    onOkBtn(){
        if(this.callback){
            this.callback();
        }
        this.node.removeFromParent(true);
    }

    setRewards(gold:number, diamond: number, callback: any = null, items:ItemInfo[]=null, balls: BallInfo[]=null, skills: SkillInfo[]=null){
        this.callback = callback;
        if(gold > 0){
            this.goldLabel.string = "+"+gold;
        }
        if(diamond > 0){
            this.diamondLabel.string = "+"+diamond;
        }
        if(items){
            for(let i=0; i<items.length; ++i){
                let itemNode = cc.instantiate(ROOT_NODE.pfItem);
                this.rewardNode.addChild(itemNode);
                let item = itemNode.getComponent(Item);
                item.initItemByData(items[i]);   //设置地块道具模型数据 
            }
        }
        if(balls){
            for(let i=0; i<balls.length; ++i){
                let stuffNode = cc.instantiate(ROOT_NODE.pfStuff);
                this.rewardNode.addChild(stuffNode);
                let stuff = stuffNode.getComponent(Stuff);
                stuff.setStuffData(balls[i]);   //设置地块小球模型数据 
            }
        }
        if(skills){
            for(let i=0; i<skills.length; ++i){
                let skillNode = cc.instantiate(ROOT_NODE.pfSkill);
                this.rewardNode.addChild(skillNode);
                skillNode.getComponent(Skill).initSkillByData(skills[i]);
            }
        }
    }
}
