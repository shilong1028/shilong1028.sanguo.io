
//异步消息通知
const {ccclass, property} = cc._decorator;

@ccclass
class Notification_class {
    _eventMap: Map<number, Array<any>> = new Map<number, Array<any>>();
    _eventTarget: Map<any, Array<any>> = new Map<any, Array<any>>();

    on(type, callback, target) {
        if (this._eventMap[type] === undefined) {
            this._eventMap[type] = new Array();
        }
        this._eventMap[type].push({ callback: callback, target: target });

        var objId = this.getTargetUid(target);
        if (this._eventTarget[objId] === undefined) {
            this._eventTarget[objId] = new Array();
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

export  var NotificationMy = new Notification_class();