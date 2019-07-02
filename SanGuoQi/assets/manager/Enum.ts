import { st_general_info } from "./ConfigManager";


//常量或类定义


export class CardInfo{
    campId: number = 0;   //阵营，0默认，1蓝方，2红方
    maxHp: number = 0;   //最大血量
    maxMp: number = 0;   //最大智力
    cardCfg: st_general_info = null;   //卡牌配置信息

    constructor(){
    }

    clone(){
        let temp = new CardInfo();
        temp.campId = this.campId;
        temp.cardCfg = this.cardCfg;
        temp.maxMp = this.maxMp;
        temp.maxHp = this.maxHp;

        return temp;
    }
}
