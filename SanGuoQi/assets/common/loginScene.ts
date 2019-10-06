
import { MyUserMgr } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";
import { ROOT_NODE } from "./rootNode";
import { LDKey, LDMgr } from "../manager/StorageManager";

//初始场景，用于初始化加载数据
const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScene extends cc.Component {
    @property(cc.Node)
    btnNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.btnNode.active = false;
    }

    start () {
        if(LDMgr.getItemInt(LDKey.KEY_NewUser) == 0){  //新用户 
            MyUserMgr.clearUserData();
        }else{
            MyUserMgr.initUserData();    //初始化用户信息
        }
        this.btnNode.active = true;
    }

    // update (dt) {}

    onLoginGame(){
        this.btnNode.active = false;
        GameMgr.gotoMainScene();   //进入主场景
    }

    onResetGame(){
        ROOT_NODE.showTipsDialog("是否清除所有游戏重新开始？", ()=>{
            this.btnNode.active = false;
            MyUserMgr.clearUserData();   //清除所有用户数据
            GameMgr.gotoMainScene();   //进入主场景
        });
    }

    onDemoBtn(){
        // this.btnNode.active = false;
        
        // let fightArr: GeneralInfo[] = new Array();
        // let enmeyArr: GeneralInfo[] = new Array();

        // let ids = new Array(3001, 3006, 3009, 3007, 3014);   //曹操骑兵，张辽刀兵，乐进枪兵，曹洪刀兵， 郭嘉弓兵
        // let lvs = new Array(3, 2, 2, 1, 2);

        // for(let i=0; i<ids.length; ++i){
        //     let enemy = new GeneralInfo(ids[i]); 
        //     enemy.generalLv = lvs[i];
        //     enemy.bingCount = GameMgr.getMaxBingCountByLv(enemy.generalLv);
        //     for(let j=0; j<enemy.generalCfg.skillNum; ++j){
        //         let randSkill = FightMgr.getRandomSkill();
        //         enemy.skills.push(randSkill);
        //     }
        //     fightArr.push(enemy.clone());
        //     enmeyArr.push(enemy);
        // }

        // FightMgr.clearAndInitFightData(enmeyArr, fightArr);   //清除并初始化战斗数据，需要传递敌方武将数组和我方出战武将数组
    }
}
