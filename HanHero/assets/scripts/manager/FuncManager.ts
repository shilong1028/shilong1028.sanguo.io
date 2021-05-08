/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:14:18
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 14:38:18
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


}
export var FunMgr = new FunManager();





