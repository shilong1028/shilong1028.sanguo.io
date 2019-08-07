import TableView from "../tableView/tableView";
import { SkillInfo, GeneralInfo } from "../manager/Enum";
import { ROOT_NODE } from "../common/rootNode";
import { MyUserData, MyUserMgr } from "../manager/MyUserData";
import { CfgMgr } from "../manager/ConfigManager";

//招募
const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillLayer extends cc.Component {

    @property(TableView)
    skillTableView: TableView = null;

    @property(TableView)
    generalTableView: TableView = null;

    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    @property(cc.SpriteAtlas)
    skillAtlas: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:

    cellArr: SkillInfo[] = new Array();
    selSkillInfo: SkillInfo = null;   //当前选中的技能数据
    selGeneralInfo: GeneralInfo = null;  //选中的武将数据

    onLoad () {
        this.updateSelItemInfo(null);  //显示底部选中道具信息

        ROOT_NODE.showLayerMoney(this.node, cc.v2(0, 360));    //一级界面上的金币钻石粮草公用控件
    }

    onDestroy(){
        this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {
        let keys = Object.getOwnPropertyNames(CfgMgr.C_skill_info);
        for (let k of keys) {
            this.cellArr.push(new SkillInfo(parseInt(k)));
        }
        this.skillTableView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
        this.skillTableView.initTableView(this.cellArr.length, { array: this.cellArr, target: this }); 
        this.updateSelItemInfo(0);  //显示底部选中道具信息

        this.initGeneralList();
    }

    // update (dt) {}

    //刷新武将列表
    initGeneralList(){
        this.generalTableView.openListCellSelEffect(true);   //是否开启Cell选中状态变换
        this.generalTableView.initTableView(MyUserData.GeneralList.length, { array: MyUserData.GeneralList, target: this}); 
        this.selGeneralInfo = MyUserData.GeneralList[0];  //选中的武将数据
    }

    handleSelGeneralCell(cellIdx: number){
        cc.log("handleSelGeneralCell(), cellIdx = "+cellIdx);
        this.selGeneralInfo = MyUserData.GeneralList[cellIdx];  //选中的武将数据
    }

    //添加或删除武将技能
    handleChangeGeneralSkill(skillInfo: SkillInfo, bAdd:boolean){
        cc.log("handleChangeGeneralSkill(), bAdd = "+bAdd);
        if(this.selGeneralInfo){
            if(bAdd == true){   //添加
                this.selGeneralInfo.skills.push(skillInfo);
            }else{    //删除
    
            }
            MyUserMgr.saveGeneralList();
        }
    }

    handleSelSkillCell(cellIdx: number){
        this.updateSelItemInfo(cellIdx);  //显示底部选中道具信息
    }

    /**显示底部选中道具信息 */
    updateSelItemInfo(cellIdx:number){
        this.iconSpr.spriteFrame = null;
        this.nameLabel.string = "";
        this.numLabel.string = "";
        this.descLabel.string = "";

        let item: SkillInfo = this.cellArr[cellIdx];
        this.selSkillInfo = item;   //当前选中的技能数据
        if(item && item.skillCfg){
            this.nameLabel.string = item.skillCfg.name;
            this.iconSpr.spriteFrame = this.skillAtlas.getSpriteFrame(item.skillId.toString());
            this.numLabel.string = "花费："+item.skillCfg.cost;

            let descStr = item.skillCfg.desc;
            if(item.skillCfg.atk != 0){
                descStr += (" "+item.skillCfg.atk);
            }else if(item.skillCfg.def != 0){
                descStr += (" "+item.skillCfg.def);
            }else if(item.skillCfg.hp != 0){
                descStr += (" "+item.skillCfg.hp);
            }else if(item.skillCfg.shiqi != 0){
                descStr += (" "+item.skillCfg.shiqi);
            }
            this.descLabel.string = descStr;
        }
    }

    onCloseBtn(){
        this.node.removeFromParent(true);
    }
}
