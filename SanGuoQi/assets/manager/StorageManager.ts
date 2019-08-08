
//本地存储管理器
const {ccclass, property} = cc._decorator;

@ccclass
class StorageManager_class  {

    setItem(key:string, value:any) {
        cc.sys.localStorage.setItem(key, value);
    }

    getItem(key:string) : string{
        let val = cc.sys.localStorage.getItem(key);
        if(val == null || val == undefined){
            val = "";
        }
        return val;
    }

    getItemKeyVal(key: string){
        let val = cc.sys.localStorage.getItem(key);
        if(val == null || val == undefined){
            val = null;
        }else{
            let sL = val.toString().split("-");
            if (sL[0] && sL[1]) {
                val = {"key":sL[0], "val":parseInt(sL[1])};
            }else{
                val = null;
            }
        }

        return val;
    }

    getItemInt(key:string) : number{
        let val = cc.sys.localStorage.getItem(key);
        if(isNaN(val) == true || val == null || val == undefined){  
            val = 0;
            this.setItem(key, 0);
        }else{
            val = parseInt(val);
        }
        return val;
    }

    /**解析字符串，获取整形数组 */
	getItemIntAry(key: string, sp: string = "|"): Array<number> {
        let ret: Array<number> = [];
        let str = cc.sys.localStorage.getItem(key);
        if(str && str.length > 0){
            let sL = str.toString().split(sp);
            for (let p of sL) {
                if (p.length > 0) {
                    ret.push(parseInt(p));
                }
            }
        }
		return ret;
    }

    setItemBool(key:string, value: boolean){
        if(value == true){
            this.setItem(key, 1);
        }else{
            this.setItem(key, 0);
        }
    }

    getItemBool(key: string): boolean{
        if(this.getItemInt(key)==1){
            return true;
        }
        return false;
    }

    //检查一个string是否为Json并返回string或json对象
    getJsonItem(key: string) {
        let str = cc.sys.localStorage.getItem(key);
        //cc.log("getJsonItem(), str = "+str);
        if(str == null || str == undefined || str == ""){
            return null;
        }
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return obj;
                }else{
                    cc.log('It is not a json!')
                    return null;
                }
    
            } catch(e) {
                console.log('error：'+str+'!!!'+e);
                return null;
            }
        }
        cc.log('It is not a string!')
        return null;
    }
}
export  const LDMgr = new StorageManager_class();

export const LDKey = {
    KEY_GoldCount: "KEY_GoldCount",   //金币数量
    KEY_DiamondCount: "KEY_DiamondCount",//钻石（金锭）数量
    KEY_FoodCount: "KEY_FoodCount",   //粮食数量
    KEY_RoleLv: "KEY_RoleLv",   //主角等级
    KEY_Offical: "KEY_Offical",   //主角官职
    KEY_CapitalLv: "KEY_CapitalLv",  //主城等级
    KEY_StoryData : "KEY_StoryData",  //当前进行的剧情故事  {key=id, val=state}  0未完成，1完成未领取，2已领取
    KEY_ItemList: "KEY_ItemList",     //背包道具列表
    KEY_GeneralList: "KEY_GeneralList",     //武将列表
    KEY_MyCityIds: "KEY_MyCityIds",     //己方占领的城池ID集合（晋封太守后获得一个城池，开启主城后可以有管辖城池集合）
    KEY_RuleCityIds: "KEY_RuleCityIds",     //己方统治下未被占领或叛乱的城池ID集合

}
