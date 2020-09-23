
//异步消息通知
const {ccclass, property} = cc._decorator;

/**异步消息通知类型 */
export const NoticeType = {
    GAME_ON_HIDE: "GAME_ON_HIDE", //游戏切入后台
    Guide_TouchMove: "Guide_TouchMove",  //触摸引导移动

    UpdateGold: "UpdateGold",   //更新金币显示
    UpdateDiamond: "UpdateDiamond",   //更新钻石（金锭）显示
    UpdateFood: "UpdateFood",   //更新粮食显示
    UpdateRoleLvOffical: "UpdateRoleLvOffical",   //更新主角等级或官职
    ShowMainMap: "ShowMainMap",  //显示大厅场景的全局地图

    UpdateBagItem: "UpdateBagItem",  //更新单个背包物品
    UpdateGeneral: "UpdateGeneral",  //更新单个武将

    MapMoveByCity: "MapMoveByCity",   //话本目标通知（地图移动）
    UpdateTaskState: "UpdateTaskState",   //任务状态更新

    SelBlockMove: "SelBlockMove",   //准备拖动砖块

    PerNextRound: "PerNextRound",   //通知地块准备下一个回合
    EnemyRoundOptAI: "EnemyRoundOptAI",   //敌方自动AI

    GameOverNotice: "GameOverNotice",   //游戏结束通知
    UpdateShiqiNotice: "UpdateShiqiNotice",   //士气改变通知

    CityFlagStory: "CityFlagStory",  //黄巾之乱，董卓之乱等叛乱的城池旗帜通知
}

@ccclass
class Notification_class {
    _eventMap: Map<number, Array<any>> = new Map<number, Array<any>>();
    _eventTarget: Map<any, Array<any>> = new Map<any, Array<any>>();

    on(type, callback, target) {
        if (this._eventMap[type] === undefined) {
            this._eventMap[type] = [];
        }
        this._eventMap[type].push({ callback: callback, target: target });

        var objId = this.getTargetUid(target);
        if (this._eventTarget[objId] === undefined) {
            this._eventTarget[objId] = [];
        }
        this._eventTarget[objId].push({ type: type, callback: callback });
    }

    emit(type, parameter=null, par2=null) {
        var array = this._eventMap[type];
        if (array === undefined) return;
        
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (element) element.callback.call(element.target, parameter, par2);
        }
    }

    offAll(target) {
        var objId = this.getTargetUid(target);
        var array = this._eventTarget[objId];
        if (array === undefined) return;
        
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (element) 
                this.off(element.type, element.callback, target);
        }
        target.uid = undefined;
        delete this._eventTarget[objId];
    }

    off(type, callback, target) {
        var array = this._eventMap[type];
        if (array === undefined) return;

        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (element && element.callback === callback && element.target.uid === target.uid) {
                array[i] = undefined;
                //array.splice(i, 1);
                break;
            }
        }
    }

    offType(type) {
        delete this._eventMap[type];
    }

    getTargetUid(target){
        if(target.uid == null){
            let uidName = target.name == null ? "MGR" : target.name;
            let uuid = target.uuid == null ? "uuid" : target.uuid;
            //let randNum = Math.round(Math.random()*1000000);
            let randNum = new Date().getTime();

            target.uid = uidName+"-"+uuid+"-"+randNum.toString();

            // if(target.name != null){
            //     target.uid = target.name + "-" + Math.round(Math.random()*1000000);
            // }else{
            //     target.uid = "MGR-" + Math.round(Math.random()*1000000);
            // }
        }
        return target.uid;
    }


}

export  var NoticeMgr = new Notification_class();