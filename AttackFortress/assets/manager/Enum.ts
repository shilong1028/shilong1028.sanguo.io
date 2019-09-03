import { st_cannon_info, CfgMgr } from "./ConfigManager";


//常量或类定义
/**小球属性类 */
export class BallInfo{
    timeId: number = 0;   //小球ID唯一编号，使用创建时的系统时间为ID
    cannonId: number = 0;   //小球的配置ID
    cannonCfg: st_cannon_info = null;

    constructor(cannonId: number){
        this.timeId = new Date().getTime();
        this.cannonId = cannonId;
        this.cannonCfg = CfgMgr.getCannonConf(cannonId);
    };

    cloneNoCfg(){
        let temp = new BallInfo(this.cannonId);
        //不必写入本地存储的变量s
        temp.cannonCfg = null;
        return temp;
    }

    clone(){
        let newInfo = new BallInfo(this.cannonId);
        newInfo.timeId = this.timeId;
        return newInfo;
    };

    updateCannon(cannonId: number){
        this.cannonId = cannonId;
        this.cannonCfg = CfgMgr.getCannonConf(cannonId);
    }
}


/**提示文本集合 */
export const TipsStrDef = {
    KEY_HeChengTip: "合成位置不足。",  
    KEY_HeChengTip2: "合成位置不足，请先合成或回收士兵。",
    KEY_HeChengTip3: "最高等级士兵无法继续合成。",
    KEY_DiamondTip: "钻石不足，可使用转盘获得。",   
    KEY_FireTip: "最后一个士兵不可解雇。",  
    KEY_RecoverTip: "将士兵拖到此处回收。", 
    KEY_LevelMaxTip: "太棒了，您已通过全部关卡！", 
    KEY_GoldTip: "金币不足，通关奖励大量金币。",  
    KEY_Share: "升级士兵，然后扔出去！"
}

/**异步消息通知类型 */
export const NoticeType = {
    GAME_ON_HIDE: "GAME_ON_HIDE", //游戏切入后台

    UpdateGold: "UpdateGold",   //更新金币显示
    BlockBallSel: "BlockBallSel",   //地块上小球被选择，相同等级的小球地块要显示光圈

}
