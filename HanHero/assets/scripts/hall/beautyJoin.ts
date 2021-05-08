
import ComMaskBg from '../comui/comMaskBg';
import { CfgMgr, st_beautiful_info } from '../manager/ConfigManager';
import { LoaderMgr } from '../manager/LoaderManager';
import UI from '../util/ui';

//新纳美姬
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("Hall/beautyJoin")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class BeautyJoin extends cc.Component {

    viewImg: cc.Node = null;
    descLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    receiveCallback: any = null;    //领取回调

    onLoad () {
        this.viewImg = UI.find(this.node, "viewImg")
        this.descLabel = UI.find(this.node, "descLabel").getComponent(cc.Label)
        this.descLabel.string = "";
    }

    onDestroy(){
        cc.log("BeautyJoin.onDestroy")
        //this.node.targetOff(this);
        //NoticeMgr.offAll(this);
    }

    start () {
        let maskBg_tsComp = this.node.parent.getComponent(ComMaskBg)
        if(maskBg_tsComp){
            maskBg_tsComp.showCloseCallback(()=>{
                this.closeLayer();
            })   //设置关闭时，子节点（功能节点）的关闭逻辑处理
        }
    }

    // update (dt) {}

    closeLayer(){
        if(this.receiveCallback){
            this.receiveCallback();
        }
        this.receiveCallback = null;

        this.node.destroy();
    }

    /**初始化美姬 */
    initBeautyById(beautyId: number, callback?: any){
        cc.log("initBeautyById(), beautyId = "+beautyId);
        this.receiveCallback = callback;

        LoaderMgr.setBundleSpriteFrameByImg("hall", "res/beauty/"+beautyId, this.viewImg);

        let beauty_conf: st_beautiful_info = CfgMgr.getBeautifulConf(beautyId)
        if(beauty_conf){
            this.descLabel.string = beauty_conf.desc;
        }
    } 
}
