import TimeHelper from './TimeHelper';

/*
 * @Autor: dongsl
 * @Date: 2021-03-19 17:23:08
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 14:48:05
 * @Description: 同一件事（比如弹出提示）时间间隔必须大于一定的时间(0.001秒)
 */

export default class ExecuteInterval {
    private static _default_execute_interval_: ExecuteInterval
    private _interval_: number = 0
    private last_time: number = -1
    private local_last_time: number = -1
    private time_offset: number = 0

    static init() {
        this._default_execute_interval_ = new ExecuteInterval(0.3)
    }

    static get default_execute_interval(): ExecuteInterval {
        return this._default_execute_interval_
    }


    get interval(): number {
        return this._interval_
    }

    constructor(interval: number) {
        this._interval_ = interval
        this.last_time = -1
        this.local_last_time = -1
        this.time_offset = 0
    }

    execute(callback: Function, ...args): boolean {
        let now = TimeHelper.get_server_time()
        let local_now = TimeHelper.get_local_time()

        // 第二个条件说明和服务器发生了时间同步
        if ((now - this.last_time > this._interval_) || (now - this.last_time <= 0 && local_now - this.local_last_time > this._interval_)) {
            if (callback(...args)) {
                return false//返回是否放弃执行
            }
            this.last_time = now
            this.local_last_time = local_now
            return true
        }
        if (now - this.last_time <= 0) {
            this.last_time = now
        }
        //本地时间调小了
        if (local_now - this.local_last_time <= 0) {
            this.local_last_time = local_now
        }
        return false //未能执行
    }

    //强制将执行时间往前或者往后//
    step(seconds: number) {
        this.last_time += seconds
        this.local_last_time += seconds

        //-1 代表没赋值，其余的负数是不合法的//
        this.last_time = Math.max(this.last_time, -1)
        this.local_last_time = Math.max(this.local_last_time, -1)
    }
    /**
     * 清除执行时间间隔
     */
    clear_execute_info(): void {
        this.last_time = -1 //上一次执行的服务器时间
        this.local_last_time = -1 //上一次的本地时间
    }

    /**
     * 按这个间隔是否能够执行
     */
    can_execute(pinterval?: number): boolean {
        if (pinterval == null) pinterval = this.interval
        let now = TimeHelper.get_server_time()
        let local_now = TimeHelper.get_local_time()
        return (now - this.last_time > pinterval) || (now - this.last_time <= 0 && local_now - this.local_last_time > pinterval)
    }

    /**
     * 距离下次可执行还需要多少时间
     */
    rest_wait_time(pinterval?: number): number {
        if (pinterval == null) pinterval = this.interval
        if (this.can_execute(pinterval)) return 0

        let now = TimeHelper.get_server_time()
        let local_now = TimeHelper.get_local_time()
        if (now > this.last_time) {
            return this.last_time + pinterval - now
        }
        else if (local_now > this.local_last_time) {
            return this.local_last_time + pinterval - local_now
        }
        return pinterval
    }

    static clear_default_execute_info() {
        let now = TimeHelper.get_server_time()
        this._default_execute_interval_.last_time = now
    }
}
