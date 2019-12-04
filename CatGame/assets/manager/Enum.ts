import { st_cannon_info, CfgMgr, st_player_info, st_level_info, st_monster_info, st_chapter_info, st_item_info, st_skill_info } from "./ConfigManager";


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
        let temp = new BallInfo(this.cannonId);
        temp.timeId = this.timeId;
        return temp;
    };

    updateCannon(cannonId: number){
        this.cannonId = cannonId;
        this.cannonCfg = CfgMgr.getCannonConf(cannonId);
    }
}

/**道具数据 */
export class ItemInfo{
    timeId: number = 0;   //道具ID唯一编号，使用创建时的系统时间为ID
    itemId: number = 0;   //配置ID
    itemCfg: st_item_info = null;

    constructor(itemId: number){
        this.timeId = new Date().getTime();
        this.itemId = itemId;
        this.itemCfg = CfgMgr.getItemConf(itemId);
    };

    cloneNoCfg(){
        let temp = new ItemInfo(this.itemId);
  
        //不必写入本地存储的变量s
        temp.itemCfg = null;
        return temp;
    }

    clone(){
        let temp = new ItemInfo(this.itemId); 
        temp.timeId = this.timeId;
        return temp;
    };

    updateItem(itemId: number){
        this.itemId = itemId;
        this.itemCfg = CfgMgr.getItemConf(itemId);
    }
}

/**炮数据 */
export class PlayerInfo{
    playerId: number = 0;   //炮配置ID
    level: number = 1;   //炮等级
    useState: number = 0;  //使用状态，0未拥有，1已拥有
    ballId: number = 0;   //装备小球ID
    itemId: number = 0;    //饰品道具Id
    playerCfg: st_player_info = null;

    constructor(playerId: number){
        this.playerId = playerId;
        this.playerCfg = CfgMgr.getPlayerConf(playerId);
    };

    cloneNoCfg(){
        let temp = new PlayerInfo(this.playerId);
        temp.level = this.level;   
        temp.useState = this.useState; 
        temp.ballId = this.ballId;   
        temp.itemId = this.itemId; 

        //不必写入本地存储的变量s
        temp.playerCfg = null;
        return temp;
    }

    clone(){
        let temp = new PlayerInfo(this.playerId);
        temp.level = this.level;   
        temp.useState = this.useState;
        temp.ballId = this.ballId;   
        temp.itemId = this.itemId;
        return temp;
    };
}

/**关卡数据 */
export class LevelInfo{
    levelId: number = 0;   //配置ID
    starNum: number = 0;   //星级
    levelCfg: st_level_info = null;

    constructor(levelId: number, starNum:number=0){
        this.levelId = levelId;
        this.starNum = starNum;
        this.levelCfg = CfgMgr.getLevelConf(levelId);
    };

    cloneNoCfg(){
        let temp = new LevelInfo(this.levelId, this.starNum);
  
        //不必写入本地存储的变量s
        temp.levelCfg = null;
        return temp;
    }

    clone(){
        let temp = new LevelInfo(this.levelId, this.starNum); 
        return temp;
    };
}

//章节数据
export class ChapterInfo{
    chapterId: number = 0;   //配置ID
    chapterCfg: st_chapter_info = null;

    constructor(chapterId: number){
        this.chapterId = chapterId;
        this.chapterCfg = CfgMgr.getChapterConf(chapterId);
    };
}

/**砖块数据 */
export class BrickInfo{
    monsterId: number = 0;   //配置ID
    curHp: number = 0;  
    maxHp: number = 0;
    column: number = 0;  //砖块行列位置
    row: number = 0;
    monsterCfg: st_monster_info = null;

    constructor(monsterId: number){
        this.monsterId = monsterId;
        this.monsterCfg = CfgMgr.getMonsterConf(monsterId);
        this.curHp = this.monsterCfg.hp;
        this.maxHp = this.monsterCfg.hp;
    };
}

/**技能数据 */
export class SkillInfo{
    skillId: number = 0;   //配置ID
    skillLv: number = 1;   //技能等级
    skillCfg: st_skill_info = null;

    constructor(skillId: number){
        this.skillId = skillId;
        this.skillLv = 1;
        this.skillCfg = CfgMgr.getSkillConf(skillId);
    };

    clone(){
        let temp = new SkillInfo(this.skillId); 
        temp.skillLv = this.skillLv;
        return temp;
    };
}

/**小球射线路径数据 */
export class IntersectRay{
    srcPos: cc.Vec2 = null;   //射线起点
    oldDir: cc.Vec2 = null;   //射线方向
    hitType:number = 0;   //  0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知
    point: cc.Vec2 = null;    //综合交点（射线末端的新反射起点）
    newDir: cc.Vec2 = null;  //射线末端的反射新方向
    nodeIds: number[] = [];   //射线末端碰撞的非移动砖块ID集合
    itemNodes: cc.Node[] = [];   //射线经过的道具节点集合
    borderIdxs: number[] = [];  //与游戏边界相交的边界索引集合

    constructor(){
        this.srcPos = null;
        this.oldDir = null;
        this.hitType = 0;
        this.point = null;
        this.newDir = null;
        this.nodeIds = [];
        this.itemNodes = [];
        this.borderIdxs = [];
    }

    clone(){
        let tempInRay = new IntersectRay();
        if(this.srcPos){
            tempInRay.srcPos = this.srcPos.clone();
        }
        if(this.oldDir){
            tempInRay.oldDir = this.oldDir.clone();
        }
        tempInRay.hitType = this.hitType;
        if(this.point){
            tempInRay.point = this.point.clone();
        }
        if(this.newDir){
            tempInRay.newDir = this.newDir.clone();
        }
        for(let i=0; i<this.nodeIds.length; ++i){
            tempInRay.nodeIds.push(this.nodeIds[i]);
        }
        for(let i=0; i<this.itemNodes.length; ++i){
            tempInRay.itemNodes.push(this.itemNodes[i]);
        }
        for(let i=0; i<this.borderIdxs.length; ++i){
            tempInRay.borderIdxs.push(this.borderIdxs[i]);
        }
        return tempInRay;
    }
}

/**射线和单个矩形相交的数据 */
export class IntersectData{
    point: cc.Vec2 = null;    //综合交点（射线末端的新反射起点）
    newDir: cc.Vec2 = null;  //射线末端的反射新方向
    node: cc.Node = null;   //射线末端碰撞的砖块
    borderIdx: number = -1;  //与游戏边界相交的边界索引
    distLen: number = -1;   //相交点和射线起始点的距离
    bGameBorder:boolean = false;   //是否撞游戏边界墙

    constructor(point:cc.Vec2, newDir:cc.Vec2, node:cc.Node, borderIdx: number, distLen: number){
        this.point = point;
        this.newDir = newDir;
        this.node = node;
        this.borderIdx = borderIdx;
        this.distLen = distLen;
        this.bGameBorder = false;
    }
}

/**射线碰撞临时相交数据 */
export class TempIntersectData{
    bIntersected:boolean = false;  //是否相交（边界相交或四角弧度相交）
    intersectPoint: cc.Vec2 = null;  //相交点
    broderIdx: number = -1;  //相交点所在的矩形边界索引 0-2分别为三个顶点
    intersectDist:number = -1;  //相交点和射线起始点的距离
    bIntersectBorder: boolean = false;  //true边界相交(镜面反射)或者false四角弧度相交(弧度反射)
    newDir: cc.Vec2 = null;   //相交后的新反射方向 
    borders: cc.Vec2[] = null;   //砖块顶点集合
}

//发射技能
export class LaunchSkillState{
    qianghuaPro: number = 0;  //2强化 一定概率提升攻击力
    fenLiePro: number = 0;  //3分裂 一定概率使得炮弹分裂为三个子弹
    fanTanPro: number = 0;  //4反弹 一定概率使得炮弹落地后重新反弹
    lianTiPro: number = 0;  //5连体 一定概率使得炮弹覆盖打击多个砖块
    baoZhaPro: number = 0;  //6爆炸 一定概率击毁敌人后将其四周敌人炸死
    kuangBaoPro: number = 0;  //9狂暴 一定概率提升暴击率
}

/**球的状态 */
export enum BallState {  //(初始--排序）--待机--瞄准--移动发射--飞行--碰撞--下落回收---排序--下一回合待机
    init = 0, //初始状态
    readySort = 1,  //等待排序
    normal = 2,   //待机
    aim = 3,   //瞄准
    moveLaunch = 4,   //移动发射
    fly = 5,  //飞行
    collider = 6,  //碰撞状态
    bezierDrop = 7,  //曲线下落
    verticalDrop = 8,   //垂直下落
}

/**提示文本集合 */
export const TipsStrDef = {
    KEY_GoldTip: "金币不足!", 
    KEY_GetGoldTip: "获得金币：", 
    KEY_DiamondTip: "钻石不足！", 
    KEY_WeaponTip2: "没有装配武器，无法出战！",
    KEY_WeaponTip3: "请选择武器进行装备或合成！",
    KEY_ItemTip: "请选择饰品进行装备或合成！",
    KEY_FireTip: "最后一个武器不可回收！", 
    KEY_QualityTip: "最大品质等级不可合成!",
    KEY_PlayerTip: "请先解锁萌宠!",
    KEY_BagMaxTip: "背包已满，请整理背包（合成或删除）!",
     
    KEY_Share: "一起来逗一逗，分享联萌快乐！"
}

/**异步消息通知类型 */
export const NoticeType = {
    GAME_ON_HIDE: "GAME_ON_HIDE", //游戏切入后台
    GemaRevive: "GemaRevive",  //复活，将最下三层砖块消除
    GamePause: "GamePause",   //游戏暂停，停止小球和砖块的动作，但动画特效不受影响
    GameResume: "GameResume",  //继续游戏
    GameReStart: "GameReStart",  //重新开始游戏
    Guide_TouchMove: "Guide_TouchMove",  //触摸引导移动

    UpdateGold: "UpdateGold",   //更新金币显示
    UpdateDiamond: "UpdateDiamond",   //更新钻石显示
    BlockGridSel: "BlockGridSel",   //全部背包中武器或道具被选中
    BlockBallSel: "BlockBallSel",   //地块上小球被选择，相同等级的小球地块要显示光圈
    BlockItemSel: "BlockItemSel",   //地块上道具被选择，相同等级的道具地块要显示光圈
    UpdatePlayerList: "UpdatePlayerList",   //更新炮台列表
    
    BrickLineCreateOver: "BrickLineCreateOver",   //砖块行创建完毕

    BrickDeadEvent: "BrickDeadEvent",   //砖块消失（死亡）
    BrickMoveDownAction: "BrickMoveDownAction",   //砖块下移通知
    BrickDownMultiLine: "BrickDownMultiLine",   //砖块多行下移
    BrickInvincible: "BrickInvincible",  //砖块无敌/盾牌
    BrickAddEvent: "BrickAddEvent",   //添加新砖块，用于移动砖块检测
    BrickDiffuseHit: "BrickDiffuseHit",  //砖块受击散播
    BrickBombDead: "BrickBombDead",  //爆炸砖块死亡

    BallAdsorbEvent: "BallAdsorbEvent",   //砖块吸附小球
    BallSpeedUp: "BallSpeedUp",   //小球加速
    BallSpeedUpDrop: "BallSpeedUpDrop",   //小球抛物加速下落
    BallHitBrick: "BallHitBrick",   //小球攻击砖块



}
