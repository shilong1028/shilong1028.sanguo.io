import OfficalCell from "../comui/offical";
import List from "../control/List";
import { AudioMgr } from "../manager/AudioMgr";
import { CfgMgr, st_official_info } from "../manager/ConfigManager";
import { MyUserMgr } from "../manager/MyUserData";


//官职详情
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Hall/officalLayer")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class OfficalLayer extends cc.Component {

    @property(List)
    list: List = null;

    @property(cc.Label)
    descLabel: cc.Label = null;
    @property(cc.Label)
    titleLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    officalArr: st_official_info[] = [];
    showOfficalIds: number[] = [];   //当前显示的官职ID集合

    receiveCallback: any = null;    //领取回调

    onLoad () {
        this.list.numItems = 0;
        this.descLabel.string = "";
    }

    onDestroy(){
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {
    }

    // update (dt) {}

    onCloseBtn(){
        AudioMgr.playBtnClickEffect();
        this.closeLayer();
    }

    closeLayer(){
        if(this.receiveCallback){
            this.receiveCallback();
        }
        this.receiveCallback = null;

        this.node.destroy();
    }

    /**初始化官职列表 */
    initOfficalByIds(idArr: number[], bSave:boolean=false, callback?: any){
        //cc.log("initOfficalByIds(), idArr = "+JSON.stringify(idArr));
        this.receiveCallback = callback;
        this.showOfficalIds = idArr   //当前显示的官职ID集合
        if(idArr.length > 0){
            this.titleLabel.string = "加官进爵"
            if(bSave){
                MyUserMgr.updateOfficalIds(idArr);  //更新主角官职（可身兼数职）
            }
        }else{
            this.titleLabel.string = "官职详情"
        }
        
        //let allConf = CfgMgr.getAllOfficalConf();
        //allConf.forEach(function(conf, key){
        let showIdx = 0;   
        let keys = Object.getOwnPropertyNames(CfgMgr.C_official_info);
        //cc.log("getOwnPropertyNames, keys = "+JSON.stringify(keys));
        //for (let key of keys) {   
        for (let k=0; k<keys.length; k++) {  
            let conf = CfgMgr.getOfficalConf(keys[k]);
            this.officalArr.push(conf)
            for(let i=0; i<idArr.length; i++){
                if(conf.id_str == idArr[i].toString()){
                    showIdx = k
                }
            }
　　　　 };

        this.list.numItems = this.officalArr.length;

        this.list.scrollTo(showIdx);
        let showConf = this.officalArr[showIdx];
        if(showConf){
            this.descLabel.string = showConf.desc;
        }else{
            this.descLabel.string = "";
        }
    }

    //列表渲染器
    onListRender(item: cc.Node, idx: number) {
        let info = this.officalArr[idx];
        item.getComponent(OfficalCell).initOfficalData(info, (cell)=>{
            let showConf = cell.officalConf;
            if(showConf){
                this.descLabel.string = showConf.desc;
            }else{
                this.descLabel.string = "";
            }
        }, this.showOfficalIds);
    }
    
}
