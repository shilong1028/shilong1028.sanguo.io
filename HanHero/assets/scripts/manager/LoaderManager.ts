import LoginScene from '../login/loginScene';
import CapitalScene from '../hall/capitalScene';
import MapScene from '../map/mapScene';
import { ROOT_NODE } from '../login/rootNode';
import ComMaskBg from '../comui/comMaskBg';
import TipsDialog from '../comui/tipsDialog';
import GoldAdd from '../comui/goldAdd';
import LoadingLayer from '../comui/loadingLayer';
import RewardLayer from '../comui/rewardLayer';
import ComTop from '../comnode/comTop';

/*
 * @Autor: dongsl
 * @Date: 2021-03-19 15:45:18
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-12 13:56:23
 * @Description: 加载管理器，负责场景、界面、资源的加载及引用
 */

//资源（场景）加载管理类

class LoaderManager {
    private static instance: LoaderManager = null;

    static getInstance(): LoaderManager {
        if (this.instance == null) this.instance = new LoaderManager();
        return <LoaderManager><any>(this.instance);
    }

    /**过渡场景 */
    transitionScene(sceneName: string, material_name: string = "crop-circle", onLoadSceneFinish: Function = null) {
        cc.log("LoaderMgr.transitionScene sceneName = " + sceneName + "; material_name = " + material_name)
        switch (sceneName) {
            case "capitalScene":
            case "mapScene":
                ROOT_NODE.transitionScene(sceneName, 'Canvas/Main Camera', 'Canvas/Main Camera', onLoadSceneFinish, material_name)
                break;
            default:
                LoaderMgr.loadScene(sceneName, true, onLoadSceneFinish);
        }
    }

    /**移除指定的Bundle资源 */
    removeBundleAllRes(bundle_name: string) {
        cc.log("removeBundleAllRes 移除指定的Bundle资源 bundle_name = " + bundle_name)
        let temp_bundle = cc.assetManager.getBundle(bundle_name);
        if (temp_bundle) {
            temp_bundle.releaseAll();   // 释放所有属于 Asset Bundle 的资源
            cc.assetManager.removeBundle(temp_bundle);
            //在移除 Asset Bundle 时，并不会释放该 bundle 中被加载过的资源。如果需要释放，请先使用 Asset Bundle 的 release / releaseAll 方法
        }
    }

    /**
     * 加载场景
     */
    loadScene(scenename: string, bShowLoading: boolean = true, callback?: Function) {
        switch (scenename) {
            case "loginScene":
                cc.director.loadScene(scenename, function (err, scene) {
                    if (err) {
                        return console.error(err);
                    }
                    //scene为场景总节点，其孩子有Canvas等节点，因此脚本绑定到Canvas节点上
                    let canvas = scene.getChildByName("Canvas")
                    if (canvas && !canvas.getComponent(LoginScene)) {
                        canvas.addComponent(LoginScene)
                    }

                    if (callback) {
                        callback()
                    }
                });
                break;
            case "capitalScene":
                cc.assetManager.loadBundle('hall', (err, bundle) => {
                    if (err) {
                        return console.error(err);
                    }
                    cc.log("remove map bundle");
                    LoaderMgr.removeBundleAllRes('map');   //移除指定的Bundle资源
                    this.goToSceneWithLoading(bundle, scenename, bShowLoading, callback)
                });
                break;
            case "mapScene":
                cc.assetManager.loadBundle('map', (err, bundle) => {
                    if (err) {
                        return console.error(err);
                    }
                    // cc.log("remove hall bundle");
                    // LoaderMgr.removeBundleAllRes('hall');   //移除指定的Bundle资源
                    this.goToSceneWithLoading(bundle, scenename, bShowLoading, callback)
                });
                break;
            default:
                return false;
        }
        return true;
    }

    /**
     * 场景切换，显示进度条
     * @param bundle 
     * @param scenename 
     * @param bShowLoading 
     */
    goToSceneWithLoading(bundle: cc.AssetManager.Bundle, scenename: string, bShowLoading: boolean = true, callback?: Function) {
        bundle.loadScene(scenename, (err, scene_asset) => {
            cc.log("goToSceneWithLoading scene loaded : " + scenename + "; bundle = " + bundle);
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
                    //cc.log("scene preloaded : " + scenename + "; finish = " + finish + "; total = " + total);
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
                            //cc.log("scene onBeforeLoadScene : " + scenename);
                        }, (err, scene) => {
                            //cc.log("scene onLaunched : " + scenename);
                            this.handleSceneScriptInit(scene, scenename)
                        });
                    });
                });
            } else {
                cc.director.runScene(scene_asset, () => {
                    //cc.log("runScene scene onBeforeLoadScene : " + scenename);
                }, (err, scene) => {
                    cc.log("runScene scene onLaunched : " + scenename);
                    this.handleSceneScriptInit(scene, scenename)

                    if (callback) {
                        callback();
                    }
                });
            }
        });
    }

    /**
    * 预加载场景 
    */
    preloadScene(scenename: string, callback?: Function) {
        switch (scenename) {
            case "loginScene":
                cc.director.preloadScene(scenename, function (err, scene) {
                    if (err) {
                        return console.error(err);
                    }
                    if (callback) {
                        callback()
                    }
                });
                break;
            case "capitalScene":
            case "mapScene":
                let bundle_name: string = null
                if (scenename === "capitalScene") {
                    bundle_name = 'hall'
                } else if (scenename === "mapScene") {
                    bundle_name = 'map'
                }
                if (bundle_name) {
                    cc.assetManager.loadBundle(bundle_name, (err, bundle) => {
                        if (err) {
                            return console.error(err);
                        }
                        bundle.preloadScene(scenename, function (err, scene_asset) {
                            if (err) {
                                return console.error(err);
                            }
                            if (callback) {
                                callback()
                            }
                        });
                    });
                }
                break;
            default:

        }
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


    //-------------------  以下为图集纹理访问接口 ---------------------------------------

    /**
    * 设置公共commonAtlas中的精灵纹理
    */
    setCommonAtlasSpriteFrame(nodeSpr: cc.Sprite, sprFrame: string) {
        if (!nodeSpr || sprFrame.length === 0) {
            return;
        }
        if (!ROOT_NODE.commonAtlas) {
            cc.resources.load("atlas/com", cc.SpriteAtlas, function (err, spriteAtlas) {
                if (err) {
                    cc.log(err);
                    return;
                }
                ROOT_NODE.commonAtlas = spriteAtlas
                nodeSpr.spriteFrame = ROOT_NODE.commonAtlas.getSpriteFrame(sprFrame);
            }.bind(this));
        } else {
            nodeSpr.spriteFrame = ROOT_NODE.commonAtlas.getSpriteFrame(sprFrame);
        }
    }

    /**
    * 设置道具iconAtlas中的精灵纹理
    */
    setIconAtlasSpriteFrame(nodeSpr: cc.Sprite, sprFrame: string) {
        if (!nodeSpr || sprFrame.length === 0) {
            return;
        }
        if (!ROOT_NODE.iconAtlas) {
            cc.resources.load("atlas/item", cc.SpriteAtlas, function (err, spriteAtlas) {
                if (err) {
                    cc.log(err);
                    return;
                }
                ROOT_NODE.iconAtlas = spriteAtlas
                nodeSpr.spriteFrame = ROOT_NODE.iconAtlas.getSpriteFrame(sprFrame);
            }.bind(this));
        } else {
            nodeSpr.spriteFrame = ROOT_NODE.iconAtlas.getSpriteFrame(sprFrame);
        }
    }

    /**
    * 设置官职officeAtlas中的精灵纹理
    */
    setOfficalAtlasSpriteFrame(nodeSpr: cc.Sprite, sprFrame: string) {
        if (!nodeSpr || sprFrame.length === 0) {
            return;
        }
        if (!ROOT_NODE.officeAtlas) {
            cc.resources.load("atlas/office", cc.SpriteAtlas, function (err, spriteAtlas) {
                if (err) {
                    cc.log(err);
                    return;
                }
                ROOT_NODE.officeAtlas = spriteAtlas
                nodeSpr.spriteFrame = ROOT_NODE.officeAtlas.getSpriteFrame(sprFrame);
            }.bind(this));
        } else {
            nodeSpr.spriteFrame = ROOT_NODE.officeAtlas.getSpriteFrame(sprFrame);
        }
    }

    /**
    * 在AssetBundle中加载图集并初始化精灵纹理
    */
    setBundleSpriteFrameByAtlas(bundlename: string, path: string, sprFrame: string, nodeSpr: cc.Sprite) {
        cc.log("setBundleSpriteFrameByAtlas bundlename = " + bundlename + "; path = " + path + "; sprFrame = " + sprFrame)
        let bundle = cc.assetManager.getBundle(bundlename);
        if (bundle) {
            bundle.load(path, cc.SpriteAtlas, function (err, spriteAtlas) {
                if (err) {
                    cc.log(err);
                    return;
                }
                nodeSpr.spriteFrame = spriteAtlas.getSpriteFrame(sprFrame);
            }.bind(this));
            //一般情况下，load资源之后，要cc.loader.release(globalAsset[item])，
            //json 是一个很奇葩的资源类型…… 需要用 cc.loader.release(url) 才能释放
            //但 如果用了新引擎的bundle，因为界面关闭后，会调用bundle.releaseAll() 因此就不再单独释放bundle.load 的资源了
        }
    }

    /**
    * 在公用目录resources中加载单张图标初始化精灵纹理
    */
    setResSpriteFrameByImg(path: string, sprnode: cc.Node) {
        if (!sprnode || path.length === 0) {
            return;
        }
        cc.resources.load(path, cc.SpriteFrame, function (err, asset: any) {
            if (err) {
                cc.log(err);
                return;
            }
            sprnode.getComponent(cc.Sprite).spriteFrame = asset;
        });
    }

    /**
    * 在AssetBundle中加载单张图标初始化精灵纹理
    */
    setBundleSpriteFrameByImg(bundlename: string, path: string, sprnode: cc.Node) {
        cc.log("setBundleSpriteFrameByImg bundlename = " + bundlename + "; path = " + path)
        let bundle = cc.assetManager.getBundle(bundlename);
        if (bundle) {
            bundle.load(path, cc.SpriteFrame, function (err, asset: any) {
                if (err) {
                    cc.log(err);
                    return;
                }
                sprnode.getComponent(cc.Sprite).spriteFrame = asset;
            });
        }
    }

    /**通过加载Resource图集资源创建序列帧动画，并返回动画节点 */
    createAniNodeByResourceAtlas(path: string, sample: number = 18, wrapMode: cc.WrapMode = cc.WrapMode.Default, parent?: cc.Node, childName?: string) {
        let effNode = new cc.Node;
        effNode.addComponent(cc.Sprite);
        if (childName) {
            effNode.name = childName;
        }

        let ani_name: string = path;
        let idx: number = path.lastIndexOf("/")  //返回指定字符串值最后出现的位置，在一个字符串中的指定位置从后向前搜索。startIndex省略则默认尾字符开始检索
        if (idx >= 0) {  //匹配不到则返回-1。
            ani_name = path.substring(idx)    //用于提取字符串中介于两个指定下标之间的字符。忽略endIndex则返回从startIndex到字符串尾字符
            //ani_name = path.substring(idx)    //可在字符串中抽取从 start 下标开始的指定数目的字符。忽略length则返回从startIndex到字符串尾字符
        }

        let animation: cc.Animation = effNode.addComponent(cc.Animation);
        cc.resources.load(path, cc.SpriteAtlas, function (err, spriteAtlas) {
            if (err) {
                cc.log(err);
                return;
            }
            /* 添加SpriteFrame到frames数组 */
            var clip = cc.AnimationClip.createWithSpriteFrames(spriteAtlas.getSpriteFrames(), sample);
            clip.name = ani_name;
            clip.wrapMode = wrapMode;
            animation.addClip(clip);

            if (wrapMode == cc.WrapMode.Default) {
                animation.on("stop", function () {
                    effNode.removeFromParent(true);
                });
            }

            animation.play(ani_name);

            if (parent) {
                parent.addChild(effNode)
            }

        }.bind(this));

        return effNode;
    }

    /**通过加载Bundle图集资源创建序列帧动画，并返回动画节点 */
    createAniNodeByBundleAtlas(bundlename: string, path: string, sample: number = 18, wrapMode: cc.WrapMode = cc.WrapMode.Default, parent?: cc.Node, childName?: string) {
        cc.log("createAniNodeByBundleAtlas bundlename = " + bundlename + "; path = " + path)
        let bundle = cc.assetManager.getBundle(bundlename);
        if (!bundle) {
            return;
        }

        let effNode = new cc.Node;
        effNode.addComponent(cc.Sprite);
        if (childName) {
            effNode.name = childName;
        }

        let ani_name: string = path;
        let idx: number = path.lastIndexOf("/")  //返回指定字符串值最后出现的位置，在一个字符串中的指定位置从后向前搜索。startIndex省略则默认尾字符开始检索
        if (idx >= 0) {  //匹配不到则返回-1。
            ani_name = path.substring(idx)    //用于提取字符串中介于两个指定下标之间的字符。忽略endIndex则返回从startIndex到字符串尾字符
            //ani_name = path.substring(idx)    //可在字符串中抽取从 start 下标开始的指定数目的字符。忽略length则返回从startIndex到字符串尾字符
        }

        let animation: cc.Animation = effNode.addComponent(cc.Animation);
        bundle.load(path, cc.SpriteAtlas, function (err, spriteAtlas) {
            if (err) {
                cc.log(err);
                return;
            }
            /* 添加SpriteFrame到frames数组 */
            var clip = cc.AnimationClip.createWithSpriteFrames(spriteAtlas.getSpriteFrames(), sample);
            clip.name = ani_name;
            clip.wrapMode = wrapMode;
            animation.addClip(clip);

            if (wrapMode == cc.WrapMode.Default) {
                animation.on("stop", function () {
                    effNode.removeFromParent(true);
                });
            }

            animation.play(ani_name);

            if (parent) {
                parent.addChild(effNode)
            }

        }.bind(this));

        return effNode;
    }


    //-------------------  以下为各种界面展示接口 ---------------------------------------

    /**
     * 显示AssetBundle中的子界面
     * @param bundlename 名称 
     * @param prefab_path 预制体路径 
     * @param parent 父节点 
     * @param callback 完成回调 
     */
    showBundleLayer(bundlename: string, prefab_path: string, parent?: cc.Node, callback?: Function) {
        cc.log("showBundleLayer bundlename = " + bundlename + "; prefab_path = " + prefab_path)
        let bundle1 = cc.assetManager.getBundle(bundlename);
        if (bundle1) {
            bundle1.load(prefab_path, cc.Prefab, function (err, prefab: any) {
                if (err) {
                    return console.error(err);
                }
                let layer = LoaderMgr.showLayer(prefab, parent)
                if (callback && layer) {
                    callback(layer)
                }
            });
        } else {
            cc.assetManager.loadBundle(bundlename, (err, bundle) => {
                if (err) {
                    return console.error(err);
                }
                bundle.load(prefab_path, cc.Prefab, function (err, prefab: any) {
                    if (err) {
                        return console.error(err);
                    }
                    let layer = LoaderMgr.showLayer(prefab, parent)
                    if (callback && layer) {
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
        if (parent) {
            layer = parent.getChildByName(prefab.name);
        } else {
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
            if (!maskBg_tsComp) {
                maskBg_tsComp = parent.addComponent(ComMaskBg)
            }
            scene.addChild(parent)
        }

        layer = cc.instantiate(prefab);
        layer.name = prefab.name;
        layer.setPosition(cc.v2(0, 0));
        if (maskBg_tsComp) {
            //当node的active发生变化时触发，但是目前这个事件 并没有在 Node.EventType 里定义
            layer.on('active-in-hierarchy-changed', () => {
                cc.log("active-in-hierarchy-changed prefab.name = " + prefab.name)
                //销毁节点并不会立刻发生，而是在当前 帧逻辑更新结束后，统一执行。当一个节点销毁后，该节点就处于无效状态，可以通过 cc.isValid 判断 当前节点是否已经被销毁。
                if (!cc.isValid(layer) || layer.active != true) {  //注意发现子节点destroy之后active=false,但是'active-in-hierarchy-changed'监听时并未销毁，而是在之后销毁
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
        cc.log("showGoldAddDialog")
        if (!ROOT_NODE.pfGoldAdd) {
            cc.resources.load("ui/comui/goldAdd", cc.Prefab, function (err, prefab: any) {
                if (err) {
                    return console.error(err);
                }
                ROOT_NODE.pfGoldAdd = prefab;
                let layer = LoaderMgr.showLayer(ROOT_NODE.pfGoldAdd)
                if (layer) {
                    let tsComp = layer.getComponent(GoldAdd)
                    if (!tsComp) {
                        tsComp = layer.addComponent(GoldAdd)
                    }
                }
            });
        } else {
            let layer = this.showLayer(ROOT_NODE.pfGoldAdd);
            if (layer) {
                let tsComp = layer.getComponent(GoldAdd)
                if (!tsComp) {
                    tsComp = layer.addComponent(GoldAdd)
                }
            }
        }
    }

    /** 
    * 通用提示框
    */
    showTipsDialog(tipStr: string, okCallback?: Function, cancelCall?: Function) {
        cc.log("showTipsDialog")
        if (!ROOT_NODE.pfTipsDialog) {
            cc.resources.load("ui/comui/tipsDialog", cc.Prefab, function (err, prefab: any) {
                if (err) {
                    return console.error(err);
                }
                ROOT_NODE.pfTipsDialog = prefab
                let layer = LoaderMgr.showLayer(ROOT_NODE.pfTipsDialog);
                if (layer) {
                    let tsComp = layer.getComponent(TipsDialog)
                    if (!tsComp) {
                        tsComp = layer.addComponent(TipsDialog)
                    }
                    tsComp.setTipStr(tipStr, okCallback, cancelCall);
                }
            });
        } else {
            let layer = this.showLayer(ROOT_NODE.pfTipsDialog);
            if (layer) {
                let tsComp = layer.getComponent(TipsDialog)
                if (!tsComp) {
                    tsComp = layer.addComponent(TipsDialog)
                }
                tsComp.setTipStr(tipStr, okCallback, cancelCall);
            }
        }
    }

    /** 
    * 显示通用奖励提示框
    */
    showRewardLayer(rewards: any, title?: string, callback?: Function) {
        cc.log("LoaderMgr.showRewardLayer rewards = " + JSON.stringify(rewards))
        if (!ROOT_NODE.pfReward) {
            cc.resources.load("ui/comui/rewardLayer", cc.Prefab, function (err, prefab: any) {
                if (err) {
                    return console.error(err);
                }
                ROOT_NODE.pfReward = prefab
                let layer = LoaderMgr.showLayer(ROOT_NODE.pfReward);
                if (layer) {
                    let tsComp = layer.getComponent(RewardLayer)
                    if (!tsComp) {
                        tsComp = layer.addComponent(RewardLayer)
                    }
                    tsComp.showRewardList(rewards, title, callback);
                }
            });
        } else {
            let layer = this.showLayer(ROOT_NODE.pfReward);
            if (layer) {
                let tsComp = layer.getComponent(RewardLayer)
                if (!tsComp) {
                    tsComp = layer.addComponent(RewardLayer)
                }
                tsComp.showRewardList(rewards, title, callback);
            }
        }
    }


    /** 
    * 显示通用引导层
    */
    showGuideLayer(callback: Function) {
        cc.log("showGuideLayer")
        if (!ROOT_NODE.guidePrefab) {
            cc.resources.load("ui/comui/guideLayer", cc.Prefab, function (err, prefab: any) {
                if (err) {
                    return console.error(err);
                }
                ROOT_NODE.guidePrefab = prefab
                let layer = LoaderMgr.showLayer(ROOT_NODE.guidePrefab);
                if (layer && callback) {
                    callback(layer);
                }
                return layer
            });
        } else {
            let layer = this.showLayer(ROOT_NODE.guidePrefab);
            if (layer && callback) {
                callback(layer);
            }
            return layer
        }
    }

    /** 
    * 一级界面上的金币钻石粮草公用控件
    */
    showComTopNode(parent: cc.Node, pos: cc.Vec2, zIndex: number = 10) {
        if (!ROOT_NODE.pfComTop) {
            cc.resources.load("ui/comnode/comTop", cc.Prefab, function (err, prefab: any) {
                if (err) {
                    return console.error(err);
                }
                ROOT_NODE.pfComTop = prefab
                let topCom = cc.instantiate(ROOT_NODE.pfComTop);
                topCom.setPosition(pos);
                parent.addChild(topCom, zIndex);
                let tsComp = topCom.getComponent(ComTop)
                if (!tsComp) {
                    tsComp = topCom.addComponent(ComTop)
                }
            });
        } else {
            let topCom = cc.instantiate(ROOT_NODE.pfComTop);
            topCom.setPosition(pos);
            parent.addChild(topCom, zIndex);
            let tsComp = topCom.getComponent(ComTop)
            if (!tsComp) {
                tsComp = topCom.addComponent(ComTop)
            }
        }
    }

}

export var LoaderMgr = new LoaderManager();
