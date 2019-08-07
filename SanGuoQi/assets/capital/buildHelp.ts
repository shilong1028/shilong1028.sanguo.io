

//主城建筑说明
const {ccclass, property} = cc._decorator;

@ccclass
export default class BuildHelp extends cc.Component {
    @property(cc.Label)
    descLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.descLabel.string = "    游戏中，除了城池人口可以征收战略资源（粮草、金币、士兵等）之外，主城中不同的建筑也可以产出资源粮草、金币、药材、枪戟、刀剑、弓弩、马匹等。\
        主城中建筑还可以训练士兵、招募武将、商业贸易、后宫游幸、外交联盟等操作。\
        主城建筑有茅草级别、土木级别、砖瓦级别、宫廷级别四种等级，每个级别的馆所建筑还会有Lv1、Lv2、Lv3、Lv4、Lv5五个等级。新级别的开启需要满足一定的等级条件，提升建筑级别和等级还需要消耗额外的粮草和金币。\
        主城建筑主要有：官府衙门、武库、城防、箭楼、驿站、练兵场、校武场、酒馆、商店、当铺、皮甲所、枪戟所、刀剑所、弓弩所、马场等。";
    }


    start () {

    }

    // update (dt) {}

    onCloseBtn(){
        this.node.removeFromParent(true);
    }
}
