import QiPanSc from "../fight/QiPanSc";
import { IntersectRay, LevelInfo, BrickInfo, NoticeType, IntersectData, TempIntersectData, PlayerInfo } from "./Enum";
import { MyUserDataMgr } from "./MyUserData";
import { NotificationMy } from "./NoticeManager";
import FightScene from "../fight/FightScene";
import Brick from "../fight/Brick";

const { ccclass, property } = cc._decorator;

@ccclass
class FightManager {
    bReNewLevel: boolean = false;   //是否重新开始游戏(看视频)

    level_id: number = 0;    //当前关卡ID
    level_info: LevelInfo = null;  //关卡数据信息
    bricksCfg: Map<number, Array<BrickInfo>> = null;    //关卡每个砖块位置等信息

    gBrickId: number = 0;   //用于生成唯一的砖块ID
    gBallId: number = 0;   //用于生成唯一的小球ID

    tileHeight: number = 100;   //数据信息中瓦片的宽、高度 通常是正方形瓦片
    tileWidth: number = 100;
    gameBordersRect: cc.Rect = cc.rect(0, 0, 700, 900);   //边界框矩形, 中心点+宽高
    gameBottomPosY: number = -450;   //棋盘底部坐标
    emissionPointX: number = 0;  //小球发射位置（和大猫）的X轴坐标
    emissionSign: number = 1;   //小球在猫的左（sign=-1)右(1)两侧
    qipanSc: QiPanSc = null;   //棋盘
    
    bGameOver: boolean = false;   //该局游戏是否结束
    bUserReset: boolean = false;  //本次是否使用了复活（每关限一次，重新开始不重置）
    win: boolean = false;  //本场胜负
    stars: number = 0;    //战斗星级
    starTargetNum: number = 100;  //达到三星一回合需要消灭的砖块数量
    brickBreakNum: number = 0;   //击毁的砖块数
    brickBreakAim: number = 0;   //本场目标块数

    tempCastRayArr: IntersectRay[] = [];   //每回合正在规划的临时射线数据集合（仅保存起始点和方向等射线数据）
    roundPathArr: IntersectRay[] = [];   //每回合射线路径数据集合，用于路径复用
    bFirstHitGround: boolean = false;    //第一个回落到地面的球设置此值
    ballDropedCount: number = 0;   //小球发射后，已经落地的数量
    roundBallCount: number = 0;   //该回合战斗小球的数量（吸附砖块等可能影响该变量）
    fightAddCount: number = 0;    //章节加球技能增加值（每一章节内有效）
    fightBallTotal: number = 0;   //关卡战斗总小球数量
    usedPlayerInfo: PlayerInfo = null;   //当前使用的炮台信息

    ballOffPosX: number = 50;   //小球排序之间的X轴间隔
    ballSortIdx: number = 0;  //当前已经排序的小球索引数，用于小球排序发射索引的设定

    rayCount: number = 0;   //需要绘制的射线段数
    curBrickNodes: cc.Node[] = [];   //当前绘制有效的砖块集合
    tempItemNodes: cc.Node[] = [];   //射线规划时，临时存储某条射线经过的道具集合
    defaultRayCount: number = 1;   //默认的绘制指示线的射线段数
    rayLineMaxLen: number = 1200;   //射线最大长度
    ballRadiusConf: number = 15;   //点（小球）碰撞检测半径
    radConf: number = 10;   //砖块转角范围配置。
    /**因为小球是有半径的，因此不能使用线和边框的交点作为转点，要让边框向四周扩充radConf后再测交点。
     * 外扩后还可以避免两个相邻砖块转角的判定。如果相邻两块砖块距离太近，则认为相邻的转角位边框镜面反射，而非弧度反射。
     */
    speedUpRatio: number =  1;  //战斗加速倍数，0-2分别表示1-3倍加速
    
    /**加载关卡前 清空之前可能余留的信息 */
    clearFightMgrData(){
        this.bReNewLevel = false;   //是否重新开始游戏(看视频)
        this.level_id = 0;
        this.level_info = null;   //关卡数据信息
        this.bricksCfg = new Map<number, Array<BrickInfo>>(); 

        this.gBrickId = 0;   //用于生成唯一的砖块ID
        this.gBallId = 0;
        this.emissionPointX = 0;  //小球发射位置（和大猫）的X轴坐标
        this.emissionSign = 1;   //小球在猫的左（sign=-1)右(1)两侧

        this.bGameOver = false;   //该局游戏是否结束
        this.win = false;  //本场胜负
        this.stars = 0;    //战斗星级
        this.starTargetNum = 100;  //达到三星一回合需要消灭的砖块数量
        this.brickBreakNum = 0;   //击毁的砖块数
        this.brickBreakAim = 0;   //本场目标块数
        
        this.tempCastRayArr = [];   //每回合正在规划的临时射线数据集合（仅保存起始点和方向等射线数据）
        this.roundPathArr = [];   //每回合射线路径数据集合，用于路径复用
        this.bFirstHitGround = false;   //第一个回落到地面的球设置此值
        this.ballDropedCount = 0;   //小球发射后，已经落地的数量
        this.roundBallCount = 0;   //该回合战斗小球的数量（吸附砖块等可能影响该变量）
        this.fightBallTotal = 0;   //关卡战斗总小球数量
        this.usedPlayerInfo = null;   //当前使用的炮台信息
        this.ballSortIdx = 0;  //当前当前行已经排序的小球索引数，用于小球排序发射索引的设定

        this.rayCount = 0;   //需要绘制的射线段数
        this.curBrickNodes = [];   //当前绘制有效的砖块集合
        this.tempItemNodes = [];   //射线规划时，临时存储某条射线经过的道具集合
        this.defaultRayCount = 1;   //默认的绘制指示线的射线段数

        this.speedUpRatio =  1;  //战斗加速倍数，0-2分别表示1-3倍加速
    }

    /**
     * 加载关卡配置
     * @param levelId 关卡id
     * @param bReNew 重新开始
     * (第一次进入战斗或者以后从结算界面继续战斗，都是由FightMgr.loadLevel触发战斗的，故需要清空并初始化战斗场景数据)
     */
    loadLevel(levelId:number, bReNew: boolean = false){
        this.bReNewLevel = bReNew;   //是否重新开始游戏
        if(bReNew == false){
            this.bUserReset = false;  //本次是否使用了复活（每关限一次，重新开始不重置）
        }
        this.getFightScene().clearSceneData();   //初始化一些关键的战斗场景数据
        this.clearFightMgrData();   //加载关卡前 清空之前可能余留的信息

        this.level_id = levelId;
        this.level_info = new LevelInfo(levelId);

        this.usedPlayerInfo = MyUserDataMgr.getCurPlayerInfo();   //当前使用的炮台信息
        if(this.usedPlayerInfo){
            this.roundBallCount = this.usedPlayerInfo.playerCfg.ball_num;   //该回合战斗小球的数量（吸附砖块等可能影响该变量）
        }

        this.getFightScene().initFightSkillList();  //显示章节战斗技能
        this.roundBallCount += this.fightAddCount;    //章节加球技能增加值（每一章节内有效）
        this.fightBallTotal = this.roundBallCount;   //关卡战斗总小球数量

        this.setBricks();
    }

    //更新砖块死亡数据
    updateBrickDeadNum(){
        this.brickBreakNum ++;   //击毁的砖块数 
        this.getFightScene().showBrickProgerss();
    }

    //因砖块重生而增加的砖块目标数
    updateBrickAimNum(){
        this.brickBreakAim ++;   //本场目标块数
        this.getFightScene().showBrickProgerss();
    }

    /**关卡配置加载完毕后的回调 */
    setBricks(){
        // 每次加载清空之前的bricks
        this.bricksCfg = new Map<number, Array<BrickInfo>>();   //初始关卡信息 number：某行 Array<BrickCfg>某行对应的砖块 ,下标从(0,0)开始，左下角第一个为(0,0)
        // 列数可以从jsonInfo的width确定，但实际的height要从具体关卡的objects数据中确定
        if(this.level_info && this.level_info.levelCfg){
            let levelCfg = this.level_info.levelCfg;
            this.brickBreakAim = levelCfg.enemy_count;   //本场目标块数
            //cc.log("FightMgr:setBricks(), levelCfg = "+JSON.stringify(levelCfg));
            let enemyCount = levelCfg.enemy_count;   //砖块还剩余总数
            let enemyLines = levelCfg.total_lines;  

            this.starTargetNum = Math.ceil(2*enemyCount/enemyLines);  //达到三星一回合需要消灭的砖块数量
            if(this.starTargetNum > this.brickBreakAim){
                this.starTargetNum = this.brickBreakAim;
            }

            let enemyIds:number[] = [];
            for(let i=levelCfg.enemy_ids[0]; i<= levelCfg.enemy_ids[1]; i++){
                enemyIds.push(i);
            }

            for(let i=0; i<levelCfg.total_lines; i++){
                enemyLines -= i;   //砖块还剩余行数
                let count = enemyCount;
                if(enemyLines > 0){
                    count = enemyCount/enemyLines;
                    if(Math.random() > 0.5){
                        count = Math.floor(count);
                    }else{
                        count = Math.ceil(count);
                    }
                }
                count = Math.min(count, 7);
                enemyCount -= count;

                let columnArr = this.getRandomNumsByCount(count, 7, 0);   //在指定序列中[min, max)产生count个随机数
                let linebricks: BrickInfo[] = [];
                for(let j=0; j<count; ++j){
                    let randomIdx = Math.floor(Math.random()*(enemyIds.length-0.0001));
                    let enemyId = enemyIds[randomIdx];
                    let brickInfo = new BrickInfo(enemyId);
                    brickInfo.column = columnArr[j];
                    brickInfo.row = i;
                    linebricks.push(brickInfo);
                }
                this.bricksCfg[i] = linebricks;
            }
            //cc.log("setBricks(), this.bricksCfg = "+JSON.stringify(this.bricksCfg));
            // 获取完毕，初始化战斗场景
            this.getFightScene().handleSetBricksFinish();   //加载关卡陪住完毕
        }else{
            this.bReNewLevel = false;   //是否重新开始游戏
            cc.warn("warning, get level bricks is null, level = "+this.level_id);
        }
    }

    /**在指定序列中[min, max)产生count个随机数 */
    getRandomNumsByCount(count: number, max: number, min: number=0){
        let list: number[] = [];
        let offLen = max - min;
        if(offLen <= count){
            for(let i=min; i<=max; i++){
                list.push(i);
            }
        }else{
            while(list.length < count){
                let rand = Math.random();
                let num = Math.floor(rand*offLen*0.99 + min);
                let bHave = false;
                for(let j=0; j<list.length; ++j){
                    if(list[j] == num){
                        bHave = true;
                        break;
                    }
                }
                if(bHave == false){
                    list.push(num);
                }
            }
        }
        return list;
    }

    /**处理小球重新落地，检查回合是否结束 */
    hanldeBallDropOver(posX: number, bResetCat: boolean= true){
        this.ballDropedCount ++;   //小球发射后，已经落地的数量

        if(this.bFirstHitGround == false && bResetCat){
            this.bFirstHitGround = true;   //第一个回落到地面的球设置此值

            if(this.level_id == 1 && this.qipanSc.launchCount == 1){   //第一关前两个回合强制引导线  //本次战斗发射次数 
                posX = 0;
            }else{
                let borderWidth = this.gameBordersRect.width;
                if(posX < -borderWidth/2+50){
                    posX = -borderWidth/2+50;
                }else if(posX > borderWidth/2-50){
                    posX = borderWidth/2-50;
                }
            }

            this.emissionPointX = posX;
            this.qipanSc.setPlayerPos();   //第一个球落地后，设置角色位置

            this.emissionSign = this.getBricksAndCatSign(posX);  //小球在猫的左（sign=-1)右(1)两侧
        }

        if(this.ballDropedCount >= this.roundBallCount){ 
            if(this.fightBallTotal > this.roundBallCount){  
                this.roundBallCount = this.fightBallTotal;   //该回合战斗小球的数量（吸附砖块等可能影响该变量）
                NotificationMy.emit(NoticeType.BallAdsorbEvent, -1);   //砖块吸附小球
            }
            else if(this.ballDropedCount >= this.fightBallTotal){   //本次战斗小球数量 
                this.tempCastRayArr = [];   //每回合正在规划的临时射线数据集合（仅保存起始点和方向等射线数据）
                this.roundPathArr = [];   //每回合射线路径数据集合，用于路径复用
                this.getFightScene().handleBallsDropOver();  //处理所有小球都下落完毕，之后小球排序，检查回合结束 
            }
        }
    }

    /**校正砖块坐标，防止因下移而产生的最终位置偏移 */
    adjustBrickPosFromMove(len: number, titleLen: number){
        let y = (Math.abs(len)%titleLen);
        let n = Math.floor(Math.abs(len)/titleLen);
        if(y <= titleLen/2){
            if(len > 0){
                len = n*titleLen;
            }else if(len < 0){
                len = -n*titleLen;
            }else{
                len = 0;
            }
        }else{
            if(len > 0){
                len = (n+1)*titleLen;
            }else if(len < 0){
                len = -(n+1)*titleLen;
            }else{
                len = 0;
            }
        }
        return len;
    }

    /**获取战斗场景 */
    getFightScene(): FightScene {
        let fightScene: FightScene = null;
        let layer = cc.director.getScene().getChildByName("Canvas");
        if (layer != null) {
            // 如果没有获取到返回null
            fightScene = layer.getComponent(FightScene);
        }
        return fightScene;
    }

    /**获取大猫Y轴坐标 */
    getCatPosY(){
        return this.gameBottomPosY;   //大猫中心与棋盘底部坐标的偏移
    }

    /**获取小球的Y轴坐标 */
    getBallPosY(){
        return this.gameBottomPosY + 20;  //小球中心的Y轴与棋盘底部坐标的偏移，以及指示线起点Y轴坐标
    }

    /**
     * 从(1,0)到dir的角度，顺时针为正，逆时针为负
     */
    getAngle(dir:cc.Vec2){
        dir.normalizeSelf();
        let sa = cc.v2(dir.x, dir.y).signAngle(cc.v2(1,0));
        let angle = cc.misc.radiansToDegrees(sa);
        return angle;
    }
    getVector(angle:number){
        let v = cc.v2(0,0);
        let rad = cc.misc.degreesToRadians(angle);
        v.x = Math.cos(rad);
        v.y = Math.sin(rad);
        return v;
    }

    /**生成一个唯一的砖块ID */
    getNewBrickId() {
        this.gBrickId++;
        if (this.gBrickId >= 2147483648) {
            this.gBrickId = 1;
        }
        return this.gBrickId;
    }

    /**生成一个唯一的小球ID */
    getNewBallId() {
        this.gBallId++;
        if (this.gBallId >= 2147483648) {
            this.gBallId = 1;
        }
        return this.gBallId;
    }

    /** *获取小球在猫的偏向侧, 根据猫的位置来设定球的初始位置
     *  优先放置到猫距离边框大的一侧，如果两侧相等则随机一侧。
     */
    getBricksAndCatSign(posX: number){
        let sign = 1;
        if(posX > 0){
            sign = -1;
        }else if(posX == 0){
            if(Math.random() > 0.5){
                sign = -1;
            }
        }
        return sign;
    }

    /**获取单个小球的每回合默认位置*/
    getBallNodeDefaultPos(): cc.Vec3{
        if(this.ballSortIdx >= FightMgr.fightBallTotal){  //所有球已经排完
            this.ballSortIdx = 0;
            return null;
        }

        let catWidth = this.qipanSc.getCatWidth();
        let ballInitY = this.getBallPosY();

        let len = this.gameBordersRect.width/2 + Math.abs(this.emissionPointX) - catWidth/2 + 20;
        let offsetX = Math.min(len/FightMgr.fightBallTotal, this.ballOffPosX);  

        this.ballSortIdx ++;  //已经排序的小球数量，用于小球排序发射索引的设定
        let destPos: cc.Vec3 = new cc.Vec3(this.emissionPointX + this.emissionSign*offsetX*this.ballSortIdx, ballInitY, this.ballSortIdx-1);

        if(this.ballSortIdx >= FightMgr.fightBallTotal){  //所有球已经排完
            this.ballSortIdx = 0;
        }
        return destPos;
    }

    //*****************************  射线部分   ***************************** */
    /**关闭射线 */
    offRay(){
        this.rayCount = 0;  //需要绘制的射线段数
    }

    /**砖块死亡，将回合复用路径集合中相关的数据删除 */
    resetRoundPathArrByBrickDead(deadId: number){
        for(let i=0; i<this.roundPathArr.length; ++i){
            let path: IntersectRay = this.roundPathArr[i];
            if(path && path.nodeIds.length > 0){   //射线方向一致
                for(let j=0; j<path.nodeIds.length; ++j){
                    if(path.nodeIds[j] == deadId){   //指定过滤的砖块  //射线末端碰撞的非移动砖块ID集合
                        this.roundPathArr.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
        }
    }

    /**清除复用数据 */
    clearRoundPathArr(){
        this.roundPathArr = [];
    }

    /**复用回合路径集合中的路径数据 
     * @param hitType  0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知, 5地面反弹， 6移动反弹
    */
    getRayPathFromArray(startPos: cc.Vec2, dir: cc.Vec2, brickIds: number[], hitType:number){
        if(this.roundPathArr.length > 0 && hitType != 6 && hitType != 7){
            for(let i=0; i<this.roundPathArr.length; ++i){
                let path: IntersectRay = this.roundPathArr[i];
                if(path && path.oldDir.x == dir.x && path.oldDir.y == dir.y){   //射线方向一致
                    if(path.srcPos.x == startPos.x && path.srcPos.y == startPos.y){   //射线起点一致
                        for(let k=0; k<brickIds.length; k++){  //指定过滤的砖块
                            for(let j=0; j<path.nodeIds.length; ++j){
                                if(path.nodeIds[j] == brickIds[k]){   //指定过滤的砖块  //射线末端碰撞的非移动砖块ID集合
                                    return null;
                                }
                            }
                        }
                        return path;   //复用回合路径集合中的路径数据
                    }else{
                        let tempDir = startPos.sub(path.srcPos).normalize();
                        if(tempDir.x == dir.x && tempDir.y == dir.y){   //射线起点在已规划路径上
                            for(let k=0; k<brickIds.length; k++){  //指定过滤的砖块
                                for(let j=0; j<path.nodeIds.length; ++j){
                                    if(path.nodeIds[j] == brickIds[k]){   //指定过滤的砖块  //射线末端碰撞的非移动砖块ID集合
                                        return null;
                                    }
                                }
                            }
                            return path;   //复用回合路径集合中的路径数据
                        }
                    }
                }
            }
        }
        return null;
    }

    normalDir(dir: cc.Vec2){
        if(dir == null || dir == undefined){  //需要绘制的射线段数
            return null;
        }
        if(Math.abs(dir.x) < 0.00000001 && Math.abs(dir.y) < 0.00000001){
            return null;
        }
        dir.normalizeSelf();
        return dir;
    }

    
    /**检查新射线是否在规划中 */
    checkTempCastRayArr(startPos: cc.Vec2, dir: cc.Vec2, hitType:number){
        if(hitType == 6 || hitType == 7){
            return false;
        }else{
            if(this.tempCastRayArr.length > 0 ){  //每回合正在规划的临时射线数据集合（仅保存起始点和方向等射线数据）
                if(this.tempCastRayArr.length > 3){  //正在规划的路径数量太多，延迟后再次请求
                    return true;
                }
                for(let i=0; i<this.tempCastRayArr.length; ++i){
                    let path: IntersectRay = this.tempCastRayArr[i];
                    if(path && path.oldDir.x == dir.x && path.oldDir.y == dir.y && hitType == path.hitType){   //射线方向一致
                        if(path.srcPos.x == startPos.x && path.srcPos.y == startPos.y){   //射线起点一致
                            return true;
                        }else{
                            let tempDir = startPos.sub(path.srcPos).normalize();
                            if(tempDir.x == dir.x && tempDir.y == dir.y){   //射线起点在已规划路径上
                                return true;
                            }
                        }
                    }
                }
            }
    
            let tempData: IntersectRay = new IntersectRay();
            tempData.srcPos = startPos.clone();   //射线起点
            tempData.oldDir = dir.clone();   //射线方向
            tempData.hitType = hitType;   //  0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知
            this.tempCastRayArr.push(tempData);   //每回合正在规划的临时射线数据集合（仅保存起始点和方向等射线数据）
        }

        return false;
    }

    /**清除正在规划中的射线数据 */
    removeTempCastRayArr(startPos: cc.Vec2, dir: cc.Vec2, hitType:number){
        if(hitType != 6 && hitType != 7 && this.tempCastRayArr.length > 0){  //每回合正在规划的临时射线数据集合（仅保存起始点和方向等射线数据）
            for(let i=0; i<this.tempCastRayArr.length; ++i){
                let path: IntersectRay = this.tempCastRayArr[i];
                if(path && path.oldDir.x == dir.x && path.oldDir.y == dir.y && hitType == path.hitType){   //射线方向一致
                    if(path.srcPos.x == startPos.x && path.srcPos.y == startPos.y){   //射线起点一致
                        this.tempCastRayArr.splice(i, 1);
                        i--;
                    }else{
                        let tempDir = startPos.sub(path.srcPos).normalize();
                        if(tempDir.x == dir.x && tempDir.y == dir.y){   //射线起点在已规划路径上
                            this.tempCastRayArr.splice(i, 1);
                            i--;
                        }
                    }
                }
            }
        }
    }


    /**射出射线（多条折线），并返回第一条折线的末点坐标 */
    castMultiRay(startPos: cc.Vec2, dir: cc.Vec2, rayCount: number): IntersectRay{
        this.roundPathArr = [];   //每回合射线路径数据集合，用于路径复用
        this.rayCount = rayCount;  //需要绘制的射线段数
        this.curBrickNodes = this.qipanSc.nBricks.children;   //当前绘制有效的砖块集合
        let rayDir = this.normalDir(dir);
        if(rayDir){
            return this.castRay(startPos, dir, this.rayCount, true, []);
        }else{
            return null;
        }
    }

    /**球碰撞或撞墙后，重新规划射线 
     * @param brickIds  上一次反射的砖块，避免该砖块产生连续两次反射的现象。
     * @param hitType  //0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知, 5地面反弹， 6移动反弹, 7强制校正
     * @param callback 新射线是否在规划中时的回调（小球将延迟后再次发送规划请求）
    */
    resetCastRay(startPos: cc.Vec2, dir: cc.Vec2, brickIds: number[], hitType:number, callback: any): IntersectRay{
        this.curBrickNodes = [];   //当前绘制有效的砖块集合
        let rayDir = this.normalDir(dir);
        if(rayDir == null){
            return null;
        }else{
            //非指示线情况下可以考虑小球的复用 
            let retData = this.getRayPathFromArray(startPos, dir, brickIds, hitType);
            if(retData){
                return retData;
            }

            let bCasting = this.checkTempCastRayArr(startPos, dir, hitType);  //检查新射线是否在规划中
            if(bCasting == true){
                if(callback){
                    callback();
                }
                return null;
            }else{
                this.curBrickNodes = this.qipanSc.nBricks.children;   //当前绘制有效的砖块集合
                return this.castRay(startPos, dir, 1, false, brickIds, hitType);        
            }
        }
    }

    /**
     * 射出射线，并返回末点
     * @param startPos 射出点
     * @param dir 射线方向， 终点是一个很长的，可能和所有节点、边界相交的线段
     * @param bMultiRay 是否多条射线
     * @param hitType  //0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知, 5地面反弹， 6移动反弹, 7强制校正
     * 
     * Can't get angle between zero vector
     */
    castRay(startPos: cc.Vec2, dir: cc.Vec2, rayCount:number = 1, bShowDot:boolean, brickIds: number[], hitType:number=0): IntersectRay{
        this.tempItemNodes = [];   //射线规划时，临时存储某条射线经过的道具集合
        if(rayCount <= 0){  //需要绘制的射线段数
            return null;
        }

        let endPos = startPos.add(dir.mul(this.rayLineMaxLen));  // 3000 2000 1000等数值是为了生成一个很长的，可能和所有节点、边界相交的线段
        // 遍历当前的砖块找到和射线相交的砖块
        let intersectArr: IntersectData[] = this.checkIntersectionWithBricks(startPos.clone(), dir, endPos, bShowDot, hitType, brickIds);     
        intersectArr = this.checkIntersectionWithGameBroders(intersectArr, startPos, endPos, dir);
        if(intersectArr == null || intersectArr.length == 0){
            //console.log("warning, 没有相交的砖块或边界 startPos: " + startPos + ", dir: " + dir+"; endPos = "+endPos);
            return null;
        }

        let rayEndPoint: cc.Vec2 = null;   //射线终点
        let rayNewDir: cc.Vec2 = null;    //下一个射线的方向
        
        let intersectRayData: IntersectRay = new IntersectRay();   //折线的末点数据
        intersectRayData.srcPos = startPos.clone();
        intersectRayData.oldDir = dir.clone();
        intersectRayData.hitType = hitType;   //0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知

        // for(let k=0; k<this.tempItemNodes.length; ++k){
        //     let node = this.tempItemNodes[k];
        //     if(node){   //砖块
        //         let brick = node.getComponent(Brick);
        //         if(brick && brick.brick_info && brick.brick_info.moster_camp == 0){ 
        //             intersectRayData.itemNodes.push(node);  //道具节点集合
        //         }
        //     }
        // }

        let addRayDataFunc = function(interData: IntersectData){
            let node = interData.node;
            if(node){   //砖块
                let brick = node.getComponent(Brick);
                if(brick && brick.isMoveBrick() == false){   //非移动砖块
                    if(brick.brick_info ){  //&& brick.brick_info.moster_camp == 1
                        intersectRayData.nodeIds.push(brick.brickId);  //普通砖块ID
                    }
                }
            }else{
                intersectRayData.borderIdxs.push(interData.borderIdx);  //边界
            }
        }

        if(intersectArr.length == 1){
            rayEndPoint = intersectArr[0].point;  //射线终点为反转点
            if(hitType == 3 && intersectArr[0].bGameBorder == false){
                rayNewDir = dir;  //穿透沿着原来方向飞行
            }else{
                rayNewDir = intersectArr[0].newDir;  //反射新方向
            }

            addRayDataFunc(intersectArr[0]);
        }else if(intersectArr.length > 1){   //射线和多个砖块或边界相交，且距离相等
            let count = 0;
            let totalPt = cc.v2(0, 0);
            let totalDir = cc.v2(0, 0);
            let bBorderBottom = false;   //是否触底
            let bGameBorder = false;
            for(let i=0; i<intersectArr.length; ++i){ 
                addRayDataFunc(intersectArr[i]);
    
                if(intersectArr[i].newDir == null){   //触底
                    bBorderBottom = true;
                    rayNewDir = null;
                    rayEndPoint = intersectArr[i].point;
                }else{
                    if(hitType != 3 ||(hitType == 3 && intersectArr[i].bGameBorder == true)){
                        totalPt.x += intersectArr[i].point.x;  //相交点
                        totalPt.y += intersectArr[i].point.y; 

                        totalDir.x += intersectArr[i].newDir.x;   //反射方向
                        totalDir.y += intersectArr[i].newDir.y;

                        count ++;

                        if(intersectArr[i].bGameBorder == true){
                            bGameBorder = true;   //是否撞游戏边界墙
                        }
                    }
                }
            }
            if(bBorderBottom == false){    //非触底
                if(hitType == 3 && bGameBorder == false){
                    rayNewDir = dir;  //穿透沿着原来方向飞行
                    if(count > 0){
                        rayEndPoint = cc.v2(totalPt.x/count, totalPt.y/count);
                    }else{
                        rayEndPoint = intersectArr[0].point;
                    }
                }else{
                    if(count > 0){
                        rayEndPoint = cc.v2(totalPt.x/count, totalPt.y/count);
                        rayNewDir = cc.v2(totalDir.x/count, totalDir.y/count);
                        if(Math.abs(rayNewDir.x)<0.01 && Math.abs(rayNewDir.y)<0.01){   //如果合成方向抵消为零，则为发射方向的反方向
                            rayNewDir = dir.neg();
                        }
                    }else{
                        rayEndPoint = intersectArr[0].point;
                        rayNewDir = intersectArr[0].newDir;  //反射新方向
                    }
                }
            }
        }
        if(rayNewDir){
            rayNewDir = this.adaptDirHorOrVer(rayNewDir);   //水平或垂直方向偏移
            intersectRayData.newDir = rayNewDir.clone();
        }

        if(rayEndPoint){  //射线终点
            intersectRayData.point = rayEndPoint.clone();
            
            if(hitType != 6){   //非6移动反弹
                let maxCount = 5;  //Math.max(5, FightMgr.fightBallTotal);
                if(this.roundPathArr.length >= maxCount){
                    this.roundPathArr.shift();
                }
                this.roundPathArr.push(intersectRayData.clone());
            }

            rayCount --;
            if(bShowDot){
                this.qipanSc.showDot(startPos, rayEndPoint);
                this.rayCount = rayCount;
            }
            
            //是否多条射线
            if (rayNewDir && this.rayCount > 0) {   //射线触底则结束  
                this.castRay(rayEndPoint, rayNewDir, rayCount, bShowDot, [], hitType);
            }
        }

        if(bShowDot == false){
            this.removeTempCastRayArr(startPos, dir, hitType);  //清除正在规划中的射线数据
        }

        return intersectRayData;
    }

    /**检测射线和墙壁的碰撞 */
    checkIntersectionWithGameBroders(intersectArr: IntersectData[], startPos: cc.Vec2, endPos: cc.Vec2, dir: cc.Vec2): IntersectData[]{
        if(intersectArr && intersectArr[0]){
            let point = intersectArr[0].point;
            if(this.gameBordersRect.width/2 - Math.abs(point.x) > 20){  
                //cc.log("已知交点和游戏边界相距较远，不必计算射线与墙壁的碰撞了。point = "+point);
                return intersectArr;
            }
        }

        //没有碰撞的砖块或者检测一下是否与边界也相交且距离相等
        let brickLen = -1;
        if(intersectArr[0]){
            brickLen = intersectArr[0].distLen;   //射线和砖块相交点与射线起点的距离
        }

        let borders: Array<cc.Vec2> = this.getGameBorders(-this.ballRadiusConf);   //获得游戏边界向内所扩的范围
        let pointData: TempIntersectData = this.lineRectPoint(startPos.clone(), endPos, borders, 0);
        /**找到线段和边框的交点（适用于矩形，且去除四角弧度判定范围内的相交）, 0-3分别为左下、左上、右上、右下四个顶点
         * (线段必须穿过矩形，线段的延伸线穿过不算，并返回距射线起始点最近的交点，交点和起始点重合不算) 
         * */
        if(pointData && pointData.intersectPoint){
            let intersectPoint: cc.Vec2 = pointData.intersectPoint;    //相交点
            let broderIdx = pointData.broderIdx;  //相交点所在的边界索引 0-3分别为左下、左上、右上、右下四个顶点
            let newDir: cc.Vec2 = null;   //反射后的新方向 
            let intersectDist = startPos.sub(intersectPoint).mag();  //交点和射线起始点的距离

            if(brickLen == -1 || (brickLen > 0 && intersectDist <= brickLen)){
                if(intersectDist != brickLen){   //墙比砖块距离更近，重置数组
                    intersectArr = [];
                }

                let rayY = this.getBallPosY();   //小球的Y轴坐标
                if(intersectPoint.y <= rayY){
                    broderIdx = 3;     //交点在小球起始Y坐标之下，按照小球触底处理
                }

                if(broderIdx == 3){    //0-3分别为左下、左上、右上、右下四个顶点 
                    newDir = null;
                    //小球触底时不用飞到棋盘底部，到和发射线向平位置即可。
                    intersectPoint.x -= dir.x * Math.abs((rayY - intersectPoint.y)/dir.y);
                    intersectPoint.y = rayY;
                }else{
                    let p1 = borders[broderIdx];
                    let p2 = borders[(broderIdx+1)%4];
                    newDir = this.getReflectDir(startPos.clone(), intersectPoint, p1, p2);   //获取方向与线段的反射后新方向
                    //防止正好在边界临界值
                    intersectPoint.x -= dir.x * 2;
                    intersectPoint.y -= dir.y * 2;
                }
                
                let data = new IntersectData(intersectPoint, newDir, null, broderIdx, intersectDist);
                data.bGameBorder = true;   //是否撞游戏边界墙
                intersectArr.push(data);
            }
        }else{
            cc.warn("warning, 没有和边界线相交 startPos: " + startPos + ", dir: " + dir);
        }

        return intersectArr;
    }

    /**水平或垂直方向偏移 */
    adaptDirHorOrVer(newDir: cc.Vec2){
        let tempDir = this.adaptDirByVec(newDir, cc.v2(1, 0));   //水平或垂直方向偏移
        if(tempDir){
            newDir = tempDir;
        }else{
            tempDir = this.adaptDirByVec(newDir, cc.v2(0, 1));   //水平或垂直方向偏移
            if(tempDir){
                newDir = tempDir;
            }
        }
        return newDir;
    }

    /**指定方向产生方向偏移 */
    adaptDirByVec(newDir: cc.Vec2, vec: cc.Vec2){
        //如果新方向为水平，则产生一个1-3度的偏移
        let offsetRad = cc.v2(newDir.x, newDir.y).signAngle(vec);  //signAngle标识向量旋转到指定向量需要旋转的弧度（顺时针为负，逆时针为正）
        //负值标识newDir在X轴上， 正值标识newDir在X轴下方。向量顺时针旋转的角度为负弧度，向量逆时针旋转的角度为正弧度
        if(Math.abs(offsetRad) < 0.05){   //水平向右
            let off = 0.05;   //Math.random()*0.03 + 0.02;
            if(offsetRad < 0){    //offsetRad<0 newDir在X轴上，>0偏下
                newDir = cc.v2(newDir.x, newDir.y).rotate(off);
                return newDir;
            }else{
                newDir = cc.v2(newDir.x, newDir.y).rotate(-off);
                return newDir;
            }
        }else{
            let newOff = Math.PI - Math.abs(offsetRad);
            if(newOff < 0.05){  //水平向左
                let off = 0.05;  //Math.random()*0.03 + 0.02;
                if(offsetRad < 0){    //offsetRad<0 newDir在X轴上，>0偏下
                    newDir = cc.v2(newDir.x, newDir.y).rotate(-off);
                    return newDir;
                }else{
                    newDir = cc.v2(newDir.x, newDir.y).rotate(off);
                    return newDir;
                }
            }
        }
        return null;
    }


    /**根据游戏边界来微调点坐标，从而使得点在边界矩形内 */
    adaptPosByGameBorders(pos: cc.Vec2, dir: cc.Vec2): cc.Vec2{
        let gameBorderRect = this.gameBordersRect;   //棋盘边界矩形（中心点+宽高）
        let max_X = gameBorderRect.width/2 - FightMgr.ballRadiusConf;
        let max_Y = gameBorderRect.height/2 - FightMgr.ballRadiusConf;
        let adaptLen = 2.0;
        let startPos = pos.clone();
        if(Math.abs(startPos.x) >= max_X){   //X轴越界
            let multiX = startPos.x * dir.x;
            let new_X = (max_X - adaptLen)*(startPos.x/Math.abs(startPos.x));
            let scale_x = Math.abs(startPos.x - new_X)/Math.abs(dir.x);
            startPos.x = new_X;
            if(multiX == 0){   //方向垂直
            }else if(multiX > 0){  //沿dir反方向寻找新的startPos
                startPos.y += scale_x * (-dir.y);
            }else if(multiX < 0){  //沿dir方向寻找新的startPos
                startPos.y += scale_x * dir.y;
            }
        }

        if(Math.abs(startPos.y) >= max_Y){   //Y轴越界
            let multiY = startPos.y * dir.y;
            let new_Y = (max_Y - adaptLen)*(startPos.y/Math.abs(startPos.y));
            let scale_y = Math.abs(startPos.y - new_Y)/Math.abs(dir.y);
            startPos.y = new_Y;
            if(multiY == 0){   //方向水平
            }else if(multiY > 0){  //沿dir反方向寻找新的startPos
                startPos.x += scale_y * (-dir.x);
            }else if(multiY < 0){  //沿dir方向寻找新的startPos
                startPos.x += scale_y * dir.x;
            }
        }

        if(Math.abs(startPos.x) >= max_X){  //X轴依然越界
            startPos.x = (max_X - adaptLen)*(startPos.x/Math.abs(startPos.x));
        }
        if(Math.abs(startPos.y) >= max_Y){  //Y轴依然越界
            startPos.y = (max_Y - adaptLen)*(startPos.y/Math.abs(startPos.y));
        }

        if(Math.abs(startPos.x) >= max_X || Math.abs(startPos.y) >= max_Y){  //依然越界
            //console.log("依然越界, startPos = "+startPos+"; dir = "+dir+"; pos = "+pos);
            return this.adaptPosByGameBorders(startPos, dir);
        }else{
            return startPos;
        }
    }

    /**遍历当前的砖块找到和射线相交的砖块
     * 每个砖块以球半径ballRadiusConf向外扩充边界，然后判定是否相交；
     * 扩充边框线段两端radConf+ballRadiusConf为弧度发射范围，中间为镜面反射范围。
     * @param startPos 射线起始点
     * @param endPos 射线模块
     * @param brickIds 上一次碰撞的砖块ID集合
     * @param hitType  0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知, 5地面反弹， 6移动反弹
     */
    checkIntersectionWithBricks(startPos:cc.Vec2, dir: cc.Vec2, endPos:cc.Vec2, bShowDot:boolean, hitType:number, brickIds: number[]): IntersectData[]{
        let tempArr: IntersectData[] = [];   //返回的碰撞砖块数据集合（因为可能两个砖块碰撞距离相同）
        this.tempItemNodes = [];   //射线规划时，临时存储某条射线经过的道具集合
        let dist = -1;
        for(let i=0; i<this.curBrickNodes.length; i++){
            if(this.curBrickNodes[i]){  
                let bCheckIntersection = true;
                let nodePos = this.curBrickNodes[i].position;
                let offsetY = nodePos.y - startPos.y;
                if(offsetY*dir.y < 0 && offsetY >= 50){   //距离远且Y轴反向位置
                    bCheckIntersection = false;
                }else{
                    let offsetX = nodePos.x - startPos.x;
                    if(offsetX*dir.x < 0 && offsetX >= 50){   //距离远且X轴反向位置
                        bCheckIntersection = false;
                    }
                }

                if(dist > 0 && bCheckIntersection == true){
                    let len = startPos.sub(nodePos).mag();
                    if(len > (dist + 100)){   //砖块位置和已知的交点距离太远，不可能会有更近的交点产生
                        bCheckIntersection = false;
                    }
                }

                if(bCheckIntersection == true){
                    let brick: Brick = this.curBrickNodes[i].getComponent(Brick);
                    if(bShowDot == false && (brick.isBrickDead() == true || brick.isMoveBrick() == true)){   
                        //在指示线情况下，移动小球在规划范围内，非指示线情况下不考虑移动小球的反弹（移动小球此时走碰撞反弹方法）
                        bCheckIntersection = false;
                    }else{
                        let lenData = this.pointLineDistance(nodePos, startPos, endPos);   //返回点到直线的距离、垂点、对称点
                        if(lenData == null || lenData.len > 100){   //砖块和线段相距太远
                            bCheckIntersection = false;
                        }
                    }

                    if(bCheckIntersection == true && brickIds && brickIds.length > 0){
                        for(let j=0; j<brickIds.length; ++j){
                            if(brick.brickId == brickIds[j]){  //上一次反射的砖块，避免该砖块产生连续两次反射的现象。
                                bCheckIntersection = false;
                                break;
                            }
                        }
                    }

                    if(bCheckIntersection == true){
                        let data: IntersectData = this.checkIntersectionOneBrick(startPos, endPos, brick, hitType);  //获取射线和单个砖块的碰撞及反射
                        if(data){
                            if(dist == - 1 || data.distLen < dist ){  //dist 上一个相交砖块的距离，-1标识无
                                tempArr = [];   //返回的碰撞砖块数据集合（因为可能两个砖块碰撞距离相同）
                                dist = data.distLen;
                                tempArr.push(data);
                            }else if(dist > 0 && dist == data.distLen){
                                tempArr.push(data);
                            }
                        }
                    }
                }
            }
        }

        return tempArr;
    }

    /**获取射线和单个砖块的碰撞及反射 
     * @param startPos 射线起始点
     * @param endPos 射线模块
     * @param brick 砖块
     * @param hitType  0碰撞，1无碰撞, 2偏转，3穿透, 4砖块死亡通知, 5地面反弹， 6移动反弹
    */
    checkIntersectionOneBrick(startPos:cc.Vec2, endPos:cc.Vec2, brick: Brick, hitType:number=0): IntersectData{
        if(brick && brick.brick_info){
            //主要检测矩形四个角、直线和边的交点，并找到最近的一个点, 检测射线和砖块的扩充边界（边界相交还是四角相交）是否相交，并找出距线段起点最近的相交点返回
            let radOffLen = this.radConf+this.ballRadiusConf;   //为转角弧度反射的偏移距离（半径），改距离内按照转角碰撞处理而非边镜面发射处理
            if(hitType == 3 ){  //|| brick.brick_info.moster_camp == 0
                radOffLen = 0;   //穿透时 或道具，不用计算弧度反射
            }
            let tempData: TempIntersectData = this.checkBrickInterectByDir(startPos, endPos, brick, radOffLen); 
            /**找到线段和边框的交点（适用于矩形，且去除四角弧度判定范围内的相交）, 0-3分别为左下、左上、右上、右下四个顶点
             * (线段必须穿过矩形，线段的延伸线穿过不算，并返回距射线起始点最近的交点，交点和起始点重合不算) 
             * */
            // 如果射线和矩形相交（边界相交或四角弧度相交）
            if(tempData && tempData.bIntersected){
                if(tempData.bIntersectBorder == true){  //是否镜面反射
                    let borders = tempData.borders;
                    let count = borders.length;
                    let p1 = borders[tempData.broderIdx];  //p1,p2为镜面反射线段边界的两个顶点
                    let p2 = borders[(tempData.broderIdx+1)%count];
                    //碰到砖块的边而不是转角，简单按照镜面反射处理
                    tempData.newDir = this.getReflectDir(startPos, tempData.intersectPoint, p1, p2);   //获取方向与线段的反射后新方向
                }

                return new IntersectData(tempData.intersectPoint, tempData.newDir, brick.node, tempData.broderIdx, tempData.intersectDist);
            }
        }
        return null;
    }

    /**检测射线和砖块的镜面反射数据 
     * @param startPos 射线起始点
     * @param endPos 射线模块
     * @param brick 砖块脚本
     * @param dist 上一个相交砖块的距离，-1标识无
     * @param radOffLen 为转角弧度反射的偏移距离（半径），改距离内按照转角碰撞处理而非边镜面发射处理
    */
    checkBrickInterectByDir(startPos:cc.Vec2, endPos:cc.Vec2, brick: Brick, radOffLen: number): TempIntersectData{
        let borders: cc.Vec2[] = [];   
        let sprSize = brick.node.getContentSize();
        let nodePos = brick.node.position.clone();
        let tempData: TempIntersectData = null;
        let brickType = brick.brick_info.monsterId;
        if(brickType >= 1001 && brickType <= 1004){   //分裂三角砖块
            if(brickType == 1001){   //分裂小怪左
                borders.push(cc.v2(nodePos.x, nodePos.y));
                borders.push(cc.v2(-sprSize.width/2 + nodePos.x, -sprSize.height/2 + nodePos.y));
                borders.push(cc.v2(-sprSize.width/2 + nodePos.x, sprSize.height/2 + nodePos.y));  
            }else if(brickType == 1002){   //分裂小怪右
                borders.push(cc.v2(nodePos.x, nodePos.y));
                borders.push(cc.v2(sprSize.width/2 + nodePos.x, sprSize.height/2 + nodePos.y));
                borders.push(cc.v2(sprSize.width/2 + nodePos.x, -sprSize.height/2 + nodePos.y));
            }else if(brickType == 1003){  //分裂小怪上
                borders.push(cc.v2(nodePos.x, nodePos.y));
                borders.push(cc.v2(-sprSize.width/2 + nodePos.x, sprSize.height/2 + nodePos.y));
                borders.push(cc.v2(sprSize.width/2 + nodePos.x, sprSize.height/2 + nodePos.y));
            }else if(brickType == 1004){  //分裂小怪下
                borders.push(cc.v2(nodePos.x, nodePos.y));
                borders.push(cc.v2(sprSize.width/2 + nodePos.x, -sprSize.height/2 + nodePos.y));
                borders.push(cc.v2(-sprSize.width/2 + nodePos.x, -sprSize.height/2 + nodePos.y));
            }
            let centerX = (borders[0].x + borders[1].x + borders[2].x)/3;
            let centerY = (borders[0].y + borders[1].y + borders[2].y)/3;
            let dir0 = borders[0].sub(cc.v2(centerX, centerY)).normalize();
            borders[0] = borders[0].add(dir0.mul(this.ballRadiusConf*Math.sqrt(2)));   //获得扩充边界
            for(let i=1; i<3; ++i){
                let dir1 = borders[i].sub(cc.v2(centerX, centerY)).normalize();
                borders[i] = borders[i].add(dir1.mul(this.ballRadiusConf/Math.cos(Math.PI/8)));
            }

            tempData = this.lineTrianglePoint(startPos, endPos, borders, radOffLen);  
            if(tempData && tempData.intersectPoint){   //射线与砖块扩充边界有交点（镜面反射）
                tempData.bIntersected = true;
                tempData.bIntersectBorder = true; 
                tempData.newDir = null;
            }else if(radOffLen != 0){  //检测弧度反射，并返回距射线起始点最近的交点
                let centerIdx = -1;   //距离射线起点最近的顶点索引
                let centerLen = -1;
                let centerPos = null;
                let centerRadius = 0;
                let centerArr = [];

                for(let i=0; i<borders.length; i++){
                    let center: cc.Vec2 = null;  //通过顶点和偏移，获取圆心
                    let radLen = this.radConf+this.ballRadiusConf;
                    let radius = radLen;
                    if(i == 0){
                        center = borders[0].sub(dir0.mul(radLen*Math.sqrt(2)))
                    }else{
                        let dir1 = borders[i].sub(cc.v2(centerX, centerY)).normalize();
                        center = borders[i].sub(dir1.mul(radLen/Math.cos(Math.PI/8)))
                        radius = radLen*Math.tan(Math.PI/8);
                    }
                    centerArr.push(center);

                    let tempLen = center.sub(startPos).mag();
                    let bChange = false;
                    if(centerLen == -1 || tempLen < centerLen){
                        bChange = true;
                    }else if(tempLen == centerLen){
                        let lenData1 = this.pointLineDistance(centerArr[centerIdx], startPos, endPos);   //返回点到直线的距离、垂点、对称点
                        if(lenData1 && lenData1.len){
                            let lenData2 = this.pointLineDistance(center, startPos, endPos);   //返回点到直线的距离、垂点、对称点
                            if(lenData2 && lenData2.len ){   //砖块和线段相距太远
                                if(lenData2.len < lenData1.len){
                                    bChange = true;
                                }
                            }
                        }else{
                            bChange = true;
                        }
                    }
                    if(bChange == true){
                        centerIdx = i;
                        centerLen = tempLen;
                        centerPos = center;
                        centerRadius = radius;
                    }
                }

                if(centerIdx >= 0){
                    let retData = this.lineCirclePoint(centerPos, startPos, endPos, centerRadius);
                    //计算直线和圆的交点（垂点必须在线段内），并返回交点和弧度反射向量 {newDir: newDir, intersectPoint: intersectPoint}
                    if(retData && retData.intersectPoint){   //射线与圆弧有接触，且非正好切入
                        let len = retData.intersectPoint.sub(startPos).mag();
                        if(tempData.intersectDist == -1 || len < tempData.intersectDist){
                            tempData.bIntersected = true;
                            tempData.intersectPoint = retData.intersectPoint;
                            tempData.broderIdx = centerIdx;
                            tempData.intersectDist = len;
                            tempData.bIntersectBorder = false;    //true边界相交(镜面反射)或者false四角弧度相交(弧度反射)
                            tempData.newDir = retData.newDir;
                        }
                    }
                }
            }
        }else{
            borders = this.getBorder(nodePos, sprSize.width, sprSize.height, this.ballRadiusConf);  //获得扩充边界
            tempData = this.lineRectPoint(startPos, endPos, borders, radOffLen);  

            // if(brick.brick_info.moster_camp == 0){    //砖块阵营   1敌方，0右方（道具）用于判断通关目标，友方不计入通关条件；友方怪物达到底层要消失，关卡不会失败；友方不计算关卡分数,血量照扣，友方砖块不反弹
            //     if(this.tempItemNodes && tempData && tempData.intersectPoint){   //射线与砖块扩充边界有交点（镜面反射）
            //         this.tempItemNodes.push(brick.node);   //射线规划时，临时存储某条射线经过的道具集合
            //     }
            //     return null;
            // }else{
                if(tempData && tempData.intersectPoint){   //射线与砖块扩充边界有交点（镜面反射）
                    tempData.bIntersected = true;
                    tempData.bIntersectBorder = true; 
                    tempData.newDir = null;
                }else if(radOffLen != 0){  //检测弧度反射（用矩形四角内嵌圆心到射线的距离来判定,且垂足在线段内），并返回距射线起始点最近的交点
                    let centerIdx = -1;   //距离射线起点最近的顶点索引
                    let centerLen = -1;
                    let centerPos = null;
                    let centerArr = [];

                    for(let i=0; i<borders.length; i++){
                        let center: cc.Vec2 = this.getCenterByVertex(borders[i], i, this.radConf+this.ballRadiusConf);  //通过顶点和偏移，获取圆心
                        let tempLen = center.sub(startPos).mag();
                        centerArr.push(center);

                        let bChange = false;
                        if(centerLen == -1 || tempLen < centerLen){
                            bChange = true;
                        }else if(tempLen == centerLen){
                            let lenData1 = this.pointLineDistance(centerArr[centerIdx], startPos, endPos);   //返回点到直线的距离、垂点、对称点
                            if(lenData1 && lenData1.len){
                                let lenData2 = this.pointLineDistance(center, startPos, endPos);   //返回点到直线的距离、垂点、对称点
                                if(lenData2 && lenData2.len ){   //砖块和线段相距太远
                                    if(lenData2.len < lenData1.len){
                                        bChange = true;
                                    }
                                }
                            }else{
                                bChange = true;
                            }
                        }
                        if(bChange == true){
                            centerIdx = i;
                            centerLen = tempLen;
                            centerPos = center;
                        }
                    }
                    if(centerIdx >= 0){
                        let retData = this.lineCirclePoint(centerPos, startPos, endPos, this.radConf+this.ballRadiusConf);
                        //计算直线和圆的交点（垂点必须在线段内），并返回交点和弧度反射向量 {newDir: newDir, intersectPoint: intersectPoint}
                        if(retData && retData.intersectPoint){   //射线与圆弧有接触，且非正好切入
                            let len = retData.intersectPoint.sub(startPos).mag();
                            if(tempData.intersectDist == -1 || len < tempData.intersectDist){
                                tempData.bIntersected = true;
                                tempData.intersectPoint = retData.intersectPoint;
                                tempData.broderIdx = centerIdx;
                                tempData.intersectDist = len;
                                tempData.bIntersectBorder = false;    //true边界相交(镜面反射)或者false四角弧度相交(弧度反射)
                                tempData.newDir = retData.newDir;
                            }
                        }
                    }
                }
            //}
        }
        if(tempData && tempData.intersectPoint){
            tempData.borders = borders;
        }else{   //砖块没有和射线相交
            tempData = null;
        }

        return tempData;
    }

    /**
     * 获取节点的边框点在父节点中的坐标，仅支持anchor为(0.5,0.5)的节点
     * @param pos 中心点
     * @param w width
     * @param h height
     * @param offset 边框扩充值，正值向外扩，负值向内扩
     */
    getBorder(pos:cc.Vec2, w:number, h:number, offset: number):Array<cc.Vec2>{
        let borders: Array<cc.Vec2> = new Array<cc.Vec2>();
        // 左下
        borders.push(cc.v2(pos.x-w/2 -offset, pos.y-h/2 -offset));
        // 左上
        borders.push(cc.v2(pos.x-w/2 -offset, pos.y+h/2 +offset));
        // 右上
        borders.push(cc.v2(pos.x+w/2 +offset, pos.y+h/2 +offset));
        // 右下
        borders.push(cc.v2(pos.x+w/2 +offset, pos.y-h/2- offset));
        return borders;
    }

    /**点是否在矩形边框内 */
    bordersContainsPoint(borders: Array<cc.Vec2>, pos: cc.Vec2){
        let rect = new cc.Rect(borders[0].x, borders[0].y, Math.abs(borders[2].x - borders[0].x), Math.abs(borders[1].y - borders[0].y))    //x,y是以左下角为原点
        return rect.contains(pos);
    }

    /**获取游戏棋盘边框顶点集合 
     * @param offset 边框扩充值，正值向外扩，负值向内扩
    */
    getGameBorders(offset:number): Array<cc.Vec2>{
        let gameBorderRect = this.gameBordersRect;   //棋盘边界矩形（中心点+宽高）
        let borders: Array<cc.Vec2> = this.getBorder(cc.v2(gameBorderRect.x, gameBorderRect.y), gameBorderRect.width, gameBorderRect.height, offset); // 由于场不仅仅是中间框，还包括框下一行，所以调整中心点
        return borders;
    }

    /**点是否在边框上 */
    pointInGameBorders(pos: cc.Vec2){
        let vertex = -1;   //点坐在边框的起始顶点索引
        let len = -1;
        if(pos){
            let borders: Array<cc.Vec2> = this.getGameBorders(0);
            for(let i=0; i<borders.length; i++){
                let p1 = borders[i].clone();
                let p2 = borders[(i+1)%4].clone();
                let tempData = this.pointLineDistance(pos, p1, p2);   //返回点到直线的距离、垂点、对称点
                if(tempData && tempData.len < this.ballRadiusConf){
                    if(len == -1 || len > tempData.len){
                        vertex = i;   //上一个碰撞的游戏边界索引
                        len = tempData.len;
                    }
                }
            }
        }
        return {vertex: vertex, len: len};
    }

    /**
     * 找到线段和三角边框的交点(线段必须穿过三角，线段的延伸线穿过不算，交点和射线起始点相同不算，并返回距射线起始点最近的交点，交点和起始点重合不算)
     * @param startPos 起点
     * @param endPos 终点
     * @param borders 边框顶点（扩充边界）
     * @param radOffLen 为转角弧度反射的偏移距离（半径），改距离内按照转角碰撞处理而非边镜面发射处理
     */
    lineTrianglePoint(startPos:cc.Vec2, endPos:cc.Vec2, borders: Array<cc.Vec2>, radOffLen:number): TempIntersectData{
        let intersectPoint: cc.Vec2 = null;   //距离射线起始点最近的交点
        let intersectLen: number = 0;   //交点与射线起始点的距离
        let borderIdx = -1;   //交点坐在边框的索引值

        for(let i=0; i<borders.length; i++){
            let p1 = borders[i].clone();
            let p2 = borders[(i+1)%3].clone();
            let tempIntersect: cc.Vec2 = null;   //射线和矩形每条边界的相交点
            let tempLen: number = 0;

            tempIntersect = this.segmentsIntersect(startPos, endPos, p1, p2);  //计算线段ab和cd的交点（交点要在有效的线段内，延伸线无效）
            if(tempIntersect){
                tempLen = tempIntersect.sub(startPos).mag();
                if(tempLen >= 0.00000001 &&((intersectPoint == null && intersectLen == 0) || intersectLen > tempLen)){   //交点和射线起始点相同不算，且为最新最近交点
                    intersectLen = tempLen;

                    let intersect: boolean = false;
                    if(radOffLen != 0){
                        //除去弧度反射的判定范围
                        let dir = p2.sub(p1).normalize();
                        p1 = p1.add(dir.mul(radOffLen));
                        p2 = p2.sub(dir.mul(radOffLen))

                        intersect = cc.Intersection.lineLine(startPos, endPos, p1, p2);
                    }else{
                        intersect = true;
                    }

                    if(intersect){
                        borderIdx = i;
                        intersectPoint = tempIntersect;
                    }else{
                        borderIdx = -1;
                        intersectPoint = null;
                    }
                }
            }
        }

        let tempData = new TempIntersectData();
        tempData.intersectPoint = intersectPoint;
        tempData.intersectDist = intersectPoint == null ? -1 : intersectLen;
        tempData.broderIdx = borderIdx;
        
        return tempData;
    }

    /**
     * 找到线段和边框的交点（适用于矩形，且去除四角弧度判定范围内的相交）, 0-3分别为左下、左上、右上、右下四个顶点
     * (线段必须穿过矩形，线段的延伸线穿过不算，交点和射线起始点相同不算，并返回距射线起始点最近的交点，交点和起始点重合不算)
     * @param startPos 起点
     * @param endPos 终点
     * @param borders 矩形边框顶点（扩充边界）
     * @param radOffLen 为转角弧度反射的偏移距离（半径），改距离内按照转角碰撞处理而非边镜面发射处理
     */
    lineRectPoint(startPos:cc.Vec2, endPos:cc.Vec2, borders: Array<cc.Vec2>, radOffLen:number): TempIntersectData{
        let intersectPoint: cc.Vec2 = null;   //距离射线起始点最近的交点
        let intersectLen: number = -1;   //交点与射线起始点的距离
        let borderIdx: number = -1;   //交点坐在边框的索引值

        let intersect: boolean = false;
        for(let i=0; i<borders.length; i++){
            let bNext = false;
            let p1 = borders[i].clone();
            if(i == 0 || i == 2){   //两条竖边
                let tempX = (endPos.x - startPos.x) * (p1.x - startPos.x);
                if( tempX <= 0){
                    bNext = true;   //该边和射线方向相反，不可能相交  或者 =0矩形边和射线起点X轴坐标相同
                }
            }else{   //两条横边
                let tempY = (endPos.y - startPos.y) * (p1.y - startPos.y);
                if( tempY <= 0){
                    bNext = true;   //该边和射线方向相反，不可能相交  或者 =0矩形边和射线起点Y轴坐标相同
                }
            }

            if(bNext == false){
                let p2 = borders[(i+1)%4].clone();
                let tempIntersect: cc.Vec2 = null;   //射线和矩形每条边界的相交点
                let tempLen: number = 0;
    
                tempIntersect = this.segmentsIntersect(startPos, endPos, p1, p2);  //计算线段ab和cd的交点（交点要在有效的线段内，延伸线无效）
                if(tempIntersect){
                    tempLen = tempIntersect.sub(startPos).mag();
                    if(tempLen >= 0.00000001 && ((intersectPoint == null && intersectLen == -1) || tempLen < intersectLen)){   //交点和射线起始点相同不算，且为最新最近交点
                        intersectLen = tempLen;
    
                        //除去弧度反射的判定范围
                        if(radOffLen != 0){
                            if(i == 0){   //左下角
                                p1.y += radOffLen;
                                p2.y -= radOffLen;
                            }else if(i==1){  //左上角
                                p1.x += radOffLen;
                                p2.x -= radOffLen;
                            }else if(i == 2){  //右上角
                                p1.y -= radOffLen;
                                p2.y += radOffLen;
                            }else if(i == 3){  //右下角
                                p1.x -= radOffLen;
                                p2.x += radOffLen;
                            }
                            intersect = cc.Intersection.lineLine(startPos, endPos, p1, p2);
                        }else{
                            intersect = true;
                        }
    
                        if(intersect){
                            borderIdx = i;
                            intersectPoint = tempIntersect.clone();
                        }else{
                            borderIdx = -1;
                            intersectPoint = null;
                        }
                    }
                }
            }
        }

        let tempData = new TempIntersectData();
        tempData.bIntersectBorder = true;
        tempData.intersectPoint = intersectPoint;
        tempData.intersectDist = intersectPoint == null ? -1 : intersectLen;
        tempData.broderIdx = borderIdx;

        return tempData;
    }

    /**检查射线起点在砖块内的反射方向
     * 找出射线射入的边框交点（射线反方向相交的扩展边交点），然后求出相交边和射线的反射方向。
    */
    checkInnerBrickInterect(startPos:cc.Vec2, rayDir:cc.Vec2, brick: Brick):cc.Vec2{ 
        let sprSize = brick.node.getContentSize();
        let nodePos = brick.node.position.clone();
        let borders: cc.Vec2[] = this.getBorder(nodePos, sprSize.width, sprSize.height, this.ballRadiusConf);  //获得扩充边界
        let dir: cc.Vec2 = rayDir.neg();
        let endPos: cc.Vec2 = startPos.add(dir.mul(200));

        let intersectPoint: cc.Vec2 = null;   //距离射线起始点最近的交点
        let intersectLen: number = -1;   //交点与射线起始点的距离
        let borderIdx: number = -1;   //交点坐在边框的索引值

        for(let i=0; i<borders.length; i++){
            let bNext = false;
            let p1 = borders[i].clone();
            if(i == 0 || i == 2){   //两条竖边
                let tempX = (endPos.x - startPos.x) * (p1.x - startPos.x);
                if( tempX <= 0){
                    bNext = true;   //该边和射线方向相反，不可能相交  或者 =0矩形边和射线起点X轴坐标相同
                }
            }else{   //两条横边
                let tempY = (endPos.y - startPos.y) * (p1.y - startPos.y);
                if( tempY <= 0){
                    bNext = true;   //该边和射线方向相反，不可能相交  或者 =0矩形边和射线起点Y轴坐标相同
                }
            }

            if(bNext == false){
                let p2 = borders[(i+1)%4].clone();
                let tempIntersect: cc.Vec2 = null;   //射线和矩形每条边界的相交点
                let tempLen: number = 0;
    
                tempIntersect = this.segmentsIntersect(startPos, endPos, p1, p2);  //计算线段ab和cd的交点（交点要在有效的线段内，延伸线无效）
                if(tempIntersect){
                    tempLen = tempIntersect.sub(startPos).mag();
                    if(tempLen >= 0.00000001 && ((intersectPoint == null && intersectLen == -1) || tempLen < intersectLen)){   //交点和射线起始点相同不算，且为最新最近交点
                        intersectLen = tempLen;
                        borderIdx = i;
                        intersectPoint = tempIntersect.clone();
                    }
                }
            }
        }

        if(borderIdx >= 0 && intersectPoint){
            let tempPos = intersectPoint.add(dir.mul(10));
            let newDir = this.getReflectDir(tempPos, intersectPoint, borders[borderIdx], borders[(borderIdx+1)%4]);  //获取发射线与镜面线段的反射后新方向
            return newDir;
        }else{
            return null
        }
    }

    /**计算线段ab和cd的交点（交点要在有效的线段内，延伸线无效） */
    segmentsIntersect(a: cc.Vec2, b: cc.Vec2, c: cc.Vec2, d: cc.Vec2): cc.Vec2{  
        // 三角形abc 面积的2倍  
        var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);  
        // 三角形abd 面积的2倍  
        var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);   
      
        // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);  
        if ( area_abc*area_abd>=0 ) {  
            return null;  
        }  
      
        // 三角形cda 面积的2倍  
        var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);  
        // 三角形cdb 面积的2倍  
        // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.  
        var area_cdb = area_cda + area_abc - area_abd ;  
        if (  area_cda * area_cdb >= 0 ) {  
            return null;  
        }  
      
        //计算交点坐标  
        var t = area_cda / ( area_abd- area_abc );  
        var dx= t*(b.x - a.x),  
            dy= t*(b.y - a.y);  
        return cc.v2(a.x + dx , a.y + dy);  
    }  

    /**获取发射线与镜面线段的反射后新方向
     * @param point 发射直线起点
     * @param intersect 发射直接终点或直线与线段（镜面）的交点
     * @param startPos 线段(镜面)起点
     * @param endPos 线段(镜面)终点
     */
    getReflectDir(point: cc.Vec2, intersect: cc.Vec2, startPos: cc.Vec2, endPos: cc.Vec2): cc.Vec2{
        let tempData = this.pointLineDistance(point, startPos, endPos);   //返回点到直线的距离、垂点、对称点
        if(tempData && tempData.symPoint){
            let symPoint = tempData.symPoint;   //发射线起点的对称点
            let newDir = intersect.sub(symPoint).normalizeSelf();
            return newDir;
        }
        return null;
    }

    /**通过顶点和偏移，获取圆心 */
    getCenterByVertex(vertex: cc.Vec2, idx: number, offLen: number){
        let center: cc.Vec2 = vertex.clone();
        if(idx==0){
            center.x += offLen;
            center.y += offLen;
        }else if(idx == 1){
            center.x += offLen;
            center.y -= offLen;
        }else if(idx==2){
            center.x -= offLen;
            center.y -= offLen;
        }else if(idx == 3){
            center.x -= offLen;
            center.y += offLen;
        }
        return center;
    }

    /**返回点到直线的距离、垂点、对称点*/
    pointLineDistance(point: cc.Vec2, start: cc.Vec2, end: cc.Vec2) {
        /**
         * 给定两点p1(x1,y1),p2(x2,y2),假设两点不重合，求直线方程A*X+B*Y+C=0,A,B,C分别是
         * A=y2-y1;
         * B=x1-x2;
         * C=x2*y1-x1*y2;
        */
        let A = end.y - start.y;
        let B = start.x - end.x;

        if(Math.abs(A)<0.00000001 && Math.abs(B)<0.00000001){
            //return {len: 0, point: start};
            return null;
        }

        let C = end.x * start.y - start.x * end.y;

        /**
         * 求点p(x0,y0)到直线AX+BY+C=0的距离d，垂足（x,y）， 对称点（xx, yy)
         * d = ( Ax0 + By0 + C ) / sqrt ( A*A + B*B ); 这个"距离"有符号，表示在点的上方或下方，取绝对值表示欧式距离
         * 垂足 x = (  B*B*x0 - A*B*y0 - A*C  ) / ( A*A + B*B );
         * 垂足 y = ( -A*B*x0 + A*A*y0 - B*C  ) / ( A*A + B*B );
         * 
         * 对称点求出垂足；则xx = 2*x - x0; yy = 2*y - y0;
         */
        let D = A*A + B*B;
        let len = Math.abs(A*point.x + B*point.y + C)/Math.sqrt(D);   //距离
        let x = (B*B*point.x - A*B*point.y - A*C)/D;
        let y = (-A*B*point.x + A*A*point.y - B*C)/D;
        let p = cc.v2(x, y);   //垂足

        let pp = cc.v2(2*x - point.x, 2*y - point.y);   //对称点

        return {len: len, vertPoint: p, symPoint: pp};
    }

    /**
     * 计算直线和圆的交点（垂点必须在线段内），并返回交点和弧度反射向量 {newDir: newDir, intersectPoint: intersectPoint, len: len}
     * @param center 圆心
     * @param startPos 线段起点
     * @param endPos 线段终点
     * @param radius 半径
     */
    lineCirclePoint(center: cc.Vec2, startPos: cc.Vec2, endPos: cc.Vec2, radius:number){
        let tempData = this.pointLineDistance(center, startPos, endPos);   //返回点到直线的距离、垂点、对称点
        if(tempData && tempData.vertPoint){
            let centerLen = tempData.len;   //圆心到直线距离
            let point: cc.Vec2 = tempData.vertPoint;   //垂点
            let dir: cc.Vec2 = endPos.sub(startPos).normalizeSelf();   //直线入射方向
            let newDir: cc.Vec2 = null;   //反射方向
            let intersectPoint: cc.Vec2 = null;   //相交点

            let tempX = (startPos.x - point.x)*(endPos.x - point.x);
            let tempY = (startPos.y - point.y)*(endPos.y - point.y);
            if(tempX > 0 || tempY > 0){   //垂足不在线段内
                return null;
            }

            if(centerLen <= 0.00000001){   //射线经过圆心，垂直反射
                newDir = dir.neg();
                intersectPoint = cc.v2(center.x + newDir.x * radius, center.y + newDir.y * radius);
                return {dir: newDir, intersectPoint: intersectPoint};
            }else if(centerLen == radius){   //切线切入，方向不变
                return {dir: dir, intersectPoint: null};
            }else if(centerLen < radius){   //相交
                let rad = Math.abs(Math.acos(centerLen/radius));    //垂线和交线的夹角弧度。
                let referDir = point.sub(center).normalizeSelf();   //垂线向量
                let dir1 = cc.v2(referDir.x, referDir.y).rotate(rad);   //顺时针   //注意会改变自身，故要使用克隆对象
                let dir2 = cc.v2(referDir.x, referDir.y).rotate(-rad);  //逆时针
                let intersectPoint1 = cc.v2(center.x + dir1.x * radius, center.y + dir1.y * radius);
                let intersectPoint2 = cc.v2(center.x + dir2.x * radius, center.y + dir2.y * radius);

                if(intersectPoint1.sub(startPos).mag() <= intersectPoint2.sub(startPos).mag()){
                    intersectPoint = intersectPoint1;  //顺时针  
                    newDir = cc.v2(dir.x, dir.y).rotate(2*rad);
                }else{
                    intersectPoint = intersectPoint2;   //逆时针
                    newDir = cc.v2(dir.x, dir.y).rotate(-2*rad);
                }

                return {newDir: newDir, intersectPoint: intersectPoint};
            }else{   //未相交
                return null;
            }
        }
        return null;
    }

    //***************************  射线部分结束  ************ */


}

export var FightMgr = new FightManager();