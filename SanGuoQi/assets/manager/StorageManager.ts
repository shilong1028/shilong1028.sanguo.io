
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
        if(isNaN(val) == true){  
            val = 0;
            this.setItem(key, 0);
        }else{
            val = parseInt(val);
        }
        return val;
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
        cc.log("getJsonItem(), str = "+str);
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
    KEY_DiamondCount: "KEY_GoldCount",//钻石（金锭）数量
    KEY_FoodCount: "KEY_GoldCount",   //粮食数量
    KEY_StoryData : "KEY_StoryData",  //当前进行的剧情故事  {key=id, val=state}  0未完成，1完成未领取，2已领取
    KEY_ItemList: "KEY_ItemList",     //背包道具列表

}
