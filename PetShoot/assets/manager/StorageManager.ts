
//本地存储管理器
const {ccclass, property} = cc._decorator;

@ccclass
class StorageManager_class  {

    setItem(key:string, value:any) {
        cc.sys.localStorage.setItem(key, value);

        //SDKMgr.setUserCloudStorage(key, ""+value);
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

    getItemInt(key:string, defaultVal:number=0) : number{
        let val = cc.sys.localStorage.getItem(key);
        //console.log("getItemInt(), key = "+key+"; val = "+val+"; isNaN(val) = "+isNaN(val));
        if(isNaN(val) == true || val == null || val == undefined || val == ""){  
            val = defaultVal;
            this.setItem(key, defaultVal);
        }else{
            val = parseInt(val);
        }
        return val;
    }

    getItemFloat(key:string, defaultVal:number=0) : number{
        let val = cc.sys.localStorage.getItem(key);
        if(isNaN(val) == true || val == null || val == undefined || val == ""){  
            val = defaultVal;
            this.setItem(key, defaultVal);
        }else{
            val = parseFloat(val).toFixed(2);
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
        if(str == null || str == undefined || str == ""){
            return null;
        }
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return obj;
                }else{
                    return null;
                }
    
            } catch(e) {
                return null;
            }
        }
        return null;
    }
}
export  const LDMgr = new StorageManager_class();

export const LDKey = {
    KEY_UserName: "KEY_UserName",
    KEY_NewUser: "KEY_NewUser_0120",   //是否新用户
    KEY_Music_onOff: "KEY_Music_onOff",  //音乐或音效开关(开启)
    KEY_Music_Volume: "KEY_Music_Volume",     //本地音乐音量
    KEY_Sound_Volume: "KEY_Sound_Volume",   //本地音效音量

    KEY_GoldCount: "KEY_GoldCount",   //金币数量
    KEY_DiamondCount: "KEY_DiamondCount",   //钻石数量
    KEY_SignTime: "KEY_SignTime",   //当前签到索引和上一次签到时间
    KEY_LoginTime: "KEY_LoginTime",   //当天登录时间

    KEY_BallList: "KEY_BallList",  //未出战小球列表
    KEY_CurPlayerId: "KEY_CurPlayerId",    //当前使用炮索引
    KEY_PlayerList: "KEY_PlayerList",   //拥有的炮列表
    KEY_CurChapterId: "KEY_CurChapterId",   //当前章节id
    KEY_CurLevelId: "KEY_CurLevelId",   //当前通关的最大id
    KEY_LevelList: "KEY_LevelList",   //通关列表
    KEY_ItemList: "KEY_ItemList",   //背包列表
    KEY_GuideSteps: "KEY_GuideSteps",   //新手引导步骤"1000-1100-1200-..."

}
