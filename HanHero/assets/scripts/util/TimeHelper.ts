import Timer from './Timer';

/*
 * @Autor: dongsl
 * @Date: 2021-03-19 17:25:24
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-19 17:30:59
 * @Description: 时间辅助类
 */

export default class TimeHelper {
    private static time_offset: number = 0
    private static last_os_time: number = 0
    private static MAX_ERROR_NUM: number = 6 //允许的最大误差:以秒为单位
    private static is_requesting: boolean = false
    private static system_time_id: any = null
    private static calibration_time_watcher: { [id: number]: Function } = {} //当时间校准后主动通知外部
    private static hourly_point_watcher: { [id: number]: { watch: Function, times: Array<number> } } = [] //整点数值监听
    private static calibration_watch_id: number = 0
    private static hourly_watch_id: number = 0
    private static last_hour: number = 25;   //整点记录，用于跨天处理

    /**
     * 开始时间定时器
     */
    static start(): void {
        this.cancel()

        this.last_os_time = 0
        this.time_offset = 0
        this.is_requesting = false
        this.tick()
        this.system_time_id = Timer.repeat_do(3, this.tick.bind(this))
    }

    /**
     * 每隔一定时间执行一次
     */
    static tick(): void {
        let date = new Date()
        let now = date.getTime() / 1000
        let last_os_time = this.last_os_time
        this.last_os_time = now
        this.notify_hourly_point_time(date)
        if (Math.abs(now - last_os_time) < this.MAX_ERROR_NUM) return
        if (this.is_requesting) return
        this.sync_system_time()
    }

    /**
     * 同步系统时间
     * callback:同步时间的回调
     */
    static sync_system_time(callback?: Function) {
        // let system_time_msg = NetworkHelper.make_request("ReqKeepAlive")
        // let post_id = NetworkHelper.post_until(system_time_msg, "ResKeepAlive", undefined, (event: string, result) => {
        //     this.is_requesting = false
        //     if (event === "succ" && CheckResponse.check(result, false)) {
        //         this.set_time(result.serverTimestamp)
        //         if (callback) {
        //             callback("succ")
        //         }
        //     }

        //     else if (callback) {
        //         callback("fail")
        //     }
        // })
        // return post_id

    }

    /**
     * 取消定时器
     */
    static cancel(): void {
        if (this.system_time_id) {
            this.system_time_id.cancel()
            this.system_time_id = null
        }
    }

    /**
     * 添加整点小时监听
     * watch:监听回调函数
     * times:整点小时数组
     */
    static add_hourly_point_watcher(watch: Function, times: Array<number>): number {
        this.hourly_point_watcher[++this.hourly_watch_id] = { watch: watch, times: times }
        return this.hourly_watch_id
    }

    /**
     * 移除相应整点回调监听
     */
    static remove_hourly_point_watcher(watch_id: number): void {
        delete this.hourly_point_watcher[watch_id]
    }

    /**
     * 整点回调函数检测
     * date:当前时间
     */
    static notify_hourly_point_time(date: Date): void {
        if (date.getMinutes() !== 0) return;
        let S = date.getSeconds()
        let H = date.getHours()
        if (this.last_hour !== H && (H === 0 || H === 24)) {
            //EventManager.dispatch_event("notice_new_day_coming_by_timehelper_hourly")   //通知新的一天开始了
        }
        this.last_hour = H;

        if (S >= 3) return

        let data, watch
        for (const id in this.hourly_point_watcher) {
            data = this.hourly_point_watcher[id]
            watch = data.watch
            for (const hour of data.times) {
                if (H == hour) {
                    watch(hour)
                    break
                }
            }
        }
    }

    /**
     * 添加校准了时间的回调
     */
    static add_calibration_time_watcher(watch: Function): number {
        this.calibration_time_watcher[++this.calibration_watch_id] = watch
        return this.calibration_watch_id
    }

    /**
     * 移除校准了时间的回调
     */
    static remove_calibration_time_watcher(watch_id: number): void {
        delete this.calibration_time_watcher[watch_id]
    }

    /**
     * 通知外部校准了时间
     */
    static notify_calibration_time(system_seconds): void {
        for (const id in this.calibration_time_watcher) {
            this.calibration_time_watcher[id](system_seconds)
        }
    }

    /**
     *获取当前服务器时间(单位:秒,有小数位)
     */
    static get_server_time(): number {
        return new Date().getTime() / 1000 + this.time_offset
    }

    /**
     * 获取当前本地时间(单位:秒,有小数位)
     */
    static get_local_time(): number {
        return new Date().getTime() / 1000
    }

    /**
     * 设置当前时间
     */
    static set_time(system_seconds: number): void {
        this.time_offset = system_seconds - new Date().getTime() / 1000
        this.notify_calibration_time(system_seconds)
    }

    static format_time_to_year_month_day(timeStamp): string {
        let date1 = new Date(timeStamp);
        let month_str = (date1.getMonth() + 1) < 10 ? ('0' + (date1.getMonth() + 1)) : (date1.getMonth() + 1).toString();
        let day_str = (date1.getDate()) < 10 ? ('0' + (date1.getDate())) : (date1.getDate()).toString();
        return cc.js.formatStr("%s-%s-%s", date1.getFullYear(), month_str, day_str)
    }

    static format_time_to_year_month_day_sec(timeStamp): string {
        let date1 = new Date(timeStamp);
        let month_str = (date1.getMonth() + 1) < 10 ? ('0' + (date1.getMonth() + 1)) : (date1.getMonth() + 1).toString();
        let day_str = (date1.getDate()) < 10 ? ('0' + (date1.getDate())) : (date1.getDate()).toString();
        let hour_str = (date1.getHours()) < 10 ? ('0' + (date1.getHours())) : (date1.getHours()).toString();
        let minutes_str = (date1.getMinutes()) < 10 ? ('0' + (date1.getMinutes())) : (date1.getMinutes()).toString();
        let second_str = (date1.getSeconds()) < 10 ? ('0' + (date1.getSeconds())) : (date1.getSeconds()).toString();
        return cc.js.formatStr("%s-%s-%s %s:%s:%s", date1.getFullYear(), month_str, day_str, hour_str, minutes_str, second_str)
    }

    static format_time_to_year_month_day_sec_without_symbol(timeStamp): string {
        let date1 = new Date(timeStamp);
        let month_str = (date1.getMonth() + 1) < 10 ? ('0' + (date1.getMonth() + 1)) : (date1.getMonth() + 1).toString();
        let day_str = (date1.getDate()) < 10 ? ('0' + (date1.getDate())) : (date1.getDate()).toString();
        let hour_str = (date1.getHours()) < 10 ? ('0' + (date1.getHours())) : (date1.getHours()).toString();
        let minutes_str = (date1.getMinutes()) < 10 ? ('0' + (date1.getMinutes())) : (date1.getMinutes()).toString();
        let second_str = (date1.getSeconds()) < 10 ? ('0' + (date1.getSeconds())) : (date1.getSeconds()).toString();
        return cc.js.formatStr("%s%s%s%s%s%s", date1.getFullYear(), month_str, day_str, hour_str, minutes_str, second_str)
    }

}