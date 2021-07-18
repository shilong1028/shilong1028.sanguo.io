const TransitionMaterials = require('transition-materials');

let Transitions = cc.Class({
    extends: cc.Component,

    //editor常常结合requireComponent参数使用，主要用来指定当前组件的依赖组件。
    editor: {
        inspector: typeof Editor !== 'undefined' && Editor.url(' db://assets/resources/transitions/editor/transitions-inspector.js')
    },

    properties: {
        _material: {
            default: null,
            type: cc.Material
        },

        material: {
            get() {
                return this._material;
            },
            set(v) {
                this._material = v;
                this.updateSpriteMaterial();
            },
            type: cc.Material,
            readonly: true
        },

        transitionTime: 2
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (!cc.game.isPersistRootNode(this.node)) {
            cc.game.addPersistRootNode(this.node);
        }
    },

    start() {
        this.init();
    },

    init() {
        if (this._inited) return;
        this._inited = true;

        this.time = 0;

        this._texture1 = this.createTexture();
        this._texture2 = this.createTexture();

        let spriteNode = cc.find('TRANSITION_SPRITE', this.node);
        if (!spriteNode) {
            spriteNode = new cc.Node('TRANSITION_SPRITE');
            this._sprite = spriteNode.addComponent(cc.Sprite);
            spriteNode.parent = this.node;
        }
        else {
            this._sprite = spriteNode.getComponent(cc.Sprite);
        }
        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(this._texture1);
        this._sprite.spriteFrame = spriteFrame;

        spriteNode.active = false;
        spriteNode.scaleY = -1;
        this._spriteNode = spriteNode;

        let cameraNode = cc.find('TRANSITION_CAMERA', this.node);
        if (!cameraNode) {
            cameraNode = new cc.Node('TRANSITION_CAMERA');
            this._camera = cameraNode.addComponent(cc.Camera);
            cameraNode.parent = this.node;
        }
        else {
            this._camera = cameraNode.getComponent(cc.Camera);
        }
        cameraNode.active = false;
        this._cameraNode = cameraNode;

        this.node.groupIndex = cc.Node.BuiltinGroupIndex.DEBUG - 1;
        this._camera.cullingMask = 1 << this.node.groupIndex;

        this.updateSpriteMaterial();
    },

    updateSpriteMaterial() {
        if (!this._sprite) return;

        let newMaterial = cc.MaterialVariant.create(this._material);
        if (!this.material) {
            cc.log("updateSpriteMaterial this._material is null")
        } else {
            newMaterial.setProperty('texture2', this._texture2);
            newMaterial.setProperty('ratio', this._texture2.width / this._texture2.height);

            switch (this.material.name) {
                case "strip-lb":
                case "strip-lt":
                case "strip-rb":
                case "strip-rt":
                case "window-slice":
                    //Creator 2.4.5版本 newMaterial.setProperty('screenSize' 会报错
                    newMaterial.setProperty('screenSize', new Float32Array([this._texture2.width, this._texture2.height]));
                    break;
                default:
            }
        }

        this._sprite.setMaterial(0, newMaterial);
        this._spriteMaterial = newMaterial;
    },

    //更新过渡样式
    updatetransitionMaterial(material_name) {
        switch (material_name) {
            case "strip-lb":
            case "strip-lt":
            case "strip-rb":
            case "strip-rt":
            case "window-slice":
                return;   //因为Creator 2.4.5版本 newMaterial.setProperty('screenSize' 会报错
            default:
        }
        if (typeof material_name === 'string') {
            if (this.material && this.material.name === material_name) {
                return;
            }
            for (let i = 0; i < TransitionMaterials.length; ++i) {
                let material = TransitionMaterials[i];
                if (material.name === material_name) {
                    this.material = material;
                    break;
                }
            }
        }
    },

    createTexture() {
        let texture = new cc.RenderTexture();
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, cc.gfx.RB_FMT_D24S8);
        return texture;
    },

    _transitionScene(sceneName, fromCameraPath, toCameraPath, onSceneLoaded, onTransitionFinished) {
        //cc.log("js _transitionScene sceneName = "+sceneName)
        this.init();

        this._spriteNode.active = true;
        this._cameraNode.active = true;

        let fromCamera = cc.find(fromCameraPath);
        fromCamera = fromCamera && fromCamera.getComponent(cc.Camera);
        if (!fromCamera) {
            cc.warn(`Can not find fromCamera with path ${fromCameraPath}`);
            return;
        }
        let originTargetTexture1 = fromCamera.targetTexture;
        fromCamera.cullingMask &= ~this._camera.cullingMask;
        fromCamera.targetTexture = this._texture1;
        fromCamera.render(cc.director.getScene());
        fromCamera.targetTexture = originTargetTexture1;

        let LoaderMgr = window["loaderMgr"];
        if (!LoaderMgr) {
            cc.log("js 调用 ts LoaderMgr 导入失败")
        }
        //return cc.director.loadScene(sceneUrl, () => {
        return LoaderMgr.loadScene(sceneName, false, (loader_callback) => {
            onSceneLoaded && onSceneLoaded();

            let toCamera = cc.find(toCameraPath);
            toCamera = toCamera && toCamera.getComponent(cc.Camera);
            if (!toCamera) {
                cc.warn(`Can not find toCamera with path ${toCameraPath}`);
                return;
            }
            toCamera.cullingMask &= ~this._camera.cullingMask;
            let originTargetTexture2 = toCamera.targetTexture;
            toCamera.targetTexture = this._texture2;
            toCamera.render(cc.director.getScene());

            this._camera.depth = toCamera.depth;
            this._camera.clearFlags = toCamera.clearFlags;

            this._onLoadFinished = () => {
                toCamera.targetTexture = originTargetTexture2;

                this._spriteNode.active = false;
                this._cameraNode.active = false;

                onTransitionFinished && onTransitionFinished();

                loader_callback && loader_callback(cc.director.getScene());   //loaderManager绑定脚本的回调
            }

            this.time = 0;
            this.loading = true;
        });
    },

    //过渡场景
    transitionScene(sceneName, fromCameraPath, toCameraPath, cb) {
        let LoaderMgr = window["loaderMgr"];
        if (!LoaderMgr) {
            cc.log("js 调用 ts LoaderMgr 导入失败")
            return false;
        }
        this.scheduleOnce(() => {
            //cc.log("js transitionScene sceneName = "+sceneName)
            //cc.director.preloadScene(sceneUrl, null, () => {
            LoaderMgr.preloadScene(sceneName, () => {
                return this._transitionScene(sceneName, fromCameraPath, toCameraPath, cb);
            })
        })

        return true;
    },

    //过渡节点
    transitionNode(fromCamera, fromRootNode, toCamera, toRootNode, onTransitionFinished) {
        this.init();

        this._spriteNode.active = true;
        this._cameraNode.active = true;

        // from 
        fromCamera = fromCamera && fromCamera.getComponent(cc.Camera);
        if (!fromCamera) {
            cc.warn(`Can not find fromCamera with path ${fromCameraPath}`);
            return;
        }
        let originTargetTexture1 = fromCamera.targetTexture;
        fromCamera.cullingMask &= ~this._camera.cullingMask;
        fromCamera.targetTexture = this._texture1;
        fromCamera.node.active = true;
        fromRootNode.active = true;
        fromCamera.render(fromRootNode);
        fromRootNode.active = false;
        fromCamera.node.active = false;
        fromCamera.targetTexture = originTargetTexture1;

        // to
        toCamera = toCamera && toCamera.getComponent(cc.Camera);
        if (!toCamera) {
            cc.warn(`Can not find toCamera with path ${toCameraPath}`);
            return;
        }
        toCamera.cullingMask &= ~this._camera.cullingMask;
        let originTargetTexture2 = toCamera.targetTexture;
        toCamera.node.active = true;
        toCamera.targetTexture = this._texture2;
        toRootNode.active = true;
        toCamera.render(toRootNode);
        toRootNode.active = false;
        toCamera.node.active = false;

        this._camera.depth = toCamera.depth;
        this._camera.clearFlags = toCamera.clearFlags;

        this._onLoadFinished = () => {
            toRootNode.active = true;
            toCamera.node.active = true;
            toCamera.targetTexture = originTargetTexture2;

            this._spriteNode.active = false;
            this._cameraNode.active = false;

            onTransitionFinished && onTransitionFinished();
        }

        this.time = 0;
        this.loading = true;
        this._spriteMaterial.setProperty('time', 0);
    },

    update(dt) {
        if (this.loading) {
            this.time += dt;
            if (this.time >= this.transitionTime) {
                this.time = this.transitionTime;
                this.loading = false;

                this._onLoadFinished && this._onLoadFinished();
                this._onLoadFinished = null;
            }
            this._spriteMaterial.setProperty('time', this.time / this.transitionTime);
        }
    },
});
