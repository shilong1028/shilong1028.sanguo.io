
import { GameMgr } from "./GameManager";
import { ROOT_NODE } from "../common/rootNode";
import GuideLayer from "../common/GuideLayer";
import { MyUserDataMgr } from "./MyUserData";
import { CfgMgr, st_guide_info } from "./ConfigManager";


//新手引导
const { ccclass, property } = cc._decorator;

//新手引导步骤（已完成的，引导要下一步）
export enum GuideStepEnum{
    BeginGuide = 0,    //开始引导

    Fight_Guide_Step = 1000,  //战斗引导
    Fight_Guide_Step2 = 1001,  //左右拖动手指，改变发射轨迹。
    Fight_Guide_Step3 = 1002,  //选择新战斗技能，并继续下一关。

    FightSet_Guide_Step = 1100,  //点击信息按钮，查看技能或退出游戏。
    FightSet_Guide_Step2 = 1101,  //点击技能，查看战斗技能说明。

    Shop_Guide_Step = 1200,  //点击商店，购买武器或饰品。
    Shop_Guide_Step2 = 1201,  //消耗钻石50，获得武器或饰品（一定概率）

    Player_Guide_Step = 1300,  //点击萌宠，查看萌宝信息。
    Player_Guide_Step2 = 1301,  //给萌宠添加饰品，增加战斗金币或钻石产出。
    Player_Guide_Step3 = 1302,  //点击排序，让饰品按照品质高低排序。相同品质道具可以拖动升级至高品质。

    ItemUp_Guide_Step = 1400,    //点击页签切换背包道具显示。
    ItemUp_Guide_Step2 = 1401,  //拖动两个相同品质道具可以合成更高品质道具。
    ItemUp_Guide_Step3 = 1402,  //拖动物品至装备或饰品框，可以添加或更换道具。

    GudieOver = 9900,   //引导完毕
};


@ccclass
class GuideMgr_class { 
    guideStepSet: Map<number, boolean> = new Map<number, boolean>();    //已经完成的引导步骤集合
    tempGuideStepSet: Map<number, boolean> = new Map<number, boolean>();    //大步骤中小步骤完成的引导步骤集合

    curGuideStep: number = 0;    //当前正在进行的引导步骤

    init(){
        this.guideStepSet = new Map<number, boolean>();    //已经完成的引导步骤集合
        this.tempGuideStepSet = new Map<number, boolean>();    //大步骤中小步骤完成的引导步骤集合

        this.curGuideStep = 0;    //当前正在进行的引导步骤
    }

    /**新手引导界面
     * @param btn 新手需要点击的按钮节点
     * @param maskSpr 新手引导透明区域显示的纹理样式
     * @param callback 新手点击回调
     * @param arrowTarPos 箭头目标位置
     * @param offsetPos 手动偏移
     */
    showGuideLayer(btn:cc.Node, callback=null, btnSize = null, offsetPos=cc.Vec2.ZERO){
        let guideLayer = GameMgr.showLayer(ROOT_NODE.guidePrefab);
        guideLayer.zIndex = 10000;
        guideLayer.name = "Guide_Layer";

        let guideSc = guideLayer.getComponent(GuideLayer);
        if(guideSc){
            let maskSpr: cc.SpriteFrame = null;
            let worldPos = cc.v2(cc.winSize.width/2, cc.winSize.height/2);
            if(btn){
                worldPos = btn.parent.convertToWorldSpaceAR(cc.Vec2.ZERO);
                worldPos.x += btn.x;
                worldPos.y += btn.y;

                if(btnSize == null){
                    btnSize = btn.getContentSize();
                }

                let btnSpr = btn.getComponent(cc.Sprite);
                if(btnSpr){
                    maskSpr = btnSpr.spriteFrame;
                }
            }else{
                if(btnSize == null){
                    btnSize = cc.size(100, 100);
                }
            }
            guideSc.initGuideData(worldPos, maskSpr, callback, btnSize, offsetPos);
        }
        return guideLayer;
    }

    showGuideMoveLayer(beginPos, endPos, callback=null, btnSize = null, offsetPos=cc.Vec2.ZERO){
        let guideLayer = this.showGuideLayer(null, callback, btnSize, offsetPos);
        let guideSc = guideLayer.getComponent(GuideLayer);
        if(guideSc){
            guideSc.setMoveGuideData(beginPos, endPos);
        }
        return guideLayer;
    }

    /**手动移除引导层，只有在特殊情况下使用， 默认会自动删除 */
    removeGuideLayer(){
        let guideLayer = cc.director.getScene().getChildByName("Guide_Layer");
        if(guideLayer){
            guideLayer.removeFromParent(true);
        }
    }

    //检查新手引导并进行引导
    checkGuide_NewPlayer(step: GuideStepEnum, callback: any, target: any, bRemoveGuildeLayer:boolean=false){
        //cc.log("checkGuide_NewPlayer(), step = "+step+"; this.curGuideStep = "+this.curGuideStep);
        if(bRemoveGuildeLayer == true){   //手动移除引导层，只有在特殊情况下使用， 默认会自动删除
            this.removeGuideLayer();
        }
        if(step == GuideStepEnum.BeginGuide){
            step = GuideStepEnum.Fight_Guide_Step;
        }
        if(step == this.curGuideStep){  
            return false;
        }
        
        if(step %100 == 0){   //起始大步骤
            this.tempGuideStepSet = new Map<number, boolean>();    //大步骤中小步骤完成的引导步骤集合
        }
        
        if(this.checkGuideStepFinish(step) == true && this.checkContinueGuide(step) == false){  //检测大步骤是否已经执行完毕（关键步骤已走）&& 检测是否将该大步骤关键步骤后续小步骤走完
            return false;
        }else{
            if(this.checkPreStepFinish(step) == false){  //检测相同步骤的上一个小步骤是否执行
                return ;
            }
            this.curGuideStep = step;
            //cc.log("checkGuide_NewPlayer(), step = "+step)
            if(target && callback){
                callback.call(target, step);
            }

            return true;
        }
    }

    //结束新手引导并进行下一步
    endGuide_NewPlayer(step: GuideStepEnum){
        this.tempGuideStepSet[step] = true;

        if(this.checkKeyStep(step) > 0){
            MyUserDataMgr.updateGuideStepData(this.getFinishGuideStr());
        }
    }

    /**检测大步骤是否已经执行完毕（关键步骤已走） */
    checkGuideStepFinish(step: GuideStepEnum){
        let mainStep = Math.floor(step/100);
        if(this.guideStepSet[mainStep*100]){
            return true;
        }
        return false;
    }

    /**检测是否将该大步骤关键步骤后续小步骤走完 */
    checkContinueGuide(step: GuideStepEnum){
        if(this.curGuideStep > 0 && step > this.curGuideStep){
            let curMainStep = Math.floor(this.curGuideStep/100)
            let mainStep = Math.floor(step/100)

            if(curMainStep == mainStep){
                return true;
            }
        }

        return false
    }

    /**检测相同步骤的上一个小步骤是否执行 */
    checkPreStepFinish(step: GuideStepEnum){
        if(step%100 == 0){    //起始步骤
            return true;
        }else {
            if(step > this.curGuideStep){
                if(this.tempGuideStepSet[(step-1).toString()] == true){
                    if(Math.floor(step/100) == Math.floor((step-1)/100)){
                        return true;
                    }
                } 
            }
        }
        return false;
    }

    //检测关键步骤
    checkKeyStep(step: GuideStepEnum){
        let guideInfo: st_guide_info = CfgMgr.getGuideConf(step);
        if(guideInfo && guideInfo.key == 1){
            let mainStep = Math.floor(step/100);
            this.guideStepSet[mainStep*100] = true;
            return mainStep*100;
        }
        return 0;
    }

    /**当前所在步骤 */
    getCurKeyStep(){
        let n = 0;
        for(let key in this.guideStepSet){
            if (key && key.length == 4) {
                n = parseInt(key);
            }
        }
        return n/100;
    }

    /**完成的引导步骤（开始）字符串  "1000-1100-1200-..." */
    getFinishGuideStr(){
        let str = ""
        for(let key in this.guideStepSet){
            str += (key + "-");
        }
        return str;
    }

    /**设置完成的引导步骤（开始）字符串  "1000-1100-1200-..." */
    setFinishGuideStep(stepStr:string){
        this.guideStepSet = new Map<number, boolean>();    //已经完成的引导步骤集合

        if(stepStr && stepStr.length > 0){
            let sList = stepStr.split("-");
            for (let str of sList) {
                if (str && str.length == 4) {
                    let idx = parseInt(str);
                    this.guideStepSet[idx] = true;
                }
            }
        }
    }
    clearFinishGuideStep(){
        this.guideStepSet = new Map<number, boolean>();    //已经完成的引导步骤集合
    }
}

export var GuideMgr = new GuideMgr_class();
