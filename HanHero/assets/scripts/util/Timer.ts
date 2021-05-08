/*
 * @Autor: dongsl
 * @Date: 2021-03-19 17:26:44
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-19 17:27:49
 * @Description:  静态类,处理延迟功能
 */

export type TimerIDType = { cancel: Function }

export default class Timer {
    private static scheduler = new cc.Scheduler()
    private static increash_counter = 0
    private static timers = Object.create(null)

    private static FOREVER_TIMES = 9007199254740992 //每次加一永远不可能达到2^53

    private static counter = 0
    private static empty_cancel_obj = { cancel: function () { } }

    static delay_do(delay: number, callback: Function, ...params: any[]): TimerIDType {
        if (delay == 0) {
            delay = 0.0001 //delay=0不会触发回调,Bug?//
        }

        let inner_key = Timer.counter++

        let id = setTimeout(function () {
            delete Timer.timers[inner_key]
            callback(params[0], params[1], params[3], params[4], params[5])
        }, delay * 1000)


        Timer.timers[inner_key] = id

        let info: TimerIDType = Object.create(null)
        info.cancel = function () {
            clearTimeout(id)
            delete Timer.timers[inner_key]
        }
        return info
    }

    static clear_all_delay_ids() {
        for (const key in Timer.timers) {
            Timer.timers[key].cancel()
        }
    }

    static delay_do_safe(node: cc.Node, delay: number, callback: Function) {
        if (!node) {
            return
        }
        return node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(callback)))
    }

    static delay_do_with_node(node: cc.Node, delay: number, callback: Function) {
        let action = Timer.delay_do_safe(node, delay, callback)
        let info: TimerIDType = Object.create(null)
        info.cancel = function () {
            if (cc.isValid(node) && !action.isDone()) {
                node.stopAction(action)
            }

        }
        return info
    }

    static repeat_do(interval: number, callback: Function, delay = 0, times = Timer.FOREVER_TIMES): TimerIDType {
        if (times == 0) {
            return Timer.empty_cancel_obj
        }
        if (times < 0) {
            times = Timer.FOREVER_TIMES
        }

        //Timer.scheduler.schedule(callback, target, interval, times - 1, delay, false) //times-1:第一次delay+times -1次//


        let delay_id, repeat_id
        let inner_key = Timer.counter++
        let timer_id = Object.create(null)
        timer_id.is_alive = true

        function repeat_process() {
            callback()
            --times
            if (times <= 0) {
                clearInterval(repeat_id)
                delete Timer[inner_key]
                repeat_id = null
            }
        }


        function delay_process() {
            callback()
            --times
            delay_id = null
            if (times > 0 && timer_id.is_alive) {
                repeat_id = setInterval(repeat_process, interval * 1000)
            }
            else {
                delete Timer[inner_key]
            }

        }

        if (delay > 0) {
            delay_id = setTimeout(delay_process, delay * 1000)
        }
        else {
            repeat_id = setInterval(repeat_process, interval * 1000)
        }



        timer_id.cancel = function () {
            if (delay_id) {
                clearTimeout(delay_id)
                delay_id = null
            }
            if (repeat_id) {
                clearInterval(repeat_id)
                repeat_id = null
            }
            delete Timer[inner_key]
            this.is_alive = false
        }

        Timer[inner_key] = timer_id
        return timer_id
    }

    static repeat_do_safe(node: cc.Node, interval: number,
        callback: Function, target?: any,
        delay?: number, times = Timer.FOREVER_TIMES) {

        if (times == 0) {
            return
        }
        if (times < 0) {
            times = Timer.FOREVER_TIMES
        }

        target = target ? target : Timer  //schedule 非要有target//
        delay = delay ? delay : 0

        if (delay == 0 && times == 1) {
            callback.apply(target) //马上调用//
            return //没了直接返回//
        }
        else if (delay == 0) {
            callback.apply(target)//马上调用//
            times-- //已经调用过一次了//
            delay = interval //下一次调用为间隔时间了,不再是delay//
        }

        if (times <= 0) {
            return
        }
        if (times <= 1) {
            let action = cc.sequence(cc.delayTime(delay), cc.callFunc(callback, target))
            return node.runAction(action)
        }

        let seq1 = cc.sequence(cc.delayTime(delay), cc.callFunc(callback, target))
        let seq2 = cc.sequence(cc.delayTime(interval), cc.callFunc(callback, target))
        let action = cc.sequence(seq1, cc.repeat(seq2, times - 1))
        return node.runAction(action)
    }

    static repeat_do_with_node(node: cc.Node, interval: number, callback: Function, target?: any, delay?: number, times = Timer.FOREVER_TIMES): TimerIDType {
        let action = Timer.repeat_do_safe(node, interval, callback, target, delay, times)
        let info: TimerIDType = Object.create(null)
        info.cancel = function () {
            if (cc.isValid(node) && node.parent && action && !action.isDone()) {
                node.stopAction(action)
            }
        }
        return info
    }
}