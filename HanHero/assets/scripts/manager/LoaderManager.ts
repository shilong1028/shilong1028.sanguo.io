import LoginScene from '../login/loginScene';
import CapitalScene from '../hall/capitalScene';
import MapScene from '../map/mapScene';
import { ROOT_NODE } from '../login/rootNode';
import ComMaskBg from '../comui/comMaskBg';
import TipsDialog from '../comui/tipsDialog';
import GoldAdd from '../comui/goldAdd';
import LoadingLayer from '../comui/loadingLayer';
import RewardLayer from '../comui/rewardLayer';

/*
 * @Autor: dongsl
 * @Date: 2021-03-19 15:45:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-05 13:44:24
 * @Description: 
 */

//资源（场景）加载管理类

class LoaderManager {
    private static instance: LoaderManager = null;

    static getInstance(): LoaderManager {
        if (this.instance == null) this.instance = new LoaderManager();
        return <LoaderManager><any>(this.instance);
    }

    /**
     * 加载场景
     */
    loadScene(scenename: string, bShowLoading: boolean = true, callback?: Function) {
        switch (scenename) {
            case "loginScene":
                cc.director.loadScene(scenename, function (err, scene) {
                    cc.log("loginScene loaded");
                    if (err) {
                        return console.error(err);
                    }
                    //scene为场景总节点，其孩子有Canvas等节点，因此脚本绑定到Canvas节点上
                    let canvas = scene.getChildByName("Canvas")
                    if (canvas && !canvas.getComponent(LoginScene)) {
                        canvas.addComponent(LoginScene)
                    }
                });
                break;
            case "capitalScene":
                cc.assetManager.loadBundle('hall', (err, bundle) => {
                    if (err) {
                        return console.error(err);
                    }
                    this.goToSceneWithLoading(bundle, scenename, bShowLoading)
                });
                break;
            case "mapScene":
                cc.assetManager.loadBundle('map', (err, bundle) => {
                    if (err) {
                        return console.error(err);
                    }

                    cc.log("remove hall bundle");
                    let hall_bundle = cc.assetManager.getBundle('hall');
                    hall_bundle.releaseAll();   // 释放所有属于 Asset Bundle 的资源
                    cc.assetManager.removeBundle(hall_bundle);
                    //在移除 Asset Bundle 时，并不会释放该 bundle 中被加载过的资源。如果需要释放，请先使用 Asset Bundle 的 release / releaseAll 方法

                    this.goToSceneWithLoading(bundle, scenename, bShowLoading)
                });
                break;
            default:

        }
    }

    /**
    * 预加载场景 
    */
    preloadScene(scenename: string) {
        switch (scenename) {
            case "loginScene":
                cc.director.preloadScene(scenename, function (err, scene) {
                    cc.log("scene preloaded : " + scenename);
                    if (err) {
                        return console.error(err);
                    }
                });
                break;
            case "capitalScene":
                cc.assetManager.loadBundle('hall', (err, bundle) => {
                    cc.log("hall bundle loaded");
                    if (err) {
                        return console.error(err);
                    }
                    bundle.preloadScene(scenename, function (err, scene_asset) {
                        cc.log("capitalScene preloaded");
                        if (err) {
                            return console.error(err);
                        }
                    });
                });
                break;
            case "mapScene":
                break;
            default:

        }
    }

    /**
     * 场景切换，显示进度条
     * @param bundle 
     * @param scenename 
     * @param bShowLoading 
     */
    goToSceneWithLoading(bundle: cc.AssetManager.Bundle, scenename: string, bShowLoading: boolean = true) {
        cc.log("goToSceneWithLoading(), scenename = " + scenename);
        bundle.loadScene(scenename, (err, scene_asset) => {
            cc.log("scene loaded : " + scenename);
            if (err) {
                return console.error(err);
            }

            if (bShowLoading) {
                let layer = LoaderMgr.showLayer(ROOT_NODE.pfLoading);
                layer.zIndex = cc.macro.MAX_ZINDEX - 10;
                layer.opacity = 255;
                var loading = layer.getComponent(LoadingLayer);
                if (!loading) {
                    loading = layer.addComponent(LoadingLayer);
                }
                loading.goToScene(scenename);

                bundle.preloadScene(scenename, (finish, total, item) => {
                    cc.log("scene preloaded : " + scenename + "; finish = " + finish + "; total = " + total);
                    if (err) {
                        return console.error(err);
                    }
                    loading.onProgress(finish, total);
                }, (err) => {  //加载完成的回调
                    if (err) {
                        return console.error(err);
                    }
                    loading.loadFinish(err, () => {
                        cc.director.runScene(scene_asset, () => {
                            cc.log("scene onBeforeLoadScene : " + scenename);
                        }, (err, scene) => {
                            cc.log("scene onLaunched : " + scenename);
                            this.handleSceneScriptInit(scene, scenename)
                        });
                    });
                });
            } else {
                cc.director.runScene(scene_asset, () => {
                    cc.log("scene onBeforeLoadScene : " + scenename);
                }, (err, scene) => {
                    cc.log("scene onLaunched : " + scenename);
                    this.handleSceneScriptInit(scene, scenename)
                });
            }
        });
    }

    /**
     * 场景资源加载完毕后，初始化绑定场景脚本
     * @param scene 
     * @param scenename 
     */
    handleSceneScriptInit(scene: cc.Scene, scenename: string) {
        cc.log("handleSceneScriptInit(), scenename = " + scenename);
        //scene为场景总节点，其孩子有Canvas等节点，因此脚本绑定到Canvas节点上
        let canvas = scene.getChildByName("Canvas")
        switch (scenename) {
            case "capitalScene":
                if (canvas && !canvas.getComponent(CapitalScene)) {
                    canvas.addComponent(CapitalScene)
                }
                break;
            case "mapScene":
                if (canvas && !canvas.getComponent(MapScene)) {
                    canvas.addComponent(MapScene)
                }
                break;
            default:
        }
    }

    /**
     * AssetBundle.load加载资源通用接口
     * @param bundlename 名称 
     * @param path 资源路径 
     * @param type 资源类型 
     * @param onComplete 完成回调 
     * @returns 
     */
    bundle_load(bundlename: string, filepath: string, type: typeof cc.Asset, onComplete?: Function) {
        var bundle = cc.assetManager.getBundle(bundlename);
        if (!bundle) {
            cc.log("bundle is not exist, bundlename = " + bundlename)
            return
        }
        bundle.load(filepath, type, (err, assets) => {
            if (err) {
                cc.log(err + "; filepath = " + filepath);
                return;
            }
            if (onComplete) {
                onComplete(err, assets)
            }
        });
    }

    /**
    * 在公用目录resources中加载单张图标初始化精灵纹理
    */
    setSpriteFrameByImg(path: string, sprnode: cc.Node, callback?: Function) {
        cc.resources.load(path, cc.SpriteFrame, function (err, asset:any) {
            sprnode.getComponent(cc.Sprite).spriteFrame = asset;
            if (callback) {
                callback(sprnode);
            }
        });
    }

    /**
    * 在AssetBundle中加载单张图标初始化精灵纹理
    */
    setBundleSpriteFrameByImg(bundlename: string, path: string, sprnode: cc.Node, callback?: Function) {
        cc.log("setBundleSpriteFrameByImg bundlename = "+bundlename+"; path = "+path)
        let bundle = cc.assetManager.getBundle(bundlename);
        if(bundle){
            bundle.load(path, cc.SpriteFrame, function (err, asset:any) {
                sprnode.getComponent(cc.Sprite).spriteFrame = asset;
                if (callback) {
                    callback(sprnode);
                }
            });
        }
    }



    //-------------------  以下为各种界面展示接口 ---------------------------------------

    /**
     * 显示AssetBundle中的子界面
     * @param bundlename 名称 
     * @param prefab_path 预制体路径 
     * @param parent 父节点 
     * @param callback 完成回调 
     */
    showBundleLayer(bundlename: string, prefab_path: string,  parent?: cc.Node, callback?: Function) {
        cc.log("showBundleLayer bundlename = "+bundlename+"; prefab_path = "+prefab_path)
        let bundle1 = cc.assetManager.getBundle(bundlename);
        if(bundle1){
            bundle1.load(prefab_path, cc.Prefab, function (err, prefab:any) {
                if (err) {
                    return console.error(err);
                }
                let layer = LoaderMgr.showLayer(prefab, parent)
                if(callback && layer){
                    callback(layer)
                }
            });
        }else{
            cc.assetManager.loadBundle(bundlename, (err, bundle) => {
                if (err) {
                    return console.error(err);
                }
                bundle.load(prefab_path, cc.Prefab, function (err, prefab:any) {
                    if (err) {
                        return console.error(err);
                    }
                    let layer = LoaderMgr.showLayer(prefab, parent)
                    if(callback && layer){
                        callback(layer)
                    }
                });
            });
        }
    }

    /**
    * 显示子层 
    */
    showLayer(prefab: cc.Prefab, parent?: cc.Node) {
        let layer = null
        if(parent){
            layer = parent.getChildByName(prefab.name);
        }else{
            layer = cc.director.getScene().getChildByName(prefab.name);
        }
        if (layer) {
            cc.log("已经存在界面 " + prefab.name)
            return null;
        }

        let maskBg_tsComp: ComMaskBg = null
        if (!parent) {
            let scene = cc.director.getScene();
            parent = cc.instantiate(ROOT_NODE.pfComMaskBg);
            parent.name = prefab.name;
            parent.width = cc.winSize.width;
            parent.height = cc.winSize.height;
            parent.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
            let bg = parent.getChildByName("bg");
            if (bg) {
                bg.width = cc.winSize.width;
                bg.height = cc.winSize.height;
            }
            maskBg_tsComp = parent.getComponent(ComMaskBg)
            if(!maskBg_tsComp){
                maskBg_tsComp = parent.addComponent(ComMaskBg)
            }
            scene.addChild(parent)
        }

        layer = cc.instantiate(prefab);
        layer.name = prefab.name;
        layer.setPosition(cc.v2(0, 0));
        if(maskBg_tsComp){
            //当node的active发生变化时触发，但是目前这个事件 并没有在 Node.EventType 里定义
            layer.on('active-in-hierarchy-changed', ()=>{
                cc.log("active-in-hierarchy-changed prefab.name = "+prefab.name)
                //销毁节点并不会立刻发生，而是在当前 帧逻辑更新结束后，统一执行。当一个节点销毁后，该节点就处于无效状态，可以通过 cc.isValid 判断 当前节点是否已经被销毁。
                if(!cc.isValid(layer) || layer.active != true){  //注意发现子节点destroy之后active=false,但是'active-in-hierarchy-changed'监听时并未销毁，而是在之后销毁
                    cc.log("maskBg_tsComp.closeLayer")
                    maskBg_tsComp.closeLayer(true);  //强制移除遮罩
                }
            })
        }
        parent.addChild(layer);
        return layer;
    }

    /** 
    * 获取金币提示框
    */
    showGoldAddDialog() {
        let layer = this.showLayer(ROOT_NODE.pfGoldAdd);
        if(layer){
            let tsComp = layer.getComponent(GoldAdd)
            if(!tsComp){
                tsComp = layer.addComponent(GoldAdd)
            }
        }
    }

    /** 
    * 通用提示框
    */
    showTipsDialog(tipStr: string, okCallback?: Function, cancelCall?: Function) {
        let layer = this.showLayer(ROOT_NODE.pfTipsDialog);
        if(layer){
            let tsComp = layer.getComponent(TipsDialog)
            if(!tsComp){
                tsComp = layer.addComponent(TipsDialog)
            }
            tsComp.setTipStr(tipStr, okCallback, cancelCall);
        }
    }

    /** 
    * 显示通用奖励提示框
    */
    showRewardLayer(rewards: any, title?: string, callback?: Function) {
        cc.log("LoaderMgr.showRewardLayer rewards = "+JSON.stringify(rewards))
        let layer = this.showLayer(ROOT_NODE.pfReward);
        if(layer){
            let tsComp = layer.getComponent(RewardLayer)
            if(!tsComp){
                tsComp = layer.addComponent(RewardLayer)
            }
            tsComp.showRewardList(rewards, title, callback);
            return layer;
        }
    }




}


export var LoaderMgr = new LoaderManager();
