/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:14:18
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-06 10:52:41
 * @Description: 
 */


//常量或类定义
class FunManager {
    //----------------------------------  公用方法接口  -------------------------------------------
    /**对象深拷贝 */
    ObjClone(obj) {
        let objStr = JSON.stringify(this);
        let temp = JSON.parse(objStr);
        return temp;
    }

    //配置中有效的string字段是否有效
    checkConfStrVal(str) {
        if (!str || str == "" || str == "0") {
            return false;
        } else {
            return true;
        }
    }

    /**二维坐标转三维 */
    v2Tov3(pos: cc.Vec2) {
        return cc.v3(pos.x, pos.y, 0);
    }

    /**三维坐标转二维 */
    v3Tov2(pos: cc.Vec3) {
        return cc.v2(pos.x, pos.y);
    }

    /**数值转进度0.0-1.0 */
    num2progess(num: number) {
        if (num < 0) {
            return 0;
        } else if (num > 1.0) {
            return 1.0;
        }
        return num;
    }

    /**数字科学显示 KMBT... 
     * @param num 要转换的数字
     * @param fixNum 小数点有效位数
    */
    num2e(num: number, fixNum: number = 4) {
        if (num <= 1000000) {
            return num.toString();
        } else {
            //将数值用parseFloat(num).Fixed(8)保留固定位数，但有个缺点，就是如果数值小于8位的，则会多出余数0，如:0.00000010
            //E是指数的意思，比如7.823E5=782300 这里E5表示10的5次方
            var p = Math.floor(Math.log(num) / Math.LN10);   //p是10的几次方
            var n = num * Math.pow(10, -p);   //n为最终显示的小数

            let factor = Math.pow(10, fixNum);
            if (p < 6) {
                return num.toString();
            } else if (p < 9) {
                n = n * Math.pow(10, (p - 6));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "万";
            } else if (p < 12) {
                n = n * Math.pow(10, (p - 9));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "十万";
            } else if (p < 15) {
                n = n * Math.pow(10, (p - 12));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "百万";
            } else if (p < 18) {
                n = n * Math.pow(10, (p - 15));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "千万";
            } else {
                n = n * Math.pow(10, (p - 18));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "亿";
            }
        }
    }
    num2e2(num: number, fixNum: number = 2) {
        if (num <= 1000) {
            return num.toString();
        } else {
            //将数值用parseFloat(num).Fixed(8)保留固定位数，但有个缺点，就是如果数值小于8位的，则会多出余数0，如:0.00000010
            //E是指数的意思，比如7.823E5=782300 这里E5表示10的5次方
            var p = Math.floor(Math.log(num) / Math.LN10);   //p是10的几次方
            var n = num * Math.pow(10, -p);   //n为最终显示的小数

            let factor = Math.pow(10, fixNum);
            if (p < 3) {
                return num.toString();
            } else if (p < 6) {
                n = n * Math.pow(10, (p - 3));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "K";
            } else if (p < 9) {
                n = n * Math.pow(10, (p - 6));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "M";
            } else if (p < 12) {
                n = n * Math.pow(10, (p - 9));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "B";
            } else if (p < 15) {
                n = n * Math.pow(10, (p - 12));
                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                return nStr + "T";
            } else {
                let pp = p - 15;
                //var alphabet= String.fromCharCode(64 + parseInt(填写数字);  A-65， Z-90, a-97, z-122
                for (let i = 0; i < 26; ++i) {
                    let firstChar = String.fromCharCode(97 + i);
                    if (pp >= 26 * 3) {   //78
                        pp -= 26 * 3;
                    } else {
                        let ppp = pp / 3;
                        let last_j = 0;
                        for (let j = 0; j < 26; ++j) {
                            if (ppp >= j) {
                                last_j = j;
                            } else {
                                let secondChar = String.fromCharCode(97 + last_j);
                                n = n * Math.pow(10, (pp % 3));
                                let nStr = (Math.floor(n * factor) / factor).toFixed(fixNum);
                                return nStr + firstChar + secondChar;
                            }
                        }
                    }

                }
            }
        }
    }

    /**判定给定时间和现在是否同一天 */
    isSameDayWithCurTime(lastTime: number) {
        if (lastTime < 10000) {
            return false;
        }
        let curDate = new Date();
        let curDay = curDate.getDay();
        let curMonth = curDate.getMonth();

        let lastDate = new Date();
        lastDate.setTime(lastTime);
        let lastDay = lastDate.getDay();
        let lastMonth = lastDate.getMonth();

        //console.log("lastTime = "+lastTime+"; lastDay = "+lastDay+"; lastMonth = "+lastMonth+"; curDay = "+curDay+"; curMonth = "+curMonth)

        if (curMonth == lastMonth && curDay == lastDay) {
            return true;
        } else {
            return false;
        }
    }

    /**解析字符串，获取整形区间数组 */
    getIntRegionAry(str: string, sp: string = "-"): Array<number> {
        let ret: Array<number> = [];
        if (str == "" || str == "0") {
            return ret;
        }
        let sL = str.toString().split(sp);
        if (sL[0]) {
            let beginId = parseInt(sL[0]);
            ret.push(beginId);
            if (sL[1]) {
                let endId = parseInt(sL[1]);
                for (let id = beginId + 1; id <= endId; id++) {
                    ret.push(id);
                }
            }
        }
        return ret;
    }

    /**解析字符串，获取整形数组 */
    getIntAry(str: string, sp: string = ";"): Array<number> {
        let ret: Array<number> = [];
        if (str == "" || str == "0") {
            return ret;
        }
        let sL = str.toString().split(sp);
        for (let p of sL) {
            if (p.length > 0) {
                ret.push(parseInt(p));
            }
        }
        return ret;
    }

    /**解析复杂的字符串，获取整形数组 */
    getKeyValAry(str: string, sp: string = ";", sp2: string = "-"): Array<any> {
        let ret: Array<any> = [];
        if (str == "" || str == "0") {
            return ret;
        }
        let sL = str.toString().split(sp);
        for (let p of sL) {
            if (p.length > 0) {
                let ss = p.toString().split(sp2);
                if (ss[0] && ss[1]) {
                    ret.push({ "key": ss[0], "val": parseInt(ss[1]) });
                }
            }
        }
        return ret;
    }

    /**解析字符串，获取字符串数组 */
    getStringAry(str: string, sp: string = ";"): Array<string> {
        let ret: Array<string> = [];
        if (str == "" || str == "0") {
            return ret;
        }
        let sL = str.toString().split(sp);
        for (let p of sL) {
            if (p.length > 0) {
                ret.push(p);
            }
        }
        return ret;
    }


    /**
     * 深拷贝对象
     * @param obj [] or {}
     */
    clone(obj: Array<any> | Object) {
        if (!obj) return obj;
        var new_obj = obj.constructor === Array ? [] : {}
        if (typeof obj !== 'object') {
            return
        } else {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    new_obj[i] = typeof obj[i] === 'object' ? this.clone(obj[i]) : obj[i]
                }
            }
        }
        return new_obj
    }

    /**合并对象 */
    merge(dest, src) {
        if (!src) return dest;
        if (!dest) {
            dest = Object.create(null)
        }

        if (src.hasOwnProperty) {//外层判断，性能更好//
            for (const key in src) {
                if (src.hasOwnProperty(key)) {
                    dest[key] = src[key]
                }
            }
        }
        else {
            for (const key in src) {
                dest[key] = src[key]
            }
        }
        return dest
    }

    /**
     * %d天%d小时 是符合规范的，但%d小时%2d分%d秒是不合法的--
     * precision:精度，保留几位精度。如果1，则结果为: xx天 或者 xx小时 或者 xx分钟
     * 如果为2则为 xx天xx小时,xx小时xx分钟,xx分钟
     * format_style:example %d天%d小时%2d分%d秒,且这个字符串能省略后面的但不能省略前面的。
     * first_field: 第一位时间("day","hour","min","sec"之一),为0时也显示
     */
    format_time(seconds: number, format_style: string, precision?: number, first_field?: string, bShowDay: boolean = true): string {
        if (!precision) {
            precision = 1
        }
        if (!first_field) {
            first_field = "sec"
        }
        let time_date = this.convert_time(seconds, bShowDay)
        let format_array = format_style.split("%")
        let field_count = format_array.length - 1
        field_count = Math.min(field_count, 4) //天 时 分 秒,最多四位

        let str_time = ""
        let concat_count = 0
        let date = ["day", "hour", "min", "sec"]
        let time_field
        for (let index = 0; index < date.length; index++) {
            if (concat_count >= precision) {
                break
            }
            time_field = date[index]
            if ((time_date[time_field] > 0 || concat_count > 0 || first_field == time_field) && index + 1 <= field_count) {
                concat_count++
                str_time = str_time + this.format_int_number_fix_width("%" + format_array[index + 1], time_date[time_field])
            }
        }
        return str_time
    }

    /**
     * 毫秒数时间转换为xxxx-xx-xx xx:xx:xx格式
     * @param seconds 转换时间毫秒数
     * @param format 要转换的格式 'yyyy-MM-dd HH:mm:ss'
     */
    seconds_to_date(seconds: number, format: string) {

        let t = seconds ? new Date(seconds) : new Date();
        let tf = function (i) {
            return (i < 10 ? '0' : '') + i
        }
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear())
                case 'MM':
                    return tf(t.getMonth() + 1)
                case 'mm':
                    return tf(t.getMinutes())
                case 'dd':
                    return tf(t.getDate())
                case 'HH':
                    return tf(t.getHours())
                case 'ss':
                    return tf(t.getSeconds())
            }
        })
    }

    /**
     * 转换时间,把以秒表示的时间转化为{day=xx,hour=xx,minute=xx,second=xx}的形式
     */
    convert_time(seconds: number, bShowDay: boolean = true) {
        let date = { day: 0, hour: 0, min: 0, sec: 0 }
        if (seconds < 0) {
            return date
        }
        date.sec = seconds % 60

        seconds = (seconds - date.sec) / 60
        date.min = seconds % 60

        seconds = (seconds - date.min) / 60
        if (bShowDay) {
            date.hour = seconds % 24
            date.day = (seconds - date.hour) / 24
        } else {
            date.hour = seconds
        }
        return date
    }

    /**
     * 格式化整数数字显示为固定宽度,例如%02d效果相同
     */
    format_int_number_fix_width(format: string, num: number) {
        // if (format == "%d")
        // {
        //     return num.toString()
        // }
        let reg = new RegExp("([\\s\\S]*)%([\\d]*)d([\\s\\S]*)$", "g")
        let result: RegExpExecArray = reg.exec(format)
        if (!result) {
            return format
        }
        let width = Number(result[2])
        let len = num.toString().length
        if (len < width) {
            return result[1] + new Array(width - len + 1).join("0") + num + result[3]
        }
        return result[1] + num.toString() + result[3]
    }

    /**
     * 返回英式数字格式（三个数字+逗号）
     * @param num_str 
     * @returns 
     */
    dealToEnNum(num_str: string): string {
        //将100000转为100,000.00形式
        let left = num_str.split('.')[0]
        // let right = num_str.split('.')[1];
        // right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
        let temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
        //num_str = (Number(num_str) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
        num_str = temp.join(',').split('').reverse().join('')

        return num_str
    }


    static trackback() {
        let caller = this.arguments.callee.caller
        let i = 0
        console.log("-------------------------------------------------------------------------------")
        while (caller && i < 10) {
            console.log(caller.toString())
            caller = caller.caller
            i++
        }
        console.log("-------------------------------------------------------------------------------")
    }

}
export var FunMgr = new FunManager();





