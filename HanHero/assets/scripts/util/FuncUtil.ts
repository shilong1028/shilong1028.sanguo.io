
import { ItemInfo } from "../manager/ConfigManager";

/*
 * @Autor: dongsl
 * @Date: 2021-03-19 17:01:47
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 15:10:53
 * @Description: 
 */

//公用方法接口类
export default class FuncUtil {

    /**
     * 通过配置keyVal数据砖块道具列表
     */
    static getItemArrByKeyVal(rewards: any[]): Array<ItemInfo> {
        //cc.log("getItemArrByKeyVal(), rewards = "+JSON.stringify(rewards));
        let rewardArr: ItemInfo[] = [];
        for (let i = 0; i < rewards.length; ++i) {
            let itemId = parseInt(rewards[i].key);
            let count = rewards[i].val;
            let item = new ItemInfo(itemId, count);
            rewardArr.push(item);
        }
        return rewardArr;
    }



}
